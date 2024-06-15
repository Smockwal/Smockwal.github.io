import { error } from "../../lib/error.js";
import { source, src } from "../../lib/source/source.js";
import { tokens } from "../../lib/source/tokens.js";


describe(`source`, () => {

    it(`constructor_000`, async () => {
        let a = new source();
        //expect(1).toBe(2);
    });

    it(`constructor_001`, async () => {
        let a = new source();
        expect(src instanceof source).toBeTrue();
    });

    it(`constructor_002`, async () => {
        const toks0 = new tokens(`integer a;`, `main.lsl`);
        expect(() => src.parse_src(toks0)).toThrow(new error(`virtual function call.`));
    });

    it(`parse_src_000`, async () => {
        const toks0 = new tokens();
        expect(() => src.parse_src(toks0)).toThrow(new error(`virtual function call.`));
    });

    it(`parse_src_001`, async () => {
        const toks0 = new tokens(`integer a;`, `main.lsl`);
        expect(() => src.parse_src(toks0)).toThrow(new error(`virtual function call.`));
    });

    it(`flag_tokens_000`, async () => {
        const toks0 = new tokens(`integer a;`, `main.lsl`);
        expect(() => src.flag_tokens(toks0)).toThrow(new error(`virtual function call.`));
    });

    it(`parse_scope_000`, async () => {
        const toks0 = new tokens(`integer a;`, `main.lsl`);
        expect(() => src.parse_scope(toks0)).toThrow(new error(`virtual function call.`));
    });

    it(`collect_name_000`, async () => {
        const toks0 = new tokens(`integer a;`, `main.lsl`);
        expect(() => src.collect_name(toks0)).toThrow(new error(`virtual function call.`));
    });

});

