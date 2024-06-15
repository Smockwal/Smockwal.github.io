import { pointf, pointi } from '../../lib/gui/point.js'; 
           import {   
            polygon, poly_add_point, poly_bounding_rect, poly_set_point   
        } from '../../lib/gui/polygon.js';     
           import { rectf, recti } from '../../lib/gui/rect.js';  
           import { test_poly, test_rect } from '../test.js';  


describe(`polygon test`, () => {
it(`polygon constructor_00`, () => {
let p1 = new polygon();
test_poly(p1, 0, [], 0);
})
it(`polygon constructor_01`, () => {
let p1 = new polygon(new pointi(-31, 83), new pointi(89, -23));
test_poly(p1, 2, [-31, 83, 89, -23], 0);
})
it(`polygon constructor_02`, () => {
let p1 = new polygon(new pointi(-42, -72), new pointi(-26, -11), new pointi(36, -34), new pointi(-9, 2));
let p2 = new polygon(p1);
test_poly(p2, 4, [-42, -72, -26, -11, 36, -34, -9, 2], 0);
})
})
describe(`polygon function test`, () => {
it(`poly_add_point_00`, () => {
let p1 = new polygon();
poly_add_point(p1, new pointf(0.269325730592, -1.36054790774));
test_poly(p1, 1, [0.269325730592, -1.36054790774], 0);
})
it(`poly_add_point_01`, () => {
let p1 = new polygon();
poly_add_point(p1, new pointi(38, 51));
poly_add_point(p1, new pointf(0.511537500041, -0.930213393763));
poly_add_point(p1, new pointf(-1.24387512918, -1.96126374751));
poly_add_point(p1, new pointi(-95, 92));
test_poly(p1, 4, [38, 51, 0.511537500041, -0.930213393763, -1.24387512918, -1.96126374751, -95, 92], 0);
})
it(`poly_set_point_00`, () => {
let p1 = new polygon(new pointf(-59, 5), new pointf(41, -98), new pointf(-72, -88));
poly_set_point(p1, 1, new pointi(-85, -79));
test_poly(p1, 3, [-59, 5, -85, -79, -72, -88], 0);
})
it(`poly_set_point_01`, () => {
let p1 = new polygon(new pointf(66, -21), new pointf(-2, -23), new pointf(39, 1));
poly_set_point(p1, 2, -100, -73);
test_poly(p1, 3, [66, -21, -2, -23, -100, -73], 0);
})
it(`poly_bounding_rect_00`, () => {
let p1 = new polygon(new pointf(-54.437460796, -48.5627700439), new pointf(-13.2367645863, 36.4782634198), new pointf(71.4058975528, 64.2157524688));
let r1 = poly_bounding_rect(p1, new rectf());
test_rect(r1, -54.437460796, -48.5627700439, 71.4058975528, 64.2157524688, -54.437460796, -48.5627700439, 125.843358349, 112.778522513, 0);
})
})
