import { type_error } from "../../../../lib/error.js";
import { flag } from "../../../../lib/global.js";
import { llfloat } from "../../../../lib/source/parser/lsl/llfloat.js";

describe("llfloat class", () => {
    let llfloatInstance;

    beforeEach(() => {
        llfloatInstance = new llfloat();
    });

    describe("constructor", () => {
        it("should initialize value to 0", () => {
            expect(llfloatInstance.value).toBe(0);
        });

        it("should parse and assign value from token argument", () => {
            const tok = { kind: `token`, str: "3.14", flag: flag.NUMBER_FLAG };
            llfloatInstance = new llfloat(tok);
            expect(llfloatInstance.value).toBe(3.140000104904175);
        });
    });

    describe("value property", () => {
        it("should get the current value", () => {
            llfloatInstance.value = 100;
            expect(llfloatInstance.value).toBe(100);
        });

        it("should throw an error when setting a non-number value", () => {
            expect(() => { llfloatInstance.value = "abc"; }).toThrow(new type_error(`value is not a number.`));
        });
    });

    describe("str property", () => {
        it("should return the string representation of the value", () => {
            llfloatInstance.value = 123.456;
            expect(llfloatInstance.str).toBe("123.456");
        });
    });

    describe("f32 property", () => {
        it("should return the 32-bit floating-point representation of the value", () => {
            llfloatInstance.value = 123.456;
            expect(llfloatInstance.f32).toBeCloseTo(123.456, 5);
        });
    });

    describe("default method", () => {
        it("should return the default value", () => {
            expect(llfloat.def).toBe("0.0");
        });
    });

    describe("is_def method", () => {
        it("should return true for the default instance", () => {
            expect(llfloatInstance.is_def()).toBe(true);
        });

        it("should return false for a non-default instance", () => {
            llfloatInstance.value = 123.456;
            expect(llfloatInstance.is_def()).toBe(false);
        });
    });

    describe("cast method", () => {
        it("should cast the value to an integer token", () => {
            llfloatInstance.value = 123.456;
            const toks = llfloatInstance.cast("integer");
            expect(toks.str).toBe("123");
        });

        it("should cast the value to a float token", () => {
            llfloatInstance.value = 123.456;
            const toks = llfloatInstance.cast("float");
            expect(toks.str).toBe("123.456");
        });

        it("should cast the value to a string token", () => {
            llfloatInstance.value = 123.456;
            const toks = llfloatInstance.cast("string");
            expect(toks.str).toBe('"123.456"');
        });

        it("should cast the value to a list token", () => {
            llfloatInstance.value = 123.456;
            const toks = llfloatInstance.cast("list");
            expect(toks.str).toBe("[123.456]");
        });

        it("should throw an error when casting to an unsupported type", () => {
            expect(() => { llfloatInstance.cast("object"); }).toThrow(new type_error(`type mistake: can't cast float to "object".`));
        });
    });
});




describe(`llfloat`, () => {
    it(`constructor_00`, async () => {
        const x = new llfloat();
        expect(x.value).toEqual(0);
        expect(x.str).toEqual(`0.`);
        expect(x.f32).toEqual(0);
    });

    it(`constructor_01`, async () => {
        const tok = { kind: `token`, str: "-3.5", flag: flag.NUMBER_FLAG };
        const x = new llfloat(tok);
        expect(x.value).toEqual(-3.5);
        expect(x.str).toEqual(`-3.5`);
        expect(x.f32).toEqual(-3.5);
    });

    it(`constructor_02`, async () => {
        const tok = { kind: `token`, str: "1e40", flag: flag.NUMBER_FLAG };
        const x = new llfloat(tok);
        expect(x.value).toEqual(Infinity);
        expect(x.str).toEqual(`Infinity`);
        expect(x.f32).toEqual(Infinity);
    });

    it(`constructor_03`, async () => {
        const tok = { kind: `token`, str: "-1e40", flag: flag.NUMBER_FLAG };
        const x = new llfloat(tok);
        expect(x.value).toEqual(-Infinity);
        expect(x.str).toEqual(`-Infinity`);
        expect(x.f32).toEqual(-Infinity);
    });

    it(`constructor_04`, async () => {
        const tok = { kind: `token`, str: "NaN", flag: flag.NUMBER_FLAG };
        const x = new llfloat(tok);
        expect(x.value).toEqual(NaN);
        expect(x.str).toEqual(`NaN`);
        expect(x.f32).toEqual(NaN);
    });

    it(`constructor_05`, async () => {
        const tok = { kind: `token`, str: "0x1.921fb54442d18p+1", flag: flag.NUMBER_FLAG };
        const x = new llfloat(tok);
        expect(x.value).toEqual(3.1415927410125732);
        expect(x.str).toEqual(`3.141593`);
        //expect(x.f32).toEqual(3.1415927410125732421875);
        expect(x.f32).toBeCloseTo(3.141592653589793, 6);
    });

    it(`formated_00`, async () => {
        const tok = { kind: `token`, str: "0.0", flag: flag.NUMBER_FLAG };
        const x = new llfloat(tok);
        expect(x.formatted()).toEqual(`0.`);
    });

    it(`format_00`, async () => {
        expect(llfloat.format(`-4.999999987376214e-7`)).toEqual(`-5.0e-7`);
    });

    it(`is_def_00`, async () => {
        const tok = { kind: `token`, str: "0.0", flag: flag.NUMBER_FLAG };
        expect(llfloat.is_def(tok)).toBeTrue();
    });

    it(`cast_00`, async () => {
        const tok = { kind: `token`, str: "22.0", flag: flag.NUMBER_FLAG };
        const s = new llfloat(tok);
        expect(s.cast(`integer`).str).toBe(`22`);
        expect(s.cast(`float`).str).toBe(`22.`);
        expect(s.cast(`string`).str).toBe(`"22."`);
        expect(s.cast(`list`).str).toBe(`[22.]`);
    });

    it(`cast_01`, async () => {
        const s = new llfloat(`22`);
        expect(s.cast(`integer`).str).toBe(`22`);
        expect(s.cast(`float`).str).toBe(`22.`);
        expect(s.cast(`string`).str).toBe(`"22."`);
        expect(s.cast(`list`).str).toBe(`[22.]`);
    });

    it(`cast_02`, async () => {
        const s = new llfloat(`22.0`);
        expect(s.cast(`integer`).str).toBe(`22`);
        expect(s.cast(`float`).str).toBe(`22.`);
        expect(s.cast(`string`).str).toBe(`"22."`);
        expect(s.cast(`list`).str).toBe(`[22.]`);
    });

    it(`cast_03`, async () => {
        const s = new llfloat(`"22"`);
        expect(s.cast(`integer`).str).toBe(`22`);
        expect(s.cast(`float`).str).toBe(`22.`);
        expect(s.cast(`string`).str).toBe(`"22."`);
        expect(s.cast(`list`).str).toBe(`[22.]`);
    });

    xit(`mult_00`, async () => {
        const tok = { kind: `token`, str: "22.0", flag: flag.NUMBER_FLAG };
        const toks = await parse_snippet(`1.1 * <4.4, 5.5, 6.6>`);
        const va = new llfloat(toks.front);
        const vb = new llvec(toks.find_str_r(`<`));
        const vc = va.mult(vb);
        expect(vc.x.str).toBe(`4.840000000000001`);
        expect(vc.y.str).toBe(`6.050000000000001`);
        expect(vc.z.str).toBe(`7.26`);
        expect(vc.str).toBe(`<4.840000000000001, 6.050000000000001, 7.26>`);
    });


    xit(`error_00`, async () => { expect(true).toBeFalse(); });
});
/**/
