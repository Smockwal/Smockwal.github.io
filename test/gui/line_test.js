import { pool } from '../../lib/array.js';
import {
    linef, linei, line_center, line_deg_angle, line_deg_angle_between, line_f32p,
    line_f32p_ref, line_i16p, line_i16p_ref, line_intersects, line_length, line_normal,
    line_point_at, line_rad_angle, line_rad_angle_between, line_set_deg_angle, line_set_length,
    line_set_rad_angle, line_translate, line_unit_vector, x1, x2, y1, y2,
    line_is_null,
    NO_INTERSECTION,
    BOUNDED_INTERSECTION,
    UNBOUNDED_INTERSECTION,
    line_equals
} from '../../lib/gui/line.js';
import { pointf, pointi, point_f32p, point_f32p_ref, point_i16p, point_i16p_ref, X, Y } from '../../lib/gui/point.js';
import { test_line, test_point } from '../test.js';
describe('line constant test', () => {
    it(`x1_00`, () => { expect(x1).toBe(0); })
    it(`y1_00`, () => { expect(y1).toBe(1); })
    it(`x2_00`, () => { expect(x2).toBe(2); })
    it(`y2_00`, () => { expect(y2).toBe(3); })
})


describe("linei", () => {
    let line;

    beforeEach(() => {
        line = new linei();
    });

    it("should initialize a line with default values", () => {
        expect(line.x1).toBe(0);
        expect(line.y1).toBe(0);
        expect(line.x2).toBe(0);
        expect(line.y2).toBe(0);
    });

    it("should initialize a line with given coordinates", () => {
        line = new linei(1, 2, 3, 4);
        expect(line.x1).toBe(1);
        expect(line.y1).toBe(2);
        expect(line.x2).toBe(3);
        expect(line.y2).toBe(4);
    });

    it("should set the first point using a point object", () => {
        line.p1 = [5, 6];
        expect(line.x1).toBe(5);
        expect(line.y1).toBe(6);
    });

    it("should set the second point using a point object", () => {
        line.p2 = [7, 8];
        expect(line.x2).toBe(7);
        expect(line.y2).toBe(8);
    });

    it("should calculate the difference in x-coordinates", () => {
        line = new linei(1, 2, 5, 2);
        expect(line.dx).toBe(4);
    });

    it("should calculate the difference in y-coordinates", () => {
        line = new linei(1, 2, 1, 6);
        expect(line.dy).toBe(4);
    });

    it(`constructor_00`, () => {
        let a = new linei(-51, -28, 1, 91);
        test_line(a, -51, -28, 1, 91, 0);
    })
});

describe(`linef test`, () => {
    it(`constructor_00`, () => {
        let a = new linef(45.977153778076171875, -32.8274383544921875, 86.25182342529296875, -84.27098846435546875);
        test_line(a, 45.977153778076171875, -32.8274383544921875, 86.25182342529296875, -84.27098846435546875, 3);
    })
})
describe(`line_i16p test`, () => {
    it(`constructor_00`, () => {
        let p = new pool();
        p.init(line_i16p.BYTES_LENGTH * 1);
        let a = new line_i16p(p, -84, -36, -49, 40);
        test_line(a, -84, -36, -49, 40, 0);
    })
})
describe(`line_i16p_ref test`, () => {
    it(`constructor_00`, () => {
        let p = new pool();
        p.init(line_i16p.BYTES_LENGTH * 1);
        let a = new line_i16p(p, -74, 55, 72, -12);
        let b = new line_i16p_ref(a.buffer, a.byteOffset);
        test_line(a, -74, 55, 72, -12, 0);
        test_line(b, -74, 55, 72, -12, 0);
    })
})
describe(`line_f32p test`, () => {
    it(`constructor_00`, () => {
        let p = new pool();
        p.init(line_f32p.BYTES_LENGTH * 1);
        let a = new line_f32p(p, -94.56446075439453125, -81.732513427734375, 91.9588775634765625, -13.00571441650390625);
        test_line(a, -94.56446075439453125, -81.732513427734375, 91.9588775634765625, -13.00571441650390625, 3);
    })
})
describe(`line_f32p_ref test`, () => {
    it(`constructor_00`, () => {
        let p = new pool();
        p.init(line_f32p.BYTES_LENGTH * 1);
        let a = new line_f32p(p, 42.237461090087890625, -80.6457061767578125, 85.3371429443359375, -43.152080535888671875);
        let b = new line_f32p_ref(a.buffer, a.byteOffset);
        test_line(a, 42.237461090087890625, -80.6457061767578125, 85.3371429443359375, -43.152080535888671875, 3);
        test_line(b, 42.237461090087890625, -80.6457061767578125, 85.3371429443359375, -43.152080535888671875, 3);
    })
})
describe(`line_func test`, () => {

    describe('line_is_null', () => {
        it('should return true for a line with identical endpoints', () => {
            const line = [0, 0, 0, 0];
            expect(line_is_null(line)).toBe(true);
        });

        it('should return false for a line with different endpoints', () => {
            const line = [0, 0, 1, 1];
            expect(line_is_null(line)).toBe(false);
        });

        it('should handle floating point comparison correctly', () => {
            const line = [0.1, 0.2, 0.1, 0.2];
            expect(line_is_null(line)).toBe(true);
        });

        it('should handle negative coordinates', () => {
            const line = [-1, -1, -1, -1];
            expect(line_is_null(line)).toBe(true);
        });

        it('should handle large coordinates', () => {
            const line = [1000000, 1000000, 1000000, 1000000];
            expect(line_is_null(line)).toBe(true);
        });
    });

    describe('line_equals', () => {
        it('should return true for two equal lines', () => {
            const line1 = [0, 0, 1, 1];
            const line2 = [0, 0, 1, 1];
            expect(line_equals(line1, line2)).toBe(true);
        });

        it('should return false for two different lines', () => {
            const line1 = [0, 0, 1, 1];
            const line2 = [0, 0, 2, 2];
            expect(line_equals(line1, line2)).toBe(false);
        });

        it('should handle floating-point precision issues', () => {
            const line1 = [0, 0, 1.000000000000001, 1.000000000000001];
            const line2 = [0, 0, 1, 1];
            expect(line_equals(line1, line2)).toBe(true);
        });
    });

    describe("line_length", () => {
        it("should return the correct length for a line with positive coordinates", () => {
            const line = { dx: 3, dy: 4 };
            expect(line_length(line)).toBe(5);
        });

        it("should return the correct length for a line with negative coordinates", () => {
            const line = { dx: -3, dy: -4 };
            expect(line_length(line)).toBe(5);
        });

        it("should return 0 for a line with both coordinates as 0", () => {
            const line = { dx: 0, dy: 0 };
            expect(line_length(line)).toBe(0);
        });

        it("should return the correct length for a line with one coordinate as 0", () => {
            const line1 = { dx: 0, dy: 3 };
            const line2 = { dx: 4, dy: 0 };
            expect(line_length(line1)).toBe(3);
            expect(line_length(line2)).toBe(4);
        });

        it("should return the correct length for a line with decimal coordinates", () => {
            const line = { dx: 1.5, dy: 2.5 };
            expect(line_length(line)).toBeCloseTo(2.92, 2);
        });

        it(`line_length_00`, () => {
            let a = new linei(13, 34, 52, -75);
            let b = line_length(a);
            test_line(a, 13, 34, 52, -75, 3);
            expect(b).toBeCloseTo(115.767007389843158193798, 3);
        })

        it(`line_length_01`, () => {
            let a = new linef(-35.1808632827445961765989, -88.6261913555591860358618, -3.65186524005356716315873, -34.3520730949861103908916);
            let b = line_length(a);
            test_line(a, -35.1808632827445961765989, -88.6261913555591860358618, -3.65186524005356716315873, -34.3520730949861103908916, 3);
            expect(b).toBeCloseTo(62.7674886429167742107893, 3);
        })

        it(`line_length_02`, () => {
            let p = new pool();
            p.init(line_i16p.BYTES_LENGTH * 2);
            let a = new line_i16p(p, 21, -41, 80, 16);
            let b = line_length(a);
            test_line(a, 21, -41, 80, 16, 0);
            expect(b).toBeCloseTo(82.0365772079747301859243, 3);
        })

        it(`line_length_03`, () => {
            let p = new pool();
            p.init(line_i16p.BYTES_LENGTH * 2);
            let a = new line_i16p(p, -21, -40, 20, 55);
            let b = new line_i16p_ref(a.buffer, a.byteOffset);
            let c = line_length(a);
            test_line(a, -21, -40, 20, 55, 0);
            test_line(b, -21, -40, 20, 55, 0);
            expect(c).toBeCloseTo(103.469802357982686658033, 3);
        })

        it(`line_length_04`, () => {
            let p = new pool();
            p.init(line_f32p.BYTES_LENGTH * 2);
            let a = new line_f32p(p, -50.9510128120499885540085, -48.8863454470991740663521, 80.6030105756347268197715, 64.2877991087620159760263);
            let b = line_length(a);
            test_line(a, -50.9510128120499885540085, -48.8863454470991740663521, 80.6030105756347268197715, 64.2877991087620159760263, 3);
            expect(b).toBeCloseTo(173.536301866319774944714, 3);
        })

        it(`line_length_05`, () => {
            let p = new pool();
            p.init(line_f32p.BYTES_LENGTH * 2);
            let a = new line_f32p(p, 68.7056560311602311230672, -69.820471049224153148316, -25.2821001825879250191065, 24.1508550353402711152739);
            let b = new line_f32p_ref(a.buffer, a.byteOffset);
            let c = line_length(b);
            test_line(a, 68.7056560311602311230672, -69.820471049224153148316, -25.2821001825879250191065, 24.1508550353402711152739, 3);
            test_line(b, 68.7056560311602311230672, -69.820471049224153148316, -25.2821001825879250191065, 24.1508550353402711152739, 3);
            expect(c).toBeCloseTo(132.907142186514903414718, 3);
        })
    });

    describe("line_center", () => {
        it("should calculate the center point for a line segment with positive coordinates", () => {
            const line = [0, 0, 4, 4];
            const result = [0, 0];
            expect(line_center(line, result)).toEqual([2, 2]);
        });

        it("should calculate the center point for a line segment with negative coordinates", () => {
            const line = [-2, -2, 2, 2];
            const result = [0, 0];
            expect(line_center(line, result)).toEqual([0, 0]);
        });

        it("should calculate the center point for a line segment with one endpoint at the origin", () => {
            const line = [0, 0, 3, 3];
            const result = [0, 0];
            expect(line_center(line, result)).toEqual([1.5, 1.5]);
        });

        it("should calculate the center point for a line segment with decimal coordinates", () => {
            const line = [1.5, 1.5, 3.5, 3.5];
            const result = [0, 0];
            expect(line_center(line, result)).toEqual([2.5, 2.5]);
        });

        it(`line_center_00`, () => {
            let a = new linei(-82, -51, -58, 81);
            let b = new pointi(0, 0);
            let c = line_center(a, b);
            test_line(a, -82, -51, -58, 81, 0);
            test_point(b, -70, 15, 0);
            test_point(c, -70, 15, 0);
        })

        it(`line_center_01`, () => {
            let a = new linef(58.241985321044921875, -41.99138641357421875, 5.575035572052001953125, -53.58742523193359375);
            let b = new pointf(0, 0);
            let c = line_center(a, b);
            test_line(a, 58.241985321044921875, -41.99138641357421875, 5.575035572052001953125, -53.58742523193359375, 3);
            test_point(b, 31.9085104465484619140625, -47.78940582275390625, 3);
            test_point(c, 31.9085104465484619140625, -47.78940582275390625, 3);
        })

        it(`line_center_02`, () => {
            let p = new pool();
            p.init(line_i16p.BYTES_LENGTH * 1);
            let a = new line_i16p(p, 88, 79, 30, 82);
            let b = new pointi(0, 0);
            let c = line_center(a, b);
            test_line(a, 88, 79, 30, 82, 0);
            test_point(b, 59, 80, 0);
            test_point(c, 59, 80, 0);
        })

        it(`line_center_03`, () => {
            let p = new pool();
            p.init(line_i16p.BYTES_LENGTH * 1);
            let a = new line_i16p(p, 76, 69, 59, 15);
            let b = new line_i16p_ref(a.buffer, a.byteOffset);
            let c = new pointi(0, 0);
            let d = line_center(b, c);
            test_line(a, 76, 69, 59, 15, 0);
            test_line(b, 76, 69, 59, 15, 0);
            test_point(c, 67, 42, 0);
            test_point(d, 67, 42, 0);
        })

        it(`line_center_04`, () => {
            let p = new pool();
            p.init(line_f32p.BYTES_LENGTH * 1);
            let a = new line_f32p(p, -63.71036529541015625, 64.48818206787109375, -97.3773651123046875, 48.39144134521484375);
            let b = new pointf(0, 0);
            let c = line_center(a, b);
            test_line(a, -63.71036529541015625, 64.48818206787109375, -97.3773651123046875, 48.39144134521484375, 3);
            test_point(b, -80.543865203857421875, 56.43981170654296875, 3);
            test_point(c, -80.543865203857421875, 56.43981170654296875, 3);
        })

        it(`line_center_05`, () => {
            let p = new pool();
            p.init(line_f32p.BYTES_LENGTH * 1);
            let a = new line_f32p(p, -12.6641216278076171875, -99.2108154296875, 94.25104522705078125, -18.2797183990478515625);
            let b = new line_f32p_ref(a.buffer, a.byteOffset);
            let c = new pointf(0, 0);
            let d = line_center(b, c);
            test_line(a, -12.6641216278076171875, -99.2108154296875, 94.25104522705078125, -18.2797183990478515625, 3);
            test_line(b, -12.6641216278076171875, -99.2108154296875, 94.25104522705078125, -18.2797183990478515625, 3);
            test_point(c, 40.79346179962158203125, -58.74526691436767578125, 3);
            test_point(d, 40.79346179962158203125, -58.74526691436767578125, 3);
        })
    });

    describe("line_translate", () => {
        it("should translate the line by the given offset when offset is a number", () => {
            const line = [0, 0, 4, 4];
            const result = [];
            const offset = 2;
            expect(line_translate(line, offset, offset, result)).toEqual([2, 2, 6, 6]);
        });

        it("should translate the line by the given offset when offset is an array", () => {
            const line = [0, 0, 4, 4];
            const result = [];
            const offset = [2, 2];
            expect(line_translate(line, offset, result)).toEqual([2, 2, 6, 6]);
        });

        it("should handle negative offsets correctly", () => {
            const line = [0, 0, 4, 4];
            const result = [];
            const offset = -2;
            expect(line_translate(line, offset, offset, result)).toEqual([-2, -2, 2, 2]);
        });

        it("should handle the case when a result line is provided", () => {
            const line = [0, 0, 4, 4];
            const result = [1, 1, 5, 5];
            const offset = 2;
            expect(line_translate(line, offset, offset, result)).toEqual([2, 2, 6, 6]);
        });

        it(`line_translate_00`, () => {
            let a = new linei(-88, 31, 46, 72);
            let b = new pointi(14, 66);
            let c = new linei(0, 0, 0, 0);
            let d = line_translate(a, b, c);
            test_line(a, -88, 31, 46, 72, 0);
            test_point(b, 14, 66, 0);
            test_line(c, -74, 97, 60, 138, 0);
            test_line(d, -74, 97, 60, 138, 0);
        })

        it(`line_translate_01`, () => {
            let a = new linef(41.464153289794921875, 88.9209747314453125, 71.93604278564453125, -17.1369457244873046875);
            let b = new pointf(3.69326019287109375, -77.77194976806640625);
            let c = new linef(0, 0, 0, 0);
            let d = line_translate(a, b, c);
            test_line(a, 41.464153289794921875, 88.9209747314453125, 71.93604278564453125, -17.1369457244873046875, 0);
            test_point(b, 3.69326019287109375, -77.77194976806640625, 0);
            test_line(c, 45.157413482666015625, 11.14902496337890625, 75.629302978515625, -94.9088954925537109375, 0);
            test_line(d, 45.157413482666015625, 11.14902496337890625, 75.629302978515625, -94.9088954925537109375, 0);
        })

        it(`line_translate_02`, () => {
            let p = new pool();
            p.init(line_i16p.BYTES_LENGTH * 3);
            let a = new line_i16p(p, 12, -38, 46, 40);
            let b = new pointi(-94, -30);
            let c = new linei(0, 0, 0, 0);
            let d = line_translate(a, b, c);
            test_line(a, 12, -38, 46, 40, 0);
            test_point(b, -94, -30, 0);
            test_line(c, -82, -68, -48, 10, 0);
            test_line(d, -82, -68, -48, 10, 0);
        })

        it(`line_translate_03`, () => {
            let p = new pool();
            p.init(line_i16p.BYTES_LENGTH * 3);
            let a = new line_i16p(p, -35, -89, -33, 55);
            let b = new line_i16p_ref(a.buffer, a.byteOffset);
            let c = new pointi(2, 13);
            let d = new line_i16p(p, 0, 0, 0, 0);
            let e = new line_i16p_ref(d.buffer, d.byteOffset);
            let f = line_translate(b, c, e);
            test_line(a, -35, -89, -33, 55, 0);
            test_line(b, -35, -89, -33, 55, 0);
            test_point(c, 2, 13, 0);
            test_line(d, -33, -76, -31, 68, 0);
            test_line(e, -33, -76, -31, 68, 0);
            test_line(f, -33, -76, -31, 68, 0);
        })

        it(`line_translate_04`, () => {
            let p = new pool();
            p.init(line_f32p.BYTES_LENGTH * 3);
            let a = new line_f32p(p, -88.1814117431640625, -92.95436859130859375, -7.78879451751708984375, -75.85654449462890625);
            let b = new pointf(-2.0003759860992431640625, -29.6032238006591796875);
            let c = new line_f32p(p, 0, 0, 0, 0);
            let d = line_translate(a, b, c);
            test_line(a, -88.1814117431640625, -92.95436859130859375, -7.78879451751708984375, -75.85654449462890625, 3);
            test_point(b, -2.0003759860992431640625, -29.6032238006591796875, 3);
            test_line(c, -90.1817877292633056640625, -122.5575923919677734375, -9.7891705036163330078125, -105.4597682952880859375, 3);
            test_line(d, -90.1817877292633056640625, -122.5575923919677734375, -9.7891705036163330078125, -105.4597682952880859375, 3);
        })

        it(`line_translate_05`, () => {
            let p = new pool();
            p.init(line_f32p.BYTES_LENGTH * 3);
            let a = new line_f32p(p, -1.26313149929046630859375, -30.2802257537841796875, -45.17943572998046875, -90.8931121826171875);
            let b = new line_f32p_ref(a.buffer, a.byteOffset);
            let c = new pointf(-22.4915218353271484375, -11.35444355010986328125);
            let d = new line_f32p(p, 0, 0, 0, 0);
            let e = new line_f32p_ref(d.buffer, d.byteOffset);
            let f = line_translate(b, c, e);
            test_line(a, -1.26313149929046630859375, -30.2802257537841796875, -45.17943572998046875, -90.8931121826171875, 3);
            test_line(b, -1.26313149929046630859375, -30.2802257537841796875, -45.17943572998046875, -90.8931121826171875, 3);
            test_point(c, -22.4915218353271484375, -11.35444355010986328125, 3);
            test_line(d, -23.7546533346176147460938, -41.63466930389404296875, -67.6709575653076171875, -102.24755573272705078125, 3);
            test_line(e, -23.7546533346176147460938, -41.63466930389404296875, -67.6709575653076171875, -102.24755573272705078125, 3);
            test_line(f, -23.7546533346176147460938, -41.63466930389404296875, -67.6709575653076171875, -102.24755573272705078125, 3);
        })
    });

    describe("line_rad_angle", () => {
        it("should return 0 for a horizontal line from (0, 0) to (4, 0)", () => {
            const line = [0, 0, 4, 0];
            expect(line_rad_angle(line)).toEqual(0);
        });

        it("should return PI/2 for a vertical line from (0, 0) to (0, 4)", () => {
            const line = [0, 0, 0, 4];
            expect(line_rad_angle(line)).toBeCloseTo(4.712388, 5);
        });

        it("should return PI for a line from (0, 0) to (-4, 0)", () => {
            const line = [0, 0, -4, 0];
            expect(line_rad_angle(line)).toBeCloseTo(3.141592, 5);
        });

        it("should return 3*PI/2 for a line from (0, 0) to (0, -4)", () => {
            const line = [0, 0, 0, -4];
            expect(line_rad_angle(line)).toBeCloseTo(1.570796, 5);
        });

        it("should return PI/4 for a line from (0, 0) to (4, 4)", () => {
            const line = [0, 0, 4, 4];
            expect(line_rad_angle(line)).toBeCloseTo(5.497787, 5);
        });

        it("should return 7*PI/4 for a line from (0, 0) to (-4, -4)", () => {
            const line = [0, 0, -4, -4];
            expect(line_rad_angle(line)).toBeCloseTo(2.356194, 5);
        });

        it("should return 0 for a horizontal line from (0, 0) to (4, 0)", () => {
            const line = [0, 0, 4, 0];
            expect(line_deg_angle(line)).toEqual(0);
        });

        it("should return 270 for a vertical line from (0, 0) to (0, 4)", () => {
            const line = [0, 0, 0, 4];
            expect(line_deg_angle(line)).toEqual(270);
        });

        it(`line_angle_00`, () => {
            let a = new linei(-57, -64, 78, -58);
            let b = line_rad_angle(a);
            let c = line_deg_angle(a);
            test_line(a, -57, -64, 78, -58, 0);
            expect(b).toBeCloseTo(6.23876919116585160196564, 3);
            expect(c).toBeCloseTo(357.455195620186884752911, 3);
        })

        it(`line_angle_01`, () => {
            let a = new linef(-94.9744110107421875, 6.009180545806884765625, -7.266294002532958984375, -69.39174652099609375);
            let b = line_rad_angle(a);
            let c = line_deg_angle(a);
            test_line(a, -94.9744110107421875, 6.009180545806884765625, -7.266294002532958984375, -69.39174652099609375, 0);
            expect(b).toBeCloseTo(0.710087011000032464203002, 3);
            expect(c).toBeCloseTo(40.6849946915471250008522, 3);
        })

        it(`line_angle_02`, () => {
            let p = new pool();
            p.init(line_i16p.BYTES_LENGTH * 1);
            let a = new line_i16p(p, -72, 24, 84, 75);
            let b = line_rad_angle(a);
            let c = line_deg_angle(a);
            test_line(a, -72, 24, 84, 75, 0);
            expect(b).toBeCloseTo(5.9672141736674753076386, 3);
            expect(c).toBeCloseTo(341.896236965493358184176, 3);
        })

        it(`line_angle_03`, () => {
            let p = new pool();
            p.init(line_i16p.BYTES_LENGTH * 1);
            let a = new line_i16p(p, -37, -64, 99, 59);
            let b = new line_i16p_ref(a.buffer, a.byteOffset);
            let c = line_rad_angle(a);
            let d = line_deg_angle(a);
            test_line(a, -37, -64, 99, 59, 0);
            test_line(b, -37, -64, 99, 59, 0);
            expect(c).toBeCloseTo(5.547937305395663543095, 3);
            expect(d).toBeCloseTo(317.873438497593497231719, 3);
        })

        it(`line_angle_04`, () => {
            let p = new pool();
            p.init(line_f32p.BYTES_LENGTH * 1);
            let a = new line_f32p(p, -7.593494415283203125, -60.54693603515625, 34.360973358154296875, -8.665729522705078125);
            let b = line_rad_angle(a);
            let c = line_deg_angle(a);
            test_line(a, -7.593494415283203125, -60.54693603515625, 34.360973358154296875, -8.665729522705078125, 0);
            expect(b).toBeCloseTo(5.3923898330286199609418, 3);
            expect(c).toBeCloseTo(308.96122353026964901801, 3);
        })

        it(`line_angle_05`, () => {
            let p = new pool();
            p.init(line_f32p.BYTES_LENGTH * 1);
            let a = new line_f32p(p, 19.8569622039794921875, -94.79502105712890625, -70.75897979736328125, 54.425418853759765625);
            let b = new line_f32p_ref(a.buffer, a.byteOffset);
            let c = line_rad_angle(a);
            let d = line_deg_angle(a);
            test_line(a, 19.8569622039794921875, -94.79502105712890625, -70.75897979736328125, 54.425418853759765625, 0);
            test_line(b, 19.8569622039794921875, -94.79502105712890625, -70.75897979736328125, 54.425418853759765625, 0);
            expect(c).toBeCloseTo(4.16664608372512734746351, 3);
            expect(d).toBeCloseTo(238.731269790688600096473, 3);
        })
    });

    describe("line_rad_angle_between", () => {
        it("should return 0 if either line is null", () => {
            const l1 = [0, 0, 0, 0];
            const l2 = [1, 1, 2, 2];
            expect(line_rad_angle_between(l1, l2)).toEqual(0);
        });

        it("should return the correct angle between two lines", () => {
            const l1 = [0, 0, 1, 1];
            const l2 = [1, 1, 0, 2];
            expect(line_rad_angle_between(l1, l2)).toBeCloseTo(4.712388);
        });

        it("should handle angles greater than 2*PI", () => {
            const l1 = [0, 0, 1, 1];
            const l2 = [1, 1, 0, 2];
            expect(line_rad_angle_between(l1, l2)).toBeCloseTo(4.712388);
        });

        it("should handle angles less than 0", () => {
            const l1 = [0, 0, 1, 1];
            const l2 = [1, 1, 0, 0];
            expect(line_rad_angle_between(l1, l2)).toBeCloseTo(3.141592);
        });

        it("should return the correct angle between two lines", () => {
            const l1 = [0, 0, 0, 1]; // Vertical line
            const l2 = [0, 0, 1, 0]; // Horizontal line
            expect(line_deg_angle_between(l1, l2)).toEqual(90);

            const l3 = [0, 0, 1, 1]; // 45-degree line
            const l4 = [0, 0, -1, 1]; // 135-degree line
            expect(line_deg_angle_between(l3, l4)).toEqual(270);

            const l5 = [0, 0, 1, 0]; // Horizontal line
            const l6 = [0, 0, 1, 1]; // 45-degree line
            expect(line_deg_angle_between(l5, l6)).toEqual(315);
        });

        it("should handle special cases", () => {
            const l1 = [0, 0, 0, 0]; // Null line
            const l2 = [1, 1, 2, 2]; // Non-null line
            expect(line_deg_angle_between(l1, l2)).toEqual(0);

            const l3 = [0, 0, 1, 0]; // Horizontal line
            const l4 = [0, 0, 1, 0]; // Same horizontal line
            expect(line_deg_angle_between(l3, l4)).toEqual(0);
        });

        it(`line_angle_between_00`, () => {
            let a = new linei(-63, 70, 8, -3);
            let b = new linei(62, -3, 93, -41);
            let c = line_rad_angle_between(a, b);
            let d = line_deg_angle_between(a, b);
            test_line(a, -63, 70, 8, -3, 0);
            test_line(b, 62, -3, 93, -41, 0);
            expect(c).toBeCloseTo(0.0872153632129910455494937, 3);
            expect(d).toBeCloseTo(4.99707294229288834230829, 3);
        })

        it(`line_angle_between_01`, () => {
            let a = new linef(-68.1497997659402017234243, -1.06735105733383761617006, -11.5833358255124920788148, -44.5027943498644376063567);
            let b = line_rad_angle(a);
            let c = line_deg_angle(a);
            test_line(a, -68.1497997659402017234243, -1.06735105733383761617006, -11.5833358255124920788148, -44.5027943498644376063567, 0);
            expect(b).toBeCloseTo(0.654837311203488536826001, 3);
            expect(c).toBeCloseTo(37.5194196167879283621005, 3);
        })

        it(`line_angle_between_02`, () => {
            let p = new pool();
            p.init(line_i16p.BYTES_LENGTH * 2);
            let a = new line_i16p(p, -84, -81, -26, -50);
            let b = new line_i16p(p, 4, -18, 25, 33);
            let c = line_rad_angle_between(a, b);
            let d = line_deg_angle_between(a, b);
            test_line(a, -84, -81, -26, -50, 0);
            test_line(b, 4, -18, 25, 33, 0);
            expect(c).toBeCloseTo(5.59384699682881603166607, 3);
            expect(d).toBeCloseTo(320.503870435248359171965, 3);
        })

        it(`line_angle_between_03`, () => {
            let p = new pool();
            p.init(line_i16p.BYTES_LENGTH * 2);
            let a = new line_i16p(p, 42, 7, 19, -6);
            let b = new line_i16p_ref(a.buffer, a.byteOffset);
            let c = new line_i16p(p, 86, -52, -53, -43);
            let d = new line_i16p_ref(c.buffer, c.byteOffset);
            let e = line_rad_angle_between(b, d);
            let f = line_deg_angle_between(b, d);
            test_line(a, 42, 7, 19, -6, 0);
            test_line(b, 42, 7, 19, -6, 0);
            test_line(c, 86, -52, -53, -43, 0);
            test_line(d, 86, -52, -53, -43, 0);
            expect(e).toBeCloseTo(0.57910917586998911232854, 3);
            expect(f).toBeCloseTo(33.1805164453228655929706, 3);
        })

        it(`line_angle_between_04`, () => {
            let p = new pool();
            p.init(line_f32p.BYTES_LENGTH * 2);
            let a = new line_f32p(p, 34.1064577890694238249125, 63.1409903357770758702827, 39.6749991421709751193703, -37.6496599374506857316192);
            let b = new line_f32p(p, -92.6034433587583407643251, -54.3466148943006146510015, 44.7562051588624569831154, 60.2643786611208440717746);
            let c = line_rad_angle_between(a, b);
            let d = line_deg_angle_between(a, b);
            test_line(a, 34.1064577890694238249125, 63.1409903357770758702827, 39.6749991421709751193703, -37.6496599374506857316192, 3);
            test_line(b, -92.6034433587583407643251, -54.3466148943006146510015, 44.7562051588624569831154, 60.2643786611208440717746, 3);
            expect(c).toBeCloseTo(4.07222156024699621923446, 3);
            expect(d).toBeCloseTo(233.321142331732062302763, 3);
        })

        it(`line_angle_between_05`, () => {
            let p = new pool();
            p.init(line_f32p.BYTES_LENGTH * 2);
            let a = new line_f32p(p, -80.6053474833966987489475, 20.7699175002725269223447, 26.9667701560175316899404, 62.3968264352342885104008);
            let b = new line_f32p_ref(a.buffer, a.byteOffset);
            let c = new line_f32p(p, -5.61114941877922035473603, -6.27626183345526555967808, -75.8992457462939000834012, 26.1534274625713436535079);
            let d = new line_f32p_ref(c.buffer, c.byteOffset);
            let e = line_rad_angle_between(b, d);
            let f = line_deg_angle_between(b, d);
            test_line(a, -80.6053474833966987489475, 20.7699175002725269223447, 26.9667701560175316899404, 62.3968264352342885104008, 0);
            test_line(b, -80.6053474833966987489475, 20.7699175002725269223447, 26.9667701560175316899404, 62.3968264352342885104008, 0);
            test_line(c, -5.61114941877922035473603, -6.27626183345526555967808, -75.8992457462939000834012, 26.1534274625713436535079, 0);
            test_line(d, -5.61114941877922035473603, -6.27626183345526555967808, -75.8992457462939000834012, 26.1534274625713436535079, 0);
            expect(e).toBeCloseTo(3.94309237041040638871436, 3);
            expect(f).toBeCloseTo(225.922583673932336978396, 3);
        })
    });

    describe('line_intersects', () => {
        it('should return NO_INTERSECTION when lines are parallel', () => {
            const l1 = [0, 0, 10, 0];
            const l2 = [0, 10, 10, 10];
            const result = line_intersects(l1, l2);
            expect(result).toBe(NO_INTERSECTION);
        });

        it('should return BOUNDED_INTERSECTION when lines intersect', () => {
            const l1 = [0, 0, 10, 0];
            const l2 = [5, 0, 5, 10];
            const result = line_intersects(l1, l2);
            expect(result).toBe(BOUNDED_INTERSECTION);
        });

        it('should return UNBOUNDED_INTERSECTION when lines are collinear but do not intersect', () => {
            const l1 = [0, 0, 10, 0];
            const l2 = [0, 10, 10, 9];
            const result = line_intersects(l1, l2);
            expect(result).toBe(UNBOUNDED_INTERSECTION);
        });

        it('should return BOUNDED_INTERSECTION when lines intersect at an endpoint', () => {
            const l1 = [0, 0, 10, 0];
            const l2 = [0, 0, 0, 10];
            const result = line_intersects(l1, l2);
            expect(result).toBe(BOUNDED_INTERSECTION);
        });

        it('should return UNBOUNDED_INTERSECTION when lines are identical', () => {
            const l1 = [0, 0, 10, 0];
            const l2 = [0, 0, 10, 0];
            const result = line_intersects(l1, l2);
            expect(result).toBe(UNBOUNDED_INTERSECTION);
        });

        it('should return NO_INTERSECTION when lines are null', () => {
            const l1 = [0, 0, 0, 0];
            const l2 = [0, 0, 0, 0];
            const result = line_intersects(l1, l2);
            expect(result).toBe(NO_INTERSECTION);
        });

        it('should return BOUNDED_INTERSECTION when lines intersect at a negative t value', () => {
            const l1 = [-10, -4, 10, 0];
            const l2 = [-6, -6, -5, 10];
            const result = line_intersects(l1, l2);
            expect(result).toBe(BOUNDED_INTERSECTION);
        });

        it('should return BOUNDED_INTERSECTION when lines intersect at a positive t value', () => {
            const l1 = [0, 2, 20, 2];
            const l2 = [15, 0, 15, 10];
            const result = line_intersects(l1, l2);
            expect(result).toBe(BOUNDED_INTERSECTION);
        });

        it('should return NO_INTERSECTION when lines are not finite', () => {
            const l1 = [Infinity, 0, Infinity, 0];
            const l2 = [0, 0, 10, 0];
            const result = line_intersects(l1, l2);
            expect(result).toBe(NO_INTERSECTION);
        });

        it(`line_intersects_00`, () => {
            let a = new linei(98, -68, -66, 17);
            let b = new linei(25, -75, -18, -69);
            let c = new pointi(0, 0);
            let d = line_intersects(a, b, c);
            test_line(a, 98, -68, -66, 17, 0);
            test_line(b, 25, -75, -18, -69, 0);
            test_point(c, 143, -92, 0);
            expect(d).toBe(2);
        })

        it(`line_intersects_01`, () => {
            let a = new linef(2.89902087852670664602783, 1.40545638897050828575175, 1.23361279718946015293568, -0.211739209050008980739221);
            let b = new linef(-0.784026272236554522265806, -2.40030368791197012967586, 1.2871333994427027747065, -2.19734216643699697968373);
            let c = new pointf(0, 0);
            let d = line_intersects(a, b, c);
            test_line(a, 2.89902087852670664602783, 1.40545638897050828575175, 1.23361279718946015293568, -0.211739209050008980739221, 1);
            test_line(b, -0.784026272236554522265806, -2.40030368791197012967586, 1.2871333994427027747065, -2.19734216643699697968373, 1);
            test_point(c, -1.04670658023982054984913, -2.42604482013990274680282, 1);
            expect(d).toBe(2);
        })

        it(`line_intersects_02`, () => {
            let p = new pool();
            p.init(line_i16p.BYTES_LENGTH * 3);
            let a = new line_i16p(p, -11, -30, -89, -58);
            let b = new line_i16p(p, -20, 40, -60, -61);
            let c = new point_i16p(p, 0, 0);
            let d = line_intersects(a, b, c);
            test_line(a, -11, -30, -89, -58, 0);
            test_line(b, -20, 40, -60, -61, 0);
            test_point(c, -54, -45, 0);
            expect(d).toBe(1);
        })

        it(`line_intersects_03`, () => {
            let p = new pool();
            p.init(line_i16p.BYTES_LENGTH * 3);
            let a = new line_i16p(p, 97, -11, -50, 73);
            let b = new line_i16p_ref(a.buffer, a.byteOffset);
            let c = new line_i16p(p, 38, -77, -99, 56);
            let d = new line_i16p_ref(c.buffer, c.byteOffset);
            let e = new point_i16p(p, 0, 0);
            let f = new point_i16p_ref(e.buffer, e.byteOffset);
            let g = line_intersects(b, d, f);
            test_line(a, 97, -11, -50, 73, 0);
            test_line(b, 97, -11, -50, 73, 0);
            test_line(c, 38, -77, -99, 56, 0);
            test_line(d, 38, -77, -99, 56, 0);
            test_point(e, -212, 165, 0);
            test_point(f, -212, 165, 0);
            expect(g).toBe(2);
        })

        it(`line_intersects_04`, () => {
            let p = new pool();
            p.init(line_f32p.BYTES_LENGTH * 3);
            let a = new line_f32p(p, 1.12727839650978101104783, 1.89815456964457140998093, 1.28902113703710696768212, 0.941879214495656924555078);
            let b = new line_f32p(p, 2.73641887131522931753125, 0.535978193602193453415339, -0.806274743885720290847985, 1.38014852341861615769858);
            let c = new point_f32p(p, 0, 0);
            let d = line_intersects(a, b, c);
            test_line(a, 1.12727839650978101104783, 1.89815456964457140998093, 1.28902113703710696768212, 0.941879214495656924555078, 1);
            test_line(b, 2.73641887131522931753125, 0.535978193602193453415339, -0.806274743885720290847985, 1.38014852341861615769858, 1);
            test_point(c, 1.29977327147706267496119, 0.878309120736547432883867, 1);
            expect(d).toBe(2);
        })

        it(`line_intersects_05`, () => {
            let p = new pool();
            p.init(line_f32p.BYTES_LENGTH * 3);
            let a = new line_f32p(p, 3.13833232991144406298645, 2.42422067283802711301632, -0.408319524051678595100157, -1.48918348871751660134066);
            let b = new line_f32p_ref(a.buffer, a.byteOffset);
            let c = new line_f32p(p, -2.40402804156949079228411, -2.61504492081915396184399, -2.57023719330993127840657, 0.137350035571646156284942);
            let d = new line_f32p_ref(c.buffer, c.byteOffset);
            let e = new point_f32p(p, 0, 0);
            let f = new point_f32p_ref(e.buffer, e.byteOffset);
            let g = line_intersects(b, d, f);
            test_line(a, 3.13833232991144406298645, 2.42422067283802711301632, -0.408319524051678595100157, -1.48918348871751660134066, 1);
            test_line(b, 3.13833232991144406298645, 2.42422067283802711301632, -0.408319524051678595100157, -1.48918348871751660134066, 1);
            test_line(c, -2.40402804156949079228411, -2.61504492081915396184399, -2.57023719330993127840657, 0.137350035571646156284942, 1);
            test_line(d, -2.40402804156949079228411, -2.61504492081915396184399, -2.57023719330993127840657, 0.137350035571646156284942, 1);
            test_point(e, -2.34309813114568576963848, -3.62403375439263619739449, 1);
            test_point(f, -2.34309813114568576963848, -3.62403375439263619739449, 1);
            expect(g).toBe(2);
        })
    });

    describe('line_normal function', () => {
        let line, result;

        beforeEach(() => {
            line = [0, 0, 10, 10]; // A line from (0, 0) to (10, 10)
            result = [0, 0, 0, 0]; // Initialize the result line
        });

        it('should return a perpendicular line with the same starting point and length', () => {
            line_normal(line, result);
            expect(result).toEqual([0, 0, 10, -10]);
        });

        it('should handle lines with negative coordinates', () => {
            line = [-5, -5, 5, 5];
            result = [-5, -5, 0, 0];
            line_normal(line, result);
            expect(result).toEqual([-5, -5, 5, -15]);
        });

        it('should handle lines with zero length', () => {
            line = [0, 0, 0, 0];
            result = [0, 0, 0, 0];
            line_normal(line, result);
            expect(result).toEqual([0, 0, 0, 0]);
        });

        it('should handle lines with x1 and x2 equal', () => {
            line = [5, 0, 5, 10];
            result = [5, 0, 5, 0];
            line_normal(line, result);

            expect(result).toEqual([5, 0, 15, 0]);
        });

        it('should handle lines with y1 and y2 equal', () => {
            line = [0, 5, 10, 5];
            result = [0, 5, 0, 5];
            line_normal(line, result);
            expect(result).toEqual([0, 5, 0, -5]);
        });

        it('should handle lines with x1, y1, x2, and y2 equal', () => {
            line = [5, 5, 5, 5];
            result = [5, 5, 5, 5];
            line_normal(line, result);
            expect(result).toEqual([5, 5, 5, 5]);
        });

        it('should handle lines with x1 and x2 equal and y1 and y2 not equal', () => {
            line = [5, 0, 5, 10];
            result = [5, 0, 5, 0];
            line_normal(line, result);
            expect(result).toEqual([5, 0, 15, 0]);
        });

        it('should handle lines with y1 and y2 equal and x1 and x2 not equal', () => {
            line = [0, 5, 10, 5];
            result = [0, 5, 0, 5];
            line_normal(line, result);
            expect(result).toEqual([0, 5, 0, -5]);
        });

        it(`line_normal_00`, () => {
            let a = new linei(25, 82, 3, -28);
            let b = new linei(0, 0, 0, 0);
            let c = line_normal(a, b);
            test_line(a, 25, 82, 3, -28, 0);
            test_line(b, 25, 82, -85, 104, 0);
            test_line(c, 25, 82, -85, 104, 0);
        })

        it(`line_normal_01`, () => {
            let a = new linef(-12.4367915561291368931052, 96.3786058089158643724659, -5.90257935799203892202058, 0.228682264812249513852294);
            let b = new linef(0, 0, 0, 0);
            let c = line_normal(a, b);
            test_line(a, -12.4367915561291368931052, 96.3786058089158643724659, -5.90257935799203892202058, 0.228682264812249513852294, 3);
            test_line(b, -12.4367915561291368931052, 96.3786058089158643724659, -108.586715100232751751719, 89.8443936107787664013813, 3);
            test_line(c, -12.4367915561291368931052, 96.3786058089158643724659, -108.586715100232751751719, 89.8443936107787664013813, 3);
        })

        it(`line_normal_02`, () => {
            let p = new pool();
            p.init(line_i16p.BYTES_LENGTH * 2);
            let a = new line_i16p(p, 84, 76, 98, -97);
            let b = new line_i16p(p, 0, 0, 0, 0);
            let c = line_normal(a, b);
            test_line(a, 84, 76, 98, -97, 0);
            test_line(b, 84, 76, -89, 62, 0);
            test_line(c, 84, 76, -89, 62, 0);
        })

        it(`line_normal_03`, () => {
            let p = new pool();
            p.init(line_i16p.BYTES_LENGTH * 2);
            let a = new line_i16p(p, -61, -90, -15, -92);
            let b = new line_i16p_ref(a.buffer, a.byteOffset);
            let c = new line_i16p(p, 0, 0, 0, 0);
            let d = new line_i16p_ref(c.buffer, c.byteOffset);
            let e = line_normal(b, d);
            test_line(a, -61, -90, -15, -92, 0);
            test_line(b, -61, -90, -15, -92, 0);
            test_line(c, -61, -90, -63, -136, 0);
            test_line(d, -61, -90, -63, -136, 0);
            test_line(e, -61, -90, -63, -136, 0);
        })

        it(`line_normal_04`, () => {
            let p = new pool();
            p.init(line_f32p.BYTES_LENGTH * 2);
            let a = new line_f32p(p, 25.8694565462916870046683, 79.4609417655308618577692, 42.6421587019023604625545, -90.4372191627739852037848);
            let b = new line_f32p(p, 0, 0, 0, 0);
            let c = line_normal(a, b);
            test_line(a, 25.8694565462916870046683, 79.4609417655308618577692, 42.6421587019023604625545, -90.4372191627739852037848, 3);
            test_line(b, 25.8694565462916870046683, 79.4609417655308618577692, -144.028704382013131635176, 62.688239609920188399883, 3);
            test_line(c, 25.8694565462916870046683, 79.4609417655308618577692, -144.028704382013131635176, 62.688239609920188399883, 3);
        })

        it(`line_normal_05`, () => {
            let p = new pool();
            p.init(line_f32p.BYTES_LENGTH * 2);
            let a = new line_f32p(p, 72.3233428906246160750015, -85.3594843653694823615297, 14.5516949602605478730766, 60.0160245004399826029839);
            let b = new line_f32p_ref(a.buffer, a.byteOffset);
            let c = new line_f32p(p, 0, 0, 0, 0);
            let d = new line_f32p_ref(c.buffer, c.byteOffset);
            let e = line_normal(b, d);
            test_line(a, 72.3233428906246160750015, -85.3594843653694823615297, 14.5516949602605478730766, 60.0160245004399826029839, 3);
            test_line(b, 72.3233428906246160750015, -85.3594843653694823615297, 14.5516949602605478730766, 60.0160245004399826029839, 3);
            test_line(c, 72.3233428906246160750015, -85.3594843653694823615297, 217.69885175643409525037, -27.5878364350054141596047, 3);
            test_line(d, 72.3233428906246160750015, -85.3594843653694823615297, 217.69885175643409525037, -27.5878364350054141596047, 3);
            test_line(e, 72.3233428906246160750015, -85.3594843653694823615297, 217.69885175643409525037, -27.5878364350054141596047, 3);
        })
    });

    describe('line_point_at function', () => {
        let line, result;

        beforeEach(() => {
            line = new linef(0, 0, 10, 10); // A line from (0, 0) to (10, 10)
            result = [0, 0]; // Initialize the result point
        });

        it('should return the start point when t=0', () => {
            line_point_at(line, 0, result);
            expect(result).toEqual([0, 0]);
        });

        it('should return the end point when t=1', () => {
            line_point_at(line, 1, result);
            expect(result).toEqual([10, 10]);
        });

        it('should return a point in the middle of the line when t=0.5', () => {
            line_point_at(line, 0.5, result);
            expect(result).toEqual([5, 5]);
        });

        it('should round the result to the nearest integer when the line is an Int16Array', () => {
            line = new linei(0, 0, 10, 10); // A line from (0, 0) to (10, 10)
            line_point_at(line, 0.5, result);
            expect(result).toEqual([5, 5]);
        });

        it('should not modify the original line', () => {
            let originalLine = [0, 0, 10, 10];
            line_point_at(originalLine, 0.5, result);
            expect(originalLine).toEqual([0, 0, 10, 10]);
        });

        it('should throw an error when t is not a number', () => {
            expect(() => line_point_at(line, '0.5', result)).toThrowError('t must be a number');
        });

        it(`line_point_at_00`, () => {
            let a = new linei(-41, -83, -38, -72);
            let b = new pointi(0, 0);
            let c = line_point_at(a, 0.305469036102294921875, b);
            test_line(a, -41, -83, -38, -72, 0);
            test_point(b, -40, -80, 0);
        })

        it(`line_point_at_01`, () => {
            let a = new linef(40.2087939932994800074084, 56.9054324307295189555589, 57.9280926020441029322683, 12.7699822249575305477265);
            let b = new pointf(0, 0);
            let c = line_point_at(a, 0.130027428269386291503906, b);
            test_line(a, 40.2087939932994800074084, 56.9054324307295189555589, 57.9280926020441029322683, 12.7699822249575305477265, 0);
            test_point(b, 42.512788822131859944875, 51.1666133449614335404476, 0);
        })

        it(`line_point_at_02`, () => {
            let p = new pool();
            p.init(line_i16p.BYTES_LENGTH * 2);
            let a = new line_i16p(p, 3, -35, 0, -67);
            let b = new point_i16p(p, 0, 0);
            let c = line_point_at(a, 0.510201871395111083984375, b);
            test_line(a, 3, -35, 0, -67, 0);
            test_point(b, 1, -51, 0);
        })

        it(`line_point_at_03`, () => {
            let p = new pool();
            p.init(line_i16p.BYTES_LENGTH * 2);
            let a = new line_i16p(p, -67, -14, 71, 5);
            let b = new line_i16p_ref(a.buffer, a.byteOffset);
            let c = new point_i16p(p, 0, 0);
            let d = new point_i16p_ref(c.buffer, c.byteOffset);
            let e = line_point_at(b, 0.864236652851104736328125, d);
            test_line(a, -67, -14, 71, 5, 0);
            test_line(b, -67, -14, 71, 5, 0);
            test_point(c, 52, 2, 0);
            test_point(d, 52, 2, 0);
            test_point(e, 52, 2, 0);
        })

        it(`line_point_at_04`, () => {
            let p = new pool();
            p.init(line_f32p.BYTES_LENGTH * 2);
            let a = new line_f32p(p, 23.7108774444475756126849, 74.3584550627955991330964, 93.0958363277250953160546, 50.7049462558205448203807);
            let b = new point_f32p(p, 0, 0);
            let c = line_point_at(a, 0.742632329463958740234375, b);
            test_line(a, 23.7108774444475756126849, 74.3584550627955991330964, 93.0958363277250953160546, 50.7049462558205448203807, 3);
            test_point(b, 75.2383910896969609893858, 56.7925947174754526258766, 3);
        })

        it(`line_point_at_05`, () => {
            let p = new pool();
            p.init(line_f32p.BYTES_LENGTH * 2);
            let a = new line_f32p(p, 88.8570271738324493071559, -20.5166691926989699368278, -70.8314314363567234522634, 5.86435519232794888466742);
            let b = new line_f32p_ref(a.buffer, a.byteOffset);
            let c = new point_f32p(p, 0, 0);
            let d = new point_f32p_ref(c.buffer, c.byteOffset);
            let e = line_point_at(b, 0.92981040477752685546875, d);
            test_line(a, 88.8570271738324493071559, -20.5166691926989699368278, -70.8314314363567234522634, 5.86435519232794888466742, 3);
            test_line(b, 88.8570271738324493071559, -20.5166691926989699368278, -70.8314314363567234522634, 5.86435519232794888466742, 3);
            test_point(c, -59.6229631648068902904924, 4.01268176918871688485524, 3);
            test_point(d, -59.6229631648068902904924, 4.01268176918871688485524, 3);
            test_point(e, -59.6229631648068902904924, 4.01268176918871688485524, 3);
        })
    });

    describe('line_set_angle', () => {
        let line;

        beforeEach(() => {
            line = new linef(0, 0, 10, 10); // A line from (0, 0) to (10, 10)
        });

        it('should set the angle of the line to 0 radians', () => {
            line_set_rad_angle(line, 0);
            expect(line[x2]).toBeCloseTo(14.142135);
            expect(line[y2]).toBe(0);
        });

        it('should set the angle of the line to PI/2 radians (90 degrees)', () => {
            line_set_rad_angle(line, Math.PI / 2);
            expect(line[x2]).toBeCloseTo(0, 1);
            expect(line[y2]).toBeCloseTo(-14.142135, 1);
        });

        it('should set the angle of the line to PI radians (180 degrees)', () => {
            line_set_rad_angle(line, Math.PI);
            expect(line[x2]).toBeCloseTo(-14.142135);
            expect(line[y2]).toBeCloseTo(0);
        });

        it('should set the angle of the line to 3PI/2 radians (270 degrees)', () => {
            line_set_rad_angle(line, 3 * Math.PI / 2);
            expect(line[x2]).toBeCloseTo(0);
            expect(line[y2]).toBeCloseTo(14.142135);
        });

        it('should set the angle of the line to 2PI radians (360 degrees)', () => {
            line_set_rad_angle(line, 2 * Math.PI);
            expect(line[x2]).toBeCloseTo(14.142135);
            expect(line[y2]).toBeCloseTo(0);
        });

        it('should handle negative angles correctly', () => {
            line_set_rad_angle(line, -Math.PI / 2);
            expect(line[x2]).toBeCloseTo(0);
            expect(line[y2]).toBeCloseTo(14.142135);
        });

        it('should handle angles greater than 2PI correctly', () => {
            line_set_rad_angle(line, 3 * Math.PI);
            expect(line[x2]).toBeCloseTo(-14.142135);
            expect(line[y2]).toBeCloseTo(0);
        });

        it('should handle zero length lines correctly', () => {
            line = [0, 0, 0, 0];
            line_set_rad_angle(line, Math.PI / 2);
            expect(line[x2]).toBe(0);
            expect(line[y2]).toBe(0);
        });

        it('should set the angle of the line to 45 degrees', () => {
            line_set_deg_angle(line, 45);
            expect(line_rad_angle(line)).toBeCloseTo(Math.PI / 4, 10);
        });

        it('should set the angle of the line to 90 degrees', () => {
            line_set_deg_angle(line, 90);
            expect(line_rad_angle(line)).toBeCloseTo(Math.PI / 2, 10);
        });

        it('should set the angle of the line to 180 degrees', () => {
            line_set_deg_angle(line, 180);
            expect(line_rad_angle(line)).toBeCloseTo(Math.PI, 10);
        });

        it('should set the angle of the line to 270 degrees', () => {
            line_set_deg_angle(line, 270);
            expect(line_rad_angle(line)).toBeCloseTo(3 * Math.PI / 2, 10);
        });

        it('should set the angle of the line to 360 degrees', () => {
            line_set_deg_angle(line, 360);
            expect(line_rad_angle(line)).toBeCloseTo(0, 10);
        });

        it('should set the angle of the line to -45 degrees', () => {
            line_set_deg_angle(line, -45);
            expect(line_rad_angle(line)).toBeCloseTo(7 * Math.PI / 4, 10);
        });

        it('should set the angle of the line to -90 degrees', () => {
            line_set_deg_angle(line, -90);
            expect(line_rad_angle(line)).toBeCloseTo(3 * Math.PI / 2, 10);
        });

        it('should set the angle of the line to -180 degrees', () => {
            line_set_deg_angle(line, -180);
            expect(line_rad_angle(line)).toBeCloseTo(Math.PI, 10);
        });

        it('should set the angle of the line to -270 degrees', () => {
            line_set_deg_angle(line, -270);
            expect(line_rad_angle(line)).toBeCloseTo(1.570796);
        });

        it('should set the angle of the line to -360 degrees', () => {
            line_set_deg_angle(line, -360);
            expect(line_rad_angle(line)).toBeCloseTo(0, 10);
        });

        it(`line_set_angle_00`, () => {
            let a = new linei(80, -17, 94, 2);
            let b = new linei(80, -17, 94, 2);
            line_set_rad_angle(a, 5.54841518402099609375);
            line_set_deg_angle(b, 317.900787353515625);
            test_line(a, 80, -17, 98, -1, 0);
            test_line(b, 80, -17, 98, -1, 0);
        })

        it(`line_set_angle_01`, () => {
            let a = new linef(-43.3383665939167670444476, -12.4924500289292410570852, -17.647487268121309966773, 26.7418773105599285599965);
            let b = new linef(-43.3383665939167670444476, -12.4924500289292410570852, -17.647487268121309966773, 26.7418773105599285599965);
            line_set_rad_angle(a, 0.53117454051971435546875);
            line_set_deg_angle(b, 30.4340610504150390625);
            test_line(a, -43.3383665939167670444476, -12.4924500289292410570852, -2.90294716089438509243337, -36.2480930972683523805244, 3);
            test_line(b, -43.3383665939167670444476, -12.4924500289292410570852, -2.90294716089438509243337, -36.2480930972683523805244, 3);
        })
    });

    describe('line_set_length function', () => {
        let line;

        beforeEach(() => {
            line = new linef(0, 0, 10, 10); // A line from (0, 0) to (10, 10)
        });

        it('should set the length of the line to the given finite length', () => {
            line_set_length(line, 5);
            test_line(line, 0, 0, 3.535533905029297, 3.535533905029297, 0);
        });

        it('should throw an error if the new length is not a finite number', () => {
            expect(() => line_set_length(line, Infinity)).toThrowError('new length is not finite.');
            expect(() => line_set_length(line, NaN)).toThrowError('new length is not finite.');
        });

        it('should round the coordinates of the second point to the nearest integer if the original line was represented by an Int16Array', () => {
            line = new linei(0, 0, 10, 10);
            line_set_length(line, 5);
            test_line(line, 0, 0, 4, 4, 0);
        });

        it(`line_set_length_00`, () => {
            let a = new linei(-84, -60, -99, 10);
            line_set_length(a, -14.62723255157470703125);
            test_line(a, -84, -60, -81, -74, 0);
        })

        it(`line_set_length_01`, () => {
            let a = new linef(67.7829799529452827755449, -39.7743483517882552291667, -61.8870827770464444483878, -28.5150060151297992661057);
            line_set_length(a, -20.37970733642578125);
            test_line(a, 67.7829799529452827755449, -39.7743483517882552291667, 88.0862918903251426172574, -41.5372991428813023162547, 0);
        })
    });

    describe('line_unit_vector', () => {
        it('should return a unit vector with the same direction as the input line', () => {
            const inputLine = new linef(0, 0, 3, 4);
            const expectedResult = new Float64Array([0, 0, 0.6, 0.8]);
            const result = line_unit_vector(inputLine, new Float64Array(4));
            expect(result).toEqual(expectedResult);
        });

        it('should return a unit vector with the same direction as the input line (Int16Array)', () => {
            const inputLine = new linef(0, 0, 3, 4);
            const expectedResult = new Int16Array([0, 0, 1, 1]);
            const result = line_unit_vector(inputLine, new Int16Array(4));
            expect(result).toEqual(expectedResult);
        });

        it('should return a unit vector with the same direction as the input line (negative coordinates)', () => {
            const inputLine = new linef(0, 0, -3, -4);
            const expectedResult = new Float64Array([0, 0, -0.6, -0.8]);
            const result = line_unit_vector(inputLine, new Float64Array(4));
            expect(result).toEqual(expectedResult);
        });

        it('should return a unit vector with the same direction as the input line (zero length)', () => {
            const inputLine = new linef(0, 0, 0, 0);
            const expectedResult = new Float64Array([0, 0, 0, 0]);
            const result = line_unit_vector(inputLine, new Float64Array(4));
            expect(result).toEqual(expectedResult);
        });

        it('should return a unit vector with the same direction as the input line (rounded coordinates)', () => {
            const inputLine = new linef(0, 0, 3.1, 4.2);
            const expectedResult = new Float64Array([0, 0, 0.5938523024686857, 0.8045740754291307]);
            const result = line_unit_vector(inputLine, new Float64Array(4));
            expect(result).toEqual(expectedResult);
        });

        it(`line_unit_vector_00`, () => {
            let a = new linei(-57, -3, 74, -82);
            let b = new linei(0, 0, 0, 0);
            let c = line_unit_vector(a, b);
            test_line(a, -57, -3, 74, -82, 0);
            test_line(b, -57, -3, -56, -4, 0);
            test_line(c, -57, -3, -56, -4, 0);
        })

        it(`line_unit_vector_01`, () => {
            let a = new linef(66.0859721017879166993225, 55.5672058402456627845822, -21.5463507844312971428735, -13.7946024124222930140604);
            let b = new linef(0, 0, 0, 0);
            let c = line_unit_vector(a, b);
            test_line(a, 66.0859721017879166993225, 55.5672058402456627845822, -21.5463507844312971428735, -13.7946024124222930140604, 3);
            test_line(b, 66.0859721017879166993225, 55.5672058402456627845822, 65.3018662733076808990518, 54.9465786979586710003787, 3);
            test_line(c, 66.0859721017879166993225, 55.5672058402456627845822, 65.3018662733076808990518, 54.9465786979586710003787, 3);
        })
    });





})
