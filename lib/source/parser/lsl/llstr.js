import { llquat } from "../../../../lib/source/parser/lsl/llquat.js";
import { llvec } from "../../../../lib/source/parser/lsl/llvec.js";
import { fast_tokens_fact as ftfs } from "../../../../lib/source/tokens.js";
import { type_error } from "../../../error.js";
import { kind_of } from "../../../global.js";
import { numb } from "../../../math/number.js";
import { fix_float_regexp, int_regexp, nan_regexp, sci_float_regexp } from "../../../text/regex.js";
import { string } from "../../../text/string.js";
import { llfloat } from "./llfloat.js";



export class llstr {
    #value = ``;

    constructor(tok) { if (tok) this.parse(tok); }

    get kind() { return `llstr`; }

    get value() { return this.#value; }
    set value(value) {
        if (kind_of(value) !== `string`) throw new type_error(`value is not a string.`);
        this.#value = value;
    }

    get str() { return `"${this.#value}"`; }

    static get def() { return `""`; }

    get literal() { return true; }

    parse(arg) {
        this.#value = ``;

        const kind = kind_of(arg);
        if (kind === `string`) {
            if (arg.startsWith(`"`) && arg.endsWith(`"`))
                arg = string.clip(arg);
            this.#value = arg;
        }
        else if (kind === `token`) {
            if (arg.str.startsWith(`"`) && arg.str.endsWith(`"`))
                this.#value = string.clip(arg.str);
            else this.#value = `${arg.str}`;
        }
        return this;
    }

    cast(type) {
        switch (type) {
            case `integer`: {
                let p = numb.parse(numb.from_str(this.#value));
                if (numb.fast_nan(p)) p = 0;
                else if (!numb.between(p, -numb.MAX_UINT32, numb.MAX_UINT32, true)) p = -1;
                else if (p > numb.MAX_INT32) p -= 4294967296;
                return ftfs([`${Math.trunc(p)}`]);
            }
            case `float`: {
                let data;
                if (nan_regexp.test(this.#value))
                    data = this.#value.toLowerCase();
                else {
                    data = numb.parse(numb.from_str(this.#value));
                    if (numb.fast_nan(data)) data = `0.`;
                }
                return ftfs([`${llfloat.format(data)}`]);
            }
            case `string`: return ftfs([`"${this.#value}"`]);
            case `key`: return ftfs([`(key)`, `"${this.#value}"`]);
            case `vector`: return new llvec().from_str(this.#value).expr;
            case `quaternion`: return new llquat().from_str(this.#value).expr;
            case `list`: return ftfs([`[`, `"${this.#value}"`, `]`]);
        }
    };

    static is_lsl_numb(str) {
        if (string.empty(str)) return false;
        if (int_regexp.test(str)) return true;
        if (fix_float_regexp.test(str)) return true;
        if (sci_float_regexp.test(str)) return true;
        return false;
    }

};



