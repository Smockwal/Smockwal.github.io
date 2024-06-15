import { array } from "../array.js";
import { error, type_error } from "../error.js";
import { kind_of, type_of } from "../global.js";
import { uri_sep_exp } from "../text/regex.js";
import { string } from "../text/string.js";

const HAS_FILE_NAME = 1;
const HAS_DIR = 2;
const IS_DIR = 4;

/**
 * A class representing a Uniform Resource Identifier (URI).
 */
export class uri {
    #flags = 0;
    #cmp = [];
    #params = new Map();

    /**
     * Constructs a new uri object.
     * @param {string} str - The string to be parsed into a URI.
     * @throws {type_error} If the input is not a string.
     * @throws {error} If the input string is empty.
     */
    constructor(path) {
        if (kind_of(path) === `uri`) path = path.path;
        if (type_of(path) !== 'string') throw new type_error(`uri must be a string.`);
        if (string.empty(path)) throw new error(`uri must not be empty.`);

        path = string.uri_unescape(path);

        let base = ``, params = ``;
        [base, params] = path.split(`/?`);

        this.#cmp = base.split(uri_sep_exp).filter(x => !string.empty(x) && x !== `.`);
        this.#flags = (array.last(this.#cmp).includes(`.`)) ? HAS_FILE_NAME : IS_DIR;
        if (this.#cmp.length > 1) this.#flags |= HAS_DIR;

        if (params && !string.empty(params)) {
            const sp = [];
            for (const entry of params.split(`&`))
                sp.push(entry.split(`=`));
            this.#params = new Map(sp);
        }
    };

    static get HAS_FILE_NAME() { return HAS_FILE_NAME; };
    static get HAS_DIR() { return HAS_DIR; };
    static get IS_DIR() { return IS_DIR; };

    get kind() { return `uri`; };

    /**
     * Returns the full path of the URI.
     * @returns {string} The full path of the URI.
     */
    get path() {
        return `${this.#cmp.join(`/`)}${(this.#flags & HAS_FILE_NAME) ? `` : `/`}`;
    };

    /**
     * Returns the name of the file without the extension.
     * @throws {error} If the URI is not a file.
     * @returns {string} The name of the file.
     */
    get file_name() {
        if (this.#flags & IS_DIR) throw new error(`The uri is not a file.`);
        const str = array.last(this.#cmp);
        return str.substr(0, str.lastIndexOf(`.`));
    };

    /**
     * Returns the full name of the file including the extension.
     * @throws {error} If the URI is not a file.
     * @returns {string} The full name of the file.
     */
    get file_full_name() {
        if (this.#flags & IS_DIR) throw new error(`The uri is not a file: "${this.path}"`);
        return array.last(this.#cmp);
    }

    /**
     * Returns the name of the directory.
     * @throws {error} If the URI has no directory.
     * @returns {string} The name of the directory.
     */
    get dir_name() {
        if ((this.#flags & HAS_DIR) !== 2) throw new error(`The uri has no directory.`);
        const offset = (this.#flags & HAS_FILE_NAME) ? 2 : 1;
        return this.#cmp[this.#cmp.length - offset];
    }

    /**
     * Returns the path of the directory.
     * @throws {error} If the URI has no directory.
     * @returns {string} The path of the directory.
     */
    get dir_path() {
        if ((this.#flags & HAS_DIR) !== HAS_DIR) throw new error(`The uri has no directory.`);
        const offset = (this.#flags & HAS_FILE_NAME) ? 1 : 0;
        return `${this.#cmp.slice(0, this.#cmp.length - offset).join(`/`)}/`;
    };

    /**
     * Returns the extension of the file.
     * @throws {error} If the URI is not a file.
     * @returns {string} The extension of the file.
     */
    get ext() {
        if ((this.#flags & HAS_FILE_NAME) !== HAS_FILE_NAME) throw new error(`The uri is not a file.`);
        const str = array.last(this.#cmp);
        return str.substr(str.lastIndexOf(`.`));
    };

    get flags() { return this.#flags; };
    get is_file() { return (this.#flags & HAS_FILE_NAME) === HAS_FILE_NAME; };

    static is_file_name(path) {
        return array.last(path.split(uri_sep_exp).filter(x => !string.empty(x))).includes(`.`);
    };

    /**
     * Returns the standardized path of the input string.
     * @param {string} path - The string to be standardized.
     * @throws {type_error} If the input is not a string.
     * @returns {string} The standardized path.
     */
    static std(path) {
        if (type_of(path) !== 'string') throw new type_error(`path must be a string.`);
        return new uri(path).path;
    };

    static encoded(path) {
        if (type_of(path) !== 'string') throw new type_error(`path must be a string.`);
        return string.uri_escape(new uri(path).path);
    };

    is(path) {

    };
};
