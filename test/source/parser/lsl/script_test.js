import { flag } from "../../../../lib/global.js";
import { message } from "../../../../lib/source/message.js";
import { llspec, load_spec } from "../../../../lib/source/parser/lsl/llspec.js";
import { CODE_ENTRY, next_exp, prev_exp, script } from "../../../../lib/source/parser/lsl/script.js";
import { SCOPE_FUNC, SCOPE_GLOBAL, SCOPE_STATE } from "../../../../lib/source/source.js";
import { tokens } from "../../../../lib/source/tokens.js";
import { convert_to_lsl } from "../../../../lib/source/parser/lsl/translate.js";

describe('script', () => {
    let myScript;

    const make_tokens_mok = arr => {
        const toks = {
            kind: `tokens`,
            empty: () => false,
            end: tok => tok === undefined,
            next: tok => tok.next
        };

        for (const word of arr) {
            const tok = {}, entry = { kind: `token`, str: word, op: word.length === 1 ? word[0] : `` };
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

    const parse_snippet = async (toks, lvl = 0) => {
        await convert_to_lsl(toks);
        if (lvl >= 0) myScript.flag_tokens(toks);
        if (lvl >= 1) {
            myScript._scp_deep = 0;
            myScript.parse_scope(toks, [SCOPE_GLOBAL]);
        }
        if (lvl >= 2) myScript.collect_name(toks);
        return toks;
    };

    beforeAll(async () => {
        await load_spec(`../../../../lib/source/parser/lsl/lsl_data.json`);
    });

    beforeEach(async () => {
        myScript = new script();
        message.clear();
    });

    describe('code_entry', () => {
        it('should return undefined if no code entry is found', () => {
            expect(myScript.code_entry).toBeUndefined();
        });

        it('should return the correct token if a code entry is found', () => {
            const tok = { kind: `token`, str: CODE_ENTRY, scope: `gl/fn.000` };
            myScript.add_state(tok);
            expect(myScript.code_entry.str).toBe(tok.str);
        });
    });

    describe('has_var', () => {
        it('should return false if variable is not present', () => {
            const tok = { kind: `token`, str: CODE_ENTRY, scope: `gl/fn.000` };
            expect(myScript.has_var(tok)).toBe(false);
        });

        it('should return true if variable is present', () => {
            const tok = { kind: `token`, str: CODE_ENTRY, scope: `gl/fn.000` };
            myScript.add_var(tok);
            expect(myScript.has_var(tok)).toBe(true);
        });
    });

    describe('get_var', () => {
        it('should return undefined if variable is not present', () => {
            const tok = { kind: `token`, str: `var`, scope: `gl` };
            expect(myScript.get_var(tok)).toBeUndefined();
        });

        it('should return the correct variable if it is present', () => {
            const tok = { kind: `token`, str: `var`, scope: `gl` };
            myScript.add_var(tok);
            expect(myScript.get_var(tok).tok.str).toBe(tok.str);
        });
    });

    describe('add_var', () => {
        it('should add a variable to the script', () => {
            const tok = { kind: `token`, str: `var`, scope: `gl` };
            myScript.add_var(tok);
            expect(myScript.has_var(tok)).toBe(true);
        });
    });

    describe('has_func', () => {
        it('should return false if function is not present', () => {
            const tok = { kind: `token`, str: `abs`, scope: `gl` };
            expect(myScript.has_func(tok)).toBe(false);
        });

        it('should return true if function is present', () => {
            const tok = { kind: `token`, str: `abs`, scope: `gl` };
            myScript.add_func(tok);
            expect(myScript.has_func(tok)).toBe(true);
        });
    });

    describe('get_func', () => {
        it('should return undefined if function is not present', () => {
            const tok = { kind: `token`, str: `abs`, scope: `gl` };
            expect(myScript.get_func(tok)).toBeUndefined();
        });

        it('should return the correct function if it is present', () => {
            const tok = { kind: `token`, str: `abs`, scope: `gl` };
            myScript.add_func(tok);
            expect(myScript.get_func(tok).tok.str).toBe(tok.str);
        });
    });

    describe('add_func', () => {
        it('should add a function to the script', () => {
            const tok = { kind: `token`, str: `abs`, scope: `gl` };
            myScript.add_func(tok);
            expect(myScript.has_func(tok)).toBe(true);
        });
    });

    describe('has_label', () => {
        it('should return false if label is not present', () => {
            const tok = { kind: `token`, str: `abs`, scope: `${SCOPE_GLOBAL}/${SCOPE_FUNC}.something` };
            expect(myScript.has_label(tok)).toBe(false);
        });

        it('should return true if label is present', () => {
            const tok = { kind: `token`, str: `sample`, scope: `gl/fn.000` };
            myScript.add_label(tok);
            expect(myScript.has_label(tok)).toBe(true);
        });
    });

    describe('get_label', () => {
        it('should return undefined if label is not present', () => {
            const tok = { kind: `token`, str: `abs`, scope: `${SCOPE_GLOBAL}/${SCOPE_FUNC}.something` };
            expect(myScript.get_label(tok)).toBeUndefined();
        });

        it('should return the correct label if it is present', () => {
            const tok = { kind: `token`, str: `sample`, scope: `gl/fn.000` };

            myScript.add_label(tok);
            expect(myScript.get_label(tok).tok).toEqual(tok);
        });
    });

    describe('add_label', () => {
        it('should add a label to the script', () => {
            const tok = { kind: `token`, str: `sample`, scope: `${SCOPE_GLOBAL}/${SCOPE_FUNC}.something` };
            myScript.add_label(tok);
            expect(myScript.has_label(tok)).toBe(true);
        });

        it('should not add a label outside of function or event', () => {
            spyOn(message, 'add'); // to spy on message.add calls

            const tok = { kind: `token`, str: `sample`, scope: `invalid/scope` };
            myScript.add_label(tok);
            expect(message.add).toHaveBeenCalled();
            expect(myScript.has_label(tok)).toBe(false);
        });
    });

    describe('has_state', () => {
        it('should return false if state is not present', () => {
            const tok = { kind: `token`, str: `sample`, scope: `gl` };
            expect(myScript.has_state(tok)).toBe(false);
        });

        it('should return true if state is present', () => {
            const tok = { kind: `token`, str: `sample`, scope: `gl` };
            myScript.add_state(tok);
            expect(myScript.has_state(tok)).toBe(true);
        });
    });

    describe('get_state', () => {
        it('should return undefined if state is not present', () => {
            const tok = { kind: `token`, str: `sample`, scope: `gl` };
            expect(myScript.get_state(tok)).toBeUndefined();
        });

        it('should return the correct state if it is present', () => {
            const tok = { kind: `token`, str: `sample`, scope: `gl` };
            myScript.add_state(tok);
            expect(myScript.get_state(tok).tok.str).toEqual(tok.str);
        });
    });

    describe('add_state', () => {
        it('should add a state to the script', () => {
            const tok = { kind: `token`, str: `sample`, scope: `gl` };
            myScript.add_state(tok);
            expect(myScript.has_state(tok)).toBe(true);
        });
    });

    describe('has_event', () => {
        it('should return false if event is not present in state', () => {
            const state = { kind: `token`, str: `sample`, scope: `gl` };
            const event = { kind: `token`, str: `ev`, scope: `${SCOPE_GLOBAL}/${SCOPE_STATE}.sample` };
            myScript.add_state(state);
            expect(myScript.has_event(state, event)).toBe(false);
        });

        it('should return true if event is present in state', () => {
            const state = { kind: `token`, str: `sample`, scope: `gl` };
            const event = { kind: `token`, str: `ev`, scope: `${SCOPE_GLOBAL}/${SCOPE_STATE}.sample` };
            myScript.add_state(state);
            myScript.add_event(state, event);
            expect(myScript.has_event(state, event)).toBe(true);
        });
    });

    describe('get_state_events', () => {
        it('should return an empty array if state has no events', () => {
            const state = { kind: `token`, str: `sample`, scope: `gl` };
            myScript.add_state(state);
            expect(myScript.get_state_events(state)).toEqual([]);
        });

        it('should return the correct events if state has events', () => {
            const state = { kind: `token`, str: `sample`, scope: `gl` };
            const event = { kind: `token`, str: `ev`, scope: `${SCOPE_GLOBAL}/${SCOPE_STATE}.sample` };
            myScript.add_state(state);
            myScript.add_event(state, event);
            expect(myScript.get_state_events(state)).toContain(event.str);
        });
    });

    describe('add_event', () => {
        it('should add an event to the state', () => {
            const state = { kind: `token`, str: `sample`, scope: `gl` };
            const event = { kind: `token`, str: `ev`, scope: `${SCOPE_GLOBAL}/${SCOPE_STATE}.sample` };

            myScript.add_state(state);
            myScript.add_event(state, event);
            expect(myScript.has_event(state, event)).toBe(true);
        });
    });

    describe('know_name', () => {
        it('should return false if name is not known', () => {
            expect(myScript.know_name('unknown')).toBe(false);
        });

        it('should return true if name is known', () => {
            const tok = { kind: `token`, str: `sample`, scope: `gl` };
            myScript.add_var(tok);
            expect(myScript.know_name(tok.str)).toBe(true);
        });
    });

    describe('flag_tokens', () => {
        it('should throw an error if tokens are empty', () => {
            expect(() => myScript.flag_tokens(null)).toThrowError('flag_tokens: called with empty or invalid tokens.');
        });

        it('should flag tokens correctly', async () => {
            const toks = new tokens(`sample`, `main.lsl`);
            const flagged = await parse_snippet(toks, 0);
            expect(flagged).toEqual(toks);
        });

        xit(`flag_tokens_01`, async () => {
            const toks0 = await parse_snippet(`rotation a;`, 1);
            expect(toks0.stringify()).toBe(`quaternion a ;`);
        });

        it(`flag_tokens_02`, async () => {
            for (const entry of llspec.type) {
                const toks = new tokens(`${entry} a;`, `main.lsl`);
                await parse_snippet(toks, 0);
                expect(toks.front.flag & flag.TYPE_FLAG).toBe(flag.TYPE_FLAG);
            }
        });

        it(`flag_tokens_03`, async () => {
            for (const entry of llspec.type) {
                const toks = new tokens(`(${entry})a;`, `main.lsl`);
                await parse_snippet(toks, 0);
                expect(toks.front.flag & flag.CASTING_FLAG).toBe(flag.CASTING_FLAG);
            }
        });

        it(`flag_tokens_04`, async () => {
            for (const entry of llspec.controls) {
                const toks = new tokens(entry, `main.lsl`);
                await parse_snippet(toks, 0);
                expect(toks.front.flag & flag.CONTROL_FLAG).toBe(flag.CONTROL_FLAG);
            }
        });

        it(`flag_tokens_05`, async () => {
            const toks = new tokens(`funct(a);`, `main.lsl`);
            await parse_snippet(toks, 0);
            expect(toks.front.flag & flag.USER_FUNC_FLAG).toBe(flag.USER_FUNC_FLAG);
        });

        it(`flag_tokens_06`, async () => {
            const toks = new tokens(`llAbs(a);`, `main.lsl`);
            await parse_snippet(toks, 0);
            expect(toks.front.flag & flag.DEF_FUNC_FLAG).toBe(flag.DEF_FUNC_FLAG);
        });

        it(`flag_tokens_07`, async () => {
            const toks = new tokens(`default{touch(integer a){;}}`, `main.lsl`);
            await parse_snippet(toks, 0);
            expect(toks.front.next.next.flag & flag.EVENT_FLAG).toBe(flag.EVENT_FLAG);
        });

        it(`flag_tokens_08`, async () => {
            let operator_list = [
                `!`, `~`, `++`, `--`, `*`, `/`, `%`, `-`, `+`, `<<`, `>>`, `<`, `<=`, `>`, `>=`,
                `==`, `!=`, `&`, `^`, `|`, `||`, `&&`, `=`, `+=`, `-=`, `*=`, `/=`, `%=`, `@`
            ];

            for (const entry of operator_list) {
                const toks = new tokens(entry, `main.lsl`);
                await parse_snippet(toks, 0);
                expect(toks.front.flag & flag.OPERATOR_FLAG).toBe(flag.OPERATOR_FLAG);
            }
        });

        it(`flag_tokens_09`, async () => {
            const toks = new tokens(`<1,1,1>`, `main.lsl`);
            await parse_snippet(toks, 0);
            expect(toks.front.flag & (flag.VECTOR_OP_FLAG | flag.DEL_FLAG | flag.SYMBOL_FLAG)).toBe((flag.VECTOR_OP_FLAG | flag.DEL_FLAG | flag.SYMBOL_FLAG));
            expect(toks.back.flag & (flag.VECTOR_CL_FLAG | flag.DEL_FLAG | flag.SYMBOL_FLAG)).toBe((flag.VECTOR_CL_FLAG | flag.DEL_FLAG | flag.SYMBOL_FLAG));
        });

        it(`flag_tokens_10`, async () => {
            const toks = new tokens(`<1,1,1,1>`, `main.lsl`);
            await parse_snippet(toks, 0);
            expect(toks.front.flag & (flag.QUAT_OP_FLAG | flag.DEL_FLAG | flag.SYMBOL_FLAG)).toBe((flag.QUAT_OP_FLAG | flag.DEL_FLAG | flag.SYMBOL_FLAG));
            expect(toks.back.flag & (flag.QUAT_CL_FLAG | flag.DEL_FLAG | flag.SYMBOL_FLAG)).toBe((flag.QUAT_CL_FLAG | flag.DEL_FLAG | flag.SYMBOL_FLAG));
        });

        it(`flag_tokens_11`, async () => {
            const toks = new tokens(`{a;}`, `main.lsl`);
            await parse_snippet(toks, 0);
            expect(toks.front.flag & (flag.DEL_FLAG | flag.SYMBOL_FLAG)).toBe((flag.DEL_FLAG | flag.SYMBOL_FLAG));
            expect(toks.back.flag & (flag.DEL_FLAG | flag.SYMBOL_FLAG)).toBe((flag.DEL_FLAG | flag.SYMBOL_FLAG));
        });

        it(`flag_tokens_12`, async () => {
            const toks = new tokens(`[1,2,3]`, `main.lsl`);
            await parse_snippet(toks, 0);
            expect(toks.front.flag & (flag.LIST_OP_FLAG | flag.DEL_FLAG | flag.SYMBOL_FLAG)).toBe((flag.LIST_OP_FLAG | flag.DEL_FLAG | flag.SYMBOL_FLAG));
            expect(toks.back.flag & (flag.LIST_CL_FLAG | flag.DEL_FLAG | flag.SYMBOL_FLAG)).toBe((flag.LIST_CL_FLAG | flag.DEL_FLAG | flag.SYMBOL_FLAG));
        });

        it(`flag_tokens_13`, async () => {
            const toks = new tokens(`{1,2,3}`, `main.lsl`);
            await parse_snippet(toks, 0);
            expect(toks.front.flag & (flag.DEL_FLAG | flag.SYMBOL_FLAG)).toBe((flag.DEL_FLAG | flag.SYMBOL_FLAG));
            expect(toks.back.flag & (flag.DEL_FLAG | flag.SYMBOL_FLAG)).toBe((flag.DEL_FLAG | flag.SYMBOL_FLAG));
        });

        it(`flag_tokens_14`, async () => {
            const toks = new tokens(`(1,2,3)`, `main.lsl`);
            await parse_snippet(toks, 0);
            expect(toks.front.flag & (flag.DEL_FLAG | flag.SYMBOL_FLAG)).toBe((flag.DEL_FLAG | flag.SYMBOL_FLAG));
            expect(toks.back.flag & (flag.DEL_FLAG | flag.SYMBOL_FLAG)).toBe((flag.DEL_FLAG | flag.SYMBOL_FLAG));
        });

        it(`flag_tokens_15`, async () => {
            const toks = new tokens(`func(1,2,3);`, `main.lsl`);
            await parse_snippet(toks, 0);
            expect(toks.back.flag & (flag.EOL_FLAG | flag.SYMBOL_FLAG)).toBe((flag.EOL_FLAG | flag.SYMBOL_FLAG));
        });

        it(`flag_tokens_16`, async () => {
            const toks = new tokens(`integer a = 1;`, `main.lsl`);
            await parse_snippet(toks, 0);
            expect(toks.find_str(`a`).flag & (flag.NAME_FLAG | flag.VARIABLE_FLAG)).toBe((flag.NAME_FLAG | flag.VARIABLE_FLAG));
        });

        it(`flag_tokens_17`, async () => {
            const toks = new tokens(`state a{}`, `main.lsl`);
            await parse_snippet(toks, 0);
            expect(toks.find_str(`a`).flag & (flag.NAME_FLAG | flag.STATE_NAME_FLAG)).toBe((flag.NAME_FLAG | flag.STATE_NAME_FLAG));
        });

        it(`flag_tokens_18`, async () => {
            const toks = new tokens(`default{}`, `main.lsl`);
            await parse_snippet(toks, 0);
            expect(toks.front.flag & (flag.NAME_FLAG | flag.STATE_NAME_FLAG)).toBe((flag.NAME_FLAG | flag.STATE_NAME_FLAG));
        });

        it(`flag_tokens_19`, async () => {
            const toks = new tokens(`f(){f=0;}`, `main.lsl`);
            await parse_snippet(toks, 0);
            expect(toks.front.flag).toBe((flag.NAME_FLAG | flag.USER_FUNC_FLAG));
        });

        it(`flag_tokens_20`, async () => {
            const toks = new tokens(`vector x(){return <1,1,1>;}`, `main.lsl`);
            await parse_snippet(toks, 0);
            expect(toks.find_str(`<`).flag).toBe((flag.SYMBOL_FLAG | flag.VECTOR_OP_FLAG | flag.DEL_FLAG));
            expect(toks.find_str(`>`).flag).toBe((flag.SYMBOL_FLAG | flag.VECTOR_CL_FLAG | flag.DEL_FLAG));
        });

        it(`flag_tokens_21`, async () => {
            const toks = new tokens(`vector x; x = <-x.y, x.z, x.x>;`, `main.lsl`);
            await parse_snippet(toks, 0);
            expect(toks.find_str(`<`).flag).toBe((flag.SYMBOL_FLAG | flag.VECTOR_OP_FLAG | flag.DEL_FLAG));
            expect(toks.find_str(`>`).flag).toBe((flag.SYMBOL_FLAG | flag.VECTOR_CL_FLAG | flag.DEL_FLAG));
        });

        it(`flag_tokens_22`, async () => {
            const toks = new tokens(`integer a;integer b;integer c;d(){if((a && !b) || c){;}}`, `main.lsl`);
            await parse_snippet(toks, 0);
            expect(toks.find_str(`!`).flag).toBe(flag.SYMBOL_FLAG | flag.OPERATOR_FLAG);
        });

        xit(`flag_tokens_23`, async () => {
            const toks = new tokens(`touch(){;}default{touch(integer a){touch();}}`, `main.lsl`);
            await parse_snippet(toks, 0);
            expect(toks.find_str(`touch`).flag & flag.USER_FUNC_FLAG).toBe(flag.USER_FUNC_FLAG);
            expect(toks.find_str_r(`touch`).flag & flag.USER_FUNC_FLAG).toBe(flag.USER_FUNC_FLAG);
        });
    });

    describe('parse_scope', () => {
        it('should throw an error if tokens are empty', () => {
            expect(() => myScript.parse_scope(null, [])).toThrowError('parse_scope: called with empty or invalid tokens.');
        });

        it('should parse scope correctly', async () => {
            const toks = new tokens(`integer a;`, `main.lsl`);
            const parsedTokens = myScript.parse_scope(toks, [SCOPE_GLOBAL]);
            expect(parsedTokens).toBeDefined();
        });

        it(`scope_00`, async () => {
            const toks = new tokens(`default{on_rez(integer x){integer a;}}`, `main.lsl`);
            await parse_snippet(toks, 1);
            expect(message.length()).toBe(0);

            const scopes = [
                `gl`,
                `gl/st.default`,
                `gl/st.default`,
                `gl/st.default/on_rez`,
                `gl/st.default/on_rez`,
                `gl/st.default/on_rez`,
                `gl/st.default/on_rez`,
                `gl/st.default/on_rez`,
                `gl/st.default/on_rez`,
                `gl/st.default/on_rez`,
                `gl/st.default/on_rez`,
                `gl/st.default/on_rez`,
                `gl/st.default`
            ];
            for (let tok = toks.front, i = 0; tok; tok = tok.next, ++i) {
                expect(tok.scope).toBe(scopes[i]);
            }
        });

        it(`scope_01`, async () => {
            const toks = new tokens(`default{touch(integer k){integer a;}}`, `main.lsl`);
            await parse_snippet(toks, 1);
            expect(message.length()).toBe(0);

            const scopes = [
                `gl`,
                `gl/st.default`,
                `gl/st.default`,
                `gl/st.default/touch`,
                `gl/st.default/touch`,
                `gl/st.default/touch`,
                `gl/st.default/touch`,
                `gl/st.default/touch`,
                `gl/st.default/touch`,
                `gl/st.default/touch`,
                `gl/st.default/touch`,
                `gl/st.default/touch`,
                `gl/st.default`
            ];
            for (let tok = toks.front, i = 0; tok; tok = tok.next, ++i) {
                expect(tok.scope).toBe(scopes[i]);
            }
        });

        it(`scope_02`, async () => {
            const toks = new tokens(`f(){;}default{timer(){f();}}`, `main.lsl`);
            await parse_snippet(toks, 1);
            expect(message.length()).toBe(0);

            const scopes = [
                `gl`,
                `gl/fn.f`,
                `gl/fn.f`,
                `gl/fn.f`,
                `gl/fn.f`,
                `gl/fn.f`,
                `gl`,
                `gl/st.default`,
                `gl/st.default`,
                `gl/st.default/timer`,
                `gl/st.default/timer`,
                `gl/st.default/timer`,
                `gl/st.default/timer`,
                `gl/st.default/timer/fn.f`,
                `gl/st.default/timer/fn.f`,
                `gl/st.default/timer`,
                `gl/st.default/timer`,
                `gl/st.default`
            ];
            for (let tok = toks.front, i = 0; tok; tok = tok.next, ++i) {
                expect(tok.scope).toBe(scopes[i]);
            }
        });

        it(`scope_03`, async () => {
            const toks = new tokens(`list a;f(){a;}b(){f();}default{timer(){b();}}`, `main.lsl`);
            await parse_snippet(toks, 1);
            expect(message.length()).toBe(0);

            const scopes = [
                `gl`,
                `gl`,
                `gl`,
                `gl`,
                `gl/fn.f`,
                `gl/fn.f`,
                `gl/fn.f`,
                `gl/fn.f`,
                `gl/fn.f`,
                `gl/fn.f`,
                `gl`,
                `gl/fn.b`,
                `gl/fn.b`,
                `gl/fn.b`,
                `gl/fn.b`,
                `gl/fn.b/fn.f`,
                `gl/fn.b/fn.f`,
                `gl/fn.b`,
                `gl/fn.b`,
                `gl`,
                `gl/st.default`,
                `gl/st.default`,
                `gl/st.default/timer`,
                `gl/st.default/timer`,
                `gl/st.default/timer`,
                `gl/st.default/timer`,
                `gl/st.default/timer/fn.b`,
                `gl/st.default/timer/fn.b`,
                `gl/st.default/timer`,
                `gl/st.default/timer`,
                `gl/st.default`
            ];
            for (let tok = toks.front, i = 0; tok; tok = tok.next, ++i) {
                expect(tok.scope).toBe(scopes[i]);
            }
        });

        it(`scope_04`, async () => {
            const toks = new tokens(`b(){;}default{timer(){b()}}`, `main.lsl`);
            await parse_snippet(toks, 1);
            expect(message.length()).toBe(0);

            const scopes = [
                `gl`,
                `gl/fn.b`,
                `gl/fn.b`,
                `gl/fn.b`,
                `gl/fn.b`,
                `gl/fn.b`,
                `gl`,
                `gl/st.default`,
                `gl/st.default`,
                `gl/st.default/timer`,
                `gl/st.default/timer`,
                `gl/st.default/timer`,
                `gl/st.default/timer`,
                `gl/st.default/timer/fn.b`,
                `gl/st.default/timer/fn.b`,
                `gl/st.default/timer`,
                `gl/st.default`
            ];
            for (let tok = toks.front, i = 0; tok; tok = tok.next, ++i) {
                expect(tok.scope).toBe(scopes[i]);
            }
        });

        it(`scope_05`, async () => {
            const toks = new tokens(`list a;default{timer(){a;}no_sensor(){a;}}`, `main.lsl`);
            await parse_snippet(toks, 1);
            expect(message.length()).toBe(0);

            const scopes = [
                `gl`,
                `gl`,
                `gl`,
                `gl`,
                `gl/st.default`,
                `gl/st.default`,
                `gl/st.default/timer`,
                `gl/st.default/timer`,
                `gl/st.default/timer`,
                `gl/st.default/timer`,
                `gl/st.default/timer`,
                `gl/st.default/timer`,
                `gl/st.default`,
                `gl/st.default/no_sensor`,
                `gl/st.default/no_sensor`,
                `gl/st.default/no_sensor`,
                `gl/st.default/no_sensor`,
                `gl/st.default/no_sensor`,
                `gl/st.default/no_sensor`,
                `gl/st.default`
            ];
            for (let tok = toks.front, i = 0; tok; tok = tok.next, ++i) {
                expect(tok.scope).toBe(scopes[i]);
            }
        });

        it(`scope_06`, async () => {
            const toks = new tokens(`list a;default{timer(){a;}}state b{timer(){a;}}`, `main.lsl`);
            await parse_snippet(toks, 1);
            expect(message.length()).toBe(0);

            const scopes = [
                `gl`,
                `gl`,
                `gl`,
                `gl`,
                `gl/st.default`,
                `gl/st.default`,
                `gl/st.default/timer`,
                `gl/st.default/timer`,
                `gl/st.default/timer`,
                `gl/st.default/timer`,
                `gl/st.default/timer`,
                `gl/st.default/timer`,
                `gl/st.default`,
                `gl`,
                `gl`,
                `gl/st.b`,
                `gl/st.b`,
                `gl/st.b/timer`,
                `gl/st.b/timer`,
                `gl/st.b/timer`,
                `gl/st.b/timer`,
                `gl/st.b/timer`,
                `gl/st.b/timer`,
                `gl/st.b`
            ];
            for (let tok = toks.front, i = 0; tok; tok = tok.next, ++i) {
                expect(tok.scope).toBe(scopes[i]);
            }
        });

        it(`scope_07`, async () => {
            const toks = new tokens(`default{timer(){list a;{list b;}}}`, `main.lsl`);
            await parse_snippet(toks, 1);
            expect(message.length()).toBe(0);

            const scopes = [
                `gl`,
                `gl/st.default`,
                `gl/st.default`,
                `gl/st.default/timer`,
                `gl/st.default/timer`,
                `gl/st.default/timer`,
                `gl/st.default/timer`,
                `gl/st.default/timer`,
                `gl/st.default/timer`,
                `gl/st.default/timer/an.1.3`,
                `gl/st.default/timer/an.1.3`,
                `gl/st.default/timer/an.1.3`,
                `gl/st.default/timer/an.1.3`,
                `gl/st.default/timer/an.1.3`,
                `gl/st.default/timer`,
                `gl/st.default`
            ];
            for (let tok = toks.front, i = 0; tok; tok = tok.next, ++i) {
                expect(tok.scope).toBe(scopes[i]);
            }
        });

        it(`scope_08`, async () => {
            const toks = new tokens(`list a;default{timer(){{a;{a;}a;{a;}}a;{a;}}}`, `main.lsl`);
            await parse_snippet(toks, 1);
            expect(message.length()).toBe(0);

            const scopes = [
                `gl`,
                `gl`,
                `gl`,
                `gl`,
                `gl/st.default`,
                `gl/st.default`,
                `gl/st.default/timer`,
                `gl/st.default/timer`,
                `gl/st.default/timer`,
                `gl/st.default/timer/an.1.3`,
                `gl/st.default/timer/an.1.3`,
                `gl/st.default/timer/an.1.3`,
                `gl/st.default/timer/an.1.3/an.1.4`,
                `gl/st.default/timer/an.1.3/an.1.4`,
                `gl/st.default/timer/an.1.3/an.1.4`,
                `gl/st.default/timer/an.1.3/an.1.4`,
                `gl/st.default/timer/an.1.3`,
                `gl/st.default/timer/an.1.3`,
                `gl/st.default/timer/an.1.3/an.2.4`,
                `gl/st.default/timer/an.1.3/an.2.4`,
                `gl/st.default/timer/an.1.3/an.2.4`,
                `gl/st.default/timer/an.1.3/an.2.4`,
                `gl/st.default/timer/an.1.3`,
                `gl/st.default/timer`,
                `gl/st.default/timer`,
                `gl/st.default/timer/an.2.3`,
                `gl/st.default/timer/an.2.3`,
                `gl/st.default/timer/an.2.3`,
                `gl/st.default/timer/an.2.3`,
                `gl/st.default/timer`,
                `gl/st.default`
            ];
            for (let tok = toks.front, i = 0; tok; tok = tok.next, ++i) {
                expect(tok.scope).toBe(scopes[i]);
            }
        });

        it(`scope_09`, async () => {
            const toks = new tokens(`
        list a;
        
        default{
            timer(){
                {
                    a;
                    {
                        a;
                    }
                    a;
                    {
                        a;
                    }
                }
                a;
                {
                    a;
                    {
                        a;
                    }
                    a;
                    {
                        a;
                    }
                }
            }
            no_sensor(){
                {
                    a;
                    {
                        a;
                    }
                    a;
                    {
                        a;
                    }
                }
                a;
                {
                    a;
                    {
                        a;
                    }
                    a;
                    {
                        a;
                    }
                }
            }
        }
        state b{
            timer(){
                {
                    a;
                    {
                        a;
                    }
                    a;
                    {
                        a;
                    }
                }
                a;
                {
                    a;
                    {
                        a;
                    }
                    a;
                    {
                        a;
                    }
                }
            }
            no_sensor(){
                {
                    a;
                    {
                        a;
                    }
                    a;
                    {
                        a;
                    }
                }
                a;
                {
                    a;
                    {
                        a;
                    }
                    a;
                    {
                        a;
                    }
                }
            }
        }`, `main.lsl`);
            await parse_snippet(toks, 1);

            const scopes = [
                `gl`,
                `gl`,
                `gl`,
                `gl`,
                `gl/st.default`,
                `gl/st.default`,
                `gl/st.default/timer`,
                `gl/st.default/timer`,
                `gl/st.default/timer`,
                `gl/st.default/timer/an.1.3`,
                `gl/st.default/timer/an.1.3`,
                `gl/st.default/timer/an.1.3`,
                `gl/st.default/timer/an.1.3/an.1.4`,
                `gl/st.default/timer/an.1.3/an.1.4`,
                `gl/st.default/timer/an.1.3/an.1.4`,
                `gl/st.default/timer/an.1.3/an.1.4`,
                `gl/st.default/timer/an.1.3`,
                `gl/st.default/timer/an.1.3`,
                `gl/st.default/timer/an.1.3/an.2.4`,
                `gl/st.default/timer/an.1.3/an.2.4`,
                `gl/st.default/timer/an.1.3/an.2.4`,
                `gl/st.default/timer/an.1.3/an.2.4`,
                `gl/st.default/timer/an.1.3`,
                `gl/st.default/timer`,
                `gl/st.default/timer`,
                `gl/st.default/timer/an.2.3`,
                `gl/st.default/timer/an.2.3`,
                `gl/st.default/timer/an.2.3`,
                `gl/st.default/timer/an.2.3/an.1.4`,
                `gl/st.default/timer/an.2.3/an.1.4`,
                `gl/st.default/timer/an.2.3/an.1.4`,
                `gl/st.default/timer/an.2.3/an.1.4`,
                `gl/st.default/timer/an.2.3`,
                `gl/st.default/timer/an.2.3`,
                `gl/st.default/timer/an.2.3/an.2.4`,
                `gl/st.default/timer/an.2.3/an.2.4`,
                `gl/st.default/timer/an.2.3/an.2.4`,
                `gl/st.default/timer/an.2.3/an.2.4`,
                `gl/st.default/timer/an.2.3`,
                `gl/st.default/timer`,
                `gl/st.default`,
                `gl/st.default/no_sensor`,
                `gl/st.default/no_sensor`,
                `gl/st.default/no_sensor`,
                `gl/st.default/no_sensor/an.1.3`,
                `gl/st.default/no_sensor/an.1.3`,
                `gl/st.default/no_sensor/an.1.3`,
                `gl/st.default/no_sensor/an.1.3/an.1.4`,
                `gl/st.default/no_sensor/an.1.3/an.1.4`,
                `gl/st.default/no_sensor/an.1.3/an.1.4`,
                `gl/st.default/no_sensor/an.1.3/an.1.4`,
                `gl/st.default/no_sensor/an.1.3`,
                `gl/st.default/no_sensor/an.1.3`,
                `gl/st.default/no_sensor/an.1.3/an.2.4`,
                `gl/st.default/no_sensor/an.1.3/an.2.4`,
                `gl/st.default/no_sensor/an.1.3/an.2.4`,
                `gl/st.default/no_sensor/an.1.3/an.2.4`,
                `gl/st.default/no_sensor/an.1.3`,
                `gl/st.default/no_sensor`,
                `gl/st.default/no_sensor`,
                `gl/st.default/no_sensor/an.2.3`,
                `gl/st.default/no_sensor/an.2.3`,
                `gl/st.default/no_sensor/an.2.3`,
                `gl/st.default/no_sensor/an.2.3/an.1.4`,
                `gl/st.default/no_sensor/an.2.3/an.1.4`,
                `gl/st.default/no_sensor/an.2.3/an.1.4`,
                `gl/st.default/no_sensor/an.2.3/an.1.4`,
                `gl/st.default/no_sensor/an.2.3`,
                `gl/st.default/no_sensor/an.2.3`,
                `gl/st.default/no_sensor/an.2.3/an.2.4`,
                `gl/st.default/no_sensor/an.2.3/an.2.4`,
                `gl/st.default/no_sensor/an.2.3/an.2.4`,
                `gl/st.default/no_sensor/an.2.3/an.2.4`,
                `gl/st.default/no_sensor/an.2.3`,
                `gl/st.default/no_sensor`,
                `gl/st.default`,
                `gl`,
                `gl`,
                `gl/st.b`,
                `gl/st.b`,
                `gl/st.b/timer`,
                `gl/st.b/timer`,
                `gl/st.b/timer`,
                `gl/st.b/timer/an.1.3`,
                `gl/st.b/timer/an.1.3`,
                `gl/st.b/timer/an.1.3`,
                `gl/st.b/timer/an.1.3/an.1.4`,
                `gl/st.b/timer/an.1.3/an.1.4`,
                `gl/st.b/timer/an.1.3/an.1.4`,
                `gl/st.b/timer/an.1.3/an.1.4`,
                `gl/st.b/timer/an.1.3`,
                `gl/st.b/timer/an.1.3`,
                `gl/st.b/timer/an.1.3/an.2.4`,
                `gl/st.b/timer/an.1.3/an.2.4`,
                `gl/st.b/timer/an.1.3/an.2.4`,
                `gl/st.b/timer/an.1.3/an.2.4`,
                `gl/st.b/timer/an.1.3`,
                `gl/st.b/timer`,
                `gl/st.b/timer`,
                `gl/st.b/timer/an.2.3`,
                `gl/st.b/timer/an.2.3`,
                `gl/st.b/timer/an.2.3`,
                `gl/st.b/timer/an.2.3/an.1.4`,
                `gl/st.b/timer/an.2.3/an.1.4`,
                `gl/st.b/timer/an.2.3/an.1.4`,
                `gl/st.b/timer/an.2.3/an.1.4`,
                `gl/st.b/timer/an.2.3`,
                `gl/st.b/timer/an.2.3`,
                `gl/st.b/timer/an.2.3/an.2.4`,
                `gl/st.b/timer/an.2.3/an.2.4`,
                `gl/st.b/timer/an.2.3/an.2.4`,
                `gl/st.b/timer/an.2.3/an.2.4`,
                `gl/st.b/timer/an.2.3`,
                `gl/st.b/timer`,
                `gl/st.b`,
                `gl/st.b/no_sensor`,
                `gl/st.b/no_sensor`,
                `gl/st.b/no_sensor`,
                `gl/st.b/no_sensor/an.1.3`,
                `gl/st.b/no_sensor/an.1.3`,
                `gl/st.b/no_sensor/an.1.3`,
                `gl/st.b/no_sensor/an.1.3/an.1.4`,
                `gl/st.b/no_sensor/an.1.3/an.1.4`,
                `gl/st.b/no_sensor/an.1.3/an.1.4`,
                `gl/st.b/no_sensor/an.1.3/an.1.4`,
                `gl/st.b/no_sensor/an.1.3`,
                `gl/st.b/no_sensor/an.1.3`,
                `gl/st.b/no_sensor/an.1.3/an.2.4`,
                `gl/st.b/no_sensor/an.1.3/an.2.4`,
                `gl/st.b/no_sensor/an.1.3/an.2.4`,
                `gl/st.b/no_sensor/an.1.3/an.2.4`,
                `gl/st.b/no_sensor/an.1.3`,
                `gl/st.b/no_sensor`,
                `gl/st.b/no_sensor`,
                `gl/st.b/no_sensor/an.2.3`,
                `gl/st.b/no_sensor/an.2.3`,
                `gl/st.b/no_sensor/an.2.3`,
                `gl/st.b/no_sensor/an.2.3/an.1.4`,
                `gl/st.b/no_sensor/an.2.3/an.1.4`,
                `gl/st.b/no_sensor/an.2.3/an.1.4`,
                `gl/st.b/no_sensor/an.2.3/an.1.4`,
                `gl/st.b/no_sensor/an.2.3`,
                `gl/st.b/no_sensor/an.2.3`,
                `gl/st.b/no_sensor/an.2.3/an.2.4`,
                `gl/st.b/no_sensor/an.2.3/an.2.4`,
                `gl/st.b/no_sensor/an.2.3/an.2.4`,
                `gl/st.b/no_sensor/an.2.3/an.2.4`,
                `gl/st.b/no_sensor/an.2.3`,
                `gl/st.b/no_sensor`,
                `gl/st.b`
            ];
            for (let tok = toks.front, i = 0; tok; tok = tok.next, ++i) {
                expect(tok.scope).toBe(scopes[i]);
            }
        });

        it(`scope_10`, async () => {
            const toks = new tokens(`x(){integer a;do{a;}while(a < 3);}`, `main.lsl`);
            await parse_snippet(toks, 1);
            expect(message.length()).toBe(0);

            const scopes = [
                `gl`,
                `gl/fn.x`,
                `gl/fn.x`,
                `gl/fn.x`,
                `gl/fn.x`,
                `gl/fn.x`,
                `gl/fn.x`,
                `gl/fn.x`,
                `gl/fn.x/1.do`,
                `gl/fn.x/1.do`,
                `gl/fn.x/1.do`,
                `gl/fn.x/1.do`,
                `gl/fn.x`,
                `gl/fn.x/2.while`,
                `gl/fn.x/2.while`,
                `gl/fn.x/2.while`,
                `gl/fn.x/2.while`,
                `gl/fn.x/2.while`,
                `gl/fn.x`,
                `gl/fn.x`
            ];
            for (let tok = toks.front, i = 0; tok; tok = tok.next, ++i) {
                expect(tok.scope).toBe(scopes[i]);
            }
        });

        it(`scope_11`, async () => {
            const toks = new tokens(`x(){list a;while(a){a;}}`, `main.lsl`);
            await parse_snippet(toks, 1);
            expect(message.length()).toBe(0);

            const scopes = [
                `gl`,
                `gl/fn.x`,
                `gl/fn.x`,
                `gl/fn.x`,
                `gl/fn.x`,
                `gl/fn.x`,
                `gl/fn.x`,
                `gl/fn.x`,
                `gl/fn.x/1.while`,
                `gl/fn.x/1.while`,
                `gl/fn.x/1.while`,
                `gl/fn.x/1.while`,
                `gl/fn.x/1.while`,
                `gl/fn.x/1.while`,
                `gl/fn.x/1.while`,
                `gl/fn.x`
            ];
            for (let tok = toks.front, i = 0; tok; tok = tok.next, ++i) {
                expect(tok.scope).toBe(scopes[i]);
            }
        });

        it(`scope_12`, async () => {
            const toks = new tokens(`list a;x(){integer i;for(;i < 0;++i){a;}}`, `main.lsl`);
            await parse_snippet(toks, 1);
            expect(message.length()).toBe(0);

            const scopes = [
                `gl`,
                `gl`,
                `gl`,
                `gl`,
                `gl/fn.x`,
                `gl/fn.x`,
                `gl/fn.x`,
                `gl/fn.x`,
                `gl/fn.x`,
                `gl/fn.x`,
                `gl/fn.x`,
                `gl/fn.x/1.for`,
                `gl/fn.x/1.for`,
                `gl/fn.x/1.for`,
                `gl/fn.x/1.for`,
                `gl/fn.x/1.for`,
                `gl/fn.x/1.for`,
                `gl/fn.x/1.for`,
                `gl/fn.x/1.for`,
                `gl/fn.x/1.for`,
                `gl/fn.x/1.for`,
                `gl/fn.x/1.for`,
                `gl/fn.x/1.for`,
                `gl/fn.x/1.for`,
                `gl/fn.x`
            ];
            for (let tok = toks.front, i = 0; tok; tok = tok.next, ++i) {
                expect(tok.scope).toBe(scopes[i]);
            }
        });

        it(`scope_13`, async () => {
            const toks = new tokens(`list b;x(){float a;if(1)a;{b;}}`, `main.lsl`);
            await parse_snippet(toks, 1);
            expect(message.length()).toBe(0);

            const scopes = [
                `gl`,
                `gl`,
                `gl`,
                `gl`,
                `gl/fn.x`,
                `gl/fn.x`,
                `gl/fn.x`,
                `gl/fn.x`,
                `gl/fn.x`,
                `gl/fn.x`,
                `gl/fn.x`,
                `gl/fn.x/1.if`,
                `gl/fn.x/1.if`,
                `gl/fn.x/1.if`,
                `gl/fn.x/1.if`,
                `gl/fn.x`,
                `gl/fn.x/an.2.2`,
                `gl/fn.x/an.2.2`,
                `gl/fn.x/an.2.2`,
                `gl/fn.x/an.2.2`,
                `gl/fn.x`
            ];
            for (let tok = toks.front, i = 0; tok; tok = tok.next, ++i) {
                //console.log(tok.str, tok.scope, flag.to_string(tok.flag));
                expect(tok.scope).toBe(scopes[i]);
            }
        });

        it(`scope_14`, async () => {
            const toks = new tokens(`integer a;integer b;x(){for(a = 0, b = 9;a > 0 && b < a; ++a, b += 7)llDie();list c;}`, `main.lsl`);
            await parse_snippet(toks, 1);
            expect(message.length()).toBe(0);

            const scopes = [`gl`, `gl`, `gl`, `gl`, `gl`, `gl`, `gl`, `gl/fn.x`, `gl/fn.x`, `gl/fn.x`, `gl/fn.x`, `gl/fn.x/1.for`, `gl/fn.x/1.for`, `gl/fn.x/1.for`, `gl/fn.x/1.for`, `gl/fn.x/1.for`, `gl/fn.x/1.for`, `gl/fn.x/1.for`, `gl/fn.x/1.for`, `gl/fn.x/1.for`, `gl/fn.x/1.for`, `gl/fn.x/1.for`, `gl/fn.x/1.for`, `gl/fn.x/1.for`, `gl/fn.x/1.for`, `gl/fn.x/1.for`, `gl/fn.x/1.for`, `gl/fn.x/1.for`, `gl/fn.x/1.for`, `gl/fn.x/1.for`, `gl/fn.x/1.for`, `gl/fn.x/1.for`, `gl/fn.x/1.for`, `gl/fn.x/1.for`, `gl/fn.x/1.for`, `gl/fn.x/1.for`, `gl/fn.x/1.for/llDie`, `gl/fn.x/1.for/llDie`, `gl/fn.x`, `gl/fn.x`, `gl/fn.x`, `gl/fn.x`, `gl/fn.x`];
            for (let tok = toks.front, i = 0; tok; tok = tok.next, ++i) {
                expect(tok.scope).toBe(scopes[i]);
            }
        });

        it(`scope_15`, async () => {
            const toks = new tokens(`llOwnerSay("a"+llDumpList2String([""], ","));if(1)2;`, `main.lsl`);
            await parse_snippet(toks, 1);
            expect(message.length()).toBe(0);

            const scopes = [`gl`, `gl/llOwnerSay`, `gl/llOwnerSay`, `gl/llOwnerSay`, `gl/llOwnerSay`, `gl/llOwnerSay/llDumpList2String`, `gl/llOwnerSay/llDumpList2String`, `gl/llOwnerSay/llDumpList2String`, `gl/llOwnerSay/llDumpList2String`, `gl/llOwnerSay/llDumpList2String`, `gl/llOwnerSay/llDumpList2String`, `gl/llOwnerSay/llDumpList2String`, `gl/llOwnerSay`, `gl`, `gl`, `gl/1.if`, `gl/1.if`, `gl/1.if`, `gl/1.if`, `gl`];
            for (let tok = toks.front, i = 0; tok; tok = tok.next, ++i) {
                expect(tok.scope).toBe(scopes[i]);
            }
        });

        it(`scope_16`, async () => {
            const toks = new tokens(`integer isKey(key id){return 1;}string value;if ((isKey((key) value)) == 1){llDie();}`, `main.lsl`);
            await parse_snippet(toks, 1);
            expect(message.length()).toBe(0);

            const scopes = [
                `gl`,
                `gl`,
                `gl/fn.isKey`,
                `gl/fn.isKey`,
                `gl/fn.isKey`,
                `gl/fn.isKey`,
                `gl/fn.isKey`,
                `gl/fn.isKey`,
                `gl/fn.isKey`,
                `gl/fn.isKey`,
                `gl/fn.isKey`,
                `gl`,
                `gl`,
                `gl`,
                `gl`,
                `gl/2.if`,
                `gl/2.if/an.1.2`,
                `gl/2.if/an.1.2`,
                `gl/2.if/an.1.2/fn.isKey`,
                `gl/2.if/an.1.2/fn.isKey`,
                `gl/2.if/an.1.2/fn.isKey`,
                `gl/2.if/an.1.2/fn.isKey`,
                `gl/2.if/an.1.2`,
                `gl/2.if`,
                `gl/2.if`,
                `gl/2.if`,
                `gl/2.if`,
                `gl/2.if`,
                `gl/2.if/llDie`,
                `gl/2.if/llDie`,
                `gl/2.if`,
                `gl/2.if`
            ];
            for (let tok = toks.front, i = 0; tok; tok = tok.next, ++i) {
                expect(tok.scope).toBe(scopes[i]);
            }
        });

        it(`scope_17`, async () => {
            const toks = new tokens(`if(1){;}else if(2){integer a;if(0)a=0;}`, `main.lsl`);
            await parse_snippet(toks, 1);
            expect(message.length()).toBe(0);

            const scopes = [`gl`, `gl/1.if`, `gl/1.if`, `gl/1.if`, `gl/1.if`, `gl/1.if`, `gl/1.if`, `gl`, `gl`, `gl/3.if`, `gl/3.if`, `gl/3.if`, `gl/3.if`, `gl/3.if`, `gl/3.if`, `gl/3.if`, `gl/3.if`, `gl/3.if/1.if`, `gl/3.if/1.if`, `gl/3.if/1.if`, `gl/3.if/1.if`, `gl/3.if/1.if`, `gl/3.if/1.if`, `gl/3.if`, `gl/3.if`];
            for (let tok = toks.front, i = 0; tok; tok = tok.next, ++i) {
                expect(tok.scope).toBe(scopes[i]);
            }
        });

        it(`scope_18`, async () => {
            const toks = new tokens(`key id;if(0){if(0){;}}string DName=llGetUsername(id);`, `main.lsl`);
            await parse_snippet(toks, 1);
            expect(message.length()).toBe(0);

            const scopes = [`gl`, `gl`, `gl`, `gl`, `gl/1.if`, `gl/1.if`, `gl/1.if`, `gl/1.if`, `gl/1.if`, `gl/1.if/1.if`, `gl/1.if/1.if`, `gl/1.if/1.if`, `gl/1.if/1.if`, `gl/1.if/1.if`, `gl/1.if/1.if`, `gl/1.if`, `gl`, `gl`, `gl`, `gl`, `gl/llGetUsername`, `gl/llGetUsername`, `gl/llGetUsername`, `gl`];
            for (let tok = toks.front, i = 0; tok; tok = tok.next, ++i) {
                expect(tok.scope).toBe(scopes[i]);
            }
        });

        it(`scope_19`, async () => {
            const toks = new tokens(`x(){if(1);else return;}`, `main.lsl`);
            await parse_snippet(toks, 1);
            expect(message.length()).toBe(0);

            const scopes = [`gl`, `gl/fn.x`, `gl/fn.x`, `gl/fn.x`, `gl/fn.x`, `gl/fn.x/1.if`, `gl/fn.x/1.if`, `gl/fn.x/1.if`, `gl/fn.x`, `gl/fn.x`, `gl/fn.x/1.else`, `gl/fn.x`, `gl/fn.x`]
            for (let tok = toks.front, i = 0; tok; tok = tok.next, ++i) {
                expect(tok.scope).toBe(scopes[i]);
            }
        });

        it(`scope_20`, async () => {
            const toks = new tokens(`integer bool(integer a){\nif(a) return TRUE;\nelse return FALSE;\n}`, `main.lsl`);
            await parse_snippet(toks, 1);
            expect(message.length()).toBe(0);

            const scopes = ["gl", "gl", "gl/fn.bool", "gl/fn.bool", "gl/fn.bool", "gl/fn.bool", "gl/fn.bool", "gl/fn.bool", "gl/fn.bool/1.if", "gl/fn.bool/1.if", "gl/fn.bool/1.if", "gl/fn.bool/1.if", "gl/fn.bool/1.if", "gl/fn.bool", "gl/fn.bool", "gl/fn.bool/1.else", "gl/fn.bool/1.else", "gl/fn.bool", "gl/fn.bool"];
            for (let tok = toks.front, i = 0; tok; tok = tok.next, ++i) {
                expect(tok.scope).toBe(scopes[i]);
            }
        });

    });

    describe('collect_name', () => {
        it('should throw an error if tokens are empty', () => {
            expect(() => myScript.collect_name(null)).toThrowError('collect_name: called with empty or invalid tokens.');
        });

        it('should collect names correctly', async () => {
            const toks = new tokens(`integer a;`, `main.lsl`);
            await parse_snippet(toks, 2);
            expect(message.length()).toBe(0);
        });

        it('should add a variable when a valid variable declaration is encountered', async () => {
            spyOn(myScript, `add_var`).and.callThrough();
            spyOn(message, `add`).and.callThrough();

            const toks = new tokens(`integer a;`, `main.lsl`);
            await parse_snippet(toks, 2);

            expect(myScript.add_var).toHaveBeenCalledTimes(1);
            expect(message.add).not.toHaveBeenCalled();
            expect(myScript.has_var(toks.find_str(`a`))).toBeTrue();
        });

        it('should not add a variable if it already exists', async () => {
            spyOn(myScript, `add_var`).and.callThrough();
            spyOn(message, `add`).and.callThrough();

            const toks = new tokens(`integer a;integer a;`, `main.lsl`);
            await parse_snippet(toks, 2);

            expect(myScript.add_var).toHaveBeenCalledTimes(1);
            expect(message.add).toHaveBeenCalledTimes(1);
            expect(message.at(0).str()).toBe(`Warning: Variable name "a" previously declared within scope. #file "main.lsl":1:18`);
        });

        it('should add a function when a valid function declaration is encountered', async () => {
            spyOn(myScript, `add_func`).and.callThrough();
            spyOn(message, `add`).and.callThrough();

            const toks = new tokens(`integer Func();`, `main.lsl`);
            await parse_snippet(toks, 2);

            expect(myScript.add_func).toHaveBeenCalledTimes(1);
            expect(myScript.has_func(toks.find_str(`Func`))).toBeTrue();
            expect(message.add).toHaveBeenCalledTimes(0);
        });

        it('should not add a function if it already exists', async () => {
            spyOn(myScript, `add_func`).and.callThrough();
            spyOn(message, `add`).and.callThrough();

            const toks = new tokens(`integer Func();integer Func();`, `main.lsl`);
            await parse_snippet(toks, 2);

            expect(myScript.add_func).toHaveBeenCalledTimes(1);
            expect(message.add).toHaveBeenCalledTimes(1);
            expect(message.at(0).str()).toBe(`Syntax error: Function name "Func" previously declared within scope. #file "main.lsl":1:23`);
        });

        it('should add a state when a valid state declaration is encountered', async () => {
            spyOn(myScript, `add_state`).and.callThrough();
            spyOn(message, `add`).and.callThrough();

            const toks = new tokens(`state a{}`, `main.lsl`);
            await parse_snippet(toks, 2);

            expect(myScript.add_state).toHaveBeenCalledTimes(1);
            expect(myScript.has_state(toks.find_str(`a`))).toBeTrue();
            expect(message.add).toHaveBeenCalledTimes(0);
        });

        it('should not add a state if it already exists', async () => {
            spyOn(myScript, `add_state`).and.callThrough();
            spyOn(message, `add`).and.callThrough();

            const toks = new tokens(`state a{}\nstate a{}`, `main.lsl`);
            await parse_snippet(toks, 2);

            expect(myScript.add_state).toHaveBeenCalledTimes(1);
            expect(message.add).toHaveBeenCalledTimes(1);
            expect(message.at(0).str()).toBe(`Syntax error: State name "a" previously declared within scope. #file "main.lsl":2:7`);
        });

        it('should add an event when a valid event declaration is encountered', async () => {
            spyOn(myScript, `add_event`).and.callThrough();
            spyOn(message, `add`).and.callThrough();

            const toks = new tokens(`state a{timer(){}}`, `main.lsl`);
            await parse_snippet(toks, 2);

            expect(myScript.add_event).toHaveBeenCalledTimes(1);
            expect(myScript.has_event(toks.find_str(`a`), toks.find_str(`timer`))).toBeTrue();
            expect(message.add).toHaveBeenCalledTimes(0);
        });

        it('should not add an event if it already exists', async () => {
            spyOn(myScript, `add_event`).and.callThrough();
            spyOn(message, `add`).and.callThrough();

            const toks = new tokens(`state a{timer(){}\ntimer(){}}`, `main.lsl`);
            await parse_snippet(toks, 2);

            expect(myScript.add_event).toHaveBeenCalledTimes(1);
            expect(message.add).toHaveBeenCalledTimes(1);
            expect(message.at(0).str()).toBe(`Syntax error: Event name "timer" previously declared within scope. #file "main.lsl":2:1`);
        });

        it('should add a label when a valid label declaration is encountered', async () => {
            spyOn(myScript, `add_label`).and.callThrough();
            spyOn(message, `add`).and.callThrough();

            const toks = new tokens(`func(){jump _;\n@_;}`, `main.lsl`);
            await parse_snippet(toks, 2);

            expect(myScript.add_label).toHaveBeenCalledTimes(1);
            expect(myScript.has_label(toks.find_str(`_`))).toBeTrue();
            expect(message.add).toHaveBeenCalledTimes(0);
        });

        it('should not add a label if it already exists', async () => {
            spyOn(myScript, `add_label`).and.callThrough();
            spyOn(message, `add`).and.callThrough();

            const toks = new tokens(`func(){jump _;\n@_;\n@_;}`, `main.lsl`);
            await parse_snippet(toks, 2);

            expect(myScript.add_label).toHaveBeenCalledTimes(1);
            expect(message.add).toHaveBeenCalledTimes(1);
            expect(message.at(0).str()).toBe(`Syntax error: Duplicate local label name. That won't allow the Mono script to be saved, and will not work as expected in LSO. #file "main.lsl":3:1`);
        });

        it(`collect_name_00`, async () => {
            const toks = new tokens(`vector x; x = <-x.y, x.z, x.x>;`, `main.lsl`);
            await parse_snippet(toks, 2);

            expect(toks.find_str(`<`).flag).toBe((flag.SYMBOL_FLAG | flag.VECTOR_OP_FLAG | flag.DEL_FLAG));
            expect(toks.find_str(`>`).flag).toBe((flag.SYMBOL_FLAG | flag.VECTOR_CL_FLAG | flag.DEL_FLAG));

            expect(toks.front.flag).toBe((flag.NAME_FLAG | flag.TYPE_FLAG));

            let tok = toks.find_str(`.`).prev;
            //console.log(`str: ${tok.str}, flag: ${flag.to_string(tok.flag)}`);
            expect(tok.flag).toBe((flag.NAME_FLAG | flag.VARIABLE_FLAG));

            tok = toks.find_str_r(`.`).prev;
            //console.log(`str: ${tok.str}, flag: ${flag.to_string(tok.flag)}`);
            expect(tok.flag).toBe((flag.NAME_FLAG | flag.VARIABLE_FLAG));

            //expect(false).toBeTrue();
        });

        it(`collect_name_01`, async () => {
            const toks = new tokens(`a(integer b){;}`, `main.lsl`);
            await parse_snippet(toks, 2);
            expect(toks.find_str(`b`).flag).toBe(flag.NAME_FLAG | flag.VARIABLE_FLAG | flag.PARAM_FLAG);
        });

        it(`collect_name_02`, async () => {
            const toks = new tokens(`default{touch(integer a){;}}`, `main.lsl`);
            await parse_snippet(toks, 2);
            const tok = toks.find_str(`a`);
            expect(tok.flag).toBe(flag.NAME_FLAG | flag.VARIABLE_FLAG | flag.PARAM_FLAG);
        });
    });

    describe('line_of_code function', () => {
        it('should return an expression from a given token', async () => {
            const toks = new tokens(`integer add(a, b) { return a + b; }`, `main.lsl`);
            await parse_snippet(toks, 2);

            const firstToken = toks.front;
            const lineOfCode = script.line_of_code(firstToken);

            expect(lineOfCode.front.str).toBe('integer');
            expect(lineOfCode.back.str).toBe(')');
        });
    });

});

describe(`next_exp`, () => {
    let myScript;

    const parse_snippet = async (toks, lvl = 0) => {
        await convert_to_lsl(toks);
        if (lvl >= 0) myScript.flag_tokens(toks);
        if (lvl >= 1) {
            myScript._scp_deep = 0;
            myScript.parse_scope(toks, [SCOPE_GLOBAL]);
        }
        if (lvl >= 2) myScript.collect_name(toks);
        return toks;
    };

    beforeAll(async () => {
        await load_spec(`../../../../lib/source/parser/lsl/lsl_data.json`);
    });

    beforeEach(async () => {
        myScript = new script();
        message.clear();
    });
    
    it('next_exp_001', async () => {
        const toks = new tokens(`1 + (2)`, `main.lsl`);
        await parse_snippet(toks, 2);
        expect(next_exp(toks.find_str(`+`)).str).toBe(`(2)`);
    });

    it('next_exp_002', async () => {
        const toks = new tokens(`1 + (string)llAbs(1<3)`, `main.lsl`);
        await parse_snippet(toks, 2);
        expect(next_exp(toks.find_str(`+`)).str).toBe(`(string)llAbs(1<3)`);
    });

    it('next_exp_003', async () => {
        const toks = new tokens(`vector a;1 + a.x`, `main.lsl`);
        await parse_snippet(toks, 2);
        expect(next_exp(toks.find_str(`+`)).str).toBe(`a.x`);
    });

    it('next_exp_004', async () => {
        const toks = new tokens(`vector a;1 + -a.x`, `main.lsl`);
        await parse_snippet(toks, 2);
        expect(next_exp(toks.find_str(`+`)).str).toBe(`-a.x`);
    });

    it('next_exp_005', async () => {
        const toks = new tokens(`!llGetLinkNumber()`, `main.lsl`);
        await parse_snippet(toks, 2);
        expect(next_exp(toks.front).str).toBe(`llGetLinkNumber()`);
    });

    it('next_exp_006', async () => {
        const toks = new tokens(`int a = !llGetLinkNumber()`, `main.lsl`);
        await parse_snippet(toks, 2);
        expect(next_exp(toks.find_str(`=`)).str).toBe(`!llGetLinkNumber()`);
    });

    it('next_exp_007', async () => {
        const toks = new tokens(`float a=(float)-llGetLinkNumber()`, `main.lsl`);
        await parse_snippet(toks, 2);
        expect(next_exp(toks.find_str(`=`)).str).toBe(`(float)-llGetLinkNumber()`);
    });

    it('next_exp_008', async () => {
        const toks = new tokens(`float a=(float)!~-llGetLinkNumber()`, `main.lsl`);
        await parse_snippet(toks, 2);
        expect(next_exp(toks.find_str(`=`)).str).toBe(`(float)!~-llGetLinkNumber()`);
    });

    it('next_exp_009', async () => {
        const toks = new tokens(`vector x; x = <-x.y, x.z, x.x>;`, `main.lsl`);
        await parse_snippet(toks, 2);
        expect(next_exp(toks.find_str(`-`)).str).toBe(`x.y`);
    });

    it('next_exp_010', async () => {
        const toks = new tokens(`~--a`, `main.lsl`);
        await parse_snippet(toks, 2);
        expect(next_exp(toks.front).str).toBe(`--a`);
    });

    it('next_exp_011', async () => {
        const toks = new tokens(`~a--`, `main.lsl`);
        await parse_snippet(toks, 2);
        expect(next_exp(toks.front).str).toBe(`a--`);
    });

});

describe(`prev_exp`, () => {
    let myScript;

    const parse_snippet = async (toks, lvl = 0) => {
        await convert_to_lsl(toks);
        if (lvl >= 0) myScript.flag_tokens(toks);
        if (lvl >= 1) {
            myScript._scp_deep = 0;
            myScript.parse_scope(toks, [SCOPE_GLOBAL]);
        }
        if (lvl >= 2) myScript.collect_name(toks);
        return toks;
    };

    beforeAll(async () => {
        await load_spec(`../../../../lib/source/parser/lsl/lsl_data.json`);
    });

    beforeEach(async () => {
        myScript = new script();
        message.clear();
    });
    
    it('prev_exp_000', async () => {
        const toks = new tokens(`1 + 2`, `main.lsl`);
        await parse_snippet(toks, 2);
        expect(prev_exp(toks.find_str(`+`)).str).toBe(`1`);
    });

    it('prev_exp_001', async () => {
        const toks = new tokens(`(1) + 2`, `main.lsl`);
        await parse_snippet(toks, 2);
        expect(prev_exp(toks.find_str(`+`)).str).toBe(`(1)`);
    });

    it('prev_exp_002', async () => {
        const toks = new tokens(`(1 * 7) + 2`, `main.lsl`);
        await parse_snippet(toks, 2);
        expect(prev_exp(toks.find_str(`+`)).str).toBe(`(1 * 7)`);
    });

    it('prev_exp_003', async () => {
        const toks = new tokens(`a + 2`, `main.lsl`);
        await parse_snippet(toks, 2);
        expect(prev_exp(toks.find_str(`+`)).str).toBe(`a`);
    });

    it('prev_exp_004', async () => {
        const toks = new tokens(`<0,0,0> + 2`, `main.lsl`);
        await parse_snippet(toks, 2);
        expect(prev_exp(toks.find_str(`+`)).str).toBe(`<0,0,0>`);
    });

    it('prev_exp_005', async () => {
        const toks = new tokens(`<0,0,0,1> + 2`, `main.lsl`);
        await parse_snippet(toks, 2);
        expect(prev_exp(toks.find_str(`+`)).str).toBe(`<0,0,0,1>`);
    });

    it('prev_exp_006', async () => {
        const toks = new tokens(`llAbs(3) + 2`, `main.lsl`);
        await parse_snippet(toks, 2);
        expect(prev_exp(toks.find_str(`+`)).str).toBe(`llAbs(3)`);
    });

    it('prev_exp_007', async () => {
        const toks = new tokens(`[] + 2`, `main.lsl`);
        await parse_snippet(toks, 2);
        expect(prev_exp(toks.find_str(`+`)).str).toBe(`[]`);
    });

    it('prev_exp_008', async () => {
        const toks = new tokens(`[a, llList2String([1,2,3], 1)] + 2`, `main.lsl`);
        await parse_snippet(toks, 2);
        expect(prev_exp(toks.find_str(`+`)).str).toBe(`[a, llList2String([1,2,3], 1)]`);
    });

    it('prev_exp_009', async () => {
        const toks = new tokens(`(string)[a,llList2String([1,2,3],1)]+"a"`, `main.lsl`);
        await parse_snippet(toks, 2);
        expect(prev_exp(toks.find_str(`+`)).str).toBe(`(string)[a,llList2String([1,2,3],1)]`);
    });

    it('prev_exp_010', async () => {
        const toks = new tokens(`(string)llAbs(1<3)+"a"`, `main.lsl`);
        await parse_snippet(toks, 2);
        expect(prev_exp(toks.find_str(`+`)).str).toBe(`(string)llAbs(1<3)`);
    });

    it('prev_exp_011', async () => {
        const toks = new tokens(`(llAbs((integer)3)) == 1`, `main.lsl`);
        await parse_snippet(toks, 2);
        expect(prev_exp(toks.find_str(`==`)).str).toBe(`(llAbs((integer)3))`);
    });

    it('prev_exp_012', async () => {
        const toks = new tokens(`vector a;a.z += 1`, `main.lsl`);
        await parse_snippet(toks, 2);
        expect(prev_exp(toks.find_str(`+=`)).str).toBe(`a.z`);
    });

    it('prev_exp_013', async () => {
        const toks = new tokens(`--a % 2`, `main.lsl`);
        await parse_snippet(toks, 2);
        expect(prev_exp(toks.find_str(`%`)).str).toBe(`--a`);
    });

    it('prev_exp_014', async () => {
        const toks = new tokens(`a-- % 2`, `main.lsl`);
        await parse_snippet(toks, 2);
        expect(prev_exp(toks.find_str(`%`)).str).toBe(`a--`);
    });

    it('prev_exp_015', async () => {
        const toks = new tokens(`<1.,2.,3.>+<2.,4.,6.>`, `main.lsl`);
        await parse_snippet(toks, 2);
        expect(prev_exp(toks.find_str(`+`)).str).toBe(`< 1. , 2. , 3. >`);
    });

});

