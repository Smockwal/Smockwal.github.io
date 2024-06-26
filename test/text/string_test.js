import { flag } from '../../lib/global.js';
import { string, ucs2 } from '../../lib/text/string.js'

describe(`string`, () => {
    //it('fail', () => { expect(false).toBeTrue();});

    describe(`empty method`, () => {
        it(`should return true for an empty string`, () => {
            expect(string.empty(``)).toBeTrue();
        });

        it(`should return false for a non-empty string`, () => {
            expect(string.empty(`Hello`)).toBeFalse();
        });

        it(`should return false for null`, () => {
            expect(string.empty(null)).toBeFalse();
        });

        it(`should return false for undefined`, () => {
            expect(string.empty(undefined)).toBeFalse();
        });

        it(`should return false for a number`, () => {
            expect(string.empty(123)).toBeFalse();
        });

        it(`should return false for an array`, () => {
            expect(string.empty([`a`, `b`, `c`])).toBeFalse();
        });

        it(`should return false for an object`, () => {
            expect(string.empty({ key: `value` })).toBeFalse();
        });

        it(`should return false for a boolean`, () => {
            expect(string.empty(true)).toBeFalse();
        });
    });

    describe(`simplify method`, () => {
        it(`should return an empty string for an empty input string`, () => {
            expect(string.simplify(``)).toBe(``);
        });

        it(`should remove leading and trailing whitespace characters`, () => {
            expect(string.simplify(`   Hello   `)).toBe(`Hello`);
        });

        it(`should replace multiple consecutive whitespace characters with a single space`, () => {
            expect(string.simplify(`Hello  \t\n World`)).toBe(`Hello World`);
        });

        it(`should handle input string with only whitespace characters`, () => {
            expect(string.simplify(`  \t \n  `)).toBe(``);
        });

        it(`should handle input string with no whitespace characters`, () => {
            expect(string.simplify(`HelloWorld`)).toBe(`HelloWorld`);
        });

        it(`should handle input string with mixed whitespace and non-whitespace characters`, () => {
            expect(string.simplify(`Hello \t World\n!`)).toBe(`Hello World !`);
        });

        it(`should handle input string with special whitespace characters`, () => {
            expect(string.simplify(`\u00A0\u2028\u2029`)).toBe(``);
        });

        it(`should handle input string with leading and trailing whitespace characters only`, () => {
            expect(string.simplify(`   `)).toBe(``);
        });

        it(`should handle input string with a single whitespace character`, () => {
            expect(string.simplify(` `)).toBe(``);
        });

        it(`should handle input string with a single non-whitespace character`, () => {
            expect(string.simplify(`H`)).toBe(`H`);
        });

        it(`should handle input string with a mixture of whitespace and non-whitespace characters`, () => {
            expect(string.simplify(`\n\tHello\n\tWorld\r`)).toBe(`Hello World`);
        });

        it(`should handle input string with null value`, () => {
            expect(string.simplify(null)).toBe(``);
        });

        it(`should handle input string with undefined value`, () => {
            expect(string.simplify(undefined)).toBe(``);
        });
    });

    xdescribe(`esc_perc method`, () => {
        it(`should return an empty string for an empty input string`, () => {
            expect(string.esc_perc(``)).toBe(``);
        });

        it(`should escape non-alphanumeric characters with their hexadecimal Unicode code point`, () => {
            expect(string.esc_perc(`Hello! World`)).toBe(`Hello%21 World`);
            expect(string.esc_perc(`Test-123`)).toBe(`Test%2D123`);
            expect(string.esc_perc(`foo.bar`)).toBe(`foo%2Ebar`);
        });

        it(`should handle input string with only alphanumeric characters`, () => {
            expect(string.esc_perc(`abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`)).toBe(`abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`);
        });

        it(`should handle input string with no alphanumeric characters`, () => {
            expect(string.esc_perc(`!@#$%^&*()`)).toBe(`%21%40%23%24%25%5E%26*%28%29`);
        });

        it(`should handle input string with special characters`, () => {
            expect(string.esc_perc(`\u00A0\u2028\u2029`)).toBe(`%A0%2028%2029`);
        });

        it(`should handle input string with null value`, () => {
            expect(string.esc_perc(null)).toBe(``);
        });

        it(`should handle input string with undefined value`, () => {
            expect(string.esc_perc(undefined)).toBe(``);
        });

        it(`c_esc_perc_00`, () => {
            expect(string.esc_perc("!")).toBe("%21");
            expect(string.esc_perc("\"")).toBe("%22");
            expect(string.esc_perc("#")).toBe("%23");
            expect(string.esc_perc("$")).toBe("%24");
            expect(string.esc_perc("%")).toBe("%25");
            expect(string.esc_perc("&")).toBe("%26");
            expect(string.esc_perc("'")).toBe("%27");
            expect(string.esc_perc("(")).toBe("%28");
            expect(string.esc_perc(")")).toBe("%29");
            expect(string.esc_perc("*")).toBe("%2A");
            expect(string.esc_perc("+")).toBe("%2B");
            expect(string.esc_perc(",")).toBe("%2C");
            expect(string.esc_perc("-")).toBe("%2D");
            expect(string.esc_perc(".")).toBe("%2E");
            expect(string.esc_perc("/")).toBe("%2F");
            expect(string.esc_perc("0")).toBe("0");
            expect(string.esc_perc("1")).toBe("1");
            expect(string.esc_perc("2")).toBe("2");
            expect(string.esc_perc("3")).toBe("3");
            expect(string.esc_perc("4")).toBe("4");
            expect(string.esc_perc("5")).toBe("5");
            expect(string.esc_perc("6")).toBe("6");
            expect(string.esc_perc("7")).toBe("7");
            expect(string.esc_perc("8")).toBe("8");
            expect(string.esc_perc("9")).toBe("9");
            expect(string.esc_perc(":")).toBe("%3A");
            expect(string.esc_perc(";")).toBe("%3B");
            expect(string.esc_perc("<")).toBe("%3C");
            expect(string.esc_perc("=")).toBe("%3D");
            expect(string.esc_perc(">")).toBe("%3E");
            expect(string.esc_perc("?")).toBe("%3F");
            expect(string.esc_perc("@")).toBe("%40");
            expect(string.esc_perc("A")).toBe("A");
            expect(string.esc_perc("B")).toBe("B");
            expect(string.esc_perc("C")).toBe("C");
            expect(string.esc_perc("D")).toBe("D");
            expect(string.esc_perc("E")).toBe("E");
            expect(string.esc_perc("F")).toBe("F");
            expect(string.esc_perc("G")).toBe("G");
            expect(string.esc_perc("H")).toBe("H");
            expect(string.esc_perc("I")).toBe("I");
            expect(string.esc_perc("J")).toBe("J");
            expect(string.esc_perc("K")).toBe("K");
            expect(string.esc_perc("L")).toBe("L");
            expect(string.esc_perc("M")).toBe("M");
            expect(string.esc_perc("N")).toBe("N");
            expect(string.esc_perc("O")).toBe("O");
            expect(string.esc_perc("P")).toBe("P");
            expect(string.esc_perc("Q")).toBe("Q");
            expect(string.esc_perc("R")).toBe("R");
            expect(string.esc_perc("S")).toBe("S");
            expect(string.esc_perc("T")).toBe("T");
            expect(string.esc_perc("U")).toBe("U");
            expect(string.esc_perc("V")).toBe("V");
            expect(string.esc_perc("W")).toBe("W");
            expect(string.esc_perc("X")).toBe("X");
            expect(string.esc_perc("Y")).toBe("Y");
            expect(string.esc_perc("Z")).toBe("Z");
            expect(string.esc_perc("[")).toBe("%5B");
            expect(string.esc_perc("\\")).toBe("%5C");
            expect(string.esc_perc("]")).toBe("%5D");
            expect(string.esc_perc("^")).toBe("%5E");
            expect(string.esc_perc("_")).toBe("%5F");
            expect(string.esc_perc("`")).toBe("%60");
            expect(string.esc_perc("a")).toBe("a");
            expect(string.esc_perc("b")).toBe("b");
            expect(string.esc_perc("c")).toBe("c");
            expect(string.esc_perc("d")).toBe("d");
            expect(string.esc_perc("e")).toBe("e");
            expect(string.esc_perc("f")).toBe("f");
            expect(string.esc_perc("g")).toBe("g");
            expect(string.esc_perc("h")).toBe("h");
            expect(string.esc_perc("i")).toBe("i");
            expect(string.esc_perc("j")).toBe("j");
            expect(string.esc_perc("k")).toBe("k");
            expect(string.esc_perc("l")).toBe("l");
            expect(string.esc_perc("m")).toBe("m");
            expect(string.esc_perc("n")).toBe("n");
            expect(string.esc_perc("o")).toBe("o");
            expect(string.esc_perc("p")).toBe("p");
            expect(string.esc_perc("q")).toBe("q");
            expect(string.esc_perc("r")).toBe("r");
            expect(string.esc_perc("s")).toBe("s");
            expect(string.esc_perc("t")).toBe("t");
            expect(string.esc_perc("u")).toBe("u");
            expect(string.esc_perc("v")).toBe("v");
            expect(string.esc_perc("w")).toBe("w");
            expect(string.esc_perc("x")).toBe("x");
            expect(string.esc_perc("y")).toBe("y");
            expect(string.esc_perc("z")).toBe("z");
            expect(string.esc_perc("{")).toBe("%7B");
            expect(string.esc_perc("|")).toBe("%7C");
            expect(string.esc_perc("}")).toBe("%7D");
            expect(string.esc_perc("~")).toBe("%7E");
        });
    });

    it(`is_literal_prefix_00`, () => {
        expect(string.is_literal_prefix(`u`)).toBeTrue();
        expect(string.is_literal_prefix(`U`)).toBeTrue();
        expect(string.is_literal_prefix(`L`)).toBeTrue();
        expect(string.is_literal_prefix(`u8`)).toBeTrue();
        expect(string.is_literal_prefix(`R`)).toBeTrue();
        expect(string.is_literal_prefix(`uR`)).toBeTrue();
        expect(string.is_literal_prefix(`UR`)).toBeTrue();
        expect(string.is_literal_prefix(`LR`)).toBeTrue();
        expect(string.is_literal_prefix(`u8R`)).toBeTrue();

        expect(string.is_literal_prefix(``)).toBeFalse();
        expect(string.is_literal_prefix(`U8`)).toBeFalse();
        expect(string.is_literal_prefix(`UL`)).toBeFalse();
        expect(string.is_literal_prefix(`U8R`)).toBeFalse();
        expect(string.is_literal_prefix(`8R`)).toBeFalse();
    });

    describe("c_escape function", () => {
        // Test cases for normal strings with special characters
        it("should escape special characters in a normal string", () => {
            expect(string.c_escape("Hello, world!")).toEqual("Hello, world!");
            expect(string.c_escape("Hello\nworld")).toEqual("Hello\\nworld");
            expect(string.c_escape("Hello\tworld")).toEqual("Hello\\tworld");
            expect(string.c_escape("Hello\"world")).toEqual("Hello\\\"world");
        });

        // Test cases for empty string and null input
        it("should return an empty string for empty input", () => {
            expect(string.c_escape("")).toEqual("");
            expect(string.c_escape(null)).toEqual("");
        });

        // Test cases for strings with only special characters
        it("should escape special characters in a string with only special characters", () => {
            expect(string.c_escape("\n\t\"")).toEqual(`\\n\\t\\"`);
        });

        // Test cases for strings without special characters
        it("should return the same string if there are no special characters", () => {
            expect(string.c_escape("Hello world")).toEqual("Hello world");
        });

        it(`c_escape_00`, () => {
            expect(string.c_escape(`a`)).toBe(`a`);
            expect(string.c_escape(`a\u0007b`)).toBe(`a\\ab`);

            expect(string.c_escape(`b`)).toBe(`b`);
            expect(string.c_escape(`a\bb`)).toBe(`a\\bb`);

            expect(string.c_escape(`f`)).toBe(`f`);
            expect(string.c_escape(`a\fb`)).toBe(`a\\fb`);

            expect(string.c_escape(`n`)).toBe(`n`);
            expect(string.c_escape(`a\nb`)).toBe(`a\\nb`);

            expect(string.c_escape(`r`)).toBe(`r`);
            expect(string.c_escape(`a\rb`)).toBe(`a\\rb`);

            expect(string.c_escape(`t`)).toBe(`t`);
            expect(string.c_escape(`a\tb`)).toBe(`a\\tb`);

            expect(string.c_escape(`v`)).toBe(`v`);
            expect(string.c_escape(`a\vb`)).toBe(`a\\vb`);

            expect(string.c_escape(`06`)).toBe(`\\06`);
            expect(string.c_escape(`\\06`)).toBe(`\\06`);

            expect(string.c_escape(`xaa`)).toBe(`\\xaa`);
            expect(string.c_escape(`\\xaa`)).toBe(`\\xaa`);

            expect(string.c_escape(`lot xaa`)).toBe(`lot \\xaa`);
            expect(string.c_escape(`lot xaavier`)).toBe(`lot xaavier`);

            expect(string.c_escape(`5a32accd-0102-85f7-aeb8-01224ab04da4`)).toBe(`5a32accd-0102-85f7-aeb8-01224ab04da4`);

            expect(string.c_escape(`0`)).toBe(`0`);
            expect(string.c_escape(`[0,0]`)).toBe(`[0,0]`);
        });
    });

    describe("html_escape function", () => {
        // Test cases for normal strings
        it("should escape special characters in a string", () => {
            expect(string.html_escape("<script>alert('Hello!');</script>")).toBe("&#60;script&#62;alert(&#39;Hello!&#39;);&#60;/script&#62;");
            expect(string.html_escape("&")).toBe("&#38;");
            expect(string.html_escape("\"")).toBe("&#34;");
            expect(string.html_escape("'")).toBe("&#39;");
            expect(string.html_escape("<")).toBe("&#60;");
            expect(string.html_escape(">")).toBe("&#62;");
        });

        // Test cases for empty string
        it("should return an empty string for an empty input", () => {
            expect(string.html_escape("")).toBe("");
        });

        // Test cases for null and undefined input
        it("should return an empty string for null or undefined input", () => {
            expect(string.html_escape(null)).toBe("");
            expect(string.html_escape(undefined)).toBe("");
        });

        // Test cases for strings with no special characters
        it("should return the input string if there are no special characters", () => {
            expect(string.html_escape("Hello, world!")).toBe("Hello, world!");
            expect(string.html_escape("12345")).toBe("12345");
        });

        it(`html_escape_00`, () => {
            expect(string.html_escape("\"")).toBe("&#34;");
            expect(string.html_escape("'")).toBe("&#39;");
            expect(string.html_escape("&")).toBe("&#38;");
            expect(string.html_escape("<")).toBe("&#60;");
            expect(string.html_escape(">")).toBe("&#62;");
            expect(string.html_escape("Œ")).toBe("&#338;");
            expect(string.html_escape("œ")).toBe("&#339;");
            expect(string.html_escape("Š")).toBe("&#352;");
            expect(string.html_escape("š")).toBe("&#353;");
            expect(string.html_escape("Ÿ")).toBe("&#376;");
            expect(string.html_escape("ƒ")).toBe("&#402;");
            expect(string.html_escape("ˆ")).toBe("&#710;");
            expect(string.html_escape("˜")).toBe("&#732;");
            expect(string.html_escape("‌")).toBe("&#8204;");
            expect(string.html_escape("‍")).toBe("&#8205;");
            expect(string.html_escape("–")).toBe("&#8211;");
            expect(string.html_escape("—")).toBe("&#8212;");
            expect(string.html_escape("‘")).toBe("&#8216;");
            expect(string.html_escape("’")).toBe("&#8217;");
            expect(string.html_escape("‚")).toBe("&#8218;");
            expect(string.html_escape("“")).toBe("&#8220;");
            expect(string.html_escape("”")).toBe("&#8221;");
            expect(string.html_escape("„")).toBe("&#8222;");
            expect(string.html_escape("†")).toBe("&#8224;");
            expect(string.html_escape("‡")).toBe("&#8225;");
            expect(string.html_escape("•")).toBe("&#8226;");
            expect(string.html_escape("…")).toBe("&#8230;");
            expect(string.html_escape("‰")).toBe("&#8240;");
            expect(string.html_escape("′")).toBe("&#8242;");
            expect(string.html_escape("″")).toBe("&#8243;");
            expect(string.html_escape("‹")).toBe("&#8249;");
            expect(string.html_escape("›")).toBe("&#8250;");
            expect(string.html_escape("‾")).toBe("&#8254;");
            expect(string.html_escape("€")).toBe("&#8364;");
            expect(string.html_escape("™")).toBe("&#8482;");
            expect(string.html_escape("←")).toBe("&#8592;");
            expect(string.html_escape("↑")).toBe("&#8593;");
            expect(string.html_escape("→")).toBe("&#8594;");
            expect(string.html_escape("↓")).toBe("&#8595;");
            expect(string.html_escape("↔")).toBe("&#8596;");
            expect(string.html_escape("↵")).toBe("&#8629;");
            expect(string.html_escape("⌈")).toBe("&#8968;");
            expect(string.html_escape("⌉")).toBe("&#8969;");
            expect(string.html_escape("⌊")).toBe("&#8970;");
            expect(string.html_escape("⌋")).toBe("&#8971;");
            expect(string.html_escape("◊")).toBe("&#9674;");
            expect(string.html_escape("♠")).toBe("&#9824;");
            expect(string.html_escape("♣")).toBe("&#9827;");
            expect(string.html_escape("♥")).toBe("&#9829;");
            expect(string.html_escape("♦")).toBe("&#9830;");
            expect(string.html_escape("∀")).toBe("&#8704;");
            expect(string.html_escape("∂")).toBe("&#8706;");
            expect(string.html_escape("∃")).toBe("&#8707;");
            expect(string.html_escape("∅")).toBe("&#8709;");
            expect(string.html_escape("∇")).toBe("&#8711;");
            expect(string.html_escape("∈")).toBe("&#8712;");
            expect(string.html_escape("∉")).toBe("&#8713;");
            expect(string.html_escape("∋")).toBe("&#8715;");
            expect(string.html_escape("∏")).toBe("&#8719;");
            expect(string.html_escape("∑")).toBe("&#8721;");
            expect(string.html_escape("−")).toBe("&#8722;");
            expect(string.html_escape("∗")).toBe("&#8727;");
            expect(string.html_escape("√")).toBe("&#8730;");
            expect(string.html_escape("∝")).toBe("&#8733;");
            expect(string.html_escape("∞")).toBe("&#8734;");
            expect(string.html_escape("∠")).toBe("&#8736;");
            expect(string.html_escape("∧")).toBe("&#8743;");
            expect(string.html_escape("∨")).toBe("&#8744;");
            expect(string.html_escape("∩")).toBe("&#8745;");
            expect(string.html_escape("∪")).toBe("&#8746;");
            expect(string.html_escape("∫")).toBe("&#8747;");
            expect(string.html_escape("∴")).toBe("&#8756;");
            expect(string.html_escape("∼")).toBe("&#8764;");
            expect(string.html_escape("≅")).toBe("&#8773;");
            expect(string.html_escape("≈")).toBe("&#8776;");
            expect(string.html_escape("≠")).toBe("&#8800;");
            expect(string.html_escape("≡")).toBe("&#8801;");
            expect(string.html_escape("≤")).toBe("&#8804;");
            expect(string.html_escape("≥")).toBe("&#8805;");
            expect(string.html_escape("⊂")).toBe("&#8834;");
            expect(string.html_escape("⊃")).toBe("&#8835;");
            expect(string.html_escape("⊄")).toBe("&#8836;");
            expect(string.html_escape("⊆")).toBe("&#8838;");
            expect(string.html_escape("⊇")).toBe("&#8839;");
            expect(string.html_escape("⊕")).toBe("&#8853;");
            expect(string.html_escape("⊗")).toBe("&#8855;");
            expect(string.html_escape("⊥")).toBe("&#8869;");
            expect(string.html_escape("Α")).toBe("&#913;");
            expect(string.html_escape("Β")).toBe("&#914;");
            expect(string.html_escape("Γ")).toBe("&#915;");
            expect(string.html_escape("Δ")).toBe("&#916;");
            expect(string.html_escape("Ε")).toBe("&#917;");
            expect(string.html_escape("Ζ")).toBe("&#918;");
            expect(string.html_escape("Η")).toBe("&#919;");
            expect(string.html_escape("Θ")).toBe("&#920;");
            expect(string.html_escape("Ι")).toBe("&#921;");
            expect(string.html_escape("Κ")).toBe("&#922;");
            expect(string.html_escape("Λ")).toBe("&#923;");
            expect(string.html_escape("Μ")).toBe("&#924;");
            expect(string.html_escape("Ν")).toBe("&#925;");
            expect(string.html_escape("Ξ")).toBe("&#926;");
            expect(string.html_escape("Ο")).toBe("&#927;");
            expect(string.html_escape("Π")).toBe("&#928;");
            expect(string.html_escape("Ρ")).toBe("&#929;");
            expect(string.html_escape("Σ")).toBe("&#931;");
            expect(string.html_escape("Τ")).toBe("&#932;");
            expect(string.html_escape("Υ")).toBe("&#933;");
            expect(string.html_escape("Φ")).toBe("&#934;");
            expect(string.html_escape("Χ")).toBe("&#935;");
            expect(string.html_escape("Ψ")).toBe("&#936;");
            expect(string.html_escape("Ω")).toBe("&#937;");
            expect(string.html_escape("α")).toBe("&#945;");
            expect(string.html_escape("β")).toBe("&#946;");
            expect(string.html_escape("γ")).toBe("&#947;");
            expect(string.html_escape("δ")).toBe("&#948;");
            expect(string.html_escape("ε")).toBe("&#949;");
            expect(string.html_escape("ζ")).toBe("&#950;");
            expect(string.html_escape("η")).toBe("&#951;");
            expect(string.html_escape("θ")).toBe("&#952;");
            expect(string.html_escape("ι")).toBe("&#953;");
            expect(string.html_escape("κ")).toBe("&#954;");
            expect(string.html_escape("λ")).toBe("&#955;");
            expect(string.html_escape("μ")).toBe("&#956;");
            expect(string.html_escape("ν")).toBe("&#957;");
            expect(string.html_escape("ξ")).toBe("&#958;");
            expect(string.html_escape("ο")).toBe("&#959;");
            expect(string.html_escape("π")).toBe("&#960;");
            expect(string.html_escape("ρ")).toBe("&#961;");
            expect(string.html_escape("ς")).toBe("&#962;");
            expect(string.html_escape("σ")).toBe("&#963;");
            expect(string.html_escape("τ")).toBe("&#964;");
            expect(string.html_escape("υ")).toBe("&#965;");
            expect(string.html_escape("φ")).toBe("&#966;");
            expect(string.html_escape("χ")).toBe("&#967;");
            expect(string.html_escape("ψ")).toBe("&#968;");
            expect(string.html_escape("ω")).toBe("&#969;");
            expect(string.html_escape("ϑ")).toBe("&#977;");
            expect(string.html_escape("ϒ")).toBe("&#978;");
            expect(string.html_escape("ϖ")).toBe("&#982;");
            expect(string.html_escape("À")).toBe("&#192;");
            expect(string.html_escape("Á")).toBe("&#193;");
            expect(string.html_escape("Â")).toBe("&#194;");
            expect(string.html_escape("Ã")).toBe("&#195;");
            expect(string.html_escape("Ä")).toBe("&#196;");
            expect(string.html_escape("Å")).toBe("&#197;");
            expect(string.html_escape("Æ")).toBe("&#198;");
            expect(string.html_escape("Ç")).toBe("&#199;");
            expect(string.html_escape("È")).toBe("&#200;");
            expect(string.html_escape("É")).toBe("&#201;");
            expect(string.html_escape("Ê")).toBe("&#202;");
            expect(string.html_escape("Ë")).toBe("&#203;");
            expect(string.html_escape("Ì")).toBe("&#204;");
            expect(string.html_escape("Í")).toBe("&#205;");
            expect(string.html_escape("Î")).toBe("&#206;");
            expect(string.html_escape("Ï")).toBe("&#207;");
            expect(string.html_escape("Ð")).toBe("&#208;");
            expect(string.html_escape("Ñ")).toBe("&#209;");
            expect(string.html_escape("Ò")).toBe("&#210;");
            expect(string.html_escape("Ó")).toBe("&#211;");
            expect(string.html_escape("Ô")).toBe("&#212;");
            expect(string.html_escape("Õ")).toBe("&#213;");
            expect(string.html_escape("Ö")).toBe("&#214;");
            expect(string.html_escape("Ø")).toBe("&#216;");
            expect(string.html_escape("Ù")).toBe("&#217;");
            expect(string.html_escape("Ú")).toBe("&#218;");
            expect(string.html_escape("Û")).toBe("&#219;");
            expect(string.html_escape("Ü")).toBe("&#220;");
            expect(string.html_escape("Ý")).toBe("&#221;");
            expect(string.html_escape("Þ")).toBe("&#222;");
            expect(string.html_escape("ß")).toBe("&#223;");
            expect(string.html_escape("à")).toBe("&#224;");
            expect(string.html_escape("á")).toBe("&#225;");
            expect(string.html_escape("â")).toBe("&#226;");
            expect(string.html_escape("ã")).toBe("&#227;");
            expect(string.html_escape("ä")).toBe("&#228;");
            expect(string.html_escape("å")).toBe("&#229;");
            expect(string.html_escape("æ")).toBe("&#230;");
            expect(string.html_escape("ç")).toBe("&#231;");
            expect(string.html_escape("è")).toBe("&#232;");
            expect(string.html_escape("é")).toBe("&#233;");
            expect(string.html_escape("ê")).toBe("&#234;");
            expect(string.html_escape("ë")).toBe("&#235;");
            expect(string.html_escape("ì")).toBe("&#236;");
            expect(string.html_escape("í")).toBe("&#237;");
            expect(string.html_escape("î")).toBe("&#238;");
            expect(string.html_escape("ï")).toBe("&#239;");
            expect(string.html_escape("ð")).toBe("&#240;");
            expect(string.html_escape("ñ")).toBe("&#241;");
            expect(string.html_escape("ò")).toBe("&#242;");
            expect(string.html_escape("ó")).toBe("&#243;");
            expect(string.html_escape("ô")).toBe("&#244;");
            expect(string.html_escape("õ")).toBe("&#245;");
            expect(string.html_escape("ö")).toBe("&#246;");
            expect(string.html_escape("ø")).toBe("&#248;");
            expect(string.html_escape("ù")).toBe("&#249;");
            expect(string.html_escape("ú")).toBe("&#250;");
            expect(string.html_escape("û")).toBe("&#251;");
            expect(string.html_escape("ü")).toBe("&#252;");
            expect(string.html_escape("ý")).toBe("&#253;");
            expect(string.html_escape("þ")).toBe("&#254;");
            expect(string.html_escape("ÿ")).toBe("&#255;");
            expect(string.html_escape("¡")).toBe("&#161;");
            expect(string.html_escape("¢")).toBe("&#162;");
            expect(string.html_escape("£")).toBe("&#163;");
            expect(string.html_escape("¤")).toBe("&#164;");
            expect(string.html_escape("¥")).toBe("&#165;");
            expect(string.html_escape("¦")).toBe("&#166;");
            expect(string.html_escape("§")).toBe("&#167;");
            expect(string.html_escape("¨")).toBe("&#168;");
            expect(string.html_escape("©")).toBe("&#169;");
            expect(string.html_escape("ª")).toBe("&#170;");
            expect(string.html_escape("«")).toBe("&#171;");
            expect(string.html_escape("¬")).toBe("&#172;");
            expect(string.html_escape("­")).toBe("&#173;");
            expect(string.html_escape("®")).toBe("&#174;");
            expect(string.html_escape("¯")).toBe("&#175;");
            expect(string.html_escape("°")).toBe("&#176;");
            expect(string.html_escape("±")).toBe("&#177;");
            expect(string.html_escape("²")).toBe("&#178;");
            expect(string.html_escape("³")).toBe("&#179;");
            expect(string.html_escape("´")).toBe("&#180;");
            expect(string.html_escape("µ")).toBe("&#181;");
            expect(string.html_escape("¶")).toBe("&#182;");
            expect(string.html_escape("·")).toBe("&#183;");
            expect(string.html_escape("¸")).toBe("&#184;");
            expect(string.html_escape("¹")).toBe("&#185;");
            expect(string.html_escape("º")).toBe("&#186;");
            expect(string.html_escape("»")).toBe("&#187;");
            expect(string.html_escape("¼")).toBe("&#188;");
            expect(string.html_escape("½")).toBe("&#189;");
            expect(string.html_escape("¾")).toBe("&#190;");
            expect(string.html_escape("¿")).toBe("&#191;");
            expect(string.html_escape("×")).toBe("&#215;");
            expect(string.html_escape("÷")).toBe("&#247;");
        });
    });

    describe('html_unescape', () => {
        // Test cases for unescaping HTML entities
        it('should unescape HTML entities in a string', () => {
            // Test input with HTML entities
            const input = '&lt;div&gt;Hello&lt;/div&gt;';
            // Expected output after unescaping HTML entities
            const expectedOutput = '<div>Hello</div>';
            // Call the html_unescape function
            const output = string.html_unescape(input);
            // Expect the output to match the expected unescaped string
            expect(output).toEqual(expectedOutput);
        });

        // Test case for an empty input string
        it('should return an empty string for an empty input', () => {
            // Call the html_unescape function with an empty input
            const output = string.html_unescape('');
            // Expect the output to be an empty string
            expect(output).toEqual('');
        });

        // Test case for a string with no HTML entities
        it('should return the input string unchanged if it contains no HTML entities', () => {
            // Test input with no HTML entities
            const input = 'This is a test string';
            // Call the html_unescape function with the input
            const output = string.html_unescape(input);
            // Expect the output to be the same as the input
            expect(output).toEqual(input);
        });

        // Test case for a string with special characters
        it('should correctly handle special characters in the input string', () => {
            // Test input with special characters
            const input = '&amp;&lt;&gt;&quot;&#39;';
            // Expected output after unescaping special characters
            const expectedOutput = '&<>"\'';
            // Call the html_unescape function
            const output = string.html_unescape(input);
            // Expect the output to match the expected unescaped string
            expect(output).toEqual(expectedOutput);
        });

        it(`html_unescape_00`, () => {
            expect(string.html_unescape("&#34;")).toBe("\"");
            expect(string.html_unescape("&#39;")).toBe("'");
            expect(string.html_unescape("&#38;")).toBe("&");
            expect(string.html_unescape("&#60;")).toBe("<");
            expect(string.html_unescape("&#62;")).toBe(">");
            expect(string.html_unescape("&#338;")).toBe("Œ");
            expect(string.html_unescape("&#339;")).toBe("œ");
            expect(string.html_unescape("&#352;")).toBe("Š");
            expect(string.html_unescape("&#353;")).toBe("š");
            expect(string.html_unescape("&#376;")).toBe("Ÿ");
            expect(string.html_unescape("&#402;")).toBe("ƒ");
            expect(string.html_unescape("&#710;")).toBe("ˆ");
            expect(string.html_unescape("&#732;")).toBe("˜");
            expect(string.html_unescape("&#8204;")).toBe("‌");
            expect(string.html_unescape("&#8205;")).toBe("‍");
            expect(string.html_unescape("&#8211;")).toBe("–");
            expect(string.html_unescape("&#8212;")).toBe("—");
            expect(string.html_unescape("&#8216;")).toBe("‘");
            expect(string.html_unescape("&#8217;")).toBe("’");
            expect(string.html_unescape("&#8218;")).toBe("‚");
            expect(string.html_unescape("&#8220;")).toBe("“");
            expect(string.html_unescape("&#8221;")).toBe("”");
            expect(string.html_unescape("&#8222;")).toBe("„");
            expect(string.html_unescape("&#8224;")).toBe("†");
            expect(string.html_unescape("&#8225;")).toBe("‡");
            expect(string.html_unescape("&#8226;")).toBe("•");
            expect(string.html_unescape("&#8230;")).toBe("…");
            expect(string.html_unescape("&#8240;")).toBe("‰");
            expect(string.html_unescape("&#8242;")).toBe("′");
            expect(string.html_unescape("&#8243;")).toBe("″");
            expect(string.html_unescape("&#8249;")).toBe("‹");
            expect(string.html_unescape("&#8250;")).toBe("›");
            expect(string.html_unescape("&#8254;")).toBe("‾");
            expect(string.html_unescape("&#8364;")).toBe("€");
            expect(string.html_unescape("&#8482;")).toBe("™");
            expect(string.html_unescape("&#8592;")).toBe("←");
            expect(string.html_unescape("&#8593;")).toBe("↑");
            expect(string.html_unescape("&#8594;")).toBe("→");
            expect(string.html_unescape("&#8595;")).toBe("↓");
            expect(string.html_unescape("&#8596;")).toBe("↔");
            expect(string.html_unescape("&#8629;")).toBe("↵");
            expect(string.html_unescape("&#8968;")).toBe("⌈");
            expect(string.html_unescape("&#8969;")).toBe("⌉");
            expect(string.html_unescape("&#8970;")).toBe("⌊");
            expect(string.html_unescape("&#8971;")).toBe("⌋");
            expect(string.html_unescape("&#9674;")).toBe("◊");
            expect(string.html_unescape("&#9824;")).toBe("♠");
            expect(string.html_unescape("&#9827;")).toBe("♣");
            expect(string.html_unescape("&#9829;")).toBe("♥");
            expect(string.html_unescape("&#9830;")).toBe("♦");
            expect(string.html_unescape("&#8704;")).toBe("∀");
            expect(string.html_unescape("&#8706;")).toBe("∂");
            expect(string.html_unescape("&#8707;")).toBe("∃");
            expect(string.html_unescape("&#8709;")).toBe("∅");
            expect(string.html_unescape("&#8711;")).toBe("∇");
            expect(string.html_unescape("&#8712;")).toBe("∈");
            expect(string.html_unescape("&#8713;")).toBe("∉");
            expect(string.html_unescape("&#8715;")).toBe("∋");
            expect(string.html_unescape("&#8719;")).toBe("∏");
            expect(string.html_unescape("&#8721;")).toBe("∑");
            expect(string.html_unescape("&#8722;")).toBe("−");
            expect(string.html_unescape("&#8727;")).toBe("∗");
            expect(string.html_unescape("&#8730;")).toBe("√");
            expect(string.html_unescape("&#8733;")).toBe("∝");
            expect(string.html_unescape("&#8734;")).toBe("∞");
            expect(string.html_unescape("&#8736;")).toBe("∠");
            expect(string.html_unescape("&#8743;")).toBe("∧");
            expect(string.html_unescape("&#8744;")).toBe("∨");
            expect(string.html_unescape("&#8745;")).toBe("∩");
            expect(string.html_unescape("&#8746;")).toBe("∪");
            expect(string.html_unescape("&#8747;")).toBe("∫");
            expect(string.html_unescape("&#8756;")).toBe("∴");
            expect(string.html_unescape("&#8764;")).toBe("∼");
            expect(string.html_unescape("&#8773;")).toBe("≅");
            expect(string.html_unescape("&#8776;")).toBe("≈");
            expect(string.html_unescape("&#8800;")).toBe("≠");
            expect(string.html_unescape("&#8801;")).toBe("≡");
            expect(string.html_unescape("&#8804;")).toBe("≤");
            expect(string.html_unescape("&#8805;")).toBe("≥");
            expect(string.html_unescape("&#8834;")).toBe("⊂");
            expect(string.html_unescape("&#8835;")).toBe("⊃");
            expect(string.html_unescape("&#8836;")).toBe("⊄");
            expect(string.html_unescape("&#8838;")).toBe("⊆");
            expect(string.html_unescape("&#8839;")).toBe("⊇");
            expect(string.html_unescape("&#8853;")).toBe("⊕");
            expect(string.html_unescape("&#8855;")).toBe("⊗");
            expect(string.html_unescape("&#8869;")).toBe("⊥");
            expect(string.html_unescape("&#913;")).toBe("Α");
            expect(string.html_unescape("&#914;")).toBe("Β");
            expect(string.html_unescape("&#915;")).toBe("Γ");
            expect(string.html_unescape("&#916;")).toBe("Δ");
            expect(string.html_unescape("&#917;")).toBe("Ε");
            expect(string.html_unescape("&#918;")).toBe("Ζ");
            expect(string.html_unescape("&#919;")).toBe("Η");
            expect(string.html_unescape("&#920;")).toBe("Θ");
            expect(string.html_unescape("&#921;")).toBe("Ι");
            expect(string.html_unescape("&#922;")).toBe("Κ");
            expect(string.html_unescape("&#923;")).toBe("Λ");
            expect(string.html_unescape("&#924;")).toBe("Μ");
            expect(string.html_unescape("&#925;")).toBe("Ν");
            expect(string.html_unescape("&#926;")).toBe("Ξ");
            expect(string.html_unescape("&#927;")).toBe("Ο");
            expect(string.html_unescape("&#928;")).toBe("Π");
            expect(string.html_unescape("&#929;")).toBe("Ρ");
            expect(string.html_unescape("&#931;")).toBe("Σ");
            expect(string.html_unescape("&#932;")).toBe("Τ");
            expect(string.html_unescape("&#933;")).toBe("Υ");
            expect(string.html_unescape("&#934;")).toBe("Φ");
            expect(string.html_unescape("&#935;")).toBe("Χ");
            expect(string.html_unescape("&#936;")).toBe("Ψ");
            expect(string.html_unescape("&#937;")).toBe("Ω");
            expect(string.html_unescape("&#945;")).toBe("α");
            expect(string.html_unescape("&#946;")).toBe("β");
            expect(string.html_unescape("&#947;")).toBe("γ");
            expect(string.html_unescape("&#948;")).toBe("δ");
            expect(string.html_unescape("&#949;")).toBe("ε");
            expect(string.html_unescape("&#950;")).toBe("ζ");
            expect(string.html_unescape("&#951;")).toBe("η");
            expect(string.html_unescape("&#952;")).toBe("θ");
            expect(string.html_unescape("&#953;")).toBe("ι");
            expect(string.html_unescape("&#954;")).toBe("κ");
            expect(string.html_unescape("&#955;")).toBe("λ");
            expect(string.html_unescape("&#956;")).toBe("μ");
            expect(string.html_unescape("&#957;")).toBe("ν");
            expect(string.html_unescape("&#958;")).toBe("ξ");
            expect(string.html_unescape("&#959;")).toBe("ο");
            expect(string.html_unescape("&#960;")).toBe("π");
            expect(string.html_unescape("&#961;")).toBe("ρ");
            expect(string.html_unescape("&#962;")).toBe("ς");
            expect(string.html_unescape("&#963;")).toBe("σ");
            expect(string.html_unescape("&#964;")).toBe("τ");
            expect(string.html_unescape("&#965;")).toBe("υ");
            expect(string.html_unescape("&#966;")).toBe("φ");
            expect(string.html_unescape("&#967;")).toBe("χ");
            expect(string.html_unescape("&#968;")).toBe("ψ");
            expect(string.html_unescape("&#969;")).toBe("ω");
            expect(string.html_unescape("&#977;")).toBe("ϑ");
            expect(string.html_unescape("&#978;")).toBe("ϒ");
            expect(string.html_unescape("&#982;")).toBe("ϖ");
            expect(string.html_unescape("&#192;")).toBe("À");
            expect(string.html_unescape("&#193;")).toBe("Á");
            expect(string.html_unescape("&#194;")).toBe("Â");
            expect(string.html_unescape("&#195;")).toBe("Ã");
            expect(string.html_unescape("&#196;")).toBe("Ä");
            expect(string.html_unescape("&#197;")).toBe("Å");
            expect(string.html_unescape("&#198;")).toBe("Æ");
            expect(string.html_unescape("&#199;")).toBe("Ç");
            expect(string.html_unescape("&#200;")).toBe("È");
            expect(string.html_unescape("&#201;")).toBe("É");
            expect(string.html_unescape("&#202;")).toBe("Ê");
            expect(string.html_unescape("&#203;")).toBe("Ë");
            expect(string.html_unescape("&#204;")).toBe("Ì");
            expect(string.html_unescape("&#205;")).toBe("Í");
            expect(string.html_unescape("&#206;")).toBe("Î");
            expect(string.html_unescape("&#207;")).toBe("Ï");
            expect(string.html_unescape("&#208;")).toBe("Ð");
            expect(string.html_unescape("&#209;")).toBe("Ñ");
            expect(string.html_unescape("&#210;")).toBe("Ò");
            expect(string.html_unescape("&#211;")).toBe("Ó");
            expect(string.html_unescape("&#212;")).toBe("Ô");
            expect(string.html_unescape("&#213;")).toBe("Õ");
            expect(string.html_unescape("&#214;")).toBe("Ö");
            expect(string.html_unescape("&#216;")).toBe("Ø");
            expect(string.html_unescape("&#217;")).toBe("Ù");
            expect(string.html_unescape("&#218;")).toBe("Ú");
            expect(string.html_unescape("&#219;")).toBe("Û");
            expect(string.html_unescape("&#220;")).toBe("Ü");
            expect(string.html_unescape("&#221;")).toBe("Ý");
            expect(string.html_unescape("&#222;")).toBe("Þ");
            expect(string.html_unescape("&#223;")).toBe("ß");
            expect(string.html_unescape("&#224;")).toBe("à");
            expect(string.html_unescape("&#225;")).toBe("á");
            expect(string.html_unescape("&#226;")).toBe("â");
            expect(string.html_unescape("&#227;")).toBe("ã");
            expect(string.html_unescape("&#228;")).toBe("ä");
            expect(string.html_unescape("&#229;")).toBe("å");
            expect(string.html_unescape("&#230;")).toBe("æ");
            expect(string.html_unescape("&#231;")).toBe("ç");
            expect(string.html_unescape("&#232;")).toBe("è");
            expect(string.html_unescape("&#233;")).toBe("é");
            expect(string.html_unescape("&#234;")).toBe("ê");
            expect(string.html_unescape("&#235;")).toBe("ë");
            expect(string.html_unescape("&#236;")).toBe("ì");
            expect(string.html_unescape("&#237;")).toBe("í");
            expect(string.html_unescape("&#238;")).toBe("î");
            expect(string.html_unescape("&#239;")).toBe("ï");
            expect(string.html_unescape("&#240;")).toBe("ð");
            expect(string.html_unescape("&#241;")).toBe("ñ");
            expect(string.html_unescape("&#242;")).toBe("ò");
            expect(string.html_unescape("&#243;")).toBe("ó");
            expect(string.html_unescape("&#244;")).toBe("ô");
            expect(string.html_unescape("&#245;")).toBe("õ");
            expect(string.html_unescape("&#246;")).toBe("ö");
            expect(string.html_unescape("&#248;")).toBe("ø");
            expect(string.html_unescape("&#249;")).toBe("ù");
            expect(string.html_unescape("&#250;")).toBe("ú");
            expect(string.html_unescape("&#251;")).toBe("û");
            expect(string.html_unescape("&#252;")).toBe("ü");
            expect(string.html_unescape("&#253;")).toBe("ý");
            expect(string.html_unescape("&#254;")).toBe("þ");
            expect(string.html_unescape("&#255;")).toBe("ÿ");
            expect(string.html_unescape("&#161;")).toBe("¡");
            expect(string.html_unescape("&#162;")).toBe("¢");
            expect(string.html_unescape("&#163;")).toBe("£");
            expect(string.html_unescape("&#164;")).toBe("¤");
            expect(string.html_unescape("&#165;")).toBe("¥");
            expect(string.html_unescape("&#166;")).toBe("¦");
            expect(string.html_unescape("&#167;")).toBe("§");
            expect(string.html_unescape("&#168;")).toBe("¨");
            expect(string.html_unescape("&#169;")).toBe("©");
            expect(string.html_unescape("&#170;")).toBe("ª");
            expect(string.html_unescape("&#171;")).toBe("«");
            expect(string.html_unescape("&#172;")).toBe("¬");
            expect(string.html_unescape("&#173;")).toBe("­");
            expect(string.html_unescape("&#174;")).toBe("®");
            expect(string.html_unescape("&#175;")).toBe("¯");
            expect(string.html_unescape("&#176;")).toBe("°");
            expect(string.html_unescape("&#177;")).toBe("±");
            expect(string.html_unescape("&#178;")).toBe("²");
            expect(string.html_unescape("&#179;")).toBe("³");
            expect(string.html_unescape("&#180;")).toBe("´");
            expect(string.html_unescape("&#181;")).toBe("µ");
            expect(string.html_unescape("&#182;")).toBe("¶");
            expect(string.html_unescape("&#183;")).toBe("·");
            expect(string.html_unescape("&#184;")).toBe("¸");
            expect(string.html_unescape("&#185;")).toBe("¹");
            expect(string.html_unescape("&#186;")).toBe("º");
            expect(string.html_unescape("&#187;")).toBe("»");
            expect(string.html_unescape("&#188;")).toBe("¼");
            expect(string.html_unescape("&#189;")).toBe("½");
            expect(string.html_unescape("&#190;")).toBe("¾");
            expect(string.html_unescape("&#191;")).toBe("¿");
            expect(string.html_unescape("&#215;")).toBe("×");
            expect(string.html_unescape("&#247;")).toBe("÷");

            expect(string.html_unescape("&quot;")).toBe("\"");
            expect(string.html_unescape("&apos;")).toBe("'");
            expect(string.html_unescape("&amp;")).toBe("&");
            expect(string.html_unescape("&lt;")).toBe("<");
            expect(string.html_unescape("&gt;")).toBe(">");
            expect(string.html_unescape("&OElig;")).toBe("Œ");
            expect(string.html_unescape("&oelig;")).toBe("œ");
            expect(string.html_unescape("&Scaron;")).toBe("Š");
            expect(string.html_unescape("&scaron;")).toBe("š");
            expect(string.html_unescape("&Yuml;")).toBe("Ÿ");
            expect(string.html_unescape("&fnof;")).toBe("ƒ");
            expect(string.html_unescape("&circ;")).toBe("ˆ");
            expect(string.html_unescape("&tilde;")).toBe("˜");
            expect(string.html_unescape("&zwnj;")).toBe("‌");
            expect(string.html_unescape("&zwj;")).toBe("‍");
            expect(string.html_unescape("&ndash;")).toBe("–");
            expect(string.html_unescape("&mdash;")).toBe("—");
            expect(string.html_unescape("&lsquo;")).toBe("‘");
            expect(string.html_unescape("&rsquo;")).toBe("’");
            expect(string.html_unescape("&sbquo;")).toBe("‚");
            expect(string.html_unescape("&ldquo;")).toBe("“");
            expect(string.html_unescape("&rdquo;")).toBe("”");
            expect(string.html_unescape("&bdquo;")).toBe("„");
            expect(string.html_unescape("&dagger;")).toBe("†");
            expect(string.html_unescape("&Dagger;")).toBe("‡");
            expect(string.html_unescape("&bull;")).toBe("•");
            expect(string.html_unescape("&hellip;")).toBe("…");
            expect(string.html_unescape("&permil;")).toBe("‰");
            expect(string.html_unescape("&prime;")).toBe("′");
            expect(string.html_unescape("&Prime;")).toBe("″");
            expect(string.html_unescape("&lsaquo;")).toBe("‹");
            expect(string.html_unescape("&rsaquo;")).toBe("›");
            expect(string.html_unescape("&oline;")).toBe("‾");
            expect(string.html_unescape("&euro;")).toBe("€");
            expect(string.html_unescape("&trade;")).toBe("™");
            expect(string.html_unescape("&larr;")).toBe("←");
            expect(string.html_unescape("&uarr;")).toBe("↑");
            expect(string.html_unescape("&rarr;")).toBe("→");
            expect(string.html_unescape("&darr;")).toBe("↓");
            expect(string.html_unescape("&harr;")).toBe("↔");
            expect(string.html_unescape("&crarr;")).toBe("↵");
            expect(string.html_unescape("&lceil;")).toBe("⌈");
            expect(string.html_unescape("&rceil;")).toBe("⌉");
            expect(string.html_unescape("&lfloor;")).toBe("⌊");
            expect(string.html_unescape("&rfloor;")).toBe("⌋");
            expect(string.html_unescape("&loz;")).toBe("◊");
            expect(string.html_unescape("&spades;")).toBe("♠");
            expect(string.html_unescape("&clubs;")).toBe("♣");
            expect(string.html_unescape("&hearts;")).toBe("♥");
            expect(string.html_unescape("&diams;")).toBe("♦");
            expect(string.html_unescape("&forall;")).toBe("∀");
            expect(string.html_unescape("&part;")).toBe("∂");
            expect(string.html_unescape("&exist;")).toBe("∃");
            expect(string.html_unescape("&empty;")).toBe("∅");
            expect(string.html_unescape("&nabla;")).toBe("∇");
            expect(string.html_unescape("&isin;")).toBe("∈");
            expect(string.html_unescape("&notin;")).toBe("∉");
            expect(string.html_unescape("&ni;")).toBe("∋");
            expect(string.html_unescape("&prod;")).toBe("∏");
            expect(string.html_unescape("&sum;")).toBe("∑");
            expect(string.html_unescape("&minus;")).toBe("−");
            expect(string.html_unescape("&lowast;")).toBe("∗");
            expect(string.html_unescape("&radic;")).toBe("√");
            expect(string.html_unescape("&prop;")).toBe("∝");
            expect(string.html_unescape("&infin;")).toBe("∞");
            expect(string.html_unescape("&ang;")).toBe("∠");
            expect(string.html_unescape("&and;")).toBe("∧");
            expect(string.html_unescape("&or;")).toBe("∨");
            expect(string.html_unescape("&cap;")).toBe("∩");
            expect(string.html_unescape("&cup;")).toBe("∪");
            expect(string.html_unescape("&int;")).toBe("∫");
            expect(string.html_unescape("&there4;")).toBe("∴");
            expect(string.html_unescape("&sim;")).toBe("∼");
            expect(string.html_unescape("&cong;")).toBe("≅");
            expect(string.html_unescape("&asymp;")).toBe("≈");
            expect(string.html_unescape("&ne;")).toBe("≠");
            expect(string.html_unescape("&equiv;")).toBe("≡");
            expect(string.html_unescape("&le;")).toBe("≤");
            expect(string.html_unescape("&ge;")).toBe("≥");
            expect(string.html_unescape("&sub;")).toBe("⊂");
            expect(string.html_unescape("&sup;")).toBe("⊃");
            expect(string.html_unescape("&nsub;")).toBe("⊄");
            expect(string.html_unescape("&sube;")).toBe("⊆");
            expect(string.html_unescape("&supe;")).toBe("⊇");
            expect(string.html_unescape("&oplus;")).toBe("⊕");
            expect(string.html_unescape("&otimes;")).toBe("⊗");
            expect(string.html_unescape("&perp;")).toBe("⊥");
            expect(string.html_unescape("&Alpha;")).toBe("Α");
            expect(string.html_unescape("&Beta;")).toBe("Β");
            expect(string.html_unescape("&Gamma;")).toBe("Γ");
            expect(string.html_unescape("&Delta;")).toBe("Δ");
            expect(string.html_unescape("&Epsilon;")).toBe("Ε");
            expect(string.html_unescape("&Zeta;")).toBe("Ζ");
            expect(string.html_unescape("&Eta;")).toBe("Η");
            expect(string.html_unescape("&Theta;")).toBe("Θ");
            expect(string.html_unescape("&Iota;")).toBe("Ι");
            expect(string.html_unescape("&Kappa;")).toBe("Κ");
            expect(string.html_unescape("&Lambda;")).toBe("Λ");
            expect(string.html_unescape("&Mu;")).toBe("Μ");
            expect(string.html_unescape("&Nu;")).toBe("Ν");
            expect(string.html_unescape("&Xi;")).toBe("Ξ");
            expect(string.html_unescape("&Omicron;")).toBe("Ο");
            expect(string.html_unescape("&Pi;")).toBe("Π");
            expect(string.html_unescape("&Rho;")).toBe("Ρ");
            expect(string.html_unescape("&Sigma;")).toBe("Σ");
            expect(string.html_unescape("&Tau;")).toBe("Τ");
            expect(string.html_unescape("&Upsilon;")).toBe("Υ");
            expect(string.html_unescape("&Phi;")).toBe("Φ");
            expect(string.html_unescape("&Chi;")).toBe("Χ");
            expect(string.html_unescape("&Psi;")).toBe("Ψ");
            expect(string.html_unescape("&Omega;")).toBe("Ω");
            expect(string.html_unescape("&alpha;")).toBe("α");
            expect(string.html_unescape("&beta;")).toBe("β");
            expect(string.html_unescape("&gamma;")).toBe("γ");
            expect(string.html_unescape("&delta;")).toBe("δ");
            expect(string.html_unescape("&epsilon;")).toBe("ε");
            expect(string.html_unescape("&zeta;")).toBe("ζ");
            expect(string.html_unescape("&eta;")).toBe("η");
            expect(string.html_unescape("&theta;")).toBe("θ");
            expect(string.html_unescape("&iota;")).toBe("ι");
            expect(string.html_unescape("&kappa;")).toBe("κ");
            expect(string.html_unescape("&lambda;")).toBe("λ");
            expect(string.html_unescape("&mu;")).toBe("μ");
            expect(string.html_unescape("&nu;")).toBe("ν");
            expect(string.html_unescape("&xi;")).toBe("ξ");
            expect(string.html_unescape("&omicron;")).toBe("ο");
            expect(string.html_unescape("&pi;")).toBe("π");
            expect(string.html_unescape("&rho;")).toBe("ρ");
            expect(string.html_unescape("&sigmaf;")).toBe("ς");
            expect(string.html_unescape("&sigma;")).toBe("σ");
            expect(string.html_unescape("&tau;")).toBe("τ");
            expect(string.html_unescape("&upsilon;")).toBe("υ");
            expect(string.html_unescape("&phi;")).toBe("φ");
            expect(string.html_unescape("&chi;")).toBe("χ");
            expect(string.html_unescape("&psi;")).toBe("ψ");
            expect(string.html_unescape("&omega;")).toBe("ω");
            expect(string.html_unescape("&thetasym;")).toBe("ϑ");
            expect(string.html_unescape("&upsih;")).toBe("ϒ");
            expect(string.html_unescape("&piv;")).toBe("ϖ");
            expect(string.html_unescape("&Agrave;")).toBe("À");
            expect(string.html_unescape("&Aacute;")).toBe("Á");
            expect(string.html_unescape("&Acirc;")).toBe("Â");
            expect(string.html_unescape("&Atilde;")).toBe("Ã");
            expect(string.html_unescape("&Auml;")).toBe("Ä");
            expect(string.html_unescape("&Aring;")).toBe("Å");
            expect(string.html_unescape("&AElig;")).toBe("Æ");
            expect(string.html_unescape("&Ccedil;")).toBe("Ç");
            expect(string.html_unescape("&Egrave;")).toBe("È");
            expect(string.html_unescape("&Eacute;")).toBe("É");
            expect(string.html_unescape("&Ecirc;")).toBe("Ê");
            expect(string.html_unescape("&Euml;")).toBe("Ë");
            expect(string.html_unescape("&Igrave;")).toBe("Ì");
            expect(string.html_unescape("&Iacute;")).toBe("Í");
            expect(string.html_unescape("&Icirc;")).toBe("Î");
            expect(string.html_unescape("&Iuml;")).toBe("Ï");
            expect(string.html_unescape("&ETH;")).toBe("Ð");
            expect(string.html_unescape("&Ntilde;")).toBe("Ñ");
            expect(string.html_unescape("&Ograve;")).toBe("Ò");
            expect(string.html_unescape("&Oacute;")).toBe("Ó");
            expect(string.html_unescape("&Ocirc;")).toBe("Ô");
            expect(string.html_unescape("&Otilde;")).toBe("Õ");
            expect(string.html_unescape("&Ouml;")).toBe("Ö");
            expect(string.html_unescape("&Oslash;")).toBe("Ø");
            expect(string.html_unescape("&Ugrave;")).toBe("Ù");
            expect(string.html_unescape("&Uacute;")).toBe("Ú");
            expect(string.html_unescape("&Ucirc;")).toBe("Û");
            expect(string.html_unescape("&Uuml;")).toBe("Ü");
            expect(string.html_unescape("&Yacute;")).toBe("Ý");
            expect(string.html_unescape("&THORN;")).toBe("Þ");
            expect(string.html_unescape("&szlig;")).toBe("ß");
            expect(string.html_unescape("&agrave;")).toBe("à");
            expect(string.html_unescape("&aacute;")).toBe("á");
            expect(string.html_unescape("&acirc;")).toBe("â");
            expect(string.html_unescape("&atilde;")).toBe("ã");
            expect(string.html_unescape("&auml;")).toBe("ä");
            expect(string.html_unescape("&aring;")).toBe("å");
            expect(string.html_unescape("&aelig;")).toBe("æ");
            expect(string.html_unescape("&ccedil;")).toBe("ç");
            expect(string.html_unescape("&egrave;")).toBe("è");
            expect(string.html_unescape("&eacute;")).toBe("é");
            expect(string.html_unescape("&ecirc;")).toBe("ê");
            expect(string.html_unescape("&euml;")).toBe("ë");
            expect(string.html_unescape("&igrave;")).toBe("ì");
            expect(string.html_unescape("&iacute;")).toBe("í");
            expect(string.html_unescape("&icirc;")).toBe("î");
            expect(string.html_unescape("&iuml;")).toBe("ï");
            expect(string.html_unescape("&eth;")).toBe("ð");
            expect(string.html_unescape("&ntilde;")).toBe("ñ");
            expect(string.html_unescape("&ograve;")).toBe("ò");
            expect(string.html_unescape("&oacute;")).toBe("ó");
            expect(string.html_unescape("&ocirc;")).toBe("ô");
            expect(string.html_unescape("&otilde;")).toBe("õ");
            expect(string.html_unescape("&ouml;")).toBe("ö");
            expect(string.html_unescape("&oslash;")).toBe("ø");
            expect(string.html_unescape("&ugrave;")).toBe("ù");
            expect(string.html_unescape("&uacute;")).toBe("ú");
            expect(string.html_unescape("&ucirc;")).toBe("û");
            expect(string.html_unescape("&uuml;")).toBe("ü");
            expect(string.html_unescape("&yacute;")).toBe("ý");
            expect(string.html_unescape("&thorn;")).toBe("þ");
            expect(string.html_unescape("&yuml;")).toBe("ÿ");
            expect(string.html_unescape("&iexcl;")).toBe("¡");
            expect(string.html_unescape("&cent;")).toBe("¢");
            expect(string.html_unescape("&pound;")).toBe("£");
            expect(string.html_unescape("&curren;")).toBe("¤");
            expect(string.html_unescape("&yen;")).toBe("¥");
            expect(string.html_unescape("&brvbar;")).toBe("¦");
            expect(string.html_unescape("&sect;")).toBe("§");
            expect(string.html_unescape("&uml;")).toBe("¨");
            expect(string.html_unescape("&copy;")).toBe("©");
            expect(string.html_unescape("&ordf;")).toBe("ª");
            expect(string.html_unescape("&laquo;")).toBe("«");
            expect(string.html_unescape("&not;")).toBe("¬");
            expect(string.html_unescape("&shy;")).toBe("­");
            expect(string.html_unescape("&reg;")).toBe("®");
            expect(string.html_unescape("&macr;")).toBe("¯");
            expect(string.html_unescape("&deg;")).toBe("°");
            expect(string.html_unescape("&plusmn;")).toBe("±");
            expect(string.html_unescape("&sup2;")).toBe("²");
            expect(string.html_unescape("&sup3;")).toBe("³");
            expect(string.html_unescape("&acute;")).toBe("´");
            expect(string.html_unescape("&micro;")).toBe("µ");
            expect(string.html_unescape("&para;")).toBe("¶");
            expect(string.html_unescape("&middot;")).toBe("·");
            expect(string.html_unescape("&cedil;")).toBe("¸");
            expect(string.html_unescape("&sup1;")).toBe("¹");
            expect(string.html_unescape("&ordm;")).toBe("º");
            expect(string.html_unescape("&raquo;")).toBe("»");
            expect(string.html_unescape("&frac14;")).toBe("¼");
            expect(string.html_unescape("&frac12;")).toBe("½");
            expect(string.html_unescape("&frac34;")).toBe("¾");
            expect(string.html_unescape("&iquest;")).toBe("¿");
            expect(string.html_unescape("&times;")).toBe("×");
            expect(string.html_unescape("&divide;")).toBe("÷");
        });
    });

    describe('uri_escape', () => {
        it('should escape special characters in a string for use in a URI', () => {
            expect(string.uri_escape('Hello, World!')).toEqual('Hello%2C%20World%21');
            expect(string.uri_escape('\n\f\r\t\v\b')).toEqual('%0A%0C%0D%09%0B%08');

            /*
            %0A %0C %0D %09 %0B %08 a
            %0A %0C %0D %09 %0B %08 %07
            */
        });

        it('should handle empty strings', () => {
            expect(string.uri_escape('')).toEqual('');
        });

        it('should handle null values', () => {
            expect(string.uri_escape(null)).toEqual('');
        });
    });

    describe('uri_unescape', () => {
        it('should decode percent-encoded strings', () => {
            expect(string.uri_unescape('Hello%20World')).toEqual('Hello World');
            expect(string.uri_unescape('JavaScript%20%E2%98%BA')).toEqual('JavaScript ☺');
        });

        it('should handle empty strings', () => {
            expect(string.uri_unescape('')).toEqual('');
        });

        it('should handle strings without percent-encoded characters', () => {
            expect(string.uri_unescape('No encoding here')).toEqual('No encoding here');
        });

        it('should handle invalid percent-encoded strings', () => {
            expect(string.uri_unescape('Invalid%')).toEqual('Invalid%');
            expect(string.uri_unescape('Invalid%2')).toEqual('Invalid%2');
            expect(string.uri_unescape('Invalid%2G')).toEqual('Invalid%2G');
        });

        it('should handle percent-encoded characters at the beginning and end of the string', () => {
            expect(string.uri_unescape('%20Hello%20World%20')).toEqual(' Hello World ');
        });

        it('should handle multiple percent-encoded characters in the string', () => {
            expect(string.uri_unescape('Hello%20%2B%20World')).toEqual('Hello + World');
        });

        it('should handle percent-encoded characters with leading zeros', () => {
            expect(string.uri_unescape('Hello%20%30%31%32')).toEqual('Hello 012');
        });
    });

    describe('count function', () => {
        it('should return 0 when input string is empty', () => {
            expect(string.count('', 'test')).toBe(0);
        });

        it('should return 0 when substring is empty', () => {
            expect(string.count('test string', '')).toBe(0);
        });

        it('should return 0 when both input string and substring are empty', () => {
            expect(string.count('', '')).toBe(0);
        });

        it('should return 0 when substring is not found in input string', () => {
            expect(string.count('test string', 'abc')).toBe(0);
        });

        it('should return correct count when substring is found in input string', () => {
            expect(string.count('test test test', 'test')).toBe(3);
        });

        it('should return correct count when substring is found in input string (case-insensitive)', () => {
            expect(string.count('Test test TeSt', 'test', flag.CASE_INSENSITIVE)).toBe(3);
        });

        it('should return correct count when substring is found in input string (case-sensitive)', () => {
            expect(string.count('Test test TeSt', 'test', flag.CASE_SENSITIVE)).toBe(1);
        });

        it('should return correct count when substring is found partially in input string', () => {
            expect(string.count('test test test', 'tes')).toBe(3);
        });

        it('should return correct count when substring is found partially in input string (case-insensitive)', () => {
            expect(string.count('Test test TeSt', 'Tes', flag.CASE_INSENSITIVE)).toBe(3);
        });

        it('should return correct count when substring is found partially in input string (case-sensitive)', () => {
            expect(string.count('Test test TeSt', 'Tes', flag.CASE_SENSITIVE)).toBe(1);
        });

        it(`count_00`, () => {
            // count(str, inst, cs = flag.CASE_SENSITIVE)
            expect(string.count(`aa bb aa`, `a`)).toBe(4);
            expect(string.count(`aa bb aa`, `aa`)).toBe(2);
            expect(string.count(`aa bb aa`, `AA`, flag.CASE_INSENSITIVE)).toBe(2);
            expect(string.count(`aa bb aa`, `AA`, flag.CASE_SENSITIVE)).toBe(0);
        });
    });

    describe('string.remove', () => {
        it('removes a specified substring from the string when present', () => {
            expect(string.remove('Hello world', 'world', flag.CASE_SENSITIVE)).toEqual('Hello ');
        });

        it('does not remove anything if the substring is not present and case sensitivity is on', () => {
            expect(string.remove('Hello world', 'World', flag.CASE_SENSITIVE)).toEqual('Hello world');
        });

        it('removes a specified substring case-insensitively when requested', () => {
            expect(string.remove('Hello World', 'world', !flag.CASE_SENSITIVE)).toEqual('Hello ');
        });

        it('returns the original string if the substring is empty', () => {
            expect(string.remove('Hello world', '', flag.CASE_SENSITIVE)).toEqual('Hello world');
        });

        it('returns the original string if the substring is not found', () => {
            expect(string.remove('Hello world', 'xyz', flag.CASE_SENSITIVE)).toEqual('Hello world');
        });

        it('removes all occurrences of the substring', () => {
            expect(string.remove('banana', 'a', flag.CASE_SENSITIVE)).toEqual('bnn');
        });

        it('handles strings with special characters correctly', () => {
            expect(string.remove('1 + 2 = 3', ' + ', flag.CASE_SENSITIVE)).toEqual('12 = 3');
        });

        it('works correctly with substrings at the start or end of the string', () => {
            expect(string.remove('worldHello worldworld', 'world', flag.CASE_SENSITIVE)).toEqual('Hello ');
        });

        it('returns an empty string if the original string is the same as the substring', () => {
            expect(string.remove('world', 'world', flag.CASE_SENSITIVE)).toEqual('');
        });

        it('removes substrings regardless of their position in the string', () => {
            expect(string.remove('start middle end', ' middle ', flag.CASE_SENSITIVE)).toEqual('startend');
        });

        it('is not affected by special regex characters in the substring', () => {
            expect(string.remove('one [two] three', '[two]', flag.CASE_SENSITIVE)).toEqual('one  three');
        });

        it('returns the original string if it is empty', () => {
            expect(string.remove('', 'world', flag.CASE_SENSITIVE)).toEqual('');
        });

        it(`remove_00`, () => {
            // remove(str, inst, cs = flag.CASE_SENSITIVE)
            expect(string.remove(`aa bb aa`, `aa`)).toBe(` bb `);
            expect(string.remove(`aa bb aa`, `a`)).toBe(` bb `);
            expect(string.remove(`aa bb aa`, `AA`, flag.CASE_INSENSITIVE)).toBe(` bb `);
            expect(string.remove(`aa bb aa`, `AA`, flag.CASE_SENSITIVE)).toBe(`aa bb aa`);
        });

    });

    describe('string.printable', () => {
        it('should replace unprintable characters with their printable equivalents', () => {
            // Test case 1: Input string contains unprintable characters
            const input1 = 'Hello\u0007World\u0008';
            const expectedOutput1 = 'Hello[bel]World[bs]';
            expect(string.printable(input1)).toEqual(expectedOutput1);

            // Test case 2: Input string is empty
            const input2 = '';
            const expectedOutput2 = '';
            expect(string.printable(input2)).toEqual(expectedOutput2);

            // Test case 3: Input string contains no unprintable characters
            const input3 = 'Hello World';
            const expectedOutput3 = 'Hello[sp]World';
            expect(string.printable(input3)).toEqual(expectedOutput3);
        });

        it('should handle edge cases', () => {
            // Test case 1: Input string is null
            const input1 = null;
            const expectedOutput1 = null;
            expect(string.printable(input1)).toEqual(expectedOutput1);

            // Test case 2: Input string contains special characters
            const input2 = 'Special\u0007Characters\u0008';
            const expectedOutput2 = 'Special[bel]Characters[bs]';
            expect(string.printable(input2)).toEqual(expectedOutput2);
        });

        it(`printable_00`, () => {
            const map = {
                '\u0007': '[bel]', '\u0008': '[bs]', '\u0009': '[ht]', '\u000A': '[lf]', '\u000B': '[vt]', '\u000C': '[ff]', '\u000D': '[cr]', '\u0020': '[sp]',
                '\u00A0': '[nbsp]', '\u2028': '[lsep]', '\u2029': '[psep]', '\uFDD0': '[json_invalid]', '\uFDD1': '[json_object]', '\uFDD2': '[json_array]',
                '\uFDD2': '[json_array]', '\uFDD3': '[json_number]', '\uFDD4': '[json_string]', '\uFDD5': '[json_null]', '\uFDD6': '[json_true]',
                '\uFDD7': '[json_false]', '\uFDD8': '[json_delete]'
            };

            const keys = Object.keys(map);
            for (let i = 0; i < keys.length; ++i) {
                expect(string.printable(keys[i])).toBe(map[keys[i]]);
            }
        });
    });

    describe('string.is_literal_prefix', () => {
        it('should return true for valid literal prefixes', () => {
            // Test cases for valid literal prefixes
            expect(string.is_literal_prefix('u8')).toBe(true);
            expect(string.is_literal_prefix('U')).toBe(true);
            expect(string.is_literal_prefix('R')).toBe(true);
        });

        it('should return false for non-literal prefixes', () => {
            // Test cases for non-literal prefixes
            expect(string.is_literal_prefix('0')).toBe(false);
            expect(string.is_literal_prefix('x')).toBe(false);
            expect(string.is_literal_prefix('0x0')).toBe(false);
        });

        it('should return false for empty or undefined input', () => {
            // Test cases for empty or undefined input
            expect(string.is_literal_prefix('')).toBe(false);
            expect(string.is_literal_prefix(undefined)).toBe(false);
        });

        it(`is_literal_prefix_00`, () => {
            expect(string.is_literal_prefix(`u8`)).toBeTrue();
            expect(string.is_literal_prefix(`U`)).toBeTrue();
            expect(string.is_literal_prefix(`L`)).toBeTrue();
            expect(string.is_literal_prefix(`R`)).toBeTrue();
        });
    });

    describe('string.starts_with_one_of', () => {
        it('should return true if the string starts with any of the characters in the set', () => {
            expect(string.starts_with_one_of('hello', 'hH')).toBe(true);
            expect(string.starts_with_one_of('world', 'wW')).toBe(true);
        });

        it('should return false if the string does not start with any of the characters in the set', () => {
            expect(string.starts_with_one_of('hello', 'xX')).toBe(false);
            expect(string.starts_with_one_of('world', 'xX')).toBe(false);
        });

        it('should handle case-insensitive search when the flag is set', () => {
            expect(string.starts_with_one_of('hello', 'H', flag.CASE_INSENSITIVE)).toBe(true);
            expect(string.starts_with_one_of('world', 'W', flag.CASE_INSENSITIVE)).toBe(true);
        });

        it('should return false for empty or undefined input', () => {
            expect(string.starts_with_one_of('', 'hH')).toBe(false);
            expect(string.starts_with_one_of('hello', '')).toBe(false);
            expect(string.starts_with_one_of(undefined, 'hH')).toBe(false);
        });

        it(`starts_with_one_of_00`, () => {
            expect(string.starts_with_one_of(``, ``)).toBeFalse();
            expect(string.starts_with_one_of(``, ``, flag.CASE_INSENSITIVE)).toBeFalse();
            expect(string.starts_with_one_of(`a`, `a`)).toBeTrue();
            expect(string.starts_with_one_of(`adfsdfsdf`, `a`)).toBeTrue();
            expect(string.starts_with_one_of(`Adfsdfsdf`, `a`)).toBeFalse();
            expect(string.starts_with_one_of(`Adfsdfsdf`, `a`, flag.CASE_INSENSITIVE)).toBeTrue();
        });
    });

    // Test suite for string.is_inf
    describe('string.is_inf', () => {
        it('should return true for valid infinity representations', () => {
            expect(string.is_inf('Infinity')).toBe(true);
            expect(string.is_inf('-Infinity')).toBe(true);
            expect(string.is_inf('inf')).toBe(true);
            expect(string.is_inf('-inf')).toBe(true);
        });

        it('should return false for non-infinity values', () => {
            expect(string.is_inf('10')).toBe(false);
            expect(string.is_inf('NaN')).toBe(false);
            expect(string.is_inf('abc')).toBe(false);
        });

        it('should handle empty or undefined input', () => {
            expect(string.is_inf('')).toBe(false);
            expect(string.is_inf(undefined)).toBe(false);
        });

        it(`is_inf_00`, () => {
            expect(string.is_inf(`inf`)).toBeTrue();
            expect(string.is_inf(`-inf`)).toBeTrue();
            expect(string.is_inf(`Infinity`)).toBeTrue();
            expect(string.is_inf(`-Infinity`)).toBeTrue();
        });
    });

    // Test suite for string.is_bin
    describe('string.is_bin', () => {
        it('should return true for valid binary representations', () => {
            expect(string.is_bin('0b101010')).toBe(true);
            expect(string.is_bin('0b0')).toBe(true);
            expect(string.is_bin('0b11110000')).toBe(true);
        });

        it('should return false for non-binary values', () => {
            expect(string.is_bin('2')).toBe(false);
            expect(string.is_bin('abc')).toBe(false);
            expect(string.is_bin('')).toBe(false);
        });

        it('should handle empty or undefined input', () => {
            expect(string.is_bin('')).toBe(false);
            expect(string.is_bin(undefined)).toBe(false);
        });

        it(`is_bin_00`, () => {
            expect(string.is_bin(`0b1`)).toBeTrue();
            expect(string.is_bin(`0B101`)).toBeTrue();
            expect(string.is_bin(`0b101'011`)).toBeTrue();
        });
    });

    // Test suite for string.is_oct
    describe('string.is_oct', () => {
        it('should return true for valid octal representations', () => {
            expect(string.is_oct('0123')).toBe(true);
            expect(string.is_oct('0755')).toBe(true);
            expect(string.is_oct('00')).toBe(true);
        });

        it('should return false for non-octal values', () => {
            expect(string.is_oct('8')).toBe(false);
            expect(string.is_oct('abc')).toBe(false);
            expect(string.is_oct('')).toBe(false);
        });

        it('should handle empty or undefined input', () => {
            expect(string.is_oct('')).toBe(false);
            expect(string.is_oct(undefined)).toBe(false);
        });

        it(`is_oct_00`, () => {
            expect(string.is_oct(`a`)).toBeFalse();
            expect(string.is_oct(`067`)).toBeTrue();
            expect(string.is_oct(`467`)).toBeFalse();
            expect(string.is_oct(`05a`)).toBeFalse();
        });
    });

    // Test suite for string.is_integer
    describe('string.is_integer', () => {
        it('should return true for valid integer representations', () => {
            expect(string.is_integer('123')).toBe(true);
            expect(string.is_integer('0')).toBe(true);
            expect(string.is_integer('-456')).toBe(true);
        });

        it('should return false for non-integer values', () => {
            expect(string.is_integer('12.34')).toBe(false);
            expect(string.is_integer('abc')).toBe(false);
            expect(string.is_integer('')).toBe(false);
        });

        it('should handle empty or undefined input', () => {
            expect(string.is_integer('')).toBe(false);
            expect(string.is_integer(undefined)).toBe(false);
        });
    });

    // Test suite for string.is_hex
    describe('string.is_hex', () => {
        it('should return true for valid hexadecimal representations', () => {
            expect(string.is_hex('0x1A2B3C')).toBe(true);
            expect(string.is_hex('0xFF')).toBe(true);
            expect(string.is_hex('0x123abc')).toBe(true);
        });

        it('should return false for non-hexadecimal values', () => {
            expect(string.is_hex('12.34')).toBe(false);
            expect(string.is_hex('GHIJKL')).toBe(false);
            expect(string.is_hex('')).toBe(false);
        });

        it('should handle empty or undefined input', () => {
            expect(string.is_hex('')).toBe(false);
            expect(string.is_hex(undefined)).toBe(false);
        });

        it(`is_hex_00`, () => {
            expect(string.is_hex(`0x1`)).toBeTrue();
            expect(string.is_hex(`0x45`)).toBeTrue();
            expect(string.is_hex(`0xa`)).toBeTrue();
            expect(string.is_hex(`0xAF`)).toBeTrue();

            expect(string.is_hex(`0xAFp6`)).toBeTrue();
        });
    });

    // Test suite for string.is_float
    describe('string.is_float', () => {
        it('should return true for valid floating-point representations', () => {
            expect(string.is_float('3.14')).toBe(true);
            expect(string.is_float('0.123')).toBe(true);
            expect(string.is_float('-2.5')).toBe(true);
            expect(string.is_float('1e3')).toBe(true);
            expect(string.is_float('1.23e-4')).toBe(true);
            expect(string.is_float('0x1.2p3')).toBe(true);
        });

        it('should return false for non-floating-point values', () => {
            expect(string.is_float('12')).toBe(false);
            expect(string.is_float('abc')).toBe(false);
            expect(string.is_float('1.2.3')).toBe(false);
            expect(string.is_float('1.23e4.5')).toBe(false);
        });

        it('should handle empty or undefined input', () => {
            expect(string.is_float('')).toBe(false);
            expect(string.is_float(undefined)).toBe(false);
        });

        it(`is_float_00`, () => {
            expect(string.is_float(`1f`)).toBeTrue();
            expect(string.is_float(`.0`)).toBeTrue();
            expect(string.is_float(`3.7`)).toBeTrue();
            expect(string.is_float(`1E7`)).toBeTrue();
            expect(string.is_float(`1E-7`)).toBeTrue();
            expect(string.is_float(`1E+7`)).toBeTrue();
            expect(string.is_float(`1.e+7`)).toBeTrue();
            expect(string.is_float(`58.`)).toBeTrue();
            expect(string.is_float(`4e2`)).toBeTrue();
            expect(string.is_float(`123.456e-67`)).toBeTrue();
            expect(string.is_float(`.1E4f`)).toBeTrue();
            expect(string.is_float(`1e-5L`)).toBeTrue();
            expect(string.is_float(`6.`)).toBeTrue();
            expect(string.is_float(`0x1.FFFFFEp+62`)).toBeTrue();
            expect(string.is_float(`0x3.14p+0`)).toBeTrue();

            expect(string.is_float(`0xff`)).toBeFalse();
            expect(string.is_float(`3.14e+0a`)).toBeFalse();
            expect(string.is_float(`1`)).toBeFalse();
        });
    });

    // Test suite for string.is_numb
    describe('string.is_numb', () => {
        it('should return true for valid numeric representations', () => {
            expect(string.is_numb('123')).toBe(true);
            expect(string.is_numb('3.14')).toBe(true);
            expect(string.is_numb('0b1010')).toBe(true); // binary representation
            expect(string.is_numb('0755')).toBe(true); // octal representation
            expect(string.is_numb('0x1F')).toBe(true); // hexadecimal representation
            expect(string.is_numb('1e3')).toBe(true); // scientific notation
            expect(string.is_numb('1.23e-4')).toBe(true); // scientific notation with decimal
        });

        it('should return false for non-numeric values', () => {
            expect(string.is_numb('abc')).toBe(false);
            expect(string.is_numb('1.2.3')).toBe(false);
            expect(string.is_numb('1.23e4.5')).toBe(false);
        });

        it('should handle empty or undefined input', () => {
            expect(string.is_numb('')).toBe(false);
            expect(string.is_numb(undefined)).toBe(false);
        });

        it(`is_numb_00`, () => {
            let test = [`1`, `0`, `1'000`, `6ull`, `-8ll`, `18'446'744'073'709'550'592ll`, `1844'6744'0737'0955'0592uLL`, `184467'440737'0'95505'92LL`];
            for (let it = 0; it < test.length; ++it)
                expect(string.is_numb(test[it])).toBeTrue();

            test = [`1f`, `.0`, `3.7`, `3.14`, `1E7`, `1E-7`, `1E+7`, `1.e+7`, `58.`, `4e2`, `123.456e-67`, `.1E4f`, `1e-5L`];
            for (let it = 0; it < test.length; ++it)
                expect(string.is_numb(test[it])).toBeTrue();

            test = [`0x0`, `0x1ffp10`, `0x0p-1`, `0x1.p0`, `0xf.p-1`, `0x1.2p3`, `0x1.ap3`, `0x1.2ap3`, `0x1p+3`, `0x1p+3f`, `0x1p+3L`, `0xff`];
            for (let it = 0; it < test.length; ++it)
                expect(string.is_numb(test[it])).toBeTrue();

            test = [`01`];
            for (let it = 0; it < test.length; ++it)
                expect(string.is_numb(test[it])).toBeTrue();

            test = [`0b1`, `0B101`, `0b101'011`];
            for (let it = 0; it < test.length; ++it)
                expect(string.is_numb(test[it])).toBeTrue();

            test = [`+x`, `2=`, `x)`, `a7.77`];
            for (let it = 0; it < test.length; ++it)
                expect(string.is_numb(test[it])).toBeFalse();

        });
    });

    // Test suite for string.is_name
    describe('string.is_name', () => {
        it('should return true for valid names', () => {
            expect(string.is_name('validName')).toBe(true);
            expect(string.is_name('another_valid_name')).toBe(true);
        });

        it('should return false for invalid names', () => {
            expect(string.is_name('!invalid name')).toBe(false);
            expect(string.is_name('123name')).toBe(false);
        });

        it('should handle empty or undefined input', () => {
            expect(string.is_name('')).toBe(false);
            expect(string.is_name(undefined)).toBe(false);
        });

        it(`is_name_00`, () => {
            let test = [`a`, `something`, `_other`];
            for (let it = 0; it < test.length; ++it)
                expect(string.is_name(test[it])).toBeTrue();

            test = [`+x`, `2=`, `x)`];
            for (let it = 0; it < test.length; ++it)
                expect(string.is_name(test[it])).toBeFalse();
        });
    });

    // Test suite for string.is_operator
    describe('string.is_operator', () => {
        it('should return true for valid operators', () => {
            expect(string.is_operator('+')).toBe(true);
            expect(string.is_operator('-')).toBe(true);
        });

        it('should return false for invalid operators', () => {
            expect(string.is_operator('')).toBe(false);
            expect(string.is_operator('abc')).toBe(false);
        });

        it('should handle special characters', () => {
            expect(string.is_operator('*')).toBe(true);
            expect(string.is_operator('/')).toBe(true);
        });

        it(`is_operator_00`, () => {
            let test = [
                `(`, `)`, `[`, `]`, `!`, `~`, `++`, `--`, `*`, `/`, `%`, `-`, `+`, `<<`, `>>`, `<`, `<=`, `>`, `>=`, `==`, `!=`, `&`, `^`, `|`, `||`,
                `&&`, `=`, `+=`, `-=`, `*=`, `/=`, `%=`, `::`, `.`, `->`, `.*`, `->*`, `>>=`, `<<=`, `&=`, `^=`, `|=`, `?`, `:`, `,`, `#`, `##`
            ];
            for (let it = 0; it < test.length; ++it) {
                if (!string.is_operator(test[it])) console.log(test[it]);
                expect(string.is_operator(test[it])).toBeTrue();
            }


            test = [`+x`, `2=`, `x)`];
            for (let it = 0; it < test.length; ++it)
                expect(string.is_operator(test[it])).toBeFalse();
        });
    });

    // Test suite for string.is_comment
    describe('string.is_comment', () => {
        it('should return true for valid comments', () => {
            expect(string.is_comment('// This is a comment')).toBe(true);
            expect(string.is_comment('/* This is a multi-line comment */')).toBe(true);
        });

        it('should return false for invalid comments', () => {
            expect(string.is_comment('')).toBe(false);
            expect(string.is_comment('not a comment')).toBe(false);
        });

        it('should handle edge cases', () => {
            expect(string.is_comment('/*')).toBe(false);
            expect(string.is_comment('//')).toBe(true);
        });

        it(`is_comment_00`, () => {
            let test = [`//a`, `/* comment */`];
            for (let it = 0; it < test.length; ++it) {
                if (!string.is_comment(test[it])) console.log(test[it]);
                expect(string.is_comment(test[it])).toBeTrue();
            }

            test = [`+x`, `2=`, `x)`];
            for (let it = 0; it < test.length; ++it)
                expect(string.is_comment(test[it])).toBeFalse();
        });
    });

    // Test suite for string.is_key
    describe('string.is_key', () => {
        it('should return true for valid keys', () => {
            expect(string.is_key('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
            expect(string.is_key('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
        });

        it('should return false for invalid keys', () => {
            expect(string.is_key('not a key')).toBe(false);
            expect(string.is_key('12345')).toBe(false);
        });

        it('should handle edge cases', () => {
            expect(string.is_key('')).toBe(false);
            expect(string.is_key(null)).toBe(false);
        });
    });

    // Test suite for string.is_valide_token
    describe('string.is_valide_token', () => {
        it('should return false for an empty string', () => {
            expect(string.is_valide_token('')).toBe(false);
        });

        it('should return true for a valid name', () => {
            expect(string.is_valide_token('variable')).toBe(true);
        });

        it('should return true for a valid number', () => {
            expect(string.is_valide_token('123')).toBe(true);
        });

        it('should return true for a valid operator', () => {
            expect(string.is_valide_token('+')).toBe(true);
        });

        it('should return true for a valid comment', () => {
            expect(string.is_valide_token('// This is a comment')).toBe(true);
        });

        it('should return false for an invalid token', () => {
            expect(string.is_valide_token('invalid token')).toBe(false);
        });

        it(`is_valide_token_00`, () => {
            let test = [
                `1`, `0`, `1'000`, `6ull`, `-8ll`, `18'446'744'073'709'550'592ll`, `1844'6744'0737'0955'0592uLL`, `184467'440737'0'95505'92LL`,
                `1f`, `.0`, `3.7`, `1E7`, `1E-7`, `1E+7`, `1.e+7`, `58.`, `4e2`, `123.456e-67`, `.1E4f`, `1e-5L`,
                `0x0`, `0x1ffp10`, `0x0p-1`, `0x1.p0`, `0xf.p-1`, `0x1.2p3`, `0x1.ap3`, `0x1.2ap3`, `0x1p+3`, `0x1p+3f`, `0x1p+3L`, `0xff`,
                `01`,
                `0b1`, `0B101`, `0b101'011`,
                `a`, `something`, `_other`, `e2343`,
                `(`, `)`, `[`, `]`, `!`, `~`, `++`, `--`, `*`, `/`, `%`, `-`, `+`, `<<`, `>>`, `<`, `<=`, `>`, `>=`, `==`, `!=`, `&`, `^`, `|`, `||`,
                `&&`, `=`, `+=`, `-=`, `*=`, `/=`, `%=`, `::`, `.`, `->`, `.*`, `->*`, `>>=`, `<<=`, `&=`, `^=`, `|=`, `?`, `:`, `,`, `#`, `##`,
                `//a`, `/* comment */`
            ];
            for (let it = 0; it < test.length; ++it)
                expect(string.is_valide_token(test[it])).toBeTrue();

            test = [`+x`, `2=`, `x)`];
            for (let it = 0; it < test.length; ++it)
                expect(string.is_valide_token(test[it])).toBeFalse();
        });
    });

    // Test suite for string.is_percent
    describe('string.is_percent', () => {
        it('should return true for valid percentage strings', () => {
            expect(string.is_percent('50%')).toBe(true);
            expect(string.is_percent('-50%')).toBe(true);
            expect(string.is_percent('0.5%')).toBe(true);
            expect(string.is_percent('-0.5%')).toBe(true);
        });

        it('should return false for invalid percentage strings', () => {
            expect(string.is_percent('50')).toBe(false);
            expect(string.is_percent('50.5')).toBe(false);
            expect(string.is_percent('-50')).toBe(false);
            expect(string.is_percent('-50.5')).toBe(false);
            expect(string.is_percent('50.%')).toBe(false);
            expect(string.is_percent('.5%')).toBe(false);
            expect(string.is_percent('50.%')).toBe(false);
            expect(string.is_percent('50.%')).toBe(false);
            expect(string.is_percent('50%%')).toBe(false);
            expect(string.is_percent('50.5%%')).toBe(false);
        });

        it('should return false for empty input string', () => {
            expect(string.is_percent('')).toBe(false);
        });
    });

    // Test suite for string.last_char
    describe('string.last_char', () => {
        it('should return the last character of the input string', () => {
            expect(string.last_char('hello')).toBe('o');
        });

        it('should return an empty string for an empty input', () => {
            expect(string.last_char('')).toBe('');
        });

        it('should return the only character for a single-character input', () => {
            expect(string.last_char('a')).toBe('a');
        });

        it('should return the last character for a string with special characters', () => {
            expect(string.last_char('abc!@#')).toBe('#');
        });
    });

    // Test suite for string.uid
    describe('string.uid', () => {
        it('should generate a unique identifier (UID) using alphanumeric characters', () => {
            const uid = string.uid();
            expect(typeof uid).toBe('string');
            expect(uid.length).toBeGreaterThan(0);
        });

        it('should generate a unique identifier that does not match any of the reserved keywords', () => {
            const reservedKeywords = [`EOF`, `PI`, `Pop`, `do`, `for`, `if`, `key`];
            const uid = string.uid();
            expect(reservedKeywords.includes(uid)).toBe(false);
        });

        it('should generate a unique identifier for multiple invocations', () => {
            const uid1 = string.uid();
            const uid2 = string.uid();
            expect(uid1).not.toEqual(uid2);
        });
    });

    // Test suite for string.replace_at
    describe('string.replace_at', () => {
        it('should replace a character at the specified index in the input string', () => {
            const originalStr = 'hello';
            const modifiedStr = string.replace_at(originalStr, 1, 'a');
            expect(modifiedStr).toBe('hallo');
        });

        it('should handle replacing the last character in the string', () => {
            const originalStr = 'world';
            const modifiedStr = string.replace_at(originalStr, 4, 'c');
            expect(modifiedStr).toBe('worlc');
        });

        it('should handle an empty input string', () => {
            const originalStr = '';
            const modifiedStr = string.replace_at(originalStr, 0, 'a');
            expect(modifiedStr).toBe('a');
        });

        it('should handle replacing a character at index 0', () => {
            const originalStr = 'test';
            const modifiedStr = string.replace_at(originalStr, 0, 'T');
            expect(modifiedStr).toBe('Test');
        });
    });

    // Test suite for string.clip
    describe('string.clip', () => {
        it('should extract a substring from the input string, excluding the first and last characters', () => {
            const inputStr = 'example';
            const clippedStr = string.clip(inputStr);
            expect(clippedStr).toBe('xampl');
        });

        it('should handle an empty input string', () => {
            const inputStr = '';
            const clippedStr = string.clip(inputStr);
            expect(clippedStr).toBe('');
        });

        it('should handle a single-character input string', () => {
            const inputStr = 'a';
            const clippedStr = string.clip(inputStr);
            expect(clippedStr).toBe('a');
        });

        it('should handle a two-character input string', () => {
            const inputStr = 'ab';
            const clippedStr = string.clip(inputStr);
            expect(clippedStr).toBe('');
        });
    });

    // Test suite for string.format_b64
    xdescribe('string.format_b64', () => {
        it('should add padding characters to make the length a multiple of 4', () => {
            const inputStr = 'SGVsbG8=';
            const formattedStr = string.format_b64(inputStr);
            expect(formattedStr).toBe('SGVsbG8=');
        });

        it('should handle an empty input string', () => {
            const inputStr = '';
            const formattedStr = string.format_b64(inputStr);
            expect(formattedStr).toBe('');
        });

        it('should handle a Base64 string with no padding', () => {
            const inputStr = 'SGVsbG8';
            const formattedStr = string.format_b64(inputStr);
            expect(formattedStr).toBe('SGVsbG8=');
        });

        it('should handle a Base64 string with one padding character', () => {
            const inputStr = 'SGVsbG8=';
            const formattedStr = string.format_b64(inputStr);
            expect(formattedStr).toBe('SGVsbG8=');
        });

        it('should handle a Base64 string with two padding characters', () => {
            const inputStr = 'SGVsbG8==';
            const formattedStr = string.format_b64(inputStr);
            expect(formattedStr).toBe('SGVsbG8==');
        });

        it('should handle a Base64 string with three padding characters', () => {
            const inputStr = 'SGVsbG8===';
            const formattedStr = string.format_b64(inputStr);
            expect(formattedStr).toBe('SGVsbG8===');
        });
    });

    // Test suite for string.index_of
    describe('string.index_of', () => {
        it('should find the index of the first occurrence of a pattern within a string', () => {
            const inputStr = 'Hello, world!';
            const pattern = 'world';
            const index = string.index_of(inputStr, pattern);
            expect(index).toBe(7);
        });

        it('should handle the case when the pattern is not found', () => {
            const inputStr = 'Hello, world!';
            const pattern = 'universe';
            const index = string.index_of(inputStr, pattern);
            expect(index).toBe(-1);
        });

        it('should start the search from the specified position', () => {
            const inputStr = 'Hello, world!';
            const pattern = 'o';
            const start = 5;
            const index = string.index_of(inputStr, pattern, start);
            expect(index).toBe(8);
        });

        it('should handle an empty input string', () => {
            const inputStr = '';
            const pattern = 'pattern';
            const index = string.index_of(inputStr, pattern);
            expect(index).toBe(-1);
        });

        it('should handle an empty pattern', () => {
            const inputStr = 'Hello, world!';
            const pattern = '';
            const index = string.index_of(inputStr, pattern);
            expect(index).toBe(0);
        });

        it('should handle the case when the start position is beyond the string length', () => {
            const inputStr = 'Hello, world!';
            const pattern = 'world';
            const start = 20;
            const index = string.index_of(inputStr, pattern, start);
            expect(index).toBe(-1);
        });
    });

    // Test suite for the last_index_of method of the string class
    xdescribe('string.last_index_of', () => {
        it('should return the correct index of the last occurrence of the pattern within the string', () => {
            // Test with a simple string and pattern
            expect(string.last_index_of('hello world', 'o')).toBe(7);
            // Test with a more complex string and pattern
            expect(string.last_index_of('abracadabra', 'a')).toBe(9);
        });

        it('should handle the case when the pattern is not found in the string', () => {
            // Test with a pattern that does not exist in the string
            expect(string.last_index_of('hello world', 'z')).toBe(-1);
        });

        it('should handle the case when the end position is specified', () => {
            // Test with a specific end position
            expect(string.last_index_of('hello world', 'o', 5)).toBe(4);
        });

        it('should handle the case when the end position is beyond the length of the string', () => {
            // Test with an end position beyond the length of the string
            expect(string.last_index_of('hello world', 'o', 20)).toBe(7);
        });

        it('should handle the case when the string is empty', () => {
            // Test with an empty string
            expect(string.last_index_of('', 'o')).toBe(-1);
        });

        it('should handle the case when the pattern is empty', () => {
            // Test with an empty pattern
            expect(string.last_index_of('hello world', '')).toBe(-1);
        });
    });

    // Test suite for the uuid method of the string class
    describe('string.uuid', () => {
        it('should return a string with the correct length', () => {
            const uid = string.uuid();
            expect(typeof uid).toBe('string');
            expect(uid.length).toBeGreaterThan(0);
        });

        it('should return a unique identifier', () => {
            const uid1 = string.uuid();
            const uid2 = string.uuid();
            expect(uid1).not.toEqual(uid2);
        });

    });

});

describe('ucs2.decode', () => {
    xdescribe('ucs2.decode', () => {
        it('should decode a string into a Uint8Array', () => {
            // Test basic string decoding
            expect(ucs2.decode('Hello')).toEqual(new Uint8Array([72, 101, 108, 108, 111]));

            // Test decoding with surrogate pairs
            console.log(ucs2.decode('\uD83D\uDE00'));
            expect(ucs2.decode('\uD83D\uDE00')).toEqual(new Uint8Array([240, 159, 152, 128]));

            // Test empty string
            expect(ucs2.decode('')).toEqual(new Uint8Array());

            // Test string with only surrogate pairs
            expect(ucs2.decode('\uD83D\uDCA9')).toEqual(new Uint8Array([240, 159, 146, 169]));

            // Test string with only non-surrogate characters
            expect(ucs2.decode('Test')).toEqual(new Uint8Array([84, 101, 115, 116]));

            // Test string with mixed surrogate and non-surrogate characters
            expect(ucs2.decode('A\uD83D\uDE00B')).toEqual(new Uint8Array([65, 240, 159, 152, 128, 66]));
        });

        it('should handle edge cases', () => {
            // Test string with maximum code point
            expect(ucs2.decode(String.fromCodePoint(0x10FFFF))).toEqual(new Uint8Array([240, 144, 128, 128]));

            // Test string with minimum code point
            expect(ucs2.decode(String.fromCodePoint(0))).toEqual(new Uint8Array([0]));

            // Test string with multiple surrogate pairs
            expect(ucs2.decode('\uD83D\uDE00\uD83D\uDE01')).toEqual(new Uint8Array([240, 159, 152, 128, 240, 159, 152, 129]));
        });
    });
});


describe(`u8`, () => {
    it(`construction`, () => {

    });
});