import { array } from '../array.js';
import { error, type_error } from '../error.js';
import { kind_of } from '../global.js';
import { elem, new_node } from '../html.js';
import { m3_11, m3_12, m3_21, m3_22, m3_31, m3_32 } from '../math/mat3.js';
import { numb } from '../math/number.js';
import { string } from '../text/string.js';
import { color } from './color.js';
import { div_worker_id, init_gui_worker } from './gui_util.js';
import { X, Y } from './point.js';
import { HEIGHT, WIDTH, size_to_css, sizei } from './size.js';

export const canv_worker_id = string.uuid();
export var canv_worker;
export const init_canv_worker = () => {
    if (!elem(div_worker_id)) init_gui_worker();
    canv_worker = canv_create_in(elem(div_worker_id), canv_worker_id, `2d`, { willReadFrequently: true });
};


export class canvas {
    #canv_id;
    #type;
    #opt;

    #elem
    #ctx;
    #clear_color = new color(color.RGBA, 255, 255, 255, 0);

    /**
     * Constructs a new canvas object.
     * @param {String|HTMLCanvasElement} id - The id of the canvas element or the canvas element itself.
     * @param {String} type - The type of the rendering context (default is '2d').
     * @param {Object} opt - Additional options for the rendering context.
     */
    constructor(id, type = `2d`, opt = {}) {
        if (id instanceof HTMLCanvasElement) {
            this.#elem = id;
            if (!id.id) id.id = string.uid();
            this.#canv_id = id.id;
        }
        else {
            this.#canv_id = id;
            if (!elem(id))
                this.#elem = new_node(`canvas`, { id: id });
        }

        this.#type = type;
        this.#opt = opt;

        this.elem.width = this.elem?.offsetWidth || 300;
        this.elem.height = this.elem?.offsetHeight || 150;
        this.elem.style.cssText = size_to_css(new sizei(this.elem.width, this.elem.height));
    };

    /** @returns {String} The type of the canvas object. */
    get kind() { return `canvas`; };

    /** @returns {String} The id of the canvas element. */
    get id() { return this.#canv_id; };

    /** @returns {HTMLCanvasElement} The canvas element. */
    get elem() {
        if (!this.#elem) this.#elem = elem(this.#canv_id);
        return this.#elem;
    };

    /** @returns {CanvasRenderingContext2D} The rendering context of the canvas. */
    get ctx() {
        if (!this.#ctx) this.#ctx = this.elem.getContext(this.#type, this.#opt);
        return this.#ctx;
    };

    /** @returns {Object} The additional options for the rendering context. */
    get opt() { return this.#opt; };
    set opt(x) { this.#opt = x; };

    /** @returns {color} The clear color of the canvas. */
    get clear_color() { return this.#clear_color; };
    set clear_color(x) {
        if (kind_of(x) !== `color`) throw new type_error(`parameter must be of type "color".`);
        this.#clear_color = x;
    }

    /** @returns {Number} The width of the canvas. */
    get width() { return this.elem.width; };
    /** @returns {Number} The height of the canvas. */
    get height() { return this.elem.height; };

    /** @returns {sizei} The size of the canvas. */
    get size() { return new sizei(this.width, this.height); };

};

/**
 * Creates a new canvas element and appends it to the specified parent element.
 * @param {Element} parent - The parent element to which the canvas will be appended.
 * @param {string} id - The id attribute for the canvas element.
 * @param {string} type - The context identifier defining the type of rendering context to create (e.g., '2d', 'webgl').
 * @param {object} opt - An optional object containing properties to be used as the configuration options for the canvas.
 * @returns {canvas} - A new canvas object representing the created canvas element.
 */
export const canv_create_in = (parent, id, type = `2d`, opt = {}) => {
    const can = new canvas(new_node(`canvas`, { id: id }), type, opt);
    parent.appendChild(can.elem);
    return can;
};

/**
 * Sets the size of the canvas element and updates its style properties accordingly.
 * If the provided width and height are of type 'size', it sets the style using the size_to_css function.
 * Otherwise, it directly sets the width and height style properties of the canvas element.
 * If the canvas element does not have the 'width' attribute, it calls the canv_set_pixel_ratio function to set the pixel ratio.
 * @param {canvas|HTMLCanvasElement} canv - The canvas object for which the size will be set.
 * @param {number|size} w - The width of the canvas, or a size object representing the width and height.
 * @param {number} [h] - The height of the canvas (optional if w is not a size object).
 * @returns {void}
 */
export const canv_set_size = (canv, w, h) => {
    const e = (kind_of(canv) === `canvas`) ? canv.elem : canv;
    if (kind_of(w) === `size`) {
        e.style.cssText = size_to_css(w);
    }
    else {
        e.style.width = `${w}px`;
        e.style.height = `${h}px`;
        //setTimeout(e => canv.elem.style.height = `${h}px`, 0);
    }
};

/**
 * Sets the pixel ratio of the canvas element.
 * If the provided width and height are of type 'size', it calls itself recursively with the width and height values.
 * Otherwise, it directly sets the width and height properties of the canvas element.
 * @param {canvas|HTMLCanvasElement} canv - The canvas object for which the pixel ratio will be set.
 * @param {number|size} w - The width of the canvas, or a size object representing the width and height.
 * @param {number} [h] - The height of the canvas (optional if w is not a size object).
 * @returns {void}
 */
export const canv_set_pixel_ratio = (canv, w, h) => {
    if (kind_of(w) == `size`)
        return canv_set_pixel_ratio(canv, w[WIDTH], w[HEIGHT]);

    if (!string.is_integer(`${w}`) || !string.is_integer(`${h}`)) throw new type_error(`Invalid input`);
    const el = (kind_of(canv) === `canvas`) ? canv.elem : canv;
    el.width = w;
    el.height = h;
};

/**
 * Sets the fullscreen mode of the canvas.
 * If `full` is true, it sets the canvas size to the window's inner width and height,
 * and adds a resize event listener to adjust the canvas size when the window is resized.
 * If `full` is false, it removes the resize event listener.
 * @param {canvas|HTMLCanvasElement} canv - The canvas object or the canvas element to be set to fullscreen.
 * @param {Boolean} full - A boolean indicating whether to set the canvas to fullscreen mode.
 * @returns {void}
 */
export const canv_set_fullscreen = (canv, full) => {
    if (full) {
        canv_set_size(canv, window.innerWidth, window.innerHeight);

        window.addEventListener(`resize`, canv_set_size(canv, window.innerWidth, window.innerHeight), false);
    }
    else {
        window.removeEventListener(`resize`, canv_set_size(canv, window.innerWidth, window.innerHeight), false);
    }
};


/**
 * Clears the canvas with the specified color.
 * If no color is provided, it uses the clear color of the canvas.
 *
 * @param {canvas|HTMLCanvasElement} canv - The canvas object or the canvas element to be cleared.
 * @param {color} [color] - The color with which to clear the canvas. If not provided, it uses the clear color of the canvas.
 * @returns {void}
 *
 * @throws {error} - If the provided object is not a canvas.
 *
 * @example
 * canv_clear(myCanvas, new color(color.RGB, 0, 0, 0)); // Clears the canvas with black color
 * canv_clear(myCanvas); // Clears the canvas with the clear color of the canvas
 */
export const canv_clear = (canv, col) => {
    const ctx = (kind_of(canv) === `canvas`) ? canv.ctx : canv.getContext('2d');
    if (!ctx) throw new error(`Function call on non canvas.`);

    const pix = (kind_of(col) === `color`) ? col : canv.clear_color;
    ctx.fillStyle = pix.rgb.css;
    ctx.fillRect(0, 0, canv.width, canv.height);
};

/**
 * Clears a rectangular area of the canvas with the color specified by the canvas' clear color.
 *
 * @param {canvas|HTMLCanvasElement} canv - The canvas object or the canvas element to clear.
 * @param {rect} rect - The rectangular area to be cleared. The coordinates of the rectangle are relative to the canvas.
 *
 * @returns {void}
 *
 * @example
 * canv_clear_rect(myCanvas, new rect(10, 10, 50, 50)); // Clears a 50x50 rectangle starting from (10, 10)
 */
export const canv_clear_rect = (canv, rect) => {
    const ctx = (kind_of(canv) === `canvas`) ? canv.ctx : canv.getContext('2d');
    if (!ctx) throw new error(`Function call on non canvas.`);

    ctx.clearRect(rect.left, rect.top, rect.right, rect.bottom);
};

/**
 * Sets the transformation matrix of the canvas context.
 *
 * @param {canvas|HTMLCanvasElement} canv - The canvas object or the canvas element to apply the transformation.
 * @param {mat3} mat - The transformation matrix to be applied.
 *
 * @throws {error} - If the provided object is not a canvas.
 *
 * @example
 * const canvas = document.getElementById('myCanvas');
 * const transformMatrix = [1, 0, 0, 1, 10, 10]; // Example transformation matrix
 * canv_set_transform(canvas, transformMatrix);
 */
export const canv_set_transform = (canv, mat) => {
    const ctx = (kind_of(canv) === `canvas`) ? canv.ctx : canv.getContext('2d');
    if (!ctx) throw new error(`Function call on non canvas.`);

    ctx.setTransform(mat[m3_11], mat[m3_12], mat[m3_21], mat[m3_22], mat[m3_31], mat[m3_32]);
};

/**
 * Draws a dot (circle) on the canvas at the specified position with the given radius.
 *
 * @param {canvas|HTMLCanvasElement} canv - The canvas object or the canvas element to draw on.
 * @param {point} pos - The position on the canvas where the dot will be drawn.
 * @param {Number} radius - The radius of the dot (circle).
 *
 * @returns {void}
 */
export const canv_draw_dot = (canv, pos, radius) => {
    const circle = new Path2D();
    circle.arc(pos[X], pos[Y], radius, 0, 2 * Math.PI);
    canv.ctx.fill(circle);
};

/**
 * @param {canvas} canv 
 * @param {Path2D} path
 */
export const canv_fill = (canv, path) => { canv.ctx.fill(path); };

export const canv_fill_recti = (canv, rect) => {
    canv.ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
};

/**
 * @example canv_draw_line(canv, number, number, number, number);
 * @example canv_draw_line(canv, point, point);
 * @example canv_draw_line(canv, line);
 * @param {canvas} canv 
 * @param {Number|point|line} p1x 
 * @param {Number|point?} p1y 
 * @param {Number?} p2x 
 * @param {Number?} p2y 
 */
export const canv_draw_line = (canv, p1x, p1y, p2x, p2y) => {
    canv.ctx.beginPath();
    if (kind_of(p1x) === `line`) {
        canv_move_to(canv, p1x.p1);
        canv.ctx.moveTo(p1x.p1);
        const to = p1x.p2;
        canv.ctx.lineTo(to.x, to.y);
    }
    else if (kind_of(p1x) === `point`) {
        canv_move_to(canv, p1x);
        canv.ctx.lineTo(p1y.x, p1y.y);
    }
    else {
        canv.ctx.moveTo(p1x, p1y);
        canv.ctx.lineTo(p2x, p2y);
    }
    canv.ctx.stroke();
};

/**
 * @param {canvas} canv 
 * @param {point} pos 
 */
export const canv_move_to = (canv, pos) => {
    canv.ctx.moveTo(pos.x, pos.y);
};

/**
 * @param {canvas} canv 
 * @param {image} pic 
 * @param {rect} sorce 
 * @param {rect} dest 
 * @param {Number} alpha 0-1
 */
export const canv_draw_img = (canv, pic, source, dest, alpha = 1) => {
    //console.log(canv, image, source, dest, alpha);

    let pix = pic;

    //if (image.bitmap) pix = image.bitmap;

    if (alpha != 1) {
        if (kind_of(pix) === `image`) {
            //imag
        }


        canv_set_size(canv_worker, pix.width, pix.height);
        canv_draw_img(canv_worker, pix);
        canv_worker.ctx.drawImage(pix, 0, 0);
        const img = canv_worker.ctx.getImageData(0, 0, pix.width, pix.height);
        const length = pix.data.length;
        for (var i = 3; i < length; i += 4) {
            img.data[i] = Math.min(img.data[i], numb.clamp(alpha * numb.MAX_UINT8, 0, numb.MAX_UINT8));
        }
        canv_worker.ctx.putImageData(img, 0, 0);
        pix = canv_worker.elem;
    }

    let sx = 0, sy = 0, sw = pix.width, sh = pix.height;
    if (source) {
        const adj = array.is_float_array(source) ? 0 : 1;
        sx = source.x;
        sy = source.y;
        sw = source.width;
        sh = source.height;
    }

    let dx = 0, dy = 0, dw = pix.width, dh = pix.height;
    if (dest) {
        const adj = array.is_float_array(dest) ? 0 : 1;
        dx = dest.x;
        dy = dest.y;
        dw = dest.width + adj;
        dh = dest.height + adj;
    }

    canv.ctx.drawImage(pix, sx, sy, sw, sh, dx, dy, dw, dh);
};

/**
 * @param {canvas} canv 
 * @param {font} font 
 */
export const canv_set_font = (canv, font) => {
    canv.ctx.font = font.css;
};

export const canv_draw_text = (canv, str, pos) => {

};

/**
 * @param {canvas} canv 
 * @param {rect} source 
 * @returns {Uint8ClampedArray}
 */
export const canv_data = (canv, source) => {
    let sx = 0, sy = 0, sw = canv.width, sh = canv.height;
    if (source) {
        sx = source.x;
        sy = source.y;
        sw = source.width;
        sh = source.height;
    }
    return canv.ctx.getImageData(sx, sy, sw, sh).data;
};
