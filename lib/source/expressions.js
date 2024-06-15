import { error, type_error } from "../error.js";
import { flag, kind_of } from "../global.js";
import { char } from "../text/char.js";
import { string } from "../text/string.js";
import { vec_gen_literal } from "./literal.js";
import { location } from "./location.js";
import { token } from "./token.js";


export class expr {
    #first;
    #last;

    constructor(first, last) {
        if (first) this.front = first;
        if (last) this.back = last;
    };

    get kind() { return `expr`; };

    get front() { return this.#first; };
    set front(x) {
        if (kind_of(x) !== `token`) throw new type_error(`expr.front: try to set token to a: ${kind_of(x)}`);
        this.#first = x;
    };

    get back() { return this.#last; };
    set back(x) {
        if (kind_of(x) !== `token`) throw new type_error(`expr.back: try to set token to a: ${kind_of(x)}`);
        this.#last = x;
    };

    get str() {
        if (this.empty()) return ``;

        let loc = new location(this.#first.loc);

        let str_out = ``;
        for (let tok = this.#first; tok && !Object.is(tok.prev, this.#last); tok = tok.next) {

            //console.log(loc);
            if (!loc.same_line(tok.loc)) {
                let diff = (tok.loc.line > loc.line) ? tok.loc.line - loc.line : 1;
                str_out += `\n`.repeat(diff);
                loc.line += diff;
            }

            if (loc.col != tok.loc.col) {
                str_out += ` `.repeat((tok.loc.col >= loc.col) ? tok.loc.col - loc.col : 1);
                loc.col = tok.loc.col;
            }

            str_out += tok.str;
            loc.adjust(tok.str);
        }

        return str_out;
    };

    get length() {
        let len = 0;
        for (let tok = this.#first; tok && tok != this.#last.next; tok = tok.next)
            ++len;
        return len;
    };

    /**
     * Check if the expression is empty.
     * @returns {Boolean} Returns true if the expression is empty, otherwise false.
     */
    empty() { return !this.#first; };

    /**
     * Clear the expression by removing all tokens.
     */
    clear() {
        this.#first = this.#last = undefined;
    };

    /**
     * Returns the last line of the expression as a string, excluding comments.
     * If the expression is empty, an empty string is returned.
     * @returns {String} The last line of the expression as a string.
     */
    last_line() {
        if (this.empty()) return ``;

        let ret = ``;
        for (let tok = this.#last; tok && tok.same_line(this.#last); tok = tok.prev) {
            if (tok.flag & flag.COMMENT_FLAG) continue;
            if (ret) ret = ` ${ret}`;
            if (tok.flag & flag.STRING_FLAG) ret = `%str%${ret}`;
            else if (tok.flag & flag.NUMBER_FLAG) ret = `%num%${ret}`;
            else ret = `${tok.str}${ret}`;
        }
        return ret;
    };

    /**
     * Returns a string representation of the tokens within the specified range.
     * If the expression is empty, an empty string is returned.
     * @param {token|expr|tokens} from - The starting token, expression, or tokens object.
     * @param {token} to - The ending token.
     * @returns {String} A string representation of the tokens within the specified range.
     */
    stringify(from, to) {
        if (this.empty()) return ``;

        if (kind_of(from) === `expr`) 
            [to, from] = [from.back, from.front];

        let begin = from || this.#first;
        let end = to || this.#last;
        return begin.stringify(end);
    };

    /**
    * Checks if the expression contains a specific token.
    * @param {token} tok - The token to be checked for existence within the expression.
    * @returns {Boolean} Returns true if the token is found within the expression, otherwise false.
    */
    contains(tok) {
        if (this.empty()) return false;
        for (let it = this.#first; it; it = it.next) if (it.is(tok)) return true;
        return false;
    };

    /**
     * Finds the first occurrence of a token with the specified string within the expression.
     * @param {String} str - The string to search for within the tokens.
     * @param {token} from - The token to start the search from. If not provided, the search starts from the beginning of the expression.
     * @returns {token|undefined} The first token with the specified string, or undefined if not found.
     */
    find_str(str, from) {
        if (this.empty() || string.empty(str)) return undefined;
        let it = from || this.#first;
        while (it && it.str != str) it = it.next;
        return it;
    };

    /**
     * Finds the last occurrence of a token with the specified string within the expression, starting from the specified token or the end of the expression.
     * @param {String} str - The string to search for within the tokens.
     * @param {token} from - The token to start the search from. If not provided, the search starts from the end of the expression.
     * @returns {token|undefined} The last token with the specified string, or undefined if not found.
     */
    find_str_r(str, from) {
        if (this.empty() || string.empty(str)) return undefined;
        let it = from || this.#last;
        while (it && it.str != str) it = it.prev;
        return it;
    };

    /**
     * Deletes the specified token from the expression.
     * @param {token} tok - The token to be deleted from the expression.
     * @throws {error} Throws an error if the specified token is undefined or not found within the expression.
     */
    delete_token(tok) {
        if (!tok) throw new error(`Try to delete a undefined token.`);
        if (!this.contains(tok)) throw new error(`Tokens list do not contain token: "${tok.str}".`);

        let prev = tok.prev;
        let next = tok.next;

        if (prev) {
            if (next) prev.next = next;
            else prev.clear_next();
        }

        if (next) {
            if (prev) next.prev = prev;
            else next.clear_prev();
        }

        if (this.#first === tok) this.#first = next;
        if (this.#last === tok) this.#last = prev;

        tok.clear();
    };

    /**
     * Deletes tokens within the specified range from the expression.
     * @param {token|expr|tokens} from - The starting token, expression, or tokens object.
     * @param {token} to - The ending token.
     * @returns {token|undefined} The next token after the deleted range, or undefined if the expression is empty or the starting token is not provided.
     */
    delete_tokens(from, to) {
        if (this.empty() || !from) return undefined;

        if (kind_of(from) === `expr`) 
            [to, from] = [from.back, from.front];

        let tok = from;
        let next = to.next || undefined;

        while (tok && tok !== next) {
            let temp = tok;
            tok = tok.next;
            this.delete_token(temp);
        }

        //if (this.#first) this.#first.clear_prev();
        //if (this.#last) this.#last.clear_next();
        return next;
    };

    /**
     * Creates an expression representing a single line of tokens starting from the specified token.
     * @param {token} tok - The token from which the line expression should start.
     * @returns {expr} An expression representing a single line of tokens.
     */
    line_expr(tok) {
        let line = new expr(tok, tok);
        while (line.front.same_line(line.front.prev)) line.front = line.front.prev;
        while (line.back.same_line(line.back.next)) line.back = line.back.next;
        return line;
    };

    /**
     * Creates an expression representing the rest of the line starting from the specified token.
     * If the token is a semicolon, an empty expression is returned.
     * @param {token} tok - The token from which the rest of the line expression should start.
     * @returns {expr} An expression representing the rest of the line starting from the specified token.
     * If the token is a semicolon, an empty expression is returned.
     */
    static rest_of_line(tok) {
        if (!tok) throw new error(`function call on undefined token.`);
        if (tok.op === `;`) return new expr();
        let ref = new expr(tok, tok);
        for (let it = tok; it && !char.is_one_of(it.op, `;}`); it = it.next) ref.back = it;
        return ref;
    };

    /**
     * Swaps the content of this expression with another expression.
     * @param {tokens|expr} oth - The other expression to swap content with.
     */
    swap(oth) {
        [this.#first, oth.#first] = [oth.#first, this.#first];
        [this.#last, oth.#last] = [oth.#last, this.#last];
    };

    /**
     * Replaces a range of tokens within the expression with another set of tokens.
     * If `from` and `to` are provided, replaces the tokens between `from` and `to` (inclusive) with `by`.
     * If `from` is an expression, replaces the tokens within the expression with `by`.
     * @param {token|expr|tokens} from - The starting token, expression, or tokens object.
     * @param {token} to - The ending token.
     * @param {expr} by - The expression to replace the specified range with.
     * @returns {token} The next token after the replaced range, or undefined if the expression is empty or the starting token is not provided.
     */
    replace(from, to, by) {
        

        if (from && from.front) 
            [by, to, from] = [to, from.back, from.front];

        
        if (!from || !to) throw new error(`undefined start or end token in tokens list to replace.`);

        if (this.#first) {
            if (from && !this.contains(from)) {
                console.error(`tokens do not contains token: `, this.str, from);
                throw new error(`tokens do not contains token: `);
            }

            if (to && !this.contains(to)) {
                console.error(`tokens do not contains token: `, this.str, to);
                throw new error(`tokens do not contains token: `);
            }
        }

        if (!by.front) {
            let ret = from.prev;
            this.delete_tokens(from, to);
            return ret;
        }

        if (!this.#first || (this.#first === from && this.#last === to)) {
            this.swap(by);
            return this.front;
        }

        if (this.#first === from) this.#first = by.front;

        
        if (from.prev) {
            from.prev.next = by.front;
            by.front.prev = from.prev;
        }
        else by.front.clear_prev();
            
        if (this.#last === to) this.#last = by.back;

        
        if (to.next) {
            to.next.prev = by.back;
            by.back.next = to.next;
        }
        else by.back.clear_next();
        

        let ret = by.front;
        to.clear_next();
        from.clear_prev();
        by.clear();

        return ret;
    };

    /**
     * Matches the tokens to form an expression based on the opening and closing characters.
     * @param {tokens|expr} tok - The token to start matching from.
     * @returns {expr} An expression representing the matched tokens, or undefined if no match is found.
     * @throws {error} Throws an error if the specified token is null or not an instance of token.
     */
    static match(tok) {
        if (kind_of(tok) !== `token`) throw new error(`Function call on not token.`);
        let op = ``;


        if (char.is_one_of(tok.op, `{([<`)) {
            //if (tok.match) return new expr(tok, tok.match);

            for (let it = tok; it; it = it.next) {
                //if (!(it.flag & flag.SYMBOL_FLAG)) continue;
                if (it.op == `<`) {
                    let vec = vec_gen_literal(it);
                    if (vec && vec.front) {
                        if (string.empty(op)) return vec;
                        it = vec.back;

                    }
                }

                if (char.is_one_of(it.op, `{([`))
                    op += it.op;
                else if (char.is_one_of(it.op, `])}`)) {
                    if (it.op == char.closing_char(string.last_char(op))) {
                        op = op.substring(0, op.length - 1);
                        if (string.empty(op)) return new expr(tok, it);

                    }
                    else
                        return undefined;
                }
                else if (string.empty(op))
                    return undefined;

                //console.log(`op: "${op}", it: "${it.str}", expr: "${new expr(tok, it).str}"`);
            }
        }
        else if (char.is_one_of(tok.op, `>])}`)) {
            //if (tok.match) return new expr(tok.match, tok);

            for (let it = tok; it; it = it.prev) {
                //if (!(it.flag & flag.SYMBOL_FLAG)) continue;
                //console.log(it.str);
                if (it.op == `>`) {
                    let vec = vec_gen_literal(it);
                    if (vec && vec.front) {
                        if (string.empty(op)) return vec;
                        it = vec.front;
                    }
                }

                if (char.is_one_of(it.op, `])}`))
                    op += it.op;
                else if (char.is_one_of(it.op, `({[`)) {
                    if (it.op == char.opening_char(string.last_char(op))) {
                        op = op.substring(0, op.length - 1);
                        if (string.empty(op)) return new expr(it, tok);
                    }
                    else
                        return undefined;
                }
                else if (string.empty(op))
                    return undefined;

                //console.log(`op: "${op}", it: "${it.str}", expr: "${new expr(it, tok).str}"`);
            }
        }

        return new expr(tok, tok);
    };

    /**
     * Checks if the specified token is the beginning of the expression.
     * @param {token} tok - The token to be checked.
     * @returns {Boolean} Returns true if the specified token is the beginning of the expression, otherwise false.
     * @throws {error} Throws an error if the expression is invalid (front or back is undefined).
     */
    begin(tok) {
        if (!this.front || !this.back) throw new error(`Invalid expr.`);
        return tok && tok !== this.front.next;
    };

    /**
     * Checks if the specified token is the end of the expression.
     * @param {token} tok - The token to be checked.
     * @returns {Boolean} Returns true if the specified token is the end of the expression, otherwise false.
     * @throws {error} Throws an error if the expression is invalid (front or back is undefined).
     * */
    end(tok) {
        if (!this.front || !this.back) throw new error(`Invalid expr.`);
        return tok && tok !== this.back.next;
    };

    /**
     * Returns the next token in the sequence.
     * @param {token} tok - The current token.
     * @returns {token|undefined} The next token in the sequence, or undefined if the current token is undefined.
     */
    next(tok) { return tok ? tok.next : tok; };
    prev(tok) { return tok ? tok.prev : tok; };

    /**
     * Aligns the location of each token within the expression to match the location of the first token.
     * @param {expr} exp - The expression whose tokens' locations need to be aligned.
     * @returns {expr} The expression with aligned token locations.
     */
    static align_location(exp, start) {
        const loc = new location(start || exp.front.loc);
        for (let it = exp.front; exp.end(it); it = exp.next(it)) {
            it.loc = loc;
            loc.adjust(it.str);
        }
        return exp;
    };

    /**
     * Aligns the indentation of each token within the expression to match the specified indentation value.
     * @param {expr} exp - The expression whose tokens' indentation needs to be aligned.
     * @param {Number} indentation - The desired indentation value to be applied to the tokens.
     * @returns {undefined} This method does not return any value.
     */
    static align_indent(exp, indentation) {
        let cur_loc = exp.front.loc.line;
        for (let it = exp.front; exp.end(it); it = exp.next(it)) {
            if (cur_loc !== it.loc.line) {
                it.loc.col = indentation;
                cur_loc = it.loc.line;
            }
        }
    };

    /**
     * Clears the reference to the first token in the expression.
     * After calling this method, the expression will no longer have a starting token.
     * @returns {undefined} This method does not return any value.
     */
    clear_front() { this.#first = undefined; };

    /**
     * Clears the reference to the last token in the expression.
     * After calling this method, the expression will no longer have an ending token.
     * @returns {undefined} This method does not return any value.
     */
    clear_back() { this.#last = undefined; };
}