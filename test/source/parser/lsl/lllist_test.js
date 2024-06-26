import { message } from "../../../../lib/source/message.js";
import { tokens } from "../../../../lib/source/tokens.js";
import { convert_to_lsl } from "../../../../lib/source/parser/lsl/translate.js";
import { src } from "../../../../lib/source/source.js";
import { load_spec } from "../../../../lib/source/parser/lsl/llspec.js";
import { parsing } from "../../../../lib/source/parser/lsl/parsing.js";
import { lllist } from "../../../../lib/source/parser/lsl/lllist.js";
import { string } from "../../../../lib/text/string.js";


const parse_snippet = async (str, file = "main.lsl") => {
    let t = new tokens(str, file);
    expect(message.has_error()).toBeFalse();
    t.remove_comments();

    await convert_to_lsl(t);
    expect(message.has_error()).toBeFalse();
    await parsing(t);
    expect(message.has_error()).toBeFalse();
    return t;
};


describe(`lllist`, () => {

    beforeAll(async () => {
        await load_spec(`../../../../lib/source/parser/lsl/lsl_data.json`);
    });

    afterEach(async () => {
        message.print();
        message.clear();
        src.clear();
    });

    it(`constructor_00`, async () => {
        const toks = await parse_snippet(`[]`);
        const list = new lllist(toks.front);
        expect(list.length).toBe(0);
    });

    it(`constructor_01`, async () => {
        const toks = await parse_snippet(`["0"]`);
        const list = new lllist(toks.front);
        expect(list.length).toBe(1);
        expect(list.empty()).toBe(false);
    });

    it(`at_01`, async () => {
        const toks = await parse_snippet(`["0"]`);
        const list = new lllist(toks.front);
        expect(list.at(0).str).toBe(`"0"`);
    });

    it(`empty_00`, async () => {
        const toks = await parse_snippet(`[]`);
        const list = new lllist(toks.front);
        expect(list.empty(0)).toBeTrue();
    });

    it(`empty_01`, async () => {
        const toks = await parse_snippet(`["0"]`);
        const list = new lllist(toks.front);
        expect(list.empty(0)).toBeFalse();
    });

    it(`parse_00`, async () => {
        const toks = await parse_snippet(`["0", 1, 2]`);
        const list = new lllist(toks.front);
        expect(list.length).toBe(3);
        expect(list.at(0).str).toBe(`"0"`);
        expect(list.at(1).str).toBe(`1`);
        expect(list.at(2).str).toBe(`2`);
        expect(list.empty()).toBe(false);
    });

    it(`parse_01`, async () => {
        const toks = await parse_snippet(`(list)"0"`);
        const list = new lllist(toks.front);
        expect(list.length).toBe(1);
        expect(list.at(0).str).toBe(`"0"`);
        expect(list.empty()).toBe(false);
    });

    it(`parse_02`, async () => {
        const toks = await parse_snippet(`(list)"0" + 1 + 2`);
        const list = new lllist(toks.front);
        expect(list.length).toBe(3);
        expect(list.at(0).str).toBe(`"0"`);
        expect(list.at(1).str).toBe(`1`);
        expect(list.at(2).str).toBe(`2`);
        expect(list.empty()).toBe(false);
    });

    it(`parse_03`, async () => {
        const toks = await parse_snippet(`(list)(1 - 3) + ("a" + "b") + llAbs(3);`);
        const list = new lllist(toks.front);
        expect(list.length).toBe(3);
        expect(list.at(0).str).toBe(`(1 - 3)`);
        expect(list.at(1).str).toBe(`("a" + "b")`);
        expect(list.at(2).str).toBe(`llAbs(3)`);
        expect(list.empty()).toBe(false);
    });

    it(`parse_04`, async () => {
        const toks = await parse_snippet(`(list)(1 - 3) + [("a" + "b")] + llAbs(3);`);
        const list = new lllist(toks.front);
        expect(list.length).toBe(1);
        expect(list.empty()).toBe(false);
    });

    it(`parse_05`, async () => {
        const toks = await parse_snippet(`[] + 3 + 5`);
        const list = new lllist(toks.find_str(`[`));
        expect(list.length).toBe(0);
        expect(list.empty()).toBeTrue();
    });

    it(`push_back_00`, async () => {
        const toks = await parse_snippet(`["0", 1, 2]`);
        const la = new lllist(toks.front);
        expect(la.length).toBe(3);

        const lb = new lllist();
        lb.push_back(la.at(0));
        expect(lb.length).toBe(1);
        expect(lb.at(0).str).toBe(`"0"`);
    });

    it(`push_back_01`, async () => {
        const toks = await parse_snippet(`["0", 1, 2]`);
        const la = new lllist(toks.front);
        expect(la.length).toBe(3);

        const lb = new lllist();
        lb.push_back(...la.entries);
        expect(lb.length).toBe(3);
        expect(lb.at(0).str).toBe(`"0"`);
        expect(lb.at(1).str).toBe(`1`);
        expect(lb.at(2).str).toBe(`2`);
        expect(lb.empty()).toBe(false);
    });

    it(`push_back_02`, async () => {
        const toks = await parse_snippet(`["0", 1, 2]`);
        const la = new lllist(toks.front);
        expect(la.length).toBe(3);

        const lb = new lllist();
        lb.push_back(la.at(0), la.at(1), la.at(2));
        expect(lb.length).toBe(3);
        expect(lb.at(0).str).toBe(`"0"`);
        expect(lb.at(1).str).toBe(`1`);
        expect(lb.at(2).str).toBe(`2`);
        expect(lb.empty()).toBe(false);
    });

    it(`push_front_00`, async () => {
        const toks = await parse_snippet(`["0", 1, 2]`);
        const la = new lllist(toks.front);
        expect(la.length).toBe(3);

        const lb = new lllist();
        lb.push_front(la.at(0));
        expect(lb.length).toBe(1);
        expect(lb.at(0).str).toBe(`"0"`);
    });

    it(`push_front_01`, async () => {
        const toks = await parse_snippet(`["0", 1, 2]`);
        const la = new lllist(toks.front);
        expect(la.length).toBe(3);

        const lb = new lllist();
        lb.push_front(...la.entries);
        expect(lb.length).toBe(3);
        expect(lb.at(0).str).toBe(`"0"`);
        expect(lb.at(1).str).toBe(`1`);
        expect(lb.at(2).str).toBe(`2`);
        expect(lb.empty()).toBe(false);
    });

    it(`push_front_02`, async () => {
        const toks = await parse_snippet(`["0", 1, 2]`);
        const la = new lllist(toks.front);
        expect(la.length).toBe(3);

        const lb = new lllist();
        lb.push_front(la.at(0), la.at(1), la.at(2));
        expect(lb.length).toBe(3);
        expect(lb.at(0).str).toBe(`"0"`);
        expect(lb.at(1).str).toBe(`1`);
        expect(lb.at(2).str).toBe(`2`);
        expect(lb.empty()).toBe(false);
    });

    it(`push_front_02`, async () => {
        const toks = await parse_snippet(`["0", 1, 2]`);
        const la = new lllist(toks.front);
        expect(la.length).toBe(3);

        const lb = new lllist();
        lb.push_front(la.at(0), la.at(1), la.at(2));
        expect(lb.length).toBe(3);
        expect(lb.at(0).str).toBe(`"0"`);
        expect(lb.at(1).str).toBe(`1`);
        expect(lb.at(2).str).toBe(`2`);
        expect(lb.empty()).toBe(false);
    });


    it(`collect_00`, async () => {
        const toks = await parse_snippet(`["0", 1, 2]`);
        const la = lllist.collect(toks.front);
        expect(la.length).toBe(3);
        expect(la.at(0).str).toBe(`"0"`);
        expect(la.at(1).str).toBe(`1`);
        expect(la.at(2).str).toBe(`2`);
        expect(la.str).toBe(`["0", 1, 2]`);
    });

    it(`collect_01`, async () => {
        const toks = await parse_snippet(`(list)"0" + 1 + [2]`);
        const la = lllist.collect(toks.front);
        expect(la.length).toBe(3);
        expect(la.at(0).str).toBe(`"0"`);
        expect(la.at(1).str).toBe(`1`);
        expect(la.at(2).str).toBe(`2`);
        expect(la.str).toBe(`["0", 1, 2]`);
    });

    it(`collect_02`, async () => {
        const toks = await parse_snippet(`(list)"0" + (string)1 + [2]`);
        const la = lllist.collect(toks.front);
        expect(la.length).toBe(3);
        expect(la.at(0).str).toBe(`"0"`);
        expect(la.at(1).str).toBe(`(string)1`);
        expect(la.at(2).str).toBe(`2`);
        expect(la.str).toBe(`["0", (string)1, 2]`);
    });

    it(`collect_03`, async () => {
        const toks = await parse_snippet(`["0", 1] + [2]`);
        const la = lllist.collect(toks.front);
        expect(la.length).toBe(3);
        expect(la.at(0).str).toBe(`"0"`);
        expect(la.at(1).str).toBe(`1`);
        expect(la.at(2).str).toBe(`2`);
        expect(la.str).toBe(`["0", 1, 2]`);
    });

    it(`collect_04`, async () => {
        const toks = await parse_snippet(`["0", 1] + [2]`);
        const la = lllist.collect(toks.find_str_r(`[`));
        expect(la.length).toBe(3);
        expect(la.at(0).str).toBe(`"0"`);
        expect(la.at(1).str).toBe(`1`);
        expect(la.at(2).str).toBe(`2`);
        expect(la.str).toBe(`["0", 1, 2]`);
    });

    it(`collect_05`, async () => {
        const toks = await parse_snippet(`["0", 1] + (list)2`);
        const la = lllist.collect(toks.find_str_r(`(list)`));
        expect(la.length).toBe(3);
        expect(la.at(0).str).toBe(`"0"`);
        expect(la.at(1).str).toBe(`1`);
        expect(la.at(2).str).toBe(`2`);
        expect(la.str).toBe(`["0", 1, 2]`);
    });

    it(`collect_06`, async () => {
        const toks = await parse_snippet(`(list)"0" + (string)1 + [2]`);
        const la = lllist.collect(toks.find_str_r(`[`));
        expect(la.length).toBe(3);
        expect(la.str).toBe(`["0", (string)1, 2]`);
        expect(la.at(0).str).toBe(`"0"`);
        expect(la.at(1).str).toBe(`(string)1`);
        expect(la.at(2).str).toBe(`2`);
    });

    it(`collect_07`, async () => {
        const toks = await parse_snippet(`(list)"0" + (string)1 + (list)2`);
        const la = lllist.collect(toks.find_str_r(`(list)`));
        expect(la.length).toBe(3);
        expect(la.str).toBe(`["0", (string)1, 2]`);
        expect(la.at(0).str).toBe(`"0"`);
        expect(la.at(1).str).toBe(`(string)1`);
        expect(la.at(2).str).toBe(`2`);
    });

    it(`collect_08`, async () => {
        const toks = await parse_snippet(`["0"] + 1 + [2]`);
        const la = lllist.collect(toks.find_str_r(`[`));
        expect(la.length).toBe(3);
        expect(la.str).toBe(`["0", 1, 2]`);
        expect(la.at(0).str).toBe(`"0"`);
        expect(la.at(1).str).toBe(`1`);
        expect(la.at(2).str).toBe(`2`);
    });

    it(`collect_09`, async () => {
        const toks = await parse_snippet(`[] + 3 + 5;`);
        const la = lllist.collect(toks.front);
        expect(la.length).toBe(2);
        expect(la.str).toBe(`[3, 5]`);
        expect(la.at(0).str).toBe(`3`);
        expect(la.at(1).str).toBe(`5`);
    });

    it(`collect_10`, async () => {
        const toks = await parse_snippet(`(list)55 + [] + 3 + 5;`);
        const la = lllist.collect(toks.front);
        expect(la.length).toBe(3);
        expect(la.str).toBe(`[55, 3, 5]`);
        expect(la.at(0).str).toBe(`55`);
        expect(la.at(1).str).toBe(`3`);
        expect(la.at(2).str).toBe(`5`);
    });

    it(`collect_11`, async () => {
        const toks = await parse_snippet(`[] + 55 + (list)3 + 5;`);
        const la = lllist.collect(toks.front);
        expect(la.length).toBe(3);
        expect(la.str).toBe(`[55, 3, 5]`);
        expect(la.at(0).str).toBe(`55`);
        expect(la.at(1).str).toBe(`3`);
        expect(la.at(2).str).toBe(`5`);
    });

    it(`collect_12`, async () => {
        const toks = await parse_snippet(`list a; list b; a = (list)1 + 2 + b;`);
        const la = lllist.collect(toks.find_str(`(list)`));
        expect(la.length).toBe(2);
        expect(la.str).toBe(`[1, 2]`);
        expect(la.at(0).str).toBe(`1`);
        expect(la.at(1).str).toBe(`2`);
    });

    it(`collect_13`, async () => {
        const toks = await parse_snippet(`list a; list b; a = [] + 1 + 2 + b + 5 + 6;`);
        const la = lllist.collect(toks.find_str(`5`));
        expect(la.length).toBe(2);
        expect(la.str).toBe(`[5, 6]`);
        expect(la.at(0).str).toBe(`5`);
        expect(la.at(1).str).toBe(`6`);
    });

    it(`collect_14`, async () => {
        const toks = await parse_snippet(`list a; list b; a = [] + 1 + 2 + b + <1,2,3>;`);
        const la = lllist.collect(toks.find_str(`<`));
        expect(la.length).toBe(1);
        expect(la.str).toBe(`[<1,2,3>]`);
        expect(la.at(0).str).toBe(`<1,2,3>`);
    });

    it(`collect_15`, async () => {
        const toks = await parse_snippet(`list a = (list)(5+6);`);
        const la = lllist.collect(toks.find_str(`(list)`));
        expect(la.length).toBe(1);
        expect(la.str).toBe(`[(5+6)]`);
        expect(la.at(0).str).toBe(`(5+6)`);
    });

    it(`collect_16`, async () => {
        const toks = await parse_snippet(`list a = (list)llAbs(3);`);
        const la = lllist.collect(toks.find_str(`(list)`));
        expect(la.length).toBe(1);
        expect(la.str).toBe(`[llAbs(3)]`);
        expect(la.at(0).str).toBe(`llAbs(3)`);
    });

    it(`collect_17`, async () => {
        const toks = await parse_snippet(`list a = (list)1 + (string)<1,2,3>;`);
        const la = lllist.collect(toks.find_str(`(list)`));
        expect(la.length).toBe(2);
        expect(la.str).toBe(`[1, (string)<1,2,3>]`);
        expect(la.at(0).str).toBe(`1`);
        expect(la.at(1).str).toBe(`(string)<1,2,3>`);
    });

    it(`collect_18`, async () => {
        const toks = await parse_snippet(`vector pos;list texture;llSetLinkPrimitiveParamsFast(LINK_ROOT, (list)PRIM_POS_LOCAL + pos + texture);`);
        const la = lllist.collect(toks.find_str(`(list)`));
        expect(la.length).toBe(2);
        expect(la.str).toBe(`[0x21, pos]`);
        expect(la.at(0).str).toBe(`0x21`);
        expect(la.at(1).str).toBe(`pos`);
    });

    it(`str_00`, async () => {
        const toks = await parse_snippet(`["0  1"]`);
        const la = lllist.collect(toks.find_str_r(`[`));
        expect(la.length).toBe(1);
        expect(la.str).toBe(`["0  1"]`);
        expect(la.at(0).str).toBe(`"0  1"`);
    });

    it(`cast_000`, async () => {
        const toks = await parse_snippet(`["0", 1, 2]`);
        const s = new lllist(toks.front);
        expect(s.cast(`string`).str).toBe(`"012"`);
        expect(s.cast(`list`).str).toBe(`["0",1,2]`);
    });

    it(`cast_001`, async () => {
        const toks = await parse_snippet(`[<1,2,3>]`);
        const s = new lllist(toks.front);
        expect(s.cast(`string`).str).toBe(`"<1, 2, 3>"`);
        expect(s.cast(`list`).str).toBe(`[<1,2,3>]`);
    });

    it(`is_literal_00`, async () => {
        const toks = await parse_snippet(`list a;list b = (list)22 + 33 + a + 2 + 5;`);
        const la = lllist.collect(toks.find_str(`(list)`));
        expect(la.length).toBe(2);
        expect(la.str).toBe(`[22, 33]`);
        expect(la.at(0).str).toBe(`22`);
        expect(la.at(1).str).toBe(`33`);
        expect(la.is_literal()).toBeFalse();
    });

    it(`is_literal_01`, async () => {
        const toks = await parse_snippet(`list b = ["c"];`);
        const la = lllist.collect(toks.find_str(`[`));
        expect(la.is_literal()).toBeTrue();
    });

    it(`is_literal_02`, async () => {
        const toks = await parse_snippet(`list a;list b = (list)22 + 33 + a + 2 + 5;`);
        const la = lllist.collect(toks.find_str(`2`));
        expect(la.length).toBe(2);
        expect(la.str).toBe(`[2, 5]`);
        expect(la.at(0).str).toBe(`2`);
        expect(la.at(1).str).toBe(`5`);
        expect(la.is_literal()).toBeFalse();
    });

    it(`is_literal_03`, async () => {
        const toks = await parse_snippet(`list a;list b = [22, 33] + a + 2 + 5;`);
        const la = lllist.collect(toks.find_str(`[`));
        expect(la.length).toBe(2);
        expect(la.str).toBe(`[22, 33]`);
        expect(la.at(0).str).toBe(`22`);
        expect(la.at(1).str).toBe(`33`);
        expect(la.is_literal()).toBeTrue();
    });

    it(`is_literal_04`, async () => {
        const toks = await parse_snippet(`list a;list b = [22, 33] + a + [2, 5];`);
        const la = lllist.collect(toks.find_str_r(`[`));
        expect(la.length).toBe(2);
        expect(la.str).toBe(`[2, 5]`);
        expect(la.at(0).str).toBe(`2`);
        expect(la.at(1).str).toBe(`5`);
        expect(la.is_literal()).toBeTrue();
    });

    it(`opt_mem_01`, async () => {
        const toks = await parse_snippet(`list a;list b = [22, 33] + a + [2, 5];`);
        const la = lllist.collect(toks.find_str_r(`[`));
        expect(string.simplify(la.opt_mem().str)).toBe(`(list) 2 + 5`);
    });

    it(`opt_mem_02`, async () => {
        const toks = await parse_snippet(`(list)(1 - 3) + [("a" + "b")] + llAbs(3);`);
        const la = lllist.collect(toks.front);
        expect(string.simplify(la.opt_mem().str)).toBe(`(list)(1 - 3) + ("a" + "b") + llAbs(3)`);
    });

    xit(`error_00`, async () => { expect(true).toBeFalse(); });
});