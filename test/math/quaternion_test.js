import { eulerf } from "../../lib/math/euler.js";
import { numb } from "../../lib/math/number.js";
import {
    QW, QX, QY, QZ, quat_add, quat_angle, quat_angle_between, quat_angle_to, quat_conj, quat_conjugated, quat_div, quat_dot, quat_equals, quat_from_axis_angle,
    quat_from_unit_vec,
    quat_fuzzy_equals, quat_is_fuzzy_identity, quat_is_fuzzy_null, quat_is_identity, quat_is_null,
    quat_length, quat_length_square, quat_mult, quat_neg, quat_normalize, quat_normalized, quat_rem,
    quat_set, quat_to_euler, quatd, quatf
} from "../../lib/math/quaternion.js";
import { vec3_normalize, vec3f } from "../../lib/math/vec3.js";


describe('quat constant test', () => {
    it(`QX_00`, () => { expect(QX).toBe(0); })
    it(`QY_00`, () => { expect(QY).toBe(1); })
    it(`QZ_00`, () => { expect(QZ).toBe(2); })
    it(`QW_00`, () => { expect(QW).toBe(3); })
});

describe('quatf', () => {
    let quat;

    // Before each test, create a new quatf instance
    beforeEach(() => {
        quat = new quatf();
    });

    // Constructor tests
    describe('constructor', () => {
        it('should create a default identity quaternion if no parameters are provided', () => {
            expect(quat).toEqual(new quatf(0, 0, 0, 1));
        });

        it('should create a quaternion with specified components', () => {
            const x = 1, y = 2, z = 3, w = 4;
            quat = new quatf(x, y, z, w);
            expect(quat).toEqual(new quatf(x, y, z, w));
        });

        it('should create a copy of another quaternion', () => {
            const original = new quatf(1, 2, 3, 4);
            quat = new quatf(original);
            expect(quat).toEqual(original);
        });

        it('should create a quaternion from an array of components', () => {
            const components = [1, 2, 3, 4];
            quat = new quatf(components);
            expect(quat).toEqual(new quatf(...components));
        });
    });

    // BYTES_LENGTH tests
    describe('BYTES_LENGTH', () => {
        it('should return the number of bytes used to represent a quaternion', () => {
            expect(quatf.BYTES_LENGTH).toEqual(Float32Array.BYTES_PER_ELEMENT * 4);
        });
    });

    it(`constructor_00`, () => {
        let x = numb.frand(-1, 1);
        let y = numb.frand(-1, 1);
        let z = numb.frand(-1, 1);
        let w = numb.frand(-1, 1);

        let q = new quatf(x, y, z, w);
        expect(q[0]).toBe(x);
        expect(q[1]).toBe(y);
        expect(q[2]).toBe(z);
        expect(q[3]).toBe(w);

        expect(q.x).toBe(x);
        expect(q.y).toBe(y);
        expect(q.z).toBe(z);
        expect(q.w).toBe(w);

        x = numb.frand(-1, 1);
        y = numb.frand(-1, 1);
        z = numb.frand(-1, 1);
        w = numb.frand(-1, 1);

        q.x = x;
        q.y = y;
        q.z = z;
        q.w = w;

        expect(q[0]).toBe(x);
        expect(q[1]).toBe(y);
        expect(q[2]).toBe(z);
        expect(q[3]).toBe(w);
    });
});

describe('quatd', () => {
    let quat;

    // Before each test, create a new quatd instance
    beforeEach(() => {
        quat = new quatd();
    });

    // Constructor tests
    describe('constructor', () => {
        it('should create a default identity quaternion if no parameters are provided', () => {
            expect(quat).toEqual(new quatd(0, 0, 0, 1));
        });

        it('should create a quaternion with specified components', () => {
            const x = 1, y = 2, z = 3, w = 4;
            quat = new quatd(x, y, z, w);
            expect(quat).toEqual(new quatd(x, y, z, w));
        });

        it('should create a copy of another quaternion', () => {
            const original = new quatd(1, 2, 3, 4);
            quat = new quatd(original);
            expect(quat).toEqual(original);
        });

        it('should create a quaternion from an array of components', () => {
            const components = [1, 2, 3, 4];
            quat = new quatd(components);
            expect(quat).toEqual(new quatd(...components));
        });

        it('should create a quaternion from an array with fewer than 4 components', () => {
            const components = [1, 2];
            quat = new quatd(components);
            expect(quat).toEqual(new quatd(1, 2, 0, 1));
        });
    });

    // BYTES_LENGTH tests
    describe('BYTES_LENGTH', () => {
        it('should return the number of bytes used to represent a quaternion', () => {
            expect(quatd.BYTES_LENGTH).toEqual(Float64Array.BYTES_PER_ELEMENT * 4);
        });
    });
});



describe('quat test', () => {



    describe('quat_set', () => {
        let q0;

        // Before each test, create a new quaternion instance
        beforeEach(() => {
            q0 = new quatf();
        });

        // Test setting quaternion components individually
        it('should set the quaternion components individually', () => {
            quat_set(q0, 1, 2, 3, 4);
            expect(q0[QX]).toBe(1);
            expect(q0[QY]).toBe(2);
            expect(q0[QZ]).toBe(3);
            expect(q0[QW]).toBe(4);
        });

        // Test setting quaternion components from an array
        it('should set the quaternion components from an array', () => {
            quat_set(q0, [1, 2, 3, 4]);
            expect(q0[QX]).toBe(1);
            expect(q0[QY]).toBe(2);
            expect(q0[QZ]).toBe(3);
            expect(q0[QW]).toBe(4);
        });

        // Test setting quaternion components with default values
        it('should set the quaternion components with default values', () => {
            quat_set(q0);
            expect(q0[QX]).toBe(0);
            expect(q0[QY]).toBe(0);
            expect(q0[QZ]).toBe(0);
            expect(q0[QW]).toBe(1);
        });

        // Test handling of NaN values
        it('should handle NaN values correctly', () => {
            quat_set(q0, NaN, NaN, NaN, NaN);
            expect(q0[QX]).toBeNaN();
            expect(q0[QY]).toBeNaN();
            expect(q0[QZ]).toBeNaN();
            expect(q0[QW]).toBeNaN();
        });

        // Test mixing array and individual components
        it('should handle array with fewer than 4 elements and default other components', () => {
            quat_set(q0, [1, 2]);
            expect(q0[QX]).toBe(1);
            expect(q0[QY]).toBe(2);
            expect(q0[QZ]).toBe(0);
            expect(q0[QW]).toBe(1);
        });
    });

    describe('quat_neg', () => {
        let q0;

        // Test negating quaternion components
        it('should negate the quaternion components', () => {
            q0 = new quatf([1, -2, 3, -4]);
            quat_neg(q0);
            expect(q0[QX]).toBe(-1);
            expect(q0[QY]).toBe(2);
            expect(q0[QZ]).toBe(-3);
            expect(q0[QW]).toBe(4);
        });

        // Test negating zero quaternion
        it('should handle zero quaternion correctly', () => {
            q0 = new quatf([0, 0, 0, 0]);
            quat_neg(q0);
            expect(q0[QX]).toBe(0);
            expect(q0[QY]).toBe(0);
            expect(q0[QZ]).toBe(0);
            expect(q0[QW]).toBe(0);
        });

        // Test negating already negated quaternion
        it('should negate an already negated quaternion correctly', () => {
            q0 = new quatf([-1, 2, -3, 4]);
            quat_neg(q0);
            expect(q0[QX]).toBe(1);
            expect(q0[QY]).toBe(-2);
            expect(q0[QZ]).toBe(3);
            expect(q0[QW]).toBe(-4);
        });

        // Test handling NaN values
        it('should handle NaN values correctly', () => {
            q0 = new quatf([NaN, NaN, NaN, NaN]);
            quat_neg(q0);
            expect(q0[QX]).toBeNaN();
            expect(q0[QY]).toBeNaN();
            expect(q0[QZ]).toBeNaN();
            expect(q0[QW]).toBeNaN();
        });
    });

    describe('quat_is_null', () => {
        // Test when the quaternion is null (all components are zero)
        it('should return true for a null quaternion', () => {
            const q0 = new quatf([0, 0, 0, 0]);
            expect(quat_is_null(q0)).toBe(true);
        });

        // Test when the quaternion is not null (at least one component is non-zero)
        it('should return false for a non-null quaternion', () => {
            const q0 = new quatf([0, 1, 0, 0]);
            expect(quat_is_null(q0)).toBe(false);
        });

        // Test when all components are non-zero
        it('should return false for a quaternion with all non-zero components', () => {
            const q0 = new quatf([1, 1, 1, 1]);
            expect(quat_is_null(q0)).toBe(false);
        });

        // Test with negative zero components
        it('should return true for a quaternion with all negative zero components', () => {
            const q0 = new quatf([-0, -0, -0, -0]);
            expect(quat_is_null(q0)).toBe(true);
        });

        // Test with NaN components
        it('should return false for a quaternion with NaN components', () => {
            const q0 = new quatf([NaN, NaN, NaN, NaN]);
            expect(quat_is_null(q0)).toBe(false);
        });

        // Test with mixed zero and non-zero components
        it('should return false for a quaternion with mixed zero and non-zero components', () => {
            const q0 = new quatf([0, 0, 1, 0]);
            expect(quat_is_null(q0)).toBe(false);
        });

        it(`quat_is_null_00`, () => {
            let a = new quatf(0, 0, 0, 0);
            expect(quat_is_null(a)).toBeTrue();

            let b = new quatf(numb.frand(-100, 100), numb.frand(-100, 100), numb.frand(-100, 100), numb.frand(-100, 100));
            expect(quat_is_null(b)).toBeFalse();
        });
    });

    describe('quat_is_fuzzy_null', () => {
        // Mock the numb.fuzzy_null function
        const fuzzyNullMock = jasmine.createSpy('fuzzy_null').and.callFake(value => Math.abs(value) < 1e-6);

        beforeAll(() => {
            // Replace numb.fuzzy_null with the mock
            numb.fuzzy_null = fuzzyNullMock;
        });

        // Test when the quaternion is exactly zero
        it('should return true for an exactly zero quaternion', () => {
            const q0 = new quatf([0, 0, 0, 0]);
            expect(quat_is_fuzzy_null(q0)).toBe(true);
        });

        // Test when the quaternion is close to zero within the tolerance
        it('should return true for a quaternion close to zero within tolerance', () => {
            const q0 = new quatf([1e-7, -1e-7, 1e-7, -1e-7]);
            expect(quat_is_fuzzy_null(q0)).toBe(true);
        });

        // Test when one component is outside the tolerance
        it('should return false for a quaternion with one component outside tolerance', () => {
            const q0 = new quatf([0, 0, 0, 1e-5]);
            expect(quat_is_fuzzy_null(q0)).toBe(false);
        });

        // Test when all components are outside the tolerance
        it('should return false for a quaternion with all components outside tolerance', () => {
            const q0 = new quatf([1, 1, 1, 1]);
            expect(quat_is_fuzzy_null(q0)).toBe(false);
        });

        // Test with mixed components, some within and some outside the tolerance
        it('should return false for a quaternion with mixed components', () => {
            const q0 = new quatf([0, 0, 0, 1e-5]);
            expect(quat_is_fuzzy_null(q0)).toBe(false);
        });

        // Test with negative components within the tolerance
        it('should return true for a quaternion with negative components within tolerance', () => {
            const q0 = new quatf([-1e-7, -1e-7, -1e-7, -1e-7]);
            expect(quat_is_fuzzy_null(q0)).toBe(true);
        });

        // Test with positive and negative components within the tolerance
        it('should return true for a quaternion with mixed positive and negative components within tolerance', () => {
            const q0 = new quatf([1e-7, -1e-7, 1e-7, -1e-7]);
            expect(quat_is_fuzzy_null(q0)).toBe(true);
        });

        it(`quat_is_fuzzy_null_00`, () => {
            let a = new quatf(0, 0, 0, 0);
            expect(quat_is_fuzzy_null(a)).toBeTrue();

            let b = new quatf(Number.EPSILON, Number.EPSILON, Number.EPSILON, Number.EPSILON);
            expect(quat_is_fuzzy_null(a)).toBeTrue();

            let c = new quatf(numb.frand(-100, 100), numb.frand(-100, 100), numb.frand(-100, 100), numb.frand(-100, 100));
            expect(quat_is_fuzzy_null(c)).toBeFalse();
        });
    });


    describe("quat_equals", () => {

        it("should return true for identical quaternions", () => {
            const q1 = [1, 0, 0, 0];
            const q2 = [1, 0, 0, 0];
            expect(quat_equals(q1, q2)).toBe(true);
        });

        it("should return false for different quaternions", () => {
            const q1 = [1, 0, 0, 0];
            const q2 = [0, 1, 0, 0];
            expect(quat_equals(q1, q2)).toBe(false);
        });

        it("should return false if either quaternion contains NaN", () => {
            const q1 = [NaN, 0, 0, 0];
            const q2 = [1, 0, 0, 0];
            expect(quat_equals(q1, q2)).toBe(false);

            const q3 = [1, 0, 0, 0];
            const q4 = [NaN, 0, 0, 0];
            expect(quat_equals(q3, q4)).toBe(false);

            const q5 = [NaN, NaN, NaN, NaN];
            const q6 = [NaN, NaN, NaN, NaN];
            expect(quat_equals(q5, q6)).toBe(false);
        });

        it("should return true for quaternions with zero values", () => {
            const q1 = [0, 0, 0, 0];
            const q2 = [0, 0, 0, 0];
            expect(quat_equals(q1, q2)).toBe(true);
        });

        it("should return false for quaternions with slight differences", () => {
            const q1 = [1, 0, 0, 0];
            const q2 = [1, 0, 0, 0.000001];
            expect(quat_equals(q1, q2)).toBe(false);
        });

        it("should handle large values correctly", () => {
            const q1 = [1e6, 1e6, 1e6, 1e6];
            const q2 = [1e6, 1e6, 1e6, 1e6];
            expect(quat_equals(q1, q2)).toBe(true);

            const q3 = [1e6, 1e6, 1e6, 1e6];
            const q4 = [1e6, 1e6, 1e6, 1e6 + 1];
            expect(quat_equals(q3, q4)).toBe(false);
        });

        it("should handle negative values correctly", () => {
            const q1 = [-1, -1, -1, -1];
            const q2 = [-1, -1, -1, -1];
            expect(quat_equals(q1, q2)).toBe(true);

            const q3 = [-1, -1, -1, -1];
            const q4 = [-1, -1, -1, -2];
            expect(quat_equals(q3, q4)).toBe(false);
        });

        it("should handle mixed positive and negative values correctly", () => {
            const q1 = [1, -1, 1, -1];
            const q2 = [1, -1, 1, -1];
            expect(quat_equals(q1, q2)).toBe(true);

            const q3 = [1, -1, 1, -1];
            const q4 = [1, -1, 1, 1];
            expect(quat_equals(q3, q4)).toBe(false);
        });

        it(`quat_equals_00`, () => {
            let x = numb.frand(-1, 1);
            let y = numb.frand(-1, 1);
            let z = numb.frand(-1, 1);
            let w = numb.frand(-1, 1);

            let qa = new quatf(x, y, z, w), qb = new quatf(x, y, z, w);
            expect(quat_equals(qa, qb)).toBeTrue();

            qa[2] += 0.00001;
            expect(quat_equals(qa, qb)).toBeFalse();
        });
    });


    describe("quat_fuzzy_equals function", () => {
        // Define tolerance for fuzzy comparison
        const tolerance = 0.000001;

        it("should return true when two quaternions are approximately equal", () => {
            // Quaternions with components differing by tolerance
            const q1 = [1, 2, 3, 4];
            const q2 = [1 + tolerance / 2, 2 + tolerance / 2, 3 + tolerance / 2, 4 + tolerance / 2];

            expect(quat_fuzzy_equals(q1, q2)).toBe(true);
        });

        it("should return true when two quaternions are exactly equal", () => {
            // Quaternions with identical components
            const q1 = [1, 2, 3, 4];
            const q2 = [1, 2, 3, 4];

            expect(quat_fuzzy_equals(q1, q2)).toBe(true);
        });

        it("should return false when two quaternions are not approximately equal", () => {
            // Quaternions with components differing by more than tolerance
            const q1 = [1, 2, 3, 4];
            const q2 = [1 + tolerance * 2, 2 + tolerance * 2, 3 + tolerance * 2, 4 + tolerance * 2];

            expect(quat_fuzzy_equals(q1, q2)).toBe(false);
        });

        it("should return false when two quaternions have NaN components", () => {
            // Quaternions with NaN components
            const q1 = [NaN, 2, 3, 4];
            const q2 = [NaN, 2, 3, 4];

            expect(quat_fuzzy_equals(q1, q2)).toBe(false);
        });

        it("should return false when one quaternion has NaN components and the other doesn't", () => {
            // One quaternion with NaN components, the other without NaN components
            const q1 = [NaN, 2, 3, 4];
            const q2 = [1, 2, 3, 4];

            expect(quat_fuzzy_equals(q1, q2)).toBe(false);
        });

        it(`quat_fuzzy_equals_00`, () => {
            let x = numb.frand(-1, 1);
            let y = numb.frand(-1, 1);
            let z = numb.frand(-1, 1);
            let w = numb.frand(-1, 1);

            let qa = new quatf(x, y, z, w), qb = new quatf(x, y, z, w);
            expect(quat_fuzzy_equals(qa, qb)).toBeTrue();

            qa[3] += 0.001;
            expect(quat_fuzzy_equals(qa, qb)).toBeFalse();
        });
    });

    describe("quat_is_identity", () => {
        it("should return true for the identity quaternion", () => {
            const q = [0, 0, 0, 1];
            expect(quat_is_identity(q)).toBeTrue();
        });

        it("should return false for a non-identity quaternion", () => {
            const q = new quatf(1, 2, 3, 4); // Non-identity quaternion
            expect(quat_is_identity(q)).toBeFalse();
        });

        it("should return false for a close approximation of the identity quaternion", () => {
            const q = new quatf(1e-16, 1e-16, 1e-16, 1 - 1e-16); // Close approximation of the identity quaternion
            expect(quat_is_identity(q)).toBeFalse();
        });

        it("should return false for a close approximation of a non-identity quaternion", () => {
            const q = new quatf(1e-16, 1e-16, 1e-16, 1); // Close approximation of a non-identity quaternion
            expect(quat_is_identity(q)).toBeFalse();
        });

        it("should return false for NaN components", () => {
            const q = new quatf(NaN, 0, 0, 0); // NaN components
            expect(quat_is_identity(q)).toBeFalse();
        });

        it("should return false for a zero quaternion", () => {
            const q = new quatf(0, 0, 0, 0); // Zero quaternion
            expect(quat_is_identity(q)).toBeFalse();
        });

        it("should return false for non-zero non-identity quaternions", () => {
            const q = new quatf(1, 2, 3, 0); // Non-zero non-identity quaternion
            expect(quat_is_identity(q)).toBeFalse();
        });

        it(`quat_is_identity_00`, () => {
            let a = new quatf();
            expect(quat_is_identity(a)).toBeTrue();

            let b = new quatf(numb.frand(-100, 100), numb.frand(-100, 100), numb.frand(-100, 100), numb.frand(-100, 100));
            expect(quat_is_identity(b)).toBeFalse();
        });
    });

    describe("quat_is_fuzzy_identity", () => {
        // Define the identity quaternion
        const identityQuat = new quatf();

        // Define a function to create a quaternion with small deviations from the identity
        const createDeviantQuat = (deviation) => new quatf(deviation, deviation, deviation, 1 + deviation);

        it("should return true for the identity quaternion", () => {
            expect(quat_is_fuzzy_identity(identityQuat)).toBeTrue();
        });

        it("should return true for quaternions with small deviations from the identity", () => {
            // Test with various small deviations
            const deviations = [1e-6, 1e-10, 1e-15];
            deviations.forEach(deviation => {
                const deviantQuat = createDeviantQuat(deviation);
                expect(quat_is_fuzzy_identity(deviantQuat)).toBeTrue();
            });
        });

        it("should return false for quaternions with significant deviations from the identity", () => {
            // Test with deviations greater than 1
            const deviations = [1.1, 2, 10];
            deviations.forEach(deviation => {
                const deviantQuat = createDeviantQuat(deviation);
                expect(quat_is_fuzzy_identity(deviantQuat)).toBeFalse();
            });
        });

        it("should return false for quaternions with NaN components", () => {
            const nanQuat = new quatf(NaN, NaN, NaN, NaN);
            expect(quat_is_fuzzy_identity(nanQuat)).toBeFalse();
        });

        it(`quat_is_fuzzy_identity_00`, () => {
            let a = new quatf();
            expect(quat_is_fuzzy_identity(a)).toBeTrue();

            let b = new quatf(Number.EPSILON, Number.EPSILON, Number.EPSILON, 1 + Number.EPSILON);
            expect(quat_is_fuzzy_identity(a)).toBeTrue();

            let c = new quatf(numb.frand(-100, 100), numb.frand(-100, 100), numb.frand(-100, 100), numb.frand(-100, 100));
            expect(quat_is_fuzzy_identity(c)).toBeFalse();
        });
    });

    describe("quat_from_axis_angle function", () => {
        // Define some axis vectors for testing
        const QUAT_IDENTITY = [0, 0, 0, 1];
        const xAxis = new vec3f(1, 0, 0);
        const yAxis = new vec3f(0, 1, 0);
        const zAxis = new vec3f(0, 0, 1);

        // Test cases
        it("should return the identity quaternion when angle is 0", () => {
            const result = quat_from_axis_angle(xAxis, 0);
            expect(quat_fuzzy_equals(result, QUAT_IDENTITY)).toBe(true);
        });

        it("should return a quaternion representing a 90-degree rotation around the X-axis", () => {
            const result = quat_from_axis_angle(xAxis, Math.PI / 2);
            const expected = new quatf(0.7071067811865476, 0, 0, 0.7071067811865476);
            expect(quat_fuzzy_equals(result, expected)).toBe(true);
        });

        it("should return a quaternion representing a 90-degree rotation around the Y-axis", () => {
            const result = quat_from_axis_angle(yAxis, Math.PI / 2);
            const expected = new quatf(0, 0.7071067811865476, 0, 0.7071067811865476);
            expect(quat_fuzzy_equals(result, expected)).toBe(true);
        });

        it("should return a quaternion representing a 90-degree rotation around the Z-axis", () => {
            const result = quat_from_axis_angle(zAxis, Math.PI / 2);
            const expected = new quatf(0, 0, 0.7071067811865476, 0.7071067811865476);
            expect(quat_fuzzy_equals(result, expected)).toBe(true);
        });

        xit("should return a quaternion representing a 180-degree rotation around an arbitrary axis", () => {
            const axis = vec3_normalize(new vec3f(1, 1, 0));
            const result = quat_from_axis_angle(axis, Math.PI);
            console.log(result);
            const expected = new quatf(0.5, 0.5, 0, 0.7071067811865476);
            expect(quat_fuzzy_equals(result, expected)).toBe(true);
        });

    });

    describe("quat_conj", () => {
        it("should compute the conjugate of a quaternion correctly", () => {
            // Test case 1: Regular quaternion
            let q1 = new quatf(1, 2, 3, 4);
            let result = quat_conj(q1);
            expect(result).toEqual(new quatf(-1, -2, -3, 4));

            // Test case 2: Identity quaternion
            q1 = new quatf();
            result = quat_conj(q1);
            expect(result).toEqual(new quatf(0, 0, 0, 1));

            // Test case 3: Quaternion with zero components
            q1 = new quatf(0, 0, 0, 0);
            result = quat_conj(q1);
            expect(result).toEqual(new quatf(0, 0, 0, 0));

            // Test case 4: Quaternion with negative components
            q1 = new quatf(-1, -2, -3, -4);
            result = quat_conj(q1);
            expect(result).toEqual(new quatf(1, 2, 3, -4));

            // Test case 5: Quaternion with positive and negative components
            q1 = new quatf(1, -2, 3, -4);
            result = quat_conj(q1);
            expect(result).toEqual(new quatf(-1, 2, -3, -4));
        });
    });

    describe('quat_conjugated', () => {
        // Test case 1: Input quaternion with non-zero components
        it('returns the conjugate of the input quaternion with non-zero components', () => {
            const q1 = new quatf(1, 2, 3, 4);
            const result = quat_conjugated(q1);
            expect(result).toEqual(new quatf(-1, -2, -3, 4));
        });

        // Test case 2: Input quaternion with zero components
        it('returns the conjugate of the input quaternion with zero components', () => {
            const q1 = new quatf(0, 0, 0, 0);
            const result = quat_conjugated(q1);
            expect(result).toEqual(new quatf(0, 0, 0, 0));
        });

        // Test case 3: Input quaternion with negative components
        it('returns the conjugate of the input quaternion with negative components', () => {
            const q1 = new quatf(-1, -2, -3, -4);
            const result = quat_conjugated(q1);
            expect(result).toEqual(new quatf(1, 2, 3, -4));
        });

        // Test case 4: Input quaternion with NaN components
        it('returns the conjugate of the input quaternion with NaN components', () => {
            const q1 = new quatf(NaN, NaN, NaN, NaN);
            const result = quat_conjugated(q1);
            expect(result).toEqual(new quatf(0, 0, 0, NaN));
        });

        // Test case 5: Input quaternion with undefined components
        it('returns the conjugate of the input quaternion with undefined components', () => {
            const q1 = new quatf(undefined, undefined, undefined, undefined);
            const result = quat_conjugated(q1);
            expect(result).toEqual(new quatf(0, 0, 0, 1));
        });
    });

    describe("quat_length_square function", () => {
        // Test with zero quaternion
        it("should return 0 for zero quaternion", () => {
            const q = [0, 0, 0, 0];
            expect(quat_length_square(q)).toEqual(0);
        });

        // Test with unit quaternion
        it("should return 1 for unit quaternion", () => {
            const q = [0, 0, 0, 1];
            expect(quat_length_square(q)).toEqual(1);
        });

        // Test with arbitrary quaternion
        it("should return correct value for arbitrary quaternion", () => {
            const q = [1, 2, 3, 4];
            const expectedLengthSquare = 1 ** 2 + 2 ** 2 + 3 ** 2 + 4 ** 2;
            expect(quat_length_square(q)).toEqual(expectedLengthSquare);
        });

        // Test with negative values
        it("should return correct value for quaternion with negative components", () => {
            const q = [-1, -2, -3, -4];
            const expectedLengthSquare = (-1) ** 2 + (-2) ** 2 + (-3) ** 2 + (-4) ** 2;
            expect(quat_length_square(q)).toEqual(expectedLengthSquare);
        });

        // Test with large values
        it("should handle large values", () => {
            const q = [Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE];
            const expectedLengthSquare = Number.MAX_VALUE ** 2 * 4;
            expect(quat_length_square(q)).toEqual(expectedLengthSquare);
        });

        // Test with small values
        it("should handle small values", () => {
            const q = [Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE];
            const expectedLengthSquare = Number.MIN_VALUE ** 2 * 4;
            expect(quat_length_square(q)).toEqual(expectedLengthSquare);
        });
    });

    describe("quat_length", () => {
        // Test cases for different scenarios

        // Test case: Zero quaternion
        it("should return 0 for zero quaternion", () => {
            const q = [0, 0, 0, 0];
            expect(quat_length(q)).toBe(0);
        });

        // Test case: Non-zero quaternion
        it("should return the correct length for non-zero quaternion", () => {
            const q = [1, 2, 3, 4];
            const expected = Math.sqrt(30);
            expect(quat_length(q)).toBeCloseTo(expected);
        });

        // Test case: Negative quaternion components
        it("should handle negative quaternion components", () => {
            const q = [-1, -2, -3, -4];
            const expected = Math.sqrt(30);
            expect(quat_length(q)).toBeCloseTo(expected);
        });

        // Test case: Random quaternion
        it("should return the correct length for random quaternion", () => {
            const q = [0.5, 1.5, -2.5, 3.5];
            expect(quat_length(q)).toBeCloseTo(4.58257, 4);
        });

        // Test case: Large values
        it("should handle large values", () => {
            const q = [1e6, 2e6, 3e6, 4e6];
            const expected = Math.sqrt(30e12);
            expect(quat_length(q)).toBeCloseTo(expected);
        });

        // Test case: Small values
        it("should handle small values", () => {
            const q = [1e-6, 2e-6, 3e-6, 4e-6];
            const expected = Math.sqrt(30e-12);
            expect(quat_length(q)).toBeCloseTo(expected);
        });

        // Test case: Infinity
        it("should return Infinity for quaternion with Infinity components", () => {
            const q = [Infinity, Infinity, Infinity, Infinity];
            expect(quat_length(q)).toBe(Infinity);
        });

        // Test case: NaN
        it("should return NaN for quaternion with NaN components", () => {
            const q = [NaN, NaN, NaN, NaN];
            expect(quat_length(q)).toBeNaN();
        });
    });

    describe("quat_normalize function", () => {
        // Test case for normalizing a non-zero quaternion
        it("should normalize a non-zero quaternion correctly", () => {
            const q = [1, 1, 1, 1]; // Non-zero quaternion
            const normalizedQ = quat_normalize(q);
            const expectedNormalizedQ = [0.5, 0.5, 0.5, 0.5]; // Expected normalized quaternion

            // Check if the normalized quaternion matches the expected result
            expect(normalizedQ).toEqual(expectedNormalizedQ);
        });

        // Test case for normalizing a zero quaternion
        it("should return the input quaternion when normalizing a zero quaternion", () => {
            const q = [0, 0, 0, 0]; // Zero quaternion
            const normalizedQ = quat_normalize(q);

            // Check if the normalized quaternion is the same as the input quaternion
            expect(normalizedQ).toEqual(q);
        });

        // Test case for normalizing a quaternion with negative components
        it("should normalize a quaternion with negative components correctly", () => {
            const q = [-1, -1, -1, -1]; // Quaternion with negative components
            const normalizedQ = quat_normalize(q);
            const expectedNormalizedQ = [-0.5, -0.5, -0.5, -0.5]; // Expected normalized quaternion

            // Check if the normalized quaternion matches the expected result
            expect(normalizedQ).toEqual(expectedNormalizedQ);
        });

        // Test case for normalizing a quaternion with very small values
        it("should handle very small values correctly", () => {
            const q = [1e-10, 1e-10, 1e-10, 1e-10]; // Quaternion with very small values
            const normalizedQ = quat_normalize(q);

            // Check if the normalized quaternion is the same as the input quaternion
            expect(normalizedQ).toEqual(q);
        });

        // Test case for normalizing a quaternion with very large values
        it("should handle very large values correctly", () => {
            const q = [1e10, 1e10, 1e10, 1e10]; // Quaternion with very large values
            const normalizedQ = quat_normalize(q);
            const expectedNormalizedQ = [0.5, 0.5, 0.5, 0.5]; // Expected normalized quaternion

            // Check if the normalized quaternion matches the expected result
            expect(normalizedQ).toEqual(expectedNormalizedQ);
        });
    });

    describe('quat_normalized', () => {
        // Helper function to check if two quaternions are approximately equal
        const quatsApproxEqual = (q1, q2) => {
            const EPSILON = 1e-6;
            for (let i = 0; i < 4; i++) {
                if (Math.abs(q1[i] - q2[i]) > EPSILON) {
                    return false;
                }
            }
            return true;
        };

        // Helper function to create a quaternion with random values
        const randomQuat = () => {
            const q = [];
            for (let i = 0; i < 4; i++) {
                q[i] = Math.random() * 2 - 1; // Random value between -1 and 1
            }
            return q;
        };

        // Helper function to compute the length of a quaternion
        const quatLength = (q) => {
            let lenSquare = 0;
            for (let i = 0; i < 4; i++) {
                lenSquare += q[i] * q[i];
            }
            return Math.sqrt(lenSquare);
        };

        it('returns the input quaternion if its length is already approximately 1', () => {
            const q = [0.5, 0.5, 0.5, 0.5]; // Length is already approximately 1
            const result = quat_normalized(q);
            expect(quatsApproxEqual(result, q)).toBeTrue();
        });

        it('returns the zero quaternion if the input quaternion is [0, 0, 0, 0]', () => {
            const q = [0, 0, 0, 0]; // Zero quaternion
            const result = quat_normalized(q);
            expect(quatsApproxEqual(result, [0, 0, 0, 0])).toBeTrue();
        });

        it('correctly normalizes a random quaternion', () => {
            const q = randomQuat(); // Random quaternion
            const result = quat_normalized(q);
            const expectedLen = quatLength(result);
            expect(expectedLen).toBeCloseTo(1, 6); // Approximately 1
        });

        it('does not modify the input quaternion', () => {
            const q = randomQuat(); // Random quaternion
            const qCopy = [...q];
            const result = quat_normalized(q);
            expect(quatsApproxEqual(q, qCopy)).toBeTrue(); // Input quaternion should not be modified
        });

        it('correctly stores the result in the provided result quaternion', () => {
            const q = randomQuat(); // Random quaternion
            const result = [0, 0, 0, 0]; // Result quaternion
            quat_normalized(q, result);
            const expectedLen = quatLength(result);
            expect(expectedLen).toBeCloseTo(1, 6); // Approximately 1
        });

        it('returns a new quaternion if no result quaternion is provided', () => {
            const q = randomQuat(); // Random quaternion
            const result = quat_normalized(q);
            expect(result).not.toBe(q); // Should return a new quaternion
        });
    });

    describe("quat_add function", () => {
        // Test case 1: Adding two zero quaternions should result in a zero quaternion
        it("should add two zero quaternions to get zero", () => {
            const q1 = new quatf();
            const q2 = new quatf();
            const result = quat_add(q1, q2);
            expect(result).toEqual(new quatf(0, 0, 0, 2));
        });

        // Test case 2: Adding a non-zero quaternion with a zero quaternion should result in the non-zero quaternion
        it("should add a non-zero quaternion with a zero quaternion to get the non-zero quaternion", () => {
            const q1 = new quatf(1, 2, 3, 4);
            const q2 = new quatf();
            const result = quat_add(q1, q2);
            expect(result).toEqual(new quatf(1, 2, 3, 5));
        });

        // Test case 3: Adding two non-zero quaternions with positive components
        it("should add two non-zero quaternions with positive components", () => {
            const q1 = new quatf(1, 2, 3, 4);
            const q2 = new quatf(5, 6, 7, 8);
            const result = quat_add(q1, q2);
            expect(result).toEqual(new quatf(6, 8, 10, 12));
        });

        // Test case 4: Adding two non-zero quaternions with negative components
        it("should add two non-zero quaternions with negative components", () => {
            const q1 = new quatf(-1, -2, -3, -4);
            const q2 = new quatf(-5, -6, -7, -8);
            const result = quat_add(q1, q2);
            expect(result).toEqual(new quatf(-6, -8, -10, -12));
        });

        // Test case 5: Adding two non-zero quaternions with mixed positive and negative components
        it("should add two non-zero quaternions with mixed positive and negative components", () => {
            const q1 = new quatf(1, -2, 3, -4);
            const q2 = new quatf(-5, 6, -7, 8);
            const result = quat_add(q1, q2);
            expect(result).toEqual(new quatf(-4, 4, -4, 4));
        });

        // Test case 6: Adding two large quaternions
        it("should add two large quaternions", () => {
            const q1 = new quatf(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
            const q2 = new quatf(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
            const result = quat_add(q1, q2);
            expect(result).toEqual(new quatf(2 * Number.MAX_VALUE, 2 * Number.MAX_VALUE, 2 * Number.MAX_VALUE, 2 * Number.MAX_VALUE));
        });

        // Test case 7: Adding two small quaternions
        it("should add two small quaternions", () => {
            const q1 = new quatf(Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE);
            const q2 = new quatf(Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE);
            const result = quat_add(q1, q2);
            expect(result).toEqual(new quatf(2 * Number.MIN_VALUE, 2 * Number.MIN_VALUE, 2 * Number.MIN_VALUE, 2 * Number.MIN_VALUE));
        });
    });

    describe("quat_rem function", () => {
        // Define test quaternions
        const q1 = new quatf(1, 2, 3, 4);
        const q2 = new quatf(0.5, 1, 1.5, 2);

        // Test cases for subtracting two quaternions
        it("should correctly compute the remainder of two quaternions", () => {
            const result = quat_rem(q1, q2);
            expect(result).toEqual(jasmine.any(quatf));
            expect(result).not.toBe(q1); // Ensure original quaternion is not modified
            expect(result).not.toBe(q2); // Ensure original quaternion is not modified
            expect(result).toEqual(new quatf(0.5, 1, 1.5, 2));
        });

        it("should return a new quaternion if no result is provided", () => {
            const result = quat_rem(q1, q2);
            expect(result).toEqual(jasmine.any(quatf));
            expect(result).not.toBe(q1); // Ensure original quaternion is not modified
            expect(result).not.toBe(q2); // Ensure original quaternion is not modified
        });

        it("should modify the provided result quaternion if provided", () => {
            const result = new quatf();
            quat_rem(q1, q2, result);
            expect(result).toEqual(jasmine.any(quatf));
            expect(result).toEqual(new quatf(0.5, 1, 1.5, 2));
        });

        // Test edge cases
        it("should handle edge case where both quaternions are identity", () => {
            const identity = new quatf();
            const result = quat_rem(identity, identity);
            expect(result).toEqual(new quatf(0, 0, 0, 0));
        });

        it("should handle edge case where one quaternion is identity", () => {
            const identity = new quatf();
            const result = quat_rem(q1, identity);
            expect(result).toEqual(new quatf(1, 2, 3, 3));
        });

        it("should handle edge case where both quaternions have zero components", () => {
            const zeroQuat = new quatf(0, 0, 0, 0);
            const result = quat_rem(zeroQuat, zeroQuat);
            expect(result).toEqual(new quatf(0, 0, 0, 0));
        });
    });

    describe("quat_mult", () => {
        let quat1, quat2, result;

        beforeEach(() => {
            // Initialize quaternions for testing
            quat1 = new quatf(1, 2, 3, 4);
            quat2 = new quatf(5, 6, 7, 8);
            result = new quatf();
        });

        it("should multiply two quaternions correctly", () => {
            // Compute the result of quaternion multiplication
            result = quat_mult(quat1, quat2, result);

            // Check each component of the result quaternion
            expect(result[QX]).toBeCloseTo(32);
            expect(result[QY]).toBeCloseTo(32);
            expect(result[QZ]).toBeCloseTo(56);
            expect(result[QW]).toBeCloseTo(-6);
        });

        it("should handle multiplication with identity quaternion correctly", () => {
            // Initialize identity quaternion
            const identityQuat = new quatf();

            // Compute the result of multiplying with identity quaternion
            result = quat_mult(quat1, identityQuat, result);

            // The result should be equal to the original quaternion
            expect(result).toEqual(quat1);
        });

        it("should handle multiplication by zero quaternion correctly", () => {
            // Initialize zero quaternion
            const zeroQuat = new quatf(0, 0, 0, 0);

            // Compute the result of multiplying by zero quaternion
            result = quat_mult(quat1, zeroQuat, result);

            // The result should be equal to the zero quaternion
            expect(result).toEqual(zeroQuat);
        });

        it("should handle multiplication of two zero quaternions correctly", () => {
            // Initialize zero quaternions
            const zeroQuat1 = new quatf(0, 0, 0, 0);
            const zeroQuat2 = new quatf(0, 0, 0, 0);

            // Compute the result of multiplying two zero quaternions
            result = quat_mult(zeroQuat1, zeroQuat2, result);

            // The result should be equal to the zero quaternion
            expect(result).toEqual(zeroQuat1);
        });

        it(`quat_mult_00`, () => {
            let va;
            va = quat_mult(new quatf(0.604864, -0.340698, -0.361211, 0.622568), new quatf(-0.538232, -0.043305, 0.430053, -0.723523));
            expect(va.x).toBeCloseTo(-0.610559, 3); expect(va.y).toBeCloseTo(0.285251, 3); expect(va.z).toBeCloseTo(0.738650, 3); expect(va.w).toBeCloseTo(0.015701, 3);
            va = quat_mult(new quatf(-0.801341, -0.109325, -0.163461, 0.564961), new quatf(-0.180312, 0.543740, -0.036650, 0.818836));
            expect(va.x).toBeCloseTo(-0.850923, 3); expect(va.y).toBeCloseTo(0.217567, 3); expect(va.z).toBeCloseTo(0.300881, 3); expect(va.w).toBeCloseTo(0.371572, 3);
            va = quat_mult(new quatf(0.576333, 0.245059, 0.660205, -0.414627), new quatf(0.165682, 0.886579, -0.158194, -0.401874));
            expect(va.x).toBeCloseTo(0.323781, 3); expect(va.y).toBeCloseTo(-0.666638, 3); expect(va.z).toBeCloseTo(-0.670091, 3); expect(va.w).toBeCloseTo(-0.041684, 3);
            va = quat_mult(new quatf(-0.656690, -0.010406, -0.613507, 0.438474), new quatf(0.565699, 0.443779, 0.008858, 0.694958));
            expect(va.x).toBeCloseTo(-0.480497, 3); expect(va.y).toBeCloseTo(0.528596, 3); expect(va.z).toBeCloseTo(-0.136939, 3); expect(va.w).toBeCloseTo(0.686263, 3);
            va = quat_mult(new quatf(-0.797306, -0.490244, 0.105355, -0.335953), new quatf(-0.129584, -0.778481, 0.509528, 0.342866));
            expect(va.x).toBeCloseTo(-0.062059, 3); expect(va.y).toBeCloseTo(-0.299152, 3); expect(va.z).toBeCloseTo(-0.692215, 3); expect(va.w).toBeCloseTo(-0.653831, 3);
            va = quat_mult(new quatf(-0.488292, 0.450307, 0.091214, -0.741940), new quatf(0.138693, -0.604884, -0.778558, -0.093419));
            expect(va.x).toBeCloseTo(0.238131, 3); expect(va.y).toBeCloseTo(0.774233, 3); expect(va.z).toBeCloseTo(0.336217, 3); expect(va.w).toBeCloseTo(0.480432, 3);
            va = quat_mult(new quatf(0.605957, -0.213122, -0.629102, 0.437752), new quatf(-0.336584, -0.415575, -0.810948, 0.237427));
            expect(va.x).toBeCloseTo(0.085139, 3); expect(va.y).toBeCloseTo(-0.935665, 3); expect(va.z).toBeCloseTo(-0.180806, 3); expect(va.w).toBeCloseTo(-0.290847, 3);
            va = quat_mult(new quatf(-0.101197, 0.017931, 0.954189, -0.281001), new quatf(0.702455, 0.124321, -0.377392, 0.590488));
            expect(va.x).toBeCloseTo(-0.131754, 3); expect(va.y).toBeCloseTo(-0.656430, 3); expect(va.z).toBeCloseTo(0.694661, 3); expect(va.w).toBeCloseTo(0.263033, 3);
            va = quat_mult(new quatf(-0.323532, -0.192661, 0.542320, -0.751065), new quatf(-0.157335, -0.740333, -0.653566, 0.002164));
            expect(va.x).toBeCloseTo(-0.409945, 3); expect(va.y).toBeCloseTo(0.852396, 3); expect(va.z).toBeCloseTo(0.282835, 3); expect(va.w).toBeCloseTo(0.159281, 3);
            va = quat_mult(new quatf(-0.528203, -0.313937, -0.771268, 0.166103), new quatf(0.690812, 0.229946, -0.591058, 0.347208));
            expect(va.x).toBeCloseTo(-0.431555, 3); expect(va.y).toBeCloseTo(0.774194, 3); expect(va.z).toBeCloseTo(-0.461380, 3); expect(va.w).toBeCloseTo(0.038886, 3);
            va = quat_mult(new quatf(0.725126, 0.489906, 0.483605, 0.017624), new quatf(0.345406, 0.679465, 0.358211, -0.539172));
            expect(va.x).toBeCloseTo(-0.231778, 3); expect(va.y).toBeCloseTo(-0.159461, 3); expect(va.z).toBeCloseTo(-0.577914, 3); expect(va.w).toBeCloseTo(-0.766072, 3);
            va = quat_mult(new quatf(0.156138, 0.147921, 0.331344, 0.918668), new quatf(0.296566, 0.845570, 0.114683, 0.428845));
            expect(va.x).toBeCloseTo(0.602615, 3); expect(va.y).toBeCloseTo(0.759874, 3); expect(va.z).toBeCloseTo(0.159294, 3); expect(va.w).toBeCloseTo(0.184584, 3);
            va = quat_mult(new quatf(-0.168878, 0.639645, -0.014184, -0.749755), new quatf(-0.890666, -0.270119, 0.363036, 0.044209));
            expect(va.x).toBeCloseTo(0.431933, 3); expect(va.y).toBeCloseTo(0.156860, 3); expect(va.z).toBeCloseTo(-0.888143, 3); expect(va.w).toBeCloseTo(-0.005630, 3);
            va = quat_mult(new quatf(0.072016, -0.015121, -0.938713, -0.336755), new quatf(-0.559346, 0.273994, 0.293407, -0.725239));
            expect(va.x).toBeCloseTo(-0.116630, 3); expect(va.y).toBeCloseTo(-0.585237, 3); expect(va.z).toBeCloseTo(0.570711, 3); expect(va.w).toBeCloseTo(0.564077, 3);
            va = quat_mult(new quatf(-0.229157, 0.085256, 0.951306, 0.187712), new quatf(-0.229283, -0.443249, 0.866574, 0.003024));
            expect(va.x).toBeCloseTo(-0.539278, 3); expect(va.y).toBeCloseTo(-0.063409, 3); expect(va.z).toBeCloseTo(0.044422, 3); expect(va.w).toBeCloseTo(-0.838562, 3);
            va = quat_mult(new quatf(0.136079, -0.722842, -0.163755, -0.657394), new quatf(0.820239, -0.077225, 0.531132, -0.197847));
            expect(va.x).toBeCloseTo(-0.169572, 3); expect(va.y).toBeCloseTo(0.400374, 3); expect(va.z).toBeCloseTo(-0.899158, 3); expect(va.w).toBeCloseTo(0.049600, 3);
            va = quat_mult(new quatf(-0.543007, -0.515172, -0.573270, -0.333321), new quatf(-0.397888, 0.160865, 0.589532, -0.684295));
            expect(va.x).toBeCloseTo(0.715693, 3); expect(va.y).toBeCloseTo(-0.249307, 3); expect(va.z).toBeCloseTo(0.488114, 3); expect(va.w).toBeCloseTo(0.432868, 3);
            va = quat_mult(new quatf(-0.102237, 0.664009, 0.390094, 0.629655), new quatf(0.080447, 0.934357, 0.317019, 0.141437));
            expect(va.x).toBeCloseTo(0.190177, 3); expect(va.y).toBeCloseTo(0.618446, 3); expect(va.z).toBeCloseTo(0.403729, 3); expect(va.w).toBeCloseTo(-0.646808, 3);
            va = quat_mult(new quatf(-0.028612, 0.598053, -0.356194, 0.717384), new quatf(-0.905870, 0.093584, -0.411384, 0.037474));
            expect(va.x).toBeCloseTo(-0.438233, 3); expect(va.y).toBeCloseTo(-0.221349, 3); expect(va.z).toBeCloseTo(-0.847549, 3); expect(va.w).toBeCloseTo(-0.201536, 3);
            va = quat_mult(new quatf(0.053369, 0.388079, 0.503224, -0.770268), new quatf(0.682173, -0.703572, 0.118447, -0.159990));
            expect(va.x).toBeCloseTo(-0.934016, 3); expect(va.y).toBeCloseTo(0.142885, 3); expect(va.z).toBeCloseTo(0.130540, 3); expect(va.w).toBeCloseTo(0.300264, 3);

        });
    });

    describe("quat_div", () => {
        let quat1, quat2, result;

        beforeEach(() => {
            quat1 = new quatf(1, 2, 3, 4); // Some arbitrary quaternion values
            quat2 = new quatf(2, -1, 0, 2); // Some arbitrary quaternion values
            result = quat_div(quat1, quat2);
        });

        it("should return a quaternion", () => {
            expect(result instanceof quatf).toBeTruthy();
        });

        it("should correctly compute the division", () => {
            // Expected result computed manually
            const expected = new quatf(-3, 14, 1, 8);
            // <-3.00000, 14.00000, 1.00000, 8.00000>

            // Compare each component of the result with the expected value
            expect(result[QX]).toBeCloseTo(expected[QX]);
            expect(result[QY]).toBeCloseTo(expected[QY]);
            expect(result[QZ]).toBeCloseTo(expected[QZ]);
            expect(result[QW]).toBeCloseTo(expected[QW]);
        });

        it("should handle division by zero", () => {
            quat2 = new quatf(0, 0, 0, 0); // Denominator quaternion with all components as zero
            result = quat_div(quat1, quat2);

            // The result should have all components as NaN
            expect(result[QX]).toBe(0);
            expect(result[QY]).toBe(0);
            expect(result[QZ]).toBe(0);
            expect(result[QW]).toBe(0);
        });

        it("should handle identity quaternion", () => {
            quat2 = new quatf(0, 0, 0, 1); // Identity quaternion
            result = quat_div(quat1, quat2);

            // The result should be equal to the original quaternion (no change)
            expect(result[QX]).toEqual(quat1[QX]);
            expect(result[QY]).toEqual(quat1[QY]);
            expect(result[QZ]).toEqual(quat1[QZ]);
            expect(result[QW]).toEqual(quat1[QW]);
        });

        it(`quat_div_00`, () => {
            let va;
            va = quat_div(new quatf(0.072454, -0.801434, -0.588394, -0.079032), new quatf(0.591999, -0.430263, 0.609298, -0.305234));
            expect(va.x).toBeCloseTo(-0.716804, 3); expect(va.y).toBeCloseTo(-0.181855, 3); expect(va.z).toBeCloseTo(0.671026, 3); expect(va.w).toBeCloseTo(0.053336, 3);
            va = quat_div(new quatf(-0.466870, 0.287884, -0.715639, 0.432454), new quatf(-0.690647, -0.721702, -0.009129, 0.045494));
            expect(va.x).toBeCloseTo(-0.241673, 3); expect(va.y).toBeCloseTo(0.815192, 3); expect(va.z).toBeCloseTo(0.507158, 3); expect(va.w).toBeCloseTo(0.140883, 3);
            va = quat_div(new quatf(-0.184036, 0.227427, 0.354229, -0.888217), new quatf(-0.775741, 0.038124, 0.629887, -0.003929));
            expect(va.x).toBeCloseTo(-0.558555, 3); expect(va.y).toBeCloseTo(-0.125899, 3); expect(va.z).toBeCloseTo(0.727492, 3); expect(va.w).toBeCloseTo(0.378048, 3);
            va = quat_div(new quatf(0.947665, -0.152779, -0.153787, -0.234393), new quatf(-0.151887, 0.987889, 0.019394, 0.025104));
            expect(va.x).toBeCloseTo(0.137150, 3); expect(va.y).toBeCloseTo(0.232698, 3); expect(va.z).toBeCloseTo(0.913667, 3); expect(va.w).toBeCloseTo(-0.303734, 3);
            va = quat_div(new quatf(-0.832252, -0.552931, 0.034377, -0.021031), new quatf(0.497976, 0.388578, -0.770097, -0.089315));
            expect(va.x).toBeCloseTo(0.497258, 3); expect(va.y).toBeCloseTo(-0.566239, 3); expect(va.z).toBeCloseTo(-0.067314, 3); expect(va.w).toBeCloseTo(-0.653894, 3);
            va = quat_div(new quatf(0.007467, -0.940258, 0.311130, 0.138051), new quatf(-0.241770, 0.760623, 0.152141, -0.582969));
            expect(va.x).toBeCloseTo(-0.350681, 3); expect(va.y).toBeCloseTo(0.366778, 3); expect(va.z).toBeCloseTo(-0.424029, 3); expect(va.w).toBeCloseTo(-0.750130, 3);
            va = quat_div(new quatf(-0.758380, 0.226785, -0.546959, -0.272514), new quatf(0.009818, 0.324988, 0.290174, 0.900048));
            expect(va.x).toBeCloseTo(-0.436340, 3); expect(va.y).toBeCloseTo(0.507373, 3); expect(va.z).toBeCloseTo(-0.661904, 3); expect(va.w).toBeCloseTo(-0.337733, 3);
            va = quat_div(new quatf(0.836548, 0.241480, -0.485648, -0.077600), new quatf(-0.224848, 0.259731, 0.799060, -0.493445));
            expect(va.x).toBeCloseTo(-0.111144, 3); expect(va.y).toBeCloseTo(-0.658257, 3); expect(va.z).toBeCloseTo(0.573220, 3); expect(va.w).toBeCloseTo(-0.475146, 3);
            va = quat_div(new quatf(0.443877, -0.394242, 0.567222, 0.570795), new quatf(0.370361, 0.252188, -0.387177, -0.805809));
            expect(va.x).toBeCloseTo(-0.559485, 3); expect(va.y).toBeCloseTo(0.555672, 3); expect(va.z).toBeCloseTo(0.021878, 3); expect(va.w).toBeCloseTo(-0.614595, 3);
            va = quat_div(new quatf(0.481441, -0.028053, 0.768563, -0.420403), new quatf(-0.129356, 0.637587, -0.682407, -0.333275));
            expect(va.x).toBeCloseTo(-0.685716, 3); expect(va.y).toBeCloseTo(0.506513, 3); expect(va.z).toBeCloseTo(-0.239696, 3); expect(va.w).toBeCloseTo(-0.464526, 3);
            va = quat_div(new quatf(0.564711, -0.328013, 0.297650, 0.696358), new quatf(-0.024518, 0.293208, 0.903951, 0.310324));
            expect(va.x).toBeCloseTo(-0.191464, 3); expect(va.y).toBeCloseTo(-0.823736, 3); expect(va.z).toBeCloseTo(-0.379569, 3); expect(va.w).toBeCloseTo(0.375136, 3);
            va = quat_div(new quatf(0.827854, 0.509129, -0.235392, 0.006041), new quatf(-0.156662, -0.281406, 0.339286, -0.883829));
            expect(va.x).toBeCloseTo(-0.624235, 3); expect(va.y).toBeCloseTo(-0.692285, 3); expect(va.z).toBeCloseTo(0.052794, 3); expect(va.w).toBeCloseTo(-0.358169, 3);
            va = quat_div(new quatf(0.568071, -0.714932, -0.007862, 0.407562), new quatf(0.073539, -0.462166, 0.188807, -0.863334));
            expect(va.x).toBeCloseTo(-0.659025, 3); expect(va.y).toBeCloseTo(0.697752, 3); expect(va.z).toBeCloseTo(-0.280131, 3); expect(va.w).toBeCloseTo(0.018846, 3);
            va = quat_div(new quatf(-0.227975, 0.911562, -0.139676, -0.312365), new quatf(-0.725114, -0.019672, -0.518680, -0.452541));
            expect(va.x).toBeCloseTo(-0.598889, 3); expect(va.y).toBeCloseTo(-0.435630, 3); expect(va.z).toBeCloseTo(0.566663, 3); expect(va.w).toBeCloseTo(0.361181, 3);
            va = quat_div(new quatf(0.127980, -0.647291, 0.686093, -0.306451), new quatf(0.242843, -0.859574, -0.442668, 0.078777));
            expect(va.x).toBeCloseTo(0.960783, 3); expect(va.y).toBeCloseTo(-0.091143, 3); expect(va.z).toBeCloseTo(-0.034425, 3); expect(va.w).toBeCloseTo(0.259621, 3);
            va = quat_div(new quatf(0.147936, 0.155830, 0.887298, -0.408086), new quatf(-0.649431, 0.635946, -0.416898, 0.002733));
            expect(va.x).toBeCloseTo(-0.893858, 3); expect(va.y).toBeCloseTo(-0.254618, 3); expect(va.z).toBeCloseTo(0.027575, 3); expect(va.w).toBeCloseTo(-0.368004, 3);
            va = quat_div(new quatf(-0.249255, 0.478244, 0.825319, -0.167342), new quatf(-0.507955, -0.228485, 0.692546, -0.458429));
            expect(va.x).toBeCloseTo(0.549043, 3); expect(va.y).toBeCloseTo(-0.504080, 3); expect(va.z).toBeCloseTo(0.037418, 3); expect(va.w).toBeCloseTo(0.665624, 3);
            va = quat_div(new quatf(-0.224806, 0.328424, -0.916875, 0.030659), new quatf(-0.116344, 0.768890, -0.227297, 0.586182));
            expect(va.x).toBeCloseTo(0.502116, 3); expect(va.y).toBeCloseTo(0.224518, 3); expect(va.z).toBeCloseTo(-0.665127, 3); expect(va.w).toBeCloseTo(0.505052, 3);
            va = quat_div(new quatf(-0.626506, 0.390604, 0.239884, 0.630376), new quatf(0.251051, -0.302285, 0.881046, -0.263355));
            expect(va.x).toBeCloseTo(0.423390, 3); expect(va.y).toBeCloseTo(0.699889, 3); expect(va.z).toBeCloseTo(-0.527243, 3); expect(va.w).toBeCloseTo(-0.230023, 3);
            va = quat_div(new quatf(-0.695648, 0.705100, -0.040611, -0.131373), new quatf(-0.829737, 0.142346, -0.511853, 0.171115));
            expect(va.x).toBeCloseTo(-0.583168, 3); expect(va.y).toBeCloseTo(-0.183018, 3); expect(va.z).toBeCloseTo(0.411833, 3); expect(va.w).toBeCloseTo(0.675880, 3);

        });
    });


    // Assuming quat_dot is already imported or defined

    describe("quat_dot", () => {
        it("should return the correct dot product for typical quaternions", () => {
            const q1 = [1, 2, 3, 4];
            const q2 = [4, 3, 2, 1];
            expect(quat_dot(q1, q2)).toBe(20);
        });

        it("should return 0 when one of the quaternions is the zero quaternion", () => {
            const q1 = [0, 0, 0, 0];
            const q2 = [1, 2, 3, 4];
            expect(quat_dot(q1, q2)).toBe(0);
        });

        it("should return the square of the quaternion length when dot product with itself", () => {
            const q = [1, 2, 3, 4];
            expect(quat_dot(q, q)).toBe(30); // 1^2 + 2^2 + 3^2 + 4^2
        });

        it("should handle negative components correctly", () => {
            const q1 = [-1, -2, -3, -4];
            const q2 = [1, 2, 3, 4];
            expect(quat_dot(q1, q2)).toBe(-30);
        });

        it("should handle mixed positive and negative components", () => {
            const q1 = [1, -2, 3, -4];
            const q2 = [-1, 2, -3, 4];
            expect(quat_dot(q1, q2)).toBe(-30);
        });

        it("should handle very small components correctly", () => {
            const q1 = [1e-10, 2e-10, 3e-10, 4e-10];
            const q2 = [4e-10, 3e-10, 2e-10, 1e-10];
            expect(quat_dot(q1, q2)).toBeCloseTo(2e-19);
        });

        it("should handle very large components correctly", () => {
            const q1 = [1e10, 2e10, 3e10, 4e10];
            const q2 = [4e10, 3e10, 2e10, 1e10];
            expect(quat_dot(q1, q2)).toBe(2e21);
        });

        it("should handle mixed zero and non-zero components", () => {
            const q1 = [0, 2, 0, 4];
            const q2 = [4, 0, 2, 0];
            expect(quat_dot(q1, q2)).toBe(0);
        });

        it("should handle identical quaternions correctly", () => {
            const q = [1, 2, 3, 4];
            expect(quat_dot(q, q)).toBe(30);
        });

        it("should return NaN when one of the components is NaN", () => {
            const q1 = [1, 2, 3, NaN];
            const q2 = [4, 3, 2, 1];
            expect(quat_dot(q1, q2)).toBeNaN();
        });
    });

    // Assuming quat_angle_to and related functions are already imported or defined

    describe("quat_angle_to", () => {
        it("should return 0 when the quaternions are identical", () => {
            const q1 = [0, 0, 0, 1];
            const q2 = [0, 0, 0, 1];
            expect(quat_angle_to(q1, q2)).toBe(0);
        });

        it("should return π when the quaternions are opposite", () => {
            const q1 = [0, 0, 0, 1];
            const q2 = [0, -1, 0, 0];
            expect(quat_angle_to(q1, q2)).toBe(Math.PI);
        });

        it("should return the correct angle for orthogonal quaternions", () => {
            const q1 = [0, 0, 0, 1];
            const q2 = [0, 1, 0, 0];
            expect(quat_angle_to(q1, q2)).toBeCloseTo(Math.PI);
        });

        it("should handle quaternions with negative components correctly", () => {
            const q1 = [-0.5, -0.5, -0.5, -0.5];
            const q2 = [0.5, 0.5, 0.5, 0.5];
            expect(quat_angle_to(q1, q2)).toBe(0);
        });

        it("should return 0 when both quaternions are zero quaternions", () => {
            const q1 = [0, 0, 0, 1];
            const q2 = [0, 0, 0, 1];
            expect(quat_angle_to(q1, q2)).toBe(0);
        });

        it("should return the correct angle for quaternions with very small differences", () => {
            const q1 = [1, 0, 0, 0];
            const q2 = [1, 1e-10, 1e-10, 1e-10];
            expect(quat_angle_to(q1, q2)).toBeCloseTo(2 * Math.acos(1 / Math.sqrt(1 + 3e-20)), 10);
        });

        it("should handle very large quaternion components", () => {
            const q1 = [1e10, 2e10, 3e10, 4e10];
            const q2 = [-1e10, -2e10, -3e10, -4e10];
            expect(quat_angle_to(q1, q2)).toBe(0);
        });

        it("should handle a mix of small and large components", () => {
            const q1 = [1e-10, 2e-10, 3e-10, 4e-10];
            const q2 = [1e10, 2e10, 3e10, 4e10];
            const normalizedQ1 = quat_normalized(q1);
            const normalizedQ2 = quat_normalized(q2);
            expect(quat_angle_to(normalizedQ1, normalizedQ2)).toBeCloseTo(0.00009639436673760517, 10);
        });

        it("should handle quaternions where the dot product is at the edge of the clamp range", () => {
            const q1 = [1, 0, 0, 0];
            const q2 = [0.9999999, 0, 0, 0];
            expect(quat_angle_to(q1, q2)).toBeCloseTo(0.0008944271982180825, 10);
        });
    });

    describe('quat_angle', () => {
    
        it('should return 0 for the identity quaternion', () => {
            const identity = [0, 0, 0, 1];
            expect(quat_angle(identity)).toBeCloseTo(0, 6);
        });
    
        it('should return pi for a quaternion representing a 180 degree rotation', () => {
            const quat180 = [1, 0, 0, 0]; // 180-degree rotation around the x-axis
            expect(quat_angle(quat180)).toBeCloseTo(Math.PI, 6);
        });
    
        it('should handle a quaternion with zero vector part', () => {
            const quatZeroVector = [0, 0, 0, 1];
            expect(quat_angle(quatZeroVector)).toBeCloseTo(0, 6);
        });
    
        it('should handle a quaternion with zero scalar part', () => {
            const quatZeroScalar = [1, 1, 1, 0];
            const expectedAngle = 2 * Math.atan2(Math.sqrt(3), 0);
            expect(quat_angle(quatZeroScalar)).toBeCloseTo(expectedAngle, 6);
        });
    
        it('should handle a normalized quaternion', () => {
            const quatNormalized = [0.57735, 0.57735, 0.57735, 0.5];
            const expectedAngle = 2 * Math.atan2(Math.sqrt(0.57735 ** 2 * 3), Math.abs(0.5));
            expect(quat_angle(quatNormalized)).toBeCloseTo(expectedAngle, 6);
        });
    
        it('should handle a quaternion with negative components', () => {
            const quatNegative = [-0.5, -0.5, -0.5, -0.5];
            const expectedAngle = 2 * Math.atan2(Math.sqrt(0.5 ** 2 * 3), Math.abs(-0.5));
            expect(quat_angle(quatNegative)).toBeCloseTo(expectedAngle, 6);
        });
    
        it('should handle a quaternion with large values', () => {
            const quatLarge = [1000, 1000, 1000, 1000];
            const expectedAngle = 2 * Math.atan2(Math.sqrt(1000 ** 2 * 3), Math.abs(1000));
            expect(quat_angle(quatLarge)).toBeCloseTo(expectedAngle, 6);
        });
    
        it('should handle a quaternion with small values', () => {
            const quatSmall = [0.001, 0.001, 0.001, 0.001];
            const expectedAngle = 2 * Math.atan2(Math.sqrt(0.001 ** 2 * 3), Math.abs(0.001));
            expect(quat_angle(quatSmall)).toBeCloseTo(expectedAngle, 6);
        });
    });
    
    describe('quat_angle_between', () => {
        const QX = 0, QY = 1, QZ = 2, QW = 3;
    
        it('should return 0 for the same quaternions', () => {
            const quat1 = [0, 0, 0, 1];
            const quat2 = [0, 0, 0, 1];
            expect(quat_angle_between(quat1, quat2)).toBeCloseTo(0, 6);
        });
    
        it('should return pi for quaternions 180 degrees apart', () => {
            const quat1 = [1, 0, 0, 0];
            const quat2 = [0, 0, 0, 1];
            expect(quat_angle_between(quat1, quat2)).toBeCloseTo(Math.PI, 6);
        });
    
        it('should handle quaternions with zero vector part', () => {
            const quat1 = [0, 0, 0, 1];
            const quat2 = [0, 0, 0, 1];
            expect(quat_angle_between(quat1, quat2)).toBeCloseTo(0, 6);
        });
    
        it('should handle quaternions with zero scalar part', () => {
            const quat1 = [1, 1, 1, 0];
            const quat2 = [1, 1, 1, 0];
            expect(quat_angle_between(quat1, quat2)).toBeCloseTo(0, 6);
        });
    
        it('should handle normalized quaternions', () => {
            const quat1 = [0.57735, 0.57735, 0.57735, 0.5];
            const quat2 = [0.57735, 0.57735, 0.57735, 0.5];
            expect(quat_angle_between(quat1, quat2)).toBeCloseTo(0, 6);
        });
    
        it('should handle quaternions with negative components', () => {
            const quat1 = [-0.5, -0.5, -0.5, -0.5];
            const quat2 = [-0.5, -0.5, -0.5, -0.5];
            expect(quat_angle_between(quat1, quat2)).toBeCloseTo(0, 6);
        });
    
        it('should handle quaternions with large values', () => {
            const quat1 = [1000, 1000, 1000, 1000];
            const quat2 = [1000, 1000, 1000, 1000];
            expect(quat_angle_between(quat1, quat2)).toBeCloseTo(0, 6);
        });
    
        it('should handle quaternions with small values', () => {
            const quat1 = [0.001, 0.001, 0.001, 0.001];
            const quat2 = [0.001, 0.001, 0.001, 0.001];
            expect(quat_angle_between(quat1, quat2)).toBeCloseTo(0, 6);
        });
    
        it('should handle different quaternions', () => {
            const quat1 = [1, 0, 0, 0];
            const quat2 = [0, 1, 0, 0];
            const expectedAngle = Math.PI;
            expect(quat_angle_between(quat1, quat2)).toBeCloseTo(expectedAngle, 6);
        });
    
        it('should handle non-unit quaternions', () => {
            const quat1 = [2, 0, 0, 0];
            const quat2 = [0, 2, 0, 0];
            const expectedAngle = Math.PI;
            expect(quat_angle_between(quat1, quat2)).toBeCloseTo(expectedAngle, 6);
        });
    });

    xdescribe('quat_to_euler', () => {
    
        it('should convert a quaternion to euler angles', () => {
            const quat = [0, 0, 0, 1];
            const expectedEuler = new eulerf(0, 0, 0);
            expect(quat_to_euler(quat)).toEqual(expectedEuler);
        });
    
        it('should handle normalized quaternions', () => {
            const quat = [0.7071, 0, 0, 0.7071];
            const expectedEuler = new eulerf(Math.PI / 2, 0, 0);
            expect(quat_to_euler(quat)).toEqual(expectedEuler);
        });
    
        it('should handle non-normalized quaternions', () => {
            const quat = [2, 0, 0, 2];
            const expectedEuler = [Math.PI / 2, 0, 0];
            expect(quat_to_euler(quat)).toEqual(expectedEuler);
        });
    
        it('should handle quaternions with negative components', () => {
            const quat = [-0.5, -0.5, -0.5, -0.5];
            const expectedEuler = [Math.PI, 0, Math.PI];
            expect(quat_to_euler(quat)).toEqual(expectedEuler);
        });
    
        it('should handle zero quaternion', () => {
            const quat = [0, 0, 0, 0];
            const expectedEuler = new eulerf(0, 0, 0);
            expect(quat_to_euler(quat)).toEqual(expectedEuler);
        });
    
        it('should handle gimbal lock scenario', () => {
            const quat = [0.5, 0.5, 0.5, 0.5];
            const expectedEuler = [Math.PI / 2, Math.PI / 2, 0];
            expect(quat_to_euler(quat)).toEqual(expectedEuler);
        });
    
        it('should handle small values', () => {
            const quat = [0.001, 0.001, 0.001, 0.001];
            const expectedEuler = new eulerf(0, 0, 0);
            expect(quat_to_euler(quat)).toEqual(expectedEuler);
        });
    
        it('should handle large values', () => {
            const quat = [1000, 1000, 1000, 1000];
            const expectedEuler = [Math.PI / 2, 0, Math.PI / 2];
            expect(quat_to_euler(quat)).toEqual(expectedEuler);
        });
    });
    
    xdescribe("quat_from_unit_vec function", () => {
        // Test case for parallel vectors
        it("should create a quaternion for parallel vectors", () => {
            const from = [1, 0, 0];
            const to = [1, 0, 0];
            const result = quat_from_unit_vec(from, to);
            expect(result).toEqual([1, 0, 0, 1]);
        });
    
        // Test case for orthogonal vectors
        it("should create a quaternion for orthogonal vectors", () => {
            const from = [1, 0, 0];
            const to = [0, 1, 0];
            const result = quat_from_unit_vec(from, to);
            expect(result).toEqual([0, 0, 1, 0]);
        });
    
        // Test case for anti-parallel vectors
        it("should create a quaternion for anti-parallel vectors", () => {
            const from = [1, 0, 0];
            const to = [-1, 0, 0];
            const result = quat_from_unit_vec(from, to);
            expect(result).toEqual([0, 1, 0, 0]);
        });
    
        // Test case for non-unit vectors
        it("should create a quaternion for non-unit vectors", () => {
            const from = [2, 0, 0];
            const to = [0, 3, 0];
            const result = quat_from_unit_vec(from, to);
            expect(result).toEqual([0, 0, 2, 0]);
        });
    
        // Test case for very small dot product
        it("should create a quaternion for vectors with a very small dot product", () => {
            const from = [1, 0, 0];
            const to = [0, 1e-10, 1];
            const result = quat_from_unit_vec(from, to);
            expect(result).toEqual([0, 0, 1, 0]);
        });
    
        // Test case for zero dot product
        it("should create a quaternion for vectors with a zero dot product", () => {
            const from = [1, 0, 0];
            const to = [0, 0, 1];
            const result = quat_from_unit_vec(from, to);
            expect(result).toEqual([0, 1, 0, 0]);
        });
    });
    

});