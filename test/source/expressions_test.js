import { type_error } from "../../lib/error.js";
import { expr } from "../../lib/source/expressions.js";
import { location } from "../../lib/source/location.js";
import { message } from "../../lib/source/message.js";
import { token } from "../../lib/source/token.js";
import { tokens } from "../../lib/source/tokens.js";
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

// console.log(string.printable(toks0.str));

describe(`expressions`, () => {
    afterEach(() => {
        message.print();
        message.clear();
    });

    //it('fail', () => { expect(false).toBeTrue();});

    it(`back_00`, () => {
        let toks = new expr();
        expect(toks.back).toBe(undefined);
    });

    it(`str_00`, () => {
        const ref0 = make_expr([`a`, `b`, `c`, `d`]);
        expect(ref0.str).toBe(`abcd`);
        expect(ref0.stringify()).toBe(`a b c d`);
    });

    it(`str_01`, () => {
        const ref0 = make_expr([`1`, `+`, `2`, `+`, `3`]);
        //console.log(ref0.str);
        expect(ref0.str).toBe(`1+2+3`);
        expect(ref0.stringify()).toBe(`1 + 2 + 3`);
    });

    it(`empty_00`, () => {
        const toks = new expr();
        expect(toks.empty()).toBeTrue();
    });

    it(`clear_00`, () => {
        const ref0 = make_expr([`1`, `+`, `2`, `+`, `3`]);
        ref0.clear();
        expect(ref0.empty()).toBeTrue();
    });

    it(`last_line_00`, () => {
        const toks = new expr();
        expect(toks.last_line()).toBe(``);
    });

    it(`last_line_01`, () => {
        const ref0 = make_expr([`some`, `line`, `.`]);
        expect(ref0.last_line()).toBe(`some line .`);
    });

    it(`last_line_02`, () => {
        const toks = make_expr([`#`, `line`, `"main.js"`, `:`, `3`]);
        expect(toks.last_line()).toBe(`# line %str% : %num%`);
    });

    it(`last_line_03`, () => {
        const toks = make_expr([`#`, `error`, `.`]);
        expect(toks.last_line()).toBe(`# error .`);
    });

    it(`contains_00`, () => {
        const toks = new expr();
        expect(toks.contains(new token())).toBeFalse();
    });

    it(`contains_01`, () => {
        const loc = new location();
        const toks = new expr();

        const ta = new token(`#`, loc);
        expr_push_back(toks, ta);
        loc.adjust(ta.str);

        const tb = new token(`warning`, loc);
        expr_push_back(toks, tb);
        loc.adjust(tb.str);

        const tc = new token(`...`, loc);
        expr_push_back(toks, tc);
        loc.adjust(tc.str);

        expect(toks.contains(new token())).toBeFalse();
        expect(toks.contains(ta)).toBeTrue();
        expect(toks.contains(tb)).toBeTrue();
        expect(toks.contains(tc)).toBeTrue();
    });

    it(`delete_token_00`, () => {
        const loc = new location();
        const toks = new expr();

        const ta = new token(`#`, loc);
        expr_push_back(toks, ta);
        loc.adjust(ta.str);

        const tb = new token(`warning`, loc);
        expr_push_back(toks, tb);
        loc.adjust(tb.str);

        const tc = new token(`...`, loc);
        expr_push_back(toks, tc);
        loc.adjust(tc.str);

        expect(Object.is(toks.front, ta)).toBeTrue();
        expect(Object.is(toks.back, tc)).toBeTrue();

        expect(toks.contains(ta)).toBeTrue();
        toks.delete_token(ta);
        expect(toks.contains(ta)).toBeFalse();
        expect(Object.is(toks.front, tb)).toBeTrue();

        expect(toks.contains(tc)).toBeTrue();
        toks.delete_token(tc);
        expect(toks.contains(tc)).toBeFalse();
        expect(Object.is(toks.back, tb)).toBeTrue();
    });

    it(`line_expr_00`, () => {
        const toks0 = make_expr([`line `, `1`, `;`, `\n`, `line `, `2`, `;`, `\n`, `line `, `3`, `;`]);


        expect(toks0.str).toBe(`line 1;\n line 2;\n line 3;`);

        let line_0 = toks0.line_expr(toks0.front);
        expect(line_0.str).toBe(`line 1;`);

        let line_1 = toks0.line_expr(toks0.front.next.next.next);
        expect(line_1.str).toBe(`line 2;`);

        let line_2 = toks0.line_expr(toks0.back);
        expect(line_2.str).toBe(`line 3;`);

        let line_3 = toks0.line_expr(toks0.back.prev.prev.prev);
        expect(line_3.str).toBe(`line 2;`);
    });

    it(`delete_tokens_00`, () => {
        const toks0 = make_expr([`line `, `0`, `;`, `\n`, `line `, `1`, `;`, `\n`, `line `, `2`, `;`]);
        expect(toks0.str).toBe(`line 0;\n line 1;\n line 2;`);

        toks0.delete_tokens(toks0.line_expr(toks0.front.next.next.next));
        //console.log(string.printable(toks0.str));
        expect(toks0.str).toBe(`line 0;\n\n line 2;`);
    });

    it(`delete_tokens_01`, () => {
        const toks0 = make_expr([`line `, `0`, `;`, `\n`, `line `, `1`, `;`, `\n`, `line `, `2`, `;`]);
        expect(toks0.str).toBe(`line 0;\n line 1;\n line 2;`);

        toks0.delete_tokens(toks0.line_expr(toks0.front));
        expect(toks0.str).toBe(`line 1;\n line 2;`);

        toks0.delete_tokens(toks0.line_expr(toks0.front));
        expect(toks0.str).toBe(`line 2;`);

        toks0.delete_tokens(toks0.line_expr(toks0.front));
        expect(toks0.str).toBe(``);

        // console.log(string.printable(toks0.str));
    });

    it(`delete_tokens_02`, () => {
        const toks0 = make_expr([`line `, `0`, `;`, `\n`, `line `, `1`, `;`, `\n`, `line `, `2`, `;`]);
        expect(toks0.str).toBe(`line 0;\n line 1;\n line 2;`);

        toks0.delete_tokens(toks0.line_expr(toks0.back));
        expect(toks0.str).toBe(`line 0;\n line 1;`);

        toks0.delete_tokens(toks0.line_expr(toks0.back));
        expect(toks0.str).toBe(`line 0;`);

        toks0.delete_tokens(toks0.line_expr(toks0.back));
        expect(toks0.str).toBe(``);
    });

    it(`swap_00`, () => {
        let toks0 = make_expr([`a`]);
        let toks1 = make_expr([`b`]);

        toks0.swap(toks1);
        expect(toks0.str).toBe(`b`);
    });

    it(`swap_03`, () => {
        let toks0 = make_expr([`a`, `b`, `c`]);
        let toks1 = make_expr([`d`, `e`, `f`]);

        toks0.swap(toks1);
        expect(toks0.str).toBe(`def`);
    });

    it(`replace_00`, () => {
        let toks0 = make_expr([`a`]);
        let toks1 = make_expr([`b`]);

        toks0.replace(toks0.front, toks0.back, toks1);
        expect(toks0.stringify()).toBe(`b`);
    });

    it(`replace_02`, () => {
        let toks0 = make_expr([`a`, `b`, `c`, `d`]);
        let toks1 = make_expr([`e`]);

        toks0.replace(toks0.front.next, toks0.back.prev, toks1);
        expect(toks0.str).toBe(`a e  d`);
    });

    it(`replace_03`, () => {
        let toks0 = make_expr([`a`, `b`, `c`, `d`]);
        let toks1 = make_expr([`e`]);

        toks0.replace(new expr(toks0.front.next, toks0.back.prev), toks1);
        expect(toks0.str).toBe(`a e  d`);
    });

    it(`replace_04`, () => {
        let toks0 = make_expr([`a`, `b`, `c`, `d`]);
        let toks1 = make_expr([`e`]);

        toks0.replace(toks0.front, toks0.back.prev, toks1);
        expect(toks0.str).toBe(`e  d`);
    });

    it(`replace_05`, () => {
        let toks0 = make_expr([`a`, `b`, `c`, `d`]);
        let toks1 = make_expr([`e`]);

        toks0.replace(new expr(toks0.front, toks0.back.prev), toks1);
        expect(toks0.stringify()).toBe(`e d`);
    });

    it(`replace_06`, () => {
        let toks0 = make_expr([`a`, `b`, `c`, `d`]);
        let toks1 = make_expr([`e`]);

        toks0.replace(toks0.front.next, toks0.back, toks1);
        expect(toks0.stringify()).toBe(`a e`);
    });

    it(`replace_07`, () => {
        let toks0 = make_expr([`a`, `b`, `c`, `d`]);
        let toks1 = make_expr([`e`]);

        toks0.replace(new expr(toks0.front.next, toks0.back), toks1);
        expect(toks0.stringify()).toBe(`a e`);
    });

    it(`replace_08`, () => {
        let toks0 = make_expr([`a`, `b`, `c`, `d`]);

        toks0.replace(new expr(toks0.front.next, toks0.back.prev), new expr());
        expect(toks0.stringify()).toBe(`a d`);
    });

    it(`rest_of_line_00`, () => {
        let toks0 = make_expr([`line `, `1`, `;`, `\n`, `line `, `2`, `;`, `\n`, `line `, `3`, `;`]);
        expect(expr.rest_of_line(toks0.front).str).toBe(`line 1`);
    });

    it('str_00', () => {
        let toks0 = make_expr([`a `, `b `, `c `, `d`]);
        expect(toks0.str).toBe(`a b c d`);
    });

    it(`match_01`, async () => { // match
        let toks0 = make_expr([`(`, `a`, `+`, `b`, `*`, `7`, `)`]);
        const m0 = expr.match(toks0.front);

        expect(m0.front.str).toBe(`(`);
        expect(m0.back.str).toBe(`)`);
    });

    it(`match_02`, async () => { // match
        let toks0 = make_expr([`(`, `a`, `+`, `b`, `*`, `7`, `)`]);
        const m0 = expr.match(toks0.back);

        expect(m0.front.str).toBe(`(`);
        expect(m0.back.str).toBe(`)`);
    });

    it(`match_03`, async () => { // match
        let toks0 = make_expr([`(`, `a`, `+`, `(`, `b`, `*`, `7`, `)`, `)`]);
        const m0 = expr.match(toks0.back);

        expect(m0.str).toBe(`(a+(b*7))`);
        expect(m0.front.str).toBe(`(`);
        expect(m0.back.str).toBe(`)`);
    });

    it(`match_04`, async () => { // match
        let toks0 = make_expr([`(`, `llAbs`, `(`, `(`, `integer`, `)`, `1`, `)`, `)`]);
        const m0 = expr.match(toks0.back);

        expect(m0.str).toBe(`(llAbs((integer)1))`);
        expect(m0.front.str).toBe(`(`);
        expect(m0.back.str).toBe(`)`);
    });

    it(`match_05`, async () => { // match
        let toks0 = make_expr([`(`, `(`, `llAbs`, `(`, `(`, `integer`, `)`, `1`, `)`, `)`, `==`, `1`, `)`]);
        const m0 = expr.match(toks0.find_str(`==`).prev);

        expect(m0.str).toBe(`(llAbs((integer)1))`);
        expect(m0.front.str).toBe(`(`);
        expect(m0.back.str).toBe(`)`);
    });

    it(`match_06`, async () => { // match
        let toks0 = make_expr([`func`, `(`, `a`, `,`, `b`, `,`, `c`, `)`, `{`, `func`, `(`, `1`, `,`, `(`, `2`, `)`, `,`, `3`, `)`, `;`, `}`]);

        const m0 = expr.match(toks0.front.next);
        expect(m0.str).toBe(`(a,b,c)`);

        const m1 = expr.match(toks0.back);
        expect(m1.str).toBe(`{func(1,(2),3);}`);
    });

    ////////////////////////////////////////////////////
    it(`match_07`, async () => {
        let toks0 = make_expr([`let`, `a`, `=`, `<`, `1`, `,`, `1`, `,`, `1`, `,`, `1`, `>`, `;`]);
        expect(expr.match(toks0.find_str(`>`)).str).toBe(`<1,1,1,1>`);
        expect(expr.match(toks0.find_str(`<`)).str).toBe(`<1,1,1,1>`);
    });


    it(`match_08`, async () => {
        let toks0 = make_expr([`<`, `1`, `,`, `foo`, `(`, `<`, `1`, `,`, `1`, `,`, `1`, `>`, `)`, `,`, `1`, `,`, `1`, `>`]);
        expect(expr.match(toks0.find_str(`<`)).str).toBe(`<1,foo(<1,1,1>),1,1>`);
        expect(expr.match(toks0.find_str(`(`)).str).toBe(`(<1,1,1>)`);
        expect(expr.match(toks0.find_str(`<`, toks0.front.next)).str).toBe(`<1,1,1>`);

        expect(expr.match(toks0.find_str_r(`>`)).str).toBe(`<1,foo(<1,1,1>),1,1>`);
        expect(expr.match(toks0.find_str_r(`)`)).str).toBe(`(<1,1,1>)`);
        expect(expr.match(toks0.find_str_r(`>`, toks0.back.prev)).str).toBe(`<1,1,1>`);
    });

    xit(`match_09`, async () => {
        let toks0 = make_expr([`<`, `1`, `,`, `a`, `<`, `=`, `9`, `,`, `1`, `,`, `1`, `>`]);
        //let toks0 = new tokens(`<1,a <= 9,1,1>`);
        expect(expr.match(toks0.find_str(`<`)).str).toBe(`<1,a <= 9,1,1>`);
        expect(expr.match(toks0.find_str_r(`>`)).str).toBe(`<1,a <= 9,1,1>`);
    });

    xit(`match_10`, async () => {
        const toks0 = new tokens(`func(<0,0,5>, [4,5,a > 9]);`);
        expect(expr.match(toks0.find_str(`(`)).str).toBe(`(<0,0,5>, [4,5,a > 9])`);
        expect(expr.match(toks0.find_str(`<`)).str).toBe(`<0,0,5>`);
        expect(expr.match(toks0.find_str(`[`)).str).toBe(`[4,5,a > 9]`);
    });

    xit(`match_11`, async () => {
        const toks0 = new tokens(`func(<0,0,5>, [4,5,a > 9]);`);
        expect(expr.match(toks0.find_str_r(`)`)).str).toBe(`(<0,0,5>, [4,5,a > 9])`);
        expect(expr.match(toks0.find_str_r(`]`)).str).toBe(`[4,5,a > 9]`);
        expect(expr.match(toks0.find_str_r(`>`, toks0.back.prev.prev.prev.prev.prev)).str).toBe(`<0,0,5>`);
    });

    xit(`match_12`, () => {
        const toks0 = new tokens(`llAbs(3<8)`);
        expect(expr.match(toks0.find_str(`(`)).str).toBe(`(3<8)`);
        expect(expr.match(toks0.back).str).toBe(`(3<8)`);

    });

    xit(`match_013`, () => {
        const toks0 = new tokens(`[]`);

        const expa = expr.match(toks0.front);
        test_tokens(expa, [`[`, `]`]);
        expect(expa.str).toBe(`[]`);


        const expb = expr.match(toks0.back);
        test_tokens(expb, [`[`, `]`]);
        expect(expb.str).toBe(`[]`);

    });


    xit(`error_00`, async () => { expect(true).toBeFalse(); });
});

describe('expr class', () => {
    let tok1, tok2, tok3, tok4, loc1, loc2, loc3, loc4, exprInstance;

    beforeEach(() => {
        loc1 = new location("file1", 1, 1);
        loc2 = new location("file1", 1, 2);
        loc3 = new location("file1", 2, 1);
        loc4 = new location("file1", 2, 2);

        tok1 = new token("a", loc1);
        tok2 = new token("b", loc2);
        tok3 = new token("c", loc3);
        tok4 = new token("d", loc4);

        tok1.next = tok2;

        tok2.prev = tok1;
        tok2.next = tok3;

        tok3.prev = tok2;
        tok3.next = tok4;

        tok4.prev = tok3;

        exprInstance = new expr(tok1, tok4);
        //console.log(tok1, tok2, tok3, tok4);
    });

    describe('Constructor and getters/setters', () => {
        it('should initialize correctly', () => {
            expect(exprInstance.front).toBe(tok1);
            expect(exprInstance.back).toBe(tok4);
        });

        it('should set front and back correctly', () => {
            const newTok = new token("e", loc1);
            exprInstance.front = newTok;
            expect(exprInstance.front).toBe(newTok);

            exprInstance.back = newTok;
            expect(exprInstance.back).toBe(newTok);
        });

        it('should throw type_error for invalid front and back setters', () => {
            expect(() => exprInstance.front = {}).toThrowError(type_error);
            expect(() => exprInstance.back = {}).toThrowError(type_error);
        });
    });

    describe('str method', () => {
        it('should return the correct string representation', () => {
            expect(exprInstance.str).toBe("ab\n cd");
        });

        it('should return an empty string if the expression is empty', () => {
            exprInstance.clear();
            expect(exprInstance.str).toBe("");
        });
    });

    describe('length method', () => {
        it('should return the correct length', () => {
            expect(exprInstance.length).toBe(4);
        });

        it('should return 0 if the expression is empty', () => {
            exprInstance.clear();
            expect(exprInstance.length).toBe(0);
        });
    });

    describe('empty method', () => {
        it('should return false for a non-empty expression', () => {
            expect(exprInstance.empty()).toBe(false);
        });

        it('should return true for an empty expression', () => {
            exprInstance.clear();
            expect(exprInstance.empty()).toBe(true);
        });
    });

    describe('clear method', () => {
        it('should clear the expression', () => {
            exprInstance.clear();
            expect(exprInstance.front).toBeUndefined();
            expect(exprInstance.back).toBeUndefined();
        });
    });

    describe('last_line method', () => {
        it('should return the last line as a string without comments', () => {
            expect(exprInstance.last_line()).toBe("c d");
        });

        it('should return an empty string if the expression is empty', () => {
            exprInstance.clear();
            expect(exprInstance.last_line()).toBe("");
        });
    });

    describe('stringify method', () => {
        it('should return the string representation of a range', () => {
            expect(exprInstance.stringify(tok2, tok3)).toBe("b\nc");
        });

        it('should handle expr and tokens arguments', () => {
            const subExpr = new expr(tok2, tok3);
            expect(exprInstance.stringify(subExpr)).toBe("b\nc");
        });

        it('should return an empty string if the expression is empty', () => {
            exprInstance.clear();
            expect(exprInstance.stringify(tok2, tok3)).toBe("");
        });
    });

    describe('contains method', () => {
        it('should return true if the expression contains the token', () => {
            expect(exprInstance.contains(tok2)).toBe(true);
        });

        it('should return false if the expression does not contain the token', () => {
            const newTok = new token("e", loc1);
            expect(exprInstance.contains(newTok)).toBe(false);
        });
    });

    describe('find_str method', () => {
        it('should find the first token with the specified string', () => {
            expect(exprInstance.find_str("b")).toBe(tok2);
        });

        it('should return undefined if the token is not found', () => {
            expect(exprInstance.find_str("e")).toBeUndefined();
        });

        it('should start search from the specified token', () => {
            expect(exprInstance.find_str("c", tok2)).toBe(tok3);
        });
    });

    describe('find_str_r method', () => {
        it('should find the last token with the specified string', () => {
            expect(exprInstance.find_str_r("b")).toBe(tok2);
        });

        it('should return undefined if the token is not found', () => {
            expect(exprInstance.find_str_r("e")).toBeUndefined();
        });

        it('should start search from the specified token', () => {
            expect(exprInstance.find_str_r("b", tok3)).toBe(tok2);
        });
    });

    describe('delete_token method', () => {
        it('should delete the specified token', () => {
            exprInstance.delete_token(tok2);
            expect(exprInstance.contains(tok2)).toBe(false);
        });

        it('should throw an error if the token is undefined', () => {
            expect(() => exprInstance.delete_token(undefined)).toThrowError('Try to delete a undefined token.');
        });

        it('should throw an error if the token is not found', () => {
            const newTok = new token("e", loc1);
            expect(() => exprInstance.delete_token(newTok)).toThrowError('Tokens list do not contain token: "e".');
        });
    });

    describe('delete_tokens method', () => {
        it('should delete a range of tokens', () => {
            exprInstance.delete_tokens(tok2, tok3);
            expect(exprInstance.contains(tok2)).toBe(false);
            expect(exprInstance.contains(tok3)).toBe(false);
        });

        it('should handle expr and tokens arguments 000', () => {
            const subExpr = new expr(tok2, tok3);
            exprInstance.delete_tokens(subExpr);
            expect(exprInstance.contains(tok2)).toBe(false);
            expect(exprInstance.contains(tok3)).toBe(false);
        });

        it('should handle expr and tokens arguments 001', () => {
            exprInstance = new expr(tok1, tok4);  // Reinitialize
            const tokList = new expr(tok2, tok3);
            exprInstance.delete_tokens(tokList);
            expect(exprInstance.contains(tok2)).toBe(false);
            expect(exprInstance.contains(tok3)).toBe(false);
        });

        it('should return undefined if the expression is empty or the starting token is not provided', () => {
            exprInstance.clear();
            expect(exprInstance.delete_tokens(tok2, tok3)).toBeUndefined();
        });
    });

    describe('line_expr method', () => {
        it('should return an expression representing a single line', () => {
            const lineExpr = exprInstance.line_expr(tok1);
            expect(lineExpr.front).toBe(tok1);
            expect(lineExpr.back).toBe(tok2);
        });
    });

    describe('rest_of_line static method', () => {
        it('should return an expression representing the rest of the line', () => {
            const restLineExpr = expr.rest_of_line(tok3);
            expect(restLineExpr.front).toBe(tok3);
            expect(restLineExpr.back).toBe(tok4);
        });

        it('should return an empty expression if the token is a semicolon', () => {
            const semicolonTok = new token(";", loc1);
            const restLineExpr = expr.rest_of_line(semicolonTok);
            expect(restLineExpr.empty()).toBe(true);
        });

        it('should throw an error if the token is undefined', () => {
            expect(() => expr.rest_of_line(undefined)).toThrowError('function call on undefined token.');
        });
    });

    describe('swap method', () => {
        it('should swap the content with another expression', () => {
            const newExpr = new expr(tok2, tok3);
            exprInstance.swap(newExpr);
            expect(exprInstance.front).toBe(tok2);
            expect(exprInstance.back).toBe(tok3);
            expect(newExpr.front).toBe(tok1);
            expect(newExpr.back).toBe(tok4);
        });
    });

    describe('replace method', () => {
        it('should replace a range of tokens with another expression', () => {
            const newExpr = new expr(tok3, tok4);
            exprInstance.replace(tok1, tok2, newExpr);
            expect(exprInstance.front).toBe(tok3);
            expect(exprInstance.back).toBe(tok4);
        });

        it('should throw an error if start or end tokens are undefined', () => {
            expect(() => exprInstance.replace(undefined, tok2, new expr(tok3, tok4))).toThrowError('undefined start or end token in tokens list to replace.');
            expect(() => exprInstance.replace(tok1, undefined, new expr(tok3, tok4))).toThrowError('undefined start or end token in tokens list to replace.');
        });
    });


});
