import { flag } from "../../../../lib/global.js";
import { message } from "../../../../lib/source/message.js";
import { load_spec } from "../../../../lib/source/parser/lsl/llspec.js";
import { convert_to_lsl } from "../../../../lib/source/parser/lsl/translate.js";
import { tokens } from "../../../../lib/source/tokens.js";
import { reset_index, string } from "../../../../lib/text/string.js";
import { test_tokens } from "../../../test.js";


describe(`lsl_translate`, () => {

    beforeEach(async () => {
        await load_spec(`../../../../lib/source/parser/lsl/lsl_data.json`);
        reset_index();
    });

    afterEach(() => {
        message.print();
        message.clear();
    });

    it(`invalide_000`, async () => {
        let toks0 = new tokens(`string #version = "1.0";`);
        await convert_to_lsl(toks0);

        //console.log(flag.to_string(toks0.front.next.flag));
        //console.log(toks0.stringify());
        test_tokens(toks0, [`string`, `version`, `=`, `"1.0"`, `;`]);

    });

    it(`string_000`, async () => {
        let toks0 = new tokens(`"a" "b"`);
        await convert_to_lsl(toks0);
        test_tokens(toks0, ["\"ab\""]);

    });

    it(`string_001`, async () => {
        let toks0 = new tokens(`"a猫🍌"`);
        await convert_to_lsl(toks0);
        test_tokens(toks0, [`"a猫🍌"`]);
    });

    it(`string_002`, async () => {
        let toks0 = new tokens(`u8"\x61\xE7\x8C\xAB\xF0\x9F\x8D\x8C"`);
        test_tokens(toks0, [`u8"\x61\xE7\x8C\xAB\xF0\x9F\x8D\x8C"`]);

        await convert_to_lsl(toks0);
        expect(toks0.str).toBe(`"\u61E7\u8CAB\uF09F\u8D8C"`);
    });

    it(`string_003`, async () => {
        let toks0 = new tokens(`u"\u0061\u732B\uD83C\uDF4C"`);
        test_tokens(toks0, [`u"a猫🍌"`]);

        await convert_to_lsl(toks0);
        expect(toks0.stringify()).toBe(`"\u0061\u732B\uD83C\uDF4C"`);
    });

    it(`string_004`, async () => {
        let toks0 = new tokens(`U"\u{00000061}\u{0000732B}\u{0001F34C}"`);
        test_tokens(toks0, [`U"a猫🍌"`]);

        await convert_to_lsl(toks0);
        expect(toks0.str).toBe(`"\u0000\u0061\u0000\u732B\u0001\uF34C"`);
    });

    it(`string_005`, async () => {
        let toks0 = new tokens(`L"\u{00000061}\u{0000732B}\u{0001F34C}"`);
        test_tokens(toks0, [`L"a猫🍌"`]);

        await convert_to_lsl(toks0);
        expect(toks0.str).toBe(`"\u0000\u0061\u0000\u732B\u0001\uF34C"`);
    });

    it('string_merging_000', async () => {
        let toks0 = new tokens(`"a" "b"`);
        await convert_to_lsl(toks0);
        expect(message.length()).toBe(0);
        expect(toks0.stringify()).toBe(`"ab"`);
    });

    it('string_merging_001', async () => {
        let toks0 = new tokens(`"a" "b" "c"`);
        await convert_to_lsl(toks0);
        expect(message.length()).toBe(0);
        expect(toks0.front.flag & flag.STRING_FLAG).toBe(flag.STRING_FLAG);
        expect(toks0.stringify()).toBe(`"abc"`);
    });

    it(`number_001`, async () => {
        let toks0 = new tokens(`01`);
        await convert_to_lsl(toks0);
        expect(toks0.str).toBe(`1`);
    });

    it(`number_002`, async () => {
        let toks0 = new tokens(`010`);
        await convert_to_lsl(toks0);
        expect(toks0.str).toBe(`8`);
    });

    it(`number_003`, async () => {
        let toks0 = new tokens(`014`);
        await convert_to_lsl(toks0);
        expect(toks0.str).toBe(`12`);
    });

    it(`number_004`, async () => {
        let toks0 = new tokens(`0x0`);
        await convert_to_lsl(toks0);
        expect(toks0.str).toBe(`0x0`);
    });

    it(`number_005`, async () => {
        let toks0 = new tokens(`0xFF`);
        await convert_to_lsl(toks0);
        expect(toks0.str).toBe(`0xFF`);
    });

    it(`number_006`, async () => {
        let toks0 = new tokens(`0b00000000000000000000000000000001`);
        await convert_to_lsl(toks0);
        expect(toks0.str).toBe(`1`);
    });

    it(`number_007`, async () => {
        let toks0 = new tokens(`0b1`);
        await convert_to_lsl(toks0);
        expect(toks0.str).toBe(`1`);
    });

    it(`number_008`, async () => {
        let toks0 = new tokens(`0b0101`);
        await convert_to_lsl(toks0);
        expect(toks0.str).toBe(`5`);
    });

    it(`number_009`, async () => {
        let toks0 = new tokens(`0.f`);
        await convert_to_lsl(toks0);
        expect(toks0.str).toBe(`0.`);
    });

    it(`number_010`, async () => {
        let toks0 = new tokens(`0.5f`);
        await convert_to_lsl(toks0);
        expect(toks0.str).toBe(`0.5`);
    });

    it(`number_011`, async () => {
        let toks0 = new tokens(`0.5l`);
        await convert_to_lsl(toks0);
        expect(toks0.str).toBe(`0.5`);
    });

    it(`number_012`, async () => {
        let toks0 = new tokens(`1.4f`);
        await convert_to_lsl(toks0);
        expect(toks0.str).toBe(`1.4`);
    });

    it(`number_013`, async () => {
        let toks0 = new tokens(`0xff`);
        await convert_to_lsl(toks0);
        expect(toks0.str).toBe(`0xFF`);
    });

    it(`number_014`, async () => {
        let toks0 = new tokens(`0x1.FFFFFEp+62`);
        await convert_to_lsl(toks0);
        expect(toks0.str).toBe(`0x1.FFFFFEp+62`);
    });

    it(`number_015`, async () => {
        let toks0 = new tokens(`-123.4e-5`);
        await convert_to_lsl(toks0);
        expect(toks0.stringify()).toBe(`-123.4e-5`);
    });

    it(`symbol_000`, async () => {
        let toks0 = new tokens(`-1`);
        test_tokens(await convert_to_lsl(toks0), [`-1`]);
    });

    it(`symbol_001`, async () => {
        let toks0 = new tokens(`let a = -6;`, `main.lsl`);
        test_tokens(await convert_to_lsl(toks0), [`let`, `a`, `=`, `-6`, `;`]);
    });

    it(`symbol_002`, async () => {
        let toks0 = new tokens(`let a += -6;`, `main.lsl`);
        test_tokens(await convert_to_lsl(toks0), [`let`, `a`, `+=`, `-6`, `;`]);
    });

    it(`symbol_003`, async () => {
        let toks0 = new tokens(`let a = func(-1) < ~-6;`, `main.lsl`);
        test_tokens(await convert_to_lsl(toks0), [`let`, `a`, `=`, `func`, `(`, `-1`, `)`, `<`, `~`, `-6`, `;`]);
    });

    it(`symbol_004`, async () => {
        let toks0 = new tokens(`func(){jump _;\n@ _;}`, `main.lsl`);
        test_tokens(await convert_to_lsl(toks0), [`func`, `(`, `)`, `{`, `jump`, `_`, `;`, `@`, `_`, `;`, `}`]);
    });

    it(`break_000`, async () => {
        let toks0 = new tokens(`while(1){let b = 0; break;}`, `main.lsl`);
        test_tokens(await convert_to_lsl(toks0), [`while`, `(`, `1`, `)`, `{`, `let`, `b`, `=`, `0`, `;`, `jump`, `_`, `;`, `}`, `@`, `_`, `;`]);
    });

    it(`break_001`, async () => {
        let toks0 = new tokens(`do{break;}while(1);`, `main.lsl`);
        test_tokens(await convert_to_lsl(toks0), [`do`, `{`, `jump`, `_`, `;`, `}`, `while`, `(`, `1`, `)`, `;`, `@`, `_`, `;`]);
    });

    it(`break_002`, async () => {
        let toks0 = new tokens(`for(;b; ++b){break;}`, `main.lsl`);
        test_tokens(await convert_to_lsl(toks0), [`for`, `(`, `;`, `b`, `;`, `++`, `b`, `)`, `{`, `jump`, `_`, `;`, `}`, `@`, `_`, `;`]);
    });

    it(`break_003`, async () => {
        let toks0 = new tokens(`for(;b; ++b){break;}`, `main.lsl`);
        test_tokens(await convert_to_lsl(toks0), [`for`, `(`, `;`, `b`, `;`, `++`, `b`, `)`, `{`, `jump`, `_`, `;`, `}`, `@`, `_`, `;`]);
    });

    it(`break_004`, async () => {
        const toks0 = new tokens(`while(1){break;while(1){break;}}`, `main.lsl`);
        //console.log(toks0.str);

        const toks1 = await convert_to_lsl(toks0);
        //console.log(toks1.str);

        test_tokens(toks1, [`while`,`(`,`1`,`)`,`{`,`jump`,`_`,`;`,`while`,`(`,`1`,`)`,`{`,`jump`,`a`,`;`,`}`,`@`,`a`,`;`,`}`,`@`,`_`,`;`]);
    });

    it(`continue_000`, async () => {
        let toks0 = new tokens(`while(1){let b = 0; continue;}`, `main.lsl`);
        const toks = await convert_to_lsl(toks0);
        expect(string.simplify(toks.str)).toBe(`while(1){let b = 0; jump _ ; @_; }`);
        test_tokens(await convert_to_lsl(toks0), [`while`, `(`, `1`, `)`, `{`, `let`, `b`, `=`, `0`, `;`, `jump`, `_`, `;`, `@`, `_`, `;`, `}`]);
    });

    it(`continue_001`, async () => {;
        let toks0 = new tokens(`for(;b;++b){continue;let a=0;}`, `main.lsl`);
        const toks = await convert_to_lsl(toks0);
        expect(string.simplify(toks.str)).toBe(`for(;b;++b){ jump _ ;let a=0; @_; }`);
        test_tokens(toks, [`for`, `(`, `;`, `b`, `;`, `++`, `b`, `)`, `{`, `jump`, `_`, `;`, `let`, `a`, `=`, `0`, `;`, `@`, `_`, `;`, `}`]);
    });

    it(`name_000`, async () => {
        let toks0 = new tokens(`let fuzzy©©©© = 2;`, `main.lsl`);
        //console.log(toks0.stringify());
        test_tokens(await convert_to_lsl(toks0), [`let`, `fuzzy`, `=`, `2`, `;`]);
    });

});