import { flag } from "../../lib/global.js";
import { expr } from "../../lib/source/expressions.js";
import { array_literal, vec_gen_literal } from "../../lib/source/literal.js";
import { location } from "../../lib/source/location.js";
import { token } from "../../lib/source/token.js";
import { test_tokens } from "../test.js";


const expr_push_back = (exp, tok) => {
    if (exp.empty()) {
        exp.front = tok;
        exp.back = tok;
    }
    else {
        exp.back.next = tok;
        tok.prev = exp.back;
    }
    exp.back = tok;
};

const make_expr = (arr) => {
    const loc = new location();
    const toks = new expr();

    for (const str of arr) {
        if (str !== `\n`) {
            const tok = new token(str, loc);
            expr_push_back(toks, tok);
        }
        loc.adjust(str);
    }
    return toks;
};

describe(`literal`, () => {


    it(`vec_gen_literal_00`, () => {
        let toks = make_expr([`let`, `a`, `=`, `<`, `1`, `,`, `1`, `,`, `1`, `>`, `;`]);
        const tok = toks.find_str(`<`);

        let ref = vec_gen_literal(tok, [3]);
        //console.log(ref);

        expect(tok.is(ref.back)).toBeFalse();
        
    });

    it(`vec_gen_literal_01`, async () => {
        let toks = make_expr([`<`, `1`, `,`, `1`, `,`, `1`, `,`, `1`, `>`]);

        let ref = vec_gen_literal(toks.front, [4]);
        expect(toks.back.is(ref.back)).toBeTrue();

        ref = vec_gen_literal(toks.back, [4]);
        expect(toks.front.is(ref.front)).toBeTrue();
    });

    it(`vec_gen_literal_02`, async () => {
        let toks = make_expr([`<`, `1`, `,`, `foo`, `(`, `<`, `1`, `,`, `1`, `,`, `1`, `>`, `)`, `,`, `1`, `,`, `1`, `>`]);

        let ref = vec_gen_literal(toks.front, [4]);
        expect(Object.is(toks.back, ref.back)).toBeTrue();

        ref = vec_gen_literal(toks.back, [4]);
        expect(Object.is(toks.front, ref.front)).toBeTrue();
    });

    it(`vec_gen_literal_03`, async () => {
        let toks = make_expr([`<`, `1`, `,`, `a`, `<=`, `9`, `,`, `1`, `,`, `1`, `>`]);

        let ref = vec_gen_literal(toks.front, [4]);
        expect(ref).not.toBeFalse();
        expect(toks.back.is(ref.back)).toBeTrue();

        ref = vec_gen_literal(toks.back, [4]);
        expect(ref).not.toBeFalse();
        expect(toks.front.is(ref.front)).toBeTrue();
    });

    it(`vec_gen_literal_04`, async () => {
        let toks = make_expr([`func`, `(`, `<`, `0`, `,`, `0`, `,`, `5`, `>`, `,`, `[`, `4`, `,`, `5`, `,`, `a`, `>`, `9`, `]`, `)`, `;`]);

        const first_tok = toks.front.next.next;

        let ref = vec_gen_literal(first_tok, [3]);
        expect(Object.is(first_tok, ref.back)).toBeFalse();
    });

    it(`vec_gen_literal_05`, () => {
        let toks = make_expr([`llAbs`, `(`, `3`, `<`, `8`, `)`]);
        const first_tok = toks.front.next.next.next;
        //console.log(first_tok);

        let ref = vec_gen_literal(first_tok, [3]);
        expect(ref).toBeFalse();

    });

    it(`vec_gen_literal_06`, async () => {
        let toks = make_expr([`let`,`a`, `=`, `<`, `1`, `,`, `1`, `,`, `1`, `,`, `1`, `>`, `;`]);

        let ta = toks.back;
        while (ta.op != `>`) ta = ta.prev;
        //console.log(`vec: ${vec_gen_literal(ta, 3)}`);
        expect(vec_gen_literal(ta, [3])).toBeFalse();
        expect(vec_gen_literal(ta, [4]).str).toBe(`<1,1,1,1>`);

        ta = toks.front;
        while (ta.op != `<`) ta = ta.next;
        expect(vec_gen_literal(ta, [3])).toBeFalse();
        expect(vec_gen_literal(ta, [4]).str).toBe(`<1,1,1,1>`);
    });

    it(`vec_gen_literal_07`, async () => {
        let toks = make_expr([`vector`,`x`,`(`,`)`,`{`,`return`,`<`,`1`,`,`,`1`,`,`,`1`,`>`,`;`,`}`]);

        let ta = toks.find_str(`>`);
        expect(vec_gen_literal(ta).str).toBe(`<1,1,1>`);
    });

    // array_literal
    it(`array_literal_00`, async () => {
        let toks = make_expr([`let`,`a`,`=`,`[`,`1`,`,`,`1`,`,`,`1`,`,`,`1`,`]`,`;`]);
        expect(array_literal(toks.find_str(`]`)).str).toBe(`[1,1,1,1]`);
        expect(array_literal(toks.find_str(`[`)).str).toBe(`[1,1,1,1]`);
    });
    // 

    it(`array_literal_01`, async () => {
        let toks = make_expr([`let`,`a`,`=`,`[`,`0x21`,`,`,`<`,`-0.02`,`,`,`(`,`0.06125`,
        `)`,`*`,`3`,`,`,`-`,`(`,`(`,`(`,`0.016`,`)`,`+`,`0.042`,`)`,`-`,`(`,`0.032`,`)`,`-`,
        `0.005`,`)`,`>`,`]`,`;`]);
        expect(array_literal(toks.find_str(`]`)).str).toBe(`[0x21,<-0.02,(0.06125)*3,-(((0.016)+0.042)-(0.032)-0.005)>]`);
        expect(array_literal(toks.find_str(`[`)).str).toBe(`[0x21,<-0.02,(0.06125)*3,-(((0.016)+0.042)-(0.032)-0.005)>]`);
    });

    it(`array_literal_02`, async () => {
        let toks = make_expr([`list`,`a`,`;`,`list`,`b`,`;`,`a`,`=`,`[`,`22`,`,`,`33`,`]`,`+`,`[`,`]`,`;`]);
        expect(array_literal(toks.find_str_r(`]`)).str).toBe(`[]`);
        expect(array_literal(toks.find_str_r(`[`)).str).toBe(`[]`);

        expect(toks.find_str_r(`]`).flag & flag.LIST_CL_FLAG).toBe(flag.LIST_CL_FLAG);
        expect(toks.find_str_r(`[`).flag & flag.LIST_OP_FLAG).toBe(flag.LIST_OP_FLAG);
    });

    it(`array_literal_03`, async () => {
        const toks0 = make_expr([`list`, `a`, `;`, `list`, `b`, `;`, `a`, `=`, `[`, `22`, `,`, `33`, `]`, `+`, `[`, `]`, `;`]);
        test_tokens(toks0, [`list`, `a`, `;`, `list`, `b`, `;`, `a`, `=`, `[`, `22`, `,`, `33`, `]`, `+`, `[`, `]`, `;`]);

        //console.log(toks0.find_str_r(`]`));
        expect(array_literal(toks0.find_str_r(`]`)).str).toBe(`[]`);
        expect(array_literal(toks0.find_str_r(`[`)).str).toBe(`[]`);

        expect(toks0.find_str_r(`]`).flag & flag.LIST_CL_FLAG).toBe(flag.LIST_CL_FLAG);
        expect(toks0.find_str_r(`[`).flag & flag.LIST_OP_FLAG).toBe(flag.LIST_OP_FLAG);
    });

    xit(`error_00`, async () => { expect(true).toBeFalse(); });
});

xdescribe("Literal Functions Test Suite", () => {
    xdescribe("add_vec_tag", () => {
        it("should add VECTOR_OP_FLAG and VECTOR_CL_FLAG for numb 3", () => {
            const src = { front: { flag: 0 }, back: { flag: 0 } };
            const result = add_vec_tag(src, 3);
            expect(result.front.flag).toBe(flag.VECTOR_OP_FLAG);
            expect(result.back.flag).toBe(flag.VECTOR_CL_FLAG);
        });

        it("should add QUAT_OP_FLAG and QUAT_CL_FLAG for numb 4", () => {
            const src = { front: { flag: 0 }, back: { flag: 0 } };
            const result = add_vec_tag(src, 4);
            expect(result.front.flag).toBe(flag.QUAT_OP_FLAG);
            expect(result.back.flag).toBe(flag.QUAT_CL_FLAG);
        });

        it("should not modify flags for other numb values", () => {
            const src = { front: { flag: 0 }, back: { flag: 0 } };
            const result = add_vec_tag(src, 5);
            expect(result.front.flag).toBe(0);
            expect(result.back.flag).toBe(0);
        });
    });

    describe("vec_gen_literal", () => {
        let mockExpr;

        beforeEach(() => {
            mockExpr = jasmine.createSpy("expr").and.callFake((front, back) => ({ front, back }));
        });

        it("should return false if token is null or undefined", () => {
            expect(vec_gen_literal(null)).toBe(false);
            expect(vec_gen_literal(undefined)).toBe(false);
        });

        it("should return false if token.op is not '<' or '>'", () => {
            const tok = { op: '+', str: '+' };
            expect(vec_gen_literal(tok)).toBe(false);
        });

        it("should return false if token.op is '<' but prev token is ')'", () => {
            const tok = { op: '<', prev: { str: ')' } };
            expect(vec_gen_literal(tok)).toBe(false);
        });

        it("should generate expression correctly for vector literal", () => {
            const tok = { op: '<', str: '<', next: { op: '>', str: '>', flag: flag.SYMBOL_FLAG } };
            const result = vec_gen_literal(tok, [1, 2]);
            expect(result).toEqual(jasmine.objectContaining({ front: tok, back: tok.next }));
        });

        it("should return false for unmatched vector literal", () => {
            const tok = { op: '<', str: '<', next: { op: '}', str: '}', flag: flag.SYMBOL_FLAG } };
            expect(vec_gen_literal(tok, [1, 2])).toBe(false);
        });

        it("should handle nested vector literals correctly", () => {
            const tok = {
                op: '<', str: '<',
                next: {
                    op: '(', str: '(',
                    flag: flag.SYMBOL_FLAG,
                    next: { op: '>', str: '>', flag: flag.SYMBOL_FLAG }
                }
            };
            const result = vec_gen_literal(tok, [1, 2, 3]);
            expect(result).toEqual(jasmine.objectContaining({ front: tok, back: tok.next.next }));
        });

        it("should return false for improperly closed vector literal", () => {
            const tok = {
                op: '<', str: '<',
                next: {
                    op: '(', str: '(',
                    flag: flag.SYMBOL_FLAG,
                    next: { op: '}', str: '}', flag: flag.SYMBOL_FLAG }
                }
            };
            expect(vec_gen_literal(tok, [1, 2])).toBe(false);
        });
    });

    describe("array_literal", () => {
        it("should return false if token is null or undefined", () => {
            expect(array_literal(null)).toBe(false);
            expect(array_literal(undefined)).toBe(false);
        });

        it("should return false if token.op is not '[' or ']'", () => {
            const tok = { op: '+', str: '+' };
            expect(array_literal(tok)).toBe(false);
        });

        it("should return false if front and back tokens are the same", () => {
            const tok = { op: '[', str: '[', flag: flag.SYMBOL_FLAG };
            spyOn(expr, 'match').and.returnValue({ front: tok, back: tok });
            expect(array_literal(tok)).toBe(false);
        });

        it("should set LIST_OP_FLAG and LIST_CL_FLAG for valid array literal", () => {
            const tok = { op: '[', str: '[', flag: flag.SYMBOL_FLAG };
            const backTok = { op: ']', str: ']', flag: flag.SYMBOL_FLAG };
            spyOn(expr, 'match').and.returnValue({ front: tok, back: backTok });
            const result = array_literal(tok);
            expect(result.front.flag).toBe(flag.LIST_OP_FLAG);
            expect(result.back.flag).toBe(flag.LIST_CL_FLAG);
        });
    });
});

