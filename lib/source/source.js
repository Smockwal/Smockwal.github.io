import { error } from "../error.js";
import { kind_of } from "../global.js";
import { message } from "./message.js";

export var SCOPE_GLOBAL = `gl`;
export var SCOPE_STATE = `st`;
export var SCOPE_FUNC = `fn`;
export var ANON_NAME = `an`;

export const find_inst = (arr, tok) => {
    let candidates = [];

    for (let i = arr.length; i--;) {
        if (arr[i].name != tok.str) continue;

        if ((tok.scope.startsWith(arr[i].scope + "/") || tok.scope == arr[i].scope) && tok.scope[arr[i].scope.length] != `_`)
            candidates.push(i);
    }

    if (candidates.length == 0) 
        return undefined;

    let best = arr[candidates[0]];
    for (const index of candidates)
        if (arr[index].scope.length > best.scope.length)
            best = arr[index];

    return best;
}

export class source {
    #vars = [];
    #funcs = [];
    #labs = [];
    #scp_deep = 0;

    /**
     * Parses the source code tokens.
     * @param {tokens} toks - The source code tokens to be parsed.
     * @throws {error} - Throws an error if the input tokens are empty.
     * @returns {tokens} - The parsed tokens after processing.
     */
    parse_src(toks) {
        if (kind_of(toks) !== `tokens`) throw new error(`function call on empty tokens.`);

        this.clear();

        this.flag_tokens(toks);
        if (message.has_error()) return console.trace(toks);

        this.parse_scope(toks, [SCOPE_GLOBAL]);
        if (message.has_error()) return console.trace(toks);

        this.collect_name(toks);
        if (message.has_error()) return console.trace(toks);

        return toks;
    }

    /**
     * Flags the tokens based on certain conditions.
     * This is a virtual function and should be overridden in the derived classes.
     * @param {tokens} toks - The source code tokens to be flagged.
     * @throws {error} - Throws an error if the function is not overridden in the derived class.
     */
    flag_tokens(toks) {  throw new error(`virtual function call.`); }

    /**
     * Parses the scope of the source code tokens based on the given scope array.
     * This is a virtual function and should be overridden in the derived classes.
     * @param {tokens} toks - The source code tokens to be parsed.
     * @param {Array} scp - The array representing the scope of the source code tokens.
     * @throws {error} - Throws an error if the function is not overridden in the derived class.
     */
    parse_scope(toks, scp) { throw new error(`virtual function call.`); }

    /**
     * Collects names from the source code tokens.
     * This is a virtual function and should be overridden in the derived classes.
     * @param {tokens} toks - The source code tokens from which names are to be collected.
     * @throws {error} - Throws an error if the function is not overridden in the derived class.
     */
    collect_name(toks) { throw new error(`virtual function call.`); }

    /**
     * Clears the internal state of the source object.
     * @param {tokens} toks - The source code tokens to be cleared.
     * @returns {void}
     */
    clear(toks) {
        this.#scp_deep = 0;
        this.#vars = [];
        this.#funcs = [];
        this.#labs = [];
    }
};



export var src = new source();
export const set_source = obj => src = obj;
