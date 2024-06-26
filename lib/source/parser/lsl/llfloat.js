// https://observablehq.com/@jrus/hexfloat
// https://www.h-schmidt.net/FloatConverter/IEEE754.html
// https://g2384.github.io/collection/Hex_Calc_IEEE754_conversion.html
// http://weitz.de/ieee/
// https://www.online-python.com/

import { type_error } from "../../../error.js";
import { flag, kind_of, type_of } from "../../../global.js";
import { numb } from "../../../math/number.js";
import { string } from "../../../text/string.js";
import { fast_tokens_fact } from "../../tokens.js";


export class llfloat {
    #value = 0;

    constructor(tok) { if (tok) this.parse(tok); }

    /** @returns {String} */
    get kind() { return `llfloat`; };

    /** @returns {Number} */
    get value() { return this.#value; }

    /** @param {number} v */
    set value(v) {
        if (type_of(v) !== `number`) throw new type_error(`value is not a number.`);
        this.#value = v;
    }

    /** @returns {String} */
    get str() { return numb.f32s_formatted(this.#value); }

    /** @returns {Number} */
    get f32() { return Math.fround(this.#value); }

    /**
     * Static method to round a number to the nearest single precision float.
     * @static
     * @param {number} v - The number to be rounded.
     * @returns {number} The rounded single precision float.
     * @memberof llfloat
     */
    static f32(v) { return Math.fround(v); };

    /** @returns {String} */
    static get def() { return `0.0`; }

    /** @returns {Boolean} */
    get literal() { return true; }

    /**
     * Parses the input argument and sets the value of the llfloat instance.
     * @param {string|number|token} arg - The input argument to be parsed.
     * @returns {llfloat} The instance of llfloat after parsing the input argument.
     * @throws {type_error} If the input argument does not represent a float.
     */
    parse(arg) {
        this.#value = 0;
        const kind = kind_of(arg);

        if (kind === `string` || kind === `number`) {
            if (kind === `string` && arg.startsWith(`"`) && arg.endsWith(`"`)) {
                arg = string.clip(arg);
            }
            this.#value = numb.sf32(arg);
        } else if (kind === `token`) {
            if (!(arg.flag & flag.NUMBER_FLAG)) {
                throw new type_error(`The token does not represent a float: ${arg.str}`);
            }
            this.#value = numb.sf32(arg.str);
        } else {
            throw new type_error(`Unsupported argument type.`);
        }

        return this;
    }

    /**
     * Checks if the value of the llfloat instance is equal to 0.
     * @returns {boolean} Returns true if the value is 0, otherwise false.
     */
    is_def() { return this.#value === 0; };

    /**
     * Static method to check if the input is a default (zero) llfloat instance.
     * @static
     * @param {llfloat|string|token} o - The input to be checked.
     * @returns {boolean} Returns true if the input is a default (zero) llfloat instance, 
     *                   a string that can be parsed to a zero float, or a token that represents a zero float.
     *                   Otherwise, returns false.
     * @memberof llfloat
     */
    static is_def(o) {
        const kind = kind_of(o);
        if (kind === `llfloat`) return o.value === 0;
        if (kind === `string`) return numb.parse(o) === 0;
        if (kind === `token`) return numb.parse(o.str) === 0;
        return false;
    }

    /**
     * Formats the float value of the llfloat instance to a string.
     * @param {number} [len=16] - The length of the formatted string. Default is 16.
     * @returns {string} The formatted string representation of the float value.
     */
    formatted(len = 6) { return numb.format_float(this.#value, len); };
    /**
     * Static method to format a number to a string representation of a single precision float.
     * @static
     * @param {number} num - The number to be formatted.
     * @param {number} [len=16] - The length of the formatted string. Default is 16.
     * @returns {string} The formatted string representation of the single precision float.
     * @memberof llfloat
     */
    static format(num, len = 6) { 
        if (kind_of(num) === `string`) num = numb.parse(num);
        return numb.format_float(num, len); 
    };

    /**
     * Converts the float value of the llfloat instance to a string representation of a single precision float.
     * @param {number} [dp=6] - The number of decimal places to round the float to. Default is 6.
     * @returns {string} The formatted string representation of the single precision float.
     * @memberof llfloat
     */
    f32s(dp = 6) { return numb.f32s(this.#value, dp) };

    /**
     * Static method to format a number to a string representation of a single precision float.
     * @static
     * @param {number} num - The number to be formatted.
     * @param {number} [dp=6] - The number of decimal places to round the float to. Default is 6.
     * @returns {string} The formatted string representation of the single precision float.
     * @memberof llfloat
     */
    static f32s(v, dp = 6) { return numb.f32s(v, dp); };

    /**
     * Performs type casting of the llfloat instance to another data type.
     * @param {string} type - The type to which the llfloat instance should be casted.
     * @returns {token[]|string} The casted value as per the specified type.
     * @throws {type_error} If the specified type is not supported for casting.
     */
    cast(type) {
        switch (type) {
            case `integer`:
                let p = Math.trunc(this.#value);
                if (numb.is_finite(p)) {
                    if (p > numb.MAX_UINT32) p = -1;
                    else if (p > numb.MAX_INT32) p -= 4294967296;
                }

                return fast_tokens_fact([`${p}`]);
            case `float`:
                return fast_tokens_fact([`${numb.format_float(this.#value)}`]);
            case `string`: {
                return fast_tokens_fact([`"${numb.f32s_formatted(this.#value)}"`]);
            }
            case `list`:
                return fast_tokens_fact([`[`, `${numb.format_float(this.#value)}`, `]`]);
            default:
                throw new type_error(`type mistake: can't cast float to "${type}".`);
        }
    };

    mult(r) { return r.mult(this); }

}; 
