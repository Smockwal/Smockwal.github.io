import { flag } from "../../lib/global.js";
import { type_error, error } from "../../lib/error.js";
import { expr } from "../../lib/source/expressions.js";
import { location } from "../../lib/source/location.js";
import { message } from "../../lib/source/message.js";
import { token } from "../../lib/source/token.js";
import { tokens } from "../../lib/source/tokens.js";
import { test_tokens } from "../test.js";

describe(`tokens`, () => {

    afterEach(() => {
        message.print();
        message.clear();
    });

    beforeEach(() => {
        //macros.clear();
        //uris.clear();
    });

    it(`constructor_00`, () => {
        const toks = new tokens();
        expect(toks.front).not.toBeDefined();
        expect(toks.back).not.toBeDefined();
    });

    it(`constructor_01`, () => {
        const toks = new tokens(`a b c d`);
        expect(toks.stringify()).toBe(`a b c d`);
    });

    it('constructor_02', () => {
        const toks0 = new tokens(`a b c d`);

        let toks1 = new tokens(new expr(toks0.front, toks0.back));
        expect(toks1.stringify()).toBe(`a b c d`);

        toks1 = new tokens(new expr(toks0.front.next, toks0.back.prev));
        expect(toks1.stringify()).toBe(`b c`);
    });

    it(`stringify_00`, () => {
        const toks = new tokens();
        expect(toks.stringify()).toBe(``);
    });

    it(`stringify_00`, () => {
        const toks = new tokens();
        expect(toks.stringify()).toBe(``);
    });

    it(`push_back_00`, () => {
        const loc = new location();
        let toks = new tokens();

        const ta = new token(`#`, loc);
        loc.adjust(ta.str);
        toks.push_back(ta);

        expect(toks.length).toEqual(1);
        expect(toks.front.is(ta)).toBeTrue();
        expect(Object.is(toks.front, ta)).toBeTrue();
        expect(toks.back).toEqual(ta);
        expect(Object.is(toks.back, ta)).toBeTrue();
    });

    it(`push_back_01`, () => {
        const loc = new location();
        let toks = new tokens();

        const ta = new token(`#`, loc);
        loc.adjust(ta.str);
        toks.push_back(ta);

        const tb = new token(`error`, loc);
        loc.adjust(tb.str);
        toks.push_back(tb);

        expect(toks.length).toBe(2);
        expect(toks.front).toBe(ta);
        expect(Object.is(toks.front, ta)).toBeTrue();
        expect(Object.is(toks.front.next, tb)).toBeTrue();
        expect(toks.back).toBe(tb);
        expect(Object.is(toks.back, tb)).toBeTrue();
        expect(Object.is(toks.back.prev, ta)).toBeTrue();
    });

    it(`push_back_01`, () => {
        const loc = new location();
        let toks = new tokens();

        const ta = new token(`#`, loc);
        loc.adjust(ta.str);
        toks.push_back(ta);

        const tb = new token(`error`, loc);
        loc.adjust(tb.str);
        toks.push_back(tb);

        const tc = new token(`.`, loc);
        loc.adjust(tc.str);
        toks.push_back(tc);

        expect(toks.length).toBe(3);
        expect(toks.front).toBe(ta);
        expect(Object.is(toks.front, ta)).toBeTrue();
        expect(Object.is(toks.front.next, tb)).toBeTrue();
        expect(toks.back).toBe(tc);
        expect(Object.is(toks.back, tc)).toBeTrue();
        expect(Object.is(toks.back.prev, tb)).toBeTrue();
    });

    it(`tokenize_00`, () => {
        let toks = new tokens(``);

        expect(toks.stringify()).toBe(``);
        expect(toks.last_line()).toBe(``);
        expect(toks.back).toBe(undefined);
    });

    it(`tokenize_01`, () => {
        let toks = new tokens(`#error some error.`);

        expect(toks.stringify()).toBe(`# error some error.`);
        expect(toks.last_line()).toBe(`# error some error.`);
        expect(toks.back.str).toBe(`some error.`);
    });

    it(`tokenize_02`, () => {
        let toks = new tokens(`int val = numb;`);

        expect(toks.stringify()).toBe(`int val = numb ;`);
        expect(toks.last_line()).toBe(`int val = numb ;`);
        expect(toks.back.str).toBe(`;`);
        expect(toks.length).toBe(5);
    });

    it(`tokenize_03`, () => {
        let toks = new tokens(`// some comments.`);

        expect(toks.stringify()).toBe(`// some comments.`);
        expect(toks.last_line()).toBe(``);
        expect(toks.back.str).toBe(`// some comments.`);
        expect(toks.back.flag).toBe(flag.COMMENT_FLAG);
        expect(toks.length).toBe(1);
    });

    it(`tokenize_04`, () => {
        let toks = new tokens(`// some comments.\\\nmore comments.`);

        expect(toks.stringify()).toBe(`// some comments. more comments.`);
        expect(toks.last_line()).toBe(``);
        expect(toks.back.str).toBe(`// some comments. more comments.`);
        expect(toks.back.flag).toBe(flag.COMMENT_FLAG);
        expect(toks.length).toBe(1);
    });

    it(`tokenize_05`, () => {
        let toks = new tokens(`// some comments.\\\nmore comments.\n code`);

        expect(toks.stringify()).toBe(`// some comments. more comments.\n\ncode`);
        expect(toks.last_line()).toBe(`code`);
        expect(toks.back.str).toBe(`code`);
        expect(toks.back.flag).toBe(flag.NAME_FLAG);
        expect(toks.length).toBe(2);
        expect(toks.back.loc.line).toBe(3);
    });

    it(`tokenize_06`, () => {
        let toks = new tokens(`some code /* and comments. */`);

        expect(toks.stringify()).toBe(`some code /* and comments. */`);
        expect(toks.last_line()).toBe(`some code`);
        expect(toks.back.str).toBe(`/* and comments. */`);
        expect(toks.back.flag).toBe(flag.COMMENT_FLAG);
        expect(toks.length).toBe(3);
    });

    it(`tokenize_07`, () => {
        let toks = new tokens(`some code /*\nand\ncomments.\n*/\ncode`);

        expect(toks.stringify()).toBe(`some code /* and comments. */\n\n\n\ncode`);
        expect(toks.last_line()).toBe(`code`);
        expect(toks.back.str).toBe(`code`);
        expect(toks.back.flag).toBe(flag.NAME_FLAG);
        expect(toks.length).toBe(4);
        expect(toks.back.loc.line).toBe(5);
    });

    it(`tokenize_08`, () => {
        let toks = new tokens(`LR"--(STUV)--"`);

        expect(toks.stringify()).toBe(`L"STUV"`);
        expect(toks.last_line()).toBe(`%str%`);
        expect(toks.back.str).toBe(`L"STUV"`);
    });

    it(`tokenize_09`, () => {
        let toks = new tokens(`R"(Sample.\nmultiline.\ncontent.\n)"`);

        expect(toks.stringify()).toBe(`"Sample.\\nmultiline.\\ncontent.\\n"`);
        expect(toks.last_line()).toBe(`%str%`);
        expect(toks.back.str).toBe(`"Sample.\\nmultiline.\\ncontent.\\n"`);
    });

    it(`tokenize_10`, () => {
        let toks = new tokens(`R"foo(This contains quoted parens "()")foo"`);

        expect(toks.stringify()).toBe(`"This contains quoted parens \\"()\\""`);
        expect(toks.last_line()).toBe(`%str%`);
        expect(toks.back.str).toBe(`"This contains quoted parens \\"()\\""`);
    });

    it(`tokenize_11`, () => {
        let toks = new tokens(`uR"([9, "<1,1,1>", false, {"A": 8, "Z": 9}])"`);

        expect(toks.stringify()).toBe(`u"[9, \\"<1,1,1>\\", false, {\\"A\\": 8, \\"Z\\": 9}]"`);
        expect(toks.last_line()).toBe(`%str%`);
        expect(toks.back.str).toBe(`u"[9, \\"<1,1,1>\\", false, {\\"A\\": 8, \\"Z\\": 9}]"`);
    });

    it(`tokenize_12`, () => {
        let toks = new tokens(`"some string literal."`);

        expect(toks.stringify()).toBe(`"some string literal."`);
        expect(toks.last_line()).toBe(`%str%`);
        expect(toks.back.str).toBe(`"some string literal."`);
    });

    it(`tokenize_13`, () => {
        let toks = new tokens(`'some string literal.'`);

        expect(toks.stringify()).toBe(`'some string literal.'`);
        expect(toks.last_line()).toBe(`%str%`);
        expect(toks.back.str).toBe(`'some string literal.'`);
    });

    it(`tokenize_14`, () => {
        let toks = new tokens(`\`some string literal.\``);

        expect(toks.stringify()).toBe(`\`some string literal.\``);
        expect(toks.last_line()).toBe(`%str%`);
        expect(toks.back.str).toBe(`\`some string literal.\``);
    });

    it(`tokenize_15`, () => {
        let toks = new tokens(`"some string
literal.";`);

        expect(toks.stringify()).toBe(`"some string\nliteral.";`);
        expect(toks.length).toBe(2);
        expect(toks.back.prev.loc.line).toBe(1);
        expect(toks.back.loc.line).toBe(2);
    });

    it(`tokenize_16`, () => {
        let toks = new tokens(`A(B,C,D)`);

        expect(toks.stringify()).toBe(`A ( B , C , D )`);
        expect(toks.length).toBe(8);
        expect(toks.back.prev.loc.line).toBe(1);
        expect(toks.back.loc.line).toBe(1);
    });

    it(`tokenize_17`, () => {
        let toks = new tokens(`A(B,C,D)`);

        expect(toks.stringify()).toBe(`A ( B , C , D )`);
        expect(toks.length).toBe(8);
        expect(toks.back.prev.loc.line).toBe(1);
        expect(toks.back.loc.line).toBe(1);
        expect(toks.back.loc.file).toBe(-1);
    });

    it(`tokenize_18`, () => {
        let toks = new tokens(`A(fmt...)`);
        expect(toks.stringify()).toBe(`A ( fmt... )`);
        expect(toks.length).toBe(4);
    });

    it(`tokenize_19`, () => {
        let toks = new tokens(`#error FOO is enabled\n#else`);
        expect(toks.stringify()).toBe(`# error FOO is enabled\n# else`);
    });

    it(`tokenize_20`, () => {
        let toks = new tokens(`#include "./include/include_2.h"\n`);
        expect(toks.stringify()).toBe(`# include "./include/include_2.h"`);
    });

    it(`tokenize_21`, () => {
        let toks = new tokens(`#include "./include/include_2.h"\nglue(1,2,3,4)\n`);
        expect(toks.stringify()).toBe(`# include "./include/include_2.h"\nglue ( 1 , 2 , 3 , 4 )`);

        let line = toks.line_expr(toks.front);
        expect(line.stringify()).toBe(`# include "./include/include_2.h"`);

        line = toks.line_expr(toks.front.next);
        expect(line.stringify()).toBe(`# include "./include/include_2.h"`);

        line = toks.line_expr(toks.front.next.next);
        expect(line.stringify()).toBe(`# include "./include/include_2.h"`);
    });

    it(`tokenize_22`, () => {
        const toks0 = new tokens(`u8"hello world!"`, `main.lsl`);
        expect(toks0.stringify()).toBe(`u8"hello world!"`);
    });

    it(`tokenize_23`, () => {
        const toks0 = new tokens(`++a`, `main.lsl`);
        expect(toks0.stringify()).toBe(`++ a`);
    });

    it(`tokenize_24`, () => {
        const toks0 = new tokens(`int /*`, `main.lsl`);
        expect(toks0.stringify()).toBe(`int /*`);
    });

    it(`tokenize_25`, () => {
        const toks0 = new tokens(`#if 0\n'\n#endif\nPOP`, `main.lsl`);
        expect(toks0.stringify()).toBe(`\n\n\nPOP`);
    });

    it(`tokenize_26`, () => {
        let toks0 = new tokens(`u8"a猫🍌"`);
        test_tokens(toks0, [`u8"a猫🍌"`]);
    });

    it(`tokenize_27`, () => {
        let toks0 = new tokens(`u"a猫🍌"`);
        test_tokens(toks0, [`u"a猫🍌"`]);
    });

    it(`tokenize_28`, () => {
        let toks0 = new tokens(`U"a猫🍌"`);
        test_tokens(toks0, [`U"a猫🍌"`]);
    });

    it(`tokenize_29`, () => {
        let toks0 = new tokens(`L"a猫🍌"`);
        test_tokens(toks0, [`L"a猫🍌"`]);
    });

    it(`tokenize_30`, () => {
        let toks0 = new tokens(`u8R"--(a猫🍌)--"`);
        test_tokens(toks0, [`u8"a猫🍌"`]);
    });

    it(`tokenize_31`, () => {
        let toks0 = new tokens(`let a=0;`);
        test_tokens(toks0, [`let`, `a`, `=`, `0`, `;`]);
        expect(toks0.back.flag).toBe(flag.SYMBOL_FLAG);
    });

    it(`tokenize_32`, () => {
        let toks0 = new tokens(`/*// something;\n*/`);
        test_tokens(toks0, [`/*// something; */`]);
        expect(toks0.front.flag).toBe(flag.COMMENT_FLAG);
    });

    it(`tokenize_33`, () => {
        let toks0 = new tokens(`0x1.FFFFFEp+62`);
        test_tokens(toks0, [`0x1.FFFFFEp+62`]);
        expect(toks0.front.flag).toBe(flag.NUMBER_FLAG);
    });

    it(`tokenize_34`, () => {
        let toks0 = new tokens(`"\\"test\\""`);
        //console.log(toks0.stringify());
        test_tokens(toks0, [`"\\"test\\""`]);
        expect(toks0.front.flag).toBe(flag.STRING_FLAG);
    });

    it(`tokenize_35`, () => {
        let toks0 = new tokens(`("\\"test\\"")`);
        //console.log(toks0.stringify());
        test_tokens(toks0, [`(`, `"\\"test\\""`, `)`]);
        //expect(toks0.front.flag).toBe(flag.STRING_FLAG);
    });

    it(`combine_operators_00`, () => {
        let toks = new tokens(`func(...)`);

        expect(toks.stringify()).toBe(`func ( ... )`);
        expect(toks.length).toBe(4);
    });

    it(`combine_operators_01`, () => {
        let toks = new tokens(`2.5f`);

        expect(toks.stringify()).toBe(`2.5f`);
        expect(toks.length).toBe(1);
    });

    it(`combine_operators_02`, () => {
        let toks = new tokens(`1.`);
        expect(toks.stringify()).toBe(`1.`);
        expect(toks.length).toBe(1);
    });

    it(`combine_operators_03`, () => {
        let toks = new tokens(`1.f`);
        expect(toks.stringify()).toBe(`1.f`);
        expect(toks.length).toBe(1);
    });

    it(`combine_operators_04`, () => {
        let toks = new tokens(`.1f`);
        expect(toks.stringify()).toBe(`.1f`);
        expect(toks.length).toBe(1);
    });

    it(`combine_operators_05`, () => {
        let toks = new tokens(`3.1`);
        expect(toks.stringify()).toBe(`3.1`);
        expect(toks.length).toBe(1);
    });

    it(`combine_operators_06`, () => {
        let toks = new tokens(`1E7`);
        expect(toks.stringify()).toBe(`1E7`);
        expect(toks.length).toBe(1);
    });

    it(`combine_operators_07`, () => {
        let toks = new tokens(`1E+7`);
        expect(toks.stringify()).toBe(`1E+7`);
        expect(toks.length).toBe(1);
    });

    it(`combine_operators_08`, () => {
        let toks = new tokens(`1.e+7`);
        expect(toks.stringify()).toBe(`1.e+7`);
        expect(toks.length).toBe(1);
    });

    it(`combine_operators_09`, () => {
        let toks = new tokens(`0x1E+7`);
        expect(toks.stringify()).toBe(`0x1E+7`);
        expect(toks.length).toBe(1);
    });

    it(`combine_operators_10`, () => {
        let toks = new tokens(`0x1ffp10`);
        expect(toks.stringify()).toBe(`0x1ffp10`);
        expect(toks.length).toBe(1);
    });

    it(`combine_operators_11`, () => {
        let toks = new tokens(`0x0p-1`);
        expect(toks.stringify()).toBe(`0x0p-1`);
        expect(toks.length).toBe(1);
    });

    it(`combine_operators_12`, () => {
        let toks = new tokens(`0x1.p0`);
        expect(toks.stringify()).toBe(`0x1.p0`);
        expect(toks.length).toBe(1);
    });

    it(`combine_operators_13`, () => {
        let toks = new tokens(`0xf.p-1`);
        expect(toks.stringify()).toBe(`0xf.p-1`);
        expect(toks.length).toBe(1);
    });

    it(`combine_operators_14`, () => {
        let toks = new tokens(`0x1.2p3`);
        expect(toks.stringify()).toBe(`0x1.2p3`);
        expect(toks.length).toBe(1);
    });

    it(`combine_operators_15`, () => {
        let toks = new tokens(`0x1.ap3`);
        expect(toks.stringify()).toBe(`0x1.ap3`);
        expect(toks.length).toBe(1);
    });

    it(`combine_operators_16`, () => {
        let toks = new tokens(`0x1.2ap3`);
        expect(toks.stringify()).toBe(`0x1.2ap3`);
        expect(toks.length).toBe(1);
    });

    it(`combine_operators_17`, () => {
        let toks = new tokens(`0x1p+3`);
        expect(toks.stringify()).toBe(`0x1p+3`);
        expect(toks.length).toBe(1);
    });

    it(`combine_operators_18`, () => {
        let toks = new tokens(`0x1p+3f`);
        expect(toks.stringify()).toBe(`0x1p+3f`);
        expect(toks.length).toBe(1);
    });

    it(`combine_operators_19`, () => {
        let toks = new tokens(`0x1p+3L`);
        expect(toks.stringify()).toBe(`0x1p+3L`);
        expect(toks.length).toBe(1);
    });

    it(`combine_operators_20`, () => {
        let toks = new tokens(`1p+3`);
        expect(toks.stringify()).toBe(`1p+3`);
        expect(toks.length).toBe(1);
    });

    it(`combine_operators_21`, () => {
        let toks = new tokens(`;++x;`);
        expect(toks.stringify()).toBe(`; ++ x ;`);
        expect(toks.length).toBe(4);
    });

    it(`combine_operators_22`, () => {
        let toks = new tokens(`;x++;`);
        expect(toks.stringify()).toBe(`; x ++ ;`);
        expect(toks.length).toBe(4);
    });

    it(`combine_operators_23`, () => {
        let toks = new tokens(`1++2`);
        expect(toks.stringify()).toBe(`1 + + 2`);
        expect(toks.length).toBe(4);
    });

    it(`combine_operators_24`, () => {
        let toks = new tokens(`x ? y : ::z`);
        expect(toks.stringify()).toBe(`x ? y : :: z`);
        expect(toks.length).toBe(6);
    });

    it(`combine_operators_25`, () => {
        let toks = new tokens(`x &= 2;`);
        expect(toks.stringify()).toBe(`x &= 2 ;`);
        expect(toks.length).toBe(4);
    });

    it(`combine_operators_26`, () => {
        let toks = new tokens(`void f(x &= 2);`);
        expect(toks.stringify()).toBe(`void f ( x &= 2 ) ;`);
        expect(toks.length).toBe(8);
    });

    it(`combine_operators_27`, () => {
        let toks = new tokens(`f(x &= 2);`);
        expect(toks.stringify()).toBe(`f ( x &= 2 ) ;`);
        expect(toks.length).toBe(7);
    });

    it(`combine_operators_28`, () => {
        let toks = new tokens(`a##a`);
        expect(toks.stringify()).toBe(`a ## a`);
        expect(toks.length).toBe(3);
    });

    it(`take_00`, () => {
        let toks0 = new tokens(`a b`);
        let toks1 = new tokens(`c d`);
        toks0.take(toks1);
        expect(toks0.stringify()).toBe(`a b c d`);
        expect(toks0.front.prev).toBe(undefined);
        expect(toks0.back.next).toBe(undefined);

        expect(toks1.front).toBe(undefined);
        expect(toks1.back).toBe(undefined);
    });

    it(`take_01`, () => {
        let toks0 = new tokens(`a b c`);
        let toks1 = new tokens(`d e f`);
        toks0.take(toks1, toks1.front.next);
        expect(toks0.stringify()).toBe(`a b c e f`);
        expect(toks1.stringify()).toBe(`d`);

        expect(toks0.front.prev).toBe(undefined);
        expect(toks0.back.next).toBe(undefined);

        expect(toks1.front).toBe(toks1.back);
        expect(toks1.front.prev).toBe(undefined);
        expect(toks1.back.next).toBe(undefined);
    });

    it(`take_02`, () => {
        let toks0 = new tokens(`a b c`);
        let toks1 = new tokens(`d e f`);
        toks0.take(toks1, toks1.front.next, toks1.back.prev);
        expect(toks0.stringify()).toBe(`a b c e`);
        expect(toks1.stringify()).toBe(`d f`);

        expect(toks0.front.prev).toBe(undefined);
        expect(toks0.back.next).toBe(undefined);
    });

    it(`take_03`, () => {
        let toks0 = new tokens();
        let toks1 = new tokens(`d e f`);
        toks0.take(toks1);
        expect(toks0.stringify()).toBe(`d e f`);

        expect(toks0.front.prev).toBe(undefined);
        expect(toks0.back.next).toBe(undefined);
    });

    it(`take_04`, () => {
        let toks0 = new tokens(`A`);
        let toks1 = new tokens(`A`);
        toks0.take(toks1);
        expect(toks0.stringify()).toBe(`A A`);
        expect(toks1.stringify()).toBe(``);

        expect(toks0.front.prev).toBe(undefined);
        expect(toks0.back.next).toBe(undefined);
    });

    it(`take_05`, () => {
        let toks0 = new tokens(`integer vvv;x(){;}default{timer(){x();}}`);
        let toks1 = new tokens(``);

        toks1.take(toks0, toks0.front, toks0.front.next.next);
        expect(toks0.stringify()).toBe(`x ( ) { ; } default { timer ( ) { x ( ) ; } }`);
        expect(toks1.stringify()).toBe(`integer vvv ;`);
    });

    it(`copy_00`, () => {
        let toks0 = new tokens(`A`, `main.js`);
        expect(toks0.stringify()).toBe(`A`);

        let toks1 = new tokens();
        toks1.copy(toks0);

        expect(toks1.stringify()).toBe(`A`);
    });

});


describe("tokens class", () => {

    describe("constructor", () => {
        it("should create an instance with empty file and tokens when no arguments are provided", () => {
            const t = new tokens();
            expect(t.file).toBe("");
            expect(t.front).toBeUndefined();
        });

        it("should create an instance and tokenize a string argument", () => {
            const t = new tokens("test string", "uri.js");
            //console.log(t);

            expect(t.file).toBe("uri.js");
            expect(t.front).toBeDefined();
        });

        it("should create an instance by copying from another tokens instance", () => {
            const t1 = new tokens("test string", "uri.js");
            const t2 = new tokens(t1);
            expect(t2.front).toBeDefined();
            expect(t2.file).toBe("uri.js");
        });

        it("should create an instance by copying from an expr instance", () => {
            const tok = new token("expr", new location());
            const e = new expr(tok, tok);
            const t = new tokens(e);
            expect(t.front).toBeDefined();
        });

        it("should throw an error if file is set to a non-string value", () => {
            const t = new tokens();
            expect(() => {
                t.file = 123;
            }).not.toThrow(new type_error("tokens.file: try to set tokens file to a: number"));
        });
    });

    describe("tokenize", () => {
        it("should tokenize a simple string", () => {
            const t = new tokens();
            const result = t.tokenize("simple string", "uri.lsl");
            expect(result).toBeTrue();
            expect(t.file).toBe("uri.lsl");
            expect(t.front).toBeDefined();
        });

        it("should handle multiline string with line continuation", () => {
            const t = new tokens();
            const result = t.tokenize("line 1\\\nline 2", "uri.lsl");
            expect(result).toBeTrue();
            expect(t.file).toBe("uri.lsl");
            expect(t.front).toBeDefined();
            expect(t.stringify()).toContain("line 1line 2");
        });

        it("should handle comments correctly", () => {
            const t = new tokens();
            const result = t.tokenize("code // comment", "uri.lsl");
            expect(result).toBeTrue();
            expect(t.file).toBe("uri.lsl");
            expect(t.front).toBeDefined();
            expect(t.stringify()).toContain("code");
            expect(t.stringify()).toContain("comment");
        });

        it("should handle multiline comments correctly", () => {
            const t = new tokens();
            const result = t.tokenize("code /* multiline\n comment */", "uri.lsl");
            expect(result).toBeTrue();
            expect(t.file).toBe("uri.lsl");
            expect(t.front).toBeDefined();
            expect(t.stringify()).toContain("code");
            expect(t.stringify()).toContain("comment");
        });

        it("should handle string literals correctly", () => {
            const t = new tokens();
            const result = t.tokenize('code "string literal"', "uri.lsl");
            expect(result).toBeTrue();
            expect(t.file).toBe("uri.lsl");
            expect(t.front).toBeDefined();
            expect(t.stringify()).toContain('code "string literal"');
        });

        it("should handle invalid characters by replacing them with spaces", () => {
            const t = new tokens();
            const result = t.tokenize("code \u0000 invalid", "uri.lsl");
            expect(result).toBeTrue();
            expect(t.file).toBe("uri.lsl");
            expect(t.front).toBeDefined();
            expect(t.stringify()).toContain("code invalid");
        });
    });

    describe("combine_operators", () => {
        it("should combine operators correctly", () => {
            const t = new tokens();
            t.tokenize("a ++ b", "uri");
            t.combine_operators();
            expect(t.stringify()).toContain("a ++ b");
        });

        it("should handle ellipsis correctly", () => {
            const t = new tokens();
            t.tokenize("...", "uri");
            t.combine_operators();
            expect(t.front.str).toBe("...");
        });

        it("should handle compound assignment operators correctly", () => {
            const t = new tokens();
            t.tokenize("a += b", "uri");
            t.combine_operators();
            expect(t.stringify()).toContain("a += b");
        });

        it("should handle preprocessor directives correctly", () => {
            const t = new tokens();
            t.tokenize("#if 0\ncode\n#endif", "uri");
            t.combine_operators();
            expect(t.stringify()).not.toContain("code");
        });
    });

    describe("push_back", () => {
        it("should add a single token", () => {
            const t = new tokens();
            const tok = new token("test", new location());
            t.push_back(tok);
            expect(t.front).toBe(tok);
        });

        it("should add tokens from another tokens object", () => {
            const t1 = new tokens("test string", "uri.lsl");
            const t2 = new tokens();
            t2.push_back(t1);
            expect(t2.front).toBeDefined();
            expect(t2.front.str).toBe("test");
        });

        it("should throw an error when adding an invalid token", () => {
            const t = new tokens();
            expect(() => {
                t.push_back("invalid token");
            }).toThrow(new type_error("tok is not an instance of token or expr."));
        });
    });

    describe("take", () => {
        it("should take a range of tokens from another tokens object", () => {
            const t1 = new tokens("test string", "uri.lsl");
            const t2 = new tokens();
            t2.take(t1, t1.front, t1.back);
            expect(t2.front).toBeDefined();
            expect(t2.front.str).toBe("test");
        });

        it("should throw an error when called on an empty tokens object", () => {
            const t1 = new tokens();
            const t2 = new tokens();
            expect(() => {
                t2.take(t1);
            }).toThrow(new error("function call on empty tokens."));
        });
    });

    describe("copy", () => {
        it("should copy a range of tokens from another tokens object", () => {
            const t1 = new tokens("test string", "uri.lsl");
            const t2 = new tokens();
            t2.copy(t1, t1.front, t1.back);
            expect(t2.front).toBeDefined();
            expect(t2.front.str).toBe("test");
        });

        it("should throw an error when copying from an invalid tokens object", () => {
            const t = new tokens();
            expect(() => {
                t.copy({}, null, null);
            }).toThrow(new error("Function call with bad parameters."));
        });
    });

    describe("stringify", () => {
        it("should convert tokens to a string", () => {
            const t = new tokens("test string", "uri.lsl");
            const result = t.stringify();
            expect(result).toContain("test string");
        });

        it("should handle empty tokens object", () => {
            const t = new tokens();
            const result = t.stringify();
            expect(result).toBe("");
        });

        it("should handle range of tokens", () => {
            const t = new tokens("test string", "uri.lsl");
            const result = t.stringify(t.front, t.front);
            expect(result).toContain("test");
        });
    });

    describe("remove_comments", () => {
        it("should remove comments from tokens object", () => {
            const t = new tokens("code // comment", "uri.lsl");
            t.remove_comments();
            expect(t.stringify()).toContain("code");
            expect(t.stringify()).not.toContain("comment");
        });

        it("should handle tokens object without comments", () => {
            const t = new tokens("code", "uri.lsl");
            t.remove_comments();
            expect(t.stringify()).toContain("code");
        });
    });
});

// Helper functions tests
xdescribe("fast_tokens_fact function", () => {
    it("should create tokens from an array of strings", () => {
        const t = fast_tokens_fact(["token1", "token2"]);
        expect(t.front).toBeDefined();
        expect(t.front.str).toBe("token1");
        expect(t.front.next.str).toBe("token2");
    });
});


