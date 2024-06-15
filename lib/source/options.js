import { string } from '../text/string.js';

export class opts {
    /** @type {Map} */
    #data;

    constructor() { this.clear(); }

    /** @returns {String} */
    static get GENERAL() { return `general`; }
    /** @returns {String} */
    static get PREPRO() { return `prepro`; }
    /** @returns {String} */
    static get FORMATTER() { return `formatter`; }

    /**
     * Retrieves the value associated with the given category and name.
     *
     * @param {String} category - The category under which the option is stored.
     * @param {String} name - The name of the option.
     * @returns {String} - The value of the option, or an empty string if not found.
     */
    get(category, name) {
        if (string.empty(category) || !this.#data.has(category)) return '';
        const r = this.#data.get(category);
        return r.has(name) ? r.get(name) : '';
    }

    /**
     * Sets the value for the given category and name in the options data.
     * If the category does not exist, it creates a new entry for the category.
     *
     * @param {String} category - The category under which the option will be stored.
     * @param {String} name - The name of the option.
     * @param {*} value - The value to be set for the option.
     * @returns {opts} - The current instance of the opts class, allowing for method chaining.
     */
    set(category, name, value) {
        if (!category || string.empty(category) || string.empty(name)) return this;
        if (!this.#data.has(category)) this.#data.set(category, new Map());
        this.#data.get(category).set(name, value);
        return this;
    }

    /**
     * Checks if the given category and name exist in the options data.
     *
     * @param {String} category - The category to be checked.
     * @param {String?} name - The name to be checked within the category. Optional.
     * @returns {Boolean} - True if the category and name exist, or if only the category exists and no name is provided; otherwise, false.
     */
    has(category, name) {
        if (string.empty(category) || !this.#data.has(category)) return false;
        if (typeof name === 'undefined') return true;
        return !string.empty(name) && this.#data.get(category).has(name);
    }

    /** Clears all the options data and resets it to the initial state with empty maps for each category. */
    clear() {
        this.#data = new Map([
            [opts.GENERAL, new Map()],
            [opts.PREPRO, new Map()],
            [opts.FORMATTER, new Map()],
        ]);
    }
}

export const options = new opts();
