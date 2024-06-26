import { flag } from "../../../../lib/global.js";
import { message } from "../../../../lib/source/message.js";
import { llspec, load_spec } from "../../../../lib/source/parser/lsl/llspec.js";
import { eval_exp_type, parsing, validate_scope } from "../../../../lib/source/parser/lsl/parsing.js";
import { convert_to_lsl } from "../../../../lib/source/parser/lsl/translate.js";
import { src } from "../../../../lib/source/source.js";
import { tokens } from "../../../../lib/source/tokens.js";
import { reset_index, string } from "../../../../lib/text/string.js";
import { script } from "../../../../lib/source/parser/lsl/script.js";
import { test_tokens } from "../../../test.js";
import { expr } from "../../../../lib/source/expressions.js";


const parse_snippet = async (str, file = "main.lsl") => {
    const t = new tokens(str, file);
    t.remove_comments();
    await convert_to_lsl(t);
    //console.log(t.str);
    await parsing(t);
    return t;
};

describe(`parsing`, () => {

    beforeAll(async () => {
        await load_spec(`../../../../lib/source/parser/lsl/lsl_data.json`);
    });

    beforeEach(async () => { });

    afterEach(async () => {
        reset_index();
        src.clear();
        message.print();
        message.clear();
    });

    describe(`validate_scope`, () => {
        it("should return true for matching delimiters", () => {
            const toks0 = new tokens(`()`, `main.lsl`);
            expect(validate_scope(toks0)).toBe(true);
        });

        it("should handle mismatched delimiters", () => {
            const toks0 = new tokens(`(}`, `main.lsl`);
            validate_scope(toks0);

            expect(message.length()).toBe(1);
            expect(message.at(0).str()).toBe(`Syntax error: Mismatched delimiters, missing  ) #file "main.lsl":1:1`);
            message.clear();
        });

        it("should handle trailing delimiters", () => {
            const toks0 = new tokens(`(()`, `main.lsl`);

            validate_scope(toks0);
            expect(message.length()).toBe(1);
            expect(message.at(0).str()).toBe(`Syntax error: Unexpected EOF. #file "main.lsl":1:2`);
            message.clear();
        });

        it("should handle unexpected EOF", () => {
            const toks0 = new tokens(`(`, `main.lsl`);

            validate_scope(toks0);
            expect(message.length()).toBe(1);
            expect(message.at(0).str()).toBe(`Syntax error: Unexpected EOF. #file "main.lsl":1`);
            message.clear();
        });

        it("should ignore non-symbol tokens", () => {
            const toks0 = new tokens(`(a)`, `main.lsl`);
            expect(validate_scope(toks0)).toBe(true);
        });

        it("should handle nested delimiters correctly", () => {
            const toks0 = new tokens(`({})`, `main.lsl`);
            expect(validate_scope(toks0)).toBe(true);
        });

        //https://jeffreykegler.github.io/Ocean-of-Awareness-blog/individual/2014/11/delimiter.html
        it(`mismatched_delimiters_0`, async () => {
            const toks0 = new tokens(`x((([))`, `main.lsl`);
            await parsing(toks0);

            expect(message.length()).toBe(1);
            expect(message.at(0).str()).toBe(`Syntax error: Mismatched delimiters, missing  ] #file "main.lsl":1:5`);
            message.clear();
        });

        it(`mismatched_delimiters_1`, async () => {
            const toks0 = new tokens(`x[({({x[]x{}x()x)})]`, `main.lsl`);
            await parsing(toks0);

            expect(message.length()).toBe(1);
            expect(message.at(0).str()).toBe(`Syntax error: Mismatched delimiters, missing  } #file "main.lsl":1:16`);
            message.clear();
        });

        it(`mismatched_delimiters_2`, async () => {
            const toks0 = new tokens(`x({]-[(}-[{)`, `main.lsl`);
            await parsing(toks0);

            expect(message.length()).toBe(1);
            expect(message.at(0).str()).toBe(`Syntax error: Mismatched delimiters, missing  } #file "main.lsl":1:3`);
            message.clear();
        });
    });

    /*
        it('parsing_000', async () => {
            for (let i = 0, len = llspec.type.length; i < len; ++i) {
                const toks1 = await parse_snippet(`${llspec.type[i]} ${string.uid()};`);
    
                expect(message.length()).toBe(0);
                expect(toks1.front.flag & flag.TYPE_FLAG).toBe(flag.TYPE_FLAG);
            }
        });
        
        it('parsing_001', async () => {
            for (const ff of Object.keys(llspec.functions)) {
                const toks = await parse_snippet(`${ff}()`);
                expect(message.length()).toBe(0);
                expect(toks.front.flag & flag.DEF_FUNC_FLAG).toBe(flag.DEF_FUNC_FLAG);
            }
        });
    
        it('parsing_002', async () => {
            let ev = Object.keys(llspec.events);
            for (let i = 0, len = ev.length; i < len; ++i) {
                let obj = llspec.events[ev[i]];
    
                let args = [];
                for (let it = 0; it < obj.arg_numb; ++it) {
                    args = [...args, `${obj[`arg_${it}`].type} ${obj[`arg_${it}`].name}`];
                }
    
                let ev_str = `${ev[i]}(${args.join(`, `)}){}`;
                //console.log(ev_str);
    
                const toks0 = await parsing(new tokens(ev_str));
                expect(message.length()).toBe(0);
                expect(toks0.front.flag & EVENT_FLAG).toBe(EVENT_FLAG);
            }
        });
    
        //it('parsing_03', async () => {
        //    for (let i = 0, len = llspec.controls.length; i < len; ++i) {
    
        //        let name = llspec.controls[i];
        //        if (name == `state`) name += ` a{}`;
    
        //        if (name != `jump`) {
        //            const toks0 = await parsing(new tokens(name));
        //            expect(message.length()).toBe(0);
        //            expect(toks0.front.flag & flag.CONTROL_FLAG).toBe(flag.CONTROL_FLAG);
        //            message.print();
        //            message.clear();
        //        }
    
        //    }
        //});
        
        //it('parsing_04', async () => {
        //    for (let i = 0, len = llspec.controls.length; i < len; ++i) {
        //        const toks0 = await parsing(new tokens(llspec.controls[i]));
        //        expect(message.length()).toBe(0);
        //        expect(toks0.front.flag & flag.CONTROL_FLAG).toBe(flag.CONTROL_FLAG);
        //        message.print();
        //    }
        //    message.clear();
        //});
        */
    it('parsing_005', async () => {
        const toks0 = await parse_snippet(`state a{}`);
        expect(message.length()).toBe(0);
        expect(toks0.front.flag & flag.CONTROL_FLAG).toBe(flag.CONTROL_FLAG);

        const toks1 = await parse_snippet(new tokens(`default{}`));
        expect(message.length()).toBe(0);
        expect(toks1.front.flag & flag.CONTROL_FLAG).toBe(flag.CONTROL_FLAG);
    });

    it('parsing_006', async () => {
        const toks1 = await parse_snippet(`func(){};`);

        expect(message.length()).toBe(0);
        expect(toks1.front.flag & flag.USER_FUNC_FLAG).toBe(flag.USER_FUNC_FLAG);
    });

    it('parsing_007', async () => { // flag.VARIABLE_FLAG
        for (let i = 0, len = llspec.type.length; i < len; ++i) {
            const toks1 = await parse_snippet(`${llspec.type[i]} a;`);
            expect(message.length()).toBe(0);
            expect(toks1.back.prev.flag & flag.VARIABLE_FLAG).toBe(flag.VARIABLE_FLAG);
        }
    });

    it('parsing_008', async () => {
        const toks1 = await parse_snippet(`state a {}`);
        expect(message.length()).toBe(0);
        expect(toks1.front.next.flag & flag.STATE_NAME_FLAG).toBe(flag.STATE_NAME_FLAG);
    });

    it('parsing_009', async () => {
        const toks1 = await parse_snippet(`<1<4,0,3>llAbs(3>5)>`);
        expect(message.length()).toBe(0);

        for (let tok = toks1.front.next; tok && !tok.is(toks1.back); tok = tok.next) {
            expect(tok.flag & (flag.VECTOR_OP_FLAG | flag.VECTOR_CL_FLAG)).toBe(0);
        }

        expect(toks1.front.flag & flag.VECTOR_OP_FLAG).toBe(flag.VECTOR_OP_FLAG);
        expect(toks1.back.flag & flag.VECTOR_CL_FLAG).toBe(flag.VECTOR_CL_FLAG);
    });

    it('parsing_010', async () => {
        const toks1 = await parse_snippet(`<1<4,0,0,3>llAcos(3>5)>`);
        expect(message.length()).toBe(0);
        expect(toks1.front.flag & flag.QUAT_OP_FLAG).toBe(flag.QUAT_OP_FLAG);
        expect(toks1.back.flag & flag.QUAT_CL_FLAG).toBe(flag.QUAT_CL_FLAG);
    });

    it('parsing_011', async () => {
        const toks1 = await parse_snippet(`[llList2Key([3], 0)]`);
        expect(message.length()).toBe(0);
        expect(toks1.front.flag & flag.LIST_OP_FLAG).toBe(flag.LIST_OP_FLAG);
        expect(toks1.back.flag & flag.LIST_CL_FLAG).toBe(flag.LIST_CL_FLAG);
    });

    it(`parsing_012`, async () => {
        const toks1 = await parse_snippet(`x(){\nreturn;\n}`);
        expect(message.length()).toBe(0);
        expect(toks1.front.flag & flag.USER_FUNC_FLAG).toBe(flag.USER_FUNC_FLAG);
    });

    it(`parsing_013`, async () => {
        const toks1 = await parse_snippet(`034`);
        expect(message.length()).toBe(0);
        expect(toks1.front.str).toBe(`28`);
    });

    it(`parsing_014`, async () => {
        const toks1 = await parse_snippet(`0xff`);
        expect(message.length()).toBe(0);
        expect(toks1.front.str).toBe(`0xFF`);
    });

    it(`parsing_015`, async () => {
        const toks1 = await parse_snippet(`0b101'011`);
        expect(message.length()).toBe(0);
        expect(toks1.front.str).toBe(`43`);
    });

    it(`parsing_016`, async () => {
        const toks1 = await parse_snippet(`integer a = -3;`);
        expect(message.length()).toBe(0);
        test_tokens(toks1, [`integer`, `a`, `=`, `-3`, `;`]);
    });

    it(`parsing_017`, async () => {
        const toks1 = await parse_snippet(`x(){2-4;}`);
        expect(message.length()).toBe(0);
        test_tokens(toks1, [`x`, `(`, `)`, `{`, `2`, `-`, `4`, `;`, `}`]);
    });

    it(`parsing_018`, async () => {
        const toks1 = await parse_snippet(`float a;x(){a-4;}`);
        expect(message.length()).toBe(0);
        test_tokens(toks1, [`float`, `a`, `;`, `x`, `(`, `)`, `{`, `a`, `-`, `4`, `;`, `}`]);
    });

    it(`parsing_019`, async () => {
        const toks1 = await parse_snippet(`(string)-.5e-6`);
        expect(message.length()).toBe(0);
        test_tokens(toks1, [`(string)`, `-.5e-6`]);
    });

    it(`parsing_020`, async () => {
        const toks1 = await parse_snippet(`llList2List([1,2,3,4], -9, -5)`);
        expect(message.length()).toBe(0);
        test_tokens(toks1, [`llList2List`, `(`, `[`, `1`, `,`, `2`, `,`, `3`, `,`, `4`, `]`, `,`, `-9`, `,`, `-5`, `)`]);
    });

    it(`parsing_021`, async () => {
        const toks1 = await parse_snippet(`1.4f`);
        expect(message.length()).toBe(0);
        test_tokens(toks1, [`1.4`]);
    });

    it(`parsing_022`, async () => {
        const toks1 = await parse_snippet(`-~1;`);
        expect(message.length()).toBe(0);
        test_tokens(toks1, [`-`, `~`, `1`, `;`]);
    });

    it(`parsing_023`, async () => {
        const toks1 = await parse_snippet(`~-1;`);
        expect(message.length()).toBe(0);
        test_tokens(toks1, [`~`, `-1`, `;`]);
    });

    it(`parsing_024`, async () => {
        const toks1 = await parse_snippet(`x(){@a;}`);
        expect(message.length()).toBe(0);
        test_tokens(toks1, [`x`, `(`, `)`, `{`, `@`, `a`, `;`, `}`]);
        expect(toks1.find_str(`@`).flag & flag.OPERATOR_FLAG).toBe(flag.OPERATOR_FLAG);
    });

    it(`parsing_025`, async () => {
        const toks1 = await parse_snippet(`x(){while(1){break;}}`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`x(){while(1){ jump _ ; } @_; }`);
    });

    it(`parsing_026`, async () => {
        const toks1 = await parse_snippet(`x(){while(1){if(1)break;}}`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`x(){while(1){if(1) jump _ ; } @_; }`);
    });

    it(`parsing_027`, async () => {
        const toks1 = await parse_snippet(`x(){do{break;}while(1);}`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`x(){do{ jump _ ;}while(1) ; @_; }`);
    });

    it(`parsing_028`, async () => {
        const toks1 = await parse_snippet(`x(){for(;;){break;}}`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`x(){for(;;){ jump _ ; } @_; }`);
    });

    it(`parsing_029`, async () => {
        const toks1 = await parse_snippet(`x(){for(;;){break;for(;;){break;}}}`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`x(){for(;;){ jump _ ;for(;;){ jump a ; } @a; } @ _ ; }`);

    });

    it(`parsing_030`, async () => {
        const toks1 = await parse_snippet(`(string)llAbs(1<3) + "a"`);
        expect(string.simplify(toks1.str)).toBe(`(string)llAbs(1<3) + "a"`);
    });

    it(`parsing_031`, async () => {
        const toks1 = await parse_snippet(`if(1){integer a;if(0)a=0;}`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`if(1){integer a;if(0)a=0;}`);
    });

    it(`parsing_032`, async () => {
        const toks1 = await parse_snippet(`if(1){;}else if(2){integer a;if(0)a=0;}`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`if(1){;}else if(2){integer a;if(0)a=0;}`);
    });

    it(`parsing_033`, async () => {
        const toks1 = await parse_snippet(`default{timer(){;}}state b{timer(){state default;}}`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`default{timer(){;}}state b{timer(){state default;}}`);
    });

    it(`parsing_034`, async () => {
        const toks1 = await parse_snippet(`key id;if(0){if(0){;}}string DName=llGetUsername(id);`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`key id;if(0){if(0){;}}string DName=llGetUsername(id);`);
    });

    it(`parsing_035`, async () => {
        const toks1 = await parse_snippet(`default{timer(){if(0){string a;}if(0){string a;}}}`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`default{timer(){if(0){string a;}if(0){string a;}}}`);
    });

    it(`parsing_036`, async () => {
        const toks1 = await parse_snippet(`integer a;list p;if(a<0)a=(llGetListLength(p)-1);`);
        expect(message.length()).toBe(0);
        test_tokens(toks1, [`integer`, `a`, `;`, `list`, `p`, `;`, `if`, `(`, `a`, `<`, `0`, `)`, `a`, `=`, `(`, `llGetListLength`, `(`, `p`, `)`, `-`, `1`, `)`, `;`]);
    });

    it(`parsing_037`, async () => {
        const toks1 = await parse_snippet(`if (llListFindList([1], [1]) == -1){;}`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`if (llListFindList([1], [1]) == -1){;}`);
    });

    it(`parsing_038`, async () => {
        const toks1 = await parse_snippet(`x(){if(1);else return;}`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`x(){if(1);else return;}`);
    });

    it(`parsing_039`, async () => {
        const toks1 = await parse_snippet(`vector d=<-1000.,-1000.,-1000.>;`);
        expect(message.length()).toBe(0);
        //expect(string.simplify(toks1.str)).toBe(`vector gOffScreen = <-1000., -1000., -1000.>;`);
        test_tokens(toks1, [`vector`, `d`, `=`, `<`, `-1000.`, `,`, `-1000.`, `,`, `-1000.`, `>`, `;`]);
    });

    it(`parsing_040`, async () => {
        const toks1 = await parse_snippet(`vector x(){return <1,1,1>;}`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`vector x(){return <1,1,1>;}`);
        test_tokens(toks1, [`vector`, `x`, `(`, `)`, `{`, `return`, `<`, `1`, `,`, `1`, `,`, `1`, `>`, `;`, `}`]);
    });

    it(`parsing_041`, async () => {
        const toks1 = await parse_snippet(`vector x; x = <-x.y, x.z, x.x>;`);
        expect(message.length()).toBe(0);

        expect(toks1.find_str(`.`).prev.flag).toBe((flag.NAME_FLAG | flag.VARIABLE_FLAG));

        expect(toks1.find_str(`.`).flag).toBe(flag.SYMBOL_FLAG);
        expect(toks1.find_str(`<`).flag).toBe(flag.SYMBOL_FLAG | flag.VECTOR_OP_FLAG | flag.DEL_FLAG);
        expect(toks1.find_str(`>`).flag).toBe(flag.SYMBOL_FLAG | flag.VECTOR_CL_FLAG | flag.DEL_FLAG);

        expect(string.simplify(toks1.str)).toBe(`vector x; x = <-x.y, x.z, x.x>;`);
        test_tokens(toks1, [`vector`, `x`, `;`, `x`, `=`, `<`, `-`, `x`, `.`, `y`, `,`, `x`, `.`, `z`, `,`, `x`, `.`, `x`, `>`, `;`]);
    });

    it(`parsing_042`, async () => {
        const toks1 = await parse_snippet(`x(){for(;;){ jump _ ; @_; }}`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`x(){for(;;){ jump _ ; @_; }}`);
    });

    it(`parsing_043`, async () => {
        const toks1 = await parse_snippet(`x(){for(;;){continue;}}`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`x(){for(;;){ jump _ ; @_; } }`);
    });

    it(`parsing_044`, async () => {
        const toks1 = await parse_snippet(`list a;x(){while(1){a;continue;a;}}`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`list a;x(){while(1){a; jump _ ;a; @_; } }`);
    });

    it(`parsing_045`, async () => {
        const toks1 = await parse_snippet(`list a;x(){do{a;continue;a;}while(1);}`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`list a;x(){do{a; jump _ ;a; @_; } while ( 1 ) ; }`);
    });

    it(`parsing_046`, async () => {
        const toks1 = await parse_snippet(`string s1 = R"foo(
            Hello
              World
            )foo";`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`string s1 = "\\n Hello\\n World\\n " ;`);
    });

    it(`parsing_047`, async () => {
        const toks1 = await parse_snippet(`string s1 = "[9,\"<1,1,1>\",false,{\"A\":8,\"Z\":9}]";`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`string s1 = "[9,"<1,1,1>",false,{"A":8,"Z":9}]";`);
    });

    it(`parsing_048`, async () => {
        const toks1 = await parse_snippet(`string s1 = R"-([9, "<1,1,1>", false, {"A":8, "Z":9}])-";`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`string s1 = "[9, \\"<1,1,1>\\", false, {\\"A\\":8, \\"Z\\":9}]" ;`);
    });

    it(`parsing_049`, async () => {
        const toks1 = await parse_snippet(`string s1 = R"-({"act":true, "coor":["x":1, "y":2 ,"z":3]})-";`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`string s1 = "{\\"act\\":true, \\"coor\\":[\\"x\\":1, \\"y\\":2 ,\\"z\\":3]}" ;`);
    });

    it(`parsing_050`, async () => {
        const toks1 = await parse_snippet(`string k = llJsonGetValue(R"-({"act":true, "coor":["x":1, "y":2 ,"z":3]})-",["coor","x"]) ;`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`string k = llJsonGetValue("{\\"act\\":true, \\"coor\\":[\\"x\\":1, \\"y\\":2 ,\\"z\\":3]}" ,["coor","x"]) ;`);
    });

    it(`parsing_051`, async () => {
        const toks1 = await parse_snippet(`string k = "[" R"-("act":true)-" "," R"-("coor":["x":1, "y":2, "z":3])-" "]" ;`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`string k = "[\\"act\\":true,\\"coor\\":[\\"x\\":1, \\"y\\":2, \\"z\\":3]]" ;`);
    });

    it(`parsing_052`, async () => {
        const toks1 = await parse_snippet(`2 * -2`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`2 * -2`);
    });

    it(`parsing_053`, async () => {
        const toks1 = await parse_snippet(`integer link = !!llGetLinkNumber();`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`integer link = !!llGetLinkNumber();`);
    });

    it(`parsing_054`, async () => {
        const toks1 = await parse_snippet(`float b;vector a = <llRound(a.x), llRound(a.y), llRound(a.z) - (b * 0.5)>;`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`float b;vector a = <llRound(a.x), llRound(a.y), llRound(a.z) - (b * 0.5 )>;`);
    });

    it(`parsing_055`, async () => {
        const toks1 = await parse_snippet(`[1]`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`[1]`);
        expect(toks1.front.flag & flag.LIST_OP_FLAG).toBe(flag.LIST_OP_FLAG);
        expect(toks1.back.flag & flag.LIST_CL_FLAG).toBe(flag.LIST_CL_FLAG);
    });

    it(`parsing_056`, async () => {
        const toks1 = await parse_snippet(`default{touch_start( integer num_detected ){}touch( integer num_detected ){}touch_end( integer num_detected ){}}`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`default{touch_start( integer num_detected ){}touch( integer num_detected ){}touch_end( integer num_detected ){}}`);
    });

    it(`parsing_057`, async () => {
        const toks1 = await parse_snippet(`integer bool(integer a){\nif(a) return TRUE;\nelse return FALSE;\n}`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`integer bool(integer a){ if(a) return 0x1 ; else return 0x0 ; }`);
    });

    it(`parsing_058`, async () => {
        const toks1 = await parse_snippet(`integer a(){return 3.7 <= 3.3;}`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`integer a(){return 3.7<= 3.3 ;}`);
    });

    it(`parsing_059`, async () => {
        const toks1 = await parse_snippet(`string a(integer b){return "";} string c(string d){string e = a(llOrd(d, 0)); return "";}`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`string a(integer b){return "";} string c(string d){string e = a(llOrd(d, 0)); return "";}`);
    });

    it(`parsing_060`, async () => {
        const toks1 = await parse_snippet(`integer it;string a;while(~--it) a = "";`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`integer it;string a;while(~--it) a = "";`);
    });

    it(`parsing_061`, async () => {
        const toks1 = await parse_snippet(`if(llJsonValueType("", []) == JSON_INVALID){;}`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`if(llJsonValueType("", []) == "\ufdd0" ){;}`);
    });

    it(`parsing_066`, async () => {
        const toks1 = await parse_snippet(`if(llJsonValueType("", []) == JSON_OBJECT){;}`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`if(llJsonValueType("", []) == "\ufdd1" ){;}`);
    });

    it(`parsing_067`, async () => {
        const toks1 = await parse_snippet(`if(llJsonValueType("", []) == JSON_ARRAY){;}`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`if(llJsonValueType("", []) == "\ufdd2" ){;}`);
    });

    it(`parsing_068`, async () => {
        const toks1 = await parse_snippet(`if(llJsonValueType("", []) == JSON_NUMBER){;}`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`if(llJsonValueType("", []) == "\ufdd3" ){;}`);
    });

    it(`parsing_069`, async () => {
        const toks1 = await parse_snippet(`if(llJsonValueType("", []) == JSON_STRING){;}`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`if(llJsonValueType("", []) == "\ufdd4" ){;}`);
    });

    it(`parsing_070`, async () => {
        const toks1 = await parse_snippet(`if(llJsonValueType("", []) == JSON_NULL){;}`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`if(llJsonValueType("", []) == "\ufdd5" ){;}`);
    });

    it(`parsing_071`, async () => {
        const toks1 = await parse_snippet(`if(llJsonValueType("", []) == JSON_TRUE){;}`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`if(llJsonValueType("", []) == "\ufdd6" ){;}`);
    });

    it(`parsing_072`, async () => {
        const toks1 = await parse_snippet(`if(llJsonValueType("", []) == JSON_FALSE){;}`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`if(llJsonValueType("", []) == "\ufdd7" ){;}`);
    });

    it(`parsing_073`, async () => {
        const toks1 = await parse_snippet(`if(llJsonValueType("", []) == JSON_DELETE){;}`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`if(llJsonValueType("", []) == "\ufdd8" ){;}`);
    });

    it(`parsing_074`, async () => {
        const toks1 = await parse_snippet(`integer a;if(!a)a=1;`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`integer a;if(!a)a=1;`);
    });

    it(`parsing_075`, async () => {
        const toks1 = await parse_snippet(`x(string a){;}default{timer(){string a = "";x(a);}}`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`x(string a){;}default{timer(){string a = "";x(a);}}`);
    });

    it(`parsing_076`, async () => {
        const toks1 = await parse_snippet(`x(){vector a;a*=2.3;}`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`x(){vector a;a*= 2.3 ;}`);
    });

    it(`parsing_077`, async () => {
        const toks1 = await parse_snippet(`x(){vector a;if(llVecMag(a) < 0.141421) a = <0.1, 0.1, 0>;}`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`x(){vector a;if(llVecMag(a) < 0.141421 ) a = < 0.1 , 0.1 , 0>;}`);
    });

    it(`parsing_078`, async () => {
        const toks1 = await parse_snippet(`x(list a){float c=(float)llAbs(1);x([c,c]);}`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`x(list a){float c=(float)llAbs(1);x([c,c]);}`);
    });

    it(`parsing_079`, async () => {
        const toks1 = await parse_snippet(`string a = "5a32accd-0102-85f7-aeb8-7b924ab04da4";`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`string a = "5a32accd-0102-85f7-aeb8-7b924ab04da4";`);
    });

    it(`parsing_080`, async () => {
        const toks1 = await parse_snippet(`string a = R"-(5a32accd-0102-85f7-aeb8-7b924ab04da4)-";`);
        expect(message.length()).toBe(0);
        expect(string.simplify(toks1.str)).toBe(`string a = "5a32accd-0102-85f7-aeb8-7b924ab04da4" ;`);
    });

    it(`parsing_081`, async () => {
        const toks1 = await parse_snippet(`a(){if(1){a();}else{if(2){jump X;}}@X;}`);
        expect(message.length()).toBe(0);
    });

    it(`parsing_082`, async () => {
        const toks1 = await parse_snippet(`a(){;}default{timer(){if(1){a();}else{if(2){jump X;}}@X;}}`);
        expect(message.length()).toBe(0);
    });

    it(`parsing_083`, async () => {
        const toks1 = await parse_snippet(`integer a;integer b;integer c;d(){if((a && !b) || c){;}}`);
        expect(message.length()).toBe(0);
    });

    it(`parsing_084`, async () => {
        const toks1 = await parse_snippet(`vector b;rotation c;float d;vector a=b+(<1.0,0.0,0.0>*c*d);`);
        expect(message.length()).toBe(0);
    });

    it(`parsing_085`, async () => {
        const toks1 = await parse_snippet(`integer a;b(string a){llOwnerSay(a);}`);
        expect(message.has_error()).toBeTrue();
    });

    it(`parsing_086`, async () => {
        const toks1 = await parse_snippet(`list a = (list)(1 - 3) + ("a" + "b") + llAbs(3);`);
        expect(message.has_error()).toBeFalse(0);
    });

    it(`parsing_087`, async () => {
        const toks1 = await parse_snippet(`string a="a";if(a != "-1" && "#-1" != llGetSubString(a, -3, -1)){;}`);
        expect(message.has_error()).toBeFalse(0);
        expect(string.simplify(toks1.str)).toBe(`string a="a";if(a != "-1" && "#-1" != llGetSubString(a, -3, -1)){;}`);
    });

    xit(`parsing_088`, async () => {
        const toks1 = await parse_snippet(`integer x(){return -1;}`);
        expect(message.has_error()).toBeFalse(0);

        const tok0 = toks1.find_str(`-`);
        expect(operator.is_neg_op(tok0)).toBeTrue();
        expect(llop.is_neg_op(tok0)).toBeTrue();
        console.log(flag.to_string(tok0.flag));
        console.log(flag.to_string(tok0.next.flag));
        expect(toks1.stringify()).toBe(`integer x ( ) { return -1 ; }`);
    });








    it(`eval_exp_type_000`, async () => {
        const toks0 = new tokens(`0.25`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);
        expect(eval_exp_type(toks0)).toBe(`float`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_001`, async () => {
        const toks0 = new tokens(`llAcos(0.25)`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);
        expect(eval_exp_type(toks0)).toBe(`float`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_002`, async () => {
        const toks0 = new tokens(`x(){;}f(x();)`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);
        let ref0 = new expr(toks0.back.prev.prev.prev.prev, toks0.back.prev.prev);
        expect(eval_exp_type(ref0)).toBe(`void`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_003`, async () => {
        const toks0 = new tokens(`integer a;a;`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);
        let ref0 = new expr(toks0.back.prev, toks0.back.prev);
        expect(eval_exp_type(ref0)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_004`, async () => {
        const toks0 = new tokens(`"str"`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);
        expect(eval_exp_type(new expr(toks0.front, toks0.front))).toBe(`string`);
    });

    it(`eval_exp_type_005`, async () => {
        const toks0 = new tokens(`<1,1,1>`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);
        expect(eval_exp_type(toks0)).toBe(`vector`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_006`, async () => {
        const toks0 = new tokens(`<1<2,0,0,3>llAbs(3>5)>`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);
        expect(eval_exp_type(toks0)).toBe(`quaternion`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_007`, async () => {
        const toks0 = new tokens(`[llList2Key([3], 0)]`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);
        expect(eval_exp_type(toks0)).toBe(`list`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_008`, async () => {
        const toks0 = new tokens(`0`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);
        expect(eval_exp_type(toks0)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_009`, async () => {
        const toks0 = new tokens(`0.0`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);
        expect(eval_exp_type(toks0)).toBe(`float`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_010`, async () => {
        const toks0 = new tokens(`0xff`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);
        expect(eval_exp_type(toks0)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_011`, async () => {
        const toks0 = new tokens(`(4)`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);
        expect(eval_exp_type(toks0)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_012`, async () => {
        const toks0 = new tokens(`integer a;++a;`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);
        const ref0 = new expr(toks0.back.prev.prev, toks0.back.prev);
        expect(eval_exp_type(ref0)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_013`, async () => {
        const toks0 = new tokens(`integer a;a++;`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);
        const ref0 = new expr(toks0.back.prev.prev, toks0.back.prev);
        expect(eval_exp_type(ref0)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_014`, async () => {
        const toks1 = new tokens(`integer a;--a;`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        let ref0 = new expr(toks1.back.prev.prev, toks1.back.prev);
        expect(eval_exp_type(ref0)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_015`, async () => {
        const toks1 = new tokens(`integer a;a--;`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        let ref0 = new expr(toks1.back.prev.prev, toks1.back.prev);
        expect(eval_exp_type(ref0)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_016`, async () => {
        const toks1 = new tokens(`!1`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_017`, async () => {
        const toks1 = new tokens(`!!!!!1`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_018`, async () => {
        const toks1 = new tokens(`~-1`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(toks1.stringify()).toBe(`~ -1`);
        expect(eval_exp_type(toks1)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_019`, async () => {
        const toks1 = new tokens(`-~1`, `main.lsl`);
        expect(toks1.stringify()).toBe(`- ~ 1`);

        await convert_to_lsl(toks1);
        expect(toks1.stringify()).toBe(`- ~ 1`);

        await parsing(toks1);
        expect(toks1.stringify()).toBe(`- ~ 1`);

        expect(eval_exp_type(toks1)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_020`, async () => {
        const toks1 = new tokens(`-~-~-~-~1`, `main.lsl`);
        expect(toks1.stringify()).toBe(`- ~ - ~ - ~ - ~ 1`);

        await convert_to_lsl(toks1);
        expect(toks1.stringify()).toBe(`- ~ - ~ - ~ - ~ 1`);

        await parsing(toks1);
        expect(toks1.stringify()).toBe(`- ~ - ~ - ~ - ~ 1`);

        expect(eval_exp_type(toks1)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_021`, async () => {
        const toks1 = new tokens(`(-~-~-~-~1)`, `main.lsl`);
        expect(toks1.stringify()).toBe(`( - ~ - ~ - ~ - ~ 1 )`);

        await convert_to_lsl(toks1);
        expect(toks1.stringify()).toBe(`( - ~ - ~ - ~ - ~ 1 )`);

        await parsing(toks1);
        expect(toks1.stringify()).toBe(`( - ~ - ~ - ~ - ~ 1 )`);

        expect(eval_exp_type(toks1)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_022`, async () => {
        const toks1 = new tokens(`1 << 2`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_023`, async () => {
        const toks1 = new tokens(`(1 & 3) << 2`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_024`, async () => {
        const toks1 = new tokens(`1 >> 2`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_025`, async () => {
        const toks1 = new tokens(`(1 | 3) >> 2`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_026`, async () => {
        const toks1 = new tokens(`1 < 4`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_027`, async () => {
        const toks1 = new tokens(`1 > 4`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_028`, async () => {
        const toks1 = new tokens(`1 <= 4`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_029`, async () => {
        const toks1 = new tokens(`1 >= 4`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_030`, async () => {
        const toks1 = new tokens(`1.5 == 4.8`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_031`, async () => {
        const toks1 = new tokens(`1.5 != 4.8`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_032`, async () => {
        const toks1 = new tokens(`5&6`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_033`, async () => {
        const toks1 = new tokens(`5^6`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_034`, async () => {
        const toks1 = new tokens(`5|6`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_035`, async () => {
        const toks1 = new tokens(`5 || 6`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_036`, async () => {
        const toks1 = new tokens(`5 && 6`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_037`, async () => {
        const toks1 = new tokens(`5 % 6`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_038`, async () => {
        const toks1 = new tokens(`3 * 3`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_039`, async () => {
        const toks1 = new tokens(`3.4 * 3`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`float`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_040`, async () => {
        const toks1 = new tokens(`3.4 * 3.3`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`float`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_041`, async () => {
        const toks1 = new tokens(`3 * 3.5`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`float`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_042`, async () => {
        const toks1 = new tokens(`<1,2,3> * <1,2,3>`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`float`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_043`, async () => {
        const toks1 = new tokens(`<1,2,3> * 2.3`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`vector`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_044`, async () => {
        const toks1 = new tokens(`<1,2,3> * <1,2,3,4>`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`vector`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_045`, async () => {
        const toks1 = new tokens(`<1,2,3,4> * <1,2,3,4>`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`quaternion`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_046`, async () => {
        const toks1 = new tokens(`3 / 3`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_047`, async () => {
        const toks1 = new tokens(`3.4 / 3`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`float`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_048`, async () => {
        const toks1 = new tokens(`3.4 / 3.3`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`float`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_049`, async () => {
        const toks1 = new tokens(`3 / 3.5`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`float`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_050`, async () => {
        const toks1 = new tokens(`<1,2,3> / 2.3`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`vector`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_051`, async () => {
        const toks1 = new tokens(`<1,2,3> / <1,2,3,4>`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`vector`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_052`, async () => {
        const toks1 = new tokens(`<1,2,3,4> / <1,2,3,4>`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`quaternion`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_053`, async () => {
        const toks1 = new tokens(`3 + 3`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_054`, async () => {
        const toks1 = new tokens(`3.4 + 3`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`float`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_055`, async () => {
        const toks1 = new tokens(`3.4 + 3.3`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`float`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_056`, async () => {
        const toks1 = new tokens(`3 + 3.5`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`float`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_057`, async () => {
        const toks1 = new tokens(`"a" + "b"`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`string`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_058`, async () => {
        const toks1 = new tokens(`<1,2,3> + <1,2,3>`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`vector`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_059`, async () => {
        const toks1 = new tokens(`<1,2,3,4> + <1,2,3,4>`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`quaternion`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_060`, async () => {
        const toks1 = new tokens(`integer x;(x == 0 && (x = 0) == 0 && x)`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        let ref0 = new expr(toks1.front.next.next.next, toks1.back);
        expect(eval_exp_type(ref0)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_061`, async () => {
        const toks1 = new tokens(`x(){}y(){x();}`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        let ref0 = new expr(toks1.back.prev.prev.prev.prev, toks1.back.prev);
        expect(eval_exp_type(ref0)).toBe(`void`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_062`, async () => {
        const toks1 = new tokens(`;`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`void`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_063`, async () => {
        const toks1 = new tokens(`1 += 3`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_064`, async () => {
        const toks1 = new tokens(`1.0 += 3`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);
        expect(eval_exp_type(toks1)).toBe(`float`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_065`, async () => {
        const toks1 = await parse_snippet(`3 & CHANGED_REGION_START`);
        expect(eval_exp_type(toks1)).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_065`, async () => {
        const toks1 = new tokens(`integer channel;integer Zchan;key id;key owner;(channel == Zchan && id == owner)`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);

        expect(eval_exp_type(new expr(toks1.find_str(`(`), toks1.back))).toBe(`integer`);
        expect(message.length()).toBe(0);
    });

    it(`eval_exp_type_066`, async () => {
        const toks1 = new tokens(`-Infinity`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);



        expect(eval_exp_type(toks1)).toBe(`float`);
        expect(message.length()).toBe(0);
    });





    it(`error_000`, async () => {
        const toks1 = new tokens(`integer a;\ninteger a;`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Warning: Variable name "a" previously declared within scope. #file "main.lsl":2:9`);
        message.clear();
    });

    it(`error_001`, async () => {
        const toks1 = new tokens(`x(){\nreturn 0;\n}`, `main.lsl`);
        await convert_to_lsl(toks1);
        await parsing(toks1);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Return statement type doesn't match function return type. #file "main.lsl":2:8`);
        message.clear();
    });

    it(`error_002`, async () => {
        const toks0 = new tokens(`integer x(){\nreturn;\n}`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Function returns a value but return statement doesn't. #file "main.lsl":2:7`);
        message.clear();
    });

    it(`error_003`, async () => {
        const toks0 = new tokens(`vector v;\nf(){\nv.s;\n}\n`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Use of vector or quaternion method on incorrect type. #file "main.lsl":3:3`);
        message.clear();
    });

    it(`error_004`, async () => {
        const toks0 = new tokens(`f(){}\ndefault\n{\nstate_entry()\n{\nf(1);\n}\n}\n`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Function call mismatches number of arguments. #file "main.lsl":6:1`);
        message.clear();
    });

    it(`error_005`, async () => {
        const toks0 = new tokens(`default\n{\nstate_entry()\n{\nllDie(1);\n}\n}\n`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Function call mismatches number of arguments. #file "main.lsl":5:1`);
        message.clear();
    });

    it(`error_006`, async () => {
        const toks0 = new tokens(`x(list a){}default\n{\nstate_entry()\n{\nllDie(1);\n}\n}\n`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Function call mismatches number of arguments. #file "main.lsl":5:1`);
        message.clear();
    });

    it(`error_007`, async () => {
        const toks0 = new tokens(`x(){\nwhile (1) integer x;\n}`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Declaration requires a new scope -- use { and } #file "main.lsl":2:19`);
        message.clear();
    });

    it(`error_008`, async () => {
        const toks0 = new tokens(`f(){\nstate default;;\n}\ndefault\n{\nstate_entry()\n{\n}\n}`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Global functions can't change state. #file "main.lsl":2:7`);
        message.clear();
    });

    it(`error_009`, async () => {
        const toks0 = new tokens(`integer x()\n{\n}`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Warning: Not all code paths return a value. #file "main.lsl":1:8`);
        message.clear();
    });

    it(`error_010`, async () => {
        const toks0 = new tokens(`x(){\n{@a;}\n{@a;}\n}`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Duplicate local label name. That won't allow the Mono script to be saved, and will not work as expected in LSO. #file "main.lsl":3:2`);
        message.clear();
    });

    it(`error_011`, async () => {
        const toks0 = new tokens(`f(){key x=`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Unexpected EOF. #file "main.lsl":1:9`);
        message.clear();
    });

    it(`error_012`, async () => {
        const toks0 = new tokens(`f(){g();}`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Function name "g" not defined within scope. #file "main.lsl":1:4`);
        message.clear();
    });

    it(`error_013`, async () => {
        const toks0 = new tokens(`integer g;f(){g();}`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Function name "g" not defined within scope. #file "main.lsl":1:14`);
        message.clear();
    });

    it(`error_014`, async () => {
        const toks0 = new tokens(`f(){f=0;}`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Name "f" not defined within scope. #file "main.lsl":1:4`);
        message.clear();
    });

    it(`error_015`, async () => {
        const toks0 = new tokens(`f(){string s;s++;}`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Type mismatch. #file "main.lsl":1:14`);
        message.clear();
    });

    it(`error_016`, async () => {
        const toks0 = new tokens(`f(){string s;++s;}`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Type mismatch. #file "main.lsl":1:13`);
        message.clear();
    });

    it(`error_017`, async () => {
        const toks0 = new tokens(`f(){string s;s=llDie();}`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Type mismatch. #file "main.lsl":1:14`);
        message.clear();
    });

    it(`error_018`, async () => {
        const toks0 = new tokens(`f(){string s;s+=(key)"";}`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Type mismatch. #file "main.lsl":1:14`);
        message.clear();
    });

    it(`error_019`, async () => {
        const toks0 = new tokens(`f(){string s;s-=s;}`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Type mismatch. #file "main.lsl":1:14`);
        message.clear();
    });

    it(`error_020`, async () => {
        const toks0 = new tokens(`f(){string s;s*=2;}`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Type mismatch. #file "main.lsl":1:14`);
        message.clear();
    });

    it(`error_021`, async () => {
        const toks0 = new tokens(`f(){vector v;v%=1.0;}`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Type mismatch. #file "main.lsl":1:14`);
        message.clear();
    });

    it(`error_022`, async () => {
        const toks0 = new tokens(`f(){-"";}`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Type mismatch. #file "main.lsl":1:4`);
        message.clear();
    });

    it(`error_023`, async () => {
        const toks1 = await parse_snippet(`f(){!"";}`);
        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Type mismatch. #file "main.lsl":1:4`);
        message.clear();
    });

    it(`error_024`, async () => {
        const toks0 = new tokens(`f(){~"";}`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Type mismatch. #file "main.lsl":1:4`);
        message.clear();
    });

    it(`error_026`, async () => {
        const toks0 = new tokens(`f(){++f;}`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Name "f" not defined within scope. #file "main.lsl":1:6`);
        message.clear();
    });

    it(`error_027`, async () => {
        const toks0 = new tokens(`f(){(key)1;}`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Type mismatch. #file "main.lsl":1:4`);
        message.clear();
    });

    it(`error_028`, async () => {
        const toks0 = new tokens(`f(){""*2;}`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Type mismatch. #file "main.lsl":1:6`);
        message.clear();
    });

    it(`error_029`, async () => {
        const toks0 = new tokens(`f(){<1,1,1>%2;}`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Type mismatch. #file "main.lsl":1:11`);
        message.clear();
    });

    it(`error_030`, async () => {
        const toks0 = new tokens(`f(){<1,1,1>/<1,1,1>;}`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Type mismatch. #file "main.lsl":1:11`);
        message.clear();
    });

    it(`error_031`, async () => {
        const toks0 = new tokens(`f(){<1,1,1>/"";}`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Type mismatch. #file "main.lsl":1:11`);
        message.clear();
    });

    it(`error_032`, async () => {
        const toks0 = new tokens(`f(){llDie()+1;}`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Type mismatch. #file "main.lsl":1:11`);
        message.clear();
    });

    it(`error_033`, async () => {
        const toks0 = new tokens(`f(){""-1;}`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Type mismatch. #file "main.lsl":1:6`);
        message.clear();
    });

    it(`error_034`, async () => {
        const toks0 = new tokens(`f(){[]+llDie();}`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Type mismatch. #file "main.lsl":1:6`);
        message.clear();
    });

    it(`error_035`, async () => {
        const toks0 = new tokens(`f(){(key)""+(key)"";}`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Type mismatch. #file "main.lsl":1:11`);
        message.clear();
    });

    it(`error_036`, async () => {
        const toks0 = new tokens(`f(){""+(key)"";}`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Type mismatch. #file "main.lsl":1:6`);
        message.clear();
    });

    it(`error_037`, async () => {
        const toks0 = new tokens(`f(){"">>1;}`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Type mismatch. #file "main.lsl":1:6`);
        message.clear();
    });

    it(`error_038`, async () => {
        const toks0 = new tokens(`f(){1<<"";}`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Type mismatch. #file "main.lsl":1:5`);
        message.clear();
    });

    it(`error_039`, async () => {
        const toks0 = new tokens(`f(){""<"";}`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Type mismatch. #file "main.lsl":1:6`);
        message.clear();
    });

    it(`error_040`, async () => {
        const toks0 = new tokens(`f(){llDie()==3;}`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Type mismatch. #file "main.lsl":1:11`);
        message.clear();
    });

    it(`error_041`, async () => {
        const toks0 = new tokens(`f(){""==3;}`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Type mismatch. #file "main.lsl":1:6`);
        message.clear();
    });

    it(`error_042`, async () => {
        const toks0 = new tokens(`f(){""&3;}`, `main.lsl`);
        await convert_to_lsl(toks0);
        await parsing(toks0);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Type mismatch. #file "main.lsl":1:6`);
        message.clear();
    });

    it(`error_043`, async () => {
        await parse_snippet(`f(){3&"";}`);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Type mismatch. #file "main.lsl":1:5`);
        message.clear();
    });

    it(`error_044`, async () => {
        await parse_snippet(`f(){""^3;}`);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Type mismatch. #file "main.lsl":1:6`);
        message.clear();
    });

    it(`error_045`, async () => {
        await parse_snippet(`f(){3^"";}`);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Type mismatch. #file "main.lsl":1:5`);
        message.clear();
    });

    it(`error_046`, async () => {
        await parse_snippet(`f(){""|3;}`);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Type mismatch. #file "main.lsl":1:6`);
        message.clear();
    });

    it(`error_047`, async () => {
        await parse_snippet(`f(){3|"";}`);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Type mismatch. #file "main.lsl":1:5`);
        message.clear();
    });

    it(`error_048`, async () => {
        await parse_snippet(`f(){3||"";}`);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Type mismatch. #file "main.lsl":1:5`);
        message.clear();
    });

    it(`error_049`, async () => {
        await parse_snippet(`f(){""&&3;}`);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Type mismatch. #file "main.lsl":1:6`);
        message.clear();
    });

    it(`error_050`, async () => {
        await parse_snippet(`f(){llSay(0);}`);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Function call mismatches number of arguments. #file "main.lsl":1:4`);
        message.clear();
    });

    it(`error_051`, async () => {
        await parse_snippet(`f(){@x;@x;}`);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Duplicate local label name. That won't allow the Mono script to be saved, and will not work as expected in LSO. #file "main.lsl":1:7`);
        message.clear();
    });

    it(`error_052`, async () => {
        await parse_snippet(`f(){integer x;integer x;}`);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Warning: Variable name "x" previously declared within scope. #file "main.lsl":1:22`);
        message.clear();
    });

    it(`error_053`, async () => {
        await parse_snippet(`f(integer x, integer x){}`);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Warning: Variable name "x" previously declared within scope. #file "main.lsl":1:21`);
        message.clear();
    });

    it(`error_054`, async () => {
        await parse_snippet(`default{timer(){}timer(){}}`);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Event name "timer" previously declared within scope. #file "main.lsl":1:17`);
        message.clear();
    });

    it(`error_055`, async () => {
        await parse_snippet(`default{timer(){state state;}}`);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Use of illegal keyword: "state". #file "main.lsl":1:16`);
        message.clear();
    });

    it(`error_056`, async () => {
        await parse_snippet(`default{timer(){state undefined;}}`);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Unknow state name: "undefined". #file "main.lsl":1:16`);
        message.clear();
    });

    it(`error_057`, async () => {
        await parse_snippet(`list L=[[]];default{timer(){}}`);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: List can not contain "list" element. #file "main.lsl":1:8`);
        message.clear();
    });

    it(`error_058`, async () => {
        await parse_snippet(`default{timer(integer i){}}`);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Event call mismatches number of arguments. #file "main.lsl":1:8`);
        message.clear();
    });

    it(`error_059`, async () => {
        await parse_snippet(`i = 0;`);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Name "i" not defined within scope. #file "main.lsl":1`);
        message.clear();
    });

    it(`error_060`, async () => {
        message.clear();
        await parse_snippet(`default{timer(){}}state{timer(){}}`);

        expect(message.length()).toBe(2);
        expect(message.at(0).str()).toBe(`Syntax error: Missing state name. #file "main.lsl":1:18`);
        message.clear();
    });

    it(`error_061`, async () => {
        await parse_snippet(`default{timer(){jump undefined;}}`);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Label name "undefined" not defined within scope. #file "main.lsl":1:16`);
        message.clear();
    });

    //it(`error_062`, async () => {
    //    const toks0 = new tokens(`;`, `main.lsl`);
    //    //console.log(toks0.stringify());
    //    const toks1 = await parsing(toks0);
    //
    //    expect(message.length()).toBe(1);
    //    expect(message.at(0).str()).toBe(`Syntax error: Unexpected EOF. #line 1:9`);
    //    message.clear();
    //});

    it(`error_063`, async () => {
        message.clear();
        await parse_snippet(`f(;`);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Unexpected EOF. #file "main.lsl":1:2`);
        message.clear();
    });

    it(`error_064`, async () => {
        await parse_snippet(`f();`);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Use of local function in gloabal scope. #file "main.lsl":1`);
        message.clear();
    });

    it(`error_065`, async () => {
        await parse_snippet(`integer f=`);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Missing right exp for operator: "=". #file "main.lsl":1:9`);
        message.clear();
    });

    it(`error_066`, async () => {
        await parse_snippet(`integer /*`);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Missing name. #file "main.lsl":1`);
        message.clear();
    });

    it(`error_067`, async () => {
        await parse_snippet(`default{timer(){}}state e;`);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Missing state block: "state". #file "main.lsl":1:24`);
        message.clear();
    });

    it(`error_068`, async () => {
        await parse_snippet(`for(;;){ jump _ ; @_; }`);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Use of label outside of function or event. #file "main.lsl":1:19`);
        message.clear();
    });

    it(`error_069`, async () => {
        await parse_snippet(`integer a`);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Missing EOL(;). #file "main.lsl":1:8`);
        message.clear();
    });

    it(`error_070`, async () => {
        await parse_snippet(`integer a;;`);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Warning: Trailling EOL(;). #file "main.lsl":1:10`);
        message.clear();
    });

    it(`error_071`, async () => {
        await parse_snippet(`integer a integer b`);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Missing EOL(;). #file "main.lsl":1:18`);
        message.clear();
    });

    it(`error_072`, async () => {
        await parse_snippet(`list a(list b){return b}default{timer(){a([6])}}`);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Missing EOL(;). #file "main.lsl":1:23`);
        message.clear();
    });

    it(`error_073`, async () => {
        await parse_snippet(`const integer a=4;default{timer(){a = 9;}}`);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Assignment to constant variable. #file "main.lsl":1:34`);
        message.clear();
    });

    it(`error_074`, async () => {
        await parse_snippet(`const integer a=4;default{timer(){if(1){if(1){if(1){if(1){if(1){if(1){if(1){if(1){a=2;}}}}}}}}}}`);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Assignment to constant variable. #file "main.lsl":1:82`);
        message.clear();
    });

    it(`error_075`, async () => {
        await parse_snippet(`a(){if(b & 2){;}}`);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Name "b" not defined within scope. #file "main.lsl":1:7`);
        message.clear();
    });

    it(`error_076`, async () => {
        await parse_snippet(`string a = R"-(b)-"x(integer c){}`);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Missing EOL(;). #file "main.lsl":1:17`);
        message.clear();
    });

    it(`error_077`, async () => {
        await parse_snippet(`x(){@a if(1);}`);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Missing EOL(;). #file "main.lsl":1:7`);
        message.clear();
    });

    it(`error_078`, async () => {
        await parse_snippet(`integer a;x(){a = a 3;}`);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Missing operator. #file "main.lsl":1:18`);
        message.clear();
    });

    it(`error_079`, async () => {
        await parse_snippet(`nteger a = 3;`);

        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: Unknow type. #file "main.lsl":1:9`);
        message.clear();
    });

    it(`error_080`, async () => {
        await parse_snippet(`list a;if (1 < 5) a += [3]`);

        //expect(message.length()).toBe(1);
        //expect(message.at(0).str()).toBe(`Syntax error: Missing EOL(;).`);
        message.clear();
    });

    it(`error_081`, async () => {
        await parse_snippet(`a(string pkt){}aa(string pkt){string g = pkt;}default{timer(){}}`);

        expect(message.length()).toBe(0);
        //expect(message.at(0).str()).toBe(`Syntax error: Missing EOL(;).`);
        message.clear();
    });

    it(`error_082`, async () => {
        await parse_snippet(`x(){integer a = 3@lab;}`);

        expect(message.length()).toBe(0);
        //expect(message.at(0).str()).toBe(`Syntax error: Missing EOL(;).`);
        message.clear();
    });

    it(`error_083`, async () => {
        await parse_snippet(`x(){if(1)@lab;}`);

        expect(message.length()).toBe(0);
        //expect(message.at(0).str()).toBe(`Syntax error: Missing EOL(;).`);
        message.clear();
    });

    it(`error_084`, async () => {
        await parse_snippet(`integer a;x(){a = (float)!!(a == "show");}`);

        expect(message.length()).toBe(1);
        //expect(message.at(0).str()).toBe(`Syntax error: Missing EOL(;).`);
        message.clear();
    });

    it(`error_085`, async () => {
        const toks1 = await parse_snippet(`listen(){;}default{listen(integer channel,string name,key id,string message){;}}`);
        expect(message.length()).toBe(1);
    });

    /**/
});

const fetch_link = async link => {
    let ret = new tokens();
    await fetch(link)
        .then(res => { ret = res.text() })
        .catch(e => { message.add(new message(message.MISSING_HEADER, e.message)); })
    return ret;
};

xdescribe(`file_parsing`, () => {

    beforeEach(async () => {
        message.print();
        message.clear();
        await load_spec();
    });

    afterEach(async () => {
        reset_index();
        src.clear();
        message.print();
        message.clear();
    });

    it(`parsing_oc_OwnerOnlineCheck.lsl`, async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/Apps/oc_OwnerOnlineCheck.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it(`parsing_oc_badwords.lsl`, async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/Apps/oc_badwords.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_cagehome.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/Apps/oc_cagehome.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_camera.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/Apps/oc_camera.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_capture.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/Apps/oc_capture.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_customizer.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/Apps/oc_customizer.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_detach.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/Apps/oc_detach.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_garble.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/Apps/oc_garble.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_outfits.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/Apps/oc_outfits.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_presets.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/Apps/oc_presets.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_safezone.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/Apps/oc_safezone.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_shocker.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/Apps/oc_shocker.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_spy.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/Apps/oc_spy.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_timer.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/Apps/oc_timer.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });
    /**/
    it("parsing_oc_undress.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/Apps/oc_undress.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
        // message.js:71 Syntax error: Function call mismatches type of arguments. #file "oc_undress.lsl":364:20
    });

    it("parsing_oc_ao.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/ao/oc_ao.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_ao_animator", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/ao/oc_ao_animator`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_addons.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/collar/oc_addons.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_anim.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/collar/oc_anim.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_api.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/collar/oc_api.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_auth.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/collar/oc_auth.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_bell.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/collar/oc_bell.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_bookmarks.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/collar/oc_bookmarks.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_core.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/collar/oc_core.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_couples.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/collar/oc_couples.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_dialog.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/collar/oc_dialog.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_folders.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/collar/oc_folders.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_folders_locks.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/collar/oc_folders_locks.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_label.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/collar/oc_label.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_leash.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/collar/oc_leash.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_meshlabel.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/collar/oc_meshlabel.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_particle.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/collar/oc_particle.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_relay.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/collar/oc_relay.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_resizer.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/collar/oc_resizer.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_rlvextension.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/collar/oc_rlvextension.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_rlvsuite.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/collar/oc_rlvsuite.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
        // Syntax error: Trailling EOL(;). #file "oc_rlvsuite.lsl":293:196
    });

    it("parsing_oc_rlvsys.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/collar/oc_rlvsys.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_settings.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/collar/oc_settings.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_states.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/collar/oc_states.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_themes.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/collar/oc_themes.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_titler.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/collar/oc_titler.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_cuff.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/cuffs/oc_cuff.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_cuff_pose.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/cuffs/oc_cuff_pose.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_cuff_resizer.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/cuffs/oc_cuff_resizer.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_cuff_themes.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/cuffs/oc_cuff_themes.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
        // Syntax error: Variable name "sMsg" previously declared within scope. #file "oc_cuff_themes.lsl":289:32
    });

    it("parsing_oc_installer_bundles.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/installer/oc_installer_bundles.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_installer_sys.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/installer/oc_installer_sys.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_transform_shim.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/installer/oc_transform_shim.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_update_shim.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/installer/oc_update_shim.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_.aolink%20(broken).lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/spares/.aolink%20(broken).lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_.aoloader.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/spares/.aoloader.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_.lead.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/spares/.lead.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_.lead.lsl (optional version)", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/spares/.lead.lsl%20(optional%20version)`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_addon_test_debugger.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/spares/addon_test_debugger.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_addon_template.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/spares/oc_addon_template.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_collarizer.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/spares/oc_collarizer.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_debugger", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/spares/oc_debugger`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_debugger.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/spares/oc_debugger.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_grabbypost.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/spares/oc_grabbypost.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_lock_addon_template.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/spares/oc_lock_addon_template.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_plugin_template.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/spares/oc_plugin_template.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_remote_leashpost.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/spares/oc_remote_leashpost.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_unwelder.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/spares/oc_unwelder.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_update_cleaner.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/spares/oc_update_cleaner.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_update_seed.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/spares/oc_update_seed.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_oc_wearerHUD", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/spares/oc_wearerHUD`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_plugin_test_debugger.lsl", async () => {
        const link = `https://raw.githubusercontent.com/OpenCollarTeam/OpenCollar/master/src/spares/plugin_test_debugger.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });





    it("parsing_[AV]camera.lsl", async () => {
        const link = `https://raw.githubusercontent.com/AVsitter/AVsitter/master/AVsitter2/Plugins/AVcamera/%5BAV%5Dcamera.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_[AV]LockGuard-object.lsl", async () => {
        const link = `https://raw.githubusercontent.com/AVsitter/AVsitter/master/AVsitter2/Plugins/AVcontrol/LockGuard/%5BAV%5DLockGuard-object.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_[AV]LockGuard.lsl", async () => {
        const link = `https://raw.githubusercontent.com/AVsitter/AVsitter/master/AVsitter2/Plugins/AVcontrol/LockGuard/%5BAV%5DLockGuard.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_[AV]LockMeister.lsl", async () => {
        const link = `https://raw.githubusercontent.com/AVsitter/AVsitter/master/AVsitter2/Plugins/AVcontrol/LockMeister/%5BAV%5DLockMeister.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_[AV]Xcite!.lsl", async () => {
        const link = `https://raw.githubusercontent.com/AVsitter/AVsitter/master/AVsitter2/Plugins/AVcontrol/Xcite!-Sensations/%5BAV%5DXcite!.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_[AV]root-RLV-extra.lsl", async () => {
        const link = `https://raw.githubusercontent.com/AVsitter/AVsitter/master/AVsitter2/Plugins/AVcontrol/%5BAV%5Droot-RLV-extra.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_[AV]root-RLV.lsl", async () => {
        const link = `https://raw.githubusercontent.com/AVsitter/AVsitter/master/AVsitter2/Plugins/AVcontrol/%5BAV%5Droot-RLV.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_[AV]root-control.lsl", async () => {
        const link = `https://raw.githubusercontent.com/AVsitter/AVsitter/master/AVsitter2/Plugins/AVcontrol/%5BAV%5Droot-control.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_[AV]faces.lsl", async () => {
        const link = `https://raw.githubusercontent.com/AVsitter/AVsitter/master/AVsitter2/Plugins/AVfaces/%5BAV%5Dfaces.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_[AV]favs.lsl", async () => {
        const link = `https://raw.githubusercontent.com/AVsitter/AVsitter/master/AVsitter2/Plugins/AVfavs/%5BAV%5Dfavs.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_[AV]menu.lsl", async () => {
        const link = `https://raw.githubusercontent.com/AVsitter/AVsitter/master/AVsitter2/Plugins/AVprop/%5BAV%5Dmenu.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_[AV]object.lsl", async () => {
        const link = `https://raw.githubusercontent.com/AVsitter/AVsitter/master/AVsitter2/Plugins/AVprop/%5BAV%5Dobject.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_[AV]prop.lsl", async () => {
        const link = `https://raw.githubusercontent.com/AVsitter/AVsitter/master/AVsitter2/Plugins/AVprop/%5BAV%5Dprop.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_[AV]sequence.lsl", async () => {
        const link = `https://raw.githubusercontent.com/AVsitter/AVsitter/master/AVsitter2/Plugins/AVsequence/%5BAV%5Dsequence.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_[AV]update-sender.lsl", async () => {
        const link = `https://raw.githubusercontent.com/AVsitter/AVsitter/master/AVsitter2/Utilities/Updater/update-sender.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_[AV]pos-generator.lsl", async () => {
        const link = `https://raw.githubusercontent.com/AVsitter/AVsitter/master/AVsitter2/Utilities/AVpos-generator.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_[AV]pos-shifter.lsl", async () => {
        const link = `https://raw.githubusercontent.com/AVsitter/AVsitter/master/AVsitter2/Utilities/AVpos-shifter.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_[AV]Anim-perm-checker.lsl", async () => {
        const link = `https://raw.githubusercontent.com/AVsitter/AVsitter/master/AVsitter2/Utilities/Anim-perm-checker.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_[AV]MLP-converter.lsl", async () => {
        const link = `https://raw.githubusercontent.com/AVsitter/AVsitter/master/AVsitter2/Utilities/MLP-converter.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_[AV]Missing-anim-finder.lsl", async () => {
        const link = `https://raw.githubusercontent.com/AVsitter/AVsitter/master/AVsitter2/Utilities/Missing-anim-finder.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_[AV]Noob-detector.lsl", async () => {
        const link = `https://raw.githubusercontent.com/AVsitter/AVsitter/master/AVsitter2/Utilities/Noob-detector.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_[AV]adjuster.lsl", async () => {
        const link = `https://raw.githubusercontent.com/AVsitter/AVsitter/master/AVsitter2/%5BAV%5Dadjuster.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_[AV]helperscript.lsl", async () => {
        const link = `https://raw.githubusercontent.com/AVsitter/AVsitter/master/AVsitter2/%5BAV%5Dhelperscript.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_[AV]root-security.lsl", async () => {
        const link = `https://raw.githubusercontent.com/AVsitter/AVsitter/master/AVsitter2/%5BAV%5Droot-security.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_[AV]root.lsl", async () => {
        const link = `https://raw.githubusercontent.com/AVsitter/AVsitter/master/AVsitter2/%5BAV%5Droot.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_[AV]select.lsl", async () => {
        const link = `https://raw.githubusercontent.com/AVsitter/AVsitter/master/AVsitter2/%5BAV%5Dselect.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_[AV]sitA.lsl", async () => {
        const link = `https://raw.githubusercontent.com/AVsitter/AVsitter/master/AVsitter2/%5BAV%5DsitA.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

    it("parsing_[AV]sitB.lsl", async () => {
        const link = `https://raw.githubusercontent.com/AVsitter/AVsitter/master/AVsitter2/%5BAV%5DsitB.lsl`;
        const source = await fetch_link(link);
        await parse_snippet(source, array.last(link.split(`/`)));
        expect(message.has_error()).toBeFalse(0);
    });

});



