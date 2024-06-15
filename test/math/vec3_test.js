import { mat4f } from "../../lib/math/mat4.js";
import { numb } from "../../lib/math/number.js";
import { quatf } from "../../lib/math/quaternion.js";
import {
    X_AXIS, Y_AXIS, Z_AXIS, vec3_add, vec3_apply_mat4, vec3_apply_quat, vec3_cross, vec3_dist, vec3_dist_sqr, vec3_div,
    vec3_dot, vec3_equals, vec3_fuzzy_equals,
    vec3_is_fuzzy_null, vec3_is_null, vec3_length, vec3_length_square, vec3_mult,
    vec3_neg,
    vec3_normalize, vec3_normalized, vec3_random, vec3_rem, vec3_round_2_dec, vec3_set, vec3_set_length, vec3d, vec3f
} from "../../lib/math/vec3.js";


describe('vec3 constant test', () => {
    it(`X_AXIS_00`, () => { expect(X_AXIS).toBe(0); })
    it(`Y_AXIS_00`, () => { expect(Y_AXIS).toBe(1); })
    it(`Z_AXIS_00`, () => { expect(Z_AXIS).toBe(2); })
});

describe('vec3f', () => {
    let vec;

    beforeEach(() => {
        vec = new vec3f();
    });

    afterEach(() => {
        vec = null;
    });

    it('should be defined', () => {
        expect(vec3f).toBeDefined();
    });

    it('should create a vector with default values if no arguments are provided', () => {
        expect(vec.x).toBe(0);
        expect(vec.y).toBe(0);
        expect(vec.z).toBe(0);
    });

    it('should create a vector with provided values', () => {
        const vec2 = new vec3f(1, 2, 3);
        expect(vec2.x).toBe(1);
        expect(vec2.y).toBe(2);
        expect(vec2.z).toBe(3);
    });

    it('should create a vector with values from another vector', () => {
        const original = new vec3f(1, 2, 3);
        const copy = new vec3f(original);
        expect(copy.x).toBe(1);
        expect(copy.y).toBe(2);
        expect(copy.z).toBe(3);
    });

    it('should create a vector with values from an array', () => {
        const array = [1, 2, 3];
        const fromArray = new vec3f(array);
        expect(fromArray.x).toBe(1);
        expect(fromArray.y).toBe(2);
        expect(fromArray.z).toBe(3);
    });

    it('should set x, y, and z values correctly', () => {
        vec.x = 4;
        vec.y = 5;
        vec.z = 6;
        expect(vec.x).toBe(4);
        expect(vec.y).toBe(5);
        expect(vec.z).toBe(6);
    });

    it('should round coordinates when getting integer values', () => {
        vec.x = 1.9;
        vec.y = 2.1;
        vec.z = 3.5;
        expect(vec.xi).toBe(2);
        expect(vec.yi).toBe(2);
        expect(vec.zi).toBe(4);
    });

    it('should have correct BYTES_LENGTH property', () => {
        expect(vec3f.BYTES_LENGTH).toBe(Float32Array.BYTES_PER_ELEMENT * 3);
    });

    it(`constructor_00`, () => {
        let a = numb.rand(-1, 1);
        let b = numb.rand(-1, 1);
        let c = numb.rand(-1, 1);

        let d = new vec3f(a, b, c);


        expect(d[0]).toBe(Math.fround(a));
        expect(d[1]).toBe(Math.fround(b));
        expect(d[2]).toBe(Math.fround(c));
    });
});
describe('Vec3d', () => {
    let vec;

    beforeEach(() => {
        vec = new vec3d();
    });

    it('should be initialized with default values', () => {
        expect(vec.x).toEqual(0);
        expect(vec.y).toEqual(0);
        expect(vec.z).toEqual(0);
    });

    it('should correctly set values when initialized with parameters', () => {
        vec = new vec3d(1, 2, 3);
        expect(vec.x).toEqual(1);
        expect(vec.y).toEqual(2);
        expect(vec.z).toEqual(3);
    });

    it('should correctly set values when initialized with an array', () => {
        vec = new vec3d([1, 2, 3]);
        expect(vec.x).toEqual(1);
        expect(vec.y).toEqual(2);
        expect(vec.z).toEqual(3);
    });

    it('should correctly set values when initialized with another vec3d', () => {
        const otherVec = new vec3d(1, 2, 3);
        vec = new vec3d(otherVec);
        expect(vec.x).toEqual(1);
        expect(vec.y).toEqual(2);
        expect(vec.z).toEqual(3);
    });

    it('should set NaN values when initialized with NaN parameters', () => {
        vec = new vec3d(NaN, NaN, NaN);
        expect(isNaN(vec.x)).toBeTrue();
        expect(isNaN(vec.y)).toBeTrue();
        expect(isNaN(vec.z)).toBeTrue();
    });

    it('should set NaN values when initialized with NaN in an array', () => {
        vec = new vec3d([NaN, NaN, NaN]);
        expect(isNaN(vec.x)).toBeTrue();
        expect(isNaN(vec.y)).toBeTrue();
        expect(isNaN(vec.z)).toBeTrue();
    });

    it('should correctly set values when initialized with extra parameters', () => {
        vec = new vec3d(1, 2, 3, 4);
        expect(vec.x).toEqual(1);
        expect(vec.y).toEqual(2);
        expect(vec.z).toEqual(3);
    });

    it('should correctly set values when initialized with extra values in an array', () => {
        vec = new vec3d([1, 2, 3, 4, 5]);
        expect(vec.x).toEqual(1);
        expect(vec.y).toEqual(2);
        expect(vec.z).toEqual(3);
    });

    it('should return correct BYTES_LENGTH', () => {
        expect(vec3d.BYTES_LENGTH).toEqual(Float64Array.BYTES_PER_ELEMENT * 3);
    });

    it(`constructor_01`, () => {
        let a = numb.rand(-1, 1);
        let b = numb.rand(-1, 1);
        let c = numb.rand(-1, 1);
        let d = new vec3d(a, b, c);
        expect(d[0]).toBe(a);
        expect(d[1]).toBe(b);
        expect(d[2]).toBe(c);

        //expect(true).toBeFalse();
    });
});

describe('vec3 function', () => {

    describe('vec3_set', () => {
        it('should set the vector to the provided x, y, z values', () => {
            const vec = [0, 0, 0];
            vec3_set(vec, 1, 2, 3);
            expect(vec).toEqual([1, 2, 3]);
        });

        it('should set the vector to the values in the provided array', () => {
            const vec = [0, 0, 0];
            vec3_set(vec, [4, 5, 6]);
            expect(vec).toEqual([4, 5, 6]);
        });

        it('should set the vector to the provided x value, default y and z to 0', () => {
            const vec = [0, 0, 0];
            vec3_set(vec, 1);
            expect(vec).toEqual([1, 0, 0]);
        });

        it('should set the vector to the provided x and y values, default z to 0', () => {
            const vec = [0, 0, 0];
            vec3_set(vec, 1, 2);
            expect(vec).toEqual([1, 2, 0]);
        });

        it('should set the vector to the default values when no arguments are provided', () => {
            const vec = [0, 0, 0];
            vec3_set(vec);
            expect(vec).toEqual([0, 0, 0]);
        });

        it('should handle negative values', () => {
            const vec = [0, 0, 0];
            vec3_set(vec, -1, -2, -3);
            expect(vec).toEqual([-1, -2, -3]);
        });

        it('should handle large values', () => {
            const vec = [0, 0, 0];
            vec3_set(vec, 1e6, 2e6, 3e6);
            expect(vec).toEqual([1e6, 2e6, 3e6]);
        });

        it('should handle small values', () => {
            const vec = [0, 0, 0];
            vec3_set(vec, 1e-6, 2e-6, 3e-6);
            expect(vec).toEqual([1e-6, 2e-6, 3e-6]);
        });

        it('should handle non-integer values', () => {
            const vec = [0, 0, 0];
            vec3_set(vec, 1.5, 2.5, 3.5);
            expect(vec).toEqual([1.5, 2.5, 3.5]);
        });

        it('should set NaN if x, y, or z is NaN', () => {
            const vec = [0, 0, 0];
            vec3_set(vec, NaN, 2, 3);
            expect(vec).toEqual([NaN, 2, 3]);

            vec3_set(vec, 1, NaN, 3);
            expect(vec).toEqual([1, NaN, 3]);

            vec3_set(vec, 1, 2, NaN);
            expect(vec).toEqual([1, 2, NaN]);
        });
    });

    describe('vec3_random function', () => {
        let vec;

        beforeEach(() => {
            vec = new vec3d();
        });

        it('generates random values within the specified range', () => {
            vec3_random(vec, 0, 1);
            expect(vec[X_AXIS]).toBeGreaterThanOrEqual(0);
            expect(vec[X_AXIS]).toBeLessThan(1);
            expect(vec[Y_AXIS]).toBeGreaterThanOrEqual(0);
            expect(vec[Y_AXIS]).toBeLessThan(1);
            expect(vec[Z_AXIS]).toBeGreaterThanOrEqual(0);
            expect(vec[Z_AXIS]).toBeLessThan(1);
        });

        it('generates random values with default range if not provided', () => {
            vec3_random(vec);
            expect(vec[X_AXIS]).toBeGreaterThanOrEqual(0);
            expect(vec[X_AXIS]).toBeLessThan(1);
            expect(vec[Y_AXIS]).toBeGreaterThanOrEqual(0);
            expect(vec[Y_AXIS]).toBeLessThan(1);
            expect(vec[Z_AXIS]).toBeGreaterThanOrEqual(0);
            expect(vec[Z_AXIS]).toBeLessThan(1);
        });

        it('generates random values within the specified range with negative minimum', () => {
            vec3_random(vec, -5, 5);
            expect(vec[X_AXIS]).toBeGreaterThanOrEqual(-5);
            expect(vec[X_AXIS]).toBeLessThan(5);
            expect(vec[Y_AXIS]).toBeGreaterThanOrEqual(-5);
            expect(vec[Y_AXIS]).toBeLessThan(5);
            expect(vec[Z_AXIS]).toBeGreaterThanOrEqual(-5);
            expect(vec[Z_AXIS]).toBeLessThan(5);
        });

        it('generates random values within the specified range with negative maximum', () => {
            vec3_random(vec, 0, -1);
            expect(vec[X_AXIS]).toBeGreaterThanOrEqual(-1);
            expect(vec[X_AXIS]).toBeLessThan(0);
            expect(vec[Y_AXIS]).toBeGreaterThanOrEqual(-1);
            expect(vec[Y_AXIS]).toBeLessThan(0);
            expect(vec[Z_AXIS]).toBeGreaterThanOrEqual(-1);
            expect(vec[Z_AXIS]).toBeLessThan(0);
        });

        it('generates random values with min and max swapped', () => {
            vec3_random(vec, 5, -5);
            expect(vec[X_AXIS]).toBeGreaterThanOrEqual(-5);
            expect(vec[X_AXIS]).toBeLessThan(5);
            expect(vec[Y_AXIS]).toBeGreaterThanOrEqual(-5);
            expect(vec[Y_AXIS]).toBeLessThan(5);
            expect(vec[Z_AXIS]).toBeGreaterThanOrEqual(-5);
            expect(vec[Z_AXIS]).toBeLessThan(5);
        });

        it('returns the same vec3 object', () => {
            const result = vec3_random(vec);
            expect(result).toBe(vec);
        });
    });

    describe("vec3_neg", () => {
        // Test case: Negate all components of a vec3
        it("negates all components of a vec3", () => {
            const vec = [1, -2, 3];
            const result = vec3_neg(vec);
            expect(result).toEqual([-1, 2, -3]);
        });

        // Test case: Negate zero vector
        it("negates zero vector", () => {
            const vec = [0, 0, 0];
            const result = vec3_neg(vec);
            expect(result).toEqual([0, 0, 0]);
        });

        // Test case: Negate positive components
        it("negates positive components", () => {
            const vec = [1, 2, 3];
            const result = vec3_neg(vec);
            expect(result).toEqual([-1, -2, -3]);
        });

        // Test case: Negate negative components
        it("negates negative components", () => {
            const vec = [-1, -2, -3];
            const result = vec3_neg(vec);
            expect(result).toEqual([1, 2, 3]);
        });

        // Test case: Negate components with min and max values
        it("negates components with min and max values", () => {
            const vec = [Number.MIN_VALUE, Number.MAX_VALUE, 0];
            const result = vec3_neg(vec);
            expect(result).toEqual([-Number.MIN_VALUE, -Number.MAX_VALUE, 0]);
        });
    });

    describe("vec3_is_null function", () => {
        // Test for null vector
        it("should return true for a null vector", () => {
            const vec = [0, 0, 0];
            expect(vec3_is_null(vec)).toBeTrue();
        });

        // Test for non-null vector
        it("should return false for a non-null vector", () => {
            const vec = [1, 0, 0];
            expect(vec3_is_null(vec)).toBeFalse();
        });

        // Test for negative components
        it("should return false for a vector with negative components", () => {
            const vec = [-1, -1, -1];
            expect(vec3_is_null(vec)).toBeFalse();
        });

        // Test for edge case: floating point precision
        it("should return true for a vector with very small values", () => {
            const vec = [Number.EPSILON / 2, Number.EPSILON / 2, Number.EPSILON / 2];
            expect(vec3_is_null(vec)).toBeFalse();
        });

        // Test for edge case: large values
        it("should return false for a vector with large values", () => {
            const vec = [Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE];
            expect(vec3_is_null(vec)).toBeFalse();
        });

        it(`vec3_is_null_00`, () => {
            let a = new vec3f();
            expect(vec3_is_null(a)).toBeTrue();

            let b = new vec3f(numb.frand(-100, 100), numb.frand(-100, 100), numb.frand(-100, 100));
            expect(vec3_is_null(b)).toBeFalse();
        });
    });

    describe("vec3_is_fuzzy_null", () => {
        // Test case for a null vector
        it("returns true for a null vector", () => {
            const vec = [0, 0, 0];
            expect(vec3_is_fuzzy_null(vec)).toBe(true);
        });

        // Test case for a vector with non-zero values
        it("returns false for a vector with non-zero values", () => {
            const vec = [1, 2, 3];
            expect(vec3_is_fuzzy_null(vec)).toBe(false);
        });

        // Test case for a vector with very small values
        it("returns true for a vector with very small values", () => {
            const epsilon = 1e-9;
            const vec = [epsilon / 2, epsilon / 2, epsilon / 2];
            expect(vec3_is_fuzzy_null(vec)).toBe(true);
        });

        // Test case for a vector with mixed positive and negative values
        it("returns false for a vector with mixed positive and negative values", () => {
            const vec = [0.1, -0.1, 0];
            expect(vec3_is_fuzzy_null(vec)).toBe(false);
        });

        // Test case for a vector with only one component being almost zero
        it("returns false for a vector with only one component being almost zero", () => {
            const vec = [0, 0.00001, 0];
            expect(vec3_is_fuzzy_null(vec)).toBe(false);
        });

        it(`vec3_is_fuzzy_null_00`, () => {
            let a = new vec3f();
            expect(vec3_is_fuzzy_null(a)).toBeTrue();

            let b = new vec3f(Number.EPSILON, Number.EPSILON, Number.EPSILON);
            expect(vec3_is_fuzzy_null(a)).toBeTrue();

            let c = new vec3f(numb.frand(-100, 100), numb.frand(-100, 100), numb.frand(-100, 100));
            expect(vec3_is_fuzzy_null(c)).toBeFalse();
        });
    });

    describe("vec3_equals function", () => {
        it("returns true for equal vec3 objects", () => {
            const v1 = [1, 2, 3];
            const v2 = [1, 2, 3];
            expect(vec3_equals(v1, v2)).toBe(true);
        });

        it("returns false for different vec3 objects", () => {
            const v1 = [1, 2, 3];
            const v2 = [4, 5, 6];
            expect(vec3_equals(v1, v2)).toBe(false);
        });

        it("returns false if any component is NaN", () => {
            const v1 = [1, NaN, 3];
            const v2 = [1, 2, 3];
            expect(vec3_equals(v1, v2)).toBe(false);
        });

        it("returns true if both vectors are empty", () => {
            const v1 = [];
            const v2 = [];
            expect(vec3_equals(v1, v2)).toBe(true);
        });

        it("returns false if one vector is empty and the other is not", () => {
            const v1 = [];
            const v2 = [1, 2, 3];
            expect(vec3_equals(v1, v2)).toBe(false);
        });

        it(`vec3_equals_00`, () => {
            let a = numb.frand(-100, 100);
            let b = numb.frand(-100, 100);
            let c = numb.frand(-100, 100);

            let d = new vec3f(a, b, c), e = new vec3f(a, b, c);
            expect(vec3_equals(d, e)).toBeTrue();

            d[Y_AXIS] += 0.00001;
            expect(vec3_equals(d, e)).toBeFalse();
        });
    });

    describe("vec3_fuzzy_equals", () => {
        it("returns true for identical vectors", () => {
            const v1 = [1, 2, 3];
            const v2 = [1, 2, 3];
            expect(vec3_fuzzy_equals(v1, v2)).toBeTrue();
        });

        it("returns false for different vectors", () => {
            const v1 = [1, 2, 3];
            const v2 = [4, 5, 6];
            expect(vec3_fuzzy_equals(v1, v2)).toBeFalse();
        });

        it("returns true for vectors within tolerance", () => {
            const v1 = [1, 2, 3];
            const v2 = [1.0000001, 2.0000001, 3.0000001];
            expect(vec3_fuzzy_equals(v1, v2)).toBeTrue();
        });

        it("returns true for negative vectors within tolerance", () => {
            const v1 = [-1, -2, -3];
            const v2 = [-1.00000001, -2.0000001, -3.00000001];
            expect(vec3_fuzzy_equals(v1, v2)).toBeTrue();
        });

        it("returns true for zero vectors within tolerance", () => {
            const v1 = [0, 0, 0];
            const v2 = [0.000001, 0.000001, 0.000001];
            expect(vec3_fuzzy_equals(v1, v2)).toBeTrue();
        });

        it("returns false for vectors outside tolerance", () => {
            const v1 = [1, 2, 3];
            const v2 = [1.001, 2.001, 3.001];
            expect(vec3_fuzzy_equals(v1, v2)).toBeFalse();
        });

        it("returns false for vectors with mixed components within tolerance", () => {
            const v1 = [1, 2, 3];
            const v2 = [1.001, 2, 2.999];
            expect(vec3_fuzzy_equals(v1, v2)).toBeFalse();
        });

        it(`vec3_fuzzy_equals_00`, () => {
            let a = numb.frand(-100, 100);
            let b = numb.frand(-100, 100);
            let c = numb.frand(-100, 100);

            let d = new vec3f(a, b, c), e = new vec3f(a, b, c);
            expect(vec3_fuzzy_equals(d, e)).toBeTrue();

            d[Y_AXIS] += 0.001;
            expect(vec3_fuzzy_equals(d, e)).toBeFalse();
        });
    });

    describe("vec3_length_square function", () => {
        // Test case: Calculate squared length of a vector with positive components.
        it("Calculates squared length of vector with positive components", () => {
            const vec = [3, 4, 5];
            expect(vec3_length_square(vec)).toEqual(50);
        });

        // Test case: Calculate squared length of a vector with negative components.
        it("Calculates squared length of vector with negative components", () => {
            const vec = [-3, -4, -5];
            expect(vec3_length_square(vec)).toEqual(50);
        });

        // Test case: Calculate squared length of a vector with mixed positive and negative components.
        it("Calculates squared length of vector with mixed positive and negative components", () => {
            const vec = [-3, 4, -5];
            expect(vec3_length_square(vec)).toEqual(50);
        });

        // Test case: Calculate squared length of a vector with all zero components.
        it("Calculates squared length of vector with all zero components", () => {
            const vec = [0, 0, 0];
            expect(vec3_length_square(vec)).toEqual(0);
        });

        // Test case: Calculate squared length of a vector with NaN components.
        it("Calculates squared length of vector with NaN components", () => {
            const vec = [NaN, NaN, NaN];
            expect(vec3_length_square(vec)).toBeNaN();
        });

        // Test case: Calculate squared length of a vector with Infinity components.
        it("Calculates squared length of vector with Infinity components", () => {
            const vec = [Infinity, Infinity, Infinity];
            expect(vec3_length_square(vec)).toEqual(Infinity);
        });

        // Test case: Calculate squared length of a vector with negative Infinity components.
        it("Calculates squared length of vector with negative Infinity components", () => {
            const vec = [-Infinity, -Infinity, -Infinity];
            expect(vec3_length_square(vec)).toEqual(Infinity);
        });

        it("vec3_length_square_00", () => {
            expect(vec3_length_square(new vec3f(.8037977205877175, -4.539266557250117, 2.062433690517103))).toBeCloseTo(25.504664381171334, 3);
            expect(vec3_length_square(new vec3f(-38.5753740038356483, -23.3998254500116367, 76.4309709349504232))).toBeCloseTo(7877.304628686047, 3);
            expect(vec3_length_square(new vec3f(1.71323395197591e1, -14.6874966296597798, 6.074326662804302))).toBeCloseTo(546.1370590730221, 3);
            expect(vec3_length_square(new vec3f(4.381189629475206, -0.7847383087207108, 1.3034996596177417))).toBeCloseTo(21.509748145218506, 3);
            expect(vec3_length_square(new vec3f(12.4008130423539225, -9.886420452063545, -1.65881178359544e1))).toBeCloseTo(526.687126805904, 3);
            expect(vec3_length_square(new vec3f(-43.0075005451501653, 17.4727387722240941, -16.9839483987116289))).toBeCloseTo(2443.396206553574, 3);
            expect(vec3_length_square(new vec3f(1.1122374984675718, 3.6149122669020084, 2.6080272236843323))).toBeCloseTo(21.106468949874625, 3);
            expect(vec3_length_square(new vec3f(2.4300896388374484, 18.2864134745105673, 24.1588249014713412))).toBeCloseTo(923.9470740334984, 3);
            expect(vec3_length_square(new vec3f(-15.4242936094537377, 50.0320881191177804, 33.5987653270643136))).toBeCloseTo(3869.995706412941, 3);
            expect(vec3_length_square(new vec3f(-27.0564992972246188, -13.9214451447429592, 9.13598568457032e1))).toBeCloseTo(9272.484232006187, 3);
            expect(vec3_length_square(new vec3f(-6.92822450605958e1, -13.7475725455697848, -37.8091025363278064))).toBeCloseTo(6418.553466134705, 3);
            expect(vec3_length_square(new vec3f(-2.2135456024572044, -4.370928082689437, 1.16933235450724))).toBeCloseTo(25.37213459349823, 3);
            expect(vec3_length_square(new vec3f(.4856675131609272, 5.525279612051174, -0.5633274022524473))).toBeCloseTo(31.08192548681678, 3);
            expect(vec3_length_square(new vec3f(48.4386384493404663, 53.1716332621839314, -50.3899094792725109))).toBeCloseTo(7712.667255923387, 3);
            expect(vec3_length_square(new vec3f(2.369765245813205, .0067411298844129, -3.3716595217132643))).toBeCloseTo(16.983920693455957, 3);
            expect(vec3_length_square(new vec3f(-13.152600459544681, 61.6186584622191802, 13.3110845132763682))).toBeCloseTo(4147.034940451616, 3);
            expect(vec3_length_square(new vec3f(18.2557463819169499, -58.7471445120026132, 14.0846286672124421))).toBeCloseTo(3982.876028968255, 3);
            expect(vec3_length_square(new vec3f(-38.9914688188096505, 82.427366781833129, 14.1189219275228321))).toBeCloseTo(8513.949391630538, 3);
            expect(vec3_length_square(new vec3f(-80.058066007955361, 22.5408679629752022, 38.1287121682460963))).toBeCloseTo(8371.183353067378, 3);
            expect(vec3_length_square(new vec3f(-6.29855788129945e1, 62.2398715664996089, 19.5235216719075524))).toBeCloseTo(8222.152649495752, 3);
        });
    });

    describe("vec3_length", () => {
        it("should return the length of the vector", () => {
            // Test with a vector with positive components
            expect(vec3_length([1, 2, 2])).toBeCloseTo(3, 5);

            // Test with a vector with negative components
            expect(vec3_length([-1, -2, -2])).toBeCloseTo(3, 5);

            // Test with a vector with mixed positive and negative components
            expect(vec3_length([1, -2, 2])).toBeCloseTo(Math.sqrt(9), 5); // sqrt(1^2 + (-2)^2 + 2^2) = sqrt(9) = 3

            // Test with a vector with zero components
            expect(vec3_length([0, 0, 0])).toBe(0);
        });

        it("should handle edge cases", () => {
            // Test with a vector with very large components
            expect(vec3_length([1e9, 2e9, 3e9])).toBeCloseTo(3.74165738677e9, 2); // sqrt((1e9)^2 + (2e9)^2 + (3e9)^2) ≈ 3.74165738677e9
        });

        it("vec3_length_00", () => {
            expect(vec3_length(new vec3f(29.7537695251819656, -18.0504303216833399, -52.1806023468429885))).toBeCloseTo(62.720970153808594, 3);
            expect(vec3_length(new vec3f(-13.423210834542461, 15.6844077913405293, -43.2642216348426203))).toBeCloseTo(47.93721008300781, 3);
            expect(vec3_length(new vec3f(-5.32319045495635, -0.3944619771124657, 4.7820401566823305))).toBeCloseTo(7.166579723358154, 3);
            expect(vec3_length(new vec3f(-63.4175408099363906, 15.8013597032865878, -31.5558785715721619))).toBeCloseTo(72.57575988769531, 3);
            expect(vec3_length(new vec3f(1.4557246536197062, -11.5256740310095136, 13.3970970675705825))).toBeCloseTo(17.732526779174805, 3);
            expect(vec3_length(new vec3f(37.0323225349959557, 12.6053769586283622, 4.43336618800233e1))).toBeCloseTo(59.12496948242188, 3);
            expect(vec3_length(new vec3f(-26.7969541507954396, -11.6958059830748251, -8.079146354702575))).toBeCloseTo(30.333829879760746, 3);
            expect(vec3_length(new vec3f(16.5020065893207502, 11.6997861332046647, 31.8851114737364618))).toBeCloseTo(37.760581970214844, 3);
            expect(vec3_length(new vec3f(72.7651250932351559, -32.0417890518606328, -23.2308057524212757))).toBeCloseTo(82.83181762695315, 3);
            expect(vec3_length(new vec3f(-27.4041103006424258, 2.97712591990443e1, -4.742321895924173))).toBeCloseTo(40.74067687988281, 3);
            expect(vec3_length(new vec3f(-66.7201397578438531, 3.042323103103717, 1.4263632641985018))).toBeCloseTo(66.80469512939453, 3);
            expect(vec3_length(new vec3f(-6.325307339910759, -1.1711354163422407, 8.913039428008835))).toBeCloseTo(10.991967201232912, 3);
            expect(vec3_length(new vec3f(4.687879566436573, -43.8786802712952806, -7.4686698405719385))).toBeCloseTo(44.755958557128906, 3);
            expect(vec3_length(new vec3f(3.226178619923468, -4.361186292382279, -10.8441117078620479))).toBeCloseTo(12.125301361083984, 3);
            expect(vec3_length(new vec3f(42.6748044418802408, 50.426145991862235, 40.232513719164487))).toBeCloseTo(77.34720611572266, 3);
            expect(vec3_length(new vec3f(-34.4138915074254683, 4.142645561941556, 16.80209360085939))).toBeCloseTo(38.51996612548828, 3);
            expect(vec3_length(new vec3f(-26.7022064862534023, -6.50216629287846e1, 48.7059666359344732))).toBeCloseTo(85.51663970947266, 3);
            expect(vec3_length(new vec3f(2.0500529914231396, 2.8180100855696484, 8.463801470357671))).toBeCloseTo(9.15313243865967, 3);
            expect(vec3_length(new vec3f(2.475238948680543, 8.263668277789463, -33.1538927593237531))).toBeCloseTo(34.257781982421875, 3);
            expect(vec3_length(new vec3f(-2.521565929214618, -36.2472188004682749, 73.6407202512453267))).toBeCloseTo(82.11683654785156, 3);
        });
    });

    describe("vec3_set_length", () => {
        it("should correctly set the length of a 3D vector", () => {
            // Test case 1: Set length of vector [1, 0, 0] to 1
            let vec = vec3_set_length([1, 0, 0], 1);
            expect(vec3_length(vec)).toBeCloseTo(1);

            // Test case 2: Set length of vector [0, 1, 0] to 2
            vec = vec3_set_length([0, 1, 0], 2);
            expect(vec3_length(vec)).toBeCloseTo(2);

            // Test case 3: Set length of vector [0, 0, 1] to 0.5
            vec = vec3_set_length([0, 0, 1], 0.5);
            expect(vec3_length(vec)).toBeCloseTo(0.5);

            // Test case 4: Set length of vector [1, 1, 1] to sqrt(3)
            vec = vec3_set_length([1, 1, 1], Math.sqrt(3));
            expect(vec3_length(vec)).toBeCloseTo(Math.sqrt(3));

            // Test case 5: Set length of vector [0, 0, 0] to 1
            vec = vec3_set_length([0, 0, 0], 1);
            expect(vec3_length(vec)).toBeCloseTo(0);
        });

        it("should handle edge cases", () => {
            // Test case 6: Set length of vector [1, 1, 1] to 0
            let vec = vec3_set_length([1, 1, 1], 0);
            expect(vec3_length(vec)).toBeCloseTo(0);
        });

        it("vec3_set_length_00", () => {
            let va;
            va = vec3_set_length(new vec3f(.9385741420865232, .4115536375877284, .3668387853333019), 98.39894104003906);
            expect(va.x).toBeCloseTo(84.84454613262184, 3);
            expect(va.y).toBeCloseTo(37.20332792541541, 3);
            expect(va.z).toBeCloseTo(33.16122706753313, 3);

            va = vec3_set_length(new vec3f(.6422915553300308, .130404054571263, .9862026541824538), 23.136442184448242);
            expect(va.x).toBeCloseTo(12.549695880165391, 3);
            expect(va.y).toBeCloseTo(2.547956940783595, 3);
            expect(va.z).toBeCloseTo(19.269354055016702, 3);

            va = vec3_set_length(new vec3f(.351176697688482, .7829150747101652, .7632366804911774), 61.72559356689453);
            expect(va.x).toBeCloseTo(18.87555076947596, 3);
            expect(va.y).toBeCloseTo(42.08124667197837, 3);
            expect(va.z).toBeCloseTo(41.02354400666156, 3);

            va = vec3_set_length(new vec3f(.7492243898169324, .5460129571395584, .6409137919988355), 90.1861343383789);
            expect(va.x).toBeCloseTo(59.95275685673119, 3);
            expect(va.y).toBeCloseTo(43.691826514098516, 3);
            expect(va.z).toBeCloseTo(51.285768669677886, 3);

            va = vec3_set_length(new vec3f(.774282240151831, .8770929277544504, .9417627862007631), 81.53678131103516);
            expect(va.x).toBeCloseTo(42.03490407244126, 3);
            expect(va.y).toBeCloseTo(47.61637962088002, 3);
            expect(va.z).toBeCloseTo(51.127232841065016, 3);

            va = vec3_set_length(new vec3f(.0678870152266191, .4546337971736691, .757081704599412), 45.36310577392578);
            expect(va.x).toBeCloseTo(3.476965868994617, 3);
            expect(va.y).toBeCloseTo(23.284956488180438, 3);
            expect(va.z).toBeCloseTo(38.77541586038465, 3);

            va = vec3_set_length(new vec3f(.9935132594932699, .1544708811756585, .9833190601332651), 75.93348693847656);
            expect(va.x).toBeCloseTo(53.64271492330174, 3);
            expect(va.y).toBeCloseTo(8.340339058064881, 3);
            expect(va.z).toBeCloseTo(53.09229999434654, 3);

            va = vec3_set_length(new vec3f(.5846841534353726, .1053811677625196, .2569894560689858), 43.71331024169922);
            expect(va.x).toBeCloseTo(39.48442000341013, 3);
            expect(va.y).toBeCloseTo(7.116516265982688, 3);
            expect(va.z).toBeCloseTo(17.354805257258178, 3);

            va = vec3_set_length(new vec3f(.9254919570618192, .5973196152915801, .4980291181602075), 61.22072982788086);
            expect(va.x).toBeCloseTo(46.869754547068986, 3);
            expect(va.y).toBeCloseTo(30.25009946466341, 3);
            expect(va.z).toBeCloseTo(25.22172380575637, 3);

            va = vec3_set_length(new vec3f(.9211068298010869, .1095339943012894, .4572193471533794), 1.3853859901428223);
            expect(va.x).toBeCloseTo(1.23393829080943, 3);
            expect(va.y).toBeCloseTo(0.14673454298764707, 3);
            expect(va.z).toBeCloseTo(0.6125027428938719, 3);

            va = vec3_set_length(new vec3f(.9703011051272492, .2895243999164452, .2315563602551007), 50.23245620727539);
            expect(va.x).toBeCloseTo(46.92398826696741, 3);
            expect(va.y).toBeCloseTo(14.001467660802447, 3);
            expect(va.z).toBeCloseTo(11.198119711846637, 3);

            va = vec3_set_length(new vec3f(.8680052757018475, .3757059282313584, .394534451471819), 63.00142288208008);
            expect(va.x).toBeCloseTo(53.36141048524333, 3);
            expect(va.y).toBeCloseTo(23.09686221881821, 3);
            expect(va.z).toBeCloseTo(24.25436273821629, 3);

            va = vec3_set_length(new vec3f(.6287927164116875, .4844861611135789, .1409320798333504), 5.384856224060059);
            expect(va.x).toBeCloseTo(4.199864724180627, 3);
            expect(va.y).toBeCloseTo(3.236004941384196, 3);
            expect(va.z).toBeCloseTo(0.9413208123262777, 3);

            va = vec3_set_length(new vec3f(.7617378005797844, .6019494916811863, .1848310782977014), 12.64136791229248);
            expect(va.x).toBeCloseTo(9.743339275296568, 3);
            expect(va.y).toBeCloseTo(7.699497280531515, 3);
            expect(va.z).toBeCloseTo(2.3641624494710713, 3);

            va = vec3_set_length(new vec3f(.7844827457167522, .6955370180209588, .0373610795016437), 84.39119720458984);
            expect(va.x).toBeCloseTo(63.105844563055044, 3);
            expect(va.y).toBeCloseTo(55.95081751221765, 3);
            expect(va.z).toBeCloseTo(3.005422985542563, 3);

            va = vec3_set_length(new vec3f(.1024525168179931, .5671774580477063, .2635323742838447), 16.79768943786621);
            expect(va.x).toBeCloseTo(2.7155375272060414, 3);
            expect(va.y).toBeCloseTo(15.033224363341194, 3);
            expect(va.z).toBeCloseTo(6.985011927748045, 3);

            va = vec3_set_length(new vec3f(.5440132224297831, .8928397032664623, .3953967145313875), 3.921834945678711);
            expect(va.x).toBeCloseTo(1.908705980121027, 3);
            expect(va.y).toBeCloseTo(3.1325865082886666, 3);
            expect(va.z).toBeCloseTo(1.3872752397000352, 3);

            va = vec3_set_length(new vec3f(.200253961035519, .4558681549937733, .7455439535765818), 80.8282241821289);
            expect(va.x).toBeCloseTo(18.05438886330751, 3);
            expect(va.y).toBeCloseTo(41.099915817376996, 3);
            expect(va.z).toBeCloseTo(67.21635059279468, 3);

            va = vec3_set_length(new vec3f(.770326090727157, .7339372265777355, .3976036863855716), 97.98324584960938);
            expect(va.x).toBeCloseTo(66.45161087496624, 3);
            expect(va.y).toBeCloseTo(63.31255240382348, 3);
            expect(va.z).toBeCloseTo(34.29898814047097, 3);

            va = vec3_set_length(new vec3f(.0035762951444238, .4648394048514941, .5136110733327515), 19.203737258911133);
            expect(va.x).toBeCloseTo(0.09914038767147726, 3);
            expect(va.y).toBeCloseTo(12.886061396194041, 3);
            expect(va.z).toBeCloseTo(14.238086865388263, 3);
        });
    });

    describe("vec3_normalize", () => {
        // Test cases for normalizing a 3D vector

        // Test case: Normalizing a non-zero vector
        it("should normalize a non-zero vector", () => {
            const vec = [3, 4, 5];
            const normalizedVec = vec3_normalize(vec);
            expect(normalizedVec[0]).toBeCloseTo(0.424, 3);
            expect(normalizedVec[1]).toBeCloseTo(0.566, 3);
            expect(normalizedVec[2]).toBeCloseTo(0.707, 3);
        });

        // Test case: Normalizing a zero vector
        it("should return the zero vector when normalizing a zero vector", () => {
            const vec = [0, 0, 0];
            const normalizedVec = vec3_normalize(vec);
            expect(normalizedVec).toEqual([0, 0, 0]);
        });

        // Test case: Normalizing a vector of length 1
        it("should return the same vector when normalizing a vector of length 1", () => {
            const vec = [0.5, 0.5, 0.5]; // Length of this vector is 1
            const normalizedVec = vec3_normalize(vec);
            expect(normalizedVec).toEqual(vec);
        });

        // Test case: Normalizing a vector of length 0.707
        it("should normalize a vector of length 0.707 to a unit vector", () => {
            const vec = [1, 1, 1];
            const normalizedVec = vec3_normalize(vec);
            expect(normalizedVec[0]).toBeCloseTo(0.577, 3);
            expect(normalizedVec[1]).toBeCloseTo(0.577, 3);
            expect(normalizedVec[2]).toBeCloseTo(0.577, 3);
        });

        // Test case: Normalizing a vector with negative components
        it("should normalize a vector with negative components", () => {
            const vec = [-2, -4, -6];
            const normalizedVec = vec3_normalize(vec);
            expect(normalizedVec[0]).toBeCloseTo(-0.267, 3);
            expect(normalizedVec[1]).toBeCloseTo(-0.534, 3);
            expect(normalizedVec[2]).toBeCloseTo(-0.8017, 3);
        });

        // Test case: Normalizing a large vector
        it("should normalize a large vector", () => {
            const vec = [1000, 2000, 3000];
            const normalizedVec = vec3_normalize(vec);
            expect(normalizedVec[0]).toBeCloseTo(0.267, 3);
            expect(normalizedVec[1]).toBeCloseTo(0.534, 3);
            expect(normalizedVec[2]).toBeCloseTo(0.8017, 3);
        });

        it("vec3_normalize_00", () => {
            let va;
            va = vec3_normalize(new vec3f(20.3020548607809168, 6.47739882866386e1, .3005032072670565));
            expect(va.x).toBeCloseTo(0.2990796786557459, 3);
            expect(va.y).toBeCloseTo(0.9542178727653067, 3);
            expect(va.z).toBeCloseTo(0.004426862368403395, 3);

            va = vec3_normalize(new vec3f(-15.3067827618497532, 14.2635008255462097, 5.37371795936061));
            expect(va.x).toBeCloseTo(-0.7086003462530576, 3);
            expect(va.y).toBeCloseTo(0.6603034603034648, 3);
            expect(va.z).toBeCloseTo(0.24876673732900387, 3);

            va = vec3_normalize(new vec3f(20.7776581049481486, -78.0098217602611754, 47.2198619846863394));
            expect(va.x).toBeCloseTo(0.2221611203634957, 3);
            expect(va.y).toBeCloseTo(-0.8341050427376584, 3);
            expect(va.z).toBeCloseTo(0.5048893089365682, 3);

            va = vec3_normalize(new vec3f(23.2367151528895057, 23.0184172181512956, -40.1205533824715346));
            expect(va.x).toBeCloseTo(0.44890227149191064, 3);
            expect(va.y).toBeCloseTo(0.4446850472361927, 3);
            expect(va.z).toBeCloseTo(-0.7750754540133159, 3);

            va = vec3_normalize(new vec3f(1.3423623906627442, -6.011727850846275, -0.9217582021592613));
            expect(va.x).toBeCloseTo(0.21552427345108074, 3);
            expect(va.y).toBeCloseTo(-0.9652186967183857, 3);
            expect(va.z).toBeCloseTo(-0.1479937669587623, 3);

            va = vec3_normalize(new vec3f(25.154441369757464, 11.0691710213497441, -24.5707232859965679));
            expect(va.x).toBeCloseTo(0.6823482489193138, 3);
            expect(va.y).toBeCloseTo(0.30026623737656216, 3);
            expect(va.z).toBeCloseTo(-0.6665141062936839, 3);

            va = vec3_normalize(new vec3f(-2.3767656458723914, 7.680325648389695, 27.2065923946197508));
            expect(va.x).toBeCloseTo(-0.08377856376941466, 3);
            expect(va.y).toBeCloseTo(0.2707236421146226, 3);
            expect(va.z).toBeCloseTo(0.9590046203501462, 3);

            va = vec3_normalize(new vec3f(-66.0435945202649464, 3.53926843854552e1, -9.414809437853725));
            expect(va.x).toBeCloseTo(-0.8745358214531775, 3);
            expect(va.y).toBeCloseTo(0.46866271494307726, 3);
            expect(va.z).toBeCloseTo(-0.1246689881943377, 3);

            va = vec3_normalize(new vec3f(19.6465913363824249, -10.8469379183093633, -92.0643143254854266));
            expect(va.x).toBeCloseTo(0.20732971721058238, 3);
            expect(va.y).toBeCloseTo(-0.1144673156121095, 3);
            expect(va.z).toBeCloseTo(-0.971551142255485, 3);

            va = vec3_normalize(new vec3f(45.480128772280338, -44.2361949746929, 22.8434081749379914));
            expect(va.x).toBeCloseTo(0.6744569356120137, 3);
            expect(va.y).toBeCloseTo(-0.656009763190277, 3);
            expect(va.z).toBeCloseTo(0.3387610258041627, 3);

            va = vec3_normalize(new vec3f(1.3905622786727578, 8.037244132525116, -6.1455239178934695));
            expect(va.x).toBeCloseTo(0.13616063797563352, 3);
            expect(va.y).toBeCloseTo(0.7869883322989756, 3);
            expect(va.z).toBeCloseTo(-0.601755469847467, 3);

            va = vec3_normalize(new vec3f(31.5470888613835854, -18.9535330907818214, 26.8299285089859829));
            expect(va.x).toBeCloseTo(0.6926653682963164, 3);
            expect(va.y).toBeCloseTo(-0.4161542777062132, 3);
            expect(va.z).toBeCloseTo(0.5890927810708159, 3);

            va = vec3_normalize(new vec3f(-1.333281082491239, 18.02149652747282, -8.75635338544876));
            expect(va.x).toBeCloseTo(-0.06639687120406257, 3);
            expect(va.y).toBeCloseTo(0.8974634077934099, 3);
            expect(va.z).toBeCloseTo(-0.43606293945501845, 3);

            va = vec3_normalize(new vec3f(29.3386246486185236, 4.806274785541212, 27.7134218638911882));
            expect(va.x).toBeCloseTo(0.721853938157709, 3);
            expect(va.y).toBeCloseTo(0.11825463611070766, 3);
            expect(va.z).toBeCloseTo(0.6818670933580315, 3);

            va = vec3_normalize(new vec3f(-5.91174152365565e1, 2.212416600422884, 44.0001144274098763));
            expect(va.x).toBeCloseTo(-0.8018345318523382, 3);
            expect(va.y).toBeCloseTo(0.030007943039523137, 3);
            expect(va.z).toBeCloseTo(0.5967921806489076, 3);

            va = vec3_normalize(new vec3f(-41.7237138750886629, -14.951654682513924, 7.733208557800798));
            expect(va.x).toBeCloseTo(-0.927371624368355, 3);
            expect(va.y).toBeCloseTo(-0.33232277288231193, 3);
            expect(va.z).toBeCloseTo(0.17188206695350774, 3);

            va = vec3_normalize(new vec3f(-10.0209096559205761, -4.459995031346376, 9.661125587164646));
            expect(va.x).toBeCloseTo(-0.6855801029775394, 3);
            expect(va.y).toBeCloseTo(-0.3051303681860075, 3);
            expect(va.z).toBeCloseTo(0.6609654913926882, 3);

            va = vec3_normalize(new vec3f(5.631002314669363, -57.5169040795285724, 19.8040013336817751));
            expect(va.x).toBeCloseTo(0.09217412357900524, 3);
            expect(va.y).toBeCloseTo(-0.9414967226522178, 3);
            expect(va.z).toBeCloseTo(0.3241725654301657, 3);

            va = vec3_normalize(new vec3f(-50.9843659040938135, -20.9029445735518244, -54.5378213214658487));
            expect(va.x).toBeCloseTo(-0.6576185276230019, 3);
            expect(va.y).toBeCloseTo(-0.26961527106764727, 3);
            expect(va.z).toBeCloseTo(-0.7034525412094793, 3);

            va = vec3_normalize(new vec3f(18.9178183990910327, 67.788194513904827, -1.2150429699094225));
            expect(va.x).toBeCloseTo(0.2687613259293784, 3);
            expect(va.y).toBeCloseTo(0.9630521160299889, 3);
            expect(va.z).toBeCloseTo(-0.017261850852195337, 3);
        });
    });

    describe("vec3_normalized", () => {
        it("returns the normalized vector when input vector is not zero", () => {
            const input = new vec3f(3, 4, 5);
            const result = vec3_normalized(input);
            expect(result).toEqual(new vec3f(3 / Math.sqrt(50), 4 / Math.sqrt(50), 5 / Math.sqrt(50)));
        });

        it("returns zero vector when input vector is zero", () => {
            const input = new vec3f(0, 0, 0);
            const result = vec3_normalized(input);
            expect(result).toEqual(new vec3f(0, 0, 0));
        });

        it("returns zero vector when input vector is already normalized", () => {
            const input = new vec3f(1, 0, 0);
            const result = vec3_normalized(input);
            expect(result).toEqual(new vec3f(1, 0, 0));
        });

        it("returns zero vector when input vector is NaN", () => {
            const input = new vec3f(NaN, NaN, NaN);
            const result = vec3_normalized(input);
            expect(result).toEqual(new vec3f(NaN, NaN, NaN));
        });

        it("returns the normalized vector when result vector is provided", () => {
            const input = new vec3f(3, 4, 5);
            const result = new vec3f();
            const normalized = vec3_normalized(input, result);
            expect(normalized).toBe(result);
            expect(normalized).toEqual(new vec3f(3 / Math.sqrt(50), 4 / Math.sqrt(50), 5 / Math.sqrt(50)));
        });

        it("vec3_normalized_00", () => {
            let va;
            va = vec3_normalized(new vec3f(2.38215033230739e1, -55.322126124150607, -14.2760616580196551), new vec3f());
            expect(va.x).toBeCloseTo(0.3848285801288783, 3);
            expect(va.y).toBeCloseTo(-0.8937108190584347, 3);
            expect(va.z).toBeCloseTo(-0.2306250979704796, 3);

            va = vec3_normalized(new vec3f(8.178882291589304, -5.178198076695633, 8.501064569745239), new vec3f());
            expect(va.x).toBeCloseTo(0.6348503697160175, 3);
            expect(va.y).toBeCloseTo(-0.4019352334772624, 3);
            expect(va.z).toBeCloseTo(0.6598583758360688, 3);

            va = vec3_normalized(new vec3f(22.8741040724350846, -4.34633867484971e1, 8.355452325993419), new vec3f());
            expect(va.x).toBeCloseTo(0.4591283257974184, 3);
            expect(va.y).toBeCloseTo(-0.8723957855630591, 3);
            expect(va.z).toBeCloseTo(0.1677103866260898, 3);

            va = vec3_normalized(new vec3f(-6.4472690894551175, -58.8463257218802553, -11.6613025468326033), new vec3f());
            expect(va.x).toBeCloseTo(-0.10685593792515449, 3);
            expect(va.y).toBeCloseTo(-0.9753089627894044, 3);
            expect(va.z).toBeCloseTo(-0.19327243888560908, 3);

            va = vec3_normalized(new vec3f(13.9311428291377055, -30.396570750601601, .5167163675308154), new vec3f());
            expect(va.x).toBeCloseTo(0.41658967774128175, 3);
            expect(va.y).toBeCloseTo(-0.908963303925654, 3);
            expect(va.z).toBeCloseTo(0.015451618555161417, 3);

            va = vec3_normalized(new vec3f(-77.4543755342447469, -36.3902150954701895, 27.7430240555025804), new vec3f());
            expect(va.x).toBeCloseTo(-0.8609707782528085, 3);
            expect(va.y).toBeCloseTo(-0.40450796479124407, 3);
            expect(va.z).toBeCloseTo(0.3083871356188497, 3);

            va = vec3_normalized(new vec3f(-7.48352693437209e1, 41.8670264949642217, -30.5444245979904885), new vec3f());
            expect(va.x).toBeCloseTo(-0.8221111246589362, 3);
            expect(va.y).toBeCloseTo(0.4599348480969755, 3);
            expect(va.z).toBeCloseTo(-0.3355491532071433, 3);

            va = vec3_normalized(new vec3f(17.2035493678160343, -40.5400323912490563, -39.9393762975917639), new vec3f());
            expect(va.x).toBeCloseTo(0.2893658661290584, 3);
            expect(va.y).toBeCloseTo(-0.6818884484233085, 3);
            expect(va.z).toBeCloseTo(-0.6717853373111331, 3);

            va = vec3_normalized(new vec3f(-27.4193648213882852, 14.3087640551204576, 11.7771990578113392), new vec3f());
            expect(va.x).toBeCloseTo(-0.8285101664724258, 3);
            expect(va.y).toBeCloseTo(0.4323570792593684, 3);
            expect(va.z).toBeCloseTo(0.3558626983348234, 3);

            va = vec3_normalized(new vec3f(24.4930043736074374, -2.5340913210191855, 87.1095045577709328), new vec3f());
            expect(va.x).toBeCloseTo(0.2705724795217296, 3);
            expect(va.y).toBeCloseTo(-0.027993926821059473, 3);
            expect(va.z).toBeCloseTo(0.9622925092645168, 3);

            va = vec3_normalized(new vec3f(-3.5462396235863167, 24.9664189781822259, -1.6719849011721655), new vec3f());
            expect(va.x).toBeCloseTo(-0.14032073639282502, 3);
            expect(va.y).toBeCloseTo(0.9878932807612797, 3);
            expect(va.z).toBeCloseTo(-0.06615857287525806, 3);

            va = vec3_normalized(new vec3f(-1.3699019290735888, .4393607907037063, -0.5790913827234666), new vec3f());
            expect(va.x).toBeCloseTo(-0.8833452735026817, 3);
            expect(va.y).toBeCloseTo(0.2833102644749042, 3);
            expect(va.z).toBeCloseTo(-0.37341186620624706, 3);

            va = vec3_normalized(new vec3f(.9160408176580546, -11.4061774439098826, -8.75032764368304), new vec3f());
            expect(va.x).toBeCloseTo(0.06359121799797246, 3);
            expect(va.y).toBeCloseTo(-0.7918126598480749, 3);
            expect(va.z).toBeCloseTo(-0.6074445396065808, 3);

            va = vec3_normalized(new vec3f(-2.666514803760484, 2.991504601471674, -5.871449593922976), new vec3f());
            expect(va.x).toBeCloseTo(-0.37510692116765554, 3);
            expect(va.y).toBeCloseTo(0.420824245616192, 3);
            expect(va.z).toBeCloseTo(-0.8259550544634284, 3);

            va = vec3_normalized(new vec3f(11.0514023681014759, 28.7398585057987361, -1.34735334577545e1), new vec3f());
            expect(va.x).toBeCloseTo(0.32881045470981546, 3);
            expect(va.y).toBeCloseTo(0.8550920171781649, 3);
            expect(va.z).toBeCloseTo(-0.40087570022601954, 3);

            va = vec3_normalized(new vec3f(67.3917660589205809, -13.3799810453803278, 45.5096503418162683), new vec3f());
            expect(va.x).toBeCloseTo(0.8177382636197162, 3);
            expect(va.y).toBeCloseTo(-0.1623539952603117, 3);
            expect(va.z).toBeCloseTo(0.5522185368449942, 3);

            va = vec3_normalized(new vec3f(.5035952159864336, -2.694845072453683, 15.6346041376932678), new vec3f());
            expect(va.x).toBeCloseTo(0.03172624602583331, 3);
            expect(va.y).toBeCloseTo(-0.16977388794827897, 3);
            expect(va.z).toBeCloseTo(0.9849722190417523, 3);

            va = vec3_normalized(new vec3f(47.1825740892295755, 10.2367966814676485, 10.3743986954217284), new vec3f());
            expect(va.x).toBeCloseTo(0.9554544112007892, 3);
            expect(va.y).toBeCloseTo(0.20729671355735843, 3);
            expect(va.z).toBeCloseTo(0.21008317558831724, 3);

            va = vec3_normalized(new vec3f(28.4637123921998167, 31.3430429086136861, 1.73100798270352e1), new vec3f());
            expect(va.x).toBeCloseTo(0.6222846671521143, 3);
            expect(va.y).toBeCloseTo(0.6852337023074352, 3);
            expect(va.z).toBeCloseTo(0.3784396467726756, 3);

            va = vec3_normalized(new vec3f(4.301037784196884, -27.3700814002371438, -12.2192102813099766), new vec3f());
            expect(va.x).toBeCloseTo(0.14203825008279958, 3);
            expect(va.y).toBeCloseTo(-0.9038745209348075, 3);
            expect(va.z).toBeCloseTo(-0.4035294114662383, 3);
        });
    });

    describe("vec3_add", () => {
        // Test case 1: Adding two vectors with positive components
        it("should add two vectors with positive components correctly", () => {
            const v1 = new vec3f(1, 2, 3);
            const v2 = new vec3f(4, 5, 6);
            const result = vec3_add(v1, v2);
            expect(result).toEqual(new vec3f(5, 7, 9));
        });

        // Test case 2: Adding two vectors with negative components
        it("should add two vectors with negative components correctly", () => {
            const v1 = new vec3f(-1, -2, -3);
            const v2 = new vec3f(-4, -5, -6);
            const result = vec3_add(v1, v2);
            expect(result).toEqual(new vec3f(-5, -7, -9));
        });

        // Test case 3: Adding two zero vectors
        it("should return a zero vector when adding two zero vectors", () => {
            const v1 = new vec3f(0, 0, 0);
            const v2 = new vec3f(0, 0, 0);
            const result = vec3_add(v1, v2);
            expect(result).toEqual(new vec3f(0, 0, 0));
        });

        // Test case 4: Adding a vector with itself
        it("should double the vector when adding a vector with itself", () => {
            const v = new vec3f(1, 2, 3);
            const result = vec3_add(v, v);
            expect(result).toEqual(new vec3f(2, 4, 6));
        });

        it("vec3_add_00", () => {
            let va;
            va = vec3_add(new vec3f(12.6265267563964461, -33.6077891710020822, -22.8929188971618771), new vec3f(.3386353911748595, 2.533773914654102, 5.976511363741656));
            expect(va.x).toBeCloseTo(12.965162147571306, 3);
            expect(va.y).toBeCloseTo(-31.07401525634798, 3);
            expect(va.z).toBeCloseTo(-16.91640753342022, 3);

            va = vec3_add(new vec3f(5.217748434998137, 47.1631153892953421, -32.2163813027157744), new vec3f(6.248322255331525, -81.0716327184518661, -12.2926215022080978));
            expect(va.x).toBeCloseTo(11.466070690329662, 3);
            expect(va.y).toBeCloseTo(-33.908517329156524, 3);
            expect(va.z).toBeCloseTo(-44.509002804923874, 3);

            va = vec3_add(new vec3f(1.5370196864989552, 4.713120444741227, 5.595403186272559), new vec3f(-0.9222796267849168, 2.9021376524635687, 7.521619170999493));
            expect(va.x).toBeCloseTo(0.6147400597140383, 3);
            expect(va.y).toBeCloseTo(7.615258097204796, 3);
            expect(va.z).toBeCloseTo(13.117022357272052, 3);

            va = vec3_add(new vec3f(17.8306476780492495, 4.150417075123698, -3.20390345075891e1), new vec3f(-73.3264191177242424, -2.0644126827616045, -21.6108216184525155));
            expect(va.x).toBeCloseTo(-55.495771439674996, 3);
            expect(va.y).toBeCloseTo(2.086004392362094, 3);
            expect(va.z).toBeCloseTo(-53.64985612604161, 3);

            va = vec3_add(new vec3f(11.6191902226764139, -5.695662839231979, -4.83049041941696e1), new vec3f(9.87799818778088, 76.1509334623763294, -22.254876025799188));
            expect(va.x).toBeCloseTo(21.497188410457294, 3);
            expect(va.y).toBeCloseTo(70.45527062314434, 3);
            expect(va.z).toBeCloseTo(-70.55978021996879, 3);

            va = vec3_add(new vec3f(-35.0480906994269787, 43.5606738036346712, .0390579218719271), new vec3f(30.2010952111898057, -25.0469630614975323, -0.0024315379287156));
            expect(va.x).toBeCloseTo(-4.846995488237173, 3);
            expect(va.y).toBeCloseTo(18.51371074213714, 3);
            expect(va.z).toBeCloseTo(0.036626383943211445, 3);

            va = vec3_add(new vec3f(39.4078031138135927, 51.3525143833050635, -66.3057616545784612), new vec3f(-47.6091457142336623, -5.274531483418293, 61.8492939620013118));
            expect(va.x).toBeCloseTo(-8.20134260042007, 3);
            expect(va.y).toBeCloseTo(46.07798289988677, 3);
            expect(va.z).toBeCloseTo(-4.456467692577149, 3);

            va = vec3_add(new vec3f(-21.2562089833180252, 50.0069513461969493, -2.9569381953462375), new vec3f(-14.1471122184734632, -30.4814942585704856, -88.2391985691740217));
            expect(va.x).toBeCloseTo(-35.403321201791485, 3);
            expect(va.y).toBeCloseTo(19.525457087626464, 3);
            expect(va.z).toBeCloseTo(-91.19613676452026, 3);

            va = vec3_add(new vec3f(-18.0403306283924074, -11.8714004339255901, -19.7707935517992119), new vec3f(-1.5792894393526367, 15.044795368537228, -19.1021783956298954));
            expect(va.x).toBeCloseTo(-19.619620067745043, 3);
            expect(va.y).toBeCloseTo(3.173394934611638, 3);
            expect(va.z).toBeCloseTo(-38.87297194742911, 3);

            va = vec3_add(new vec3f(-69.771971792530536, 3.0232944136590416, 56.0058175201830863), new vec3f(-12.273753228530623, 48.0571930658869206, 68.9618524282523424));
            expect(va.x).toBeCloseTo(-82.04572502106116, 3);
            expect(va.y).toBeCloseTo(51.080487479545965, 3);
            expect(va.z).toBeCloseTo(124.96766994843543, 3);

            va = vec3_add(new vec3f(-33.5993377004824652, 49.5410980879040181, 35.3125313229910489), new vec3f(-48.6608162682817706, 51.7872276432351057, -3.9170125795314648));
            expect(va.x).toBeCloseTo(-82.26015396876423, 3);
            expect(va.y).toBeCloseTo(101.32832573113913, 3);
            expect(va.z).toBeCloseTo(31.395518743459583, 3);

            va = vec3_add(new vec3f(-19.5723430050544849, 63.2088406062025427, -38.2352168410502884), new vec3f(77.4250056060877796, 24.3835383304645887, -0.0664460680206378));
            expect(va.x).toBeCloseTo(57.852662601033295, 3);
            expect(va.y).toBeCloseTo(87.59237893666713, 3);
            expect(va.z).toBeCloseTo(-38.30166290907093, 3);

            va = vec3_add(new vec3f(3.24684205380244e1, -19.1401422450207193, -78.8037308904767144), new vec3f(-41.2198107506056743, -12.4265682645983695, -6.924773798827928));
            expect(va.x).toBeCloseTo(-8.751390212581278, 3);
            expect(va.y).toBeCloseTo(-31.56671050961909, 3);
            expect(va.z).toBeCloseTo(-85.72850468930464, 3);

            va = vec3_add(new vec3f(8.358939528663925, 35.4770609437305211, 20.8780214723215245), new vec3f(28.186058008432795, -38.6299929000192463, -10.8429381874962552));
            expect(va.x).toBeCloseTo(36.54499753709672, 3);
            expect(va.y).toBeCloseTo(-3.1529319562887252, 3);
            expect(va.z).toBeCloseTo(10.03508328482527, 3);

            va = vec3_add(new vec3f(-33.3549690956869753, 22.4352754931081506, 40.235745341675397), new vec3f(56.0190884908049327, -2.055964842091356, 62.1291462385749398));
            expect(va.x).toBeCloseTo(22.664119395117957, 3);
            expect(va.y).toBeCloseTo(20.379310651016795, 3);
            expect(va.z).toBeCloseTo(102.36489158025034, 3);

            va = vec3_add(new vec3f(-40.7910661172780635, 43.157998881385474, 6.274774166981968), new vec3f(-24.6333069410255838, -3.793200902562949, -57.413832036523317));
            expect(va.x).toBeCloseTo(-65.42437305830364, 3);
            expect(va.y).toBeCloseTo(39.36479797882252, 3);
            expect(va.z).toBeCloseTo(-51.13905786954135, 3);

            va = vec3_add(new vec3f(-52.5081945574865898, -62.6551093146571318, 12.5386566952205989), new vec3f(-17.6284058293435955, -52.9909583599673297, 41.9857447942218585));
            expect(va.x).toBeCloseTo(-70.13660038683018, 3);
            expect(va.y).toBeCloseTo(-115.64606767462446, 3);
            expect(va.z).toBeCloseTo(54.524401489442454, 3);

            va = vec3_add(new vec3f(23.5492264612897522, -14.0467738082747609, -3.5796300128429106), new vec3f(1.9332572145086742, 4.191311489373963, 4.32014624301315));
            expect(va.x).toBeCloseTo(25.482483675798427, 3);
            expect(va.y).toBeCloseTo(-9.855462318900798, 3);
            expect(va.z).toBeCloseTo(0.7405162301702397, 3);

            va = vec3_add(new vec3f(.0803973142258346, -3.2706192219957675, .1873645238615132), new vec3f(15.6380126048734773, -20.2359280472410035, 33.0478620009440789));
            expect(va.x).toBeCloseTo(15.718409919099312, 3);
            expect(va.y).toBeCloseTo(-23.50654726923677, 3);
            expect(va.z).toBeCloseTo(33.23522652480559, 3);

            va = vec3_add(new vec3f(-44.1065071783142599, 60.2774740024407265, 12.2014551625859795), new vec3f(5.812449004886326, 22.7523385872255162, 6.370685831392896));
            expect(va.x).toBeCloseTo(-38.294058173427935, 3);
            expect(va.y).toBeCloseTo(83.02981258966625, 3);
            expect(va.z).toBeCloseTo(18.572140993978877, 3);
        });

    });

    describe("vec3_rem function", () => {
        // Test case for subtracting two vectors
        it("subtracts two vectors correctly", () => {
            const v1 = new vec3f(3, 5, 7);
            const v2 = new vec3f(1, 2, 3);
            const result = vec3_rem(v1, v2);
            expect(result).toEqual(new vec3f(2, 3, 4));
        });

        // Test case for subtracting two vectors where one vector is negative
        it("subtracts two vectors with negative values correctly", () => {
            const v1 = new vec3f(3, -5, 7);
            const v2 = new vec3f(1, -2, 3);
            const result = vec3_rem(v1, v2);
            expect(result).toEqual(new vec3f(2, -3, 4));
        });

        // Test case for subtracting two vectors where one vector has zero components
        it("subtracts two vectors with zero components correctly", () => {
            const v1 = new vec3f(0, 0, 0);
            const v2 = new vec3f(1, 2, 3);
            const result = vec3_rem(v1, v2);
            expect(result).toEqual(new vec3f(-1, -2, -3));
        });

        // Test case for subtracting two identical vectors
        it("subtracts two identical vectors correctly", () => {
            const v1 = new vec3f(1, 2, 3);
            const v2 = new vec3f(1, 2, 3);
            const result = vec3_rem(v1, v2);
            expect(result).toEqual(new vec3f(0, 0, 0));
        });

        // Test case for subtracting with a provided result vector
        it("stores the result in the provided result vector", () => {
            const v1 = new vec3f(3, 5, 7);
            const v2 = new vec3f(1, 2, 3);
            const result = new vec3f();
            vec3_rem(v1, v2, result);
            expect(result).toEqual(new vec3f(2, 3, 4));
        });

        // Test case for subtracting with no result vector provided
        it("returns a new vector if no result vector is provided", () => {
            const v1 = new vec3f(3, 5, 7);
            const v2 = new vec3f(1, 2, 3);
            const result = vec3_rem(v1, v2);
            expect(result).toEqual(new vec3f(2, 3, 4));
        });

        it("vec3_rem_00", () => {
            let va;
            va = vec3_rem(new vec3f(39.3832030117214913, -46.2687141061441309, 50.5221698928256515), new vec3f(-4.787854832851573, -1.6543992124384865, -4.3626023724827645));
            expect(va.x).toBeCloseTo(44.17105784457306, 3);
            expect(va.y).toBeCloseTo(-44.61431489370565, 3);
            expect(va.z).toBeCloseTo(54.88477226530841, 3);

            va = vec3_rem(new vec3f(7.363222123257023, -2.50481269876033e1, 28.5000153533718077), new vec3f(11.6487388300629, -11.4743217266082933, 29.893924057188336));
            expect(va.x).toBeCloseTo(-4.285516706805877, 3);
            expect(va.y).toBeCloseTo(-13.573805260995007, 3);
            expect(va.z).toBeCloseTo(-1.3939087038165283, 3);

            va = vec3_rem(new vec3f(57.2081417178200624, -57.2345022968041306, -11.5610683262071774), new vec3f(-24.1432505584956019, 5.39855808577318e1, -57.7425676988921524));
            expect(va.x).toBeCloseTo(81.35139227631566, 3);
            expect(va.y).toBeCloseTo(-111.22008315453593, 3);
            expect(va.z).toBeCloseTo(46.181499372684975, 3);

            va = vec3_rem(new vec3f(44.6099472129954435, 31.0817481119307715, 57.1831802911541871), new vec3f(-5.43262302565418, -7.088976304556603, -41.1868653970983658));
            expect(va.x).toBeCloseTo(50.042570238649624, 3);
            expect(va.y).toBeCloseTo(38.170724416487374, 3);
            expect(va.z).toBeCloseTo(98.37004568825256, 3);

            va = vec3_rem(new vec3f(-31.3428674044998417, 6.285381474542317, -66.1687887522460585), new vec3f(-17.8609566960638837, 19.8352281984624348, 12.8971346121730921));
            expect(va.x).toBeCloseTo(-13.481910708435958, 3);
            expect(va.y).toBeCloseTo(-13.549846723920119, 3);
            expect(va.z).toBeCloseTo(-79.06592336441915, 3);

            va = vec3_rem(new vec3f(-13.7523386901364368, 83.9970861607322377, -41.5230427199882399), new vec3f(10.7202467778654587, -14.1806718830782614, -5.894768499271717));
            expect(va.x).toBeCloseTo(-24.472585468001895, 3);
            expect(va.y).toBeCloseTo(98.1777580438105, 3);
            expect(va.z).toBeCloseTo(-35.62827422071652, 3);

            va = vec3_rem(new vec3f(2.5542167164712932, 2.229293882868953, 3.7307521197294085), new vec3f(2.6056491649850306, -4.527944188808806, -19.4812429760885379));
            expect(va.x).toBeCloseTo(-0.051432448513737405, 3);
            expect(va.y).toBeCloseTo(6.757238071677758, 3);
            expect(va.z).toBeCloseTo(23.211995095817947, 3);

            va = vec3_rem(new vec3f(22.6919153927807784, -41.6729601929025293, 7.05345534486207), new vec3f(41.9888160350904514, 65.0466413200754658, -46.4407789388674246));
            expect(va.x).toBeCloseTo(-19.296900642309673, 3);
            expect(va.y).toBeCloseTo(-106.71960151297799, 3);
            expect(va.z).toBeCloseTo(53.4942342837295, 3);

            va = vec3_rem(new vec3f(1.1926127385105458, 3.6879432189200827, 6.740227070498392), new vec3f(-1.54538675615082, 4.637118236466857, 2.204640286482154));
            expect(va.x).toBeCloseTo(2.737999494661366, 3);
            expect(va.y).toBeCloseTo(-0.9491750175467741, 3);
            expect(va.z).toBeCloseTo(4.535586784016238, 3);

            va = vec3_rem(new vec3f(47.594515007204059, -18.2112026010768844, 35.3474650195164557), new vec3f(-28.553947268139698, -7.492497608120019, -2.705555300525883));
            expect(va.x).toBeCloseTo(76.14846227534376, 3);
            expect(va.y).toBeCloseTo(-10.718704992956866, 3);
            expect(va.z).toBeCloseTo(38.053020320042336, 3);

            va = vec3_rem(new vec3f(21.6317450658191639, -19.5582943385759194, 7.7179343796830375), new vec3f(-11.209229261348213, 12.7831582160833257, -13.2056664513775228));
            expect(va.x).toBeCloseTo(32.84097432716737, 3);
            expect(va.y).toBeCloseTo(-32.34145255465924, 3);
            expect(va.z).toBeCloseTo(20.92360083106056, 3);

            va = vec3_rem(new vec3f(-5.393669472262125, -57.7243757734874592, -27.0808921611794347), new vec3f(-48.1292735843549764, 12.8208104641551284, 3.6172935753807742));
            expect(va.x).toBeCloseTo(42.73560411209285, 3);
            expect(va.y).toBeCloseTo(-70.54518623764258, 3);
            expect(va.z).toBeCloseTo(-30.69818573656021, 3);

            va = vec3_rem(new vec3f(-17.3226127348681196, -15.1955352620566373, 3.213870821826505), new vec3f(-32.8236117820199524, 17.5223150325744754, -84.5610455503035894));
            expect(va.x).toBeCloseTo(15.500999047151833, 3);
            expect(va.y).toBeCloseTo(-32.71785029463111, 3);
            expect(va.z).toBeCloseTo(87.7749163721301, 3);

            va = vec3_rem(new vec3f(5.6383059621189195, -3.721211555436563, 11.8105366742704714), new vec3f(-23.4501270730013083, -3.9312701900929894, 17.5199322561864221));
            expect(va.x).toBeCloseTo(29.08843303512023, 3);
            expect(va.y).toBeCloseTo(0.2100586346564266, 3);
            expect(va.z).toBeCloseTo(-5.709395581915951, 3);

            va = vec3_rem(new vec3f(-76.8020101952625538, 5.50182564055896e1, -14.1752060521034746), new vec3f(13.8215449153948988, -36.0120896427229553, 8.320226271853903));
            expect(va.x).toBeCloseTo(-90.62355511065745, 3);
            expect(va.y).toBeCloseTo(91.03034604831255, 3);
            expect(va.z).toBeCloseTo(-22.495432323957377, 3);

            va = vec3_rem(new vec3f(-3.3550970725684084, 1.91796330922955, -8.29267588242925), new vec3f(-4.138472945225494, 16.1024139000352875, 2.447672328028552));
            expect(va.x).toBeCloseTo(0.7833758726570852, 3);
            expect(va.y).toBeCloseTo(-14.184450590805737, 3);
            expect(va.z).toBeCloseTo(-10.740348210457803, 3);

            va = vec3_rem(new vec3f(-3.2893273195543977, 34.6456993927953647, 4.307330721491489), new vec3f(58.5710205939070505, -23.1961176384452408, -50.3637007544025082));
            expect(va.x).toBeCloseTo(-61.860347913461446, 3);
            expect(va.y).toBeCloseTo(57.84181703124061, 3);
            expect(va.z).toBeCloseTo(54.671031475894, 3);

            va = vec3_rem(new vec3f(-10.3667436636200101, 7.655673626891634, -17.7187377521759792), new vec3f(-23.8865489092857288, -27.7934602598789269, -25.517693553434686));
            expect(va.x).toBeCloseTo(13.519805245665719, 3);
            expect(va.y).toBeCloseTo(35.44913388677056, 3);
            expect(va.z).toBeCloseTo(7.798955801258707, 3);

            va = vec3_rem(new vec3f(18.4649819216710362, 5.576475203793586, 12.9174763025663246), new vec3f(47.8135898068626304, 6.20569432344896, -73.8211778236789797));
            expect(va.x).toBeCloseTo(-29.348607885191594, 3);
            expect(va.y).toBeCloseTo(-0.6292191196553745, 3);
            expect(va.z).toBeCloseTo(86.73865412624531, 3);

            va = vec3_rem(new vec3f(-15.8388476156466407, -3.9745426815116356, -2.9664307382082957), new vec3f(-37.8989502295125291, 62.9346209744789675, 59.2632644597537492));
            expect(va.x).toBeCloseTo(22.060102613865887, 3);
            expect(va.y).toBeCloseTo(-66.9091636559906, 3);
            expect(va.z).toBeCloseTo(-62.229695197962045, 3);
        });
    });

    describe('vec3_mult', () => {
        // Test vector * vector multiplication
        it('should multiply two vectors correctly', () => {
            const v1 = new vec3f(1, 2, 3);
            const v2 = new vec3f(4, 5, 6);
            const result = vec3_mult(v1, v2);
            expect(result).toEqual(new vec3f(4, 10, 18));
        });

        // Test vector * quaternion multiplication
        it('should multiply a vector and a quaternion correctly', () => {
            const quat = new quatf(1, 2, 3, 4); // Example quaternion
            const vec = new vec3f(1, 2, 3); // Example vector
            const result = vec3_mult(vec, quat);
            // Result should be vector * quaternion 
            expect(result).toEqual(new vec3f(30, 60, 90));
        });

        // Test vector * scalar multiplication
        it('should multiply a vector by a scalar correctly', () => {
            const vec = new vec3f(1, 2, 3);
            const scalar = 2;
            const result = vec3_mult(vec, scalar);
            expect(result).toEqual(new vec3f(2, 4, 6));
        });

        // Test scalar * vector multiplication
        it('should multiply a scalar by a vector correctly', () => {
            const scalar = 2;
            const vec = new vec3f(1, 2, 3);
            const result = vec3_mult(scalar, vec);
            expect(result).toEqual(new vec3f(2, 4, 6));
        });

        // Test invalid operand types
        it('should throw an error for invalid operand types', () => {
            // Passing invalid operand types should throw an error
            expect(() => vec3_mult('invalid', new vec3f())).toThrow();
            expect(() => vec3_mult(new vec3f(), 'invalid')).toThrow();
            expect(() => vec3_mult(new vec3f(), new vec3f(), 'invalid')).toThrow();
        });

        // Test preservation of type attribute
        it('should preserve the type attribute of the result vector', () => {
            const v1 = new vec3f(1, 2, 3);
            const v2 = new vec3f(4, 5, 6);
            const result = vec3_mult(v1, v2);
            expect(result.kind).toEqual('vec3');
        });

        it("vec3_mult_00", () => {
            let va;
            va = vec3_mult(new vec3f(11.7360228925797614, -16.1916748023816268, -39.0581259913944621), new vec3f(-7.039832591119332, 12.3973356672557511, -21.630680672096311));
            expect(va.x).toBeCloseTo(-82.61963644930557, 3);
            expect(va.y).toBeCloseTo(-200.73362754017197, 3);
            expect(va.z).toBeCloseTo(844.8538509703587, 3);

            va = vec3_mult(new vec3f(-6.3057761905136855, -4.477657624542772, 38.0853602017120423), new vec3f(36.6771821108090137, 36.6404166304863139, -55.3508636849977336));
            expect(va.x).toBeCloseTo(-231.27810168947397, 3);
            expect(va.y).toBeCloseTo(-164.06324089192083, 3);
            expect(va.z).toBeCloseTo(-2108.057580919001, 3);

            va = vec3_mult(new vec3f(9.956176915836577, -8.28485481011362e1, -1.9709760261463916), new vec3f(-1.6384221416051041, 47.390967358479287, -67.5031099133972674));
            expect(va.x).toBeCloseTo(-16.312420704644264, 3);
            expect(va.y).toBeCloseTo(-3926.272838758347, 3);
            expect(va.z).toBeCloseTo(133.04701132963083, 3);

            va = vec3_mult(new vec3f(15.7411045988733527, -79.4471376876773547, 11.1647865179318746), new vec3f(-20.0666686068796807, -78.8611637165602133, 21.7867269327583806));
            expect(va.x).toBeCloseTo(-315.87152949182126, 3);
            expect(va.y).toBeCloseTo(6265.293732000025, 3);
            expect(va.z).toBeCloseTo(243.24415512872403, 3);

            va = vec3_mult(new vec3f(-3.9097658401285305, 8.743211620661395, 3.2811798420162717), new vec3f(-68.0661435005943645, -39.2685441925128629, 24.0647217599935423));
            expect(va.x).toBeCloseTo(266.12268272791044, 3);
            expect(va.y).toBeCloseTo(-343.333191910434, 3);
            expect(va.z).toBeCloseTo(78.96067994262114, 3);

            va = vec3_mult(new vec3f(4.764531376744443, 70.18916668193296, -70.073150922599055), new vec3f(-0.4259886102590196, 7.088423675171571, 6.600551638553574));
            expect(va.x).toBeCloseTo(-2.029636099714858, 3);
            expect(va.y).toBeCloseTo(497.5305508487772, 3);
            expect(va.z).toBeCloseTo(-462.5214511407731, 3);

            va = vec3_mult(new vec3f(-21.9115159282324861, 13.7356502605738697, -65.2672832331877828), new vec3f(-9.12722675402102, -11.7914223709143116, -13.4956589390846311));
            expect(va.x).toBeCloseTo(199.99137440132128, 3);
            expect(va.y).toBeCloseTo(-161.96285376158573, 3);
            expect(va.z).toBeCloseTo(880.8249943957392, 3);

            va = vec3_mult(new vec3f(-29.1156175427623189, -27.3715050968386535, -7.329485203122694), new vec3f(15.4810856749284724, -12.7517390042876197, 3.7950732479581744));
            expect(va.x).toBeCloseTo(-450.74136965795384, 3);
            expect(va.y).toBeCloseTo(349.03428914941486, 3);
            expect(va.z).toBeCloseTo(-27.81593321567622, 3);

            va = vec3_mult(new vec3f(-35.1695947255226784, -26.3233719320061077, 59.9864505638796217), new vec3f(15.9433857320584433, -12.1161392503957224, -22.5916005025946696));
            expect(va.x).toBeCloseTo(-560.7224147491762, 3);
            expect(va.y).toBeCloseTo(318.9376398681443, 3);
            expect(va.z).toBeCloseTo(-1355.1899267078131, 3);

            va = vec3_mult(new vec3f(-1.0437843478344606, -1.8091904829750287, -0.6257155607939976), new vec3f(-32.1567121280502661, -7.092761206990685, -8.01260477633516e1));
            expect(va.x).toBeCloseTo(33.564672797077435, 3);
            expect(va.y).toBeCloseTo(12.832156073702025, 3);
            expect(va.z).toBeCloseTo(50.13611491045218, 3);

            va = vec3_mult(new vec3f(-5.986481916703272, .7965150319026896, 16.0994859539427537), new vec3f(-14.4904307211301173, -4.042748874361254, 2.2278336492502167));
            expect(va.x).toBeCloseTo(86.746701477287, 3);
            expect(va.y).toBeCloseTo(-3.220110248636417, 3);
            expect(va.z).toBeCloseTo(35.86697654382489, 3);

            va = vec3_mult(new vec3f(-78.3911508074647685, 38.5224724956514422, -20.1955083592268849), new vec3f(-28.8078097931584658, 40.2359194432134046, 21.9334073882618696));
            expect(va.x).toBeCloseTo(2258.2773619282457, 3);
            expect(va.y).toBeCloseTo(1549.9871000884355, 3);
            expect(va.z).toBeCloseTo(-442.9563122559713, 3);

            va = vec3_mult(new vec3f(-14.0409936642662707, -8.26257977488995, 28.6339616855828716), new vec3f(8.942644401176924, 44.5454360718066553, 12.4914436141456591));
            expect(va.x).toBeCloseTo(-125.56361337871144, 3);
            expect(va.y).toBeCloseTo(-368.0602191505629, 3);
            expect(va.z).toBeCloseTo(357.6795178450656, 3);

            va = vec3_mult(new vec3f(-3.3524984814392655, 31.2689779610180771, -3.288817714149879), new vec3f(38.7337115015569395, 7.541284964402072, 9.00955490027369));
            expect(va.x).toBeCloseTo(-129.85470898947625, 3);
            expect(va.y).toBeCloseTo(235.8082733496454, 3);
            expect(va.z).toBeCloseTo(-29.63078375262596, 3);

            va = vec3_mult(new vec3f(25.96700633643486, 75.3099071776014455, -20.1909293318164558), new vec3f(1.2267266163644341, .8049112640686696, 2.185915867156927));
            expect(va.x).toBeCloseTo(31.854417820208557, 3);
            expect(va.y).toBeCloseTo(60.61779258321736, 3);
            expect(va.z).toBeCloseTo(-44.1356727990618, 3);

            va = vec3_mult(new vec3f(.3376852114579774, 10.7087463537894916, -4.4957014841002145), new vec3f(-17.0860866252102461, 8.863625705021875, -0.7381805694214509));
            expect(va.x).toBeCloseTo(-5.769718775023442, 3);
            expect(va.y).toBeCloseTo(94.91831945000781, 3);
            expect(va.z).toBeCloseTo(3.3186394814819584, 3);

            va = vec3_mult(new vec3f(58.2649727471322905, 44.2003843207542104, -39.4915661830946902), new vec3f(26.4827701531990165, -1.564584910973783, -84.4984504619357324));
            expect(va.x).toBeCloseTo(1543.017881244709, 3);
            expect(va.y).toBeCloseTo(-69.15525436749422, 3);
            expect(va.z).toBeCloseTo(3336.976148786483, 3);

            va = vec3_mult(new vec3f(-1.6943105145212853, -42.3057384787208335, -2.5369644393908e1), new vec3f(-10.9916062025776053, -23.8753999600969351, -3.41535184056313e1));
            expect(va.x).toBeCloseTo(18.623193960504615, 3);
            expect(va.y).toBeCloseTo(1010.0664267867228, 3);
            expect(va.z).toBeCloseTo(866.462616751658, 3);

            va = vec3_mult(new vec3f(-3.97095630000365e1, 19.3985105757785199, 6.72898952412732e1), new vec3f(54.9083592781120799, -69.2486402415684239, 18.1422168010903242));
            expect(va.x).toBeCloseTo(-2180.3869519828304, 3);
            expect(va.y).toBeCloseTo(-1343.320480084347, 3);
            expect(va.z).toBeCloseTo(1220.7878679898345, 3);

            va = vec3_mult(new vec3f(-1.7949653269237527, 8.122470501536736, -3.636547792637863), new vec3f(.4710663822132644, -5.700324450389597, .65269275212672));
            expect(va.x).toBeCloseTo(-0.8455478227522216, 3);
            expect(va.y).toBeCloseTo(-46.30071719747811, 3);
            expect(va.z).toBeCloseTo(-2.373548387017155, 3);
        });

        it("vec3_mult_01", () => {
            let va;
            va = vec3_mult(new vec3f(.9343345417644844, .477453506275654, .6066256827933816), 58.199859619140625);
            expect(va.x).toBeCloseTo(54.378139168007074, 3);
            expect(va.y).toBeCloseTo(27.787727039909537, 3);
            expect(va.z).toBeCloseTo(35.30552957994014, 3);

            va = vec3_mult(new vec3f(.7860669849454327, .5493857667137154, .4274887037188402), 87.76380157470703);
            expect(va.x).toBeCloseTo(68.98822689117918, 3);
            expect(va.y).toBeCloseTo(48.216183417830806, 3);
            expect(va.z).toBeCloseTo(37.518033768609016, 3);

            va = vec3_mult(new vec3f(.7001436852826262, .3048489230818832, .9592613022038097), 33.48844909667969);
            expect(va.x).toBeCloseTo(23.44672616494895, 3);
            expect(va.y).toBeCloseTo(10.208917642805266, 3);
            expect(va.z).toBeCloseTo(32.12417328926695, 3);

            va = vec3_mult(new vec3f(.6146995189138043, .4398042828709599, .3790131270880439), 92.77407836914062);
            expect(va.x).toBeCloseTo(57.02818134118232, 3);
            expect(va.y).toBeCloseTo(40.80243700615412, 3);
            expect(va.z).toBeCloseTo(35.16259355539924, 3);

            va = vec3_mult(new vec3f(.3981643548878671, .8887103103266736, .2242506439881975), 65.14134979248047);
            expect(va.x).toBeCloseTo(25.93696351664788, 3);
            expect(va.y).toBeCloseTo(57.891789189173714, 3);
            expect(va.z).toBeCloseTo(14.607989641224181, 3);

            va = vec3_mult(new vec3f(.4075224947577321, .8888203119986386, .2011451388910079), 31.726375579833984);
            expect(va.x).toBeCloseTo(12.929211725914733, 3);
            expect(va.y).toBeCloseTo(28.199047041454033, 3);
            expect(va.z).toBeCloseTo(6.381606222513989, 3);

            va = vec3_mult(new vec3f(.6132943617542539, .9808716966925315, .970740153732419), 88.47416687011719);
            expect(va.x).toBeCloseTo(54.26070770234787, 3);
            expect(va.y).toBeCloseTo(86.78180617135, 3);
            expect(va.z).toBeCloseTo(85.88542634884524, 3);

            va = vec3_mult(new vec3f(.6403115809189008, .0133285833016177, .3868336395919623), 11.595158576965332);
            expect(va.x).toBeCloseTo(7.424514319422024, 3);
            expect(va.y).toBeCloseTo(0.15454703698854916, 3);
            expect(va.z).toBeCloseTo(4.485397393973457, 3);

            va = vec3_mult(new vec3f(.6874560526546136, .2520236913626146, .3266237661672133), 57.84333419799805);
            expect(va.x).toBeCloseTo(39.76475020013736, 3);
            expect(va.y).toBeCloseTo(14.57789060530083, 3);
            expect(va.z).toBeCloseTo(18.89300766341889, 3);

            va = vec3_mult(new vec3f(.8192316084379476, .0992555662289791, .2064475611097556), 93.28939056396484);
            expect(va.x).toBeCloseTo(76.42561748191281, 3);
            expect(va.y).toBeCloseTo(9.259491283582713, 3);
            expect(va.z).toBeCloseTo(19.259367159345988, 3);

            va = vec3_mult(new vec3f(.9061553572329573, .3375525917902433, .7948885536418169), 52.63002014160156);
            expect(va.x).toBeCloseTo(47.6909747025907, 3);
            expect(va.y).toBeCloseTo(17.765399704770317, 3);
            expect(va.z).toBeCloseTo(41.83500058849736, 3);

            va = vec3_mult(new vec3f(.0664494933857007, .5209883534696917, .8653021202654914), 48.07434844970703);
            expect(va.x).toBeCloseTo(3.194516099330679, 3);
            expect(va.y).toBeCloseTo(25.046175642941094, 3);
            expect(va.z).toBeCloseTo(41.59883564391353, 3);

            va = vec3_mult(new vec3f(.6302238577937131, .7858955943302546, .3951861920303794), 71.36637878417969);
            expect(va.x).toBeCloseTo(44.97679455413313, 3);
            expect(va.y).toBeCloseTo(56.086522669790966, 3);
            expect(va.z).toBeCloseTo(28.20300747071763, 3);

            va = vec3_mult(new vec3f(.1857658960595467, .1882195073779911, .3996033044187819), 58.185733795166016);
            expect(va.x).toBeCloseTo(10.808924976341267, 3);
            expect(va.y).toBeCloseTo(10.951690151353075, 3);
            expect(va.z).toBeCloseTo(23.25121149457993, 3);

            va = vec3_mult(new vec3f(.4707734014388962, .5337304342423066, .3189155615439085), 30.75252914428711);
            expect(va.x).toBeCloseTo(14.477472748104832, 3);
            expect(va.y).toBeCloseTo(16.41356073422955, 3);
            expect(va.z).toBeCloseTo(9.807460100945736, 3);

            va = vec3_mult(new vec3f(.6460019507405463, .9205460558431189, .0498428652248151), 3.6675961017608643);
            expect(va.x).toBeCloseTo(2.369274236265942, 3);
            expect(va.y).toBeCloseTo(3.3761911259015616, 3);
            expect(va.z).toBeCloseTo(0.1828034981991239, 3);

            va = vec3_mult(new vec3f(.6734258587766406, .7412943948391675, .0364701864142485), 23.703699111938477);
            expect(va.x).toBeCloseTo(15.962683930640262, 3);
            expect(va.y).toBeCloseTo(17.571419288634143, 3);
            expect(va.z).toBeCloseTo(0.8644783253196525, 3);

            va = vec3_mult(new vec3f(.8464835751614517, .6430311531794899, .0320464913285832), 35.3505744934082);
            expect(va.x).toBeCloseTo(29.9236806811914, 3);
            expect(va.y).toBeCloseTo(22.731520682053738, 3);
            expect(va.z).toBeCloseTo(1.1328618789634395, 3);

            va = vec3_mult(new vec3f(.0053894536492014, .8452560314049822, .7039701308432758), 45.083656311035156);
            expect(va.x).toBeCloseTo(0.2429762760248503, 3);
            expect(va.y).toBeCloseTo(38.10723241469176, 3);
            expect(va.z).toBeCloseTo(31.737547432172693, 3);

            va = vec3_mult(new vec3f(.0897208441879063, .5601252207668643, .8273623335951776), 30.693199157714844);
            expect(va.x).toBeCloseTo(2.7538197392577093, 3);
            expect(va.y).toBeCloseTo(17.19203495425636, 3);
            expect(va.z).toBeCloseTo(25.394396880628495, 3);


        });

        it("vec3_mult_02", () => {
            let va;
            va = vec3_mult(63.64818572998047, new vec3f(.2409012032286677, .6629791862165071, .6214962056994344));
            expect(va.x).toBeCloseTo(15.332924525674013, 3);
            expect(va.y).toBeCloseTo(42.19742237941955, 3);
            expect(va.z).toBeCloseTo(39.557105930835746, 3);

            va = vec3_mult(80.30558013916016, new vec3f(.5726423939343526, .0357142958163141, .5065397145535309));
            expect(va.x).toBeCloseTo(45.98637965717567, 3);
            expect(va.y).toBeCloseTo(2.868057244790687, 3);
            expect(va.z).toBeCloseTo(40.67796564074588, 3);

            va = vec3_mult(97.1667709350586, new vec3f(.0206461300880518, .0434776262747829, .6049347616304817));
            expect(va.x).toBeCloseTo(2.0061177929611533, 3);
            expect(va.y).toBeCloseTo(4.224580553041916, 3);
            expect(va.z).toBeCloseTo(58.779557414003285, 3);

            va = vec3_mult(92.31363677978516, new vec3f(.3371987625248629, .0795166169513746, .6712918178245519));
            expect(va.x).toBeCloseTo(31.128044086313224, 3);
            expect(va.y).toBeCloseTo(7.3404680952065, 3);
            expect(va.z).toBeCloseTo(61.969389043897394, 3);

            va = vec3_mult(50.85577392578125, new vec3f(.3550451224026723, .0231039165838407, .5529727723945821));
            expect(va.x).toBeCloseTo(18.056094478361633, 3);
            expect(va.y).toBeCloseTo(1.174967558587911, 3);
            expect(va.z).toBeCloseTo(28.121858300011358, 3);

            va = vec3_mult(27.108070373535156, new vec3f(.2639439836919166, .7334590520364359, .5734247465618914));
            expect(va.x).toBeCloseTo(7.155012084591692, 3);
            expect(va.y).toBeCloseTo(19.882659598710088, 3);
            expect(va.z).toBeCloseTo(15.544438383726312, 3);

            va = vec3_mult(56.241424560546875, new vec3f(.545787884203305, .3283677828518419, .2914487818109484));
            expect(va.x).toBeCloseTo(30.695888115480674, 3);
            expect(va.y).toBeCloseTo(18.467871887375903, 3);
            expect(va.z).toBeCloseTo(16.391494675483738, 3);

            va = vec3_mult(33.437705993652344, new vec3f(.5625871067395576, .3066991941866029, .2465177632944158));
            expect(va.x).toBeCloseTo(18.811622270976837, 3);
            expect(va.y).toBeCloseTo(10.255317483701715, 3);
            expect(va.z).toBeCloseTo(8.242988491251456, 3);

            va = vec3_mult(44.9677734375, new vec3f(.5187630943939834, .3891298420255387, .4422906145522172));
            expect(va.x).toBeCloseTo(23.32762129644507, 3);
            expect(va.y).toBeCloseTo(17.49830257397459, 3);
            expect(va.z).toBeCloseTo(19.888824148716743, 3);

            va = vec3_mult(17.49260139465332, new vec3f(.9713428902388586, .9343851301928705, .856406540138021));
            expect(va.x).toBeCloseTo(16.991313996478844, 3);
            expect(va.y).toBeCloseTo(16.34482663155513, 3);
            expect(va.z).toBeCloseTo(14.98077823840857, 3);

            va = vec3_mult(66.29266357421875, new vec3f(.5963607909223418, .2839819168394631, .9616695820432313));
            expect(va.x).toBeCloseTo(39.53434528146982, 3);
            expect(va.y).toBeCloseTo(18.82591767420029, 3);
            expect(va.z).toBeCloseTo(63.75163807195149, 3);

            va = vec3_mult(14.495307922363281, new vec3f(.5218888633553156, .2527044331614277, .9046263856548944));
            expect(va.x).toBeCloseTo(7.564939775587474, 3);
            expect(va.y).toBeCloseTo(3.6630285720211644, 3);
            expect(va.z).toBeCloseTo(13.112838014762252, 3);

            va = vec3_mult(97.40571594238281, new vec3f(.0316123374220161, .8167206029878327, .8659774086917784));
            expect(va.x).toBeCloseTo(3.0792223592036563, 3);
            expect(va.y).toBeCloseTo(79.55325505892444, 3);
            expect(va.z).toBeCloseTo(84.35114948355212, 3);

            va = vec3_mult(88.99317169189453, new vec3f(.151657947281916, .5409114760712948, .6999175695377229));
            expect(va.x).toBeCloseTo(13.496521740899835, 3);
            expect(va.y).toBeCloseTo(48.13742786012883, 3);
            expect(va.z).toBeCloseTo(62.2878844360441, 3);

            va = vec3_mult(10.340949058532715, new vec3f(.460225152784334, .3702842931131394, .065134791524732));
            expect(va.x).toBeCloseTo(4.759164860398233, 3);
            expect(va.y).toBeCloseTo(3.8290910122577704, 3);
            expect(va.z).toBeCloseTo(0.673555561095402, 3);

            va = vec3_mult(52.97560119628906, new vec3f(.7049357741523905, .9695046340931264, .1971122614087046));
            expect(va.x).toBeCloseTo(37.344396440494336, 3);
            expect(va.y).toBeCloseTo(51.360090853671615, 3);
            expect(va.z).toBeCloseTo(10.442140551286215, 3);

            va = vec3_mult(2.8735272884368896, new vec3f(.5237574634622186, .2053479202506461, .0869403652699705));
            expect(va.x).toBeCloseTo(1.5050313637811723, 3);
            expect(va.y).toBeCloseTo(0.5900728524639937, 3);
            expect(va.z).toBeCloseTo(0.2498255120699311, 3);

            va = vec3_mult(76.16890716552734, new vec3f(.8628663512431025, .3051515324677225, .0253022408594055));
            expect(va.x).toBeCloseTo(65.72358700409319, 3);
            expect(va.y).toBeCloseTo(23.24305874795236, 3);
            expect(va.z).toBeCloseTo(1.9272440350998679, 3);

            va = vec3_mult(7.541347503662109, new vec3f(.9153401460203079, .0832503128258919, .56181478999262));
            expect(va.x).toBeCloseTo(6.9028981251919594, 3);
            expect(va.y).toBeCloseTo(0.6278195388086296, 3);
            expect(va.z).toBeCloseTo(4.236840564031297, 3);

            va = vec3_mult(47.89814758300781, new vec3f(.2431743288450363, .7105595596617404, .9154078224673312));
            expect(va.x).toBeCloseTo(11.647599891418423, 3);
            expect(va.y).toBeCloseTo(34.03448665519509, 3);
            expect(va.z).toBeCloseTo(43.84633897918005, 3);


        });

        it("vec3_mult_03", () => {
            let va;
            va = vec3_mult(new vec3f(0.754271, 0.705586, 0.602490), new quatf(0.257737, 0.279836, 0.911487, 0.156378));
            expect(va.x).toBeCloseTo(-0.380726, 3);
            expect(va.y).toBeCloseTo(0.022039, 3);
            expect(va.z).toBeCloseTo(1.133283, 3);

            va = vec3_mult(new vec3f(0.655107, 0.766979, 0.233625), new quatf(-0.060983, -0.363527, -0.918520, -0.143005));
            expect(va.x).toBeCloseTo(-0.740460, 3);
            expect(va.y).toBeCloseTo(-0.179805, 3);
            expect(va.z).toBeCloseTo(0.700993, 3);

            va = vec3_mult(new vec3f(0.259567, 0.158835, 0.228665), new quatf(0.282452, -0.414048, 0.854071, -0.139098));
            expect(va.x).toBeCloseTo(-0.070856, 3);
            expect(va.y).toBeCloseTo(-0.364369, 3);
            expect(va.z).toBeCloseTo(0.084294, 3);

            va = vec3_mult(new vec3f(0.127331, 0.764906, 0.092523), new quatf(-0.195701, 0.468029, -0.002012, 0.861769));
            expect(va.x).toBeCloseTo(0.008785, 3);
            expect(va.y).toBeCloseTo(0.713576, 3);
            expect(va.z).toBeCloseTo(-0.317154, 3);

            va = vec3_mult(new vec3f(0.794804, 0.298431, 0.143471), new quatf(-0.178745, 0.617428, -0.580874, 0.499418));
            expect(va.x).toBeCloseTo(-0.121988, 3);
            expect(va.y).toBeCloseTo(-0.635901, 3);
            expect(va.z).toBeCloseTo(-0.567545, 3);

            va = vec3_mult(new vec3f(0.399787, 0.549839, 0.471616), new quatf(0.531730, -0.404026, -0.732879, 0.130054));
            expect(va.x).toBeCloseTo(-0.708760, 3);
            expect(va.y).toBeCloseTo(-0.385652, 3);
            expect(va.z).toBeCloseTo(0.183047, 3);

            va = vec3_mult(new vec3f(0.181767, 0.150862, 0.613693), new quatf(-0.497843, -0.491480, -0.128770, -0.702865));
            expect(va.x).toBeCloseTo(0.637121, 3);
            expect(va.y).toBeCloseTo(-0.158875, 3);
            expect(va.z).toBeCloseTo(0.035409, 3);

            va = vec3_mult(new vec3f(0.945685, 0.919485, 0.109469), new quatf(-0.881646, -0.421845, -0.068129, 0.200264));
            expect(va.x).toBeCloseTo(1.304022, 3);
            expect(va.y).toBeCloseTo(0.204095, 3);
            expect(va.z).toBeCloseTo(-0.098123, 3);

            va = vec3_mult(new vec3f(0.807476, 0.985003, 0.653818), new quatf(-0.086003, 0.100538, -0.085412, -0.987522));
            expect(va.x).toBeCloseTo(0.475953, 3);
            expect(va.y).toBeCloseTo(0.956025, 3);
            expect(va.z).toBeCloseTo(0.953525, 3);

            va = vec3_mult(new vec3f(0.018239, 0.394654, 0.399925), new quatf(0.389975, 0.299746, -0.076024, -0.867348));
            expect(va.x).toBeCloseTo(-0.176692, 3);
            expect(va.y).toBeCloseTo(0.529040, 3);
            expect(va.z).toBeCloseTo(-0.070144, 3);

            va = vec3_mult(new vec3f(0.916172, 0.864376, 0.537599), new quatf(-0.212347, 0.307869, -0.277656, -0.884891));
            expect(va.x).toBeCloseTo(-0.166052, 3);
            expect(va.y).toBeCloseTo(0.689615, 3);
            expect(va.z).toBeCloseTo(1.171489, 3);

            va = vec3_mult(new vec3f(0.140449, 0.085128, 0.457144), new quatf(0.126029, 0.719707, 0.409119, -0.546589));
            expect(va.x).toBeCloseTo(-0.311076, 3);
            expect(va.y).toBeCloseTo(0.348781, 3);
            expect(va.z).toBeCloseTo(0.132428, 3);

            va = vec3_mult(new vec3f(0.579340, 0.085836, 0.902118), new quatf(-0.388332, 0.635933, 0.017465, 0.666695));
            expect(va.x).toBeCloseTo(0.818721, 3);
            expect(va.y).toBeCloseTo(0.274401, 3);
            expect(va.z).toBeCloseTo(-0.641264, 3);

            va = vec3_mult(new vec3f(0.336741, 0.228064, 0.205856), new quatf(0.506580, -0.317638, 0.648106, -0.471637));
            expect(va.x).toBeCloseTo(0.248780, 3);
            expect(va.y).toBeCloseTo(-0.381205, 3);
            expect(va.z).toBeCloseTo(-0.023996, 3);

            va = vec3_mult(new vec3f(0.827639, 0.594478, 0.625668), new quatf(-0.948727, -0.151681, -0.277158, 0.009634));
            expect(va.x).toBeCloseTo(1.163880, 3);
            expect(va.y).toBeCloseTo(-0.269189, 3);
            expect(va.z).toBeCloseTo(-0.052641, 3);

            va = vec3_mult(new vec3f(0.035243, 0.979315, 0.242495), new quatf(0.707183, 0.505412, 0.226510, -0.439482));
            expect(va.x).toBeCloseTo(0.878610, 3);
            expect(va.y).toBeCloseTo(0.123729, 3);
            expect(va.z).toBeCloseTo(-0.481497, 3);

            va = vec3_mult(new vec3f(0.593205, 0.141833, 0.153520), new quatf(-0.602476, 0.724432, 0.192529, -0.274141));
            expect(va.x).toBeCloseTo(-0.278828, 3);
            expect(va.y).toBeCloseTo(-0.559965, 3);
            expect(va.z).toBeCloseTo(0.065352, 3);

            va = vec3_mult(new vec3f(0.997803, 0.371141, 0.986783), new quatf(-0.397944, -0.536197, -0.365098, 0.648720));
            expect(va.x).toBeCloseTo(0.092485, 3);
            expect(va.y).toBeCloseTo(1.003650, 3);
            expect(va.z).toBeCloseTo(1.044619, 3);

            va = vec3_mult(new vec3f(0.200397, 0.677920, 0.112253), new quatf(-0.035235, 0.941630, 0.007404, 0.334718));
            expect(va.x).toBeCloseTo(-0.132640, 3);
            expect(va.y).toBeCloseTo(0.668071, 3);
            expect(va.z).toBeCloseTo(-0.220053, 3);

            va = vec3_mult(new vec3f(0.466067, 0.774132, 0.570603), new quatf(0.575691, -0.058104, -0.799153, 0.162967));
            expect(va.x).toBeCloseTo(-0.518368, 3);
            expect(va.y).toBeCloseTo(-0.934439, 3);
            expect(va.z).toBeCloseTo(-0.014336, 3);
        });

        it("vec3_mult_03", () => {
            let va;
            va = vec3_mult(new vec3f(.3556255734592748, .2620802798594943, .2991952097617399), new quatf(.2163039081546135, -0.7073740434318935, -0.4862322109991772, .4652019120583082));
            expect(va.x).toBeCloseTo(-0.3899101228384337, 3);
            expect(va.y).toBeCloseTo(-0.010473825498044542, 3);
            expect(va.z).toBeCloseTo(0.36405190594391146, 3);

            va = vec3_mult(new vec3f(.3626777301148374, .0130197903083762, .8105831817074407), new quatf(.9505179811677354, -0.2597102319973215, .0590318259418848, -0.1599418844414336));
            expect(va.x).toBeCloseTo(0.4633488459917806, 3);
            expect(va.y).toBeCloseTo(0.025101146465692, 3);
            expect(va.z).toBeCloseTo(-0.757249975036035, 3);

            va = vec3_mult(new vec3f(.3623261416687404, .8999488162836133, .8154511947129341), new quatf(.6186350740300148, -0.7841784384763358, .0286573687328967, .0391609119658898));
            expect(va.x).toBeCloseTo(-0.9802406487160168, 3);
            expect(va.y).toBeCloseTo(-0.21725847664559003, 3);
            expect(va.z).toBeCloseTo(-0.7733535936142173, 3);

            va = vec3_mult(new vec3f(.0775029506062805, .888703583692837, .0939291605589965), new quatf(-0.6467383024045756, .2603345915670954, -0.5152278097352074, .498493503179231));
            expect(va.x).toBeCloseTo(0.27007285158692673, 3);
            expect(va.y).toBeCloseTo(-0.35710588304019414, 3);
            expect(va.z).toBeCloseTo(-0.7772769759604856, 3);

            va = vec3_mult(new vec3f(.4283951988631454, .7925108384247876, .6510709533003396), new quatf(.7857146176911017, -0.4407823801811524, .25567084806238, .3507076422312854));
            expect(va.x).toBeCloseTo(-0.4248501818228055, 3);
            expect(va.y).toBeCloseTo(-1.0150723957066838, 3);
            expect(va.z).toBeCloseTo(0.1569063929245361, 3);

            va = vec3_mult(new vec3f(.4237634300030186, .4171389281670055, .498912271597723), new quatf(-0.4907166935473546, -0.5026705485673268, .304597164368369, -0.6432262539229282));
            expect(va.x).toBeCloseTo(0.6737071455378258, 3);
            expect(va.y).toBeCloseTo(-0.28588868408501134, 3);
            expect(va.z).toBeCloseTo(-0.2586119237669777, 3);

            va = vec3_mult(new vec3f(.8628935305965051, .2014940340532565, .2100412671984471), new quatf(-0.9482344187628025, -0.2459180379194328, -0.0900546765202715, .1796272833849468));
            expect(va.x).toBeCloseTo(0.86233585516379, 3);
            expect(va.y).toBeCloseTo(0.29125099433501006, 3);
            expect(va.z).toBeCloseTo(-0.029191711640277646, 3);

            va = vec3_mult(new vec3f(.8372914636075044, .1705224833584706, .6233057242051174), new quatf(-0.3135086919815926, .4208519695228011, -0.4608080352465854, -0.715717733784033));
            expect(va.x).toBeCloseTo(-0.16776829989398118, 3);
            expect(va.y).toBeCloseTo(-0.1255481240269444, 3);
            expect(va.z).toBeCloseTo(1.0366949427346508, 3);

            va = vec3_mult(new vec3f(.0783225580565157, .6783385206032628, .5893993597889648), new quatf(-0.2490258881027568, -0.7786874240864489, .2683236973348034, -0.5095433210952971));
            expect(va.x).toBeCloseTo(0.8095792137993668, 3);
            expect(va.y).toBeCloseTo(0.10961115321413575, 3);
            expect(va.z).toBeCloseTo(-0.38240824864200756, 3);

            va = vec3_mult(new vec3f(.2022116765385036, .3323395088646672, .7163630978384044), new quatf(.6386168324610068, .1674329317089837, .3705054726164589, -0.6533455819381194));
            expect(va.x).toBeCloseTo(0.5495966086759131, 3);
            expect(va.y).toBeCloseTo(0.602030295670527, 3);
            expect(va.z).toBeCloseTo(-0.0042766870763969456, 3);

            va = vec3_mult(new vec3f(.9466865752038602, .1061981462056705, .8585145709551567), new quatf(.0228637992770662, -0.4192190679444054, -0.5499497157811131, -0.7220027215092163));
            expect(va.x).toBeCloseTo(0.453040718672849, 3);
            expect(va.y).toBeCloseTo(1.1996979841840938, 3);
            expect(va.z).toBeCloseTo(0.004431753610268792, 3);

            va = vec3_mult(new vec3f(.7851572448486541, .5704584498509173, .1575806678130882), new quatf(-0.7348738873951483, .4595481156458932, -0.3623427197807031, -0.3427588838425264));
            expect(va.x).toBeCloseTo(-0.2453577995540407, 3);
            expect(va.y).toBeCloseTo(-0.6626221482451607, 3);
            expect(va.z).toBeCloseTo(0.6837088911708161, 3);

            va = vec3_mult(new vec3f(.8015799965072192, .2805241662792219, .816453261256185), new quatf(-0.6363382660957426, .3981726103342512, .1433015389565261, .6449781797972423));
            expect(va.x).toBeCloseTo(0.5909305929704405, 3);
            expect(va.y).toBeCloseTo(0.5471533372499697, 3);
            expect(va.z).toBeCloseTo(-0.859793281150098, 3);

            va = vec3_mult(new vec3f(.0123262219470603, .8387536105121158, .9116636798678519), new quatf(-0.4347274289002584, -0.0170586128724135, .8897481185347144, .1380918239888801));
            expect(va.x).toBeCloseTo(-0.9104214902713268, 3);
            expect(va.y).toBeCloseTo(-0.7212803792860708, 3);
            expect(va.z).toBeCloseTo(0.43090317310721915, 3);

            va = vec3_mult(new vec3f(.0211823999951553, .8865489681809193, .0266170358677729), new quatf(-0.9373236870347147, -0.2626426743647296, .1343953297200413, .1854212142006196));
            expect(va.x).toBeCloseTo(0.40051458511683746, 3);
            expect(va.y).toBeCloseTo(-0.6844195134900641, 3);
            expect(va.z).toBeCloseTo(-0.397849507117082, 3);

            va = vec3_mult(new vec3f(.0501727008222908, .3944762540899611, .9088769557572958), new quatf(-0.6756341102561666, .5192913431912569, .5225423463957061, .0283645230569489));
            expect(va.x).toBeCloseTo(-0.9077633109792344, 3);
            expect(va.y).toBeCloseTo(0.3132773477810319, 3);
            expect(va.z).toBeCloseTo(-0.2490164859253305, 3);

            va = vec3_mult(new vec3f(.3568226353783461, .7823912953673411, .5590132605453146), new quatf(-0.8079700396383802, -0.4062741189522419, .1989367284805873, .3775578543452314));
            expect(va.x).toBeCloseTo(0.25570431733812765, 3);
            expect(va.y).toBeCloseTo(0.2375085250877989, 3);
            expect(va.z).toBeCloseTo(-0.9644476970036782, 3);

            va = vec3_mult(new vec3f(.1554940343767044, .0873995148534821, .5636878767334395), new quatf(.8939381360715678, -0.4235871028372275, .0000348745308806, .1464533166938268));
            expect(va.x).toBeCloseTo(-0.03639816939926975, 3);
            expect(va.y).toBeCloseTo(-0.31765710769156696, 3);
            expect(va.z).toBeCloseTo(-0.49732306149728395, 3);

            va = vec3_mult(new vec3f(.4988093470697872, .6383617479121009, .957630349363233), new quatf(.6264948290817459, -0.6044357118024847, .1123496227293971, .47910255864921));
            expect(va.x).toBeCloseTo(-0.8502677092943473, 3);
            expect(va.y).toBeCloseTo(-0.907874843579994, 3);
            expect(va.z).toBeCloseTo(0.16180377890850356, 3);

            va = vec3_mult(new vec3f(.1703289340348031, .7534525017255245, .3143020547259066), new quatf(.0222008745457319, -0.2408852146690834, .9136417244850947, -0.3267112391748048));
            expect(va.x).toBeCloseTo(0.3701702694889194, 3);
            expect(va.y).toBeCloseTo(-0.7424585648167805, 3);
            expect(va.z).toBeCloseTo(-0.08495675869239432, 3);


        });
    });

    describe('vec3_div', () => {
        // Test vector / vector division
        it('should divide two vectors correctly', () => {
            const v1 = new vec3f(6, 8, 12);
            const v2 = new vec3f(2, 4, 3);
            const result = vec3_div(v1, v2);
            expect(result).toEqual(new vec3f(3, 2, 4));
        });

        // Test vector / quaternion division
        it('should divide a vector by a quaternion correctly', () => {
            const v1 = new vec3f(1, 2, 3);
            const quat = new quatf(1, 0, 0, 0); // Example quaternion
            const result = vec3_div(v1, quat);
            // Result should be vector * conjugate of quaternion
            expect(result).toEqual(new vec3f(1, -2, -3)); // Simplified case
        });

        // Test vector / scalar division
        it('should divide a vector by a scalar correctly', () => {
            const vec = new vec3f(6, 9, 12);
            const scalar = 3;
            const result = vec3_div(vec, scalar);
            expect(result).toEqual(new vec3f(2, 3, 4));
        });

        // Test invalid first operand type
        it('should throw an error for invalid first operand type', () => {
            const invalidOperand = {};
            const vec = new vec3f(1, 2, 3);
            expect(() => vec3_div(invalidOperand, vec)).toThrow(new TypeError('The first operand must be a vec3.'));
        });

        // Test invalid second operand type
        it('should throw an error for invalid second operand type', () => {
            const vec = new vec3f(1, 2, 3);
            const invalidOperand = {};
            expect(() => vec3_div(vec, invalidOperand)).toThrow(new TypeError('The second operand must be a vec3, quat, or number.'));
        });

        // Test preservation of type attribute
        it('should preserve the type attribute of the result vector', () => {
            const v1 = new vec3f(6, 8, 12);
            const v2 = new vec3f(2, 4, 3);
            const result = vec3_div(v1, v2);
            expect(result.kind).toEqual('vec3');
        });

        it("vec3_div_00", () => {
            let va;
            va = vec3_div(new vec3f(51.5994653202884237, 94.4239336503299427, 22.2632662619436559), new vec3f(5.712612097710921, 4.735476058311474, 9.163942053987606));
            expect(va.x).toBeCloseTo(9.032551911053902, 3);
            expect(va.y).toBeCloseTo(19.93969191008826, 3);
            expect(va.z).toBeCloseTo(2.4294420600636597, 3);

            va = vec3_div(new vec3f(.4018587131664172, 11.6252991402575052, 7.212720876659195), new vec3f(31.0693403466189295, 1.0138195585538903, 30.9859931110188072));
            expect(va.x).toBeCloseTo(0.012934253147416723, 3);
            expect(va.y).toBeCloseTo(11.466832576045192, 3);
            expect(va.z).toBeCloseTo(0.2327735906613336, 3);

            va = vec3_div(new vec3f(21.253554657437828, 8.193751354101456, 16.7302877458450148), new vec3f(8.70784157302813, 7.862939268209538, 17.2016745910512228));
            expect(va.x).toBeCloseTo(2.4407374065312673, 3);
            expect(va.y).toBeCloseTo(1.0420723185831304, 3);
            expect(va.z).toBeCloseTo(0.9725964560769312, 3);

            va = vec3_div(new vec3f(12.7715220887738532, 10.1181558961179068, 14.2105186488452446), new vec3f(2.100862719816255, .8796441779675881, 2.142570148551772));
            expect(va.x).toBeCloseTo(6.079179742830066, 3);
            expect(va.y).toBeCloseTo(11.502555407682953, 3);
            expect(va.z).toBeCloseTo(6.632463659801554, 3);

            va = vec3_div(new vec3f(20.9103768288308238, 38.155972058354557, 3.2910234655714996), new vec3f(29.9466389094871595, 12.9048166714807522, 52.8125675554616905));
            expect(va.x).toBeCloseTo(0.6982545484330254, 3);
            expect(va.y).toBeCloseTo(2.9567232940765504, 3);
            expect(va.z).toBeCloseTo(0.06231515750707245, 3);

            va = vec3_div(new vec3f(12.2746445085349247, .8983401768156926, 14.0248223528141391), new vec3f(13.9177092123466046, 12.8779682876573123, 3.74377319814588e1));
            expect(va.x).toBeCloseTo(0.8819443143449144, 3);
            expect(va.y).toBeCloseTo(0.0697579118653905, 3);
            expect(va.z).toBeCloseTo(0.37461730747364697, 3);

            va = vec3_div(new vec3f(76.7005791989076897, 31.6150532833964135, 89.1913610223738686), new vec3f(35.4775011027952445, 44.7582553804760863, 38.4081698613008768));
            expect(va.x).toBeCloseTo(2.161949878506649, 3);
            expect(va.y).toBeCloseTo(0.7063513314950868, 3);
            expect(va.z).toBeCloseTo(2.3221976299433336, 3);

            va = vec3_div(new vec3f(15.9220344735521824, 19.9705238825808244, 38.4416702551772431), new vec3f(16.4858310093377582, 4.123478795349292, 24.4112565461001481));
            expect(va.x).toBeCloseTo(0.9658011455130023, 3);
            expect(va.y).toBeCloseTo(4.843125155658564, 3);
            expect(va.z).toBeCloseTo(1.574751802824281, 3);

            va = vec3_div(new vec3f(36.5261932385710963, 38.953149717402809, 20.2453883665017678), new vec3f(5.9252996545095575, 33.377912022038366, 41.1705937747099711));
            expect(va.x).toBeCloseTo(6.164446588076296, 3);
            expect(va.y).toBeCloseTo(1.1670337464992804, 3);
            expect(va.z).toBeCloseTo(0.4917439004471678, 3);

            va = vec3_div(new vec3f(6.635789598961615, 11.7027363169775409, 16.8269620274282339), new vec3f(17.5070023924672817, 7.62573542493688, 14.2277868353397619));
            expect(va.x).toBeCloseTo(0.37903631074025496, 3);
            expect(va.y).toBeCloseTo(1.534637076275749, 3);
            expect(va.z).toBeCloseTo(1.1826830287921166, 3);

            va = vec3_div(new vec3f(11.4292895889636323, 3.85707926769276e1, .3540975363716332), new vec3f(24.2632284631930553, 17.8999824514775163, 10.5458560396754955));
            expect(va.x).toBeCloseTo(0.47105394924264465, 3);
            expect(va.y).toBeCloseTo(2.154794999463469, 3);
            expect(va.z).toBeCloseTo(0.03357693629037336, 3);

            va = vec3_div(new vec3f(1.2613050069012086, 8.736435161078866, 4.204727052478726), new vec3f(51.5282087144326937, 17.1507196902678736, 17.5321000577118902));
            expect(va.x).toBeCloseTo(0.024477951754374217, 3);
            expect(va.y).toBeCloseTo(0.5093917525826237, 3);
            expect(va.z).toBeCloseTo(0.23983019938499509, 3);

            va = vec3_div(new vec3f(.5549085151927078, .5957066294323626, 1.266899614006468), new vec3f(27.1634065541930312, 8.275617190564386, 6.424630933217765));
            expect(va.x).toBeCloseTo(0.020428531822237528, 3);
            expect(va.y).toBeCloseTo(0.07198334767243339, 3);
            expect(va.z).toBeCloseTo(0.19719414658608933, 3);

            va = vec3_div(new vec3f(27.5415739105644484, 49.8272370525008412, 36.3604082049824697), new vec3f(36.0125658285704873, 33.6116665713864293, 2.03942179816613e1));
            expect(va.x).toBeCloseTo(0.7647767737980614, 3);
            expect(va.y).toBeCloseTo(1.4824387522313074, 3);
            expect(va.z).toBeCloseTo(1.782878276464346, 3);

            va = vec3_div(new vec3f(63.0982045183870923, 53.4521106139017874, 19.433936571534673), new vec3f(1.3740284940172085, 1.248245326856985, 1.0901672385493348));
            expect(va.x).toBeCloseTo(45.92204950125062, 3);
            expect(va.y).toBeCloseTo(42.821799099774196, 3);
            expect(va.z).toBeCloseTo(17.826564479588516, 3);

            va = vec3_div(new vec3f(32.9134320031296213, 32.7008072376117127, 33.4509697906314756), new vec3f(5.509664034774519, .2628865512119799, 19.9486653513336059));
            expect(va.x).toBeCloseTo(5.973763880228423, 3);
            expect(va.y).toBeCloseTo(124.39132807232596, 3);
            expect(va.z).toBeCloseTo(1.676852521283847, 3);

            va = vec3_div(new vec3f(64.564511391216115, 77.4181619890104287, 33.632123030868307), new vec3f(17.5788036782353529, 8.997700509935983, 22.5794260150087283));
            expect(va.x).toBeCloseTo(3.6728615082694533, 3);
            expect(va.y).toBeCloseTo(8.604216366561554, 3);
            expect(va.z).toBeCloseTo(1.4895030107724068, 3);

            va = vec3_div(new vec3f(5.689307882335086, 1.52361400418009e1, .3702091018452982), new vec3f(4.70183315483704e1, 12.986316261332119, 43.3241614739409471));
            expect(va.x).toBeCloseTo(0.1210019091486089, 3);
            expect(va.y).toBeCloseTo(1.173245725361535, 3);
            expect(va.z).toBeCloseTo(0.008545095606015948, 3);

            va = vec3_div(new vec3f(51.957260858290411, 35.6293259448415327, 17.9371960273231572), new vec3f(12.5082872449878337, 10.0643327837775161, 24.2438436935977641));
            expect(va.x).toBeCloseTo(4.153826966126804, 3);
            expect(va.y).toBeCloseTo(3.540157774022704, 3);
            expect(va.z).toBeCloseTo(0.7398660152251334, 3);

            va = vec3_div(new vec3f(32.2617361836471446, 36.4823626610203462, 41.5949691921254825), new vec3f(30.1832929132428269, 2.6977441187467e1, 71.5860729652643499));
            expect(va.x).toBeCloseTo(1.0688607196165931, 3);
            expect(va.y).toBeCloseTo(1.3523285031928483, 3);
            expect(va.z).toBeCloseTo(0.5810483445894368, 3);
        });

        it("vec3_div_01", () => {
            let va;
            va = vec3_div(new vec3f(.1186875806783376, .4460793426460727, .2492806108218897), 72.87455749511719);
            expect(va.x).toBeCloseTo(0.0016286559364191, 3);
            expect(va.y).toBeCloseTo(0.006121194529050298, 3);
            expect(va.z).toBeCloseTo(0.0034206809535494223, 3);

            va = vec3_div(new vec3f(.4520868486625744, .5199309957572631, .8288803261534603), 21.543716430664062);
            expect(va.x).toBeCloseTo(0.020984626775865864, 3);
            expect(va.y).toBeCloseTo(0.02413376528746098, 3);
            expect(va.z).toBeCloseTo(0.038474342568568194, 3);

            va = vec3_div(new vec3f(.8276596205130449, .9595767349686011, .7239473606821052), 43.26777267456055);
            expect(va.x).toBeCloseTo(0.01912877805701495, 3);
            expect(va.y).toBeCloseTo(0.022177631887503834, 3);
            expect(va.z).toBeCloseTo(0.0167317917223817, 3);

            va = vec3_div(new vec3f(.0985326231866517, .4354555732847449, .388398299541693), 93.11663055419922);
            expect(va.x).toBeCloseTo(0.0010581635374929085, 3);
            expect(va.y).toBeCloseTo(0.004676453289740599, 3);
            expect(va.z).toBeCloseTo(0.004171094864903031, 3);

            va = vec3_div(new vec3f(.2203260151892732, .7568291537099077, .3651446870692652), 55.40727233886719);
            expect(va.x).toBeCloseTo(0.00397648189287814, 3);
            expect(va.y).toBeCloseTo(0.013659382997256948, 3);
            expect(va.z).toBeCloseTo(0.006590194240858214, 3);

            va = vec3_div(new vec3f(.0914205225634284, .0305891763476691, .8580564014163852), 83.09635925292969);
            expect(va.x).toBeCloseTo(0.0011001748257725888, 3);
            expect(va.y).toBeCloseTo(0.0003681169262128731, 3);
            expect(va.z).toBeCloseTo(0.010326040865456246, 3);

            va = vec3_div(new vec3f(.5013272247047385, .9130553890155388, .876699511668118), 53.13044357299805);
            expect(va.x).toBeCloseTo(0.009435780900566825, 3);
            expect(va.y).toBeCloseTo(0.017185164053092374, 3);
            expect(va.z).toBeCloseTo(0.016500888242417654, 3);

            va = vec3_div(new vec3f(.4449128441931498, .6321130203920224, .849432234310217), 82.43771362304688);
            expect(va.x).toBeCloseTo(0.00539695758942988, 3);
            expect(va.y).toBeCloseTo(0.007667765062995445, 3);
            expect(va.z).toBeCloseTo(0.010303927619758048, 3);

            va = vec3_div(new vec3f(.175301421209332, .7245984408248525, .9533960081431401), 75.94412994384766);
            expect(va.x).toBeCloseTo(0.002308294549413472, 3);
            expect(va.y).toBeCloseTo(0.00954120405830725, 3);
            expect(va.z).toBeCloseTo(0.012553913104911094, 3);

            va = vec3_div(new vec3f(.5626032671411081, .7288441316402137, .3672193304369493), 16.431476593017578);
            expect(va.x).toBeCloseTo(0.03423936150572017, 3);
            expect(va.y).toBeCloseTo(0.04435658155944001, 3);
            expect(va.z).toBeCloseTo(0.022348528956490508, 3);

            va = vec3_div(new vec3f(.9379601157010145, .2643393968803638, .8808938647698823), 85.0061264038086);
            expect(va.x).toBeCloseTo(0.011034029609176385, 3);
            expect(va.y).toBeCloseTo(0.0031096511282570384, 3);
            expect(va.z).toBeCloseTo(0.010362710336727154, 3);

            va = vec3_div(new vec3f(.0734266631590337, .8021012575494137, .3057490074414357), 84.42123413085938);
            expect(va.x).toBeCloseTo(0.0008697653370621985, 3);
            expect(va.y).toBeCloseTo(0.009501179007950718, 3);
            expect(va.z).toBeCloseTo(0.003621707389014254, 3);

            va = vec3_div(new vec3f(.2473201188906606, .4766751019640316, .2828890146856118), 99.23271179199219);
            expect(va.x).toBeCloseTo(0.002492324500907358, 3);
            expect(va.y).toBeCloseTo(0.004803608541538397, 3);
            expect(va.z).toBeCloseTo(0.0028507637207233934, 3);

            va = vec3_div(new vec3f(.1121389280082026, .582829769477194, .6615219269164305), 61.543357849121094);
            expect(va.x).toBeCloseTo(0.0018221126036561236, 3);
            expect(va.y).toBeCloseTo(0.009470230254677555, 3);
            expect(va.z).toBeCloseTo(0.010748876077548599, 3);

            va = vec3_div(new vec3f(.2836129295336631, .1491180594172365, .910975519341753), 56.142784118652344);
            expect(va.x).toBeCloseTo(0.005051636358721979, 3);
            expect(va.y).toBeCloseTo(0.0026560503145353453, 3);
            expect(va.z).toBeCloseTo(0.016226048167053746, 3);

            va = vec3_div(new vec3f(.0473982269987301, .2622956938879242, .5522294949501816), 66.33173370361328);
            expect(va.x).toBeCloseTo(0.0007145633673697898, 3);
            expect(va.y).toBeCloseTo(0.003954301798592009, 3);
            expect(va.z).toBeCloseTo(0.008325268527092637, 3);

            va = vec3_div(new vec3f(.0073189191583598, .0888110099257029, .1613772205091211), 73.37715911865234);
            expect(va.x).toBeCloseTo(0.00009974383372521911, 3);
            expect(va.y).toBeCloseTo(0.001210335900059768, 3);
            expect(va.z).toBeCloseTo(0.0021992841157582954, 3);

            va = vec3_div(new vec3f(.7441430137239509, .6052070405690158, .0155459826713797), 67.3084945678711);
            expect(va.x).toBeCloseTo(0.011055707284815112, 3);
            expect(va.y).toBeCloseTo(0.008991540287069562, 3);
            expect(va.z).toBeCloseTo(0.00023096613245009986, 3);

            va = vec3_div(new vec3f(.3535662103150818, .8217075037221533, .1767015266056162), 58.107295989990234);
            expect(va.x).toBeCloseTo(0.006084712845285184, 3);
            expect(va.y).toBeCloseTo(0.01414121049211623, 3);
            expect(va.z).toBeCloseTo(0.003040952493057936, 3);

            va = vec3_div(new vec3f(.9938158859162063, .1286274554092552, .5309558331134288), 91.586669921875);
            expect(va.x).toBeCloseTo(0.010851097509757133, 3);
            expect(va.y).toBeCloseTo(0.0014044342426575468, 3);
            expect(va.z).toBeCloseTo(0.005797304712206953, 3);


        });

        it("vec3_div_02", () => {
            let va;
            va = vec3_div(new vec3f(0.232495, 0.742557, 0.177872), new quatf(-0.498222, -0.241408, -0.167669, 0.815710));
            expect(va.x).toBeCloseTo(0.267599, 3); expect(va.y).toBeCloseTo(0.321509, 3); expect(va.z).toBeCloseTo(0.679784, 3);
            va = vec3_div(new vec3f(0.369988, 0.242239, 0.851686), new quatf(-0.610863, 0.380341, -0.261092, 0.643442));
            expect(va.x).toBeCloseTo(-0.126641, 3); expect(va.y).toBeCloseTo(-0.857852, 3); expect(va.z).toBeCloseTo(0.411085, 3);
            va = vec3_div(new vec3f(0.469327, 0.658717, 0.314906), new quatf(-0.143663, 0.125929, -0.810268, 0.554048));
            expect(va.x).toBeCloseTo(-0.747711, 3); expect(va.y).toBeCloseTo(0.056597, 3); expect(va.z).toBeCloseTo(0.437112, 3);
            va = vec3_div(new vec3f(0.907238, 0.326549, 0.617047), new quatf(0.533973, -0.158311, -0.715922, 0.421030));
            expect(va.x).toBeCloseTo(-0.709821, 3); expect(va.y).toBeCloseTo(0.616453, 3); expect(va.z).toBeCloseTo(-0.653147, 3);
            va = vec3_div(new vec3f(0.068387, 0.886148, 0.940293), new quatf(-0.384955, -0.014422, -0.244639, 0.889806));
            expect(va.x).toBeCloseTo(-0.114546, 3); expect(va.y).toBeCloseTo(-0.089556, 3); expect(va.z).toBeCloseTo(1.285669, 3);
            va = vec3_div(new vec3f(0.346772, 0.997715, 0.246876), new quatf(0.419873, -0.471925, -0.360630, 0.686250));
            expect(va.x).toBeCloseTo(-0.701972, 3); expect(va.y).toBeCloseTo(0.646936, 3); expect(va.z).toBeCloseTo(-0.515117, 3);
            va = vec3_div(new vec3f(0.210023, 0.745460, 0.130339), new quatf(0.266014, 0.380702, 0.645015, 0.606843));
            expect(va.x).toBeCloseTo(0.693459, 3); expect(va.y).toBeCloseTo(0.003885, 3); expect(va.z).toBeCloseTo(0.368657, 3);
            va = vec3_div(new vec3f(0.477466, 0.971469, 0.676374), new quatf(0.303235, 0.830000, -0.468121, -0.003331));
            expect(va.x).toBeCloseTo(-0.085895, 3); expect(va.y).toBeCloseTo(0.078932, 3); expect(va.z).toBeCloseTo(-1.271062, 3);
            va = vec3_div(new vec3f(0.569507, 0.856478, 0.920027), new quatf(-0.346747, 0.073957, -0.933868, -0.046777));
            expect(va.x).toBeCloseTo(0.203038, 3); expect(va.y).toBeCloseTo(-1.019567, 3); expect(va.z).toBeCloseTo(0.907525, 3);
            va = vec3_div(new vec3f(0.109323, 0.646312, 0.850769), new quatf(-0.577188, -0.126375, 0.428622, -0.683496));
            expect(va.x).toBeCloseTo(-0.786666, 3); expect(va.y).toBeCloseTo(0.637306, 3); expect(va.z).toBeCloseTo(-0.358436, 3);
            va = vec3_div(new vec3f(0.478812, 0.476107, 0.800029), new quatf(0.607733, -0.206548, 0.062861, 0.764230));
            expect(va.x).toBeCloseTo(0.674087, 3); expect(va.y).toBeCloseTo(0.676811, 3); expect(va.z).toBeCloseTo(-0.428390, 3);
            va = vec3_div(new vec3f(0.056929, 0.859719, 0.180262), new quatf(-0.780680, -0.434659, 0.333046, 0.301147));
            expect(va.x).toBeCloseTo(0.732152, 3); expect(va.y).toBeCloseTo(-0.488667, 3); expect(va.z).toBeCloseTo(0.003247, 3);
            va = vec3_div(new vec3f(0.558652, 0.245036, 0.849870), new quatf(-0.649758, 0.019187, -0.230060, -0.724237));
            expect(va.x).toBeCloseTo(0.852352, 3); expect(va.y).toBeCloseTo(0.604463, 3); expect(va.z).toBeCloseTo(0.050351, 3);
            va = vec3_div(new vec3f(0.962042, 0.254391, 0.703641), new quatf(0.227466, -0.495781, -0.780866, -0.304483));
            expect(va.x).toBeCloseTo(-1.082916, 3); expect(va.y).toBeCloseTo(-0.309274, 3); expect(va.z).toBeCloseTo(0.465823, 3);
            va = vec3_div(new vec3f(0.504651, 0.677676, 0.543540), new quatf(-0.702551, 0.172063, -0.123495, 0.679386));
            expect(va.x).toBeCloseTo(0.149063, 3); expect(va.y).toBeCloseTo(-0.591259, 3); expect(va.z).toBeCloseTo(0.798465, 3);
            va = vec3_div(new vec3f(0.132809, 0.172052, 0.036415), new quatf(0.979764, -0.135092, 0.024657, 0.145618));
            expect(va.x).toBeCloseTo(0.086683, 3); expect(va.y).toBeCloseTo(-0.184438, 3); expect(va.z).toBeCloseTo(-0.083875, 3);
            va = vec3_div(new vec3f(0.845689, 0.416274, 0.421865), new quatf(-0.511992, 0.227070, 0.533347, -0.633912));
            expect(va.x).toBeCloseTo(-0.209867, 3); expect(va.y).toBeCloseTo(0.712439, 3); expect(va.z).toBeCloseTo(-0.717518, 3);
            va = vec3_div(new vec3f(0.974074, 0.769626, 0.231367), new quatf(-0.199228, -0.924483, -0.215811, 0.243033));
            expect(va.x).toBeCloseTo(-0.455048, 3); expect(va.y).toBeCloseTo(1.167751, 3); expect(va.z).toBeCloseTo(-0.154802, 3);
            va = vec3_div(new vec3f(0.974872, 0.615972, 0.683532), new quatf(0.609440, 0.643187, 0.421549, -0.192848));
            expect(va.x).toBeCloseTo(0.725336, 3); expect(va.y).toBeCloseTo(1.072248, 3); expect(va.z).toBeCloseTo(0.348117, 3);
            va = vec3_div(new vec3f(0.688443, 0.099072, 0.303350), new quatf(-0.899986, 0.000553, 0.008449, -0.435837));
            expect(va.x).toBeCloseTo(0.683049, 3); expect(va.y).toBeCloseTo(0.180929, 3); expect(va.z).toBeCloseTo(-0.276584, 3);
        });
    });

    describe('vec3_dot', () => {
        it('should return 0 for two orthogonal vectors', () => {
            const v1 = [1, 0, 0];
            const v2 = [0, 1, 0];
            expect(vec3_dot(v1, v2)).toBe(0);
        });

        it('should return the correct dot product for parallel vectors', () => {
            const v1 = [1, 2, 3];
            const v2 = [2, 4, 6];
            expect(vec3_dot(v1, v2)).toBe(28);
        });

        it('should return the correct dot product for anti-parallel vectors', () => {
            const v1 = [1, 2, 3];
            const v2 = [-1, -2, -3];
            expect(vec3_dot(v1, v2)).toBe(-14);
        });

        it('should return the correct dot product for arbitrary vectors', () => {
            const v1 = [1, 2, 3];
            const v2 = [4, 5, 6];
            expect(vec3_dot(v1, v2)).toBe(32);
        });

        it('should return the correct dot product for vectors with negative components', () => {
            const v1 = [-1, -2, -3];
            const v2 = [4, 5, 6];
            expect(vec3_dot(v1, v2)).toBe(-32);
        });

        it('should return 0 for zero vectors', () => {
            const v1 = [0, 0, 0];
            const v2 = [0, 0, 0];
            expect(vec3_dot(v1, v2)).toBe(0);
        });

        it("vec3_dot_00", () => {
            let va;
            va = vec3_dot(new vec3f(.168968231601591, .4809088956205685, .3746962620378493), new vec3f(.0121137089612398, .4556881377105702, .5112031648751993));
            expect(va).toBeCloseTo(0.41273722605575647, 3);

            va = vec3_dot(new vec3f(.1103498834533485, .5783838084633952, .498818155199573), new vec3f(.4110279691433987, .9707124149631057, .8863370955788159));
            expect(va).toBeCloseTo(1.0489222668816738, 3);

            va = vec3_dot(new vec3f(.6968849487628246, .9371666607548734, .8303363961711749), new vec3f(.2448790100364981, .4429080017190983, .987876141078883));
            expect(va).toBeCloseTo(1.406000624202004, 3);

            va = vec3_dot(new vec3f(.1759161504733833, .7011901598543637, .5153808731004887), new vec3f(.9219174219541439, .9886970012045095, .2221678689930859));
            expect(va).toBeCloseTo(0.9699458425431705, 3);

            va = vec3_dot(new vec3f(.1505467758080978, .1371072816195691, .2188850928134016), new vec3f(.4600669661728272, .9912224635751217, .3240139311908776));
            expect(va).toBeCloseTo(0.27608723527572, 3);

            va = vec3_dot(new vec3f(.7087961557584734, .2989148697904882, .6878035412621351), new vec3f(.1825653101162459, .7963034312519479, .0179447988019084));
            expect(va).toBeCloseTo(0.3797710226148327, 3);

            va = vec3_dot(new vec3f(.7252125101611862, .8680612309956171, .4793373482155936), new vec3f(.6226220409896741, .9264246267187741, .001112514187892));
            expect(va).toBeCloseTo(1.2562598647226328, 3);

            va = vec3_dot(new vec3f(.3190384790326932, .8181748989002846, .8043175103246705), new vec3f(.7628006785284949, .5913890124145769, .7843920723214772));
            expect(va).toBeCloseTo(1.3581226924538923, 3);

            va = vec3_dot(new vec3f(.8952370558522531, .4858545444499933, .8385956659345761), new vec3f(.4831781170780174, .6063671364191645, .0323294293150587));
            expect(va).toBeCloseTo(0.754276503125286, 3);

            va = vec3_dot(new vec3f(.6635501657773974, .6205028590080077, .8685043944596804), new vec3f(.3399189820261621, .1753475245522227, .3758452068143801));
            expect(va).toBeCloseTo(0.6607801509338715, 3);

            va = vec3_dot(new vec3f(.0491742194908478, .982613276307289, .7947082800826477), new vec3f(.0571973614186119, .7995449998368287, .4323040287253206));
            expect(va).toBeCloseTo(1.1320117585905722, 3);

            va = vec3_dot(new vec3f(.5134718573957882, .7458393961255483, .8966454081658219), new vec3f(.7026880870228729, .4362528593187494, .5543984554833032));
            expect(va).toBeCloseTo(1.1832839557691952, 3);

            va = vec3_dot(new vec3f(.7474770979489691, .5418183468339357, .2734915557914801), new vec3f(.7594636747876518, .148516015344027, .7053646226334518));
            expect(va).toBeCloseTo(0.8410616735842906, 3);

            va = vec3_dot(new vec3f(.9892072005514219, .9791812538275333, .5475772077792793), new vec3f(.9299927468266569, .3352719805813493, .113444286767062));
            expect(va).toBeCloseTo(1.3103670657268303, 3);

            va = vec3_dot(new vec3f(.0713105623717778, .6215807871561443, .3303235591425893), new vec3f(.8759299720175666, .8665233149527392, .3825668525086241));
            expect(va).toBeCloseTo(0.7274481474309702, 3);

            va = vec3_dot(new vec3f(.8745661246799774, .9537302601011379, .3853212936669841), new vec3f(.0514387617160736, .721743207096351, .8286065319278642));
            expect(va).toBeCloseTo(1.0526146759459534, 3);

            va = vec3_dot(new vec3f(.0432456023003593, .8809812360163529, .8004445016781825), new vec3f(.0823582673827641, .117997739365743, .4819043206487559));
            expect(va).toBeCloseTo(0.4932530909492059, 3);

            va = vec3_dot(new vec3f(.6791820268661035, .10315296654991, .6264795175926137), new vec3f(.9239384339010299, .1605318067585557, .1696569840158266));
            expect(va).toBeCloseTo(0.7503683358316097, 3);

            va = vec3_dot(new vec3f(.4093047877505351, .963343466273938, .722177404308801), new vec3f(.8905196997876417, .0721952064828328, .4796281509532754));
            expect(va).toBeCloseTo(0.780419370259652, 3);

            va = vec3_dot(new vec3f(.4172735225325805, .7864644347267435, .4828086905741027), new vec3f(.4673218454388244, .7220023520896839, .1550501476858175));
            expect(va).toBeCloseTo(0.8376897630877878, 3);
        });
    });

    describe('vec3_cross', () => {
        it('should return a zero vector for parallel vectors', () => {
            const v1 = [1, 2, 3];
            const v2 = [2, 4, 6];
            const result = vec3_cross(v1, v2);
            expect(result[X_AXIS]).toBe(0);
            expect(result[Y_AXIS]).toBe(0);
            expect(result[Z_AXIS]).toBe(0);
        });

        it('should return the correct cross product for orthogonal vectors', () => {
            const v1 = [1, 0, 0];
            const v2 = [0, 1, 0];
            const result = vec3_cross(v1, v2);
            expect(result[X_AXIS]).toBe(0);
            expect(result[Y_AXIS]).toBe(0);
            expect(result[Z_AXIS]).toBe(1);
        });

        it('should return the correct cross product for arbitrary vectors', () => {
            const v1 = [1, 2, 3];
            const v2 = [4, 5, 6];
            const result = vec3_cross(v1, v2);
            expect(result[X_AXIS]).toBe(-3);
            expect(result[Y_AXIS]).toBe(6);
            expect(result[Z_AXIS]).toBe(-3);
        });

        it('should return a zero vector for zero vectors', () => {
            const v1 = [0, 0, 0];
            const v2 = [0, 0, 0];
            const result = vec3_cross(v1, v2);
            expect(result[X_AXIS]).toBe(0);
            expect(result[Y_AXIS]).toBe(0);
            expect(result[Z_AXIS]).toBe(0);
        });

        it('should handle vectors with negative components', () => {
            const v1 = [-1, -2, -3];
            const v2 = [4, 5, 6];
            const result = vec3_cross(v1, v2);
            expect(result[X_AXIS]).toBe(3);
            expect(result[Y_AXIS]).toBe(-6);
            expect(result[Z_AXIS]).toBe(3);
        });

        it('should store the result in the provided result vector', () => {
            const v1 = [1, 2, 3];
            const v2 = [4, 5, 6];
            const result = [0, 0, 0];
            vec3_cross(v1, v2, result);
            expect(result[X_AXIS]).toBe(-3);
            expect(result[Y_AXIS]).toBe(6);
            expect(result[Z_AXIS]).toBe(-3);
        });

        it("vec3_cross_00", () => {
            let va;
            va = vec3_cross(new vec3f(.1442058457882778, .5653029397748404, .5330578368943677), new vec3f(.4382882606922707, .8154781053426827, .2503385399013143));
            expect(va.x).toBeCloseTo(-0.29317988232353365, 3);
            expect(va.y).toBeCloseTo(0.197532711300945, 3);
            expect(va.z).toBeCloseTo(-0.13016893233537835, 3);

            va = vec3_cross(new vec3f(.5426433061251235, .2276332978105331, .4574904170345429), new vec3f(.1486100448879875, .9194901848509691, .7115015365642126));
            expect(va.x).toBeCloseTo(-0.25869650696126545, 3);
            expect(va.y).toBeCloseTo(-0.31810387470298224, 3);
            expect(va.z).toBeCloseTo(0.46512659925150684, 3);

            va = vec3_cross(new vec3f(.2954121208659986, .0394698114926704, .7335543606614459), new vec3f(.1191573959400207, .8988664463820479, .7125963340255281));
            expect(va.x).toBeCloseTo(-0.6312413584214533, 3);
            expect(va.y).toBeCloseTo(-0.12310116695895212, 3);
            expect(va.z).toBeCloseTo(0.26083292334529407, 3);

            va = vec3_cross(new vec3f(.2256377626757247, .0682859544766103, .8289167864925482), new vec3f(.7151194151276863, .5260493632138818, .3677021784689674));
            expect(va.x).toBeCloseTo(-0.41094225347181984, 3);
            expect(va.y).toBeCloseTo(0.5098069906653445, 3);
            expect(va.z).toBeCloseTo(0.06986398954582056, 3);

            va = vec3_cross(new vec3f(.6756192211137217, .2127428826830944, .7382508695545753), new vec3f(.5547809622043358, .1664800757540317, .8168439220256443));
            expect(va.x).toBeCloseTo(0.05087366998497489, 3);
            expect(va.y).toBeCloseTo(-0.14230792661076852, 3);
            expect(va.z).toBeCloseTo(-0.005548562045158953, 3);

            va = vec3_cross(new vec3f(.3758261457478189, .6979449194833021, .9082261594508894), new vec3f(.7716849593563124, .5239171586360858, .4988245051947471));
            expect(va.x).toBeCloseTo(-0.1276832397440288, 3);
            expect(va.y).toBeCloseTo(0.5133931757502946, 3);
            expect(va.z).toBeCloseTo(-0.34169183040306794, 3);

            va = vec3_cross(new vec3f(.7228428040641888, .3626583584861929, .6444180315082961), new vec3f(.4992819465682328, .0384837179191893, .8602542477661144));
            expect(va.x).toBeCloseTo(0.2871787916290292, 3);
            expect(va.y).toBeCloseTo(-0.30008230348825665, 3);
            expect(va.z).toBeCloseTo(-0.1532510925927043, 3);

            va = vec3_cross(new vec3f(.7883908060852036, .4143550220897951, .6141776139743265), new vec3f(.0865187500894089, .7745573880775443, .4097224141233522));
            expect(va.x).toBeCloseTo(-0.3059452685408868, 3);
            expect(va.y).toBeCloseTo(-0.26988350484793105, 3);
            expect(va.z).toBeCloseTo(0.5748044449412265, 3);

            va = vec3_cross(new vec3f(.4692093286932701, .4816758872313549, .5665209974804575), new vec3f(.0052199266483197, .3352637018580062, .1126807072965803));
            expect(va.x).toBeCloseTo(-0.13565834713465147, 3);
            expect(va.y).toBeCloseTo(-0.04991364097573041, 3);
            expect(va.z).toBeCloseTo(0.15479454368440376, 3);

            va = vec3_cross(new vec3f(.5822187088170081, .7497578541777521, .3414756814180828), new vec3f(.5902747509655382, .5886983083369375, .1144637003993594));
            expect(va.x).toBeCloseTo(-0.11520609759635955, 3);
            expect(va.y).toBeCloseTo(0.13492156495691443, 3);
            expect(va.z).toBeCloseTo(-0.09981196169654027, 3);

            va = vec3_cross(new vec3f(.2121737911421484, .9985280194413104, .5170438650858777), new vec3f(.9357516264101533, .1367283206509664, .7336676676569105));
            expect(va.x).toBeCloseTo(0.6618931837375035, 3);
            expect(va.y).toBeCloseTo(0.3281595871943175, 3);
            expect(va.z).toBeCloseTo(-0.9053640520593006, 3);

            va = vec3_cross(new vec3f(.5765987931626002, .2314518388960507, .2749373832367092), new vec3f(.998893560182105, .0142390404075845, .3686861556200201));
            expect(va.x).toBeCloseTo(0.0814182441843061, 3);
            expect(va.y).toBeCloseTo(0.062049189182206116, 3);
            expect(va.z).toBeCloseTo(-0.22298553785076436, 3);

            va = vec3_cross(new vec3f(.8167455672752015, .584716758460252, .3278299678737238), new vec3f(.8247754673489738, .1309746062890658, .7456763145877165));
            expect(va.x).toBeCloseTo(0.3930720365542987, 3);
            expect(va.y).toBeCloseTo(-0.3386417095975766, 3);
            expect(va.z).toBeCloseTo(-0.37528710861362213, 3);

            va = vec3_cross(new vec3f(.7384448851326149, .9728070405122249, .3610447758948432), new vec3f(.1901846629537856, .4396430385802097, .6546953803513049));
            expect(va.x).toBeCloseTo(0.47816145305865865, 3);
            expect(va.y).toBeCloseTo(-0.4147912759255872, 3);
            expect(va.z).toBeCloseTo(0.1396391740048296, 3);

            va = vec3_cross(new vec3f(.728242554843322, .4967951229666614, .8171399927006826), new vec3f(.5575721415820727, .4962170275487223, .7099156696502311));
            expect(va.x).toBeCloseTo(-0.052796135869271066, 3);
            expect(va.y).toBeCloseTo(-0.061376305286913235, 3);
            expect(va.z).toBeCloseTo(0.08436723525879009, 3);

            va = vec3_cross(new vec3f(.8383308532810871, .3306261329383076, .824652590387106), new vec3f(.2956907507280337, .7151247485238281, .1613251967008584));
            expect(va.x).toBeCloseTo(-0.536391150389386, 3);
            expect(va.y).toBeCloseTo(0.10859825373541121, 3);
            expect(va.z).toBeCloseTo(0.5017480511735689, 3);

            va = vec3_cross(new vec3f(.3013538742432502, .0664567637668414, .0412512229115036), new vec3f(.307339588707668, .1684464734240894, .1179636099849284));
            expect(va.x).toBeCloseTo(0.0008908567379784177, 3);
            expect(va.y).toBeCloseTo(-0.02287065700536807, 3);
            expect(va.z).toBeCloseTo(0.03033720292601833, 3);

            va = vec3_cross(new vec3f(.9461087033351894, .7334551421619373, .9926482103356657), new vec3f(.0769160196312006, .3995544369821573, .0051868505145314));
            expect(va.x).toBeCloseTo(-0.3928126746205047, 3);
            expect(va.y).toBeCloseTo(0.07144322481835752, 3);
            expect(va.z).toBeCloseTo(0.32160748017187785, 3);

            va = vec3_cross(new vec3f(.1099263588977031, .4649662172531202, .4099580100523443), new vec3f(.2135890884595211, .0523851305333083, .7302052384083879));
            expect(va.x).toBeCloseTo(0.3180450636513935, 3);
            expect(va.y).toBeCloseTo(0.007293754567496119, 3);
            expect(va.z).toBeCloseTo(-0.0935532038476581, 3);

            va = vec3_cross(new vec3f(.2288058281958691, .2779123314350855, .8933814284443713), new vec3f(.0915275462901846, .6228304415332488, .6287180375882697));
            expect(va.x).toBeCloseTo(-0.3816966538941645, 3);
            expect(va.y).toBeCloseTo(-0.06208534124533224, 3);
            expect(va.z).toBeCloseTo(0.11707060122057594, 3);
        });
    });

    describe('vec3_dist_sqr', () => {
        it('should return 0 for identical vectors', () => {
            const v1 = [1, 2, 3];
            const v2 = [1, 2, 3];
            expect(vec3_dist_sqr(v1, v2)).toBe(0);
        });

        it('should return the correct squared distance for different vectors', () => {
            const v1 = [1, 2, 3];
            const v2 = [4, 6, 8];
            expect(vec3_dist_sqr(v1, v2)).toBe(50);
        });

        it('should handle vectors with negative components', () => {
            const v1 = [-1, -2, -3];
            const v2 = [4, 5, 6];
            expect(vec3_dist_sqr(v1, v2)).toBe(155);
        });

        it('should return the correct squared distance for vectors with zero components', () => {
            const v1 = [0, 0, 0];
            const v2 = [1, 2, 3];
            expect(vec3_dist_sqr(v1, v2)).toBe(14);
        });

        it('should handle vectors with mixed positive and negative components', () => {
            const v1 = [1, -2, 3];
            const v2 = [-4, 5, -6];
            expect(vec3_dist_sqr(v1, v2)).toBe(155);
        });

        it('should handle large values without overflow', () => {
            const v1 = [1e6, 2e6, 3e6];
            const v2 = [4e6, 5e6, 6e6];
        });

        it("vec3_dist_sqr_00", () => {
            let va;
            va = vec3_dist_sqr(new vec3f(.0007676325695585, .694622266103746, .283385988985503), new vec3f(.1227476476727196, .3153955970673774, .5702843508618649));
            expect(va).toBeCloseTo(0.24100266064032674, 3);

            va = vec3_dist_sqr(new vec3f(.7971222052705262, .7547838564518699, .831745964367625), new vec3f(.9476971511185426, .6855806754668834, .6490848042089221));
            expect(va).toBeCloseTo(0.06082699400609716, 3);

            va = vec3_dist_sqr(new vec3f(.4688728542211889, .7417689005975348, .5523110965891396), new vec3f(.7319036181411529, .0708199907586715, .917486103075599));
            expect(va).toBeCloseTo(0.6527104077446646, 3);

            va = vec3_dist_sqr(new vec3f(.1055133066338902, .9603469202373454, .8525586373191274), new vec3f(.9172211612296171, .452508719335676, .3296526435238718));
            expect(va).toBeCloseTo(1.1901999578544458, 3);

            va = vec3_dist_sqr(new vec3f(.5961630076707625, .3769441780621561, .3890729674521878), new vec3f(.0721167407812053, .6067706247433633, .5084123662754458));
            expect(va).toBeCloseTo(0.34168657754648735, 3);

            va = vec3_dist_sqr(new vec3f(.9903267803554701, .6362352400216804, .009944125045446), new vec3f(.4106178029715939, .8904733100857236, .2396620175314341));
            expect(va).toBeCloseTo(0.45346980485755284, 3);

            va = vec3_dist_sqr(new vec3f(.7540075911175821, .214699994670843, .6843675788313512), new vec3f(.937432582606524, .6703486346286085, .114543479494341));
            expect(va).toBeCloseTo(0.5659599147833148, 3);

            va = vec3_dist_sqr(new vec3f(.3142711761112522, .3084051460567232, .8453414174436238), new vec3f(.9051319887750666, .2258945731643158, .0589190504829165));
            expect(va).toBeCloseTo(0.9743846338368579, 3);

            va = vec3_dist_sqr(new vec3f(.7789101982333562, .4095533146650667, .2572140611705778), new vec3f(.8293154227115795, .752083818017343, .6968417943619463));
            expect(va).toBeCloseTo(0.31314037617244495, 3);

            va = vec3_dist_sqr(new vec3f(.2866030822228729, .959717169936678, .3363011938393528), new vec3f(.3514454338579873, .4307369448566125, .2110669620832577));
            expect(va).toBeCloseTo(0.2997082218948679, 3);

            va = vec3_dist_sqr(new vec3f(.4107399273143544, .2999296522418939, .5986864253316171), new vec3f(.9990071254819046, .1843384847990206, .7502873021232734));
            expect(va).toBeCloseTo(0.38240244027470516, 3);

            va = vec3_dist_sqr(new vec3f(.160750577772022, .0492788970644551, .8216458521420311), new vec3f(.1824272798713331, .3847692750363143, .0333862624822125));
            expect(va).toBeCloseTo(0.7343768538162688, 3);

            va = vec3_dist_sqr(new vec3f(.1622221052711679, .9350520678462673, .9678194751533551), new vec3f(.5155364998621055, .2978962922859629, .1123399527186077));
            expect(va).toBeCloseTo(1.262643757060197, 3);

            va = vec3_dist_sqr(new vec3f(.6454732337122357, .5125796130816567, .992297273134594), new vec3f(.0540060330753467, .5396706433744234, .2331305427264758));
            expect(va).toBeCloseTo(0.9269014979101141, 3);

            va = vec3_dist_sqr(new vec3f(.1457629561621938, .8552126500706243, .2786572840594015), new vec3f(.2495470803028015, .2033950447326658, .7297428479133379));
            expect(va).toBeCloseTo(0.6391155209695675, 3);

            va = vec3_dist_sqr(new vec3f(.7175958719748212, .0475053554565337, .1561572087896763), new vec3f(.5403167761442234, .512997410711725, .6393879254739467));
            expect(va).toBeCloseTo(0.48162265687141004, 3);

            va = vec3_dist_sqr(new vec3f(.6773271052167258, .0459010874075481, .3274452637238305), new vec3f(.3433176353298222, .4420172521364596, .5074020210571089));
            expect(va).toBeCloseTo(0.30085477644358094, 3);

            va = vec3_dist_sqr(new vec3f(.0515790758546462, .5792281256710479, .3635673245570474), new vec3f(.0054050424235594, .7362708896627614, .1368501922529914));
            expect(va).toBeCloseTo(0.07819512916562699, 3);

            va = vec3_dist_sqr(new vec3f(.0401664994819773, .3285856786006205, .202458843906629), new vec3f(.8947686388469867, .7183069443440566, .9175955914158345));
            expect(va).toBeCloseTo(1.393648049217962, 3);

            va = vec3_dist_sqr(new vec3f(.2797615322857374, .8681890849442391, .8512608111844187), new vec3f(.4599134261106335, .7288947211497321, .294791521655785));
            expect(va).toBeCloseTo(0.3615156948221154, 3);

        });
    });

    describe('vec3_dist', () => {
        it('should return 0 for identical vectors', () => {
            const v1 = [1, 2, 3];
            const v2 = [1, 2, 3];
            expect(vec3_dist(v1, v2)).toBe(0);
        });

        it('should return the correct distance for different vectors', () => {
            const v1 = [1, 2, 3];
            const v2 = [4, 6, 8];
            expect(vec3_dist(v1, v2)).toBe(Math.sqrt(50));
        });

        it('should handle vectors with negative components', () => {
            const v1 = [-1, -2, -3];
            const v2 = [4, 5, 6];
            expect(vec3_dist(v1, v2)).toBeCloseTo(12.4499, 5);
        });

        it('should return the correct distance for vectors with zero components', () => {
            const v1 = [0, 0, 0];
            const v2 = [1, 2, 3];
            expect(vec3_dist(v1, v2)).toBe(Math.sqrt(14));
        });

        it('should handle vectors with mixed positive and negative components', () => {
            const v1 = [1, -2, 3];
            const v2 = [-4, 5, -6];
            expect(vec3_dist(v1, v2)).toBeCloseTo(12.4499, 5);
        });

        it('should handle large values without overflow', () => {
            const v1 = [1e6, 2e6, 3e6];
            const v2 = [4e6, 5e6, 6e6];
            expect(vec3_dist(v1, v2)).toBeCloseTo(5196152.422707, 5);
        });

        it("vec3_dist_00", () => {
            let va;
            va = vec3_dist(new vec3f(.8081740223059726, .4516252662914557, .3145702993465134), new vec3f(.3979347081713513, .6729373452783762, .9394216807104894));
            expect(va).toBeCloseTo(0.7795605043610319, 3);

            va = vec3_dist(new vec3f(.8303906972299098, .630316657423774, .1856185618318793), new vec3f(.4479163868568221, .2280421738082696, .1045273924395926));
            expect(va).toBeCloseTo(0.5609698173849447, 3);

            va = vec3_dist(new vec3f(.6662923924254047, .9216428104408021, .3196882087320125), new vec3f(.3025244434061156, .2670804676495722, .4122424575723691));
            expect(va).toBeCloseTo(0.7545497136123281, 3);

            va = vec3_dist(new vec3f(.9235129733344956, .811133857287446, .8643357746916918), new vec3f(.377050095421962, .5249628106265161, .4243549752415618));
            expect(va).toBeCloseTo(0.7576929779061148, 3);

            va = vec3_dist(new vec3f(.390041018767461, .5279586158303489, .8517285878686063), new vec3f(.5438326402110845, .9010527988888413, .1735309669734924));
            expect(va).toBeCloseTo(0.7891787790140681, 3);

            va = vec3_dist(new vec3f(.2604614898770852, .3601968466113454, .6723700401930219), new vec3f(.0938582308931675, .5118835229330954, .3284222852069938));
            expect(va).toBeCloseTo(0.4111758162119102, 3);

            va = vec3_dist(new vec3f(.0419529161407532, .0810620569222922, .5922483847835924), new vec3f(.2972163927260185, .9763605755167724, .4083261328865906));
            expect(va).toBeCloseTo(0.948971166379006, 3);

            va = vec3_dist(new vec3f(.5692485346059923, .0221191209697349, .0741421612500364), new vec3f(.0759443063916472, .0527446326073135, .0589106166252213));
            expect(va).toBeCloseTo(0.4944886080476192, 3);

            va = vec3_dist(new vec3f(.6441433866078929, .8409116891641384, .4407933966513604), new vec3f(.0918378457733391, .1919248506687152, .430999432207912));
            expect(va).toBeCloseTo(0.8522448290933499, 3);

            va = vec3_dist(new vec3f(.8494930478702643, .122894405250483, .9252533715722511), new vec3f(.2450952292812199, .5535747259065409, .321506843566576));
            expect(va).toBeCloseTo(0.9567090110344459, 3);

            va = vec3_dist(new vec3f(.7958110037950825, .4396310668849139, .7838795723471685), new vec3f(.6387202868437332, .7421281146004528, .0897485057484644));
            expect(va).toBeCloseTo(0.773304529177452, 3);

            va = vec3_dist(new vec3f(.0390385232532438, .1491902985663591, .4781874817077858), new vec3f(.3578758275958001, .0470018601044875, .5204838303249504));
            expect(va).toBeCloseTo(0.3374739763330623, 3);

            va = vec3_dist(new vec3f(.3528551610368851, .6669601872337054, .1455641787808422), new vec3f(.2391568062729457, .1627182000615519, .9229114022407905));
            expect(va).toBeCloseTo(0.933518078734547, 3);

            va = vec3_dist(new vec3f(.5518355092049205, .230076798592189, .4295998636396074), new vec3f(.5357001862714676, .4160528845894145, .3789907110115991));
            expect(va).toBeCloseTo(0.19341339027776555, 3);

            va = vec3_dist(new vec3f(.6874622584075218, .6676491114249019, .1209262739349626), new vec3f(.7818580252233687, .2568424451507718, .9130497427437514));
            expect(va).toBeCloseTo(0.8972916291182508, 3);

            va = vec3_dist(new vec3f(.3722316055159387, .6946306668467859, .6133537830855089), new vec3f(.9782908962347656, .8520447897793537, .2057861186343144));
            expect(va).toBeCloseTo(0.7471268105692893, 3);

            va = vec3_dist(new vec3f(.6369781988746612, .4943866878917178, .2618497156251709), new vec3f(.8606114246825625, .4557316209885491, .3300727589596983));
            expect(va).toBeCloseTo(0.2369818928196013, 3);

            va = vec3_dist(new vec3f(.6784105421393343, .9622238556832352, .3095290757582678), new vec3f(.9312572884659667, .3773902364907369, .5270748176051423));
            expect(va).toBeCloseTo(0.6732666552425327, 3);

            va = vec3_dist(new vec3f(.1889084101523681, .934015862731093, .4617979623443316), new vec3f(.34540045091857, .0504539174705105, .166121660732621));
            expect(va).toBeCloseTo(0.9447729596419525, 3);

            va = vec3_dist(new vec3f(.4124052384798642, .6804991240202272, .2925420465221145), new vec3f(.7758382718532026, .1471101836361441, .9186383523624966));
            expect(va).toBeCloseTo(0.8992129423323345, 3);
        });
    });

    it("vec3_apply_quat_00", () => {
        let va;
        va = vec3_apply_quat(new vec3f(.0720418309791924, .1862840509052899, .637682511933557), new quatf(-0.3490709495279193, .7744393158334328, .1890055517440445, .4926155901887908));
        expect(va.x).toBeCloseTo(0.24748193919108502, 3);
        expect(va.y).toBeCloseTo(0.5080299810881037, 3);
        expect(va.z).toBeCloseTo(-0.3566356504168523, 3);
        // <0.247482, 0.508030, -0.356636>

        va = vec3_apply_quat(new vec3f(.36447475990079, .9923774203300166, .4883484683349741), new quatf(-0.6921039512471374, .4141922876052948, -0.2945046415066018, .5125464717344765));
        expect(va.x).toBeCloseTo(0.31325482799301574, 3);
        expect(va.y).toBeCloseTo(-0.22214613241486722, 3);
        expect(va.z).toBeCloseTo(-1.09939143625139, 3);

        va = vec3_apply_quat(new vec3f(.8870742697744034, .8501705901808552, .5122756630151535), new quatf(.1275630989697642, .8274024991949434, .0245497741362249, -0.5463790522128865));
        expect(va.x).toBeCloseTo(-0.5862621887039916, 3);
        expect(va.y).toBeCloseTo(1.0771543145975044, 3);
        expect(va.z).toBeCloseTo(0.5178343133299059, 3);

        va = vec3_apply_quat(new vec3f(.7507843118659201, .6174656041856315, .162840898873587), new quatf(-0.620271549675031, .7346205449547752, -0.0228096701999853, .2739992309103304));
        expect(va.x).toBeCloseTo(-0.5451775166454489, 3);
        expect(va.y).toBeCloseTo(-0.5020024068090477, 3);
        expect(va.z).toBeCloseTo(-0.6497946387471141, 3);

        va = vec3_apply_quat(new vec3f(.7788416078240283, .3313828579723619, .1181590024067061), new quatf(.9757435103677645, -0.0505240056486798, -0.1460634044988444, -0.1550400228799364));
        expect(va.x).toBeCloseTo(0.6621218108217927, 3);
        expect(va.y).toBeCloseTo(-0.3177824972629325, 3);
        expect(va.z).toBeCloseTo(-0.43701188834286925, 3);

        va = vec3_apply_quat(new vec3f(.3131844199177307, .7040775330886013, .5593922637173172), new quatf(.62704208490951, -0.1022288133441612, .4248584184572832, .6448742650630086));
        expect(va.x).toBeCloseTo(-0.05820279182565641, 3);
        expect(va.y).toBeCloseTo(-0.4732879239210056, 3);
        expect(va.z).toBeCloseTo(0.8242210469773046, 3);

        va = vec3_apply_quat(new vec3f(.7871286545286562, .4513397512837085, .8586115100332052), new quatf(.9288147346656425, -0.2513323738852786, .0546694574146568, -0.2667329693366937));
        expect(va.x).toBeCloseTo(0.6877384574310756, 3);
        expect(va.y).toBeCloseTo(-0.318710144654998, 3);
        expect(va.z).toBeCloseTo(-0.9929413239938942, 3);

        va = vec3_apply_quat(new vec3f(.3121676088636847, .4458696888297351, .5996604730861801), new quatf(-0.2016513702179371, -0.7648476539306371, .5266814644999057, .3113702396155796));
        expect(va.x).toBeCloseTo(-0.6479479652153841, 3);
        expect(va.y).toBeCloseTo(-0.04689505672500732, 3);
        expect(va.z).toBeCloseTo(-0.48353424537538015, 3);

        va = vec3_apply_quat(new vec3f(.5576087341150453, .7368878658363371, .8052768689764922), new quatf(-0.0221582740143393, -0.450049104562506, -0.541324368296907, .7098822033711978));
        expect(va.x).toBeCloseTo(0.09074340976102568, 3);
        expect(va.y).toBeCloseTo(0.30457092806994157, 3);
        expect(va.z).toBeCloseTo(1.1838092102388604, 3);

        va = vec3_apply_quat(new vec3f(.3072430602814784, .698214981951212, .1443883818430081), new quatf(-0.7703539908643493, -0.2276773416814802, .5931056596647069, .0542534175690107));
        expect(va.x).toBeCloseTo(0.12370850530985954, 3);
        expect(va.y).toBeCloseTo(-0.5210952352866444, 3);
        expect(va.z).toBeCloseTo(-0.5620555358672832, 3);

        va = vec3_apply_quat(new vec3f(.0687044652396487, .7428503765812218, .7402641858139936), new quatf(-0.3254937534040813, .3442670409845556, -0.1537686931806656, .8671154536647192));
        expect(va.x).toBeCloseTo(0.5968509761488789, 3);
        expect(va.y).toBeCloseTo(0.8560877385660313, 3);
        expect(va.z).toBeCloseTo(-0.12418029826269827, 3);

        va = vec3_apply_quat(new vec3f(.7354379671551778, .6179260163206464, .0208602133839604), new quatf(.0877460055488834, -0.2202923006504247, .6696618174365855, .7037932871602907));
        expect(va.x).toBeCloseTo(-0.6059185123466354, 3);
        expect(va.y).toBeCloseTo(0.7102628411606037, 3);
        expect(va.z).toBeCloseTo(0.22699375882119616, 3);

        va = vec3_apply_quat(new vec3f(.8550001440134447, .0754742529556689, .746603663345041), new quatf(-0.2803507653465016, -0.8650106467288227, -0.1087468792084968, .4016642200617667));
        expect(va.x).toBeCloseTo(-0.8748010657712466, 3);
        expect(va.y).toBeCloseTo(0.7104260285097368, 3);
        expect(va.z).toBeCloseTo(0.15542391252261178, 3);

        va = vec3_apply_quat(new vec3f(.985770508721268, .4352978121619875, .1321745751822709), new quatf(.4763645701360417, .1175624231345226, .808084416531334, -0.325968478146365));
        expect(va.x).toBeCloseTo(0.04081310481735736, 3);
        expect(va.y).toBeCloseTo(-0.6735108337865673, 3);
        expect(va.z).toBeCloseTo(0.850538210023221, 3);

        va = vec3_apply_quat(new vec3f(.2285052750418881, .3075184109495506, .4163036487662939), new quatf(.7524534569757362, .5637944087783908, -0.0018538598012356, .3405087706936872));
        expect(va.x).toBeCloseTo(0.5032211364465691, 3);
        expect(va.y).toBeCloseTo(-0.06131878789861294, 3);
        expect(va.z).toBeCloseTo(-0.2511960506359599, 3);

        va = vec3_apply_quat(new vec3f(.1923434681151597, .497787212893396, .8550942636589012), new quatf(.557787061836981, -0.1278648540256719, -0.8198695269006876, .0183883553344033));
        expect(va.x).toBeCloseTo(-0.9146353441812001, 3);
        expect(va.y).toBeCloseTo(-0.3526671732848229, 3);
        expect(va.z).toBeCloseTo(0.2346111055575405, 3);

        va = vec3_apply_quat(new vec3f(.9941413059642612, .3689520873051966, .6777738395347352), new quatf(-0.2802892787658283, .2053855366187372, .8701608742788915, -0.3493919782006453));
        expect(va.x).toBeCloseTo(-0.8412426872193849, 3);
        expect(va.y).toBeCloseTo(-0.8571861975952599, 3);
        expect(va.z).toBeCloseTo(0.37598207452075866, 3);

        va = vec3_apply_quat(new vec3f(.7914678841645806, .3575430521144281, .367612696721662), new quatf(-0.4315243533887546, -0.8798341495561519, .1473004396595649, .1340939304492157));
        expect(va.x).toBeCloseTo(-0.34434485805152737, 3);
        expect(va.y).toBeCloseTo(0.7883868003107988, 3);
        expect(va.z).toBeCloseTo(-0.38635529296155036, 3);

        va = vec3_apply_quat(new vec3f(.3886155778365179, .8630785518103568, .6128596639480179), new quatf(.0107363334762934, .9513753292598702, .2992464161919879, -0.0722585387024321));
        expect(va.x).toBeCloseTo(-0.40983555522248305, 3);
        expect(va.y).toBeCloseTo(1.0493455207299456, 3);
        expect(va.z).toBeCloseTo(0.04931954405942007, 3);

        va = vec3_apply_quat(new vec3f(.6684035016491545, .8587601325928773, .6732705666518386), new quatf(.7327132408231269, -0.345613299910439, -0.0642987978632393, -0.5827078326578677));
        expect(va.x).toBeCloseTo(0.2116520022234015, 3);
        expect(va.y).toBeCloseTo(0.2459759585648836, 3);
        expect(va.z).toBeCloseTo(-1.2378306507880583, 3);


    });

    describe('vec3_apply_mat4', () => {
        let vec, mat, res;

        beforeEach(() => {
            vec = new vec3f();
            mat = new mat4f();
            res = new vec3f();
        });

        it('should transform a vector correctly with an identity matrix', () => {
            vec.x = 1;
            vec.y = 2;
            vec.z = 3;
            mat = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ];
            const result = vec3_apply_mat4(vec, mat, res);
            expect(result.x).toBe(1);
            expect(result.y).toBe(2);
            expect(result.z).toBe(3);
        });

        it('should transform a vector correctly with a translation matrix', () => {
            vec.x = 1;
            vec.y = 2;
            vec.z = 3;
            mat = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                4, 5, 6, 1
            ];
            const result = vec3_apply_mat4(vec, mat, res);
            expect(result.x).toBe(5);
            expect(result.y).toBe(7);
            expect(result.z).toBe(9);
        });

        it('should transform a vector correctly with a scaling matrix', () => {
            vec.x = 1;
            vec.y = 2;
            vec.z = 3;
            mat = [
                2, 0, 0, 0,
                0, 3, 0, 0,
                0, 0, 4, 0,
                0, 0, 0, 1
            ];
            const result = vec3_apply_mat4(vec, mat, res);
            expect(result.x).toBe(2);
            expect(result.y).toBe(6);
            expect(result.z).toBe(12);
        });

        it('should handle division by w component', () => {
            vec.x = 1;
            vec.y = 1;
            vec.z = 1;
            mat = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                1, 1, 1, 2
            ];
            const result = vec3_apply_mat4(vec, mat, res);
            expect(result.x).toBeCloseTo(1);
            expect(result.y).toBeCloseTo(1);
            expect(result.z).toBeCloseTo(1);
        });

        it('should handle vectors with zero components', () => {
            vec.x = 0;
            vec.y = 0;
            vec.z = 0;
            mat = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                4, 5, 6, 1
            ];
            const result = vec3_apply_mat4(vec, mat, res);
            expect(result.x).toBe(4);
            expect(result.y).toBe(5);
            expect(result.z).toBe(6);
        });

        it('should handle large values without overflow', () => {
            vec.x = 1e6;
            vec.y = 2e6;
            vec.z = 3e6;
            mat = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                4, 5, 6, 1
            ];
            const result = vec3_apply_mat4(vec, mat, res);
            expect(result.x).toBe(1e6 + 4);
            expect(result.y).toBe(2e6 + 5);
            expect(result.z).toBe(3e6 + 6);
        });
    });

    describe("vec3_round_2_dec", () => {
        it("should round each component to the specified number of decimal places", () => {
            // Test case 1: Rounding positive numbers to 2 decimal places
            let v1 = [1.123456, 2.654321, 3.987654];
            vec3_round_2_dec(v1, 2);
            expect(v1).toEqual([1.12, 2.65, 3.99]);

            // Test case 2: Rounding negative numbers to 1 decimal place
            let v2 = [-3.14159, -2.71828, -1.61803];
            vec3_round_2_dec(v2, 1);
            expect(v2).toEqual([-3.1, -2.7, -1.6]);

            // Test case 3: Rounding numbers with more decimal places to 0 decimal places
            let v3 = [0.123456789, 0.987654321, 0.555555];
            vec3_round_2_dec(v3, 0);
            expect(v3).toEqual([0, 1, 1]);

            // Test case 4: Rounding zero values to 2 decimal places
            let v4 = [0, 0, 0];
            vec3_round_2_dec(v4, 2);
            expect(v4).toEqual([0, 0, 0]);
        });


    });

})