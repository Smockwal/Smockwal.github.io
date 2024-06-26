/*
    "4fad7145-f825-aed8-d190-bd28aa6b9688"
    is a string

    key a = "4fad7145-f825-aed8-d190-bd28aa6b9688";
    is a string assigned to a key
    operator "=" have parsing ability (also use for llfunction parameter)
    "a" constructor doesn't check if the value is valid uuid

    key a;
    "a" is a key with a value of "" (NULL/invalid)

    key a = "00000000-0000-0000-0000-000000000000";
    "a" is a valid key with a well formated uuid and, a value of 0

    ((key)"4fad7145-f825-aed8-d190-bd28aa6b9688")
    ((key)"Hello world!")
    the parentheses contain a string cast to a key
    the whole expression is a key with a value of the string

    validating: if/while/for, will test if a key have a not empty, well formatted value that's not equal to 0
*/

import { type_error } from "../../../error.js";
import { flag, kind_of } from "../../../global.js";
import { fast_tokens_fact } from "../../../source/tokens.js";
import { uuid_exp } from "../../../text/regex.js";
import { string } from "../../../text/string.js";

export class llkey {
    #value = '';

    constructor(tok) {
        if (tok) this.parse(tok);
    }

    /**
     * @returns {String} The kind of the instance.
     */
    get kind() {
        return 'llkey';
    }

    /**
     * @returns {String} The value of the llkey instance.
     */
    get value() {
        return this.#value;
    }

    /**
     * @returns {String} The string representation of the llkey value.
     */
    get str() {
        return `"${this.#value}"`;
    }

    /**
     * @returns {String} The default value for llkey.
     */
    static get def() {
        return `""`;
    }

    /**
     * @returns {Boolean} Always returns true, indicating it's a literal.
     */
    get literal() {
        return true;
    }

    /**
     * @returns {Boolean} Indicates if the llkey value is valid.
     */
    get valid() {
        return !string.empty(this.#value);
    }

    /**
     * @returns {Boolean} Indicates if the llkey value is well-formatted.
     */
    get well_formatted() {
        return uuid_exp.test(this.#value);
    }

    /**
     * Checks if the llkey value is null (empty).
     * @returns {Boolean} True if the value is null (empty), otherwise false.
     */
    is_null() {
        return string.empty(this.#value);
    }

    /**
     * Parses the provided argument and sets the value of the llkey instance.
     * @param {string|number|token} arg - The argument to parse.
     * @returns {llkey} The llkey instance after parsing the argument.
     * @throws {type_error} If the provided argument does not represent a key.
     */
    parse(arg) {
        this.#value = ``;
        const kind = kind_of(arg);

        if (kind === `string` || kind === `number`) {
            let val = `${arg}`;
            val = this.#sanitize_value(val);
            this.#value = val;
        } else if (kind === `token`) {
            if (!(arg.flag & flag.STRING_FLAG) && !(arg.flag & flag.CASTING_FLAG && arg.next.flag & flag.STRING_FLAG)) {
                throw new type_error(`The token does not represent a key: ${arg.str}`);
            }

            let val = (arg.flag & flag.STRING_FLAG) ? arg.str : arg.next.str;
            val = this.#sanitize_value(val);
            this.#value = val;
        }
        return this;
    }

    /**
     * Sanitizes the input value by removing enclosing quotes or (key) prefix if present.
     * @param {string} val - The value to sanitize.
     * @returns {string} The sanitized value.
     */
    #sanitize_value(val) {
        if (val.startsWith('(') && val.endsWith(')')) {
            val = string.clip(val);
        }
        if (val.startsWith('(key)')) {
            val = val.substring(5);
        }
        if (val.startsWith('"') && val.endsWith('"')) {
            val = string.clip(val);
        }
        return val;
    }

    /**
     * Casts the llkey instance to a different type.
     * @param {string} type - The type to cast to. Can be 'string', 'key', or 'list'.
     * @returns {Array} A token array representing the casted value.
     * @throws {type_error} If the provided type is not one of the expected values.
     */
    cast(type) {
        switch (type) {
            case 'string':
                return fast_tokens_fact([`"${this.#value}"`]);
            case 'key':
                return fast_tokens_fact([`(key)`, `"${this.#value}"`]);
            case 'list':
                return fast_tokens_fact([`[`, `(key)`, `"${this.#value}"`, `]`]);
            default:
                throw new type_error(`type mistake: can't cast key to ${type}`);
        }
    }
}
