
import { flag } from '../global.js';
import { char } from '../text/char.js';
import { string } from '../text/string.js';
import { expr } from './expressions.js';
import { token } from './token.js';
//import { tokens } from './tokens.js';

export class literal {
    static type_of(str) { }
}

/**
 * Adds vector or quaternion tags to the given source expression based on the specified number.
 * If the number is 3, it adds vector tags; if the number is 4, it adds quaternion tags.
 *
 * @param {expr} src - The source expression to which the tags will be added.
 * @param {Number} numb - The number specifying the type of tags to be added (3 for vector, 4 for quaternion).
 * @returns {expr} - Returns the modified source expression with added vector or quaternion tags.
 */
const add_vec_tag = (src, numb) => {
    if (numb == 3) {
        src.front.flag |= flag.VECTOR_OP_FLAG;
        src.back.flag |= flag.VECTOR_CL_FLAG;
    }
    else if (numb == 4) {
        src.front.flag |= flag.QUAT_OP_FLAG;
        src.back.flag |= flag.QUAT_CL_FLAG;
    }
    return src;
}

/**
 * This function is used to generate a vector or quaternion literal expression from a given token.
 * It checks for the opening and closing symbols of the vector or quaternion, and validates the structure.
 *
 * @param {token} tok - The token from which to start parsing the vector or quaternion literal.
 * @param {Array} [numb = [3, 4]] - An optional array specifying the number of elements for a 3D vector (3) and a 4D quaternion (4).
 * @returns {expr} - Returns an expression object representing the vector or quaternion literal if successful, or false if the structure is invalid.
 */
export const vec_gen_literal = (tok, numb = [3, 4]) => {
    if (!tok) return false;
    if (!`<>`.includes(tok.op)) return false;

    let op = tok.str, par_numb = 0;

    if (tok.op == `<` && tok.prev && /^(\))$/.test(tok.prev.str)) return false;
    let ret = new expr(tok, tok);

    if (tok.next && tok.op == `<`) {
        if (tok.prev && tok.prev.flag & (flag.NAME_FLAG | flag.NUMBER_FLAG) && tok.prev.str != `return`)
            return false;

        for (let it = tok.next; it; it = it.next) {
            if (!(it.flag & flag.SYMBOL_FLAG)) continue;
            //console.log(it.str, op, par_numb);

            if (char.is_one_of(it.op, `<>`) && it.next && it.next.flag & (flag.NAME_FLAG | flag.NUMBER_FLAG))
                continue;

            if (char.is_one_of(it.op, `([<`))
                op += it.op;

            else if (char.is_one_of(it.op, `>])`) && it.op == char.closing_char(string.last_char(op))) {
                op = op.substring(0, op.length - 1);
                if (string.empty(op) && it.op == `>`) {
                    if (numb.includes(++par_numb)) ret.back = it;
                    else return false;
                    
                    return add_vec_tag(ret, par_numb);
                }
            }
            else if (it.op == `,` && op == `<`) ++par_numb;
            else if (char.is_one_of(it.op, `;{}`)) return false;
        }
    }
    else if (tok.prev && tok.str == `>`) {

        if (tok.next && tok.next.flag & (flag.NAME_FLAG | flag.NUMBER_FLAG) && tok.next.str != `return`) {
            return false;
        }

        for (let it = tok.prev; it; it = it.prev) {
            if (!(it.flag & flag.SYMBOL_FLAG)) continue;
            

            if (char.is_one_of(it.op, `<>`) && it.prev && it.prev.flag & (flag.NAME_FLAG | flag.NUMBER_FLAG)) {
                if (it.prev.str != `return`) continue;
            }

            if (char.is_one_of(it.op, `>])`)) {
                op += it.op;
            }
            else if (char.is_one_of(it.op, `([<`) && it.op == char.opening_char(string.last_char(op))) {
                
                op = op.substring(0, op.length - 1);
                if (string.empty(op) && it.op == `<`) {
                    if (numb.includes(++par_numb)) ret.front = it;
                    else return false;
                    //console.log(it.str, op, par_numb);
                    return add_vec_tag(ret, par_numb);
                }
            }
            else if (it.op == `,` && op == `>`) ++par_numb;
            else if (char.is_one_of(it.op, `;{}`)) return false;


        }
    }

    return false;
}

/**
 * This function is responsible for generating an array literal expression from a given token.
 * It checks for the opening and closing symbols of the array, and validates the structure.
 *
 * @param {token} tok - The token representing the array literal to be parsed.
 * @returns {expr} - Returns an expression object representing the array literal if successful, or false if the structure is invalid.
 */
export const array_literal = tok => {
    if (!tok || !char.is_one_of(tok.op, `[]`)) return false;

    //console.trace(tok);
    let ret = expr.match(tok);
    //console.log(ret);
    if (ret.front.is(ret.back)) return false;

    ret.front.flag |= flag.LIST_OP_FLAG;
    ret.back.flag |= flag.LIST_CL_FLAG;
    return ret;
}


