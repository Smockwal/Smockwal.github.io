import { flag } from "../global.js";
import { char } from "../text/char.js";
import { token } from "./token.js";



export class operator {
    /**
     * Checks if the given token represents a negative operator.
     * @param {token} tok - The token to be checked.
     * @returns {boolean} - Returns true if the token represents a negative operator, otherwise false.
     */
    static is_neg_op(tok) {
        if (!tok || tok.op != `-`) return false;
        if (!tok.prev) return true;
        if (tok.prev.op == `)` || tok.prev.flag & (flag.VECTOR_CL_FLAG | flag.QUAT_CL_FLAG)) return false;
        return !!(tok.prev.flag & (flag.SYMBOL_FLAG | flag.CASTING_FLAG | flag.CONTROL_FLAG));
    };

    /**
     * Checks if the given token represents a unary operator.
     * @param {token} tok - The token to be checked.
     * @returns {boolean} - Returns true if the token represents a unary operator, otherwise false.
     */
    static is_unary_op(tok) {
        if (!tok || !char.is_one_of(tok.op, `!~-`)) return false;
        return tok.op !== '-' || operator.is_neg_op(tok);
    };

    /**
     * Skips unary operators in the specified direction from the given token.
     * @param {token} tok - The token from which to start skipping unary operators.
     * @param {string} dir - The direction in which to skip unary operators. Can be 'fwd' for forward or 'bwd' for backward.
     * @returns {token} - Returns the token after skipping unary operators in the specified direction.
     */
    static skip_unary_op(tok, dir = `fwd`) {
        if (!operator.is_unary_op(tok)) return tok;

        let it = tok;
        switch (dir) {
            case `fwd`: {
                while (it.next && operator.is_unary_op(it.next))
                    it = it.next;
            } break;

            case `bwd`: {
                while (it.prev && operator.is_unary_op(it.prev))
                    it = it.prev;
            } break;

            default: break;
        }

        return it;
    }

};