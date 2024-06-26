import { type_error } from "../../../error.js";
import { flag, kind_of, type_of } from "../../../global.js";
import { numb } from "../../../math/number.js";
import { ASCII_exp, infinity_regexp } from "../../../text/regex.js";
import { string } from "../../../text/string.js";
import { expr } from "../../expressions.js";
import { message } from "../../message.js";
import { operator } from "../../operator.js";
import { token } from "../../token.js";
import { tokens } from "../../tokens.js";
import { llspec, load_spec } from "./llspec.js";

export const lsl_symbol_exp = /^[@;{}\[\]()<>!~+\-*\/%=&:.^,|]{1,3}$/;

/**
 * Handles non-ASCII characters in token strings.
 * Warns the user about non-ASCII characters and replaces them with whitespace.
 *
 * @param {token} tok - The token to be processed.
 * @param {tokens} source - The source code where the token is located.
 * @returns {token} - The next token to be processed.
 */
const handle_non_ascii = (tok, source) => {
    message.add(new message(message.WARNING, `Name ${tok.str} contains non-ASCII characters and will be interpreted as whitespace by the compiler.`, tok.next.loc));

    let next = tok.prev || source.front;
    if (tok.str === tok.op) {
        source.delete_tokens(tok, tok);
    }
    else {
        let str = Array.from(tok.str).map(code => code.codePointAt(0) < 0x7F ? code : " ").join("");
        source.replace(tok, tok, new tokens(str, tok.loc));
    }
    return next;
};

/**
 * Handles string literals in token strings.
 * Converts prefixed string literals to their corresponding UTF-16 encoded strings.
 * Merges adjacent string literals.
 *
 * @param {token} tok - The token to be processed.
 * @param {tokens} source - The source code where the token is located.
 * @returns {token} - The next token to be processed.
 */
const handle_string_flag = (tok, source) => {
    if (!tok.str.startsWith(`"`)) {
        const index = tok.str.indexOf(`"`);
        const prefix = tok.str.substring(0, index);

        // Check if the prefix is a valid string literal prefix
        if (!string.is_literal_prefix(prefix)) {
            message.add(new message(message.SYNTAX_ERROR, `Unknown string literal prefix: ${prefix}`, tok.next.loc));
            return new tokens();
        }

        let raw = tok.str.substring(index + 1, tok.str.length - 1);

        // Convert raw string to UTF-16 encoded string
        const convert_raw_utf16 = (raw_arr, bytes_per_unit) => {
            const buffer = new ArrayBuffer(raw_arr.length * bytes_per_unit);
            const view = new DataView(buffer);
            raw_arr.forEach((code, i) => view[`setUint${bytes_per_unit * 8}`](i * bytes_per_unit, code));
            return new TextDecoder(`utf-16be`, { byteOrderMark: false }).decode(new Uint16Array(view.buffer));
        };

        const raw_arr = Array.from(raw).map(code => code.codePointAt(0));

        // Handle different string literal prefixes
        switch (prefix) {
            case `u8`:
                tok.str = `"${convert_raw_utf16(raw_arr, 1)}"`;
                break;
            case `U`:
            case `L`:
                tok.str = `"${convert_raw_utf16(raw_arr, 4)}"`;
                break;
            default:
                tok.str = `"${raw}"`;
                break;
        }
    }

    // Merge adjacent string literals
    if (tok.prev && (tok.prev.flag & flag.STRING_FLAG)) {
        tok.str = `"${tok.prev.str.slice(1, -1)}${tok.str.slice(1, -1)}"`;
        tok.flag |= flag.STRING_FLAG;
        source.delete_token(tok.prev);
    }

    // Ensure the string literal is properly formatted
    tok.str = tok.str.startsWith(`"`) ? tok.str : `"${tok.str.slice(1, -1)}"`;
    tok.flag |= flag.STRING_FLAG;
    return tok;
};

/**
 * Handles symbol flags in tokens.
 * If the token is a negative operator followed by a number, it combines them into a single token.
 * If the token does not match the lsl_symbol_exp regular expression, it deletes the token.
 *
 * @param {token} tok - The token to be processed.
 * @param {tokens} source - The source code where the token is located.
 * @returns {token} - The next token to be processed.
 */
const handle_symbol_flag = (tok, source) => {
    if (operator.is_neg_op(tok) && tok.next && (tok.next.flag & flag.NUMBER_FLAG)) {
        // Combine negative operator and number into a single token
        tok.str = `-${tok.next.str}`;
        source.delete_token(tok.next);
    }
    else if (!lsl_symbol_exp.test(tok.str)) {
        // Delete the token if it does not match the lsl_symbol_exp regular expression
        tok = source.delete_tokens(tok, tok);
    }
    return tok;
};

/**
 * Handles number flags in tokens.
 * Converts octal, hexadecimal, and binary numbers to their decimal representation.
 * Removes the 'f', 'l', and 'fl' suffixes from floating-point numbers.
 *
 * @param {token} tok - The token to be processed.
 * @returns {token} - The next token to be processed.
 */
const handle_number_flag = tok => {
    if (string.is_oct(tok.str)) {
        // Convert octal number to decimal
        tok.str = `${numb.parse_int(tok.str, 8)}`;
    }
    else if (string.is_float(tok.str) && !infinity_regexp.test(tok.str)) {
        // Remove 'f', 'l', and 'fl' suffixes from floating-point numbers
        tok.str = tok.str.replace(/(f|l|fl)$/, ``);
    }
    else if (string.is_hex(tok.str)) {
        // Convert hexadecimal number to decimal
        const val = numb.parse_int(tok.str, 16);
        tok.str = `0x${(val >>> 0).toString(16).toUpperCase()}`;
    }
    else if (string.is_bin(tok.str)) {
        // Convert binary number to decimal
        const str = tok.str.slice(2).replace(`'`, ``);
        tok.str = `${numb.parse_int(str, 2)}`;
    }
    return tok;
};

/**
 * Handles the NAME_FLAG tokens.
 * If the token is a constant from the llspec, it replaces the token with the corresponding value.
 * If the token is a type from the llspec, it wraps the token in parentheses and sets the CASTING_FLAG.
 * If the token is 'break' or 'continue', it handles the control structures.
 *
 * @param {token} tok - The token to be processed.
 * @param {tokens} source - The source code where the token is located.
 * @returns {Promise<token>} - A Promise that resolves when the token processing is complete.
 */
const handle_name_flag = async (tok, source) => {
    if (llspec.constants[tok.str]) {
        const obj = llspec.constants[tok.str];
        const toks0 = new tokens(type_of(obj) === `string` && !obj.value.startsWith(`"`) ? `"${obj.value}"` : obj.value);

        // Recursively convert the tokens within the constant value to LSL
        await convert_to_lsl(toks0);

        // Replace the token with the converted tokens
        tok = source.replace(tok, tok, toks0);
    }
    else if (tok.prev && tok.next && tok.prev.op === `(` && tok.next.op === `)` && llspec.type.includes(tok.str)) {
        // Wrap the token in parentheses and set the CASTING_FLAG
        tok.str = `(${tok.str})`;
        tok.flag |= flag.CASTING_FLAG;
        tok.loc = tok.prev.loc;

        // Delete the surrounding parentheses
        source.delete_token(tok.prev);
        source.delete_token(tok.next);
    }
    else if (tok.str === `break` || tok.str === `continue`) {
        // Handle break and continue control structures
        tok = handle_control_structures(tok, source);
    }
    return tok
};

/**
 * Handles break and continue control structures in the LSL language.
 * Replaces break and continue statements with equivalent LSL code.
 *
 * @param {token} tok - The token representing the break or continue statement.
 * @param {tokens} source - The source code where the token is located.
 * @returns {token} - The next token to be processed.
 */
const handle_control_structures = (tok, source) => {
    let it = tok;
    let rpl = ``;
    let name = string.uid();

    if (tok.str === `break`) {
        // Find the nearest enclosing loop statement
        while (it) {
            if ([`do`, `for`, `while`].includes(it.str)) break;
            it = it.prev;
        }

        // Handle break statement in a do-while loop
        if (it.str == `do`) {
            while (it) {
                if (it.str == `while`) break;
                it = it.next;
            }
        }

        // Find the end of the loop statement
        if (it.next.str == `(`) {
            let ref0 = expr.match(it.next);
            if (ref0.back.next.str == `{`) {
                ref0 = expr.match(ref0.back.next);
            }
            it = ref0.back;

            // Skip the semicolon if present
            if (it.next && it.next.str == `;`) it = it.next;
        }
        rpl = `${it.str}\n@${name};`;
    }
    else if (tok.str === `continue`) {
        // Find the nearest enclosing loop statement
        while (it && ![`do`, `for`, `while`].includes(it.str)) it = it.prev;

        // Handle continue statement in a loop with parentheses
        if (it.next.str == `(`) it = expr.match(it.next).back;

        // Handle continue statement in a loop with braces
        if (it.next.str == `{`) it = expr.match(it.next).back;
        else {
            message.add(new message(message.SYNTAX_ERROR, `Declaration requires a new scope -- use { and }`, tok.next.loc));
            return new token();
        }
        rpl = `@${name};\n${it.str}`;
    }

    // Replace the break or continue statement with the equivalent LSL code
    source.replace(it, it, new tokens(rpl));
    tok = source.replace(tok, tok, new tokens(`jump ${name}`));
    return tok;
};

/**
 * Converts the given source code tokens to LSL (Linden Scripting Language) tokens.
 *
 * @param {tokens} source - The source code tokens to be converted.
 * @returns {Promise<tokens>} - A Promise that resolves with the converted LSL tokens.
 */
export const convert_to_lsl = async (source) => {

    const kind = kind_of(source);
    if(kind !== `tokens` && kind !== `expr`) throw new type_error(`source must be a expression. ${kind}`);
    // Load the language specification
    await load_spec();

    // Iterate through each token in the source code
    for (let tok = source.front; source.end(tok); tok = source.next(tok)) {

        // Handle non-ASCII characters in token strings
        if (!ASCII_exp.test(tok.str) && !(tok.flag & flag.STRING_FLAG)) {
            tok = handle_non_ascii(tok, source);
            continue;
        }

        // Handle string literals in token strings
        if (tok.flag & flag.STRING_FLAG) {
            tok = handle_string_flag(tok, source);
        }
        // Handle symbol flags in tokens
        else if (tok.flag & flag.SYMBOL_FLAG) {
            tok = handle_symbol_flag(tok, source);
        }
        // Handle number flags in tokens
        else if (tok.flag & flag.NUMBER_FLAG) {
            tok = handle_number_flag(tok);
        }
        // Handle NAME_FLAG tokens
        else if (tok.flag & flag.NAME_FLAG) {
            tok = await handle_name_flag(tok, source);
        }
    }
    // Return the converted LSL tokens
    return source;
};
