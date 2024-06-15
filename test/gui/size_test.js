import { pool } from '../../lib/array.js'
import { type_error } from '../../lib/error.js';
import {
    HEIGHT, sizef, sizei, size_add, size_bounded_to, size_div, size_expanded_to, size_f32p, size_f32p_ref,
    size_i16p, size_i16p_ref, size_mult, size_rem, size_scale, size_transpose, size_transposed, WIDTH, size_set,
    size_equals,
    size_fuzzy_equals,
    size_is_null,
    size_fuzzy_null,
    IGNORE_ASPECT_RATIO,
    KEEP_ASPECT_RATIO_BY_EXPANDING,
    KEEP_ASPECT_RATIO,
    size_to_css,
    size_to_string
} from '../../lib/gui/size.js';
import { test_size } from '../test.js';
describe('size constant test', () => {
    it(`WIDTH_00`, () => { expect(WIDTH).toBe(0); })
    it(`HEIGHT_00`, () => { expect(HEIGHT).toBe(1); })
})
describe('size classes and utility functions', () => {
    let sizeObj;

    beforeEach(() => {
        sizeObj = new sizei(10, 20);
    });

    it('should create a sizei object with default width and height', () => {
        expect(sizeObj[WIDTH]).toBe(10);
        expect(sizeObj[HEIGHT]).toBe(20);
    });

    it('should set the width and height of the size object', () => {
        sizeObj.width = 30;
        sizeObj.height = 40;
        expect(sizeObj[WIDTH]).toBe(30);
        expect(sizeObj[HEIGHT]).toBe(40);
    });

    it('should throw a type error when setting non-number width', () => {
        expect(() => {
            sizeObj.width = 'invalid';
        }).toThrowError(type_error);
    });

    it('should throw a type error when setting non-number height', () => {
        expect(() => {
            sizeObj.height = 'invalid';
        }).toThrowError(type_error);
    });

    it('should check if two size objects are equal', () => {
        const sizeObj2 = new sizei(10, 20);
        const sizeObj3 = new sizei(30, 40);
        expect(size_equals(sizeObj, sizeObj2)).toBe(true);
        expect(size_equals(sizeObj, sizeObj3)).toBe(false);
    });

});
describe('size classes and utility functions', () => {
    let sizeObj;

    beforeEach(() => {
        sizeObj = new sizef(10, 20);
    });

    it('should create a sizef object with default width and height', () => {
        expect(sizeObj[WIDTH]).toBe(10);
        expect(sizeObj[HEIGHT]).toBe(20);
    });

    it('should set the width and height of the sizef object', () => {
        sizeObj.width = 30;
        sizeObj.height = 40;
        expect(sizeObj[WIDTH]).toBe(30);
        expect(sizeObj[HEIGHT]).toBe(40);
    });

    it('should throw a type error when setting non-number width', () => {
        expect(() => {
            sizeObj.width = 'invalid';
        }).toThrowError(type_error);
    });

    it('should throw a type error when setting non-number height', () => {
        expect(() => {
            sizeObj.height = 'invalid';
        }).toThrowError(type_error);
    });

    it('should check if two sizef objects are equal', () => {
        const sizeObj2 = new sizef(10, 20);
        expect(size_equals(sizeObj, sizeObj2)).toBe(true);
    });


});
describe(`size_i16p test`, () => {
    it(`constructor_00`, () => {
        let p = new pool();
        p.init(size_i16p.BYTES_LENGTH * 1);
        let a = new size_i16p(p, 43, 8);
        test_size(a, 43, 8, 0);
        a.width = 75;
        a.height = 33;
        test_size(a, 75, 33, 0);
    })
})
describe(`size_i16p_ref test`, () => {
    it(`constructor_00`, () => {
        let p = new pool();
        p.init(size_i16p.BYTES_LENGTH * 1);
        let a = new size_i16p(p, 84, 5);
        let b = new size_i16p_ref(a.buffer, a.byteOffset);
        test_size(a, 84, 5, 0);
        test_size(b, 84, 5, 0);
        a.width = 42;
        a.height = 60;
        test_size(a, 42, 60, 0);
        test_size(b, 42, 60, 0);
    })
})
describe(`size_f32p test`, () => {
    it(`constructor_00`, () => {
        let p = new pool();
        p.init(size_f32p.BYTES_LENGTH * 1);
        let a = new size_f32p(p, 39.114353179931640625, 85.10588836669921875);
        test_size(a, 39.114353179931640625, 85.10588836669921875, 3);
        a.width = 80.0705;
        a.height = 46.2605;
        test_size(a, 80.07053375244140625, 46.2604522705078125, 3);
    })
})
describe(`size_f32p_ref test`, () => {
    it(`constructor_00`, () => {
        let p = new pool();
        p.init(size_f32p.BYTES_LENGTH * 1);
        let a = new size_f32p(p, 46.035221099853515625, 45.6515655517578125);
        let b = new size_f32p_ref(a.buffer, a.byteOffset);
        test_size(a, 46.035221099853515625, 45.6515655517578125, 3);
        test_size(b, 46.035221099853515625, 45.6515655517578125, 3);
        a.width = 90.0019;
        a.height = 37.5218;
        test_size(a, 90.00193023681640625, 37.52179718017578125, 3);
        test_size(b, 90.00193023681640625, 37.52179718017578125, 3);
    })
})
describe(`size function test`, () => {

    // Test suite for size_equals function
    describe("size_equals", () => {
        it("should return true for equal size objects", () => {
            const s1 = new sizef(10, 20);
            const s2 = new sizef(10, 20);
            expect(size_equals(s1, s2)).toBe(true);
        });

        it("should return false for unequal size objects", () => {
            const s1 = new sizef(10, 20);
            const s2 = new sizef(15, 25);
            expect(size_equals(s1, s2)).toBe(false);
        });

        it("should handle edge cases", () => {
            const s1 = new sizef(0, 0);
            const s2 = new sizef(0, 0);
            expect(size_equals(s1, s2)).toBe(true);
        });
    });

    // Test suite for size_fuzzy_equals function
    describe("size_fuzzy_equals", () => {
        it("should return true for almost equal size objects", () => {
            const s1 = [10, 10];
            const s2 = [10.000001, 10.000001];
            expect(size_fuzzy_equals(s1, s2)).toBe(true);
        });

        it("should return false for not almost equal size objects", () => {
            const s1 = [10, 10];
            const s2 = [11, 11];
            expect(size_fuzzy_equals(s1, s2)).toBe(false);
        });

        it("should return true for almost equal size objects with negative values", () => {
            const s1 = [-10, -10];
            const s2 = [-10.000001, -10.000001];
            expect(size_fuzzy_equals(s1, s2)).toBe(true);
        });

        it("should return true for almost equal size objects with zero values", () => {
            const s1 = [0, 0];
            const s2 = [0.000001, 0.000001];
            expect(size_fuzzy_equals(s1, s2)).toBe(true);
        });

        it("should return false for not almost equal size objects with zero values", () => {
            const s1 = [0, 0];
            const s2 = [1, 1];
            expect(size_fuzzy_equals(s1, s2)).toBe(false);
        });
    });

    // Test suite for size_is_null function
    describe("size_is_null", () => {
        it("should return true for a size object with width and height both equal to 0", () => {
            const s = [0, 0];
            expect(size_is_null(s)).toBe(true);
        });

        it("should return false for a size object with non-zero width and height", () => {
            const s = [10, 10];
            expect(size_is_null(s)).toBe(false);
        });

        it("should return false for a size object with non-zero width and 0 height", () => {
            const s = [10, 0];
            expect(size_is_null(s)).toBe(false);
        });

        it("should return false for a size object with 0 width and non-zero height", () => {
            const s = [0, 10];
            expect(size_is_null(s)).toBe(false);
        });
    });

    describe('size_fuzzy_null', () => {
        it('should return true if both width and height are almost 0', () => {
            const s = new sizef(0.000001, 0.000001);
            expect(size_fuzzy_null(s)).toBe(true);
        });

        it('should return false if either width or height is not almost 0', () => {
            const s1 = new sizef(0, 0.00001);
            const s2 = new sizef(0.00001, 0);
            expect(size_fuzzy_null(s1)).toBe(false);
            expect(size_fuzzy_null(s2)).toBe(false);
        });

        it('should handle negative values', () => {
            const s = new sizef(-0.000001, -0.000001);
            expect(size_fuzzy_null(s)).toBe(true);
        });

        it('should handle different size classes', () => {
            const s1 = new sizef(0.000001, 0.000001);
            const s2 = new sizef(0.000001, 0.000001);
            expect(size_fuzzy_null(s1)).toBe(true);
            expect(size_fuzzy_null(s2)).toBe(true);
        });

        it('should handle zero values', () => {
            const s = new sizef(0, 0);
            expect(size_fuzzy_null(s)).toBe(true);
        });

        it('should handle non-zero values', () => {
            const s = new sizef(1, 1);
            expect(size_fuzzy_null(s)).toBe(false);
        });
    });

    // Test suite for size_set function
    describe('size_set', () => {
        let sizeObj;

        beforeEach(() => {
            sizeObj = new sizei(10, 20);
        });

        it('should set the width and height of the size object to the provided values', () => {
            size_set(sizeObj, 30, 40);
            expect(sizeObj.width).toBe(30);
            expect(sizeObj.height).toBe(40);
        });

        it('should set the width and height of the size object to match the provided size object', () => {
            const newSize = new sizei(50, 60);
            size_set(sizeObj, newSize);
            expect(sizeObj.width).toBe(50);
            expect(sizeObj.height).toBe(60);
        });

        it('should throw a type error if the provided width is not a number', () => {
            expect(() => {
                size_set(sizeObj, 'invalid', 40);
            }).toThrowError('Width must be a number.');
        });

        it('should throw a type error if the provided height is not a number', () => {
            expect(() => {
                size_set(sizeObj, 30, 'invalid');
            }).toThrowError('Height must be a number.');
        });
    });

    // Test suite for size_bounded_to function
    describe('size_bounded_to', () => {
        let size1, size2, result;

        beforeEach(() => {
            size1 = new sizei(10, 20);
            size2 = new sizei(30, 15);
            result = new sizei();
        });

        it('should return a size object containing the minimum width and height of s1 and s2', () => {
            size_bounded_to(size1, size2, result);
            expect(result.width).toBe(10);
            expect(result.height).toBe(15);
        });

        it('should handle the case where s1 and s2 have the same width and height', () => {
            size1 = new sizei(10, 10);
            size_bounded_to(size1, size2, result);
            expect(result.width).toBe(10);
            expect(result.height).toBe(10);
        });

        it(`size_bounded_to_00`, () => {
            let a = new sizei(75, 31);
            let b = new sizei(91, 65);
            let c = new sizei(0, 0);
            let d = size_bounded_to(a, b, c);
            test_size(a, 75, 31, 0);
            test_size(b, 91, 65, 0);
            test_size(c, 75, 31, 0);
            test_size(d, 75, 31, 0);
        })

        it(`size_bounded_to_01`, () => {
            let a = new sizef(80.691741943359375, 80.71883392333984375);
            let b = new sizef(21.9856510162353515625, 22.80057525634765625);
            let c = new sizef(0, 0);
            let d = size_bounded_to(a, b, c);
            test_size(a, 80.691741943359375, 80.71883392333984375, 3);
            test_size(b, 21.9856510162353515625, 22.80057525634765625, 3);
            test_size(c, 21.9856510162353515625, 22.80057525634765625, 3);
            test_size(d, 21.9856510162353515625, 22.80057525634765625, 3);
        })

        it(`size_bounded_to_02`, () => {
            let p = new pool();
            p.init(size_i16p.BYTES_LENGTH * 3);
            let a = new size_i16p(p, 59, 61);
            let b = new size_i16p(p, 92, 57);
            let c = new size_i16p(p, 0, 0);
            let d = size_bounded_to(a, b, c);
            test_size(a, 59, 61, 0);
            test_size(b, 92, 57, 0);
            test_size(c, 59, 57, 0);
            test_size(d, 59, 57, 0);
        })

        it(`size_bounded_to_03`, () => {
            let p = new pool();
            p.init(size_i16p.BYTES_LENGTH * 3);
            let a = new size_i16p(p, 63, 39);
            let b = new size_i16p_ref(a.buffer, a.byteOffset);
            let c = new size_i16p(p, 38, 66);
            let d = new size_i16p_ref(c.buffer, c.byteOffset);
            let e = new size_i16p(p, 0, 0);
            let f = new size_i16p_ref(e.buffer, e.byteOffset);
            let g = size_bounded_to(b, d, f);
            test_size(a, 63, 39, 0);
            test_size(b, 63, 39, 0);
            test_size(c, 38, 66, 0);
            test_size(d, 38, 66, 0);
            test_size(e, 38, 39, 0);
            test_size(f, 38, 39, 0);
            test_size(g, 38, 39, 0);
        })

        it(`size_bounded_to_04`, () => {
            let p = new pool();
            p.init(size_f32p.BYTES_LENGTH * 3);
            let a = new size_f32p(p, 33.4198150634765625, 9.31641387939453125);
            let b = new size_f32p(p, 53.868679046630859375, 20.9348430633544921875);
            let c = new size_f32p(p, 0, 0);
            let d = size_bounded_to(a, b, c);
            test_size(a, 33.4198150634765625, 9.31641387939453125, 3);
            test_size(b, 53.868679046630859375, 20.9348430633544921875, 3);
            test_size(c, 33.4198150634765625, 9.31641387939453125, 3);
            test_size(d, 33.4198150634765625, 9.31641387939453125, 3);
        })

        it(`size_bounded_to_05`, () => {
            let p = new pool();
            p.init(size_f32p.BYTES_LENGTH * 3);
            let a = new size_f32p(p, 89.938140869140625, 82.39894866943359375);
            let b = new size_f32p_ref(a.buffer, a.byteOffset);
            let c = new size_f32p(p, 11.01121425628662109375, 45.83066558837890625);
            let d = new size_f32p_ref(c.buffer, c.byteOffset);
            let e = new size_f32p(p, 0, 0);
            let f = new size_f32p_ref(e.buffer, e.byteOffset);
            let g = size_bounded_to(b, d, f);
            test_size(a, 89.938140869140625, 82.39894866943359375, 3);
            test_size(b, 89.938140869140625, 82.39894866943359375, 3);
            test_size(c, 11.01121425628662109375, 45.83066558837890625, 3);
            test_size(d, 11.01121425628662109375, 45.83066558837890625, 3);
            test_size(e, 11.01121425628662109375, 45.83066558837890625, 3);
            test_size(f, 11.01121425628662109375, 45.83066558837890625, 3);
            test_size(g, 11.01121425628662109375, 45.83066558837890625, 3);
        })
    });

    // Test suite for size_expanded_to function
    describe('size_expanded_to', () => {
        let size1, size2, result;

        beforeEach(() => {
            size1 = new sizei(10, 20);
            size2 = new sizei(30, 15);
            result = new sizei();
        });

        it('should return a size object containing the maximum width and height of s1 and s2', () => {
            size_expanded_to(size1, size2, result);
            expect(result.width).toBe(30);
            expect(result.height).toBe(20);
        });

        it('should handle the case where s1 and s2 have the same width and height', () => {
            size1 = new sizei(30, 30);
            size_expanded_to(size1, size2, result);
            expect(result.width).toBe(30);
            expect(result.height).toBe(30);
        });

        it('should handle the case where s1 has larger width and s2 has larger height', () => {
            size1 = new sizei(40, 25);
            size_expanded_to(size1, size2, result);
            expect(result.width).toBe(40);
            expect(result.height).toBe(25);
        });

        it('should handle the case where s2 has larger width and s1 has larger height', () => {
            size1 = new sizei(25, 40);
            size_expanded_to(size1, size2, result);
            expect(result.width).toBe(30);
            expect(result.height).toBe(40);
        });

        it(`size_expanded_to_00`, () => {
            let a = new sizei(56, 5);
            let b = new sizei(22, 58);
            let c = new sizei(0, 0);
            let d = size_expanded_to(a, b, c);
            test_size(a, 56, 5, 0);
            test_size(b, 22, 58, 0);
            test_size(c, 56, 58, 0);
            test_size(d, 56, 58, 0);
        })

        it(`size_expanded_to_01`, () => {
            let a = new sizef(37.960086822509765625, 95.7558135986328125);
            let b = new sizef(57.001659393310546875, 87.620635986328125);
            let c = new sizef(0, 0);
            let d = size_expanded_to(a, b, c);
            test_size(a, 37.960086822509765625, 95.7558135986328125, 3);
            test_size(b, 57.001659393310546875, 87.620635986328125, 3);
            test_size(c, 57.001659393310546875, 95.7558135986328125, 3);
            test_size(d, 57.001659393310546875, 95.7558135986328125, 3);
        })

        it(`size_expanded_to_02`, () => {
            let p = new pool();
            p.init(size_i16p.BYTES_LENGTH * 3);
            let a = new size_i16p(p, 43, 68);
            let b = new size_i16p(p, 19, 57);
            let c = new size_i16p(p, 0, 0);
            let d = size_expanded_to(a, b, c);
            test_size(a, 43, 68, 0);
            test_size(b, 19, 57, 0);
            test_size(c, 43, 68, 0);
            test_size(d, 43, 68, 0);
        })

        it(`size_expanded_to_03`, () => {
            let p = new pool();
            p.init(size_i16p.BYTES_LENGTH * 3);
            let a = new size_i16p(p, 37, 89);
            let b = new size_i16p_ref(a.buffer, a.byteOffset);
            let c = new size_i16p(p, 69, 39);
            let d = new size_i16p_ref(c.buffer, c.byteOffset);
            let e = new size_i16p(p, 0, 0);
            let f = new size_i16p_ref(e.buffer, e.byteOffset);
            let g = size_expanded_to(b, d, f);
            test_size(a, 37, 89, 0);
            test_size(b, 37, 89, 0);
            test_size(c, 69, 39, 0);
            test_size(d, 69, 39, 0);
            test_size(e, 69, 89, 0);
            test_size(f, 69, 89, 0);
            test_size(g, 69, 89, 0);
        })

        it(`size_expanded_to_04`, () => {
            let p = new pool();
            p.init(size_f32p.BYTES_LENGTH * 3);
            let a = new size_f32p(p, 63.772243499755859375, 11.867206573486328125);
            let b = new size_f32p(p, 40.793292999267578125, 91.444244384765625);
            let c = new size_f32p(p, 0, 0);
            let d = size_expanded_to(a, b, c);
            test_size(a, 63.772243499755859375, 11.867206573486328125, 3);
            test_size(b, 40.793292999267578125, 91.444244384765625, 3);
            test_size(c, 63.772243499755859375, 91.444244384765625, 3);
            test_size(d, 63.772243499755859375, 91.444244384765625, 3);
        })

        it(`size_expanded_to_05`, () => {
            let p = new pool();
            p.init(size_f32p.BYTES_LENGTH * 3);
            let a = new size_f32p(p, 58.017208099365234375, 2.2382638454437255859375);
            let b = new size_f32p_ref(a.buffer, a.byteOffset);
            let c = new size_f32p(p, 72.42354583740234375, 63.9132537841796875);
            let d = new size_f32p_ref(c.buffer, c.byteOffset);
            let e = new size_f32p(p, 0, 0);
            let f = new size_f32p_ref(e.buffer, e.byteOffset);
            let g = size_expanded_to(b, d, f);
            test_size(a, 58.017208099365234375, 2.2382638454437255859375, 3);
            test_size(b, 58.017208099365234375, 2.2382638454437255859375, 3);
            test_size(c, 72.42354583740234375, 63.9132537841796875, 3);
            test_size(d, 72.42354583740234375, 63.9132537841796875, 3);
            test_size(e, 72.42354583740234375, 63.9132537841796875, 3);
            test_size(f, 72.42354583740234375, 63.9132537841796875, 3);
            test_size(g, 72.42354583740234375, 63.9132537841796875, 3);
        })
    });

    // Test suite for size_transpose function
    describe('size_transpose', () => {
        it('should swap the width and height values of the size object', () => {
            const sizeObject = [10, 20];
            size_transpose(sizeObject);
            expect(sizeObject[0]).toBe(20);
            expect(sizeObject[1]).toBe(10);
        });

        it('should handle the case where width and height are equal', () => {
            const sizeObject = [15, 15];
            size_transpose(sizeObject);
            expect(sizeObject[0]).toBe(15);
            expect(sizeObject[1]).toBe(15);
        });

        it('should handle the case where width is 0', () => {
            const sizeObject = [0, 25];
            size_transpose(sizeObject);
            expect(sizeObject[0]).toBe(25);
            expect(sizeObject[1]).toBe(0);
        });

        it('should handle the case where height is 0', () => {
            const sizeObject = [30, 0];
            size_transpose(sizeObject);
            expect(sizeObject[0]).toBe(0);
            expect(sizeObject[1]).toBe(30);
        });

        it(`size_transpose_00`, () => {
            let a = new sizei(48, 86);
            size_transpose(a);
            test_size(a, 86, 48, 0);
        })

        it(`size_transpose_01`, () => {
            let a = new sizef(95.673431396484375, 68.5394134521484375);
            size_transpose(a);
            test_size(a, 68.5394134521484375, 95.673431396484375, 3);
        })

        it(`size_transpose_02`, () => {
            let p = new pool();
            p.init(size_i16p.BYTES_LENGTH * 3);
            let a = new size_i16p(p, 32, 15);
            size_transpose(a);
            test_size(a, 15, 32, 0);
        })

        it(`size_transpose_03`, () => {
            let p = new pool();
            p.init(size_i16p.BYTES_LENGTH * 3);
            let a = new size_i16p(p, 17, 32);
            let b = new size_i16p_ref(a.buffer, a.byteOffset);
            size_transpose(b);
            test_size(a, 32, 17, 0);
            test_size(b, 32, 17, 0);
        })

        it(`size_transpose_04`, () => {
            let p = new pool();
            p.init(size_f32p.BYTES_LENGTH * 3);
            let a = new size_f32p(p, 94.49664306640625, 0.194093406200408935546875);
            size_transpose(a);
            test_size(a, 0.194093406200408935546875, 94.49664306640625, 3);
        })

        it(`size_transpose_05`, () => {
            let p = new pool();
            p.init(size_f32p.BYTES_LENGTH * 3);
            let a = new size_f32p(p, 53.56836700439453125, 97.9664459228515625);
            let b = new size_f32p_ref(a.buffer, a.byteOffset);
            size_transpose(b);
            test_size(a, 97.9664459228515625, 53.56836700439453125, 3);
            test_size(b, 97.9664459228515625, 53.56836700439453125, 3);
        })
    });

    describe('size_transposed', () => {
        let size1, result;

        beforeEach(() => {
            size1 = new sizef(100, 200);
            result = new sizef();
        });

        it('should swap width and height of the input size object', () => {
            size_transposed(size1, result);
            expect(result[WIDTH]).toBe(200);
            expect(result[HEIGHT]).toBe(100);
        });

        it('should return the result size object with swapped width and height', () => {
            const output = size_transposed(size1, result);
            expect(output).toBe(result);
        });

        it('should handle edge case of zero width and height', () => {
            size1 = new sizef(0, 0);
            size_transposed(size1, result);
            expect(result[WIDTH]).toBe(0);
            expect(result[HEIGHT]).toBe(0);
        });

        it('should handle negative width and height', () => {
            size1 = new sizef(-100, -200);
            size_transposed(size1, result);
            expect(result[WIDTH]).toBe(-200);
            expect(result[HEIGHT]).toBe(-100);
        });

        it('should handle floating point width and height', () => {
            size1 = new sizef(100.5, 200.7);
            size_transposed(size1, result);
            expect(result[WIDTH]).toBeCloseTo(200.7);
            expect(result[HEIGHT]).toBeCloseTo(100.5);
        });

        it(`size_transposed_00`, () => {
            let a = new sizei(50, 35);
            let b = new sizei(0, 0);
            let c = size_transposed(a, b);
            test_size(a, 50, 35, 0);
            test_size(b, 35, 50, 0);
            test_size(c, 35, 50, 0);
        })

        it(`size_transposed_01`, () => {
            let a = new sizef(41.123859405517578125, 34.720874786376953125);
            let b = new sizef(0, 0);
            let c = size_transposed(a, b);
            test_size(a, 41.123859405517578125, 34.720874786376953125, 3);
            test_size(b, 34.720874786376953125, 41.123859405517578125, 3);
            test_size(c, 34.720874786376953125, 41.123859405517578125, 3);
        })

        it(`size_transposed_02`, () => {
            let p = new pool();
            p.init(size_i16p.BYTES_LENGTH * 3);
            let a = new size_i16p(p, 26, 2);
            let b = new size_i16p(p, 0, 0);
            let c = size_transposed(a, b);
            test_size(a, 26, 2, 0);
            test_size(b, 2, 26, 0);
            test_size(c, 2, 26, 0);
        })

        it(`size_transposed_03`, () => {
            let p = new pool();
            p.init(size_i16p.BYTES_LENGTH * 3);
            let a = new size_i16p(p, 87, 62);
            let b = new size_i16p_ref(a.buffer, a.byteOffset);
            let c = new size_i16p(p, 0, 0);
            let d = new size_i16p_ref(c.buffer, c.byteOffset);
            let e = size_transposed(b, d);
            test_size(a, 87, 62, 0);
            test_size(b, 87, 62, 0);
            test_size(c, 62, 87, 0);
            test_size(d, 62, 87, 0);
            test_size(e, 62, 87, 0);
        })

        it(`size_transposed_04`, () => {
            let p = new pool();
            p.init(size_f32p.BYTES_LENGTH * 3);
            let a = new size_f32p(p, 19.639247894287109375, 29.5033321380615234375);
            let b = new size_f32p(p, 0, 0);
            let c = size_transposed(a, b);
            test_size(a, 19.639247894287109375, 29.5033321380615234375, 3);
            test_size(b, 29.5033321380615234375, 19.639247894287109375, 3);
            test_size(c, 29.5033321380615234375, 19.639247894287109375, 3);
        })

        it(`size_transposed_05`, () => {
            let p = new pool();
            p.init(size_f32p.BYTES_LENGTH * 3);
            let a = new size_f32p(p, 80.48199462890625, 68.79160308837890625);
            let b = new size_f32p_ref(a.buffer, a.byteOffset);
            let c = new size_f32p(p, 0, 0);
            let d = new size_f32p_ref(c.buffer, c.byteOffset);
            let e = size_transposed(b, d);
            test_size(a, 80.48199462890625, 68.79160308837890625, 3);
            test_size(b, 80.48199462890625, 68.79160308837890625, 3);
            test_size(c, 68.79160308837890625, 80.48199462890625, 3);
            test_size(d, 68.79160308837890625, 80.48199462890625, 3);
            test_size(e, 68.79160308837890625, 80.48199462890625, 3);
        })
    });

    // Test suite for the size_scale function
    describe('size_scale', () => {
        let size;

        beforeEach(() => {
            size = new sizef(100, 200);
        });

        it('should scale the size to the provided width and height', () => {
            size_scale(size, 50, 100);
            expect(size[WIDTH]).toBe(50);
            expect(size[HEIGHT]).toBe(100);
        });

        it('should handle aspect ratio mode IGNORE_ASPECT_RATIO', () => {
            size_scale(size, 0, 0, IGNORE_ASPECT_RATIO);
            expect(size[WIDTH]).toBe(0);
            expect(size[HEIGHT]).toBe(0);
        });

        it('should handle aspect ratio mode KEEP_ASPECT_RATIO', () => {
            size_scale(size, 50, 100, KEEP_ASPECT_RATIO);
            expect(size[WIDTH]).toBe(50);
            expect(size[HEIGHT]).toBe(100);
        });

        it('should handle aspect ratio mode KEEP_ASPECT_RATIO_BY_EXPANDING', () => {
            size_scale(size, 50, 100, KEEP_ASPECT_RATIO_BY_EXPANDING);
            expect(size[WIDTH]).toBe(50);
            expect(size[HEIGHT]).toBe(100);
        });

        it('should handle size with zero width and height', () => {
            size = new sizef(0, 0);
            size_scale(size, 50, 100, KEEP_ASPECT_RATIO);
            expect(size[WIDTH]).toBe(50);
            expect(size[HEIGHT]).toBe(100);
        });

        it('should handle floating point width and height', () => {
            size_scale(size, 50.5, 100.7, KEEP_ASPECT_RATIO);
            expect(size[WIDTH]).toBeCloseTo(50.34999);
            expect(size[HEIGHT]).toBeCloseTo(100.7);
        });

        it(`pre size_scale`, () => {
            let a = new sizei(10, 12);
            let b = new sizei(60, 60);
            size_scale(a, b, 0);
            test_size(a, 60, 60, 0);
            a.width = 10;
            a.height = 12;
            size_scale(a, b, 1);
            test_size(a, 50, 60, 0);
            a.width = 10;
            a.height = 12;
            size_scale(a, b, 2);
            test_size(a, 60, 72, 0);
        })

        it(`size_scale_00`, () => {
            let a = new sizei(73, 19);
            let b = new sizei(65, 71);

            size_set(a, 73, 19);
            size_scale(a, b, 0);
            test_size(a, 65, 71, 0);

            size_set(a, 73, 19);
            size_scale(a, b, 1);
            test_size(a, 65, 16, 0);

            size_set(a, 73, 19);
            size_scale(a, b, 2);
            test_size(a, 272, 71, 0);

        })
    });

    // Test suite for the size_add function
    describe('size_add', () => {
        let size1, size2, result;

        beforeEach(() => {
            size1 = new sizef(100, 200);
            size2 = new sizef(50, 100);
            result = new sizef();
        });

        it('should add two sizes together', () => {
            size_add(size1, size2, result);
            expect(result[WIDTH]).toBe(150);
            expect(result[HEIGHT]).toBe(300);
        });

        it('should add a number to each component of the size', () => {
            size_add(size1, 50, 100, result);
            expect(result[WIDTH]).toBe(150);
            expect(result[HEIGHT]).toBe(300);
        });

        it('should handle adding a size and a number separately', () => {
            size_add(size1, size2, result);
            expect(result[WIDTH]).toBe(150);
            expect(result[HEIGHT]).toBe(300);
        });

        it('should handle adding zero to each component of the size', () => {
            size_add(size1, 0, 0, result);
            expect(result[WIDTH]).toBe(100);
            expect(result[HEIGHT]).toBe(200);
        });

        it('should handle adding zero size to another size', () => {
            size_add(size1, new sizef(0, 0), result);
            expect(result[WIDTH]).toBe(100);
            expect(result[HEIGHT]).toBe(200);
        });

        it(`size_add_00`, () => {
            let a = new sizei(-67, -8);
            let b = new sizei(22, -28);
            let c = new sizei(0, 0);
            let d = size_add(a, b, c);
            test_size(a, -67, -8, 0);
            test_size(b, 22, -28, 0);
            test_size(c, -45, -36, 0);
            test_size(d, -45, -36, 0);
        })

        it(`size_add_01`, () => {
            let a = new sizef(93.7704620361328125, 82.6003570556640625);
            let b = new sizef(7.119964599609375, 55.0814666748046875);
            let c = new sizef(0, 0);
            let d = size_add(a, b, c);
            test_size(a, 93.7704620361328125, 82.6003570556640625, 3);
            test_size(b, 7.119964599609375, 55.0814666748046875, 3);
            test_size(c, 100.8904266357421875, 137.68182373046875, 3);
            test_size(d, 100.8904266357421875, 137.68182373046875, 3);
        })

        it(`size_add_02`, () => {
            let p = new pool();
            p.init(size_i16p.BYTES_LENGTH * 3);
            let a = new size_i16p(p, -66, -34);
            let b = new size_i16p(p, -60, 5);
            let c = new size_i16p(p, 0, 0);
            let d = size_add(a, b, c);
            test_size(a, -66, -34, 0);
            test_size(b, -60, 5, 0);
            test_size(c, -126, -29, 0);
            test_size(d, -126, -29, 0);
        })

        it(`size_add_03`, () => {
            let p = new pool();
            p.init(size_i16p.BYTES_LENGTH * 3);
            let a = new size_i16p(p, 32, -62);
            let b = new size_i16p_ref(a.buffer, a.byteOffset);
            let c = new size_i16p(p, 18, -24);
            let d = new size_i16p_ref(c.buffer, c.byteOffset);
            let e = new size_i16p(p, 0, 0);
            let f = new size_i16p_ref(e.buffer, e.byteOffset);
            let g = size_add(b, d, f);
            test_size(a, 32, -62, 0);
            test_size(b, 32, -62, 0);
            test_size(c, 18, -24, 0);
            test_size(d, 18, -24, 0);
            test_size(e, 50, -86, 0);
            test_size(f, 50, -86, 0);
            test_size(g, 50, -86, 0);
        })

        it(`size_add_04`, () => {
            let p = new pool();
            p.init(size_f32p.BYTES_LENGTH * 3);
            let a = new size_f32p(p, 24.5002880096435546875, 33.531597137451171875);
            let b = new size_f32p(p, -99.4447174072265625, 35.0286102294921875);
            let c = new size_f32p(p, 0, 0);
            let d = size_add(a, b, c);
            test_size(a, 24.5002880096435546875, 33.531597137451171875, 3);
            test_size(b, -99.4447174072265625, 35.0286102294921875, 3);
            test_size(c, -74.9444293975830078125, 68.560207366943359375, 3);
            test_size(d, -74.9444293975830078125, 68.560207366943359375, 3);
        })

        it(`size_add_05`, () => {
            let p = new pool();
            p.init(size_f32p.BYTES_LENGTH * 3);
            let a = new size_f32p(p, -69.73821258544921875, 18.5937824249267578125);
            let b = new size_f32p_ref(a.buffer, a.byteOffset);
            let c = new size_f32p(p, -52.022083282470703125, -55.7097320556640625);
            let d = new size_f32p_ref(c.buffer, c.byteOffset);
            let e = new size_f32p(p, 0, 0);
            let f = new size_f32p_ref(e.buffer, e.byteOffset);
            let g = size_add(b, d, f);
            test_size(a, -69.73821258544921875, 18.5937824249267578125, 3);
            test_size(b, -69.73821258544921875, 18.5937824249267578125, 3);
            test_size(c, -52.022083282470703125, -55.7097320556640625, 3);
            test_size(d, -52.022083282470703125, -55.7097320556640625, 3);
            test_size(e, -121.760295867919921875, -37.1159496307373046875, 3);
            test_size(f, -121.760295867919921875, -37.1159496307373046875, 3);
            test_size(g, -121.760295867919921875, -37.1159496307373046875, 3);
        })
    });

    // Test suite for the size_rem function
    describe('size_rem', () => {
        let size1, size2, result;

        beforeEach(() => {
            size1 = new sizef(100, 200);
            size2 = new sizef(50, 100);
            result = new sizef();
        });

        it('should subtract two sizes', () => {
            size_rem(size1, size2, result);
            expect(result[WIDTH]).toBe(50);
            expect(result[HEIGHT]).toBe(100);
        });

        it('should subtract a number from each component of the size', () => {
            size_rem(size1, 50, 100, result);
            expect(result[WIDTH]).toBe(50);
            expect(result[HEIGHT]).toBe(100);
        });

        it('should handle subtracting a size and a number separately', () => {
            size_rem(size1, size2, result);
            expect(result[WIDTH]).toBe(50);
            expect(result[HEIGHT]).toBe(100);
        });

        it('should handle subtracting zero from each component of the size', () => {
            size_rem(size1, 0, 0, result);
            expect(result[WIDTH]).toBe(100);
            expect(result[HEIGHT]).toBe(200);
        });

        it('should handle subtracting zero size from another size', () => {
            size_rem(size1, new sizef(0, 0), result);
            expect(result[WIDTH]).toBe(100);
            expect(result[HEIGHT]).toBe(200);
        });

        it(`size_rem_00`, () => {
            let a = new sizei(-73, 22);
            let b = new sizei(72, 17);
            let c = new sizei(0, 0);
            let d = size_rem(a, b, c);
            test_size(a, -73, 22, 0);
            test_size(b, 72, 17, 0);
            test_size(c, -145, 5, 0);
            test_size(d, -145, 5, 0);
        })

        it(`size_rem_01`, () => {
            let a = new sizef(88.00640106201171875, 32.802276611328125);
            let b = new sizef(-37.980876922607421875, -79.44974517822265625);
            let c = new sizef(0, 0);
            let d = size_rem(a, b, c);
            test_size(a, 88.00640106201171875, 32.802276611328125, 3);
            test_size(b, -37.980876922607421875, -79.44974517822265625, 3);
            test_size(c, 125.987277984619140625, 112.25202178955078125, 3);
            test_size(d, 125.987277984619140625, 112.25202178955078125, 3);
        })

        it(`size_rem_02`, () => {
            let p = new pool();
            p.init(size_i16p.BYTES_LENGTH * 3);
            let a = new size_i16p(p, 52, -78);
            let b = new size_i16p(p, -21, -91);
            let c = new size_i16p(p, 0, 0);
            let d = size_rem(a, b, c);
            test_size(a, 52, -78, 0);
            test_size(b, -21, -91, 0);
            test_size(c, 73, 13, 0);
            test_size(d, 73, 13, 0);
        })

        it(`size_rem_03`, () => {
            let p = new pool();
            p.init(size_i16p.BYTES_LENGTH * 3);
            let a = new size_i16p(p, 16, -26);
            let b = new size_i16p_ref(a.buffer, a.byteOffset);
            let c = new size_i16p(p, 46, 74);
            let d = new size_i16p_ref(c.buffer, c.byteOffset);
            let e = new size_i16p(p, 0, 0);
            let f = new size_i16p_ref(e.buffer, e.byteOffset);
            let g = size_rem(b, d, f);
            test_size(a, 16, -26, 0);
            test_size(b, 16, -26, 0);
            test_size(c, 46, 74, 0);
            test_size(d, 46, 74, 0);
            test_size(e, -30, -100, 0);
            test_size(f, -30, -100, 0);
            test_size(g, -30, -100, 0);
        })

        it(`size_rem_04`, () => {
            let p = new pool();
            p.init(size_f32p.BYTES_LENGTH * 3);
            let a = new size_f32p(p, 44.842952728271484375, 40.3219757080078125);
            let b = new size_f32p(p, 53.793613433837890625, 33.705127716064453125);
            let c = new size_f32p(p, 0, 0);
            let d = size_rem(a, b, c);
            test_size(a, 44.842952728271484375, 40.3219757080078125, 3);
            test_size(b, 53.793613433837890625, 33.705127716064453125, 3);
            test_size(c, -8.95066070556640625, 6.616847991943359375, 3);
            test_size(d, -8.95066070556640625, 6.616847991943359375, 3);
        })

        it(`size_rem_05`, () => {
            let p = new pool();
            p.init(size_f32p.BYTES_LENGTH * 3);
            let a = new size_f32p(p, 53.203563690185546875, 25.760875701904296875);
            let b = new size_f32p_ref(a.buffer, a.byteOffset);
            let c = new size_f32p(p, -65.79564666748046875, -35.840351104736328125);
            let d = new size_f32p_ref(c.buffer, c.byteOffset);
            let e = new size_f32p(p, 0, 0);
            let f = new size_f32p_ref(e.buffer, e.byteOffset);
            let g = size_rem(b, d, f);
            test_size(a, 53.203563690185546875, 25.760875701904296875, 3);
            test_size(b, 53.203563690185546875, 25.760875701904296875, 3);
            test_size(c, -65.79564666748046875, -35.840351104736328125, 3);
            test_size(d, -65.79564666748046875, -35.840351104736328125, 3);
            test_size(e, 118.999210357666015625, 61.601226806640625, 3);
            test_size(f, 118.999210357666015625, 61.601226806640625, 3);
            test_size(g, 118.999210357666015625, 61.601226806640625, 3);
        })
    });

    // Test suite for the size_mult function
    describe('size_mult', () => {
        let size1, result;

        beforeEach(() => {
            size1 = new sizef(100, 200);
            result = new sizef();
        });

        it('should multiply the size by a scalar factor', () => {
            size_mult(size1, 2, result);
            expect(result[WIDTH]).toBe(200);
            expect(result[HEIGHT]).toBe(400);
        });

        it('should handle multiplying the size by zero', () => {
            size_mult(size1, 0, result);
            expect(result[WIDTH]).toBe(0);
            expect(result[HEIGHT]).toBe(0);
        });

        it('should handle multiplying the size by a negative factor', () => {
            size_mult(size1, -1, result);
            expect(result[WIDTH]).toBe(-100);
            expect(result[HEIGHT]).toBe(-200);
        });

        it('should handle multiplying a size with zero width and height', () => {
            size_mult(new sizef(0, 0), 2, result);
            expect(result[WIDTH]).toBe(0);
            expect(result[HEIGHT]).toBe(0);
        });

        it('should handle multiplying a size with negative width and height', () => {
            size_mult(new sizef(-100, -200), 2, result);
            expect(result[WIDTH]).toBe(-200);
            expect(result[HEIGHT]).toBe(-400);
        });

        it(`size_mult_00`, () => {
            let a = new sizei(90, 62);
            let b = new sizei(0, 0);
            let c = size_mult(a, -8, b);
            test_size(a, 90, 62, 0);
            test_size(b, -720, -496, 0);
            test_size(c, -720, -496, 0);
        })

        it(`size_mult_01`, () => {
            let a = new sizef(-53.5099639892578125, -0.450464814901351928710938);
            let b = new sizef(0, 0);
            let c = size_mult(a, -98.21092987060546875, b);
            test_size(a, -53.5099639892578125, -0.450464814901351928710938, 3);
            test_size(b, 5255.26332072762306779623, 44.2405683454519476072164, 3);
            test_size(c, 5255.26332072762306779623, 44.2405683454519476072164, 3);
        })

        it(`size_mult_02`, () => {
            let p = new pool();
            p.init(size_i16p.BYTES_LENGTH * 3);
            let a = new size_i16p(p, 17, 55);
            let b = new size_i16p(p, 0, 0);
            let c = size_mult(a, -52, b);
            test_size(a, 17, 55, 0);
            test_size(b, -884, -2860, 0);
            test_size(c, -884, -2860, 0);
        })

        it(`size_mult_03`, () => {
            let p = new pool();
            p.init(size_i16p.BYTES_LENGTH * 3);
            let a = new size_i16p(p, 73, 85);
            let b = new size_i16p_ref(a.buffer, a.byteOffset);
            let c = new size_i16p(p, 0, 0);
            let d = new size_i16p_ref(c.buffer, c.byteOffset);
            let e = size_mult(b, -16, d);
            test_size(a, 73, 85, 0);
            test_size(b, 73, 85, 0);
            test_size(c, -1168, -1360, 0);
            test_size(d, -1168, -1360, 0);
            test_size(e, -1168, -1360, 0);
        })

        it(`size_mult_04`, () => {
            let p = new pool();
            p.init(size_f32p.BYTES_LENGTH * 3);
            let a = new size_f32p(p, 49.25774383544921875, -95.23133087158203125);
            let b = new size_f32p(p, 0, 0);
            let c = size_mult(a, -90.9095458984375, b);
            test_size(a, 49.25774383544921875, -95.23133087158203125, 3);
            test_size(b, -4477.99912406224757432938, 8657.43704483937472105026, 3);
            test_size(c, -4477.99912406224757432938, 8657.43704483937472105026, 3);
        })

        it(`size_mult_05`, () => {
            let p = new pool();
            p.init(size_f32p.BYTES_LENGTH * 3);
            let a = new size_f32p(p, -43.906047821044921875, 43.84563446044921875);
            let b = new size_f32p_ref(a.buffer, a.byteOffset);
            let c = new size_f32p(p, 0, 0);
            let d = new size_f32p_ref(c.buffer, c.byteOffset);
            let e = size_mult(b, 84.4423980712890625, d);
            test_size(a, -43.906047821044921875, 43.84563446044921875, 3);
            test_size(b, -43.906047821044921875, 43.84563446044921875, 3);
            test_size(c, -3707.53196784172905609012, 3702.43051879748236387968, 3);
            test_size(d, -3707.53196784172905609012, 3702.43051879748236387968, 3);
            test_size(e, -3707.53196784172905609012, 3702.43051879748236387968, 3);
        })
    });

    // Test suite for the size_div function
    describe('size_div', () => {
        let size1, result;

        beforeEach(() => {
            size1 = new sizef(100, 200);
            result = new sizef();
        });

        it('should divide the size by a scalar factor', () => {
            size_div(size1, 2, result);
            expect(result[WIDTH]).toBeCloseTo(50);
            expect(result[HEIGHT]).toBeCloseTo(100);
        });

        it('should handle dividing the size by zero', () => {
            size_div(size1, 0, result);
            expect(result[WIDTH]).toBe(Infinity);
            expect(result[HEIGHT]).toBe(Infinity);
        });

        it('should handle dividing a size with zero width and height', () => {
            size_div(new sizef(0, 0), 2, result);
            expect(result[WIDTH]).toBe(0);
            expect(result[HEIGHT]).toBe(0);
        });

        it('should handle dividing a size with negative width and height', () => {
            size_div(new sizef(-100, -200), 2, result);
            expect(result[WIDTH]).toBeCloseTo(-50);
            expect(result[HEIGHT]).toBeCloseTo(-100);
        });

        it(`size_div_00`, () => {
            let a = new sizei(11, -49);
            let b = new sizei(0, 0);
            let c = size_div(a, 20, b);
            test_size(a, 11, -49, 0);
            test_size(b, 1, -2, 0);
            test_size(c, 1, -2, 0);
        })

        it(`size_div_01`, () => {
            let a = new sizef(53.640560150146484375, 81.728240966796875);
            let b = new sizef(0, 0);
            let c = size_div(a, 2.5732514858245849609375, b);
            test_size(a, 53.640560150146484375, 81.728240966796875, 3);
            test_size(b, 20.8454402710497781470167, 31.7606893135077648082643, 3);
            test_size(c, 20.8454402710497781470167, 31.7606893135077648082643, 3);
        })

        it(`size_div_02`, () => {
            let p = new pool();
            p.init(size_i16p.BYTES_LENGTH * 3);
            let a = new size_i16p(p, 20, -77);
            let b = new size_i16p(p, 0, 0);
            let c = size_div(a, -17, b);
            test_size(a, 20, -77, 0);
            test_size(b, -1, 5, 0);
            test_size(c, -1, 5, 0);
        })

        it(`size_div_03`, () => {
            let p = new pool();
            p.init(size_i16p.BYTES_LENGTH * 3);
            let a = new size_i16p(p, -65, -27);
            let b = new size_i16p_ref(a.buffer, a.byteOffset);
            let c = new size_i16p(p, 0, 0);
            let d = new size_i16p_ref(c.buffer, c.byteOffset);
            let e = size_div(b, 12, d);
            test_size(a, -65, -27, 0);
            test_size(b, -65, -27, 0);
            test_size(c, -5, -2, 0);
            test_size(d, -5, -2, 0);
            test_size(e, -5, -2, 0);
        })

        it(`size_div_04`, () => {
            let p = new pool();
            p.init(size_f32p.BYTES_LENGTH * 3);
            let a = new size_f32p(p, 30.792987823486328125, 52.133220672607421875);
            let b = new size_f32p(p, 0, 0);
            let c = size_div(a, -1.49216365814208984375, b);
            test_size(a, 30.792987823486328125, 52.133220672607421875, 3);
            test_size(b, -20.6364681618281942121484, -34.9380045467124560332195, 3);
            test_size(c, -20.6364681618281942121484, -34.9380045467124560332195, 3);
        })

        it(`size_div_05`, () => {
            let p = new pool();
            p.init(size_f32p.BYTES_LENGTH * 3);
            let a = new size_f32p(p, 90.58863067626953125, 93.82070159912109375);
            let b = new size_f32p_ref(a.buffer, a.byteOffset);
            let c = new size_f32p(p, 0, 0);
            let d = new size_f32p_ref(c.buffer, c.byteOffset);
            let e = size_div(b, -0.634757518768310546875, d);
            test_size(a, 90.58863067626953125, 93.82070159912109375, 3);
            test_size(b, 90.58863067626953125, 93.82070159912109375, 3);
            test_size(c, -142.713757612589716927687, -147.805577445024454164013, 3);
            test_size(d, -142.713757612589716927687, -147.805577445024454164013, 3);
            test_size(e, -142.713757612589716927687, -147.805577445024454164013, 3);
        })
    });

    // Test suite for the size_to_css function using Jasmine
    describe("size_to_css", () => {
        it("should return a string representing the width and height in pixels", () => {
            // Test case 1: Positive values
            let size1 = [100, 200];
            expect(size_to_css(size1)).toBe("width:100px;height:200px;");

            // Test case 2: Zero values
            let size2 = [0, 0];
            expect(size_to_css(size2)).toBe("width:0px;height:0px;");

            // Test case 3: Negative values
            let size3 = [-50, -75];
            expect(size_to_css(size3)).toBe("width:-50px;height:-75px;");
        });
    });

    // Test suite for the size_to_string function using Jasmine
    describe("size_to_string", () => {
        it("should return a string representing the size object in the format (width, height)", () => {
            // Test case 1: Positive values
            let size1 = [100, 200];
            expect(size_to_string(size1)).toBe("(100,200)");

            // Test case 2: Zero values
            let size2 = [0, 0];
            expect(size_to_string(size2)).toBe("(0,0)");

            // Test case 3: Negative values
            let size3 = [-50, -75];
            expect(size_to_string(size3)).toBe("(-50,-75)");
        });
    });
})
