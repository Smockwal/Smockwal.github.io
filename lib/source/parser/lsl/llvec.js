import { error, type_error } from "../../../error.js";
import { flag, kind_of } from "../../../global.js";
import { numb } from "../../../math/number.js";
import {
    X_AXIS, Y_AXIS, Z_AXIS,
    vec3_add, vec3_cross, vec3_div, vec3_dot, vec3_equals, vec3_mult, vec3_neg, vec3_rem, vec3d
} from "../../../math/vec3.js";
import { char } from "../../../text/char.js";
import { infinity_regexp, nan_regexp } from "../../../text/regex.js";
import { string } from "../../../text/string.js";
import { expr } from "../../expressions.js";
import { vec_gen_literal } from "../../literal.js";
import { token } from "../../token.js";
import { fast_tokens_fact as ftsf, tokens } from "../../tokens.js";
import { llfloat } from "./llfloat.js";
import { count_entities } from "./script.js";

const DEFAULT_VEC = `<0,0,0>`;

export class llvec {
    // array of expression
    #entries = [];

    constructor(tok) {
        if (tok) this.parse(tok);
        else
            for (let i = 0; i < 3; ++i)
                this.#entries[i] = ftsf([`0`]);
    };

    get kind() { return `llvec`; }

    /** @returns {expr} */
    get x() {
        if (this.#entries.length < 1) return new expr();
        return this.#entries[X_AXIS];
    };

    /** @returns {expr} */
    get y() {
        if (this.#entries.length < 2) return new expr();
        return this.#entries[Y_AXIS];
    };

    /** @returns {expr} */
    get z() {
        if (this.#entries.length < 3) return new expr();
        return this.#entries[Z_AXIS];
    };

    /** @returns {Array} */
    get entries() { return this.#entries; };

    get front_tok() {
        if (this.#entries.length == 0) return new token();
        return this.#entries[0].front;
    };

    get back_tok() {
        if (this.#entries.length == 0) return new token();
        return this.#entries[this.#entries.length - 1].back;
    };

    /** @returns {String} */
    get str() {
        if (this.#entries.length < 3) return DEFAULT_VEC;
        const vals = [`0.`, `0.`, `0.`];
        this.#entries.map((v, i) => vals[i] = string.is_float(v.str) ? numb.f32s_formatted(numb.parse(v.str)) : v.str);
        return `<${vals[X_AXIS]}, ${vals[Y_AXIS]}, ${vals[Z_AXIS]}>`;
    };

    get expr() {
        const ret = new tokens(`<`);
        for (let i = 0; i < 3; ++i) {
            if (i < this.#entries.length)
                ret.copy(this.#entries[i]);
            else ret.push_back(new token(`0`));
            ret.push_back(new token(`,`));
        }
        ret.back.str = `>`;

        expr.align_location(ret);
        return vec_gen_literal(ret.front, [3]);
    };

    get expr_ref() {
        if (this.#entries.length !== 3) return new expr();
        return new expr(this.front_tok.prev, this.back_tok.next);
    };

    is_def() {
        if (this.#entries.length !== 3) return false;
        return this.#entries.every(m => string.is_numb(m.str) && numb.parse(m.str) == 0);
    };

    static get def_str() { return DEFAULT_VEC; };

    /** 
     * @param {token|vec3} tok 
     * @returns {llvec}
     */
    parse(tok) {
        this.#entries = [];
        if (kind_of(tok) === `vec3`) return this.from_vec3(tok);
        if (kind_of(tok) === `euler`) return this.from_vec3(tok);

        if (tok.op !== `<`)
            throw new type_error(`The token does not represent a vector literal: ${tok.str}`);

        let first = tok.next, it = tok;
        while (it && it.next && this.#entries.length < 3) {
            it = it.next;
            if (!(it.flag & flag.SYMBOL_FLAG) && it.next) continue;

            const del = char.is_one_of(it.op, `>,`);
            if (char.is_one_of(it.op, `([<`)) it = expr.match(it).back;
            else if (del || !it.next) {
                this.#entries.push(new expr(first, (it.next || del) ? it.prev : it));
                first = it.next;
            }
        }

        return this;
    };

    of_literal() {
        if (this.#entries.length !== 3) return false;
        for (let i = 0; i < 3; ++i) {
            const e = this.#entries[i];
            if (count_entities(e) !== 1) return false;
            if (!string.is_numb(e.front.str)) return false;
        }
        return true;
    };

    cast(type) {
        switch (type) {
            case `string`: return ftsf([`"${this.str}"`]);
            case `vector`: return this.expr;
            case `list`: {
                const exp = new tokens(`[`).push_back(this.expr).push_back(new token(`]`));
                return expr.align_location(exp);

            }
            default: throw new type_error(`type mistake: can't cast vector to ${type}`);
        }
    };

    from_str(str) {
        //console.log(str);
        if (string.empty()) return new llvec();
        if (str.startsWith(`"`) && str.endsWith(`"`))
            str = string.clip(str);
        if (!str.startsWith(`<`)) return new llvec();

        const cut = str.split(/[\<\,\>]/g).map(e => string.simplify(e)).filter(e => !string.empty(e));
        if (cut.length < 3) return new llvec();

        for (let i = 0; i < 3; ++i) {
            let sim = string.simplify(cut[i]);
            if (i < 2 && /^[+-]?inf/i.test(sim)) {
                if (!infinity_regexp.test(sim) || numb.fast_nan(sim)) {
                    return new llvec();
                }
            }


            let data;
            //console.log(sim);
            if (nan_regexp.test(sim)) data = sim;
            //else if (/^[+-]?inf/i.test(sim)) {
            //    if (!infinity_regexp.test(sim)) data = `NaN`;
            //    else data = `Infinity`;
            //}
            else {
                let num = numb.from_str(sim);
                if (numb.fast_nan(num)) return new llvec();
                data = `${num}`;
            }
            this.#entries[i] = ftsf([data]);
        }
        return this;
    };

    to_vec3() {
        if (!this.of_literal()) throw new error(`Call llvec.to_vec3() on a not literal.`);
        return new vec3d(
            numb.parse(this.#entries[X_AXIS].str),
            numb.parse(this.#entries[Y_AXIS].str),
            numb.parse(this.#entries[Z_AXIS].str)
        );
    };

    from_vec3(v) {
        this.#entries[X_AXIS] = ftsf([`${v.x}`]);
        this.#entries[Y_AXIS] = ftsf([`${v.y}`]);
        this.#entries[Z_AXIS] = ftsf([`${v.z}`]);
        return this;
    }

    negate() {
        if (!this.of_literal()) throw new error(`Call llvec.negate() on a not literal.`);
        return this.from_vec3(vec3_neg(this.to_vec3()));
    };

    equals(r) {
        if (!this.of_literal()) throw new error(`Call llvec.negate() on a not literal.`);
        return vec3_equals(r.to_vec3(), this.to_vec3());
    };

    add(r) {
        if (!this.of_literal()) throw new error(`Call llvec.add() on a not literal.`);
        return this.from_vec3(vec3_add(this.to_vec3(), r.to_vec3(), new vec3d()));
    };

    rem(r) {
        if (!this.of_literal()) throw new error(`Call llvec.rem() on a not literal.`);
        return this.from_vec3(vec3_rem(this.to_vec3(), r.to_vec3(), new vec3d()));
    };

    mult(r) {
        const kind = kind_of(r);
        if (kind === `llfloat`) return this.from_vec3(vec3_mult(this.to_vec3(), r.value, new vec3d()));
        if (!this.of_literal()) throw new error(`Call llvec.mult() on a not literal.`);
        if (kind === `llvec`) return ftsf([`${llfloat.format(vec3_dot(this.to_vec3(), r.to_vec3()))}`]);
        if (kind === `llquat`) return this.from_vec3(vec3_mult(this.to_vec3(), r.to_quat(), new vec3d()));
        throw new type_error(`llvec.mult() call with unknow type.`);
    }

    div(r) {
        const kind = kind_of(r);
        if (kind === `llfloat`) return this.from_vec3(vec3_div(this.to_vec3(), r.value, new vec3d()));
        if (kind === `llquat`) return this.from_vec3(vec3_div(this.to_vec3(), r.to_quat(), new vec3d()));
        throw new type_error(`llvec.div() call with unknow type.`);
    };

    mod(r) {
        if (!this.of_literal()) throw new error(`Call llvec.mod() on a not literal.`);
        return this.from_vec3(vec3_cross(this.to_vec3(), r.to_vec3(), new vec3d()));
    };

    opt_mem() {
        if (this.is_def()) return ftsf([`(`, `(vector)`, `""`, `)`]);
        return this.expr_ref;
    };

};