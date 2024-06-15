import { pool } from '../../lib/array.js';
import {
    pointf, pointi, point_add, point_div, point_f32p,
    point_f32p_ref, point_i16p, point_i16p_ref,
    point_mult, point_rem, point_transpose, X, Y,
    point_cardinal_to_cartesian,
    point_to_css,
    point_to_string
} from '../../lib/gui/point.js'
import { test_point } from '../test.js';;
describe('point constant test', () => {
    it(`X_00`, () => {
        expect(X).toBe(0);
    })
    it(`Y_00`, () => {
        expect(Y).toBe(1);
    })
})

// Test suite for the pointi class
describe('pointi', () => {
    // Test case for constructing a point with default coordinates
    it('should construct a point with default coordinates', () => {
        const p = new pointi();
        expect(p[X]).toBe(0);
        expect(p[Y]).toBe(0);
    });

    // Test case for constructing a point with specific coordinates
    it('should construct a point with specific coordinates', () => {
        const p = new pointi(3, 4);
        expect(p[X]).toBe(3);
        expect(p[Y]).toBe(4);
    });

});

describe('pointf', () => {
    // Test case for constructing a point with default coordinates
    it('should construct a point with default coordinates', () => {
        const p = new pointf();
        expect(p[X]).toBe(0);
        expect(p[Y]).toBe(0);
    });

    // Test case for constructing a point with specific coordinates
    it('should construct a point with specific coordinates', () => {
        const p = new pointf(3.5, 4.2);
        expect(p[X]).toBe(Math.fround(3.5));
        expect(p[Y]).toBe(Math.fround(4.2));
    });

    // Test case for parsing non-numeric input to 0
    it('should parse non-numeric input to 0', () => {
        const p = new pointf('a', 'b');
        expect(p[X]).toBe(0);
        expect(p[Y]).toBe(0);
    });
});

describe(`point_i16p test`, () => {
    it(`constructor_00`, () => {
        let p = new pool();
        p.init(point_i16p.BYTES_LENGTH * 1);
        let a = new point_i16p(p, -80, 56);
        test_point(a, -80, 56, 0);
        a.x = -22;
        a.y = -41;
        test_point(a, -22, -41, 0);
    })
})

describe(`point_i16p_ref test`, () => {
    it(`constructor_00`, () => {
        let p = new pool();
        p.init(point_i16p.BYTES_LENGTH * 1);
        let a = new point_i16p(p, -80, 64);
        let b = new point_i16p_ref(a.buffer, a.byteOffset);
        test_point(a, -80, 64, 0);
        test_point(b, -80, 64, 0);
        a.x = -2;
        a.y = 28;
        test_point(a, -2, 28, 0);
        test_point(b, -2, 28, 0);
    })
})

describe(`point_f32p test`, () => {
    it(`constructor_00`, () => {
        let p = new pool();
        p.init(point_f32p.BYTES_LENGTH * 1);
        let a = new point_f32p(p, -93.2640228271484375, -90.234588623046875);
        test_point(a, -93.2640228271484375, -90.234588623046875, 0);
        a.x = 52.4783;
        a.y = -92.1667;
        test_point(a, 52.478321075439453125, -92.1666717529296875, 0);
    })
})

describe(`point_f32p_ref test`, () => {
    it(`constructor_00`, () => {
        let p = new pool();
        p.init(point_f32p.BYTES_LENGTH * 1);
        let a = new point_f32p(p, 11.60491275787353515625, 23.5782184600830078125);
        let b = new point_f32p_ref(a.buffer, a.byteOffset);
        test_point(a, 11.60491275787353515625, 23.5782184600830078125, 0);
        test_point(b, 11.60491275787353515625, 23.5782184600830078125, 0);
        a.x = -99.918;
        a.y = -95.735;
        test_point(a, -99.9180145263671875, -95.7349700927734375, 0);
        test_point(b, -99.9180145263671875, -95.7349700927734375, 0);
    })
})

describe(`point_func test`, () => {

    // Test suite for the point_transpose function
    describe('point_transpose', () => {
        // Test case for transposing a point with positive coordinates
        it('should transpose a point with positive coordinates', () => {
            const p = new pointi(3, 5);
            const transposed = point_transpose(p);
            expect(transposed.x).toBe(5);
            expect(transposed.y).toBe(3);
        });

        // Test case for transposing a point with negative coordinates
        it('should transpose a point with negative coordinates', () => {
            const p = new pointi(-3, -5);
            const transposed = point_transpose(p);
            expect(transposed.x).toBe(-5);
            expect(transposed.y).toBe(-3);
        });

        // Test case for transposing a point with one positive and one negative coordinate
        it('should transpose a point with one positive and one negative coordinate', () => {
            const p = new pointi(3, -5);
            const transposed = point_transpose(p);
            expect(transposed.x).toBe(-5);
            expect(transposed.y).toBe(3);
        });

        // Test case for transposing a point with zero coordinates
        it('should transpose a point with zero coordinates', () => {
            const p = new pointi(0, 0);
            const transposed = point_transpose(p);
            expect(transposed.x).toBe(0);
            expect(transposed.y).toBe(0);
        });

        it(`point_transpose_00`, () => {
            let a = new pointi(24, -14);
            let b = point_transpose(a);
            test_point(a, -14, 24, 0);
            test_point(b, -14, 24, 0);
        })

        it(`point_transpose_01`, () => {
            let a = new pointf(42.531642913818359375, 75.04323577880859375);
            let b = point_transpose(a);
            test_point(a, 75.04323577880859375, 42.531642913818359375, 3);
            test_point(b, 75.04323577880859375, 42.531642913818359375, 3);
        })

        it(`point_transpose_02`, () => {
            let p = new pool();
            p.init(point_i16p.BYTES_LENGTH * 1);
            let a = new point_i16p(p, 99, -17);
            let b = point_transpose(a);
            test_point(a, -17, 99, 0);
            test_point(b, -17, 99, 0);
        })

        it(`point_transpose_03`, () => {
            let p = new pool();
            p.init(point_i16p.BYTES_LENGTH * 1);
            let a = new point_i16p(p, 19, 33);
            let b = new point_i16p_ref(a.buffer, a.byteOffset);
            let c = point_transpose(a);
            test_point(a, 33, 19, 0);
            test_point(b, 33, 19, 0);
            test_point(c, 33, 19, 0);
        })

        it(`point_transpose_04`, () => {
            let p = new pool();
            p.init(point_f32p.BYTES_LENGTH * 1);
            let a = new point_f32p(p, 95.140625, 24.7525615692138671875);
            let b = point_transpose(a);
            test_point(a, 24.7525615692138671875, 95.140625, 3);
            test_point(b, 24.7525615692138671875, 95.140625, 3);
        })

        it(`point_transpose_05`, () => {
            let p = new pool();
            p.init(point_f32p.BYTES_LENGTH * 1);
            let a = new point_f32p(p, -22.1710262298583984375, 67.7144012451171875);
            let b = new point_f32p_ref(a.buffer, a.byteOffset);
            let c = point_transpose(a);
            test_point(a, 67.7144012451171875, -22.1710262298583984375, 3);
            test_point(b, 67.7144012451171875, -22.1710262298583984375, 3);
            test_point(c, 67.7144012451171875, -22.1710262298583984375, 3);
        })
    });

    describe('point_cardinal_to_cartesian', () => {
        // Test case for mapping a point from the cardinal coordinate system to the Cartesian coordinate system
        it('should map a point from the cardinal coordinate system to the Cartesian coordinate system', () => {
            const point = [1, -1];
            const width = 100;
            const height = 200;
            const result = [0, 0];
            const mappedPoint = point_cardinal_to_cartesian(point, width, height, result);
            expect(mappedPoint[0]).toBe(100); // Check the mapped X-coordinate
            expect(mappedPoint[1]).toBe(200); // Check the mapped Y-coordinate
        });

        // Test case for mapping a point with negative coordinates
        it('should map a point with negative coordinates', () => {
            const point = [-1, -1];
            const width = 100;
            const height = 200;
            const result = [0, 0];
            const mappedPoint = point_cardinal_to_cartesian(point, width, height, result);
            expect(mappedPoint[0]).toBe(0); // Check the mapped X-coordinate
            expect(mappedPoint[1]).toBe(200); // Check the mapped Y-coordinate
        });

        // Test case for mapping a point with zero coordinates
        it('should map a point with zero coordinates', () => {
            const point = [0, 0];
            const width = 100;
            const height = 200;
            const result = [0, 0];
            const mappedPoint = point_cardinal_to_cartesian(point, width, height, result);
            expect(mappedPoint[0]).toBe(50); // Check the mapped X-coordinate
            expect(mappedPoint[1]).toBe(100); // Check the mapped Y-coordinate
        });
    });

    describe('point_add', () => {
        // Test case for adding two points represented as arrays
        it('should add two points represented as arrays', () => {
            const point1 = [1, 2];
            const point2 = [3, 4];
            const result = [0, 0];
            const sum = point_add(point1, point2, result);
            expect(sum[0]).toBe(4); // Check the sum of X-coordinates
            expect(sum[1]).toBe(6); // Check the sum of Y-coordinates
        });

        // Test case for adding a point and a scalar value
        it('should add a point and a scalar value', () => {
            const point1 = [1, 2];
            const scalar = 3;
            const result = [0, 0];
            const sum = point_add(point1, scalar, scalar, result);
            expect(sum[0]).toBe(4); // Check the sum of X-coordinate
            expect(sum[1]).toBe(5); // Check the sum of Y-coordinate
        });

        // Test case for adding a point and a point object
        it('should add a point and a point object', () => {
            const point1 = [1, 2];
            const point2 = [3, 4];
            const result = [0, 0];
            const sum = point_add(point1, point2, point2, result);
            expect(sum[0]).toBe(4); // Check the sum of X-coordinate
            expect(sum[1]).toBe(6); // Check the sum of Y-coordinate
        });

        // Test case for adding a point with negative coordinates
        it('should add a point with negative coordinates', () => {
            const point1 = [-1, -2];
            const point2 = [3, 4];
            const result = [0, 0];
            const sum = point_add(point1, point2, result);
            expect(sum[0]).toBe(2); // Check the sum of X-coordinate
            expect(sum[1]).toBe(2); // Check the sum of Y-coordinate
        });

        // Test case for adding a point with zero coordinates
        it('should add a point with zero coordinates', () => {
            const point1 = [0, 0];
            const point2 = [0, 0];
            const result = [0, 0];
            const sum = point_add(point1, point2, result);
            expect(sum[0]).toBe(0); // Check the sum of X-coordinate
            expect(sum[1]).toBe(0); // Check the sum of Y-coordinate
        });

        it(`point_add_00`, () => {
            let a = new pointi(42, -92);
            let b = new pointi(-17, -10);
            let c = new pointi(-17, -10);
            let d = point_add(a, b, c);
            test_point(a, 42, -92, 0);
            test_point(b, -17, -10, 0);
            test_point(c, 25, -102, 0);
            test_point(d, 25, -102, 0);
        })

        it(`point_add_01`, () => {
            let a = new pointf(-86.5761871337890625, 85.005126953125);
            let b = new pointf(16.13170623779296875, -37.483493804931640625);
            let c = new pointf(-86.5761871337890625, 85.005126953125);
            let d = point_add(a, b, c);
            test_point(a, -86.5761871337890625, 85.005126953125, 3);
            test_point(b, 16.13170623779296875, -37.483493804931640625, 3);
            test_point(c, -70.44448089599609375, 47.521633148193359375, 3);
            test_point(d, -70.44448089599609375, 47.521633148193359375, 3);
        })

        it(`point_add_02`, () => {
            let p = new pool();
            p.init(point_i16p.BYTES_LENGTH * 3);
            let a = new pointi(17, 81);
            let b = new pointi(56, -48);
            let c = new pointi(56, -48);
            let d = point_add(a, b, c);
            test_point(a, 17, 81, 0);
            test_point(b, 56, -48, 0);
            test_point(c, 73, 33, 0);
            test_point(d, 73, 33, 0);
        })

        it(`point_add_03`, () => {
            let p = new pool();
            p.init(point_i16p.BYTES_LENGTH * 3);
            let a = new point_i16p(p, -81, -27);
            let b = new point_i16p_ref(a.buffer, a.byteOffset);
            let c = new point_i16p(p, 87, -44);
            let d = new point_i16p_ref(c.buffer, c.byteOffset);
            let e = new point_i16p(p, 0, 0);
            let f = new point_i16p_ref(e.buffer, e.byteOffset);
            let g = point_add(b, d, f);
            test_point(a, -81, -27, 0);
            test_point(b, -81, -27, 0);
            test_point(c, 87, -44, 0);
            test_point(d, 87, -44, 0);
            test_point(e, 6, -71, 0);
            test_point(f, 6, -71, 0);
            test_point(g, 6, -71, 0);
        })

        it(`point_add_04`, () => {
            let p = new pool();
            p.init(point_f32p.BYTES_LENGTH * 3);
            let a = new point_f32p(p, -63.283580780029296875, 93.66570281982421875);
            let b = new point_f32p(p, -7.363034725189208984375, -60.08017730712890625);
            let c = new point_f32p(p, -7.363034725189208984375, -60.08017730712890625);
            let d = point_add(a, b, c);
            test_point(a, -63.283580780029296875, 93.66570281982421875, 3);
            test_point(b, -7.363034725189208984375, -60.08017730712890625, 3);
            test_point(c, -70.646615505218505859375, 33.5855255126953125, 3);
            test_point(d, -70.646615505218505859375, 33.5855255126953125, 3);
        })

        it(`point_add_05`, () => {
            let p = new pool();
            p.init(point_f32p.BYTES_LENGTH * 3);
            let a = new point_f32p(p, -72.61333465576171875, 3.250218868255615234375);
            let b = new point_f32p_ref(a.buffer, a.byteOffset);
            let c = new point_f32p(p, 30.315410614013671875, -54.1686248779296875);
            let d = new point_f32p_ref(c.buffer, c.byteOffset);
            let e = new point_f32p(p, 0, 0);
            let f = new point_f32p_ref(e.buffer, e.byteOffset);
            let g = point_add(b, d, f);
            test_point(a, -72.61333465576171875, 3.250218868255615234375, 3);
            test_point(b, -72.61333465576171875, 3.250218868255615234375, 3);
            test_point(c, 30.315410614013671875, -54.1686248779296875, 3);
            test_point(d, 30.315410614013671875, -54.1686248779296875, 3);
            test_point(e, -42.297924041748046875, -50.918406009674072265625, 3);
            test_point(f, -42.297924041748046875, -50.918406009674072265625, 3);
            test_point(g, -42.297924041748046875, -50.918406009674072265625, 3);
        })
    });

    // Test suite for the point_rem function
    describe('point_rem', () => {
        // Test case for subtracting two points represented as arrays
        it('should subtract two points represented as arrays', () => {
            const point1 = [3, 4];
            const point2 = [1, 2];
            const result = [0, 0];
            const difference = point_rem(point1, point2, result);
            expect(difference[0]).toBe(2); // Check the difference of X-coordinates
            expect(difference[1]).toBe(2); // Check the difference of Y-coordinates
        });

        // Test case for subtracting a point and a scalar value
        it('should subtract a point and a scalar value', () => {
            const point1 = [3, 4];
            const scalar = 2;
            const result = [0, 0];
            const difference = point_rem(point1, scalar, scalar, result);
            expect(difference[0]).toBe(1); // Check the difference of X-coordinate
            expect(difference[1]).toBe(2); // Check the difference of Y-coordinate
        });

        it(`point_rem_00`, () => {
            let a = new pointi(-92, 36);
            let b = new pointi(-75, -71);
            let c = new pointi(-75, -71);
            let d = point_rem(a, b, c);
            test_point(a, -92, 36, 0);
            test_point(b, -75, -71, 0);
            test_point(c, -17, 107, 0);
            test_point(d, -17, 107, 0);
        })

        it(`point_rem_01`, () => {
            let a = new pointf(68.90726470947265625, 45.193767547607421875);
            let b = new pointf(-66.24249267578125, -26.119136810302734375);
            let c = new pointf(68.90726470947265625, 45.193767547607421875);
            let d = point_rem(a, b, c);
            test_point(a, 68.90726470947265625, 45.193767547607421875, 3);
            test_point(b, -66.24249267578125, -26.119136810302734375, 3);
            test_point(c, 135.14975738525390625, 71.31290435791015625, 3);
            test_point(d, 135.14975738525390625, 71.31290435791015625, 3);
        })

        it(`point_rem_02`, () => {
            let p = new pool();
            p.init(point_i16p.BYTES_LENGTH * 3);
            let a = new pointi(-60, -75);
            let b = new pointi(-21, 66);
            let c = new pointi(-21, 66);
            let d = point_rem(a, b, c);
            test_point(a, -60, -75, 0);
            test_point(b, -21, 66, 0);
            test_point(c, -39, -141, 0);
            test_point(d, -39, -141, 0);
        })

        it(`point_rem_03`, () => {
            let p = new pool();
            p.init(point_i16p.BYTES_LENGTH * 3);
            let a = new point_i16p(p, -64, 72);
            let b = new point_i16p_ref(a.buffer, a.byteOffset);
            let c = new point_i16p(p, 3, -30);
            let d = new point_i16p_ref(c.buffer, c.byteOffset);
            let e = new point_i16p(p, 0, 0);
            let f = new point_i16p_ref(e.buffer, e.byteOffset);
            let g = point_rem(b, d, f);
            test_point(a, -64, 72, 0);
            test_point(b, -64, 72, 0);
            test_point(c, 3, -30, 0);
            test_point(d, 3, -30, 0);
            test_point(e, -67, 102, 0);
            test_point(f, -67, 102, 0);
            test_point(g, -67, 102, 0);
        })

        it(`point_rem_04`, () => {
            let p = new pool();
            p.init(point_f32p.BYTES_LENGTH * 3);
            let a = new point_f32p(p, -20.776920318603515625, -48.027042388916015625);
            let b = new point_f32p(p, 40.098114013671875, -1.55456101894378662109375);
            let c = new point_f32p(p, 40.098114013671875, -1.55456101894378662109375);
            let d = point_rem(a, b, c);
            test_point(a, -20.776920318603515625, -48.027042388916015625, 3);
            test_point(b, 40.098114013671875, -1.55456101894378662109375, 3);
            test_point(c, -60.875034332275390625, -46.4724813699722290039063, 3);
            test_point(d, -60.875034332275390625, -46.4724813699722290039063, 3);
        })

        it(`point_rem_05`, () => {
            let p = new pool();
            p.init(point_f32p.BYTES_LENGTH * 3);
            let a = new point_f32p(p, -76.945465087890625, 17.0281009674072265625);
            let b = new point_f32p_ref(a.buffer, a.byteOffset);
            let c = new point_f32p(p, -88.49053955078125, -33.3884124755859375);
            let d = new point_f32p_ref(c.buffer, c.byteOffset);
            let e = new point_f32p(p, 0, 0);
            let f = new point_f32p_ref(e.buffer, e.byteOffset);
            let g = point_rem(b, d, f);
            test_point(a, -76.945465087890625, 17.0281009674072265625, 3);
            test_point(b, -76.945465087890625, 17.0281009674072265625, 3);
            test_point(c, -88.49053955078125, -33.3884124755859375, 3);
            test_point(d, -88.49053955078125, -33.3884124755859375, 3);
            test_point(e, 11.545074462890625, 50.4165134429931640625, 3);
            test_point(f, 11.545074462890625, 50.4165134429931640625, 3);
            test_point(g, 11.545074462890625, 50.4165134429931640625, 3);
        })

    });

    describe('point_mult', () => {
        // Test case for multiplying a point by a positive factor
        it('should multiply a point by a positive factor', () => {
            const point = [3, 4];
            const factor = 2;
            const result = [0, 0];
            const product = point_mult(point, factor, result);
            expect(product[0]).toBe(6); // Check the product of X-coordinate
            expect(product[1]).toBe(8); // Check the product of Y-coordinate
        });

        // Test case for multiplying a point by a negative factor
        it('should multiply a point by a negative factor', () => {
            const point = [3, 4];
            const factor = -2;
            const result = [0, 0];
            const product = point_mult(point, factor, result);
            expect(product[0]).toBe(-6); // Check the product of X-coordinate
            expect(product[1]).toBe(-8); // Check the product of Y-coordinate
        });

        // Test case for multiplying a point by zero
        it('should multiply a point by zero', () => {
            const point = [3, 4];
            const factor = 0;
            const result = [0, 0];
            const product = point_mult(point, factor, result);
            expect(product[0]).toBe(0); // Check the product of X-coordinate
            expect(product[1]).toBe(0); // Check the product of Y-coordinate
        });

        it(`point_mult_00`, () => {
            let a = new pointi(-23, -88);
            let b = new pointi(0, 0);
            let c = point_mult(a, 57, b);
            test_point(a, -23, -88, 0);
            test_point(b, -1311, -5016, 0);
            test_point(c, -1311, -5016, 0);
        })

        it(`point_mult_01`, () => {
            let a = new pointf(-2.459377765655517578125, -1.17342281341552734375);
            let b = new pointf(0, 0);
            let c = point_mult(a, 0.595150530338287353515625, b);
            test_point(a, -2.459377765655517578125, -1.17342281341552734375, 3);
            test_point(b, -1.46369998153207347968419, -0.698363209715296306967502, 3);
            test_point(c, -1.46369998153207347968419, -0.698363209715296306967502, 3);
        })

        it(`point_mult_02`, () => {
            let p = new pool();
            p.init(point_i16p.BYTES_LENGTH * 3);
            let a = new pointi(71, 38);
            let b = new pointi(0, 0);
            let c = point_mult(a, -82, b);
            test_point(a, 71, 38, 0);
            test_point(b, -5822, -3116, 0);
            test_point(c, -5822, -3116, 0);
        })

        it(`point_mult_03`, () => {
            let p = new pool();
            p.init(point_i16p.BYTES_LENGTH * 3);
            let a = new point_i16p(p, 57, -60);
            let b = new point_i16p_ref(a.buffer, a.byteOffset);
            let c = new point_i16p(p, 0, 0);
            let d = new point_i16p_ref(c.buffer, c.byteOffset);
            let e = point_mult(b, -59, d);
            test_point(a, 57, -60, 0);
            test_point(b, 57, -60, 0);
            test_point(c, -3363, 3540, 0);
            test_point(d, -3363, 3540, 0);
            test_point(e, -3363, 3540, 0);
        })

        it(`point_mult_04`, () => {
            let p = new pool();
            p.init(point_f32p.BYTES_LENGTH * 3);
            let a = new point_f32p(p, 2.5191247463226318359375, 0.917491137981414794921875);
            let b = new point_f32p(p, 0, 0);
            let c = point_mult(a, 1.0820941925048828125, b);
            test_point(a, 2.5191247463226318359375, 0.917491137981414794921875, 2);
            test_point(b, 2.72593025819105605478399, 0.992811832084385059715714, 2);
            test_point(c, 2.72593025819105605478399, 0.992811832084385059715714, 2);
        })

        it(`point_mult_05`, () => {
            let p = new pool();
            p.init(point_f32p.BYTES_LENGTH * 3);
            let a = new point_f32p(p, -0.6010367870330810546875, -1.79465806484222412109375);
            let b = new point_f32p_ref(a.buffer, a.byteOffset);
            let c = new point_f32p(p, 0, 0);
            let d = new point_f32p_ref(c.buffer, c.byteOffset);
            let e = point_mult(b, -0.3644950389862060546875, d);
            test_point(a, -0.6010367870330810546875, -1.79465806484222412109375, 2);
            test_point(b, -0.6010367870330810546875, -1.79465806484222412109375, 2);
            test_point(c, 0.219074927121766904747346, 0.654143961311575594663736, 2);
            test_point(d, 0.219074927121766904747346, 0.654143961311575594663736, 2);
            test_point(e, 0.219074927121766904747346, 0.654143961311575594663736, 2);
        })
    });

    describe('point_div', () => {
        // Test case for dividing a point by a positive factor
        it('should divide a point by a positive factor', () => {
            const point = [6, 8];
            const factor = 2;
            const result = [0, 0];
            const division = point_div(point, factor, result);
            expect(division[0]).toBe(3); // Check the division of X-coordinate
            expect(division[1]).toBe(4); // Check the division of Y-coordinate
        });

        // Test case for dividing a point by a negative factor
        it('should divide a point by a negative factor', () => {
            const point = [6, 8];
            const factor = -2;
            const result = [0, 0];
            const division = point_div(point, factor, result);
            expect(division[0]).toBe(-3); // Check the division of X-coordinate
            expect(division[1]).toBe(-4); // Check the division of Y-coordinate
        });

        it(`point_div_00`, () => {
            let a = new pointi(-19, -83);
            let b = new pointi(0, 0);
            let c = point_div(a, -3, b);
            test_point(a, -19, -83, 0);
            test_point(b, 6, 28, 0);
            test_point(c, 6, 28, 0);
        })

        it(`point_div_01`, () => {
            let a = new pointf(97.79404449462890625, -89.521759033203125);
            let b = new pointf(0, 0);
            let c = point_div(a, 0.124282330274581909179688, b);
            test_point(a, 97.79404449462890625, -89.521759033203125, 2);
            test_point(b, 786.870058507662520241865, -720.309627566679296251095, 2);
            test_point(c, 786.870058507662520241865, -720.309627566679296251095, 2);
        })

        it(`point_div_02`, () => {
            let p = new pool();
            p.init(point_i16p.BYTES_LENGTH * 3);
            let a = new pointi(-36, -17);
            let b = new pointi(0, 0);
            let c = point_div(a, 4, b);
            test_point(a, -36, -17, 0);
            test_point(b, -9, -4, 0);
            test_point(c, -9, -4, 0);
        })

        it(`point_div_03`, () => {
            let p = new pool();
            p.init(point_i16p.BYTES_LENGTH * 3);
            let a = new point_i16p(p, -65, 46);
            let b = new point_i16p_ref(a.buffer, a.byteOffset);
            let c = new point_i16p(p, 0, 0);
            let d = new point_i16p_ref(c.buffer, c.byteOffset);
            let e = point_div(b, 2, d);
            test_point(a, -65, 46, 0);
            test_point(b, -65, 46, 0);
            test_point(c, -33, 23, 0);
            test_point(d, -33, 23, 0);
            test_point(e, -33, 23, 0);
        })

        it(`point_div_04`, () => {
            let p = new pool();
            p.init(point_f32p.BYTES_LENGTH * 3);
            let a = new point_f32p(p, 36.45316314697265625, 86.9127044677734375);
            let b = new point_f32p(p, 0, 0);
            let c = point_div(a, -4.65815830230712890625, b);
            test_point(a, 36.45316314697265625, 86.9127044677734375, 2);
            test_point(b, -7.82566001007691181001746, -18.6581689215513861768159, 2);
            test_point(c, -7.82566001007691181001746, -18.6581689215513861768159, 2);
        })

        it(`point_div_05`, () => {
            let p = new pool();
            p.init(point_f32p.BYTES_LENGTH * 3);
            let a = new point_f32p(p, -63.4970855712890625, -14.0663280487060546875);
            let b = new point_f32p_ref(a.buffer, a.byteOffset);
            let c = new point_f32p(p, 0, 0);
            let d = new point_f32p_ref(c.buffer, c.byteOffset);
            let e = point_div(b, -2.561016082763671875, d);
            test_point(a, -63.4970855712890625, -14.0663280487060546875, 2);
            test_point(b, -63.4970855712890625, -14.0663280487060546875, 2);
            test_point(c, 24.7937082467546971997763, 5.49247938869897467384362, 2);
            test_point(d, 24.7937082467546971997763, 5.49247938869897467384362, 2);
            test_point(e, 24.7937082467546971997763, 5.49247938869897467384362, 2);
        })
    });

    describe('point_to_css', () => {
        // Test case for positive x and y coordinates
        it('should return the correct CSS string for positive coordinates', () => {
            const point = [10, 20];
            const cssString = point_to_css(point);
            expect(cssString).toBe('top:10;left:20;');
        });

        // Test case for negative x and y coordinates
        it('should return the correct CSS string for negative coordinates', () => {
            const point = [-10, -20];
            const cssString = point_to_css(point);
            expect(cssString).toBe('top:-10;left:-20;');
        });

        // Test case for zero x and y coordinates
        it('should return the correct CSS string for zero coordinates', () => {
            const point = [0, 0];
            const cssString = point_to_css(point);
            expect(cssString).toBe('top:0;left:0;');
        });

        // Test case for non-integer x and y coordinates
        it('should return the correct CSS string for non-integer coordinates', () => {
            const point = [10.5, -20.75];
            const cssString = point_to_css(point);
            expect(cssString).toBe('top:11;left:-21;');
        });
    });

    describe('point_to_string', () => {
        // Test case for positive x and y coordinates
        it('should return the correct string for positive coordinates', () => {
            const point = [10, 20];
            const result = point_to_string(point);
            expect(result).toBe('(10,20)');
        });

        // Test case for negative x and y coordinates
        it('should return the correct string for negative coordinates', () => {
            const point = [-10, -20];
            const result = point_to_string(point);
            expect(result).toBe('(-10,-20)');
        });

        // Test case for zero x and y coordinates
        it('should return the correct string for zero coordinates', () => {
            const point = [0, 0];
            const result = point_to_string(point);
            expect(result).toBe('(0,0)');
        });

        // Test case for non-integer x and y coordinates
        it('should return the correct string for non-integer coordinates', () => {
            const point = [10.5, -20.75];
            const result = point_to_string(point);
            expect(result).toBe('(10.5,-20.75)');
        });
    });
})
