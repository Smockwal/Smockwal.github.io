import { numb } from '../../lib/math/number.js';
import {
    X, Y,
    vec2_add, vec2_deg_angle,
    vec2_dist_to_point_sqr,
    vec2_dist_vec2,
    vec2_div, vec2_dot_product, vec2_equals, vec2_fuzzy_equals, vec2_is_fuzzy_null, vec2_is_null,
    vec2_length, vec2_length_square, vec2_mult, vec2_normalize, vec2_normalized, vec2_rad_angle, vec2_rem,
    vec2d,
    vec2f
} from '../../lib/math/vec2.js';

const test_vec2 = (vec, x, y) => {
    expect(vec[X]).toBeCloseTo(x, 3);
    expect(vec[Y]).toBeCloseTo(y, 3);
}
describe('vec2f', () => {
    it('should create a vec2f with default values', () => {
        const vec = new vec2f();
        expect(vec.x).toBe(0);
        expect(vec.y).toBe(0);
        expect(vec.kind).toBe('vec2');
    });

    it('should create a vec2f with given x and y values', () => {
        const vec = new vec2f(3, 4);
        expect(vec.x).toBe(3);
        expect(vec.y).toBe(4);
    });

    it('should create a vec2f with given array values', () => {
        const vec = new vec2f([1, 2]);
        expect(vec.x).toBe(1);
        expect(vec.y).toBe(2);
    });

    it('should set x and y values individually', () => {
        const vec = new vec2f();
        vec.x = 5;
        vec.y = 6;
        expect(vec.x).toBe(5);
        expect(vec.y).toBe(6);
    });

    it('should return rounded x and y values', () => {
        const vec = new vec2f(1.7, 2.3);
        expect(vec.xi).toBe(2);
        expect(vec.yi).toBe(2);
    });

    it('should handle setting x and y to NaN', () => {
        const vec = new vec2f(NaN, NaN);
        expect(isNaN(vec.x)).toBe(false);
        expect(isNaN(vec.y)).toBe(false);
    });

    it('should handle setting x and y to Infinity', () => {
        const vec = new vec2f(Infinity, -Infinity);
        expect(vec.x).toBe(Infinity);
        expect(vec.y).toBe(-Infinity);
    });

    it('should handle setting x and y to null', () => {
        const vec = new vec2f(null, null);
        expect(vec.x).toBe(0);
        expect(vec.y).toBe(0);
    });

    it('should handle setting x and y to undefined', () => {
        const vec = new vec2f(undefined, undefined);
        expect(vec.x).toBe(0);
        expect(vec.y).toBe(0);
    });

    it('should handle setting x and y to non-numeric values', () => {
        const vec = new vec2f('a', 'b');
        expect(isNaN(vec.x)).toBe(true);
        expect(isNaN(vec.y)).toBe(true);
    });

    it('should handle setting x and y from an array with more than two elements', () => {
        const vec = new vec2f([7, 8, 9]);
        expect(vec.x).toBe(7);
        expect(vec.y).toBe(8);
    });

    it('should handle setting x and y from an array with less than two elements', () => {
        const vec = new vec2f([10]);
        expect(vec.x).toBe(10);
        expect(vec.y).toBe(0);
    });
});

describe('vec2d', () => {
    let vec;

    beforeEach(() => {
        vec = new vec2d();
    });

    describe('constructor', () => {
        it('should initialize to (0, 0) when no arguments are passed', () => {
            expect(vec.x).toBe(0);
            expect(vec.y).toBe(0);
        });

        it('should initialize to given (x, y) values', () => {
            vec = new vec2d(3.14, 2.72);
            expect(vec.x).toBe(3.14);
            expect(vec.y).toBe(2.72);
        });

        it('should initialize to values from an array', () => {
            vec = new vec2d([1.618, 2.718]);
            expect(vec.x).toBe(1.618);
            expect(vec.y).toBe(2.718);
        });

        it('should handle incorrect array input gracefully', () => {
            vec = new vec2d([1.618]);
            expect(vec.x).toBe(1.618);
            expect(vec.y).toBe(0);
        });

        it('should handle non-number and non-array input gracefully', () => {
            vec = new vec2d('invalid');
            expect(vec.x).toBeNaN();
            expect(vec.y).toBe(0);
        });
    });

    describe('getters and setters', () => {
        it('should get and set x coordinate correctly', () => {
            vec.x = 1.23;
            expect(vec.x).toBe(1.23);
        });

        it('should get and set y coordinate correctly', () => {
            vec.y = 4.56;
            expect(vec.y).toBe(4.56);
        });

        it('should get xi as rounded x coordinate', () => {
            vec.x = 1.49;
            expect(vec.xi).toBe(1);
            vec.x = 1.5;
            expect(vec.xi).toBe(2);
        });

        it('should get yi as rounded y coordinate', () => {
            vec.y = 4.49;
            expect(vec.yi).toBe(4);
            vec.y = 4.5;
            expect(vec.yi).toBe(5);
        });

        it('should return type as "vec2"', () => {
            expect(vec.kind).toBe('vec2');
        });
    });

    describe('edge cases', () => {
        it('should handle negative values', () => {
            vec = new vec2d(-1.23, -4.56);
            expect(vec.x).toBe(-1.23);
            expect(vec.y).toBe(-4.56);
        });

        it('should handle very large values', () => {
            vec = new vec2d(1e308, 1e308);
            expect(vec.x).toBe(1e308);
            expect(vec.y).toBe(1e308);
        });

        it('should handle very small values', () => {
            vec = new vec2d(1e-308, 1e-308);
            expect(vec.x).toBe(1e-308);
            expect(vec.y).toBe(1e-308);
        });

        it('should handle setting x to NaN', () => {
            vec.x = NaN;
            expect(vec.x).toBeNaN();
        });

        it('should handle setting y to NaN', () => {
            vec.y = NaN;
            expect(vec.y).toBeNaN();
        });

        it('should handle setting x to Infinity', () => {
            vec.x = Infinity;
            expect(vec.x).toBe(Infinity);
        });

        it('should handle setting y to Infinity', () => {
            vec.y = Infinity;
            expect(vec.y).toBe(Infinity);
        });
    });
});

describe('vec2 function', () => {

    describe('vec2_is_null', () => {
        it('returns true if x and y are both 0', () => {
            expect(vec2_is_null([0, 0])).toBe(true);
        });

        it('returns false if x is not 0', () => {
            expect(vec2_is_null([1, 0])).toBe(false);
        });

        it('returns false if y is not 0', () => {
            expect(vec2_is_null([0, 1])).toBe(false);
        });

        it('returns false if both x and y are not 0', () => {
            expect(vec2_is_null([1, 1])).toBe(false);
        });

        it('returns true for edge case when x and y are very close to 0', () => {
            expect(vec2_is_null([1e-15, 1e-15])).toBe(false);
        });

        it('returns true for edge case when x and y are negative 0', () => {
            expect(vec2_is_null([-0, -0])).toBe(true);
        });

        it('returns true for edge case when x and y are NaN', () => {
            expect(vec2_is_null([NaN, NaN])).toBe(false);
        });

        it('returns false if the input is not an array', () => {
            expect(vec2_is_null(null)).toBe(false);
        });

        it('returns false if the input array has length less than 2', () => {
            expect(vec2_is_null([0])).toBe(false);
        });

        it(`is_null_00`, () => {
            let a = new vec2f();
            expect(vec2_is_null(a)).toBeTrue();

            let b = new vec2f(numb.frand(-100, 100), numb.frand(-100, 100));
            expect(vec2_is_null(b)).toBeFalse();
        })
    });

    describe("vec2_is_fuzzy_null function", () => {
        // Test case for a vector with both coordinates close to zero
        it("should return true for a vector with both coordinates close to zero", () => {
            const vec = [0.000001, 0.000001];
            expect(vec2_is_fuzzy_null(vec)).toBe(true);
        });

        // Test case for a vector with one coordinate close to zero
        it("should return false for a vector with one coordinate close to zero", () => {
            const vec = [0.0001, 1.0];
            expect(vec2_is_fuzzy_null(vec)).toBe(false);
        });

        // Test case for a vector with both coordinates not close to zero
        it("should return false for a vector with both coordinates not close to zero", () => {
            const vec = [1.0, 1.0];
            expect(vec2_is_fuzzy_null(vec)).toBe(false);
        });

        // Test case for a vector with both coordinates as zero
        it("should return true for a vector with both coordinates as zero", () => {
            const vec = [0, 0];
            expect(vec2_is_fuzzy_null(vec)).toBe(true);
        });

        // Test case for a vector with both coordinates as NaN
        it("should return false for a vector with both coordinates as NaN", () => {
            const vec = [NaN, NaN];
            expect(vec2_is_fuzzy_null(vec)).toBe(false);
        });

        // Test case for a vector with both coordinates as Infinity
        it("should return false for a vector with both coordinates as Infinity", () => {
            const vec = [Infinity, Infinity];
            expect(vec2_is_fuzzy_null(vec)).toBe(false);
        });

        it(`vec2_is_fuzzy_null_00`, () => {
            let a = new vec2f();
            expect(vec2_is_fuzzy_null(a)).toBeTrue();

            let b = new vec2f(Number.EPSILON, Number.EPSILON);
            expect(vec2_is_fuzzy_null(a)).toBeTrue();

            let c = new vec2f(numb.frand(-100, 100), numb.frand(-100, 100));
            expect(vec2_is_fuzzy_null(c)).toBeFalse();
        })
    });


    describe("vec2_equals", () => {
        // Test case for two equal vectors
        it("returns true for two equal vectors", () => {
            const v1 = [1, 2];
            const v2 = [1, 2];
            expect(vec2_equals(v1, v2)).toBeTrue();
        });

        // Test case for two unequal vectors
        it("returns false for two unequal vectors", () => {
            const v1 = [1, 2];
            const v2 = [3, 4];
            expect(vec2_equals(v1, v2)).toBeFalse();
        });

        // Test case for vectors with one coordinate different
        it("returns false for vectors with one coordinate different", () => {
            const v1 = [1, 2];
            const v2 = [1, 3];
            expect(vec2_equals(v1, v2)).toBeFalse();
        });

        // Test case for vectors with different data types
        it("returns false for vectors with different data types", () => {
            const v1 = [1, 2];
            const v2 = [1, "2"];
            expect(vec2_equals(v1, v2)).toBeFalse();
        });

        // Test case for vectors with NaN coordinates
        it("returns false for vectors with NaN coordinates", () => {
            const v1 = [NaN, 2];
            const v2 = [1, 2];
            expect(vec2_equals(v1, v2)).toBeFalse();
        });

        // Test case for vectors with undefined coordinates
        it("returns false for vectors with undefined coordinates", () => {
            const v1 = [undefined, 2];
            const v2 = [1, 2];
            expect(vec2_equals(v1, v2)).toBeFalse();
        });

        // Test case for vectors with null coordinates
        it("returns false for vectors with null coordinates", () => {
            const v1 = [null, 2];
            const v2 = [1, 2];
            expect(vec2_equals(v1, v2)).toBeFalse();
        });

        it(`vec2_equals_00`, () => {
            let a = numb.frand(-100, 100);
            let b = numb.frand(-100, 100);

            let c = new vec2f(a, b), d = new vec2f(a, b);
            expect(vec2_equals(c, d)).toBeTrue();

            d = new vec2f(a, b + 0.00001);
            expect(vec2_equals(c, d)).toBeFalse();
        })
    });

    describe("vec2_fuzzy_equals", () => {
        // Define some sample vectors
        const vecA = new vec2f(1.001, 2.001);
        const vecB = new vec2f(1.002, 2.002);
        const vecC = new vec2f(1.002, 2.002);

        it("should return true for almost equal vectors", () => {
            expect(vec2_fuzzy_equals(vecB, vecC)).toBe(true);
        });

        it("should return false for not almost equal vectors", () => {
            expect(vec2_fuzzy_equals(vecA, vecB)).toBe(false);
        });

        it("should return true for vectors with very small differences", () => {
            const vecD = new vec2f(1.0010000001, 2.0010000001);
            expect(vec2_fuzzy_equals(vecA, vecD)).toBe(true);
        });

        it("should return true for equal vectors", () => {
            expect(vec2_fuzzy_equals(vecC, vecC)).toBe(true);
        });

        it("should return true for zero vectors", () => {
            const zeroVec = new vec2f(0, 0);
            expect(vec2_fuzzy_equals(zeroVec, zeroVec)).toBe(true);
        });

        it("should return false for vectors with one coordinate being different", () => {
            const vecE = new vec2f(1.002, 2.001);
            expect(vec2_fuzzy_equals(vecB, vecE)).toBe(false);
        });

        it(`vec2_fuzzy_equals_00`, () => {
            let a = numb.frand(-100, 100);
            let b = numb.frand(-100, 100);

            let c = new vec2f(a, b), d = new vec2f(a, b);
            expect(vec2_fuzzy_equals(c, d)).toBeTrue();

            d = new vec2f(a, b + numb.EPSILON);
            expect(vec2_fuzzy_equals(c, d)).toBeFalse();
        })
    });

    describe("vec2_length_square", () => {
        // Test cases for when the vector is [0, 0]
        it("should return 0 for [0, 0]", () => {
            const vec = [0, 0];
            expect(vec2_length_square(vec)).toEqual(0);
        });

        // Test cases for when the vector has positive coordinates
        it("should return the squared length of the vector with positive coordinates", () => {
            const vec = [3, 4]; // [3, 4] has a squared length of 3^2 + 4^2 = 9 + 16 = 25
            expect(vec2_length_square(vec)).toEqual(25);
        });

        // Test cases for when the vector has negative coordinates
        it("should return the squared length of the vector with negative coordinates", () => {
            const vec = [-3, -4]; // [-3, -4] has a squared length of (-3)^2 + (-4)^2 = 9 + 16 = 25
            expect(vec2_length_square(vec)).toEqual(25);
        });

        // Test cases for when the vector has mixed positive and negative coordinates
        it("should return the squared length of the vector with mixed positive and negative coordinates", () => {
            const vec = [-3, 4]; // [-3, 4] has a squared length of (-3)^2 + 4^2 = 9 + 16 = 25
            expect(vec2_length_square(vec)).toEqual(25);
        });

        // Test cases for when the vector has fractional coordinates
        it("should return the squared length of the vector with fractional coordinates", () => {
            const vec = [0.5, 0.5]; // [0.5, 0.5] has a squared length of 0.5^2 + 0.5^2 = 0.25 + 0.25 = 0.5
            expect(vec2_length_square(vec)).toEqual(0.5);
        });

        // Test cases for when the vector has large coordinates
        it("should handle large coordinates", () => {
            const vec = [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
            // Squared length will be the sum of squares of the largest safe integer, which should not overflow
            expect(vec2_length_square(vec)).toEqual(2 * Number.MAX_SAFE_INTEGER ** 2);
        });

        it(`vec2_length_square_00`, () => {
            let a = numb.float32(numb.frand(-100, 100));
            let b = numb.float32(numb.frand(-100, 100));
            let c = new vec2f(a, b);
            expect(vec2_length_square(c)).toBeCloseTo(a * a + b * b, 3);
        })
    });


    describe("vec2_length function", () => {
        // Test cases for normal vectors
        it("calculates the length of a vector with positive coordinates", () => {
            expect(vec2_length([3, 4])).toBeCloseTo(5); // 3-4-5 right triangle
        });

        it("calculates the length of a vector with negative coordinates", () => {
            expect(vec2_length([-3, -4])).toBeCloseTo(5);
        });

        // Test cases for vectors with one zero coordinate
        it("calculates the length of a vector with one zero coordinate", () => {
            expect(vec2_length([3, 0])).toBeCloseTo(3);
            expect(vec2_length([0, 4])).toBeCloseTo(4);
        });

        // Test cases for vectors with both zero coordinates
        it("returns 0 for a zero vector", () => {
            expect(vec2_length([0, 0])).toBe(0);
        });

        // Test cases for vectors in different quadrants
        it("calculates the length of a vector in different quadrants", () => {
            expect(vec2_length([3, -4])).toBeCloseTo(5); // Quadrant IV
            expect(vec2_length([-3, 4])).toBeCloseTo(5); // Quadrant II
        });

        // Test cases for vectors with decimal coordinates
        it("calculates the length of a vector with decimal coordinates", () => {
            expect(vec2_length([1.5, 2.5])).toBeCloseTo(2.915475); // Calculated using calculator
        });

        // Test cases for vectors with large coordinates
        it("calculates the length of a vector with large coordinates", () => {
            expect(vec2_length([1e6, 2e6])).toBeCloseTo(2.23606797749979e6); // Calculated using calculator
        });

        it(`length_00`, () => {
            let a = numb.float32(numb.frand(-100, 100));
            let b = numb.float32(numb.frand(-100, 100));
            let c = new vec2f(a, b);
            expect(vec2_length(c)).toBeCloseTo(Math.sqrt(a * a + b * b), 3);
        })
    });

    describe("vec2_normalize", () => {
        // Helper function to create a vector with given components
        const createVector = (x, y) => new vec2f(x, y);

        // Test cases for various scenarios
        it("should return the same vector if already normalized", () => {
            const vec = createVector(0.5, 0.5);
            expect(vec2_normalize(vec)).toEqual(vec);
        });

        it("should normalize a vector with non-zero components", () => {
            const vec = createVector(3, 4);
            const expected = createVector(3 / 5, 4 / 5);
            expect(vec2_normalize(vec)).toEqual(expected);
        });

        it("should return a null vector unchanged", () => {
            const vec = createVector(0, 0);
            expect(vec2_normalize(vec)).toEqual(vec);
        });

        it("should normalize a vector with negative components", () => {
            const vec = createVector(-2, -2);
            const expected = createVector(-2 / Math.sqrt(8), -2 / Math.sqrt(8));
            expect(vec2_normalize(vec)).toEqual(expected);
        });

        it("should handle very small numbers", () => {
            const vec = createVector(1e-20, 1e-20);
            const expected = createVector(1 / Math.sqrt(2), 1 / Math.sqrt(2));
            expect(vec2_normalize(vec)).toEqual(expected);
        });

        it("should handle very large numbers", () => {
            const vec = createVector(1e20, 1e20);
            const expected = createVector(1 / Math.sqrt(2), 1 / Math.sqrt(2));
            expect(vec2_normalize(vec)).toEqual(expected);
        });

        it("should handle negative zero components", () => {
            const vec = createVector(-0, -0);
            expect(vec2_normalize(vec)).toEqual(vec);
        });

        it("should handle Infinity", () => {
            const vec = createVector(Infinity, Infinity);
            expect(vec2_normalize(vec)).toEqual(vec);
        });

        it("should handle NaN", () => {
            const vec = createVector(NaN, NaN);
            expect(vec2_normalize(vec)).toEqual(vec);
        });

        it(`normalize_00`, () => {
            let a = numb.frand(-100, 100);
            let b = numb.frand(-100, 100);
            let c = new vec2f(a, b);
            vec2_normalize(c);

            let sqrlen = Math.sqrt(a * a + b * b);
            test_vec2(c, a / sqrlen, b / sqrlen);
        })
    });


    describe("vec2_normalized", () => {
        it("should normalize a non-zero vector", () => {
            const vec = [3, 4];
            const result = [0, 0];
            vec2_normalized(vec, result);
            expect(result[0]).toBeCloseTo(0.6, 10);
            expect(result[1]).toBeCloseTo(0.8, 10);
        });

        it("should leave a null vector unchanged", () => {
            const vec = [0, 0];
            const result = [0, 0];
            vec2_normalized(vec, result);
            expect(result[0]).toBe(0);
            expect(result[1]).toBe(0);
        });

        it("should leave a unit vector unchanged", () => {
            const vec = [1, 0];
            const result = [0, 0];
            vec2_normalized(vec, result);
            expect(result[0]).toBe(1);
            expect(result[1]).toBe(0);
        });

        it("should normalize a vector close to unit length", () => {
            const vec = [0.999999, 0.000001];
            const result = [0, 0];
            vec2_normalized(vec, result);
            const len = Math.sqrt(result[0] * result[0] + result[1] * result[1]);
            expect(len).toBeCloseTo(1, 10);
        });

        it("should normalize a vector with negative components", () => {
            const vec = [-3, -4];
            const result = [0, 0];
            vec2_normalized(vec, result);
            expect(result[0]).toBeCloseTo(-0.6, 10);
            expect(result[1]).toBeCloseTo(-0.8, 10);
        });

        it("should handle very small vectors", () => {
            const vec = [1e-10, 1e-10];
            const result = [0, 0];
            vec2_normalized(vec, result);
            const len = Math.sqrt(result[0] * result[0] + result[1] * result[1]);
            expect(len).toBeCloseTo(1, 10);
        });

        it("should handle vectors with one zero component", () => {
            const vec = [0, 5];
            const result = [0, 0];
            vec2_normalized(vec, result);
            expect(result[0]).toBeCloseTo(0, 10);
            expect(result[1]).toBeCloseTo(1, 10);
        });

        it(`normalized_00`, () => {
            let a = numb.frand(-100, 100);
            let b = numb.frand(-100, 100);
            let c = new vec2f(a, b), d = new vec2f();
            let e = vec2_normalized(c, d);

            let sqrlen = Math.sqrt(a * a + b * b);
            test_vec2(d, a / sqrlen, b / sqrlen);
            test_vec2(e, a / sqrlen, b / sqrlen);

            expect(c).toEqual(new vec2f(a, b));
        })
    });

    describe('vec2_rad_angle', () => {

        it('should return 0 for a vector along the positive x-axis', () => {
            expect(vec2_rad_angle([1, 0])).toBe(0);
        });

        it('should return π/2 for a vector along the positive y-axis', () => {
            expect(vec2_rad_angle([0, 1])).toBeCloseTo(Math.PI / 2, 10);
        });

        it('should return π for a vector along the negative x-axis', () => {
            expect(vec2_rad_angle([-1, 0])).toBeCloseTo(Math.PI, 10);
        });

        it('should return -π/2 for a vector along the negative y-axis', () => {
            expect(vec2_rad_angle([0, -1])).toBeCloseTo(-Math.PI / 2, 10);
        });

        it('should return correct angle for a vector in the first quadrant', () => {
            expect(vec2_rad_angle([1, 1])).toBeCloseTo(Math.PI / 4, 10);
        });

        it('should return correct angle for a vector in the second quadrant', () => {
            expect(vec2_rad_angle([-1, 1])).toBeCloseTo(3 * Math.PI / 4, 10);
        });

        it('should return correct angle for a vector in the third quadrant', () => {
            expect(vec2_rad_angle([-1, -1])).toBeCloseTo(-3 * Math.PI / 4, 10);
        });

        it('should return correct angle for a vector in the fourth quadrant', () => {
            expect(vec2_rad_angle([1, -1])).toBeCloseTo(-Math.PI / 4, 10);
        });

        it('should return 0 for a zero vector [0, 0]', () => {
            expect(vec2_rad_angle([0, 0])).toBe(0);
        });

        it('should handle small values correctly', () => {
            expect(vec2_rad_angle([1e-10, 1e-10])).toBeCloseTo(Math.PI / 4, 10);
        });

        it('should handle large values correctly', () => {
            expect(vec2_rad_angle([1e10, 1e10])).toBeCloseTo(Math.PI / 4, 10);
        });

        it(`angle_rad_00`, () => {
            let a = numb.frand(-100, 100);
            let b = numb.frand(-100, 100);
            let c = vec2_rad_angle(new vec2f(a, b));

            let rad = Math.atan2(b, a);
            expect(c).toBeCloseTo(rad, 3);
        })

    });

    describe('vec2_deg_angle', () => {

        it('should return 0 degrees for a vector along the positive x-axis', () => {
            expect(vec2_deg_angle([1, 0])).toBeCloseTo(0, 10);
        });

        it('should return 90 degrees for a vector along the positive y-axis', () => {
            expect(vec2_deg_angle([0, 1])).toBeCloseTo(90, 10);
        });

        it('should return 180 degrees for a vector along the negative x-axis', () => {
            expect(vec2_deg_angle([-1, 0])).toBeCloseTo(180, 10);
        });

        it('should return -90 degrees for a vector along the negative y-axis', () => {
            expect(vec2_deg_angle([0, -1])).toBeCloseTo(-90, 10);
        });

        it('should return 45 degrees for a vector in the first quadrant', () => {
            expect(vec2_deg_angle([1, 1])).toBeCloseTo(45, 10);
        });

        it('should return 135 degrees for a vector in the second quadrant', () => {
            expect(vec2_deg_angle([-1, 1])).toBeCloseTo(135, 10);
        });

        it('should return -135 degrees for a vector in the third quadrant', () => {
            expect(vec2_deg_angle([-1, -1])).toBeCloseTo(-135, 10);
        });

        it('should return -45 degrees for a vector in the fourth quadrant', () => {
            expect(vec2_deg_angle([1, -1])).toBeCloseTo(-45, 10);
        });

        it('should return 0 degrees for a zero vector [0, 0]', () => {
            expect(vec2_deg_angle([0, 0])).toBeCloseTo(0, 10);
        });

        it('should handle small values correctly', () => {
            expect(vec2_deg_angle([1e-10, 1e-10])).toBeCloseTo(45, 10);
        });

        it('should handle large values correctly', () => {
            expect(vec2_deg_angle([1e10, 1e10])).toBeCloseTo(45, 10);
        });

        it('should handle mixed large and small values correctly', () => {
            expect(vec2_deg_angle([1e10, 1e-10])).toBeCloseTo(0, 10);
            expect(vec2_deg_angle([1e-10, 1e10])).toBeCloseTo(90, 10);
        });

        it('should handle negative values correctly', () => {
            expect(vec2_deg_angle([-1e-10, -1e10])).toBeCloseTo(-90, 10);
            expect(vec2_deg_angle([-1e10, -1e-10])).toBeCloseTo(-180, 10);
        });

        it(`angle_deg_00`, () => {
            let a = numb.frand(-100, 100);
            let b = numb.frand(-100, 100);
            let c = vec2_deg_angle(new vec2f(a, b));

            let rad = Math.atan2(b, a);
            expect(c).toBeCloseTo(rad * numb.RAD_2_DEG, 3);
        })

    });

    describe('vec2_add', () => {

        it('should add two positive vectors correctly', () => {
            const v1 = [1, 2];
            const v2 = [3, 4];
            const result = vec2_add(v1, v2);
            expect(result[0]).toBe(4);
            expect(result[1]).toBe(6);
        });

        it('should add a positive and a negative vector correctly', () => {
            const v1 = [1, -2];
            const v2 = [-3, 4];
            const result = vec2_add(v1, v2);
            expect(result[0]).toBe(-2);
            expect(result[1]).toBe(2);
        });

        it('should add two negative vectors correctly', () => {
            const v1 = [-1, -2];
            const v2 = [-3, -4];
            const result = vec2_add(v1, v2);
            expect(result[0]).toBe(-4);
            expect(result[1]).toBe(-6);
        });

        it('should add a vector to a zero vector correctly', () => {
            const v1 = [0, 0];
            const v2 = [3, 4];
            const result = vec2_add(v1, v2);
            expect(result[0]).toBe(3);
            expect(result[1]).toBe(4);
        });

        it('should add zero vectors correctly', () => {
            const v1 = [0, 0];
            const v2 = [0, 0];
            const result = vec2_add(v1, v2);
            expect(result[0]).toBe(0);
            expect(result[1]).toBe(0);
        });

        it('should use the provided result vector', () => {
            const v1 = [1, 2];
            const v2 = [3, 4];
            const result = new vec2f();
            vec2_add(v1, v2, result);
            expect(result[0]).toBe(4);
            expect(result[1]).toBe(6);
        });

        it('should handle large values correctly', () => {
            const v1 = [1e10, 2e10];
            const v2 = [3e10, 4e10];
            const result = vec2_add(v1, v2);
            expect(result[0]).toBe(Math.fround(4e10));
            expect(result[1]).toBe(Math.fround(6e10));
        });

        it('should handle small values correctly', () => {
            const v1 = [1e-10, 2e-10];
            const v2 = [3e-10, 4e-10];
            const result = vec2_add(v1, v2);
            expect(result[0]).toBe(Math.fround(4e-10));
            expect(result[1]).toBe(Math.fround(6e-10));
        });

        it(`add_00`, () => {
            let a = new vec2f(-1, 5);
            let b = new vec2f(2, 1);
            let c = vec2_add(a, b, new vec2f());

            test_vec2(a, -1, 5);
            test_vec2(b, 2, 1);
            test_vec2(c, 1, 6);
        })

    });

    describe('vec2_rem', () => {

        it('should subtract two positive vectors correctly', () => {
            const v1 = [3, 4];
            const v2 = [1, 2];
            const result = vec2_rem(v1, v2);
            expect(result[0]).toBe(2);
            expect(result[1]).toBe(2);
        });

        it('should subtract a positive and a negative vector correctly', () => {
            const v1 = [1, -2];
            const v2 = [-3, 4];
            const result = vec2_rem(v1, v2);
            expect(result[0]).toBe(4);
            expect(result[1]).toBe(-6);
        });

        it('should subtract two negative vectors correctly', () => {
            const v1 = [-1, -2];
            const v2 = [-3, -4];
            const result = vec2_rem(v1, v2);
            expect(result[0]).toBe(2);
            expect(result[1]).toBe(2);
        });

        it('should subtract a zero vector correctly', () => {
            const v1 = [3, 4];
            const v2 = [0, 0];
            const result = vec2_rem(v1, v2);
            expect(result[0]).toBe(3);
            expect(result[1]).toBe(4);
        });

        it('should subtract from a zero vector correctly', () => {
            const v1 = [0, 0];
            const v2 = [3, 4];
            const result = vec2_rem(v1, v2);
            expect(result[0]).toBe(-3);
            expect(result[1]).toBe(-4);
        });

        it('should use the provided result vector', () => {
            const v1 = [3, 4];
            const v2 = [1, 2];
            const result = new vec2f();
            vec2_rem(v1, v2, result);
            expect(result[0]).toBe(2);
            expect(result[1]).toBe(2);
        });

        it('should handle large values correctly', () => {
            const v1 = [1e10, 2e10];
            const v2 = [3e10, 4e10];
            const result = vec2_rem(v1, v2);
            expect(result[0]).toBe(-2e10);
            expect(result[1]).toBe(-2e10);
        });

        it('should handle small values correctly', () => {
            const v1 = [1e-10, 2e-10];
            const v2 = [3e-10, 4e-10];
            const result = vec2_rem(v1, v2);
            expect(result[0]).toBe(Math.fround(-2e-10));
            expect(result[1]).toBe(Math.fround(-2e-10));
        });

        it(`rem_00`, () => {
            let a = new vec2f(-1, 5);
            let b = new vec2f(2, 1);
            let c = vec2_rem(a, b, new vec2f());

            test_vec2(a, -1, 5);
            test_vec2(b, 2, 1);
            test_vec2(c, -3, 4);
        })

    });


    describe('vec2_mult', () => {

        it('should multiply two vectors component-wise', () => {
            const v1 = [2, 3];
            const v2 = [4, 5];
            const result = vec2_mult(v1, v2);
            expect(result[0]).toBe(8);
            expect(result[1]).toBe(15);
        });

        it('should multiply a vector by a scalar', () => {
            const v1 = [2, 3];
            const scalar = 2;
            const result = vec2_mult(v1, scalar);
            expect(result[0]).toBe(4);
            expect(result[1]).toBe(6);
        });

        it('should use the provided result vector', () => {
            const v1 = [2, 3];
            const v2 = [4, 5];
            const result = new vec2f();
            vec2_mult(v1, v2, result);
            expect(result[0]).toBe(8);
            expect(result[1]).toBe(15);
        });

        it('should throw an error if the multiplier is of the wrong type', () => {
            const v1 = [2, 3];
            const invalidMultiplier = 'string';
            expect(() => vec2_mult(v1, invalidMultiplier)).toThrowError('Multiplier is of the wrong type.');
        });

        it('should handle large values correctly', () => {
            const v1 = [1e10, 2e10];
            const v2 = [3e10, 4e10];
            const result = vec2_mult(v1, v2);
            expect(result[0]).toBe(Math.fround(3e20));
            expect(result[1]).toBe(Math.fround(8e20));
        });

        it('should handle small values correctly', () => {
            const v1 = [1e-10, 2e-10];
            const v2 = [3e-10, 4e-10];
            const result = vec2_mult(v1, v2);
            expect(result[0]).toBe(Math.fround(3e-20));
            expect(result[1]).toBe(Math.fround(8e-20));
        });

        it('should handle multiplication by zero correctly', () => {
            const v1 = [2, 3];
            const scalar = 0;
            const result = vec2_mult(v1, scalar);
            expect(result[0]).toBe(0);
            expect(result[1]).toBe(0);
        });

        it('should handle multiplication by one correctly', () => {
            const v1 = [2, 3];
            const scalar = 1;
            const result = vec2_mult(v1, scalar);
            expect(result[0]).toBe(2);
            expect(result[1]).toBe(3);
        });

        it(`mult_00`, () => {
            let a = new vec2f(-1, 5);
            let b = new vec2f(2, 1);
            let c = new vec2f();
            c = vec2_mult(a, b, c);

            test_vec2(a, -1, 5);
            test_vec2(b, 2, 1);
            test_vec2(c, -2, 5);

            c = vec2_mult(a, 3.3, c);

            test_vec2(a, -1, 5);
            test_vec2(b, 2, 1);
            test_vec2(c, -3.3, 16.5);
        })

    });

    describe('vec2_div', () => {

        it('should divide two vectors component-wise', () => {
            const v1 = [8, 15];
            const v2 = [4, 5];
            const result = vec2_div(v1, v2);
            expect(result[0]).toBe(2);
            expect(result[1]).toBe(3);
        });
    
        it('should divide a vector by a scalar', () => {
            const v1 = [8, 6];
            const scalar = 2;
            const result = vec2_div(v1, scalar);
            expect(result[0]).toBe(4);
            expect(result[1]).toBe(3);
        });
    
        it('should use the provided result vector', () => {
            const v1 = [8, 15];
            const v2 = [4, 5];
            const result = new vec2f();
            vec2_div(v1, v2, result);
            expect(result[0]).toBe(2);
            expect(result[1]).toBe(3);
        });
    
        it('should throw an error if the divider is of the wrong type', () => {
            const v1 = [8, 15];
            const invalidDivider = 'string';
            expect(() => vec2_div(v1, invalidDivider)).toThrowError('Divider is of the wrong type.');
        });
    
        it('should handle large values correctly', () => {
            const v1 = [1e10, 2e10];
            const v2 = [2e10, 4e10];
            const result = vec2_div(v1, v2);
            expect(result[0]).toBe(0.5);
            expect(result[1]).toBe(0.5);
        });
    
        it('should handle small values correctly', () => {
            const v1 = [1e-10, 2e-10];
            const v2 = [2e-10, 4e-10];
            const result = vec2_div(v1, v2);
            expect(result[0]).toBe(0.5);
            expect(result[1]).toBe(0.5);
        });
    
        it('should handle division by zero correctly', () => {
            const v1 = [8, 15];
            const scalar = 0;
            expect(() => vec2_div(v1, scalar)).toThrowError('Divided by zero.');
        });
    
        it('should handle division by one correctly', () => {
            const v1 = [8, 15];
            const scalar = 1;
            const result = vec2_div(v1, scalar);
            expect(result[0]).toBe(8);
            expect(result[1]).toBe(15);
        });

        it(`div_00`, () => {
            let a = new vec2f(-1, 5);
            let b = new vec2f(2, 1);
            let c = new vec2f();
            c = vec2_div(a, b, c);
    
            test_vec2(a, -1, 5);
            test_vec2(b, 2, 1);
            test_vec2(c, -0.5, 5);
    
            c = vec2_div(a, 3.3, c);
    
            test_vec2(a, -1, 5);
            test_vec2(b, 2, 1);
            test_vec2(c, -0.3030303030303030303030303030303, 1.5151515151515151515151515151515);
        })
    
    });
    
    describe('vec2_dot_product', () => {

        it('should return 0 when both vectors are zero vectors', () => {
            const v1 = [0, 0];
            const v2 = [0, 0];
            const result = vec2_dot_product(v1, v2);
            expect(result).toBe(0);
        });
    
        it('should return 0 when one vector is a zero vector', () => {
            const v1 = [0, 0];
            const v2 = [1, 1];
            const result = vec2_dot_product(v1, v2);
            expect(result).toBe(0);
        });
    
        it('should return the correct dot product for positive values', () => {
            const v1 = [2, 3];
            const v2 = [4, 5];
            const result = vec2_dot_product(v1, v2);
            expect(result).toBe(23);
        });
    
        it('should return the correct dot product for negative values', () => {
            const v1 = [-2, -3];
            const v2 = [-4, -5];
            const result = vec2_dot_product(v1, v2);
            expect(result).toBe(23);
        });
    
        it('should return the correct dot product for mixed positive and negative values', () => {
            const v1 = [-2, 3];
            const v2 = [4, -5];
            const result = vec2_dot_product(v1, v2);
            expect(result).toBe(-23);
        });
    
        it('should return 0 for orthogonal vectors', () => {
            const v1 = [1, 0];
            const v2 = [0, 1];
            const result = vec2_dot_product(v1, v2);
            expect(result).toBe(0);
        });
    
        it('should handle large values correctly', () => {
            const v1 = [1e10, 2e10];
            const v2 = [2e10, 3e10];
            const result = vec2_dot_product(v1, v2);
            expect(result).toBe(8e20);
        });
    
        it('should handle small values correctly', () => {
            const v1 = [1e-10, 2e-10];
            const v2 = [2e-10, 3e-10];
            const result = vec2_dot_product(v1, v2);
            expect(result).toBeCloseTo(Math.fround(8e-20), 5);
        });
    
        it('should handle vectors with one component as zero', () => {
            const v1 = [0, 3];
            const v2 = [4, 0];
            const result = vec2_dot_product(v1, v2);
            expect(result).toBe(0);
        });
    
        it('should handle vectors with fractional components', () => {
            const v1 = [0.5, 1.5];
            const v2 = [2.5, 3.5];
            const result = vec2_dot_product(v1, v2);
            expect(result).toBe(6.5);
        });
    
        it('should handle vectors with mixed integer and fractional components', () => {
            const v1 = [2, 1.5];
            const v2 = [3.5, 2];
            const result = vec2_dot_product(v1, v2);
            expect(result).toBe(10);
        });
        
        it(`dot_00`, () => {
            let a = new vec2f(-1, 5);
            let b = new vec2f(2, 1);
            let c = vec2_rem(a, b, new vec2f());
    
            test_vec2(a, -1, 5);
            test_vec2(b, 2, 1);
            test_vec2(c, -3, 4);
        })

        it(`dot_product_00`, () => {
            let a = new vec2f(-1, 5);
            let b = new vec2f(2, 1);
            let c = vec2_dot_product(a, b);
    
            test_vec2(a, -1, 5);
            test_vec2(b, 2, 1);
            expect(c).toBeCloseTo(3, 3);
        })
    });
    
    describe('vec2_dist_to_point_sqr', () => {
        it('should return 0 when the vector and point are the same', () => {
            const vec = [0, 0];
            const point = [0, 0];
            expect(vec2_dist_to_point_sqr(vec, point)).toBe(0);
        });
    
        it('should calculate the correct squared distance when the vector and point have positive coordinates', () => {
            const vec = [3, 4];
            const point = [0, 0];
            expect(vec2_dist_to_point_sqr(vec, point)).toBe(25); // 3^2 + 4^2 = 9 + 16 = 25
        });
    
        it('should calculate the correct squared distance when the vector and point have negative coordinates', () => {
            const vec = [-3, -4];
            const point = [0, 0];
            expect(vec2_dist_to_point_sqr(vec, point)).toBe(25); // (-3)^2 + (-4)^2 = 9 + 16 = 25
        });
    
        it('should calculate the correct squared distance when both vector and point are negative', () => {
            const vec = [-1, -1];
            const point = [-4, -5];
            expect(vec2_dist_to_point_sqr(vec, point)).toBe(25); // (3)^2 + (4)^2 = 9 + 16 = 25
        });
    
        it('should calculate the correct squared distance with mixed positive and negative coordinates', () => {
            const vec = [3, -4];
            const point = [-3, 4];
            expect(vec2_dist_to_point_sqr(vec, point)).toBe(100); // (3 - (-3))^2 + (-4 - 4)^2 = 6^2 + (-8)^2 = 36 + 64 = 100
        });
    
        it('should handle non-integer values', () => {
            const vec = [1.5, 2.5];
            const point = [3.5, 4.5];
            expect(vec2_dist_to_point_sqr(vec, point)).toBe(8); // (1.5 - 3.5)^2 + (2.5 - 4.5)^2 = (-2)^2 + (-2)^2 = 4 + 4 = 8
        });
    
        it('should handle very large values', () => {
            const vec = [1e6, 1e6];
            const point = [0, 0];
            expect(vec2_dist_to_point_sqr(vec, point)).toBe(2e12); // (1e6)^2 + (1e6)^2 = 1e12 + 1e12 = 2e12
        });
    
        it('should handle very small values', () => {
            const vec = [1e-6, 1e-6];
            const point = [0, 0];
            expect(vec2_dist_to_point_sqr(vec, point)).toBe(2e-12); // (1e-6)^2 + (1e-6)^2 = 1e-12 + 1e-12 = 2e-12
        });
    
        it('should return the correct squared distance for vectors on the same line', () => {
            const vec = [2, 2];
            const point = [4, 4];
            expect(vec2_dist_to_point_sqr(vec, point)).toBe(8); // (2 - 4)^2 + (2 - 4)^2 = (-2)^2 + (-2)^2 = 4 + 4 = 8
        });
    
        it('should return the correct squared distance for non-axis-aligned vectors', () => {
            const vec = [1, 1];
            const point = [2, 3];
            expect(vec2_dist_to_point_sqr(vec, point)).toBe(5); // (1 - 2)^2 + (1 - 3)^2 = (-1)^2 + (-2)^2 = 1 + 4 = 5
        });
    });
    
    describe('vec2_dist_vec2', () => {
        it('should return 0 when the vector and point are the same', () => {
            const vec = [0, 0];
            const point = [0, 0];
            expect(vec2_dist_vec2(vec, point)).toBe(0);
        });
    
        it('should calculate the correct distance when the vector and point have positive coordinates', () => {
            const vec = [3, 4];
            const point = [0, 0];
            expect(vec2_dist_vec2(vec, point)).toBe(5); // sqrt(3^2 + 4^2) = 5
        });
    
        it('should calculate the correct distance when the vector and point have negative coordinates', () => {
            const vec = [-3, -4];
            const point = [0, 0];
            expect(vec2_dist_vec2(vec, point)).toBe(5); // sqrt((-3)^2 + (-4)^2) = 5
        });
    
        it('should calculate the correct distance when both vector and point are negative', () => {
            const vec = [-1, -1];
            const point = [-4, -5];
            expect(vec2_dist_vec2(vec, point)).toBe(5); // sqrt((3)^2 + (4)^2) = 5
        });
    
        it('should calculate the correct distance with mixed positive and negative coordinates', () => {
            const vec = [3, -4];
            const point = [-3, 4];
            expect(vec2_dist_vec2(vec, point)).toBe(10); // sqrt((3 - (-3))^2 + (-4 - 4)^2) = 10
        });
    
        it('should handle non-integer values', () => {
            const vec = [1.5, 2.5];
            const point = [3.5, 4.5];
            expect(vec2_dist_vec2(vec, point)).toBeCloseTo(Math.sqrt(8)); // sqrt((1.5 - 3.5)^2 + (2.5 - 4.5)^2) = sqrt(8)
        });
    
        it('should handle very large values', () => {
            const vec = [1e6, 1e6];
            const point = [0, 0];
            expect(vec2_dist_vec2(vec, point)).toBe(Math.sqrt(2e12)); // sqrt((1e6)^2 + (1e6)^2) = sqrt(2e12)
        });
    
        it('should handle very small values', () => {
            const vec = [1e-6, 1e-6];
            const point = [0, 0];
            expect(vec2_dist_vec2(vec, point)).toBeCloseTo(Math.sqrt(2e-12)); // sqrt((1e-6)^2 + (1e-6)^2) = sqrt(2e-12)
        });
    
        it('should return the correct distance for vectors on the same line', () => {
            const vec = [2, 2];
            const point = [4, 4];
            expect(vec2_dist_vec2(vec, point)).toBeCloseTo(Math.sqrt(8)); // sqrt((2 - 4)^2 + (2 - 4)^2) = sqrt(8)
        });
    
        it('should return the correct distance for non-axis-aligned vectors', () => {
            const vec = [1, 1];
            const point = [2, 3];
            expect(vec2_dist_vec2(vec, point)).toBeCloseTo(Math.sqrt(5)); // sqrt((1 - 2)^2 + (1 - 3)^2) = sqrt(5)
        });

    });

});
