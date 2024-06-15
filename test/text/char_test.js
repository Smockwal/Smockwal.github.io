import { char } from "../../lib/text/char.js";


describe('char', () => {
    //it('fail', () => { expect(false).toBeTrue();});

    describe('printable', () => {
        it('should return true for printable ASCII characters', () => {
            expect(char.printable('a')).toBeTrue();
            expect(char.printable('A')).toBeTrue();
            expect(char.printable('0')).toBeTrue();
            expect(char.printable(' ')).toBeTrue();
            expect(char.printable('~')).toBeTrue();
        });

        it('should return true for printable non-ASCII characters', () => {
            // Add test cases for printable non-ASCII characters
            expect(char.printable('é')).toBeTrue(); // Example: Latin small letter e with acute
            expect(char.printable('汉')).toBeTrue(); // Example: Han character '汉'
            expect(char.printable('😊')).toBeTrue(); // Example: Smiling face emoji
        });

        it('should return false for non-printable characters', () => {
            // Add test cases for non-printable characters
            expect(char.printable('\x00')).toBeFalse(); // Example: Null character
            expect(char.printable('\t')).toBeFalse(); // Example: Tab character
            expect(char.printable('\n')).toBeFalse(); // Example: Newline character
        });

        it('should return false for empty strings', () => {
            expect(char.printable('')).toBeFalse();
        });

        it('should handle different encodings', () => {
            // Add test cases for different encodings
            expect(char.printable('é', 'utf8')).toBeTrue();
            expect(char.printable('é', 'utf16le')).toBeTrue();
            expect(char.printable('\x00', 'utf8')).toBeFalse();
            expect(char.printable('\x00', 'utf16le')).toBeFalse();
        });
    });

    describe('visible', () => {
        it('should return true for visible characters', () => {
            expect(char.visible('a')).toBe(true);
            expect(char.visible('A')).toBe(true);
            expect(char.visible('1')).toBe(true);
            expect(char.visible('@')).toBe(true);
            expect(char.visible('&')).toBe(true);
        });

        it('should return false for invisible characters', () => {
            expect(char.visible('\t')).toBe(false); // Tab
            expect(char.visible('\n')).toBe(false); // Newline
            expect(char.visible('\r')).toBe(false); // Carriage return
            expect(char.visible('\b')).toBe(false); // Backspace
            expect(char.visible('\f')).toBe(false); // Form feed
            expect(char.visible('\u200B')).toBe(false); // Zero-width space
            expect(char.visible('\u2060')).toBe(false); // Word joiner
        });

        it('should return false for empty string', () => {
            expect(char.visible('')).toBe(false);
        });

        it(`visible_00`, () => {
            expect(char.visible(`\u0007`)).toBeFalse();
            expect(char.visible(`\u0008`)).toBeFalse();
            expect(char.visible(`\u0009`)).toBeFalse();
            expect(char.visible(`\u000A`)).toBeFalse();
            expect(char.visible(`\u000B`)).toBeFalse();
            expect(char.visible(`\u000C`)).toBeFalse();
            expect(char.visible(`\u000D`)).toBeFalse();
            expect(char.visible(`\uFDD0`)).toBeFalse();
            expect(char.visible(`\uFDD1`)).toBeFalse();
            expect(char.visible(`\uFDD2`)).toBeFalse();
            expect(char.visible(`\uFDD2`)).toBeFalse();
            expect(char.visible(`\uFDD3`)).toBeFalse();
            expect(char.visible(`\uFDD4`)).toBeFalse();
            expect(char.visible(`\uFDD5`)).toBeFalse();
            expect(char.visible(`\uFDD6`)).toBeFalse();
            expect(char.visible(`\uFDD7`)).toBeFalse();
            expect(char.visible(`\uFDD8`)).toBeFalse();
        });

    });





    it('json_spec_00', () => {
        expect(char.json_spec(`\uFDD0`)).toBeTrue();
        expect(char.json_spec(`\uFDD1`)).toBeTrue();
        expect(char.json_spec(`\uFDD2`)).toBeTrue();
        expect(char.json_spec(`\uFDD2`)).toBeTrue();
        expect(char.json_spec(`\uFDD3`)).toBeTrue();
        expect(char.json_spec(`\uFDD4`)).toBeTrue();
        expect(char.json_spec(`\uFDD5`)).toBeTrue();
        expect(char.json_spec(`\uFDD6`)).toBeTrue();
        expect(char.json_spec(`\uFDD7`)).toBeTrue();
        expect(char.json_spec(`\uFDD8`)).toBeTrue();
    });

    describe('char.space', () => {
        // Test cases for space characters
        it('should return true for space character', () => {
            expect(char.space(' ')).toBeTrue();
        });

        xit('should return true for form feed character', () => {
            expect(char.space('\f')).toBeTrue();
        });

        it('should return true for newline character', () => {
            expect(char.space('\n')).toBeTrue();
        });

        it('should return true for carriage return character', () => {
            expect(char.space('\r')).toBeTrue();
        });

        it('should return true for horizontal tab character', () => {
            expect(char.space('\t')).toBeTrue();
        });

        it('should return true for vertical tab character', () => {
            expect(char.space('\v')).toBeTrue();
        });

        it('should return true for non-breaking space character', () => {
            expect(char.space('\u00A0')).toBeTrue();
        });

        it('should return true for line separator character', () => {
            expect(char.space('\u2028')).toBeTrue();
        });

        it('should return true for paragraph separator character', () => {
            expect(char.space('\u2029')).toBeTrue();
        });

        // Test cases for non-space characters
        it('should return false for non-space character', () => {
            expect(char.space('a')).toBeFalse();
        });

        it('should return false for empty string', () => {
            expect(char.space('')).toBeFalse();
        });

        it('is_space_00', () => {
            expect(char.space(`_`)).toBeFalse();
            expect(char.space(` `)).toBeTrue();
            expect(char.space(`\f`)).toBeTrue();
            expect(char.space(`\n`)).toBeTrue();
            expect(char.space(`\r`)).toBeTrue();
            expect(char.space(`\t`)).toBeTrue();
            expect(char.space(`\v`)).toBeTrue();
            expect(char.space(`\u00A0`)).toBeTrue();
            expect(char.space(`\u2028`)).toBeTrue();
            expect(char.space(`\u2029`)).toBeTrue();
            expect(char.space(`'`)).toBeFalse();
        });
    });

    describe('is_new_line', () => {
        it('should return true for new line characters', () => {
            expect(char.is_new_line('\n')).toBe(true);
            expect(char.is_new_line('\r')).toBe(true);
        });

        it('should return false for non-new line characters', () => {
            expect(char.is_new_line('a')).toBe(false);
            expect(char.is_new_line('')).toBe(false);
            expect(char.is_new_line(' ')).toBe(false);
            expect(char.is_new_line('123')).toBe(false);
            expect(char.is_new_line('!')).toBe(false);
        });

        it('should return false for non-string inputs', () => {
            expect(char.is_new_line(123)).toBe(false);
            expect(char.is_new_line(null)).toBe(false);
            expect(char.is_new_line(undefined)).toBe(false);
            expect(char.is_new_line({})).toBe(false);
            expect(char.is_new_line([])).toBe(false);
            expect(char.is_new_line(true)).toBe(false);
        });

        it('should return false for empty strings', () => {
            expect(char.is_new_line('')).toBe(false);
        });

        it('should handle Unicode new line characters', () => {
            expect(char.is_new_line('\u2028')).toBe(true); // Line separator
            expect(char.is_new_line('\u2029')).toBe(true); // Paragraph separator
        });

        it('is_new_line_00', () => {
            expect(char.is_new_line(`\n`)).toBeTrue();
            expect(char.is_new_line(`\r`)).toBeTrue();
            expect(char.is_new_line(` `)).toBeFalse();
        });
    });

    describe('is_name method', () => {
        it('should return true for valid name characters', () => {
            expect(char.is_name('a')).toBeTrue();
            expect(char.is_name('Z')).toBeTrue();
            expect(char.is_name('5')).toBeTrue();
            expect(char.is_name('_')).toBeTrue();
        });

        it('should return false for invalid name characters', () => {
            expect(char.is_name(' ')).toBeFalse();
            expect(char.is_name('*')).toBeFalse();
            expect(char.is_name('@')).toBeFalse();
        });

        it('should return false for empty input', () => {
            expect(char.is_name('')).toBeFalse();
        });

        it('is_name_00', () => {
            expect(char.is_name(`\n`)).toBeFalse();
            expect(char.is_name(`\r`)).toBeFalse();
            expect(char.is_name(` `)).toBeFalse();
            expect(char.is_name(`_`)).toBeTrue();
            expect(char.is_name(`a`)).toBeTrue();
            expect(char.is_name(`0`)).toBeTrue();
        });
    });

    describe('is_number method', () => {
        it('should return true for valid number characters', () => {
            expect(char.is_number('0')).toBeTrue();
            expect(char.is_number('5')).toBeTrue();
            expect(char.is_number('9')).toBeTrue();
        });

        it('should return false for non-number characters', () => {
            expect(char.is_number('a')).toBeFalse();
            expect(char.is_number('A')).toBeFalse();
            expect(char.is_number('_')).toBeFalse();
            expect(char.is_number(' ')).toBeFalse();
            expect(char.is_number('@')).toBeFalse();
        });

        it('should return false for empty input', () => {
            expect(char.is_number('')).toBeFalse();
        });

        it('should return false for multi-character input', () => {
            expect(char.is_number('12')).toBeFalse();
            expect(char.is_number('abc')).toBeFalse();
        });

        it('is_number_00', () => {
            for (let i = 0; i < 10; ++i)
                expect(char.is_number(`${i}`)).toBeTrue();

            expect(char.is_number(`a`)).toBeFalse();
        });

        it('is_number_01', () => {
            let text = `0123456789٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹०१२३४५६७८९০১২৩৪৫৬৭৮৯੦੧੨੩੪੫੬੭੮੯૦૧૨૩૪૫૬૭૮૯୦୧୨୩୪୫୬୭୮୯௦௧௨௩௪௫௬௭௮௯౦౧౨౩౪౫౬౭౮౯೦೧೨೩೪೫೬೭೮೯൦൧൨൩൪൫൬൭൮൯๐๑๒๓๔๕๖๗๘๙໐໑໒໓໔໕໖໗໘໙༠༡༢༣༤༥༦༧༨༩၀၁၂၃၄၅၆၇၈၉០១២៣៤៥៦៧៨៩᠐᠑᠒᠓᠔᠕᠖᠗᠘᠙᥆᥇᥈᥉᥊᥋᥌᥍᥎᥏᧐᧑᧒᧓᧔᧕᧖᧗᧘᧙０１２３４５６７８９`;
            for (let i = 0; i < text.length; ++i)
                expect(char.is_number(text[i])).toBeTrue();
        });
    });

    describe("char.is_quote", () => {
        it("should return true for single quotes", () => {
            expect(char.is_quote("'")).toBe(true);
            expect(char.is_quote('"')).toBe(true);
            expect(char.is_quote("`")).toBe(true);
        });

        it("should return false for non-quote characters", () => {
            expect(char.is_quote("a")).toBe(false);
            expect(char.is_quote("")).toBe(false);
            expect(char.is_quote("123")).toBe(false);
            expect(char.is_quote(" ")).toBe(false);
            expect(char.is_quote("!")).toBe(false);
            expect(char.is_quote("-")).toBe(false);
        });

        it("should return false for strings longer than one character", () => {
            expect(char.is_quote("ab")).toBe(false);
            expect(char.is_quote("quote")).toBe(false);
            expect(char.is_quote("`\"")).toBe(false);
        });

        it('is_quote_00', () => {
            expect(char.is_quote(`a`)).toBeFalse();
            expect(char.is_quote(`'`)).toBeTrue();
            expect(char.is_quote(`"`)).toBeTrue();
            expect(char.is_quote(`\``)).toBeTrue();
            expect(char.is_quote(` `)).toBeFalse();
        });
    });

    describe('char.is_one_of', () => {
        // Test cases for case-sensitive comparisons
        describe('Case-sensitive comparisons', () => {
            it('should return true for matching characters', () => {
                expect(char.is_one_of('a', 'abc')).toBe(true);
                expect(char.is_one_of('B', 'ABC')).toBe(true);
                expect(char.is_one_of('1', '123')).toBe(true);
            });

            it('should return false for non-matching characters', () => {
                expect(char.is_one_of('d', 'abc')).toBe(false);
                expect(char.is_one_of('D', 'abc')).toBe(false);
                expect(char.is_one_of('0', '123')).toBe(false);
            });

            it('should handle empty input character', () => {
                expect(char.is_one_of('', 'abc')).toBe(false);
                expect(char.is_one_of('', 'ABC')).toBe(false);
                expect(char.is_one_of('', '123')).toBe(false);
            });

            it('should handle empty input instance', () => {
                expect(char.is_one_of('a', '')).toBe(false);
                expect(char.is_one_of('A', '')).toBe(false);
                expect(char.is_one_of('1', '')).toBe(false);
            });
        });

        // Test cases for case-insensitive comparisons
        describe('Case-insensitive comparisons', () => {
            it('should return true for matching characters', () => {
                expect(char.is_one_of('a', 'abc', 0)).toBe(true);
                expect(char.is_one_of('B', 'ABC', 0)).toBe(true);
                expect(char.is_one_of('1', '123', 0)).toBe(true);
            });

            it('should return false for non-matching characters', () => {
                expect(char.is_one_of('d', 'abc', 0)).toBe(false);
                expect(char.is_one_of('D', 'abc', 0)).toBe(false);
                expect(char.is_one_of('0', '123', 0)).toBe(false);
            });

            it('should handle empty input character', () => {
                expect(char.is_one_of('', 'abc', 0)).toBe(false);
                expect(char.is_one_of('', 'ABC', 0)).toBe(false);
                expect(char.is_one_of('', '123', 0)).toBe(false);
            });

            it('should handle empty input instance', () => {
                expect(char.is_one_of('a', '', 0)).toBe(false);
                expect(char.is_one_of('A', '', 0)).toBe(false);
                expect(char.is_one_of('1', '', 0)).toBe(false);
            });
        });

        it('is_one_of_00', () => {
            expect(char.is_one_of(`a`, `.`)).toBeFalse();
            expect(char.is_one_of(`a`, `abcd`)).toBeTrue();
            expect(char.is_one_of(`b`, `abcd`)).toBeTrue();
            expect(char.is_one_of(`c`, `abcd`)).toBeTrue();
            expect(char.is_one_of(`d`, `abcd`)).toBeTrue();
        });

        it('is_one_of_01', () => {
            expect(char.is_one_of(`<`, `<[({`)).toBeTrue();
            expect(char.is_one_of(`[`, `<[({`)).toBeTrue();
            expect(char.is_one_of(`(`, `<[({`)).toBeTrue();
            expect(char.is_one_of(`{`, `<[({`)).toBeTrue();
        });

        it('is_one_of_02', () => {
            expect(char.is_one_of(`}`, `})]>`)).toBeTrue();
            expect(char.is_one_of(`)`, `})]>`)).toBeTrue();
            expect(char.is_one_of(`]`, `})]>`)).toBeTrue();
            expect(char.is_one_of(`>`, `})]>`)).toBeTrue();
        });
    });

    describe("char.is_float_suffix", () => {
        // Test cases for valid float suffixes
        it("should return true for 'f'", () => {
            expect(char.is_float_suffix('f')).toBeTrue();
        });

        it("should return true for 'l'", () => {
            expect(char.is_float_suffix('l')).toBeTrue();
        });

        // Test cases for invalid float suffixes
        it("should return false for 'a'", () => {
            expect(char.is_float_suffix('a')).toBeFalse();
        });

        it("should return false for empty string", () => {
            expect(char.is_float_suffix('')).toBeFalse();
        });

        // Test cases for other edge cases
        it("should return false for 'ff'", () => {
            expect(char.is_float_suffix('ff')).toBeFalse();
        });

        it("should return false for '1'", () => {
            expect(char.is_float_suffix('1')).toBeFalse();
        });
    });

    describe("char.closing_char", () => {
        it("should return the corresponding closing character for the given opening character", () => {
            expect(char.closing_char("(")).toBe(")");
            expect(char.closing_char("{")).toBe("}");
            expect(char.closing_char("[")).toBe("]");
            expect(char.closing_char("<")).toBe(">");
        });
    
        it("should return an empty string if the given opening character is not found", () => {
            expect(char.closing_char("A")).toBe("");
            expect(char.closing_char("")).toBe("");
            expect(char.closing_char(" ")).toBe("");
            expect(char.closing_char("\n")).toBe("");
        });
    
        it('closing_char_00', () => {
            expect(char.closing_char(`[`)).toBe(`]`);
            expect(char.closing_char(`{`)).toBe(`}`);
            expect(char.closing_char(`(`)).toBe(`)`);
            expect(char.closing_char(`<`)).toBe(`>`);
        });
    });

    describe("char.opening_char", () => {
        it("should return the corresponding opening character for the given closing character", () => {
            expect(char.opening_char(")")).toBe("(");
            expect(char.opening_char("}")).toBe("{");
            expect(char.opening_char("]")).toBe("[");
            expect(char.opening_char(">")).toBe("<");
        });
    
        it("should return an empty string if the given closing character is not found", () => {
            expect(char.opening_char("A")).toBe("");
            expect(char.opening_char("")).toBe("");
            expect(char.opening_char(" ")).toBe("");
            expect(char.opening_char("\n")).toBe("");
        });
    

        it('opening_char_00', () => {
            expect(char.opening_char(`]`)).toBe(`[`);
            expect(char.opening_char(`}`)).toBe(`{`);
            expect(char.opening_char(`)`)).toBe(`(`);
            expect(char.opening_char(`>`)).toBe(`<`);
        });
    });

    

    

});
