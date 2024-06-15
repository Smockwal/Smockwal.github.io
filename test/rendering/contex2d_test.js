import { ctx_set_smoothing } from "../../lib/rendering/contex2d.js";


describe('ctx_set_smoothing function', () => {
    let canvas;
    let ctx;

    beforeEach(() => {
        canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 150;
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
    });

    afterEach(() => {
        document.body.removeChild(canvas);
    });

    it('should enable image smoothing when called with true', () => {
        ctx_set_smoothing(ctx, true);
        if (ctx.imageSmoothingEnabled !== undefined) expect(ctx.imageSmoothingEnabled).toBe(true);
        if (ctx.mozImageSmoothingEnabled !== undefined) expect(ctx.mozImageSmoothingEnabled).toBe(true);
        if (ctx.oImageSmoothingEnabled !== undefined) expect(ctx.oImageSmoothingEnabled).toBe(true);
        if (ctx.webkitImageSmoothingEnabled !== undefined) expect(ctx.webkitImageSmoothingEnabled).toBe(true);
        if (ctx.msImageSmoothingEnabled !== undefined) expect(ctx.msImageSmoothingEnabled).toBe(true);
    });

    it('should disable image smoothing when called with false', () => {
        ctx_set_smoothing(ctx, false);
        if (ctx.imageSmoothingEnabled !== undefined) expect(ctx.imageSmoothingEnabled).toBe(false);
        if (ctx.mozImageSmoothingEnabled !== undefined) expect(ctx.mozImageSmoothingEnabled).toBe(false);
        if (ctx.oImageSmoothingEnabled !== undefined) expect(ctx.oImageSmoothingEnabled).toBe(false);
        if (ctx.webkitImageSmoothingEnabled !== undefined) expect(ctx.webkitImageSmoothingEnabled).toBe(false);
        if (ctx.msImageSmoothingEnabled !== undefined) expect(ctx.msImageSmoothingEnabled).toBe(false);
    });

    it('should not modify image smoothing settings when called with a non-boolean value', () => {
        const invalidValues = [null, undefined, 'true', 1, {}, []];

        invalidValues.forEach((value) => {
            ctx_set_smoothing(ctx, value);
            if (ctx.imageSmoothingEnabled !== undefined) expect(ctx.imageSmoothingEnabled).toBe(false);
            if (ctx.mozImageSmoothingEnabled !== undefined) expect(ctx.mozImageSmoothingEnabled).toBe(false);
            if (ctx.oImageSmoothingEnabled !== undefined) expect(ctx.oImageSmoothingEnabled).toBe(false);
            if (ctx.webkitImageSmoothingEnabled !== undefined) expect(ctx.webkitImageSmoothingEnabled).toBe(false);
            if (ctx.msImageSmoothingEnabled !== undefined) expect(ctx.msImageSmoothingEnabled).toBe(false);
        });
    });

});