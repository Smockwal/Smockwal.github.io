import { type_error } from "../../../error.js";
import { kind_of } from "../../../global.js";
import { component } from "./component.js";


export class llstate extends component {
    #events = [];

    constructor(tok) {
        super(tok);
    }

    get kind() { return `llstate`; }

    get scope() { return `gl`; }
    get events() { return this.#events; }

    /**
     * Checks if the llstate instance has a specific event.
     * @param {string} x - The event to check.
     * @returns {boolean} - Returns true if the event exists, false otherwise.
     * @throws {type_error} - Throws a TypeError if the provided value is not a string.
     */
    has_event(x) {
        if (kind_of(x) !== `string`) throw new type_error(`value is not a string.`);
        return this.#events.includes(x);
    }

    /**
     * Adds an event to the llstate instance.
     * @param {string} x - The event to add.
     * @returns {number} - Returns the new length of the events array.
     * @throws {type_error} - Throws a TypeError if the provided value is not a string.
     */
    add_event(x) {
        if (kind_of(x) !== `string`) throw new type_error(`value is not a string.`);
        return this.#events.push(x);
    }
}