import { kind_of } from "../lib/global.js";
import { X, Y } from "../lib/gui/point.js";
import { x1, x2, y1, y2 } from "../lib/gui/rect.js";
import { HEIGHT, WIDTH } from "../lib/gui/size.js";

export const FLOAT_THRESHOLD = 0.0001;

/**
 * Tests if the given object is a point and checks its coordinates.
 * @param {Object} obj - The object to test.
 * @param {number} v1 - The expected value for the x-coordinate.
 * @param {number} v2 - The expected value for the y-coordinate.
 * @param {number} dec - The number of decimal places to consider for comparison.
 */
export const test_point = (obj, v1, v2, dec) => {
    // Ensure that the object is of type 'point'
    expect(kind_of(obj)).toBe(`point`);

    // Check if the object's X-coordinate is close to the expected value
    expect(obj[X]).toBeCloseTo(v1, dec);

    // Check if the object's Y-coordinate is close to the expected value
    expect(obj[Y]).toBeCloseTo(v2, dec);

    // Check if the object's 'x' property is close to the expected value
    expect(obj.x).toBeCloseTo(v1, dec);

    // Check if the object's 'y' property is close to the expected value
    expect(obj.y).toBeCloseTo(v2, dec);

    // Check if the object's Manhattan length is close to the sum of absolute values of its coordinates
    expect(obj.manhattan_length).toBeCloseTo(Math.abs(v1) + Math.abs(v2), dec);
};

/**
 * Tests if the given object is a size and checks its dimensions.
 * @param {Object} obj - The object to test.
 * @param {number} v1 - The expected value for the width.
 * @param {number} v2 - The expected value for the height.
 * @param {number} dec - The number of decimal places to consider for comparison.
 */
export const test_size = (obj, v1, v2, dec) => {
    // Ensure that the object is of type 'size'
    expect(kind_of(obj)).toBe(`size`);

    // Check if the object's width is close to the expected value
    expect(obj[WIDTH]).toBeCloseTo(v1, dec);

    // Check if the object's height is close to the expected value
    expect(obj[HEIGHT]).toBeCloseTo(v2, dec);

    // Check if the object's 'width' property is close to the expected value
    expect(obj.width).toBeCloseTo(v1, dec);

    // Check if the object's 'height' property is close to the expected value
    expect(obj.height).toBeCloseTo(v2, dec);
};

/**
 * Tests if the given object is a line and checks its coordinates and deltas.
 * @param {Object} obj - The object to test.
 * @param {number} v1 - The expected value for the x-coordinate of the first point.
 * @param {number} v2 - The expected value for the y-coordinate of the first point.
 * @param {number} v3 - The expected value for the x-coordinate of the second point.
 * @param {number} v4 - The expected value for the y-coordinate of the second point.
 * @param {number} dec - The number of decimal places to consider for comparison.
 */
export const test_line = (obj, v1, v2, v3, v4, dec) => {
    // Ensure that the object is of type 'line'
    expect(kind_of(obj)).toBe(`line`);

    // Check if the object's coordinates are close to the expected values
    expect(obj[x1]).toBeCloseTo(v1, dec);
    expect(obj[y1]).toBeCloseTo(v2, dec);
    expect(obj[x2]).toBeCloseTo(v3, dec);
    expect(obj[y2]).toBeCloseTo(v4, dec);

    // Check if the object's properties are close to the expected values
    expect(obj.x1).toBeCloseTo(v1, dec);
    expect(obj.y1).toBeCloseTo(v2, dec);
    expect(obj.x2).toBeCloseTo(v3, dec);
    expect(obj.y2).toBeCloseTo(v4, dec);

    // Test the points of the line
    test_point(obj.p1, v1, v2, dec);
    test_point(obj.p2, v3, v4, dec);

    // Check if the object's deltas are close to the expected values
    expect(obj.dx).toBeCloseTo(v3 - v1, dec);
    expect(obj.dy).toBeCloseTo(v4 - v2, dec);
};

/**
 * Tests if the given object is a rectangle and checks its properties.
 * @param {Object} obj - The object to test.
 * @param {number} left - The expected value for the left coordinate.
 * @param {number} top - The expected value for the top coordinate.
 * @param {number} right - The expected value for the right coordinate.
 * @param {number} bottom - The expected value for the bottom coordinate.
 * @param {number} x - The expected value for the x-coordinate of the top-left corner.
 * @param {number} y - The expected value for the y-coordinate of the top-left corner.
 * @param {number} width - The expected value for the width of the rectangle.
 * @param {number} height - The expected value for the height of the rectangle.
 * @param {number} dec - The number of decimal places to consider for comparison.
 */
export const test_rect = (obj, left, top, right, bottom, x, y, width, height, dec) => {
    // Ensure that the object is of type 'rect'
    //console.log(obj.kind, kind_of(obj));
    expect(kind_of(obj)).toBe(`rect`);

    // Check if the object's properties are close to the expected values
    expect(obj.left).toBeCloseTo(left, dec);
    expect(obj.top).toBeCloseTo(top, dec);
    expect(obj.right).toBeCloseTo(right, dec);
    expect(obj.bottom).toBeCloseTo(bottom, dec);
    expect(obj.x).toBeCloseTo(x, dec);
    expect(obj.y).toBeCloseTo(y, dec);
    expect(obj.width).toBeCloseTo(width, dec);
    expect(obj.height).toBeCloseTo(height, dec);
};

export const test_ref = () => {};

/**
 * Tests if the given object is a 3x3 matrix and checks its properties.
 * @param {Object} obj - The object to test.
 * @param {number} v11 - The expected value for the element at row 1, column 1.
 * @param {number} v12 - The expected value for the element at row 1, column 2.
 * @param {number} v13 - The expected value for the element at row 1, column 3.
 * @param {number} v21 - The expected value for the element at row 2, column 1.
 * @param {number} v22 - The expected value for the element at row 2, column 2.
 * @param {number} v23 - The expected value for the element at row 2, column 3.
 * @param {number} v31 - The expected value for the element at row 3, column 1.
 * @param {number} v32 - The expected value for the element at row 3, column 2.
 * @param {number} v33 - The expected value for the element at row 3, column 3.
 * @param {number} flag - The expected flag value.
 * @param {number} dec - The number of decimal places to consider for comparison.
 */
export const test_mat3 = (obj, v11, v12, v13, v21, v22, v23, v31, v32, v33, flag, dec) => {
    // Ensure that the object is of type 'mat3' with correct rows, cols, and flag
    expect(kind_of(obj)).toBe(`mat3`);
    expect(obj.rows).toBe(3);
    expect(obj.cols).toBe(3);
    expect(obj.flag).toBe(flag);

    // Check if the object's elements are close to the expected values
    expect(obj[0]).toBeCloseTo(v11, dec);
    expect(obj[1]).toBeCloseTo(v12, dec);
    expect(obj[2]).toBeCloseTo(v13, dec);
    expect(obj[3]).toBeCloseTo(v21, dec);
    expect(obj[4]).toBeCloseTo(v22, dec);
    expect(obj[5]).toBeCloseTo(v23, dec);
    expect(obj[6]).toBeCloseTo(v31, dec);
    expect(obj[7]).toBeCloseTo(v32, dec);
    expect(obj[8]).toBeCloseTo(v33, dec);

    // Check if the object's properties are close to the expected values
    expect(obj.m11).toBeCloseTo(v11, dec);
    expect(obj.m12).toBeCloseTo(v12, dec);
    expect(obj.m13).toBeCloseTo(v13, dec);
    expect(obj.m21).toBeCloseTo(v21, dec);
    expect(obj.m22).toBeCloseTo(v22, dec);
    expect(obj.m23).toBeCloseTo(v23, dec);
    expect(obj.m31).toBeCloseTo(v31, dec);
    expect(obj.m32).toBeCloseTo(v32, dec);
    expect(obj.m33).toBeCloseTo(v33, dec);

    // Check if the object's dx and dy properties are close to the expected values
    expect(obj.dx).toBeCloseTo(v31, dec);
    expect(obj.dy).toBeCloseTo(v32, dec);
};

/**
 * Tests if the given object is a 4x4 matrix and checks its properties.
 * @param {Object} obj - The object to test.
 * @param {number} v11 - The expected value for the element at row 1, column 1.
 * @param {number} v12 - The expected value for the element at row 1, column 2.
 * @param {number} v13 - The expected value for the element at row 1, column 3.
 * @param {number} v14 - The expected value for the element at row 1, column 4.
 * @param {number} v21 - The expected value for the element at row 2, column 1.
 * @param {number} v22 - The expected value for the element at row 2, column 2.
 * @param {number} v23 - The expected value for the element at row 2, column 3.
 * @param {number} v24 - The expected value for the element at row 2, column 4.
 * @param {number} v31 - The expected value for the element at row 3, column 1.
 * @param {number} v32 - The expected value for the element at row 3, column 2.
 * @param {number} v33 - The expected value for the element at row 3, column 3.
 * @param {number} v34 - The expected value for the element at row 3, column 4.
 * @param {number} v41 - The expected value for the element at row 4, column 1.
 * @param {number} v42 - The expected value for the element at row 4, column 2.
 * @param {number} v43 - The expected value for the element at row 4, column 3.
 * @param {number} v44 - The expected value for the element at row 4, column 4.
 * @param {string} flag - The expected flag value.
 * @param {number} dec - The number of decimal places to consider for comparison.
 */
export const test_mat4 = (obj, v11, v12, v13, v14, v21, v22, v23, v24, v31, v32, v33, v34, v41, v42, v43, v44, flag, dec) => {
    // Ensure that the object is of type 'mat4' with correct rows, cols, and flag
    expect(kind_of(obj)).toBe(`mat4`);
    expect(obj.rows).toBe(4);
    expect(obj.cols).toBe(4);
    expect(obj.flag).toBe(flag);
    expect(obj.length).toBe(16);

    // Check if the object's elements are close to the expected values
    expect(obj[0]).toBeCloseTo(v11, dec);
    expect(obj[1]).toBeCloseTo(v12, dec);
    expect(obj[2]).toBeCloseTo(v13, dec);
    expect(obj[3]).toBeCloseTo(v14, dec);
    expect(obj[4]).toBeCloseTo(v21, dec);
    expect(obj[5]).toBeCloseTo(v22, dec);
    expect(obj[6]).toBeCloseTo(v23, dec);
    expect(obj[7]).toBeCloseTo(v24, dec);
    expect(obj[8]).toBeCloseTo(v31, dec);
    expect(obj[9]).toBeCloseTo(v32, dec);
    expect(obj[10]).toBeCloseTo(v33, dec);
    expect(obj[11]).toBeCloseTo(v34, dec);
    expect(obj[12]).toBeCloseTo(v41, dec);
    expect(obj[13]).toBeCloseTo(v42, dec);
    expect(obj[14]).toBeCloseTo(v43, dec);
    expect(obj[15]).toBeCloseTo(v44, dec);

    // Check if the object's properties are close to the expected values
    expect(obj.m11).toBeCloseTo(v11, dec);
    expect(obj.m12).toBeCloseTo(v12, dec);
    expect(obj.m13).toBeCloseTo(v13, dec);
    expect(obj.m14).toBeCloseTo(v14, dec);
    expect(obj.m21).toBeCloseTo(v21, dec);
    expect(obj.m22).toBeCloseTo(v22, dec);
    expect(obj.m23).toBeCloseTo(v23, dec);
    expect(obj.m24).toBeCloseTo(v24, dec);
    expect(obj.m31).toBeCloseTo(v31, dec);
    expect(obj.m32).toBeCloseTo(v32, dec);
    expect(obj.m33).toBeCloseTo(v33, dec);
    expect(obj.m34).toBeCloseTo(v34, dec);
    expect(obj.m41).toBeCloseTo(v41, dec);
    expect(obj.m42).toBeCloseTo(v42, dec);
    expect(obj.m43).toBeCloseTo(v43, dec);
    expect(obj.m44).toBeCloseTo(v44, dec);
};

export const test_poly = (obj, pnumb, coor, dec) => {
    expect(kind_of(obj)).toBe(`poly`);
    expect(obj.length).toBe(pnumb);

    for (let i = 0; i < pnumb; ++i) {
        expect(obj[i][0]).toBeCloseTo(coor[i * 2], dec);
        expect(obj[i][1]).toBeCloseTo(coor[i * 2 + 1], dec);
    }
};

export const test_matg = (obj, rows, cols, numbs, dec) => {
    expect(kind_of(obj)).toBe(`matg`);
    expect(obj.rows).toBe(rows);
    expect(obj.cols).toBe(cols); 

    for (let col = 0; col < cols; ++col) {
        for (let row = 0; row < rows; ++row) {
            expect(obj[row * cols + col]).toBeCloseTo(numbs[row * cols + col], dec);
        }
    }
};

/**
 * Tests if the given object contains tokens and checks their properties.
 * @param {Object} obj - The object containing tokens.
 * @param {string[]} test - An array of strings representing expected token values.
 */
export const test_tokens = (obj, test) => {
    // Check if the object contains tokens
    if (obj.length === 0) {
        // If no tokens are present, front and back tokens should be undefined
        expect(obj.front).toBe(undefined);
        expect(obj.back).toBe(undefined);
        return;
    }

    // Assert that the number of tokens matches the length of the test array
    expect(obj.length).toBe(test.length);

    // Assert that front and back tokens are defined and have correct references
    expect(obj.front).toBeDefined();
    expect(obj.back).toBeDefined();
    expect(obj.front._prev).toBe(undefined);
    expect(obj.back._next).toBe(undefined);

    // Initialize variables to track previous and next tokens
    let prev = null;
    let next = null;

    // Iterate through the tokens and check their properties
    for (let token = obj._first, index = 0; token && index < test.length; token = token._next, ++index) {
        // Assert that the token's string value matches the corresponding value in the test array
        expect(token.str).toBe(test[index]);

        // Assert that the previous and next tokens have correct string values
        if (token.prev) expect(token.prev.str).toBe(test[index - 1]);
        if (token.next) expect(token.next.str).toBe(test[index + 1]);

        // Assert that the previous and next token references are correct
        if (prev) expect(token._prev).toBe(prev);
        if (next) expect(token).toBe(next);

        // Assert that the current token is the front or back token
        if (index === 0) expect(token).toBe(obj.front);
        else if (index === test.length - 1) expect(token).toBe(obj.back);

        // Update previous and next token references
        prev = token;
        next = token._next;
    }
};
