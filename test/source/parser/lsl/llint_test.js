import { type_error } from "../../../../lib/error.js";
import { flag } from "../../../../lib/global.js";
import { llint } from "../../../../lib/source/parser/lsl/llint.js";

describe("llint class", () => {
    let llintInstance;

    beforeEach(() => {
        llintInstance = new llint();
    });

    describe("constructor", () => {
        it("should initialize value to 0", () => {
            expect(llintInstance.value).toBe(0);
        });

        it("should parse and assign value from number argument", () => {
            llintInstance = new llint(123);
            expect(llintInstance.value).toBe(123);
        });

        it("should parse and assign value from string argument", () => {
            llintInstance = new llint("456");
            expect(llintInstance.value).toBe(456);
        });

        it("should parse and assign value from token argument", () => {
            const tok = { kind: `token`, str: "789", flag: flag.NUMBER_FLAG };
            llintInstance = new llint(tok);
            expect(llintInstance.value).toBe(789);
        });
    });

    describe("value property", () => {
        it("should get the current value", () => {
            llintInstance.value = 100;
            expect(llintInstance.value).toBe(100);
        });

        it("should throw an error when setting a non-number value", () => {
            expect(() => { llintInstance.value = "abc"; }).toThrow(new type_error(`Value must be a number: "abc".`));
        });
    });

    describe("str property", () => {
        it("should return the string representation of the value", () => {
            llintInstance.value = 123;
            expect(llintInstance.str).toBe("123");
        });
    });

    describe("i32 property", () => {
        it("should return the 32-bit signed integer representation of the value", () => {
            llintInstance.value = 1234567890;
            expect(llintInstance.i32).toBe("1234567890");
        });
    });

    describe("ui32 property", () => {
        it("should return the 32-bit unsigned integer representation of the value", () => {
            llintInstance.value = -1234567890;
            expect(llintInstance.ui32).toBe("0xB669FD2E");
        });
    });

    describe("default method", () => {
        it("should return the default value", () => {
            expect(llint.def).toBe("0");
        });
    });

    describe("isDefault method", () => {
        it("should return true for the default token", () => {
            const tok = { kind: `token`, str: "0", flag: flag.NUMBER_FLAG };
            expect(llint.is_def(tok)).toBe(true);
        });

        it("should return false for a non-default token", () => {
            const tok = { kind: `token`, str: "123", flag: flag.NUMBER_FLAG };
            expect(llint.is_def(tok)).toBe(false);
        });
    });

    describe("cast method", () => {
        it("should cast the value to an integer token", () => {
            llintInstance.value = 123;
            const toks = llintInstance.cast("integer");
            expect(toks.str).toBe("123");
        });

        it("should cast the value to a float token", () => {
            llintInstance.value = 123.456;
            const toks = llintInstance.cast("float");
            expect(toks.str).toBe("123.");
        });

        it("should cast the value to a string token", () => {
            llintInstance.value = 123;
            const toks = llintInstance.cast("string");
            expect(toks.str).toBe('"123"');
        });

        it("should cast the value to a list token", () => {
            llintInstance.value = 123;
            const toks = llintInstance.cast("list");
            expect(toks.str).toBe("[123]");
        });

        it("should throw an error when casting to an unsupported type", () => {
            expect(() => { llintInstance.cast("object"); }).toThrow(new type_error(`type mistake: can't cast int to "object".`));
        });
    });
});

/*
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
*/

describe(`llint`, () => {
    it(`constructor_00`, async () => {
        const x = new llint();
        expect(x.value).toBe(0);
        expect(x.str).toBe(`0`);
    });

    it(`constructor_01`, async () => {
        const tok = { kind: `token`, str: "-5", flag: flag.NUMBER_FLAG };
        const x = new llint(tok);
        expect(x.value).toBe(-5);
        expect(x.str).toBe(`-5`);
        expect(x.ui32).toBe(`0xFFFFFFFB`);
    });

    it(`def_00`, async () => {
        expect(llint.def).toBe(`0`);
    });

    it(`cast_00`, async () => {
        const tok = { kind: `token`, str: "22", flag: flag.NUMBER_FLAG };
        const s = new llint(tok);
        expect(s.cast(`integer`).str).toBe(`22`);
        expect(s.cast(`float`).str).toBe(`22.`);
        expect(s.cast(`string`).str).toBe(`"22"`);
        expect(s.cast(`list`).str).toBe(`[22]`);
    });

    it(`cast_01`, async () => {
        const s = new llint(`22`);
        expect(s.cast(`integer`).str).toBe(`22`);
        expect(s.cast(`float`).str).toBe(`22.`);
        expect(s.cast(`string`).str).toBe(`"22"`);
        expect(s.cast(`list`).str).toBe(`[22]`);
    });

    it(`cast_02`, async () => {
        const s = new llint(`22.0`);
        expect(s.cast(`integer`).str).toBe(`22`);
        expect(s.cast(`float`).str).toBe(`22.`);
        expect(s.cast(`string`).str).toBe(`"22"`);
        expect(s.cast(`list`).str).toBe(`[22]`);
    });

    it(`cast_03`, async () => {
        const s = new llint(`"22"`);
        expect(s.cast(`integer`).str).toBe(`22`);
        expect(s.cast(`float`).str).toBe(`22.`);
        expect(s.cast(`string`).str).toBe(`"22"`);
        expect(s.cast(`list`).str).toBe(`[22]`);
    });

    xit(`error_00`, async () => { expect(true).toBeFalse(); });
});

