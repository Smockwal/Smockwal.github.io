import { message } from "../../../../lib/source/message.js";
import { llstr } from "../../../../lib/source/parser/lsl/llstr.js";
import { tokens } from "../../../../lib/source/tokens.js";
import { convert_to_lsl } from "../../../../lib/source/parser/lsl/translate.js";
import { load_spec } from "../../../../lib/source/parser/lsl/llspec.js";
import { parsing } from "../../../../lib/source/parser/lsl/parsing.js";
import { type_error } from "../../../../lib/error.js";

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



describe(`llstr`, () => {
    beforeAll(async () => {
        await load_spec(`../../../../lib/source/parser/lsl/lsl_data.json`);
    });

    afterEach(async () => {

    });

    describe('constructor', () => {
        let instance;

        beforeEach(() => {
            instance = new llstr();
        });

        it('should initialize with an empty string', () => {
            expect(instance.value).toEqual('');
        });

        it('should parse a token and initialize the value', () => {
            const token = { kind: `token`, str: '"test string"' };
            instance = new llstr(token);
            expect(instance.value).toEqual('test string');
        });

    });

    describe('kind', () => {
        let instance = new llstr();

        it('should return "llstr"', () => {
            expect(instance.kind).toEqual('llstr');
        });
    });

    describe('value', () => {
        let instance = new llstr();

        it('should set the value', () => {
            instance.value = 'new value';
            expect(instance.value).toEqual('new value');
        });

        it('should throw an error when setting a non-string value', () => {
            expect(() => {
                instance.value = 123;
            }).toThrowError(type_error, 'value is not a string.');
        });
    });

    describe('str', () => {
        let instance = new llstr();

        it('should return the value enclosed in double quotes', () => {
            instance.value = 'test string';
            expect(instance.str).toEqual('"test string"');
        });
    });

    describe('def', () => {
        it('should return an empty string enclosed in double quotes', () => {
            expect(llstr.def).toEqual('""');
        });
    });

    describe('literal', () => {
        let instance = new llstr();

        it('should return true', () => {
            expect(instance.literal).toEqual(true);
        });
    });

    describe('parse', () => {
        let instance = new llstr();

        it('should parse a string and initialize the value', () => {
            instance.parse('"test string"');
            expect(instance.value).toEqual('test string');
        });

        it('should parse a token and initialize the value', () => {
            const token = { kind:`token`, str: '"test string"' };
            instance.parse(token);
            expect(instance.value).toEqual('test string');
        });
    });

    describe('cast', () => {
        it(`cast_00`, async () => {
            const toks = await parse_snippet(`"22"`);
            const s = new llstr(toks.front);
            expect(s.cast(`integer`).str).toBe(`22`);
            expect(s.cast(`float`).str).toBe(`22.`);
            expect(s.cast(`string`).str).toBe(`"22"`);
            expect(s.cast(`key`).str).toBe(`(key)"22"`);
            expect(s.cast(`vector`).str).toBe(`<0,0,0>`);
            expect(s.cast(`quaternion`).str).toBe(`<0,0,0,1>`);
            expect(s.cast(`list`).str).toBe(`["22"]`);
        });
    
        it(`cast_01`, async () => {
            const toks = await parse_snippet(`"22.0"`);
            const s = new llstr(toks.front);
            expect(s.cast(`integer`).str).toBe(`22`);
            expect(s.cast(`float`).str).toBe(`22.`);
            expect(s.cast(`string`).str).toBe(`"22.0"`);
            expect(s.cast(`key`).str).toBe(`(key)"22.0"`);
            expect(s.cast(`vector`).str).toBe(`<0,0,0>`);
            expect(s.cast(`quaternion`).str).toBe(`<0,0,0,1>`);
            expect(s.cast(`list`).str).toBe(`["22.0"]`);
        });
    
        it(`cast_02`, async () => {
            const toks = await parse_snippet(`"Hello world!"`);
            const s = new llstr(toks.front);
            expect(s.cast(`integer`).str).toBe(`0`);
            expect(s.cast(`float`).str).toBe(`0.`);
            expect(s.cast(`string`).str).toBe(`"Hello world!"`);
            expect(s.cast(`key`).str).toBe(`(key)"Hello world!"`);
            expect(s.cast(`vector`).str).toBe(`<0,0,0>`);
            expect(s.cast(`quaternion`).str).toBe(`<0,0,0,1>`);
            expect(s.cast(`list`).str).toBe(`["Hello world!"]`);
        });
    
        it(`cast_03`, async () => {
            const toks = await parse_snippet(`"3efeeb56-880e-50ce-3f96-1816775e4c44"`);
            const s = new llstr(toks.front);
            expect(s.cast(`integer`).str).toBe(`3`);
            expect(s.cast(`float`).str).toBe(`3.`);
            expect(s.cast(`string`).str).toBe(`"3efeeb56-880e-50ce-3f96-1816775e4c44"`);
            expect(s.cast(`key`).str).toBe(`(key)"3efeeb56-880e-50ce-3f96-1816775e4c44"`);
            expect(s.cast(`vector`).str).toBe(`<0,0,0>`);
            expect(s.cast(`quaternion`).str).toBe(`<0,0,0,1>`);
            expect(s.cast(`list`).str).toBe(`["3efeeb56-880e-50ce-3f96-1816775e4c44"]`);
        });
    
        it(`cast_04`, async () => {
            const toks = await parse_snippet(`"<1,2,3>"`);
            const s = new llstr(toks.front);
            expect(s.cast(`integer`).str).toBe(`0`);
            expect(s.cast(`float`).str).toBe(`0.`);
            expect(s.cast(`string`).str).toBe(`"<1,2,3>"`);
            expect(s.cast(`key`).str).toBe(`(key)"<1,2,3>"`);
            expect(s.cast(`vector`).str).toBe(`<1,2,3>`);
            expect(s.cast(`quaternion`).str).toBe(`<0,0,0,1>`);
            expect(s.cast(`list`).str).toBe(`["<1,2,3>"]`);
        });
    
        it(`cast_05`, async () => {
            const toks = await parse_snippet(`"<1,2,3,4>"`);
            const s = new llstr(toks.front);
            expect(s.cast(`integer`).str).toBe(`0`);
            expect(s.cast(`float`).str).toBe(`0.`);
            expect(s.cast(`string`).str).toBe(`"<1,2,3,4>"`);
            expect(s.cast(`key`).str).toBe(`(key)"<1,2,3,4>"`);
            expect(s.cast(`vector`).str).toBe(`<1,2,3>`);
            expect(s.cast(`quaternion`).str).toBe(`<1,2,3,4>`);
            expect(s.cast(`list`).str).toBe(`["<1,2,3,4>"]`);
        });
    
        it(`cast_06`, async () => {
            const toks = await parse_snippet(`R"--([1,"a",3.0])--"`);
            const s = new llstr(toks.front);
            expect(s.cast(`integer`).str).toBe(`0`);
            expect(s.cast(`float`).str).toBe(`0.`);
            expect(s.cast(`string`).str).toBe(String.raw`"[1,\"a\",3.0]"`);
            expect(s.cast(`key`).str).toBe(String.raw`(key)"[1,\"a\",3.0]"`);
            expect(s.cast(`vector`).str).toBe(`<0,0,0>`);
            expect(s.cast(`quaternion`).str).toBe(`<0,0,0,1>`);
            expect(s.cast(`list`).str).toBe(String.raw`["[1,\"a\",3.0]"]`);
        });
    
        it(`cast_07`, async () => {
            const s = new llstr(`"22"`);
            expect(s.cast(`integer`).str).toBe(`22`);
            expect(s.cast(`float`).str).toBe(`22.`);
            expect(s.cast(`string`).str).toBe(`"22"`);
            expect(s.cast(`key`).str).toBe(`(key)"22"`);
            expect(s.cast(`vector`).str).toBe(`<0,0,0>`);
            expect(s.cast(`quaternion`).str).toBe(`<0,0,0,1>`);
            expect(s.cast(`list`).str).toBe(`["22"]`);
        });
    
        it(`cast_08`, async () => {
            const s = new llstr(`"22.0"`);
            expect(s.cast(`integer`).str).toBe(`22`);
            expect(s.cast(`float`).str).toBe(`22.`);
            expect(s.cast(`string`).str).toBe(`"22.0"`);
            expect(s.cast(`key`).str).toBe(`(key)"22.0"`);
            expect(s.cast(`vector`).str).toBe(`<0,0,0>`);
            expect(s.cast(`quaternion`).str).toBe(`<0,0,0,1>`);
            expect(s.cast(`list`).str).toBe(`["22.0"]`);
        });
    
        it(`cast_09`, async () => {
            const s = new llstr(`"Hello world!"`);
            expect(s.cast(`integer`).str).toBe(`0`);
            expect(s.cast(`float`).str).toBe(`0.`);
            expect(s.cast(`string`).str).toBe(`"Hello world!"`);
            expect(s.cast(`key`).str).toBe(`(key)"Hello world!"`);
            expect(s.cast(`vector`).str).toBe(`<0,0,0>`);
            expect(s.cast(`quaternion`).str).toBe(`<0,0,0,1>`);
            expect(s.cast(`list`).str).toBe(`["Hello world!"]`);
        });
    
        it(`cast_10`, async () => {
            const s = new llstr(`"3efeeb56-880e-50ce-3f96-1816775e4c44"`);
            expect(s.cast(`integer`).str).toBe(`3`);
            expect(s.cast(`float`).str).toBe(`3.`);
            expect(s.cast(`string`).str).toBe(`"3efeeb56-880e-50ce-3f96-1816775e4c44"`);
            expect(s.cast(`key`).str).toBe(`(key)"3efeeb56-880e-50ce-3f96-1816775e4c44"`);
            expect(s.cast(`vector`).str).toBe(`<0,0,0>`);
            expect(s.cast(`quaternion`).str).toBe(`<0,0,0,1>`);
            expect(s.cast(`list`).str).toBe(`["3efeeb56-880e-50ce-3f96-1816775e4c44"]`);
        });
    
        it(`cast_11`, async () => {
            const s = new llstr(`"<1,2,3>"`);
            expect(s.cast(`integer`).str).toBe(`0`);
            expect(s.cast(`float`).str).toBe(`0.`);
            expect(s.cast(`string`).str).toBe(`"<1,2,3>"`);
            expect(s.cast(`key`).str).toBe(`(key)"<1,2,3>"`);
            expect(s.cast(`vector`).str).toBe(`<1,2,3>`);
            expect(s.cast(`quaternion`).str).toBe(`<0,0,0,1>`);
            expect(s.cast(`list`).str).toBe(`["<1,2,3>"]`);
        });
    
        it(`cast_12`, async () => {
            const s = new llstr(`"<1,2,3,4>"`);
            expect(s.cast(`integer`).str).toBe(`0`);
            expect(s.cast(`float`).str).toBe(`0.`);
            expect(s.cast(`string`).str).toBe(`"<1,2,3,4>"`);
            expect(s.cast(`key`).str).toBe(`(key)"<1,2,3,4>"`);
            expect(s.cast(`vector`).str).toBe(`<1,2,3>`);
            expect(s.cast(`quaternion`).str).toBe(`<1,2,3,4>`);
            expect(s.cast(`list`).str).toBe(`["<1,2,3,4>"]`);
        });
    
        it(`cast_13`, async () => {
            const s = new llstr(`"<1,2,3,4>"`);
            expect(s.cast(`integer`).str).toBe(`0`);
            expect(s.cast(`float`).str).toBe(`0.`);
            expect(s.cast(`string`).str).toBe(`"<1,2,3,4>"`);
            expect(s.cast(`key`).str).toBe(`(key)"<1,2,3,4>"`);
            expect(s.cast(`vector`).str).toBe(`<1,2,3>`);
            expect(s.cast(`quaternion`).str).toBe(`<1,2,3,4>`);
            expect(s.cast(`list`).str).toBe(`["<1,2,3,4>"]`);
        });
    
        it(`cast_14`, async () => {
            const s = new llstr(`"-0x1.0C6F7Ap-21"`);
            expect(s.cast(`integer`).str).toBe(`0`);
            expect(s.cast(`float`).str).toBe(`-5.0e-7`);
            expect(s.cast(`string`).str).toBe(`"-0x1.0C6F7Ap-21"`);
            expect(s.cast(`key`).str).toBe(`(key)"-0x1.0C6F7Ap-21"`);
            expect(s.cast(`vector`).str).toBe(`<0,0,0>`);
            expect(s.cast(`quaternion`).str).toBe(`<0,0,0,1>`);
            expect(s.cast(`list`).str).toBe(`["-0x1.0C6F7Ap-21"]`);
        });
    
        it(`cast_15`, async () => {
            const s = new llstr(`"NaN"`);
            expect(s.cast(`integer`).str).toBe(`0`);
            expect(s.cast(`float`).str).toBe(`NaN`);
            expect(s.cast(`string`).str).toBe(`"NaN"`);
            expect(s.cast(`key`).str).toBe(`(key)"NaN"`);
            expect(s.cast(`vector`).str).toBe(`<0,0,0>`);
            expect(s.cast(`quaternion`).str).toBe(`<0,0,0,1>`);
            expect(s.cast(`list`).str).toBe(`["NaN"]`);
        });
    });

    describe('is_lsl_numb', () => {
        it('should return true for valid LSL numbers', () => {
            expect(llstr.is_lsl_numb('123')).toEqual(true);
            expect(llstr.is_lsl_numb('123.45')).toEqual(true);
            expect(llstr.is_lsl_numb('1.23e4')).toEqual(true);
        });

        it('should return false for invalid LSL numbers', () => {
            expect(llstr.is_lsl_numb('')).toEqual(false);
            expect(llstr.is_lsl_numb('abc')).toEqual(false);
            expect(llstr.is_lsl_numb('123.45.67')).toEqual(false);
        });
    });


    

    xit(`error_00`, async () => { expect(true).toBeFalse(); });
});