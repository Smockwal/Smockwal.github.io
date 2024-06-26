import { quatd } from "../../../../lib/math/quaternion.js";
import { message } from "../../../../lib/source/message.js";
import { llquat } from "../../../../lib/source/parser/lsl/llquat.js";
import { load_spec } from "../../../../lib/source/parser/lsl/llspec.js";
import { parsing } from "../../../../lib/source/parser/lsl/parsing.js";
import { convert_to_lsl } from "../../../../lib/source/parser/lsl/translate.js";
import { tokens } from "../../../../lib/source/tokens.js";


const parse_snippet = async (str, file = "main.lsl") => {
    let t = new tokens(str, file);
    expect(message.has_error()).toBeFalse();
    t.remove_comments();

    await convert_to_lsl(t);
    expect(message.has_error()).toBeFalse();
    await parsing(t);
    expect(message.has_error()).toBeFalse();
    return t;
};


describe(`llquat`, () => {
    beforeAll(async () => {
        await load_spec(`../../../../lib/source/parser/lsl/lsl_data.json`);
    });

    afterEach(async () => {
        message.print();
        message.clear();
    });

    it(`constructor_00`, async () => {
        const q = new llquat();
        expect(q.x.str).toBe(`0`);
        expect(q.y.str).toBe(`0`);
        expect(q.z.str).toBe(`0`);
        expect(q.s.str).toBe(`1`);
        expect(q.str).toBe(`<0, 0, 0, 1>`);
    });

    it(`constructor_01`, async () => {
        const toks = await parse_snippet(`<0,0,0,0>`); 
        const q = new llquat(toks.front);
        expect(q.x.str).toBe(`0`);
        expect(q.y.str).toBe(`0`);
        expect(q.z.str).toBe(`0`);
        expect(q.s.str).toBe(`0`);
        expect(q.str).toBe(`<0, 0, 0, 0>`);
    });

    it(`constructor_02`, async () => {
        const toks = await parse_snippet(`<1,2,3,4>`); 
        const q = new llquat(toks.front);
        expect(q.x.str).toBe(`1`);
        expect(q.y.str).toBe(`2`);
        expect(q.z.str).toBe(`3`);
        expect(q.s.str).toBe(`4`);
        expect(q.str).toBe(`<1, 2, 3, 4>`);
    });

    it(`constructor_02`, async () => {
        const toks = await parse_snippet(`<1,llAbs(6),3,4>`); 
        const q = new llquat(toks.front);
        expect(q.x.str).toBe(`1`);
        expect(q.y.str).toBe(`llAbs(6)`);
        expect(q.z.str).toBe(`3`);
        expect(q.s.str).toBe(`4`);
        expect(q.str).toBe(`<1, llAbs(6), 3, 4>`);
    });

    it(`of_literal_00`, async () => {
        const v = new llquat();
        expect(v.of_literal()).toBeTrue();
    });

    it(`of_literal_01`, async () => {
        const toks = await parse_snippet(`<1,llAbs(6),3,4>`); 
        const v = new llquat(toks.front);
        expect(v.of_literal()).toBeFalse();
    });

    it(`of_literal_02`, async () => {
        const toks = await parse_snippet(`<0,0,0,1>`); 
        const v = new llquat(toks.front);
        expect(v.of_literal()).toBeTrue();
    });

    it(`cast_00`, async () => {
        const toks = await parse_snippet(`<1,2,3,4>`); 
        const s = new llquat(toks.front);
        expect(s.cast(`string`).str).toBe(`"<1, 2, 3, 4>"`);
        expect(s.cast(`quaternion`).str).toBe(`<1,2,3,4>`);
        expect(s.cast(`list`).str).toBe(`[<1,2,3,4>]`);
    });

    it(`cast_01`, async () => {
        const toks = await parse_snippet(`<1.1,2.2,3.3,4.4>`); 
        const s = new llquat(toks.front);
        expect(s.cast(`string`).str).toBe(`"<1.1, 2.2, 3.3, 4.4>"`);
        expect(s.cast(`quaternion`).str).toBe(`<1.1,2.2,3.3,4.4>`);
        expect(s.cast(`list`).str).toBe(`[<1.1,2.2,3.3,4.4>]`);
    });

    it(`to_quat_00`, async () => {
        const toks = await parse_snippet(`<1.1,2.2,3.3,4.4>`);
        const va = new llquat(toks.front).to_quat();
        expect(va.x).toBeCloseTo(1.1, 3);
        expect(va.y).toBeCloseTo(2.2, 3);
        expect(va.z).toBeCloseTo(3.3, 3);
        expect(va.w).toBeCloseTo(4.4, 3);
    });

    it(`from_quat_00`, async () => {
        const v = new llquat().from_quat(new quatd(1.1, 2.2, 3.3, 4.4));
        expect(v.x.str).toBe(`1.1`);
        expect(v.y.str).toBe(`2.2`);
        expect(v.z.str).toBe(`3.3`);
        expect(v.s.str).toBe(`4.4`);
        expect(v.str).toBe(`<1.1, 2.2, 3.3, 4.4>`);
    });

    it(`add_00`, async () => {
        const toks = await parse_snippet(`<1.1, 2.2, 3.3, 4.4> + <5.5, 6.6, 7.7, 8.8>`); 
        const va = new llquat(toks.find_str(`<`));
        const vb = new llquat(toks.find_str_r(`<`));
        va.add(vb);
        expect(va.x.str).toBe(`6.6`);
        expect(va.y.str).toBe(`8.8`);
        expect(va.z.str).toBe(`11`);
        expect(va.s.str).toBe(`13.200000000000001`);
        expect(va.str).toBe(`<6.6, 8.8, 11, 13.2>`);
    });

    it(`rem_00`, async () => {
        const toks = await parse_snippet(`<1.1, 2.2, 3.3, 4.4> + <5.5, 6.6, 7.7, 8.8>`); 
        const va = new llquat(toks.find_str(`<`));
        const vb = new llquat(toks.find_str_r(`<`));
        va.rem(vb);
        expect(va.x.str).toBe(`-4.4`);
        expect(va.y.str).toBe(`-4.3999999999999995`);
        expect(va.z.str).toBe(`-4.4`);
        expect(va.s.str).toBe(`-4.4`);
        expect(va.str).toBe(`<-4.4, -4.4, -4.4, -4.4>`);
    });

    it(`is_def_00`, async () => {
        const toks = await parse_snippet(`<0, 0, 0, 1>`); 
        const va = new llquat(toks.find_str(`<`));
        expect(va.is_def()).toBeTrue();
    });

    it(`is_def_01`, async () => {
        const toks = await parse_snippet(`<0, a, 0, 1>`); 
        const va = new llquat(toks.find_str(`<`));
        expect(va.is_def()).toBeFalse();
    });

    it(`is_def_01`, async () => {
        const toks = await parse_snippet(`<0, 0, 0x9.99, 1>`); 
        const va = new llquat(toks.find_str(`<`));
        expect(va.is_def()).toBeFalse();
    });

    xit(`opt_mem_00`, async () => {
        const toks = await parse_snippet(`<0, 0, 0x9.99, 1>`); 
        const va = new llquat(toks.find_str(`<`));
        expect(va.opt_mem().str).toBe(`< 0 , 0 , 9.59765625 , 1 >`);
    });

    xit(`opt_mem_01`, async () => {
        const toks = await parse_snippet(`<0, 0,0 , 1>`); 
        const va = new llquat(toks.find_str(`<`));
        expect(va.opt_mem().str).toBe(`((quaternion)"")`);
    });

    xit(`opt_mem_02`, async () => {
        const toks = await parse_snippet(`<0.5, a,12. , 1>`); 
        const va = new llquat(toks.find_str(`<`));
        expect(va.opt_mem().str).toBe(`< .5 ,     a , 12 , 1 >`);
    });

    xit(`error_00`, async () => { expect(true).toBeFalse(); });

});