import { flag } from "../../lib/global.js";
import { type_error } from "../../lib/error.js";
import { location } from '../../lib/source/location.js';
import { message } from '../../lib/source/message.js';
import { eval_token, token } from "../../lib/source/token.js";
import { uris } from "../../lib/system/uris.js";


describe('token', () => {
	/**/
	beforeEach(() => {
		//macros.clear();
		uris.clear();
	});

	afterEach(() => {
		message.print();
		message.clear();
	});

	//it('fail', () => { expect(false).toBeTrue();});

	it(`constructor_new_00`, () => {
		let a = new token();
		expect(a.str).toBe(``);
		expect(a.flag).toBe(0);
		expect(a.op).toBe(``);
		expect(a.loc).toEqual(new location());
	});

	it(`constructor_string_00`, () => {
		let a = new token(`define`);
		expect(a.str).toBe(`define`);
		expect(a.flag).toBe(flag.NAME_FLAG);
		expect(a.op).toBe(``);
		expect(a.loc).toEqual(new location());
	});

	it(`constructor_copy_00`, () => {
		let a = new token(`define`);
		let b = new token(a);
		expect(b.str).toBe(`define`);
		expect(b.flag).toBe(flag.NAME_FLAG);
		expect(b.op).toBe(``);
		expect(b.loc).toEqual(new location());
	});

	it(`flag_00`, () => {
		let a = new token(`+`);
		expect(a.flag & flag.SYMBOL_FLAG).toBe(flag.SYMBOL_FLAG);

		a.str = `something`;
		expect(a.flag & flag.SYMBOL_FLAG).toBe(0);
	});

	it(`flag_01`, () => {
		let a = new token(`ifdef`);
		expect(a.flag & flag.NAME_FLAG).toBe(flag.NAME_FLAG);

	});

	it('flag_02', () => {
		let a = new token(`A`);
		expect(a.flag & flag.NAME_FLAG).toBe(flag.NAME_FLAG);
	});

	it('flag_02', () => {
		let a = new token(`;`);
		expect(a.flag & flag.SYMBOL_FLAG).toBe(flag.SYMBOL_FLAG);
	});

	it(`flag_number_00`, () => {
		let b = new token(`0U`);
		expect(b.str).toBe(`0U`);
		expect(b.flag & flag.NUMBER_FLAG).toBe(flag.NUMBER_FLAG);
		expect(b.op).toBe(``);

		b.str = `-8ll`;
		expect(b.str).toBe(`-8ll`);
		expect(b.flag & flag.NUMBER_FLAG).toBe(flag.NUMBER_FLAG);
		expect(b.op).toBe(``);

		b.str = `-.3`;
		expect(b.str).toBe(`-.3`);
		expect(b.flag & flag.NUMBER_FLAG).toBe(flag.NUMBER_FLAG);
		expect(b.op).toBe(``);

		b.str = `1E-7`;
		expect(b.str).toBe(`1E-7`);
		expect(b.flag & flag.NUMBER_FLAG).toBe(flag.NUMBER_FLAG);
		expect(b.op).toBe(``);

		b.str = `NaN`;
		expect(b.str).toBe(`NaN`);
		//console.log(flag.to_string(b.flag));
		expect(b.flag & flag.NUMBER_FLAG).toBe(flag.NUMBER_FLAG);
		expect(b.op).toBe(``);
	});

	it(`flag_name_00`, () => {
		let b = new token(`a`);
		expect(b.str).toBe(`a`);
		expect(b.flag).toBe(flag.NAME_FLAG);
		expect(b.op).toBe(`a`);

		b.str = `tre34`;
		expect(b.str).toBe(`tre34`);
		expect(b.flag).toBe(flag.NAME_FLAG);
		expect(b.op).toBe(``);

		b.str = `.tre34`;
		expect(b.str).toBe(`.tre34`);
		expect(b.flag).toBe(0);
		expect(b.op).toBe(``);
	});

	it(`flag_comment_00`, () => {
		let b = new token(`//a`);
		expect(b.str).toBe(`//a`);
		expect(b.flag).toBe(flag.COMMENT_FLAG);
		expect(b.op).toBe(``);

		b.str = `/* comment */`;
		expect(b.str).toBe(`/* comment */`);
		expect(b.flag).toBe(flag.COMMENT_FLAG);
		expect(b.op).toBe(``);

	});

	it(`flag_operator_lsl_00`, () => {
		let list = [`(`, `)`, `[`, `]`, `!`, `~`, `++`, `--`, `*`, `/`, `%`, `-`, `+`, `<<`, `>>`, `<`,
			`<=`, `>`, `>=`, `==`, `!=`, `&`, `^`, `|`, `||`, `&&`, `=`, `+=`, `-=`, `*=`, `/=`, `%=`
		];
		let a = new token();

		for (let i = 0, count = list.length; i < count; ++i) {
			a.str = list[i];
			expect(a.str).toBe(list[i]);
			expect(a.flag).toBe(flag.SYMBOL_FLAG);

			if (list[i].length == 1)
				expect(a.op).toBe(list[i]);
		}

	});

	it(`flag_operator_cpp_00`, () => {
		let list = [`::`, `++`, `--`, `(`, `)`, `[`, `]`, `.`, `->`, `~`, `!`, `+`, `-`, `&`, `*`, `.*`, `->*`, `*`,
			`/`, `%`, `<<`, `>>`, `<`, `>`, `<=`, `>=`, `==`, `!=`, `&`, `^`, `|`, `&&`, `||`, `=`, `*=`, `/=`, `%=`, `+=`,
			`-=`, `>>=`, `<<=`, `&=`, `^=`, `|=`, `?`, `:`, `,`
		];
		let a = new token();

		for (let i = 0, count = list.length; i < count; ++i) {
			a.str = list[i];
			expect(a.str).toBe(list[i]);
			expect(a.flag).toBe(flag.SYMBOL_FLAG);

			if (list[i].length == 1)
				expect(a.op).toBe(list[i]);
		}

	});

	it(`flag_operator_pre_00`, () => {
		let list = [`#`, `##`];
		let a = new token();

		for (let i = 0, count = list.length; i < count; ++i) {
			a.str = list[i];
			expect(a.str).toBe(list[i]);
			expect(a.flag).toBe(flag.SYMBOL_FLAG);

			if (list[i].length == 1)
				expect(a.op).toBe(list[i]);
		}

	});

	
	/**/
});

describe("Token class", () => {
    let loc1, loc2, loc3;

    beforeEach(() => {
        loc1 = new location("file1.js", 1, 1);
        loc2 = new location("file2.js", 2, 1);
        loc3 = new location("file1.js", 1, 10);
    });

    describe("Constructor", () => {
        it("should initialize with a string", () => {
            const tok = new token("test", loc1);
            expect(tok.str).toBe("test");
            expect(tok.loc).toEqual(loc1);
        });

        it("should initialize with another token", () => {
            const tok1 = new token("test", loc1);
            const tok2 = new token(tok1);
            expect(tok2.str).toBe("test");
            expect(tok2.loc).toEqual(loc1);
        });

        it("should throw an error if initialized with non-string or non-token", () => {
            expect(() => new token(123)).toThrowError(type_error, "token: try to create token from a: number");
        });
    });

    describe("Setters and Getters", () => {
        let tok;

        beforeEach(() => {
            tok = new token("initial", loc1);
        });

        it("should set and get the string value", () => {
            tok.str = "new value";
            expect(tok.str).toBe("new value");
        });

        it("should throw an error when setting string to non-string", () => {
            expect(() => { tok.str = 123; }).toThrowError(type_error, "token.str: try to set token string to a: number");
        });

        it("should set and get the location", () => {
            tok.loc = loc2;
            expect(tok.loc).toEqual(loc2);
        });

        it("should throw an error when setting loc to non-location", () => {
            expect(() => { tok.loc = "not a location"; }).toThrowError(type_error, "token.loc: try to set token loc to a: string");
        });

        it("should set and get the flag", () => {
            tok.flag = 2;
            expect(tok.flag).toBe(2);
        });

        it("should throw an error when setting flag to non-number", () => {
            expect(() => { tok.flag = "not a number"; }).toThrowError(type_error, "token.flag: try to set token flag to a: string");
        });

        it("should set and get the mac array", () => {
            tok.mac = [1, 2, 3];
            expect(tok.mac).toEqual([1, 2, 3]);
        });

        it("should throw an error when setting mac to non-array", () => {
            expect(() => { tok.mac = "not an array"; }).toThrowError(type_error, "token.mac: try to set token mac to a: string");
        });

        it("should set and get the prev token", () => {
            const prevToken = new token("prev", loc1);
            tok.prev = prevToken;
            expect(tok.prev).toBe(prevToken);
        });

        it("should throw an error when setting prev to non-token", () => {
            expect(() => { tok.prev = "not a token"; }).toThrowError(type_error, "token.prev: try to set token prev to a: string");
        });

        it("should set and get the next token", () => {
            const nextToken = new token("next", loc1);
            tok.next = nextToken;
            expect(tok.next).toBe(nextToken);
        });

        it("should throw an error when setting next to non-token", () => {
            expect(() => { tok.next = "not a token"; }).toThrowError(type_error, "token.prev: try to set token next to a: string");
        });
    });

    describe("Methods", () => {
        let tok1, tok2, tok3;

        beforeEach(() => {
            tok1 = new token("token1", loc1);
            tok2 = new token("token2", loc2);
            tok3 = new token("token3", loc3);
            tok1.next = tok2;
            tok2.prev = tok1;
            tok2.next = tok3;
            tok3.prev = tok2;
        });

        it("should correctly stringify tokens", () => {
            const str = tok1.stringify(tok3);
            expect(str).toContain("token1");
            expect(str).toContain(`#file "file2.js":2:1`);
            expect(str).toContain("token2");
            expect(str).toContain(`#file "file1.js":1:10`);
            expect(str).toContain("token3");
        });

        it("should correctly identify same line tokens", () => {
            expect(tok1.same_line(tok3)).toBe(true);
            expect(tok1.same_line(new token("token", loc1))).toBe(true);
        });

        it("should correctly identify equal tokens", () => {
            expect(tok1.is(tok2)).toBe(false);
            expect(tok1.is(new token("token1", loc1))).toBe(true);
        });

        it("should correctly swap token name", () => {
            tok1.swap_name("new_name");
            expect(tok1.str).toBe("new_name");
        });
    });
});

describe("eval_token function", () => {
    it("should identify a number token", () => {
        expect(eval_token("123")).toBe(flag.NUMBER_FLAG);
        expect(eval_token("-123")).toBe(flag.NUMBER_FLAG);
        expect(eval_token("1.23")).toBe(flag.NUMBER_FLAG);
    });

    it("should identify a name token", () => {
        expect(eval_token("variable")).toBe(flag.NAME_FLAG);
        expect(eval_token("_variable")).toBe(flag.NAME_FLAG);
    });

    it("should identify a comment token", () => {
        expect(eval_token("// comment")).toBe(flag.COMMENT_FLAG);
        expect(eval_token("/* comment */")).toBe(flag.COMMENT_FLAG);
    });

    it("should identify a symbol token", () => {
        expect(eval_token("+")).toBe(flag.SYMBOL_FLAG);
        expect(eval_token("==")).toBe(flag.SYMBOL_FLAG);
        expect(eval_token("!")).toBe(flag.SYMBOL_FLAG);
        expect(eval_token("@")).toBe(flag.SYMBOL_FLAG);
    });

    it("should identify a string token", () => {
        expect(eval_token('"string"')).toBe(flag.STRING_FLAG);
        expect(eval_token("'string'")).toBe(flag.STRING_FLAG);
        expect(eval_token("`string`")).toBe(flag.STRING_FLAG);
    });

    it("should return 0 for unknown tokens", () => {
        expect(eval_token("#unknown")).toBe(0);
    });
});

xdescribe("fast_token_fact function", () => {
    it("should create a new token with defaults", () => {
        const tok = fast_token_fact();
        expect(tok.str).toBe("");
        expect(tok.flag).toBe(0);
        expect(tok.loc).toEqual(new location());
    });

    it("should create a new token with provided values", () => {
        const tok = fast_token_fact("token", flag.NAME_FLAG, loc1);
        expect(tok.str).toBe("token");
        expect(tok.flag).toBe(flag.NAME_FLAG);
        expect(tok.loc).toEqual(loc1);
    });
});
