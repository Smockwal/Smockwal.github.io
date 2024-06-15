import { pool } from '../../lib/array.js';
import { linef, linei } from '../../lib/gui/line.js';
import { pointf, pointi } from '../../lib/gui/point.js';
import { rectf, recti } from '../../lib/gui/rect.js';
import {
   MAT3_NONE_FLAG, MAT3_PROJECT_FLAG, MAT3_ROTATE_FLAG, MAT3_SCALE_FLAG, MAT3_SHEAR_FLAG, MAT3_TRANSLATE_FLAG,
   m3_11, m3_12, m3_13, m3_21, m3_22, m3_23, m3_31, m3_32, m3_33,
   mat3_add, mat3_adjoint, mat3_determinant, mat3_div, mat3_f32p, mat3_f32p_ref,
   mat3_is_affine,
   mat3_is_identity, mat3_is_invertible, mat3_map_line, mat3_map_point, mat3_map_rect, mat3_mult,
   mat3_rad_rotate, mat3_rem, mat3_scale, mat3_shear, mat3_translate, mat3f
} from '../../lib/math/mat3.js';
import { test_line, test_mat3, test_point, test_rect } from '../test.js';

describe('mat3 constant test', () => {
   it(`m3_11_00`, () => { expect(m3_11).toBe(0); })
   it(`m3_12_00`, () => { expect(m3_12).toBe(1); })
   it(`m3_13_00`, () => { expect(m3_13).toBe(2); })
   it(`m3_21_00`, () => { expect(m3_21).toBe(3); })
   it(`m3_22_00`, () => { expect(m3_22).toBe(4); })
   it(`m3_23_00`, () => { expect(m3_23).toBe(5); })
   it(`m3_31_00`, () => { expect(m3_31).toBe(6); })
   it(`m3_32_00`, () => { expect(m3_32).toBe(7); })
   it(`m3_33_00`, () => { expect(m3_33).toBe(8); })

   //it(`MAT3_IDENTITY_00`, () => { expect(MAT3_IDENTITY).toEqual(new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1])); })

   it(`MAT3_NONE_FLAG_00`, () => { expect(MAT3_NONE_FLAG).toBe(0); })
   it(`MAT3_TRANSLATE_FLAG_00`, () => { expect(MAT3_TRANSLATE_FLAG).toBe(1); })
   it(`MAT3_SCALE_FLAG_00`, () => { expect(MAT3_SCALE_FLAG).toBe(2); })
   it(`MAT3_ROTATE_FLAG_00`, () => { expect(MAT3_ROTATE_FLAG).toBe(4); })
   it(`MAT3_SHEAR_FLAG_00`, () => { expect(MAT3_SHEAR_FLAG).toBe(8); })
   it(`MAT3_PROJECT_FLAG_00`, () => { expect(MAT3_PROJECT_FLAG).toBe(16); })
})
describe(`mat3f test`, () => {

   let mat;

   beforeEach(() => {
      mat = new mat3f();
   });

   describe('constructor', () => {
      it('should create a new mat3f instance with the identity matrix', () => {
         expect(mat[0]).toBe(1);
         expect(mat[1]).toBe(0);
         expect(mat[2]).toBe(0);
         expect(mat[3]).toBe(0);
         expect(mat[4]).toBe(1);
         expect(mat[5]).toBe(0);
         expect(mat[6]).toBe(0);
         expect(mat[7]).toBe(0);
         expect(mat[8]).toBe(1);
      });

      it('should create a new mat3f instance from another mat3f instance', () => {
         const mat2 = new mat3f([2, 3, 4, 5, 6, 7, 8, 9, 10]);
         const mat3 = new mat3f(mat2);

         expect(mat3[0]).toBe(2);
         expect(mat3[1]).toBe(3);
         expect(mat3[2]).toBe(4);
         expect(mat3[3]).toBe(5);
         expect(mat3[4]).toBe(6);
         expect(mat3[5]).toBe(7);
         expect(mat3[6]).toBe(8);
         expect(mat3[7]).toBe(9);
         expect(mat3[8]).toBe(10);
      });

      it('should create a new mat3f instance as a projective transformation', () => {
         const mat2 = new mat3f(2, 3, 4, 5, 6, 7, 8, 9, 10);

         expect(mat2[0]).toBe(2);
         expect(mat2[1]).toBe(3);
         expect(mat2[2]).toBe(4);
         expect(mat2[3]).toBe(5);
         expect(mat2[4]).toBe(6);
         expect(mat2[5]).toBe(7);
         expect(mat2[6]).toBe(8);
         expect(mat2[7]).toBe(9);
         expect(mat2[8]).toBe(10);
      });
   });

   describe('static methods', () => {
      describe('IDENTITY', () => {
         it('should return a new mat3f instance representing the identity matrix', () => {
            const identity = mat3f.IDENTITY;

            expect(identity[0]).toBe(1);
            expect(identity[1]).toBe(0);
            expect(identity[2]).toBe(0);
            expect(identity[3]).toBe(0);
            expect(identity[4]).toBe(1);
            expect(identity[5]).toBe(0);
            expect(identity[6]).toBe(0);
            expect(identity[7]).toBe(0);
            expect(identity[8]).toBe(1);
         });
      });
   });

   it(`constructor_00`, () => {
      let a = new mat3f(-1.38008551332, -0.305643690843, -1.12166272761, 2.36158079716, 0.449028351538, -2.61600492779, -2.43681844898, 1.05975401182, 0.769650767502);
      test_mat3(a, -1.38008551332, -0.305643690843, -1.12166272761, 2.36158079716, 0.449028351538, -2.61600492779, -2.43681844898, 1.05975401182, 0.769650767502, 16, 0);

      let b = new mat3f(a);
      test_mat3(b, -1.38008551332, -0.305643690843, -1.12166272761, 2.36158079716, 0.449028351538, -2.61600492779, -2.43681844898, 1.05975401182, 0.769650767502, 16, 0);

      let c = new mat3f();
      test_mat3(c, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0);

   })
})
describe(`mat3_f32p test`, () => {
   it(`constructor_00`, () => {
      let p = new pool();
      p.init(mat3_f32p.BYTES_LENGTH * 3);
      let a = new mat3_f32p(p, 0.140044398043, -2.23035269054, -2.77637561008, 2.34652990104, -2.7954626565, 1.8245760763, -0.373742195955, 0.187450663108, 0.699120259419);
      test_mat3(a, 0.140044398043, -2.23035269054, -2.77637561008, 2.34652990104, -2.7954626565, 1.8245760763, -0.373742195955, 0.187450663108, 0.699120259419, 16, 0);

      let b = new mat3_f32p(p, a);
      test_mat3(b, 0.140044398043, -2.23035269054, -2.77637561008, 2.34652990104, -2.7954626565, 1.8245760763, -0.373742195955, 0.187450663108, 0.699120259419, 16, 0);

      let c = new mat3_f32p(p);
      test_mat3(c, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0);

   })
})
xdescribe(`mat3_i16p test`, () => {
   it(`constructor_00`, () => {
      let p = new pool();
      p.init(mat3_f32p.BYTES_LENGTH * 3);
      let a = new mat3_f32p(p, 2.81258318558, -0.551467145297, -0.190701512704, -2.14433292652, 2.82772978784, 2.46871271512, -0.53740421294, 0.856284778722, 0.643936277834);
      test_mat3(a, 2.81258318558, -0.551467145297, -0.190701512704, -2.14433292652, 2.82772978784, 2.46871271512, -0.53740421294, 0.856284778722, 0.643936277834, 16, 0);

      let b = new mat3_f32p(p, a);
      test_mat3(b, 2.81258318558, -0.551467145297, -0.190701512704, -2.14433292652, 2.82772978784, 2.46871271512, -0.53740421294, 0.856284778722, 0.643936277834, 16, 0);

      let c = new mat3_f32p(p);
      test_mat3(c, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0);

   })
})
xdescribe(`mat3_i16p_ref test`, () => {
   it(`constructor_00`, () => {
      let p = new pool();
      p.init(mat3_f32p_ref.BYTES_LENGTH * 1);
      let n = [-2.26468349483, 1.57248341412, -0.705671161288, -2.71154113084, -2.79042401785, 1.37323279586, -1.23884946913, 2.85366848701, 0.212834423793];
      let a = new mat3_f32p(p, n[0], n[1], n[2], n[3], n[4], n[5], n[6], n[7], n[8]);
      let b = new mat3_f32p_ref(a.buffer, a.byteOffset);
      test_mat3(b, -2.26468349483, 1.57248341412, -0.705671161288, -2.71154113084, -2.79042401785, 1.37323279586, -1.23884946913, 2.85366848701, 0.212834423793, 16, 0);

   })
})
describe(`mat3 function test`, () => {

   describe('mat3_is_affine', () => {
      it('should return true for an affine transformation matrix', () => {
         const affineMatrix = new mat3f(); // Create an identity matrix
         expect(mat3_is_affine(affineMatrix)).toBe(true);
      });

      it('should return false for a projective transformation matrix', () => {
         const projectiveMatrix = new mat3f(1, 0, 0, 0, 1, 0, 0, 0, 0); // Create a projective transformation matrix
         expect(mat3_is_affine(projectiveMatrix)).toBe(false);
      });

      it('should return false for a non-affine transformation matrix', () => {
         const nonAffineMatrix = new mat3f(1, 2, 3, 2, 4, 6, 3, 6, 9); // Create a non-affine transformation matrix
         expect(mat3_is_affine(nonAffineMatrix)).toBe(false);
      });

      it('should return false for a translation matrix', () => {
         const translationMatrix = new mat3f(1, 2, 3, 2, 4, 6, 3, 6, 9); // Create a translation matrix
         expect(mat3_is_affine(translationMatrix)).toBe(false);
      });


   });

   describe('mat3_is_identity', () => {
      it('should return true for the identity matrix', () => {
         const identityMatrix = new mat3f(); // Create an identity matrix
         expect(mat3_is_identity(identityMatrix)).toBe(true);
      });

      it('should return false for a non-identity matrix', () => {
         const nonIdentityMatrix = new mat3f(1, 2, 3, 4, 5, 6, 7, 8, 9); // Create a non-identity matrix
         expect(mat3_is_identity(nonIdentityMatrix)).toBe(false);
      });

      it(`mat3_is_identity_00`, () => {
         let a = new mat3f(2.26476805267, -0.0507075931015, -2.05786929233, -3.09817756066, 1.75675225165, 1.05680161797, -0.533607206235, 2.27349617977, -1.48790674285);
         expect(mat3_is_identity(a)).toBeFalse();
         let b = new mat3f();
         expect(mat3_is_identity(b)).toBeTrue();
      })
   });

   describe('mat3_determinant', () => {
      it('should calculate the determinant of a 3x3 matrix', () => {
         const matrix = new mat3f([1, 2, 3, 4, 5, 6, 7, 8, 9]);
         const determinant = mat3_determinant(matrix);
         expect(determinant).toBe(0);
      });

      it('should handle edge cases where the matrix is singular', () => {
         const singularMatrix = new mat3f([1, 2, 3, 2, 4, 6, 3, 6, 9]);
         const determinant = mat3_determinant(singularMatrix);
         expect(determinant).toBe(0);
      });

      it('should handle edge cases where the matrix is a zero matrix', () => {
         const zeroMatrix = new mat3f([0, 0, 0, 0, 0, 0, 0, 0, 0]);
         const determinant = mat3_determinant(zeroMatrix);
         expect(determinant).toBe(0);
      });

      it('should handle edge cases where the matrix is an identity matrix', () => {
         const identityMatrix = new mat3f([1, 0, 0, 0, 1, 0, 0, 0, 1]);
         const determinant = mat3_determinant(identityMatrix);
         expect(determinant).toBe(1);
      });

      it('should handle edge cases where the matrix is a diagonal matrix', () => {
         const diagonalMatrix = new mat3f([1, 0, 0, 0, 2, 0, 0, 0, 3]);
         const determinant = mat3_determinant(diagonalMatrix);
         expect(determinant).toBe(6);
      });

      it('should handle edge cases where the matrix is a scalar matrix', () => {
         const scalarMatrix = new mat3f([2, 0, 0, 0, 2, 0, 0, 0, 2]);
         const determinant = mat3_determinant(scalarMatrix);
         expect(determinant).toBe(8);
      });

      it('should handle edge cases where the matrix is a rotation matrix', () => {
         const rotationMatrix = new mat3f([0.5, -0.5, 0, 0.5, 0.5, 0, 0, 0, 1]);
         const determinant = mat3_determinant(rotationMatrix);
         expect(determinant).toBe(0.5);
      });

      it('should handle edge cases where the matrix is a shear matrix', () => {
         const shearMatrix = new mat3f([1, 2, 0, 0, 1, 0, 0, 0, 1]);
         const determinant = mat3_determinant(shearMatrix);
         expect(determinant).toBe(1);
      });

      it('should handle edge cases where the matrix is a projection matrix', () => {
         const projectionMatrix = new mat3f([1, 2, 3, 0, 4, 5, 0, 0, 1]);
         const determinant = mat3_determinant(projectionMatrix);
         expect(determinant).toBe(4);
      });

      it(`mat3_determinant_00`, () => {
         let a = new mat3f(2.79732946554, -2.81350253249, -0.539197202777, -2.51778616224, 1.07501194933, 1.17393633201, -0.676327593475, 2.97346265504, -1.71715089771);
         expect(mat3_determinant(a)).toBeCloseTo(3.11420155496, 3);
      })

   });

   describe('mat3_is_invertible', () => {
      it('should return true for an invertible matrix', () => {
         const matrix = new mat3f([1, 0, 0,
            0, 1, 0,
            0, 0, 1]);
         expect(mat3_is_invertible(matrix)).toBe(true);
      });

      it('should return false for a non-invertible matrix', () => {
         const matrix = new mat3f([1, 0, 0, 0, 0, 0, 0, 0, 0]);
         expect(mat3_is_invertible(matrix)).toBe(false);
      });

      it(`mat3_is_invertible_00`, () => {
         let a = new mat3f(-1.99425648956, -2.16041666786, -1.92538827272, -2.68116026283, -0.462434522041, 1.80667792099, -1.32097780531, -2.73769064985, 1.02048886893);
         expect(mat3_is_invertible(a)).toBe(true);
      })
   });

   describe('mat3_adjoint', () => {
      it(`mat3_adjoint_00`, () => {
         let a = new mat3f(-2.89001547045, 2.89839595498, -0.535062803987, -0.0830623694834, 0.557140790862, 1.95646961759, 0.780194889568, -0.687334646839, 1.22465098179);
         let b = mat3_adjoint(a, new mat3f());
         test_mat3(a, -2.89001547045, 2.89839595498, -0.535062803987, -0.0830623694834, 0.557140790862, 1.95646961759, 0.780194889568, -0.687334646839, 1.22465098179, 16, 0);
         test_mat3(b, 2.02705237018, -3.18175624846, 5.96872893944, 1.62815000958, -3.121807018, 5.69867104662, -0.377586753406, 0.27490594928, -1.36939786909, 16, 0);

      })
   });

   it(`mat3_add_00`, () => {
      let m1 = new mat3f(2.94549206875, 2.39600503013, 3.08994810383, -0.982876532137, -1.50739533384, -2.56924135943, -2.24055601734, -0.216219402136, 0.568196596062);
      let m2 = mat3_add(m1, 1.4590329964, new mat3f());
      test_mat3(m1, 2.94549206875, 2.39600503013, 3.08994810383, -0.982876532137, -1.50739533384, -2.56924135943, -2.24055601734, -0.216219402136, 0.568196596062, 16, 3);
      test_mat3(m2, 4.40452506514, 3.85503802653, 4.54898110023, 0.476156464258, -0.0483623374462, -1.11020836303, -0.781523020949, 1.24281359426, 2.02722959246, 16, 3);

   })

   it(`mat3_rem_00`, () => {
      let m1 = new mat3f(1.10169595213, 1.89342882855, -2.68914707317, -0.72728857057, -2.02385138207, 2.93312365803, -0.856982175262, 2.15805275803, 0.820886070976);
      let m2 = mat3_rem(m1, 3.13748242773, new mat3f());
      test_mat3(m1, 1.10169595213, 1.89342882855, -2.68914707317, -0.72728857057, -2.02385138207, 2.93312365803, -0.856982175262, 2.15805275803, 0.820886070976, 16, 3);
      test_mat3(m2, -2.0357864756, -1.24405359919, -5.8266295009, -3.8647709983, -5.16133380981, -0.204358769703, -3.99446460299, -0.979429669704, -2.31659635676, 16, 3);

   })

   it(`mat3_mult_00`, () => {
      let m1 = new mat3f(-2.90589497702, 0.172882166951, -0.39646444406, -1.81205643551, 0.53195182845, 2.58908930116, 2.37070716952, -1.49075033616, 0.886928055288);
      let m2 = mat3_mult(m1, 1.51187868845, new mat3f());
      test_mat3(m1, -2.90589497702, 0.172882166951, -0.39646444406, -1.81205643551, 0.53195182845, 2.58908930116, 2.37070716952, -1.49075033616, 0.886928055288, 16, 3);
      test_mat3(m2, -4.39336068662, 0.261376863825, -0.5994061437, -2.73960950711, 0.804246632714, 3.91438893691, 3.58422164614, -2.25383366304, 1.34092762497, 16, 3);

   })

   it(`mat3_mult_01`, () => {
      let m1 = new mat3f(1.45667782259, 0.418009986075, 3.12437646367, 1.07272390646, 2.65833851013, 2.18134542911, -0.169205401005, -0.954816079168, -1.85674237995);
      let m2 = new mat3f(-1.37014994719, 1.50984869876, 1.02914754278, 1.26571835993, 0.674631876967, 0.381904790571, 0.0505003422028, -0.963114240663, 0.0791786202755);
      let m3 = mat3_mult(m1, m2, new mat3f());
      test_mat3(m1, 1.45667782259, 0.418009986075, 3.12437646367, 1.07272390646, 2.65833851013, 2.18134542911, -0.169205401005, -0.954816079168, -1.85674237995, 16, 3);
      test_mat3(m2, -1.37014994719, 1.50984869876, 1.02914754278, 1.26571835993, 0.674631876967, 0.381904790571, 0.0505003422028, -0.963114240663, 0.0791786202755, 16, 3);
      test_mat3(m3, -1.3090020471, -0.527765488918, 1.90616023555, 2.00507394604, 1.31216584641, 2.29193930581, -1.07045759608, 0.888631109193, -0.68580045727, 16, 3);

   })

   it(`mat3_mult_02`, () => {
      let m1 = new mat3f(0.126676554259, -0.567066957249, 2.26697760875, 1.00633760305, -2.31137953304, -0.344047562956, -1.48464469103, -0.714814381402, 0.822889629209);
      let m2 = new mat3f();
      let m3 = mat3_mult(m1, m2, new mat3f());
      test_mat3(m1, 0.126676554259, -0.567066957249, 2.26697760875, 1.00633760305, -2.31137953304, -0.344047562956, -1.48464469103, -0.714814381402, 0.822889629209, 16, 3);
      test_mat3(m2, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3);
      test_mat3(m3, 0.126676554259, -0.567066957249, 2.26697760875, 1.00633760305, -2.31137953304, -0.344047562956, -1.48464469103, -0.714814381402, 0.822889629209, 16, 3);

   })

   it(`mat3_mult_03`, () => {
      let m1 = new mat3f();
      let m2 = new mat3f(1.12252766252, 0.654538281949, 1.91582503096, 0.64286671177, 1.88211567792, 0.715758270858, -0.437894488954, 2.62039399988, -1.55881569897);
      let m3 = mat3_mult(m1, m2, new mat3f());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3);
      test_mat3(m2, 1.12252766252, 0.654538281949, 1.91582503096, 0.64286671177, 1.88211567792, 0.715758270858, -0.437894488954, 2.62039399988, -1.55881569897, 16, 3);
      test_mat3(m3, 1.12252766252, 0.654538281949, 1.91582503096, 0.64286671177, 1.88211567792, 0.715758270858, -0.437894488954, 2.62039399988, -1.55881569897, 16, 3);

   })

   it(`mat3_mult_04`, () => {
      let m1 = new mat3f(1.46542637291, 2.01227864392, 0.463932955063, 0.293227719828, 1.24622260699, -2.54064747583, 2.15051882796, 1.98108381265, -2.05098332702);
      let m2 = new mat3f(-0.22378389983, 2.32772162544, 0.931367190878, 0.0636095116854, 1.87323784554, -0.864189061732, -0.0184891499075, 1.03666421419, -2.93014607023);
      mat3_mult(m1, m2, m1);
      test_mat3(m1, -0.208516492682, 7.66152386258, -1.73353047399, 0.0606263808435, 0.38322553695, 6.64059894941, -0.317314777858, 6.59066933578, 6.30057245425, 16, 3);
      test_mat3(m2, -0.22378389983, 2.32772162544, 0.931367190878, 0.0636095116854, 1.87323784554, -0.864189061732, -0.0184891499075, 1.03666421419, -2.93014607023, 16, 3);

   })

   it(`mat3_mult_05`, () => {
      let m1 = new mat3f(2.28022707711, 1.80711364973, 2.7814264327, -2.96861524212, -1.25235767251, 2.42173798739, 0.297860293831, -1.01165737797, -0.483987853661);
      let m2 = new mat3f(-0.245627878766, 0.937064505992, 1.32357832319, 1.43326009094, 1.79753470712, -0.959960372418, -1.68849226697, -1.5880958989, 2.52570024003);
      let m3 = mat3_mult(m1, m2, m2);
      test_mat3(m1, 2.28022707711, 1.80711364973, 2.7814264327, -2.96861524212, -1.25235767251, 2.42173798739, 0.297860293831, -1.01165737797, -0.483987853661, 16, 3);
      test_mat3(m2, -2.66644048887, 0.967897453786, 8.3083510477, -5.15486547114, -8.87889252339, 3.3896031694, -0.705921189482, -0.770755814004, 0.142984183406, 16, 3);
      test_mat3(m3, -2.66644048887, 0.967897453786, 8.3083510477, -5.15486547114, -8.87889252339, 3.3896031694, -0.705921189482, -0.770755814004, 0.142984183406, 16, 3);

   })

   it(`mat3_mult_06`, () => {
      let m1 = new mat3f();
      let m2 = mat3_translate(m1, 1.86430133725, -3.0828838207, new mat3f());
      let m3 = mat3_translate(m1, -0.33903157893, -0.357705587014, new mat3f());
      let m4 = mat3_mult(m2, m3, new mat3f());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3);
      test_mat3(m2, 1, 0, 0, 0, 1, 0, 1.86430133725, -3.0828838207, 1, 1, 3);
      test_mat3(m3, 1, 0, 0, 0, 1, 0, -0.33903157893, -0.357705587014, 1, 1, 3);
      test_mat3(m4, 1, 0, 0, 0, 1, 0, 1.52526975832, -3.44058940771, 1, 1, 3);

   })

   it(`mat3_mult_07`, () => {
      let m1 = new mat3f();
      let m2 = mat3_translate(m1, -0.10490718631, 0.554493379678, new mat3f());
      let m3 = mat3_scale(m1, 1.69199247824, 1.59884178418, new mat3f());
      let m4 = mat3_mult(m2, m3, new mat3f());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3);
      test_mat3(m2, 1, 0, 0, 0, 1, 0, -0.10490718631, 0.554493379678, 1, 1, 3);
      test_mat3(m3, 1.69199247824, 0, 0, 0, 1.59884178418, 0, 0, 0, 1, 2, 3);
      test_mat3(m4, 1.69199247824, 0, 0, 0, 1.59884178418, 0, -0.17750217015, 0.886547184481, 1, 2, 3);

   })

   it(`mat3_mult_08`, () => {
      let m1 = new mat3f();
      let m2 = mat3_translate(m1, -2.80040995917, 1.92932371018, new mat3f());
      let m3 = mat3_rad_rotate(m1, -0.100090271467, new mat3f());
      let m4 = mat3_mult(m2, m3, new mat3f());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3);
      test_mat3(m2, 1, 0, 0, 0, 1, 0, -2.80040995917, 1.92932371018, 1, 1, 3);
      test_mat3(m3, 0.994995149115, -0.0999232367256, 0, 0.0999232367256, 0.994995149115, 0, 0, 0, 1, 4, 3);
      test_mat3(m4, 0.994995149115, -0.0999232367256, 0, 0.0999232367256, 0.994995149115, 0, -2.5936100551, 2.19949375998, 1, 4, 3);

   })

   it(`mat3_mult_09`, () => {
      let m1 = new mat3f();
      let m2 = mat3_translate(m1, -1.14365572049, 0.468938363863, new mat3f());
      let m3 = mat3_shear(m1, -1.60777801644, -0.374526060686, new mat3f());
      let m4 = mat3_mult(m2, m3, new mat3f());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3);
      test_mat3(m2, 1, 0, 0, 0, 1, 0, -1.14365572049, 0.468938363863, 1, 1, 3);
      test_mat3(m3, 1, -0.374526060686, 0, -1.60777801644, 1, 0, 0, 0, 1, 8, 3);
      test_mat3(m4, 1, -0.374526060686, 0, -1.60777801644, 1, 0, -1.89760451297, 0.897267235638, 1, 8, 3);

   })

   it(`mat3_mult_010`, () => {
      let m1 = new mat3f();
      let m2 = mat3_scale(m1, -1.58380920085, 0.665982849727, new mat3f());
      let m3 = mat3_translate(m1, -0.447749327545, -0.43272908998, new mat3f());
      let m4 = mat3_mult(m2, m3, new mat3f());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3);
      test_mat3(m2, -1.58380920085, 0, 0, 0, 0.665982849727, 0, 0, 0, 1, 2, 3);
      test_mat3(m3, 1, 0, 0, 0, 1, 0, -0.447749327545, -0.43272908998, 1, 1, 3);
      test_mat3(m4, -1.58380920085, 0, 0, 0, 0.665982849727, 0, -0.447749327545, -0.43272908998, 1, 2, 3);

   })

   it(`mat3_mult_011`, () => {
      let m1 = new mat3f();
      let m2 = mat3_scale(m1, 3.02219430261, -2.36647842478, new mat3f());
      let m3 = mat3_scale(m1, 0.42295700624, -0.895069125438, new mat3f());
      let m4 = mat3_mult(m2, m3, new mat3f());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3);
      test_mat3(m2, 3.02219430261, 0, 0, 0, -2.36647842478, 0, 0, 0, 1, 2, 3);
      test_mat3(m3, 0.42295700624, 0, 0, 0, -0.895069125438, 0, 0, 0, 1, 2, 3);
      test_mat3(m4, 1.27825825451, 0, 0, 0, 2.11816177404, 0, 0, 0, 1, 2, 3);

   })

   it(`mat3_mult_012`, () => {
      let m1 = new mat3f();
      let m2 = mat3_scale(m1, -2.22736850821, 1.67924705054, new mat3f());
      let m3 = mat3_rad_rotate(m1, -0.112558651072, new mat3f());
      let m4 = mat3_mult(m2, m3, new mat3f());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3);
      test_mat3(m2, -2.22736850821, 0, 0, 0, 1.67924705054, 0, 0, 0, 1, 2, 3);
      test_mat3(m3, 0.993671960334, -0.112321125556, 0, 0.112321125556, 0.993671960334, 0, 0, 0, 1, 4, 3);
      test_mat3(m4, -2.21327363194, 0.250180537869, 0, 0.188614918803, 1.6686207086, 0, 0, 0, 1, 4, 3);

   })

   it(`mat3_mult_013`, () => {
      let m1 = new mat3f();
      let m2 = mat3_scale(m1, -1.97479338759, -0.699738395148, new mat3f());
      let m3 = mat3_shear(m1, -3.02272366214, -1.33181767443, new mat3f());
      let m4 = mat3_mult(m2, m3, new mat3f());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3);
      test_mat3(m2, -1.97479338759, 0, 0, 0, -0.699738395148, 0, 0, 0, 1, 2, 3);
      test_mat3(m3, 1, -1.33181767443, 0, -3.02272366214, 1, 0, 0, 0, 1, 8, 3);
      test_mat3(m4, -1.97479338759, 2.63006473694, 0, 2.11511580432, -0.699738395148, 0, 0, 0, 1, 8, 3);

   })

   it(`mat3_mult_014`, () => {
      let m1 = new mat3f();
      let m2 = mat3_rad_rotate(m1, -2.40049535195, new mat3f());
      let m3 = mat3_translate(m1, -1.26399042195, 2.92925209736, new mat3f());
      let m4 = mat3_mult(m2, m3, new mat3f());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3);
      test_mat3(m2, -0.737728217065, -0.675097828278, 0, 0.675097828278, -0.737728217065, 0, 0, 0, 1, 4, 3);
      test_mat3(m3, 1, 0, 0, 0, 1, 0, -1.26399042195, 2.92925209736, 1, 1, 3);
      test_mat3(m4, -0.737728217065, -0.675097828278, 0, 0.675097828278, -0.737728217065, 0, -1.26399042195, 2.92925209736, 1, 4, 3);

   })

   it(`mat3_mult_015`, () => {
      let m1 = new mat3f();
      let m2 = mat3_rad_rotate(m1, 0.0722249196447, new mat3f());
      let m3 = mat3_scale(m1, 0.22338175839, -0.407463449055, new mat3f());
      let m4 = mat3_mult(m2, m3, new mat3f());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3);
      test_mat3(m2, 0.997392914096, 0.0721621432056, 0, -0.0721621432056, 0.997392914096, 0, 0, 0, 1, 4, 3);
      test_mat3(m3, 0.22338175839, 0, 0, 0, -0.407463449055, 0, 0, 0, 1, 2, 3);
      test_mat3(m4, 0.222799382956, -0.0294034357618, 0, -0.0161197064384, -0.406401156841, 0, 0, 0, 1, 8, 3);

   })

   it(`mat3_mult_016`, () => {
      let m1 = new mat3f();
      let m2 = mat3_rad_rotate(m1, 1.19964751523, new mat3f());
      let m3 = mat3_rad_rotate(m1, -2.20648496245, new mat3f());
      let m4 = mat3_mult(m2, m3, new mat3f());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3);
      test_mat3(m2, 0.36268626154, 0.93191130248, 0, -0.93191130248, 0.36268626154, 0, 0, 0, 1, 4, 3);
      test_mat3(m3, -0.593731774742, -0.804663022427, 0, 0.804663022427, -0.593731774742, 0, 0, 0, 1, 4, 3);
      test_mat3(m4, 0.534536207549, -0.845145574927, 0, 0.845145574927, 0.534536207549, 0, 0, 0, 1, 4, 3);

   })

   it(`mat3_mult_017`, () => {
      let m1 = new mat3f();
      let m2 = mat3_rad_rotate(m1, 1.15912814747, new mat3f());
      let m3 = mat3_shear(m1, 1.31129143889, -1.2169695953, new mat3f());
      let m4 = mat3_mult(m2, m3, new mat3f());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3);
      test_mat3(m2, 0.400138694643, 0.916454595193, 0, -0.916454595193, 0.400138694643, 0, 0, 0, 1, 4, 3);
      test_mat3(m3, 1, -1.2169695953, 0, 1.31129143889, 1, 0, 0, 0, 1, 8, 3);
      test_mat3(m4, 1.60187775945, 0.42949796991, 0, -0.391756150537, 1.51543607246, 0, 0, 0, 1, 8, 3);

   })

   it(`mat3_mult_018`, () => {
      let m1 = new mat3f();
      let m2 = mat3_shear(m1, -2.11740205514, 0.868985326193, new mat3f());
      let m3 = mat3_translate(m1, -1.47894304381, -0.880618135165, new mat3f());
      let m4 = mat3_mult(m2, m3, new mat3f());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3);
      test_mat3(m2, 1, 0.868985326193, 0, -2.11740205514, 1, 0, 0, 0, 1, 8, 3);
      test_mat3(m3, 1, 0, 0, 0, 1, 0, -1.47894304381, -0.880618135165, 1, 1, 3);
      test_mat3(m4, 1, 0.868985326193, 0, -2.11740205514, 1, 0, -1.47894304381, -0.880618135165, 1, 8, 3);

   })

   it(`mat3_mult_019`, () => {
      let m1 = new mat3f();
      let m2 = mat3_shear(m1, 0.140621870666, 0.218315986588, new mat3f());
      let m3 = mat3_scale(m1, 2.29751025341, 1.18645805611, new mat3f());
      let m4 = mat3_mult(m2, m3, new mat3f());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3);
      test_mat3(m2, 1, 0.218315986588, 0, 0.140621870666, 1, 0, 0, 0, 1, 8, 3);
      test_mat3(m3, 2.29751025341, 0, 0, 0, 1.18645805611, 0, 0, 0, 1, 2, 3);
      test_mat3(m4, 2.29751025341, 0.259022761065, 0, 0.323080189708, 1.18645805611, 0, 0, 0, 1, 8, 3);

   })

   it(`mat3_mult_020`, () => {
      let m1 = new mat3f();
      let m2 = mat3_shear(m1, -1.64723919501, 1.71799675228, new mat3f());
      let m3 = mat3_rad_rotate(m1, -2.30997829389, new mat3f());
      let m4 = mat3_mult(m2, m3, new mat3f());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3);
      test_mat3(m2, 1, 1.71799675228, 0, -1.64723919501, 1, 0, 0, 0, 1, 8, 3);
      test_mat3(m3, -0.673683594509, -0.739019901281, 0, 0.739019901281, -0.673683594509, 0, 0, 0, 1, 4, 3);
      test_mat3(m4, 0.595950195765, -1.89640612871, 0, 1.84873792319, 0.543658952777, 0, 0, 0, 1, 8, 3);

   })

   it(`mat3_mult_021`, () => {
      let m1 = new mat3f();
      let m2 = mat3_shear(m1, 2.75126109458, -2.72740176115, new mat3f());
      let m3 = mat3_shear(m1, -1.37231411435, -3.03925184347, new mat3f());
      let m4 = mat3_mult(m2, m3, new mat3f());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3);
      test_mat3(m2, 1, -2.72740176115, 0, 2.75126109458, 1, 0, 0, 0, 1, 8, 3);
      test_mat3(m3, 1, -3.03925184347, 0, -1.37231411435, 1, 0, 0, 0, 1, 8, 3);
      test_mat3(m4, 4.74285193232, -5.76665360462, 0, 1.37894698023, -7.36177535356, 0, 0, 0, 1, 8, 3);

   })

   it(`mat3_mult_022`, () => {
      let m1 = new mat3f();
      let m2 = mat3_translate(m1, -2.33052718667, -1.72645700657, new mat3f());
      let m3 = mat3_scale(m1, -2.02822026535, -2.95815033929, new mat3f());
      let m4 = mat3_rad_rotate(m1, 2.92004505002, new mat3f());
      let m5 = mat3_shear(m1, -2.3313211785, 0.11996403594, new mat3f());
      mat3_mult(m1, m2, m1);
      mat3_mult(m1, m3, m1);
      mat3_mult(m1, m4, m1);
      mat3_mult(m1, m5, m1);
      test_mat3(m1, 3.01767186225, -0.208313884839, 0, -6.07781758016, 2.96382822707, 0, 3.46032443046, -4.6314408369, 1, 8, 3);

   })

   it(`mat3_mult_023`, () => {
      let m1 = new mat3f(-2.31242244301, -0.0560520546416, -2.68230257495, -0.858906905968, 2.05702435486, 2.10901329057, -2.83504842388, -0.14747534728, -2.66209643948);
      let iden = new mat3f();
      let m2 = mat3_translate(iden, -0.227200547104, 1.36458165019, new mat3f());
      mat3_mult(m1, m2, m1);
      test_mat3(m1, -1.70300183048, -3.71627292867, -2.68230257495, -1.33807587944, 4.93494519118, 2.10901329057, -2.23021865638, -3.78012329964, -2.66209643948, 16, 3);

   })

   it(`mat3_mult_024`, () => {
      let m1 = new mat3f(0.934442269477, 2.89916265679, -0.317421412774, 1.79795601292, 2.6978284094, 2.55744004766, 0.710166088494, -2.56403146398, 0.567659570043);
      let iden = new mat3f();
      let m2 = mat3_translate(iden, 1.61072072393, -1.40463446207, new mat3f());
      let m3 = mat3_scale(iden, -2.35109327699, -0.214250574073, new mat3f());
      let m4 = mat3_rad_rotate(iden, -1.50141278159, new mat3f());
      let m5 = mat3_shear(iden, -2.75671788133, -2.39454247473, new mat3f());
      mat3_mult(m1, m2, m1);
      mat3_mult(m1, m3, m1);
      mat3_mult(m1, m4, m1);
      mat3_mult(m1, m5, m1);
      test_mat3(m1, -3.3830152666, 2.81995866188, -0.317421412774, -39.0693262821, 15.7436348237, 2.55744004766, -10.1875675143, 2.77380490038, 0.567659570043, 16, 3);

   })

   it(`mat3_div_00`, () => {
      let m1 = new mat3f(0.909303634018, 0.258296245129, 0.810515146863, 1.63603007022, 2.28930110331, -2.55655372592, -0.106968430647, -2.82625777795, 0.697964148851);
      let m2 = mat3_div(m1, -2.66970751136, new mat3f());
      test_mat3(m1, 0.909303634018, 0.258296245129, 0.810515146863, 1.63603007022, 2.28930110331, -2.55655372592, -0.106968430647, -2.82625777795, 0.697964148851, 16, 3);
      test_mat3(m2, -0.340600470332, -0.0967507654043, -0.303596983346, -0.612812475995, -0.857510080627, 0.957615662032, 0.0400674718828, 1.05863948239, -0.261438433192, 16, 3);

   })

   it(`mat3_translate_00`, () => {
      let m1 = new mat3f();
      let m2 = mat3_translate(m1, 1.14306711624, 2.58639148162, new mat3f());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3);
      test_mat3(m2, 1, 0, 0, 0, 1, 0, 1.14306711624, 2.58639148162, 1, 1, 3);

   })

   it(`mat3_translate_01`, () => {
      let m1 = new mat3f();
      let p1 = new pointf(-1.90190314427, -1.36755079329);
      let m2 = mat3_translate(m1, p1, new mat3f());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3);
      test_point(p1, -1.90190314427, -1.36755079329, 3);
      test_mat3(m2, 1, 0, 0, 0, 1, 0, -1.90190314427, -1.36755079329, 1, 1, 3);

   })

   it(`mat3_translate_02`, () => {
      let m1 = new mat3f();
      let m2 = mat3_scale(m1, -1.06586329166, 0.53809900555, new mat3f());
      let m3 = mat3_translate(m2, 3.04489806278, 1.4210357307, new mat3f());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3);
      test_mat3(m2, -1.06586329166, 0, 0, 0, 0.53809900555, 0, 0, 0, 1, 2, 3);
      test_mat3(m3, -1.06586329166, 0, 0, 0, 0.53809900555, 0, -3.24544507196, 0.764657913542, 1, 2, 3);

   })

   it(`mat3_translate_03`, () => {
      let m1 = new mat3f();
      let m2 = mat3_rad_rotate(m1, -2.5128072566, new mat3f());
      let m3 = mat3_translate(m2, 0.928056014819, -2.6736906203, new mat3f());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3);
      test_mat3(m2, -0.808742489107, -0.588162890969, 0, 0.588162890969, -0.808742489107, 0, 0, 0, 1, 4, 3);
      test_mat3(m3, -0.808742489107, -0.588162890969, 0, 0.588162890969, -0.808742489107, 0, -2.32312393625, 1.61647909871, 1, 4, 3);

   })

   it(`mat3_scale_00`, () => {
      let m1 = new mat3f();
      let m2 = mat3_scale(m1, 1.6844087436, 3.13649479336, new mat3f());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3);
      test_mat3(m2, 1.6844087436, 0, 0, 0, 3.13649479336, 0, 0, 0, 1, 2, 3);

   })

   it(`mat3_scale_01`, () => {
      let m1 = new mat3f();
      let p1 = new pointf(-2.04050380342, 0.00173301100465);
      let m2 = mat3_scale(m1, p1, new mat3f());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3);
      test_point(p1, -2.04050380342, 0.00173301100465, 3);
      test_mat3(m2, -2.04050380342, 0, 0, 0, 0.00173301100465, 0, 0, 0, 1, 2, 3);

   })

   it(`mat3_scale_02`, () => {
      let m1 = new mat3f(0.12289542719, -2.8445724786, -1.95277243559, 2.26832789399, 0.367127145021, -2.91794160551, -2.091762018, 0.47816612241, 2.69419689042);
      let m2 = mat3_scale(m1, 0.284929942796, -2.86415677952, new mat3f());
      test_mat3(m1, 0.12289542719, -2.8445724786, -1.95277243559, 2.26832789399, 0.367127145021, -2.91794160551, -2.091762018, 0.47816612241, 2.69419689042, 16, 3);
      test_mat3(m2, 0.0350165870392, -0.810503873605, -0.556403338365, -6.49684671574, -1.05150970136, 8.35744223167, -2.091762018, 0.47816612241, 2.69419689042, 16, 3);

   })

   it(`mat3_rad_rotate_00`, () => {
      let m1 = new mat3f();
      let m2 = mat3_rad_rotate(m1, -2.04413273425, new mat3f());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3);
      test_mat3(m2, -0.455858394266, -0.890052315528, 0, 0.890052315528, -0.455858394266, 0, 0, 0, 1, 4, 3);

   })

   it(`mat3_rad_rotate_01`, () => {
      let m1 = new mat3f();
      let m2 = mat3_translate(m1, -2.61996709293, 2.34249949875, new mat3f());
      let m3 = mat3_rad_rotate(m2, -1.61041375512, new mat3f());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3);
      test_mat3(m2, 1, 0, 0, 0, 1, 0, -2.61996709293, 2.34249949875, 1, 1, 3);
      test_mat3(m3, -0.0396070656121, -0.999215332325, 0, 0.999215332325, -0.0396070656121, 0, -2.61996709293, 2.34249949875, 1, 4, 3);

   })

   it(`mat3_rad_rotate_02`, () => {
      let m1 = new mat3f();
      let m2 = mat3_translate(m1, -2.33957936004, 1.25217265498, new mat3f());
      let m3 = mat3_rad_rotate(m2, 1.32482972852, new mat3f());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3);
      test_mat3(m2, 1, 0, 0, 0, 1, 0, -2.33957936004, 1.25217265498, 1, 1, 3);
      test_mat3(m3, 0.243493944396, 0.969902417278, 0, -0.969902417278, 0.243493944396, 0, -2.33957936004, 1.25217265498, 1, 4, 3);

   })

   it(`mat3_rad_rotate_03`, () => {
      let m1 = new mat3f();
      let m2 = mat3_scale(m1, 3.00084559901, 0.721224956484, new mat3f());
      let m3 = mat3_rad_rotate(m2, -0.205326583477, new mat3f());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3);
      test_mat3(m2, 3.00084559901, 0, 0, 0, 0.721224956484, 0, 0, 0, 1, 2, 3);
      test_mat3(m3, 2.93781118865, -0.147048316386, 0, 0.611833089107, 0.70607523006, 0, 0, 0, 1, 8, 3);

   })

   it(`mat3_rad_rotate_04`, () => {
      let m1 = new mat3f();
      let m2 = mat3_rad_rotate(m1, 2.98749987673, new mat3f());
      let m3 = mat3_rad_rotate(m2, 1.02519867353, new mat3f());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3);
      test_mat3(m2, -0.98815118136, 0.153483688963, 0, -0.153483688963, -0.98815118136, 0, 0, 0, 1, 4, 3);
      test_mat3(m3, -0.643980884276, -0.765041581018, 0, 0.765041581018, -0.643980884276, 0, 0, 0, 1, 4, 3);

   })

   it(`mat3_rad_rotate_05`, () => {
      let m1 = new mat3f();
      let m2 = mat3_translate(m1, -3.13828702463, 2.04452873478, new mat3f());
      let m3 = mat3_scale(m2, 2.21600277666, 2.80277453598, new mat3f());
      let m4 = mat3_rad_rotate(m3, 0.435449840007, new mat3f());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3);
      test_mat3(m2, 1, 0, 0, 0, 1, 0, -3.13828702463, 2.04452873478, 1, 1, 3);
      test_mat3(m3, 2.21600277666, 0, 0, 0, 2.80277453598, 0, -3.13828702463, 2.04452873478, 1, 2, 3);
      test_mat3(m4, 2.00920624692, 1.18226160446, 0, -0.934750535439, 2.54122069057, 0, -3.13828702463, 2.04452873478, 1, 8, 3);

   })

   it(`mat3_rad_rotate_06`, () => {
      let m1 = new mat3f();
      mat3_translate(m1, 0.651649418326, 1.84453169161, m1);
      mat3_scale(m1, 0.893293648002, -3.10050579742, m1);
      mat3_rad_rotate(m1, -1.2500948995, m1);
      test_mat3(m1, 0.281595013747, 2.94242508006, 0, 0.847748659565, -0.977379582404, 0, 0.651649418326, 1.84453169161, 1, 8, 3);

   })

   it(`mat3_rad_rotate_07`, () => {
      let m1 = new mat3f(-1.48425772179, -2.70453656872, -0.200779612745, 2.81149776636, 1.73978406154, -0.357551191549, -1.77242827216, 1.50781395207, 1.49215673339);
      mat3_translate(m1, 1.00495692085, 2.11186366687, m1);
      mat3_scale(m1, -3.11175749204, 0.349736105501, m1);
      mat3_rad_rotate(m1, -0.0962184579035, m1);
      test_mat3(m1, 4.50282287406, 8.31847968741, 0.633901025487, 1.42244817891, 1.41416326569, -0.0644477489121, 2.67345664025, 2.4640579574, 0.535282501513, 16, 3);

   })

   it(`mat3_shear_00`, () => {
      let m1 = new mat3f();
      let m2 = mat3_shear(m1, 0.0032128548388, -1.87973523318, new mat3f());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3);
      test_mat3(m2, 1, -1.87973523318, 0, 0.0032128548388, 1, 0, 0, 0, 1, 8, 3);

   })

   it(`mat3_shear_01`, () => {
      let m1 = new mat3f();
      let m2 = mat3_translate(m1, -1.95591772366, 2.20079526096, new mat3f());
      let m3 = mat3_shear(m2, -2.84382445689, 1.25231210495, new mat3f());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3);
      test_mat3(m2, 1, 0, 0, 0, 1, 0, -1.95591772366, 2.20079526096, 1, 1, 3);
      test_mat3(m3, 1, 1.25231210495, 0, -2.84382445689, 1, 0, -1.95591772366, 2.20079526096, 1, 8, 3);

   })

   it(`mat3_shear_02`, () => {
      let m1 = new mat3f();
      let m2 = mat3_scale(m1, -0.545344147494, -0.441850144548, new mat3f());
      let m3 = mat3_shear(m2, -1.54373884588, -0.052723654906, new mat3f());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3);
      test_mat3(m2, -0.545344147494, 0, 0, 0, -0.441850144548, 0, 0, 0, 1, 2, 3);
      test_mat3(m3, -0.545344147494, 0.0232959545413, 0, 0.841868944859, -0.441850144548, 0, 0, 0, 1, 8, 3);

   })

   it(`mat3_shear_03`, () => {
      let m1 = new mat3f();
      let m2 = mat3_rad_rotate(m1, 0.0991296143496, new mat3f());
      let m3 = mat3_shear(m2, -1.16175874282, -2.5164179579, new mat3f());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3);
      test_mat3(m2, 0.995090681947, 0.0989673415932, 0, -0.0989673415932, 0.995090681947, 0, 0, 0, 1, 4, 3);
      test_mat3(m3, 1.24413387758, -2.4050967202, 0, -1.25502264125, 0.880114507597, 0, 0, 0, 1, 8, 3);

   })

   it(`mat3_shear_04`, () => {
      let m1 = new mat3f();
      let m2 = mat3_shear(m1, -2.14017081306, -0.504326600196, new mat3f());
      let m3 = mat3_shear(m2, 1.12377931165, -0.988237001353, new mat3f());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3);
      test_mat3(m2, 1, -0.504326600196, 0, -2.14017081306, 1, 0, 0, 0, 1, 8, 3);
      test_mat3(m3, 3.11499598668, -1.49256360155, 0, -1.0163915014, 0.433248200382, 0, 0, 0, 1, 8, 3);

   })

   it(`mat3_shear_05`, () => {
      let m1 = new mat3f();
      mat3_translate(m1, 1.97910891757, -1.96428349113, m1);
      mat3_scale(m1, 0.157194477596, -1.34630964651, m1);
      mat3_rad_rotate(m1, 1.29820413864, m1);
      mat3_shear(m1, 2.97763149464, 1.01412686422, m1);
      test_mat3(m1, -0.111207653686, -1.66418468084, 0, -0.0253730824779, -4.22325887148, 0, 1.97910891757, -1.96428349113, 1, 8, 3);

   })

   it(`mat3_shear_06`, () => {
      let m1 = new mat3f(-0.784957888196, -1.15718244273, -0.510020205626, -0.951540749484, 2.42968462569, 2.95721582329, 0.43076710761, -2.65465738055, -1.56707347318);
      mat3_translate(m1, 2.26264657466, -0.55057929846, m1);
      mat3_scale(m1, -2.28755634025, -2.91766536288, m1);
      mat3_rad_rotate(m1, 0.147454162529, m1);
      mat3_shear(m1, 0.739494059109, 0.485001572522, m1);
      test_mat3(m1, 3.38797778099, -2.01261956698, -4.33601284596, 4.09742047257, -6.23490554643, -8.78996521434, -0.821416531063, -6.61068632755, -4.34925075783, 16, 3);

   })

   it(`mat3_map_point_00`, () => {
      let m1 = new mat3f();
      mat3_translate(m1, 69, 82, m1);
      let p1 = new pointi(14, -31);
      let p2 = mat3_map_point(m1, p1, new pointi());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 69, 82, 1, 1, 0);
      test_point(p1, 14, -31, 0);
      test_point(p2, 83, 51, 0);

      let p3 = new pointf(2.06474159834, -1.3112403352);
      let p4 = mat3_map_point(m1, p3, new pointf());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, 69, 82, 1, 1, 3);
      test_point(p3, 2.06474159834, -1.3112403352, 3);
      test_point(p4, 71.0647415983, 80.6887596648, 3);

   })

   it(`mat3_map_point_01`, () => {
      let m1 = new mat3f();
      mat3_scale(m1, -74, -95, m1);
      let p1 = new pointi(-9, 5);
      let p2 = mat3_map_point(m1, p1, new pointi());
      test_mat3(m1, -74, 0, 0, 0, -95, 0, 0, 0, 1, 2, 0);
      test_point(p1, -9, 5, 0);
      test_point(p2, 666, -475, 0);

      let p3 = new pointf(-0.796632676753, 2.28798958771);
      let p4 = mat3_map_point(m1, p3, new pointf());
      test_mat3(m1, -74, 0, 0, 0, -95, 0, 0, 0, 1, 2, 3);
      test_point(p3, -0.796632676753, 2.28798958771, 3);
      test_point(p4, 58.9508180797, -217.359010833, 3);

   })

   it(`mat3_map_point_02`, () => {
      let m1 = new mat3f();
      mat3_rad_rotate(m1, -0.842351262683, m1);

      let p1 = new pointi(-88, -71);
      let p2 = mat3_map_point(m1, p1, new pointi());
      test_mat3(m1, 0.665710130862, -0.746210440605, 0, 0.746210440605, 0.665710130862, 0, 0, 0, 1, 4, 0);
      test_point(p1, -88, -71, 0);
      test_point(p2, -112, 18, 0);

      let p3 = new pointf(-2.16577934042, -1.5784316248);
      let p4 = mat3_map_point(m1, p3, new pointf());
      test_mat3(m1, 0.665710130862, -0.746210440605, 0, 0.746210440605, 0.665710130862, 0, 0, 0, 1, 4, 3);
      test_point(p3, -2.16577934042, -1.5784316248, 3);
      test_point(p4, -2.61962340633, 0.565349232362, 3);

   })

   it(`mat3_map_point_03`, () => {
      let m1 = new mat3f();
      mat3_shear(m1, -2.98474822874, 2.56236549294, m1);

      let p1 = new pointi(1, 33);
      let p2 = mat3_map_point(m1, p1, new pointi());
      test_mat3(m1, 1, 2.56236549294, 0, -2.98474822874, 1, 0, 0, 0, 1, 8, 0);
      test_point(p1, 1, 33, 0);
      test_point(p2, -97, 36, 0);

      let p3 = new pointf(-2.63529198874, -1.18359871476);
      let p4 = mat3_map_point(m1, p3, new pointf());
      test_mat3(m1, 1, 2.56236549294, 0, -2.98474822874, 1, 0, 0, 0, 1, 8, 3);
      test_point(p3, -2.63529198874, -1.18359871476, 3);
      test_point(p4, 0.897452178671, -7.93617997053, 3);

   })

   it(`mat3_map_point_04`, () => {
      let m1 = new mat3f(-2.86723327683, -2.81410286906, 0.759951123655, -0.906134263061, 3.10300477803, -1.53090401806, -1.09220339712, -0.342815401491, 0.642140794649);
      let p1 = new pointi(9, 20);
      let p2 = mat3_map_point(m1, p1, new pointi());
      test_mat3(m1, -2.86723327683, -2.81410286906, 0.759951123655, -0.906134263061, 3.10300477803, -1.53090401806, -1.09220339712, -0.342815401491, 0.642140794649, 16, 0);
      test_point(p1, 9, 20, 0);
      test_point(p2, 2, -2, 0);

      let p3 = new pointf(2.09080193953, -2.88968652271);
      let p4 = mat3_map_point(m1, p3, new pointf());
      test_mat3(m1, -2.86723327683, -2.81410286906, 0.759951123655, -0.906134263061, 3.10300477803, -1.53090401806, -1.09220339712, -0.342815401491, 0.642140794649, 16, 3);
      test_point(p3, 2.09080193953, -2.88968652271, 3);
      test_point(p4, -0.671473534842, -2.28302485237, 3);

   })

   it(`mat3_map_line_00`, () => {
      let m1 = new mat3f();
      mat3_translate(m1, -2.39875453131, -1.97130348893, m1);

      let l1 = new linei(42, -45, -58, 23);
      test_line(l1, 42, -45, -58, 23, 0);
      
      let l2 = mat3_map_line(m1, l1, new linei());

      test_mat3(m1, 1, 0, 0, 0, 1, 0, -2.39875453131, -1.97130348893, 1, 1, 0);
      test_line(l1, 42, -45, -58, 23, 0);
      test_line(l2, 40, -47, -60, 21, 0);

      let l3 = new linef(-2.38444105368, -2.5568149997, -2.15042150868, 1.64407338453);
      let l4 = mat3_map_line(m1, l3, new linef());

      test_mat3(m1, 1, 0, 0, 0, 1, 0, -2.39875453131, -1.97130348893, 1, 1, 3);
      test_line(l3, -2.38444105368, -2.5568149997, -2.15042150868, 1.64407338453, 3);
      test_line(l4, -4.78319558499, -4.52811848862, -4.54917603999, -0.327230104396, 3);

   })

   it(`mat3_map_line_01`, () => {
      let m1 = new mat3f();
      mat3_scale(m1, -0.295803639827, 2.02696400488, m1);
      let l1 = new linei(-15, -72, -66, 19);
      let l2 = mat3_map_line(m1, l1, new linei());
      test_mat3(m1, -0.295803639827, 0, 0, 0, 2.02696400488, 0, 0, 0, 1, 2, 0);
      test_line(l1, -15, -72, -66, 19, 0);
      test_line(l2, 4, -146, 20, 39, 0);

      let l3 = new linef(-0.0319179498172, 2.22253478473, -2.53740955525, -0.214589183681);
      let l4 = mat3_map_line(m1, l3, new linef());
      test_mat3(m1, -0.295803639827, 0, 0, 0, 2.02696400488, 0, 0, 0, 1, 2, 3);
      test_line(l3, -0.0319179498172, 2.22253478473, -2.53740955525, -0.214589183681, 3);
      test_line(l4, 0.00944144573174, 4.50499800824, 0.750574982177, -0.434964551157, 3);

   })

   it(`mat3_map_line_02`, () => {
      let m1 = new mat3f();
      mat3_rad_rotate(m1, -1.88793340671, m1);
      let l1 = new linei(-67, -62, 93, 61);
      let l2 = mat3_map_line(m1, l1, new linei());
      test_mat3(m1, -0.311847690046, -0.950132105664, 0, 0.950132105664, -0.311847690046, 0, 0, 0, 1, 4, 0);
      test_line(l1, -67, -62, 93, 61, 0);
      test_line(l2, -38, 83, 29, -107, 0);

      let l3 = new linef(0.105228083786, -1.13103550666, 1.71612047351, 3.10290204376);
      let l4 = mat3_map_line(m1, l3, new linef());
      test_mat3(m1, -0.311847690046, -0.950132105664, 0, 0.950132105664, -0.311847690046, 0, 0, 0, 1, 4, 3);
      test_line(l3, 0.105228083786, -1.13103550666, 1.71612047351, 3.10290204376, 3);
      test_line(l4, -1.10744828238, 0.252730229289, 2.412998647, -2.59817399385, 3);

   })

   it(`mat3_map_line_03`, () => {
      let m1 = new mat3f();
      mat3_shear(m1, 2.66346656771, 1.99030415426, m1);
      let l1 = new linei(56, -71, 53, -13);
      let l2 = mat3_map_line(m1, l1, new linei());
      test_mat3(m1, 1, 1.99030415426, 0, 2.66346656771, 1, 0, 0, 0, 1, 8, 0);
      test_line(l1, 56, -71, 53, -13, 0);
      test_line(l2, -133, 40, 18, 92, 0);

      let l3 = new linef(2.17603239789, 1.66100747187, 2.96571985422, -2.70514497785);
      let l4 = mat3_map_line(m1, l3, new linef());
      test_mat3(m1, 1, 1.99030415426, 0, 2.66346656771, 1, 0, 0, 0, 1, 8, 3);
      test_line(l3, 2.17603239789, 1.66100747187, 2.96571985422, -2.70514497785, 3);
      test_line(l4, 6.60007026794, 5.99197379319, -4.23934335509, 3.19753956837, 3);

   })

   it(`mat3_map_line_04`, () => {
      let m1 = new mat3f(1.6380055752, -3.04060860321, 1.00496240595, -3.07495760533, -0.810255747251, -1.5010283521, 1.6387239268, -2.12844870253, -0.21524423849);
      let l1 = new linei(-1, -55, -64, 12);
      let l2 = mat3_map_line(m1, l1, new linei());
      test_mat3(m1, 1.6380055752, -3.04060860321, 1.00496240595, -3.07495760533, -0.810255747251, -1.5010283521, 1.6387239268, -2.12844870253, -0.21524423849, 16, 0);
      test_line(l1, -1, -55, -64, 12, 0);
      test_line(l2, 2, 1, 2, -2, 0);

      let l3 = new linef(1.6380055752, -3.04060860321, 1.00496240595, -3.07495760533);
      let l4 = mat3_map_line(m1, l3, new linef());
      test_mat3(m1, 1.6380055752, -3.04060860321, 1.00496240595, -3.07495760533, -0.810255747251, -1.5010283521, 1.6387239268, -2.12844870253, -0.21524423849, 16, 3);
      test_line(l3, 1.6380055752, -3.04060860321, 1.00496240595, -3.07495760533, 3);
      test_line(l4, 2.2805153465, -0.7748734903, 2.35480720184, -0.497688132517, 3);

   })

   it(`mat3_map_rect_00`, () => {
      let m1 = new mat3f();
      mat3_translate(m1, -0.512326492671, -1.01567649357, m1);
      let r1 = new recti(11, -88, 62, -63);
      let r2 = mat3_map_rect(m1, r1, new recti());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, -0.512326492671, -1.01567649357, 1, 1, 0);
      test_rect(r1, 11, -88, 72, -152, 11, -88, 62, -63, 0);
      test_rect(r2, 10, -89, 71, -153, 10, -89, 62, -63, 0);

      let r3 = new rectf(-3.06631876786, 3.09003823953, -0.0377957819831, 0.761795659883);
      let r4 = mat3_map_rect(m1, r3, new rectf());
      test_mat3(m1, 1, 0, 0, 0, 1, 0, -0.512326492671, -1.01567649357, 1, 1, 2);
      test_rect(r3, -3.06631876786, 3.09003823953, -3.10411454985, 3.85183389941, -3.06631876786, 3.09003823953, -0.0377957819831, 0.761795659883, 2);
      test_rect(r4, -3.57864526053, 2.07436174596, -3.61644104252, 2.83615740585, -3.57864526053, 2.07436174596, -0.0377957819831, 0.761795659883, 2);

   })

   it(`mat3_map_rect_01`, () => {
      let m1 = new mat3f();
      mat3_scale(m1, -2.52914349556, -0.347426718124, m1);
      let r1 = new recti(59, -65, 29, 80);
      let r2 = mat3_map_rect(m1, r1, new recti());
      test_mat3(m1, -2.52914349556, 0, 0, 0, -0.347426718124, 0, 0, 0, 1, 2, 0);
      test_rect(r1, 59, -65, 87, 14, 59, -65, 29, 80, 0);
      test_rect(r2, -222, -5, -150, 22, -222, -5, 73, 28, 0);

      let r3 = new rectf(2.42760321997, -1.79589907, -0.0480476514926, -2.67519379445);
      let r4 = mat3_map_rect(m1, r3, new rectf());
      test_mat3(m1, -2.52914349556, 0, 0, 0, -0.347426718124, 0, 0, 0, 1, 2, 2);
      test_rect(r3, 2.42760321997, -1.79589907, 2.37955556848, -4.47109286445, 2.42760321997, -1.79589907, -0.0480476514926, -2.67519379445, 2);
      test_rect(r4, -6.13975689358, 0.623943319971, -6.01823748833, 1.55337712032, -6.13975689358, 0.623943319971, 0.121519405249, 0.92943380035, 2);

   })

   it(`mat3_map_rect_02`, () => {
      let m1 = new mat3f();
      mat3_rad_rotate(m1, -1.35254065293, m1);
      test_mat3(m1, 0.216527008517, -0.976276628104, 0, 0.976276628104, 0.216527008517, 0, 0, 0, 1, 4, 0);
      let r1 = new recti(17, 35, 50, -17);
      let r2 = mat3_map_rect(m1, r1, new recti());
      test_mat3(m1, 0.216527008517, -0.976276628104, 0, 0.976276628104, 0.216527008517, 0, 0, 0, 1, 4, 0);
      test_rect(r1, 17, 35, 66, 17, 17, 35, 50, -17, 0);
      test_rect(r2, 21, -62, 48, -10, 21, -62, 28, 53, 0);

      let r3 = new rectf(-0.648463114634, 1.25246403878, 2.47960459025, -0.452234461282);
      let r4 = mat3_map_rect(m1, r3, new rectf());
      test_mat3(m1, 0.216527008517, -0.976276628104, 0, 0.976276628104, 0.216527008517, 0, 0, 0, 1, 4, 2);
      test_rect(r3, -0.648463114634, 1.25246403878, 1.83114147562, 0.800229577493, -0.648463114634, 1.25246403878, 2.47960459025, -0.452234461282, 2);
      test_rect(r4, 0.640835655279, -1.61442930886, 1.61924295448, 0.904271674596, 0.640835655279, -1.61442930886, 0.978407299205, 2.51870098345, 2);

   })

})
