import { xattribute } from "../../../lib/xml/xattributes.js";

const cont = document.createElement(`div`);

describe('xnode and xattribute Test Suite', () => {
    beforeEach(() => {
        cont.innerHTML = ``;
    });

    // Utility functions for creating test elements
    const createElement = (name, attributes = {}, children = []) => {
        const elem = document.createElement(name);
        for (let [key, value] of Object.entries(attributes)) {
            elem.setAttribute(key, value);
        }
        children.forEach(child => elem.appendChild(child));
        return elem;
    };

    describe('xattribute Class', () => {

        it(`constructor_000`, () => {
            let a = new xattribute(`x`);
            expect(JSON.stringify(a)).toEqual(`{}`);
        });

        it('should initialize with name and value', () => {
            const attr = new xattribute('id', '123');
            expect(attr.name).toBe('id');
            expect(attr.value).toBe('123');
        });

        it('should handle boolean values correctly', () => {
            const attr = new xattribute('checked', true);
            expect(attr.value).toBe(`true`);
        });

        it('should parse XML attribute correctly', () => {
            const xmlAttr = createElement('div', { 'data-test': 'test-value' }).attributes[0];
            const attr = new xattribute(xmlAttr);
            expect(attr.name).toBe('data-test');
            expect(attr.value).toBe('test-value');
        });

        it('should throw error for invalid types', () => {
            expect(() => new xattribute({})).toThrowError('Unknown parameter type.');
        });

        it('should generate correct XML attribute', () => {
            const doc = document.implementation.createDocument('', '', null);
            const attr = new xattribute('id', '123');
            const xmlAttr = attr.xml(doc);
            expect(xmlAttr.name).toBe('id');
            expect(xmlAttr.value).toBe('123');
        });

        it(`xml_000`, () => {
            let a = new xattribute(`x`);
            let b = cont.appendChild(document.createElement(`e`));
            b.setAttributeNode(a.xml(document));
            expect(cont.innerHTML).toBe(`<e x=""></e>`);
        });

        it(`xml_001`, () => {
            let a = new xattribute(`x`, `p`);
            let b = cont.appendChild(document.createElement(`e`));
            b.setAttributeNode(a.xml(document));
            expect(cont.innerHTML).toBe(`<e x="p"></e>`);
        });

        it(`xml_002`, () => {
            let a = new xattribute(`x`, true);
            let b = cont.appendChild(document.createElement(`e`));
            b.setAttributeNode(a.xml(document));
            expect(cont.innerHTML).toBe(`<e x="true"></e>`);
        });
    });

});

