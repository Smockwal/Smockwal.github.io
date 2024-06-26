import { numb } from "../../../../lib/math/number.js";
import { vec3d } from "../../../../lib/math/vec3.js";
import { message } from "../../../../lib/source/message.js";
import { llfloat } from "../../../../lib/source/parser/lsl/llfloat.js";
import { llquat } from "../../../../lib/source/parser/lsl/llquat.js";
import { load_spec } from "../../../../lib/source/parser/lsl/llspec.js";
import { llvec } from "../../../../lib/source/parser/lsl/llvec.js";
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


describe(`llvec`, () => {
    beforeAll(async () => {
        await load_spec(`../../../../lib/source/parser/lsl/lsl_data.json`);
    });

    afterEach(async () => {
        message.print();
        message.clear();
    });

    it(`constructor_00`, async () => {
        const v = new llvec();
        expect(v.x.str).toBe(`0`);
        expect(v.y.str).toBe(`0`);
        expect(v.z.str).toBe(`0`);
        expect(v.str).toBe(`<0, 0, 0>`);
    });

    it(`constructor_01`, async () => {
        const toks = await parse_snippet(`<0,0,0>`); 
        const v = new llvec(toks.front);
        expect(v.x.str).toBe(`0`);
        expect(v.y.str).toBe(`0`);
        expect(v.z.str).toBe(`0`);
        expect(v.str).toBe(`<0, 0, 0>`);
    });

    it(`constructor_02`, async () => {
        const toks = await parse_snippet(`<1,2,3>`); 
        const v = new llvec(toks.front);
        expect(v.x.str).toBe(`1`);
        expect(v.y.str).toBe(`2`);
        expect(v.z.str).toBe(`3`);
        expect(v.str).toBe(`<1, 2, 3>`);
    });

    it(`constructor_03`, async () => {
        const toks = await parse_snippet(`<1,llAbs(6),3>`); 
        const v = new llvec(toks.front);
        expect(v.x.str).toBe(`1`);
        expect(v.y.str).toBe(`llAbs(6)`);
        expect(v.z.str).toBe(`3`);
        expect(v.str).toBe(`<1, llAbs(6), 3>`);
    });

    it(`of_literal_00`, async () => {
        const toks = await parse_snippet(`<1,llAbs(6),3>`); 
        const v = new llvec(toks.front);
        expect(v.of_literal()).toBeFalse();
    });

    it(`of_literal_01`, async () => {
        const toks = await parse_snippet(`<0, 0, 0>`); 
        const v = new llvec(toks.front);
        expect(v.of_literal()).toBeTrue();
    });

    it(`of_literal_02`, async () => {
        const v = new llvec();
        expect(v.of_literal()).toBeTrue();
    });

    it(`of_literal_03`, async () => {
        const toks = await parse_snippet(`<5.31, a7.13, 0x9.99>`); 
        const v = new llvec(toks.front);
        expect(v.of_literal()).toBeFalse();
    });

    it(`cast_00`, async () => {
        const toks = await parse_snippet(`<1,2,3>`); 
        const s = new llvec(toks.front);
        expect(s.cast(`string`).str).toBe(`"<1, 2, 3>"`);
        expect(s.cast(`vector`).str).toBe(`<1,2,3>`);
        expect(s.cast(`list`).str).toBe(`[<1,2,3>]`);
    });

    it(`cast_01`, async () => {
        const toks = await parse_snippet(`<1.1,2.2,3.3>`); 
        const s = new llvec(toks.front);
        expect(s.cast(`string`).str).toBe(`"<1.1, 2.2, 3.3>"`);
        expect(s.cast(`vector`).str).toBe(`<1.1,2.2,3.3>`);
        expect(s.cast(`list`).str).toBe(`[<1.1,2.2,3.3>]`);
    });

    it(`to_vec3_00`, async () => {
        const toks = await parse_snippet(`<1.1,2.2,3.3>`);
        const va = new llvec(toks.front).to_vec3();
        expect(va.x).toBeCloseTo(1.1, 3);
        expect(va.y).toBeCloseTo(2.2, 3);
        expect(va.z).toBeCloseTo(3.3, 3);
    });

    it(`from_vec3_00`, async () => {
        const v = new llvec().from_vec3(new vec3d(1,2,3));
        expect(v.x.str).toBe(`1`);
        expect(v.y.str).toBe(`2`);
        expect(v.z.str).toBe(`3`);
        expect(v.str).toBe(`<1, 2, 3>`);
    });

    it(`add_00`, async () => {
        const toks = await parse_snippet(`<1.1, 2.2, 3.3> + <4.4, 5.5, 6.6>`); 
        const va = new llvec(toks.find_str(`<`));
        const vb = new llvec(toks.find_str_r(`<`));
        va.add(vb);
        expect(va.x.str).toBe(`5.5`);
        expect(va.y.str).toBe(`7.7`);
        expect(va.z.str).toBe(`9.899999999999999`);
        expect(va.str).toBe(`<5.5, 7.7, 9.9>`);
    });

    it(`rem_00`, async () => {
        const toks = await parse_snippet(`<1.1, 2.2, 3.3> + <4.4, 5.5, 6.6>`); 
        const va = new llvec(toks.find_str(`<`));
        const vb = new llvec(toks.find_str_r(`<`));
        va.rem(vb);
        expect(va.x.str).toBe(`-3.3000000000000003`);
        expect(va.y.str).toBe(`-3.3`);
        expect(va.z.str).toBe(`-3.3`);
        expect(va.str).toBe(`<-3.3, -3.3, -3.3>`);
    });

    it(`mult_00`, async () => {
        const toks = await parse_snippet(`<1.1, 2.2, 3.3> * <4.4, 5.5, 6.6>`); 
        const va = new llvec(toks.find_str(`<`));
        const vb = new llvec(toks.find_str_r(`<`));
        const v = va.mult(vb);
        expect(v.str).toBe(`38.72`);
    });

    it(`mult_01`, async () => {
        const toks = await parse_snippet(`<1.1, 2.2, 3.3> * 4.4`); 
        const va = new llvec(toks.find_str(`<`));
        const vb = new llfloat(toks.find_str_r(`4.4`));
        va.mult(vb);
        expect(va.x.str).toBe(`4.840000104904175`);
        expect(va.y.str).toBe(`9.68000020980835`);
        expect(va.z.str).toBe(`14.520000314712524`);
        expect(va.str).toBe(`<4.84, 9.68, 14.52>`);
    });

    it(`mult_02`, async () => {
        const toks = await parse_snippet(`<.4988093470697872, .6383617479121009, .957630349363233> * <.6264948290817459, -0.6044357118024847, .1123496227293971, .47910255864921>`); 
        const va = new llvec(toks.find_str(`<`));
        const vb = new llquat(toks.find_str_r(`<`));
        va.mult(vb);
        expect(va.x.str).toBe(`-0.8502677092943473`);
        expect(va.y.str).toBe(`-0.907874843579994`);
        expect(va.z.str).toBe(`0.16180377890850356`);
        expect(va.str).toBe(`<-0.850268, -0.907875, 0.161804>`);
    });

    it(`div_00`, async () => {
        const toks = await parse_snippet(`<1.1, 2.2, 3.3> / 4.4`); 
        const va = new llvec(toks.find_str(`<`));
        const vb = new llfloat(toks.find_str_r(`4.4`));
        va.div(vb);
        expect(va.x.str).toBe(`0.24999999458139607`);
        expect(va.y.str).toBe(`0.49999998916279215`);
        expect(va.z.str).toBe(`0.7499999837441881`);
        expect(va.str).toBe(`<0.25, 0.5, 0.75>`);
    });

    it(`div_01`, async () => {
        const toks = await parse_snippet(`<0.232495, 0.742557, 0.177872> / <-0.498222, -0.241408, -0.167669, 0.815710>`); 
        const va = new llvec(toks.find_str(`<`));
        const vb = new llquat(toks.find_str_r(`<`));
        va.div(vb);
        expect(numb.parse(va.x.str)).toBeCloseTo(0.267599, 3); 
        expect(numb.parse(va.y.str)).toBeCloseTo(0.321509, 3); 
        expect(numb.parse(va.z.str)).toBeCloseTo(0.679784, 3);
        expect(va.str).toBe(`<0.267598, 0.321509, 0.679783>`);
    });

    it(`from_str_01`, async () => {
        const va = new llvec().from_str(`<0,0,0>`);
        expect(numb.parse(va.x.str)).toBeCloseTo(0, 3); 
        expect(numb.parse(va.y.str)).toBeCloseTo(0, 3); 
        expect(numb.parse(va.z.str)).toBeCloseTo(0, 3);
        expect(va.str).toBe(`<0, 0, 0>`);
    });

    it(`from_str_02`, async () => {
        const va = new llvec().from_str(`<5.31, a7.13, 0x9.99>`);
        expect(numb.parse(va.x.str)).toBeCloseTo(0, 3); 
        expect(numb.parse(va.y.str)).toBeCloseTo(0, 3); 
        expect(numb.parse(va.z.str)).toBeCloseTo(0, 3);
        expect(va.str).toBe(`<0, 0, 0>`);
    });

    it(`from_str_03`, async () => {
        const va = new llvec().from_str(`"<1,1,2+"`);
        expect(numb.parse(va.x.str)).toBeCloseTo(1, 3); 
        expect(numb.parse(va.y.str)).toBeCloseTo(1, 3); 
        expect(numb.parse(va.z.str)).toBeCloseTo(2, 3);
        expect(va.str).toBe(`<1, 1, 2>`);
    });

    it(`from_str_04`, async () => {
        const va = new llvec().from_str(`"<1,1,2a"`);
        expect(numb.parse(va.x.str)).toBeCloseTo(1, 3); 
        expect(numb.parse(va.y.str)).toBeCloseTo(1, 3); 
        expect(numb.parse(va.z.str)).toBeCloseTo(2, 3);
        expect(va.str).toBe(`<1, 1, 2>`);
    });

    it(`from_str_05`, async () => {
        const va = new llvec().from_str(`"<1, 1, 2>"`);
        expect(numb.parse(va.x.str)).toBeCloseTo(1, 3); 
        expect(numb.parse(va.y.str)).toBeCloseTo(1, 3); 
        expect(numb.parse(va.z.str)).toBeCloseTo(2, 3);
        expect(va.str).toBe(`<1, 1, 2>`);
    });

    it(`is_def_00`, async () => {
        const toks = await parse_snippet(`<0,0,0>`); 
        const va = new llvec(toks.find_str(`<`));
        expect(va.is_def()).toBeTrue();
    });

    it(`is_def_01`, async () => {
        const toks = await parse_snippet(`<0, a, 0>`); 
        const va = new llvec(toks.find_str(`<`));
        expect(va.is_def()).toBeFalse();
    });

    it(`is_def_01`, async () => {
        const toks = await parse_snippet(`<0, 0, 0x9.99>`); 
        const va = new llvec(toks.find_str(`<`));
        expect(va.is_def()).toBeFalse();
    });

    xit(`opt_mem_00`, async () => {
        const toks = await parse_snippet(`<0, 0, 0x9.99>`); 
        const va = new llvec(toks.find_str(`<`));
        expect(va.opt_mem().str).toBe(`< 0 , 0 , 9.59765625 >`);
    });

    xit(`opt_mem_01`, async () => {
        const toks = await parse_snippet(`<0, 0,0 >`); 
        const va = new llvec(toks.find_str(`<`));
        expect(va.opt_mem().str).toBe(`((vector)"")`);
    });

    xit(`opt_mem_02`, async () => {
        const toks = await parse_snippet(`<0.5, a,12. >`); 
        const va = new llvec(toks.find_str(`<`));
        expect(va.opt_mem().str).toBe(`< .5 ,     a , 12 >`);
    });

    xit(`error_00`, async () => { expect(true).toBeFalse(); });

});