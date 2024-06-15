
import { numb } from './math/number.js';

/**
 * @class array
 */
export class array {

    /**
     * Checks if the given argument is an array or array-like object.
     * 
     * @param {*} arg - The object to test.
     * @returns {boolean} - True if the object is an array or array-like, false otherwise.
     */
    static is_array(arg) {
        //console.trace(Object.prototype.toString.call(arg));
        return (
            Object.prototype.toString.call(arg) === '[object Array]' || // Check if it's an array
            arg instanceof ArrayBuffer || // Check if it's an ArrayBuffer
            ArrayBuffer.isView(arg) // Check if it's an array-like object
        );
    }

    /**
     * Checks if the provided argument is a FloatArray.
     * 
     * @param {*} arg - The object to test.
     * @returns {boolean} - True if the argument is a FloatArray, false otherwise.
     */
    static is_float_array(arg) {
        return ArrayBuffer.isView(arg) && arg[Symbol.toStringTag].includes('Float');
    }

    /**
     * Shuffles the elements of an array.
     * 
     * @param {Array} arr - The array to shuffle.
     * @returns {void} - The shuffled array (the original array is modified in place).
     */
    static shuffle(arr) {
        // Loop through each element of the array
        for (let i = 0; i < arr.length; ++i) {
            // Generate a random index within the array range
            let index = numb.irand(0, arr.length - 1);
            // Swap the current element with the randomly selected element
            [arr[i], arr[index]] = [arr[index], arr[i]];
        }
    }

    /**
     * @param {Array} arg 
     * @returns {any}
     */
    static last(arg) {
        return arg[arg.length - 1];
    }
}

/**
 * Represents a memory pool.
 */
export class pool {
    #buffer;
    #offset;

    /**
     * Creates a new Pool instance.
     */
    constructor() {
        this.#offset = 0;
    }

    /**
     * Gets the buffer.
     * @returns {ArrayBuffer} The buffer.
     */
    get buffer() { return this.#buffer; }

    /**
     * Sets the buffer.
     * @param {ArrayBuffer} value - The value to set the buffer to.
     */
    set buffer(value) { this.#buffer = value; }

    /**
     * Gets the offset.
     * @returns {number} The offset.
     */
    get offset() { return this.#offset; }

    /**
     * Sets the offset.
     * @param {number} value - The value to set the offset to.
     */
    set offset(value) { this.#offset = value; }

    /**
     * Initializes the memory pool with a buffer of the specified length.
     * @param {number} length - The length of the buffer.
     */
    init(length) {
        this.#buffer = new ArrayBuffer(length);
        this.#offset = 0;
    }

    /**
     * Aligns the offset to the byte alignment of the given array and updates the offset.
     * @param {TypedArray} arr - The typed array to align to.
     * @param {number} length - The length of the array.
     * @returns {number} The aligned offset.
     */
    align(arr, length) {
        const bytesPerElement = arr.BYTES_PER_ELEMENT;
        while (this.#offset % bytesPerElement) this.#offset++;
        const alignedOffset = this.#offset;
        this.#offset += bytesPerElement * length;
        return alignedOffset;
    }
}


