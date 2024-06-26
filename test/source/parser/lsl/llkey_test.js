import { flag } from "../../../../../lib/global.js";
import { llkey } from "../../../../../lib/source/parser/lsl/llkey.js";

describe(`llkey`, () => {

    const make_tokens_mok = arr => {
        const toks = { kind: `tokens` };
        for (const entry of arr) {
            const tok = {};
            if (!toks.front) {
                toks.front = entry;
                toks.back = entry;
            } else {
                toks.back.next = entry;
                entry.prev = toks.back;
                toks.back = entry;
            }
        }
        return toks;
    };

    afterEach(async () => { });

    it(`constructor_00`, async () => {
        const s = new llkey();
        expect(s.value).toBe(``);
        expect(s.str).toBe(`""`);
    });

    it(`constructor_01`, async () => {
        const tok = { kind: `token`, str: `"Hello world!"`, flag: flag.STRING_FLAG };
        const s = new llkey(tok);
        expect(s.value).toBe(`Hello world!`);
        expect(s.str).toBe(`"Hello world!"`);
    });

    it(`constructor_02`, async () => {
        const toks = make_tokens_mok([
            { kind: `token`, str: `(key)`, flag: flag.NAME_FLAG | flag.CASTING_FLAG },
            { kind: `token`, str: `"3efeeb56-880e-50ce-3f96-1816775e4c44"`, flag: flag.STRING_FLAG },
        ]);
        const s = new llkey(toks.front);
        expect(s.value).toBe(`3efeeb56-880e-50ce-3f96-1816775e4c44`);
        expect(s.str).toBe(`"3efeeb56-880e-50ce-3f96-1816775e4c44"`);
    });

    // ((key)"4fad7145-f825-aed8-d190-bd28aa6b9688")
    it(`constructor_03`, async () => {
        const s = new llkey(`4fad7145-f825-aed8-d190-bd28aa6b9688`);
        expect(s.value).toBe(`4fad7145-f825-aed8-d190-bd28aa6b9688`);
        expect(s.str).toBe(`"4fad7145-f825-aed8-d190-bd28aa6b9688"`);
    });

    it(`constructor_04`, async () => {
        const s = new llkey(`(key)"4fad7145-f825-aed8-d190-bd28aa6b9688"`);
        expect(s.value).toBe(`4fad7145-f825-aed8-d190-bd28aa6b9688`);
        expect(s.str).toBe(`"4fad7145-f825-aed8-d190-bd28aa6b9688"`);
    });

    it(`constructor_05`, async () => {
        const s = new llkey(`((key)"4fad7145-f825-aed8-d190-bd28aa6b9688")`);
        expect(s.value).toBe(`4fad7145-f825-aed8-d190-bd28aa6b9688`);
        expect(s.str).toBe(`"4fad7145-f825-aed8-d190-bd28aa6b9688"`);
    });

    it(`cast_00`, async () => {
        const toks = make_tokens_mok([
            { kind: `token`, str: `(key)`, flag: flag.NAME_FLAG | flag.CASTING_FLAG },
            { kind: `token`, str: `"22"`, flag: flag.STRING_FLAG },
        ]);
        const s = new llkey(toks.front);
        expect(s.cast(`string`).str).toBe(`"22"`);
        expect(s.cast(`key`).str).toBe(`(key)"22"`);
        expect(s.cast(`list`).str).toBe(`[(key)"22"]`);
    });

    it(`cast_01`, async () => {
        const toks = make_tokens_mok([
            { kind: `token`, str: `(key)`, flag: flag.NAME_FLAG | flag.CASTING_FLAG },
            { kind: `token`, str: `"22.0"`, flag: flag.STRING_FLAG },
        ]);
        const s = new llkey(toks.front);
        expect(s.cast(`string`).str).toBe(`"22.0"`);
        expect(s.cast(`key`).str).toBe(`(key)"22.0"`);
        expect(s.cast(`list`).str).toBe(`[(key)"22.0"]`);
    });

    it(`cast_02`, async () => {
        const toks = make_tokens_mok([
            { kind: `token`, str: `(key)`, flag: flag.NAME_FLAG | flag.CASTING_FLAG },
            { kind: `token`, str: `"Hello world!"`, flag: flag.STRING_FLAG },
        ]);
        const s = new llkey(toks.front);
        expect(s.cast(`string`).str).toBe(`"Hello world!"`);
        expect(s.cast(`key`).str).toBe(`(key)"Hello world!"`);
        expect(s.cast(`list`).str).toBe(`[(key)"Hello world!"]`);
    });

    it(`cast_03`, async () => {
        const toks = make_tokens_mok([
            { kind: `token`, str: `(key)`, flag: flag.NAME_FLAG | flag.CASTING_FLAG },
            { kind: `token`, str: `"<1,2,3>"`, flag: flag.STRING_FLAG },
        ]);
        const s = new llkey(toks.front);
        expect(s.cast(`string`).str).toBe(`"<1,2,3>"`);
        expect(s.cast(`key`).str).toBe(`(key)"<1,2,3>"`);
        expect(s.cast(`list`).str).toBe(`[(key)"<1,2,3>"]`);
    });

    it(`cast_04`, async () => {
        const toks = make_tokens_mok([
            { kind: `token`, str: `(key)`, flag: flag.NAME_FLAG | flag.CASTING_FLAG },
            { kind: `token`, str: `"<1,2,3,4>"`, flag: flag.STRING_FLAG },
        ]);
        const s = new llkey(toks.front);
        expect(s.cast(`string`).str).toBe(`"<1,2,3,4>"`);
        expect(s.cast(`key`).str).toBe(`(key)"<1,2,3,4>"`);
        expect(s.cast(`list`).str).toBe(`[(key)"<1,2,3,4>"]`);
    });

    it(`cast_05`, async () => {
        const toks = make_tokens_mok([
            { kind: `token`, str: `(key)`, flag: flag.NAME_FLAG | flag.CASTING_FLAG },
            { kind: `token`, str: `"[1,2.0,\\"Hello world!\\",\\"4fad7145-f825-aed8-d190-bd28aa6b9688\\",<1,2,3>,<1,2,3,4>,[1,2,3,4]]"`, flag: flag.STRING_FLAG },
        ]);
        const s = new llkey(toks.front);
        expect(s.cast(`string`).str).toBe(String.raw`"[1,2.0,\"Hello world!\",\"4fad7145-f825-aed8-d190-bd28aa6b9688\",<1,2,3>,<1,2,3,4>,[1,2,3,4]]"`);
        expect(s.cast(`key`).str).toBe(String.raw`(key)"[1,2.0,\"Hello world!\",\"4fad7145-f825-aed8-d190-bd28aa6b9688\",<1,2,3>,<1,2,3,4>,[1,2,3,4]]"`);
        expect(s.cast(`list`).str).toBe(String.raw`[(key)"[1,2.0,\"Hello world!\",\"4fad7145-f825-aed8-d190-bd28aa6b9688\",<1,2,3>,<1,2,3,4>,[1,2,3,4]]"]`);
    });

    // ===========================================================================================

    it(`cast_06`, async () => {
        const s = new llkey(`(key)"22"`);
        expect(s.cast(`string`).str).toBe(`"22"`);
        expect(s.cast(`key`).str).toBe(`(key)"22"`);
        expect(s.cast(`list`).str).toBe(`[(key)"22"]`);
    });

    it(`cast_07`, async () => {
        const s = new llkey(`(key)"22.0"`);
        expect(s.cast(`string`).str).toBe(`"22.0"`);
        expect(s.cast(`key`).str).toBe(`(key)"22.0"`);
        expect(s.cast(`list`).str).toBe(`[(key)"22.0"]`);
    });

    it(`cast_08`, async () => {
        const s = new llkey(`(key)"Hello world!"`);
        expect(s.cast(`string`).str).toBe(`"Hello world!"`);
        expect(s.cast(`key`).str).toBe(`(key)"Hello world!"`);
        expect(s.cast(`list`).str).toBe(`[(key)"Hello world!"]`);
    });

    it(`cast_09`, async () => {
        const s = new llkey(`(key)"<1,2,3>"`);
        expect(s.cast(`string`).str).toBe(`"<1,2,3>"`);
        expect(s.cast(`key`).str).toBe(`(key)"<1,2,3>"`);
        expect(s.cast(`list`).str).toBe(`[(key)"<1,2,3>"]`);
    });

    it(`cast_10`, async () => {
        const s = new llkey(`(key)"<1,2,3,4>"`);
        expect(s.cast(`string`).str).toBe(`"<1,2,3,4>"`);
        expect(s.cast(`key`).str).toBe(`(key)"<1,2,3,4>"`);
        expect(s.cast(`list`).str).toBe(`[(key)"<1,2,3,4>"]`);
    });

    // =============================================================================================

    it(`cast_11`, async () => {
        const s = new llkey(`"22"`);
        expect(s.cast(`string`).str).toBe(`"22"`);
        expect(s.cast(`key`).str).toBe(`(key)"22"`);
        expect(s.cast(`list`).str).toBe(`[(key)"22"]`);
    });

    it(`cast_12`, async () => {
        const s = new llkey(`"22.0"`);
        expect(s.cast(`string`).str).toBe(`"22.0"`);
        expect(s.cast(`key`).str).toBe(`(key)"22.0"`);
        expect(s.cast(`list`).str).toBe(`[(key)"22.0"]`);
    });

    it(`cast_13`, async () => {
        const s = new llkey(`"Hello world!"`);
        expect(s.cast(`string`).str).toBe(`"Hello world!"`);
        expect(s.cast(`key`).str).toBe(`(key)"Hello world!"`);
        expect(s.cast(`list`).str).toBe(`[(key)"Hello world!"]`);
    });

    it(`cast_14`, async () => {
        const s = new llkey(`"<1,2,3>"`);
        expect(s.cast(`string`).str).toBe(`"<1,2,3>"`);
        expect(s.cast(`key`).str).toBe(`(key)"<1,2,3>"`);
        expect(s.cast(`list`).str).toBe(`[(key)"<1,2,3>"]`);
    });

    it(`cast_15`, async () => {
        const s = new llkey(`"<1,2,3,4>"`);
        expect(s.cast(`string`).str).toBe(`"<1,2,3,4>"`);
        expect(s.cast(`key`).str).toBe(`(key)"<1,2,3,4>"`);
        expect(s.cast(`list`).str).toBe(`[(key)"<1,2,3,4>"]`);
    });

    xit(`error_00`, async () => { expect(true).toBeFalse(); });

});