import { pool } from '../../lib/array.js';
import { X, Y, pointf, pointi } from '../../lib/gui/point.js';
import {
    rect_and, rect_bottom_left, rect_bottom_right, rect_center, rect_contains_point, rect_contains_rect, rect_f32p, rect_f32p_ref,
    rect_i16p, rect_i16p_ref, rect_intersects_rect, rect_is_null, rect_move_bottom, rect_move_bottom_left, rect_move_bottom_right,
    rect_move_center,
    rect_move_left, rect_move_right, rect_move_top, rect_move_top_left, rect_move_top_right,
    rect_normalized, rect_or, rect_set, rect_set_bottom_left, rect_set_bottom_right, rect_set_size, rect_set_top_left,
    rect_set_top_right, rect_size, rect_top_left, rect_top_right, rect_translate, rect_translated, rect_transposed,
    rectf, recti,
    x1, x2, y1, y2
} from '../../lib/gui/rect.js';
import { HEIGHT, WIDTH, sizef, sizei } from '../../lib/gui/size.js';
import { test_point, test_rect, test_size } from '../test.js';


describe('rect constant test', () => {
    it(`x1_00`, () => { expect(x1).toBe(0); })
    it(`y1_00`, () => { expect(y1).toBe(1); })
    it(`x2_00`, () => { expect(x2).toBe(2); })
    it(`y2_00`, () => { expect(y2).toBe(3); })
})



describe(`recti test`, () => {
    it(`constructor_00`, () => {
        let a = new recti(57, -62, 64, -18);
        //console.log(a);
        test_rect(a, 57, -62, 120, -81, 57, -62, 64, -18, 0);

        let b = new recti(new pointi(57, -62), new pointi(64, -18));
        test_rect(b, 57, -62, 64, -18, 57, -62, 8, 45, 0);

        let c = new recti(new pointi(57, -62), new sizei(64, -18));
        test_rect(c, 57, -62, 120, -81, 57, -62, 64, -18, 0);

        let d = new recti(a);
        test_rect(d, 57, -62, 120, -81, 57, -62, 64, -18, 0);
    })
})

describe(`rectf test`, () => {
    it(`constructor_00`, () => {
        let a = new rectf(-35.0473394241, 50.5876223243, -28.1189977753, -0.303827768124);
        test_rect(a, -35.0473394241, 50.5876223243, -63.1663371995, 50.2837945561, -35.0473394241, 50.5876223243, -28.1189977753, -0.303827768124, 0);

        let b = new rectf(new pointf(-35.0473394241, 50.5876223243), new pointf(-28.1189977753, -0.303827768124));
        test_rect(b, -35.0473394241, 50.5876223243, -28.1189977753, -0.303827768124, -35.0473394241, 50.5876223243, 6.92834164877, -50.8914500924, 0);

        let c = new rectf(new pointf(-35.0473394241, 50.5876223243), new sizef(-28.1189977753, -0.303827768124));
        test_rect(c, -35.0473394241, 50.5876223243, -63.1663371995, 50.2837945561, -35.0473394241, 50.5876223243, -28.1189977753, -0.303827768124, 0);

        let d = new rectf(a);
        test_rect(d, -35.0473394241, 50.5876223243, -63.1663371995, 50.2837945561, -35.0473394241, 50.5876223243, -28.1189977753, -0.303827768124, 0);
    })
})

describe(`rect_i16p test`, () => {
    it(`constructor_00`, () => {
        let p = new pool();
        p.init(rect_i16p.BYTES_LENGTH * 4);
        let n = [-18, 22, 57, -81];
        let a = new rect_i16p(p, n[0], n[1], n[2], n[3]);
        test_rect(a, -18, 22, 38, -60, -18, 22, 57, -81, 0);

        let pa = new pointi(-18, 22);
        let pb = new pointi(57, -81);
        let b = new rect_i16p(p, pa, pb);
        test_rect(b, -18, 22, 57, -81, -18, 22, 76, -102, 0);

        let pc = new pointi(-18, 22);
        let pd = new sizei(57, -81);
        let c = new rect_i16p(p, pc, pd);
        test_rect(c, -18, 22, 38, -60, -18, 22, 57, -81, 0);

        let d = new rect_i16p(p, a);
        test_rect(d, -18, 22, 38, -60, -18, 22, 57, -81, 0);
    })
})

describe(`rect_i16p_ref test`, () => {
    it(`constructor_00`, () => {
        let p = new pool();
        p.init(rect_i16p.BYTES_LENGTH * 1);
        let n = [-34, 98, -26, -42];
        let a = new rect_i16p(p, n[0], n[1], n[2], n[3]);
        let b = new rect_i16p_ref(a.buffer, a.byteOffset);
        test_rect(b, -34, 98, -61, 55, -34, 98, -26, -42, 0);

    })
})

describe(`rect_f32p test`, () => {
    it(`constructor_00`, () => {
        let p = new pool();
        p.init(rect_f32p.BYTES_LENGTH * 4);
        let n = [33.517548774, 69.5584426954, -89.2158079198, 83.7239346978];
        let a = new rect_f32p(p, n[0], n[1], n[2], n[3]);
        test_rect(a, 33.517548774, 69.5584426954, -55.6982591458, 153.282377393, 33.517548774, 69.5584426954, -89.2158079198, 83.7239346978, 0);

        let pa = new pointf(33.517548774, 69.5584426954);
        let pb = new pointf(-89.2158079198, 83.7239346978);
        let b = new rect_f32p(p, pa, pb);
        test_rect(b, 33.517548774, 69.5584426954, -89.2158079198, 83.7239346978, 33.517548774, 69.5584426954, -122.733356694, 14.1654920024, 0);

        let pc = new pointf(33.517548774, 69.5584426954);
        let pd = new sizef(-89.2158079198, 83.7239346978);
        let c = new rect_f32p(p, pc, pd);
        test_rect(c, 33.517548774, 69.5584426954, -55.6982591458, 153.282377393, 33.517548774, 69.5584426954, -89.2158079198, 83.7239346978, 0);

        let d = new rect_f32p(p, a);
        test_rect(d, 33.517548774, 69.5584426954, -55.6982591458, 153.282377393, 33.517548774, 69.5584426954, -89.2158079198, 83.7239346978, 0);
    })
})

describe(`rect_f32p_ref test`, () => {
    it(`constructor_00`, () => {
        let p = new pool();
        p.init(rect_f32p.BYTES_LENGTH * 1);
        let n = [-79.4399814352, 17.7617144044, -23.6125808644, -63.8361590002];
        let a = new rect_f32p(p, n[0], n[1], n[2], n[3]);
        let b = new rect_f32p_ref(a.buffer, a.byteOffset);
        test_rect(b, -79.4399814352, 17.7617144044, -103.0525623, -46.0744445959, -79.4399814352, 17.7617144044, -23.6125808644, -63.8361590002, 0);

    })
})

describe(`rect function test`, () => {

    // Test suite for rect_set function using Jasmine

    describe('rect_set function', () => {
        let testRect;

        beforeEach(() => {
            // Create a new rectangle for each test
            testRect = new recti();
        });

        it('should set the coordinates of the rectangle to the specified values', () => {
            rect_set(testRect, 1, 2, 3, 4);
            expect(testRect[x1]).toBe(1);
            expect(testRect[y1]).toBe(2);
            expect(testRect[x2]).toBe(3);
            expect(testRect[y2]).toBe(4);
        });

        it('should return the modified rectangle with the updated coordinates', () => {
            const result = rect_set(testRect, 1, 2, 3, 4);
            expect(result).toBe(testRect);
        });

        it('should handle edge cases', () => {
            // Test with negative coordinates
            rect_set(testRect, -1, -2, -3, -4);
            expect(testRect[x1]).toBe(-1);
            expect(testRect[y1]).toBe(-2);
            expect(testRect[x2]).toBe(-3);
            expect(testRect[y2]).toBe(-4);

            // Test with zero coordinates
            rect_set(testRect, 0, 0, 0, 0);
            expect(testRect[x1]).toBe(0);
            expect(testRect[y1]).toBe(0);
            expect(testRect[x2]).toBe(0);
            expect(testRect[y2]).toBe(0);
        });
    });

    // Test suite for rect_is_null function using Jasmine

    describe('rect_is_null function', () => {
        it('should return true for a null rectangle', () => {
            const nullRect1 = new recti(0, 0, 0, 0);
            const nullRect2 = new rectf(0, 0, 0, 0);
            expect(rect_is_null(nullRect1)).toBe(true);
            expect(rect_is_null(nullRect2)).toBe(true);
        });

        it('should return false for a non-null rectangle', () => {
            const nonNullRect1 = new recti(0, 0, 1, 1);
            const nonNullRect2 = new rectf(0, 0, 1, 1);
            expect(rect_is_null(nonNullRect1)).toBe(false);
            expect(rect_is_null(nonNullRect2)).toBe(false);
        });

        it('should handle edge cases for integer and float rectangles', () => {
            // Test with integer rectangle
            const edgeRect1 = new recti(1, 1, 1, 1);
            expect(rect_is_null(edgeRect1)).toBe(false);

            // Test with float rectangle
            const edgeRect2 = new rectf(0.5, 0.5, 0, 0);
            expect(rect_is_null(edgeRect2)).toBe(true);
        });

        it(`rect_is_null_00`, () => {
            expect(rect_is_null(new recti())).toBeTrue();
            expect(rect_is_null(new rectf())).toBeTrue();
        })
    });

    // Test suite for rect_size function using Jasmine

    describe('rect_size function', () => {
        it('should calculate the size of the rectangle', () => {
            const rectangle = new recti(0, 0, 5, 5);
            const result = new sizei(0, 0);
            rect_size(rectangle, result);
            expect(result[WIDTH]).toBe(5);
            expect(result[HEIGHT]).toBe(5);
        });

        it('should handle negative coordinates', () => {
            const rectangle = new recti(-3, -3, 5, 5);
            const result = new sizei(0, 0);
            rect_size(rectangle, result);
            expect(result[WIDTH]).toBe(5);
            expect(result[HEIGHT]).toBe(5);
        });

        it('should handle float array coordinates', () => {
            const rectangle = new rectf(0.5, 0.5, 5.5, 5.5);
            const result = new sizef(0, 0);
            rect_size(rectangle, result);
            expect(result[WIDTH]).toBeCloseTo(5.5);
            expect(result[HEIGHT]).toBeCloseTo(5.5);
        });

        it(`rect_size_00`, () => {
            let a = new recti(-52, -72, -71, -72);
            let b = rect_size(a, new sizei());
            test_size(b, -71, -72, 0);
        })

        it(`rect_size_01`, () => {
            let a = new rectf(-35.2393003233, -43.9520572871, 69.2797390737, 56.2542317692);
            let b = rect_size(a, new sizef());
            test_size(b, 69.2797390737, 56.2542317692, 0);
        })
    });

    describe('rect_set_size function', () => {
        it('should set the size of the rectangle to the given size', () => {
            const rectangle = new recti(0, 0, 5, 5);
            const size = new sizei(10, 10);
            rect_set_size(rectangle, size);
            expect(rectangle[x2]).toBe(9);
            expect(rectangle[y2]).toBe(9);
        });

        it('should handle negative coordinates', () => {
            const rectangle = new recti(-3, -3, 5, 5);
            const size = new sizei(10, 10);
            rect_set_size(rectangle, size);
            expect(rectangle[x2]).toBe(6);
            expect(rectangle[y2]).toBe(6);
        });

        it('should handle float array coordinates', () => {
            const rectangle = new rectf(0.5, 0.5, 5.5, 5.5);
            const size = new sizef(10.5, 10.5);
            rect_set_size(rectangle, size);
            expect(rectangle[x2]).toBeCloseTo(11);
            expect(rectangle[y2]).toBeCloseTo(11);
        });

        it(`rect_set_size_00`, () => {
            let r1 = new recti(-87, 76, -25, -33);
            let s1 = new sizei(-94, -55);
            rect_set_size(r1, s1);
            test_rect(r1, -87, 76, -182, 20, -87, 76, -94, -55, 0);
            test_size(s1, -94, -55, 0);
        })

        it(`rect_set_size_01`, () => {
            let r1 = new rectf(44.0017469003, -11.9651095158, 65.5045406624, 45.5150232832);
            let s1 = new sizef(-68.8294969618, 43.0509382418);
            rect_set_size(r1, s1);
            test_rect(r1, 44.0017469003, -11.9651095158, -24.8277500615, 31.085828726, 44.0017469003, -11.9651095158, -68.8294969618, 43.0509382418, 0);
            test_size(s1, -68.8294969618, 43.0509382418, 0);
        })
    });


    describe('rect_top_left function', () => {
        it('should return the top-left corner position of the rectangle', () => {
            const rectangle = new recti(0, 0, 5, 5);
            const result = rect_top_left(rectangle);
            expect(result[X]).toBe(0);
            expect(result[Y]).toBe(0);
        });

        it('should return the top-left corner position of the rectangle with custom result object', () => {
            const rectangle = new recti(2, 3, 7, 8);
            const result = new pointf();
            const topLeft = rect_top_left(rectangle, result);
            expect(topLeft).toBe(result);
            expect(topLeft[X]).toBe(2);
            expect(topLeft[Y]).toBe(3);
        });

        it('should handle negative coordinates', () => {
            const rectangle = new recti(-3, -3, 5, 5);
            const result = rect_top_left(rectangle);
            expect(result[X]).toBe(-3);
            expect(result[Y]).toBe(-3);
        });

        it('should handle float array coordinates', () => {
            const rectangle = new rectf(0.5, 0.5, 5.5, 5.5);
            const result = rect_top_left(rectangle);
            expect(result[X]).toBeCloseTo(0.5);
            expect(result[Y]).toBeCloseTo(0.5);
        });

        it(`rect_corner_00`, () => {
            let a = new recti(-84, 77, 45, 35);
            let b = rect_top_left(a, new pointi());
            test_point(b, -84, 77, 0);

            let c = rect_bottom_right(a, new pointi());
            test_point(c, -40, 111, 0);

            let d = rect_top_right(a, new pointi());
            test_point(d, -40, 77, 0);

            let e = rect_bottom_left(a, new pointi());
            test_point(e, -84, 111, 0);

        })

        it(`rect_corner_01`, () => {
            let a = new rectf(41.5097522914, -63.1049735618, -51.2866625798, 21.2539662109);
            let b = rect_top_left(a, new pointf());
            test_point(b, 41.5097522914, -63.1049735618, 3);

            let c = rect_bottom_right(a, new pointf());
            test_point(c, -9.77691028834, -41.8510073509, 3);

            let d = rect_top_right(a, new pointf());
            test_point(d, -9.77691028834, -63.1049735618, 3);

            let e = rect_bottom_left(a, new pointf());
            test_point(e, 41.5097522914, -41.8510073509, 3);

        })
    });

    describe('rect_set_top_left function', () => {
        it('should set the top-left corner of the rectangle to the given position', () => {
            const rectangle = new recti(0, 0, 5, 5);
            const newPosition = new pointf(2, 3);
            const result = rect_set_top_left(rectangle, newPosition);
            expect(result[x1]).toBe(2);
            expect(result[y1]).toBe(3);
        });

        it('should handle negative coordinates', () => {
            const rectangle = new recti(-3, -3, 5, 5);
            const newPosition = new pointf(-1, -1);
            const result = rect_set_top_left(rectangle, newPosition);
            expect(result[x1]).toBe(-1);
            expect(result[y1]).toBe(-1);
        });

        it('should handle float coordinates', () => {
            const rectangle = new rectf(0.5, 0.5, 5.5, 5.5);
            const newPosition = new pointf(2.5, 3.5);
            const result = rect_set_top_left(rectangle, newPosition);
            expect(result[x1]).toBeCloseTo(2.5);
            expect(result[y1]).toBeCloseTo(3.5);
        });

        it('should return the position of the rectangle\'s bottom-right corner', () => {
            const rectangle = new recti(0, 0, 5, 5);
            const result = new pointf();
            const bottomRight = rect_bottom_right(rectangle, result);
            expect(bottomRight[X]).toBe(4);
            expect(bottomRight[Y]).toBe(4);
        });

        it('should handle negative coordinates', () => {
            const rectangle = new recti(-3, -3, 5, 5);
            const result = new pointf();
            const bottomRight = rect_bottom_right(rectangle, result);
            expect(bottomRight[X]).toBe(1);
            expect(bottomRight[Y]).toBe(1);
        });

        it('should handle float coordinates', () => {
            const rectangle = new rectf(0.5, 0.5, 5.5, 5.5);
            const result = new pointf();
            const bottomRight = rect_bottom_right(rectangle, result);
            expect(bottomRight[X]).toBeCloseTo(6);
            expect(bottomRight[Y]).toBeCloseTo(6);
        });

        it('should set the bottom-right corner of the rectangle to the given position', () => {
            const rectangle = new recti(0, 0, 5, 5);
            const newPosition = new pointf(10, 10);
            const modifiedRectangle = rect_set_bottom_right(rectangle, newPosition);
            expect(modifiedRectangle[x2]).toBe(10);
            expect(modifiedRectangle[y2]).toBe(10);
        });

        it('should handle negative coordinates', () => {
            const rectangle = new recti(-3, -3, 5, 5);
            const newPosition = new pointf(-1, -1);
            const modifiedRectangle = rect_set_bottom_right(rectangle, newPosition);
            expect(modifiedRectangle[x2]).toBe(-1);
            expect(modifiedRectangle[y2]).toBe(-1);
        });

        it('should handle float coordinates', () => {
            const rectangle = new rectf(0.5, 0.5, 5.5, 5.5);
            const newPosition = new pointf(2.5, 2.5);
            const modifiedRectangle = rect_set_bottom_right(rectangle, newPosition);
            expect(modifiedRectangle[x2]).toBeCloseTo(2.5);
            expect(modifiedRectangle[y2]).toBeCloseTo(2.5);
        });

        it('should return the position of the rectangle\'s top-right corner', () => {
            const rectangle = new recti(0, 0, 5, 5);
            const result = new pointf();
            const topRightCorner = rect_top_right(rectangle, result);
            expect(topRightCorner[X]).toBe(4);
            expect(topRightCorner[Y]).toBe(0);
        });

        it('should handle negative coordinates', () => {
            const rectangle = new recti(-3, -3, 5, 5);
            const result = new pointf();
            const topRightCorner = rect_top_right(rectangle, result);
            expect(topRightCorner[X]).toBe(1);
            expect(topRightCorner[Y]).toBe(-3);
        });

        it('should handle float coordinates', () => {
            const rectangle = new rectf(0.5, 0.5, 5.5, 5.5);
            const result = new pointf();
            const topRightCorner = rect_top_right(rectangle, result);
            expect(topRightCorner[X]).toBeCloseTo(6);
            expect(topRightCorner[Y]).toBeCloseTo(0.5);
        });

        it(`rect_set_corner_00`, () => {
            let a = new recti(81, -19, -99, 37);
            rect_set_top_left(a, new pointi(-61, -30));
            test_rect(a, -61, -30, -19, 17, -61, -30, 43, 48, 0);

            rect_set_bottom_right(a, new pointi(-68, 43));
            test_rect(a, -61, -30, -68, 43, -61, -30, -6, 74, 0);

            rect_set_top_right(a, new pointi(18, -34));
            test_rect(a, -61, -34, 18, 43, -61, -34, 80, 78, 0);

            rect_set_bottom_left(a, new pointi(7, -7));
            test_rect(a, 7, -34, 18, -7, 7, -34, 12, 28, 0);

        })

        it(`rect_set_corner_01`, () => {
            let a = new rectf(-69.8440545805, -9.34631776003, -43.503069371, 35.8251787532);
            rect_set_top_left(a, new pointf(51.0244616004, 55.4901401462));
            test_rect(a, 51.0244616004, 55.4901401462, -113.347123951, 26.4788609932, 51.0244616004, 55.4901401462, -164.371585552, -29.0112791531, 0);

            rect_set_bottom_right(a, new pointf(-9.00860821226, -62.3383398958));
            test_rect(a, 51.0244616004, 55.4901401462, -9.00860821226, -62.3383398958, 51.0244616004, 55.4901401462, -60.0330698126, -117.828480042, 0);

            rect_set_top_right(a, new pointf(25.2244308124, -26.8972965267));
            test_rect(a, 51.0244616004, -26.8972965267, 25.2244308124, -62.3383398958, 51.0244616004, -26.8972965267, -25.800030788, -35.4410433691, 0);

            rect_set_bottom_left(a, new pointf(-75.0594683032, 21.0552852814));
            test_rect(a, -75.0594683032, -26.8972965267, 25.2244308124, 21.0552852814, -75.0594683032, -26.8972965267, 100.283899116, 47.9525818081, 0);

        })
    });

    // Test suite for rect_center function
    describe("rect_center", () => {
        it("should calculate the center point of the rectangle", () => {
            const rectangle = [0, 0, 4, 4];
            const result = [0, 0];
            const center = rect_center(rectangle, result);
            expect(center[0]).toBe(2);
            expect(center[1]).toBe(2);
        });

        it("should handle negative coordinates", () => {
            const rectangle = [-2, -2, 2, 2];
            const result = [0, 0];
            const center = rect_center(rectangle, result);
            expect(center[0]).toBe(0);
            expect(center[1]).toBe(0);
        });

        it("should handle floating point coordinates", () => {
            const rectangle = [1.5, 1.5, 3.5, 3.5];
            const result = [0, 0];
            const center = rect_center(rectangle, result);
            expect(center[0]).toBe(2.5);
            expect(center[1]).toBe(2.5);
        });

        it("should handle large coordinates", () => {
            const rectangle = [1000000, 1000000, 1000004, 1000004];
            const result = [0, 0];
            const center = rect_center(rectangle, result);
            expect(center[0]).toBe(1000002);
            expect(center[1]).toBe(1000002);
        });

        it(`rect_center_00`, () => {
            let a = new recti(-38, 16, 28, -85);
            let b = rect_center(a, new pointi());
            test_rect(a, -38, 16, -11, -70, -38, 16, 28, -85, 0);
            test_point(b, -24, -27, 0);

        })

        it(`rect_center_01`, () => {
            let a = new rectf(98.8105195528, -96.539126056, -0.809519705814, 71.8018633604);
            let b = rect_center(a, new pointf());
            test_rect(a, 98.8105195528, -96.539126056, 98.000999847, -24.7372626956, 98.8105195528, -96.539126056, -0.809519705814, 71.8018633604, 3);
            test_point(b, 98.4057596999, -60.6381943758, 3);

        })
    });

    // Test suite for rect_move_left function
    describe('rect_move_left', () => {
        let rect;

        beforeEach(() => {
            // Initialize a rectangle for testing
            rect = [0, 0, 10, 10];
        });

        it('should move the left edge of the rectangle to the given x coordinate', () => {
            rect_move_left(rect, 5);
            expect(rect).toEqual([5, 0, 15, 10]);
        });

        it('should handle negative coordinates', () => {
            rect_move_left(rect, -5);
            expect(rect).toEqual([-5, 0, 5, 10]);
        });

        it('should handle floating point coordinates', () => {
            rect = [0.5, 0.5, 10.5, 10.5];
            rect_move_left(rect, 5.5);
            expect(rect).toEqual([5.5, 0.5, 15.5, 10.5]);
        });

        it('should handle edge case where left edge and right edge are the same', () => {
            rect = [5, 0, 5, 10];
            rect_move_left(rect, 2);
            expect(rect).toEqual([2, 0, 2, 10]);
        });
    });

    // Test suite for rect_move_top function
    describe('rect_move_top', () => {
        let rect;

        beforeEach(() => {
            // Initialize a rectangle for testing
            rect = [0, 0, 10, 10];
        });

        it('should move the top edge of the rectangle to the given y coordinate', () => {
            rect_move_top(rect, 5);
            expect(rect).toEqual([0, 5, 10, 15]);
        });

        it('should handle negative coordinates', () => {
            rect_move_top(rect, -5);
            expect(rect).toEqual([0, -5, 10, 5]);
        });

        it('should handle floating point coordinates', () => {
            rect = [0.5, 0.5, 10.5, 10.5];
            rect_move_top(rect, 5.5);
            expect(rect).toEqual([0.5, 5.5, 10.5, 15.5]);
        });

        it('should handle edge case where top edge and bottom edge are the same', () => {
            rect = [0, 5, 10, 5];
            rect_move_top(rect, 2);
            expect(rect).toEqual([0, 2, 10, 2]);
        });
    });

    // Test suite for rect_move_right function
    describe('rect_move_right', () => {
        let rect;

        beforeEach(() => {
            // Initialize a rectangle for testing
            rect = [0, 0, 10, 10];
        });

        it('should move the right edge of the rectangle to the given x coordinate', () => {
            rect_move_right(rect, 15);
            expect(rect).toEqual([5, 0, 15, 10]);
        });

        it('should handle negative coordinates', () => {
            rect_move_right(rect, -5);
            expect(rect).toEqual([-15, 0, -5, 10]);
        });

        it('should handle floating point coordinates', () => {
            rect = [0.5, 0.5, 10.5, 10.5];
            rect_move_right(rect, 15.5);
            expect(rect).toEqual([5.5, 0.5, 15.5, 10.5]);
        });

        it('should handle edge case where left edge and right edge are the same', () => {
            rect = [5, 0, 5, 10];
            rect_move_right(rect, 10);
            expect(rect).toEqual([10, 0, 10, 10]);
        });
    });

    // Test suite for rect_move_bottom function
    describe('rect_move_bottom', () => {
        let rect;

        beforeEach(() => {
            // Initialize a rectangle for testing
            rect = [0, 0, 10, 10];
        });

        it('should move the bottom edge of the rectangle to the given y coordinate', () => {
            rect_move_bottom(rect, 15);
            expect(rect).toEqual([0, 5, 10, 15]);
        });

        it('should handle negative coordinates', () => {
            rect_move_bottom(rect, -5);
            expect(rect).toEqual([0, -15, 10, -5]);
        });

        it('should handle floating point coordinates', () => {
            rect = [0.5, 0.5, 10.5, 10.5];
            rect_move_bottom(rect, 15.5);
            expect(rect).toEqual([0.5, 5.5, 10.5, 15.5]);
        });

        it('should handle edge case where top edge and bottom edge are the same', () => {
            rect = [0, 5, 10, 5];
            rect_move_bottom(rect, 10);
            expect(rect).toEqual([0, 10, 10, 10]);
        });
    });

    // Test suite for rect_move_top_left function
    describe('rect_move_top_left', () => {
        let rectangle;

        beforeEach(() => {
            // Initialize a new rectangle for each test
            rectangle = [0, 0, 10, 10]; // Example of a rectangle represented as an array
        });

        it('should move the rectangle to the new top-left corner position', () => {
            const newPosition = [5, 5];
            rect_move_top_left(rectangle, newPosition);
            expect(rectangle[0]).toBe(newPosition[0]);
            expect(rectangle[1]).toBe(newPosition[1]);
        });

        it('should adjust the bottom-right corner based on the new top-left corner position', () => {
            const newPosition = [5, 5];
            rect_move_top_left(rectangle, newPosition);
            expect(rectangle[2]).toBe(newPosition[0] + 10); // Assuming the width of the rectangle is 10
            expect(rectangle[3]).toBe(newPosition[1] + 10); // Assuming the height of the rectangle is 10
        });

        it('should handle negative coordinates', () => {
            const newPosition = [-5, -5];
            rect_move_top_left(rectangle, newPosition);
            expect(rectangle[0]).toBe(newPosition[0]);
            expect(rectangle[1]).toBe(newPosition[1]);
        });

        it('should handle zero coordinates', () => {
            const newPosition = [0, 0];
            rect_move_top_left(rectangle, newPosition);
            expect(rectangle[0]).toBe(newPosition[0]);
            expect(rectangle[1]).toBe(newPosition[1]);
        });

    });

    // Test suite for rect_move_bottom_right function
    describe('rect_move_bottom_right', () => {
        let rectangle;

        beforeEach(() => {
            // Initialize a rectangle for testing
            rectangle = [0, 0, 10, 10];
        });

        it('should move the rectangle to the new position', () => {
            const newPosition = [15, 15];
            rect_move_bottom_right(rectangle, newPosition);
            expect(rectangle[0]).toBe(5);
            expect(rectangle[2]).toBe(15);
            expect(rectangle[1]).toBe(5);
            expect(rectangle[3]).toBe(15);
        });

        it('should handle negative coordinates', () => {
            const newPosition = [-5, -5];
            rect_move_bottom_right(rectangle, newPosition);
            expect(rectangle[0]).toBe(-15);
            expect(rectangle[2]).toBe(-5);
            expect(rectangle[1]).toBe(-15);
            expect(rectangle[3]).toBe(-5);
        });

        it('should handle zero coordinates', () => {
            const newPosition = [0, 0];
            rect_move_bottom_right(rectangle, newPosition);
            expect(rectangle[0]).toBe(-10);
            expect(rectangle[2]).toBe(0);
            expect(rectangle[1]).toBe(-10);
            expect(rectangle[3]).toBe(0);
        });
    });

    // Test suite for rect_move_top_right function
    describe('rect_move_top_right', () => {
        let rectangle;

        beforeEach(() => {
            // Initialize a rectangle for testing
            rectangle = [0, 0, 10, 10];
        });

        it('should move the rectangle to the new position', () => {
            const newPosition = [15, 15];
            rect_move_top_right(rectangle, newPosition);
            expect(rectangle[0]).toBe(5);
            expect(rectangle[2]).toBe(15);
            expect(rectangle[1]).toBe(15);
            expect(rectangle[3]).toBe(25);
        });

        it('should handle negative coordinates', () => {
            const newPosition = [-5, -5];
            rect_move_top_right(rectangle, newPosition);
            expect(rectangle[0]).toBe(-15);
            expect(rectangle[2]).toBe(-5);
            expect(rectangle[1]).toBe(-5);
            expect(rectangle[3]).toBe(5);
        });

        it('should handle zero coordinates', () => {
            const newPosition = [0, 0];
            rect_move_top_right(rectangle, newPosition);
            expect(rectangle[0]).toBe(-10);
            expect(rectangle[2]).toBe(0);
            expect(rectangle[1]).toBe(0);
            expect(rectangle[3]).toBe(10);
        });

        it('should handle already positioned at the given position', () => {
            const newPosition = [10, 10];
            rect_move_top_right(rectangle, newPosition);
            expect(rectangle[0]).toBe(0);
            expect(rectangle[2]).toBe(10);
            expect(rectangle[1]).toBe(10);
            expect(rectangle[3]).toBe(20);
        });
    });

    // Test suite for rect_move_bottom_left function
    describe('rect_move_bottom_left', () => {
        let rectangle;

        beforeEach(() => {
            // Initialize a rectangle for each test
            rectangle = [0, 0, 10, 10];
        });

        it('should move the bottom-left corner to the given position', () => {
            const newPosition = [5, 5];
            const expectedRectangle = [5, -5, 15, 5];
            expect(rect_move_bottom_left(rectangle, newPosition)).toEqual(expectedRectangle);
        });

        it('should handle negative coordinates', () => {
            const newPosition = [-5, -5];
            const expectedRectangle = [-5, -15, 5, -5];
            expect(rect_move_bottom_left(rectangle, newPosition)).toEqual(expectedRectangle);
        });

        it('should handle zero coordinates', () => {
            const newPosition = [0, 0];
            const expectedRectangle = [0, -10, 10, 0];
            expect(rect_move_bottom_left(rectangle, newPosition)).toEqual(expectedRectangle);
        });

        it('should handle large coordinates', () => {
            const newPosition = [1000, 1000];
            const expectedRectangle = [1000, 990, 1010, 1000];
            expect(rect_move_bottom_left(rectangle, newPosition)).toEqual(expectedRectangle);
        });

        it('should handle floating point coordinates', () => {
            const newPosition = [2.5, 2.5];
            const expectedRectangle = [2.5, -7.5, 12.5, 2.5];
            expect(rect_move_bottom_left(rectangle, newPosition)).toEqual(expectedRectangle);
        });
    });

    // Test suite for rect_move_center function
    describe('rect_move_center', () => {
        let rectangle;

        beforeEach(() => {
            // Initialize a rectangle for each test
            rectangle = [0, 0, 10, 10];
        });

        it('should move the center point to the given position', () => {
            const newPosition = [5, 5];
            const expectedRectangle = [0, 0, 10, 10];
            expect(rect_move_center(rectangle, newPosition)).toEqual(expectedRectangle);
        });

        it('should handle negative coordinates', () => {
            const newPosition = [-5, -5];
            const expectedRectangle = [-10, -10, 0, 0];
            expect(rect_move_center(rectangle, newPosition)).toEqual(expectedRectangle);
        });

        it('should handle zero coordinates', () => {
            const newPosition = [0, 0];
            const expectedRectangle = [-5, -5, 5, 5];
            expect(rect_move_center(rectangle, newPosition)).toEqual(expectedRectangle);
        });

        it('should handle large coordinates', () => {
            const newPosition = [1000, 1000];
            const expectedRectangle = [995, 995, 1005, 1005];
            expect(rect_move_center(rectangle, newPosition)).toEqual(expectedRectangle);
        });

        it('should handle floating point coordinates', () => {
            const newPosition = [3.5, 3.5];
            const expectedRectangle = [-1.5, -1.5, 8.5, 8.5];
            expect(rect_move_center(rectangle, newPosition)).toEqual(expectedRectangle);
        });
    });


    it(`rect_translate_00`, () => {
        let a = new recti(0, -100, -30, 32);
        rect_translate(a, -26, 48);
        test_rect(a, -26, -52, -57, -21, -26, -52, -30, 32, 0);

        rect_translate(a, new pointi(10, -67));
        test_rect(a, -16, -119, -47, -88, -16, -119, -30, 32, 0);

        let b = rect_translated(a, 5, 11, new recti());
        test_rect(a, -16, -119, -47, -88, -16, -119, -30, 32, 0);
        test_rect(b, -11, -108, -42, -77, -11, -108, -30, 32, 0);

        let c = rect_translated(a, new pointi(-30, 56), new recti());
        test_rect(a, -16, -119, -47, -88, -16, -119, -30, 32, 0);
        test_rect(c, -46, -63, -77, -32, -46, -63, -30, 32, 0);

    })

    it(`rect_translate_01`, () => {
        let a = new rectf(-83.1929510754, 76.078303079, -44.9505050137, -47.6006263985);
        rect_translate(a, -73.2829307028, -14.7764325659);
        test_rect(a, -156.475881778, 61.3018705131, -201.426386792, 13.7012441146, -156.475881778, 61.3018705131, -44.9505050137, -47.6006263985, 3);

        rect_translate(a, new pointf(-41.4806190864, 62.7877252887));
        test_rect(a, -197.956500865, 124.089595802, -242.907005878, 76.4889694033, -197.956500865, 124.089595802, -44.9505050137, -47.6006263985, 3);

        let b = rect_translated(a, 78.1491586444, 69.3967280059, new rectf());
        test_rect(a, -197.956500865, 124.089595802, -242.907005878, 76.4889694033, -197.956500865, 124.089595802, -44.9505050137, -47.6006263985, 3);
        test_rect(b, -119.80734222, 193.486323808, -164.757847234, 145.885697409, -119.80734222, 193.486323808, -44.9505050137, -47.6006263985, 3);

        let c = rect_translated(a, new pointf(-58.6576320679, -51.8534461694), new rectf());
        test_rect(a, -197.956500865, 124.089595802, -242.907005878, 76.4889694033, -197.956500865, 124.089595802, -44.9505050137, -47.6006263985, 3);
        test_rect(c, -256.614132933, 72.2361496324, -301.564637946, 24.6355232339, -256.614132933, 72.2361496324, -44.9505050137, -47.6006263985, 3);

    })

    it(`rect_transposed_00`, () => {
        let a = new recti(-43, 14, 9, -53);
        let b = rect_transposed(a, new recti());
        test_rect(a, -43, 14, -35, -40, -43, 14, 9, -53, 0);
        test_rect(b, -43, 14, -97, 22, -43, 14, -53, 9, 0);

    })

    it(`rect_transposed_01`, () => {
        let a = new rectf(-7.3265729203, 28.5698330323, -42.2929824248, 56.1868992822);
        let b = rect_transposed(a, new rectf());
        test_rect(a, -7.3265729203, 28.5698330323, -49.6195553451, 84.7567323145, -7.3265729203, 28.5698330323, -42.2929824248, 56.1868992822, 3);
        test_rect(b, -7.3265729203, 28.5698330323, 48.8603263619, -13.7231493925, -7.3265729203, 28.5698330323, 56.1868992822, -42.2929824248, 3);

    })

    it(`rect_normalized_00`, () => {
        let a = new recti(73, -43, -11, 70);
        let b = rect_normalized(a, new recti());
        test_rect(a, 73, -43, 61, 26, 73, -43, -11, 70, 0);
        test_rect(b, 62, -43, 72, 26, 62, -43, 11, 70, 0);

    })

    it(`rect_normalized_01`, () => {
        let a = new recti(35, -29, 57, 81);
        let b = rect_normalized(a, new recti());
        test_rect(a, 35, -29, 91, 51, 35, -29, 57, 81, 0);
        test_rect(b, 35, -29, 91, 51, 35, -29, 57, 81, 0);

    })

    it(`rect_normalized_02`, () => {
        let a = new rectf(-17.6741760898, -82.7232051748, -68.3788528513, 50.9963675092);
        let b = rect_normalized(a, new rectf());
        test_rect(a, -17.6741760898, -82.7232051748, -86.0530289411, -31.7268376655, -17.6741760898, -82.7232051748, -68.3788528513, 50.9963675092, 0);
        test_rect(b, -86.0530289411, -82.7232051748, -17.6741760898, -31.7268376655, -86.0530289411, -82.7232051748, 68.3788528513, 50.9963675092, 0);

    })

    it(`rect_normalized_03`, () => {
        let a = new rectf(62.153895353, 94.3245963193, 64.2132951353, 20.5747539721);
        let b = rect_normalized(a, new rectf());
        test_rect(a, 62.153895353, 94.3245963193, 126.367190488, 114.899350291, 62.153895353, 94.3245963193, 64.2132951353, 20.5747539721, 0);
        test_rect(b, 62.153895353, 94.3245963193, 126.367190488, 114.899350291, 62.153895353, 94.3245963193, 64.2132951353, 20.5747539721, 0);

    })

    it(`rect_add_00`, () => {
        let a = new recti(-73, -38, 32, -73);
        let b = new recti(-91, 26, 47, -74);
        let c = rect_and(a, b, new recti());
        test_rect(a, -73, -38, -42, -112, -73, -38, 32, -73, 0);
        test_rect(b, -91, 26, -45, -49, -91, 26, 47, -74, 0);
        test_rect(c, -73, -48, -45, -39, -73, -48, 29, 10, 0);

    })

    it(`rect_add_01`, () => {
        let a = new recti(-48, 89, -57, -19);
        let b = new recti(6, 41, 92, 35);
        let c = rect_and(a, b, new recti());
        test_rect(a, -48, 89, -106, 69, -48, 89, -57, -19, 0);
        test_rect(b, 6, 41, 97, 75, 6, 41, 92, 35, 0);
        test_rect(c, 0, 0, -1, -1, 0, 0, 0, 0, 0);

    })

    it(`rect_add_02`, () => {
        let a = new rectf(-25.0815360643, -94.203184335, 79.254766152, 82.6234374115);
        let b = new rectf(-33.2210111832, -34.3308075763, 46.592790894, -62.5146983404);
        let c = rect_and(a, b, new rectf());
        test_rect(a, -25.0815360643, -94.203184335, 54.1732300877, -11.5797469235, -25.0815360643, -94.203184335, 79.254766152, 82.6234374115, 3);
        test_rect(b, -33.2210111832, -34.3308075763, 13.3717797108, -96.8455059167, -33.2210111832, -34.3308075763, 46.592790894, -62.5146983404, 3);
        test_rect(c, -25.0815360643, -94.203184335, 13.3717797108, -34.3308075763, -25.0815360643, -94.203184335, 38.4533157751, 59.8723767586, 3);

    })

    it(`rect_add_03`, () => {
        let a = new rectf(-70.1249557992, -48.442149713, 62.2385013485, 63.6193770551);
        let b = new rectf(98.6176721287, 66.1500199915, -86.630509946, 97.3501258952);
        let c = rect_and(a, b, new rectf());
        test_rect(a, -70.1249557992, -48.442149713, -7.88645445067, 15.1772273421, -70.1249557992, -48.442149713, 62.2385013485, 63.6193770551, 3);
        test_rect(b, 98.6176721287, 66.1500199915, 11.9871621827, 163.500145887, 98.6176721287, 66.1500199915, -86.630509946, 97.3501258952, 3);
        test_rect(c, 0, 0, 0, 0, 0, 0, 0, 0, 3);

    })

    it(`rect_or_00`, () => {
        let a = new recti(40, 95, 31, -5);
        let b = new recti(-50, 24, -29, -53);
        let c = rect_or(a, b, new recti());
        test_rect(a, 40, 95, 70, 89, 40, 95, 31, -5, 0);
        test_rect(b, -50, 24, -80, -30, -50, 24, -29, -53, 0);
        test_rect(c, -79, -29, 70, 94, -79, -29, 150, 124, 0);

    })

    it(`rect_or_01`, () => {
        let a = new recti(24, -65, -59, 33);
        let b = new recti(-65, -77, 94, 65);
        let c = rect_or(a, b, new recti());
        test_rect(a, 24, -65, -36, -33, 24, -65, -59, 33, 0);
        test_rect(b, -65, -77, 28, -13, -65, -77, 94, 65, 0);
        test_rect(c, -65, -77, 28, -13, -65, -77, 94, 65, 0);

    })

    it(`rect_or_02`, () => {
        let a = new rectf(-10.1465928763, -57.3300417345, 69.9376480056, 22.4652710326);
        let b = new rectf(-18.9575795858, -85.4794659123, -43.0250005878, -43.7902195847);
        let c = rect_or(a, b, new rectf());
        test_rect(a, -10.1465928763, -57.3300417345, 59.7910551293, -34.864770702, -10.1465928763, -57.3300417345, 69.9376480056, 22.4652710326, 3);
        test_rect(b, -18.9575795858, -85.4794659123, -61.9825801736, -129.269685497, -18.9575795858, -85.4794659123, -43.0250005878, -43.7902195847, 3);
        test_rect(c, -61.9825801736, -129.269685497, 59.7910551293, -34.864770702, -61.9825801736, -129.269685497, 121.773635303, 94.404914795, 3);

    })

    it(`rect_or_03`, () => {
        let a = new rectf(-45.1192427355, 48.5762611183, 60.0374293846, 39.8798695893);
        let b = new rectf(-59.9315007562, 39.81940094, 98.7624272126, 74.6121155186);
        let c = rect_or(a, b, new rectf());
        test_rect(a, -45.1192427355, 48.5762611183, 14.9181866491, 88.4561307075, -45.1192427355, 48.5762611183, 60.0374293846, 39.8798695893, 3);
        test_rect(b, -59.9315007562, 39.81940094, 38.8309264564, 114.431516459, -59.9315007562, 39.81940094, 98.7624272126, 74.6121155186, 3);
        test_rect(c, -59.9315007562, 39.81940094, 38.8309264564, 114.431516459, -59.9315007562, 39.81940094, 98.7624272126, 74.6121155186, 3);

    })

    it(`rect_contains_point_00`, () => {
        let a = new recti(24, 17, -100, -50);
        let b = new pointi(-54, 12);
        expect(rect_contains_point(a, b)).toBeTrue();
        expect(rect_contains_point(a, -54, 12)).toBeTrue();
        test_rect(a, 24, 17, -77, -34, 24, 17, -100, -50, 0);
        test_point(b, -54, 12, 0);
    })

    it(`rect_contains_point_01`, () => {
        let a = new recti(-52, 82, 76, 8);
        let b = new pointi(-38, -43);
        expect(rect_contains_point(a, b)).toBeFalse();
        expect(rect_contains_point(a, -38, -43)).toBeFalse();
        test_rect(a, -52, 82, 23, 89, -52, 82, 76, 8, 0);
        test_point(b, -38, -43, 0);
    })

    it(`rect_contains_point_02`, () => {
        let a = new rectf(69.4485631682, -3.80355116247, 52.1500067687, -64.9707357453);
        let b = new pointf(89.4794180436, -6.91700010884);
        expect(rect_contains_point(a, b)).toBeTrue();
        expect(rect_contains_point(a, 89.4794180436, -6.91700010884)).toBeTrue();
        test_rect(a, 69.4485631682, -3.80355116247, 121.598569937, -68.7742869078, 69.4485631682, -3.80355116247, 52.1500067687, -64.9707357453, 0);
        test_point(b, 89.4794180436, -6.91700010884, 0);
    })

    it(`rect_contains_point_03`, () => {
        let a = new rectf(83.675411063, 31.2150254752, 70.6612151499, -71.9454837057);
        let b = new pointf(62.2293881624, 13.3976519608);
        expect(rect_contains_point(a, b)).toBeFalse();
        expect(rect_contains_point(a, 62.2293881624, 13.3976519608)).toBeFalse();
        test_rect(a, 83.675411063, 31.2150254752, 154.336626213, -40.7304582306, 83.675411063, 31.2150254752, 70.6612151499, -71.9454837057, 0);
        test_point(b, 62.2293881624, 13.3976519608, 0);
    })

    it(`rect_contains_rect_00`, () => {
        let a = new recti(-89, 17, 32, 89);
        let b = new recti(-87, 99, 16, -12);
        expect(rect_contains_rect(a, b)).toBeTrue();
        test_rect(a, -89, 17, -58, 105, -89, 17, 32, 89, 0);
        test_rect(b, -87, 99, -72, 86, -87, 99, 16, -12, 0);
    })

    it(`rect_contains_rect_01`, () => {
        let a = new recti(-82, 9, 29, 66);
        let b = new recti(-65, 17, -55, 56);
        expect(rect_contains_rect(a, b)).toBeFalse();
        test_rect(a, -82, 9, -54, 74, -82, 9, 29, 66, 0);
        test_rect(b, -65, 17, -121, 72, -65, 17, -55, 56, 0);
    })

    it(`rect_contains_rect_02`, () => {
        let a = new rectf(-15.982571613, 99.4641676166, -43.0152308759, -86.7819501567);
        let b = new rectf(-26.3529715893, 66.0393850733, -13.2763344853, -16.6686116139);
        expect(rect_contains_rect(a, b)).toBeTrue();
        test_rect(a, -15.982571613, 99.4641676166, -58.9978024889, 12.6822174599, -15.982571613, 99.4641676166, -43.0152308759, -86.7819501567, 0);
        test_rect(b, -26.3529715893, 66.0393850733, -39.6293060746, 49.3707734593, -26.3529715893, 66.0393850733, -13.2763344853, -16.6686116139, 0);
    })

    it(`rect_contains_rect_03`, () => {
        let a = new rectf(88.9022409507, -95.2583163972, 77.1453576513, -8.00285284664);
        let b = new rectf(-11.4001630063, -26.5969683094, -45.6825982554, -98.3948009909);
        expect(rect_contains_rect(a, b)).toBeFalse();
        test_rect(a, 88.9022409507, -95.2583163972, 166.047598602, -103.261169244, 88.9022409507, -95.2583163972, 77.1453576513, -8.00285284664, 0);
        test_rect(b, -11.4001630063, -26.5969683094, -57.0827612617, -124.9917693, -11.4001630063, -26.5969683094, -45.6825982554, -98.3948009909, 0);
    })

    it(`rect_intersects_rect_00`, () => {
        let a = new recti(-80, -8, -96, 63);
        let b = new recti(-20, 26, -83, 30);
        expect(rect_intersects_rect(a, b)).toBeTrue();
        test_rect(a, -80, -8, -177, 54, -80, -8, -96, 63, 0);
        test_rect(b, -20, 26, -104, 55, -20, 26, -83, 30, 0);
    })

    it(`rect_intersects_rect_01`, () => {
        let a = new recti(55, -7, 96, -32);
        let b = new recti(0, -17, 20, 3);
        expect(rect_intersects_rect(a, b)).toBeFalse();
        test_rect(a, 55, -7, 150, -40, 55, -7, 96, -32, 0);
        test_rect(b, 0, -17, 19, -15, 0, -17, 20, 3, 0);
    })

    it(`rect_intersects_rect_02`, () => {
        let a = new rectf(-89.8404531868, -50.7954300317, -85.2409449117, 67.6188185964);
        let b = new rectf(-91.9447096595, 41.2557784401, 67.4876261121, -49.2864411106);
        expect(rect_intersects_rect(a, b)).toBeTrue();
        test_rect(a, -89.8404531868, -50.7954300317, -175.081398098, 16.8233885647, -89.8404531868, -50.7954300317, -85.2409449117, 67.6188185964, 0);
        test_rect(b, -91.9447096595, 41.2557784401, -24.4570835475, -8.03066267055, -91.9447096595, 41.2557784401, 67.4876261121, -49.2864411106, 0);
    })

    it(`rect_intersects_rect_03`, () => {
        let a = new rectf(36.645147321, 99.9432405158, -55.2366837649, -67.4067655604);
        let b = new rectf(69.8032135746, 53.5150188076, 38.6916349271, -0.588093062446);
        expect(rect_intersects_rect(a, b)).toBeFalse();
        test_rect(a, 36.645147321, 99.9432405158, -18.5915364439, 32.5364749555, 36.645147321, 99.9432405158, -55.2366837649, -67.4067655604, 0);
        test_rect(b, 69.8032135746, 53.5150188076, 108.494848502, 52.9269257451, 69.8032135746, 53.5150188076, 38.6916349271, -0.588093062446, 0);
    })

})
