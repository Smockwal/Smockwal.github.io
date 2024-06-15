import { xdoc } from "../../lib/xml/xdoc.js";
import { xnode } from "../../lib/xml/xnode.js";

const exemple_000 = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<hud>
  <widget type="widget" name="header">
    <property name="geometry">
      <rect>
        <x>0</x>
        <y>0</y>
        <width>400</width>
        <height>30</height>
      </rect>
    </property>
    <property name="back_color">
      <color>#FFFFFFFF</color>
    </property>
    <property name="font">
      <font>
        <family>Georgia, serif</family>
        <size>12</size>
      </font>
    </property>
    <property name="color">
      <color>#FF000000</color>
    </property>
  </widget>
  <widget type="widget" name="page_1">
    <property name="geometry">
      <rect>
        <x>0</x>
        <y>0</y>
        <width>400</width>
        <height>240</height>
      </rect>
    </property>
    <property name="back_color">
      <color>#FFFFFFFF</color>
    </property>
    <property name="font">
      <font>
        <family>Georgia, serif</family>
        <size>12</size>
      </font>
    </property>
    <property name="color">
      <color>#FF000000</color>
    </property>
  </widget>
</hud>
`;

describe('xdoc Class', () => {
	let xdocInstance;
	const validXMLString = '<root><child>value</child></root>';
	const invalidXMLString = '<root><child>value</child>';

	beforeEach(() => {
		xdocInstance = new xdoc();
	});

	describe('Constructor', () => {
		it('should initialize with default values', () => {
			expect(xdocInstance.version).toBe('1.0');
			expect(xdocInstance.encoding).toBe('UTF-8');
			expect(xdocInstance.standalone).toBe(false);
			expect(xdocInstance.root).toBe(null);
		});

		it('should set custom values if provided', () => {
			const customXdoc = new xdoc('1.1', 'ISO-8859-1', true);
			expect(customXdoc.version).toBe('1.1');
			expect(customXdoc.encoding).toBe('ISO-8859-1');
			expect(customXdoc.standalone).toBe(true);
		});

		it(`constructor_000`, () => {
			let a = new xdoc();
			expect(JSON.stringify(a)).toEqual(`{}`);
		});

		it(`constructor_001`, () => {
			let a = new xdoc();
			expect(a.version).toEqual(`1.0`);
			expect(a.encoding).toEqual(`UTF-8`);
			expect(a.standalone).toEqual(false);
		});
	});

	describe('Version Property', () => {
		it('should get and set version correctly', () => {
			xdocInstance.version = '1.1';
			expect(xdocInstance.version).toBe('1.1');
		});

		it('should throw error for non-string version', () => {
			expect(() => xdocInstance.version = 1.1).toThrowError('XML version must be of string type.');
		});
	});

	describe('Encoding Property', () => {
		it('should get and set encoding correctly', () => {
			xdocInstance.encoding = 'ISO-8859-1';
			expect(xdocInstance.encoding).toBe('ISO-8859-1');
		});

		it('should convert encoding to uppercase', () => {
			xdocInstance.encoding = 'iso-8859-1';
			expect(xdocInstance.encoding).toBe('ISO-8859-1');
		});

		it('should throw error for non-string encoding', () => {
			expect(() => xdocInstance.encoding = 123).toThrowError('XML encoding must be of string type.');
		});
	});

	describe('Standalone Property', () => {
		it('should get and set standalone correctly', () => {
			xdocInstance.standalone = true;
			expect(xdocInstance.standalone).toBe(true);
		});

		it('should throw error for non-boolean standalone', () => {
			expect(() => xdocInstance.standalone = 'true').toThrowError('Standalone must be of type boolean');
		});
	});

	describe('Root Property', () => {
		it('should get and set root correctly', () => {
			const rootNode = new xnode('root');
			xdocInstance.root = rootNode;
			expect(xdocInstance.root).toBe(rootNode);
		});

		it('should throw error for non-xnode root', () => {
			expect(() => xdocInstance.root = {}).toThrowError('root must be of type xnode');
		});
	});

	describe('parse_from_string Method', () => {
		it('should parse valid XML string', () => {
			xdocInstance.parse_from_string(validXMLString);
			expect(xdocInstance.root.name).toBe('root');
		});

		it('should throw error for invalid XML string', () => {
			expect(() => xdocInstance.parse_from_string(invalidXMLString)).toThrowError();
		});

		it(`parse_from_string_000`, () => {
			let doc = new xdoc();
			doc.parse_from_string(exemple_000);
		});
	});

	describe('string Method', () => {
		it('should return XML string with declaration', () => {
			xdocInstance.parse_from_string(validXMLString);
			const xmlString = xdocInstance.string();
			expect(xmlString).toContain('<?xml version="1.0" encoding="UTF-8"?>');
			expect(xmlString).toContain(`<root>\n  <child>value</child>\n</root>`);
		});

		it('should return XML string without declaration', () => {
			xdocInstance.parse_from_string(validXMLString);
			const xmlString = xdocInstance.string(false);
			expect(xmlString).not.toContain('<?xml version="1.0" encoding="UTF-8"?>');
			expect(xmlString).toContain(`<root>\n  <child>value</child>\n</root>`);
		});

		it('should throw error if document is empty', () => {
			expect(() => xdocInstance.string()).toThrowError('Document is empty.');
		});

		it(`string_000`, () => {
			let doc = new xdoc();
			doc.root = new xnode(`hud`);
			expect(doc.string()).toEqual(`<?xml version="1.0" encoding="UTF-8"?>\n<hud/>`);
		});

	});

	describe('xml Method', () => {
		it('should return XMLDocument', () => {
			xdocInstance.parse_from_string(validXMLString);
			const xmlDoc = xdocInstance.xml();
			expect(xmlDoc.documentElement.nodeName).toBe('root');
		});

		it('should throw error if document is empty', () => {
			expect(() => xdocInstance.xml()).toThrowError('Document is empty.');
		});
	});
});
