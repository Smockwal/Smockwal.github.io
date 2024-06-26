import { type_error } from "../../../error.js";
import { flag, kind_of } from "../../../global.js";
import { numb } from "../../../math/number.js";
import { string } from "../../../text/string.js";
import { fast_tokens_fact } from "../../tokens.js";

export class llint {
    #value = 0;

    constructor(arg) { if (arg) this.parse(arg); };

    /** @returns {String} */
    get kind() { return `llint`; };

    /** @returns {Number} */
    get value() { return this.#value; }
    
    set value(value) {
        if (kind_of(value) !== "number") throw new type_error(`Value must be a number: "${value}".`);
        this.#value = numb.parse_int(value, 10);
    }

    /** @returns {String} */
    get str() { return `${this.#value}`; }

    /** @returns {String} */
    get i32() { return `${numb.int32(this.#value)}`; };

    /** @returns {String} */
    static i32(num) { return `${numb.int32(num)}`; };

    /** @returns {String} */
    get ui32() { return `0x${(this.i32 >>> 0).toString(16).toUpperCase()}`; }

    /** @returns {String} */
    static get def() { return `0`; }

    /** @returns {Boolean} */
    get literal() { return true; }

    /**
     * Parses the input argument and sets the internal value of the llint instance.
     * @param {number|string|token} arg - The argument to parse.
     * @returns {llint} - Returns the instance of llint.
     * @throws {type_error} - Throws an error if the argument type is not supported.
     */
    parse(arg) {
        this.#value = 0;
        const kind = kind_of(arg);

        switch (kind) {
            case 'number':
                this.#value = Math.trunc(numb.int32(arg));
                break;
            case 'string':
                arg = arg.startsWith('"') && arg.endsWith('"') ? string.clip(arg) : arg;
                this.#value = Math.trunc(numb.int32(numb.parse(arg)));
                break;
            case 'token':
                if (!(arg.flag & flag.NUMBER_FLAG)) {
                    throw new type_error(`The token does not represent an integer: ${arg.str}`);
                }
                this.#value = numb.int32(numb.parse(arg.str));
                break;
            default:
                throw new type_error(`Unsupported argument type: ${kind}`);
        }

        return this;
    }

    /**
     * Checks if the given token represents a default value for the llint type.
     * @param {token} tok - The token to check.
     * @returns {boolean} - Returns true if the token represents a default value, false otherwise.
     * @throws {type_error} - Throws an error if the token does not have a 'str' property.
     */
    static is_def(tok) { return (tok.str === `0` || /^0x0$/i.test(tok.str)) };

    /**
     * Casts the current llint instance to a different type.
     * @param {string} type - The type to cast to.
     * @returns {token[]} - Returns a token array representing the casted value.
     * @throws {type_error} - Throws an error if the cast is not supported.
     */
    cast(type) {
        switch (type) {
            case `integer`: return fast_tokens_fact([`${this.#value}`]);
            case `float`: return fast_tokens_fact([numb.format_float(this.#value)]);
            case `string`: return fast_tokens_fact([`"${this.#value}"`]);
            case `list`: return fast_tokens_fact([`[`, `${this.#value}`, `]`]);
            default: throw new type_error(`type mistake: can't cast int to "${type}".`);
        }
    };
};