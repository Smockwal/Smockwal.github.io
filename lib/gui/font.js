import { error } from "../error.js";
import { kind_of } from "../global.js";
import { numb } from "../math/number.js";
import { string } from "../text/string.js";
import { xnode } from "../xml/xnode.js";

// https://www.w3schools.com/howto/howto_google_fonts.asp
// https://stackoverflow.com/questions/40199805/unable-to-use-a-google-font-on-canvas

const style_list = [`normal`, `italic`, `oblique`, `initial`, `inherit`];
const variant_list = [`normal`, `small-caps`, `initial`, `inherit`];
const weight_list = [`normal`, `lighter`, `bold`, `bolder`, `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`, `initial`, `inherit`];
const size_list = [`xx-small`, `x-small`, `small`, `medium`, `large`, `x-large`, `xx-large`, `smaller`, `larger`, `initial`, `inherit`];
const line_height_list = [`normal`, `initial`, `inherit`];
const template_list = [`caption`, `icon`, `menu`, `message-box`, `small-caption`, `status-bar`, `initial`, `inherit`];

export class font {
    #style;
    #variant;
    #weight;
    #size;
    #line_height;
    #family;
    #template;

    /**
     * @param {String|font} family 
     * @param {String|Number|undefined} size 
     * @param {String} style 
     * @param {String} variant 
     * @param {String|Number} weight 
     * @param {String|Number} line_height 
     */
    constructor(family = ``, size, style = `normal`, variant = `normal`, weight = `normal`, line_height = `normal`) {
        if (kind_of(family) === `font` || (template_list.includes(family) && !size)) {
            this.from(family);
        } else {
            this.family = family;
            this.size = size || `medium`;
            this.style = style;
            this.variant = variant;
            this.weight = weight;
            this.line_height = line_height;
        }
    };

    /** @returns {String} */
    get kind() { return `font`; };

    get family() { return this.#family; };
    set family(x) {
        if (kind_of(x) !== `string`) throw new error(`font family name must be string.`);
        this.#template = undefined;
        this.#family = x;
    };

    get size() { return this.#size; };
    set size(x) {
        if (!string.is_integer(`${x}`) && !size_list.includes(x)) {
            throw new error(`Font size must be a number or one of the predefined values. ${x}`);
        }
        this.#template = undefined;
        this.#size = `${x}`;
    };

    get style() { return this.#style; };
    set style(x) {
        if (!style_list.includes(x)) throw new error(`Font style must be one of the predefined values.`);
        this.#template = undefined;
        this.#style = x;
    };

    get variant() { return this.#variant; };
    set variant(x) {
        if (!variant_list.includes(x)) throw new error(`Font variant must be one of the predefined values.`);
        this.#template = undefined;
        this.#variant = x;
    };

    get weight() { return this.#weight; };
    set weight(x) {
        if (!weight_list.includes(`${x}`)) throw new error(`Font weight must be one of the predefined values.`);
        this.#template = undefined;
        this.#weight = `${x}`;
    };

    get line_height() { return this.#line_height; };
    set line_height(x) {

        if (kind_of(x) !== `number` && !line_height_list.includes(x) && !string.is_percent(x)) {
            throw new error(`Font line height must be a number, a percent or one of the predefined values.`);
        }
        this.#template = undefined;
        this.#line_height = `${x}`;
    };

    get template() { return this.#template; };
    set template(x) {
        if (!template_list.includes(x)) throw new error(`Font template must be one of the predefined values.`);
        this.#template = x;
    };

    /** @returns {String} */
    get css() {
        if (this.#template) return this.#template;
        let out = [];
        if (this.#style !== `normal`) out.push(this.#style);
        if (this.#variant !== `normal`) out.push(this.#variant);
        if (this.#weight !== `normal`) out.push(this.#weight);
        if (this.#size !== `medium`) {
            if (string.is_integer(`${this.#size}`)) out.push(`${this.#size}px`);
            else out.push(this.#size);
        }
        if (!string.empty(this.#family)) out.push(this.#family);
        return out.join(` `);
    }

    /**
     * Copies the font properties from the provided font object or template name to the current font object.
     * If the provided data is a template name, it sets the template property of the current font object.
     * If the provided data is a font object, it copies the font properties to the current font object.
     * @param {String|font} data - The font object or template name to copy the properties from.
     */
    from(data) {
        if (template_list.includes(data)) {
            this.template = data;
        }
        else {
            this.family = data.family;
            this.size = data.size;
            this.style = data.style;
            this.variant = data.variant;
            this.weight = data.weight;
            this.line_height = numb.parse(data.line_height);
        }
    };

    /**
     * Compares the font properties with another font object to check if they are the same.
     * @param {font} data - The font object to compare with.
     * @returns {boolean} - Returns true if the font properties are the same, otherwise returns false.
     */
    same(data) {
        return (
            this.family === data.family &&
            this.size === data.size &&
            this.style === data.style &&
            this.variant === data.variant &&
            this.weight === data.weight &&
            this.line_height === data.line_height
        );
    };

};

/**
 * Converts a font object to an XML node representing the font.
 * @param {font} f - The font object to convert to an XML node.
 * @returns {xnode} - Returns an XML node representing the font.
 */
export const font_to_xml = f => {
    const node = new xnode(`font`);

    if (f.template) {
        // If the font object has a template, create a template node and set its value.
        node.append_child(new xnode(`template`)).value = `${f.template}`;
    }
    else {
        // If the font object does not have a template, create nodes for family, size, weight, style, and variant.
        node.append_child(new xnode(`family`)).value = `${f.family}`;
        node.append_child(new xnode(`size`)).value = `${f.size}`;

        if (f.weight !== `normal`)
            node.append_child(new xnode(`weight`)).value = `${f.weight}`;

        if (f.style !== `normal`)
            node.append_child(new xnode(`style`)).value = `${f.style}`;

        if (f.variant !== `normal`)
            node.append_child(new xnode(`variant`)).value = `${f.variant}`;
    }

    return node;
};

/**
 * Converts an XML node to a font object.
 * @param {xnode} x - The XML node to convert to a font object.
 * @returns {font} - Returns a font object created from the XML node.
 */
export const xml_to_font = x => {
    const f = new font();

    let child = x.child_by_name(`template`);
    if (child) f.template = child.value;
    else {
        child = x.child_by_name(`family`);
        if (child) f.family = child.value;

        child = x.child_by_name(`size`);
        if (child) f.size = child.value;

        child = x.child_by_name(`weight`);
        if (child) f.weight = child.value;

        child = x.child_by_name(`style`);
        if (child) f.style = child.value;

        child = x.child_by_name(`variant`);
        if (child) f.variant = child.value;
    }

    return f;
};
