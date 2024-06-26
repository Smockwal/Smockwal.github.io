import { flag } from "../../../global.js";
import { char } from "../../../text/char.js";
import { string } from "../../../text/string.js";
import { expr } from "../../expressions.js";
import { options, opts } from "../../options.js";
import { llop } from "./llop.js";


var indent = ``;

/**
 * @param {String} sp 
 * @param {Number} dir 
 * @returns {String}
 */
const itident = (sp, dir) => {
    if (dir > 0) sp += indent.repeat(dir);
    else sp = sp.substring(0, sp.length - (indent.length * -dir));
    if (string.empty(sp)) sp = `\n`;
    return sp;
}

const allman_format = async src => {

}

/**
 * @param {tokens} toks 
 * @returns {String}
 */
export const k_r_format = async toks => {
    //console.log(`k_r_format`);

    let sout = `\n`, sp = `\n`, in_for = false, single = false;

    for (let tok = toks.front; toks.end(tok); tok = toks.next(tok)) {
        //if (tok.op === `,`) console.log(flag.to_string(tok.flag))
        //console.log(`str: `, tok.str, `flag: `, flag.to_string(tok.flag), `sp: `, `"${string.c_escape(sp)}"`, `scope: `, tok.scope);
        if (tok.flag & flag.EOL_FLAG) {
            if (in_for) {
                sout += `${tok.op} `;
                continue;
            }
            else if (single) {
                single = false;
                sp = itident(String(sp), -1);
            }
            if (tok.next && tok.next.op === `}`)
                sp = itident(String(sp), -1);
            sout += `${tok.str}${sp}`;
        }
        else if (tok.flag & (flag.TYPE_FLAG | flag.STATE_NAME_FLAG)) {
            sout += `${tok.str} `;
        }
        else if (tok.flag & flag.OPERATOR_FLAG) {
            if (llop.is_unary_op(tok) || [`++`, `--`].includes(tok.str)) sout += tok.str;
            else sout += ` ${tok.str} `;
        }
        else if (tok.flag & flag.CONTROL_FLAG) {
            if (tok.str === `for`) in_for = true;
            else if (tok.str === `else` && ![`;`, `if`, `{`].includes(tok.next.str)) {
                sp = itident(String(sp), 1);
                sout += `${tok.str}${sp}`;
                single = true;
                continue;
            }

            sout += `${tok.str} `;
        }
        else if (tok.flag & flag.DEL_FLAG) {

            if (tok.op === `)`) {
                const exp = expr.match(tok);
                if (exp.front && exp.front.prev && exp.front.prev.str === `for`) in_for = false;
                if (exp.front.prev && [`if`, `while`, `for`].includes(exp.front.prev.str)) {
                    if (!char.is_one_of(tok.next.op, `;{`)) {
                        sp = itident(String(sp), 1);
                        sout += `${tok.str}${sp}`;
                        single = true;
                        continue;
                    }
                }
            }

            if (tok.op === `{`) {
                if (tok.next && tok.next.op !== `}`) {
                    sp = itident(String(sp), 1);
                }
                sout += ` ${tok.str}${sp}`;
                if (tok.next && tok.next.op === `}`) {
                    sout += sp;
                }
            }
            else if (tok.op === `}`) {
                if (tok.next && tok.next.str === `}`) 
                    sp = itident(String(sp), -1);
                sout += `${tok.str}${sp}`;
                //if (tok.next && tok.next.op !== `}`) sout += `\n`;
            }
            else sout += tok.str;

        }
        else if (tok.flag & flag.SYMBOL_FLAG) {
            if (tok.op === `,`) sout += `${tok.str} `;
            else sout += tok.str;
        }
        else sout += tok.str;

    }

    return sout;
}

/**
 * @param {tokens} src 
 * @returns {String}
 */
export const formatter = async src => {

    //console.log(`formator space: ${options.get(opts.FORMATTER, `space`)}`);
    switch (options.get(opts.FORMATTER, `space`)) {
        case 0: indent = ` `; break;
        case 1: indent = `  `; break;
        case 2: indent = `    `; break;
        case 3: default: indent = `\t`; break;
    }

    //console.log(`formator style: ${options.get(opts.FORMATTER, `style`)}`);
    switch (options.get(opts.FORMATTER, `style`)) {
        case 0: return allman_format(src);
        case 1: return k_r_format(src);
        default: return src.str;
    }

}