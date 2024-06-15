import { flag } from "../../lib/global.js";
import { expr } from "../../lib/source/expressions.js";
import { location } from "../../lib/source/location.js";
import { operator } from "../../lib/source/operator.js";
import { token } from "../../lib/source/token.js";


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

describe(`lsl_operator`, () => {


    it(`operator_00`, () => {
        expect(true).toBe(true);
    });

    it(`is_neg_op_00`, async () => {
        const toks0 = make_expr([`-`, `1`]);
        expect(operator.is_neg_op(toks0.front)).toBeTrue();
        expect(toks0.front.flag & flag.SYMBOL_FLAG).toBe(flag.SYMBOL_FLAG);
        expect(toks0.front.next).toBeDefined();
        expect(toks0.front.next.flag & flag.NUMBER_FLAG).toBe(flag.NUMBER_FLAG);
    });


    it(`is_neg_op_02`, async () => {
        const toks0 = make_expr([`llAbs`, `(`, `4`, `)`, `-`, `1`]);
        let tok = toks0.find_str(`-`);
        expect(operator.is_neg_op(tok)).toBeFalse();
        expect(tok.flag & flag.SYMBOL_FLAG).toBe(flag.SYMBOL_FLAG);

    });

    it(`is_neg_op_02`, async () => {
        const toks0 = make_expr([`float`, `a`, `;`, `(string)`, `-`, `a`]);
        toks0.find_str(`(string)`).flag = flag.CASTING_FLAG;

        let tok = toks0.find_str(`-`);
        expect(operator.is_neg_op(tok)).toBeTrue();
    });

    it(`is_neg_op_03`, async () => {
        const toks0 = make_expr([`<`, `1`, `,`, `1`, `,`, `1`, `>`, `-`, `<`, `1`, `,`, `1`, `,`, `1`, `>`]);
        toks0.find_str(`>`).flag = flag.VECTOR_CL_FLAG;

        const tok = toks0.find_str(`-`);
        expect(operator.is_neg_op(tok)).toBeFalse();
    });

    it(`is_neg_op_04`, async () => {
        const toks0 = make_expr([`integer`, `x`, `(`, `)`, `{`, `return`, `-`, `1`, `;`, `}`]);
        toks0.find_str(`return`).flag = flag.CONTROL_FLAG;

        const tok = toks0.find_str(`-`);
        expect(operator.is_neg_op(tok)).toBeTrue();
    });

    it(`is_unary_op_00`, async () => {
        const toks0 = make_expr([`f`, `(`, `)`, `{`, `!`, `""`, `;`, `}`]);
        let tok = toks0.find_str(`!`);
        expect(operator.is_unary_op(tok)).toBeTrue();
    });

    it(`is_unary_op_01`, async () => {
        const toks0 = make_expr([`-`, `1`]);
        expect(operator.is_unary_op(toks0.front)).toBeTrue();
    });

    it(`is_unary_op_02`, async () => {
        const toks0 = make_expr([`llAbs`, `(`, `4`, `)`, `-`, `1`]);

        let tok = toks0.find_str(`-`);
        expect(operator.is_unary_op(tok)).toBeFalse();
    });

    it(`is_unary_op_03`, async () => {
        const toks0 = make_expr([`(string)`, `-`, `a`]);

        let tok = toks0.find_str(`-`);
        expect(operator.is_unary_op(tok)).toBeFalse();
    });

    it(`is_unary_op_04`, async () => {
        const toks0 = make_expr([`integer`, `a`, `;`, `integer`, `b`, `;`, `integer`, `c`, `;`, `d`, 
        `(`, `)`, `{`, `if`, `(`, `(`, `a`, `&&`, `!`, `b`, `)`, `||`, `c`, `)`, `{`, `;`, `}`, `}`]);
        const tok = toks0.find_str(`!`);

        expect(operator.is_unary_op(tok)).toBeTrue();
    });



    it(`fwd_skip_unary_op_00`, async () => {
        const toks0 = make_expr([`~`, `-`, `~`, `-`, `~`, `a`, `;`]);

        let tok = operator.skip_unary_op(toks0.front);
        expect(tok.str).toBe(`~`);
        expect(tok.next.str).toBe(`a`);
    });

    it(`fwd_skip_unary_op_01`, async () => {
        const toks0 = make_expr([`!`, `-`, `a`, `;`]);
        let tok = operator.skip_unary_op(toks0.front);
        expect(tok.str).toBe(`-`);
        expect(tok.next.str).toBe(`a`);
    });

    xit(`error_00`, async () => { expect(true).toBeFalse(); });
});

describe("operator class", () => {
    let tokNeg, tokUnary1, tokUnary2, tokSymbol, tokCloseParen, tokNext, tokPrev;
    const loc = new location()

    beforeEach(() => {
        tokNeg = new token('-', loc);
        tokUnary1 = new token('!', loc);
        tokUnary2 = new token('~', loc);
        tokSymbol = new token('+', loc);
        tokCloseParen = new token(')', loc);
        tokNext = new token('-', loc);
        tokPrev = new token('x', loc);

        tokNeg.next = tokNext;
        tokNeg.prev = tokPrev;

        tokUnary1.next = tokUnary2;
        tokUnary2.prev = tokUnary1;

        tokNext.prev = tokNeg;
        tokPrev.next = tokNeg;
    });

    describe("is_neg_op method", () => {
        it("should return false for a null token", () => {
            expect(operator.is_neg_op(null)).toBe(false);
        });

        it("should return false for a non-negative operator", () => {
            expect(operator.is_neg_op(tokUnary1)).toBe(false);
        });

        it("should return true for a negative operator with no previous token", () => {
            tokNeg.clear_prev();
            expect(operator.is_neg_op(tokNeg)).toBe(true);
        });

        it("should return false for a negative operator preceded by a closing parenthesis", () => {
            tokNeg.prev = tokCloseParen;
            expect(operator.is_neg_op(tokNeg)).toBe(false);
        });

        it("should return false for a negative operator preceded by a vector or quaternion close flag", () => {
            tokPrev.flag = flag.VECTOR_CL_FLAG;
            expect(operator.is_neg_op(tokNeg)).toBe(false);
            tokPrev.flag = flag.QUAT_CL_FLAG;
            expect(operator.is_neg_op(tokNeg)).toBe(false);
        });

        it("should return true for a negative operator preceded by a symbol flag", () => {
            tokNeg.prev.flag = flag.SYMBOL_FLAG;
            expect(operator.is_neg_op(tokNeg)).toBe(true);
        });

        it("should return true for a negative operator preceded by a casting flag", () => {
            tokPrev.flag = flag.CASTING_FLAG;
            expect(operator.is_neg_op(tokNeg)).toBe(true);
        });

        it("should return true for a negative operator preceded by a control flag", () => {
            tokPrev.flag = flag.CONTROL_FLAG;
            expect(operator.is_neg_op(tokNeg)).toBe(true);
        });
    });

    describe("is_unary_op method", () => {
        it("should return false for a null token", () => {
            expect(operator.is_unary_op(null)).toBe(false);
        });

        it("should return false for a non-unary operator", () => {
            expect(operator.is_unary_op(tokSymbol)).toBe(false);
        });

        it("should return true for a unary operator '!'", () => {
            expect(operator.is_unary_op(tokUnary1)).toBe(true);
        });

        it("should return true for a unary operator '~'", () => {
            expect(operator.is_unary_op(tokUnary2)).toBe(true);
        });

        it("should return false for a negative operator that is not unary", () => {
            expect(operator.is_unary_op(tokNeg)).toBe(false);
        });

        it("should return true for a negative operator that is unary", () => {
            tokNeg.clear_prev();
            expect(operator.is_unary_op(tokNeg)).toBe(true);
        });
    });

    describe("skip_unary_op method", () => {
        it(`fwd_skip_unary_op_00`, () => {
            const toks0 = make_expr([`~`, `-`, `~`, `-`, `~`, `a`, `;`]);
            let tok = operator.skip_unary_op(toks0.front);
            expect(tok.str).toBe(`~`);
            expect(tok.next.str).toBe(`a`);
        });

        it(`fwd_skip_unary_op_01`, () => {
            const toks0 = make_expr([`!`, `-`, `a`, `;`]);
            let tok = operator.skip_unary_op(toks0.front);
            expect(tok.str).toBe(`-`);
            expect(tok.next.str).toBe(`a`);
        });

        it("should return the same token if it's not a unary operator", () => {
            const tok0 = make_expr([`-`, `-`, `b`]);
            const tok = operator.skip_unary_op(tok0.front);
            expect(tok.str).toBe(`-`);
            expect(tok.next.str).toBe(`b`);
        });

        it("should skip unary operators in the forward direction", () => {
            const toks0 = make_expr([`~`, `-`, `~`, `-`, `~`, `a`, `;`]);

            const tok = operator.skip_unary_op(toks0.front);
            expect(tok.str).toBe(`~`);
            expect(tok.next.str).toBe(`a`);

        });

        it("should skip unary operators in the backward direction", () => {
            const toks0 = make_expr([`~`, `-`, `~`, `-`, `~`, `a`, `;`]);
            const tok = operator.skip_unary_op(toks0.back.prev.prev, `bwd`);
            expect(tok.str).toBe(`~`);
            expect(tok.loc.col).toBe(0);
            expect(tok.next.str).toBe(`-`);
        });

        it("should return the same token if direction is not specified or invalid", () => {
            const toks0 = make_expr([`~`, `-`, `~`, `-`, `~`, `a`, `;`]);
            const tok = operator.skip_unary_op(toks0.back, `invalid`);
            expect(tok.str).toBe(`;`);
            expect(tok.loc.col).toBe(6);
        });
    });
});
