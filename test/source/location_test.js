import { type_error } from '../../lib/error.js';
import { location } from '../../lib/source/location.js'; // Adjust the import path as necessary
import { message } from '../../lib/source/message.js';
import { uris } from '../../lib/system/uris.js';
import { string } from '../../lib/text/string.js';

describe(`location`, () => {

    afterEach(() => {
        message.print();
        message.clear();
    });

    beforeEach(() => {
        //macros.clear();
        uris.clear();
    });

    it(`constructor_new_00`, () => {
        let a = new location();
        expect(a.line).toBe(1);
        expect(a.col).toBe(0);
        expect(a.file).toBe(-1);
    });

    it(`constructor_copy_empty_00`, () => {
        let a = new location();
        let b = new location(a);
        expect(b.line).toBe(1);
        expect(b.col).toBe(0);
        expect(b.file).toBe(-1);
    });

    it(`constructor_copy_00`, () => {
        let a = new location();
        a.file = 1;
        a.line = 2;
        a.col = 3;
        let b = new location(a);
        expect(b.file).toBe(1);
        expect(b.line).toBe(2);
        expect(b.col).toBe(3);
    });

    it(`file_00`, () => {
        let a = new location(`main.lsl`);
        expect(a.file).toBe(0);

        a = new location(`main.lsl`);
        expect(a.file).toBe(0);

        a = new location(`include.lsl`);
        expect(a.file).toBe(1);

        let b = new location(a);
        expect(a.file).toBe(1);
    });

    it(`op_equal_00`, () => {
        let a = new location();
        a.file = 1;
        a.line = 2;
        a.col = 3;
        let b = new location();
        b = a;
        expect(b.file).toBe(1);
        expect(b.line).toBe(2);
        expect(b.col).toBe(3);
    });

    it(`is_less_than_00`, () => {
        let a = new location(), b = new location();
        expect(a.is_less_than(b)).toBeFalse();

        b.file = 1;
        expect(a.is_less_than(b)).toBeTrue();

        b.file = -1;
        expect(a.is_less_than(b)).toBeFalse();

        b.line = 2;
        expect(a.is_less_than(b)).toBeTrue();

        b.line = 1;
        expect(a.is_less_than(b)).toBeFalse();

        b.col = 1;
        expect(a.is_less_than(b)).toBeTrue();
    });

    it(`same_line_00`, () => {
        let a = new location(), b = new location();
        expect(a.same_line(b)).toBeTrue();

        a.line = 2;
        expect(a.same_line(b)).toBeFalse();

        b.line = 2;
        expect(a.same_line(b)).toBeTrue();

        a.file = 1;
        expect(a.same_line(b)).toBeFalse();

        b.file = 1;
        expect(a.same_line(b)).toBeTrue();
    });

    it(`adjust_00`, () => {
        let a = new location();
        expect(a.line).toBe(1);
        expect(a.col).toBe(0);

        let sa = `ab`;
        a.adjust(sa);
        expect(a.line).toBe(1);
        expect(a.col).toBe(2);

        sa = `sdfsdf\r\nsdfsd`;
        a.adjust(sa);
        expect(a.line).toBe(2);
        expect(a.col).toBe(6);

        let b = new location();
        sa = `g\rsddf\r\ndfs\nsd\n`;
        b.adjust(sa);
        expect(b.line).toBe(4);
        expect(b.col).toBe(1);

        let c = new location();
        sa = `#include <stdin.hls>\n`;
        c.adjust(sa);
        expect(c.line).toBe(2);
        expect(c.col).toBe(1);
    });

    it(`str_00`, () => {
        let a = new location();
        expect(a.str()).toBe(`#line 1`);

        a._file = `main.js`;
        expect(a.str()).toBe(`#line 1`);
    });

    it(`str_01`, () => {
        let a = new location(`main.js`);
        expect(a.str()).toBe(`#file "main.js":1`);;
    });

    // {file:"main.js", line:1, col:0}
    it(`line_directive_00`, () => {
        let a = new location();
        a.line_directive({ kind: `location`, file: `main.js`, line: 1, col: 0 });
        expect(a.file).toBe(0);
        expect(a.line).toBe(1);
        expect(a.col).toBe(0);
    });

    it(`line_directive_01`, () => {
        let a = new location();
        a.line_directive({ kind: `location`, file: `main.js`, line: 3, col: 6 });
        expect(a.file).toBe(0);
        expect(a.line).toBe(3);
        expect(a.col).toBe(6);
    });

    it(`line_directive_02`, () => {
        let a = new location();
        a.line_directive({ kind: `location`, line: 3, col: 6 });
        expect(a.file).toBe(-1);
        expect(a.line).toBe(3);
        expect(a.col).toBe(6);
    });

    it(`line_directive_04`, () => {
        let a = new location();
        a.line_directive({ kind: `location`, file: `main.js`, line: 10, col: 18 });
        expect(a.file).toBe(0);
        expect(a.line).toBe(10);
        expect(a.col).toBe(18);
    });

});

describe('location', () => {
    let mockFileAdd;
    let mockFileUri;
    let mockFileName;
    let mockStringEmpty;

    beforeEach(() => {
        mockFileAdd = spyOn(uris, 'add').and.callFake((name) => name.length); // Mock uris.add to return the length of the string
        mockFileUri = spyOn(uris, 'uri').and.callFake((fileId) => `uri${fileId}.js`); // Mock uris.uri to return a string based on the fileId
        mockStringEmpty = spyOn(string, 'empty').and.callFake((str) => !str || str.length === 0); // Mock string.empty to check for empty string
    });

    describe('constructor', () => {
        it('should create a new location from another location', () => {
            const loc1 = new location(5, 10, 15);
            const loc2 = new location(loc1);

            expect(loc2.file).toBe(5);
            expect(loc2.line).toBe(10);
            expect(loc2.col).toBe(15);
        });

        it('should create a new location from a number', () => {
            const loc = new location(5, 10, 15);

            expect(loc.file).toBe(5);
            expect(loc.line).toBe(10);
            expect(loc.col).toBe(15);
        });

        it('should create a new location from a string', () => {
            const loc = new location('filename', 10, 15);

            expect(loc.file).toBe('filename'.length);
            expect(loc.line).toBe(10);
            expect(loc.col).toBe(15);
        });

        it('should create a new location with default values', () => {
            const loc = new location();

            expect(loc.file).toBe(-1);
            expect(loc.line).toBe(1);
            expect(loc.col).toBe(0);
        });
    });

    describe('file', () => {
        it('should get and set file as a number', () => {
            const loc = new location();
            loc.file = 10;
            expect(loc.file).toBe(10);
        });

        it('should get and set file as a string', () => {
            const loc = new location();
            loc.file = 'filename.js';
            expect(loc.file).toBe('filename.js'.length);
        });

        it('should throw a type_error for invalid file type', () => {
            const loc = new location();
            expect(() => {
                loc.file = {};
            }).toThrowError(type_error, 'location.file = [object Object]: call on type: object');
        });
    });

    describe('line', () => {
        it('should get and set line', () => {
            const loc = new location();
            loc.line = 20;
            expect(loc.line).toBe(20);
        });

        it('should throw a type_error for invalid line type', () => {
            const loc = new location();
            expect(() => {
                loc.line = 'not a number';
            }).toThrowError(type_error, 'location.line = not a number: call on type: string');
        });
    });

    describe('col', () => {
        it('should get and set col', () => {
            const loc = new location();
            loc.col = 30;
            expect(loc.col).toBe(30);
        });

        it('should throw a type_error for invalid col type', () => {
            const loc = new location();
            expect(() => {
                loc.col = 'not a number';
            }).toThrowError(type_error, 'location.col = not a number: call on type: string');
        });
    });

    describe('is_less_than', () => {
        it('should correctly compare locations', () => {
            const loc1 = new location(1, 1, 1);
            const loc2 = new location(1, 1, 2);
            const loc3 = new location(1, 2, 1);
            const loc4 = new location(2, 1, 1);

            expect(loc1.is_less_than(loc2)).toBe(true);
            expect(loc2.is_less_than(loc1)).toBe(false);
            expect(loc1.is_less_than(loc3)).toBe(true);
            expect(loc3.is_less_than(loc1)).toBe(false);
            expect(loc1.is_less_than(loc4)).toBe(true);
            expect(loc4.is_less_than(loc1)).toBe(false);
        });
    });

    describe('same_line', () => {
        it('should correctly check if locations are on the same line', () => {
            const loc1 = new location(1, 1, 1);
            const loc2 = new location(1, 1, 2);
            const loc3 = new location(1, 2, 1);
            const loc4 = new location(2, 1, 1);

            expect(loc1.same_line(loc2)).toBe(true);
            expect(loc1.same_line(loc3)).toBe(false);
            expect(loc1.same_line(loc4)).toBe(false);
        });
    });

    describe('adjust', () => {
        it('should adjust the location based on a string without newlines', () => {
            const loc = new location(1, 1, 1);
            loc.adjust('hello');
            expect(loc.col).toBe(6);
            expect(loc.line).toBe(1);
        });

        it('should adjust the location based on a string with newlines', () => {
            const loc = new location(1, 1, 1);
            loc.adjust('hello\nworld');
            expect(loc.col).toBe(6);
            expect(loc.line).toBe(2);
        });

        it('should adjust the location based on an empty string', () => {
            const loc = new location(1, 1, 1);
            loc.adjust('');
            expect(loc.col).toBe(1);
            expect(loc.line).toBe(1);
        });

        it('should throw a TypeError for non-string input', () => {
            const loc = new location(1, 1, 1);
            expect(() => {
                loc.adjust(123);
            }).toThrowError(TypeError, 'location.adjust(123): call on type: number');
        });
    });

    describe('str', () => {
        it('should return the correct string representation of the location', () => {

            const loc1 = new location(5, 10, 15);
            expect(loc1.str()).toBe('#file "uri5.js":10:15');

            const loc2 = new location(0, 1, 0);
            expect(loc2.str()).toBe('#file "uri0.js":1');
        });
    });

    describe('line_directive', () => {
        it('should set the file, line, and col based on another location object', () => {
            const loc1 = new location(1, 2, 3);
            const loc2 = new location(2, 3, 4);

            loc1.line_directive(loc2);
            expect(loc1.file).toBe(2);
            expect(loc1.line).toBe(3);
            expect(loc1.col).toBe(4);
        });

        it('should set the line and col to default values if not provided', () => {
            const loc1 = new location(1, 2, 3);
            const loc2 = new location(2);

            loc1.line_directive(loc2);
            expect(loc1.file).toBe(2);
            expect(loc1.line).toBe(1);
            expect(loc1.col).toBe(0);
        });
    });

    describe('is', () => {
        it('should correctly compare if locations are equal', () => {
            const loc1 = new location(1, 2, 3);
            const loc2 = new location(1, 2, 3);
            const loc3 = new location(1, 2, 4);

            expect(loc1.is(loc2)).toBe(true);
            expect(loc1.is(loc3)).toBe(false);
        });
    });
});


