
import { array } from "../../../array.js";
import { error, type_error } from "../../../error.js";
import { flag, kind_of } from "../../../global.js";
import { char } from "../../../text/char.js";
import { string } from "../../../text/string.js";
import { expr } from "../../expressions.js";
import { func } from "../../function.js";
import { vec_gen_literal } from "../../literal.js";
import { message } from "../../message.js";
import { operator } from "../../operator.js";
import { ANON_NAME, SCOPE_FUNC, SCOPE_GLOBAL, SCOPE_STATE, find_inst, set_source, source } from "../../source.js";
import { eval_token } from "../../token.js";
import { tokens } from "../../tokens.js";
import { lllabel } from "./lllabel.js";
import { llspec } from "./llspec.js";
import { llstate } from "./llstate.js";
import { lludf } from "./lludf.js";
import { llvar } from "./llvar.js";

export const CODE_ENTRY = `default`;

export class script extends source {
    #labs = [];
    #stas = [];

    constructor() { super(); }

    /** @returns {token|undefined} */
    get code_entry() {
        for (const state of this.#stas) {
            if (state.name === CODE_ENTRY)
                return state.tok;
        }
        return undefined;
    }

    get labs() { return this.#labs; }
    get stas() { return this.#stas; }

    /**
     * Checks if the script instance contains a variable with the given token.
     * @param {token} tok - The token to check for in the script instance.
     * @returns {boolean} - True if the script instance contains a variable with the given token, false otherwise.
     */
    has_var(tok) {
        if (kind_of(tok) !== `token`) throw new type_error(`value must be a token.`);
        return find_inst(this.vars, tok) !== undefined;
    }
    /**
     * Gets the variable with the given token from the script instance.
     * @param {token} tok - The token of the variable to get.
     * @returns {llvar|undefined} - Returns the variable with the given token, or undefined if the variable does not exist.
     */
    get_var(tok) {
        if (kind_of(tok) !== `token`) throw new type_error(`value must be a token.`);
        return find_inst(this.vars, tok);
    }
    /**
     * Adds a new variable to the array of variables.
     * @param {token} tok - The token representing the variable to be added.
     * @throws {TypeError} - If the provided value is not a token.
     */
    add_var(tok) {
        if (kind_of(tok) !== `token`) throw new type_error(`value must be a token.`);
        this.vars.push(new llvar(tok));
    }

    has_func(tok) {
        if (kind_of(tok) !== `token`) throw new type_error(`value must be a token.`);
        return find_inst(this.funcs, tok) !== undefined;
    }
    get_func(tok) {
        if (kind_of(tok) !== `token`) throw new type_error(`value must be a token.`);
        return find_inst(this.funcs, tok);
    }
    add_func(tok) {
        if (kind_of(tok) !== `token`) throw new type_error(`value must be a token.`);
        this.funcs.push(new lludf(tok)); /*console.log(`script.add_func()`);*/
    }

    has_label(tok) {
        if (kind_of(tok) !== `token`) throw new type_error(`value must be a token.`);
        return find_inst(this.labels, tok) !== undefined;
    }
    get_label(tok) {
        if (kind_of(tok) !== `token`) throw new type_error(`value must be a token.`);
        return find_inst(this.labels, tok);
    }
    add_label(tok) {
        if (kind_of(tok) !== `token`) throw new type_error(`value must be a token.`);
        const labl = new lllabel(tok);
        if (string.empty(labl.scope))
            return message.add(new message(message.SYNTAX_ERROR, `Use of label outside of function or event.`, tok.loc));
        this.labels.push(labl);
    }

    has_state(tok) {
        if (kind_of(tok) !== `token`) throw new type_error(`value must be a token.`);
        return find_inst(this.#stas, tok) !== undefined;
    }
    get_state(tok) {
        if (kind_of(tok) !== `token`) throw new type_error(`value must be a token.`);
        return find_inst(this.#stas, tok);
    }
    add_state(tok) {
        if (kind_of(tok) !== `token`) throw new type_error(`value must be a token.`);
        this.#stas.push(new llstate(tok)); /*console.log(this.#stas);*/
    }

    has_event(state, tok) {
        if (kind_of(state) !== `token`) throw new type_error(`state must be a token.`);
        if (kind_of(tok) !== `token`) throw new type_error(`value must be a token.`);
        state = this.get_state(state);
        if (kind_of(state) !== `llstate`) return false;
        return state.has_event(tok.str);
    }
    get_state_events(state) {
        if (kind_of(state) !== `token`) throw new type_error(`state must be a token.`);
        state = this.get_state(state);
        if (kind_of(state) !== `llstate`) return [];
        return state.events;
    }
    add_event(state, tok) {
        if (kind_of(state) !== `token`) throw new type_error(`state must be a token.`);
        if (kind_of(tok) !== `token`) throw new type_error(`value must be a token.`);
        state = this.get_state(state);
        if (kind_of(state) !== `llstate`) return;
        state.add_event(tok.str);
    }

    know_name(str) {
        return [...this.vars, ...this.funcs, ...this.#labs, ...this.#stas].some(e => e.name === str);
    }

    /**
     * Flags tokens based on various criteria to classify them for further processing.
     * @param {tokens} toks - The tokens to flag.
     * @returns {tokens} - The flagged tokens.
     * @throws Will throw an error if the tokens parameter is empty or of the wrong type.
     */
    flag_tokens(toks) {
        // Validate the input type and content.
        const kind = kind_of(toks);
        if ((kind !== 'tokens' && kind !== 'expr') || toks.empty()) {
            throw new error('flag_tokens: called with empty or invalid tokens.');
        }

        // List of operator strings to check against.
        const operator_list = [
            '!', '~', '++', '--', '*', '/', '%', '-', '+', '<<', '>>', '<', '<=', '>', '>=',
            '==', '!=', '&', '^', '|', '||', '&&', '=', '+=', '-=', '*=', '/=', '%=', '@'
        ];

        // Regular expression to match casting types.
        const cast_reg = new RegExp(`\\((${llspec.type.join('|')})\\)`);

        let deep = 0;
        let inState = false;

        // First pass to evaluate and flag each token.
        for (let tok = toks.front; toks.end(tok); tok = toks.next(tok)) {
            tok.flag = eval_token(tok.str);

            if (llspec.type.includes(tok.str)) {
                if (tok.str === 'rotation') tok.str = 'quaternion';
                tok.flag |= flag.TYPE_FLAG;
            } else if (cast_reg.test(tok.str)) {
                if (tok.str === '(rotation)') tok.str = '(quaternion)';
                tok.flag |= flag.CASTING_FLAG;
            } else if (llspec.controls.includes(tok.str)) {
                tok.flag |= flag.CONTROL_FLAG;
                if (tok.str === CODE_ENTRY) {
                    tok.flag |= flag.STATE_NAME_FLAG;
                    inState = true;
                } else if (tok.str === 'state') {
                    inState = true;
                }
            } else if (func.is_func_name(tok)) {
                if (llspec.functions[tok.str]) {
                    tok.flag |= flag.DEF_FUNC_FLAG;
                } else if (llspec.events[tok.str]) {
                    tok.flag |= flag.EVENT_FLAG;
                } else {
                    tok.flag |= flag.USER_FUNC_FLAG;
                }
            } else if (operator_list.includes(tok.str)) {
                if ('<>'.includes(tok.op) && vec_gen_literal(tok)) {
                    tok.flag |= flag.DEL_FLAG;
                } else {
                    tok.flag |= flag.OPERATOR_FLAG;
                }
            } else if (char.is_one_of(tok.op, '{}()[]')) {
                tok.flag |= flag.DEL_FLAG;
                if (tok.op === '[') {
                    tok.flag |= flag.LIST_OP_FLAG;
                } else if (tok.op === ']') {
                    tok.flag |= flag.LIST_CL_FLAG;
                }
            } else if (tok.str === ';') {
                tok.flag |= flag.EOL_FLAG | flag.DEL_FLAG;
            } else if (tok.flag & flag.NAME_FLAG) {
                if (tok.prev && tok.prev.flag & flag.TYPE_FLAG) {
                    tok.flag |= flag.VARIABLE_FLAG;
                } else if (tok.prev?.str === 'state') {
                    tok.flag |= flag.STATE_NAME_FLAG;
                }
            }
        }

        // Second pass to flag parameters in user-defined functions or events.
        for (let tok = toks.front; toks.end(tok); tok = toks.next(tok)) {
            if ((tok.flag & flag.USER_FUNC_FLAG && tok.scope === SCOPE_GLOBAL) || tok.flag & flag.EVENT_FLAG) {
                const decl = new func(tok);
                for (let it = decl.front; it && it !== decl.back.next; it = it.next) {
                    if (it.flag & flag.VARIABLE_FLAG) {
                        it.flag |= flag.PARAM_FLAG;
                    }
                }
                tok = decl.last_tok;
            }
        }

        return toks;
    }


    /**
     * Parses the scope of tokens and updates their scope properties.
     * @param {tokens} toks - The tokens to parse.
     * @param {Array<string>} scp - The current scope array.
     * @returns {tokens} - The tokens with updated scopes.
     * @throws Will throw an error if the tokens parameter is empty.
     */
    parse_scope(toks, scp) {
        const kind = kind_of(toks);
        if ((kind !== 'tokens' && kind !== 'expr') || toks.empty()) {
            throw new error('parse_scope: called with empty or invalid tokens.');
        }
        if (string.empty(array.last(scp))) return;

        // Increase the scope depth
        this._scp_deep++;
        let anon_row = 0;
        let last_name = '';

        // Set the initial scope for all tokens
        for (let tok = toks.front; tok && tok !== toks.back.next; tok = tok.next) {
            tok.scope = scp.join('/');
        }

        let tok = toks.front;
        if (char.is_one_of(tok.op, '({')) tok = tok.next;

        while (tok && tok !== toks.back.next) {
            // Skip redundant 'else if' or 'if else' cases
            if ((tok.str === 'else' && tok.next && tok.next.str === 'if') || (tok.str === 'if' && tok.prev && tok.prev.str === 'else')) {
                tok = tok.next;
                continue;
            }

            // Handle scope delimiters '{' and '('
            if (tok.flag & flag.DEL_FLAG && char.is_one_of(tok.op, '({')) {
                let name = (tok.prev && tok.prev.flag & flag.NAME_FLAG) ? tok.prev.str : `${ANON_NAME}.${++anon_row}.${this._scp_deep}`;

                if (tok.prev && tok.prev.flag & flag.STATE_NAME_FLAG) {
                    name = `${SCOPE_STATE}.${name}`;
                }
                else if (tok.prev && tok.prev.flag & flag.USER_FUNC_FLAG) {
                    name = `${SCOPE_FUNC}.${name}`;
                }
                else if (tok.prev && tok.prev.flag & flag.CONTROL_FLAG && tok.prev.str !== CODE_ENTRY) {
                    name = `${++anon_row}.${name}`;
                }

                if (tok.op === '{' && tok.prev && tok.prev.str === ')') {
                    name = last_name;
                }

                const ref = expr.match(tok);
                if (ref.front) {
                    this.parse_scope(ref, [...scp, name]);
                    tok = ref.back;
                }
                last_name = name;
            }
            // Handle 'else' cases without 'if' or '{'
            else if (tok.prev && tok.next && tok.str === 'else' && tok.next.str !== 'if' && tok.next.str !== '{' && char.is_one_of(tok.prev.op, ';}')) {
                const ref = expr.rest_of_line(tok.next);
                for (let it = ref.front; it && it !== ref.back.next; it = it.next) {
                    if (it.flag & flag.TYPE_FLAG) {
                        message.add(new message(message.SYNTAX_ERROR, 'Declaration requires a new scope -- use { and }', it.next.loc));
                        return new tokens();
                    }
                }

                this.parse_scope(ref, [...scp, `${anon_row}.else`]);
                tok = ref.back;
                last_name = '';
            }
            // Handle 'if', 'while', 'for' cases without scope
            else if (tok.prev && tok.prev.op === ')' && tok.flag & (flag.NAME_FLAG | flag.NUMBER_FLAG) && /\d+\.(if|while|for|else)/.test(last_name) && tok.op !== '{') {
                const ref = expr.rest_of_line(tok);
                for (let it = ref.front; it && it !== ref.back.next; it = it.next) {
                    if (it.flag & flag.TYPE_FLAG) {
                        message.add(new message(message.SYNTAX_ERROR, 'Declaration requires a new scope -- use { and }', it.next.loc));
                        return new tokens();
                    }
                }

                if (ref.front) {
                    this.parse_scope(ref, [...scp, last_name]);
                    tok = ref.back;
                }
                last_name = '';
            }

            tok = tok.next;
        }

        // Decrease the scope depth
        this._scp_deep--;
        return toks;
    }

    /**
     * Collects and processes the names of variables, functions, labels, and states from the given tokens.
     * Updates the flags of the tokens accordingly.
     * @param {tokens} toks - The tokens from which to collect and process the names.
     * @returns {tokens} - The updated tokens with the collected and processed names.
     */
    collect_name(toks) {
        if (!toks || toks.empty()) {
            throw new Error('collect_name: called with empty or invalid tokens.');
        }

        let curr_state, default_state;
        const is_of_type = (tok, flag) => tok.flag & flag;

        const handle_label_token = (toks, tok, obj) => {
            if (obj.has_label(tok.next)) {
                message.add(new message(message.SYNTAX_ERROR, `Duplicate local label name. That won't allow the Mono script to be saved, and will not work as expected in LSO.`, tok.loc));
                return console.trace(toks);
            }
            obj.add_label(tok.next);
        }

        const handle_event_token = (toks, tok, obj) => {
            if (obj.has_event(curr_state, tok)) {
                message.add(new message(message.SYNTAX_ERROR, `Event name "${tok.str}" previously declared within scope.`, tok.loc));
                return console.trace(toks);
            }
            obj.add_event(curr_state, tok);

            const endl = new func(tok).last_tok;
            for (let it = tok; it && it !== endl; it = it.next) {
                if (is_of_type(it, flag.VARIABLE_FLAG)) it.flag |= flag.PARAM_FLAG;
            }
        }

        const handle_entry_point = (toks, tok, obj) => {
            if (obj.has_state(tok)) {
                message.add(new message(message.SYNTAX_ERROR, `State name "${tok.str}" previously declared within scope.`, tok.loc));
                return console.trace(toks);
            }
            obj.add_state(tok);
            curr_state = tok;
            if (tok.str === CODE_ENTRY) default_state = tok;
        }

        const handle_state_declaration = (toks, tok, obj) => {
            if (tok.next) {
                if (tok.next.str === 'state') {
                    message.add(new message(message.SYNTAX_ERROR, `Use of illegal keyword: "${tok.str}".`, tok.loc));
                    return console.trace(toks);
                }
                else if (tok.next.str === '{') {
                    message.add(new message(message.SYNTAX_ERROR, 'Missing state name.', tok.loc));
                    return console.trace(toks);
                }
                tok = tok.next;
            }

            if (!tok.next || tok.next.str !== '{') {
                message.add(new message(message.SYNTAX_ERROR, 'Missing state block: "state".', tok.loc));
                return console.trace(toks);
            }

            if (obj.has_state(tok)) {
                message.add(new message(message.SYNTAX_ERROR, `State name "${tok.str}" previously declared within scope.`, tok.loc));
                return console.trace(toks);
            }
            obj.add_state(tok);
            curr_state = tok;
        }

        const handle_state_token = (toks, tok, obj) => {
            if (tok.str === 'state') {
                handle_state_declaration(toks, tok, obj);
            }
            else {
                handle_entry_point(toks, tok, obj);
            }
        }

        const handle_function_token = (toks, tok, obj) => {
            if (obj.has_func(tok)) {
                message.add(new message(message.SYNTAX_ERROR, `Function name "${tok.str}" previously declared within scope.`, tok.loc));
                return console.trace(toks);
            }
            obj.add_func(tok);

            const endl = new func(tok).last_tok;
            for (let it = tok; it && it !== endl; it = it.next) {
                if (is_of_type(it, flag.VARIABLE_FLAG)) it.flag |= flag.PARAM_FLAG;
            }
        }

        const update_variable_usage = (toks, tok, obj) => {
            for (let it = toks.front, end = toks.back.next; it && it !== end; it = it.next) {
                if (it.str !== tok.str) continue;

                let ori = obj.get_var(it);
                if (it.scope.startsWith(tok.scope) && ori && tok.is(ori.tok)) {
                    if (it.next && it.next.op !== '(') {
                        it.flag = it.flag & ~(flag.INITED_FLAG | flag.USED_FLAG | flag.ASSIGNED_FLAG) | flag.VARIABLE_FLAG;
                        if (Object.is(tok, it)) {
                            if (tok.next.op === '=') tok.flag |= flag.INITED_FLAG;
                        }
                        else {
                            ori.tok.flag |= flag.USED_FLAG;
                            if (/^[+\-/*%]?=$/.test(it.next.str) || /^[+\-]{2}$/.test(it.next.str) || /^[+\-]{2}$/.test(it.prev.str)) {
                                if (tok.flag & flag.CONST_FLAG) {
                                    message.add(new message(message.SYNTAX_ERROR, 'Assignment to constant variable.', it.loc));
                                    return console.trace(toks);
                                }
                                tok.flag |= flag.ASSIGNED_FLAG;
                            }
                        }
                    }
                }
            }
        }

        const handle_variable_token = (toks, tok, obj) => {
            if (obj.has_var(tok)) {
                message.add(new message(message.WARNING, `Variable name "${tok.str}" previously declared within scope.`, tok.loc));
            }
            else {
                obj.add_var(tok);
            }

            if (tok.prev && tok.prev.prev && tok.prev.prev.str === 'const') {
                tok.flag |= flag.CONST_FLAG;
                toks.delete_token(tok.prev);
            }

            if (!tok.next) {
                message.add(new message(message.SYNTAX_ERROR, 'Missing EOL(;).', tok.loc));
                return console.trace(toks);
            }

            update_variable_usage(toks, tok, obj);
        }

        const handle_name_token = (toks, tok, obj) => {
            if (is_of_type(tok, flag.VARIABLE_FLAG) && tok.prev && is_of_type(tok.prev, flag.TYPE_FLAG)) {
                handle_variable_token(toks, tok, obj);
            }
            else if (is_of_type(tok, flag.USER_FUNC_FLAG) && tok.scope === SCOPE_GLOBAL) {
                handle_function_token(toks, tok, obj);
            }
            else if (tok.scope === SCOPE_GLOBAL && (tok.str === CODE_ENTRY || tok.str === 'state')) {
                handle_state_token(toks, tok, obj);
            }
            else if (llspec.events[tok.str] && tok.scope !== SCOPE_GLOBAL) {
                handle_event_token(toks, tok, obj);
            }
        }

        for (let tok = toks.front; toks.end(tok); tok = toks.next(tok)) {
            if (is_of_type(tok, flag.NAME_FLAG)) {
                handle_name_token(toks, tok, this);
            }
            else if (is_of_type(tok, flag.SYMBOL_FLAG) && tok.op === '@') {
                handle_label_token(toks, tok, this);
            }
        }

        return toks;
    }

    /**
     * Clears the internal state of the script.
     * Resets the scope depth, and clears the arrays of variables, functions, labels, and states.
     */
    clear() {
        //console.trace(`clear src`);
        super.clear();
        this.#labs.length = 0; // Clear the array of labels
        this.#stas.length = 0; // Clear the array of states
    }

    /**
     * Returns an expression representing a line of code containing the given token.
     * @param {token} tok - The token from which to derive the line of code.
     * @returns {expr} - The expression representing the line of code.
     */
    static line_of_code(tok) {
        const line = new expr(tok, tok);
        while (line.front.prev && !char.is_one_of(line.front.prev.op, `;{}`))
            line.front = line.front.prev;

        while (line.back.next && !char.is_one_of(line.back.op, `;{}`))
            line.back = line.back.next;

        return line;
    }

}

/**
 * Returns an expression representing the next line of code starting from the given token.
 * Handles various cases such as function calls, unary operators, and casting.
 * @param {token} tok - The token from which to derive the next line of code.
 * @returns {expr} - The expression representing the next line of code.
 */
export const next_exp = tok => {
    if (!tok.next) return console.trace(tok);

    let last = tok.next;
    while (last.flag & flag.CASTING_FLAG || operator.is_unary_op(last))
        last = last.next;

    if (last.str === `--` || last.str === `++`)
        last = last.next;

    if (last.next) {
        if (func.is_func_name(last)) last = new func(last).last_tok;
        else if (char.is_one_of(last.op, `{([<`)) last = expr.match(last).back;
    }

    if (last.next && last.next.next && last.next.op === `.` && char.is_one_of(last.next.next.op, `xyzws`))
        last = last.next.next;

    if (last.next && (last.next.str === `--` || last.next.str === `++`))  
        last = last.next;

    return new expr(tok.next, last);
}

/**
 * Returns an expression representing the previous line of code starting from the given token.
 * Handles various cases such as function calls, unary operators, and casting.
 * @param {token} tok - The token from which to derive the previous line of code.
 * @returns {expr} - The expression representing the previous line of code.
 */
export const prev_exp = tok => {
    //console.log(tok);
    if (!tok.prev) return console.trace(tok);

    let first = tok.prev;

    if (first.prev && (first.str === `--` || first.str === `++`)) 
        first = first.prev;


    if (first.prev && first.prev.prev && char.is_one_of(first.op, `xyzws`) && first.prev.op === `.`)
        first = first.prev.prev;

    if (char.is_one_of(first.op, `>)}]`)) {
        first = expr.match(first).front;

        if (first.prev && func.is_func_name(first.prev))
            first = new func(first.prev).name_tok;
    }

    if (first.prev && ((first.prev.str === `--` || first.prev.str === `++`) || first.prev.flag & flag.CASTING_FLAG))
        first = first.prev;

    return new expr(first, tok.prev);
}

/**
 * Returns the number of entities in the given expression.
 * @param {expr} exp - The expression to count the entities in.
 * @returns {number} - The number of entities in the expression.
 */
export const count_entities = exp => {
    let count = 0;
    for (let tok = exp.front; exp.end(tok); tok = exp.next(tok)) {
        if (tok.flag & (flag.USER_FUNC_FLAG | flag.DEF_FUNC_FLAG)) {
            tok = new func(tok).last_tok;
            ++count;
        }
        else if (tok.flag & (flag.VECTOR_OP_FLAG | flag.QUAT_OP_FLAG | flag.LIST_OP_FLAG) || tok.op === `(`) {
            tok = expr.match(tok).back;
            ++count;
        }
        else ++count;
    }
    return count;
};

set_source(new script());
