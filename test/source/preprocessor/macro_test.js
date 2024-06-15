
import { location } from "../../../lib/source/location.js";
import { expand_hash, expand_hash_hash, macro, macros } from "../../../lib/source/preprocessor/macro.js";
import { token } from "../../../lib/source/token.js";
import { tokens } from "../../../lib/source/tokens.js";
import { uris } from "../../../lib/system/uris.js";
import { reset_index } from "../../../lib/text/string.js";
import { test_tokens } from "../../test.js";

export let includes = [];


describe('macro', () => {

    beforeEach(() => {
        macros.clear();
        uris.clear();
        reset_index();
    });


    xit('constructor_000', () => {
        const mac0 = new macro();

        const toks1 = new tokens(`#define A 1`);
        const mac1 = new macro(toks1.front);

        const toks2 = new tokens(`#define A(x) x##h`);
        const mac2 = new macro(toks2.front);

        const toks3 = new tokens(`#define eprintf(...) fprintf (stderr, __VA_ARGS__)`);
        const mac3 = new macro(toks3.front);

        const mac4 = new macro(`A`, `1`);

        //console.log(crypto.randomUUID());
    });

    it('parse_def_000', () => {
        const toks0 = new tokens(`#define eprintf(...) fprintf (stderr, __VA_ARGS__)`);
        //console.log(toks0.stringify());

        const mac0 = new macro(toks0.front);
        expect(mac0.name_tok).toBeDefined();
        expect(mac0.value_tok).toBeDefined();
        expect(mac0.end_tok).toBeDefined();
        expect(mac0.args.length).toBeDefined();
        expect(mac0.args[0]).toBeDefined();

        expect(mac0.name_tok.str).toBe(`eprintf`);
        expect(mac0.value_tok.str).toBe(`fprintf`);
        expect(mac0.end_tok.str).toBe(`)`);
        expect(mac0.args.length).toBe(1);
        expect(mac0.args[0].str).toBe(`__VA_ARGS__`);
    });

    it('parse_def_001', () => {
        const toks0 = new tokens(`#define A`);
        const mac0 = new macro(toks0.front);
        expect(mac0.name_tok.str).toBe(`A`);
        expect(mac0.value_tok).not.toBeDefined();
        expect(mac0.end_tok.str).toBe(`A`);
        expect(mac0.args.length).toBe(0);
    });

    it('parse_def_002', () => {
        //const toks0 = new tokens(`A`, `1`);
        const mac0 = new macro(`A`, `1`);
        expect(mac0.name_tok.str).toBe(`A`);
        expect(mac0.value_tok.str).toBe(`1`);
        expect(mac0.end_tok.str).toBe(`1`);
        expect(mac0.args.length).toBe(0);
    });

    it('parse_def_003', () => {
        const toks0 = new tokens(`#define A(B,C,D) func(B,C,D)`);
        const mac0 = new macro(toks0.front);
        expect(mac0.name_tok.str).toBe(`A`);
        expect(mac0.value_tok.str).toBe(`func`);
        expect(mac0.end_tok.str).toBe(`)`);
        expect(mac0.args.length).toBe(3);
    });

    it('parse_def_004', () => {
        const toks0 = new tokens(`#define A() 1\nA()\n`);
        const mac0 = new macro(toks0.front);
        expect(mac0.name_tok.str).toBe(`A`);
        expect(mac0.value_tok.str).toBe(`1`);
        expect(mac0.end_tok.str).toBe(`1`);
        expect(mac0.args.length).toBe(0);
    });
    // 
    it('parse_def_005', () => {
        const toks0 = new tokens(`#define B    A(`);
        //console.log(toks0.stringify());
        const mac0 = new macro(toks0.front);
        expect(mac0.name_tok.str).toBe(`B`);
        expect(mac0.value_tok.str).toBe(`A`);
        expect(mac0.end_tok.str).toBe(`(`);
        expect(mac0.args.length).toBe(0);
    });
    // 
    it('parse_def_006', () => {
        const toks0 = new tokens(`#define ADD(A,B) A+B`);
        //console.log(toks0.stringify());
        const mac0 = new macro(toks0.front);
        expect(mac0.name_tok.str).toBe(`ADD`);
        expect(mac0.value_tok.str).toBe(`A`);
        expect(mac0.end_tok.str).toBe(`B`);
    });

    it('parse_def_007', () => {
        const toks0 = new tokens(`#define A(fmt...) dostuff(fmt)`);
        //console.log(toks0.stringify());
        const mac0 = new macro(toks0.front);
        expect(mac0.name_tok.str).toBe(`A`);
        expect(mac0.value_tok.str).toBe(`dostuff`);
        expect(mac0.end_tok.str).toBe(`)`);
        test_tokens(mac0.definition, [`A`, `(`, `__VA_ARGS__`, `)`, `dostuff`, `(`, `__VA_ARGS__`, `)`]);
    });

    it('parse_def_008', () => {
        const toks0 = new tokens(`#define A __UID__`);
        //console.log(toks0.stringify());
        const mac0 = new macro(toks0.front);
        expect(mac0.name_tok.str).toBe(`A`);
        expect(mac0.value_tok.str).toBe(`_`);
        expect(mac0.end_tok.str).toBe(`_`);
        test_tokens(mac0.definition, [`A`, `_`]);
    });

    it('parse_def_009', () => {
        const toks0 = new tokens(`#define A #__UID__`);
        //console.log(toks0.stringify());

        const mac0 = new macro(toks0.front);
        expect(mac0.name_tok.str).toBe(`A`);
        expect(mac0.value_tok.str).toBe(`#`);
        expect(mac0.end_tok.str).toBe(`_`);
        test_tokens(mac0.definition, [`A`, `#`, `a`]);
    });

    it('variadic_000', () => {
        const toks0 = new tokens(`#define A(B,C,D) func(B,C,D)`);
        const mac0 = new macro(toks0.front);
        expect(mac0.variadic).toBeFalse();
    });

    it('variadic_001', () => {
        const toks0 = new tokens(`#define eprintf(...) fprintf (stderr, __VA_ARGS__)`);
        const mac0 = new macro(toks0.front);
        expect(mac0.variadic).toBeTrue();
    });

    it('arguments_000', () => {
        const toks0 = new tokens(`#define eprintf(...) fprintf (stderr, __VA_ARGS__)`);
        const mac0 = new macro(toks0.front);
        expect(mac0.args_length).toBe(1);
        expect(mac0.arg_at(0).str).toBe(`__VA_ARGS__`);
    });

    it('arguments_001', () => {
        const toks0 = new tokens(`#define A(B,C,D) func(B,C,D)`);
        const mac0 = new macro(toks0.front);
        expect(mac0.args_length).toBe(3);
        expect(mac0.arg_at(0).str).toBe(`B`);
        expect(mac0.arg_at(1).str).toBe(`C`);
        expect(mac0.arg_at(2).str).toBe(`D`);
    });

    it('arguments_002', () => {
        const toks0 = new tokens(`#define A`);
        const mac0 = new macro(toks0.front);
        expect(mac0.args_length).toBe(0);
    });

    it('arg_index_002', () => {
        const toks0 = new tokens(`#define A(B,C,D) func(B,C,D)`);
        const mac0 = new macro(toks0.front);
        expect(mac0.args_length).toBe(3);
        expect(mac0.arg_index(`B`)).toBe(0);
        expect(mac0.arg_index(`C`)).toBe(1);
        expect(mac0.arg_index(`D`)).toBe(2);
    });

    it('expand_000', () => {
        const toks0 = new tokens(`#define A 1`);
        const mac0 = new macro(toks0.front);
        expect(mac0.name).toBe(`A`);
        macros.set(mac0.name, mac0);
        expect(macros.has(`A`)).toBeTrue();

        const toks1 = new tokens(`A`);
        mac0.expand(toks1, toks1.front, includes);
        expect(toks1.stringify()).toBe(`1`);

        expect(toks1.front.prev).toBe(undefined);
        expect(toks1.back.next).toBe(undefined);

    });

    it('expand_001', () => {
        const toks0 = new tokens(`#define A() 1`);
        const mac0 = new macro(toks0.front);
        macros.set(mac0.name, mac0);

        const toks1 = new tokens(`A()`);
        mac0.expand(toks1, toks1.front, includes);
        expect(toks1.stringify()).toBe(`1`);

        expect(toks1.front.prev).toBe(undefined);
        expect(toks1.back.next).toBe(undefined);
    });

    it('expand_002', () => {
        const toks0 = new tokens(`#define A(B,C,D) func(B,C,D)`);
        const mac0 = new macro(toks0.front);
        macros.set(mac0.name, mac0);

        const toks1 = new tokens(`A(1,2,3)`);
        mac0.expand(toks1, toks1.front, includes);
        expect(toks1.stringify()).toBe(`func ( 1 , 2 , 3 )`);
        test_tokens(toks1, [`func`, `(`, `1`, `,`, `2`, `,`, `3`, `)`]);

        expect(toks1.front.prev).toBe(undefined);
        expect(toks1.back.next).toBe(undefined);
    });

    it('expand_003', () => {
        const toks0 = new tokens(`#define A(D,C,B) func(B,C,D)`);
        const mac0 = new macro(toks0.front);
        macros.set(mac0.name, mac0);

        const toks1 = new tokens(`A(1,2,3)`);
        mac0.expand(toks1, toks1.front, includes);
        expect(toks1.stringify()).toBe(`func ( 3 , 2 , 1 )`);

        expect(toks1.front.prev).toBe(undefined);
        expect(toks1.back.next).toBe(undefined);
    });

    it('expand_004', () => {
        const toks0 = new tokens(`#define eprintf(...) fprintf (stderr, __VA_ARGS__)`);
        const mac0 = new macro(toks0.front);
        macros.set(mac0.name, mac0);

        const toks1 = new tokens(`eprintf(1,2,3)`);
        let it = mac0.expand(toks1, toks1.front, includes);
        expect(it.stringify()).toBe(`fprintf ( stderr , 1 , 2 , 3 )`);
        expect(toks1.stringify()).toBe(`fprintf ( stderr , 1 , 2 , 3 )`);

        expect(toks1.front.prev).toBe(undefined);
        expect(toks1.back.next).toBe(undefined);
    });

    it('expand_005', () => {
        const toks0 = new tokens(`#define A(D,C,B)  B, C, D`);
        const mac0 = new macro(toks0.front);
        macros.set(mac0.name, mac0);

        const toks1 = new tokens(`A(1, 2, 3)`);
        mac0.expand(toks1, toks1.front, includes);
        expect(toks1.stringify()).toBe(`3 , 2 , 1`);
        //console.log(toks1.stringify());

        expect(toks1.front.prev).toBe(undefined);
        expect(toks1.back.next).toBe(undefined);
    });

    it('expand_006', () => {
        const toks0 = new tokens(`#define A 1+2`);
        const mac0 = new macro(toks0.front);
        macros.set(mac0.name, mac0);

        const toks1 = new tokens(`a=A+3;`);
        mac0.expand(toks1, toks1.front.next.next, includes);
        expect(toks1.stringify()).toBe(`a = 1 + 2 + 3 ;`);
        //console.log(toks1.stringify());
        test_tokens(toks1, [`a`, `=`, `1`, `+`, `2`, `+`, `3`, `;`]);

        expect(toks1.front.prev).toBe(undefined);
        expect(toks1.back.next).toBe(undefined);
    });

    it('expand_007', () => {
        const toks0 = new tokens(`#define ABC XY2(PORT, DIR)`);
        const mac0 = new macro(toks0.front);
        macros.set(mac0.name, mac0);

        const toks1 = new tokens(`ABC;`);
        mac0.expand(toks1, toks1.front, includes);
        expect(toks1.stringify()).toBe(`XY2 ( PORT , DIR ) ;`);
        test_tokens(toks1, [`XY2`, `(`, `PORT`, `,`, `DIR`, `)`, `;`]);
    });

    /*
        it('expand_8', () => {
            const toks0 = new tokens(`#define A(B) A##B`);
            const mac0 = new macro(toks0.front);
            macros.set(mac0.name, mac0);
    
            const toks1 = new tokens(`A(BC)`);
            mac0.expand(toks1, toks1.front);
            expect(toks1.stringify()).toBe(`ABC`);
            test_tokens(toks1, [`ABC`]);
        });
    
        it('expand_9', () => {
            const toks0 = new tokens(`#define XY(x, y) x ## y`);
            const mac0 = new macro(toks0.front);
            macros.set(mac0.name, mac0);
    
            const toks1 = new tokens(`XY(PORT, DIR);`);
            mac0.expand(toks1, toks1.front);
            expect(toks1.stringify()).toBe(`PORT ## DIR ;`);
            test_tokens(toks1, [`PORT`, `##`, `DIR`, `;`]);
        });
    
        it('expand_10', () => {
            const toks0 = new tokens(`#define A(B) A##B`);
            const mac0 = new macro(toks0.front);
            macros.set(mac0.name, mac0);
    
            const toks1 = new tokens(`A(A(B))`);
            mac0.expand(toks1, toks1.front);
            expect(toks1.stringify()).toBe(`AAB`);
            test_tokens(toks1, [`AAB`]);
        });
    */

    it('expand_hash_hash_000', () => {
        const toks0 = new tokens(`x ## y`);
        expect(toks0.stringify()).toBe(`x ## y`);
        expect(toks0.front.str).toBe(`x`);
        expect(toks0.front.next.str).toBe(`##`);

        const tok0 = expand_hash_hash(toks0, toks0.front.next);

        expect(tok0.str).toBe(`xy`);
        expect(toks0.stringify()).toBe(`xy`);
        test_tokens(toks0, [`xy`]);
    });

});

describe('macro Class', () => {
    let token1, token2, token3, tokens1, tokens2, tokens3, tokens4;
    beforeEach(() => {
        token1 = new token('macro_name', new location('file1', 1, 1));
        token2 = new token('value', new location('file1', 1, 10));
        token3 = new token('#', new location('file1', 1, 1));
        tokens1 = new tokens('macro_name value');
        tokens2 = new tokens('macro_name() value');
        tokens3 = new tokens('macro_name(arg1, arg2) value');

        macros.clear();
        uris.clear();
        reset_index();
    });

    it('should initialize with valid name and value strings', () => {
        const mac = new macro('macro_name', 'value');
        expect(mac.name).toBe('macro_name');
        expect(mac.definition.front.str).toBe('macro_name');
        expect(mac.definition.back.str).toBe('value');
    });

    it('should not throw error with good macro syntax in strings', () => {
        expect(
            () => new macro('macro_name', 'value value')
        ).not.toThrowError('bad macro syntax. macroname=macro_name value=value value');
    });

    it('should initialize with valid token', () => {
        const toks = new tokens('#define macro_name value', 'file1.cpp');
        //console.log(toks.stringify());

        const mac = new macro(toks.front);
        expect(mac.name_tok.str)
            .toBe(token1.str);
    });

    it('should throw syntax error with bad token syntax', () => {
        const toks = new tokens('#macro_name value', 'file1.cpp');
        expect(() => new macro(toks.front)).toThrowError('Bad macro syntax.');
    });

    it('should return the correct argument token at a given index', () => {
        const toks = new tokens('#define macro_name(arg1, arg2) value', 'file1.cpp');

        const mac = new macro(toks.front);
        expect(mac.arg_at(0).str).toBe('arg1');
        expect(mac.arg_at(1).str).toBe('arg2');
    });

    it('should throw range error when retrieving argument token out of range', () => {
        const toks = new tokens('#define macro_name(arg1, arg2) value', 'file1.cpp');
        const mac = new macro(toks.front);
        expect(() => mac.arg_at(2)).toThrowError('index out of range.');
    });

    it('should return correct index for argument token matching string', () => {
        const toks = new tokens('#define macro_name(arg1, arg2) value', 'file1.cpp');
        const mac = new macro(toks.front);

        expect(mac.arg_index('arg1')).toBe(0);
        expect(mac.arg_index('arg2')).toBe(1);
        expect(mac.arg_index('arg3')).toBe(-1);
    });

    it('should parse macro definition correctly', () => {
        const toks = new tokens('macro_name value', 'file1.cpp');

        const mac = new macro();
        mac.parse_def(toks.front);

        expect(mac.name_tok.str).toBe('macro_name');
        expect(mac.value_tok.str).toBe('value');
    });

    it('should expand macros correctly with predefined values', () => {
        const mac = new macro('__FILE__', 'value');
        const src = new tokens('text __FILE__ text', 'file1.cpp');
        mac.expand(src, src.front.next, [], false);
        expect(src.stringify()).toBe('text file1.cpp text');
    });

    xit('should throw error on macro recursion detection', () => {
        const mac = new macro('macro_name', 'macro_name');
        const src = new tokens('text macro_name text', 'file1.cpp');

        expect(
            () => mac.expand(src, src.front.next.next, [], false)
        ).toThrowError('Macro recursion detected.');
    });

    it('should handle variadic macros correctly', () => {
        const mac = new macro('macro_name(arg1, ...)', 'arg1 __VA_ARGS__');
        const src = new tokens('macro_name(arg1, arg2, arg3)', 'file1.cpp');
        mac.expand(src, src.front, [], false);
        expect(src.stringify()).toBe('arg1 arg2 , arg3');
    });

    it('should handle function-like macros correctly', () => {
        const mac = new macro('macro_name(arg1, arg2)', 'arg1 arg2');
        const src = new tokens('macro_name(val1, val2)', 'file1.cpp');
        mac.expand(src, src.front, [], false);
        expect(src.stringify()).toBe('val1 val2');
    });

    it('should expand special macros correctly', () => {
        const macFile = new macro('__FILE__', '');
        const macLine = new macro('__LINE__', '');
        const srcFile = new tokens('text __FILE__ text', 'file1.cpp');
        const srcLine = new tokens('text __LINE__ text', 'file1.cpp');
        macFile.expand(srcFile, srcFile.front.next, [], false);
        macLine.expand(srcLine, srcLine.front.next, [], false);
        expect(srcFile.stringify()).toBe('text file1.cpp text');
        expect(srcLine.stringify()).toBe('text 1 text');
    });

    it('should expand hash correctly', () => {
        const src = new tokens('#macro_name', 'file1.cpp');
        expand_hash(src, src.front, 'value');
        expect(src.stringify()).toBe('"value"');
    });

    it('should expand hash hash correctly', () => {
        const src = new tokens('token1 ## token2', 'file1.cpp');
        expand_hash_hash(src, src.front.next);
        expect(src.stringify()).toBe('token1token2');
    });
});

