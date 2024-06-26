import { error, range_error, type_error } from "../error.js";
import { flag, kind_of } from "../global.js";
import { char } from "../text/char.js";
import { regex } from "../text/regex.js";
import { expr } from "./expressions.js";
import { vec_gen_literal } from "./literal.js";
import { token } from "./token.js";
import { fast_tokens_fact as ftsf, tokens } from "./tokens.js";

// WARNING: Never use as container, always local use.
export class func {
	/** @type {token} */
	#type_tok;

	/** @type {token} */
	#name_tok;

	/** @type {token} */
	#end_tok;

	/** @type {Array} */
	#args = [];

	/** @param {token} [tok] */
	constructor(tok) {
		if (kind_of(tok) === `token`) this.parse(tok);
	}

	get kind() { return `func`; };

	/** @returns {String} */
	get name() { return this.#name_tok?.str || ''; };

	/** @returns {token} */
	get name_tok() { return this.#name_tok; };

	/** @returns {String} */
	get type() { return this.#type_tok?.str || 'void'; };

	/** @returns {expr[]} */
	get args() { return this.#args; };

	/** @returns {Number} */
	get args_length() { return this.#args.length; };

	/** @returns {expr} */
	get expr() {
		return new expr(this.#type_tok || this.#name_tok, this.#end_tok);
	};

	/** @returns {token} */
	get last_tok() { return this.#end_tok; };
	set last_tok(tok) {
		if (kind_of(tok) !== `token`) throw new type_error(`func.last_tok = ${kind_of(tok)}`);
		this.#end_tok = tok;
	};


	/** @returns {expr} */
	get definition() {
		return new expr(this.#type_tok || this.#name_tok, expr.match(this.#end_tok.next).back);
	};

	/**
	 * Parses the given token to extract function information.
	 * @param {token} in_tok - The token to parse.
	 * @returns {Boolean} - Returns true if the parsing is successful, false otherwise.
	 * @throws {error} - If the input token is null or not an instance of token.
	 */
	parse(in_tok) {
		if (kind_of(in_tok) !== `token`) throw new error(`func.parse() call on none token.`);
		this.clear();

		if (!in_tok.next) {
			return false;
		}


		if (in_tok.next.flag & flag.NAME_FLAG) {
			this.#type_tok = in_tok;
			this.#name_tok = this.#end_tok = in_tok.next;
		}
		else
			this.#name_tok = this.#end_tok = in_tok;


		if (!this.#name_tok) {
			return false;
		}

		if (!func.is_func_name(this.#name_tok)) {
			return false;
		}

		if (this.#type_tok == undefined) {
			if (this.#name_tok.prev && this.#name_tok.prev.flag & flag.NAME_FLAG) {
				this.#type_tok = this.#name_tok.prev;
			}
		}

		return this.parse_args(this.#name_tok);
	};

	/**
	 * Parses the arguments of the function from the given token.
	 * @param {token} in_tok - The token representing the start of the function arguments.
	 * @returns {Boolean} - Returns true if the parsing is successful, false otherwise.
	 */
	parse_args(in_tok) {
		if (in_tok.next?.op !== `(`) return false;

		if (in_tok.next.next?.op === ')') {
			this.#end_tok = in_tok.next.next;
			return true;
		}


		const args_expr = expr.match(in_tok.next);
		if (!args_expr) return false;

		this.#end_tok = args_expr.back;
		this.#args = [];
		if (args_expr.front.next.is(args_expr.back))
			return true;

		let first = args_expr.front.next;

		for (let tok = first; tok && tok !== args_expr.back.next; tok = tok.next) {
			if (!(tok.flag & flag.SYMBOL_FLAG)) continue;

			if (char.is_one_of(tok.op, `{([<`)) {
				if (tok.op == `<` && !vec_gen_literal(tok)) continue;
				tok = expr.match(tok).back;
			}
			else if (char.is_one_of(tok.op, `,)`)) {
				if (tok.is(first)) {
					let tmp_tok = new token(` `, tok.loc);
					this.#args.push(new expr(tmp_tok, tmp_tok));
				}
				else
					this.#args.push(new expr(first, tok.prev));

				first = tok.next;
			}
		}

		return true;
	};

	/**
	 * Retrieves the argument expression at the specified index.
	 * @param {Number} index - The index of the argument expression to retrieve.
	 * @returns {expr} - The argument expression at the specified index.
	 * @throws {range_error} - If the index is out of range.
	 */
	arg_at(index) {
		if (index < 0 || index >= this.#args.length)
			throw new range_error(`index out of range.`);
		return this.#args[index];
	};

	/**
	* Retrieves the index of the argument expression that matches the specified string.
	* @param {String} str - The string to match against the argument expressions.
	* @returns {Number} - The index of the matching argument expression, or -1 if no match is found.
	*/
	arg_index(str) {
		for (let i = this.#args.length; i--;)
			if (RegExp(`^${regex.from_string(this.#args[i].str)}$`).test(str)) return i;
		return -1;
	};

	/**
	 * Creates a copy of the function expression as a sequence of tokens.
	 * @returns {tokens} - A sequence of tokens representing the copied function expression.
	 */
	expr_copy() {
		const ret = new tokens();
		ret.copy(ftsf([this.name]));
		ret.copy(ftsf([`(`]));
		for (const entry of this.#args) {
			ret.copy(entry);
			ret.copy(ftsf([`,`]))
		}
		ret.back.str = `)`;
		return ret;
	};

	/**
	 * Clears the function object by resetting its internal state and removing any stored data.
	 */
	clear() {
		this.#type_tok = this.#name_tok = this.#end_tok = undefined;
		this.#args = [];
	};

	/**
	 * Checks if the given token represents a function name.
	 * @param {token} tok - The token to be checked.
	 * @returns {Boolean} - Returns true if the token represents a function name, false otherwise.
	 */
	static is_func_name(tok, inline = false) {
		if (!tok || !(tok.flag & flag.NAME_FLAG) ||
			!tok.next || !tok.next.next ||
			tok.next.op != `(`) return false;

		// macro function must be on the same line
		if (inline && !tok.same_line(tok.next)) return false;

		const argsExpr = expr.match(tok.next);
		return argsExpr?.back.op === ')';
	};
};