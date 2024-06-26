import { type_error } from '../../../error.js';
import { kind_of } from '../../../global.js';
import { SCOPE_FUNC, SCOPE_GLOBAL, SCOPE_STATE } from '../../source.js';
import { component } from "./component.js";

/**
 * Finds the scope of a label based on the given token.
 * @param {Object} tok - The token object containing the scope information.
 * @returns {string} - The scope of the label.
 */
const find_label_scope = tok => {
    const cut = tok.scope.split(`/`);
    if (tok.scope.startsWith(`${SCOPE_GLOBAL}/${SCOPE_FUNC}`))
        return cut.slice(0, 2).join(`/`);
    else if (tok.scope.startsWith(`${SCOPE_GLOBAL}/${SCOPE_STATE}`))
        return cut.slice(0, 3).join(`/`);
    return ``;
}

export class lllabel extends component {
    #scp = ``;

    constructor(tok) {
        super(tok);
        this.#scp = find_label_scope(tok);
    }

    get scope() { return this.#scp; }
    set scope(x) {
        if (kind_of(x) !== `string`) throw new type_error(`scope reach is not a string.`);
        return this.#scp = x;
    }
}
