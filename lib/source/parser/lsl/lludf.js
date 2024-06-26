import { component } from "./component.js";
import { func } from "../../function.js";

export class lludf extends component {
    #type = `void`;

    constructor(tok) {
        super(tok);
        this.#type = new func(tok).type;
    }

    get kind() { return `lludf` };

    /** @returns {String} */
    get type() { return this.#type; }
}