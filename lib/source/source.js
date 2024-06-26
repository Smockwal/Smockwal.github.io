import { error } from "../error.js";
import { kind_of } from "../global.js";
import { message } from "./message.js";

export var SCOPE_GLOBAL = `gl`;
export var SCOPE_STATE = `st`;
export var SCOPE_FUNC = `fn`;
export var ANON_NAME = `an`;

/**
 * Find the best match instance in an array based on the provided token.
 * @param {Array} arr - The array of objects to search through.
 * @param {token} tok - The token containing the name and scope to match.
 * @returns {Object|undefined} - The best match object or undefined if no match is found.
 */
export const find_inst = (arr, tok) => {
    // Filter candidates that match the token's name and scope.
    const candidates = arr
        .map((item, index) => ({ item, index }))
        .filter(({ item }) =>
            item.name === tok.str &&
            (tok.scope.startsWith(`${item.scope}/`) || tok.scope === item.scope) &&
            tok.scope[item.scope.length] !== '_'
        );
        
    // If no candidates are found, return undefined.
    if (candidates.length === 0) {
        return undefined;
    }

    // Find the candidate with the longest matching scope.
    const bestCandidate = candidates.reduce((best, current) =>
        current.item.scope.length > best.item.scope.length ? current : best
    );

    // Return the best match instance.
    return bestCandidate.item;
};


export class source {
    #vars = [];
    #funcs = [];
    #labs = [];
    #scp_deep = 0;

    get vars() { return this.#vars; }
    get funcs() { return this.#funcs; }
    get labels() { return this.#labs; }


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
    flag_tokens(toks) { throw new error(`virtual function call.`); }

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
        this.#vars.length = 0;
        this.#funcs.length = 0;
        this.#labs.length = 0;
    }
};



export var src = new source();
export const set_source = obj => src = obj;
