
import { type_error } from '../error.js';
import { flag, kind_of } from '../global.js';
import { name_exp, nan_regexp, symbol_exp } from '../text/regex.js';
import { string } from '../text/string.js';
import { location } from './location.js';

/**
 * Evaluates the token and returns a flag based on the type of the token.
 * @param {String} str - The input string representing the token to be evaluated.
 * @returns {Number} - A flag representing the type of the token based on the evaluation.
 */
export const eval_token = str => {
    let _flag = 0;

    if (/^[-+]?\.?\d/.test(str) || nan_regexp.test(str) || /^[-+]?inf(inity)?$/i.test(str))
        _flag |= flag.NUMBER_FLAG;
    else if (name_exp.test(str)) _flag |= flag.NAME_FLAG;

    if (/^\/[\/\*]/.test(str))
        //if (comments_exp.test(str))
        _flag |= flag.COMMENT_FLAG;

    if (symbol_exp.test(str))
        _flag |= flag.SYMBOL_FLAG;

    if (string.starts_with_one_of(str, `"'\``))
        _flag |= flag.STRING_FLAG;

    return _flag;
}

export class token {
    #str = ``;
    #flag = 0;
    #loc;
    #mac = [];
    #scope = ``;
    #prev;
    #next;

    /**
     * Constructor for the token class.
     * @param {String|token} arg - The input argument representing the string value or an instance of the token class.
     * @param {location} [loc] - The location object representing the file, line, and column information for the token. Defaults to a new location object if not provided.
     * @returns {token} - A new token object initialized with the provided string or token instance and location.
     */
    constructor(arg = ``, loc = new location()) {
        const kind = kind_of(arg);
        if (kind === `string`) {
            this.str = arg;
        }
        else if (kind === `token`) {
            this.str = arg.str;
            this.mac = arg.mac;
        }
        else throw new type_error(`token: try to create token from a: ${kind}`);

        if (loc) this.loc = loc;
    };

    get kind() { return `token`; };

    get str() { return this.#str; };
    set str(x) {
        if (kind_of(x) !== `string`) throw new type_error(`token.str: try to set token string to a: ${kind_of(x)}`);
        this.#str = x;
        this.#flag = eval_token(x);
    };

    get prev() { return this.#prev; };
    set prev(x) {
        if (kind_of(x) !== `token`) throw new type_error(`token.prev: try to set token prev to a: ${kind_of(x)}`);
        this.#prev = x;
    };

    get next() { return this.#next; };
    set next(x) {
        if (kind_of(x) !== `token`) throw new type_error(`token.prev: try to set token next to a: ${kind_of(x)}`);
        this.#next = x;
    };

    get flag() { return this.#flag; };
    set flag(x) {
        if (kind_of(x) !== `number`) throw new type_error(`token.flag: try to set token flag to a: ${kind_of(x)}`);
        this.#flag = x;
    };

    get loc() { return this.#loc; };
    set loc(x) {

        if (kind_of(x) !== `location`) throw new type_error(`token.loc: try to set token loc to a: ${kind_of(x)}`);
        this.#loc = new location(x);
    };

    get mac() { return this.#mac; };
    set mac(x) {
        if (kind_of(x) !== `array`) throw new type_error(`token.mac: try to set token mac to a: ${kind_of(x)}`);
        this.#mac = x;
    };

    get scope() { return this.#scope; };
    set scope(x) {
        if (kind_of(x) !== `string`) throw new type_error(`token.scope: try to set token scope to a: ${kind_of(x)}`);
        this.#scope = x;
    };

    get op() { return (this.#str.length === 1) ? this.#str : ``; };

    /**
     * Returns a string representation of the tokens from the current token up to the specified end token.
     * @param {token} end - The end token up to which the string representation will be generated.
     * @returns {String} - A string representation of the tokens from the current token up to the specified end token.
     */
    stringify(end) {
        if (end) end = end.next;

        let ret = ``;
        let loc = new location(this.#loc);

        for (let tok = this; tok != end; tok = tok.next) {

            if (tok.loc.line < loc.line || tok.loc.file != loc.file) {
                ret += `\n${tok.loc.str()}\n`;
                loc = new location(tok.loc);
            }

            if (loc.line != tok.loc.line) {
                ret += `\n`.repeat(Math.max(tok.loc.line - loc.line, 1));
                loc.line = tok.loc.line;
            }

            if (!Object.is(tok, this) && tok.same_line(tok.prev))
                ret += ` `;

            ret += tok.str;
            loc.adjust(tok.str);
        }
        return ret;
    };

    /**
     * Checks if the current token and the provided token are on the same line within the same file.
     * @param {token} tok - The token to compare with the current token.
     * @returns {Boolean} - Returns true if the tokens are on the same line within the same file; otherwise, returns false.
     */
    same_line(tok) {
        if (tok === undefined) return false;
        return this.#loc.file === tok.loc.file && this.#loc.line === tok.loc.line;
    };

    /**
     * Checks if the current token is equal to the provided token.
     * @param {token} tok - The token to compare with the current token.
     * @returns {Boolean} - Returns true if the tokens are equal; otherwise, returns false.
     */
    is(tok) { return tok && this.#str === tok.str && this.#loc.is(tok.loc); };

    /**
     * Replaces the current token's string with the provided string.
     * @param {String} str - The new string to replace the current token's string.
     * @returns {void}
     */
    swap_name(str) { this.#str = str; };

    /**
     * Clears the reference to the previous token by setting it to undefined.
     * @returns {void}
     */
    clear_prev() { this.#prev = undefined; };

    /**
     * Clears the reference to the next token by setting it to undefined.
     * @returns {void}
     */
    clear_next() { this.#next = undefined; };

    /**
     * Clears the token by resetting its properties to default values.
     * @returns {token} - The token object with its properties reset to default values.
     */
    clear() {
        this.#str = ``;
        this.#flag = 0;
        this.#loc = new location();
        this.#mac = [];
        this.#prev = undefined;
        this.#next = undefined;
        return this;
    };



}

/**
 * Creates a new token with the provided string, flag, and location.
 * @param {String} str - The string value for the new token. Defaults to an empty string if not provided.
 * @param {Number} flag - The flag value for the new token. Defaults to 0 if not provided.
 * @param {location} loc - The location object representing the file, line, and column information for the new token. Defaults to a new location object if not provided.
 * @returns {token} - A new token object initialized with the provided string, flag, and location.
 */
export const fast_token_fact = (str = ``, flag = 0, loc = new location()) => {
    let ret = new token();
    ret.str = str;
    ret.flag = flag;
    ret.loc = loc;
    return ret;
};

