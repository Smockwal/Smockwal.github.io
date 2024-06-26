import { message } from "../../../../../lib/source/message.js";
import { options } from "../../../../../lib/source/options.js";
import { formatter } from "../../../../../lib/source/parser/lsl/formater.js";
import { parsing } from "../../../../../lib/source/parser/lsl/parsing.js";
import { convert_to_lsl } from "../../../../../lib/source/parser/lsl/translate.js";
import { src } from "../../../../../lib/source/source.js";
import { tokens } from "../../../../../lib/source/tokens.js";
import { reset_index } from "../../../../../lib/text/string.js";
import { load_spec } from "../../../../../lib/source/parser/lsl/llspec.js";

const parse_snippet = async (str, file = "main.lsl") => {
    let t = new tokens(str, file);
    expect(message.has_error()).toBeFalse();
    t.remove_comments();

    //t = await preprocessing([t]);
    expect(message.has_error()).toBeFalse();

    await convert_to_lsl(t);
    expect(message.has_error()).toBeFalse();
    await parsing(t);
    expect(message.has_error()).toBeFalse();
    return t;
};

describe(`formatting_kr`, () => {
    beforeAll(async () => {
        await load_spec(`../../../../lib/source/parser/lsl/lsl_data.json`);
    });

    beforeEach(async () => {
        options.clear();
        reset_index();
        src.clear();


    });

    afterEach(async () => {
        message.print();
        message.clear();
    });

    it('formatter_000', async () => {
        options.set(`formatter`, `style`, 1);
        options.set(`formatter`, `space`, 3);

        const toks = await parse_snippet(`integer a = 1;`);
        expect(await formatter(toks)).toBe(`
integer a = 1;
`);
    });

    it('formatter_001', async () => {
        options.set(`formatter`, `style`, 1);
        options.set(`formatter`, `space`, 2);

        const toks = await parse_snippet(`default{timer(){;}}`);
        // string.c_escape(await formatter(toks)).replace(/\s/g, `sp`)
        expect(await formatter(toks)).toBe(`
default  {
    timer() {
        ;
    }
}
`);
    });

    it('formatter_002', async () => {
        options.set(`formatter`, `style`, 1);
        options.set(`formatter`, `space`, 2);

        const toks = await parse_snippet(`
        list la = ["a" , 1 , 2.8 , < 1 , 2.2 , 0 >];integer v() {integer b;if (v())return 1;else if (v())return (integer)"bar";else if (v()) {integer g = 0;return 0;} else 
        b = llAbs(6);v();return 5;}default {timer() {integer b;if (v())return 1;else if (v())return (integer)"bar";else if (v()) {integer g = 0;return 0;} else b = llAbs(6);v();for (b = 0; b < 70; ++b) {b = 6;}for (b = 0; b < 70; ++b) b = 6;}}`);
        // string.c_escape(await formatter(toks)).replace(/\s/g, `sp`)
        expect(await formatter(toks)).toBe(`
list la = ["a", 1, 2.8, <1, 2.2, 0>];
integer v() {
    integer b;
    if (v())
        return 1;
    else if (v())
        return (integer)"bar";
    else if (v()) {
        integer g = 0;
        return 0;
    }
    else
        b = llAbs(6);
    v();
    return 5;
}
default  {
    timer() {
        integer b;
        if (v())
            return 1;
        else if (v())
            return (integer)"bar";
        else if (v()) {
            integer g = 0;
            return 0;
        }
        else
            b = llAbs(6);
        v();
        for (b = 0; b < 70; ++b) {
            b = 6;
        }
        for (b = 0; b < 70; ++b)
            b = 6;
    }
}
`);
    });

    it('formatter_003', async () => {
        options.set(`formatter`, `style`, 1);
        options.set(`formatter`, `space`, 2);

        const toks = await parse_snippet(`v() {}default {timer() {if (1) {}else {}}}`);
        // string.c_escape(await formatter(toks)).replace(/\s/g, `sp`)
        expect(await formatter(toks)).toBe(`
v() {

}
default  {
    timer() {
        if (1) {
        
        }
        else  {
        
        }
    }
}
`);
    });

    it('formatter_004', async () => {
        options.set(`formatter`, `style`, 1);
        options.set(`formatter`, `space`, 3);

        const toks = await parse_snippet(`default {timer() {integer d = 0;if (1);for (d = 0; d < 90; ++d);for (d = 0; d < 90; ++d);}}`);
        // string.c_escape(await formatter(toks)).replace(/\s/g, `sp`)
        expect(await formatter(toks)).toBe(`
default  {
	timer() {
		integer d = 0;
		if (1);
		for (d = 0; d < 90; ++d);
		for (d = 0; d < 90; ++d);
	}
}
`);
    });

    it('formatter_005', async () => {
        options.set(`formatter`, `style`, 1);
        options.set(`formatter`, `space`, 3);

        const toks = await parse_snippet(`integer a;default {state_entry() {if(a < 0) {if (a == -1) {}else {if (a == -2) {}else {if (a == -2) {}else {}}}}}timer() {if(a < 0) {if (a == -1) {}else {if (a == -2) {}else {if (a == -2) {}else {}}}}}}`);
        // string.c_escape(await formatter(toks)).replace(/\s/g, `sp`)
        expect(await formatter(toks)).toBe(`
integer a;
default  {
	state_entry() {
		if (a < 0) {
			if (a == -1) {
			
			}
			else  {
				if (a == -2) {
				
				}
				else  {
					if (a == -2) {
					
					}
					else  {
					
					}
				}
			}
		}
	}
	timer() {
		if (a < 0) {
			if (a == -1) {
			
			}
			else  {
				if (a == -2) {
				
				}
				else  {
					if (a == -2) {
					
					}
					else  {
					
					}
				}
			}
		}
	}
}
`);
    });

    it('formatter_006', async () => {
        options.set(`formatter`, `style`, 1);
        options.set(`formatter`, `space`, 3);

        const toks = await parse_snippet(`default {state_entry() {if (3 < 0) {integer d = 7;}llDie();}}`);
        // string.c_escape(await formatter(toks)).replace(/\s/g, `sp`)
        expect(await formatter(toks)).toBe(`
default  {
	state_entry() {
		if (3 < 0) {
			integer d = 7;
		}
		llDie();
	}
}
`);
    });


    xit(`error_00`, async () => { expect(true).toBeFalse(); });
});