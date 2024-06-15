import { MAT4_GENERAL_FLAG, mat4d } from "../../lib/math/mat4.js";
import { test_mat4 } from "../test.js";


describe(`mat4 test`, () => {
    it(`constructor_00`, () => {
        test_mat4(new mat4d(), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0);

        const m0 = new mat4d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
        //console.log(m0);
        test_mat4(m0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, MAT4_GENERAL_FLAG, 0);
    })
})