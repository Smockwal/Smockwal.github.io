
import { func } from '../../lib/source/function.js';
import { tokens } from '../../lib/source/tokens.js';

describe(`function`, () => {
    //it('fail', () => { expect(false).toBeTrue();});

    it(`constructor_00`, () => {
        const toks0 = new tokens(`f(1);`);
        let tok = toks0.find_str(`f`);
        let fcn = new func(tok);

        expect(fcn.name).toBe(`f`);
        expect(fcn.type).toBe(`void`);
        expect(fcn.args_length).toBe(1);
        expect(fcn.expr.str).toBe(`f(1)`);
    });

    it(`constructor_01`, () => {
        const toks0 = new tokens(`int x(){return 1;}`);
        let fcn = new func(toks0.find_str(`x`));

        expect(fcn.name).toBe(`x`);
        expect(fcn.type).toBe(`int`);
        expect(fcn.args_length).toBe(0);
        expect(fcn.expr.str).toBe(`int x()`);
    });

    it(`is_func_name_00`, () => {
        const a = new tokens(`A 1`);
        expect(func.is_func_name(a.front)).toBeFalse();
    });

    it(`is_func_name_01`, () => {
        const a = new tokens(`f();`);
        expect(func.is_func_name(a.front)).toBeTrue();
    });

    it(`is_func_name_02`, () => {
        const a = new tokens(`fprintf (stderr, __VA_ARGS__)`);
        expect(func.is_func_name(a.front)).toBeTrue();
    });

    it(`is_func_name_03`, () => {
        const a = new tokens(`B`);
        expect(func.is_func_name(a.front)).toBeFalse();
    });

    it(`is_func_name_04`, () => {
        const a = new tokens(`f(w`);
        expect(func.is_func_name(a.front)).toBeFalse();
    });

    it(`is_func_name_05`, () => {
        const a = new tokens(`eprintf(...)`);
        expect(func.is_func_name(a.front)).toBeTrue();
    });

    it(`is_func_name_06`, () => {
        const a = new tokens(`func()`);
        expect(func.is_func_name(a.front)).toBeTrue();
    });

    it(`is_func_name_07`, async () => {
        const toks0 = new tokens(`x(){\nreturn 0;\n}`, `main.lsl`);
        expect(func.is_func_name(toks0.front)).toBeTrue();
    });

    it(`is_func_name_08`, async () => {
        const toks0 = new tokens(`llAbs(3<5)`, `main.lsl`);
        expect(func.is_func_name(toks0.front)).toBeTrue();
    });

    it(`parse_00`, () => {
        const a = new tokens(`int`);
        const f = new func();
        expect(f.parse(a.front)).toBeFalse();
    });

    it(`parse_01`, () => {
        const a = new tokens(`func()`);
        const f = new func();
        expect(f.parse(a.front)).toBeTrue();
        expect(f.args_length).toBe(0);

        expect(f.name).toBe(`func`);
        expect(f.last_tok).toBeDefined();
    });

    it(`parse_02`, () => {
        const a = new tokens(`A(B,C,D) code`);
        const f = new func();
        expect(f.parse(a.front)).toBeTrue();
        expect(f.args_length).toBe(3);
        //console.log(f);
    });

    it(`parse_03`, () => {
        const a = new tokens(`func(a = (4 != u), b(4, j, u ? 4 : 0));`);
        const f = new func();
        expect(f.parse(a.front)).toBeTrue();
        expect(f.args_length).toBe(2);

        expect(f.arg_index(`a = (4 != u)`)).toBe(0);
        expect(f.arg_index(`b(4, j, u ? 4 : 0)`)).toBe(1);
    });

    it(`parse_04`, () => {
        const a = new tokens(`func(<0,0,5>, [4,5,a > 9]);`);
        const f = new func();
        expect(f.parse(a.front)).toBeTrue();
        //console.log(f);

        expect(f.args_length).toBe(2);

        expect(f.arg_index(`<0,0,5>`)).toBe(0);
        expect(f.arg_index(`[4,5,a > 9]`)).toBe(1);
    });

    it(`parse_05`, () => {
        const a = new tokens(`func(<0,0,5>, [4,5,a > 9]);`);
        const f = new func();
        expect(f.parse(a.front)).toBeTrue();
        expect(f.args_length).toBe(2);

        expect(f.arg_index(`<0,0,5>`)).toBe(0);
        expect(f.arg_index(`[4,5,a > 9]`)).toBe(1);
    });

    it(`parse_06`, () => {
        const a = new tokens(`A(1,(int)2);`);
        const f = new func();
        expect(f.parse(a.front)).toBeTrue();
        expect(f.args_length).toBe(2);

        expect(f.arg_index(`1`)).toBe(0);
        expect(f.arg_index(`(int)2`)).toBe(1);
        expect(f.arg_at(1).str).toBe(`(int)2`);
    });

    it(`parse_07`, () => {
        const a = new tokens(`A(int, , foo, );`);
        const f = new func();
        expect(f.parse(a.front)).toBeTrue();
        //console.log(f);
        expect(f.args_length).toBe(4);

        expect(f.arg_at(0).str).toBe(`int`);
        expect(f.arg_at(1).str).toBe(` `);
        expect(f.arg_at(2).str).toBe(`foo`);
        expect(f.arg_at(3).str).toBe(` `);
    });

    it(`parse_08`, () => {
        const a = new tokens(`llAbs(3<8)`);
        expect(a.str).toBe(`llAbs(3<8)`);

        const f = new func();
        expect(f.parse(a.front)).toBeTrue();
        //console.log(f);
        expect(f.args_length).toBe(1);

        expect(f.arg_at(0).str).toBe(`3<8`);
    });

    it(`parse_09`, () => {
        const a = new tokens(`(llAbs((integer)3))`);
        expect(a.stringify()).toBe(`( llAbs ( ( integer ) 3 ) )`);

        const f = new func();
        expect(f.parse(a.front.next)).toBeTrue();
        
        expect(f.args_length).toBe(1);

        expect(f.arg_at(0).str).toBe(`(integer)3`);
    });

    it(`parse_10`, () => {
        const toks0 = new tokens(`(float)-llGetLinkNumber()`, `main.lsl`), 
            f = new func();

        expect(f.parse(toks0.find_str(`llGetLinkNumber`))).toBeTrue();
        expect(f.args_length).toBe(0);
        expect(f.last_tok.str).toBe(`)`);
    });



    it(`exp_00`, () => {
        const a = new tokens(`llAcos(0.25)`);
        const f = new func();
        expect(f.parse(a.front)).toBeTrue();
        expect(f.expr.str).toBe(`llAcos( 0.25 )`);
    });

    it(`expr_copy_00`, () => {
        const toks = new tokens(`llAcos(0.25)`);
        const f = new func(toks.front);
        expect(f.expr_copy().str).toBe(`llAcos (       0.25 )`);
    });
});
