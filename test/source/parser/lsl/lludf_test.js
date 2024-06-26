import { flag } from "../../../../../lib/global.js";
import { lludf } from "../../../../../lib/source/parser/lsl/lludf.js";



describe(`user_func`, () => {

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

    let lludfInstance, mockToken;

    beforeEach(() => {
        mockToken = { kind: `token`, str: `float`, flag: flag.NAME_FLAG };
        lludfInstance = new lludf(mockToken);
    });

    it('should have a constructor that sets the type based on the function type_tok', () => {
        const toks = make_tokens_mok([
            { kind: `token`, str: `float`, op:``, flag: flag.NAME_FLAG },
            { kind: `token`, str: `f`, op:`f`, flag: flag.NAME_FLAG },
            { kind: `token`, str: `(`, op:`(`, flag: flag.SYMBOL_FLAG },
            { kind: `token`, str: `)`, op:`)`, flag: flag.SYMBOL_FLAG },
            { kind: `token`, str: `{`, op:`{`, flag: flag.SYMBOL_FLAG },
            { kind: `token`, str: `}`, op:`}`, flag: flag.SYMBOL_FLAG },
        ]);
        //spyOn(window, 'func').and.returnValue(mockFunction);

        const lludfInstance = new lludf(toks.front.next);
        expect(lludfInstance.type).toEqual('float');
    });

    it('should have a type property that defaults to "void"', () => {
        const lludfInstanceWithoutType = new lludf({kind: `token`});
        expect(lludfInstanceWithoutType.type).toEqual('void');
    });

    it(`constructor_00`, async () => {
        const toks = make_tokens_mok([
            { kind: `token`, str: `float`, op:``, flag: flag.NAME_FLAG },
            { kind: `token`, str: `f`, op:`f`, flag: flag.NAME_FLAG, scope: `gl` },
            { kind: `token`, str: `(`, op:`(`, flag: flag.SYMBOL_FLAG },
            { kind: `token`, str: `)`, op:`)`, flag: flag.SYMBOL_FLAG },
            { kind: `token`, str: `{`, op:`{`, flag: flag.SYMBOL_FLAG },
            { kind: `token`, str: `return`, op:``, flag: flag.NAME_FLAG },
            { kind: `token`, str: `1.0`, op:``, flag: flag.NUMBER_FLAG },
            { kind: `token`, str: `;`, op:`;`, flag: flag.SYMBOL_FLAG },
            { kind: `token`, str: `}`, op:`}`, flag: flag.SYMBOL_FLAG },
        ]);

        const func0 = new lludf(toks.front.next);
        expect(func0.name).toBe(`f`);
        expect(func0.type).toBe(`float`);
        expect(func0.scope).toBe(`gl`);
    });

});