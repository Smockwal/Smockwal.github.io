import { llliteral } from "../../../../lib/source/parser/lsl/lliteral.js";
import { load_spec } from "../../../../lib/source/parser/lsl/llspec.js";
import { script } from "../../../../lib/source/parser/lsl/script.js";
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

describe(`llliteral`, () => {
    beforeEach(async () => {
    });

    afterEach(async () => {
    });

    it(`can_be_use_as_00`, async () => {
        expect(llliteral.can_be_use_as(`integer`, `integer`)).toBeTrue();
        expect(llliteral.can_be_use_as(`integer`, `float`)).toBeTrue();
        expect(llliteral.can_be_use_as(`integer`, `string`)).toBeFalse();
        expect(llliteral.can_be_use_as(`integer`, `key`)).toBeFalse();
        expect(llliteral.can_be_use_as(`integer`, `vector`)).toBeFalse();
        expect(llliteral.can_be_use_as(`integer`, `rotation`)).toBeFalse();
        expect(llliteral.can_be_use_as(`integer`, `quaternion`)).toBeFalse();

        expect(llliteral.can_be_use_as(`float`, `integer`)).toBeFalse();
        expect(llliteral.can_be_use_as(`float`, `float`)).toBeTrue();
        expect(llliteral.can_be_use_as(`float`, `string`)).toBeFalse();
        expect(llliteral.can_be_use_as(`float`, `key`)).toBeFalse();
        expect(llliteral.can_be_use_as(`float`, `vector`)).toBeFalse();
        expect(llliteral.can_be_use_as(`float`, `rotation`)).toBeFalse();
        expect(llliteral.can_be_use_as(`float`, `quaternion`)).toBeFalse();

        expect(llliteral.can_be_use_as(`string`, `integer`)).toBeFalse();
        expect(llliteral.can_be_use_as(`string`, `float`)).toBeFalse();
        expect(llliteral.can_be_use_as(`string`, `string`)).toBeTrue();
        expect(llliteral.can_be_use_as(`string`, `key`)).toBeTrue();
        expect(llliteral.can_be_use_as(`string`, `vector`)).toBeFalse();
        expect(llliteral.can_be_use_as(`string`, `rotation`)).toBeFalse();
        expect(llliteral.can_be_use_as(`string`, `quaternion`)).toBeFalse();

        expect(llliteral.can_be_use_as(`key`, `integer`)).toBeFalse();
        expect(llliteral.can_be_use_as(`key`, `float`)).toBeFalse();
        expect(llliteral.can_be_use_as(`key`, `string`)).toBeTrue();
        expect(llliteral.can_be_use_as(`key`, `key`)).toBeTrue();
        expect(llliteral.can_be_use_as(`key`, `vector`)).toBeFalse();
        expect(llliteral.can_be_use_as(`key`, `rotation`)).toBeFalse();
        expect(llliteral.can_be_use_as(`key`, `quaternion`)).toBeFalse();

        expect(llliteral.can_be_use_as(`vector`, `integer`)).toBeFalse();
        expect(llliteral.can_be_use_as(`vector`, `float`)).toBeFalse();
        expect(llliteral.can_be_use_as(`vector`, `string`)).toBeFalse();
        expect(llliteral.can_be_use_as(`vector`, `key`)).toBeFalse();
        expect(llliteral.can_be_use_as(`vector`, `vector`)).toBeTrue();
        expect(llliteral.can_be_use_as(`vector`, `rotation`)).toBeFalse();
        expect(llliteral.can_be_use_as(`vector`, `quaternion`)).toBeFalse();

        expect(llliteral.can_be_use_as(`rotation`, `integer`)).toBeFalse();
        expect(llliteral.can_be_use_as(`rotation`, `float`)).toBeFalse();
        expect(llliteral.can_be_use_as(`rotation`, `string`)).toBeFalse();
        expect(llliteral.can_be_use_as(`rotation`, `key`)).toBeFalse();
        expect(llliteral.can_be_use_as(`rotation`, `vector`)).toBeFalse();
        expect(llliteral.can_be_use_as(`rotation`, `rotation`)).toBeTrue();
        expect(llliteral.can_be_use_as(`rotation`, `quaternion`)).toBeTrue();

        expect(llliteral.can_be_use_as(`quaternion`, `integer`)).toBeFalse();
        expect(llliteral.can_be_use_as(`quaternion`, `float`)).toBeFalse();
        expect(llliteral.can_be_use_as(`quaternion`, `string`)).toBeFalse();
        expect(llliteral.can_be_use_as(`quaternion`, `key`)).toBeFalse();
        expect(llliteral.can_be_use_as(`quaternion`, `vector`)).toBeFalse();
        expect(llliteral.can_be_use_as(`quaternion`, `rotation`)).toBeTrue();
        expect(llliteral.can_be_use_as(`quaternion`, `quaternion`)).toBeTrue();
    });

    it('can_be_cast_to_00', async () => {
        expect(llliteral.can_be_cast_to(`integer`, `integer`)).toBeTrue();
        expect(llliteral.can_be_cast_to(`integer`, `float`)).toBeTrue();
        expect(llliteral.can_be_cast_to(`integer`, `string`)).toBeTrue();
        expect(llliteral.can_be_cast_to(`integer`, `key`)).toBeFalse();
        expect(llliteral.can_be_cast_to(`integer`, `list`)).toBeTrue();
        expect(llliteral.can_be_cast_to(`integer`, `vector`)).toBeFalse();
        expect(llliteral.can_be_cast_to(`integer`, `quaternion`)).toBeFalse();

        expect(llliteral.can_be_cast_to(`float`, `integer`)).toBeTrue();
        expect(llliteral.can_be_cast_to(`float`, `float`)).toBeTrue();
        expect(llliteral.can_be_cast_to(`float`, `string`)).toBeTrue();
        expect(llliteral.can_be_cast_to(`float`, `key`)).toBeFalse();
        expect(llliteral.can_be_cast_to(`float`, `list`)).toBeTrue();
        expect(llliteral.can_be_cast_to(`float`, `vector`)).toBeFalse();
        expect(llliteral.can_be_cast_to(`float`, `quaternion`)).toBeFalse();

        expect(llliteral.can_be_cast_to(`string`, `integer`)).toBeTrue();
        expect(llliteral.can_be_cast_to(`string`, `float`)).toBeTrue();
        expect(llliteral.can_be_cast_to(`string`, `string`)).toBeTrue();
        expect(llliteral.can_be_cast_to(`string`, `key`)).toBeTrue();
        expect(llliteral.can_be_cast_to(`string`, `list`)).toBeTrue();
        expect(llliteral.can_be_cast_to(`string`, `vector`)).toBeTrue();
        expect(llliteral.can_be_cast_to(`string`, `quaternion`)).toBeTrue();

        expect(llliteral.can_be_cast_to(`key`, `integer`)).toBeTrue();
        expect(llliteral.can_be_cast_to(`key`, `float`)).toBeTrue();
        expect(llliteral.can_be_cast_to(`key`, `string`)).toBeTrue();
        expect(llliteral.can_be_cast_to(`key`, `key`)).toBeTrue();
        expect(llliteral.can_be_cast_to(`key`, `list`)).toBeTrue();
        expect(llliteral.can_be_cast_to(`key`, `vector`)).toBeFalse();
        expect(llliteral.can_be_cast_to(`key`, `quaternion`)).toBeFalse();

        expect(llliteral.can_be_cast_to(`list`, `integer`)).toBeFalse();
        expect(llliteral.can_be_cast_to(`list`, `float`)).toBeFalse();
        expect(llliteral.can_be_cast_to(`list`, `string`)).toBeTrue();
        expect(llliteral.can_be_cast_to(`list`, `key`)).toBeFalse();
        expect(llliteral.can_be_cast_to(`list`, `list`)).toBeTrue();
        expect(llliteral.can_be_cast_to(`list`, `vector`)).toBeFalse();
        expect(llliteral.can_be_cast_to(`list`, `quaternion`)).toBeFalse();

        expect(llliteral.can_be_cast_to(`vector`, `integer`)).toBeFalse();
        expect(llliteral.can_be_cast_to(`vector`, `float`)).toBeFalse();
        expect(llliteral.can_be_cast_to(`vector`, `string`)).toBeTrue();
        expect(llliteral.can_be_cast_to(`vector`, `key`)).toBeFalse();
        expect(llliteral.can_be_cast_to(`vector`, `list`)).toBeTrue();
        expect(llliteral.can_be_cast_to(`vector`, `vector`)).toBeTrue();
        expect(llliteral.can_be_cast_to(`vector`, `quaternion`)).toBeFalse();

        expect(llliteral.can_be_cast_to(`quaternion`, `integer`)).toBeFalse();
        expect(llliteral.can_be_cast_to(`quaternion`, `float`)).toBeFalse();
        expect(llliteral.can_be_cast_to(`quaternion`, `string`)).toBeTrue();
        expect(llliteral.can_be_cast_to(`quaternion`, `key`)).toBeFalse();
        expect(llliteral.can_be_cast_to(`quaternion`, `list`)).toBeTrue();
        expect(llliteral.can_be_cast_to(`quaternion`, `vector`)).toBeFalse();
        expect(llliteral.can_be_cast_to(`quaternion`, `quaternion`)).toBeTrue();
    });

    it(`can_be_assign_to_00`, async () => {
        expect(llliteral.can_be_assign_to(`integer`, `integer`)).toBeTrue();
        expect(llliteral.can_be_assign_to(`integer`, `float`)).toBeTrue();
        expect(llliteral.can_be_assign_to(`integer`, `string`)).toBeFalse();
        expect(llliteral.can_be_assign_to(`integer`, `key`)).toBeFalse();
        expect(llliteral.can_be_assign_to(`integer`, `list`)).toBeFalse();
        expect(llliteral.can_be_assign_to(`integer`, `vector`)).toBeFalse();
        expect(llliteral.can_be_assign_to(`integer`, `quaternion`)).toBeFalse();

        expect(llliteral.can_be_assign_to(`float`, `integer`)).toBeFalse();
        expect(llliteral.can_be_assign_to(`float`, `float`)).toBeTrue();
        expect(llliteral.can_be_assign_to(`float`, `string`)).toBeFalse();
        expect(llliteral.can_be_assign_to(`float`, `key`)).toBeFalse();
        expect(llliteral.can_be_assign_to(`float`, `list`)).toBeFalse();
        expect(llliteral.can_be_assign_to(`float`, `vector`)).toBeFalse();
        expect(llliteral.can_be_assign_to(`float`, `quaternion`)).toBeFalse();

        expect(llliteral.can_be_assign_to(`string`, `integer`)).toBeFalse();
        expect(llliteral.can_be_assign_to(`string`, `float`)).toBeFalse();
        expect(llliteral.can_be_assign_to(`string`, `string`)).toBeTrue();
        expect(llliteral.can_be_assign_to(`string`, `key`)).toBeTrue();
        expect(llliteral.can_be_assign_to(`string`, `list`)).toBeFalse();
        expect(llliteral.can_be_assign_to(`string`, `vector`)).toBeFalse();
        expect(llliteral.can_be_assign_to(`string`, `quaternion`)).toBeFalse();

        expect(llliteral.can_be_assign_to(`key`, `integer`)).toBeFalse();
        expect(llliteral.can_be_assign_to(`key`, `float`)).toBeFalse();
        expect(llliteral.can_be_assign_to(`key`, `string`)).toBeTrue();
        expect(llliteral.can_be_assign_to(`key`, `key`)).toBeTrue();
        expect(llliteral.can_be_assign_to(`key`, `list`)).toBeFalse();
        expect(llliteral.can_be_assign_to(`key`, `vector`)).toBeFalse();
        expect(llliteral.can_be_assign_to(`key`, `quaternion`)).toBeFalse();

        expect(llliteral.can_be_assign_to(`list`, `integer`)).toBeFalse();
        expect(llliteral.can_be_assign_to(`list`, `float`)).toBeFalse();
        expect(llliteral.can_be_assign_to(`list`, `string`)).toBeFalse();
        expect(llliteral.can_be_assign_to(`list`, `key`)).toBeFalse();
        expect(llliteral.can_be_assign_to(`list`, `list`)).toBeTrue();
        expect(llliteral.can_be_assign_to(`list`, `vector`)).toBeFalse();
        expect(llliteral.can_be_assign_to(`list`, `quaternion`)).toBeFalse();

        expect(llliteral.can_be_assign_to(`rotation`, `integer`)).toBeFalse();
        expect(llliteral.can_be_assign_to(`rotation`, `float`)).toBeFalse();
        expect(llliteral.can_be_assign_to(`rotation`, `string`)).toBeFalse();
        expect(llliteral.can_be_assign_to(`rotation`, `key`)).toBeFalse();
        expect(llliteral.can_be_assign_to(`rotation`, `vector`)).toBeFalse();
        expect(llliteral.can_be_assign_to(`rotation`, `rotation`)).toBeTrue();
        expect(llliteral.can_be_assign_to(`rotation`, `quaternion`)).toBeTrue();

        expect(llliteral.can_be_assign_to(`quaternion`, `integer`)).toBeFalse();
        expect(llliteral.can_be_assign_to(`quaternion`, `float`)).toBeFalse();
        expect(llliteral.can_be_assign_to(`quaternion`, `string`)).toBeFalse();
        expect(llliteral.can_be_assign_to(`quaternion`, `key`)).toBeFalse();
        expect(llliteral.can_be_assign_to(`quaternion`, `vector`)).toBeFalse();
        expect(llliteral.can_be_assign_to(`quaternion`, `rotation`)).toBeTrue();
        expect(llliteral.can_be_assign_to(`quaternion`, `quaternion`)).toBeTrue();
    });

    describe('llliteral.is_default_for', () => {
        let myScript;

        const parse_snippet = async (str, lvl = 0) => {
            const toks = new tokens(str);
            await convert_to_lsl(toks);
            myScript.flag_tokens(toks);
            return toks;
        };

        beforeAll(async () => {
            await load_spec(`../../../../lib/source/parser/lsl/lsl_data.json`);
        });

        beforeEach(async () => {
            myScript = new script();
        });

        describe('is_default_for', () => {
            it('should return true for default integer value', async () => {
                const toks = await parse_snippet('0');
                expect(llliteral.is_default_for('integer', toks.front)).toBeTrue();
            });

            it('should return true for default float value', async () => {
                const toks = await parse_snippet('0.0');
                expect(llliteral.is_default_for('float', toks.front)).toBeTrue();
            });

            it('should return true for default string value', async () => {
                const toks = await parse_snippet(`""`);
                expect(llliteral.is_default_for('string', toks.front)).toBeTrue();
            });

            it('should return true for default vector value', async () => {
                const toks = await parse_snippet(`<0.0, 0.0, 0.0>`);
                expect(llliteral.is_default_for('vector', toks.front)).toBeTrue();
            });

            it('should return true for default quaternion value', async () => {
                const toks = await parse_snippet(`<0.0, 0.0, 0.0, 1.0>`);
                expect(llliteral.is_default_for('quaternion', toks.front)).toBeTrue();
            });

            it('should return true for default rotation value', async () => {
                const toks = await parse_snippet(`<0.0, 0.0, 0.0, 1.0>`);
                expect(llliteral.is_default_for('rotation', toks.front)).toBeTrue();
            });

            it('should return true for default list value', async () => {
                const toks = await parse_snippet(`[]`);
                expect(llliteral.is_default_for('list', toks.front)).toBeTrue();
            });

            it('should return false for non-default values', async () => {
                let toks = await parse_snippet(`1`);
                expect(llliteral.is_default_for('integer', toks.front)).toBeFalse();

                toks = await parse_snippet(`0.1`);
                expect(llliteral.is_default_for('float', toks.front)).toBeFalse();

                toks = await parse_snippet(`"Hello"`);
                expect(llliteral.is_default_for('string', toks.front)).toBeFalse();

                toks = await parse_snippet(`<1.0, 0.0, 0.0>`);
                expect(llliteral.is_default_for('vector', toks.front)).toBeFalse();

                toks = await parse_snippet(`<0.0, 0.0, 0.0, 0.0>`);
                expect(llliteral.is_default_for('quaternion', toks.front)).toBeFalse();

                toks = await parse_snippet(`<0.0, 0.0, 0.0, 0.0>`);
                expect(llliteral.is_default_for('rotation', toks.front)).toBeFalse();

                toks = await parse_snippet(`[1, 2, 3]`);
                expect(llliteral.is_default_for('list', toks.front)).toBeFalse();
            });
        });
    });

    describe('llliteral.vec_entries method', () => {
        let myScript;

        const parse_snippet = async (str, lvl = 0) => {
            const toks = new tokens(str);
            await convert_to_lsl(toks);
            myScript.flag_tokens(toks);
            return toks;
        };

        beforeAll(async () => {
            await load_spec(`../../../../lib/source/parser/lsl/lsl_data.json`);
        });

        beforeEach(async () => {
            myScript = new script();
        });

        it('should return an empty array when the token does not represent an opening angle bracket', async () => {
            const toks = await parse_snippet(`+`);
            expect(llliteral.vec_entries(toks.front)).toEqual([]);
        });


        it('should return an array of expressions representing the vector entries', async () => {
            const toks = await parse_snippet(`<1, 2, 3, 4>`);

            const res = llliteral.vec_entries(toks.front);
            const expected = [`1`, `2`, `3`, `4`];

            for (let i = 0; i < res.length; i++) {
                expect(res[i].str).toEqual(expected[i]);
            }

        });

        it('should handle vector entries with nested expressions', async () => {
            const toks = await parse_snippet(`<1 + 2, 3 * 4, 5>`);

            const res = llliteral.vec_entries(toks.front);
            const expected = [`1 + 2`, `3 * 4`, `5`];

            for (let i = 0; i < res.length; i++) {
                expect(res[i].str).toEqual(expected[i]);
            }
        });

    });

    describe('list_entries', () => {
        let myScript;

        const parse_snippet = async (str, lvl = 0) => {
            const toks = new tokens(str);
            await convert_to_lsl(toks);
            myScript.flag_tokens(toks);
            return toks;
        };

        beforeAll(async () => {
            await load_spec(`../../../../lib/source/parser/lsl/lsl_data.json`);
        });

        beforeEach(async () => {
            myScript = new script();
        });

        it('should return an empty array for empty list tokens', async () => {
            const toks = await parse_snippet(`[]`);
            expect(llliteral.list_entries(toks.front)).toEqual([]);
        });

        it('should return an array of expressions for a list token with entries', async () => {
            const toks = await parse_snippet(`[1, 2, 3]`);

            const res = llliteral.list_entries(toks.front);
            const expected = [`1`, `2`, `3`];

            for (let i = 0; i < res.length; i++) {
                expect(res[i].str).toEqual(expected[i]);
            }
        });

        it('should handle nested expressions', async () => {
            const toks = await parse_snippet(`[1, 2 + 6, ((string)["a","b"])]`);

            const res = llliteral.list_entries(toks.front);
            const expected = [`1`, `2 + 6`, `((string)["a","b"])`];

            for (let i = 0; i < res.length; i++) {
                expect(res[i].str).toEqual(expected[i]);
            }
        });

        it(`list_entries_000`, async () => {
            const toks0 = await parse_snippet(`list a = [0, 2, 1+2];`, `main.lsl`);
            const ent = llliteral.list_entries(toks0.find_str(`[`));
            expect(ent.length).toBe(3);
            expect(ent[0].str).toBe("0");
            expect(ent[1].str).toBe("2");
            expect(ent[2].str).toBe("1+2");
        });

        it(`list_entries_001`, async () => {
            const toks0 = await parse_snippet(`string b;list a = [<1,1,1>, llAbs(9), b];`, `main.lsl`);
            const ent = llliteral.list_entries(toks0.find_str(`[`));
            expect(ent.length).toBe(3);
            expect(ent[0].str).toBe("<1,1,1>");
            expect(ent[1].str).toBe("llAbs(9)");
            expect(ent[2].str).toBe("b");
        });

        it(`list_entries_002`, async () => {
            const toks0 = await parse_snippet(`list a = [-0.02, (0.49 / 8) * 3, -(((0.032 / 2) + 0.042) - (0.064 / 2) - 0.005)];`, `main.lsl`);
            const ent = llliteral.list_entries(toks0.find_str(`[`));
            expect(ent.length).toBe(3);
            expect(ent[0].str).toBe("-0.02");
            expect(ent[1].str).toBe("( 0.49/ 8) * 3");
            expect(ent[2].str).toBe("-((( 0.032/ 2) +  0.042 ) - ( 0.064/ 2) -  0.005 )");
        });

        xit(`list_entries_003`, async () => {
            const toks0 = await parse_snippet(`"a" + ["b"]`, `main.lsl`);
            const ent = llliteral.list_entries(toks0.find_str(`[`));
            expect(ent.length).toBe(2);
            expect(ent[0].str).toBe(`"a"`);
            expect(ent[1].str).toBe(`"b"`);
        });

        xit(`list_entries_004`, async () => {
            const toks0 = await parse_snippet(`["b"] + "c"`, `main.lsl`);
            const ent = llliteral.list_entries(toks0.find_str(`[`));
            expect(ent.length).toBe(2);
            expect(ent[0].str).toBe(`"b"`);
            expect(ent[1].str).toBe(`"c"`);
        });

        xit(`list_entries_005`, async () => {
            const toks0 = await parse_snippet(`"a" + ["b"] + "c"`, `main.lsl`);
            const ent = llliteral.list_entries(toks0.find_str(`[`));
            expect(ent.length).toBe(3);
            expect(ent[0].str).toBe(`"a"`);
            expect(ent[1].str).toBe(`"b"`);
            expect(ent[2].str).toBe(`"c"`);
        });

        it(`list_entries_006`, async () => {
            const toks0 = await parse_snippet(`list b;["a"] + b + ["c"]`, `main.lsl`);
            const ent = llliteral.list_entries(toks0.find_str(`[`));
            expect(ent.length).toBe(1);
            expect(ent[0].str).toBe(`"a"`);
        });

        it(`list_entries_007`, async () => {
            const toks0 = await parse_snippet(`list b;["a"] + b + ["c"]`, `main.lsl`);
            const ent = llliteral.list_entries(toks0.find_str_r(`[`));
            expect(ent.length).toBe(1);
            expect(ent[0].str).toBe(`"c"`);
        });

    });

    describe('list_string_entries', () => {
        let myScript;

        const parse_snippet = async (str, lvl = 0) => {
            const toks = new tokens(str);
            await convert_to_lsl(toks);
            myScript.flag_tokens(toks);
            return toks;
        };

        beforeAll(async () => {
            await load_spec(`../../../../lib/source/parser/lsl/lsl_data.json`);
        });

        beforeEach(async () => {
            myScript = new script();
        });

        it('should return an empty array for empty list tokens', async () => {
            const toks = await parse_snippet(`[]`);
            expect(llliteral.list_string_entries(toks.front)).toEqual([]);
        });

        it('should parse a token and return a list of string entries', async () => {
            const toks = await parse_snippet(`[123]`);

            const res = llliteral.list_string_entries(toks.front);
            const expected = [`123`];

            for (let i = 0; i < res.length; i++) {
                expect(res[i]).toEqual(expected[i]);
            }
        });

        it('should parse a token with a float number and return a list of string entries', async () => {
            const toks = await parse_snippet(`[123.45]`);

            const res = llliteral.list_string_entries(toks.front);
            const expected = [`123.45000`];

            for (let i = 0; i < res.length; i++) {
                expect(res[i]).toEqual(expected[i]);
            }
        });

        it('should parse a token with a string and return a list of string entries', async () => {
            const toks = await parse_snippet(`["Hello, World!"]`);

            const res = llliteral.list_string_entries(toks.front);
            const expected = [`Hello, World!`];

            for (let i = 0; i < res.length; i++) {
                expect(res[i]).toEqual(expected[i]);
            }
        });

        it('should parse a token with a vector and return a list of string entries', async () => {
            const toks = await parse_snippet(`[<1, 2, 3>]`);

            const res = llliteral.list_string_entries(toks.front);
            const expected = [`<1., 2., 3.>`];

            for (let i = 0; i < res.length; i++) {
                expect(res[i]).toEqual(expected[i]);
            }
        });

        it('should parse a token with a quaternion and return a list of string entries', async () => {
            const toks = await parse_snippet(`[<1, 2, 3, 4>]`);

            const res = llliteral.list_string_entries(toks.front);
            const expected = [`<1., 2., 3., 4.>`];

            for (let i = 0; i < res.length; i++) {
                expect(res[i]).toEqual(expected[i]);
            }
        });
    });

    describe('list_from_entries', () => {
        let myScript;

        const parse_snippet = async (str, lvl = 0) => {
            const toks = new tokens(str);
            await convert_to_lsl(toks);
            myScript.flag_tokens(toks);
            return toks;
        };

        beforeAll(async () => {
            await load_spec(`../../../../lib/source/parser/lsl/lsl_data.json`);
        });

        beforeEach(async () => {
            myScript = new script();
        });

        it('should create a new tokens object with a list of entries', async () => {

            const entries = [
                await parse_snippet(`entry1`), 
                await parse_snippet(`entry2`), 
                await parse_snippet(`entry3`)
            ];
            const tokensObj = llliteral.list_from_entries(entries);

            expect(tokensObj.str).toEqual('[ entry1 , entry2 , entry3 ]');
        });

        it('should filter out empty strings', async () => {
            const entries = [
                await parse_snippet(`entry1`), 
                new tokens(``),
                await parse_snippet(`entry2`), 
                new tokens(``),
                await parse_snippet(`entry3`)
            ];
            const tokensObj = llliteral.list_from_entries(entries);

            expect(tokensObj.str).toEqual('[ entry1 , entry2 , entry3 ]');
        });

        it('should handle single entry', async () => {
            const entries = [
                await parse_snippet(`singleEntry`)
            ];
            const tokensObj = llliteral.list_from_entries(entries);

            expect(tokensObj.str).toEqual('[ singleEntry ]');
        });

        it('should handle no entries', async () => {
            const entries = [];
            const tokensObj = llliteral.list_from_entries(entries);

            expect(tokensObj.str).toEqual('[]');
        });
    });

});