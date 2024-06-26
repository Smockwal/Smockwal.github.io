import { error } from "../../../error.js";
import { flag } from "../../../global.js";
import { numb } from "../../../math/number.js";
import { char } from "../../../text/char.js";
import { infinity_regexp, nan_regexp, uuid_exp } from "../../../text/regex.js";
import { reset_index, string } from "../../../text/string.js";
import { expr } from "../../expressions.js";
import { func } from "../../function.js";
import { vec_gen_literal } from "../../literal.js";
import { location } from "../../location.js";
import { message } from "../../message.js";
import { options } from "../../options.js";
import { SCOPE_GLOBAL, src } from "../../source.js";
import { fast_token_fact as ftf } from "../../token.js";
import { fast_tokens_fact as ftsf, tokens } from "../../tokens.js";
import { llfloat } from "./llfloat.js";
import { llfunc } from "./llfunc.js";
import { llint } from "./llint.js";
import { llliteral } from "./lliteral.js";
import { llkey } from "./llkey.js";
import { lllist } from "./lllist.js";
import { llop } from "./llop.js";
import { llquat } from "./llquat.js";
import { llstr } from "./llstr.js";
import { llvec } from "./llvec.js";
import { eval_exp_type, op_ord } from "./parsing.js";
import { CODE_ENTRY, count_entities, next_exp, prev_exp, script } from "./script.js";

var bDone = true;
var bDeep = 0;

export const optimizing = async toks => {
    if (!toks || toks.empty()) throw new error(`function call on empty tokens.`);

    if (options.get(`optimize`, `foldconst`)) {
        bDeep = 0;
        await do_fold_const(toks);
        if (message.has_error()) return console.trace(toks);
        //console.log(`<- foldconst: `, await formatter(toks));
    }

    if (options.get(`optimize`, `operators`)) {
        src.parse_src(toks);
        await opt_oper(toks);
        if (message.has_error()) return console.trace(toks);
        //console.log(`<- operators: `, await formatter(toks));
    }

    if (options.get(`optimize`, `literal`)) {
        src.parse_src(toks);
        await opt_const(toks);
        if (message.has_error()) return console.trace(toks);
        //console.log(`<- literal: `, await formatter(toks));
    }

    if (options.get(`optimize`, `cleaning`)) {
        src.parse_src(toks);
        await clean_source(toks);
        if (message.has_error()) return console.trace(toks);
        //console.log(`<- cleaning: `, await formatter(toks));
    }

    if (options.get(`optimize`, `rename`)) {
        src.parse_src(toks);
        await opt_name(toks);
        console.log(`<- rename: `, toks.str);
        if (message.has_error()) return console.trace(toks);
        //console.log(`<- rename: `, await formatter(toks));
    }

};

/**
 * @param {tokens|expr} toks 
 * @param {Boolean} in_list 
 */
const do_fold_const = async toks => {
    //console.log(await formatter(toks));
    if (!toks || toks.empty()) throw new error(`function call on empty tokens.`);
    if (++bDeep > 100) throw new error("too deep.");

    let it_count = 0;
    do {
        if (toks.empty()) throw new error(`Fix me.`);
        bDone = true;

        for (let tok = toks.front; toks.end(tok); tok = toks.next(tok)) {
            if (tok.flag & flag.VARIABLE_FLAG) {
                tok = swap_unasign(toks, tok);
            }
            else if (tok.flag & flag.DEF_FUNC_FLAG /*&& it_count >= 1*/) {
                tok = solve_def_func(toks, tok);
                //console.log(`DEF_FUNC_FLAG`, string.simplify(toks.str));
            }
            else if (tok.flag & (flag.LIST_OP_FLAG | flag.VECTOR_OP_FLAG | flag.QUAT_OP_FLAG)) {
                const exp = expr.match(tok);
                //console.log(`-> "${exp.str}"`);

                let loc_done = bDone;
                if (!exp.front.next.is(exp.back)) {
                    const inside = new expr(exp.front.next, exp.back.prev);
                    if (count_entities(inside) > 1) await do_fold_const(inside);
                }
                bDone = loc_done;
                //console.log(`<- "${exp.str}"`);
            }
            else if (tok.op === `(`) {
                if (tok.prev && (tok.prev.flag & (flag.USER_FUNC_FLAG | flag.DEF_FUNC_FLAG | flag.CONTROL_FLAG | flag.EVENT_FLAG))) continue;

                const param = expr.match(tok);
                const exp = new expr(param.front.next, param.back.prev);

                let loc_done = bDone;
                if (count_entities(exp) > 1)
                    await do_fold_const(exp);
                bDone = loc_done;

                if (count_entities(exp) === 1) {
                    tok = replace_tokens(toks, param.front, param.back, exp);
                }
            }
        }

        for (let i = 1; i < op_ord.length; ++i) {
            for (let tok = toks.front; toks.end(tok); tok = toks.next(tok)) {
                if ((!(tok.flag & (flag.SYMBOL_FLAG | flag.CASTING_FLAG)) || !op_ord[i].includes(tok.str))) continue;
                if (char.is_one_of(tok.op, `<>`) && vec_gen_literal(tok)) continue;
                tok = await solve_operator(toks, tok);
                //console.log(string.simplify(toks.str));
            }
        }
        //console.log(string.simplify(toks.str));

        //if (it_count === 0) bDone = false;
        if (++it_count > 10) throw new error("Fix me.");
        //console.log(`Done: `, bDone, `toks: `, toks.stringify());
        //if (bDeep === 1) src.parse_src(toks);
    } while (!bDone);

    for (let tok = toks.front; toks.end(tok) && bDeep === 1; tok = toks.next(tok)) {
        if (string.is_numb(tok.str)) {
            if (string.is_float(tok.str)) tok.str = numb.f32s_formatted(new llfloat(tok.str).value, 8);
            else tok.str = `${new llint(tok).i32}`;

            if (nan_regexp.test(tok.str)) tok.str = `${tok.str[0] === "-" ? "-" : ""}nan`;
            else if (infinity_regexp.test(tok.str)) tok.str = `${tok.str[0] === "-" ? "-" : ""}inf`;
        }
    }

    //console.log(`it_count=> ${it_count}`);
    --bDeep;
};

const replace_tokens = (toks, start, end, exp) => {
    if (!toks || toks.empty()) throw new error(`function call on empty tokens.`);
    //console.log(`toks: `, toks, `start: `, start, `end: `, end, `exp: `, exp);
    bDone = false;
    let first, last, rep;
    if (start.front) {
        first = start.front;
        last = start.back;
        rep = end;
    } else {
        first = start;
        last = end;
        rep = exp;
    }

    //rep = src.flag_tokens(rep);
    const loc = new location(first.loc);
    for (let tok = src.flag_tokens(rep).front; rep.end(tok); tok = rep.next(tok)) {
        tok.loc = loc;
        if (Math.abs(loc.col - last.loc.col) > 2)
            loc.adjust(tok.str);
    }

    return toks.replace(first, last, rep);
};

const delete_tokens = (toks, start, end) => {
    bDone = false;
    if (start.front)
        [end, start] = [start.back, start.front];

    const prev = start.prev;
    toks.delete_tokens(start, end);
    return prev ? prev : toks.front;
}

const swap_unasign = (toks, tok) => {
    if (!toks || toks.empty()) throw new error(`function call on empty tokens.`);

    let inst = src.get_var(tok);
    if (!inst || tok.is(inst.tok) || inst.tok.flag & flag.PARAM_FLAG) return tok;

    if (inst.tok.scope !== SCOPE_GLOBAL && inst.tok.flag & flag.INITED_FLAG) {
        if (next_exp(inst.tok.next).back.next.op !== `;`) return tok;
        //if (inst.tok.next.next.next.op !== `;`) return tok;
    }

    if (!(inst.tok.flag & flag.ASSIGNED_FLAG)) {
        const vtype = inst.type;

        if (vtype === `list`) {
            if (inst.tok.flag & flag.INITED_FLAG) {
                if (!(inst.tok.next.next.flag & (flag.CASTING_FLAG | flag.LIST_OP_FLAG))) return tok;
                const list = lllist.collect(inst.tok.next.next);
                if (list.is_literal()) {
                    if (list.length <= 1) return replace_tokens(toks, tok, tok, list.expr);
                }
                return tok;

            }
            return replace_tokens(toks, tok, tok, ftsf([`[`, `]`]));
        }
        if ((vtype === `vector` || vtype === `quaternion`) && tok.next && tok.next.op === `.`) return tok;

        let vtoks;
        if (!(inst.tok.flag & flag.INITED_FLAG)) {
            vtoks = new tokens(llliteral.default_for(vtype));
        }
        else {
            vtoks = next_exp(inst.tok.next);
            if (vtoks.back.next && vtoks.back.next.op !== `;`) return tok;
        }
        //if (vtoks.str === `g_sLeashedToName`) console.log(`g_sLeashedToName`, flag.to_string(vtoks.front.flag));
        if (!vtoks || vtoks.empty()) return tok;

        if (inst.type === "string" || inst.type === "key") {
            if (vtoks.front.flag & flag.CASTING_FLAG ||
                vtoks.front.str.length > 32 ||
                uuid_exp.test(vtoks.front.str))
                return tok;
        }

        let bgood = true;
        for (let it = vtoks.front; bgood && it !== vtoks.back.next; it = it.next)
            bgood &= !(it.flag & (flag.DEF_FUNC_FLAG | flag.USER_FUNC_FLAG));
        if (!bgood) return tok;

        //if (vtoks.str === `g_sLeashedToName`) console.log(`g_sLeashedToName`, flag.to_string(vtoks.front.flag));
        return replace_tokens(toks, tok, tok, new tokens().copy(vtoks));
    }
    return tok;
};

const solve_def_func = (toks, tok) => {
    //console.log(`solve_def_func: `, string.simplify(toks.stringify()));
    if (!toks || toks.empty()) throw new error(`function call on empty tokens.`);

    const call = new func(tok), args = [];
    //console.log(call);
    for (let i = 0; i < call.args_length; ++i) {
        const arg = call.arg_at(i);
        //console.log(arg);
        if (count_entities(arg) !== 1) return tok;
        else if (arg.front.flag & (flag.USER_FUNC_FLAG | flag.DEF_FUNC_FLAG)) return tok;

        else if (arg.front.flag & flag.STRING_FLAG) args.push(arg);
        else if (arg.front.flag & (flag.NUMBER_FLAG | flag.VARIABLE_FLAG) === flag.NUMBER_FLAG) args.push(arg);

        else if (arg.front.flag & (flag.STRING_FLAG | flag.NUMBER_FLAG)) args.push(arg);
        else if (arg.front.str === `(key)` && arg.front.next.flag & flag.STRING_FLAG) args.push(arg);
        else if (arg.front.flag & flag.LIST_OP_FLAG && new lllist(arg.front).of_literal()) args.push(arg);
        else if (arg.front.flag & flag.VECTOR_OP_FLAG && new llvec(arg.front).of_literal()) args.push(arg);
        else if (arg.front.flag & flag.QUAT_OP_FLAG && new llquat(arg.front).of_literal()) args.push(arg);
        else if (arg.front.flag & flag.VARIABLE_FLAG) {
            const inst = src.get_var(tok);
            if (inst && inst.tok.flag & (flag.INITED_FLAG | flag.ASSIGNED_FLAG) === flag.INITED_FLAG && call.type !== `list`) {
                const next = next_exp(inst.tok.next);
                if (next.back.next.op !== `;`) return tok;
                args.push(next);
            } else return tok;
        }
        else return tok;
    };

    //console.log(`args: `, args);
    let val = undefined;
    if (llfunc[tok.str])
        val = llfunc[tok.str](args);

    //console.log(`val: `, val ? val.str : undefined);
    if (val) {
        if (val.front) tok = replace_tokens(toks, call.expr, val);
        else tok = replace_tokens(toks, call.expr, new tokens(`${val}`));
    }
    //console.log(`solve_def_func: `, string.simplify(toks.stringify()));
    return tok;
};

/**
 * 
 * @param {expr|tokens} toks 
 * @param {token} tok 
 * @returns {Promise|token}
 */
const finalize_op = (toks, tok) => {
    bDone = false;
    toks.delete_token(tok.prev);
    toks.delete_token(tok.next);
    return tok;
};

const solve_operator = async (toks, tok) => {
    if (!toks || toks.empty()) throw new error(`function call on empty tokens.`);
    //console.log(tok.str);

    const op = new llop(tok);
    switch (tok.str) {

        case `(float)`: case `(key)`: case `(integer)`: case `(list)`:
        case `(rotation)`: case `(quaternion)`: case `(vector)`: case `(string)`: {
            if (tok.str === `(key)` && op.next_exp.front.flag & flag.STRING_FLAG) return tok;
            if (!(op.next_exp.front.flag & (flag.NUMBER_FLAG | flag.STRING_FLAG | flag.VECTOR_OP_FLAG | flag.QUAT_OP_FLAG | flag.LIST_OP_FLAG))) return tok;
            if (op.next_exp.front.flag & flag.VARIABLE_FLAG) return tok;
            return replace_tokens(toks, tok, op.next_exp.back, cast_to(op.next_exp, string.clip(tok.str)));
        }

        case `!`: {
            if (tok.next && tok.next.op === `!` && tok.next.next && tok.next.next.op === `!`) {
                return delete_tokens(toks, tok.next, tok.next.next);
            }
        }
        case `~`: {
            if (!op.is_unary_op() || !(tok.next && tok.next.flag & flag.NUMBER_FLAG)) break;
            return replace_tokens(toks, op.expr, op.eval());
        }

        case `-`: {
            if (op.is_neg_op()) {
                if (tok.next.flag & flag.NUMBER_FLAG) {
                    return replace_tokens(toks, op.expr, op.eval());
                }
                else if (tok.next.flag & (flag.VECTOR_OP_FLAG | flag.QUAT_OP_FLAG)) {
                    let val;
                    if (tok.next.flag & flag.VECTOR_OP_FLAG) val = new llvec(tok.next);
                    else if (tok.next.flag & flag.QUAT_OP_FLAG) val = new llquat(tok.next);

                    if (val.of_literal())
                        return replace_tokens(toks, op.expr, val.negate().expr);
                }
            }
            else if (op.is_math_op()) {
                return replace_tokens(toks, op.expr, op.eval());
            }
            else if (op.is_vec_op()) {
                const left = new llvec(op.prev_exp.front), right = new llvec(tok.next);
                if (!left.of_literal() || !right.of_literal()) return tok;
                return replace_tokens(toks, op.expr, left.rem(right).expr);
            }
            else if (op.is_quat_op()) {
                const left = new llquat(op.prev_exp.front), right = new llquat(tok.next);
                if (!left.of_literal() || !right.of_literal()) return tok;
                return replace_tokens(toks, op.expr, left.rem(right).expr);
            }
        } break;

        case `*`: {
            if (op.is_math_op()) {
                return replace_tokens(toks, op.expr, op.eval());
            }
            else if (op.is_vec_op()) {
                let left = new llvec(op.prev_exp.front), right = new llvec(tok.next);
                if (!left.of_literal() || !right.of_literal()) return tok;
                return replace_tokens(toks, op.expr, left.mult(right));
            }
            else if (tok.prev.flag & flag.VECTOR_CL_FLAG && tok.next.flag & flag.NUMBER_FLAG) {
                let left = new llvec(op.prev_exp.front), right = new llfloat(tok.next);
                if (!left.of_literal()) return tok;
                return replace_tokens(toks, op.expr, left.mult(right).expr);
            }
            else if (tok.prev.flag & flag.NUMBER_FLAG && tok.next.flag & flag.VECTOR_OP_FLAG) {
                const left = new llfloat(op.prev_exp.front), right = new llvec(tok.next);
                if (!right.of_literal()) return tok;
                return replace_tokens(toks, op.expr, left.mult(right).expr);
            }
            else if (tok.prev.flag & flag.VECTOR_CL_FLAG && tok.next.flag & flag.QUAT_OP_FLAG) {
                let left = new llvec(op.prev_exp.front), right = new llquat(tok.next);
                if (!left.of_literal() || !right.of_literal()) return tok;
                return replace_tokens(toks, op.expr, left.mult(right).expr);
            }
            else if (op.is_quat_op()) {
                const left = new llquat(op.prev_exp.front), right = new llquat(tok.next);
                if (!left.of_literal() || !right.of_literal()) return tok;
                return replace_tokens(toks, op.expr, left.mult(right).expr);
            }
        } break;

        case `/`: {
            if (op.is_math_op()) {
                const num0 = numb.parse(tok.prev.str), num1 = numb.parse(tok.next.str);
                if (numb.is_finite(num0) && numb.is_finite(num1) && num1 !== 0) {
                    return replace_tokens(toks, op.expr, op.eval());
                }
            }
            else if (tok.prev.flag & flag.VECTOR_CL_FLAG && tok.next.flag & flag.NUMBER_FLAG) {
                const left = new llvec(op.prev_exp.front), right = new llfloat(tok.next);
                if (!left.of_literal()) return tok;
                return replace_tokens(toks, op.expr, left.div(right).expr);
            }
            else if (tok.prev.flag & flag.VECTOR_CL_FLAG && tok.next.flag & flag.QUAT_OP_FLAG) {
                const left = new llvec(op.prev_exp.front), right = new llquat(tok.next);
                if (!left.of_literal() || !right.of_literal()) return tok;
                return replace_tokens(toks, op.expr, left.div(right).expr);
            }
            else if (op.is_quat_op()) {
                const left = new llquat(op.prev_exp.front), right = new llquat(tok.next);
                if (!left.of_literal() || !right.of_literal()) return tok;
                return replace_tokens(toks, op.expr, left.div(right).expr);
            }
        } break;

        case `+`: {
            if (op.is_math_op()) {
                return replace_tokens(toks, op.expr, op.eval());
            }
            else if (tok.prev.str === `""`)
                return delete_tokens(toks, tok.prev, tok);
            else if (tok.next.str === `""`)
                return delete_tokens(toks, tok, tok.next);
            else if (op.is_str_op()) {
                tok.str = `"${string.clip(tok.prev.str)}${string.clip(tok.next.str)}"`;
                return finalize_op(toks, tok);
            }
            else if (op.is_vec_op()) {
                const left = new llvec(op.prev_exp.front), right = new llvec(tok.next);
                if (!left.of_literal() || !right.of_literal()) return tok;
                return replace_tokens(toks, op.expr, left.add(right).expr);
            }
            else if (op.is_quat_op()) {
                const left = new llquat(op.prev_exp.front), right = new llquat(tok.next);
                if (!left.of_literal() || !right.of_literal()) return tok;
                return replace_tokens(toks, op.expr, left.add(right).expr);
            }
            else if (op.is_list_op()) {
                const next_list = new lllist(tok.next);
                if (next_list.empty()) return delete_tokens(toks, tok, tok.next.next);

                const prev_list = new lllist(op.prev_exp.front);
                if (prev_list.empty()) return delete_tokens(toks, op.prev_exp.front, tok);

                return replace_tokens(toks, tok.prev, tok.next, ftsf([`,`]));
            }
            else if (op.prev_type === `list`) {
                //console.log(op.expr.str);
                //console.log(tok.prev.str, flag.to_string(tok.prev.flag));
                //console.log(tok.next.str, flag.to_string(tok.next.flag));

                if (op.next_type !== `list`) {
                    if (tok.prev.flag & flag.LIST_CL_FLAG) {
                        let repl;
                        if (tok.prev && tok.prev.prev && tok.prev.prev.op !== `[`) repl = ftsf([`,`]);
                        else repl = new tokens();

                        repl.copy(op.next_exp).push_back(ftf(`]`));
                        return replace_tokens(toks, tok.prev, op.next_exp.back, repl);
                    }

                    const next = new lllist(tok.next);
                    return replace_tokens(toks, next.expr_ref, next.expr);
                }
            }
        } break;

        case `%`: {
            if (op.is_math_op()) {
                if (numb.parse(tok.next.str) !== 0) {
                    return replace_tokens(toks, op.expr, op.eval());
                }
            }
            else if (op.is_vec_op()) {
                const left = new llvec(op.prev_exp.front), right = new llvec(tok.next);
                if (!left.of_literal() || !right.of_literal()) return tok;
                return replace_tokens(toks, op.expr, left.mod(right).expr);
            }
        } break;

        case `>>`: {
            if (op.is_math_op()) {
                return replace_tokens(toks, op.expr, op.eval());
            }
        } break;

        case `<<`: {
            if (op.is_math_op()) {
                return replace_tokens(toks, op.expr, op.eval());
            }
        } break;

        case `|`: case `&`: case `^`: {
            if (op.is_math_op()) {
                return replace_tokens(toks, op.expr, op.eval());
            }
        } break;

        case `&&`: case `||`: {
            if (op.is_math_op()) {
                return replace_tokens(toks, op.expr, op.eval());
            }
        } break;

        case `<`: case `>`: case `>=`: case `<=`: {
            if (nan_regexp.test(tok.prev.str) || nan_regexp.test(tok.prev.str))
                return replace_tokens(toks, op.expr, ftsf([`0`]));
            else if (op.is_math_op())
                return replace_tokens(toks, op.expr, op.eval());
        } break;

        case `==`: case `!=`: {
            if (nan_regexp.test(tok.prev.str) || nan_regexp.test(tok.prev.str)) {
                const val = `${numb.b2i(tok.str === `!=`)}`;
                return replace_tokens(toks, op.expr, ftsf([val]));
            }
            else if (op.is_math_op()) {
                return replace_tokens(toks, op.expr, op.eval());
            }
            else if (op.is_str_op()) {
                let val;
                if (tok.str === `==`) val = (tok.prev.str === tok.next.str);
                else val = (tok.prev.str !== tok.next.str);
                return replace_tokens(toks, op.expr, ftsf([`${numb.b2i(val)}`]));
            }
            else if (tok.prev.flag & flag.STRING_FLAG && (tok.next.str === `(key)` && tok.next.next.flag & flag.STRING_FLAG)) {
                let val;
                if (tok.str === `==`) val = (tok.prev.str === tok.next.next.str);
                else val = (tok.prev.str !== tok.next.next.str);
                return replace_tokens(toks, op.expr, ftsf([`${numb.b2i(val)}`]));
            }
            else if (op.is_list_op()) {
                const la = lllist.collect(prev_exp(tok).front), lb = lllist.collect(tok.next);

                if (tok.str === `!=`) tok.str = `${la.length - lb.length}`;
                else tok.str = `${numb.b2i(la.length === lb.length)}`;

                delete_tokens(toks, prev_exp(tok));
                delete_tokens(toks, next_exp(tok));
            }
            else if (op.is_vec_op()) {
                const left = new llvec(op.prev_exp.front), right = new llvec(tok.next);
                if (!left.of_literal() || !right.of_literal()) return tok;
                return replace_tokens(toks, op.expr, ftsf([`${numb.b2i(left.equals(right))}`]));
            }
            else if (op.is_quat_op()) {
                const left = new llquat(op.prev_exp.front), right = new llquat(tok.next);
                if (!left.of_literal() || !right.of_literal()) return tok;
                return replace_tokens(toks, op.expr, ftsf([`${numb.b2i(left.equals(right))}`]));
            }
        } break;
    }
    return tok;
};

export const cast_to = (exp, type) => {
    //console.log(exp.str);
    let tout = undefined;
    switch (eval_exp_type(exp)) {
        case `integer`: tout = new llint(exp.front).cast(type); break;
        case `float`: tout = new llfloat(exp.front).cast(type); break;
        case `string`: tout = new llstr(exp.front).cast(type); break;
        case `key`: tout = new llkey(exp.front).cast(type); break;
        case `vector`: tout = new llvec(exp.front).cast(type); break;
        case `quaternion`: tout = new llquat(exp.front).cast(type); break;
        case `list`: tout = new lllist(exp.front).cast(type); break;
        default: throw new error(`Unknow type: ${exp.str}/${eval_exp_type(exp)}`);
    }

    return tout ? tout : new tokens();
};

/** @param {expr|tokens} toks */
const opt_oper = async toks => {
    if (!toks || toks.empty()) throw new error(`function call on empty tokens.`);
    //console.trace(`opt_oper =>`, string.simplify(toks.str));

    for (let i = 1; i < op_ord.length; ++i) {
        bDone = true;
        for (let tok = toks.front; toks.end(tok); tok = toks.next(tok)) {
            if (/**/!(tok.flag & (flag.SYMBOL_FLAG | flag.CASTING_FLAG)) || !op_ord[i].includes(tok.str)) continue;
            if (char.is_one_of(tok.op, `<>`) && vec_gen_literal(tok)) continue;

            const op = new llop(tok);

            switch (tok.str) {
                case `(float)`: case `(key)`: case `(integer)`: case `(list)`:
                case `(rotation)`: case `(quaternion)`: case `(vector)`: case `(string)`: {
                    if (op.next_type === string.clip(tok.str))
                        tok = delete_tokens(toks, tok, tok);
                    else if (tok.next.str.startsWith(`llList2`) && tok.next.str !== `llList2ListSlice`) {
                        if (tok.str === `(string)` && tok.next.str !== `llList2String`) {
                            tok = replace_tokens(toks, tok, tok.next, ftsf([`llList2String`]));
                        }
                        else if (tok.str === `(integer)` && tok.next.str !== `llList2Integer`) {
                            tok = replace_tokens(toks, tok, tok.next, ftsf([`llList2Integer`]));
                        }
                        else if (tok.str === `(float)` && tok.next.str !== `llList2Float`) {
                            tok = replace_tokens(toks, tok, tok.next, ftsf([`llList2Float`]));
                        }
                        else if (tok.str === `(key)` && tok.next.str !== `llList2Key`) {
                            tok = replace_tokens(toks, tok, tok.next, ftsf([`llList2Key`]));
                        }
                    }
                    /*
                    else if (tok.next.flag & flag.DEF_FUNC_FLAG) {
                        let data = spec.functions[tok.next.str];
                        if (!data) break;
                        if (data.type !== `list`) break;

                        const call = new func(tok.next);
                        if (call.name === `llGetObjectDetails`) {
                            const plist = lllist.collect(call.arg_at(1).front);
                            if (plist.length > 1) break;
                            let rep, rtype = string.clip(tok.str);
                            if (rtype === `string`) rep = `llList2String`;
                            else if (rtype === `integer`) rep = `llList2Integer`;
                            else if (rtype === `float`) rep = `llList2Float`;
                            else if (rtype === `key`) rep = `llList2Key`;
                            else if (rtype === `vector`) rep = `llList2Vector`;
                            else if (rtype === `quaternion`) rep = `llList2Rot`;

                            const rtoks = ftsf([rep, `(`]).copy(op.next_exp).copy(ftsf([`,`, `0`, `)`]));
                            tok = replace_tokens(toks, tok, op.next_exp, rtoks);
                        }

                    }
                    */
                } break;

                case `||`: tok.str = `|`; break;

                case `!=`: {
                    //console.log(tok, tok.next, tok.next.flag & flag.NUMBER_FLAG, numb.parse(tok.next.str));
                    if (!tok.prev || !tok.next) break;
                    if (op.prev_type === `integer` && numb.parse(tok.next.str) === -1) {
                        const rep = ftsf([`~`]);
                        tok = replace_tokens(toks, op.prev_exp.front, tok.next, rep.copy(op.prev_exp));
                    }
                    else if (op.prev_type === `integer` && numb.parse(tok.next.str) === 0) {
                        tok = delete_tokens(toks, tok, tok.next);
                    }
                    else if (op.next_type === `integer` && numb.parse(tok.prev.str) === -1) {
                        const rep = ftsf([`~`]);
                        tok = replace_tokens(toks, tok.prev, op.next_exp.back, rep.copy(op.next_exp));
                    }
                    else if (op.next_type === `integer` && numb.parse(tok.next.str) === 0) {
                        tok = delete_tokens(toks, tok, tok.next);
                    }
                    else if (op.prev_type === `integer` && op.next_type === `integer`) {
                        tok.str = `^`;
                    }
                } break;

                case `==`: {
                    if (!tok.prev || !tok.next) break;
                    if (op.prev_type === `integer` && numb.parse(tok.next.str) === -1) {
                        const rep = ftsf([`!`, `~`]);
                        tok = replace_tokens(toks, op.prev_exp.front, tok.next, rep.copy(op.prev_exp));
                    }
                    else if (op.prev_type === `integer` && tok.next === `0`) {

                        const rep = ftsf([`!`]);
                        tok = replace_tokens(toks, op.expr, rep.copy(op.prev_exp));
                    }
                    else if (op.next_type === `integer` && numb.parse(tok.prev.str) === -1) {
                        const rep = ftsf([`!`, `~`]);
                        tok = replace_tokens(toks, tok.prev, op.next_exp.back, rep.copy(op.next_exp));
                    }
                    else if (op.next_type === `integer` && numb.parse(tok.prev.str) === 0) {
                        const rep = ftsf([`!`]);
                        tok = replace_tokens(toks, op.expr, rep.copy(op.prev_exp));
                    }
                    else if (op.prev_type === `integer` && op.next_type === `integer`) {
                        const rep = ftsf([`!`, `(`]).copy(op.prev_exp).copy(ftsf(`^`)).copy(op.next_exp).copy(ftsf([`)`]));
                        tok = replace_tokens(toks, op.expr, rep);
                    }

                } break;

                case `<`: {
                    if (tok.next.flag & flag.NUMBER_FLAG && op.prev_type === `integer` && numb.parse(tok.next.str) === 0) {
                        tok = replace_tokens(toks, tok, tok.next, ftsf([`&`, `0x80000000`]));
                    }
                } break;

                case `/`: {
                    if (tok.next.flag & flag.NUMBER_FLAG && !(op.prev_type === `integer` && op.next_type === `integer`)) {
                        const rep = ftsf([`*`, `${1.0 / numb.parse(tok.next.str)}`]);
                        tok = replace_tokens(toks, tok, tok.next, rep);
                    }
                } break;

                case `+`: case `-`: {
                    if (op.is_neg_op()) break;
                    if (tok.next.flag & flag.NUMBER_FLAG && op.prev_type === `integer` && !(tok.next.next.flag & flag.OPERATOR_FLAG)) {
                        let v = numb.parse(tok.next.str), s = tok.op;
                        if (v === 0) { tok = delete_tokens(toks, tok, tok.next); break; }
                        if (v < 0) { s = (s === `-` ? `+` : `-`); v = Math.abs(v); }
                        if (!numb.between(v, 1, 3)) break;
                        const rep = new tokens(`${(s === `+` ? `-~` : `~-`).repeat(v)}`);
                        tok = replace_tokens(toks, op.expr, rep.copy(op.prev_exp));
                    }
                    else if (tok.prev && tok.prev.flag & flag.NUMBER_FLAG && op.next_type === `integer` && !(tok.next.next.flag & flag.OPERATOR_FLAG)) {
                        if (tok.prev.prev && tok.prev.prev.flag & flag.OPERATOR_FLAG) break;
                        let v = numb.parse(tok.prev.str), s = tok.op;
                        if (v === 0) { tok = delete_tokens(toks, tok.prev, tok); break; }
                        if (v < 0 || !numb.between(v, 1, 3)) break;
                        const rep = new tokens(`${(s === `+` ? `-~` : `~-`).repeat(v)}`);
                        tok = replace_tokens(toks, op.expr, rep.copy(op.next_exp));
                    }
                } break;

                case `%`: {
                    if (tok.next.flag & flag.NUMBER_FLAG) {
                        const val = numb.parse(tok.next.str);
                        if ((Math.log(val) / Math.log(2)) % 1 !== 0) break;
                        tok = replace_tokens(toks, tok, tok.next, ftsf([`&`, `${val - 1}`]));
                    }
                } break;
            }


            //console.log(string.simplify(toks.str));
        }
        if (!bDone) src.parse_src(toks);
    }

};

/**
 * @param {tokens} source 
 * @param {expr|tokens} exp 
 * @param {boolean} par 
 */
const opt_const = async (ref, par = false) => {
    if (!ref || ref.empty()) throw new error(`function call on empty tokens.`);
    //console.log(`-> opt_const`, ref.str);

    const toks = new tokens().copy(ref);
    for (let tok = toks.front; toks.end(tok); tok = toks.next(tok)) {
        // if (tok.flag & 6294128) continue;
        // if (tok.flag & (flag.STRING_FLAG | flag.OPERATOR_FLAG | flag.EVENT_FLAG | flag.STATE_NAME_FLAG | flag.CASTING_FLAG | flag.TYPE_FLAG | flag.VARIABLE_FLAG )) continue;
        if (tok.flag & (flag.DEF_FUNC_FLAG | flag.USER_FUNC_FLAG)) {
            const repl = await opt_func(new func(tok).expr_copy());
            if (repl && repl.front) {
                //console.log(toks.str, repl.expr.str);
                const call = new func(replace_tokens(toks, new func(tok).expr, repl.expr));
                tok = call.last_tok;
            }
            //console.log(toks.str);
        }
        else if (tok.flag & flag.LIST_OP_FLAG) {
            const ref = expr.match(tok);
            const repl = await opt_list(ref, par || tok.scope === SCOPE_GLOBAL, (tok.prev && tok.prev.str === `+=`));
            if (repl && repl.front) {
                //console.log(ref.str, repl.str);
                tok = expr.match(replace_tokens(toks, ref, repl)).back;
            }
            //console.log(tok);
        }
        else if (tok.flag & (flag.VECTOR_OP_FLAG | flag.QUAT_OP_FLAG)) {
            const ref = expr.match(tok);
            const repl = await opt_vec(ref, par || tok.scope !== SCOPE_GLOBAL);
            if (repl && repl.front) {
                //console.log(`ref: `, ref.str, `repl: `, repl);
                tok = expr.match(replace_tokens(toks, ref, repl)).back;
            }
            //console.log(tok);
        }
        else if (tok.flag & flag.NUMBER_FLAG) {
            if (string.is_float(tok.str)) {
                if (tok.prev && tok.prev.op === `/`) continue;
                const repl = await opt_float(tok, par || tok.scope === SCOPE_GLOBAL);
                if (repl && repl.front) tok = replace_tokens(toks, tok, tok, repl);
            }
            else {
                const repl = await opt_dec(tok);
                if (repl && repl.front) tok = replace_tokens(toks, tok, tok, repl);
            }
            //console.log(tok);
        }
        if (!toks.contains(tok)) throw new error(`toks do not contain tok`);
        //console.log(toks.str);
    }

    //replace_tokens(ref, ref, toks);
    //console.log(`<- opt_const`);
    ref.front = toks.front;
    ref.back = toks.back;
    return ref;
};

/**
 * @param {tokens} source 
 * @param {token} tok 
 * @returns {Promise<token|undefined>}
 */
const opt_func = async exp => {
    if (!exp || exp.empty()) throw new error(`function call on empty token.`);
    //console.log(`-> opt_func ${exp.str}()`);

    const toks = new tokens().copy(exp);
    const call = new func(toks.front);

    const args = [];
    for (let i = 0; i < call.args_length; ++i) {
        args.push(await opt_const(call._args[i], true));
    }
    call._args = args;

    //console.log(`<- opt_func ${call.expr.str}`);
    return call;
};

/**
 * @param {tokens} source 
 * @param {token} tok 
 * @returns {Promise<token|undefined>}
 */
const opt_list = async (exp, par, add) => {
    if (!exp || exp.empty()) throw new error(`function call on empty tokens.`);
    //console.log(`-> opt_list ${exp.str}`);

    if (exp.front.next && exp.front.next.op === `]`) return false;

    const toks = new tokens().copy(exp);
    const list = new lllist(toks.front);

    const args = [];
    for (let i = 0; i < list.length; ++i) {
        args.push(await opt_const(list.at(i), true));
    }
    list._entries = args;

    if (list.length === 1) {
        if (add) return list.at(0);
        else if (!par) return list.opt_mem();
    }

    //console.log(`<- opt_list ${list.expr.str}`);
    return list.expr;
};

/**
 * @param {tokens} source 
 * @param {token} tok 
 * @returns {Promise<token|undefined>}
 */
const opt_vec = async (exp, par) => {
    if (!exp || exp.empty()) throw new error(`function call on empty tokens.`);
    //console.log(`-> opt_vec ${exp.str}`);

    const toks = new tokens().copy(exp);
    const obj = (toks.front.flag & flag.VECTOR_OP_FLAG) ? new llvec(toks.front) : new llquat(toks.front);
    if (obj.is_def()) return obj.opt_mem();

    const args = [];
    for (let i = 0; i < obj.entries.length; ++i) {
        args.push(await opt_const(obj.entries[i], true));
        //obj._entries[i] = await opt_const(new tokens().copy(obj.entries[i]), true);
    }
    obj._entries = args;

    //console.log(`<- opt_vec `, obj.expr.str);
    return obj.expr;
};

/**
 * @param {tokens} source 
 * @param {token} tok 
 * @param {boolean} par 
 * @returns {Promise<token|undefined>}
 */
const opt_float = (tok, par = false) => {
    if (!tok) throw new error(`function call on empty tokens.`);
    //console.log(`-> opt_float ${tok.str}`);

    const num = new llfloat(tok.str);
    if (num.value % 1 === 0) {
        if (par || (tok.prev && tok.prev.op !== `/`)) return opt_dec(tok);
        return ftsf([`(`, `(float)`, `${num.value}`, `)`]);
    }

    //console.log(`<- opt_float ${tok.str}`);
    let str = llfloat.format(tok.str);
    str = str.replace(/^0./,`.`);
    str = str.replace(/^-0./,`-.`);

    return ftsf([str]);
};

/**
 * @param {token} tok 
 * @returns {Promise<token|undefined>}
 */
const opt_dec = tok => {
    //console.log(`-> opt_dec ${tok.str}`);

    const num = new llint(tok);
    let str = `${num.i32}`;
    if (num.value < 0) str = `${num.ui32}`;

    //console.log(`<- opt_dec ${str}`);
    return ftsf([str]);
};

const clean_source = async toks => {
    if (!toks || toks.empty()) throw new error(`function call on empty tokens.`);

    //console.log(`clean_source: `, toks.str);
    const code_entry = src.code_entry;
    if (!code_entry) throw new error(`No code entry point.`);

    const STATE_TOKS = 0;
    const FUNC_TOKS = 1;
    const VARS_TOKS = 2;

    const names = [[code_entry.str], [], []];
    const out = [new tokens(), new tokens(), new tokens()];

    const main = expr.match(code_entry.next);
    out[STATE_TOKS].take(toks, code_entry, main.back);

    for (let index = 0; index < 2; ++index) {
        if (out[index].empty()) continue;

        for (let tok = out[index].front; out[index].end(tok); tok = out[index].next(tok)) {
            if (!(tok.flag & flag.NAME_FLAG)) continue;

            if (tok.flag & flag.STATE_NAME_FLAG) {
                const inst = src.get_state(tok);
                if (inst && !names[STATE_TOKS].includes(inst.tok.str)) {
                    names[STATE_TOKS].push(inst.tok.str);
                    const state_toks = expr.match(inst.tok.next);
                    out[STATE_TOKS].take(toks, state_toks.front.prev.prev, state_toks.back);
                }
            }
            else if (tok.flag & flag.USER_FUNC_FLAG) {
                const inst = src.get_func(tok);
                if (inst && !names[FUNC_TOKS].includes(inst.tok.str)) {
                    names[FUNC_TOKS].push(inst.tok.str);
                    const func_toks = new func(inst.tok).definition;
                    out[FUNC_TOKS].take(toks, func_toks.front, func_toks.back);
                }
            }
            else if (tok.flag & flag.VARIABLE_FLAG) {
                const inst = src.get_var(tok);
                if (inst && inst.tok.scope === SCOPE_GLOBAL && !names[VARS_TOKS].includes(inst.tok.str)) {
                    names[VARS_TOKS].push(inst.tok.str);
                    const line = script.line_of_code(inst.tok);
                    out[VARS_TOKS].take(toks, line.front, line.back);
                }
            }
        }
    }

    toks.clear();
    for (let i = out.length; i--;) {
        if (out[i].front) toks.take(out[i], out[i].front, out[i].back);
        names[i].length = 0;
    }
    out.length = 0;
    //src.parse_src(toks);

    for (let tok = toks.front; toks.end(tok); tok = toks.next(tok)) {
        //console.log(tok.str);
        if (tok.prev && tok.next && tok.flag & flag.VARIABLE_FLAG) {
            if (Object.is(src.get_var(tok).tok, tok)) {

                //console.log(tok.str);
                if (!(tok.flag & (flag.USED_FLAG | flag.PARAM_FLAG | flag.ASSIGNED_FLAG)) && tok.scope !== SCOPE_GLOBAL) {
                    const line = script.line_of_code(tok);
                    tok = line.front.prev;
                    toks.delete_tokens(line.front, line.back);
                }
                else if (tok.next && tok.next.op === `=`) {
                    if (llliteral.is_default_for(tok.prev.str, tok.next.next)) {
                        while (tok.next && tok.next.op !== `;`)
                            toks.delete_token(tok.next);
                    }
                }
            }
        }
        else if (tok.flag & flag.EVENT_FLAG) {
            if ([`state_entry`, `control`].includes(tok.str)) continue;
            const ev = new func(tok);
            if (ev && ev.last_tok.next.next.op === `}`) {
                tok = tok.prev;
                toks.delete_tokens(tok.next, ev.last_tok.next.next);
            }
        }
    }

};

var usable_name = [];
const opt_name = async toks => {
    reset_index();
    usable_name = ['IsRestoring', 'IsSaveDue', 'Library', 'LslLibrary', 'LslUserScript', 'Pop', 'ResumeVoid', 'System', 'UThread', 'UThreadStackFrame'];
    const ev_map = { 'on_rez': 'rez', 'listen': 'chat', 'run_time_permissions': 'run_time_perms', 'remote_data': 'remote_event' };

    const new_name = arr => {
        let name;
        do {
            if (arr.length) name = arr.pop();
            else name = string.uid();
        } while (src.know_name(name));
        return name;
    };

    src.stas.map(s => {
        s.altn = s.name === CODE_ENTRY ? CODE_ENTRY : string.uid();
        s.events.map(e => usable_name.push(`e${s.altn}${ev_map[e] ? ev_map[e] : e}`));
    });

    src.funcs.map(f => {
        f.altn = string.uid();
        usable_name.push(`g${f.altn}`);
    });

    let tmp_names = usable_name.sort((a, b) => b.length - a.length);
    const func_names = new Set();

    for (let tok = toks.front; toks.end(tok); tok = toks.next(tok)) {
        if (tok.flag & flag.STATE_NAME_FLAG) {
            const inst = src.get_state(tok);
            if (inst && !tok.is(inst.tok) && !string.empty(inst.altn)) {
                tok.swap_name(inst.altn);
            }
        }
        else if (tok.flag & flag.USER_FUNC_FLAG) {
            const inst = src.get_func(tok);
            if (inst && !tok.is(inst.tok) && !string.empty(inst.altn)) {
                tok.swap_name(inst.altn);
            }
        }
        else if (tok.flag & flag.VARIABLE_FLAG) {
            const inst = src.get_var(tok);
            if (inst && !tok.is(inst.tok) && inst.tok.scope === SCOPE_GLOBAL) {
                if (string.empty(inst.altn))
                    inst.altn = new_name(tmp_names);
                tok.swap_name(inst.altn);
            }
        }
        else if (tok.flag & flag.DEF_FUNC_FLAG) {
            func_names.add(tok.str);
        }
    }

    for (let tok = toks.front; toks.end(tok); tok = toks.next(tok)) {
        if (tok.flag & flag.EVENT_FLAG || (tok.flag & flag.USER_FUNC_FLAG && tok.scope === SCOPE_GLOBAL)) {

            const block = new func(tok).definition;

            tmp_names = [...new Set([...usable_name, ...func_names])].sort((a, b) => b.length - a.length);
            for (let tok = block.front; block.end(tok); tok = block.next(tok)) {
                if (!(tok.flag & flag.VARIABLE_FLAG)) continue;

                const inst = src.get_var(tok);
                if (!inst || !(inst.tok.flag & flag.PARAM_FLAG)) continue;

                if (string.empty(inst.altn))
                    inst.altn = new_name(tmp_names);

                if (!tok.is(inst.tok))
                    tok.swap_name(inst.altn);
            }
        }
    }

    src.stas.map(s => s.tok.swap_name(s.altn));
    src.funcs.map(f => f.tok.swap_name(f.altn));
    src.vars.map(v => { if (!string.empty(v.altn)) v.tok.swap_name(v.altn) });
};


