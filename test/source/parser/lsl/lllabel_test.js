import { lllabel } from "../../../../../lib/source/parser/lsl/lllabel.js";

describe('lllabel class', () => {
    let instance;

    it('should have a scope property that returns the correct scope', () => {
        instance = new lllabel({ kind: `token`, scope: 'gl/fn_abc/example' });
        expect(instance.scope).toEqual('gl/fn_abc');

        instance = new lllabel({ kind: `token`, scope: 'gl/st_abc/example' });
        expect(instance.scope).toEqual('gl/st_abc/example');
    });

    it('should update the scope property when setting a new value', () => {
        instance = new lllabel({ kind: `token`, scope: 'gl/fn_abc/example' });
        instance.scope = 'gl/state/example';
        expect(instance.scope).toEqual('gl/state/example');
    });

    it('should return an empty string when the scope does not match the expected format', () => {
        const invalidLllabelInstance = new lllabel({ kind: `token`, scope: 'invalid/scope' });
        expect(invalidLllabelInstance.scope).toEqual('');
    });
});
