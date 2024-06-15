import { canv_clear, canv_clear_rect, canv_create_in, canv_set_pixel_ratio, canv_set_size, canv_set_transform, canvas } from "../../lib/gui/canvas.js";
import { color } from "../../lib/gui/color.js";
import { sizei } from "../../lib/gui/size.js";
import { elem, new_node } from "../../lib/html.js";
import { mat3_rad_rotate, mat3_scale, mat3_translate, mat3f } from "../../lib/math/mat3.js";


// Test suite for canvas class
describe('canvas', () => {
    let testCanvas;

    beforeAll(() => {
        document.body.appendChild(new_node(`div`, { id: 'testDiv' }));
    });

    afterAll(() => {
        document.body.removeChild(elem('testDiv'));
    });

    beforeEach(() => {
        testCanvas = canv_create_in(elem('testDiv'), 'testCanvas');

    });

    it('constructor_000', () => {
        var el = document.createElement('canvas');
        const canv = new canvas(el);
        expect(canv.id).toBeDefined();
        expect(canv.id).not.toBe(``);
    });

    it('should have the correct type', () => {
        //console.log(elem(`testDiv`).innerHTML);
        expect(testCanvas.kind).toBe('canvas');
    });

    it('should have the correct id', () => {
        expect(testCanvas.id).toBe('testCanvas');
    });

    it('should have the correct element', () => {
        const canvasElement = document.getElementById('testCanvas');
        expect(testCanvas.elem).toEqual(canvasElement);
    });

    it('should have the correct context', () => {
        const context = testCanvas.elem.getContext('2d', {});
        expect(testCanvas.ctx).toBe(context);
    });

    it('should have the correct options', () => {
        const options = {};
        expect(testCanvas.opt).toEqual(options);
    });

    it('should have the correct clear color', () => {
        const clearColor = new color(color.RGBA, 255, 255, 255, 0);
        expect(testCanvas.clear_color).toEqual(clearColor);
    });

    it('should have the correct width and height', () => {
        const canvasElement = document.getElementById('testCanvas');
        expect(testCanvas.width).toBe(canvasElement.width);
        expect(testCanvas.height).toBe(canvasElement.height);
    });

    it('should have the correct size', () => {
        const canvasElement = document.getElementById('testCanvas');
        const expectedSize = new sizei(canvasElement.width, canvasElement.height);
        expect(testCanvas.size).toEqual(expectedSize);
    });
});

// Test suite for canv_create_in function
describe('canv_create_in', () => {
    let parentElement;
    let testCanvas;

    beforeEach(() => {
        parentElement = document.createElement('div');
        testCanvas = canv_create_in(parentElement, 'testCanvas');
    });

    it('should create a canvas element with the correct id', () => {
        expect(testCanvas.id).toBe('testCanvas');
    });

    it('should create a canvas element with the default type', () => {
        expect(testCanvas.kind).toBe('canvas');
    });

    it('should create a canvas element with the default options', () => {
        expect(testCanvas.opt).toEqual({});
    });

    it('should append the canvas element to the parent element', () => {
        expect(parentElement.innerHTML).toBe('<canvas id="testCanvas" width="300" height="150" style="width: 300px; height: 150px;"></canvas>');
    });
});

// Test suite for canv_set_size function using Jasmine
describe('canv_set_size', () => {
    let parentElement, canvasElement, canvasObject;

    beforeEach(() => {
        // Set up the parent and canvas elements for testing
        parentElement = document.createElement('div');
        canvasElement = document.createElement('canvas');
        parentElement.appendChild(canvasElement);
        document.body.appendChild(parentElement);
        canvasObject = new canvas(canvasElement);
    });

    afterEach(() => {
        // Clean up after each test
        document.body.removeChild(parentElement);
    });

    it('should set the size of the canvas element when width and height are numbers', () => {
        canv_set_size(canvasObject, 200, 150);
        expect(canvasObject.elem.style.width).toBe('200px');
        expect(canvasObject.elem.style.height).toBe('150px');
    });

    it('should set the size of the canvas element using size_to_css when width and height are size objects', () => {
        const sizeObj = new sizei(200, 150);
        canv_set_size(canvasObject, sizeObj);
        expect(canvasObject.elem.style.cssText).toBe(`width: 200px; height: 150px;`);
    });

    it('should handle optional height parameter when width is not a size object', () => {
        canv_set_size(canvasObject, 500);
        expect(canvasObject.elem.style.width).toBe('500px');
        expect(canvasObject.elem.style.height).toBe('150px');
    });

    it('should handle optional height parameter when width is a size object', () => {
        const sizeObj = new sizei(500, 550);
        canv_set_size(canvasObject, sizeObj, 550);
        expect(canvasObject.elem.style.cssText).toBe(`width: 500px; height: 550px;`);
    });
});

describe('canv_set_pixel_ratio', () => {
    let canv;

    beforeEach(() => {
        canv = new canvas(new_node(`canvas`, { id: `testCanvas` }));
    });

    it('should set the pixel ratio of the canvas', () => {
        const width = 500;
        const height = 300;

        canv_set_pixel_ratio(canv, width, height);

        expect(canv.elem.width).toEqual(width);
        expect(canv.elem.height).toEqual(height);
    });

    it('should handle a size object as input', () => {
        const size = new sizei(600, 400);

        canv_set_pixel_ratio(canv, size);

        expect(canv.elem.width).toEqual(size.width);
        expect(canv.elem.height).toEqual(size.height);
    });

    it('should handle a canvas element as input', () => {
        const canvasElement = document.createElement('canvas');
        canvasElement.width = 700;
        canvasElement.height = 500;

        canv_set_pixel_ratio(canvasElement, 800, 600);

        expect(canvasElement.width).toEqual(800);
        expect(canvasElement.height).toEqual(600);
    });

    it('should throw an error if the input is invalid', () => {
        const invalidInput = 'invalid';

        expect(() => {
            canv_set_pixel_ratio(canv, invalidInput);
        }).toThrowError('Invalid input');
    });
});



describe('canv_clear', () => {
    let canv;

    beforeEach(() => {
        canv = new canvas(`testing_canvas`);
        canv_set_size(canv, 300, 150);
    });

    it('should clear the canvas with the default color (white)', () => {
        const gg = spyOn(canv.ctx, 'fillRect');
        canv_clear(canv);
        expect(gg).toHaveBeenCalledWith(0, 0, 300, 150);

    });

    it('should clear the canvas with a specified color', () => {
        const col = new color(color.RGB, 0, 0, 255); // Blue
        canv_clear(canv, col);
        const pixelData = canv.ctx.getImageData(0, 0, 1, 1).data;
        expect(pixelData[0]).toEqual(0); // Red
        expect(pixelData[1]).toEqual(0); // Green
        expect(pixelData[2]).toEqual(255); // Blue
        expect(pixelData[3]).toEqual(255); // Alpha
    });
});

describe('canv_clear_rect', () => {
    let canv;
    let ctx;

    beforeEach(() => {
        canv = new canvas(`testing_canvas`);
        canv_set_size(canv, 800, 600);
    });

    it('should clear a rectangular area of the canvas', () => {
        const gg = spyOn(canv.ctx, 'clearRect');
        canv_clear_rect(canv, { left: 10, top: 10, right: 50, bottom: 50 });
        expect(gg).toHaveBeenCalledWith(10, 10, 50, 50);

    });

});

describe('canv_set_transform', () => {
    let canv;

    beforeEach(() => {
        canv = new canvas(`testing_canvas`);
        canv_set_size(canv, 50, 50);
    });

    it('canv_set_transform_000', () => {
        const gg = spyOn(canv.ctx, 'setTransform');
        canv_set_transform(canv, new mat3f());
        expect(gg).toHaveBeenCalledWith(1, 0, 0, 1, 0, 0);
    });

    it('canv_set_transform_001', () => {
        const gg = spyOn(canv.ctx, 'setTransform');

        const mat = new mat3f();
        mat3_scale(mat, 4, 5, mat);

        canv_set_transform(canv, mat);
        expect(gg).toHaveBeenCalledWith(4, 0, 0, 5, 0, 0);
    });

    it('canv_set_transform_002', () => {
        const gg = spyOn(canv.ctx, 'setTransform');

        const mat = new mat3f();
        mat3_translate(mat, 1, 2, mat);
        mat3_scale(mat, 4, 5, mat);
        mat3_rad_rotate(mat, 1.5, mat);

        canv_set_transform(canv, mat);
        expect(gg).toHaveBeenCalledWith(
            0.2829487919807434, 
            4.9874749183654785, 
            -3.9899799823760986, 
            0.35368600487709045, 
            1, 
            2
        );
    });

});

