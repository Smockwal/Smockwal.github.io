import { pool } from '../../lib/array.js';
import {
    matgf, matg_add_numb, matg_fill, matg_at, matg_f32p, matg_f32p_ref, matg_mult_mat, matg_dot,
    matg_randomize, matg_set_at, matg_transpose
} from '../../lib/math/matg.js';
import { numb } from '../../lib/math/number.js';
import { test_matg } from '../test.js';

// http://matrixmultiplication.xyz/

// Test suite for matgf class
describe('matgf', () => {
    // Test constructor
    it('should create a new matgf instance with correct dimensions and values', () => {
        const rows = 3;
        const cols = 2;
        const arr = [1, 2, 3, 4, 5, 6];
        const mat = new matgf(rows, cols, arr);

        expect(mat).toBeDefined();
        expect(mat).toBeInstanceOf(matgf);
        expect(mat.length).toBe(rows * cols);
        expect(mat.rows).toBe(rows);
        expect(mat.cols).toBe(cols);

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                expect(mat[i * cols + j]).toBe(arr[i * cols + j]);
            }
        }
    });

    // Test type method
    it('should return the correct type', () => {
        const mat = new matgf(2, 2);
        expect(mat.type).toBe('matg');
    });

    // Test bytes_length method
    it('should return the correct length in bytes', () => {
        const rows = 3;
        const cols = 2;
        const mat = new matgf(rows, cols);
        expect(mat.bytes_length).toBe(Float32Array.BYTES_PER_ELEMENT * (rows * cols));
    });
});

describe(`matg test`, () => {
    it(`matg constructor_00`, () => {
        let m1 = new matgf(5, 4);
        test_matg(m1, 5, 4, [
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0
        ], 0);
    })
    it(`matg constructor_01`, () => {
        let m1 = new matgf(3, 7, [
            3.13771605492, 1.46855604649, -1.7889264822,
            -0.265609443188, 0.273577749729, 0.641846895218,
            -0.885823011398, 2.12964987755, 2.4215722084,
            0.230350226164, -1.20703089237, -1.0272629261,
            1.81545841694, -1.77620983124, 0.58693420887,
            1.38352942467, -0.723434686661, -2.99727869034,
            2.68472504616, -0.193359985948, 0.304164618254
        ]);
        test_matg(m1, 3, 7, [
            3.13771605492, 1.46855604649, -1.7889264822,
            -0.265609443188, 0.273577749729, 0.641846895218,
            -0.885823011398, 2.12964987755, 2.4215722084,
            0.230350226164, -1.20703089237, -1.0272629261,
            1.81545841694, -1.77620983124, 0.58693420887,
            1.38352942467, -0.723434686661, -2.99727869034,
            2.68472504616, -0.193359985948, 0.304164618254
        ], 0);
    })
    it(`matg constructor_02`, () => {
        let m1 = new matgf(2, 2, [
            1, 3,
            2, 4
        ]);
        test_matg(m1, 2, 2, [
            1, 3,
            2, 4
        ], 0);
    })
})
xdescribe(`matg_f32p test`, () => {
    it(`matg_f32p constructor_00`, () => {
        let p = new pool();
        p.init(Float32Array.BYTES_PER_ELEMENT * 8);
        let m1 = new matg_f32p(p, 4, 2, [
            -2.63373184204, -1.2325502634, 0.396887868643, 0.558292627335,
            -2.97924971581, 0.191921070218, -2.5382912159, 1.50131142139
        ]);
        test_matg(m1, 4, 2, [
            -2.63373184204, -1.2325502634, 0.396887868643, 0.558292627335,
            -2.97924971581, 0.191921070218, -2.5382912159, 1.50131142139
        ], 0);
    })
    it(`matg_f32p constructor_01`, () => {
        let p = new pool();
        p.init(Float32Array.BYTES_PER_ELEMENT * 58);

        let m1 = new matg_f32p(p, 5, 6, [
            0.97432243824, -0.401690602303, -1.80570530891, -2.38933897018, 2.64579367638,
            3.06178236008, -2.17109465599, -1.58134758472, 2.9032933712, 2.35654759407,
            -3.071362257, -0.984044730663, 0.1954831779, -1.49675357342, -2.90406084061,
            -2.92229771614, -0.218675896525, -0.582100450993, -2.40006494522, 1.07834553719,
            -0.978251814842, 1.80924737453, 1.68716144562, 1.51388990879, -2.22405123711,
            1.02942347527, 1.73831295967, 2.60710024834, -2.56562185287, 1.24602127075
        ]);
        test_matg(m1, 5, 6, [
            0.97432243824, -0.401690602303, -1.80570530891, -2.38933897018, 2.64579367638,
            3.06178236008, -2.17109465599, -1.58134758472, 2.9032933712, 2.35654759407,
            -3.071362257, -0.984044730663, 0.1954831779, -1.49675357342, -2.90406084061,
            -2.92229771614, -0.218675896525, -0.582100450993, -2.40006494522, 1.07834553719,
            -0.978251814842, 1.80924737453, 1.68716144562, 1.51388990879, -2.22405123711,
            1.02942347527, 1.73831295967, 2.60710024834, -2.56562185287, 1.24602127075
        ], 0);

        let m2 = new matg_f32p(p, 4, 7, [
            -0.396184921265, 0.130936220288, -2.68825674057, 0.819466590881,
            2.59175038338, 0.197691008449, 0.882682859898, 2.79114985466,
            2.11538100243, -2.62843346596, -1.67294239998, 1.3044564724,
            -1.93889713287, 2.63071632385, 2.34260177612, 2.65791678429,
            0.543446004391, -1.54904389381, -0.434680491686, 1.39449560642,
            2.65260958672, -0.44578269124, 0.830909788609, 1.01576697826,
            -2.85140872002, -1.54570508003, -0.801459789276, -0.111049778759
        ]);
        test_matg(m2, 4, 7, [
            -0.396184921265, 0.130936220288, -2.68825674057, 0.819466590881,
            2.59175038338, 0.197691008449, 0.882682859898, 2.79114985466,
            2.11538100243, -2.62843346596, -1.67294239998, 1.3044564724,
            -1.93889713287, 2.63071632385, 2.34260177612, 2.65791678429,
            0.543446004391, -1.54904389381, -0.434680491686, 1.39449560642,
            2.65260958672, -0.44578269124, 0.830909788609, 1.01576697826,
            -2.85140872002, -1.54570508003, -0.801459789276, -0.111049778759
        ], 0);
    })
})
xdescribe(`matg_f32p_ref test`, () => {
    it(`matg_f32p_ref constructor_00`, () => {
        let p = new pool();
        p.init(Float32Array.BYTES_PER_ELEMENT * 8);
        let m1 = new matg_f32p(p, 2, 4, [
            -2.01485180855, 2.18345069885,
            -2.22725009918, -0.270112901926,
            -1.31350839138, 1.27254736423,
            -0.148102268577, 2.27149415016
        ]);
        let m2 = new matg_f32p_ref(m1.buffer, m1.byteOffset, m1.rows, m1.cols);
        test_matg(m2, 2, 4, [
            -2.01485180855, 2.18345069885,
            -2.22725009918, -0.270112901926,
            -1.31350839138, 1.27254736423,
            -0.148102268577, 2.27149415016
        ], 0);
    })
})
xdescribe(`matg function test`, () => {
    it(`matg_at_00`, () => {
        let m1 = new matgf(4, 3, [
            -0.133982345462, 1.79584348202, -2.6327650547, 2.66552066803,
            1.32525634766, -2.884745121, 2.4571146965, 1.66183483601,
            -2.09781336784, -1.68482613564, 0.92702370882, -0.243110179901
        ]);
        test_matg(m1, 4, 3, [
            -0.133982345462, 1.79584348202, -2.6327650547, 2.66552066803,
            1.32525634766, -2.884745121, 2.4571146965, 1.66183483601,
            -2.09781336784, -1.68482613564, 0.92702370882, -0.243110179901
        ], 3);

        expect(matg_at(m1, 0, 0)).toBeCloseTo(-0.133982345462, 3);
        expect(matg_at(m1, 1, 0)).toBeCloseTo(1.79584348202, 3);
        expect(matg_at(m1, 2, 0)).toBeCloseTo(-2.6327650547, 3);
        expect(matg_at(m1, 3, 0)).toBeCloseTo(2.66552066803, 3);
        expect(matg_at(m1, 0, 1)).toBeCloseTo(1.32525634766, 3);
        expect(matg_at(m1, 1, 1)).toBeCloseTo(-2.884745121, 3);
        expect(matg_at(m1, 2, 1)).toBeCloseTo(2.4571146965, 3);
        expect(matg_at(m1, 3, 1)).toBeCloseTo(1.66183483601, 3);
        expect(matg_at(m1, 0, 2)).toBeCloseTo(-2.09781336784, 3);
        expect(matg_at(m1, 1, 2)).toBeCloseTo(-1.68482613564, 3);
        expect(matg_at(m1, 2, 2)).toBeCloseTo(0.92702370882, 3);
        expect(matg_at(m1, 3, 2)).toBeCloseTo(-0.243110179901, 3);
    })
    it(`matg_set_at_00`, () => {
        let m1 = new matgf(4, 2, [
            2.94990253448, -2.90536665916, 0.93565005064, 1.50972890854,
            2.91519761086, -1.4134978056, -2.46585798264, -2.5909743309
        ]);

        matg_set_at(m1, 0, 0, -1.58470635248);
        matg_set_at(m1, 1, 0, 2.53227971913);
        matg_set_at(m1, 2, 0, 1.28680279854);
        matg_set_at(m1, 3, 0, 1.63037175231);
        matg_set_at(m1, 0, 1, 1.5904091794);
        matg_set_at(m1, 1, 1, -2.16744084655);
        matg_set_at(m1, 2, 1, -0.402546583249);
        matg_set_at(m1, 3, 1, 2.95670065942);
        test_matg(m1, 4, 2, [
            -1.58470630646, 2.53227972984, 1.28680276871, 1.63037180901,
            1.59040915966, -2.16744089127, -0.402546584606, 2.95670056343
        ], 3);
    })
    it(`matg_randomize_00`, () => {
        let m1 = new matgf(2, 3, [
            0.938681542873, 0.84070700407,
            0.841044187546, 0.370429039001,
            0.361382931471, 0.145463332534
        ]);
        matg_randomize(m1, -1, 0);

        expect(numb.between(m1[0], -1, 0)).toBeTrue();
        expect(numb.between(m1[1], -1, 0)).toBeTrue();
        expect(numb.between(m1[2], -1, 0)).toBeTrue();
        expect(numb.between(m1[3], -1, 0)).toBeTrue();
        expect(numb.between(m1[4], -1, 0)).toBeTrue();
        expect(numb.between(m1[5], -1, 0)).toBeTrue();
    })
    it(`matg_transpose_00`, () => {
        let m1 = new matgf(6, 3, [
            0.112754188478, 0.18351559341, 0.591059446335, 1.52612602711, 1.18362152576, -2.43253350258,
            1.04916906357, 0.160748824477, -0.0999592542648, -0.439573377371, -2.47362565994, -2.52037739754,
            0.289918720722, 2.83582353592, -1.46612370014, 0.49545314908, -2.28122901917, -2.83158254623
        ]);
        let m2 = matg_transpose(m1, new matgf(6, 3));

        test_matg(m2, 3, 6, [
            0.112754188478, 1.04916906357, 0.289918720722,
            0.18351559341, 0.160748824477, 2.83582353592,
            0.591059446335, -0.0999592542648, -1.46612370014,
            1.52612602711, -0.439573377371, 0.49545314908,
            1.18362152576, -2.47362565994, -2.28122901917,
            -2.43253350258, -2.52037739754, -2.83158254623
        ], 3);
    })
    it(`matg_add_numb_00`, () => {
        let m1 = new matgf(6, 3, [
            -1.95094072819, -1.68731486797, -1.62501525879, -0.582530498505, 0.0786999836564, -2.92669606209,
            1.7527307272, 0.427624017, 1.48906910419, -0.283448576927, 1.46429371834, 1.62989151478,
            2.06800818443, 1.88873183727, 2.37693738937, 1.44780540466, 2.12258934975, 0.925047755241
        ]);
        let m2 = matg_add_numb(m1, 2.70043288293, new matgf(6, 3));

        test_matg(m2, 6, 3, [
            0.749492168427, 1.01311802864, 1.07541763783, 2.1179022789, 2.77913284302, -0.226263180375,
            4.45316362381, 3.12805700302, 4.18950176239, 2.41698431969, 4.16472673416, 4.33032417297,
            4.76844120026, 4.58916473389, 5.07737016678, 4.14823818207, 4.82302236557, 3.62548065186
        ], 3);
    })
    it(`matg_add_numb_01`, () => {
        let m1 = new matgf(6, 3, [
            -1.87925934792, 2.96720480919, 2.89395356178, 0.749379515648, 2.5711479187, -2.48651504517,
            1.41232693195, 2.68978905678, 1.13628125191, 0.532463014126, 0.342584073544, 1.59428286552,
            -1.58431470394, 2.29587054253, 1.8324495554, -0.196438372135, -2.06567001343, 2.39657616615
        ]);
        matg_add_numb(m1, 2.77927725132, m1);

        test_matg(m1, 6, 3, [
            0.900017917156, 5.74648189545, 5.67323064804, 3.52865672112, 5.35042524338, 0.292762219906,
            4.19160413742, 5.46906614304, 3.91555857658, 3.31174015999, 3.12186121941, 4.37355995178,
            1.19496250153, 5.07514762878, 4.61172676086, 2.58283877373, 0.713607251644, 5.17585325241
        ], 3);
    })
    it(`matg_mult_mat_00`, () => {
        let m1 = new matgf(3, 3), m2 = new matgf(3, 3), m3 = new matgf(3, 3);
        matg_fill(m1, 2);
        matg_fill(m2, 3);

        matg_mult_mat(m1, m2, m3);

        for (let i = 0; i < m3.length; ++i)
            expect(m3[i]).toBeCloseTo(2 * 3, 3);
    })
    it(`matg_mult_mat_01`, () => {
        let m1 = new matgf(2, 3),
            m2 = new matgf(2, 3),
            m3 = new matgf(2, 3);

        matg_fill(m1, 2);
        matg_fill(m2, 3);

        matg_mult_mat(m1, m2, m3);
        expect(m3.rows).toBe(2);
        expect(m3.cols).toBe(3);
        for (let i = 0; i < m3.length; ++i)
            expect(m3[i]).toBeCloseTo(2 * 3, 3);
    })

    it(`matg_dot_00`, () => {
        let m1 = new matgf(6, 4, [
            0.485585480928421, -0.9322708249092102, 0.2755338251590729, -0.8196632862091064,
            -0.7181380391120911, -0.5252979397773743, 0.2797839343547821, -0.6497547030448914,
            -0.1736760288476944, -0.178275004029274, 0.8756165504455566, 0.8667328357696533,
            -0.8859282732009888, 0.9886560440063477, -0.039475973695516586, -0.0007663554279133677,
            0.5061450600624084, -0.8511867523193359, 0.8743306994438171, -0.8287902474403381,
            -0.7277648448944092, 0.7805920243263245, -0.5021389722824097, 0.21272902190685272
        ]),
            m2 = new matgf(4, 1, [
                -0.16499759256839752,
                -0.4116676151752472,
                0.5954757332801819,
                0.23523525893688202
            ]),
            m3 = new matgf(6, 1);

        matg_dot(m1, m2, m3);

        expect(m3.rows).toBe(6);
        expect(m3.cols).toBe(1);
        test_matg(m3, 6, 1, [
            0.27492526173591614,
            0.34849852323532104,
            0.8273407220840454,
            -0.2845088839530945,
            0.5925753116607666,
            -0.45023518800735474,
        ], 3);

    })

})