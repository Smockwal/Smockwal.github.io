import { error } from "../../../error.js";
import { flag } from "../../../global.js";
import { char } from "../../../text/char.js";
import { delimiter_char, regex } from "../../../text/regex.js";
import { string } from "../../../text/string.js";
import { expr } from "../../expressions.js";
import { func } from "../../function.js";
import { message } from "../../message.js";
import { operator } from "../../operator.js";
import { options, opts } from "../../options.js";
import { SCOPE_FUNC, SCOPE_GLOBAL, src } from "../../source.js";
import { fast_tokens_fact, tokens } from "../../tokens.js";
import { llliteral } from "./lliteral.js";
import { llspec, load_spec } from "./llspec.js";
import { next_exp, prev_exp } from "./script.js";


export const op_ord = [
    [`(`, `)`],
    [`[`, `]`],
    [`(float)`, `(key)`, `(integer)`, `(list)`, `(rotation)`, `(quaternion)`, `(vector)`, `(string)`],
    [`!`, `~`, `++`, `--`],
    [`*`, `/`, `%`],
    [`-`],
    [`+`],
    [`<<`, `>>`],
    [`<`, `<=`, `>`, `>=`],
    [`==`, `!=`],
    [`&`],
    [`^`],
    [`|`],
    [`||`],
    [`&&`],
    [`=`, `+=`, `-=`, `*=`, `/=`, `%=`]
];

const CODE_ENTRY = `default`;

export const parsing = async toks => {
    //console.trace(`parsing =>`, toks.str);

    if (toks.empty()) return console.trace(toks);

    await load_spec();

    validate_scope(toks);
    if (message.has_error()) return console.trace(toks);

    src.parse_src(toks);
    if (message.has_error()) return console.trace(toks);

    if (options.get(opts.PARSER, `finddefault`) && src.code_entry === undefined) {
        message.add(new message(message.SYNTAX_ERROR, `Code entry not find.`, toks.front.loc));
        return console.trace(toks);
    }

    validate_name(toks);
    if (message.has_error()) return console.trace(toks);

    validate_op(toks);
    if (message.has_error()) return console.trace(toks);

    validate_list_params(toks);
    if (message.has_error()) return console.trace(toks);
};

export const validate_scope = toks => {
    //console.trace(`validate_scope =>`, toks.str);

    let op = ``,
        tok = toks.front,
        mismatch = false,
        trailling = false;

    for (; toks.end(tok); tok = toks.next(tok)) {
        if (!(tok.flag & flag.SYMBOL_FLAG) || !delimiter_char.test(tok.op)) continue;

        if (char.is_one_of(tok.op, `({`)) op += tok.op;
        else if (char.is_one_of(tok.op, `})`)) {
            if (op.length === 0) {
                trailling = true;
                break;
            }
            else if (tok.op !== char.closing_char(string.last_char(op))) {
                mismatch = true;
                break;
            }
            op = op.slice(0, -1);
        }
        else if (char.is_one_of(tok.op, `[]`)) {
            if (tok.op === `[`) op += tok.op;
            else if (tok.op === `]`) {
                if (op.length === 0) {
                    trailling = true;
                    break;
                }
                else if (tok.op !== char.closing_char(string.last_char(op))) {
                    mismatch = true;
                    break;
                }
                op = op.slice(0, -1);
            }
        }
        tok.scope = ``;
    }

    if (mismatch) {
        const expected = char.closing_char(string.last_char(op));
        const loc = tok ? tok.loc : toks.back.loc;
        message.add(new message(message.SYNTAX_ERROR, `Mismatched delimiters, missing  ${expected}`, loc));
        console.trace(toks);
        return false;
    }
    else if (trailling) {
        const tail = tok.op;
        const loc = tok ? tok.loc : toks.back.loc;
        message.add(new message(message.SYNTAX_ERROR, `Mismatched delimiters, trailling  ${tail}`, loc));
        console.trace(toks);
        return false;
    }
    else if (!string.empty(op)) {
        const loc = tok ? tok.loc : toks.back.loc;
        message.add(new message(message.SYNTAX_ERROR, `Unexpected EOF.`, loc));
        console.trace(toks);
        return false;
    }

    return true;
};

const validate_name = source => {
    //console.trace(`validate_name =>`, source.str);

    for (let tok = source.front; source.end(tok); tok = source.next(tok)) {
        //console.log(tok.str);
        if (!(tok.flag & flag.NAME_FLAG)) continue;

        if (tok.flag & flag.TYPE_FLAG) {
            if (!tok.next) {
                message.add(new message(message.SYNTAX_ERROR, `Missing name.`, tok.loc));
                return console.trace(source);
            }

            if (!(tok.next.flag & flag.NAME_FLAG)) {
                message.add(new message(message.SYNTAX_ERROR, `Invalide name: "${tok.next.str}".`, tok.loc));
                return console.trace(source);
            }

            if (!(tok.flag & flag.CASTING_FLAG) && tok.prev && !char.is_one_of(tok.prev.op, `({;},`)) {
                message.add(new message(message.SYNTAX_ERROR, `Missing EOL(;).`, tok.loc));
                return console.trace(source);
            }
        }
        else if (tok.flag & flag.VARIABLE_FLAG) {
            const var_inst = src.get_var(tok);

            if (tok.prev && !var_inst && tok.prev.str !== `jump` && tok.prev.str !== `@` && tok.prev.str !== `.` &&
                !(tok.flag & (flag.CONTROL_FLAG | flag.EVENT_FLAG | flag.DEF_FUNC_FLAG | flag.USER_FUNC_FLAG | flag.STATE_NAME_FLAG | flag.TYPE_FLAG))) {
                message.add(new message(message.SYNTAX_ERROR, `Variable name "${tok.str}" not defined within scope.`, tok.loc));
                return console.trace(source);
            }

            if (var_inst) {
                if (tok.next && tok.next.flag & flag.NUMBER_FLAG) {
                    // Missing operator?
                    message.add(new message(message.SYNTAX_ERROR, `Missing operator.`, tok.loc));
                    return console.trace(source);
                }

                if (var_inst.type === `vector` && tok.next && tok.next.str === `.` && tok.next.next && tok.next.next.str === `s`) {
                    message.add(new message(message.SYNTAX_ERROR, `Use of vector or quaternion method on incorrect type.`, tok.next.next.loc));
                    return console.trace(source);
                }
            }
        }
        else if (tok.flag & flag.USER_FUNC_FLAG) {
            let func_inst = src.get_func(tok);
            //console.log(`str: ${tok.str}, scp: ${tok.scope}`);
            if (tok.scope === SCOPE_GLOBAL) {

                let func_def = new func(tok);
                //console.log(func_def);

                if (func_def.last_tok.next && func_def.last_tok.next.str !== `{`) {
                    message.add(new message(message.SYNTAX_ERROR, `Use of local function in gloabal scope.`, tok.loc));
                    return console.trace(source);
                }

                //console.log(tok.str);
                if (tok.prev && !(tok.prev.flag & flag.TYPE_FLAG) && !char.is_one_of(tok.prev.op, `({;},`)) {

                    message.add(new message(message.SYNTAX_ERROR, `Missing EOL(;).`, tok.loc));
                    return console.trace(source);
                }

                if (func_inst.type !== `void`) {
                    let ref = expr.match(func_def.last_tok.next),
                        find = false,
                        scope = `${SCOPE_GLOBAL}/${SCOPE_FUNC}.${tok.str}`;

                    const re = RegExp(`^${regex.escape(scope)}/\\d+\\.else$`);
                    for (let it = ref.front; it && it !== ref.back.next; it = it.next) {
                        if (tok.flag & flag.NAME_FLAG && it.str === `return` && (it.scope === scope || re.test(it.scope))) find = true;

                        // TODO: test for always true if state
                    }

                    if (!find) {
                        message.add(new message(message.WARNING, `Not all code paths return a value.`, tok.loc));
                        //return console.trace(source);
                    }
                }
            }
            else {
                if (!func_inst) {
                    message.add(new message(message.SYNTAX_ERROR, `Function name "${tok.str}" not defined within scope.`, tok.loc));
                    return console.trace(source);
                }

                //console.log(func_inst);
                let func_decl = new func(func_inst.tok),
                    func_call = new func(tok);

                //console.log(func_decl, func_call);

                if (func_call.args_length !== func_decl.args_length) {
                    message.add(new message(message.SYNTAX_ERROR, `Function call mismatches number of arguments.`, tok.loc));
                    return console.trace(source);
                }

                for (let it = 0; it < func_call.args_length; ++it) {
                    let call_arg = func_call.arg_at(it);
                    let type = eval_exp_type(call_arg);
                    if (message.has_error()) return console.trace(call_arg);

                    let proto_arg = func_decl.arg_at(it);
                    if (!llliteral.can_be_use_as(type, proto_arg.front.str)) {
                        message.add(new message(message.SYNTAX_ERROR, `Function call mismatches type of arguments.`, tok.loc));
                        return console.trace(source);
                    }
                }
            }
        }
        else if (tok.flag & flag.DEF_FUNC_FLAG || llspec.functions[tok.str]) {
            let func_decl = llspec.functions[tok.str],
                func_call = new func(tok);

            if (func_call.args_length !== func_decl.arg_numb) {
                //console.log(func_call.expr.str);
                message.add(new message(message.SYNTAX_ERROR, `Function call mismatches number of arguments.`, tok.loc));
                return console.trace(source);
            }


            for (let it = 0; it < func_call.args_length; ++it) {

                let type = eval_exp_type(func_call.arg_at(it));
                if (message.has_error()) return console.trace(source);

                //console.log(type, func_decl[`arg_${it}`].type);
                //console.log(tok.scope);
                if (!llliteral.can_be_use_as(type, func_decl[`arg_${it}`].type)) {
                    message.add(new message(message.SYNTAX_ERROR, `Function call mismatches type of arguments.`, tok.loc));
                    return console.trace(source);
                }
            }
        }
        else if (tok.flag & flag.EVENT_FLAG) {
            let event_decl = llspec.events[tok.str],
                event_call = new func(tok);

            if (event_call.args_length !== event_decl.arg_numb) {
                message.add(new message(message.SYNTAX_ERROR, `Event call mismatches number of arguments.`, tok.loc));
                return console.trace(source);
            }

            for (let it = 0; it < event_call.args_length; ++it) {
                let type = event_call.arg_at(it).front.str;
                if (!llliteral.can_be_use_as(type, event_decl[`arg_${it}`].type)) {
                    message.add(new message(message.SYNTAX_ERROR, `Function call mismatches type of arguments.`, tok.loc));
                    return console.trace(source);
                }
            }
        }
        else if (tok.flag & flag.CONTROL_FLAG) {
            //console.log(tok.str);

            if (tok.scope !== SCOPE_GLOBAL && tok.str === `state`) {
                if (tok.next && tok.next.str === `state`) {
                    message.add(new message(message.SYNTAX_ERROR, `Use of illegal keyword: "${tok.str}".`, tok.loc));
                    return console.trace(source);
                }
                else if (!tok.next || (!(tok.next.flag & flag.STATE_NAME_FLAG) && tok.next.str !== CODE_ENTRY)) {
                    message.add(new message(message.SYNTAX_ERROR, `Missing state name.`, tok.loc));
                    return console.trace(source);
                }
                else if (!src.has_state(tok.next) && tok.next.str !== CODE_ENTRY) {
                    message.add(new message(message.SYNTAX_ERROR, `Unknow state name: "${tok.next.str}".`, tok.loc));
                    return console.trace(source);
                }
                else if (tok.scope.startsWith(`${SCOPE_GLOBAL}/${SCOPE_FUNC}.`)) {
                    message.add(new message(message.SYNTAX_ERROR, `Global functions can't change state.`, tok.next.loc));
                    return console.trace(source);
                }
                tok.next.flag |= flag.STATE_NAME_FLAG;
            }

            if (tok.prev && !char.is_one_of(tok.prev.op, `({;},`)) {

                let pass = false;
                if (tok.prev.op === `)`) {
                    let left = expr.match(tok.prev);
                    if (left.front.prev && /^(if|while|for)$/.test(left.front.prev.str)) pass = true;
                }
                else if (tok.prev.str === `else` && /^(if|return|state|jump)$/.test(tok.str)) pass = true;
                else if (tok.str === `default`) pass = true;

                if (!pass) {
                    message.add(new message(message.SYNTAX_ERROR, `Missing EOL(;).`, tok.loc));
                    return console.trace(source);
                }
            }

            if (tok.str === `jump`) {
                if (!tok.next) {
                    message.add(new message(message.SYNTAX_ERROR, `Jump without label.`, tok.loc));
                    return console.trace(source);
                }

                if (!src.has_label(tok.next)) {
                    message.add(new message(message.SYNTAX_ERROR, `Label name "${tok.next.str}" not defined within scope.`, tok.loc));
                    return console.trace(source);
                }
            }
        }
        else if (!tok.same_line(tok.prev) && tok.next && tok.next.flag & flag.NAME_FLAG) {
            message.add(new message(message.SYNTAX_ERROR, `Unknow type.`, tok.next.next.loc));
            return console.trace(source);
        }
    }

    for (let tok = source.front; source.end(tok); tok = source.next(tok)) {
        if (!(tok.flag & flag.NAME_FLAG)) continue;


        if (tok.scope.startsWith(`${SCOPE_GLOBAL}/${SCOPE_FUNC}.`)) {
            if (tok.str === `return`) {

                let it = tok;
                while (it && it.scope !== SCOPE_GLOBAL) it = it.prev;

                let res = src.get_func(it);
                if (!res)
                    throw new error(`Could not find function ${cut}.`);

                if (res.type !== `void` && tok.next.str === `;`) {
                    message.add(new message(message.SYNTAX_ERROR, `Function returns a value but return statement doesn't.`, tok.next.loc));
                    return console.trace(source);
                }


                let etype = `void`;
                let exp = expr.rest_of_line(tok.next);
                if (!exp.empty()) etype = eval_exp_type(exp);
                if (message.has_error()) return console.trace(source);

                //console.log(etype, res.type);
                if (!llliteral.can_be_use_as(etype, res.type)) {
                    message.add(new message(message.SYNTAX_ERROR, `Return statement type doesn't match function return type.`, tok.next.loc));
                    return console.trace(source);
                }
            }
        }

    }

    return source;
};

const sanitize_type_name = str => string.simplify(str).toLowerCase();

const validate_op = toks => {
    //console.trace(`validate_op =>`, toks.str);

    const toks0 = new tokens().copy(toks);

    for (let tok = toks0.front; toks0.end(tok); tok = toks0.next(tok)) {
        if (tok.flag & flag.CONTROL_FLAG) {
            if (tok.next && tok.str === `for` && tok.next.op === `(`) {
                tok = expr.match(tok.next).back;
            }
        }
        else if (tok.flag & flag.DEL_FLAG) {
            if (tok.op === `(`) {
                let good = false;

                if (tok.prev && (tok.prev.flag & flag.NAME_FLAG))
                    good = (tok.prev.str === `if` || tok.prev.str === `while`);
                else good = true;

                if (good) {
                    let exp = expr.match(tok);
                    let type = eval_exp_type(exp);
                    if (message.has_error()) return console.trace(toks);
                    tok = toks0.replace(exp, fast_tokens_fact([type]));
                }
            }
            else if (tok.op === `}`) {
                if (tok.prev && !char.is_one_of(tok.prev.op, `;{}`)) {
                    message.add(new message(message.SYNTAX_ERROR, `Missing EOL(;).`, tok.loc));
                    return console.trace(toks);
                }
            }
            else if (tok.flag & flag.EOL_FLAG) {
                if (tok.next && tok.next.op === `;`) {
                    message.add(new message(message.WARNING, `Trailling EOL(;).`, tok.next.loc));
                    //return console.trace(toks);
                }
            }
        }
    }

    for (let tok = toks0.front; toks0.end(tok); tok = toks0.next(tok)) {
        if (!(tok.flag & flag.CASTING_FLAG)) continue;

        if (tok.next && tok.str === `(list)`) {
            let next = next_exp(tok);
            if (next && !next.empty() && next.back.next) {
                while (next.back.next && next.back.next.op === `+`)
                    next = next_exp(next.back.next);
            }
            
            tok = toks0.replace(tok, next.back, fast_tokens_fact([`list`]));
            continue;
        }

        if (tok.next && tok.next.flag & flag.OPERATOR_FLAG && tok.next.next && tok.next.next.flag & flag.OPERATOR_FLAG) {
            message.add(new message(message.SYNTAX_ERROR, `Complex expression must be wrap in parentheses.`, tok.loc));
            return console.trace(toks);
        }
        
        let exp = new expr(tok, next_exp(tok).back);
        let type = eval_exp_type(exp);
        if (message.has_error()) return console.trace(toks);
        tok = toks0.replace(exp, fast_tokens_fact([type]));
    }
    
    for (let tok = toks0.front; toks0.end(tok); tok = toks0.next(tok)) {
        if (!(tok.flag & flag.OPERATOR_FLAG)) continue;

        if ([`++`, `--`].includes(tok.str)) {
            let exp = new expr(tok, tok);

            if (tok.next && tok.next.flag & flag.NAME_FLAG)
                exp.back = tok.next;
            else if (tok.prev && tok.prev.flag & flag.NAME_FLAG)
                exp.front = tok.prev;

            let type = eval_exp_type(exp);



            if (message.has_error()) return console.trace(toks);
            tok = toks0.replace(exp, fast_tokens_fact([type]));
        }
        else if (operator.is_unary_op(tok)) {
            let next = next_exp(tok);
            //console.log(`next`, next);
            let exp = new expr(operator.skip_unary_op(tok, `bwd`), next.back);
            let type = eval_exp_type(exp);
            if (message.has_error()) return console.trace(toks);
            tok = toks0.replace(exp, fast_tokens_fact([type]));
        }
    }

    for (let it = 4; it < op_ord.length; ++it) {

        
        for (let tok = toks0.front; toks0.end(tok); tok = toks0.next(tok)) {
            if (!(tok.flag & flag.OPERATOR_FLAG) || !op_ord[it].includes(tok.str)) continue;

            let left;
            if (operator.is_unary_op(tok)) {
                left = new expr(tok, tok);
            }
            else {
                left = prev_exp(tok);
            }

            if (!left) {
                message.add(new message(message.SYNTAX_ERROR, `Missing left exp for operator: "${tok.str}".`, tok.loc));
                return console.trace(toks);
            }

            if (left.front.flag & flag.CONTROL_FLAG)
                continue;

            let right = next_exp(tok);
            if (!right) {
                message.add(new message(message.SYNTAX_ERROR, `Missing right exp for operator: "${tok.str}".`, tok.loc));
                return console.trace(toks);
            }

            //console.trace(`left: "${left.str}", right: "${right.str}"`);
            let exp = new expr(left.front, right.back);

            //console.log(exp.stringify());
            let type = eval_exp_type(exp);
            if (message.has_error()) return console.trace(toks);
            tok = toks0.replace(exp, fast_tokens_fact([type]));
        }
    }

};

const validate_vec = (tok, numb) => {
    //console.trace(`validate_vec =>`, tok.str);

    let first = tok.next,
        op = "<",
        par_numb = 0;

    for (let it = tok.next; it; it = it.next) {
        if (!(it.flag & flag.SYMBOL_FLAG)) continue;

        if (it.next && (it.next.flag & (flag.NAME_FLAG | flag.NUMBER_FLAG)) && char.is_one_of(it.op, `<>`))
            continue;

        if (char.is_one_of(it.op, `([<`)) {
            op += it.op;
        }
        else if (char.is_one_of(it.op, `>])`) && it.op === char.closing_char(string.last_char(op))) {
            op = op.substring(0, op.length - 1);
            if (string.empty(op) && it.op === `>`) {
                return validate_vec_entrie(new expr(first, it.prev)) && (++par_numb === numb);
            }
        }
        else if (it.op === `,` && op === `<`) {
            ++par_numb;
            if (!validate_vec_entrie(new expr(first, it.prev))) {
                return false;
            }
            first = it.next;
        }
    }
    return false;
};

const validate_vec_entrie = ref => {
    //console.trace(`validate_vec_entrie =>`, ref.str);

    let type = eval_exp_type(ref);
    if (message.has_error()) return console.trace(ref);

    if (type !== `integer` && type !== `float`) {
        message.add(new message(message.SYNTAX_ERROR, `Vector can not contain "${type}" element.`, ref.front.loc));
        return false;
    }
    return true;
};

const validate_list = tok => {
    //console.trace(`validate_list =>`, tok.str);

    if (tok.flag & flag.LIST_OP_FLAG && tok.next && tok.next.flag & flag.LIST_CL_FLAG) return true;
    if (tok.flag & flag.LIST_CL_FLAG && tok.prev && tok.prev.flag & flag.LIST_OP_FLAG) return true;
    let first = tok.next, op = "[";

    for (let it = tok.next; it; it = it.next) {
        if (!(it.flag & flag.SYMBOL_FLAG)) continue;

        if (char.is_one_of(it.op, `([<`)) {
            op += it.op;
        }
        else if (char.is_one_of(it.op, `>])`) && it.op === char.closing_char(string.last_char(op))) {
            op = op.substring(0, op.length - 1);
            if (string.empty(op) && it.op === `]`) {
                return validate_list_entrie(new expr(first, it.prev));
            }
        }
        else if (it.op === `,` && op === `[`) {
            if (!validate_list_entrie(new expr(first, it.prev))) {
                return false;
            }
            first = it.next;
        }
    }

    return true;
};

const validate_list_entrie = ref => {
    //console.trace(`validate_list_entrie =>`, ref.str);

    let etype = eval_exp_type(ref);
    if (message.has_error()) return console.trace(ref);

    if (etype === `list` || etype === `void`) {
        message.add(new message(message.SYNTAX_ERROR, `List can not contain "${etype}" element.`, ref.front.loc));
        return false;
    }
    return true;
};

export const eval_exp_type = ref => {
    //console.trace(`eval_exp_type =>`, string.simplify(ref.str));

    if (!ref || ref.empty()) {
        throw new error(`function call on empty ref.`);
        return console.trace(ref);
    }

    if (ref.length === 1 && llspec.type.includes(ref.front.str))
        return sanitize_type_name(ref.str);

    const toks0 = new tokens().copy(ref, ref.front, ref.back);
    if (toks0.empty()) return `void`;

    const line = expr.rest_of_line(toks0.front);
    if (line.empty()) return `void`;

    if (!eval_entities_type(line)) return console.trace(ref);
    if (line.empty()) return `void`;
    //console.log(line.str);

    if (line.length === 1 && llspec.type.includes(ref.front.str))
        return sanitize_type_name(line.str);

    if (!eval_op_type(line)) return console.trace(ref);
    if (line.empty()) return `void`;


    return sanitize_type_name(line.str);
};

const eval_entities_type = ref => {
    //console.log(`eval_entities_type =>`, string.simplify(ref.str), ref.front.loc.str());

    if (!ref || ref.empty()) return console.trace(ref);

    for (let tok = ref.front; ref.end(tok); tok = ref.next(tok)) {
        //console.log(`tok: ${tok.str}`);
        if (tok.flag & flag.DEF_FUNC_FLAG) {
            let type = sanitize_type_name(llspec.functions[tok.str].type);
            tok = ref.replace(new func(tok).expr, fast_tokens_fact([type]));
        }
        else if (tok.flag & flag.USER_FUNC_FLAG) {
            let type = sanitize_type_name(src.get_func(tok).type);
            tok = ref.replace(new func(tok).expr, fast_tokens_fact([type]));
        }
        else if (tok.flag & flag.DEL_FLAG && tok.op === `(`) {
            let scp = expr.match(tok);
            scp = new expr(scp.front.next, scp.back.prev);
            let type = eval_exp_type(scp);
            if (message.has_error()) return console.trace(ref);
            tok = ref.replace(scp.front.prev, scp.back.next, fast_tokens_fact([type]));
        }
        else if (tok.flag & flag.VARIABLE_FLAG || src.has_var(tok)) {
            //console.log(tok.str);
            let var_decl = src.get_var(tok);
            //console.trace(src._vars.length, src._vars);
            let type = sanitize_type_name(var_decl.type);
            let exp = new expr(tok, tok);
            if ((type === `vector` || type === `quaternion`) && tok.next && tok.next.op === `.`) {
                type = `float`;
                exp.back = tok.next.next;
            }
            tok = ref.replace(exp, fast_tokens_fact([type]));
            //console.trace(`exp: "${exp.str}", str: "${tok.str}", type: "${type}", string: "${ref.stringify()}"`);
        }
        else if (tok.flag & flag.STRING_FLAG) {
            tok = ref.replace(tok, tok, fast_tokens_fact([`string`]));
        }
        else if (tok.flag & (flag.QUAT_OP_FLAG | flag.QUAT_CL_FLAG)) {
            const quat = expr.match(tok);
            if (!validate_vec(quat.front, 4)) return console.trace(ref);
            tok = ref.replace(quat, fast_tokens_fact([`quaternion`]));
        }
        else if (tok.flag & (flag.VECTOR_OP_FLAG | flag.VECTOR_CL_FLAG)) {
            const vec = expr.match(tok);
            if (!validate_vec(vec.front, 3)) return console.trace(ref);
            tok = ref.replace(vec, fast_tokens_fact([`vector`]));
        }
        else if (tok.flag & (flag.LIST_OP_FLAG | flag.LIST_CL_FLAG)) {
            if (!validate_list(tok)) return console.trace(ref);
            tok = ref.replace(expr.match(tok), fast_tokens_fact([`list`]));
        }
        else if (tok.flag & flag.NUMBER_FLAG) {
            tok = ref.replace(tok, tok, fast_tokens_fact([(string.is_float(tok.str)) ? `float` : `integer`]));
        }
        else if (tok.flag & flag.CASTING_FLAG) {
            let right = next_exp(tok);
            let rtype = eval_exp_type(right);
            if (message.has_error()) return console.trace(ref);

            let etype = tok.str.substring(1, tok.str.length - 1);

            if (llliteral.can_be_cast_to(rtype, etype)) {
                tok = ref.replace(tok, right.back, fast_tokens_fact([etype]));
            }
            else {
                message.add(new message(message.SYNTAX_ERROR, `Type mismatch.`, tok.loc));
                return console.trace(ref);
            }
        }
        else if (!(tok.flag & (flag.SYMBOL_FLAG | flag.TYPE_FLAG)) && !llspec.type.includes(tok.str)) {

            //console.log(tok.str, flag.to_string(tok.flag));
            //throw new Error(`Name "${tok.str}" not defined within scope.`);
            message.add(new message(message.SYNTAX_ERROR, `Name "${tok.str}" not defined within scope.`, tok.loc));
            return console.trace(ref);
        }

        //console.log(tok.str);
    }
    return true;
};

const op_flag = (left, right) => {
    //console.trace(`op_flag =>`, left.str, right.str);

    if (left === `rotation`) left = `quaternion`;
    if (right === `rotation`) right = `quaternion`;

    let numb = new Uint16Array(1);
    let arr = [`integer`, `float`, `string`, `key`, `list`, `vector`, `quaternion`, `void`];
    if (arr.includes(left)) numb[0] |= (0x1 << arr.indexOf(left));
    if (arr.includes(right)) numb[0] |= (0x1 << arr.indexOf(right)) << 8;
    return numb[0];
};


const INTEGER_INTEGER = 257;
const INTEGER_FLOAT = 513;
const INTEGER_LIST = 4097;
const FLOAT_INTEGER = 258;
const FLOAT_FLOAT = 514;
const FLOAT_LIST = 4098;
const FLOAT_VECTOR = 8194;
const STRING_STRING = 1028;
const STRING_KEY = 2052;
const STRING_LIST = 4100;
const KEY_STRING = 1032;
const KEY_KEY = 2056;
const KEY_LIST = 4104;
const LIST_INTEGER = 272;
const LIST_FLOAT = 528;
const LIST_STRING = 1040;
const LIST_KEY = 2064;
const LIST_LIST = 4112;
const LIST_VECTOR = 8208;
const LIST_QUATERNION = 16400;
const VECTOR_INTEGER = 288;
const VECTOR_FLOAT = 544;
const VECTOR_LIST = 4128;
const VECTOR_VECTOR = 8224;
const VECTOR_QUATERNION = 16416;
const QUATERNION_LIST = 4160;
const QUATERNION_QUATERNION = 16448;

const eval_op_type = ref => {
    //console.trace(`eval_op_type =>`, string.simplify(ref.str));

    if (ref.empty()) return console.trace(ref);

    for (let lvl of op_ord) {
        

        for (let tok = ref.front; ref.end(tok); tok = ref.next(tok)) {
            if (!(tok.flag & flag.SYMBOL_FLAG) || !lvl.includes(tok.str)) continue;

            let type = ``,
                mismatch = false,
                range = new expr(tok.prev, tok.next);
                
            //console.log(range.str);
            switch (tok.str) {
                case `!`: case `~`: {
                    let first = operator.skip_unary_op(tok, `bwd`);
                    let last = operator.skip_unary_op(tok, `fwd`);
                    //console.log(`last`, last);
                    //console.log(`next`, next_exp(last));
                    range = new expr(first, next_exp(last).back);
                    type = range.back.str;
                    mismatch = (type !== `integer`);
                } break;

                case `++`: case `--`: {
                    if (tok.next && [`integer`, `float`].includes(tok.next.str)) {
                        range = new expr(tok, tok.next);
                        type = sanitize_type_name(tok.next.str);
                    }
                    else if (tok.prev && [`integer`, `float`].includes(tok.prev.str)) {
                        range = new expr(tok.prev, tok);
                        type = sanitize_type_name(tok.prev.str);
                    }
                    else mismatch = true;

                    if (type === `float`) {
                        message.add(new message(message.WARNING, `Use of increment/decrement operator with float type.`, tok.loc));
                    }

                } break;

                case `*`: {
                    switch (op_flag(tok.prev.str, tok.next.str)) {
                        case INTEGER_INTEGER: type = `integer`; break;
                        case FLOAT_INTEGER: case INTEGER_FLOAT: case FLOAT_FLOAT: case VECTOR_VECTOR: type = `float`; break;
                        case VECTOR_FLOAT: case FLOAT_VECTOR: case VECTOR_INTEGER: case VECTOR_QUATERNION: type = `vector`; break;
                        case QUATERNION_QUATERNION: type = `quaternion`; break;
                        default: mismatch = true; break;
                    }
                } break;

                case `/`: {
                    switch (op_flag(tok.prev.str, tok.next.str)) {
                        case INTEGER_INTEGER: type = `integer`; break;
                        case FLOAT_INTEGER: case INTEGER_FLOAT: case FLOAT_FLOAT: type = `float`; break;
                        case VECTOR_FLOAT: case VECTOR_INTEGER: case VECTOR_QUATERNION: type = `vector`; break;
                        case QUATERNION_QUATERNION: type = `quaternion`; break;
                        default: mismatch = true; break;
                    }
                } break;

                case `%`: {
                    switch (op_flag(tok.prev.str, tok.next.str)) {
                        case INTEGER_INTEGER: type = `integer`; break;
                        case VECTOR_VECTOR: type = `vector`; break;
                        default: mismatch = true; break;
                    }
                } break;

                case `-`: {
                    if (operator.is_neg_op(tok)) {
                        let exp = next_exp(tok);
                        type = eval_exp_type(exp);
                        if (message.has_error()) return console.trace(exp);

                        if (type === `string` || type === `key`) mismatch = true;
                        else {
                            range = new expr(tok, exp.back);
                            if (type === `integer`)
                                range.front = operator.skip_unary_op(tok, `bwd`);
                        }
                    }
                    else {
                        switch (op_flag(tok.prev.str, tok.next.str)) {
                            case INTEGER_INTEGER: type = `integer`; break;
                            case FLOAT_INTEGER: case INTEGER_FLOAT: case FLOAT_FLOAT: type = `float`; break;
                            case VECTOR_VECTOR: type = `vector`; break;
                            case QUATERNION_QUATERNION: type = `quaternion`; break;
                            default: mismatch = true; break;
                        }
                    }
                } break;

                case `+`: case `+=`: {
                    switch (op_flag(tok.prev.str, tok.next.str)) {
                        case INTEGER_INTEGER: type = `integer`; break;
                        case FLOAT_INTEGER: case INTEGER_FLOAT: case FLOAT_FLOAT: type = `float`; break;
                        case STRING_STRING: type = `string`; break;
                        case VECTOR_VECTOR: type = `vector`; break;
                        case QUATERNION_QUATERNION: type = `quaternion`; break;
                        case LIST_INTEGER: case LIST_FLOAT: case LIST_STRING: case LIST_KEY:
                        case LIST_VECTOR: case LIST_QUATERNION: case LIST_LIST: case FLOAT_LIST:
                        case STRING_LIST: case KEY_LIST: case VECTOR_LIST: case QUATERNION_LIST:
                            type = `list`; break;
                        default: mismatch = true; break;
                    }
                } break;

                case `<`: case `<=`: case `>`: case `>=`: {
                    switch (op_flag(tok.prev.str, tok.next.str)) {
                        case INTEGER_INTEGER: case FLOAT_INTEGER: case INTEGER_FLOAT: case FLOAT_FLOAT: type = `integer`; break;
                        default: mismatch = true; break;
                    }
                } break;

                case `==`: case `!=`: {
                    switch (op_flag(tok.prev.str, tok.next.str)) {
                        case INTEGER_INTEGER: case FLOAT_INTEGER: case INTEGER_FLOAT: case FLOAT_FLOAT:
                        case INTEGER_LIST: case STRING_STRING: case KEY_KEY: case KEY_STRING: case STRING_KEY:
                        case LIST_INTEGER: case LIST_LIST: case VECTOR_VECTOR: case QUATERNION_QUATERNION:
                            type = `integer`; break;
                        default: mismatch = true; break;
                    }
                } break;

                case `<<`: case `>>`: case `&`: case `^`: case `|`: case `||`: case `&&`: case `%=`: {
                    switch (op_flag(tok.prev.str, tok.next.str)) {
                        case INTEGER_INTEGER: type = `integer`; break;
                        default: mismatch = true; break;
                    }
                } break;

                case `=`: {
                    switch (op_flag(tok.prev.str, tok.next.str)) {
                        case INTEGER_INTEGER: type = `integer`; break;
                        case FLOAT_INTEGER: case FLOAT_FLOAT: type = `float`; break;
                        case STRING_STRING: case STRING_KEY: type = `string`; break;
                        case KEY_KEY: case KEY_STRING: type = `key`; break;
                        case LIST_LIST: type = `list`; break;
                        case VECTOR_VECTOR: type = `vector`; break;
                        case QUATERNION_QUATERNION: type = `quaternion`; break;
                        default: mismatch = true; break;
                    }
                } break;

                case `-=`: {
                    switch (op_flag(tok.prev.str, tok.next.str)) {
                        case INTEGER_INTEGER: type = `integer`; break;
                        case INTEGER_FLOAT: case FLOAT_INTEGER: case FLOAT_FLOAT: type = `float`; break;
                        case VECTOR_VECTOR: case VECTOR_FLOAT: type = `vector`; break;
                        case QUATERNION_QUATERNION: type = `quaternion`; break;
                        default: mismatch = true; break;
                    }
                } break;

                case `*=`: case `/=`: {
                    switch (op_flag(tok.prev.str, tok.next.str)) {
                        case INTEGER_INTEGER: type = `integer`; break;
                        case INTEGER_FLOAT: case FLOAT_INTEGER: case FLOAT_FLOAT: type = `float`; break;
                        case VECTOR_VECTOR: case VECTOR_FLOAT: case VECTOR_QUATERNION: type = `vector`; break;
                        case QUATERNION_QUATERNION: type = `quaternion`; break;
                        default: mismatch = true; break;
                    }
                } break;

                default: mismatch = true; break;
            }

            if (mismatch) {
                //console.log(string.simplify(`ref =>`, ref.str));
                //console.log(string.simplify(`range =>`, range.str));
                message.add(new message(message.SYNTAX_ERROR, `Type mismatch.`, tok.loc));
                return console.trace(ref);
            }

            if (!string.empty(type)) {
                //console.log(range);
                type = sanitize_type_name(type);
                tok = ref.replace(range, fast_tokens_fact([type]));
            }
        }
    }
    return true;
};

const validate_list_params = toks => {

    for (let tok = toks.front; toks.end(tok); tok = toks.next(tok)) {
        if (!(tok.flag & flag.DEF_FUNC_FLAG)) continue;
    }

};
