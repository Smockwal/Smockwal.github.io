import { error, range_error, type_error } from "../lib/error.js";


describe('error class', () => {

    it('should create an instance of Error', () => {
        const err = new error('Test error message');
        expect(err instanceof Error).toBe(true);
    });

    it('should create an instance of custom error class', () => {
        const err = new error('Test error message');
        expect(err instanceof error).toBe(true);
    });

    it('should set the name property to "error"', () => {
        const err = new error('Test error message');
        expect(err.name).toBe('error');
    });

    it('should set the message property correctly', () => {
        const message = 'Test error message';
        const err = new error(message);
        expect(err.message).toBe(message);
    });

    it('should return "error" as the type', () => {
        const err = new error('Test error message');
        expect(err.kind).toBe('error');
    });

    it('should retain stack trace information', () => {
        const err = new error('Test error message');
        expect(err.stack).toContain('Test error message');
    });

    it('should handle an empty message', () => {
        const err = new error('');
        expect(err.message).toBe('');
    });

    it('should handle a very long message', () => {
        const longMessage = 'a'.repeat(1000);
        const err = new error(longMessage);
        expect(err.message).toBe(longMessage);
    });

    it('should handle special characters in the message', () => {
        const specialMessage = '!@#$%^&*()_+|}{":?><';
        const err = new error(specialMessage);
        expect(err.message).toBe(specialMessage);
    });

    it('should have a stack trace', () => {
        const err = new error('Test error message');
        expect(err.stack).toBeDefined();
    });

    it('should have the correct stack trace', () => {
        const err = new error('Test error message');
        expect(err.stack).toContain('error');
    });

    it('should be able to be thrown and caught', () => {
        const message = 'Catch this error';
        try {
            throw new error(message);
        } catch (err) {
            expect(err instanceof error).toBe(true);
            expect(err.message).toBe(message);
        }
    });

    it('should be able to be used with Promise rejection', async () => {
        const message = 'Promise rejection error';
        try {
            await Promise.reject(new error(message));
        } catch (err) {
            expect(err instanceof error).toBe(true);
            expect(err.message).toBe(message);
        }
    });
});

describe('type_error class', () => {

    it('should create an instance of Error', () => {
        const err = new type_error('Test type error message');
        expect(err instanceof Error).toBe(true);
    });

    it('should create an instance of custom type_error class', () => {
        const err = new type_error('Test type error message');
        expect(err instanceof type_error).toBe(true);
    });

    it('should set the name property to "type_error"', () => {
        const err = new type_error('Test type error message');
        expect(err.name).toBe('type_error');
    });

    it('should set the message property correctly', () => {
        const message = 'Test type error message';
        const err = new type_error(message);
        expect(err.message).toBe(message);
    });

    it('should return "error" as the type', () => {
        const err = new type_error('Test type error message');
        expect(err.kind).toBe('error');
    });

    it('should retain stack trace information', () => {
        const err = new type_error('Test type error message');
        expect(err.stack).toContain('Test type error message');
    });

    it('should handle an empty message', () => {
        const err = new type_error('');
        expect(err.message).toBe('');
    });

    it('should handle a very long message', () => {
        const longMessage = 'a'.repeat(1000);
        const err = new type_error(longMessage);
        expect(err.message).toBe(longMessage);
    });

    it('should handle special characters in the message', () => {
        const specialMessage = '!@#$%^&*()_+|}{":?><';
        const err = new type_error(specialMessage);
        expect(err.message).toBe(specialMessage);
    });

    it('should have a stack trace', () => {
        const err = new type_error('Test type error message');
        expect(err.stack).toBeDefined();
    });

    it('should have the correct stack trace', () => {
        const err = new type_error('Test type error message');
        expect(err.stack).toContain('type_error');
    });

    it('should be able to be thrown and caught', () => {
        const message = 'Catch this type error';
        try {
            throw new type_error(message);
        } catch (err) {
            expect(err instanceof type_error).toBe(true);
            expect(err.message).toBe(message);
        }
    });

    it('should be able to be used with Promise rejection', async () => {
        const message = 'Promise rejection type error';
        try {
            await Promise.reject(new type_error(message));
        } catch (err) {
            expect(err instanceof type_error).toBe(true);
            expect(err.message).toBe(message);
        }
    });
});

describe('range_error class', () => {

    it('should create an instance of RangeError', () => {
        const err = new range_error('Test range error message');
        expect(err instanceof RangeError).toBe(true);
    });

    it('should create an instance of custom range_error class', () => {
        const err = new range_error('Test range error message');
        expect(err instanceof range_error).toBe(true);
    });

    it('should set the name property to "range_error"', () => {
        const err = new range_error('Test range error message');
        expect(err.name).toBe('range_error');
    });

    it('should set the message property correctly', () => {
        const message = 'Test range error message';
        const err = new range_error(message);
        expect(err.message).toBe(message);
    });

    it('should return "error" as the type', () => {
        const err = new range_error('Test range error message');
        expect(err.kind).toBe('error');
    });

    it('should retain stack trace information', () => {
        const err = new range_error('Test range error message');
        expect(err.stack).toContain('Test range error message');
    });

    it('should handle an empty message', () => {
        const err = new range_error('');
        expect(err.message).toBe('');
    });

    it('should handle a very long message', () => {
        const longMessage = 'a'.repeat(1000);
        const err = new range_error(longMessage);
        expect(err.message).toBe(longMessage);
    });

    it('should handle special characters in the message', () => {
        const specialMessage = '!@#$%^&*()_+|}{":?><';
        const err = new range_error(specialMessage);
        expect(err.message).toBe(specialMessage);
    });

    it('should have a stack trace', () => {
        const err = new range_error('Test range error message');
        expect(err.stack).toBeDefined();
    });

    it('should have the correct stack trace', () => {
        const err = new range_error('Test range error message');
        expect(err.stack).toContain('range_error');
    });

    it('should be able to be thrown and caught', () => {
        const message = 'Catch this range error';
        try {
            throw new range_error(message);
        } catch (err) {
            expect(err instanceof range_error).toBe(true);
            expect(err.message).toBe(message);
        }
    });

    it('should be able to be used with Promise rejection', async () => {
        const message = 'Promise rejection range error';
        try {
            await Promise.reject(new range_error(message));
        } catch (err) {
            expect(err instanceof range_error).toBe(true);
            expect(err.message).toBe(message);
        }
    });
});