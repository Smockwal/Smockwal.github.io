import { type_error } from "../../../error.js";
import { kind_of } from "../../../global.js";
import { string } from "../../../text/string.js";
import { expr } from "../../expressions.js";
import { src } from "../../source.js";
import { token } from "../../token.js";
import { fast_tokens_fact } from "../../tokens.js";
import { lllist } from "./lllist.js";
import { next_exp } from "./script.js";


const to_json = obj => {
    let ret = [];
    obj.entries.map((m, i) => {
        ret = [...ret, `"${m.key}"`, `:`];
        if (m.value.front.op === `{`) ret = [...ret, to_json(new llobj(m.value.front))];
        else if (m.value.front.op === `[`) ret = [...ret, new lllist(m.value.front).str];
        else ret = [...ret, m.value.str];
        if (i !== obj.entries.length - 1) ret = [...ret, `,`];
    });
    return [`{`, ...ret, `}`].join(``);
};

const entry_index = (obj, key) => {
    for (let i = 0; i < obj.entries.length; ++i)
        if (obj.entries[i].key === key) return i;
    return -1;
};

class entry {
    #key;
    #value;
    
    constructor(key, value) {
        if (key) this.key = key;
        if (value) this.value = value;
    }

    get kind() { return `llobj_entry`; }

    get key() { return this.#key; }
    set key(x) {
        if (kind_of(x) !== `string`) throw new type_error(`key is of the wrong type.`);
        this.#key = x;
    }

    get value() { return this.#value; }
    set value(x) {
        const kind = kind_of(x);
        if (kind !== `expr` && kind !== `tokens`) throw new type_error(`value is of the wrong type.`);
        this.#value = x;
    }
};

export class llobj {
    #entries = [];
    #exp

    constructor(tok) { if (tok) this.parse(tok); }

    get kind() { return `llobj`; }

    /** @returns {Number} */
    get length() { return this.#entries.length; }

    get entries() {return this.#entries; };

    /** @returns {String} */
    get str() { return string.c_escape(to_json(this)); }

    get jstr() {
        let ret = [];
        this.#entries.map((m, i) => {
            ret = [...ret, `"${m.key}"`, `:`];
            if (m.value.front.op === `{`) ret = [...ret, new llobj(m.value.front).jstr];
            else if (m.value.front.op === `[`) ret = [...ret, new lllist(m.value.front).jstr];
            else ret = [...ret, m.value.str];
            if (i !== this.#entries.length - 1) ret = [...ret, `,`];
        });
        return [`{`, ...ret, `}`].join(``);
    }

    get expr_ref() { return this.#exp; }
    get exp() { return this.#exp; }

    get expr() {
        const ret = fast_tokens_fact([`{`]);
        this.#entries.map((m, i) => {
            ret.push_back(new token(`"${m.key}"`));
            ret.push_back(new token(`:`));
            ret.copy(m.value);
            if (i !== this.#entries.length - 1) ret.push_back(new token(`,`));
        });
        ret.push_back(new token(`}`));
        return expr.align_location(src.flag_tokens(ret));
    }

    parse(tok) {
        this.#entries = [];
        this.#exp = expr.match(tok);
        //console.log(this.#entries, this.#exp);
        
        if (tok.op !== `{`)
            return this;

        for (let it = this.#exp.front; this.#exp.end(it); it = this.#exp.next(it)) {
            if (it.next && it.next.op == `:`) {
                const str = it.str;
                if (!str.startsWith(`"`) || !str.endsWith(`"`)) {
                    this.#entries = {};
                    return this;
                }
                this.set(string.clip(it.str), next_exp(it.next));
            }
        }

        //console.log(this.#entries, this.#exp);
        return this;
    }

    /** @returns {Boolean} */
    empty() {return this.#entries.length === 0; }

    keys() {
        const ret = [];
        for (let i = 0; i < this.length; ++i) {
            ret.push(this.#entries[i].key);
        }
        return ret;
    };

    get(id) {
        for (let i = 0; i < this.length; ++i)
            if (this.#entries[i].key === id)
                return this.#entries[i].value;
        return undefined;
    };
    at(id) { return this.get(id); }

    set(id, value) {
        const e = entry_index(this, id);
        if (e !== -1) this.#entries[e].value = value;
        else this.#entries.push(new entry(id, value));
        this.sanitize();
    };

    has(id) { return this.get(id) !== undefined; }

    rem(id) {
        for (let i = 0; i < this.length; ++i)
            if (this.#entries[i].key === id)
                this.#entries.splice(i, 1);
        this.sanitize();
    }

    add(id, value) { return this.#entries.push(new entry(id, value)); }

    sanitize() {
        for (let i = 0; i < this.length; ++i) {
            const e = entry_index(this, this.#entries[i].key);
            if (e !== i) {
                this.#entries[e].value = this.#entries[i].value;
                this.#entries.splice(i, 1);
            }
        }
        return this;
    };
} 


