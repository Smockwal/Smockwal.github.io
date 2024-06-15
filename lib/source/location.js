import { type_error } from "../error.js";
import { kind_of } from "../global.js";
import { uri } from "../system/uri.js";
import { uris } from "../system/uris.js";
import { string } from "../text/string.js";

/**
 * Location class to manage file, line, and column information.
 */
export class location {
    #file = -1;
    #line = 1;
    #col = 0;

    /**
     * @param {location|number|string} file - The file, line, or another location.
     * @param {number} [line] - The line number.
     * @param {number} [column] - The column number.
     */
    constructor(file, line, column) {
        if (kind_of(file) === `location` || (file && file.file)) {
            this.file = file.file;
            this.line = file.line;
            this.col = file.col;
        } else {
            if (kind_of(file) === `number`) {
                this.file = file;
            } 
            else if (kind_of(file) === `string`) {
                this.file = uris.add(file);
            }

            if (line) this.line = line;
            if (column) this.col = column;
        }
    };

    get kind() { return `location`; };

    /** @returns {number} */
    get file() { return this.#file; };

    /** @param {number|string} x */
    set file(x) {
        if (kind_of(x) === `string`) {
            if (!uri.is_file_name(x)) throw new type_error(`file must be a file name.`);
            this.#file = uris.add(x);
        }
        else if (kind_of(x) === `number`) {
            this.#file = x;
        }
        else throw new type_error(`location.file = ${x}: call on type: ${kind_of(x)}`);
    };

    /** @returns {number} */
    get line() { return this.#line; };

    /** @param {number} x */
    set line(x) {
        if (kind_of(x) !== `number`) throw new type_error(`location.line = ${x}: call on type: ${kind_of(x)}`);
        this.#line = x;
    };

    /** @returns {number} */
    get col() { return this.#col; };

    /** @param {number} x */
    set col(x) {
        if (kind_of(x) !== `number`) throw new type_error(`location.col = ${x}: call on type: ${kind_of(x)}`);
        this.#col = x;
    };

    /**
     * Compares the current location with another location.
     * @param {location} oth - The location to compare with.
     * @returns {boolean} - True if the current location is less than the provided location, otherwise false.
     */
    is_less_than(oth) {
        if (this.#file !== oth.file) return this.#file < oth.file;
        if (this.#line !== oth.line) return this.#line < oth.line;
        return this.#col < oth.col;
    };

    /**
     * Checks if the current location and the provided location are on the same line.
     * @param {location} oth - The location to compare with.
     * @returns {boolean} - True if they are on the same line, otherwise false.
     */
    same_line(oth) { return this.#file === oth.file && this.#line === oth.line; };

    /**
     * Adjusts the current location based on the provided string.
     * @param {string} str - The string to adjust by.
     * @returns {location} - The adjusted location.
     */
    adjust(str) {
        if (kind_of(str) !== `string`) {
            throw new type_error(`location.adjust(${str}): call on type: ${kind_of(str)}`);
        }
        if (string.empty(str)) return this;

        for (let i = 0; i < str.length; ++i) {
            this.#col++;
            if (str[i] === `\n`) {
                this.#col = 1;
                this.#line++;
            }
        }
        return this;
    };

    /**
     * Returns a string representation of the location.
     * @returns {string} - A string representation of the location.
     */
    str() {
        let ret = ``;
        if (this.#file !== -1)
            ret = `"${new uri(uris.uri(this.#file)).file_full_name}":`;

        ret = `#${string.empty(ret) ? `line` : `file`} ${ret}${this.#line}`;
        ret += this.#col ? `:${this.#col}` : ``;
        return ret;
    };

    /**
     * Sets the file, line, and column of the location based on another location.
     * @param {location} loc - The location object containing file, line, and column information.
     */
    line_directive(loc) {
        if (kind_of(loc) !== `location`) throw new type_error(`location.line_directive(loc): call on type: "${kind_of(loc)}"`);
        if (loc.file) this.file = loc.file;
        this.line = loc.line || 1;
        this.col = loc.col || 0;
    };

    /**
     * Compares the current location with another location for equality.
     * @param {location} loc - The location to compare with.
     * @returns {boolean} - True if they are equal, otherwise false.
     */
    is(loc) {
        return this.file === loc.file &&
            this.line === loc.line &&
            this.col === loc.col;
    };
};
