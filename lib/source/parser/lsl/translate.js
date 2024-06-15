import { flag } from "../../../global.js";
import { numb } from '../../../math/number.js';
import { ASCII_exp, infinity_regexp } from "../../../text/regex.js";
import { string } from "../../../text/string.js";
import { expr } from "../../expressions.js";
import { message } from "../../message.js";
import { tokens } from "../../tokens.js";
import { llop } from "../llop.js";
import { load_spec, spec } from "../lsl_spec.js";

export const lsl_symbol_exp = RegExp(`^[@;\\{\\}\\[\\]\\(\\)<>!~+\\-\\*/%=&:\\.\\^,|]{1,3}$`);

export const convert_to_lsl = async source => {
    await load_spec();

    for (let tok = source.front; source.end(tok); tok = source.next(tok)) {
        //console.log(tok.str, flag.to_string(tok.flag));

        if (!ASCII_exp.test(tok.str) && !(tok.flag & flag.STRING_FLAG)) {
            //console.log(tok.str, flag.to_string(tok.flag));
            message.add(new message(message.WARNING, `Name ${tok.str} contain non ASCII char and will be interpreted as white space by the compiler.`, tok.next.loc));

            let next = (tok.prev) ? tok.prev : source.front;
            if (tok.str == tok.op) source.delete_tokens(tok, tok);
            else {
                let str = ``;
                for (const code of tok.str)
                    str += (code.codePointAt(0) < 0x7F) ? code : " ";
                source.replace(tok, tok, new tokens(str, tok.loc));
            }
            tok = next;
            continue;
        }

        if (tok.flag & flag.STRING_FLAG) {

            // https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API
            if (!tok.str.startsWith(`"`)) {
                let index = tok.str.indexOf(`"`);
                let prefix = tok.str.substring(0, index);
                if (!string.is_literal_prefix(prefix)) {
                    console.log(tok.str);
                    message.add(new message(message.SYNTAX_ERROR, `Unknow string literal prefix: ${prefix}`, tok.next.loc));
                    return new tokens();
                }

                let raw = tok.str.substring(index + 1, tok.str.length - 1);

                switch (prefix) {

                    case `u8`: {
                        let raw_arr = [];
                        for (const code of raw)
                            raw_arr.push(code.codePointAt(0));

                        let bytes = raw_arr.length + (raw_arr.length % 4);
                        const view = new DataView(new ArrayBuffer(bytes));

                        for (let i = 0; i < raw_arr.length; i++)
                            view.setUint8(i, raw_arr[i]);
                        raw_arr = new Uint16Array(view.buffer);

                        tok.str = `"${new TextDecoder(`utf-16be`, { "byteOrderMark": false }).decode(raw_arr)}"`;
                    } break;

                    case `U`: case `L`: {
                        let raw_arr = [];
                        for (const code of raw)
                            raw_arr.push(code.codePointAt(0));

                        const view = new DataView(new ArrayBuffer((raw_arr.length * 4)));
                        for (let i = 0; i < raw_arr.length; i++)
                            view.setUint32(i * 4, raw_arr[i]);

                        raw_arr = new Uint16Array(view.buffer);
                        tok.str = `"${new TextDecoder(`utf-16be`, { "byteOrderMark": false }).decode(raw_arr)}"`;
                    } break;

                    default: {
                        tok.str = `"${raw}"`;
                    } break;
                }
                //console.log(tok.str);
            }

            if (tok.prev && (tok.prev.flag & flag.STRING_FLAG)) {
                tok.str = `"${tok.prev.str.substring(1, tok.prev.str.length - 1) + tok.str.substring(1, tok.str.length - 1)}"`;
                tok.flag |= flag.STRING_FLAG;
                source.delete_token(tok.prev);
            }

            if (!tok.str.startsWith(`"`)) {
                tok.str = `"${tok.str.substring(1, tok.str.length - 1)}"`;
            }


            tok.flag |= flag.STRING_FLAG;
        }
        else if (tok.flag & flag.SYMBOL_FLAG) {
            //if (tok.op === `-`) {
            //    console.log(llop.is_neg_op(tok));
            //    console.log(flag.to_string(tok.prev.flag));
            //}

            if (llop.is_neg_op(tok) && tok.next && tok.next.flag & flag.NUMBER_FLAG) {
                //console.log(`here`);
                tok.str = `-${tok.next.str}`;
                source.delete_token(tok.next);
            }
            else if (!lsl_symbol_exp.test(tok.str)) {
                // string #version="2.2p04";default{state_entry(){llOwnerSay(version);}}
                tok = source.delete_tokens(tok, tok);
            }

        }
        else if (tok.flag & flag.NUMBER_FLAG) {
            //console.trace(tok.str);
            if (string.is_oct(tok.str)) {
                tok.str = `${numb.parseInt(tok.str, 8)}`;
            }
            else if (string.is_float(tok.str) && !infinity_regexp.test(tok.str)) {
                
                tok.str = tok.str.replace(/(f|l|fl)$/, ``);
            }
            else if (string.is_hex(tok.str)) {
                let val = numb.parseInt(tok.str, 16);
                tok.str = `0x${(val >>> 0).toString(16).toUpperCase()}`;
            }
            else if (string.is_bin(tok.str)) {
                let str = tok.str.substring(2).replace(`'`, ``);
                tok.str = `${numb.parseInt(str, 2)}`;
            }
        }
        else if (tok.flag & flag.NAME_FLAG) {

            if (spec.constants[tok.str]) {
                let obj = spec.constants[tok.str];

                let toks0;
                if (obj.type == `string` && !(obj.value.startsWith(`"`)))
                    toks0 = new tokens(`"${obj.value}"`);
                else
                    toks0 = new tokens(obj.value);

                //console.log(toks0.stringify());
                await convert_to_lsl(toks0);
                tok = source.replace(tok, tok, toks0);
            }
            else if (tok.prev && tok.next && tok.prev.op == `(` && tok.next.op == `)` && spec.type.includes(tok.str)) {
                tok.str = `(${tok.str})`;
                tok.flag |= flag.CASTING_FLAG;
                tok.loc = tok.prev.loc;

                source.delete_token(tok.prev);
                source.delete_token(tok.next);
            }
            else if (tok.str == `break`) {

                let it = tok;
                while (it) {
                    if ([`do`, `for`, `while`].includes(it.str)) break;
                    it = it.prev;
                }

                if (it.str == `do`) {
                    while (it) {
                        if (it.str == `while`) break;
                        it = it.next;
                    }
                }

                if (it.next.str == `(`) {
                    let ref0 = expr.match(it.next);
                    if (ref0._last.next.str == `{`) {
                        ref0 = expr.match(ref0._last.next);
                    }
                    it = ref0._last;

                    if (it.next && it.next.str == `;`)
                        it = it.next;
                }

                let name = string.uid();
                source.replace(it, it, new tokens(`${it.str}\n@${name};`));
                tok = source.replace(tok, tok, new tokens(`jump ${name}`));
            }
            else if (tok.str == `continue`) {

                let it = tok;
                while (it && ![`do`, `for`, `while`].includes(it.str))
                    it = it.prev;

                if (it.next.str == `(`)
                    it = expr.match(it.next)._last;

                if (it.next.str == `{`)
                    it = expr.match(it.next)._last;
                else {
                    message.add(new message(message.SYNTAX_ERROR, `Declaration requires a new scope -- use { and }`, tok.next.loc));
                    return new tokens();
                }

                let name = string.uid();
                source.replace(it, it, new tokens(`@${name};\n${it.str}`));
                tok = source.replace(tok, tok, new tokens(`jump ${name}`));
            }

        }
    }
    return source;
}