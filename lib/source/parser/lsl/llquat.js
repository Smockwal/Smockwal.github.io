
import { error, type_error } from "../../../error.js";
import { flag, kind_of } from "../../../global.js";
import { numb } from "../../../math/number.js";
import { QW, QX, QY, QZ, quat_add, quat_div, quat_equals, quat_mult, quat_neg, quat_rem, quatd } from "../../../math/quaternion.js";
import { char } from "../../../text/char.js";
import { nan_regexp } from "../../../text/regex.js";
import { string } from "../../../text/string.js";
import { expr } from "../../expressions.js";
import { vec_gen_literal } from "../../literal.js";
import { token } from "../../token.js";
import { fast_tokens_fact as ftsf, tokens } from "../../tokens.js";
import { llfloat } from "./llfloat.js";
import { count_entities } from "./script.js";

const DEFAULT_QUAT = `<0,0,0,1>`;

export class llquat {
    #entries = [];

    constructor(tok) {
        if (tok) this.parse(tok);
        else {
            for (let i = 0; i < 3; ++i)
                this.#entries[i] = ftsf([`0`]);
            this.#entries[3] = ftsf([`1`]);
        }

    }

    get kind() { return `llquat`; }

    /** @returns {expr} */
    get x() {
        if (this.#entries.length < 1) return new expr();
        return this.#entries[QX];
    }
    /** @returns {expr} */
    get y() {
        if (this.#entries.length < 2) return new expr();
        return this.#entries[QY];
    }
    /** @returns {expr} */
    get z() {
        if (this.#entries.length < 3) return new expr();
        return this.#entries[QZ];
    }
    /** @returns {expr} */
    get s() {
        if (this.#entries.length < 4) return new expr();
        return this.#entries[QW];
    }

    /** @returns {Array} */
    get entries() { return this.#entries; }

    /** @returns {String} */
    get str() {
        if (this.#entries.length < 3) return DEFAULT_QUAT;
        const vals = [`0.`, `0.`, `0.`, `1.`];
        this.#entries.map((v, i) => vals[i] = string.is_float(v.str) ? numb.f32s_formatted(numb.parse(v.str), 8) : v.str);
        return `<${vals[QX]}, ${vals[QY]}, ${vals[QZ]}, ${vals[QW]}>`;
    };

    is_def = () => {
        if (this.#entries.length !== 4) return false;
        return this.#entries.every((m, i) => string.is_numb(m.str) && numb.parse(m.str) == (i == 3 ? 1 : 0));
    }
    static get def_str() { return DEFAULT_QUAT; }

    get expr() {
        const ret = new tokens(`<`);
        for (let i = 0; i < 4; ++i) {
            if (i < this.#entries.length)
                ret.copy(this.#entries[i]);
            else ret.push_back(new token(`0`));
            ret.push_back(new token(`,`));
        }
        ret.back.str = `>`;

        expr.align_location(ret);
        return vec_gen_literal(ret.front, [4]);
    }

    get expr_ref() {
        if (this.#entries !== 3) return new expr();
        return new expr(this.front_tok.prev, this.back_tok.next);
    }

    /** 
     * @param {token} tok 
     * @returns {llquat}
     */
    parse(tok) {
        this.#entries = [];
        if (kind_of(tok) === `quat`) return this.from_quat(tok);

        if (!(tok.flag & flag.QUAT_OP_FLAG))
            throw new type_error(`The token does not represent a quaternion literal: ${tok.str}`);

        let first = tok.next;
        const exp = expr.match(tok);
        for (let it = exp.front.next; exp.end(it); it = exp.next(it)) {
            if (!(it.flag & flag.SYMBOL_FLAG)) continue;

            if (char.is_one_of(it.op, `([<`)) it = expr.match(it).back;
            else if (char.is_one_of(it.op, `>,`) || this.#entries.length > 4) {
                this.#entries.push(new expr(first, it.prev));
                first = it.next;
            }
        }

        return this;
    }

    of_literal() {
        if (this.#entries.length !== 4) return false;
        for (let i = 0; i < 4; ++i) {
            const e = this.#entries[i];
            if (count_entities(e) !== 1) return false;
            if (!string.is_numb(e.front.str)) return false;
        }
        return true;
    }

    cast(type) {
        switch (type) {
            case `string`: return ftsf([`"${this.str}"`]);
            case `quaternion`: return this.expr;
            case `list`: {
                const exp = new tokens(`[`).push_back(this.expr).push_back(new token(`]`));
                return expr.align_location(exp);

            }
            default: throw new type_error(`type mistake: can't cast quaternion to ${type}`);
        }
    };

    from_str(str) {
        if (string.empty()) return new llquat();
        if (str.startsWith(`"`) && str.endsWith(`"`))
            str = string.clip(str);
        if (!str.startsWith(`<`)) return new llquat();

        const cut = str.split(/[\<\,\>]/g).map(e => string.simplify(e)).filter(e => !string.empty(e));
        if (cut.length < 4) return new llquat();

        for (let i = 0; i < 4; ++i) {
            let sim = string.simplify(cut[i]);
            if (i < 3 && /^[+-]?inf/i.test(sim))
                if (!/^[+-]?(infinity|inf)$/i.test(sim))
                    return new llquat();

            let data;
            if (nan_regexp.test(sim)) data = sim;
            else {
                let num = numb.from_str(sim);
                if (numb.fast_nan(num)) return new llquat();
                data = `${num}`;
            }
            this.#entries[i] = ftsf([data]);
        }

        //console.log(this);
        return this;
    }

    to_quat() {
        if (!this.of_literal()) throw new error(`Call llquat.to_quat() on a not literal.`);
        return new quatd(
            numb.parse(this.#entries[QX].str),
            numb.parse(this.#entries[QY].str),
            numb.parse(this.#entries[QZ].str),
            numb.parse(this.#entries[QW].str)
        );
    }

    from_quat(v) {
        this.#entries[QX] = ftsf([`${v.x}`]);
        this.#entries[QY] = ftsf([`${v.y}`]);
        this.#entries[QZ] = ftsf([`${v.z}`]);
        this.#entries[QW] = ftsf([`${v.w}`]);
        return this;
    }

    negate() {
        if (!this.of_literal()) throw new error(`Call llquat.negate() on a not literal.`);
        return this.from_quat(quat_neg(this.to_quat()));
    }

    equals(r) {
        if (!this.of_literal()) throw new error(`Call llvec.negate() on a not literal.`);
        return quat_equals(r.to_quat(), this.to_quat());
    }

    add(r) {
        if (!this.of_literal()) throw new error(`Call llquat.add() on a not literal.`);
        return this.from_quat(quat_add(this.to_quat(), r.to_quat(), new quatd()));
    }

    rem(r) {
        if (!this.of_literal()) throw new error(`Call llquat.rem() on a not literal.`);
        return this.from_quat(quat_rem(this.to_quat(), r.to_quat(), new quatd()));
    }

    mult(r) {
        if (!this.of_literal()) throw new error(`Call llquat.mult() on a not literal.`);
        return this.from_quat(quat_mult(this.to_quat(), (kind_of(r) === `llquat`) ? r.to_quat() : r.value, new quatd()));
    }

    div(r) {
        const kind = kind_of(r);
        if (kind === `llfloat`) return this.from_quat(quat_div(this.to_quat(), r.value, new quatd()));
        if (kind === `llquat`) return this.from_quat(quat_div(this.to_quat(), r.to_quat(), new quatd()));
        throw new type_error(`quatd.div() call with unknow type.`);
    }

    opt_mem() {
        if (this.is_def()) return ftsf([`(`, `(quaternion)`, `""`, `)`]);
        return this.expr_ref;
    }
};