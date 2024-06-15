import { recti } from "../../lib/gui/rect.js";
import { text, text_to_xml, xml_to_text } from "../../lib/gui/text.js";
import { xnode } from "../../lib/xml/xnode.js";


describe('text class', () => {
    let testText;

    beforeEach(() => {
        testText = new text('Test', 'left', 'alphabetic', 'inherit');
    });

    it('should create a text object with default properties', () => {
        expect(testText.string).toBe('Test');
        expect(testText.align).toBe('left');
        expect(testText.baseline).toBe('alphabetic');
        expect(testText.direction).toBe('inherit');
    });

    it('should set and get string property', () => {
        testText.string = 'New Text';
        expect(testText.string).toBe('New Text');
    });

    it('should set and get align property', () => {
        testText.align = 'center';
        expect(testText.align).toBe('center');
    });

    it('should set and get baseline property', () => {
        testText.baseline = 'middle';
        expect(testText.baseline).toBe('middle');
    });

    it('should set and get direction property', () => {
        testText.direction = 'rtl';
        expect(testText.direction).toBe('rtl');
    });

    it('should throw error when setting invalid string property', () => {
        expect(() => { testText.string = 123; }).toThrowError('text must be string.');
    });

    it('should throw error when setting invalid align property', () => {
        expect(() => { testText.align = 'invalid'; }).toThrowError('invalid text-align string.');
    });

    it('should throw error when setting invalid baseline property', () => {
        expect(() => { testText.baseline = 'invalid'; }).toThrowError('invalid text-baseline string.');
    });

    it('should throw error when setting invalid direction property', () => {
        expect(() => { testText.direction = 'invalid'; }).toThrowError('invalid text-direction string.');
    });

    it('should draw the text on the canvas at the specified position', () => {
        // Mock canvas and box objects
        const mockCanvas = {
            ctx: {
                save: jasmine.createSpy('save'),
                restore: jasmine.createSpy('restore'),
                measureText: jasmine.createSpy('measureText').and.returnValue({ width: 50 }),
                fillText: jasmine.createSpy('fillText')
            }
        };
        const mockBox = new recti(10, 20, 100, 80);
        //const mockBox = { left: 10, top: 20, right: 100, bottom: 80 };

        testText.draw(mockCanvas, mockBox);

        expect(mockCanvas.ctx.save).toHaveBeenCalled();
        expect(mockCanvas.ctx.restore).toHaveBeenCalled();
        expect(mockCanvas.ctx.textAlign).toBe('left');
        expect(mockCanvas.ctx.textBaseline).toBe('alphabetic');
        expect(mockCanvas.ctx.fillText).toHaveBeenCalledWith('Test', 10, 59);
    });
});

describe('text_to_xml function', () => {
    it('should convert a text object into an XML node', () => {
        const testText = new text('Test', 'left', 'alphabetic', 'inherit');
        const xmlNode = text_to_xml(testText);

        expect(xmlNode.name).toBe('text');
        expect(xmlNode.childrens.length).toBe(1);
        expect(xmlNode.childrens[0].name).toBe('string');
        expect(xmlNode.childrens[0].value).toBe('Test');
    });

    it('should include non-default attributes in the XML node', () => {
        const testText = new text('Test', 'center', 'middle', 'rtl');
        const xmlNode = text_to_xml(testText);

        expect(xmlNode.childrens.length).toBe(4);
        expect(xmlNode.childrens[1].name).toBe('align');
        expect(xmlNode.childrens[1].value).toBe('center');
        expect(xmlNode.childrens[2].name).toBe('baseline');
        expect(xmlNode.childrens[2].value).toBe('middle');
        expect(xmlNode.childrens[3].name).toBe('direction');
        expect(xmlNode.childrens[3].value).toBe('rtl');
    });
});

describe('xml_to_text function', () => {
    it('should convert an XML node into a text object', () => {
        const xmlNode = new xnode('text');
        xmlNode.append_child(new xnode('string')).value = 'Test';
        const testText = xml_to_text(xmlNode);

        expect(testText.string).toBe('Test');
        expect(testText.align).toBe('left');
        expect(testText.baseline).toBe('alphabetic');
        expect(testText.direction).toBe('inherit');
    });

    it('should extract non-default attributes from the XML node', () => {
        const xmlNode = new xnode('text');
        xmlNode.append_child(new xnode('string')).value = 'Test';
        xmlNode.append_child(new xnode('align')).value = 'center';
        xmlNode.append_child(new xnode('baseline')).value = 'middle';
        xmlNode.append_child(new xnode('direction')).value = 'rtl';
        const testText = xml_to_text(xmlNode);

        expect(testText.align).toBe('center');
        expect(testText.baseline).toBe('middle');
        expect(testText.direction).toBe('rtl');
    });
});

describe(`gui text test`, () => {
    it(`constructor_000`, () => {
        const t0 = new text();
        expect(t0.string).toBe(``);
        expect(t0.align).toEqual(`left`);
        expect(t0.baseline).toEqual(`alphabetic`);
        expect(t0.direction).toEqual(`inherit`);
    });

    it(`constructor_001`, () => {
        const t0 = new text(`text`);
        expect(t0.string).toBe(`text`);
        expect(t0.align).toEqual(`left`);
        expect(t0.baseline).toEqual(`alphabetic`);
        expect(t0.direction).toEqual(`inherit`);
    });
});