import { type_error } from "../error.js";
import { kind_of } from "../global.js";
import { color } from "../gui/color.js";


/**
 * This function sets the image smoothing property on a CanvasRenderingContext2D.
 * It enables or disables image smoothing for all future drawImage calls.
 * 
 * @param {CanvasRenderingContext2D} ctx - The context on which to set the image smoothing.
 * @param {Boolean} on - A boolean value indicating whether to enable (true) or disable (false) image smoothing.
 * 
 * @returns {void} This function does not return any value.
 */
export const ctx_set_smoothing = (ctx, on) => {
    ctx.imageSmoothingEnabled = on === true;
    ctx.mozImageSmoothingEnabled = on === true;
    ctx.oImageSmoothingEnabled = on === true;
    ctx.webkitImageSmoothingEnabled = on === true;
    ctx.msImageSmoothingEnabled = on === true;
};

/**
 * This function clears the canvas by filling it with a specified color.
 * If no color is provided, it uses the clear color from the global `canv` object.
 * 
 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
 * @param {color} [col] - The color to fill the canvas with. If not provided, it uses the clear color from the global `canv` object.
 * 
 * @returns {void} This function does not return any value.
 */
export const ctx_clear = (ctx, col) => {
    if (kind_of(col) !== `color`) throw new type_error(`col should be a color.`);
    ctx.fillStyle = col.rgb.css;
    ctx.fillRect(0, 0, canv.width, canv.height);
};

