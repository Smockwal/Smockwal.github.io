import { type_error } from "../error.js";
import { type_of } from "../global.js";
import { numb } from "../math/number.js";
import { string } from "../text/string.js";
import { uri } from "./uri.js";

var list = [];

/**
 * @class file
 */
export class uris {

    /**
     * Finds the index of a file URI in the files list.
     *
     * @param {string} uri - The URI of the file to find.
     * @returns {number} The index of the file URI in the files list, or -1 if not found.
     */
    static index(path) {
        if (!path || string.empty(path) || list.length === 0) return -1;
        // Otherwise, find the index of the standardized URI in the files list
        return list.indexOf(uri.std(path));
    }

    /**
     * Retrieves the file URI at the specified index in the files list.
     *
     * @param {number} index - The index of the file URI to retrieve.
     * @returns {string} The file URI at the specified index, or an empty string if the index is -1.
     */
    static uri(index) {
        if (type_of(index)  !== 'number') throw new type_error('index must be a number');
        if (!numb.between(index, 0, list.length - 1)) return ``;
        return list[Math.trunc(index)];
    }

    /**
     * Checks if the standardized file URI exists in the files list.
     *
     * @param {string} uri - The URI of the file to check.
     * @returns {boolean} True if the file URI exists in the files list, otherwise false.
     */
    static contains(path) {
        if (string.empty(path)) return false; // Return false if the URI is falsy
        // Return true if the standardized URI exists in the files list
        return list.includes(uri.std(path));
    }

    /**
     * Adds a file URI to the files list if it does not already exist and returns its index.
     *
     * @param {string} uri - The URI of the file to add.
     * @returns {number} The index of the added file URI in the files list, or -1 if the URI is invalid.
     */
    static add(path) {
        // Return -1 if the URI is invalid
        if (string.empty(path)) return -1;

        // Standardize the URI
        const std_uri = uri.std(path);

        // Add the URI to the files list if it does not already exist
        if (!list.includes(std_uri))
            return list.push(std_uri) - 1;

        // Return the index of the URI in the files list
        return uris.index(std_uri);
    }

    /**
     * Clears all entries from the files list.
     * This method resets the files list to an empty array, effectively removing all previously stored file URIs.
     */
    static clear() { list = []; };
}


