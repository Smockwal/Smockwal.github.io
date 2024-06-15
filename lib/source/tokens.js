
import { flag, kind_of } from "../global.js";
import { error, type_error } from "../error.js";
import { uri } from "../system/uri.js";
import { uris } from "../system/uris.js";
import { char } from "../text/char.js";
import { stream } from "../text/stream.js";
import { string } from "../text/string.js";
import { expr } from "./expressions.js";
import { location } from "./location.js";
import { message } from "./message.js";
import { fast_token_fact, token } from "./token.js";


export class tokens extends expr {
    #file = -1;

    constructor(arg, file_name) {
        super();

        if (file_name) {
            if (kind_of(file_name) === `location`) this.file = file_name.file;
            else this.file = file_name;
        }

        const kind = kind_of(arg);
        if (kind === `expr` || kind === `tokens`) {
            if (arg.file) this.file = arg.file;
            for (let tok = arg.front; tok != arg.back.next; tok = tok.next) {
                this.push_back(new token(tok));
            }
        }
        else if (kind === `string`) {
            this.tokenize(arg, file_name);
        }
    }

    get kind() { return `tokens`; };

    get file() { return (this.#file !== -1) ? uris.uri(this.#file) : ``; };
    set file(path) {
        if (kind_of(path) === `string`) {
            if (!uri.is_file_name(path)) throw new type_error(`path must be a file name.`);
            path = uris.add(path);
        }
        if (kind_of(path) !== `number`) throw new type_error(`tokens.file: try to set tokens file to a: ${kind_of(path)}`);
        this.#file = path;
    }

    /**
     * Tokenizes the input string and populates the tokens object.
     * @param {string} str - The input string to be tokenized.
     * @param {string} uri - The URI of the input string.
     * @returns {boolean} - Returns true if the tokenization is successful, otherwise false.
     */
    tokenize(str, uri) {
        let loc = new location(uri);
        if (uri) this.file = loc.file;
        let locs = [loc];

        let last_back;
        let multiline = 0;

        const input = new stream(str);

        while (input.good()) {
            let ch = input.get();
            if (!input.good()) break;

            if (!char.printable(ch) &&
                !char.json_spec(ch) &&
                ch != `\n` && ch != `\r` && ch != `\t`)
                ch = ` `;

            if (ch == `\n`) {


                if (this.last_line() == `# if %num%` && this.back.op == `0`) {
                    this.delete_tokens(this.line_expr(this.back));

                    let text = ``;
                    while (input.good() && !/^#\s*endif$/m.test(text)) {
                        text += input.get();
                    }

                    loc.line += multiline + 1;
                    loc.adjust(text);
                    continue;
                }




                if (this.back && this.back.op == `\\`) {
                    ++multiline;
                    this.delete_token(this.back);
                }
                else {
                    loc.line += multiline + 1;
                    multiline = 0;
                }

                if (!multiline)
                    loc.col = 1;

                if (last_back != this.back) {
                    last_back = this.back;

                    let last_line = this.last_line(),
                        curr_file = loc.file,
                        file_tok, line_directive;

                    // {file:"", line:1, col:0}
                    if (last_line == `# file %str%`) {
                        file_tok = this.back.str;
                        file_tok = file_tok.substring(1, file_tok.length - 1);
                        line_directive = { kind: `location`, file: file_tok };

                    }
                    else if (last_line == `# line %str% : %num%` || last_line == `# file %str% : %num%`) {
                        //console.log(last_line);
                        file_tok = this.back.prev.prev.str;
                        file_tok = file_tok.substring(1, file_tok.length - 1);
                        line_directive = {
                            kind: `location`,
                            file: file_tok,
                            line: parseInt(this.back.str)
                        };

                    }
                    else if (last_line == `# line %str% : %num% : %num%` || last_line == `# file %str% : %num% : %num%`) {
                        file_tok = this.back.prev.prev.prev.prev.str;
                        file_tok = file_tok.substring(1, file_tok.length - 1);
                        line_directive = {
                            kind: `location`,
                            file: file_tok,
                            line: parseInt(this.back.prev.prev.str),
                            col: parseInt(this.back.str)
                        };

                    }
                    else if (last_line == `# %num% : %num%`) {
                        line_directive = {
                            kind: `location`,
                            line: parseInt(this.back.prev.prev.str),
                            col: parseInt(this.back.str)
                        };

                    }
                    else if (last_line == `# endfile` && locs.length > 0) {
                        let tl = locs.last();
                        loc = new location(tl.file, tl.line, tl.col);
                        locs.pop();

                    }

                    if (line_directive) {
                        loc.line_directive(line_directive);
                        this.delete_tokens(this.line_expr(this.back));
                    }

                    if (file_tok && curr_file != uris.index(file_tok))
                        locs.push(loc);
                }
                continue;
            }

            if (char.space(ch)) {
                ++loc.col;
                continue;
            }

            let curr_token = ``;

            if (
                this.back && this.back.prev &&
                this.back.prev.loc.line == loc.line &&
                this.back.prev.op == `#` &&
                (this.last_line() == `# error` || this.last_line() == `# warning`)
            ) {
                let prev = ``;
                while (input.good() && (ch != `\n` || prev == `\\`)) {
                    curr_token += ch;
                    prev = ch;
                    ch = input.get();
                }

                if (ch == `\n`)
                    input.unget();

                this.push_back(new token(curr_token, loc));
                loc.adjust(curr_token);
                continue;
            }

            // number or name
            if (char.is_name(ch)) {

                const numb = char.is_number(ch);
                while (input.good() && char.is_name(ch)) {
                    curr_token += ch;

                    ch = input.get();
                    if (ch == `\\`) {
                        ch = input.get();
                        while (ch == `\r` || ch == `\n`)
                            ch = input.get();
                    }

                    if (numb && ch == `'` && char.is_name(input.peek()))
                        ch = input.get();

                }
                input.unget();
            }

            // comment
            else if (ch == `/` && input.peek() == `/`) {
                //console.log(ch);
                let prev = ``;
                while (input.good() && (ch != `\n` || prev == `\\`)) {
                    curr_token += ch;
                    prev = ch;
                    ch = input.get()
                }
                input.unget();

                multiline += string.count(curr_token, `\n`);
                curr_token = curr_token.replace(/\\\n/gm, ` `);
                curr_token = string.simplify(curr_token);
            }

            // comment
            else if (ch == `/` && input.peek(true) == `*`) {
                //input.get();
                while ((ch = input.get()) != `*`) {
                    if (ch == `\n`) ++multiline;
                }

                curr_token = ``;
                while (input.good() && !curr_token.endsWith(`*/`)) {
                    let tmp = input.get();
                    if (tmp) curr_token += tmp;
                }
                curr_token = `/*${curr_token}`;

                multiline += string.count(curr_token, `\n`);
                curr_token = curr_token.replace(/\\\n/gm, ` `);
                curr_token = string.simplify(curr_token);

            }

            // string literal
            else if (char.is_quote(ch)) {
                let quote = ch;
                let prefix = ``;
                let curr_flag = flag.STRING_FLAG;

                if (this.back &&
                    this.back.flag == flag.NAME_FLAG &&
                    string.is_literal_prefix(this.back.str) &&
                    ((this.back.loc.col + this.back.str.length) == loc.col) &&
                    (this.back.loc.line == loc.line)) {
                    prefix = this.back.str;
                }

                // C++11 raw string literal 
                if (!string.empty(prefix) && this.back && this.back.str.endsWith(`R`)) {
                    ch = input.get();

                    let delim = ``;
                    while (input.good() && ch != `(` && !char.is_new_line(ch)) {
                        delim += ch;
                        ch = input.get();
                    }

                    if (!input.good() || char.is_new_line(ch)) {
                        message.add(new message(message.SYNTAX_ERROR, `Invalid newline in raw string delimiter.`, loc));
                        return false;
                    }

                    let raw_end = (`)` + delim + quote);
                    while (input.good() && !curr_token.endsWith(raw_end))
                        curr_token += input.get();

                    if (!curr_token.endsWith(raw_end)) {
                        message.add(new message(message.SYNTAX_ERROR, `Raw string missing terminating delimiter.`, loc));
                        return false;
                    }

                    // TODO move location to stream class to acomodate multiline.

                    curr_token = curr_token.substring(0, curr_token.length - raw_end.length);
                    loc.adjust(`${quote}${delim}${string.simplify(curr_token)}${delim}${quote}`)

                    curr_token = string.c_escape(curr_token);
                    prefix = prefix.replace(`R`, ``);

                    this.back.str = `${prefix}${quote}${curr_token}${quote}`;
                    this.back.flag = flag.STRING_FLAG;

                    continue;
                }

                let prev = ``;
                ch = input.get();

                while (input.good() && (ch != quote || prev == "\\")) {
                    curr_token += ch;
                    prev = ch;

                    ch = input.get();
                }

                //console.log(ch);
                if (ch != quote) {
                    message.add(new message(message.SYNTAX_ERROR, `No pair for character (${quote}). Can't process file.`, loc));
                    curr_flag = 0;
                    //return false;
                }

                curr_token = `${prefix}${quote}${curr_token}${quote}`;

                if (string.empty(prefix))
                    this.push_back(new token(curr_token, loc));
                else
                    this.back.str = curr_token;

                loc.adjust(curr_token);

                this.back.flag = curr_flag;
                continue;
            }
            else {
                curr_token += ch;
            }

            if (curr_token == `<`) {
                let last_line = this.last_line();
                if ((last_line == `# include` || /__has_include(\s\()?$/.test(last_line))) {
                    ch = input.get();
                    let prev = ``;
                    while (input.good() && prev != `>`) {
                        curr_token += ch;
                        prev = ch;
                        ch = input.get();
                    }
                    input.unget();
                }

            }

            //console.log(curr_token);
            this.push_back(new token(curr_token, loc));

            if (multiline)
                loc.col += curr_token.length;
            else
                loc.adjust(curr_token);


        }

        this.combine_operators();

        return true;
    }

    /**
     * Combines adjacent operators and performs specific operations on tokens within the tokens object.
     * @returns {void}
     */
    combine_operators() {
        let scope = [false];
        for (let tok = this.front; tok; tok = tok.next) {
            //console.log(tok.op, tok.next.op);

            if (tok.op == `{`) {
                if (scope.last == true) {
                    scope.push(true);
                    continue;
                }
                let prev = tok.prev;
                while (prev && char.is_one_of(prev.op, `;{}()`))
                    prev = prev.prev;
                scope.push(prev && prev.op == `)`);
                continue;
            }

            if (tok.op == `}`) {
                if (scope.length > 1)
                    scope.pop();
                continue;
            }

            if (tok.op == `.`) {
                // ellipsis ...
                if (tok.next && tok.next.op == `.` &&
                    tok.next.loc.col == (tok.loc.col + 1) &&

                    tok.next.next && tok.next.next.op == `.` &&
                    tok.next.next.loc.col == (tok.loc.col + 2)) {

                    tok.str = `...`;
                    if (tok.prev && tok.prev.flag & flag.NAME_FLAG) {
                        tok.str = `${tok.prev.str}...`;
                        this.delete_token(tok.prev);
                    }

                    this.delete_token(tok.next);
                    this.delete_token(tok.next);
                    continue;
                }

                // float literals..
                if (tok.prev && (tok.prev.flag & flag.NUMBER_FLAG)) {
                    tok.str = `${tok.prev.str}.`;
                    this.delete_token(tok.prev);

                    if (tok.next && (char.is_float_suffix(tok.next.str[0]) ||
                        string.starts_with_one_of(tok.next.str, `abcdefp`, flag.CASE_INSENSITIVE))) {
                        tok.str = `${tok.str}${tok.next.str}`;
                        this.delete_token(tok.next);
                    }
                }
                if (tok.next && (tok.next.flag & flag.NUMBER_FLAG)) {
                    tok.str = `${tok.str}${tok.next.str}`;
                    this.delete_token(tok.next);
                }

            }


            const last = string.last_char(tok.str);
            if (tok.flag & flag.NUMBER_FLAG &&
                !string.is_oct(tok.str) &&
                //((!string.is_hex(tok.str) && char.is_one_of(last, `e`, flag.CASE_INSENSITIVE)) ||
                //    (string.is_hex(tok.str) && char.is_one_of(last, `p`, flag.CASE_INSENSITIVE))) &&
                char.is_one_of(last, `ep`, flag.CASE_INSENSITIVE) &&
                tok.next && char.is_one_of(tok.next.op, `-+`) &&
                tok.next.next && (tok.next.next.flag & flag.NUMBER_FLAG)) {

                tok.str += `${tok.next.op}${tok.next.next.str}`;
                this.delete_token(tok.next);
                this.delete_token(tok.next);
            }

            if (string.empty(tok.op) || !tok.next || string.empty(tok.next.op))
                continue;
            if (!tok.same_line(tok.next))
                continue;
            if (tok.loc.col + 1 != tok.next.loc.col)
                continue;

            if (tok.next.op == `=` && char.is_one_of(tok.op, `=!<>+-*/%&|^`)) {

                if (tok.op == `&` && scope.last == false) {

                }
                tok.str = `${tok.op}${tok.next.op}`;
                this.delete_token(tok.next);

            }
            else if ((tok.op == `|` || tok.op == `&`) && tok.op == tok.next.op) {
                tok.str = `${tok.op}${tok.next.op}`;
                this.delete_token(tok.next);
            }
            else if (tok.op == `:` && tok.next.op == `:`) {
                tok.str = `${tok.op}${tok.next.op}`;
                this.delete_token(tok.next);
            }
            else if (tok.op == `-` && tok.next.op == `>`) {
                tok.str = `${tok.op}${tok.next.op}`;
                this.delete_token(tok.next);
            }
            else if ((tok.op == `<` || tok.op == `>`) && tok.op == tok.next.op) {
                tok.str = `${tok.op}${tok.next.op}`;
                this.delete_token(tok.next);

                if (tok.next && tok.next.op == `=` && tok.next.next && tok.next.next.op != `=`) {
                    tok.str = `${tok.op}${tok.next.op}`;
                    this.delete_token(tok.next);
                }
            }
            else if ((tok.op == `+` || tok.op == `-`) && tok.op == tok.next.op) {
                //console.log(tok.op, tok.next.op);
                if (tok.loc.col + 1 != tok.next.loc.col)
                    continue;
                if (tok.prev && tok.prev.flag & flag.NUMBER_FLAG)
                    continue;
                if (tok.next.next && tok.next.next.flag & flag.NUMBER_FLAG)
                    continue;

                tok.str = `${tok.op}${tok.next.op}`;
                this.delete_token(tok.next);
            }
            else if (tok.op == `#` &&
                tok.same_line(tok.prev) &&
                tok.next.op == `#` &&
                tok.same_line(tok.next.next)) {

                tok.str = `##`;
                this.delete_token(tok.next);
            }
        }
    }

    /**
     * Removes comments from the tokens object.
     * @returns {void}
     */
    remove_comments() {
        let tok = this.front;
        while (tok) {
            let curr_tok = tok;
            tok = tok.next;
            if (curr_tok.flag & flag.COMMENT_FLAG)
                this.delete_token(curr_tok);
        }
    }

    /**
     * Adds a token or a range of tokens to the end of the current tokens object.
     * @param {token|expr|tokens} tok - The token, expression, or tokens object to be added.
     * @returns {tokens} - The current tokens object after adding the specified token or range of tokens.
     */
    push_back(tok) {
        const kind = kind_of(tok);
        if (kind === `expr` || kind === `tokens`) {
            if (this.front === undefined)
                this.front = tok.front;
            else
                this.back.next = tok.front;

            if (this.back) tok.front.prev = this.back;
            else tok.front.clear_prev();

            this.back = tok.back;
        }
        else if (kind === `token`) {
            if (this.front === undefined)
                this.front = tok;
            else
                this.back.next = tok;

            if (this.back) tok.prev = this.back;
            else tok.clear_prev();

            this.back = tok;
        }
        else throw new type_error(`tok is not an instance of token or expr.`);
        return this;
    }

    /**
     * Copies a range of tokens from the specified source to the current tokens object.
     * @param {tokens|expr} oth - The source tokens or expression to copy from.
     * @param {token|expr} first - The starting token or expression of the range to copy.
     * @param {token} last - The ending token of the range to copy.
     * @returns {void}
     */
    take(oth, first, last) {
        if (!oth || oth.empty()) throw new error(`function call on empty tokens.`);

        // If 'first' is an expression, set 'last' to its front and 'first' to its back.

        if (kind_of(first) === `expr`)
            [last, first] = [first.front, first.back];

        let begin = first || oth.front,
            end = last || oth.back;

        let prev = begin.prev,
            next = end.next;

        // If the current tokens object is empty, set 'begin' as the first token.
        if (!this.front)
            this.front = begin;
        else {
            this.back.next = begin;
            begin.prev = this.back;
        }
        this.back = end;

        if (prev) {
            if (next) prev.next = next;
            else prev.clear_next();
        }

        if (next) {
            if (prev) next.prev = prev;
            else next.clear_prev();

        }

        // Update 'oth' front and back if 'begin' or 'end' are the same as 'oth' front or back.
        if (Object.is(begin, oth.front)) {
            if (next) oth.front = next;
            else oth.clear_front();
        }


        if (Object.is(end, oth.back)) {
            if (prev) oth.back = prev;
            else oth.clear_back();
        }


        if (oth.front) {
            oth.front.clear_prev();
            oth.back.clear_next();
        }


        if (this.front) {
            this.front.clear_prev();
            this.back.clear_next();
        }

    }

    /**
     * Copies a range of tokens from the specified source to the current tokens object.
     * @param {tokens|expr} toks - The source tokens or expression to copy from.
     * @param {token|expr} from - The starting token or expression of the range to copy.
     * @param {token} to - The ending token of the range to copy.
     * @returns {tokens} - The current tokens object after copying the specified range of tokens.
     */
    copy(toks, from, to) {

        const kind = kind_of(toks)
        if (kind !== `expr` && kind !== `tokens`)
            throw new type_error(`Function call with bad parameters.`);

        if (toks.empty()) return this;

        if (from && from.front)
            [to, from] = [from.back, from.front];

        let begin = from || toks.front,
            end = to || toks.back;

        const range = new expr(begin, end);
        for (let it = range.front; range.end(it); it = range.next(it)) {
            this.push_back(new token(it.str, it.loc));
            this.back.flag = it.flag;
            if (it.scope) {
                this.back.scope = it.scope;
            }
        }

        if (this.#file === -1)
            this.file = this.front.loc.file;

        return this;
    }

    /**
     * Converts a range of tokens into a string representation.
     * @param {token|expr|tokens} from - The starting token, expression, or tokens object of the range.
     * @param {token} to - The ending token of the range.
     * @returns {string} - The string representation of the specified range of tokens.
     */
    stringify(from, to) {
        if (this.empty()) return ``;

        const kind = kind_of(from)
        if (kind === `expr` || kind === `tokens`)
            [to, from] = [from.back, from.front];

        let str_out = ``,
            begin = from || this.front,
            end = to || this.back;

        //console.log(this.#file);
        let loc = new location((from) ? begin.loc : (this.#file !== -1) ? uris.uri(this.#file) : ``);
        loc.line = 1;
        for (let tok = begin; tok && !Object.is(tok.prev, end); tok = tok.next) {

            if (tok.loc.line < loc.line || tok.loc.file != loc.file) {
                str_out += `\n${tok.loc.str()}\n`;
                loc = new location(tok.loc.file, tok.loc.line, tok.loc.col);
            }

            if (loc.line != tok.loc.line) {
                let line_dif = tok.loc.line - loc.line;
                if (line_dif > 4) str_out += `\n${tok.loc.str()}\n`;
                else str_out += `\n`.repeat(line_dif);
                loc.line = tok.loc.line;
            }

            if (tok.same_line(tok.prev))
                str_out += ` `;

            str_out += tok.str;
            loc.adjust(tok.str);
        }

        return str_out;
    }

}

/**
 * @param {Array} args 
 * @returns {tokens}
 */
export const fast_tokens_fact = args => {
    const ret = new tokens(),
        loc = new location();
    for (let i = 0; i < args.length; ++i) {
        ret.push_back(fast_token_fact(args[i], 0, loc));
        loc.adjust(args[i]);
    }
    return ret;
};
