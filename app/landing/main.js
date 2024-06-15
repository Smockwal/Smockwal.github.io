import { particles } from "../../lib/rendering/particles.js";
import { canv_clear, canv_draw_line, canv_set_pixel_ratio, canv_set_size, canvas } from "../../lib/gui/canvas.js";
import { color } from "../../lib/gui/color.js";
import { elem, ev } from "../../lib/html.js";
import { vec2_dist_to_point_sqr } from "../../lib/math/vec2.js";

var canv, engine;

const engine_opts = {
    part_color: new color(color.RGB, 200, 200, 200),
    part_numb: 150,
    part_speed_min: 0.1,
    part_speed_max: 1,
    part_radius_min: 1,
    part_radius_max: 2,
    link_color: new color(color.RGB, 200, 200, 200),
    link_length: 100,
};

const win_size = () => {
    canv_set_size(canv, window.innerWidth, window.innerHeight);
    canv_set_pixel_ratio(canv, Math.floor(window.innerWidth / 2), Math.floor(window.innerHeight / 2));
};

const links = async radius => {
    const { rgba: rgba_col, unit: unit_col } = engine_opts.link_color;
    const radius_sqr = radius ** 2;
    canv.ctx.lineWidth = 0.2;

    engine.parts.forEach((p1, i) => {
        engine.parts.slice(i + 1).forEach(p2 => {
            const dist = vec2_dist_to_point_sqr(p1.pos, p2.pos);
            if (dist <= radius_sqr) {
                unit_col.alpha = Math.max(1 - Math.sqrt(dist) / radius, 0);
                canv.ctx.strokeStyle = rgba_col.css;
                canv_draw_line(canv, p1.pos, p2.pos);
            }
        });
    });
};

const update = () => {
    canv_clear(canv);
    engine.update(canv, true);
    links(engine_opts.link_length);
    requestAnimationFrame(update);
};

ev(window, `DOMContentLoaded`, async () => {
    canv = new canvas(elem(`canvas`));
    canv.clear_color = new color(color.RGB, 34, 34, 34);
    win_size();

    engine = new particles();
    engine.init(engine_opts, canv);

    ev(window, 'resize', win_size);
    requestAnimationFrame(update);

});
