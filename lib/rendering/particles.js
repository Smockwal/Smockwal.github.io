import { type_error } from "../error.js";
import { kind_of, type_of } from "../global.js";
import { color } from "../gui/color.js";
import { pointf } from "../gui/point.js";
import { numb } from "../math/number.js";
import { vec2f } from "../math/vec2.js";


const POSX = 0;
const POSY = 1;
const RADIUS = 2;
const SPEED = 3;
const VELOCITYX = 4;
const VELOCITYY = 5;

export class particles {
    #data = [];


    constructor(options) { 
    };

    get parts() { return this.#data; };

    /**
     * Initializes the particle system with given options and screen dimensions.
     */
    init(options, screen) {
        this.#data = [];
        for (let i = 0, max = options.part_numb; i < max; i++) {
            this.#data.push(new particle_2d(
                numb.irand(0, screen.width),
                numb.irand(0, screen.height),
                numb.rand(options.part_speed_min, options.part_speed_max),
                numb.irand(options.part_radius_min, options.part_radius_max),
                numb.irand(0, 360),
                options.part_color
            ));
        }
    };

    update(canv, draw) {
        for (let i = this.#data.length; i--;) {
            this.#data[i].update(canv);
            if (draw) this.#data[i].draw(canv);
        }

    };

    draw(canv) {
        for (let i = this.#data.length; i--;)
            this.#data[i].draw(canv);
    };

};

export class particle_2d {
    #pos;
    #radius;
    #speed;
    #color;
    #velocity;

    constructor(x, y, speed, radius, angle, color) {
        this.pos = new pointf(x, y);
        this.speed = speed;
        this.radius = radius;
        this.#color = color.rgba;
        this.#velocity = new vec2f(
            Math.cos(angle) * this.#speed,
            Math.sin(angle) * this.#speed
        );
    };

    get pos() { return this.#pos; };
    set pos(value) {
        if (kind_of(value) !== `point`) throw new type_error(`pos must be a point.`);
        this.#pos = value;
    };

    get radius() { return this.#radius; };
    set radius(value) {
        if (type_of(value) !== `number`) throw new type_error(`radius must be a number.`);
        this.#radius = value;
    };

    get speed() { return this.#speed; };
    set speed(value) {
        if (type_of(value) !== `number`) throw new type_error(`speed must be a number.`);
        this.#speed = value;
    };

    update(bound) {
        this.boundery(bound);
        this.#pos.x += this.#velocity.x;
        this.#pos.y += this.#velocity.y;
    };

    boundery(bound) {
        const min = -100;
        const maxw = bound.width + 100;
        const maxh = bound.height + 100;

        if (this.#pos.x >= maxw || this.#pos.x <= min) {
            this.#velocity.x *= -1;
        }
        if (this.#pos.y >= maxh || this.#pos.y <= min) {
            this.#velocity.y *= -1;
        }
        if (this.#pos.x > maxw) this.#pos.x = maxw;
        else if (this.#pos.x < min) this.#pos.x = min;

        if (this.#pos.y > maxh) this.#pos.y = maxh;
        else if (this.#pos.y < min) this.#pos.y = min;

    };

    draw(canv) {
        canv.ctx.beginPath();
        canv.ctx.arc(this.#pos.x, this.#pos.y, this.#radius, 0, numb.TWO_PI, false);
        canv.ctx.closePath();
        canv.ctx.fillStyle = this.#color.css;
        canv.ctx.fill();
    };
};




