import { range_error, type_error } from "../error.js";
import { type_of } from "../global.js";
import { string } from "./string.js";

const UTF_8 = (0x1 << 0);
const UTF_16 = (0x1 << 1);
const UTF_32 = (0x1 << 2);

export class stream {
    #str = ``;
    #pos = -1;
    #bom;

    /**
     * Creates an instance of the stream class.
     * @param {string} str - The input string for the stream.
     */
    constructor(str) {
        this.str = str.toWellFormed();
        this.#read_bom();
    };

    /** @returns {number} The current position in the stream. */
    get pos() { return this.#pos; };

    /**
     * Sets the current position in the stream.
     * @param {number} x - The new position in the stream.
     * @throws {range_error} If the position is out of bounds.
     */
    set pos(x) {
        if (x < 0 || x > this.#str.length) throw new range_error('index out of bound.');
        this.#pos = x;
    };

    /** @returns {string} The current string in the stream. */
    get str() { return this.#str; };

    /**
     * Sets a new string for the stream.
     * @param {string} x - The new string for the stream.
     * @throws {type_error} If the new value is not a string.
     */
    set str(x) {
        if (type_of(x)  !== 'string') throw new type_error('stream data must be a String.');
        this.#str = x;
        this.#pos = -1;
        this.#read_bom();
    };

    /** @returns {boolean} True if the stream is in a good state, false otherwise. */
    good() {
        return this.#pos >= -1 && !string.empty(this.#str) && this.#pos < this.#str.length;
    };

    /** Reads and removes the Byte Order Mark (BOM) from the string, if present. */
    #read_bom() {
        const bom_signatures = {
            '\uFEFF': 'UTF-8',
            '\uFFFE': 'UTF-16',
            '\u00EF\u00BB\u00BF': 'UTF-8',
            '\u00FE\u00FF': 'UTF-16BE',
            '\u00FF\u00FE': 'UTF-16LE',
            '\u0000\u0000\u00FE\u00FF': 'UTF-32BE',
            '\u00FF\u00FE\u0000\u0000': 'UTF-32LE'
        };

        for (const [signature, encoding] of Object.entries(bom_signatures)) {
            if (this.#str.startsWith(signature)) {
                this.#bom = encoding;
                this.#str = this.#str.slice(signature.length); // Remove the BOM from the data
                break;
            }
        }
    };

    /** @returns {boolean} True if the current position is at the end of the string, false otherwise. */
    at_end() {
        return this.#pos >= this.#str.length;
    };

    /**
     * Peeks at the next character in the stream without advancing the position.
     * @param {boolean} skip - Whether to skip over escape sequences.
     * @returns {string|undefined} The next character, or undefined if at the end.
     */
    peek(skip = false) {
        if (this.at_end()) return undefined;
        if (skip && this.#str[this.#pos + 1] === '\\') {
            const next_char = this.#str[this.#pos + 2];
            if (next_char === '\r' || next_char === '\n') {
                return this.#str[this.#pos + (next_char === '\r' ? 4 : 3)];
            }
        }
        return this.#str[this.#pos + 1];
    };

    /**
     * Gets the next character in the stream and advances the position.
     * @returns {string|undefined} The next character, or undefined if at the end.
     */
    get() {
        if (this.at_end()) return undefined;
        let ch = this.#str[++this.#pos];
        if (ch === '\r') {
            if (this.peek() === '\n') this.#pos++;
            ch = '\n';
        }
        return ch;
    };

    /** Moves the position one character back. */
    unget() {
        if (this.#pos > -1) this.#pos--;
    };
};


class Stream {
    #data;
    #index;
    #encoding;

    /**
     * Creates an instance of Stream.
     * @param {string} data - The initial data for the stream.
     */
    constructor(data = '') {
        this.#data = data;
        this.#index = 0;
        this.#encoding = '';
        this.#read_signature();
    }

    /**
     * Reads the BOM signature if it exists and sets the encoding.
     */
    #read_signature() {
        const bom_signatures = {
            '\u00EF\u00BB\u00BF': 'UTF-8',
            '\u00FE\u00FF': 'UTF-16BE',
            '\u00FF\u00FE': 'UTF-16LE',
            '\u0000\u0000\u00FE\u00FF': 'UTF-32BE',
            '\u00FF\u00FE\u0000\u0000': 'UTF-32LE'
        };

        for (const [signature, encoding] of Object.entries(bom_signatures)) {
            if (this.#data.startsWith(signature)) {
                this.#encoding = encoding;
                this.#data = this.#data.substring(signature.length); // Remove the BOM from the data
                break;
            }
        }
    }

    /**
     * Gets the next character based on the encoding and advances the index.
     * @returns {string|null} - The character at the current index or null if at the end of the stream.
     */
    get = () => {
        const char = this.peek();
        if (char !== null) {
            this.#index += new TextEncoder().encode(char).length;
        }
        return char;
    };

    /**
     * Puts a character at the current index and advances the index.
     * If the index is at the end, it appends the character.
     * @param {string} char - The character to put into the stream.
     */
    put = (char) => {
        if (this.#index >= this.#data.length) {
            this.#data += char;
        } else {
            this.#data = `${this.#data.substring(0, this.#index)}${char}${this.#data.substring(this.#index + new TextEncoder().encode(char).length)}`;
        }
        this.#index += new TextEncoder().encode(char).length;
    };

    /**
     * Peeks at the next character based on the encoding without advancing the index.
     * @returns {string|null} - The character at the current index or null if at the end of the stream.
     */
    peek = () => {
        if (this.#index >= this.#data.length) return null;

        switch (this.#encoding) {
            case 'UTF-8':
                return this.#data[this.#index];
            case 'UTF-16BE':
            case 'UTF-16LE':
                return this.#data.substr(this.#index, 2);
            case 'UTF-32BE':
            case 'UTF-32LE':
                return this.#data.substr(this.#index, 4);
            default:
                return this.#data[this.#index];
        }
    };

    /**
     * Gets the current index of the stream.
     * @returns {number} - The current index.
     */
    get_index = () => {
        return this.#index;
    };

    /**
     * Sets the current index of the stream.
     * @param {number} index - The new index.
     */
    set_index = (index) => {
        if (index < 0) index = 0;
        if (index > this.#data.length) index = this.#data.length;
        this.#index = index;
    };

    /**
     * Gets the detected BOM encoding.
     * @returns {string} - The detected encoding.
     */
    get_encoding = () => {
        return this.#encoding;
    };

    /**
     * Resets the stream data and index.
     * @param {string} data - The new data for the stream.
     */
    reset = (data = '') => {
        this.#data = data;
        this.#index = 0;
        this.#encoding = '';
        this.#read_signature();
    };
}

/*
// Usage example
const stream1 = new Stream('\u00EF\u00BB\u00BFhello');
console.log(stream1.get_encoding()); // 'UTF-8'
console.log(stream1.peek()); // 'h'
console.log(stream1.get()); // 'h'
stream1.put('a'); // modifies data to 'aello'
console.log(stream1.get_index()); // 2
console.log(stream1.peek()); // 'l'
console.log(stream1.get()); // 'l'
stream1.put('b'); // modifies data to 'aeblo'
console.log(stream1.get_index()); // 4
stream1.set_index(0);
console.log(stream1.peek()); // 'a'
console.log(stream1.get()); // 'a'

const stream2 = new Stream('hello');
console.log(stream2.get_encoding()); // ''
console.log(stream2.peek()); // 'h'
console.log(stream2.get()); // 'h'
*/
