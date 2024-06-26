import { message } from "../../../../lib/source/message.js";
import { llobj } from "../../../../lib/source/parser/lsl/llobj.js";
import { load_spec } from "../../../../lib/source/parser/lsl/llspec.js";
import { src } from "../../../../lib/source/source.js";
import { tokens } from "../../../../lib/source/tokens.js";

describe(`llobj`, () => {
    beforeAll(async () => {
        await load_spec(`../../../../lib/source/parser/lsl/lsl_data.json`);
    });

    afterEach(async () => {
        message.print();
        message.clear();
    });

    it(`constructor_00`, async () => {
        const jtoks = src.flag_tokens(new tokens(`{}`));
        const obj = new llobj(jtoks.front);
        expect(obj.length).toBe(0);
    });

    it(`constructor_01`, async () => {
        const jtoks = src.flag_tokens(new tokens(`{"a":0}`));
        const obj = new llobj(jtoks.front);
        expect(obj.length).toBe(1);
        expect(obj.get("a").str).toBe(`0`);
    });

    it(`constructor_02`, async () => {
        const jtoks = src.flag_tokens(new tokens(`{"a":0}`));
        const obj = new llobj(jtoks.front);
        expect(obj.length).toBe(1);
        expect(obj.get("a").str).toBe(`0`);
    });

    it(`constructor_02`, async () => {
        const jtoks = src.flag_tokens(new tokens(`{"a":3,"b":[true,"test",6]}`));
        const obj = new llobj(jtoks.front);
        expect(obj.length).toBe(2);
        expect(obj.get("b").str).toBe(`[true,"test",6]`);
    });

    it(`str_00`, async () => {
        const jtoks = src.flag_tokens(new tokens(`{"a":3,"b":[true,"test",6]}`));
        const obj = new llobj(jtoks.front);
        expect(obj.length).toBe(2);
        expect(obj.str).toBe(`{\\"a\\":3,\\"b\\":[true, \\"test\\", 6]}`);
        expect(obj.jstr).toBe(`{"a":3,"b":[true,"test",6]}`);
    });

    it(`empty_00`, async () => {
        const jtoks = src.flag_tokens(new tokens(`{}`));
        const obj = new llobj(jtoks.front);
        expect(obj.empty()).toBeTrue();
    });

    it(`empty_01`, async () => {
        const jtoks = src.flag_tokens(new tokens(`{"a":3}`));
        const obj = new llobj(jtoks.front);
        expect(obj.empty()).toBeFalse();
    });

    it(`keys_00`, async () => {
        const jtoks = src.flag_tokens(new tokens(`{"a":0,"b":1,"c":2}`));
        const obj = new llobj(jtoks.front);
        expect(obj.keys()).toEqual(["a", "b", "c"]);
    });

    it(`keys_01`, async () => {
        const jtoks = src.flag_tokens(new tokens(`{}`));
        const obj = new llobj(jtoks.front);
        expect(obj.keys()).toEqual([]);
    });

    it(`get_00`, async () => {
        const jtoks = src.flag_tokens(new tokens(`{"a":0,"b":1,"c":2}`));
        const obj = new llobj(jtoks.front);
        expect(obj.get("a").str).toBe("0");
        expect(obj.get("b").str).toBe("1");
        expect(obj.get("c").str).toBe("2");
    });

    it(`set_00`, async () => {
        const jtoks = src.flag_tokens(new tokens(`{"a":0,"b":1,"c":2}`));
        const obj = new llobj(jtoks.front);
        obj.set("a", new tokens(`true`));
        expect(obj.get("a").str).toBe("true");
    });

    it(`at_00`, async () => {
        const jtoks = src.flag_tokens(new tokens(`{"a":0,"b":1,"c":2}`));
        const obj = new llobj(jtoks.front);
        expect(obj.at("a").str).toBe("0");
        expect(obj.at("b").str).toBe("1");
        expect(obj.at("c").str).toBe("2");
    });

    it(`has_00`, async () => {
        const jtoks = src.flag_tokens(new tokens(`{"a":0,"b":1,"c":2}`));
        const obj = new llobj(jtoks.front);
        expect(obj.has("a")).toBeTrue();
        expect(obj.has("b")).toBeTrue();
        expect(obj.has("c")).toBeTrue();
        expect(obj.has("d")).toBeFalse();
    });

    it(`rem_00`, async () => {
        const jtoks = src.flag_tokens(new tokens(`{"a":0,"b":1,"c":2}`));
        const obj = new llobj(jtoks.front);
        obj.rem("a");
        expect(obj.has("a")).toBeFalse();
    });

    xit(`error_00`, async () => { expect(true).toBeFalse(); });
});