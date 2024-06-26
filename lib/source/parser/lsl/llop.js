import { error } from "../../../error.js";
import { flag, kind_of } from "../../../global.js";
import { numb } from "../../../math/number.js";
import { char } from "../../../text/char.js";
import { string } from "../../../text/string.js";
import { expr } from "../../expressions.js";
import { operator } from "../../operator.js";
import { fast_tokens_fact } from "../../tokens.js";
import { llfloat } from "./llfloat.js";
import { eval_exp_type } from "./parsing.js";
import { next_exp, prev_exp } from "./script.js";



export class llop extends operator {
    #tok;
    #prev_exp;
    #prev_type;
    #next_exp;
    #next_type;
    #is_div;

    /** @param {token} tok */
    constructor(tok) {
        if (kind_of(tok) !== `token`) throw new error(`tok is not a token.`);
        super();
        this.#tok = tok;
        this.#is_div = tok.op === `/`;
    };

    /** @returns {token} */
    get tok() { return this.#tok; };
    /** @returns {String} */
    get str() { return this.#tok.str; };

    /** @returns {expr} */
    get prev_exp() {
        if (!this.#prev_exp && this.#tok.prev)
            this.#prev_exp = prev_exp(this.#tok);
        return this.#prev_exp;
    };
    /** @returns {String} */
    get prev_type() {
        if (!this.#prev_type)
            this.#prev_type = eval_exp_type(this.prev_exp);
        return this.#prev_type;
    };

    /** @returns {expr} */
    get next_exp() {
        if (!this.#next_exp && this.#tok.next)
            this.#next_exp = next_exp(this.#tok);
        return this.#next_exp;
    };
    /** @returns {String} */
    get next_type() {
        if (!this.#next_type)
            this.#next_type = eval_exp_type(this.next_exp);
        return this.#next_type;
    };

    /** @returns {expr} */
    get expr() {
        const first = this.is_unary_op() ? this.#tok : this.prev_exp.front;
        return new expr(first, this.next_exp.back);
    };

    /** @returns {Boolean} */
    is_neg_op() {
        if (!this.#tok || this.#tok.op !== `-`) return false;
        if (!this.#tok.prev) return true;
        if (this.#tok.prev.op === `)` || this.#tok.prev.flag & (flag.VECTOR_CL_FLAG | flag.QUAT_CL_FLAG)) return false;
        if (this.#tok.prev.flag & (flag.SYMBOL_FLAG | flag.CASTING_FLAG | flag.CONTROL_FLAG)) return true;
        return false;
    };

    /** @returns {Boolean} */
    is_unary_op() {
        if (!this.#tok || !char.is_one_of(this.#tok.op, `!~-`)) return false;
        if (this.#tok.op === `-` && !this.is_neg_op()) return false;
        return true
    };

    /** @returns {Boolean} */
    is_math_op() { return this.#tok.prev.flag & flag.NUMBER_FLAG && this.#tok.next.flag & flag.NUMBER_FLAG; }
    /** @returns {Boolean} */
    static is_math_op(tok) { return tok.prev.flag & flag.NUMBER_FLAG && tok.next.flag & flag.NUMBER_FLAG; }

    /** @returns {Boolean} */
    is_str_op() { return this.#tok.prev.flag & flag.STRING_FLAG && this.#tok.next.flag & flag.STRING_FLAG; }
    /** @returns {Boolean} */
    static is_str_op(tok) { return tok.prev.flag & flag.STRING_FLAG && tok.next.flag & flag.STRING_FLAG; }

    /** @returns {Boolean} */
    is_vec_op() { return this.#tok.prev.flag & flag.VECTOR_CL_FLAG && this.#tok.next.flag & flag.VECTOR_OP_FLAG; }
    /** @returns {Boolean} */
    static is_vec_op(tok) { return tok.prev.flag & flag.VECTOR_CL_FLAG && tok.next.flag & flag.VECTOR_OP_FLAG; }

    /** @returns {Boolean} */
    is_quat_op() { return this.#tok.prev.flag & flag.QUAT_CL_FLAG && this.#tok.next.flag & flag.QUAT_OP_FLAG; }
    /** @returns {Boolean} */
    static is_quat_op(tok) { return tok.prev.flag & flag.QUAT_CL_FLAG && tok.next.flag & flag.QUAT_OP_FLAG; }

    /** @returns {Boolean} */
    is_list_op() { return this.#tok.prev.flag & flag.LIST_CL_FLAG && this.#tok.next.flag & flag.LIST_OP_FLAG; }
    /** @returns {Boolean} */
    static is_list_op(tok) { return tok.prev.flag & flag.LIST_CL_FLAG && tok.next.flag & flag.LIST_OP_FLAG; }


    /** @returns {expr} */
    eval() {
        let is_float = string.is_float(this.#tok.next.str),
            is_int_div = (this.#is_div && string.is_integer(this.#tok.next.str));

        if (!this.is_unary_op()) {
            is_float |= string.is_float(this.#tok.prev.str);
            is_int_div &= (this.#is_div && string.is_integer(this.#tok.prev.str));
        }

        let value;
        try {
            value = new Function(`return (${this.expr.str});`)();
        }
        catch (e) {
            //console.log(this.expr.str);
            return this.expr;
            //throw Error(`failed to evaluate "${str}" expression. \n${e.message}`);
        }

        if (/(true|false)/i.test(`${value}`)) value = numb.b2i(value);
        else if (is_int_div) value = Math.trunc(value);
        else if (is_float) value = llfloat.format(value);
        return fast_tokens_fact([`${value}`]);
    }
}
