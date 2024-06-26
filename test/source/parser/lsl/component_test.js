import { type_error } from "../../../../../lib/error.js";
import { component } from "../../../../../lib/source/parser/lsl/component.js";


describe('component class', () => {
    let comp;
    let tok;

    beforeEach(() => {
        tok = { kind:`token`, str: 'testToken', scope: 'testScope' };
        comp = new component(tok);
    });

    it('should create an instance of Component', () => {
        expect(comp).toBeTruthy();
    });

    describe('constructor', () => {
        it('should throw an error if the provided value is not a token', () => {
            expect(() => new component('not a token')).toThrowError(type_error);
        });

        it('should set the token property', () => {
            expect(comp.tok).toEqual(tok);
        });
    });

    describe('getters', () => {
        describe('tok', () => {
            it('should return the token', () => {
                expect(comp.tok).toEqual(tok);
            });
        });

        describe('name', () => {
            it('should return the token string', () => {
                expect(comp.name).toEqual(tok.str);
            });
        });

        describe('scope', () => {
            it('should return the token scope', () => {
                expect(comp.scope).toEqual(tok.scope);
            });
        });
    });
});