import { xtext } from "../../../lib/xml/xtext.js";


// Test suite for xtext class using Jasmine

describe("xtext", () => {
    let testText;
  
    beforeEach(() => {
      // Initialize testText before each test
      testText = new xtext("test");
    });

    it(`constructor_000`, () => {
        let a = new xtext(`x`);
        expect(JSON.stringify(a)).toEqual(`{}`);
    });
  
    it("should create a new xtext instance", () => {
      // Test the creation of a new xtext instance
      expect(testText.value).toBe("test");
      expect(testText.kind).toBe("xtext");
    });
  
    it("should parse XML element and set value after unescaping HTML entities", () => {
      // Test the parse method
      const xmlElement = { data: "This is &lt;b&gt;bold&lt;/b&gt;" };
      testText.parse(xmlElement);
      expect(testText.value).toBe("This is <b>bold</b>");
    });
  
    it("should return a new XML text node containing the HTML-escaped value", () => {
      // Test the xml method
      const doc = document.implementation.createDocument("http://www.w3.org/1999/xhtml", "html", null);
      const textNode = testText.xml(doc);
      expect(textNode.nodeType).toBe(Node.TEXT_NODE);
      expect(textNode.nodeValue).toBe("test");
    });
  
    it("should compare values with another xtext instance", () => {
      // Test the is method
      const otherText = new xtext("test");
      expect(testText.is(otherText)).toBe(true);
    });
  
  });
