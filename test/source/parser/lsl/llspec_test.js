import { clear_specs, llspec, load_spec } from "../../../../lib/source/parser/lsl/llspec.js";

const rel_spec_path = `../../../../lib/source/parser/lsl/lsl_data.json`;

describe(`spec`, () => {

    afterEach(() => {clear_specs() });

    it(`load_spec_000`, async () => {
        expect(async () => { await load_spec(rel_spec_path); }).not.toThrow();
    });

    it(`spec contain_000`, async () => {
        await load_spec(rel_spec_path);
        expect(llspec).toBeDefined();
        expect(llspec.constants).toBeDefined();
        expect(llspec.controls).toBeDefined();
        expect(llspec.events).toBeDefined();
        expect(llspec.functions).toBeDefined();
        expect(llspec.type).toBeDefined();
    });
});