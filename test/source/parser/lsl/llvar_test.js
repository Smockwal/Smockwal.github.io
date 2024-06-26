import { flag } from "../../../../../lib/global.js";
import { llvar } from "../../../../../lib/source/parser/lsl/llvar.js";




describe(`llvar`, () => {
    let mock_token;

    beforeEach(() => {
        mock_token = { kind: `token`, prev: { str: '' } };
    });

    it('should correctly identify its kind', () => {
        const instance = new llvar(mock_token);
        expect(instance.kind).toBe('llvar');
    });

    it('should return the correct type based on previous token', () => {
        mock_token.prev.str = 'integer';
        const instance = new llvar(mock_token);
        expect(instance.type).toBe('integer');
    });

    it('should return the correct default value for each type', () => {
        const types = {
            integer: '0',
            float: '0.0',
            string: '""',
            key: '""',
            vector: '<0,0,0>',
            quaternion: '<0,0,0,1>',
            rotation: '<0,0,0,1>',
            list: '[]'
        };

        for (let type in types) {
            mock_token.prev.str = type;
            const instance = new llvar(mock_token);
            expect(instance.default()).toBe(types[type]);
        }
    });

    it('should determine if it can be used as another type', () => {
        const testCases = [
            { from: 'integer', to: 'float', result: true },
            { from: 'float', to: 'integer', result: false },
            { from: 'key', to: 'string', result: true },
            { from: 'string', to: 'key', result: true },
            { from: 'rotation', to: 'quaternion', result: true },
            { from: 'quaternion', to: 'rotation', result: true },
            { from: 'vector', to: 'vector', result: true },
            { from: 'list', to: 'list', result: true },
            { from: 'string', to: 'vector', result: false }
        ];

        testCases.forEach(({ from, to, result }) => {
            mock_token.prev.str = from;
            const instance = new llvar(mock_token);
            expect(instance.can_be_use_as(to)).toBe(result);
        });
    });

    it('should return false for unknown types in default method', () => {
        mock_token.prev.str = 'unknownType';
        const instance = new llvar(mock_token);
        expect(instance.default()).toBe('unknown');
    });

    const make_tokens_mok = arr => {
        const toks = { kind: `tokens` };
        for (const entry of arr) {
            const tok = {};
            if (!toks.front) {
                toks.front = entry;
                toks.back = entry;
            } else {
                toks.back.next = entry;
                entry.prev = toks.back;
                toks.back = entry;
            }
        }
        return toks;
    };

    it(`constructor_00`, async () => {
        const toks0 = make_tokens_mok([
            { kind: `token`, str: `integer`, flag: flag.NAME_FLAG, scope: `gl` },
            { kind: `token`, str: `a`, flag: flag.NAME_FLAG, scope: `gl` },
            { kind: `token`, str: `;`, flag: flag.SYMBOL_FLAG, scope: `gl` },
        ]);

        const var0 = new llvar(toks0.front.next);
        expect(var0.name).toBe(`a`);
        expect(var0.type).toBe(`integer`);
        expect(var0.scope).toBe(`gl`);
    });
});

