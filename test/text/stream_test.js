
import { range_error, type_error } from "../../lib/error.js";
import { stream } from "../../lib/text/stream.js";

describe(`stream`, () => {

    describe('stream class', () => {
        it('should initialize with a string', () => {
            const s = new stream('test');
            expect(s.str).toBe('test');
            expect(s.pos).toBe(-1);
        });
    
        it('should throw a range_error for invalid position', () => {
            const s = new stream('test');
            expect(() => { s.pos = -2; }).toThrowError(range_error, 'index out of bound.');
            expect(() => { s.pos = 5; }).toThrowError(range_error, 'index out of bound.');
        });
    
        it('should set and get valid positions', () => {
            const s = new stream('test');
            s.pos = 2;
            expect(s.pos).toBe(2);
        });
    
        it('should throw a type_error for non-string data', () => {
            const s = new stream('test');
            expect(() => { s.str = 123; }).toThrowError(type_error, 'stream data must be a String.');
        });
    
        it('should handle the BOM correctly for UTF-8', () => {
            const s = new stream('\uFEFFtest');
            expect(s.str).toBe('test');
        });
    
        it('should handle the BOM correctly for UTF-16', () => {
            const s = new stream('\uFFFEtest');
            expect(s.str).toBe('test');
        });
    
        it('should return good() as true for a valid stream', () => {
            const s = new stream('test');
            expect(s.good()).toBe(true);
        });
    
        it('should return good() as false for an invalid stream', () => {
            const s = new stream('');
            expect(s.good()).toBe(false);
        });
    
        it('should read characters correctly with get()', () => {
            const s = new stream('test');
            expect(s.get()).toBe('t');
            expect(s.get()).toBe('e');
            expect(s.get()).toBe('s');
            expect(s.get()).toBe('t');
        });
    
        it('should return undefined at the end of the stream', () => {
            const s = new stream('test');
            s.pos = 2;
            expect(s.get()).toBe('t');
            expect(s.get()).toBe(undefined);
        });
    
        it('should unget a character correctly', () => {
            const s = new stream('test');
            s.get();
            s.unget();
            expect(s.pos).toBe(-1);
            s.get();
            s.get();
            s.unget();
            expect(s.get()).toBe('e');
        });
    
        it('should handle line endings correctly', () => {
            const s = new stream('line1\r\nline2');
            expect(s.get()).toBe('l');
            expect(s.get()).toBe('i');
            expect(s.get()).toBe('n');
            expect(s.get()).toBe('e');
            expect(s.get()).toBe('1');
            expect(s.get()).toBe('\n');
            expect(s.get()).toBe('l');
        });
    
        it('should peek the next character correctly', () => {
            const s = new stream('test');
            expect(s.peek()).toBe('t');
            s.get();
            expect(s.peek()).toBe('e');
        });
    
        it('should skip correctly with peek()', () => {
            const s = new stream('test\\\r\npest');
            s.pos = 2;
            s.get();
            expect(s.peek(true)).toBe('p');
        });
    
        it('should handle an empty string', () => {
            const s = new stream('');
            expect(s.get()).toBe(undefined);
            expect(s.peek()).toBe(undefined);
        });
    
        it('should handle special characters in the string', () => {
            const s = new stream('!@#$%^&*()_+');
            expect(s.get()).toBe('!');
            expect(s.get()).toBe('@');
            expect(s.get()).toBe('#');
            expect(s.get()).toBe('$');
        });
    
        it('should reset position with unget correctly', () => {
            const s = new stream('test');
            s.get();
            s.get();
            s.unget();
            s.unget();
            expect(s.pos).toBe(-1);
        });
    });

    it(`constructor_000`, () => {
        expect(1).toBe(1);
        let str = `Hello World!`;
        let a = new stream(str);
        for (let it = 0, numb = a.length; it < numb; ++it)
            expect(a.str[it]).toBe(str[it]);

        expect(a.str[12]).not.toBeDefined();
    });

    it(`good_000`, () => {
        expect(1).toBe(1);
        let str_0 = `Hello World!`;
        let a = new stream(str_0);
        expect(a.good()).toBeTrue();

        for (let it = 0, numb = str_0.length; it < numb; ++it) {
            a.pos = it;
            expect(a.good()).toBeTrue();
        }
        a.pos = str_0.length;
        expect(a.good()).toBeFalse();
        expect(a.get()).not.toBeDefined();

    });

    it(`good_001`, () => {
        expect(1).toBe(1);
        let str_0 = `Hello World!`;
        let a = new stream(str_0);
        expect(a.good()).toBeTrue();

        for (let it = 0, numb = str_0.length; it < numb; ++it) {
            a.pos = it;
            expect(a.good()).toBeTrue();

        }
        a.pos = str_0.length;
        expect(a.good()).toBeFalse();
        expect(a.get()).not.toBeDefined();

    });

    it(`get_000`, () => {
        expect(1).toBe(1);
        let str = `Hello World!`;
        let a = new stream(str);
        for (let it = 0, numb = a.length; it < numb; ++it)
            expect(a.get()).toBe(str[it]);
    });

    it(`get_001`, () => {
        expect(1).toBe(1);
        let str = `Hello\nWorld!`;
        let a = new stream(str);
        //console.log(a);
        for (let it = 0, numb = a.length; it < numb; ++it)
            expect(a.get()).toBe(str[it]);
    });

    it(`get_002`, () => {
        expect(1).toBe(1);
        let str_0 = `Hello\nWorld!`;
        let str_1 = `Hello\r\nWorld!`;
        let a = new stream(str_1);
        for (let it = 0, numb = str_0.length; it < numb; ++it)
            expect(a.get()).toBe(str_0[it]);
    });

    it(`peek_001`, () => {
        expect(1).toBe(1);
        let str_0 = `Hello World!`;
        let a = new stream(str_0);
        for (let it = 0, numb = str_0.length; it < numb; ++it) {
            expect(a.peek()).toBe(str_0[it]);
            a.get();
        }
    });

    it(`peek_002`, () => {
        expect(1).toBe(1);
        let str_0 = `/\\\n*\n*/`;
        let a = new stream(str_0);
        expect(a.get()).toBe(`/`);
        expect(a.peek()).not.toBe(`*`);
        expect(a.peek(true)).toBe(`*`);
    });

    xit(`peek_003`, async () => {
        expect(1).toBe(1);
        let str_0 = await fetch(`../data/peek_3.c`)
            .then(res => res.text());

        let a = new stream(str_0);
        expect(a.get()).toBe(`/`);

        //console.log(string.printable(a._str[a._pos + 2]));


        expect(a.peek()).not.toBe(`*`);
        //console.log(a.peek());

        expect(a.peek(true)).toBe(`*`);
        //console.log(a.peek(true));
    });

    it(`unget_001`, () => {
        expect(1).toBe(1);
        let str_0 = `Hello World!`;
        let a = new stream(str_0);

        expect(a.peek()).toBe(str_0[0]);
        a.unget();
        expect(a.peek()).toBe(str_0[0]);

        expect(a.get()).toBe(str_0[0]);
        expect(a.get()).toBe(str_0[1]);
        a.unget();
        expect(a.get()).toBe(str_0[1]);

    });


});