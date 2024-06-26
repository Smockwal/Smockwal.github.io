import { flag } from "../../../../lib/global.js";
import { message } from "../../../../lib/source/message.js";
import { llop } from "../../../../lib/source/parser/lsl/llop.js";
import { load_spec } from "../../../../lib/source/parser/lsl/llspec.js";
import { parsing } from "../../../../lib/source/parser/lsl/parsing.js";
import { convert_to_lsl } from "../../../../lib/source/parser/lsl/translate.js";
import { tokens } from "../../../../lib/source/tokens.js";
import { test_tokens } from "../../../test.js";


const parse_snippet = async str => {
    const t = new tokens(str, `main.lsl`);
    await convert_to_lsl(t);
    await parsing(t);
    return t;
};

describe(`llop`, () => {
    beforeAll(async () => {
        await load_spec(`../../../../lib/source/parser/lsl/lsl_data.json`);
    });

    afterEach(async () => {
        message.print();
        message.clear();
    });

    it(`constructor_00`, async () => {
        const toks = await parse_snippet(`integer a = 1 + 1;`);
        const x = new llop(toks.find_str(`+`));
        expect(x.tok).toBeDefined();
        //expect(x.prev_exp).not.toBeDefined();
        //expect(x.prev_type).not.toBeDefined();
        //expect(x.next_exp).not.toBeDefined();
        //expect(x.next_type).not.toBeDefined();
    });

    it(`constructor_01`, async () => {
        const toks = await parse_snippet(`integer a = 3 + 7;`);
        const x = new llop(toks.find_str(`+`));

        expect(x.tok).toBeDefined();
        expect(x.str).toBe(`+`);

        expect(x.prev_exp.str).toBe(`3`);
        expect(x.prev_type).toBe(`integer`);

        expect(x.next_exp.str).toBe(`7`);
        expect(x.next_type).toBe(`integer`);
    });

    it(`expr_01`, async () => {
        const toks = await parse_snippet(`integer a = 3 + 7;`);
        const x = new llop(toks.find_str(`+`));
        expect(x.expr.str).toBe(`3 + 7`);
    });

    it(`is_neg_op_00`, async () => {
        const toks = await parse_snippet(`integer b;integer a = -b;`);
        //console.log(toks.stringify());
        const op = new llop(toks.find_str(`-`));
        expect(op.is_neg_op()).toBeTrue();
    });

    it(`is_neg_op_01`, async () => {
        const toks = await parse_snippet(`integer a = -1;`);
        test_tokens(toks, [`integer`, `a`, `=`, `-1`, `;`]);
    });

    it(`is_neg_op_02`, async () => {
        const toks = await parse_snippet(`integer a = llAbs(4)-1;`);
        let tok = toks.find_str(`-`);
        expect(llop.is_neg_op(tok)).toBeFalse();
        expect(tok.flag & flag.SYMBOL_FLAG).toBe(flag.SYMBOL_FLAG);

    });

    it(`is_neg_op_03`, async () => {
        const toks = await parse_snippet(`integer a; string b = (string)-a;`);
        //console.log(toks.stringify());
        const op = new llop(toks.find_str(`-`));
        expect(op.is_neg_op()).toBeTrue();
    });

    it(`is_neg_op_04`, async () => {
        const toks0 = await parse_snippet(`<1,1,1>-<1,1,1>`);

        const tok = toks0.find_str(`-`);
        //console.log(tok.prev, flag.to_string(tok.prev.flag));
        expect(llop.is_neg_op(tok)).toBeFalse();
    });



    it(`is_unary_op_00`, async () => {
        const toks0 = await parse_snippet(`f(){!0;}`);
        const tok = toks0.find_str(`!`);
        expect(llop.is_unary_op(tok)).toBeTrue();
    });

    it(`is_unary_op_01`, async () => {
        const toks = await parse_snippet(`integer a; -a;`);
        const tok = toks.find_str(`-`);
        expect(llop.is_unary_op(tok)).toBeTrue();
    });

    it(`is_unary_op_02`, async () => {
        const toks = await parse_snippet(`llAbs(4)-1`);
        test_tokens(toks, [`llAbs`, `(`, `4`, `)`, `-`, `1`]);
        const tok = toks.find_str(`-`);
        expect(llop.is_unary_op(tok)).toBeFalse();
    });

    it(`is_unary_op_03`, async () => {
        const toks = await parse_snippet(`integer a; string b = (string)-a;`);
        const op = new llop(toks.find_str(`-`));
        expect(op.is_unary_op()).toBeTrue();
    });

    it(`is_unary_op_04`, async () => {
        const toks = await parse_snippet(`integer a;integer b;integer c;d(){if((a && !b) || c){;}}`);
        const op = new llop(toks.find_str(`!`));
        expect(op.is_unary_op()).toBeTrue();
    });


    it(`eval_00`, async () => {
        const toks = await parse_snippet(`integer a = 3 + 7;`);
        const x = new llop(toks.find_str(`+`));
        expect(x.eval().str).toBe(`10`);
    });

    it(`eval_01`, async () => {
        const toks = await parse_snippet(`integer a = !7;`);
        const x = new llop(toks.find_str(`!`));
        expect(x.eval().str).toBe(`0`);
    });


    xit(`error_00`, async () => { expect(true).toBeFalse(); });
});