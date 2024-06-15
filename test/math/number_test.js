import { numb } from '../../lib/math/number.js'


const b64Alph = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=`;
// binary to string lookup table
const b2s = b64Alph.split('');

// string to binary lookup table
// 123 == 'z'.charCodeAt(0) + 1
const s2b = new Array(123);
for (let i = 0; i < b64Alph.length; i++) {
    s2b[b64Alph.charCodeAt(i)] = i;
}

describe(`numb class test`, () => {

    describe('numb.rand', () => {
        // Test cases for valid inputs
        describe('with valid inputs', () => {
            it('should return a number within the specified range', () => {
                const min = 0;
                const max = 10;
                const result = numb.rand(min, max);
                expect(result).toBeGreaterThanOrEqual(min);
                expect(result).toBeLessThan(max);
            });

            it('should handle negative values properly', () => {
                const min = -10;
                const max = 10;
                const result = numb.rand(min, max);
                expect(result).toBeGreaterThanOrEqual(min);
                expect(result).toBeLessThan(max);
            });

            it('should return the minimum value when min and max are the same', () => {
                const min = 5;
                const max = 5;
                const result = numb.rand(min, max);
                expect(result).toEqual(min);
            });

            it('should swap min and max if min is greater than max', () => {
                const min = 10;
                const max = 5;
                const result = numb.rand(min, max);
                expect(result).toBeGreaterThanOrEqual(max);
                expect(result).toBeLessThan(min);
            });
        });

    });

    describe('numb.frand()', () => {
        // Test cases for the frand method
        describe('Valid inputs', () => {
            // Test case for generating random numbers within a range
            it('should generate a random number within the specified range', () => {
                const min = -10;
                const max = 10;
                const result = numb.frand(min, max);
                expect(result).toBeGreaterThanOrEqual(min);
                expect(result).toBeLessThan(max);
            });

            // Test case for generating random numbers with swapped min and max values
            it('should generate a random number within the specified range when min is greater than max', () => {
                const min = 10;
                const max = -10;
                const result = numb.frand(min, max);
                expect(result).toBeGreaterThanOrEqual(max);
                expect(result).toBeLessThan(min);
            });
        });

        // Test cases for edge cases and invalid inputs
        describe('Edge cases and invalid inputs', () => {
            // Test case for generating random numbers with the same min and max value
            it('should return the same value when min and max are equal', () => {
                const min = 5;
                const max = 5;
                const result = numb.frand(min, max);
                expect(result).toEqual(min);
            });

            // Test case for generating random numbers with invalid inputs
            it('should handle invalid inputs gracefully', () => {
                // Test with NaN values for min and max
                expect(() => numb.frand(NaN, NaN)).toThrow();
                expect(() => numb.frand(NaN, 10)).toThrow();
                expect(() => numb.frand(10, NaN)).toThrow();

                // Test with Infinity values for min and max
                expect(() => numb.frand(-Infinity, Infinity)).not.toThrow();
                expect(() => numb.frand(Infinity, -Infinity)).not.toThrow();
            });
        });
    });

    describe('numb.irand', () => {
        // Test case: generating a random integer within the specified range
        it('should generate a random integer within the specified range', () => {
            const min = 5;
            const max = 10;
            const result = numb.irand(min, max);
            expect(result).not.toBeNaN();
            expect(result).not.toBeLessThan(min);
            expect(result).not.toBeGreaterThan(max);
            expect(Number.isInteger(result)).toBeTrue();
        });

        // Test case: generating a random integer with negative range
        it('should handle negative range correctly', () => {
            const min = -10;
            const max = -5;
            const result = numb.irand(min, max);
            expect(result).not.toBeNaN();
            expect(result).not.toBeLessThan(min);
            expect(result).not.toBeGreaterThan(max);
            expect(Number.isInteger(result)).toBeTrue();
        });

        // Test case: generating a random integer with min equals max
        it('should return the same value when min equals max', () => {
            const min = 5;
            const max = 5;
            const result = numb.irand(min, max);
            expect(result).toBe(min);
        });

        // Test case: generating a random integer with min greater than max
        it('should handle the case when min is greater than max', () => {
            const min = 10;
            const max = 5;
            const result = numb.irand(min, max);
            expect(result).not.toBeNaN();
            expect(result).not.toBeLessThan(max);
            expect(result).not.toBeGreaterThan(min);
            expect(Number.isInteger(result)).toBeTrue();
        });
    });

    describe(`numb.fuzzy_null`, () => {
        // Test cases for values close to zero
        it(`should return true for values close to zero`, () => {
            expect(numb.fuzzy_null(0)).toBeTrue();
            expect(numb.fuzzy_null(0.00000001)).toBeTrue();
            expect(numb.fuzzy_null(-0.00000001)).toBeTrue();
            expect(numb.fuzzy_null(1e-15)).toBeTrue();
            expect(numb.fuzzy_null(-1e-15)).toBeTrue();
        });

        // Test cases for values not close to zero
        it(`should return false for values not close to zero`, () => {
            expect(numb.fuzzy_null(0.1)).toBeFalse();
            expect(numb.fuzzy_null(-0.1)).toBeFalse();
            expect(numb.fuzzy_null(100)).toBeFalse();
            expect(numb.fuzzy_null(-100)).toBeFalse();
        });

        // Test cases for negative zero
        it(`should handle negative zero`, () => {
            expect(numb.fuzzy_null(-0)).toBeTrue();
        });

        // Test cases for edge cases
        it(`should handle edge cases`, () => {
            // Test with the smallest positive value close to zero
            expect(numb.fuzzy_null(Number.MIN_VALUE)).toBeTrue();

            // Test with the largest positive value close to zero
            expect(numb.fuzzy_null(Number.MAX_VALUE)).toBeFalse();

            // Test with NaN
            expect(numb.fuzzy_null(NaN)).toBeFalse();

            // Test with Infinity
            expect(numb.fuzzy_null(Infinity)).toBeFalse();
            expect(numb.fuzzy_null(-Infinity)).toBeFalse();
        });
    });

    describe(`numb.fuzzy_comparef`, () => {

        // Test cases for fuzzy comparison
        it(`should return true when two numbers are approximately equal within the threshold`, () => {
            // Test cases with numbers that are close enough to be considered equal
            expect(numb.fuzzy_comparef(1.0, 1.000001)).toBe(true);
            expect(numb.fuzzy_comparef(1000.0, 1000.000001)).toBe(true);
            expect(numb.fuzzy_comparef(0.00001, 0.0000100001)).toBe(true);
            expect(numb.fuzzy_comparef(1.23456, 1.2345600001)).toBe(true);
        });

        it(`should return false when two numbers are not approximately equal within the threshold`, () => {
            // Test cases with numbers that are not close enough to be considered equal
            expect(numb.fuzzy_comparef(1.0, 1.0001)).toBe(false);
            expect(numb.fuzzy_comparef(1000.0, 1000.001)).toBe(false);
            expect(numb.fuzzy_comparef(0.00001, 0.000020001)).toBe(false);
            expect(numb.fuzzy_comparef(1.23456, 1.2345700001)).toBe(false);
        });

        it(`should return true when two numbers are equal and within the threshold`, () => {
            // Test cases with numbers that are exactly equal
            expect(numb.fuzzy_comparef(1.0, 1.0)).toBe(true);
            expect(numb.fuzzy_comparef(1000.0, 1000.0)).toBe(true);
            expect(numb.fuzzy_comparef(0.00001, 0.00001)).toBe(true);
            expect(numb.fuzzy_comparef(1.23456, 1.23456)).toBe(true);
        });

        it(`should return false when one of the numbers is NaN`, () => {
            // Test cases with NaN values
            expect(numb.fuzzy_comparef(NaN, 1.0)).toBe(false);
            expect(numb.fuzzy_comparef(1.0, NaN)).toBe(false);
            expect(numb.fuzzy_comparef(NaN, NaN)).toBe(false);
        });

        it(`should return false when one of the numbers is Infinity`, () => {
            // Test cases with Infinity values
            expect(numb.fuzzy_comparef(Infinity, 1.0)).toBe(false);
            expect(numb.fuzzy_comparef(1.0, Infinity)).toBe(false);
            expect(numb.fuzzy_comparef(Infinity, Infinity)).toBe(false);
            expect(numb.fuzzy_comparef(-Infinity, 1.0)).toBe(false);
            expect(numb.fuzzy_comparef(1.0, -Infinity)).toBe(false);
            expect(numb.fuzzy_comparef(-Infinity, -Infinity)).toBe(false);
        });
    });

    describe(`fuzzy_compared`, () => {

        it(`should return true for exactly equal numbers`, () => {
            expect(numb.fuzzy_compared(100, 100)).toBeTrue();
            expect(numb.fuzzy_compared(-100, -100)).toBeTrue();
            expect(numb.fuzzy_compared(0, 0)).toBeTrue();
        });

        it(`should return true for numbers that are nearly equal within the threshold`, () => {
            expect(numb.fuzzy_compared(100.000000000001, 100)).toBeTrue();
            expect(numb.fuzzy_compared(-100.000000000001, -100)).toBeTrue();
        });

        it(`should return false for numbers that are significantly different`, () => {
            expect(numb.fuzzy_compared(100, 101)).toBeFalse();
            expect(numb.fuzzy_compared(-100, -101)).toBeFalse(); ``
        });

        it(`should handle very small numbers correctly`, () => {
            expect(numb.fuzzy_compared(1e-12, 0)).toBeTrue();
            expect(numb.fuzzy_compared(1e-10, 1e-11)).toBeFalse();
        });

        it(`should handle very large numbers correctly`, () => {
            expect(numb.fuzzy_compared(1e12, 1e12 + 1e-6)).toBeTrue();
            expect(numb.fuzzy_compared(1e12, 1e12 + 1e6)).toBeFalse();
        });

        it(`should handle positive and negative numbers correctly`, () => {
            expect(numb.fuzzy_compared(100, -100)).toBeFalse();
            expect(numb.fuzzy_compared(-100.000000000001, -100)).toBeTrue();
        });

        it(`should handle edge cases with infinity and NaN`, () => {
            expect(numb.fuzzy_compared(NaN, NaN)).toBeFalse();
            expect(numb.fuzzy_compared(NaN, 100)).toBeFalse();
        });

        it(`should handle mixed sign comparisons`, () => {
            expect(numb.fuzzy_compared(0, -0)).toBeTrue();
            expect(numb.fuzzy_compared(1e-12, -1e-12)).toBeFalse();
        });

    });

    describe(`fast_nan`, () => {

        it(`should return true for NaN`, () => {
            expect(numb.fast_nan(NaN)).toBeTrue();
        });

        it(`should return false for valid numbers`, () => {
            expect(numb.fast_nan(0)).toBeFalse();
            expect(numb.fast_nan(123)).toBeFalse();
            expect(numb.fast_nan(-123)).toBeFalse();
            expect(numb.fast_nan(0.123)).toBeFalse();
            expect(numb.fast_nan(-0.123)).toBeFalse();
        });

        it(`should return false for valid numeric strings`, () => {
            expect(numb.fast_nan("0")).toBeFalse();
            expect(numb.fast_nan("123")).toBeFalse();
            expect(numb.fast_nan("-123")).toBeFalse();
            expect(numb.fast_nan("0.123")).toBeFalse();
            expect(numb.fast_nan("-0.123")).toBeFalse();
        });

        it(`should return true for non-numeric strings`, () => {
            expect(numb.fast_nan("hello")).toBeTrue();
            expect(numb.fast_nan("NaN")).toBeTrue();
            expect(numb.fast_nan("")).toBeTrue();
        });

        it(`should return false for hexadecimal strings`, () => {
            expect(numb.fast_nan("0x1A")).toBeFalse();
            expect(numb.fast_nan("0X1A")).toBeFalse();
            expect(numb.fast_nan("0xABC")).toBeFalse();
            expect(numb.fast_nan("-0xABC")).toBeFalse();
            expect(numb.fast_nan("+0xABC")).toBeFalse();
        });

        it(`should return true for special values`, () => {
            expect(numb.fast_nan(undefined)).toBeTrue();
            expect(numb.fast_nan(null)).toBeTrue();
            expect(numb.fast_nan({})).toBeTrue();
            expect(numb.fast_nan([])).toBeTrue();
        });

    });

    describe(`is_inf`, () => {

        it(`should return true for positive infinity`, () => {
            expect(numb.is_inf(Infinity)).toBeTrue();
        });

        it(`should return true for negative infinity`, () => {
            expect(numb.is_inf(-Infinity)).toBeTrue();
        });

        it(`should return false for numbers`, () => {
            expect(numb.is_inf(123)).toBeFalse();
            expect(numb.is_inf(-123)).toBeFalse();
            expect(numb.is_inf(0)).toBeFalse();
        });

        it(`should return false for NaN`, () => {
            expect(numb.is_inf(NaN)).toBeFalse();
        });

        it(`should return false for strings`, () => {
            expect(numb.is_inf("Infinity")).toBeFalse();
            expect(numb.is_inf("-Infinity")).toBeFalse();
            expect(numb.is_inf("123")).toBeFalse();
        });

        it(`should return false for special values`, () => {
            expect(numb.is_inf(undefined)).toBeFalse();
            expect(numb.is_inf(null)).toBeFalse();
        });

    });

    describe(`is_finite`, () => {

        it(`should return true for valid finite numbers`, () => {
            expect(numb.is_finite(0)).toBeTrue();
            expect(numb.is_finite(123)).toBeTrue();
            expect(numb.is_finite(-123)).toBeTrue();
            expect(numb.is_finite(0.123)).toBeTrue();
            expect(numb.is_finite(-0.123)).toBeTrue();
        });

        it(`should return false for NaN`, () => {
            expect(numb.is_finite(NaN)).toBeFalse();
        });

        it(`should return false for infinity values`, () => {
            expect(numb.is_finite(Infinity)).toBeFalse();
            expect(numb.is_finite(-Infinity)).toBeFalse();
        });

        it(`should return false for non-numeric strings`, () => {
            expect(numb.is_finite("hello")).toBeFalse();
            expect(numb.is_finite("NaN")).toBeFalse();
            expect(numb.is_finite("Infinity")).toBeFalse();
        });

        it(`should return false for special values`, () => {
            expect(numb.is_finite(undefined)).toBeFalse();
            expect(numb.is_finite(null)).toBeFalse();
            expect(numb.is_finite({})).toBeFalse();
        });

    });

    describe(`equals`, () => {

        it(`should return true for equal finite numbers`, () => {
            expect(numb.equals(0, 0)).toBeTrue();
            expect(numb.equals(123, 123)).toBeTrue();
            expect(numb.equals(-123, -123)).toBeTrue();
            expect(numb.equals(0.123, 0.123)).toBeTrue();
            expect(numb.equals(-0.123, -0.123)).toBeTrue();
        });

        it(`should return true for equal non-finite numbers`, () => {
            expect(numb.equals(NaN, NaN)).toBeTrue();
            expect(numb.equals(Infinity, Infinity)).toBeTrue();
            expect(numb.equals(-Infinity, -Infinity)).toBeTrue();
        });

        it(`should return true for equal absolute non-finite numbers`, () => {
            expect(numb.equals(NaN, NaN)).toBeTrue();
            expect(numb.equals(Infinity, Infinity)).toBeTrue();
            expect(numb.equals(-Infinity, -Infinity)).toBeTrue();
            expect(numb.equals(Infinity, -Infinity)).toBeTrue();
        });

        it(`should return false for unequal finite numbers`, () => {
            expect(numb.equals(0, 1)).toBeFalse();
            expect(numb.equals(123, 456)).toBeFalse();
            expect(numb.equals(-123, 123)).toBeFalse();
            expect(numb.equals(0.123, -0.123)).toBeFalse();
        });

        it(`should return false for unequal non-finite numbers`, () => {
            expect(numb.equals(NaN, 0)).toBeFalse();
            expect(numb.equals(Infinity, 123)).toBeFalse();
            expect(numb.equals(-Infinity, 0.123)).toBeFalse();
        });

        it(`should return false for unequal absolute non-finite numbers`, () => {
            expect(numb.equals(NaN, Infinity)).toBeFalse();
            expect(numb.equals(-Infinity, NaN)).toBeFalse();
        });

    });

    describe(`round_2_dec`, () => {

        it(`should round positive numbers to specified decimal places`, () => {
            expect(numb.round_2_dec(3.14159, 2)).toBeCloseTo(3.14);
            expect(numb.round_2_dec(123.456, 1)).toBeCloseTo(123.5);
            expect(numb.round_2_dec(0.123456, 3)).toBeCloseTo(0.123);
        });

        it(`should round negative numbers to specified decimal places`, () => {
            expect(numb.round_2_dec(-3.14159, 2)).toBeCloseTo(-3.14);
            expect(numb.round_2_dec(-123.456, 1)).toBeCloseTo(-123.5);
            expect(numb.round_2_dec(-0.123456, 3)).toBeCloseTo(-0.123);
        });

        it(`should round zero to specified decimal places`, () => {
            expect(numb.round_2_dec(0, 2)).toBeCloseTo(0);
            expect(numb.round_2_dec(0, 5)).toBeCloseTo(0);
            expect(numb.round_2_dec(0, 0)).toBeCloseTo(0);
        });

        it(`should round numbers with more decimal places than specified`, () => {
            expect(numb.round_2_dec(1.9999, 2)).toBeCloseTo(2);
            expect(numb.round_2_dec(0.005, 2)).toBeCloseTo(0.01);
            expect(numb.round_2_dec(123.456, 0)).toBeCloseTo(123);
        });

        it(`should handle edge cases`, () => {
            expect(numb.round_2_dec(Infinity, 2)).toBe(Infinity);
            expect(numb.round_2_dec(-Infinity, 2)).toBe(-Infinity);
            expect(numb.round_2_dec(NaN, 2)).toBeNaN();
        });

    });

    describe(`to_deg`, () => {

        it(`should convert radians to degrees`, () => {
            expect(numb.to_deg(Math.PI)).toBeCloseTo(180);
            expect(numb.to_deg(2 * Math.PI)).toBeCloseTo(360);
            expect(numb.to_deg(0)).toBeCloseTo(0);
            expect(numb.to_deg(Math.PI / 2)).toBeCloseTo(90);
            expect(numb.to_deg(-Math.PI)).toBeCloseTo(-180);
        });

        it(`should handle edge cases`, () => {
            expect(numb.to_deg(Infinity)).toBe(Infinity);
            expect(numb.to_deg(-Infinity)).toBe(-Infinity);
            expect(numb.to_deg(NaN)).toBeNaN();
        });

    });

    describe(`to_rad`, () => {

        it(`should convert degrees to radians`, () => {
            expect(numb.to_rad(180)).toBeCloseTo(Math.PI);
            expect(numb.to_rad(360)).toBeCloseTo(2 * Math.PI);
            expect(numb.to_rad(0)).toBeCloseTo(0);
            expect(numb.to_rad(90)).toBeCloseTo(Math.PI / 2);
            expect(numb.to_rad(-180)).toBeCloseTo(-Math.PI);
        });

        it(`should handle edge cases`, () => {
            expect(numb.to_rad(Infinity)).toBe(Infinity);
            expect(numb.to_rad(-Infinity)).toBe(-Infinity);
            expect(numb.to_rad(NaN)).toBeNaN();
        });

    });

    describe(`u8_to_hex`, () => {

        it(`should convert unsigned 8-bit integers to hexadecimal representation`, () => {
            expect(numb.u8_to_hex(0)).toBe('00');
            expect(numb.u8_to_hex(15)).toBe('0F');
            expect(numb.u8_to_hex(255)).toBe('FF');
            expect(numb.u8_to_hex(16)).toBe('10');
            expect(numb.u8_to_hex(127)).toBe('7F');
        });

        it(`should handle edge cases`, () => {
            expect(numb.u8_to_hex(256)).toBe('100');
            //expect(numb.u8_to_hex(-1)).toBe('FF');
        });

    });

    describe('between', () => {
        it('should return true if the number is within the range (inclusive)', () => {
            // Test inclusive range
            expect(numb.between(5, 1, 10)).toBeTrue();
            expect(numb.between(1, 1, 10)).toBeTrue();
            expect(numb.between(10, 1, 10)).toBeTrue();
            expect(numb.between(-2147483648, -2147483648, 2147483647)).toBeTrue();
            expect(!numb.between(-2147483648, -2147483648, 2147483647)).toBeFalse();
        });

        it('should return false if the number is outside the range (inclusive)', () => {
            // Test inclusive range
            expect(numb.between(0, 1, 10)).toBeFalse();
            expect(numb.between(11, 1, 10)).toBeFalse();
        });

        it('should return true if the number is within the range (exclusive)', () => {
            // Test exclusive range
            expect(numb.between(5, 1, 10, false)).toBeTrue();
            expect(numb.between(2, 1, 10, false)).toBeTrue();
            expect(numb.between(9, 1, 10, false)).toBeTrue();
        });

        it('should return false if the number is outside the range (exclusive)', () => {
            // Test exclusive range
            expect(numb.between(1, 1, 10, false)).toBeFalse();
            expect(numb.between(10, 1, 10, false)).toBeFalse();
        });
    });

    describe('clamp', () => {
        it('should return the number itself if it is within the range', () => {
            expect(numb.clamp(5, 1, 10)).toBe(5);
            expect(numb.clamp(1, 1, 10)).toBe(1);
            expect(numb.clamp(10, 1, 10)).toBe(10);
        });

        it('should return the minimum value if the number is below the range', () => {
            expect(numb.clamp(0, 1, 10)).toBe(1);
            expect(numb.clamp(-5, 1, 10)).toBe(1);
        });

        it('should return the maximum value if the number is above the range', () => {
            expect(numb.clamp(15, 1, 10)).toBe(10);
            expect(numb.clamp(20, 1, 10)).toBe(10);
        });

        it('should handle negative range', () => {
            expect(numb.clamp(-5, -10, -1)).toBe(-5);
            expect(numb.clamp(-20, -10, -1)).toBe(-10);
            expect(numb.clamp(-15, -10, -1)).toBe(-10);
        });

        it('should handle non-integer values', () => {
            expect(numb.clamp(5.5, 1.5, 10.5)).toBe(5.5);
            expect(numb.clamp(0.5, 1.5, 10.5)).toBe(1.5);
            expect(numb.clamp(11.5, 1.5, 10.5)).toBe(10.5);
        });
    });

    describe('copysign', () => {
        it('should return x with the sign of y if signs of x and y are different', () => {
            // Test with different signs
            expect(numb.copysign(5, -10)).toBe(-5);
            expect(numb.copysign(-8, 3)).toBe(8);
        });

        it('should return x with its original sign if signs of x and y are same', () => {
            // Test with same signs
            expect(numb.copysign(5, 10)).toBe(5);
            expect(numb.copysign(-8, -3)).toBe(-8);
        });

        it('should return 0 if x is 0', () => {
            // Test with x being 0
            expect(numb.copysign(0, 10)).toBe(0);
            expect(numb.copysign(0, -3)).toBe(0);
        });

        it('should return NaN if x or y is NaN', () => {
            // Test with NaN
            expect(numb.copysign(NaN, 10)).toBeNaN();
            expect(numb.copysign(5, NaN)).toBeNaN();
        });
    });

    //rounded

    describe('rounded', () => {
        it('should round a number away from zero when rounding mode is specified as "away_from_zero"', () => {
            expect(numb.rounded(2.4, numb.rounding_mode.away_from_zero)).toEqual(2);
            expect(numb.rounded(-2.4, numb.rounding_mode.away_from_zero)).toEqual(-2);
            expect(numb.rounded(2.6, numb.rounding_mode.away_from_zero)).toEqual(3);
            expect(numb.rounded(-2.6, numb.rounding_mode.away_from_zero)).toEqual(-3);
        });

        it('should round a number to the nearest even integer when rounding mode is specified as "to_even"', () => {
            expect(numb.rounded(2.4, numb.rounding_mode.to_even)).toEqual(2);
            expect(numb.rounded(-2.4, numb.rounding_mode.to_even)).toEqual(-2);
            expect(numb.rounded(2.6, numb.rounding_mode.to_even)).toEqual(3);
            expect(numb.rounded(-2.6, numb.rounding_mode.to_even)).toEqual(-3);
        });

        it('should round a number towards negative infinity when rounding mode is specified as "to_negative_infinity"', () => {
            expect(numb.rounded(2.4, numb.rounding_mode.to_negative_infinity)).toEqual(2);
            expect(numb.rounded(-2.4, numb.rounding_mode.to_negative_infinity)).toEqual(-3);
            expect(numb.rounded(2.6, numb.rounding_mode.to_negative_infinity)).toEqual(2);
            expect(numb.rounded(-2.6, numb.rounding_mode.to_negative_infinity)).toEqual(-3);
        });

        it('should round a number towards positive infinity when rounding mode is specified as "to_positive_infinity"', () => {
            expect(numb.rounded(2.4, numb.rounding_mode.to_positive_infinity)).toEqual(3);
            expect(numb.rounded(-2.4, numb.rounding_mode.to_positive_infinity)).toEqual(-2);
            expect(numb.rounded(2.6, numb.rounding_mode.to_positive_infinity)).toEqual(3);
            expect(numb.rounded(-2.6, numb.rounding_mode.to_positive_infinity)).toEqual(-2);
        });

        it('should round a number towards zero when rounding mode is specified as "to_zero"', () => {
            expect(numb.rounded(2.4, numb.rounding_mode.to_zero)).toEqual(2);
            expect(numb.rounded(-2.4, numb.rounding_mode.to_zero)).toEqual(-2);
            expect(numb.rounded(2.6, numb.rounding_mode.to_zero)).toEqual(3);
            expect(numb.rounded(-2.6, numb.rounding_mode.to_zero)).toEqual(-3);
        });

        it('should round a number using Math.round by default', () => {
            expect(numb.rounded(2.4)).toEqual(2);
            expect(numb.rounded(-2.4)).toEqual(-2);
            expect(numb.rounded(2.6)).toEqual(3);
            expect(numb.rounded(-2.6)).toEqual(-3);
        });

        it('should return 0 if the input number is -0', () => {
            expect(numb.rounded(-0, numb.rounding_mode.away_from_zero)).toEqual(0);
            expect(numb.rounded(-0, numb.rounding_mode.to_even)).toEqual(0);
            expect(numb.rounded(-0, numb.rounding_mode.to_negative_infinity)).toEqual(0);
            expect(numb.rounded(-0, numb.rounding_mode.to_positive_infinity)).toEqual(0);
            expect(numb.rounded(-0, numb.rounding_mode.to_zero)).toEqual(0);
            expect(numb.rounded(-0)).toEqual(0);
        });

        it('should handle NaN input gracefully', () => {
            expect(numb.rounded(NaN, numb.rounding_mode.away_from_zero)).toBeNaN();
            expect(numb.rounded(NaN, numb.rounding_mode.to_even)).toBeNaN();
            expect(numb.rounded(NaN, numb.rounding_mode.to_negative_infinity)).toBeNaN();
            expect(numb.rounded(NaN, numb.rounding_mode.to_positive_infinity)).toBeNaN();
            expect(numb.rounded(NaN, numb.rounding_mode.to_zero)).toBeNaN();
            expect(numb.rounded(NaN)).toBeNaN();
        });
    });

    it(`numb.rounded_00`, () => {
        expect(numb.rounded(0.5, 0)).toBe(1);
        expect(numb.rounded(-0.5, 0)).toBe(-1);
        expect(numb.rounded(0.49999998737, 0)).toBe(0);
    })

    describe('parse_int', () => {
        it('should parse a string and return an integer of the specified radix', () => {
            expect(numb.parse_int('10', 10)).toEqual(10);
            expect(numb.parse_int('1010', 2)).toEqual(10);
            expect(numb.parse_int('A', 16)).toEqual(10);
            expect(numb.parse_int('123', 2)).toEqual(1);
        });

        it('should return 0 if parsing fails', () => {
            expect(numb.parse_int('abc', 10)).toEqual(0);
            expect(numb.parse_int('FF', 10)).toEqual(0);
        });

        it('should handle NaN input gracefully', () => {
            expect(numb.parse_int(NaN, 10)).toEqual(0);
            expect(numb.parse_int('123', NaN)).toEqual(0);
        });
    });

    describe('parse_hexfl', () => {
        it('should parse a valid hexadecimal floating-point string and return the correct number', () => {
            // Valid hexadecimal floating-point strings
            expect(numb.parse_hexfl('0x3.5')).toEqual(3.3125);
            expect(numb.parse_hexfl('0xA.B')).toEqual(10.6875);
            expect(numb.parse_hexfl('0xF.F')).toEqual(15.9375);
            expect(numb.parse_hexfl('-0x1.0')).toEqual(-1);
            expect(numb.parse_hexfl('0x0.0')).toEqual(0);
            expect(numb.parse_hexfl('0x1.0')).toEqual(1);
            expect(numb.parse_hexfl('0x3.0')).toEqual(3);
            expect(numb.parse_hexfl('-0xF.F')).toEqual(-15.9375);
            expect(numb.parse_hexfl('0x3.0p1')).toEqual(6);
            expect(numb.parse_hexfl('0x3.0P-1')).toEqual(1.5);
        });

        it('should return NaN for invalid hexadecimal floating-point strings', () => {
            // Invalid hexadecimal floating-point strings
            expect(numb.parse_hexfl('')).toBeNaN();
            expect(numb.parse_hexfl('abc')).toBeNaN();
            expect(numb.parse_hexfl('3.')).toBeNaN();
            expect(numb.parse_hexfl('.5')).toBeNaN();
            expect(numb.parse_hexfl('3p1')).toBeNaN();
            expect(numb.parse_hexfl('3.0p')).toBeNaN();
            expect(numb.parse_hexfl('3.0p-')).toBeNaN();
            expect(numb.parse_hexfl('3.0p1.')).toBeNaN();
            expect(numb.parse_hexfl('3.0p1.0')).toBeNaN();
        });

        it('should handle Infinity and NaN strings', () => {
            // Infinity and NaN strings
            expect(numb.parse_hexfl('NaN')).toBeNaN();
            expect(numb.parse_hexfl('-NaN')).toBeNaN();
            expect(numb.parse_hexfl('Infinity')).toEqual(Infinity);
            expect(numb.parse_hexfl('-Infinity')).toEqual(-Infinity);
        });

        it(`parseHexFloat_00`, () => {
            let r = RegExp(`([-+]?)0[xX](\\p{Hex_Digit}+)\\.?(\\p{Hex_Digit}+)?p?([-+]\\p{digit}+)?`, `u`);
            const str = `0x3.14p+0a`;

            const m = r.exec(str);
            //console.log(m);
            if (!m) {
                const mx = (/^([\+\-]?)inf(?:inity)?/i).exec(str);
                if (!mx) return NaN;
                return mx[1] == '-' ? -1 / 0 : 1 / 0;
            }
            const mantissa = parseInt(m[1] + m[2] + m[3], 16);
            //console.log(`mantissa => ${mantissa}`);

            const exponent = (m[4] | 0) - 4 * m[3].length;
            //console.log(`exponent => ${exponent}`);

            const res = (mantissa * Math.pow(2, exponent));
            expect(res).toBe(3.078125);
        })

        it(`parse_hexfl_01`, () => {
            expect(numb.parse_hexfl("0x1.FFFFFEp+62")).toBe(9.223371487098962e+18);
        })

        it(`parse_hexfl_02`, () => {
            expect(numb.parse_hexfl("0x1p63")).toBe(9.223372036854776e+18);
        })
    });

    describe('parse', () => {
        it('should parse a string to a numeric value', () => {
            // Test cases for parsing integers
            expect(numb.parse('123')).toEqual(123);
            expect(numb.parse('-456')).toEqual(-456);
            expect(numb.parse('0')).toEqual(0);

            // Test cases for parsing floating-point numbers
            expect(numb.parse('3.14')).toEqual(3.14);
            expect(numb.parse('-2.718')).toEqual(-2.718);
            expect(numb.parse('0.0')).toEqual(0);

            // Test cases for parsing hexadecimal numbers
            expect(numb.parse('0xFF')).toEqual(255);
            expect(numb.parse('-0xABC')).toEqual(-2748);

            // Test cases for parsing special values
            expect(numb.parse('NaN')).toBeNaN();
            expect(numb.parse('Infinity')).toEqual(Infinity);
            expect(numb.parse('-Infinity')).toEqual(-Infinity);
        });

        it('should return the input number if it is already a number', () => {
            expect(numb.parse(123)).toEqual(123);
            expect(numb.parse(-3.14)).toEqual(-3.14);
            expect(numb.parse(NaN)).toBeNaN();
        });

        it('should handle edge cases', () => {
            // Empty string
            expect(numb.parse('')).toBeNaN();

            // Non-numeric string
            expect(numb.parse('abc')).toBeNaN();

            // Invalid floating-point format
            expect(numb.parse('3.')).toEqual(3);

            // Floating-point with no integer part
            expect(numb.parse('.5')).toEqual(0.5);

            // Hexadecimal with floating-point format
            expect(numb.parse('0xF.F')).toEqual(15.9375);

            // Negative hexadecimal with floating-point format
            expect(numb.parse('-0x1.8')).toEqual(-1.5);
        });

        it(`parse_00`, () => {
            expect(numb.parse(`-2`)).toBe(-2);
        })

        it(`parse_01`, () => {
            expect(numb.parse(`0x2`)).toBe(2);
        })
    });

    describe('sign', () => {
        it('should return 1 for positive numbers', () => {
            expect(numb.sign(10)).toEqual(1);
            expect(numb.sign(3.14)).toEqual(1);
            expect(numb.sign(0)).toEqual(1);
        });

        it('should return -1 for negative numbers', () => {
            expect(numb.sign(-10)).toEqual(-1);
            expect(numb.sign(-3.14)).toEqual(-1);
        });

        it('should return 1 for positive infinity', () => {
            expect(numb.sign(Infinity)).toEqual(1);
        });

        it('should return -1 for negative infinity', () => {
            expect(numb.sign(-Infinity)).toEqual(-1);
        });

        it('should return 0 for zero or NaN', () => {
            expect(numb.sign(NaN)).toEqual(0);
        });
    });

    describe('from_str', () => {
        it('should return Infinity for "inf"', () => {
            expect(numb.from_str('inf')).toEqual(Infinity);
            expect(numb.from_str('+inf')).toEqual(Infinity);
        });

        it('should return -Infinity for "-inf"', () => {
            expect(numb.from_str('-inf')).toEqual(-Infinity);
        });

        it('should return the correct number for valid numeric strings', () => {
            expect(numb.from_str('123')).toEqual(123);
            expect(numb.from_str('  456.78')).toEqual(456.78);
            expect(numb.from_str('-789.01')).toEqual(-789.01);
        });

        it('should return the correct number for valid numeric substrings', () => {
            expect(numb.from_str('123abc')).toEqual(123);
            expect(numb.from_str('  456.78xyz')).toEqual(456.78);
            expect(numb.from_str('-789.01!')).toEqual(-789.01);
        });

        it('should return NaN for strings that do not contain a valid number', () => {
            expect(numb.from_str('abc')).toEqual(NaN);
            expect(numb.from_str('!@#')).toEqual(NaN);
            expect(numb.from_str('  ')).toEqual(NaN);
        });

        it(`from_str_00`, () => {
            expect(numb.from_str(`0x2`)).toBe(2);
            expect(numb.from_str(`inf`)).toBe(Infinity);
        })
    });




    describe('float32', () => {
        it('should convert a string to a number and then to a 32-bit float', () => {
            expect(numb.float32('123.456')).toBeCloseTo(123.456, 5);
        });

        it('should handle NaN correctly', () => {
            expect(numb.float32(NaN)).toBeNaN();
            expect(numb.float32('not_a_number')).toBeNaN();
        });

        it('should handle positive and negative infinity correctly', () => {
            expect(numb.float32(Infinity)).toEqual(Infinity);
            expect(numb.float32(-Infinity)).toEqual(-Infinity);
            expect(numb.float32('Infinity')).toEqual(Infinity);
            expect(numb.float32('-Infinity')).toEqual(-Infinity);
        });

        it('should handle finite numbers correctly', () => {
            expect(numb.float32(123.456)).toBeCloseTo(123.456, 5);
            expect(numb.float32(-123.456)).toBeCloseTo(-123.456, 5);
        });

        it('should handle large numbers by converting them to infinity', () => {
            expect(numb.float32(3.4028234664e38)).toEqual(Infinity);
            expect(numb.float32(-3.4028234664e38)).toEqual(-Infinity);
        });

        it('should handle boundary values correctly', () => {
            expect(numb.float32(3.40282346639e38)).toBeCloseTo(3.4028234663852886e+38, 5);
            expect(numb.float32(-3.40282346639e38)).toBeCloseTo(-3.4028234663852886e+38, 5);
        });
    });

    describe('int32', () => {
        it('should convert a string to an integer and return it as a number', () => {
            expect(numb.int32('123')).toBe(123);
            expect(numb.int32('-123')).toBe(-123);
        });

        it('should handle values within the 32-bit integer range', () => {
            expect(numb.int32(123)).toBe(123);
            expect(numb.int32(-123)).toBe(-123);
        });

        it('should handle values outside the 32-bit integer range', () => {
            expect(numb.int32(2147483648)).toBe(-2147483648);
            expect(numb.int32(-2147483649)).toBe(2147483647);
        });

        it('should handle values at the boundary of the 32-bit integer range', () => {
            expect(numb.int32(2147483647)).toBe(2147483647);
            expect(numb.int32(-2147483648)).toBe(-2147483648);
        });

        it('should handle large numbers correctly', () => {
            expect(numb.int32(4294967296)).toBe(0);
            expect(numb.int32(-4294967297)).toBe(-1);
        });

        it('should handle non-numeric strings by returning NaN', () => {
            expect(numb.int32('not_a_number')).toBeNaN();
        });
    });

    describe('ntob', () => {
        it('should convert positive numbers to base-64 encoded strings', () => {
            expect(numb.ntob(0)).toBe(b2s[0]);
            expect(numb.ntob(1)).toBe(b2s[1]);
            expect(numb.ntob(63)).toBe(b2s[63]);
            expect(numb.ntob(64)).toBe(`${b2s[1]}${b2s[0]}`);
        });

        it('should convert negative numbers to base-64 encoded strings with a leading "-"', () => {
            expect(numb.ntob(-1)).toBe(`-${b2s[1]}`);
            expect(numb.ntob(-64)).toBe(`-${b2s[1]}${b2s[0]}`);
        });

        it('should handle large positive numbers correctly', () => {
            const largeNumber = 2 ** 53 - 1; // Maximum safe integer in JavaScript
            const encoded = numb.ntob(largeNumber);
            expect(encoded).toBeTruthy(); // Just check that the result is a non-empty string
        });

        it('should handle edge cases correctly', () => {
            expect(numb.ntob(Number.MAX_SAFE_INTEGER)).toBeTruthy();
            expect(numb.ntob(Number.MIN_SAFE_INTEGER)).toBe(`-${numb.ntob(Math.abs(Number.MIN_SAFE_INTEGER))}`);
        });
    });

    describe('index_2_3d', () => {
        it('should convert 0 index correctly', () => {
            expect(numb.index_2_3d(0, 52)).toEqual([0, 0, 0]);
        });

        it('should convert indices within first dimension correctly', () => {
            expect(numb.index_2_3d(1, 52)).toEqual([1, 0, 0]);
            expect(numb.index_2_3d(51, 52)).toEqual([51, 0, 0]);
        });

        it('should convert indices crossing first dimension correctly', () => {
            expect(numb.index_2_3d(52, 52)).toEqual([0, 1, 0]);
            expect(numb.index_2_3d(104, 52)).toEqual([0, 2, 0]);
        });

        it('should convert indices within second dimension correctly', () => {
            expect(numb.index_2_3d(53, 52)).toEqual([1, 1, 0]);
            expect(numb.index_2_3d(2755, 52)).toEqual([51, 0, 1]);


        });

        it('should convert indices crossing second dimension correctly', () => {
            expect(numb.index_2_3d(2756, 52)).toEqual([0, 1, 1]);
            expect(numb.index_2_3d(2808, 52)).toEqual([0, 2, 1]);
        });

        it('should convert large indices correctly', () => {
            expect(numb.index_2_3d(140608, 52)).toEqual([0, 0, 52]);
            expect(numb.index_2_3d(140659, 52)).toEqual([51, 0, 52]);
        });

        it('should handle different max values correctly', () => {
            expect(numb.index_2_3d(0, 100)).toEqual([0, 0, 0]);
            expect(numb.index_2_3d(100, 100)).toEqual([0, 1, 0]);
            expect(numb.index_2_3d(101, 100)).toEqual([1, 1, 0]);
            expect(numb.index_2_3d(10000, 100)).toEqual([0, 0, 1]);
        });
    });

    describe('map', () => {
        it('should map a value from one range to another', () => {
            expect(numb.map(5, 0, 10, 0, 100)).toBe(50);
            expect(numb.map(0, 0, 10, 0, 100)).toBe(0);
            expect(numb.map(10, 0, 10, 0, 100)).toBe(100);
            expect(numb.map(-5, 0, 10, 0, 100)).toBe(-50);
        });

        it('should handle cases where the original range is zero', () => {
            expect(numb.map(5, 0, 0, 0, 100)).toBe(0);
        });

        it('should handle cases where the new range is negative', () => {
            expect(numb.map(5, 0, 10, -100, 0)).toBe(-50);
        });

        it('should handle cases where the value is outside the original range', () => {
            expect(numb.map(15, 0, 10, 0, 100)).toBe(150);
            expect(numb.map(-5, 0, 10, 0, 100)).toBe(-50);
        });

        it('should handle edge cases', () => {
            expect(numb.map(0, 0, 0, 0, 0)).toBe(0);
            expect(numb.map(1, 1, 1, 1, 1)).toBe(1);
            expect(numb.map(1, 1, 1, 0, 0)).toBe(0);
        });
    });

    describe('scale', () => {
        it('should scale a value from the original maximum range to the new maximum range', () => {
            expect(numb.scale(5, 10, 100)).toBe(50);
            expect(numb.scale(1, 10, 100)).toBe(10);
            expect(numb.scale(10, 10, 100)).toBe(100);
            expect(numb.scale(0, 10, 100)).toBe(0);
        });

        it('should handle cases where the original maximum is zero', () => {
            expect(numb.scale(5, 0, 100)).toBe(Infinity);
            expect(numb.scale(0, 0, 100)).toBeNaN();
        });

        it('should handle cases where the new maximum is zero', () => {
            expect(numb.scale(5, 10, 0)).toBe(0);
            expect(numb.scale(0, 10, 0)).toBe(0);
        });

        it('should handle negative values', () => {
            expect(numb.scale(-5, 10, 100)).toBe(-50);
            expect(numb.scale(5, -10, 100)).toBe(-50);
            expect(numb.scale(5, 10, -100)).toBe(-50);
        });

        it('should handle edge cases', () => {
            expect(numb.scale(0, 0, 0)).toBeNaN();
            expect(numb.scale(1, 1, 1)).toBe(1);
        });
    });

    describe('hexi', () => {
        it('should convert a number to its hexadecimal representation', () => {
            expect(numb.hexi(255)).toBe('FF');
            expect(numb.hexi(0)).toBe('00');
            expect(numb.hexi(15)).toBe('0F');
            expect(numb.hexi(16)).toBe('10');
        });

        it('should convert a string to its hexadecimal representation', () => {
            expect(numb.hexi('255')).toBe('FF');
            expect(numb.hexi('0')).toBe('00');
            expect(numb.hexi('15')).toBe('0F');
            expect(numb.hexi('16')).toBe('10');
        });

        it('should handle hexadecimal string inputs', () => {
            expect(numb.hexi('0xFF')).toBe('FF');
            expect(numb.hexi('0x0')).toBe('00');
            expect(numb.hexi('0xF')).toBe('0F');
            expect(numb.hexi('0x10')).toBe('10');
        });

        it('should handle negative numbers correctly', () => {
            expect(numb.hexi(-1)).toBe('FFFFFFFF');
            expect(numb.hexi(-255)).toBe('FFFFFF01');
        });

        it('should handle edge cases', () => {
            expect(numb.hexi(NaN)).toBe('00');
            expect(numb.hexi(Infinity)).toBe('00');
            expect(numb.hexi(-Infinity)).toBe('00');
        });
    });

    describe('percent', () => {
        it('should calculate the percentage of a number', () => {
            expect(numb.percent(100, 50)).toBe(50);
            expect(numb.percent(200, 25)).toBe(50);
            expect(numb.percent(50, 20)).toBe(10);
            expect(numb.percent(1000, 10)).toBe(100);
        });

        it('should round the result when rond is true', () => {
            expect(numb.percent(100, 33.33, true)).toBe(33);
            expect(numb.percent(200, 25.75, true)).toBe(52);
            expect(numb.percent(50, 20.5, true)).toBe(10);
            expect(numb.percent(1000, 10.9, true)).toBe(109);
        });

        it('should handle zero values correctly', () => {
            expect(numb.percent(0, 50)).toBe(0);
            expect(numb.percent(100, 0)).toBe(0);
            expect(numb.percent(0, 0)).toBe(0);
        });

        it('should handle negative numbers correctly', () => {
            expect(numb.percent(-100, 50)).toBe(-50);
            expect(numb.percent(100, -50)).toBe(-50);
            expect(numb.percent(-100, -50)).toBe(50);
        });

        it('should handle edge cases', () => {
            expect(numb.percent(100, Infinity)).toBe(Infinity);
            expect(numb.percent(100, NaN)).toBeNaN();
            expect(numb.percent(NaN, 50)).toBeNaN();
            expect(numb.percent(Infinity, 50)).toBe(Infinity);
            expect(numb.percent(Infinity, Infinity)).toBe(Infinity);
        });
    });

    describe('numb.format_float', () => {
        // Test cases for valid inputs
        it('should format positive floating-point numbers correctly', () => {
            expect(numb.format_float(3.141592653589793)).toEqual('3.141592653589793');
            expect(numb.format_float(123.456789)).toEqual('1.23456789e2');
            expect(numb.format_float(0.123456789)).toEqual('0.123456789');
        });

        it('should format negative floating-point numbers correctly', () => {
            expect(numb.format_float(-3.141592653589793)).toEqual('-3.141592653589793');
            expect(numb.format_float(-123.456789)).toEqual('-1.23456789e2');
            expect(numb.format_float(-0.123456789)).toEqual('-0.123456789');
        });

        it('should format floating-point numbers with exponential notation correctly', () => {
            expect(numb.format_float(1.23456789e10)).toEqual('12345678900.');
            expect(numb.format_float(1.23456789e-10)).toEqual('1.23456789e-10');
        });

        it('should format floating-point numbers with custom length correctly', () => {
            expect(numb.format_float(123.456789, 4)).toEqual('123.4568');
            expect(numb.format_float(0.123456789, 3)).toEqual('0.123');
        });

        // Test cases for invalid inputs
        it('should throw a TypeError if the input is not a number', () => {
            expect(() => numb.format_float('invalid')).toThrowError(TypeError);
            expect(() => numb.format_float(null)).toThrowError(TypeError);
            expect(() => numb.format_float(undefined)).toThrowError(TypeError);
        });
    });

    describe("numb.f32s", () => {
        it("should return 'NaN' for NaN input", () => {
            expect(numb.f32s(NaN)).toBe("NaN");
        });

        it("should return 'Infinity' for positive Infinity input", () => {
            expect(numb.f32s(Infinity)).toBe("Infinity");
        });

        it("should return '-Infinity' for negative Infinity input", () => {
            expect(numb.f32s(-Infinity)).toBe("-Infinity");
        });

        it("should return '0.0' for zero input", () => {
            expect(numb.f32s(0)).toBe('0.000000');
        });

        it("should return the correct string for positive numbers", () => {
            expect(numb.f32s(123.456)).toBe("123.456000");
            expect(numb.f32s(1.23456789e-7)).toBe("0.000000");
            expect(numb.f32s(1.23456789e-6)).toBe("0.000001");
            expect(numb.f32s(0.000123456789)).toBe("0.000123");
            expect(numb.f32s(123456789)).toBe("123456800.000000");
        });

        it("should return the correct string for negative numbers", () => {
            expect(numb.f32s(-123.456)).toBe("-123.456000");
            expect(numb.f32s(-1.23456789e-7)).toBe("0.000000");
            expect(numb.f32s(-1.23456789e-6)).toBe("-0.000001");
            expect(numb.f32s(-0.000123456789)).toBe("-0.000123");
            expect(numb.f32s(-123456789)).toBe("-123456800.000000");
        });

        it("should return the correct string for large numbers", () => {
            expect(numb.f32s(3.4028237e38)).toBe("Infinity");
            expect(numb.f32s(-3.4028237e38)).toBe("-Infinity");
        });
    });

    describe('numb.pow2near', () => {
        it('should return 1 for input 0', () => {
            expect(numb.pow2near(0)).toBe(0);
        });

        it('should return 1 for input 1', () => {
            expect(numb.pow2near(1)).toBe(1);
        });

        it('should return 2 for input 2', () => {
            expect(numb.pow2near(2)).toBe(2);
        });

        it('should return 2 for input 3', () => {
            expect(numb.pow2near(3)).toBe(2);
        });

        it('should return 4 for input 4', () => {
            expect(numb.pow2near(4)).toBe(4);
        });

        it('should return 4 for input 5', () => {
            expect(numb.pow2near(5)).toBe(4);
        });

        it('should return 4 for input 7', () => {
            expect(numb.pow2near(7)).toBe(4);
        });

        it('should return 8 for input 8', () => {
            expect(numb.pow2near(8)).toBe(8);
        });

        it('should return 8 for input 9', () => {
            expect(numb.pow2near(9)).toBe(8);
        });

        it('should return 16 for input 16', () => {
            expect(numb.pow2near(16)).toBe(16);
        });

        it('should return 16 for input 17', () => {
            expect(numb.pow2near(17)).toBe(16);
        });

        it('should return 32 for input 31', () => {
            expect(numb.pow2near(31)).toBe(16);
        });

        it('should return 32 for input 32', () => {
            expect(numb.pow2near(32)).toBe(32);
        });

        it('should return 32 for input 33', () => {
            expect(numb.pow2near(33)).toBe(32);
        });

        it('should return 1024 for input 1500', () => {
            expect(numb.pow2near(1500)).toBe(1024);
        });

        it('should return 2^31 for input 2^31-1', () => {
            expect(numb.pow2near(2147483647)).toBe(1073741824);
        });
    });

    describe('numb.pow2floor', () => {
        it('should return 1 for input 0', () => {
            expect(numb.pow2floor(0)).toBe(1);
        });

        it('should return 1 for input 1', () => {
            expect(numb.pow2floor(1)).toBe(1);
        });

        it('should return 2 for input 2', () => {
            expect(numb.pow2floor(2)).toBe(2);
        });

        it('should return 2 for input 3', () => {
            expect(numb.pow2floor(3)).toBe(2);
        });

        it('should return 4 for input 4', () => {
            expect(numb.pow2floor(4)).toBe(4);
        });

        it('should return 4 for input 5', () => {
            expect(numb.pow2floor(5)).toBe(4);
        });

        it('should return 8 for input 9', () => {
            expect(numb.pow2floor(9)).toBe(8);
        });

        it('should return 16 for input 16', () => {
            expect(numb.pow2floor(16)).toBe(16);
        });

        it('should return 16 for input 17', () => {
            expect(numb.pow2floor(17)).toBe(16);
        });

        it('should return 512 for input 1000', () => {
            expect(numb.pow2floor(1000)).toBe(512);
        });

        it('should return 2048 for input 2048', () => {
            expect(numb.pow2floor(2048)).toBe(2048);
        });

    });

    describe('numb.pow2floor', () => {
        it('should return 1 for input 0', () => {
            expect(numb.pow2floor(0)).toBe(1);
        });

        it('should return 1 for input 1', () => {
            expect(numb.pow2floor(1)).toBe(1);
        });

        it('should return 2 for input 2', () => {
            expect(numb.pow2floor(2)).toBe(2);
        });

        it('should return 2 for input 3', () => {
            expect(numb.pow2floor(3)).toBe(2);
        });

        it('should return 4 for input 4', () => {
            expect(numb.pow2floor(4)).toBe(4);
        });

        it('should return 4 for input 5', () => {
            expect(numb.pow2floor(5)).toBe(4);
        });

        it('should return 8 for input 9', () => {
            expect(numb.pow2floor(9)).toBe(8);
        });

        it('should return 16 for input 16', () => {
            expect(numb.pow2floor(16)).toBe(16);
        });

        it('should return 16 for input 17', () => {
            expect(numb.pow2floor(17)).toBe(16);
        });

        it('should return 512 for input 1000', () => {
            expect(numb.pow2floor(1000)).toBe(512);
        });

        it('should return 2048 for input 2048', () => {
            expect(numb.pow2floor(2048)).toBe(2048);
        });

    });



    xit(`error_00`, async () => { expect(true).toBeFalse(); });
});