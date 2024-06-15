import {
    ASCII_exp,
    any_hexadecimal_regexp, any_white_space, binary_regexp,
    char_alphnumb_char,
    char_json_char,
    char_number_char,
    char_printable_char,
    char_symbol_char,
    char_visible_char,
    delimiter_char,
    fix_float_regexp, hex_float_regexp, hex_int_regexp, html_escape_char, infinity_regexp, int_regexp,
    numb_exp,
    percent_regex,
    regex, sci_float_regexp, sci_hex_float_regexp, string_literal_prefix, symbol_exp,
    trailing_zeroes,
    unprintable_char, uri_sep_exp
} from "../../lib/text/regex.js";

describe('Precompile Regexp', () => {

    // Describe block for the test suite
    describe('Regular Expression: anyWhiteSpaceUnicode', () => {

        // Test case to check if the regular expression matches whitespace characters
        it('should match whitespace characters with Unicode support', () => {
            // Test strings with various whitespace characters including Unicode
            const testStrings = [
                ' ', // Space
                '\t', // Tab
                '\n', // New line
                '\r', // Carriage return
                '\f', // Form feed
                '\u2003', // Unicode: EM SPACE
                '\u202F', // Unicode: NARROW NO-BREAK SPACE
                '\u3000', // Unicode: IDEOGRAPHIC SPACE
                //'\u180E', // Unicode: MONGOLIAN VOWEL SEPARATOR
                '\u1680', // Unicode: OGHAM SPACE MARK
                '   ', // Multiple spaces
                '\t\t', // Multiple tabs
                '\n\n', // Multiple new lines
                '\r\r', // Multiple carriage returns
                '\f\f', // Multiple form feeds
                '\u2003\u2003', // Multiple EM SPACE
                '\u202F\u202F', // Multiple NARROW NO-BREAK SPACE
                '\u3000\u3000', // Multiple IDEOGRAPHIC SPACE
                //'\u180E\u180E', // Multiple MONGOLIAN VOWEL SEPARATOR
                '\u1680\u1680', // Multiple OGHAM SPACE MARK
            ];

            // Iterate over test strings
            testStrings.forEach((str) => {
                // Reset the lastIndex property before each test
                any_white_space.lastIndex = 0;
                // Check if the regular expression matches the string using test
                expect(any_white_space.test(str)).toBe(true);
            });
        });

        // Test case to check if the regular expression does not match non-whitespace characters
        it('should not match non-whitespace characters with Unicode support', () => {
            // Test strings with various non-whitespace characters
            const testStrings = [
                //'Hello World',
                '123',
                '!@#$%^',
                '',
            ];

            // Iterate over test strings
            testStrings.forEach((str) => {
                // Reset the lastIndex property before each test
                any_white_space.lastIndex = 0;
                // Check if the regular expression does not match the string using test
                expect(any_white_space.test(str)).toBe(false);
            });
        });

    });


    describe("Formatter Character Regular Expression Test", () => {
        // Regular expression to match control characters as formatter characters with Unicode support
        const any_formater_char = /[\u0007-\u000D]/ug;

        // Reset the lastIndex property of the regular expression before each individual expect
        beforeEach(() => {
            any_formater_char.lastIndex = 0;
        });

        // Test cases
        it("should match control characters", () => {
            expect(any_formater_char.test("\u0007")).toBe(true); // BELL character
            any_formater_char.lastIndex = 0;
            expect(any_formater_char.test("\u0008")).toBe(true); // BACKSPACE character
            any_formater_char.lastIndex = 0;
            expect(any_formater_char.test("\u0009")).toBe(true); // TAB character
            any_formater_char.lastIndex = 0;
            expect(any_formater_char.test("\u000A")).toBe(true); // LINE FEED character
            any_formater_char.lastIndex = 0;
            expect(any_formater_char.test("\u000B")).toBe(true); // VERTICAL TAB character
            any_formater_char.lastIndex = 0;
            expect(any_formater_char.test("\u000C")).toBe(true); // FORM FEED character
            any_formater_char.lastIndex = 0;
            expect(any_formater_char.test("\u000D")).toBe(true); // CARRIAGE RETURN character
        });

        it("should not match non-control characters", () => {
            expect(any_formater_char.test("")).toBe(false); // Empty string should not match
            any_formater_char.lastIndex = 0;
            expect(any_formater_char.test("abc")).toBe(false); // Regular alphanumeric characters
            any_formater_char.lastIndex = 0;
            expect(any_formater_char.test("äöü")).toBe(false); // Non-control Unicode characters
            any_formater_char.lastIndex = 0;
            expect(any_formater_char.test("你好")).toBe(false); // Chinese characters
            any_formater_char.lastIndex = 0;
            expect(any_formater_char.test("123")).toBe(false); // Regular numbers
            any_formater_char.lastIndex = 0;
            expect(any_formater_char.test("!@#")).toBe(false); // Regular special characters
            any_formater_char.lastIndex = 0;
        });

        it("should match control characters in a string", () => {
            const stringWithControlChars = "abc\u0007def\u0009ghi\u000Bjkl\u000Dmno";
            expect(any_formater_char.test(stringWithControlChars)).toBe(true);
            any_formater_char.lastIndex = 0;
        });

        it("should match control characters globally in a string", () => {
            const stringWithControlChars = "abc\u0007def\u0009ghi\u000Bjkl\u000Dmno";
            const matches = stringWithControlChars.match(any_formater_char);
            expect(matches).not.toBeNull();
            expect(matches.length).toBe(4); // Expecting 4 matches in the string
            any_formater_char.lastIndex = 0;
        });
    });

    describe("html_escape_char regular expression", () => {
        // Test cases for special characters
        it("should match special characters", () => {
            expect(`"`.match(html_escape_char)).toBeTruthy(); // Double quote
            expect(`'`.match(html_escape_char)).toBeTruthy(); // Single quote
            expect(`&`.match(html_escape_char)).toBeTruthy(); // Ampersand
            expect(`<`.match(html_escape_char)).toBeTruthy(); // Less than
            expect(`>`.match(html_escape_char)).toBeTruthy(); // Greater than
            expect(`Œ`.match(html_escape_char)).toBeTruthy(); // Latin capital ligature OE
            expect(`œ`.match(html_escape_char)).toBeTruthy(); // Latin small ligature oe
            expect(`Š`.match(html_escape_char)).toBeTruthy(); // Latin capital letter S with caron
            expect(`š`.match(html_escape_char)).toBeTruthy(); // Latin small letter s with caron
            expect(`Ÿ`.match(html_escape_char)).toBeTruthy(); // Latin capital letter Y with diaeresis
            expect(`ƒ`.match(html_escape_char)).toBeTruthy(); // Latin small letter f with hook
        });

        // Test cases for mathematical symbols
        it("should match mathematical symbols", () => {
            expect(`∀`.match(html_escape_char)).toBeTruthy(); // For all
            expect(`∂`.match(html_escape_char)).toBeTruthy(); // Partial differential
            expect(`∃`.match(html_escape_char)).toBeTruthy(); // There exists
            expect(`∅`.match(html_escape_char)).toBeTruthy(); // Empty set
            expect(`∇`.match(html_escape_char)).toBeTruthy(); // Nabla
            expect(`∈`.match(html_escape_char)).toBeTruthy(); // Element of
            expect(`∉`.match(html_escape_char)).toBeTruthy(); // Not an element of
            expect(`∋`.match(html_escape_char)).toBeTruthy(); // Contains as member
            expect(`∏`.match(html_escape_char)).toBeTruthy(); // N-ary product
            expect(`∑`.match(html_escape_char)).toBeTruthy(); // N-ary summation
        });

        // Test cases for arrows
        it("should match arrows", () => {
            expect(`←`.match(html_escape_char)).toBeTruthy(); // Leftwards arrow
            expect(`↑`.match(html_escape_char)).toBeTruthy(); // Upwards arrow
            expect(`→`.match(html_escape_char)).toBeTruthy(); // Rightwards arrow
            expect(`↓`.match(html_escape_char)).toBeTruthy(); // Downwards arrow
            expect(`↔`.match(html_escape_char)).toBeTruthy(); // Left right arrow
            expect(`↵`.match(html_escape_char)).toBeTruthy(); // Downwards arrow with corner leftwards
        });

        // Additional test cases can be added for other categories of characters

        // Test cases for characters not needing escape
        it("should not match characters not needing escape", () => {
            expect(`A`.match(html_escape_char)).toBeNull(); // Printable character
            expect(` `.match(html_escape_char)).toBeNull(); // Space character
            //expect(`Ç`.match(html_escape_char)).toBeNull(); // Latin-1 Supplement character
            expect(`中`.match(html_escape_char)).toBeNull(); // CJK Unified Ideograph character
            expect(`😀`.match(html_escape_char)).toBeNull(); // Emoji character
        });
    });

    describe('unprintable_char regular expression', () => {
        it('should match any unprintable characters', () => {
            // ASCII control characters
            expect('\x00').toMatch(unprintable_char);
            expect('\x1F').toMatch(unprintable_char);
            expect('\x7F').toMatch(unprintable_char);
            expect('\x9F').toMatch(unprintable_char);

            // Additional characters
            expect('\u0007').toMatch(unprintable_char); // Bell
            expect('\u0008').toMatch(unprintable_char); // Backspace
            expect('\u0009').toMatch(unprintable_char); // Tab
            expect('\u000A').toMatch(unprintable_char); // Line feed
            expect('\u000B').toMatch(unprintable_char); // Vertical tab
            expect('\u000C').toMatch(unprintable_char); // Form feed
            expect('\u000D').toMatch(unprintable_char); // Carriage return
            expect('\u0020').toMatch(unprintable_char); // Space
            expect('\u00A0').toMatch(unprintable_char); // No-break space
            expect('\u2028').toMatch(unprintable_char); // Line separator
            expect('\u2029').toMatch(unprintable_char); // Paragraph separator
            expect('\uFDD0').toMatch(unprintable_char); // Non-character (FDD0-FDEF)
            expect('\uFDD1').toMatch(unprintable_char);
            expect('\uFDD2').toMatch(unprintable_char);
            expect('\uFDD3').toMatch(unprintable_char);
            expect('\uFDD4').toMatch(unprintable_char);
            expect('\uFDD5').toMatch(unprintable_char);
            expect('\uFDD6').toMatch(unprintable_char);
            expect('\uFDD7').toMatch(unprintable_char);
            expect('\uFDD8').toMatch(unprintable_char);

            // Unicode control characters
            expect('\u200B').toMatch(unprintable_char); // Zero-width space
            expect('\u200C').toMatch(unprintable_char); // Zero-width non-joiner
            expect('\u200D').toMatch(unprintable_char); // Zero-width joiner
            expect('\u2060').toMatch(unprintable_char); // Word joiner
            expect('\u206F').toMatch(unprintable_char); // Invisible separator
            expect('\uFFF0').toMatch(unprintable_char);
            expect('\uFFFF').toMatch(unprintable_char);

            // Non-matching characters
            expect('a').not.toMatch(unprintable_char);
            expect('123').not.toMatch(unprintable_char);
        });

        it('should match multiple unprintable characters in a string', () => {
            const string_with_unprintables = 'a\x00b\x1Fc\x7Fd\x9F';
            expect(string_with_unprintables).toMatch(unprintable_char);
            expect(string_with_unprintables.match(unprintable_char).length).toBe(4);
        });

        it('should not match any printable characters', () => {
            const printable_chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[{]}|;:\'",<.>/?';
            expect(printable_chars).not.toMatch(unprintable_char);
        });
    });

    describe('string_literal_prefix regular expression', () => {
        it('should match valid string literal prefixes', () => {
            // Valid prefixes without 'R'
            expect('u').toMatch(string_literal_prefix);
            expect('u8').toMatch(string_literal_prefix);
            expect('U').toMatch(string_literal_prefix);
            expect('L').toMatch(string_literal_prefix);

            // Valid prefixes with 'R'
            expect('R').toMatch(string_literal_prefix);
            expect('uR').toMatch(string_literal_prefix);
            expect('u8R').toMatch(string_literal_prefix);
            expect('UR').toMatch(string_literal_prefix);
            expect('LR').toMatch(string_literal_prefix);

            // Should match prefixes in any case
            expect('l').not.toMatch(string_literal_prefix); // lowercase 'l' is invalid
            expect('r').not.toMatch(string_literal_prefix); // lowercase 'r' is invalid
            expect('Ur').not.toMatch(string_literal_prefix); // 'Ur' is invalid because 'U' and 'R' cannot be combined
        });

        it('should not match invalid string literal prefixes', () => {
            // Invalid prefixes
            expect('X').not.toMatch(string_literal_prefix); // 'X' is not a valid prefix
            expect('1').not.toMatch(string_literal_prefix); // '1' is not a valid prefix
            expect('u8LX').not.toMatch(string_literal_prefix); // 'LX' is not a valid combination
        });

        it('should match empty string as a valid prefix', () => {
            // Empty string indicates absence of prefix
            expect('').toMatch(string_literal_prefix);
        });
    });

    describe('ASCII_exp regular expression', () => {
        it('should match every printable ASCII character', () => {
            // Test all printable ASCII characters
            for (let i = 0x20; i <= 0x7E; i++) {
                const char = String.fromCharCode(i);
                expect(char).toMatch(ASCII_exp);
            }
        });

        it('should not match control characters', () => {
            // Test control characters (0x00-0x1F and 0x7F)
            for (let i = 0x00; i <= 0x1F; i++) {
                const char = String.fromCharCode(i);
                expect(char).not.toMatch(ASCII_exp);
            }
            const char = String.fromCharCode(0x7F);
            expect(char).not.toMatch(ASCII_exp);
        });

        it('should not match non-printable ASCII characters', () => {
            // Test non-printable ASCII characters outside the printable range
            for (let i = 0x00; i <= 0x1F; i++) {
                const char = String.fromCharCode(i);
                expect(char).not.toMatch(ASCII_exp);
            }
            const char = String.fromCharCode(0x7F);
            expect(char).not.toMatch(ASCII_exp);
        });

        it('should not match non-ASCII characters', () => {
            // Test non-ASCII characters
            for (let i = 0x80; i <= 0xFF; i++) {
                const char = String.fromCharCode(i);
                expect(char).not.toMatch(ASCII_exp);
            }
        });
    });

    describe('trailing_zeroes regular expression', () => {
        it('should match trailing zeroes at the end of the string', () => {
            // Test cases with trailing zeroes
            expect('1000').toMatch(trailing_zeroes);
            expect('0').toMatch(trailing_zeroes);
            expect('10.00').toMatch(trailing_zeroes);
            expect('0.000').toMatch(trailing_zeroes);
            expect('0.0000').toMatch(trailing_zeroes);
            expect('1000.000').toMatch(trailing_zeroes);
        });

        it('should not match trailing zeroes preceded by a dot', () => {
            // Test cases with trailing zeroes preceded by a dot
            expect('1000.0').not.toMatch(trailing_zeroes);
            expect('0.0').not.toMatch(trailing_zeroes);
            expect('0.0').not.toMatch(trailing_zeroes);
        });

        it('should not match trailing zeroes in the middle of the string', () => {
            // Test cases with trailing zeroes in the middle of the string
            //expect('1000').not.toMatch(trailing_zeroes);
            expect('1000.1').not.toMatch(trailing_zeroes);
            expect('123.456').not.toMatch(trailing_zeroes);
        });

        it('should match multiple trailing zeroes', () => {
            // Test cases with multiple trailing zeroes
            expect('10000').toMatch(trailing_zeroes);
            expect('10000.00').toMatch(trailing_zeroes);
            expect('123.40000').toMatch(trailing_zeroes);
        });

        it('should not match strings without trailing zeroes', () => {
            // Test cases without trailing zeroes
            expect('0.1').not.toMatch(trailing_zeroes);
            expect('123').not.toMatch(trailing_zeroes);
            expect('123.456').not.toMatch(trailing_zeroes);
            //expect('0').not.toMatch(trailing_zeroes);
        });

        it('should not match empty strings', () => {
            // Test empty string
            expect('').not.toMatch(trailing_zeroes);
        });
    });

    it('reg_escape_00', () => {
        expect(regex.escape(`<>=!+-*/%&|^`)).toBe(`<>=!\\+\\-\\*/%&\\|\\^`);
        expect(regex.escape(`;{}()`)).toBe(`;\\{\\}\\(\\)`);
    });

    it('uri_sep_exp_00', () => {
        let uri = `x:\\a\\b\\c\\d.e`;
        let cut = uri.split(uri_sep_exp);
        expect(cut).toEqual([`x:`, `a`, `b`, `c`, `d.e`]);
    });

    it('uri_sep_exp_01', () => {
        let uri = `x:/a/b/c/d.e`;
        let cut = uri.split(uri_sep_exp);
        expect(cut).toEqual([`x:`, `a`, `b`, `c`, `d.e`]);
    });

    it(`symbol_exp_00`, () => {
        let test = [
            `(`, `)`, `[`, `]`, `!`, `~`, `++`, `--`, `*`, `/`, `%`, `-`, `+`, `<<`, `>>`, `<`, `<=`, `>`, `>=`, `==`, `!=`, `&`, `^`, `|`, `||`,
            `&&`, `=`, `+=`, `-=`, `*=`, `/=`, `%=`, `::`, `.`, `->`, `.*`, `->*`, `>>=`, `<<=`, `&=`, `^=`, `|=`, `?`, `:`, `,`, `#`, `##`, `{`, `}`, `;`
        ];
        for (let it = 0; it < test.length; ++it) {
            if (!symbol_exp.test(test[it])) console.log(test[it]);
            expect(symbol_exp.test(test[it])).toBeTrue();
        }

    });

    it(`delimiter_char_00`, () => {
        let test = [`(`, `)`, `[`, `]`, `<`, `>`];
        for (let it = 0; it < test.length; ++it)
            expect(delimiter_char.test(test[it])).toBeTrue();
    });

    it(`binary_regexp_00`, () => {
        //console.log(RegExp(`^0b[01']+$`.replace(/[#].*$|\s/gm, ''), `i`));
        // /^0b[01']+$/i
        const exp = binary_regexp;

        // binary
        expect(exp.test(`0b001`)).toBeTrue();
        expect(exp.test(`0b1111'1111`)).toBeTrue();
        expect(exp.test(`0b1`)).toBeTrue();
        expect(exp.test(`0B101`)).toBeTrue();
        expect(exp.test(`0b101'011`)).toBeTrue();

        // octal
        expect(exp.test(`071`)).toBeFalse();
        expect(exp.test(`-05`)).toBeFalse();
        expect(exp.test(`067`)).toBeFalse();

        // decimal integer
        expect(exp.test(`81`)).toBeFalse();
        expect(exp.test(`-81`)).toBeFalse();
        expect(exp.test(`467`)).toBeFalse();
        expect(exp.test(`1`)).toBeFalse();
        expect(exp.test(`0`)).toBeFalse();
        expect(exp.test(`1'000`)).toBeFalse();
        expect(exp.test(`-1'000`)).toBeFalse();
        expect(exp.test(`6ull`)).toBeFalse();
        expect(exp.test(`-8ll`)).toBeFalse();
        expect(exp.test(`18'446'744'073'709'550'592ll`)).toBeFalse();
        expect(exp.test(`1844'6744'0737'0955'0592uLL`)).toBeFalse();
        expect(exp.test(`184467'440737'0'95505'92LL`)).toBeFalse();
        expect(exp.test(`-184467'440737'0'95505'92LL`)).toBeFalse();

        // hexa integer
        expect(exp.test(`0x0`)).toBeFalse();
        expect(exp.test(`-0XFF`)).toBeFalse();
        expect(exp.test(`0x1`)).toBeFalse();
        expect(exp.test(`0x45`)).toBeFalse();
        expect(exp.test(`0xa`)).toBeFalse();
        expect(exp.test(`-0xa`)).toBeFalse();
        expect(exp.test(`0xAF`)).toBeFalse();
        expect(exp.test(`0xff`)).toBeFalse();
        expect(exp.test(`-0xff`)).toBeFalse();

        // decimal float fix 
        expect(exp.test(`0.`)).toBeFalse();
        expect(exp.test(`0.0`)).toBeFalse();
        expect(exp.test(`.0`)).toBeFalse();
        expect(exp.test(`-.0`)).toBeFalse();
        expect(exp.test(`1f`)).toBeFalse();
        expect(exp.test(`-1f`)).toBeFalse();
        expect(exp.test(`3.7`)).toBeFalse();
        expect(exp.test(`58.`)).toBeFalse();
        expect(exp.test(`6.`)).toBeFalse();
        expect(exp.test(`3.1415926535897932384626433832795`)).toBeFalse();
        expect(exp.test(`0.5l`)).toBeFalse();

        // decimal float exponant
        expect(exp.test(`1e46`)).toBeFalse();
        expect(exp.test(`1E7`)).toBeFalse();
        expect(exp.test(`-1E7`)).toBeFalse();
        expect(exp.test(`1E-7`)).toBeFalse();
        expect(exp.test(`1E+7`)).toBeFalse();
        expect(exp.test(`1.e+7`)).toBeFalse();
        expect(exp.test(`4e2`)).toBeFalse();
        expect(exp.test(`123.456e-67`)).toBeFalse();
        expect(exp.test(`.1E4f`)).toBeFalse();
        expect(exp.test(`-.1E4f`)).toBeFalse();
        expect(exp.test(`1e-5L`)).toBeFalse();

        // hexa float fix 
        expect(exp.test(`0x6.FF`)).toBeFalse();
        expect(exp.test(`0x6.`)).toBeFalse();
        expect(exp.test(`-0x6.`)).toBeFalse();
        expect(exp.test(`0x0.`)).toBeFalse();
        expect(exp.test(`0x3.dae`)).toBeFalse();
        expect(exp.test(`0x3.dae5`)).toBeFalse();
        expect(exp.test(`-0x3.dae5`)).toBeFalse();

        // hexa float exponant
        expect(exp.test(`0x6.FFp7`)).toBeFalse();
        expect(exp.test(`-0x6.FFp7`)).toBeFalse();
        expect(exp.test(`0x1.FFFFFEp+62`)).toBeFalse();
        expect(exp.test(`0x3.14p+0`)).toBeFalse();
        expect(exp.test(`0x1ffp10`)).toBeFalse();
        expect(exp.test(`0x0p-1`)).toBeFalse();
        expect(exp.test(`-0x0p-1`)).toBeFalse();
        expect(exp.test(`0x1.p0`)).toBeFalse();
        expect(exp.test(`0xf.p-1`)).toBeFalse();
        expect(exp.test(`0x1.2p3`)).toBeFalse();
        expect(exp.test(`0x1.ap3`)).toBeFalse();
        expect(exp.test(`0x1.2ap3`)).toBeFalse();
        expect(exp.test(`-0x1.2ap3`)).toBeFalse();
        expect(exp.test(`0x1p+3`)).toBeFalse();
        expect(exp.test(`0x1p+3f`)).toBeFalse();
        expect(exp.test(`0x1p+3L`)).toBeFalse();
        expect(exp.test(`-0x1.0C6F7Ap-21`)).toBeFalse();

        // not a number
        expect(exp.test(`.`)).toBeFalse();
        expect(exp.test(`3.14e+0a`)).toBeFalse();
        expect(exp.test(`0x3.14p+0a`)).toBeFalse();
        expect(exp.test(`a`)).toBeFalse();
        expect(exp.test(`-a`)).toBeFalse();
        expect(exp.test(`05a`)).toBeFalse();
        expect(exp.test(`+x`)).toBeFalse();
        expect(exp.test(`2=`)).toBeFalse();
        expect(exp.test(`x`)).toBeFalse();
        expect(exp.test(`a7.13`)).toBeFalse();
    });

    it(`octal_regexp_00`, () => {
        //console.log(RegExp(`^[+-]?0[0-7]+$`.replace(/[#].*$|\s/gm, '')));
        // ^[+-]?0[0-7]+$
        const exp = /^[+-]?0[0-7]+$/i;

        // binary
        expect(exp.test(`0b001`)).toBeFalse();
        expect(exp.test(`0b1111'1111`)).toBeFalse();
        expect(exp.test(`0b1`)).toBeFalse();
        expect(exp.test(`0B101`)).toBeFalse();
        expect(exp.test(`0b101'011`)).toBeFalse();

        // octal
        expect(exp.test(`071`)).toBeTrue();
        expect(exp.test(`-05`)).toBeTrue();
        expect(exp.test(`067`)).toBeTrue();

        // decimal integer
        expect(exp.test(`81`)).toBeFalse();
        expect(exp.test(`-81`)).toBeFalse();
        expect(exp.test(`467`)).toBeFalse();
        expect(exp.test(`1`)).toBeFalse();
        expect(exp.test(`0`)).toBeFalse();
        expect(exp.test(`1'000`)).toBeFalse();
        expect(exp.test(`-1'000`)).toBeFalse();
        expect(exp.test(`6ull`)).toBeFalse();
        expect(exp.test(`-8ll`)).toBeFalse();
        expect(exp.test(`18'446'744'073'709'550'592ll`)).toBeFalse();
        expect(exp.test(`1844'6744'0737'0955'0592uLL`)).toBeFalse();
        expect(exp.test(`184467'440737'0'95505'92LL`)).toBeFalse();
        expect(exp.test(`-184467'440737'0'95505'92LL`)).toBeFalse();

        // hexa integer
        expect(exp.test(`0x0`)).toBeFalse();
        expect(exp.test(`-0XFF`)).toBeFalse();
        expect(exp.test(`0x1`)).toBeFalse();
        expect(exp.test(`0x45`)).toBeFalse();
        expect(exp.test(`0xa`)).toBeFalse();
        expect(exp.test(`-0xa`)).toBeFalse();
        expect(exp.test(`0xAF`)).toBeFalse();
        expect(exp.test(`0xff`)).toBeFalse();
        expect(exp.test(`-0xff`)).toBeFalse();

        // decimal float fix 
        expect(exp.test(`0.`)).toBeFalse();
        expect(exp.test(`0.0`)).toBeFalse();
        expect(exp.test(`.0`)).toBeFalse();
        expect(exp.test(`-.0`)).toBeFalse();
        expect(exp.test(`1f`)).toBeFalse();
        expect(exp.test(`-1f`)).toBeFalse();
        expect(exp.test(`3.7`)).toBeFalse();
        expect(exp.test(`58.`)).toBeFalse();
        expect(exp.test(`6.`)).toBeFalse();
        expect(exp.test(`3.1415926535897932384626433832795`)).toBeFalse();
        expect(exp.test(`0.5l`)).toBeFalse();

        // decimal float exponant
        expect(exp.test(`1e46`)).toBeFalse();
        expect(exp.test(`1E7`)).toBeFalse();
        expect(exp.test(`-1E7`)).toBeFalse();
        expect(exp.test(`1E-7`)).toBeFalse();
        expect(exp.test(`1E+7`)).toBeFalse();
        expect(exp.test(`1.e+7`)).toBeFalse();
        expect(exp.test(`4e2`)).toBeFalse();
        expect(exp.test(`123.456e-67`)).toBeFalse();
        expect(exp.test(`.1E4f`)).toBeFalse();
        expect(exp.test(`-.1E4f`)).toBeFalse();
        expect(exp.test(`1e-5L`)).toBeFalse();

        // hexa float fix 
        expect(exp.test(`0x6.FF`)).toBeFalse();
        expect(exp.test(`0x6.`)).toBeFalse();
        expect(exp.test(`-0x6.`)).toBeFalse();
        expect(exp.test(`0x0.`)).toBeFalse();
        expect(exp.test(`0x3.dae`)).toBeFalse();
        expect(exp.test(`0x3.dae5`)).toBeFalse();
        expect(exp.test(`-0x3.dae5`)).toBeFalse();

        // hexa float exponant
        expect(exp.test(`0x6.FFp7`)).toBeFalse();
        expect(exp.test(`-0x6.FFp7`)).toBeFalse();
        expect(exp.test(`0x1.FFFFFEp+62`)).toBeFalse();
        expect(exp.test(`0x3.14p+0`)).toBeFalse();
        expect(exp.test(`0x1ffp10`)).toBeFalse();
        expect(exp.test(`0x0p-1`)).toBeFalse();
        expect(exp.test(`-0x0p-1`)).toBeFalse();
        expect(exp.test(`0x1.p0`)).toBeFalse();
        expect(exp.test(`0xf.p-1`)).toBeFalse();
        expect(exp.test(`0x1.2p3`)).toBeFalse();
        expect(exp.test(`0x1.ap3`)).toBeFalse();
        expect(exp.test(`0x1.2ap3`)).toBeFalse();
        expect(exp.test(`-0x1.2ap3`)).toBeFalse();
        expect(exp.test(`0x1p+3`)).toBeFalse();
        expect(exp.test(`0x1p+3f`)).toBeFalse();
        expect(exp.test(`0x1p+3L`)).toBeFalse();
        expect(exp.test(`-0x1.0C6F7Ap-21`)).toBeFalse();

        // not a number
        expect(exp.test(`.`)).toBeFalse();
        expect(exp.test(`3.14e+0a`)).toBeFalse();
        expect(exp.test(`0x3.14p+0a`)).toBeFalse();
        expect(exp.test(`a`)).toBeFalse();
        expect(exp.test(`-a`)).toBeFalse();
        expect(exp.test(`05a`)).toBeFalse();
        expect(exp.test(`+x`)).toBeFalse();
        expect(exp.test(`2=`)).toBeFalse();
        expect(exp.test(`x`)).toBeFalse();
        expect(exp.test(`a7.13`)).toBeFalse();
    });

    it(`int_regexp_00`, () => {
        //console.log(RegExp(`^[+-]?(0|[1-9][\\d\\']*)[ul]{0,3}$`.replace(/[#].*$|\s/gm, ''), `i`));
        // /^[+-]?(0|[1-9][\d\']*)[ul]{0,3}$/i
        const exp = int_regexp;

        // binary
        expect(exp.test(`0b001`)).toBeFalse();
        expect(exp.test(`0b1111'1111`)).toBeFalse();
        expect(exp.test(`0b1`)).toBeFalse();
        expect(exp.test(`0B101`)).toBeFalse();
        expect(exp.test(`0b101'011`)).toBeFalse();

        // octal
        expect(exp.test(`071`)).toBeFalse();
        expect(exp.test(`-05`)).toBeFalse();
        expect(exp.test(`067`)).toBeFalse();

        // decimal integer
        expect(exp.test(`81`)).toBeTrue();
        expect(exp.test(`-81`)).toBeTrue();
        expect(exp.test(`467`)).toBeTrue();
        expect(exp.test(`1`)).toBeTrue();
        expect(exp.test(`0`)).toBeTrue();
        expect(exp.test(`1'000`)).toBeTrue();
        expect(exp.test(`-1'000`)).toBeTrue();
        expect(exp.test(`6ull`)).toBeTrue();
        expect(exp.test(`-8ll`)).toBeTrue();
        expect(exp.test(`18'446'744'073'709'550'592ll`)).toBeTrue();
        expect(exp.test(`1844'6744'0737'0955'0592uLL`)).toBeTrue();
        expect(exp.test(`184467'440737'0'95505'92LL`)).toBeTrue();
        expect(exp.test(`-184467'440737'0'95505'92LL`)).toBeTrue();

        // hexa integer
        expect(exp.test(`0x0`)).toBeFalse();
        expect(exp.test(`-0XFF`)).toBeFalse();
        expect(exp.test(`0x1`)).toBeFalse();
        expect(exp.test(`0x45`)).toBeFalse();
        expect(exp.test(`0xa`)).toBeFalse();
        expect(exp.test(`-0xa`)).toBeFalse();
        expect(exp.test(`0xAF`)).toBeFalse();
        expect(exp.test(`0xff`)).toBeFalse();
        expect(exp.test(`-0xff`)).toBeFalse();

        // decimal float fix 
        expect(exp.test(`0.`)).toBeFalse();
        expect(exp.test(`0.0`)).toBeFalse();
        expect(exp.test(`.0`)).toBeFalse();
        expect(exp.test(`-.0`)).toBeFalse();
        expect(exp.test(`1f`)).toBeFalse();
        expect(exp.test(`-1f`)).toBeFalse();
        expect(exp.test(`3.7`)).toBeFalse();
        expect(exp.test(`58.`)).toBeFalse();
        expect(exp.test(`6.`)).toBeFalse();
        expect(exp.test(`3.1415926535897932384626433832795`)).toBeFalse();
        expect(exp.test(`0.5l`)).toBeFalse();

        // decimal float exponant
        expect(exp.test(`1e46`)).toBeFalse();
        expect(exp.test(`1E7`)).toBeFalse();
        expect(exp.test(`-1E7`)).toBeFalse();
        expect(exp.test(`1E-7`)).toBeFalse();
        expect(exp.test(`1E+7`)).toBeFalse();
        expect(exp.test(`1.e+7`)).toBeFalse();
        expect(exp.test(`4e2`)).toBeFalse();
        expect(exp.test(`123.456e-67`)).toBeFalse();
        expect(exp.test(`.1E4f`)).toBeFalse();
        expect(exp.test(`-.1E4f`)).toBeFalse();
        expect(exp.test(`1e-5L`)).toBeFalse();

        // hexa float fix 
        expect(exp.test(`0x6.FF`)).toBeFalse();
        expect(exp.test(`0x6.`)).toBeFalse();
        expect(exp.test(`-0x6.`)).toBeFalse();
        expect(exp.test(`0x0.`)).toBeFalse();
        expect(exp.test(`0x3.dae`)).toBeFalse();
        expect(exp.test(`0x3.dae5`)).toBeFalse();
        expect(exp.test(`-0x3.dae5`)).toBeFalse();

        // hexa float exponant
        expect(exp.test(`0x6.FFp7`)).toBeFalse();
        expect(exp.test(`-0x6.FFp7`)).toBeFalse();
        expect(exp.test(`0x1.FFFFFEp+62`)).toBeFalse();
        expect(exp.test(`0x3.14p+0`)).toBeFalse();
        expect(exp.test(`0x1ffp10`)).toBeFalse();
        expect(exp.test(`0x0p-1`)).toBeFalse();
        expect(exp.test(`-0x0p-1`)).toBeFalse();
        expect(exp.test(`0x1.p0`)).toBeFalse();
        expect(exp.test(`0xf.p-1`)).toBeFalse();
        expect(exp.test(`0x1.2p3`)).toBeFalse();
        expect(exp.test(`0x1.ap3`)).toBeFalse();
        expect(exp.test(`0x1.2ap3`)).toBeFalse();
        expect(exp.test(`-0x1.2ap3`)).toBeFalse();
        expect(exp.test(`0x1p+3`)).toBeFalse();
        expect(exp.test(`0x1p+3f`)).toBeFalse();
        expect(exp.test(`0x1p+3L`)).toBeFalse();
        expect(exp.test(`-0x1.0C6F7Ap-21`)).toBeFalse();

        // not a number
        expect(exp.test(`.`)).toBeFalse();
        expect(exp.test(`3.14e+0a`)).toBeFalse();
        expect(exp.test(`0x3.14p+0a`)).toBeFalse();
        expect(exp.test(`a`)).toBeFalse();
        expect(exp.test(`-a`)).toBeFalse();
        expect(exp.test(`05a`)).toBeFalse();
        expect(exp.test(`+x`)).toBeFalse();
        expect(exp.test(`2=`)).toBeFalse();
        expect(exp.test(`x`)).toBeFalse();
        expect(exp.test(`a7.13`)).toBeFalse();
    });

    it(`hex_int_regexp_00`, () => {
        //console.log(RegExp(`^[+-]?0x[a-f\\d]+$`.replace(/[#].*$|\s/gm, ''), `i`));
        // /^[+-]?0x[a-f\d]+$/i
        const exp = hex_int_regexp;

        // binary
        expect(exp.test(`0b001`)).toBeFalse();
        expect(exp.test(`0b1111'1111`)).toBeFalse();
        expect(exp.test(`0b1`)).toBeFalse();
        expect(exp.test(`0B101`)).toBeFalse();
        expect(exp.test(`0b101'011`)).toBeFalse();

        // octal
        expect(exp.test(`071`)).toBeFalse();
        expect(exp.test(`-05`)).toBeFalse();
        expect(exp.test(`067`)).toBeFalse();

        // decimal integer
        expect(exp.test(`81`)).toBeFalse();
        expect(exp.test(`-81`)).toBeFalse();
        expect(exp.test(`467`)).toBeFalse();
        expect(exp.test(`1`)).toBeFalse();
        expect(exp.test(`0`)).toBeFalse();
        expect(exp.test(`1'000`)).toBeFalse();
        expect(exp.test(`-1'000`)).toBeFalse();
        expect(exp.test(`6ull`)).toBeFalse();
        expect(exp.test(`-8ll`)).toBeFalse();
        expect(exp.test(`18'446'744'073'709'550'592ll`)).toBeFalse();
        expect(exp.test(`1844'6744'0737'0955'0592uLL`)).toBeFalse();
        expect(exp.test(`184467'440737'0'95505'92LL`)).toBeFalse();
        expect(exp.test(`-184467'440737'0'95505'92LL`)).toBeFalse();

        // hexa integer
        expect(exp.test(`0x0`)).toBeTrue();
        expect(exp.test(`-0XFF`)).toBeTrue();
        expect(exp.test(`0x1`)).toBeTrue();
        expect(exp.test(`0x45`)).toBeTrue();
        expect(exp.test(`0xa`)).toBeTrue();
        expect(exp.test(`-0xa`)).toBeTrue();
        expect(exp.test(`0xAF`)).toBeTrue();
        expect(exp.test(`0xff`)).toBeTrue();
        expect(exp.test(`-0xff`)).toBeTrue();

        // decimal float fix 
        expect(exp.test(`0.`)).toBeFalse();
        expect(exp.test(`0.0`)).toBeFalse();
        expect(exp.test(`.0`)).toBeFalse();
        expect(exp.test(`-.0`)).toBeFalse();
        expect(exp.test(`1f`)).toBeFalse();
        expect(exp.test(`-1f`)).toBeFalse();
        expect(exp.test(`3.7`)).toBeFalse();
        expect(exp.test(`58.`)).toBeFalse();
        expect(exp.test(`6.`)).toBeFalse();
        expect(exp.test(`3.1415926535897932384626433832795`)).toBeFalse();
        expect(exp.test(`0.5l`)).toBeFalse();

        // decimal float exponant
        expect(exp.test(`1e46`)).toBeFalse();
        expect(exp.test(`1E7`)).toBeFalse();
        expect(exp.test(`-1E7`)).toBeFalse();
        expect(exp.test(`1E-7`)).toBeFalse();
        expect(exp.test(`1E+7`)).toBeFalse();
        expect(exp.test(`1.e+7`)).toBeFalse();
        expect(exp.test(`4e2`)).toBeFalse();
        expect(exp.test(`123.456e-67`)).toBeFalse();
        expect(exp.test(`.1E4f`)).toBeFalse();
        expect(exp.test(`-.1E4f`)).toBeFalse();
        expect(exp.test(`1e-5L`)).toBeFalse();

        // hexa float fix 
        expect(exp.test(`0x6.FF`)).toBeFalse();
        expect(exp.test(`0x6.`)).toBeFalse();
        expect(exp.test(`-0x6.`)).toBeFalse();
        expect(exp.test(`0x0.`)).toBeFalse();
        expect(exp.test(`0x3.dae`)).toBeFalse();
        expect(exp.test(`0x3.dae5`)).toBeFalse();
        expect(exp.test(`-0x3.dae5`)).toBeFalse();

        // hexa float exponant
        expect(exp.test(`0x6.FFp7`)).toBeFalse();
        expect(exp.test(`-0x6.FFp7`)).toBeFalse();
        expect(exp.test(`0x1.FFFFFEp+62`)).toBeFalse();
        expect(exp.test(`0x3.14p+0`)).toBeFalse();
        expect(exp.test(`0x1ffp10`)).toBeFalse();
        expect(exp.test(`0x0p-1`)).toBeFalse();
        expect(exp.test(`-0x0p-1`)).toBeFalse();
        expect(exp.test(`0x1.p0`)).toBeFalse();
        expect(exp.test(`0xf.p-1`)).toBeFalse();
        expect(exp.test(`0x1.2p3`)).toBeFalse();
        expect(exp.test(`0x1.ap3`)).toBeFalse();
        expect(exp.test(`0x1.2ap3`)).toBeFalse();
        expect(exp.test(`-0x1.2ap3`)).toBeFalse();
        expect(exp.test(`0x1p+3`)).toBeFalse();
        expect(exp.test(`0x1p+3f`)).toBeFalse();
        expect(exp.test(`0x1p+3L`)).toBeFalse();
        expect(exp.test(`-0x1.0C6F7Ap-21`)).toBeFalse();

        // not a number
        expect(exp.test(`.`)).toBeFalse();
        expect(exp.test(`3.14e+0a`)).toBeFalse();
        expect(exp.test(`0x3.14p+0a`)).toBeFalse();
        expect(exp.test(`a`)).toBeFalse();
        expect(exp.test(`-a`)).toBeFalse();
        expect(exp.test(`05a`)).toBeFalse();
        expect(exp.test(`+x`)).toBeFalse();
        expect(exp.test(`2=`)).toBeFalse();
        expect(exp.test(`x`)).toBeFalse();
        expect(exp.test(`a7.13`)).toBeFalse();
    });

    it(`fix_float_regexp_00`, () => {
        //console.log(RegExp(`
        //^
        //    [+-]?(?=\\d|\\.\\d)
        //    ([1-9]\\d*(f|fl|fll)|
        //    \\d*\\.\\d*?
        //    (f|l|fl|fll)?)
        //$`.replace(/[#].*$|\s/gm, ''), `i`));
        // regex_test.js:473 /^[+-]?(?=\d|\.\d)([1-9]\d*(f|fl|fll)|\d*\.\d*?(f|l|fl|fll)?)$/i
        const exp = fix_float_regexp;

        // binary
        expect(exp.test(`0b001`)).toBeFalse();
        expect(exp.test(`0b1111'1111`)).toBeFalse();
        expect(exp.test(`0b1`)).toBeFalse();
        expect(exp.test(`0B101`)).toBeFalse();
        expect(exp.test(`0b101'011`)).toBeFalse();

        // octal
        expect(exp.test(`071`)).toBeFalse();
        expect(exp.test(`-05`)).toBeFalse();
        expect(exp.test(`067`)).toBeFalse();

        // decimal integer
        expect(exp.test(`81`)).toBeFalse();
        expect(exp.test(`-81`)).toBeFalse();
        expect(exp.test(`467`)).toBeFalse();
        expect(exp.test(`1`)).toBeFalse();
        expect(exp.test(`0`)).toBeFalse();
        expect(exp.test(`1'000`)).toBeFalse();
        expect(exp.test(`-1'000`)).toBeFalse();
        expect(exp.test(`6ull`)).toBeFalse();
        expect(exp.test(`-8ll`)).toBeFalse();
        expect(exp.test(`18'446'744'073'709'550'592ll`)).toBeFalse();
        expect(exp.test(`1844'6744'0737'0955'0592uLL`)).toBeFalse();
        expect(exp.test(`184467'440737'0'95505'92LL`)).toBeFalse();
        expect(exp.test(`-184467'440737'0'95505'92LL`)).toBeFalse();

        // hexa integer
        expect(exp.test(`0x0`)).toBeFalse();
        expect(exp.test(`-0XFF`)).toBeFalse();
        expect(exp.test(`0x1`)).toBeFalse();
        expect(exp.test(`0x45`)).toBeFalse();
        expect(exp.test(`0xa`)).toBeFalse();
        expect(exp.test(`-0xa`)).toBeFalse();
        expect(exp.test(`0xAF`)).toBeFalse();
        expect(exp.test(`0xff`)).toBeFalse();
        expect(exp.test(`-0xff`)).toBeFalse();

        // decimal float fix 
        expect(exp.test(`0.`)).toBeTrue();
        expect(exp.test(`0.0`)).toBeTrue();
        expect(exp.test(`.0`)).toBeTrue();
        expect(exp.test(`-.0`)).toBeTrue();
        expect(exp.test(`1f`)).toBeTrue();
        expect(exp.test(`-1f`)).toBeTrue();
        expect(exp.test(`3.7`)).toBeTrue();
        expect(exp.test(`58.`)).toBeTrue();
        expect(exp.test(`6.`)).toBeTrue();
        expect(exp.test(`3.1415926535897932384626433832795`)).toBeTrue();
        expect(exp.test(`0.5l`)).toBeTrue();

        // decimal float exponant
        expect(exp.test(`1e46`)).toBeFalse();
        expect(exp.test(`1E7`)).toBeFalse();
        expect(exp.test(`-1E7`)).toBeFalse();
        expect(exp.test(`1E-7`)).toBeFalse();
        expect(exp.test(`1E+7`)).toBeFalse();
        expect(exp.test(`1.e+7`)).toBeFalse();
        expect(exp.test(`4e2`)).toBeFalse();
        expect(exp.test(`123.456e-67`)).toBeFalse();
        expect(exp.test(`.1E4f`)).toBeFalse();
        expect(exp.test(`-.1E4f`)).toBeFalse();
        expect(exp.test(`1e-5L`)).toBeFalse();

        // hexa float fix 
        expect(exp.test(`0x6.FF`)).toBeFalse();
        expect(exp.test(`0x6.`)).toBeFalse();
        expect(exp.test(`-0x6.`)).toBeFalse();
        expect(exp.test(`0x0.`)).toBeFalse();
        expect(exp.test(`0x3.dae`)).toBeFalse();
        expect(exp.test(`0x3.dae5`)).toBeFalse();
        expect(exp.test(`-0x3.dae5`)).toBeFalse();

        // hexa float exponant
        expect(exp.test(`0x6.FFp7`)).toBeFalse();
        expect(exp.test(`-0x6.FFp7`)).toBeFalse();
        expect(exp.test(`0x1.FFFFFEp+62`)).toBeFalse();
        expect(exp.test(`0x3.14p+0`)).toBeFalse();
        expect(exp.test(`0x1ffp10`)).toBeFalse();
        expect(exp.test(`0x0p-1`)).toBeFalse();
        expect(exp.test(`-0x0p-1`)).toBeFalse();
        expect(exp.test(`0x1.p0`)).toBeFalse();
        expect(exp.test(`0xf.p-1`)).toBeFalse();
        expect(exp.test(`0x1.2p3`)).toBeFalse();
        expect(exp.test(`0x1.ap3`)).toBeFalse();
        expect(exp.test(`0x1.2ap3`)).toBeFalse();
        expect(exp.test(`-0x1.2ap3`)).toBeFalse();
        expect(exp.test(`0x1p+3`)).toBeFalse();
        expect(exp.test(`0x1p+3f`)).toBeFalse();
        expect(exp.test(`0x1p+3L`)).toBeFalse();
        expect(exp.test(`-0x1.0C6F7Ap-21`)).toBeFalse();

        // not a number
        expect(exp.test(`.`)).toBeFalse();
        expect(exp.test(`3.14e+0a`)).toBeFalse();
        expect(exp.test(`0x3.14p+0a`)).toBeFalse();
        expect(exp.test(`a`)).toBeFalse();
        expect(exp.test(`-a`)).toBeFalse();
        expect(exp.test(`05a`)).toBeFalse();
        expect(exp.test(`+x`)).toBeFalse();
        expect(exp.test(`2=`)).toBeFalse();
        expect(exp.test(`x`)).toBeFalse();
        expect(exp.test(`a7.13`)).toBeFalse();
    });

    it(`sci_float_regexp_00`, () => {
        //console.log(RegExp(`^[+-]?(?=\\d|\\.\\d)\\d*(\\.\\d*)?(e[-+]?\\d+)(f|l|fl|fll)?$`.replace(/[#].*$|\s/gm, ''), `i`));
        // regex_test.js:571 /^[+-]?(?=\d|\.\d)\d*(\.\d*)?(e[-+]?\d+)(f|l|fl|fll)?$/i
        const exp = sci_float_regexp;

        // binary
        expect(exp.test(`0b001`)).toBeFalse();
        expect(exp.test(`0b1111'1111`)).toBeFalse();
        expect(exp.test(`0b1`)).toBeFalse();
        expect(exp.test(`0B101`)).toBeFalse();
        expect(exp.test(`0b101'011`)).toBeFalse();

        // octal
        expect(exp.test(`071`)).toBeFalse();
        expect(exp.test(`-05`)).toBeFalse();
        expect(exp.test(`067`)).toBeFalse();

        // decimal integer
        expect(exp.test(`81`)).toBeFalse();
        expect(exp.test(`-81`)).toBeFalse();
        expect(exp.test(`467`)).toBeFalse();
        expect(exp.test(`1`)).toBeFalse();
        expect(exp.test(`0`)).toBeFalse();
        expect(exp.test(`1'000`)).toBeFalse();
        expect(exp.test(`-1'000`)).toBeFalse();
        expect(exp.test(`6ull`)).toBeFalse();
        expect(exp.test(`-8ll`)).toBeFalse();
        expect(exp.test(`18'446'744'073'709'550'592ll`)).toBeFalse();
        expect(exp.test(`1844'6744'0737'0955'0592uLL`)).toBeFalse();
        expect(exp.test(`184467'440737'0'95505'92LL`)).toBeFalse();
        expect(exp.test(`-184467'440737'0'95505'92LL`)).toBeFalse();

        // hexa integer
        expect(exp.test(`0x0`)).toBeFalse();
        expect(exp.test(`-0XFF`)).toBeFalse();
        expect(exp.test(`0x1`)).toBeFalse();
        expect(exp.test(`0x45`)).toBeFalse();
        expect(exp.test(`0xa`)).toBeFalse();
        expect(exp.test(`-0xa`)).toBeFalse();
        expect(exp.test(`0xAF`)).toBeFalse();
        expect(exp.test(`0xff`)).toBeFalse();
        expect(exp.test(`-0xff`)).toBeFalse();

        // decimal float fix 
        expect(exp.test(`0.`)).toBeFalse();
        expect(exp.test(`0.0`)).toBeFalse();
        expect(exp.test(`.0`)).toBeFalse();
        expect(exp.test(`-.0`)).toBeFalse();
        expect(exp.test(`1f`)).toBeFalse();
        expect(exp.test(`-1f`)).toBeFalse();
        expect(exp.test(`3.7`)).toBeFalse();
        expect(exp.test(`58.`)).toBeFalse();
        expect(exp.test(`6.`)).toBeFalse();
        expect(exp.test(`3.1415926535897932384626433832795`)).toBeFalse();
        expect(exp.test(`0.5l`)).toBeFalse();

        // decimal float exponant
        expect(exp.test(`1e46`)).toBeTrue();
        expect(exp.test(`1E7`)).toBeTrue();
        expect(exp.test(`-1E7`)).toBeTrue();
        expect(exp.test(`1E-7`)).toBeTrue();
        expect(exp.test(`1E+7`)).toBeTrue();
        expect(exp.test(`1.e+7`)).toBeTrue();
        expect(exp.test(`4e2`)).toBeTrue();
        expect(exp.test(`123.456e-67`)).toBeTrue();
        expect(exp.test(`.1E4f`)).toBeTrue();
        expect(exp.test(`-.1E4f`)).toBeTrue();
        expect(exp.test(`1e-5L`)).toBeTrue();

        // hexa float fix 
        expect(exp.test(`0x6.FF`)).toBeFalse();
        expect(exp.test(`0x6.`)).toBeFalse();
        expect(exp.test(`-0x6.`)).toBeFalse();
        expect(exp.test(`0x0.`)).toBeFalse();
        expect(exp.test(`0x3.dae`)).toBeFalse();
        expect(exp.test(`0x3.dae5`)).toBeFalse();
        expect(exp.test(`-0x3.dae5`)).toBeFalse();

        // hexa float exponant
        expect(exp.test(`0x6.FFp7`)).toBeFalse();
        expect(exp.test(`-0x6.FFp7`)).toBeFalse();
        expect(exp.test(`0x1.FFFFFEp+62`)).toBeFalse();
        expect(exp.test(`0x3.14p+0`)).toBeFalse();
        expect(exp.test(`0x1ffp10`)).toBeFalse();
        expect(exp.test(`0x0p-1`)).toBeFalse();
        expect(exp.test(`-0x0p-1`)).toBeFalse();
        expect(exp.test(`0x1.p0`)).toBeFalse();
        expect(exp.test(`0xf.p-1`)).toBeFalse();
        expect(exp.test(`0x1.2p3`)).toBeFalse();
        expect(exp.test(`0x1.ap3`)).toBeFalse();
        expect(exp.test(`0x1.2ap3`)).toBeFalse();
        expect(exp.test(`-0x1.2ap3`)).toBeFalse();
        expect(exp.test(`0x1p+3`)).toBeFalse();
        expect(exp.test(`0x1p+3f`)).toBeFalse();
        expect(exp.test(`0x1p+3L`)).toBeFalse();
        expect(exp.test(`-0x1.0C6F7Ap-21`)).toBeFalse();

        // not a number
        expect(exp.test(`.`)).toBeFalse();
        expect(exp.test(`3.14e+0a`)).toBeFalse();
        expect(exp.test(`0x3.14p+0a`)).toBeFalse();
        expect(exp.test(`a`)).toBeFalse();
        expect(exp.test(`-a`)).toBeFalse();
        expect(exp.test(`05a`)).toBeFalse();
        expect(exp.test(`+x`)).toBeFalse();
        expect(exp.test(`2=`)).toBeFalse();
        expect(exp.test(`x`)).toBeFalse();
        expect(exp.test(`a7.13`)).toBeFalse();
    });

    it(`hex_float_regexp_00`, () => {
        //console.log(RegExp(`^[+-]?(?=\\d|\\.\\d)(0x(?=[a-f\\d]|\.[a-f\\d])[a-f\\d]*\\.([a-f\\d]*)?)(f|l|fl|fll)?$`.replace(/[#].*$|\s/gm, ''), `i`));
        // regex_test.js:571 /^[+-]?(?=\d|\.\d)(0x(?=[a-f\d]|.[a-f\d])[a-f\d]*\.([a-f\d]*)?)(f|l|fl|fll)?$/i
        const exp = hex_float_regexp;

        // binary
        expect(exp.test(`0b001`)).toBeFalse();
        expect(exp.test(`0b1111'1111`)).toBeFalse();
        expect(exp.test(`0b1`)).toBeFalse();
        expect(exp.test(`0B101`)).toBeFalse();
        expect(exp.test(`0b101'011`)).toBeFalse();

        // octal
        expect(exp.test(`071`)).toBeFalse();
        expect(exp.test(`-05`)).toBeFalse();
        expect(exp.test(`067`)).toBeFalse();

        // decimal integer
        expect(exp.test(`81`)).toBeFalse();
        expect(exp.test(`-81`)).toBeFalse();
        expect(exp.test(`467`)).toBeFalse();
        expect(exp.test(`1`)).toBeFalse();
        expect(exp.test(`0`)).toBeFalse();
        expect(exp.test(`1'000`)).toBeFalse();
        expect(exp.test(`-1'000`)).toBeFalse();
        expect(exp.test(`6ull`)).toBeFalse();
        expect(exp.test(`-8ll`)).toBeFalse();
        expect(exp.test(`18'446'744'073'709'550'592ll`)).toBeFalse();
        expect(exp.test(`1844'6744'0737'0955'0592uLL`)).toBeFalse();
        expect(exp.test(`184467'440737'0'95505'92LL`)).toBeFalse();
        expect(exp.test(`-184467'440737'0'95505'92LL`)).toBeFalse();

        // hexa integer
        expect(exp.test(`0x0`)).toBeFalse();
        expect(exp.test(`-0XFF`)).toBeFalse();
        expect(exp.test(`0x1`)).toBeFalse();
        expect(exp.test(`0x45`)).toBeFalse();
        expect(exp.test(`0xa`)).toBeFalse();
        expect(exp.test(`-0xa`)).toBeFalse();
        expect(exp.test(`0xAF`)).toBeFalse();
        expect(exp.test(`0xff`)).toBeFalse();
        expect(exp.test(`-0xff`)).toBeFalse();

        // decimal float fix 
        expect(exp.test(`0.`)).toBeFalse();
        expect(exp.test(`0.0`)).toBeFalse();
        expect(exp.test(`.0`)).toBeFalse();
        expect(exp.test(`-.0`)).toBeFalse();
        expect(exp.test(`1f`)).toBeFalse();
        expect(exp.test(`-1f`)).toBeFalse();
        expect(exp.test(`3.7`)).toBeFalse();
        expect(exp.test(`58.`)).toBeFalse();
        expect(exp.test(`6.`)).toBeFalse();
        expect(exp.test(`3.1415926535897932384626433832795`)).toBeFalse();
        expect(exp.test(`0.5l`)).toBeFalse();

        // decimal float exponant
        expect(exp.test(`1e46`)).toBeFalse();
        expect(exp.test(`1E7`)).toBeFalse();
        expect(exp.test(`-1E7`)).toBeFalse();
        expect(exp.test(`1E-7`)).toBeFalse();
        expect(exp.test(`1E+7`)).toBeFalse();
        expect(exp.test(`1.e+7`)).toBeFalse();
        expect(exp.test(`4e2`)).toBeFalse();
        expect(exp.test(`123.456e-67`)).toBeFalse();
        expect(exp.test(`.1E4f`)).toBeFalse();
        expect(exp.test(`-.1E4f`)).toBeFalse();
        expect(exp.test(`1e-5L`)).toBeFalse();

        // hexa float fix 
        expect(exp.test(`0x6.FF`)).toBeTrue();
        expect(exp.test(`0x6.`)).toBeTrue();
        expect(exp.test(`-0x6.`)).toBeTrue();
        expect(exp.test(`0x0.`)).toBeTrue();
        expect(exp.test(`0x3.dae`)).toBeTrue();
        expect(exp.test(`0x3.dae5`)).toBeTrue();
        expect(exp.test(`-0x3.dae5`)).toBeTrue();

        // hexa float exponant
        expect(exp.test(`0x6.FFp7`)).toBeFalse();
        expect(exp.test(`-0x6.FFp7`)).toBeFalse();
        expect(exp.test(`0x1.FFFFFEp+62`)).toBeFalse();
        expect(exp.test(`0x3.14p+0`)).toBeFalse();
        expect(exp.test(`0x1ffp10`)).toBeFalse();
        expect(exp.test(`0x0p-1`)).toBeFalse();
        expect(exp.test(`-0x0p-1`)).toBeFalse();
        expect(exp.test(`0x1.p0`)).toBeFalse();
        expect(exp.test(`0xf.p-1`)).toBeFalse();
        expect(exp.test(`0x1.2p3`)).toBeFalse();
        expect(exp.test(`0x1.ap3`)).toBeFalse();
        expect(exp.test(`0x1.2ap3`)).toBeFalse();
        expect(exp.test(`-0x1.2ap3`)).toBeFalse();
        expect(exp.test(`0x1p+3`)).toBeFalse();
        expect(exp.test(`0x1p+3f`)).toBeFalse();
        expect(exp.test(`0x1p+3L`)).toBeFalse();
        expect(exp.test(`-0x1.0C6F7Ap-21`)).toBeFalse();

        // not a number
        expect(exp.test(`.`)).toBeFalse();
        expect(exp.test(`3.14e+0a`)).toBeFalse();
        expect(exp.test(`0x3.14p+0a`)).toBeFalse();
        expect(exp.test(`a`)).toBeFalse();
        expect(exp.test(`-a`)).toBeFalse();
        expect(exp.test(`05a`)).toBeFalse();
        expect(exp.test(`+x`)).toBeFalse();
        expect(exp.test(`2=`)).toBeFalse();
        expect(exp.test(`x`)).toBeFalse();
        expect(exp.test(`a7.13`)).toBeFalse();
    });

    it(`sci_hex_float_regexp_00`, () => {
        //console.log(RegExp(`^[-+]?0x(?=[a-f\\d]|\.[a-f\\d])[a-f\\d]*(\\.[a-f\\d]*)?(p[-+]?\\d+)(f|l|fl|fll)?$`.replace(/[#].*$|\s/gm, ''), `i`));
        // regex_test.js:783 /^[-+]?0x(?=[a-f\d]|.[a-f\d])[a-f\d]*(\.[a-f\d]*)?(p[-+]?\d+)(f|l|fl|fll)?$/i
        const exp = sci_hex_float_regexp;

        // binary
        expect(exp.test(`0b001`)).toBeFalse();
        expect(exp.test(`0b1111'1111`)).toBeFalse();
        expect(exp.test(`0b1`)).toBeFalse();
        expect(exp.test(`0B101`)).toBeFalse();
        expect(exp.test(`0b101'011`)).toBeFalse();

        // octal
        expect(exp.test(`071`)).toBeFalse();
        expect(exp.test(`-05`)).toBeFalse();
        expect(exp.test(`067`)).toBeFalse();

        // decimal integer
        expect(exp.test(`81`)).toBeFalse();
        expect(exp.test(`-81`)).toBeFalse();
        expect(exp.test(`467`)).toBeFalse();
        expect(exp.test(`1`)).toBeFalse();
        expect(exp.test(`0`)).toBeFalse();
        expect(exp.test(`1'000`)).toBeFalse();
        expect(exp.test(`-1'000`)).toBeFalse();
        expect(exp.test(`6ull`)).toBeFalse();
        expect(exp.test(`-8ll`)).toBeFalse();
        expect(exp.test(`18'446'744'073'709'550'592ll`)).toBeFalse();
        expect(exp.test(`1844'6744'0737'0955'0592uLL`)).toBeFalse();
        expect(exp.test(`184467'440737'0'95505'92LL`)).toBeFalse();
        expect(exp.test(`-184467'440737'0'95505'92LL`)).toBeFalse();

        // hexa integer
        expect(exp.test(`0x0`)).toBeFalse();
        expect(exp.test(`-0XFF`)).toBeFalse();
        expect(exp.test(`0x1`)).toBeFalse();
        expect(exp.test(`0x45`)).toBeFalse();
        expect(exp.test(`0xa`)).toBeFalse();
        expect(exp.test(`-0xa`)).toBeFalse();
        expect(exp.test(`0xAF`)).toBeFalse();
        expect(exp.test(`0xff`)).toBeFalse();
        expect(exp.test(`-0xff`)).toBeFalse();

        // decimal float fix 
        expect(exp.test(`0.`)).toBeFalse();
        expect(exp.test(`0.0`)).toBeFalse();
        expect(exp.test(`.0`)).toBeFalse();
        expect(exp.test(`-.0`)).toBeFalse();
        expect(exp.test(`1f`)).toBeFalse();
        expect(exp.test(`-1f`)).toBeFalse();
        expect(exp.test(`3.7`)).toBeFalse();
        expect(exp.test(`58.`)).toBeFalse();
        expect(exp.test(`6.`)).toBeFalse();
        expect(exp.test(`3.1415926535897932384626433832795`)).toBeFalse();
        expect(exp.test(`0.5l`)).toBeFalse();

        // decimal float exponant
        expect(exp.test(`1e46`)).toBeFalse();
        expect(exp.test(`1E7`)).toBeFalse();
        expect(exp.test(`-1E7`)).toBeFalse();
        expect(exp.test(`1E-7`)).toBeFalse();
        expect(exp.test(`1E+7`)).toBeFalse();
        expect(exp.test(`1.e+7`)).toBeFalse();
        expect(exp.test(`4e2`)).toBeFalse();
        expect(exp.test(`123.456e-67`)).toBeFalse();
        expect(exp.test(`.1E4f`)).toBeFalse();
        expect(exp.test(`-.1E4f`)).toBeFalse();
        expect(exp.test(`1e-5L`)).toBeFalse();

        // hexa float fix 
        expect(exp.test(`0x6.FF`)).toBeFalse();
        expect(exp.test(`0x6.`)).toBeFalse();
        expect(exp.test(`-0x6.`)).toBeFalse();
        expect(exp.test(`0x0.`)).toBeFalse();
        expect(exp.test(`0x3.dae`)).toBeFalse();
        expect(exp.test(`0x3.dae5`)).toBeFalse();
        expect(exp.test(`-0x3.dae5`)).toBeFalse();

        // hexa float exponant
        expect(exp.test(`0x6.FFp7`)).toBeTrue();
        expect(exp.test(`-0x6.FFp7`)).toBeTrue();
        expect(exp.test(`0x1.FFFFFEp+62`)).toBeTrue();
        expect(exp.test(`0x3.14p+0`)).toBeTrue();
        expect(exp.test(`0x1ffp10`)).toBeTrue();
        expect(exp.test(`0x0p-1`)).toBeTrue();
        expect(exp.test(`-0x0p-1`)).toBeTrue();
        expect(exp.test(`0x1.p0`)).toBeTrue();
        expect(exp.test(`0xf.p-1`)).toBeTrue();
        expect(exp.test(`0x1.2p3`)).toBeTrue();
        expect(exp.test(`0x1.ap3`)).toBeTrue();
        expect(exp.test(`0x1.2ap3`)).toBeTrue();
        expect(exp.test(`-0x1.2ap3`)).toBeTrue();
        expect(exp.test(`0x1p+3`)).toBeTrue();
        expect(exp.test(`0x1p+3f`)).toBeTrue();
        expect(exp.test(`0x1p+3L`)).toBeTrue();
        expect(exp.test(`-0x1.0C6F7Ap-21`)).toBeTrue();

        // not a number
        expect(exp.test(`.`)).toBeFalse();
        expect(exp.test(`3.14e+0a`)).toBeFalse();
        expect(exp.test(`0x3.14p+0a`)).toBeFalse();
        expect(exp.test(`a`)).toBeFalse();
        expect(exp.test(`-a`)).toBeFalse();
        expect(exp.test(`05a`)).toBeFalse();
        expect(exp.test(`+x`)).toBeFalse();
        expect(exp.test(`2=`)).toBeFalse();
        expect(exp.test(`x`)).toBeFalse();
        expect(exp.test(`a7.13`)).toBeFalse();
    });

    xit(`any_float_regexp_00`, () => {
        console.log(RegExp(`
        ^
            [-+]?
            (
                0x(?=[a-f\\d]|\.[a-f\\d])|
                (?=[a-f\\d]|\.[a-f\\d])
            )
            [a-f\\d]*(\\.[a-f\\d]*)?
            (
                [pe]
                [-+]?
                \\d+
            )?
            (f|l|fl|fll)?
        $
        `.replace(/[#].*$|\s/gm, ''), `i`));
        // regex_test.js:889 /^[-+]?(0x(?=[a-f\d]|.[a-f\d])|(?=[a-f\d]|.[a-f\d]))[a-f\d]*(\.[a-f\d]*)?([pe][-+]?\d+)?(f|l|fl|fll)?$/i
        const exp = /^[-+]?(0x(?=[a-f\d]|.[a-f\d]))?[a-f\d]*(\.[a-f\d]*)?(p[-+]?\d+)(f|l|fl|fll)?$/i;

        // binary
        expect(exp.test(`0b001`)).toBeFalse();
        expect(exp.test(`0b1111'1111`)).toBeFalse();
        expect(exp.test(`0b1`)).toBeFalse();
        expect(exp.test(`0B101`)).toBeFalse();
        expect(exp.test(`0b101'011`)).toBeFalse();

        // octal
        expect(exp.test(`071`)).toBeFalse();
        expect(exp.test(`-05`)).toBeFalse();
        expect(exp.test(`067`)).toBeFalse();

        // decimal integer
        expect(exp.test(`81`)).toBeFalse();
        expect(exp.test(`-81`)).toBeFalse();
        expect(exp.test(`467`)).toBeFalse();
        expect(exp.test(`1`)).toBeFalse();
        expect(exp.test(`0`)).toBeFalse();
        expect(exp.test(`1'000`)).toBeFalse();
        expect(exp.test(`-1'000`)).toBeFalse();
        expect(exp.test(`6ull`)).toBeFalse();
        expect(exp.test(`-8ll`)).toBeFalse();
        expect(exp.test(`18'446'744'073'709'550'592ll`)).toBeFalse();
        expect(exp.test(`1844'6744'0737'0955'0592uLL`)).toBeFalse();
        expect(exp.test(`184467'440737'0'95505'92LL`)).toBeFalse();
        expect(exp.test(`-184467'440737'0'95505'92LL`)).toBeFalse();

        // hexa integer
        expect(exp.test(`0x0`)).toBeFalse();
        expect(exp.test(`-0XFF`)).toBeFalse();
        expect(exp.test(`0x1`)).toBeFalse();
        expect(exp.test(`0x45`)).toBeFalse();
        expect(exp.test(`0xa`)).toBeFalse();
        expect(exp.test(`-0xa`)).toBeFalse();
        expect(exp.test(`0xAF`)).toBeFalse();
        expect(exp.test(`0xff`)).toBeFalse();
        expect(exp.test(`-0xff`)).toBeFalse();

        // decimal float fix 
        expect(exp.test(`0.`)).toBeTrue();
        expect(exp.test(`0.0`)).toBeTrue();
        expect(exp.test(`.0`)).toBeTrue();
        expect(exp.test(`-.0`)).toBeTrue();
        expect(exp.test(`1f`)).toBeTrue();
        expect(exp.test(`-1f`)).toBeTrue();
        expect(exp.test(`3.7`)).toBeTrue();
        expect(exp.test(`58.`)).toBeTrue();
        expect(exp.test(`6.`)).toBeTrue();

        // decimal float exponant
        expect(exp.test(`1e46`)).toBeTrue();
        expect(exp.test(`1E7`)).toBeTrue();
        expect(exp.test(`-1E7`)).toBeTrue();
        expect(exp.test(`1E-7`)).toBeTrue();
        expect(exp.test(`1E+7`)).toBeTrue();
        expect(exp.test(`1.e+7`)).toBeTrue();
        expect(exp.test(`4e2`)).toBeTrue();
        expect(exp.test(`123.456e-67`)).toBeTrue();
        expect(exp.test(`.1E4f`)).toBeTrue();
        expect(exp.test(`-.1E4f`)).toBeTrue();
        expect(exp.test(`1e-5L`)).toBeTrue();

        // hexa float fix 
        expect(exp.test(`0x6.FF`)).toBeTrue();
        expect(exp.test(`0x6.`)).toBeTrue();
        expect(exp.test(`-0x6.`)).toBeTrue();
        expect(exp.test(`0x0.`)).toBeTrue();
        expect(exp.test(`0x3.dae`)).toBeTrue();
        expect(exp.test(`0x3.dae5`)).toBeTrue();
        expect(exp.test(`-0x3.dae5`)).toBeTrue();

        // hexa float exponant
        expect(exp.test(`0x6.FFp7`)).toBeTrue();
        expect(exp.test(`-0x6.FFp7`)).toBeTrue();
        expect(exp.test(`0x1.FFFFFEp+62`)).toBeTrue();
        expect(exp.test(`0x3.14p+0`)).toBeTrue();
        expect(exp.test(`0x1ffp10`)).toBeTrue();
        expect(exp.test(`0x0p-1`)).toBeTrue();
        expect(exp.test(`-0x0p-1`)).toBeTrue();
        expect(exp.test(`0x1.p0`)).toBeTrue();
        expect(exp.test(`0xf.p-1`)).toBeTrue();
        expect(exp.test(`0x1.2p3`)).toBeTrue();
        expect(exp.test(`0x1.ap3`)).toBeTrue();
        expect(exp.test(`0x1.2ap3`)).toBeTrue();
        expect(exp.test(`-0x1.2ap3`)).toBeTrue();
        expect(exp.test(`0x1p+3`)).toBeTrue();
        expect(exp.test(`0x1p+3f`)).toBeTrue();
        expect(exp.test(`0x1p+3L`)).toBeTrue();

        // not a number
        expect(exp.test(`.`)).toBeFalse();
        expect(exp.test(`3.14e+0a`)).toBeFalse();
        expect(exp.test(`0x3.14p+0a`)).toBeFalse();
        expect(exp.test(`a`)).toBeFalse();
        expect(exp.test(`-a`)).toBeFalse();
        expect(exp.test(`05a`)).toBeFalse();
        expect(exp.test(`+x`)).toBeFalse();
        expect(exp.test(`2=`)).toBeFalse();
        expect(exp.test(`x`)).toBeFalse();
        expect(exp.test(`a7.13`)).toBeFalse();
    });

    xit(`any_hexadecimal_regexp_00`, () => {
        // ^[-+]?(0x(?=[a-f\d]|\.[a-f\d])([a-f\d]*(\.[a-f\d]*)?(p[-+]?\d+)?|[a-f\d]+))$

        expect(any_hexadecimal_regexp.test(`0x9.99`)).toBeTrue();
        expect(any_hexadecimal_regexp.test(`0x1.921fb54442d18p+1`)).toBeTrue();
        expect(any_hexadecimal_regexp.test(`0x0`)).toBeTrue();
        expect(any_hexadecimal_regexp.test(`0x1`)).toBeTrue();
        expect(any_hexadecimal_regexp.test(`0x45`)).toBeTrue();
        expect(any_hexadecimal_regexp.test(`0xa`)).toBeTrue();
        expect(any_hexadecimal_regexp.test(`0xAF`)).toBeTrue();
        expect(any_hexadecimal_regexp.test(`0xAFp6`)).toBeTrue();


        expect(any_hexadecimal_regexp.test(`0x3.14p+0a`)).toBeFalse();
        expect(any_hexadecimal_regexp.test(`.`)).toBeFalse();
        expect(any_hexadecimal_regexp.test(`0.`)).toBeFalse();
        expect(any_hexadecimal_regexp.test(`0.0`)).toBeFalse();
        expect(any_hexadecimal_regexp.test(`1e46`)).toBeFalse();
        expect(any_hexadecimal_regexp.test(`.0`)).toBeFalse();

    });

    // Test suite for percent_regex
    describe('percent_regex', () => {
        it('should match positive percentage numbers without decimal points', () => {
            expect(percent_regex.test('50%')).toBe(true);
            expect(percent_regex.test('100%')).toBe(true);
        });

        it('should match positive percentage numbers with decimal points', () => {
            expect(percent_regex.test('50.5%')).toBe(true);
            expect(percent_regex.test('99.99%')).toBe(true);
        });

        it('should match negative percentage numbers without decimal points', () => {
            expect(percent_regex.test('-50%')).toBe(true);
            expect(percent_regex.test('-100%')).toBe(true);
        });

        it('should match negative percentage numbers with decimal points', () => {
            expect(percent_regex.test('-50.5%')).toBe(true);
            expect(percent_regex.test('-99.99%')).toBe(true);
        });

        it('should not match strings without a percent symbol', () => {
            expect(percent_regex.test('50')).toBe(false);
            expect(percent_regex.test('50.5')).toBe(false);
            expect(percent_regex.test('-50')).toBe(false);
            expect(percent_regex.test('-50.5')).toBe(false);
        });

        it('should not match strings with percent symbol in invalid positions', () => {
            expect(percent_regex.test('50.%')).toBe(false);
            expect(percent_regex.test('.5%')).toBe(false);
            expect(percent_regex.test('50.%')).toBe(false);
            expect(percent_regex.test('50.%')).toBe(false);
        });

        it('should not match strings with multiple percent symbols', () => {
            expect(percent_regex.test('50%%')).toBe(false);
            expect(percent_regex.test('50.5%%')).toBe(false);
            expect(percent_regex.test('-50%%')).toBe(false);
            expect(percent_regex.test('-50.5%%')).toBe(false);
        });
    });

    it('infinity_regexp_00', () => {
        //console.log(RegExp(`^[+-]?infinity|inf(?!i)`.replace(/[#].*$|\s/gm, ''), `i`));
        const exp = infinity_regexp;

        expect(exp.test(`infinity`)).toBeTrue();
        expect(exp.test(`inf`)).toBeTrue();
        //expect(exp.test(`info`)).toBeTrue(); 

        expect(exp.test(`infi`)).toBeFalse();
    });


    describe('numb_exp regular expression', () => {

        it('should match integers', () => {
            expect(numb_exp.test('0')).toBe(true);
            expect(numb_exp.test('123')).toBe(true);
            expect(numb_exp.test('-456')).toBe(true);
        });

        it('should match floating-point numbers', () => {
            expect(numb_exp.test('0.0')).toBe(true);
            expect(numb_exp.test('3.14')).toBe(true);
            expect(numb_exp.test('-2.718')).toBe(true);
        });

        it('should match numbers with leading or trailing decimal point', () => {
            expect(numb_exp.test('.5')).toBe(true);
            expect(numb_exp.test('-.8')).toBe(true);
        });

        it('should match positive and negative infinity', () => {
            expect(numb_exp.test('Infinity')).toBe(true);
            expect(numb_exp.test('-Infinity')).toBe(true);
            expect(numb_exp.test('inf')).toBe(true);
            expect(numb_exp.test('-inf')).toBe(true);
        });

        it('should match NaN (Not a Number)', () => {
            expect(numb_exp.test('NaN')).toBe(true);
            expect(numb_exp.test('nan')).toBe(true);
        });

        it('should not match non-numeric strings', () => {
            expect(numb_exp.test('abc')).toBe(false);
            expect(numb_exp.test('')).toBe(false);
            expect(numb_exp.test('true')).toBe(false);
            expect(numb_exp.test('false')).toBe(false);
        });
    });

    describe('uri_sep_exp regular expression', () => {

        it(`should match forward slashes`, () => {
            expect(uri_sep_exp.test(`/`)).toBe(true);
            uri_sep_exp.lastIndex = 0;

            expect(uri_sep_exp.test(`/path`)).toBe(true);
            uri_sep_exp.lastIndex = 0;

            expect(uri_sep_exp.test(`/path/to`)).toBe(true);
            uri_sep_exp.lastIndex = 0;

            expect(uri_sep_exp.test(`/path/to/file`)).toBe(true);
            uri_sep_exp.lastIndex = 0;
        });

        it(`should match backslashes`, () => {
            expect(uri_sep_exp.test(`\\`)).toBe(true);
            uri_sep_exp.lastIndex = 0;

            expect(uri_sep_exp.test(`\\path`)).toBe(true);
            uri_sep_exp.lastIndex = 0;

            expect(uri_sep_exp.test(`\\path\\to`)).toBe(true);
            uri_sep_exp.lastIndex = 0;

            expect(uri_sep_exp.test(`\\path\\to\\file`)).toBe(true);
            uri_sep_exp.lastIndex = 0;
        });
    });


    describe(`char_alphnumb_char regular expression`, () => {

        it(`should match lowercase letters`, () => {
            expect(char_alphnumb_char.test(`a`)).toBe(true);
            expect(char_alphnumb_char.test(`b`)).toBe(true);
            expect(char_alphnumb_char.test(`z`)).toBe(true);
        });

        it(`should match uppercase letters`, () => {
            expect(char_alphnumb_char.test(`A`)).toBe(true);
            expect(char_alphnumb_char.test(`B`)).toBe(true);
            expect(char_alphnumb_char.test(`Z`)).toBe(true);
        });

        it(`should match digits`, () => {
            expect(char_alphnumb_char.test(`0`)).toBe(true);
            expect(char_alphnumb_char.test(`5`)).toBe(true);
            expect(char_alphnumb_char.test(`9`)).toBe(true);
        });

        it(`should not match non-alphanumeric characters`, () => {
            expect(char_alphnumb_char.test(`@`)).toBe(false);
            expect(char_alphnumb_char.test(`#`)).toBe(false);
            expect(char_alphnumb_char.test(`$`)).toBe(false);
            expect(char_alphnumb_char.test(`_`)).toBe(false);
            expect(char_alphnumb_char.test(` `)).toBe(false);
        });

        it(`should not match special characters`, () => {
            expect(char_alphnumb_char.test(`!`)).toBe(false);
            expect(char_alphnumb_char.test(`%`)).toBe(false);
            expect(char_alphnumb_char.test(`&`)).toBe(false);
            expect(char_alphnumb_char.test(`*`)).toBe(false);
            expect(char_alphnumb_char.test(`^`)).toBe(false);
        });
    });

    describe(`char_printable_char regular expression`, () => {

        it(`should match printable characters`, () => {
            expect(char_printable_char.test(`a`)).toBe(true);
            expect(char_printable_char.test(`A`)).toBe(true);
            expect(char_printable_char.test(`1`)).toBe(true);
            expect(char_printable_char.test(`!`)).toBe(true);
            expect(char_printable_char.test(`+`)).toBe(true);
            expect(char_printable_char.test(` `)).toBe(true);
            expect(char_printable_char.test(`😊`)).toBe(true); // Unicode emoji
        });

        it(`should not match control characters`, () => {
            expect(char_printable_char.test(`\u0000`)).toBe(false); // Null character
            expect(char_printable_char.test(`\u0007`)).toBe(false); // Bell character
            expect(char_printable_char.test(`\u001B`)).toBe(false); // Escape character
        });

        it(`should not match noncharacters`, () => {
            expect(char_printable_char.test(`\uFFFE`)).toBe(false); // Noncharacter
            expect(char_printable_char.test(`\uFFFF`)).toBe(false); // Noncharacter
        });

        it(`should not match surrogate code points`, () => {
            expect(char_printable_char.test(`\uD800`)).toBe(false); // High surrogate
            expect(char_printable_char.test(`\uDC00`)).toBe(false); // Low surrogate
        });

        it(`should match printable ASCII characters`, () => {
            for (let i = 32; i <= 126; i++) {
                const char = String.fromCharCode(i);
                expect(char_printable_char.test(char)).toBe(true);
            }
        });

    });


    describe(`char_visible_char regular expression`, () => {

        it(`should match visible characters`, () => {
            expect(char_visible_char.test(`a`)).toBe(true);
            expect(char_visible_char.test(`A`)).toBe(true);
            expect(char_visible_char.test(`1`)).toBe(true);
            expect(char_visible_char.test(`!`)).toBe(true);
            expect(char_visible_char.test(`+`)).toBe(true);
            expect(char_visible_char.test(` `)).toBe(true);
            expect(char_visible_char.test(`😊`)).toBe(true); // Unicode emoji
        });

        it(`should not match control characters`, () => {
            expect(char_visible_char.test(`\u0000`)).toBe(false); // Null character
            expect(char_visible_char.test(`\u0007`)).toBe(false); // Bell character
            expect(char_visible_char.test(`\u001B`)).toBe(false); // Escape character
        });

        it(`should not match noncharacters`, () => {
            expect(char_visible_char.test(`\uFFFE`)).toBe(false); // Noncharacter
            expect(char_visible_char.test(`\uFFFF`)).toBe(false); // Noncharacter
        });

        it(`should not match surrogate code points`, () => {
            expect(char_visible_char.test(`\uD800`)).toBe(false); // High surrogate
            expect(char_visible_char.test(`\uDC00`)).toBe(false); // Low surrogate
        });

        it(`should match printable ASCII characters`, () => {
            for (let i = 32; i <= 126; i++) {
                const char = String.fromCharCode(i);
                expect(char_visible_char.test(char)).toBe(true);
            }
        });

    });

    describe(`char_json_char regular expression`, () => {
        const char_json_char = /^[\uFDD0-\uFDD8]$/u;

        it(`should match JSON characters`, () => {
            expect(char_json_char.test(`\uFDD0`)).toBe(true);
            expect(char_json_char.test(`\uFDD1`)).toBe(true);
            expect(char_json_char.test(`\uFDD2`)).toBe(true);
            expect(char_json_char.test(`\uFDD3`)).toBe(true);
            expect(char_json_char.test(`\uFDD4`)).toBe(true);
            expect(char_json_char.test(`\uFDD5`)).toBe(true);
            expect(char_json_char.test(`\uFDD6`)).toBe(true);
            expect(char_json_char.test(`\uFDD7`)).toBe(true);
            expect(char_json_char.test(`\uFDD8`)).toBe(true);
        });

        it(`should not match non-JSON characters`, () => {
            expect(char_json_char.test(`\uFDD9`)).toBe(false);
            expect(char_json_char.test(`\uFDDA`)).toBe(false);
            expect(char_json_char.test(`\uFDDF`)).toBe(false);
            expect(char_json_char.test(`a`)).toBe(false);
            expect(char_json_char.test(`1`)).toBe(false);
            expect(char_json_char.test(`+`)).toBe(false);
            expect(char_json_char.test(` `)).toBe(false);
            expect(char_json_char.test(`\n`)).toBe(false);
            expect(char_json_char.test(`\t`)).toBe(false);
            expect(char_json_char.test(`\uFFFF`)).toBe(false);
        });

        it(`should not match characters outside the range`, () => {
            expect(char_json_char.test(`\uFDC9`)).toBe(false); // Below range
            expect(char_json_char.test(`\uFDE0`)).toBe(false); // Above range
        });
    });


    describe(`char_number_char regular expression`, () => {
        it(`should match number characters`, () => {
            expect(char_number_char.test(`0`)).toBe(true);
            expect(char_number_char.test(`5`)).toBe(true);
            expect(char_number_char.test(`9`)).toBe(true);
            expect(char_number_char.test(`٠`)).toBe(true); // Arabic-Indic digit 0
            expect(char_number_char.test(`٩`)).toBe(true); // Arabic-Indic digit 9
            expect(char_number_char.test(`۰`)).toBe(true); // Extended Arabic-Indic digit 0
            expect(char_number_char.test(`۹`)).toBe(true); // Extended Arabic-Indic digit 9
            expect(char_number_char.test(`০`)).toBe(true); // Bengali digit 0
            expect(char_number_char.test(`৯`)).toBe(true); // Bengali digit 9
            // Add more test cases for other number characters if necessary
        });

        it(`should not match non-number characters`, () => {
            expect(char_number_char.test(`a`)).toBe(false);
            expect(char_number_char.test(`+`)).toBe(false);
            expect(char_number_char.test(` `)).toBe(false);
            expect(char_number_char.test(`\n`)).toBe(false);
            expect(char_number_char.test(`\t`)).toBe(false);
            expect(char_number_char.test(`١٢٣`)).toBe(false); // Arabic-Indic digits sequence
            expect(char_number_char.test(`१२३`)).toBe(false); // Devanagari digits sequence
            // Add more test cases for non-number characters if necessary
        });

        it(`should match number characters across different scripts`, () => {
            // Testing a variety of number characters from different scripts
            const numberChars = `0123456789٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹०१२३४५६७८९০১২৩৪৫৬৭৮৯`;
            for (let char of numberChars) {
                expect(char_number_char.test(char)).toBe(true);
            }
        });

        it(`should not match characters outside the number character range`, () => {
            expect(char_number_char.test(`a`)).toBe(false);
            expect(char_number_char.test(`A`)).toBe(false);
            expect(char_number_char.test(`+`)).toBe(false);
            expect(char_number_char.test(` `)).toBe(false);
            expect(char_number_char.test(`\n`)).toBe(false);
            expect(char_number_char.test(`\t`)).toBe(false);
        });
    });

    describe(`char_symbol_char regular expression`, () => {

        it(`should match single symbol characters`, () => {
            expect(char_symbol_char.test(`!`)).toBe(true);
            expect(char_symbol_char.test(`"`)).toBe(true);
            expect(char_symbol_char.test(`#`)).toBe(true);
            expect(char_symbol_char.test(`$`)).toBe(true);
            expect(char_symbol_char.test(`%`)).toBe(true);
            expect(char_symbol_char.test(`&`)).toBe(true);
            expect(char_symbol_char.test(`'`)).toBe(true);
            expect(char_symbol_char.test(`(`)).toBe(true);
            expect(char_symbol_char.test(`)`)).toBe(true);
            expect(char_symbol_char.test(`*`)).toBe(true);
            expect(char_symbol_char.test(`+`)).toBe(true);
            expect(char_symbol_char.test(`,`)).toBe(true);
            expect(char_symbol_char.test(`-`)).toBe(true);
            expect(char_symbol_char.test(`.`)).toBe(true);
            expect(char_symbol_char.test(`/`)).toBe(true);
            expect(char_symbol_char.test(`:`)).toBe(true);
            expect(char_symbol_char.test(`;`)).toBe(true);
            expect(char_symbol_char.test(`<`)).toBe(true);
            expect(char_symbol_char.test(`=`)).toBe(true);
            expect(char_symbol_char.test(`>`)).toBe(true);
            expect(char_symbol_char.test(`?`)).toBe(true);
            expect(char_symbol_char.test(`@`)).toBe(true);
            expect(char_symbol_char.test(`[`)).toBe(true);
            expect(char_symbol_char.test(`\\`)).toBe(true);
            expect(char_symbol_char.test(`]`)).toBe(true);
            expect(char_symbol_char.test(`^`)).toBe(true);
            expect(char_symbol_char.test(`_`)).toBe(true);
            expect(char_symbol_char.test(`\``)).toBe(true);
            expect(char_symbol_char.test(`{`)).toBe(true);
            expect(char_symbol_char.test(`|`)).toBe(true);
            expect(char_symbol_char.test(`}`)).toBe(true);
            expect(char_symbol_char.test(`~`)).toBe(true);
        });

        it(`should not match non-symbol characters`, () => {
            expect(char_symbol_char.test(`a`)).toBe(false);
            expect(char_symbol_char.test(`A`)).toBe(false);
            expect(char_symbol_char.test(`0`)).toBe(false);
            expect(char_symbol_char.test(`\n`)).toBe(false);
            expect(char_symbol_char.test(`\t`)).toBe(false);
            expect(char_symbol_char.test(` `)).toBe(false);
        });

        it(`should match only a single character`, () => {
            expect(char_symbol_char.test(`!!`)).toBe(false);
            expect(char_symbol_char.test(`$$$`)).toBe(false);
            expect(char_symbol_char.test(`&&&`)).toBe(false);
            expect(char_symbol_char.test(`***`)).toBe(false);
            expect(char_symbol_char.test(`---`)).toBe(false);
            expect(char_symbol_char.test(`///`)).toBe(false);
            expect(char_symbol_char.test(`:::`)).toBe(false);
            expect(char_symbol_char.test(`;;;`)).toBe(false);
            expect(char_symbol_char.test(`<<<`)).toBe(false);
            expect(char_symbol_char.test(`===`)).toBe(false);
            expect(char_symbol_char.test(`???`)).toBe(false);
            expect(char_symbol_char.test(`@@@`)).toBe(false);
            expect(char_symbol_char.test(`[[[`)).toBe(false);
            expect(char_symbol_char.test(`\\\\`)).toBe(false);
            expect(char_symbol_char.test(`]]]`)).toBe(false);
            expect(char_symbol_char.test(`^^^`)).toBe(false);
            expect(char_symbol_char.test(`___`)).toBe(false);
            expect(char_symbol_char.test(`\`\`\``)).toBe(false);
            expect(char_symbol_char.test(`{{{`)).toBe(false);
            expect(char_symbol_char.test(`|||`)).toBe(false);
            expect(char_symbol_char.test(`}}}`)).toBe(false);
            expect(char_symbol_char.test(`~~~`)).toBe(false);
        });
    });


    describe(`delimiter_char regular expression`, () => {

        it(`should match single delimiter characters`, () => {
            expect(delimiter_char.test(`(`)).toBe(true);
            expect(delimiter_char.test(`)`)).toBe(true);
            expect(delimiter_char.test(`{`)).toBe(true);
            expect(delimiter_char.test(`}`)).toBe(true);
            expect(delimiter_char.test(`[`)).toBe(true);
            expect(delimiter_char.test(`]`)).toBe(true);
            expect(delimiter_char.test(`<`)).toBe(true);
            expect(delimiter_char.test(`>`)).toBe(true);
        });

        it(`should not match non-delimiter characters`, () => {
            expect(delimiter_char.test(`a`)).toBe(false);
            expect(delimiter_char.test(`A`)).toBe(false);
            expect(delimiter_char.test(`0`)).toBe(false);
            expect(delimiter_char.test(`+`)).toBe(false);
            expect(delimiter_char.test(`-`)).toBe(false);
            expect(delimiter_char.test(`/`)).toBe(false);
            expect(delimiter_char.test(`*`)).toBe(false);
            expect(delimiter_char.test(`=`)).toBe(false);
            expect(delimiter_char.test(`_`)).toBe(false);
            expect(delimiter_char.test(`@`)).toBe(false);
            expect(delimiter_char.test(`#`)).toBe(false);
            expect(delimiter_char.test(`$`)).toBe(false);
            expect(delimiter_char.test(`%`)).toBe(false);
            expect(delimiter_char.test(`^`)).toBe(false);
            expect(delimiter_char.test(`&`)).toBe(false);
            expect(delimiter_char.test(`|`)).toBe(false);
            expect(delimiter_char.test(`\\`)).toBe(false);
            expect(delimiter_char.test(`!`)).toBe(false);
            expect(delimiter_char.test(`~`)).toBe(false);
            expect(delimiter_char.test(`\``)).toBe(false);
            expect(delimiter_char.test(`"`)).toBe(false);
            expect(delimiter_char.test(`'`)).toBe(false);
            expect(delimiter_char.test(`;`)).toBe(false);
            expect(delimiter_char.test(`:`)).toBe(false);
            expect(delimiter_char.test(`.`)).toBe(false);
            expect(delimiter_char.test(`,`)).toBe(false);
            expect(delimiter_char.test(`?`)).toBe(false);
            expect(delimiter_char.test(`\n`)).toBe(false);
            expect(delimiter_char.test(`\t`)).toBe(false);
            expect(delimiter_char.test(` `)).toBe(false);
        });

        it(`should match only a single character`, () => {
            expect(delimiter_char.test(`()`)).toBe(false);
            expect(delimiter_char.test(`{}`)).toBe(false);
            expect(delimiter_char.test(`[]`)).toBe(false);
            expect(delimiter_char.test(`<>`)).toBe(false);
        });
    });

    xdescribe(`b64_format_exp regular expression`, () => {
        const b64_format_exp = /^(?:[a-z0-9+/]{4})*(?:[a-z0-9+/]{2,3})?/i;

        it(`should match valid Base64 format`, () => {
            expect(b64_format_exp.test(`dGhpcyBpcyBhIHN0cmluZw==`)).toBe(true); // "this is a string"
            expect(b64_format_exp.test(`VGhpcyBpcyBhIHN0cmluZw==`)).toBe(true); // "This is a string"
            expect(b64_format_exp.test(`TWFu`)).toBe(true); // "Man"
            expect(b64_format_exp.test(`cGxlYXN1cmUu`)).toBe(true); // "pleasure."
            expect(b64_format_exp.test(`cGxlYXN1cmUu\n`)).toBe(true); // "pleasure." with newline character
        });

        it(`should not match invalid Base64 format`, () => {
            // Random strings
            expect(b64_format_exp.test(`random_string`)).toBe(false);
            expect(b64_format_exp.test(`123456`)).toBe(false);
            expect(b64_format_exp.test(`!@#$%^`)).toBe(false);
            // Truncated Base64 strings
            expect(b64_format_exp.test(`TWF`)).toBe(false); // "Ma"
            expect(b64_format_exp.test(`cGxl`)).toBe(false); // "ple"
            expect(b64_format_exp.test(`cGxlYXN1cmU`)).toBe(false); // "pleasure"
        });

        it(`should match only a valid Base64 format`, () => {
            expect(b64_format_exp.test(`TWFuVGhpcyBpcyBhIHN0cmluZw`)).toBe(true); // "ManThis is a string"
            expect(b64_format_exp.test(`TWFuVGhpcyBpcyBhIHN0cmluZ`)).toBe(true); // "ManThis is a strin"
            expect(b64_format_exp.test(`TWFuVGhpcyBpcyBhIHN0cmlu`)).toBe(true); // "ManThis is a stri"
        });
    });






    xit(`error_00`, async () => { expect(true).toBeFalse(); });
    /*
    
        const exp = x;
    
        // binary
        expect(exp.test(`0b001`)).toBeFalse();
        expect(exp.test(`0b1111'1111`)).toBeFalse();
        expect(exp.test(`0b1`)).toBeFalse();
        expect(exp.test(`0B101`)).toBeFalse();
        expect(exp.test(`0b101'011`)).toBeFalse();

        // octal
        expect(exp.test(`071`)).toBeFalse();
        expect(exp.test(`-05`)).toBeFalse();
        expect(exp.test(`067`)).toBeFalse();

        // decimal integer
        expect(exp.test(`81`)).toBeFalse();
        expect(exp.test(`-81`)).toBeFalse();
        expect(exp.test(`467`)).toBeFalse();
        expect(exp.test(`1`)).toBeFalse();
        expect(exp.test(`0`)).toBeFalse();
        expect(exp.test(`1'000`)).toBeFalse();
        expect(exp.test(`-1'000`)).toBeFalse();
        expect(exp.test(`6ull`)).toBeFalse();
        expect(exp.test(`-8ll`)).toBeFalse();
        expect(exp.test(`18'446'744'073'709'550'592ll`)).toBeFalse();
        expect(exp.test(`1844'6744'0737'0955'0592uLL`)).toBeFalse();
        expect(exp.test(`184467'440737'0'95505'92LL`)).toBeFalse();
        expect(exp.test(`-184467'440737'0'95505'92LL`)).toBeFalse();

        // hexa integer
        expect(exp.test(`0x0`)).toBeFalse();
        expect(exp.test(`-0XFF`)).toBeFalse();
        expect(exp.test(`0x1`)).toBeFalse();
        expect(exp.test(`0x45`)).toBeFalse();
        expect(exp.test(`0xa`)).toBeFalse();
        expect(exp.test(`-0xa`)).toBeFalse();
        expect(exp.test(`0xAF`)).toBeFalse();
        expect(exp.test(`0xff`)).toBeFalse();
        expect(exp.test(`-0xff`)).toBeFalse();

        // decimal float fix 
        expect(exp.test(`0.`)).toBeFalse();
        expect(exp.test(`0.0`)).toBeFalse();
        expect(exp.test(`.0`)).toBeFalse();
        expect(exp.test(`-.0`)).toBeFalse();
        expect(exp.test(`1f`)).toBeFalse();
        expect(exp.test(`-1f`)).toBeFalse();
        expect(exp.test(`3.7`)).toBeFalse();
        expect(exp.test(`58.`)).toBeFalse();
        expect(exp.test(`6.`)).toBeFalse();
        expect(exp.test(`3.1415926535897932384626433832795`)).toBeFalse();
        expect(exp.test(`0.5l`)).toBeFalse();

        // decimal float exponant
        expect(exp.test(`1e46`)).toBeFalse();
        expect(exp.test(`1E7`)).toBeFalse();
        expect(exp.test(`-1E7`)).toBeFalse();
        expect(exp.test(`1E-7`)).toBeFalse();
        expect(exp.test(`1E+7`)).toBeFalse();
        expect(exp.test(`1.e+7`)).toBeFalse();
        expect(exp.test(`4e2`)).toBeFalse();
        expect(exp.test(`123.456e-67`)).toBeFalse();
        expect(exp.test(`.1E4f`)).toBeFalse();
        expect(exp.test(`-.1E4f`)).toBeFalse();
        expect(exp.test(`1e-5L`)).toBeFalse();

        // hexa float fix 
        expect(exp.test(`0x6.FF`)).toBeFalse();
        expect(exp.test(`0x6.`)).toBeFalse();
        expect(exp.test(`-0x6.`)).toBeFalse();
        expect(exp.test(`0x0.`)).toBeFalse();
        expect(exp.test(`0x3.dae`)).toBeFalse();
        expect(exp.test(`0x3.dae5`)).toBeFalse();
        expect(exp.test(`-0x3.dae5`)).toBeFalse();

        // hexa float exponant
        expect(exp.test(`0x6.FFp7`)).toBeFalse();
        expect(exp.test(`-0x6.FFp7`)).toBeFalse();
        expect(exp.test(`0x1.FFFFFEp+62`)).toBeFalse();
        expect(exp.test(`0x3.14p+0`)).toBeFalse();
        expect(exp.test(`0x1ffp10`)).toBeFalse();
        expect(exp.test(`0x0p-1`)).toBeFalse();
        expect(exp.test(`-0x0p-1`)).toBeFalse();
        expect(exp.test(`0x1.p0`)).toBeFalse();
        expect(exp.test(`0xf.p-1`)).toBeFalse();
        expect(exp.test(`0x1.2p3`)).toBeFalse();
        expect(exp.test(`0x1.ap3`)).toBeFalse();
        expect(exp.test(`0x1.2ap3`)).toBeFalse();
        expect(exp.test(`-0x1.2ap3`)).toBeFalse();
        expect(exp.test(`0x1p+3`)).toBeFalse();
        expect(exp.test(`0x1p+3f`)).toBeFalse();
        expect(exp.test(`0x1p+3L`)).toBeFalse();
        expect(exp.test(`-0x1.0C6F7Ap-21`)).toBeFalse();
        

        // not a number
        expect(exp.test(`.`)).toBeFalse();
        expect(exp.test(`3.14e+0a`)).toBeFalse();
        expect(exp.test(`0x3.14p+0a`)).toBeFalse();
        expect(exp.test(`a`)).toBeFalse();
        expect(exp.test(`-a`)).toBeFalse();
        expect(exp.test(`05a`)).toBeFalse();
        expect(exp.test(`+x`)).toBeFalse();
        expect(exp.test(`2=`)).toBeFalse();
        expect(exp.test(`x`)).toBeFalse();
        expect(exp.test(`a7.13`)).toBeFalse();

    */

    /*
// binary
0b001
0b1111'1111
0b1
0B101
0b101'011

// octal
071
-05
067

// decimal integer
81
-81
467
1
0
1'000
-1'000
6ull
-8ll
18'446'744'073'709'550'592ll
1844'6744'0737'0955'0592uLL
184467'440737'0'95505'92LL
-184467'440737'0'95505'92LL

// hexa integer
0x0
-0XFF
0x1
0x45
0xa
-0xa
0xAF
0xff
-0xff

// decimal float fix 
0.
0.0
.0
-.0
1f
-1f
3.7
58.
6.
3.1415926535897932384626433832795
0.5l

// decimal float exponant
1e46
1E7
-1E7
1E-7
1E+7
1.e+7
4e2
123.456e-67
.1E4f
-.1E4f
1e-5L

// hexa float fix 
0x6.FF
0x6.
-0x6.
0x0.
0x3.dae
0x3.dae5
-0x3.dae5

// hexa float exponant
0x6.FFp7
-0x6.FFp7
0x1.FFFFFEp+62
0x3.14p+0
0x1ffp10
0x0p-1
-0x0p-1
0x1.p0
0xf.p-1
0x1.2p3
0x1.ap3
0x1.2ap3
-0x1.2ap3
0x1p+3
0x1p+3f
0x1p+3L
-0x1.0C6F7Ap-21

// not a number
.
3.14e+0a
0x3.14p+0a
a
-a
05a
+x
2=
x
a7.13;









// binary
`0b001` `0b1111'1111` `0b1` `0B101` `0b101'011`

// octal
`071` `-05` `067`

// decimal integer
`81` `-81` `467` `1` `0` `1'000` `-1'000` `6ull` `-8ll` `18'446'744'073'709'550'592ll` `1844'6744'0737'0955'0592uLL` `184467'440737'0'95505'92LL` `-184467'440737'0'95505'92LL`

// hexa integer
`0x0` `-0XFF` `0x1` `0x45` `0xa` `-0xa` `0xAF` `0xff` `-0xff`

// decimal float fix 
`0.` `0.0` `.0` `-.0` `1f` `-1f` `3.7` `58.` `6.` `3.1415926535897932384626433832795` `0.5l`

// decimal float exponant
`1e46` `1E7` `-1E7` `1E-7` `1E+7` `1.e+7` `4e2` `123.456e-67` `.1E4f` `-.1E4f` `1e-5L`

// hexa float fix 
`0x6.FF` `0x6.` `-0x6.` `0x0.` `0x3.dae` `0x3.dae5` `-0x3.dae5`

// hexa float exponant
`0x6.FFp7` `-0x6.FFp7` `0x1.FFFFFEp+62` `0x3.14p+0` `0x1ffp10` `0x0p-1` `-0x0p-1` `0x1.p0` `0xf.p-1` `0x1.2p3` `0x1.ap3` `0x1.2ap3` `-0x1.2ap3` `0x1p+3` `0x1p+3f` `0x1p+3L` `-0x1.0C6F7Ap-21`

// not a number
`.` `3.14e+0a` `0x3.14p+0a` `a` `-a` `05a` `+x` `2=` `x` `a7.13;`
*/
})

describe(`regex class`, () => {
    describe(`escape method`, () => {
        it(`should escape special characters`, () => {
            expect(regex.escape(`.`)).toBe(`\\.`); // Period
            expect(regex.escape(`*`)).toBe(`\\*`); // Asterisk
            expect(regex.escape(`+`)).toBe(`\\+`); // Plus
            expect(regex.escape(`?`)).toBe(`\\?`); // Question mark
            expect(regex.escape(`^`)).toBe(`\\^`); // Caret
            expect(regex.escape(`$`)).toBe(`\\$`); // Dollar
            expect(regex.escape(`{`)).toBe(`\\{`); // Opening brace
            expect(regex.escape(`}`)).toBe(`\\}`); // Closing brace
            expect(regex.escape(`(`)).toBe(`\\(`); // Opening parenthesis
            expect(regex.escape(`)`)).toBe(`\\)`); // Closing parenthesis
            expect(regex.escape(`[`)).toBe(`\\[`); // Opening bracket
            expect(regex.escape(`]`)).toBe(`\\]`); // Closing bracket
            expect(regex.escape(`\\`)).toBe(`\\\\`); // Backslash
            expect(regex.escape(`|`)).toBe(`\\|`); // Pipe
        });

        it(`should not escape non-special characters`, () => {
            expect(regex.escape(`a`)).toBe(`a`);
            expect(regex.escape(`A`)).toBe(`A`);
            expect(regex.escape(`0`)).toBe(`0`);
            expect(regex.escape(` `)).toBe(` `);
            expect(regex.escape(`\n`)).toBe(`\n`);
        });
    });

    describe(`fromString method`, () => {
        it(`should convert a string to a regular expression pattern`, () => {
            expect(regex.from_string(`.`)).toBe(`\\.`);
            expect(regex.from_string(`*`)).toBe(`\\*`);
            expect(regex.from_string(`+`)).toBe(`\\+`);
            expect(regex.from_string(`?`)).toBe(`\\?`);
            expect(regex.from_string(`^`)).toBe(`\\^`);
            expect(regex.from_string(`$`)).toBe(`\\$`);
            expect(regex.from_string(`{`)).toBe(`\\{`);
            expect(regex.from_string(`}`)).toBe(`\\}`);
            expect(regex.from_string(`(`)).toBe(`\\(`);
            expect(regex.from_string(`)`)).toBe(`\\)`);
            expect(regex.from_string(`[`)).toBe(`\\[`);
            expect(regex.from_string(`]`)).toBe(`\\]`);
            expect(regex.from_string(`\\`)).toBe(`\\\\`);
            expect(regex.from_string(`|`)).toBe(`\\|`);
        });

        it(`should replace whitespace with optional whitespace`, () => {
            expect(regex.from_string(`a b c`)).toBe(`a\\s*b\\s*c`);
            expect(regex.from_string(`x    y`)).toBe(`x\\s*y`);
            expect(regex.from_string(``)).toBe(``);
        });
    });
});
