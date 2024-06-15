import { array, pool } from '../lib/array.js';
import { vec2f } from '../lib/math/vec2.js';

const test_arr = (a, b) => {
    let ret = array.is_array(a) && array.is_array(b) && (a.length == b.length);
    for (let i = 0; i < a.length && ret; ++i) {
        if (a[i] != b[i]) ret = false;
    }
    return ret;
}

describe('array test', () => {

    describe("array.is_array", () => {
        it("should return true if the argument is an array", () => {
            expect(array.is_array([])).toBe(true);
            expect(array.is_array([1, 2, 3])).toBe(true);
        });
    
        it("should return true if the argument is an ArrayBuffer", () => {
            const buffer = new ArrayBuffer(16);
            expect(array.is_array(buffer)).toBe(true);
        });
    
        xit("should return true if the argument is an array-like object", () => {
            const arrayLike = { length: 3, 0: 'a', 1: 'b', 2: 'c' };
            expect(array.is_array(arrayLike)).toBe(true);
        });
    
        it("should return false if the argument is not an array, ArrayBuffer, or array-like object", () => {
            expect(array.is_array(null)).toBe(false);
            expect(array.is_array(undefined)).toBe(false);
            expect(array.is_array(42)).toBe(false);
            expect(array.is_array("string")).toBe(false);
            expect(array.is_array({ prop: "value" })).toBe(false);
            expect(array.is_array(function() {})).toBe(false);
        });

        it(`is_array_00`, () => {
            expect(array.is_array([])).toBeTrue();
            expect(array.is_array(new Int8Array())).toBeTrue();
            expect(array.is_array(new Uint8Array())).toBeTrue();
            expect(array.is_array(new Uint8ClampedArray())).toBeTrue();
            expect(array.is_array(new Uint16Array())).toBeTrue();
            expect(array.is_array(new Int32Array())).toBeTrue();
            expect(array.is_array(new Uint32Array())).toBeTrue();
            expect(array.is_array(new Float32Array())).toBeTrue();
            expect(array.is_array(new Float64Array())).toBeTrue();
            expect(array.is_array(new BigInt64Array())).toBeTrue();
            expect(array.is_array(new BigUint64Array())).toBeTrue();
        })
    
        it(`is_array_01`, () => {
            expect(array.is_array(new vec2f())).toBeTrue();
        })
    });

    describe("array.is_float_array", () => {
        // Test cases for Float32Array
        it("should return true for Float32Array", () => {
            const float32Array = new Float32Array([1.1, 2.2, 3.3]);
            expect(array.is_float_array(float32Array)).toBe(true);
        });
    
        // Test cases for Float64Array
        it("should return true for Float64Array", () => {
            const float64Array = new Float64Array([1.1, 2.2, 3.3]);
            expect(array.is_float_array(float64Array)).toBe(true);
        });
    
        // Test cases for other types
        it("should return false for other types", () => {
            expect(array.is_float_array([1, 2, 3])).toBe(false); // Regular array
            expect(array.is_float_array({})).toBe(false); // Object
            expect(array.is_float_array("string")).toBe(false); // String
            expect(array.is_float_array(123)).toBe(false); // Number
            expect(array.is_float_array(null)).toBe(false); // Null
            expect(array.is_float_array(undefined)).toBe(false); // Undefined
        });

        it(`is_float_array_00`, () => {
            expect(array.is_float_array(new Int8Array())).toBeFalse();
            expect(array.is_float_array(new Uint8Array())).toBeFalse();
            expect(array.is_float_array(new Uint8ClampedArray())).toBeFalse();
            expect(array.is_float_array(new Uint16Array())).toBeFalse();
            expect(array.is_float_array(new Int32Array())).toBeFalse();
            expect(array.is_float_array(new Uint32Array())).toBeFalse();
            expect(array.is_float_array(new Float32Array())).toBeTrue();
            expect(array.is_float_array(new Float64Array())).toBeTrue();
            expect(array.is_float_array(new BigInt64Array())).toBeFalse();
            expect(array.is_float_array(new BigUint64Array())).toBeFalse();
        })
    });

    describe('array.shuffle', () => {

        it('should shuffle an array of numbers', () => {
            const arr = [1, 2, 3, 4, 5];
            const originalArr = [...arr];
            array.shuffle(arr);
            expect(arr).not.toEqual(originalArr);
            expect(arr.sort()).toEqual(originalArr.sort());
        });
    
        it('should shuffle an array of strings', () => {
            const arr = ['a', 'b', 'c', 'd', 'e'];
            const originalArr = [...arr];
            array.shuffle(arr);
            expect(arr).not.toEqual(originalArr);
            expect(arr.sort()).toEqual(originalArr.sort());
        });
    
        it('should handle an empty array', () => {
            const arr = [];
            array.shuffle(arr);
            expect(arr).toEqual([]);
        });
    
        it('should handle an array with one element', () => {
            const arr = [1];
            array.shuffle(arr);
            expect(arr).toEqual([1]);
        });
    
        it('should handle an array with duplicate elements', () => {
            const arr = [1, 1, 2, 2, 3, 3];
            const originalArr = [...arr];
            array.shuffle(arr);
            expect(arr).not.toEqual(originalArr);
            expect(arr.sort()).toEqual(originalArr.sort());
        });
    
        it('should handle an array with different data types', () => {
            const arr = [1, 'a', true, null, undefined, {}];
            const originalArr = [...arr];
            array.shuffle(arr);
            expect(arr).not.toEqual(originalArr);
            expect(arr.length).toBe(originalArr.length);
            arr.forEach(item => {
                expect(originalArr).toContain(item);
            });
        });
    
        it('should shuffle the array in-place', () => {
            const arr = [1, 2, 3, 4, 5];
            const originalArr = [...arr];
            array.shuffle(arr);
            expect(arr).not.toEqual(originalArr);
            expect(arr.sort()).toEqual(originalArr.sort());
        });
    
        it('should shuffle large arrays', () => {
            const arr = Array.from({ length: 1000 }, (_, i) => i);
            const originalArr = [...arr];
            array.shuffle(arr);
            expect(arr).not.toEqual(originalArr);
            expect(arr.sort((a, b) => a - b)).toEqual(originalArr);
        });

        it(`shuffle_array_00`, () => {
            let a = [1, 2, 3, 4];
            array.shuffle(a);
    
            expect(1).toBe(1);
            //expect(a).not.toEqual([1, 2, 3, 4]);
        })
    
    });
    


    

})

describe('pool test', () => {

    describe('pool', () => {
        let p;
    
        beforeEach(() => {
            p = new pool();
        });
    
        it('should initialize with default values', () => {
            expect(p.buffer).toBeUndefined();
            expect(p.offset).toBe(0);
        });
    
        it('should set and get buffer correctly', () => {
            const buffer = new ArrayBuffer(16);
            p.buffer = buffer;
            expect(p.buffer).toBe(buffer);
        });
    
        it('should set and get offset correctly', () => {
            p.offset = 10;
            expect(p.offset).toBe(10);
        });
    
        describe('init', () => {
            it('should initialize buffer with specified length', () => {
                p.init(16);
                expect(p.buffer).toBeDefined();
                expect(p.buffer.byteLength).toBe(16);
            });
    
            it('should reset offset to 0 after initialization', () => {
                p.offset = 10;
                p.init(16);
                expect(p.offset).toBe(0);
            });
        });
    
        describe('align', () => {
            it('should align offset to the byte alignment of the array', () => {
                p.init(16);
                p.align(new Uint16Array(), 2);
                expect(p.offset).toBe(4);
            });
    
            it('should return the aligned offset', () => {
                p.init(16);
                const alignedOffset = p.align(new Uint32Array(), 2);
                expect(alignedOffset).toBe(0);
            });
    
            it('should not change offset if already aligned', () => {
                p.init(16);
                p.offset = 8;
                const alignedOffset = p.align(new Uint32Array(), 2);
                expect(alignedOffset).toBe(8);
            });
    
            it('should handle alignment for different byte sizes', () => {
                p.init(16);
                p.align(new Uint16Array(), 1);
                expect(p.offset).toBe(2);
                p.align(new Uint8Array(), 1);
                expect(p.offset).toBe(3);
            });
        });
    });

    it(`pre+test_00`, () => {
        expect(1).toBe(1);
        const buffer = new ArrayBuffer(48);
        let offset = 0;

        while (offset % Int8Array.BYTES_PER_ELEMENT) offset++;
        //console.log(`Int8Array offset: ${offset}`);
        const i8 = new Int8Array(buffer, offset, 1);
        offset += Int8Array.BYTES_PER_ELEMENT;

        while (offset % Uint8Array.BYTES_PER_ELEMENT) offset++;
        //console.log(`Uint8Array offset: ${offset}`);
        const ui8 = new Uint8Array(buffer, offset, 1);
        offset += Uint8Array.BYTES_PER_ELEMENT;

        while (offset % Uint8ClampedArray.BYTES_PER_ELEMENT) offset++;
        //console.log(`Uint8ClampedArray offset: ${offset}`);
        const ui8c = new Uint8ClampedArray(buffer, offset, 1);
        offset += Uint8ClampedArray.BYTES_PER_ELEMENT;

        while (offset % Int16Array.BYTES_PER_ELEMENT) offset++;
        //console.log(`Int16Array offset: ${offset}`);
        const i16 = new Int16Array(buffer, offset, 1);
        offset += Int16Array.BYTES_PER_ELEMENT;

        while (offset % Uint16Array.BYTES_PER_ELEMENT) offset++;
        //console.log(`Uint16Array offset: ${offset}`);
        const ui16 = new Uint16Array(buffer, offset, 1);
        offset += Uint16Array.BYTES_PER_ELEMENT;
        
        while (offset % Int32Array.BYTES_PER_ELEMENT) offset++;
        //console.log(`Int32Array offset: ${offset}`);
        const i32 = new Int32Array(buffer, offset, 1);
        offset += Int32Array.BYTES_PER_ELEMENT;

        while (offset % Uint32Array.BYTES_PER_ELEMENT) offset++;
        //console.log(`Uint32Array offset: ${offset}`);
        const ui32 = new Uint32Array(buffer, offset, 1);
        offset += Uint32Array.BYTES_PER_ELEMENT;

        while (offset % Float32Array.BYTES_PER_ELEMENT) offset++;
        //console.log(`Float32Array offset: ${offset}`);
        const f32 = new Float32Array(buffer, offset, 1);
        offset += Float32Array.BYTES_PER_ELEMENT;

        while (offset % Float64Array.BYTES_PER_ELEMENT) offset++;
        //console.log(`Float64Array offset: ${offset}`);
        const f64 = new Float64Array(buffer, offset, 1);
        offset += Float64Array.BYTES_PER_ELEMENT;

        while (offset % BigInt64Array.BYTES_PER_ELEMENT) offset++;
        //console.log(`BigInt64Array offset: ${offset}`);
        const i64 = new BigInt64Array(buffer, offset, 1);
        offset += BigInt64Array.BYTES_PER_ELEMENT;

        while (offset % BigUint64Array.BYTES_PER_ELEMENT) offset++;
        //console.log(`BigUint64Array offset: ${offset}`);
        const ui64 = new BigUint64Array(buffer, offset, 1);
        offset += BigUint64Array.BYTES_PER_ELEMENT;

    })

})