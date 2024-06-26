import { type_error } from "../../../error.js";
import { kind_of } from "../../../global.js";


export class component {
    #tok;
    #altn = ``;

    constructor(tok) {
        if (kind_of(tok) !== `token`) throw new type_error(`value is not a token.`);
        this.#tok = tok;
    }

    get altn() { return this.#altn; };
    set altn(altn) {
        if (kind_of(altn) !== `string`) throw new type_error(`value is not a string.`);
        this.#altn = altn;
    }

    /** @returns {token} */
    get tok() { return this.#tok; }

    /** @returns {String} */
    get name() { return this.#tok.str; }

    /** @returns {String} */
    get scope() { return this.#tok.scope; }
}