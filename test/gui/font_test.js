import { font, font_to_xml } from "../../lib/gui/font.js";


describe("font", () => {
    let validFamily = "Arial";
    let validSize = 16;
    let validStyle = "italic";
    let validVariant = "small-caps";
    let validWeight = "bold";
    let validLineHeight = 1.5;
    let validTemplate = "message-box";

    describe("constructor", () => {
        it("should initialize with default values", () => {
            let f = new font();
            expect(f.family).toBe("");
            expect(f.size).toBe("medium");
            expect(f.style).toBe("normal");
            expect(f.variant).toBe("normal");
            expect(f.weight).toBe("normal");
            expect(f.line_height).toBe("normal");
        });

        it("should initialize with given values", () => {
            let f = new font(validFamily, validSize, validStyle, validVariant, validWeight, validLineHeight);
            expect(f.family).toBe(validFamily);
            expect(f.size).toBe(`${validSize}`);
            expect(f.style).toBe(validStyle);
            expect(f.variant).toBe(validVariant);
            expect(f.weight).toBe(validWeight);
            expect(f.line_height).toBe(validLineHeight.toString());
        });

        it("should initialize from another font instance", () => {
            let f1 = new font(validFamily, validSize, validStyle, validVariant, validWeight, validLineHeight);
            let f2 = new font(f1);
            expect(f2.same(f1)).toBe(true);
        });

        it("should initialize from a template", () => {
            let f = new font(validTemplate);
            expect(f.template).toBe(validTemplate);
        });
    });

    describe("family", () => {
        it("should throw an error if not a string", () => {
            let f = new font();
            expect(() => { f.family = 123; }).toThrowError("font family name must be string.");
        });

        it("should set the family name", () => {
            let f = new font();
            f.family = validFamily;
            expect(f.family).toBe(validFamily);
        });
    });

    describe("size", () => {
        it("should throw an error for invalid sizes", () => {
            let f = new font();
            expect(() => { f.size = "invalid"; }).toThrowError(/Font size must be a number or one of the predefined values/);
        });

        it("should set valid size", () => {
            let f = new font();
            f.size = validSize;
            expect(f.size).toBe(`${validSize}`);
        });
    });

    describe("style", () => {
        it("should throw an error for invalid styles", () => {
            let f = new font();
            expect(() => { f.style = "invalid"; }).toThrowError("Font style must be one of the predefined values.");
        });

        it("should set valid style", () => {
            let f = new font();
            f.style = validStyle;
            expect(f.style).toBe(validStyle);
        });
    });

    describe("variant", () => {
        it("should throw an error for invalid variants", () => {
            let f = new font();
            expect(() => { f.variant = "invalid"; }).toThrowError("Font variant must be one of the predefined values.");
        });

        it("should set valid variant", () => {
            let f = new font();
            f.variant = validVariant;
            expect(f.variant).toBe(validVariant);
        });
    });

    describe("weight", () => {
        it("should throw an error for invalid weights", () => {
            let f = new font();
            expect(() => { f.weight = "invalid"; }).toThrowError("Font weight must be one of the predefined values.");
        });

        it("should set valid weight", () => {
            let f = new font();
            f.weight = validWeight;
            expect(f.weight).toBe(validWeight);
        });
    });

    describe("line_height", () => {
        it("should throw an error for invalid line heights", () => {
            let f = new font();
            expect(() => { f.line_height = "invalid"; }).toThrowError("Font line height must be a number, a percent or one of the predefined values.");
        });

        it("should set valid line height", () => {
            let f = new font();
            f.line_height = validLineHeight;
            expect(f.line_height).toBe(validLineHeight.toString());
        });
    });

    describe("template", () => {
        it("should throw an error for invalid template", () => {
            let f = new font();
            expect(() => { f.template = "invalid"; }).toThrowError("Font template must be one of the predefined values.");
        });

        it("should set valid template", () => {
            let f = new font();
            f.template = validTemplate;
            expect(f.template).toBe(validTemplate);
        });
    });

    describe("css", () => {
        it("should return correct CSS string", () => {
            let f = new font(validFamily, validSize, validStyle, validVariant, validWeight, validLineHeight);
            let cssString = `${validStyle} ${validVariant} ${validWeight} ${validSize}px ${validFamily}`;
            expect(f.css).toBe(cssString);
        });

        it("should return template if set", () => {
            let f = new font();
            f.template = validTemplate;
            expect(f.css).toBe(validTemplate);
        });
    });

    describe("from", () => {
        it("should copy properties from another font object", () => {
            let f1 = new font(validFamily, validSize, validStyle, validVariant, validWeight, validLineHeight);
            let f2 = new font();
            f2.from(f1);
            expect(f2.same(f1)).toBe(true);
        });

        it("should set template from template name", () => {
            let f = new font();
            f.from(validTemplate);
            expect(f.template).toBe(validTemplate);
        });
    });

    describe("same", () => {
        it("should return true for identical fonts", () => {
            let f1 = new font(validFamily, validSize, validStyle, validVariant, validWeight, validLineHeight);
            let f2 = new font(validFamily, validSize, validStyle, validVariant, validWeight, validLineHeight);
            expect(f1.same(f2)).toBe(true);
        });

        it("should return false for different fonts", () => {
            let f1 = new font(validFamily, validSize, validStyle, validVariant, validWeight, validLineHeight);
            let f2 = new font("Times", 12, "normal", "normal", "normal", "normal");
            expect(f1.same(f2)).toBe(false);
        });
    });
});

describe('font_to_xml Function', () => {
    it('should convert a font object to an XML node', () => {
        const f = new font('Arial', 16, 'italic', 'normal', 'bold', '120%');
        const node = font_to_xml(f);

        expect(node.name).toBe('font');
        expect(node.childrens.length).toBe(4); // Assuming the template is not set

        const family = node.child_by_name(`family`);
        expect(family).toBeDefined();
        expect(family.value).toBe(`Arial`);

        const size = node.child_by_name(`size`);
        expect(size).toBeDefined();
        expect(size.value).toBe(`16`);

        const weight = node.child_by_name(`weight`);
        expect(weight).toBeDefined();
        expect(weight.value).toBe(`bold`);

        const style = node.child_by_name(`style`);
        expect(style).toBeDefined();
        expect(style.value).toBe(`italic`);
    });

    it('should handle font objects with template names', () => {
        const f = new font('caption');
        const node = font_to_xml(f);
        //console.log(node);

        expect(node.name).toBe('font');
        expect(node.childrens.length).toBe(1); // Only the template node

        const template = node.child_by_name(`template`);
        expect(template).toBeDefined();
        expect(template.value).toBe(`caption`);
    });
});

// Test cases for the xml_to_font function
describe('xml_to_font Function', () => {
    it('should convert an XML node to a font object', () => {
        //const xmlNode = /* create a sample XML node */;
        //const f = xml_to_font(xmlNode);
    });

    it('should handle XML nodes with template names', () => {
        //const xmlNode = /* create a sample XML node with a template */;
        //const f = xml_to_font(xmlNode);
    });
});
