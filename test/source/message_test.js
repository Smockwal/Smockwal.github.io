import { type_error } from "../../lib/error.js";
import { location } from "../../lib/source/location.js";
import { message } from "../../lib/source/message.js";


describe('message', () => {
    let loc1, loc2;

    beforeEach(() => {
        loc1 = new location(1, 1, 1);
        loc2 = new location(2, 2, 2);
        message.clear(); // Clear the message collection before each test
    });

    describe('constructor', () => {
        it('should create a new message with the correct properties', () => {
            const msg = new message(message.ERROR, 'An error occurred', loc1);

            expect(msg.type).toBe(message.ERROR);
            expect(msg.msg).toBe('An error occurred');
            expect(msg.loc.is(loc1)).toBe(true);
        });
    });

    describe('type', () => {
        it('should get and set the type', () => {
            const msg = new message(message.ERROR, 'An error occurred', loc1);
            msg.type = message.WARNING;
            expect(msg.type).toBe(message.WARNING);
        });

        it('should throw a type_error for invalid type', () => {
            const msg = new message(message.ERROR, 'An error occurred', loc1);
            expect(() => {
                msg.type = 'not a number';
            }).toThrowError(type_error, 'type must be a number');
        });
    });

    describe('loc', () => {
        it('should get and set the location', () => {
            const msg = new message(message.ERROR, 'An error occurred', loc1);
            msg.loc = loc2;
            expect(msg.loc.is(loc2)).toBe(true);
        });

        it('should throw a type_error for invalid location type', () => {
            const msg = new message(message.ERROR, 'An error occurred', loc1);
            expect(() => {
                msg.loc = 'not a location';
            }).toThrowError(type_error, 'loc must be of type location');
        });
    });

    describe('msg', () => {
        it('should get and set the message', () => {
            const msg = new message(message.ERROR, 'An error occurred', loc1);
            msg.msg = 'A different message';
            expect(msg.msg).toBe('A different message');
        });

        it('should throw a type_error for invalid message type', () => {
            const msg = new message(message.ERROR, 'An error occurred', loc1);
            expect(() => {
                msg.msg = 123;
            }).toThrowError(type_error, 'msg must be a string');
        });
    });

    describe('str', () => {
        it('should return the correct string representation for each message type', () => {
            const loc = new location("main.js", 1,1);

            const errorMsg = new message(message.ERROR, 'An error occurred', loc);
            const warningMsg = new message(message.WARNING, 'A warning', loc);
            const missingHeaderMsg = new message(message.MISSING_HEADER, 'Missing header', loc);
            const includeNestedMsg = new message(message.INCLUDE_NESTED_TOO_DEEPLY, 'Include nested too deeply', loc);
            const syntaxErrorMsg = new message(message.SYNTAX_ERROR, 'Syntax error', loc);
            const portabilityBackslashMsg = new message(message.PORTABILITY_BACKSLASH, 'Portability backslash', loc);
            const unhandledCharMsg = new message(message.UNHANDLED_CHAR_ERROR, 'Unhandled char error', loc);
            const explicitIncludeMsg = new message(message.EXPLICIT_INCLUDE_NOT_FOUND, 'Explicit include not found', loc);

            expect(errorMsg.str()).toBe('Error: An error occurred #file "main.js":1:1');
            expect(warningMsg.str()).toBe('Warning: A warning #file "main.js":1:1');
            expect(missingHeaderMsg.str()).toBe('Missing header: Missing header #file "main.js":1:1');
            expect(includeNestedMsg.str()).toBe('Include nested too deeply: Include nested too deeply #file "main.js":1:1');
            expect(syntaxErrorMsg.str()).toBe('Syntax error: Syntax error #file "main.js":1:1');
            expect(portabilityBackslashMsg.str()).toBe('Portability backslash: Portability backslash #file "main.js":1:1');
            expect(unhandledCharMsg.str()).toBe('Unhandled char error: Unhandled char error #file "main.js":1:1');
            expect(explicitIncludeMsg.str()).toBe('Explicit include not found: Explicit include not found #file "main.js":1:1');
        });
    });

    describe('static methods', () => {
        describe('add', () => {
            it('should add a message to the collection', () => {
                const msg = new message(message.ERROR, 'An error occurred', loc1);
                message.add(msg);
                expect(message.length()).toBe(1);
                expect(message.at(0)).toBe(msg);
            });
        });

        describe('at', () => {
            it('should return the message at the specified index', () => {
                const msg1 = new message(message.ERROR, 'Error 1', loc1);
                const msg2 = new message(message.WARNING, 'Warning 1', loc2);
                message.add(msg1);
                message.add(msg2);
                expect(message.at(0)).toBe(msg1);
                expect(message.at(1)).toBe(msg2);
            });
        });

        describe('has_error', () => {
            it('should return true if there is an error message', () => {
                const errorMsg = new message(message.ERROR, 'An error occurred', loc1);
                const warningMsg = new message(message.WARNING, 'A warning', loc2);
                message.add(errorMsg);
                message.add(warningMsg);
                expect(message.has_error()).toBe(true);
            });

            it('should return false if there are only warning messages', () => {
                const warningMsg = new message(message.WARNING, 'A warning', loc2);
                message.add(warningMsg);
                expect(message.has_error()).toBe(false);
            });
        });

        describe('length', () => {
            it('should return the number of messages in the collection', () => {
                const msg1 = new message(message.ERROR, 'Error 1', loc1);
                const msg2 = new message(message.WARNING, 'Warning 1', loc2);
                message.add(msg1);
                message.add(msg2);
                expect(message.length()).toBe(2);
            });

            it('should return 0 if there are no messages', () => {
                expect(message.length()).toBe(0);
            });
        });

        describe('print', () => {
            let consoleErrorSpy, consoleWarnSpy;

            beforeEach(() => {
                consoleErrorSpy = spyOn(console, 'error');
                consoleWarnSpy = spyOn(console, 'warn');
            });

            it('should print error messages using console.error', () => {
                const loc = new location("main.js", 1,1);
                const errorMsg = new message(message.ERROR, 'An error occurred', loc);
                message.add(errorMsg);
                message.print();
                expect(consoleErrorSpy).toHaveBeenCalledWith('Error: An error occurred #file "main.js":1:1');
            });

            it('should print warning messages using console.warn', () => {
                const loc = new location("main.js", 1,1);
                const warningMsg = new message(message.WARNING, 'A warning', loc);
                message.add(warningMsg);
                message.print();
                expect(consoleWarnSpy).toHaveBeenCalledWith('Warning: A warning #file "main.js":1:1');
            });
        });

        describe('clear', () => {
            it('should clear all messages from the collection', () => {
                const msg = new message(message.ERROR, 'An error occurred', loc1);
                message.add(msg);
                message.clear();
                expect(message.length()).toBe(0);
            });
        });
    });

    describe('print', () => {
        let consoleErrorSpy, consoleWarnSpy;

        beforeEach(() => {
            consoleErrorSpy = spyOn(console, 'error');
            consoleWarnSpy = spyOn(console, 'warn');
        });

        it('should print an error message using console.error', () => {
            const loc = new location("main.js", 1,1);
            const errorMsg = new message(message.ERROR, 'An error occurred', loc);
            errorMsg.print();
            expect(consoleErrorSpy).toHaveBeenCalledWith('Error: An error occurred #file "main.js":1:1');
        });

        it('should print a warning message using console.warn', () => {
            const loc = new location("main.js", 1,1);
            const warningMsg = new message(message.WARNING, 'A warning', loc);
            warningMsg.print();
            expect(consoleWarnSpy).toHaveBeenCalledWith('Warning: A warning #file "main.js":1:1');
        });
    });
});
