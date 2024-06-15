import { xnode } from "../../../lib/xml/xnode.js";


describe("xnode", () => {

    describe("constructor", () => {
        it("should create an xnode instance with a name", () => {
            const node = new xnode("testNode");
            expect(node.name).toBe("testNode");
        });

        it("should create an xnode instance by copying another xnode", () => {
            const original = new xnode("originalNode");
            const copy = new xnode(original);
            expect(copy.name).toBe("originalNode");
        });

        it("should throw an error for invalid XML node type", () => {
            expect(() => new xnode({ nodeType: 2 })).toThrowError("Invalid parameter type.");
        });

        it("should throw an error for unknown parameter type", () => {
            expect(() => new xnode(123)).toThrowError("Invalid parameter type.");
        });

        it(`constructor_000`, () => {
            let a = new xnode(`x`);
            expect(JSON.stringify(a)).toEqual(`{}`);
        });

        it(`constructor_001`, () => {
            expect(() => new xnode(3)).toThrowMatching(err => err.message === 'Invalid parameter type.');
        });

        it(`constructor_002`, () => {
            expect(() => new xnode()).toThrowMatching(err => err.message === 'Invalid parameter type.');
        });

        it(`constructor_003`, () => {
            expect(() => new xnode(``)).toThrowMatching(err => err.message === 'Node element must be named.');
        });

        it(`constructor_005`, () => {
            let a = new xnode(`x`);
            let b = new xnode(a);
            expect(JSON.stringify(b)).toEqual(`{}`);
        });
    });

    describe("name property", () => {
        it("should get and set the name", () => {
            const node = new xnode("initialName");
            expect(node.name).toBe("initialName");
            node.name = "newName";
            expect(node.name).toBe("newName");
        });

        it("should throw an error if name is not a string", () => {
            const node = new xnode("initialName");
            expect(() => { node.name = 123; }).toThrowError("Node name must be a string.");
        });

        it("should throw an error if name is an empty string", () => {
            const node = new xnode("initialName");
            expect(() => { node.name = ""; }).toThrowError("Node element must be named.");
        });

        it(`name_000`, () => {
            let a = new xnode(`x`);
            expect(a.name).toBe(`x`);
            a.name = `y`;
            expect(a.name).toBe(`y`);
        });


    });

    describe("value property", () => {
        it("should get and set the value", () => {
            const node = new xnode("testNode");
            node.value = "testValue";
            expect(node.value).toBe("testValue");
        });
    });

    describe("attributes", () => {
        it("should get the attribute count", () => {
            const node = new xnode("testNode");
            expect(node.attribute_count).toBe(0);
        });

        it("should check if an attribute exists", () => {
            const node = new xnode("testNode");
            node.set_attribute("attr", "value");
            expect(node.has_attribute("attr")).toBe(true);
        });

        it("should get an attribute value", () => {
            const node = new xnode("testNode");
            node.set_attribute("attr", "value");
            expect(node.get_attribute("attr")).toBe("value");
        });

        it("should set and update an attribute", () => {
            const node = new xnode("testNode");
            node.set_attribute("attr", "value");
            expect(node.get_attribute("attr")).toBe("value");
            node.set_attribute("attr", "newValue");
            expect(node.get_attribute("attr")).toBe("newValue");
        });

        it(`attributes_000`, () => {
            let a = new xnode(`x`);
            expect(a.has_attribute(`y`)).toBeFalse();
            a.set_attribute(`y`);
            expect(a.has_attribute(`y`)).toBeTrue();
            expect(a.get_attribute(`y`)).toBe(true);
        });

        it(`attributes_001`, () => {
            let a = new xnode(`x`);
            expect(a.has_attribute(`y`)).toBeFalse();
            let b = a.set_attribute(`y`, 0);
            expect(a.has_attribute(`y`)).toBeTrue();
            expect(a.get_attribute(`y`)).toBe(`0`);
        });
    });

    describe("child nodes", () => {
        it("should get the child count", () => {
            const node = new xnode("testNode");
            expect(node.childs_count).toBe(0);
        });

        it("should append a child node", () => {
            const parent = new xnode("parentNode");
            const child = new xnode("childNode");
            parent.append_child(child);
            expect(parent.childs_count).toBe(1);
            expect(parent.childrens[0].name).toBe("childNode");
        });

        it("should append a child node 000", () => {
            const parent = new xnode("parentNode");
            parent.append_child(new xnode("childNode"));
            expect(parent.childs_count).toBe(1);
            expect(parent.childrens[0].name).toBe("childNode");
        });

        it("should throw an error if appended node is not an xnode or xtext", () => {
            const parent = new xnode("parentNode");
            expect(() => { parent.append_child({}); }).toThrowError("Fail to add child node.");
        });

        it("should find a child node by name", () => {
            const parent = new xnode("parentNode");
            const child = new xnode("childNode");
            parent.append_child(child);
            expect(parent.child_by_name("childNode")).toBe(child);
        });

        it("should find a child node by attribute", () => {
            const parent = new xnode("parentNode");
            const child = new xnode("childNode");
            child.set_attribute("attr", "value");
            parent.append_child(child);
            expect(parent.child_by_attr("attr", "value")).toBe(child);
        });

        it("should return undefined if child node by attribute is not found", () => {
            const parent = new xnode("parentNode");
            expect(parent.child_by_attr("nonexistent", "value")).toBeUndefined();
        });
    });

    describe("clone method", () => {
        it("should clone an xnode", () => {
            const original = new xnode("originalNode");
            const clone = original.clone();
            expect(clone.name).toBe("originalNode");
        });
    });

    describe("is method", () => {
        it("should check if two xnodes are equal", () => {
            const node1 = new xnode("node");
            const node2 = new xnode("node");
            expect(node1.is(node2)).toBe(true);
        });

        it("should check if two xnodes are not equal", () => {
            const node1 = new xnode("node1");
            const node2 = new xnode("node2");
            expect(node1.is(node2)).toBe(false);
        });
    });

    describe("contains method", () => {
        it("should check if a node contains another node", () => {
            const parent = new xnode("parentNode");
            const child = new xnode("childNode");
            parent.append_child(child);
            expect(parent.contains(child)).toBe(true);
        });

        it("should return false if a node does not contain another node", () => {
            const parent = new xnode("parentNode");
            const child = new xnode("childNode");
            expect(parent.contains(child)).toBe(false);
        });
    });

    describe("xml method", () => {
        it("should generate XML representation of the node", () => {
            const doc = new DOMParser().parseFromString("<root></root>", "application/xml");
            const node = new xnode("testNode");
            node.set_attribute("attr", "value");
            const xml = node.xml(doc);
            expect(xml.tagName).toBe("testNode");
            expect(xml.getAttribute("attr")).toBe("value");
        });
    });

    describe("parse method", () => {
        it("should parse an XML element into an xnode", () => {
            const doc = new DOMParser().parseFromString("<testNode attr='value'>textContent</testNode>", "application/xml");
            const element = doc.documentElement;
            const node = new xnode(element);
            
            expect(node.name).toBe("testNode");
            expect(node.get_attribute("attr")).toBe("value");
            expect(node.value).toBe("textContent");
        });
    });
});
