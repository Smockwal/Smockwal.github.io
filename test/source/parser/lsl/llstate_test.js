import { llstate } from "../../../../../lib/source/parser/lsl/llstate.js";

describe('llstate class', () => {
    let instance;

    beforeEach(() => {
        const mockToken = { kind: `token`, str: `state_a` };
        instance = new llstate(mockToken);
    });

    it('should have a kind property that returns "llstate"', () => {
        expect(instance.kind).toEqual('llstate');
    });

    it('should have a scope property that returns "gl"', () => {
        expect(instance.scope).toEqual('gl');
    });

    it('should have an events property that returns the private #events array', () => {
        const events = ['event1', 'event2'];
        instance.events.push(...events);
        expect(instance.events).toEqual(events);
    });

    it('should have a has_event method that checks if an event exists in the #events array', () => {
        const events = ['event1', 'event2'];
        instance.events.push(...events);
        expect(instance.has_event('event1')).toBeTruthy();
        expect(instance.has_event('event3')).toBeFalsy();
    });

    it('should have an add_event method that adds an event to the #events array', () => {
        const events = ['event1', 'event2'];
        instance.events.push(...events);
        instance.add_event('event3');
        expect(instance.events).toEqual(['event1', 'event2', 'event3']);
    });
});
