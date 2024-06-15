
import { error, range_error, syntax_error } from "../../error.js";
import { kind_of } from "../../global.js";
import { uri } from "../../system/uri.js";
import { uris } from "../../system/uris.js";
import { regex } from "../../text/regex.js";
import { string } from "../../text/string.js";
import { expr } from "../expressions.js";
import { func } from "../function.js";
import { location } from "../location.js";
import { token } from "../token.js";
import { tokens } from "../tokens.js";

export const macros = new Map();

const DEFINE = `define`;
const DEFINED = `defined`;

let ident = ``;

export class macro {
    #variadic = false;
    #no_value = false;
    #definition = new tokens();
    #name_tok;
    #value_tok;
    #end_tok;
    #args = [];
    #use = [];

    constructor(name, value) {

        if (kind_of(name) === `string` && kind_of(value) === `string`) {
            const toks = new tokens(`${name} ${value}`);
            if (!this.parse_def(toks.front)) {
                throw new error(`bad macro syntax. macroname=${name} value=${value}`);
            }
        }
        else if (kind_of(name) === `token`) {
            let tok = name;
            if (tok.same_line(tok.prev) || tok.str !== `#` || !tok.next || tok.next.str !== DEFINE || !tok.next.next || !tok.next.next.same_line(tok.next)) {
                throw new syntax_error(`Bad macro syntax.`);
            }
            if (!this.parse_def(tok.next.next)) {
                throw new syntax_error(`Bad macro syntax.`);
            }
        }
    };

    get kind() { return `macro`; };

    get name_tok() { return this.#name_tok; }
    get name() { return this.#name_tok?.str || ``; }
    get value_tok() { return this.#value_tok; }
    get end_tok() { return this.#end_tok; }
    get variadic() { return this.#variadic; }
    get args() { return this.#args; }
    get args_length() { return this.#args.length; }
    get definition() { return this.#definition; }

    /**
     * Retrieves the argument token at the specified index.
     * Throws a range error if the index is out of range.
     * 
     * @param {number} index - The index of the argument token to retrieve.
     * @returns {token} - The argument token at the specified index.
     * @throws {range_error} - If the index is out of range.
     */
    arg_at(index) {
        if (index < 0 || index >= this.#args.length) throw new range_error(`index out of range.`);
        return this.#args[index];
    };

    /**
     * Retrieves the index of the argument token that matches the specified string.
     * If no match is found, it returns -1.
     * 
     * @param {string} str - The string to match against the argument tokens.
     * @returns {number} - The index of the matching argument token, or -1 if no match is found.
     */
    arg_index(str) {
        if (this.args_length === 0) return -1;
        return this.#args.findIndex(
            arg => RegExp(`^${regex.from_string(arg.front.stringify(arg.back))}$`).test(str)
        );
    };

    /**
     * Parses the macro definition from the input token.
     * 
     * @param {token} in_tok - The input token to parse the macro definition from.
     * @returns {boolean} - True if the parsing was successful, false otherwise.
     */
    parse_def(in_tok) {
        this.#name_tok = in_tok;
        this.#variadic = false;

        if (!this.#name_tok) {
            this.#name_tok = this.#end_tok = null;
            this.#args = [];
            return false;
        }

        let end = in_tok;
        while (in_tok.same_line(end)) {
            let newTokenStr = end.str;
            if (end.str === `__UID__`) newTokenStr = string.uid();
            else if (end.str === `__UUID__`) newTokenStr = crypto.randomUUID();

            this.#definition.push_back(new token(newTokenStr, end.loc));
            end = end.next;
        }

        this.#name_tok = this.#definition.front;
        this.#end_tok = this.#definition.back;

        let variadic_name = ``;

        if (func.is_func_name(this.#definition.front)) {
            const decl = new func(this.#definition.front);

            for (let i = 0; i < decl.args_length; i++) {
                let arg = decl.arg_at(i);
                if (arg.str.endsWith(`...`)) {
                    this.#variadic = true;
                    variadic_name = arg.str.substring(0, arg.str.length - 3);
                    arg.front.str = `__VA_ARGS__`;
                }
                this.#args.push(arg);
            }

            this.#value_tok = decl.last_tok.next;
        } else {
            this.#value_tok = this.#name_tok.next;
        }

        if (this.#variadic) {
            for (let tok = this.#value_tok; tok; tok = tok.next) {
                if (tok.str === variadic_name) tok.str = `__VA_ARGS__`;
            }
        }

        if (!this.#value_tok) {
            this.#no_value = true;
        }

        return true;
    };

    /**
     * Expands a macro by replacing its name with the corresponding value tokens.
     * 
     * @param {tokens} source - The source tokens where the macro is being expanded.
     * @param {token} name - The token representing the macro name.
     * @param {Array} includes - An array of included files.
     * @param {boolean} verb - A flag indicating whether to output verbose information.
     * @returns {token} - The token after the expanded macro.
     * @throws {error} - If macro recursion is detected or if there is a wrong number of parameters.
     */
    expand(source, name, includes, verb) {
        if (verb && this.#value_tok) console.log(this.#value_tok.stringify());

        if (this.#use.length > 0 || name.mac.includes(this.name)) {
            if (this.#use.filter(loc => loc.is(name.loc)).length >= 5)
                throw new error(`Macro recursion detected.`);
        }

        let toks = new tokens();
        let bound = new expr(name, name);

        if (this.#no_value) {
            if (name.prev && (name.prev.str === DEFINED || (name.prev.prev && name.prev.prev.str === DEFINED))) {
                return name.next;
            }
        }

        const special_macros = () => {
            const loc = name.loc;
            switch (name.str) {
                case `__FILE__`:
                    return new token(uris.uri(loc.file), loc);
                case `__FILE_NAME__`:
                    return new token(`${new uri(uris.uri(loc.file)).file_full_name}`, loc);
                case `__LINE__`:
                    return new token(`${loc.line}`, loc);
                case `__COUNTER__`:
                    return new token(`${this.#use.length}`, loc);
                case `__DATE__`:
                    return new token(`${new Date().toISOString()}`, loc);
                case `__TIME__`:
                    const t = new Date();
                    return new token(`${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`, loc);
                case `__INCLUDE_LEVEL__`:
                    return new token(`${includes.length}`, loc);
                case `__BASE_FILE__`:
                    return new token(source.file, loc);
                case `__UID__`:
                    return new token(string.uid(), loc);
                case `__UUID__`:
                    return new token(string.uuid(), loc);
                default:
                    return null;
            }
        };

        const special_macro_tokens = special_macros();
        if (special_macro_tokens) {
            toks.push_back(special_macro_tokens);
        } else if (func.is_func_name(this.#name_tok)) {
            if (!func.is_func_name(name)) return name.next;

            let src = new func(name);

            if (src.args_length == 0 && this.args_length > 0)
                return name.next;

            bound.back = src.last_tok || name;

            if ((this.#variadic && src.args_length < this.args_length - 1) || (!this.#variadic && src.args_length !== this.args_length)) {
                console.log(`-> ${this.#definition.str}`, src.args_length, this.args_length);
                throw new error(`Wrong number of parameter${this.#variadic ? " (variadic)" : ""}.`);
            }

            for (let tok = this.#value_tok; tok; tok = tok.next) {
                let index = this.arg_index(tok.str);

                if (this.#variadic && tok.str === `__VA_ARGS__`) {
                    if (toks.back && toks.back.str === `#`) {
                        toks.delete_token(toks.back);
                        const args_str = src.args_length > index ? src.arg_at(index).str : ``;
                        toks.push_back(new token(`"${args_str}"`, name.loc));
                        continue;
                    }

                    let hash_hash = false;
                    if (toks.back && toks.back.str === `##`) {
                        hash_hash = true;
                        toks.delete_token(toks.back);
                    }

                    for (let i = index; i < src.args_length; i++) {
                        if (i > index) toks.push_back(new token(`,`, name.loc));
                        toks.copy(source, src.arg_at(i));
                    }

                    if (hash_hash && src.args_length === index) toks.delete_token(toks.back);

                    expr.align_location(toks, name.loc);

                } else if (index >= 0) {
                    let arg = src.arg_at(index);
                    if (toks.back && toks.back.str === `#`) {
                        expand_hash(toks, toks.back, arg.str);
                    } else {
                        toks.copy(source, arg);
                        expr.align_location(toks, name.loc);
                    }
                } else {
                    toks.push_back(new token(tok, name.loc));
                }
            }
        } else {
            for (let tok = this.#value_tok; tok; tok = tok.next) {
                toks.push_back(new token(tok, name.loc));
            }

        }

        let ret = name.prev;
        if (toks.front) {
            this.#use = [new location(name.loc), ...this.#use];
            ret = toks.front;

            for (let it = toks.front; it; it = it.next) {
                it.mac.push(this.name);
            }
        }



        source.replace(bound, toks);
        ident = ident.substring(0, ident.length - 1);
        return ret;
    };

};

export const expand_hash_hash = (src, hash_tok) => {
    if (!hash_tok || hash_tok.str !== `##` || !hash_tok.prev || !hash_tok.next) return hash_tok;

    const str = `${hash_tok.prev.str}${hash_tok.next.str}`.trim();
    if (!string.empty(str) && !string.is_valide_token(str) && !(hash_tok.prev.prev && (hash_tok.prev.prev.str === `##` || hash_tok.prev.prev.str === `#`))) {
        throw new error(`Invalid ## usage.`);
    }

    const toks2 = new tokens();
    toks2.push_back(new token(str, hash_tok.loc));
    const first = (hash_tok.prev === src.front);
    const ret = hash_tok.prev.prev;

    src.replace(hash_tok.prev, hash_tok.next, toks2);
    return first ? src.front : ret.next;
};

export const expand_hash = (src, hash_tok, by) => {
    if (!hash_tok || hash_tok.str !== `#`) return hash_tok;

    const toks2 = new tokens();
    toks2.push_back(new token(`"${string.c_escape(by)}"`, hash_tok.loc));
    const first = (hash_tok === src.front);
    const ret = hash_tok.prev;

    src.replace(hash_tok, hash_tok.next || hash_tok, toks2);
    return first ? src.front : ret.next;
};

