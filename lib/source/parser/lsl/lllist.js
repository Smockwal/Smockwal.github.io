import { array } from "../../../array.js";
import { error, range_error, type_error } from "../../../error.js";
import { flag, kind_of } from "../../../global.js";
import { numb } from "../../../math/number.js";
import { char } from "../../../text/char.js";
import { string } from "../../../text/string.js";
import { expr } from "../../expressions.js";
import { func } from "../../function.js";
import { src } from "../../source.js";
import { fast_token_fact as ftf, token } from "../../token.js";
import { fast_tokens_fact as ftsf } from "../../tokens.js";
import { llfloat } from "./llfloat.js";
import { llint } from "./llint.js";
import { llkey } from "./llkey.js";
import { llobj } from "./llobj.js";
import { llquat } from "./llquat.js";
import { llstr } from "./llstr.js";
import { llvec } from "./llvec.js";
import { eval_exp_type } from "./parsing.js";
import { count_entities, next_exp, prev_exp } from "./script.js";


const array_of_string = o => {
    let aout = [...o.entries];
    return aout.map(m => {
        switch (eval_exp_type(m)) {
            case `integer`: return new llint(m.front).str;
            case `float`: return numb.f32s_formatted(new llfloat(m.front).value);
            case `string`: return new llstr(m.front).value;
            case `key`: return new llkey(m.front).value;
            case `vector`: return new llvec(m.front).str;
            case `quaternion`: return new llquat(m.front).str;
            default: throw new type_error(`type mistake: type: ${vtype}.`);
        }
    });
};


export class lllist {

    // array of expression
    #entries = [];
    #literal = true;
    #exp;

    constructor(tok) { if (tok) this.parse(tok); }

    get kind() { return `lllist`; }

    get exp() { return this.#exp; }

    /** @returns {Number} */
    get length() { return this.#entries.length; }

    /** @returns {Array} */
    get entries() { return this.#entries; }
    set entries(x) {
        if (kind_of(x) !== `array`) throw new type_error(`parameter must be of type "array".`);
        this.#entries = x;
    }

    /** @returns {String} */
    get str() {
        let aout = [...this.#entries];
        return `[${aout.map(m => m.str).join(`, `)}]`;
    }

    /** @returns {String} */
    get jstr() {
        if (this.empty()) return `[]`;
        let ret = [];
        for (let i = 0; i < this.length; ++i) {
            const exp = this.#entries[i];
            if (exp.front) {
                if (exp.front.op === `{`) ret = [...ret, new llobj(exp.front).jstr];
                else if (exp.front.op === `[`) ret = [...ret, new lllist(exp.front).jstr];
                else ret = [...ret, exp.str];
                if (i !== this.length - 1) ret = [...ret, `,`];
            }
        }

        return [`[`, ...ret, `]`].join(``);
    }

    get front() {
        if (this.#entries.length == 0) return new expr();
        return this.#entries[0];
    }

    get front_tok() {
        if (this.#entries.length == 0) return new token();
        return this.#entries[0].front;
    }

    get back() {
        if (this.#entries.length == 0) return new expr();
        return this.#entries[this.#entries.length - 1];
    }

    get back_tok() {
        if (this.#entries.length == 0) return new token();
        return this.#entries[this.#entries.length - 1].back;
    }

    get last() { return this.#entries[this.#entries.length - 1]; }

    get expr() {
        if (this.#entries.length == 0) 
            return expr.align_location(src.flag_tokens(ftsf([`[`,`]`])));

        const ret = ftsf([`[`]);
        for (const entry of this.#entries) {
            ret.copy(entry);
            ret.push_back(ftf(`,`));
        }
        if (this.empty()) ret.push_back(ftf(`]`));
        else ret.back.str = `]`;
        return expr.align_location(src.flag_tokens(ret));
    }

    get expr_ref() {
        const exp = new expr(this.front_tok, this.back_tok);
        if (exp.front.prev && (exp.front.prev.op === `[` || exp.front.prev.str === `(list)`)) exp.front = exp.front.prev;
        if (exp.back.next && exp.back.next.op === `]`) exp.back = exp.back.next;
        return exp;
    }

    /** 
     * @param {token} tok 
     * @returns {lllist}
     */
    parse(tok) {

        this.#entries = [];
        this.#exp = expr.match(tok);
        if (tok.flag & flag.LIST_OP_FLAG) {

            if (tok.next.flag & flag.LIST_CL_FLAG) return this;

            let first = this.#exp.front.next;

            for (let it = first; this.#exp.end(it); it = this.#exp.next(it)) {
                if (!(it.flag & flag.SYMBOL_FLAG)) continue;

                if (char.is_one_of(it.op, `{([<`)) it = expr.match(it).back;
                else if (char.is_one_of(it.op, `],`)) {

                    this.push_back(new expr(first, it.prev));
                    first = it.next;
                }
            }
            this.#literal = true;
        }
        else if (tok.flag & flag.CASTING_FLAG && tok.str === `(list)`) {
            let first = tok.next, it = first;
            for (; it.next; it = it.next) {
                if (!(it.flag & flag.SYMBOL_FLAG)) continue;

                if (char.is_one_of(it.op, `(<`))
                    it = expr.match(it).back;
                else if (it.op == `+`) {
                    if (eval_exp_type(next_exp(it)) === `list`) break;

                    this.push_back(new expr(first, it.prev));
                    first = it.next;
                }
                else break;
                if (!it.next) break;
            }
            this.push_back(new expr(first, it.is(first) ? it : it.prev));
            this.#literal = false;
        }
        else if (tok.op == `(` || tok.flag & (flag.VECTOR_OP_FLAG | flag.QUAT_OP_FLAG)) {
            this.push_back(expr.match(tok));
        }
        else if (tok.flag & (flag.NUMBER_FLAG | flag.STRING_FLAG | flag.VARIABLE_FLAG)) {
            this.push_back(new expr(tok, tok));
        }
        else if (tok.flag & (flag.USER_FUNC_FLAG | flag.DEF_FUNC_FLAG)) {
            const call = new func(tok);
            this.push_back(call.expr);
        }
        else throw new type_error(`The token does not represent a list: ${tok.str} : ${tok.loc.str()}`);

        //console.log(this);
        return this;
    }

    /** @returns {Boolean} */
    empty() { return this.#entries.length === 0; }

    /**
     * @param {Number} index 
     * @returns {expr}
     */
    at(index) {
        if (index < 0) index += this.#entries.length;
        if (index < 0 || index >= this.#entries.length)
            throw new range_error(`index out of range.`);
        return this.#entries[index];
    }

    to_string_array() { return array_of_string(this); }

    push_back(...arg) {
        arg = arg.flatMap(e => (kind_of(e) === `lllist`) ? e.#entries : e);
        arg.map(m => {
            const kind = kind_of(m);
            if (kind_of(m) !== `expr` && kind_of(m) !== `tokens`)
                throw new error(`Atempt to append a ${m.constructor.name} to a lllist.`);
        });

        this.#entries = [...this.#entries, ...arg].flat(Infinity);
    }

    push_front(...arg) {
        arg = arg.flatMap(e => (kind_of(e) === `lllist`) ? e.#entries : e);
        arg.map(m => {
            const kind = kind_of(m);
            if (kind_of(m) !== `expr` && kind_of(m) !== `tokens`)
                throw new error(`Atempt to append a ${m.constructor.name} to a lllist.`);
        });
        this.#entries = [...arg, ...this.#entries].flat(Infinity);
    }

    is_literal() { return this.#literal; }

    of_literal() {
        if (this.empty()) return true;
        return this.#entries.every(e => {
            const count = count_entities(e);
            if (count == 1 || (count == 2 && e.front.str == `(key)`)) {
                if (e.front.flag & (flag.NUMBER_FLAG | flag.STRING_FLAG))
                    return true;
                else if (e.front.flag & flag.VECTOR_OP_FLAG)
                    return new llvec(e.front).of_literal();
                else if (e.front.flag & flag.QUAT_OP_FLAG)
                    return new llquat(e.front).of_literal();
                else if (e.front.str == `(key)`)
                    return !!(e.front.next.flag & flag.STRING_FLAG);
                else return false;
            }
            else return false;
        });
    };

    /** 
     * @param {token} tok 
     * @returns {lllist}
     */
    static collect(tok) {
        //if (!tok)
        //console.trace(`lllist.collect(${tok})`);

        const lout = new lllist(tok);
        let it = lout.empty() ? tok : lout.back_tok;
        let max = 0;

        while (true) {
            if (!it.next) break;

            let plus = it.next; // (list)a + []
            if (it.next.next && it.next.next.str == `+`) // [] + []
                plus = it.next.next;

            if (!plus || plus.str !== `+`) break;

            const next = next_exp(plus);
            if (eval_exp_type(next) === `list` && !(next.front.flag & (flag.LIST_OP_FLAG | flag.CASTING_FLAG))) break;

            if (next.front.flag & flag.LIST_OP_FLAG || next.front.str == `(list)`) {
                let list = new lllist(next.front);
                if (list.empty()) {
                    it = next.back;
                    continue;
                }
                lout.push_back(list);
            }
            else lout.push_back(next);

            it = lout.back_tok;
            if (++max > 100) throw new error(`Fix me`);
            lout.#literal = false;
        }

        it = lout.empty() ? tok : lout.front_tok;
        while (true) {
            if (!it.prev) break;

            let plus = it.prev; // (list)a + []
            if (it.prev.prev && it.prev.prev.str == `+`) // [] + []
                plus = it.prev.prev;

            if (!plus || plus.str !== `+`) break;

            const prev = prev_exp(plus);
            if (eval_exp_type(prev) === `list` && !(prev.front.flag & (flag.LIST_OP_FLAG | flag.CASTING_FLAG))) break;

            if (prev.front.flag & flag.LIST_OP_FLAG) {
                let list = new lllist(prev.front);
                if (list.empty()) {
                    it = prev.front;
                    continue;
                }
                lout.push_front(list);
            }
            else {
                if (prev.front.str == `(list)`)
                    prev.front = prev.front.next;
                lout.push_front(prev);
            }

            it = lout.front_tok;
            if (++max > 100) throw new error(`Fix me`);
            lout.#literal = false;
        }

        //console.log(lout);
        return lout;
    };

    cast(type) {
        switch (type) {
            case `string`: {
                //const aout = this.#entries.map(m => cast_to(m, type).str);
                const aout = this.to_string_array();
                return ftsf([`"${aout.map(e => e.startsWith(`"`) ? string.clip(e) : e).join(``)}"`]);
            }
            case `list`: return this.expr;
            default: throw new type_error(`type mistake: can't cast list to ${type}`);
        }
    };

    opt_mem() {
        const ret = ftsf([`(list)`]);
        for (const entry of this.#entries) {
            const length = count_entities(entry);
            if (length > 1) ret.push_back(new token(`(`));
            ret.copy(entry);
            if (length > 1) ret.push_back(new token(`)`));
            ret.push_back(new token(`+`));
        }
        ret.delete_token(ret.back);
        return ret;
    };
};



