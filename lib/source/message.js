
import { range_error, type_error } from "../error.js";
import { kind_of } from "../global.js";
import { location } from "./location.js";

var messages = [];

export class message {
    #type = message.ERROR;
    #loc = new location();
    #msg = ``;

    constructor(type, msg, loc) {
        this.type = type;
        this.msg = msg;
        this.loc = new location(loc);
    };

    get kind() { return `message`; };

    static get ERROR() { return 1 << 0; };
    static get WARNING() { return 1 << 1; };
    static get MISSING_HEADER() { return 1 << 2; };
    static get INCLUDE_NESTED_TOO_DEEPLY() { return 1 << 3; };
    static get SYNTAX_ERROR() { return 1 << 4; };
    static get PORTABILITY_BACKSLASH() { return 1 << 5; };
    static get UNHANDLED_CHAR_ERROR() { return 1 << 6; };
    static get EXPLICIT_INCLUDE_NOT_FOUND() { return 1 << 7; };

    get type() { return this.#type; };
    get loc() { return this.#loc; };
    get msg() { return this.#msg; };

    set type(x) {
        if (kind_of(x) !== "number") throw new type_error("type must be a number");
        this.#type = x;
    };
    set loc(x) {
        if (kind_of(x) !== `location`) throw new type_error("loc must be of type location");
        this.#loc = new location(x);
    };
    set msg(x) {
        if (kind_of(x) !== "string") throw new type_error("msg must be a string");
        this.#msg = x;
    };

    /**
     * Returns a string representation of the message, including its type, content, and location.
     * @returns {string} A string representing the message, including its type, content, and location.
     */
    str() {
        const type_map = {
            [message.ERROR]: "Error",
            [message.WARNING]: "Warning",
            [message.MISSING_HEADER]: "Missing header",
            [message.INCLUDE_NESTED_TOO_DEEPLY]: "Include nested too deeply",
            [message.SYNTAX_ERROR]: "Syntax error",
            [message.PORTABILITY_BACKSLASH]: "Portability backslash",
            [message.UNHANDLED_CHAR_ERROR]: "Unhandled char error",
            [message.EXPLICIT_INCLUDE_NOT_FOUND]: "Explicit include not found"
        };

        const type_string = type_map[this.type] || "Unknown";
        return `${type_string}: ${this.msg} ${this.#loc.str()}`;
    };

    /**
     * Adds a message to the internal message collection.
     * @param {message} msg - The message to be added to the collection.
     */
    static add(msg) {
        if (kind_of(msg) !== `message`) throw new type_error("msg must be an instance of message");
        messages.push(msg);
    };

    /**
     * Retrieves the message at the specified index from the internal message collection.
     * @param {number} index - The index of the message to retrieve.
     * @returns {message} The message at the specified index.
     */
    static at(index) {
        if (index < 0 || index >= messages.length) throw new range_error("index out of range");
        return messages[index];
    };

    /**
     * Checks if there is an error message in the internal message collection.
     * @returns {boolean} True if there is an error message, otherwise false.
     */
    static has_error() {
        if (messages.length === 0) return false;
        return messages.some(msg => !(msg.type & message.WARNING));
    };

    /**
     * Retrieves the number of messages in the internal message collection.
     * @returns {number} The number of messages in the internal message collection.
     */
    static length() { return messages.length; };

    /**
     * Prints the message to the console, using console.error for error messages and console.warn for warning messages.
     */
    print() {
        const log_method = this.#type === message.WARNING ? console.warn : console.error;
        log_method(this.str());
    };

    /**
     * Prints all messages in the internal message collection to the console, using console.error for error messages and console.warn for warning messages.
     */
    static print() { messages.forEach(msg => msg.print()); };

    /**
     * Clears the internal message collection by removing all messages.
     */
    static clear() { messages.length = 0; };
};
