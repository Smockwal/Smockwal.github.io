import { array } from "../../../array.js";
import { type_error } from "../../../error.js";
import { flag, kind_of } from "../../../global.js";
import { euler_set, eulerd } from "../../../math/euler.js";
import { numb } from "../../../math/number.js";
import {
    QW, QX, QY, QZ,
    quat_angle_between, quat_from_axis_angle, quat_from_euler, quat_is_fuzzy_null, quat_is_null, quat_neg, quat_normalize, quat_set, quatd
} from "../../../math/quaternion.js";
import {
    vec3_cross, vec3_dist, vec3_dot,
    vec3_is_null, vec3_length, vec3_mult, vec3_normalize, vec3d
} from "../../../math/vec3.js";
import { char } from "../../../text/char.js";
import { regex } from "../../../text/regex.js";
import { string, u32 } from "../../../text/string.js";
import { src } from "../../source.js";
import { fast_tokens_fact as ftsf, tokens } from "../../tokens.js";
import { llfloat } from "./llfloat.js";
import { llint } from "./llint.js";
import { mono_lower_map, mono_upper_map } from "./lliteral.js";
import { llkey } from "./llkey.js";
import { lllist } from "./lllist.js";
import { llobj } from "./llobj.js";
import { llquat } from "./llquat.js";
import { llspec } from "./llspec.js";
import { llstr } from "./llstr.js";
import { llvec } from "./llvec.js";
import { cast_to } from "./optimizing.js";
import { eval_exp_type } from "./parsing.js";


const xp_err = [
    `"no error"`,
    `"exceeded throttle"`,
    `"experiences are disabled"`,
    `"invalid parameters"`,
    `"operation not permitted"`,
    `"script not associated with an experience"`,
    `"not found"`,
    `"invalid experience"`,
    `"experience is disabled"`,
    `"experience is suspended"`,
    `"unknown error"`,
    `"experience data quota exceeded"`,
    `"key-value store is disabled"`,
    `"key-value store communication failed"`,
    `"key doesn't exist"`,
    `"retry update"`,
    `"experience content rating too high"`,
    `"not allowed to run in current location"`,
    `"experience permissions request timed out"`
];

const b64tostr_re = /(?<a>[\x09\x0A\x0F\x1F-\x7F\xFE\xFF]|[\xC2-\xDF][\x80-\xBF]|(?:\xE0[\xA0-\xBF]|[\xE1-\xEF][\x80-\xBF])[\x80-\xBF]|(?:\xF0[\x90-\xBF]|[\xF1-\xF7][\x80-\xBF])[\x80-\xBF]{2}|(?:\xF8[\x88-\xBF]|[\xF9-\xFB][\x80-\xBF])[\x80-\xBF]{3}|(?:\xFC[\x84-\xBF]|\xFD[\x80-\xBF])[\x80-\xBF]{4}|\x00$)|(?<b>[\x00-\x1F\x80-\xBF]|[\xC0-\xDF][\x80-\xBF]?|[\xE0-\xEF][\x80-\xBF]{0,2}|[\xF0-\xF7][\x80-\xBF]{0,3}|[\xF8-\xFB][\x80-\xBF]{0,4}|[\xFC-\xFD][\x80-\xBF]{0,5})|(?<c>.)/g;

const index = (i, len) => {
    if (typeof i === `string`)
        i = numb.parse(i);
    if (i < 0) i = len + i;
    return i;
};

export const trim_mono_string = arr => {
    // https://www.charset.org/utf-8
    const utf8 = new TextDecoder(`utf-8`);
    let str_out = ``, last = 0, invalid_length = 0;

    for (let i = 0; i < arr.length; ++i) {
        if (
            numb.between(arr[i], 0x00, 0x7F) ||
            (numb.between(arr[i], 0xC2, 0xDF) && numb.between(arr[i + 1], 0x80, 0xBF)) ||
            ((numb.between(arr[i], 0xE1, 0xEC) || arr[i] === 0xEE) && numb.between(arr[i + 1], 0x80, 0xBF) && numb.between(arr[i + 2], 0x80, 0xBF)) ||
            (arr[i] === 0xE0 && numb.between(arr[i + 1], 0xA0, 0xBF) && numb.between(arr[i + 2], 0x80, 0xBF)) ||
            (arr[i] === 0xED && numb.between(arr[i + 1], 0x80, 0x9F) && numb.between(arr[i + 2], 0x80, 0xBF)) ||
            (arr[i] === 0xEF && numb.between(arr[i + 1], 0x80, 0xBE) && numb.between(arr[i + 2], 0x80, 0xBF)) ||
            (arr[i] === 0xEF && arr[i + 1] === 0xBF && (numb.between(arr[i + 2], 0x80, 0xBD) || arr[i + 2] === 0xBF)) ||
            (arr[i] === 0xF0 && numb.between(arr[i + 1], 0x90, 0xBF) && numb.between(arr[i + 2], 0x80, 0xBF) && numb.between(arr[i + 3], 0x80, 0xBF)) ||
            (numb.between(arr[i], 0xF1, 0xF3) && numb.between(arr[i + 1], 0x80, 0xBF) && numb.between(arr[i + 2], 0x80, 0xBF) && numb.between(arr[i + 3], 0x80, 0xBF)) ||
            (arr[i] === 0xF4 && numb.between(arr[i + 1], 0x80, 0x8F) && numb.between(arr[i + 2], 0x80, 0xBF) && numb.between(arr[i + 3], 0x80, 0xBF))) {

            invalid_length = i - last;

            let len = 0;
            if (arr[i] < 0xC0) len = 1;
            else if (arr[i] < 0xE0) len = 2;
            else if (arr[i] <= 0xEF) len = 3;
            else len = 4;

            str_out += ``.padEnd(invalid_length, `?`);
            str_out += utf8.decode(arr.subarray(i, i + len));
            last = i + len;
            i += (len - 1);
        }
    }

    invalid_length = arr.length - last;
    str_out += ``.padEnd(invalid_length, `?`);

    const idx = str_out.indexOf(`\0`);
    if (idx < 0) return str_out;
    return str_out.substring(0, idx);
};

const jobj = exp => {
    const first = exp.front ? exp.front : exp;
    if (first.op === `[`) return new lllist(first);
    else if (first.op === `{`) return new llobj(first);
    return exp.str;
};

export const llfunc = {
    llAbs: arg => {
        let num0 = numb.parse(arg[0].str);

        num0 = Math.abs(num0);
        if (num0 > 2147483647)
            num0 = Math.abs(num0 - 4294967296);
        return ftsf([`${num0}`]);
    },
    llAcos: arg => {
        const num = numb.parse(arg[0].str);
        let val;
        if (numb.fast_nan(arg[0].str)) val = NaN;
        else val = Math.acos(num);
        return ftsf([llfloat.format(`${val}`)]);
    },
    llAngleBetween: arg => {
        const q0 = new llquat(arg[0].front).to_quat(),
            q1 = new llquat(arg[1].front).to_quat();

        if (quat_is_null(q0)) quat_set(q0, 0, 0, 0, 1);
        if (quat_is_null(q1)) quat_set(q1, 0, 0, 0, 1);
        return ftsf([`${quat_angle_between(q0, q1)}`]);
    },
    llAsin: arg => {
        const num = numb.parse(arg[0].str);
        let val;
        if (numb.fast_nan(arg[0].str)) val = NaN;
        else val = Math.asin(num);
        return ftsf([llfloat.format(`${val}`)]);
    },
    llAtan2: arg => {
        let y = numb.parse(arg[0].str),
            x = numb.parse(arg[1].str);

        const val = llfloat.format(Math.atan2(y, x));
        return ftsf([val]);
    },
    llAxes2Rot: arg => {
        const fwd = new llvec(arg[0].front).to_vec3(),
            left = new llvec(arg[1].front).to_vec3(),
            up = new llvec(arg[2].front).to_vec3();

        //console.log(`fwd:`, fwd);

        let t = fwd[0] + left[1] + up[2];
        //console.log(`t:`, t);
        const q = new quatd();
        if (t > 0) {
            let r = Math.sqrt(1. + t);
            let s = 0.5 / r;
            quat_set(q, s * (left[2] - up[1]), s * (up[0] - fwd[2]), s * (fwd[1] - left[0]), r * 0.5);
            //console.log(`q:`, q);
        }
        else if (left[1] <= fwd[0] && fwd[0] >= up[2]) { // left[1] <= fwd[0] >= up[2]
            let r = Math.sqrt(1. + fwd[0] - left[1] - up[2]);
            let s = 0.5 / r;
            quat_normalize(quat_set(q, r * 0.5, s * (fwd[1] + left[0]), s * (up[0] + fwd[2]), s * (left[2] - up[1])));
        }
        else if (fwd[0] <= left[1] && left[1] >= up[2]) { // fwd[0] <= left[1] >= up[2]
            let r = Math.sqrt(1. - fwd[0] + left[1] - up[2]);
            let s = 0.5 / r;
            quat_normalize(quat_set(q, s * (fwd[1] + left[0]), r * 0.5, s * (left[2] + up[1]), s * (up[0] - fwd[2])));
        }
        else {
            let r = Math.sqrt(1. - fwd[0] - left[1] + up[2]);
            let s = 0.5 / r;
            quat_normalize(quat_set(q, s * (up[0] + fwd[2]), s * (left[2] + up[1]), r * 0.5, s * (fwd[1] - left[0])));
        }

        if (quat_is_null(q)) quat_set(q, 0, 0, 0, 1);
        return new llquat(q).expr;
    },
    llAxisAngle2Rot: arg => {
        const axis = new llvec(arg[0].front).to_vec3();
        let angle = numb.parse(arg[1].str);

        vec3_normalize(axis);
        if (vec3_is_null(axis)) angle = 0;

        const q = quat_from_axis_angle(axis, angle, new quatd())
        return new llquat(q).expr;
    },
    llBase64ToInteger: arg => {
        const str = string.clip(arg[0].str);
        if (str.length <= 8) {
            const buff = new Uint8Array([...atob(string.format_b64(str))].map(c => c.charCodeAt()));
            const uni = buff[0] < 128 ? buff[0] : buff[0] - 256;
            return `${(uni << 24) | (buff[1] << 16) | (buff[2] << 8) | buff[3]}`;
        }
        return `0`;
    },
    llBase64ToString: arg => {
        let str = string.clip(arg[0].str);
        str = atob(string.format_b64(str));

        let str_out = ``;
        for (const m of [...str.matchAll(b64tostr_re)]) {
            if (m.groups.c) throw new Error(`Fail in b64tostr_re: ` + m.groups.c);
            if (m.groups.b) str_out += `?`;
            else str_out += m.groups.a;
        }

        const bytes = Uint8Array.from(str_out, m => m.codePointAt(0));
        const ret = trim_mono_string(bytes);
        return ftsf([`"${ret}"`]);
    },
    llCeil: arg => {
        let tmp = numb.parse(arg[0].str);
        let val;
        if (!numb.is_finite(tmp) || !numb.between(tmp, -2147483648, 2147483648))
            val = `-2147483648`;
        else val = `${Math.ceil(tmp)}`;
        return ftsf([val]);
    },
    llChar: arg => {
        let code = numb.parse(arg[0].str);

        if (!numb.between(code, 1, 0x10FFFF) || numb.between(code, 0xD800, 0xDFFF) || code === 0xFFFE || code === 0xFFFF) {
            return `"${code === 0 ? "" : "\uFFFD"}"`;
        }
        else {
            let txt = "";
            if (code > 0x010000) {
                code -= 0x010000;
                txt += String.fromCharCode((code >> 10) + 0xD800);
                txt += String.fromCharCode((code % 0x400) + 0xDC00);
            } else txt += String.fromCharCode(code);
            return `"${txt}"`;
        }
    },
    llCos: arg => {
        let num = numb.parse(arg[0].str);
        //console.log(num, Math.cos(num))
        return ftsf([llfloat.format(`${Math.cos(num)}`, 16)]);
    },
    llDeleteSubList: arg => {
        const list = new lllist(arg[0].front),
            start = index(arg[1].str, list.length),
            end = index(arg[2].str, list.length);

        const len = list.length - 1;
        return `[${list.entries.filter((v, i) => {
            if (start > end) {
                if (end < 0) {
                    if (start < 0) return !numb.between(i, start, len);
                    return !numb.between(i, start, len);
                }
                return (!numb.between(i, 0, end) && !numb.between(i, start, len))
            }
            return !numb.between(i, start, end);
        }).map(m => m.str).join(`, `)}]`;
    },
    llDeleteSubString: arg => {
        let txt = string.clip(arg[0].str),
            start = index(arg[1].str, txt.length),
            end = index(arg[2].str, txt.length);
        //console.log(`start:`, start, `end:`, end);

        const len = txt.length - 1;
        return ftsf([`"${[...txt].filter((v, i) => {
            if (start > end) {
                if (end < 0) {
                    if (start < 0) return !numb.between(i, start, len);
                    return !numb.between(i, start, len);
                }
                return (!numb.between(i, 0, end) && !numb.between(i, start, len))
            }
            return !numb.between(i, start, end);
        }).join(``)}"`]);
    },
    llDumpList2String: arg => {
        const list = new lllist(arg[0].front), sep = string.clip(arg[1].str);
        const aout = list.entries.map(m => cast_to(m, `string`).str);
        return `"${aout.map(string.clip).join(sep)}"`;
    },
    llEscapeURL: arg => {
        let str = string.clip(arg[0].str), val = "";

        const ue = { '\\n':'\u000A' , '\\f':'\u000C' , '\\r':'\u000D' , '\\t':'\u0009' , '\\v':'\u000B' , '\\b':'\u0008' , '\\a':'\u0007'  };
        str = str.replace(/\\[nfrtvba]/g, m => ue[m]);

        const arr = new Uint8Array(1),
            view = new DataView(arr.buffer),
            encoder = new TextEncoder();

        for (const code of encoder.encode(str)) {
            if (numb.between(code, 0x30, 0x39) || numb.between(code, 0x41, 0x5A) || numb.between(code, 0x61, 0x7A))
                val += String.fromCodePoint(code);
            else {
                view.setUint8(0, code, true);
                val += `%${code.toString(16).toUpperCase().padStart(2, '0')}`;
            }
        }
        return ftsf([`"${val}"`]);
    },
    llEuler2Rot: arg => {
        let e = new eulerd(new llvec(arg[0].front).to_vec3());
        const r = quat_from_euler(e, new quatd());

        const c0 = Math.cos(e[0]);
        const c1 = Math.cos(e[1]);
        const c2 = Math.cos(e[2]);

        const s0 = Math.sin(e[0]);
        const s1 = Math.sin(e[1]);
        const s2 = Math.sin(e[2]);

        const d1 = c1 * c2;
        const d2 = c0 * c2 - s0 * s1 * s2;
        const d3 = c0 * c1;

        if ((d1 + d2 + d3) > 0 && r[3] < 0) quat_neg(r);
        else {
            let i = 0
            if (d2 > d1) i = 1;
            if ((d1 < d3) && (d3 > d2)) i = 2;
            if (r[i] < 0) quat_neg(r);
        }
        return new llquat(r).expr;
    },
    llFabs: arg => {
        let tmp = numb.parse(arg[0].str);
        tmp = `${llfloat.format(Math.abs(tmp), 16)}`;
        return ftsf([tmp]);
    },
    llFloor: arg => {
        let num = numb.parse(arg[0].str);
        let val
        if (!numb.is_finite(num) || !numb.between(num, -2147483648, 2147483648))
            val = `-2147483648`;
        else val = `${llint.i32(Math.floor(num))}`;
        return ftsf([val]);
    },
    llFrand: arg => {
        let num = numb.parse(arg[0].str);
        if (num === 0 || string.is_inf(num)) return ftsf([`0.0`]);
        else if (numb.fast_nan(num)) return ftsf([`NaN`]);
    },
    llGetExperienceErrorMessage: arg => {
        const num = numb.parse(arg[0].str);
        if (numb.between(num, 0, xp_err.length - 1))
            return xp_err[num];
        return `"unknown error id"`;
    },
    llGetListEntryType: arg => {
        const list = new lllist(arg[0].front),
            idx = index(arg[1].str, list.length);

        let val = `0`;
        if (numb.between(idx, 0, list.length - 1)) {
            const type = [`void`, `float`, `integer`, `string`, `key`, `vector`, `rotation`];
            val = type.indexOf(eval_exp_type(list.at(idx)));
        }
        return ftsf(`${val}`);
    },
    llGetListLength: arg => ftsf([`${new lllist(arg[0].front).length}`]),
    llGetSubString: arg => {
        let txt = string.clip(arg[0].str),
            start = index(arg[1].str, txt.length),
            end = index(arg[2].str, txt.length);

        //console.log(`src:`, src, `start:`, start, `end:`, end);
        const len = txt.length - 1;
        txt = [...txt].filter((v, i) => {
            if (start > end) {
                if (end < 0) {
                    if (start < 0) return numb.between(i, start, len);
                    return numb.between(i, start, len);
                }
                return (numb.between(i, 0, end) || numb.between(i, start, len))
            }
            return numb.between(i, start, end);
        });

        return `"${txt.join(``)}"`;
    },
    llHash: arg => {
        let txt = new u32(string.clip(arg[0].str));

        let hash = 0;
        for (let i = 0; i < txt.length; ++i)
            hash = txt[i] + (hash << 6) + (hash << 16) - hash;
        return ftsf([`${hash}`]);
    },
    llInsertString: arg => {
        let txt = string.clip(arg[0].str),
            idx = numb.parse(arg[1].str),
            rep = string.clip(arg[2].str);

        let val;
        if (numb.between(idx, 1, txt.length - 1))
            val = `"${txt.slice(0, idx)}${rep}${txt.slice(idx)}"`;
        else if (idx <= 0) val = `"${rep}${txt}"`;
        else if (idx > txt.length - 1) val = `"${txt}${rep}"`;
        return ftsf([val]);
    },
    llIntegerToBase64: arg => {
        const num = numb.parse(arg[0].str);
        const buff = new Uint8Array([(num >> 24) & 255, (num >> 16) & 255, (num >> 8) & 255, num & 255]);
        return `"${btoa(String.fromCharCode.apply(null, buff))}"`;
    },
    llJson2List: arg => {
        let str = string.clip(arg[0].str).replaceAll(`\\"`, `"`);

        if (string.empty(str))
            return ftsf([`[`, `]`]);
        else if (!char.is_one_of(str[0], `{["`) || (str[0] !== `"` && str[str.length - 1] !== char.closing_char(str[0])))
            return ftsf([`[`, `"${str}"`, `]`]);

        const json = JSON.parse(str);
        if (typeof json === `string`)
            return ftsf([`[`, `"${json}"`, `]`]);
        else if (typeof json === `number`)
            return ftsf([`[`, `${json}`, `]`]);

        let aout = [];
        if (array.is_array(json)) {
            for (let i = 0; i < json.length; ++i) {
                switch (typeof json[i]) {
                    case `boolean`: {
                        if (json[i]) aout.push(llspec.constants.JSON_TRUE.value);
                        else aout.push(llspec.constants.JSON_FALSE.value);
                    } break;

                    case `number`: aout.push(`${json[i]}`); break;
                    case `string`: aout.push(`"${string.c_escape(json[i])}"`); break;

                    case `object`: {
                        const entry = JSON.stringify(json[i]);
                        aout.push(`"${string.c_escape(entry)}"`);
                    } break;

                    default: throw new Error(`Unknow type.`);
                }
            }
        }
        else if (typeof json === `object`) {
            const keys = Object.keys(json);
            for (let i = 0; i < keys.length; ++i) {
                aout.push(`"${keys[i]}"`);
                switch (typeof json[keys[i]]) {
                    case `boolean`: {
                        if (json[i]) aout.push(llspec.constants.JSON_TRUE.value);
                        else aout.push(llspec.constants.JSON_FALSE.value);
                    } break;

                    case `number`: aout.push(`${json[keys[i]]}`); break;
                    case `string`: aout.push(`"${string.c_escape(json[keys[i]])}"`); break;

                    case `object`: {
                        const entry = JSON.stringify(json[keys[i]]);
                        aout.push(`"${string.c_escape(entry)}"`);
                    } break;

                    default: throw new Error(`Unknow type.`);
                }
            }
        }

        aout = aout.flatMap((v, i, a) => a.length - 1 !== i ? [v, `,`] : v)
        return ftsf([`[`, ...aout, `]`])
    },
    llJsonGetValue: arg => {
        const str = string.clip(arg[0].str).replaceAll(`\\"`, `"`),
            list = new lllist(arg[1].front);

        if (string.empty(str)) return ftsf([`"﷐"`]);
        const jtoks = src.flag_tokens(new tokens(str));
        

        let curr = jobj(jtoks);
        for (let i = 0; i < list.length; ++i) {
            let index = list.at(i).str;
            if (string.is_numb(index)) {
                const n = numb.parse(index);
                if (kind_of(curr) === `llobj` || !numb.between(n, 0, curr.length - 1))
                    return ftsf([`"﷐"`]);
                curr = jobj(curr.at(n));
            }
            else {
                const c = string.clip(index);
                if (kind_of(curr) === `lllist` || !curr.has(c))
                    return ftsf([`"﷐"`]);
                curr = jobj(curr.at(c));
            }
        }

        const kind = kind_of(curr);
        if (kind === `lllist` || kind === `llobj`)
            curr = string.c_escape(curr.jstr);
        else if (curr.startsWith(`"`))
            curr = string.clip(curr);

        if (curr === `null`) curr = `\uFDD5`;
        else if (curr === `true`) curr = `\uFDD6`;
        else if (curr === `false`) curr = `\uFDD7`;

        //return src.flag_tokens(new tokens(`"${curr}"`))
        return ftsf([`"${curr}"`]);
    },
    llJsonSetValue: arg => {
        const str = string.clip(arg[0].str.replaceAll(`\\"`, `"`)),
            list = new lllist(arg[1].front);
        let value = string.clip(arg[2].str.replaceAll(`\\"`, `"`));
        //console.log(`str`,str,`list`,list,`value`,value);

        const jappend = [`-1`, `0xFFFFFFFF`, `JSON_APPEND`].includes(list.last.front.str);
        const jdelete = [`﷘`, `JSON_DELETE`].includes(value);

        if (!jdelete) {
            if (value === `\uFDD5`) value = `null`;
            else if (value === `\uFDD6` || value === `true`) value = `true`;
            else if (value === `\uFDD7` || value === `false`) value = `false`;
            else if (!llstr.is_lsl_numb(value)) {
                if (!value.startsWith(`"`)) value = `"${value}"`;
            }
        }

        let jtoks = new tokens(str), curr, index;
        if (jtoks.empty()) {
            if (string.is_numb(list.at(0).str))
                jtoks = new tokens(`[]`);
            else jtoks = new tokens(`{}`);
        }
        //console.log(jtoks);

        curr = jobj(src.flag_tokens(jtoks));
        //console.log(curr);

        // Make path
        for (let i = 0; i < list.length - 1; ++i) {
            index = list.at(i).str;
            //console.log(`index`,index);
            const next_lvl = string.is_numb(list.at(i + 1).str) ? `[]` : `{}`;

            if (string.is_numb(index)) {
                index = numb.parse(index);
                if (kind_of(curr) === `llobj` || index > curr.length) return new tokens(`"﷐"`);

                if (index === curr.length) {
                    curr.push_back(src.flag_tokens(new tokens(next_lvl)));
                    curr = jobj(jtoks.replace(curr.exp, curr.expr));
                }
                else if (curr.at(index).front.op !== next_lvl[0]) {
                    curr.entries[index] = src.flag_tokens(new tokens(next_lvl));
                    curr = jobj(jtoks.replace(curr.exp, curr.expr));
                }
            }
            else {
                index = string.clip(index);
                if (kind_of(curr) === `lllist`) return new tokens(`"﷐"`);

                if (!curr.has(index) || curr.at(index).front.op !== next_lvl[0]) {
                    curr.set(index, src.flag_tokens(new tokens(next_lvl)));
                    curr = jobj(jtoks.replace(curr.exp, curr.expr));
                }
            }
            curr = jobj(curr.at(index));
        }

        // Set value
        if (kind_of(curr) === `lllist`) {
            index = numb.parse(list.last.str);
            if (jappend) curr.push_back(new tokens(value));
            else if (index > curr.length) return new tokens(`"﷐"`);
            else if (jdelete) {
                if (numb.between(index, 0, curr.length - 1))
                    curr.entries.splice(index, 1);
                else return new tokens(`"﷐"`);
            }
            else curr.entries[index] = new tokens(value);
        }
        else {
            index = string.clip(list.last.str);
            if (jdelete) {
                if (curr.has(index)) curr.rem(index);
                else return new tokens(`"﷐"`);
            }
            else curr.set(index, new tokens(value));
        }

        //console.log(jtoks, curr.jstr, curr.exp, curr.expr);
        jtoks.replace(curr.exp, curr.expr);
        //jtoks = `"${string.c_escape(jobj(jtoks).jstr)}"`;
        //return src.flag_tokens(new tokens(jtoks));
        return ftsf([`"${string.c_escape(jobj(jtoks).jstr)}"`]);
    },
    llJsonValueType: arg => {
        const str = string.clip(arg[0].str.replaceAll(`\\"`, `"`)),
            list = new lllist(arg[1].front);

        const jtoks = src.flag_tokens(new tokens(str));

        let curr = jobj(jtoks), value;
        let kind = kind_of(curr);
        if (kind === `llobj`) value = `\uFDD1`;
        else if (kind === `lllist`) value = `\uFDD2`;
        else value = curr;

        for (let i = 0; i < list.length; ++i) {
            let index = list.at(i).str;
            if (string.is_numb(index)) {
                index = numb.parse(index);
                if (kind === `llobj` || !numb.between(index, 0, curr.length - 1))
                    return ftsf([`"﷐"`]);
            }
            else {
                index = string.clip(index);
                if (kind === `lllist` || !curr.has(index))
                    return ftsf([`"﷐"`]);
            }

            curr = jobj(curr.at(index));
            if (!curr) return ftsf([`"﷐"`]);
            kind = kind_of(curr);

            

            if (kind === `llobj`) value = `\uFDD1`;
            else if (kind === `lllist`) value = `\uFDD2`;
            else value = curr;
        }

        if (!value) return ftsf([`"﷐"`]);
        if (value.front) value = value.str;
        value = value.replace(/^[-+]\s+(?=\d)/, `-`);

        if (value !== `\uFDD1` && value !== `\uFDD2`) {
            if (value === `null`) value = `\uFDD5`;
            else if (value === `true`) value = `\uFDD6`;
            else if (value === `false`) value = `\uFDD7`;
            else if (llstr.is_lsl_numb(value)) value = `\uFDD3`;
            else if (value.startsWith(`"`) && value.endsWith(`"`)) value = `\uFDD4`;
            else value = `﷐`;
        }

        return ftsf([`"${value}"`]);
    },
    llLinear2sRGB: arg => {
        // https://www.w3.org/Graphics/Color/srgb
        const vec = new llvec(arg[0].front).to_vec3();
        for (let i = 0; i < 3; ++i) {
            vec[i] = (vec[i] <= 0.00313066844250063) ? vec[i] * 12.92 : 1.055 * vec[i] ** (1 / 2.4) - 0.055;
        }
        return new llvec(vec).expr;
    },
    llList2CSV: arg => {
        const list = new lllist(arg[0].front);
        const aout = list.entries.map(m => cast_to(m, `string`).str);
        return ftsf([`"${aout.map(string.clip).join(`, `)}"`]);
    },
    llList2Float: arg => {
        const list = new lllist(arg[0].front),
            idx = index(arg[1].str, list.length);

        if (!list.empty() && idx < list.length) {
            let vt = list.at(idx).front;
            if (vt.flag & (flag.NUMBER_FLAG | flag.STRING_FLAG)) {
                if (string.is_float(vt.str)) return vt.str;
                else return cast_to(list.at(idx), `float`);
            }
        }
        return `0.`;
    },
    llList2Integer: arg => {
        const list = new lllist(arg[0].front),
            idx = index(arg[1].str, list.length);

        if (!list.empty() && idx < list.length) {
            let vt = list.at(idx).front;
            if (vt.flag & (flag.NUMBER_FLAG | flag.STRING_FLAG)) {
                if (string.is_integer(vt.str)) return vt.str;
                else return cast_to(list.at(idx), `integer`);
            }
        }
        return `0`;
    },
    llList2Json: arg => {
        const str = string.clip(arg[0].str), list = new lllist(arg[1].front);
        if (![`\uFDD1`, `\uFDD2`].includes(str)) return new tokens(`"﷐"`);

        const is_obj = str === `\uFDD1`;
        const obj = is_obj ? new llobj() : new lllist();

        for (let i = 0; i < list.length; ++i) {
            let key, value;
            if (is_obj) {
                if ((i + 1) >= list.length || !list.at(i).str.startsWith(`"`)) return new tokens(`"﷐"`);
                key = string.clip(list.at(i).str);
                value = list.at(++i).str;
            }
            else
                value = list.at(i).str;

            if (value.startsWith(`"`))
                value = string.clip(value);

            if (value === `\uFDD5`) value = `null`;
            else if (value === `\uFDD6` || value === `true`) value = `true`;
            else if (value === `\uFDD7` || value === `false`) value = `false`;
            else if (value.startsWith(`[`) && value.endsWith(`]`));
            else if (value.startsWith(`{`) && value.endsWith(`}`));
            else if (!llstr.is_lsl_numb(value)) {
                if (!value.startsWith(`"`)) value = `"${value}"`;
            }

            value = src.flag_tokens(new tokens(value));

            if (is_obj) obj.add(key, value);
            else obj.push_back(value);
        }
        return ftsf([`"${string.c_escape(obj.jstr)}"`]);
    },
    llList2Key: arg => {
        const list = new lllist(arg[0].front),
            idx = index(arg[1].str, list.length);

        if (!list.empty() && idx < list.length) {
            let vt = list.at(idx).front;
            if (vt.str === `(key)`) vt = list.at(idx).front.next;
            if (vt.flag & flag.STRING_FLAG)
                return ftsf([`(`, `(key)`, vt.str, `)`]);
        }
        return ftsf([`(`, `(key)`, `""`, `)`]);
    },
    llList2List: arg => {
        const list = new lllist(arg[0].front),
            start = index(arg[1].str, list.length),
            end = index(arg[2].str, list.length);

        //console.log(`src:`, src, `start:`, start, `end:`, end);
        const len = list.length - 1;
        return `[${list.entries.filter((v, i) => {
            if (start > end) {
                if (end < 0) {
                    if (start < 0) return numb.between(i, start, len);
                    return numb.between(i, start, len);
                }
                return (numb.between(i, 0, end) || numb.between(i, start, len))
            }
            return numb.between(i, start, end);
        }).map(m => m.str).join(`, `)}]`;
    },
    llList2ListStrided: arg => {
        const list = new lllist(arg[0].front),
            stride = Math.abs(numb.parse(arg[3].str)) || 1;
        let start = index(arg[1].str, list.length),
            end = index(arg[2].str, list.length);

        if (start > end) { start = 0, end = list.length; }
        list.entries = list.entries.filter((v, i) => numb.between(i, start, end) && (i % stride) === 0);
        return list.expr;
    },
    llList2Rot: arg => {
        const list = new lllist(arg[0].front),
            idx = index(arg[1].str, list.length);

        if (!list.empty() && idx < list.length) {
            const vt = list.at(idx).front;
            if (vt.flag & flag.QUAT_OP_FLAG)
                return new llquat(vt).expr;
        }
        return llquat.def_str;
    },
    llList2String: arg => {
        const list = new lllist(arg[0].front),
            idx = index(arg[1].str, list.length);

        if (!list.empty() && idx < list.length)
            return cast_to(list.at(idx), `string`);
        return ftsf([`""`]);
    },
    llList2Vector: arg => {
        const list = new lllist(arg[0].front),
            idx = index(arg[1].str, list.length);

        if (!list.empty() && idx < list.length) {
            const vt = list.at(idx).front;
            if (vt.flag & flag.VECTOR_OP_FLAG)
                return new llvec(vt).expr;
        }
        return llvec.def_str;
    },
    llListFindList: arg => {
        const list = new lllist(arg[0].front),
            path = new lllist(arg[1].front);

        const ls = list.length + 1 - path.length;
        top: for (let i = 0; list.length > 0 && i < ls; ++i) {
            for (let j = 0; j < path.length; ++j) {
                let ta = eval_exp_type(list.at(i + j)), tb = eval_exp_type(path.at(j));
                if (ta != tb) continue top;

                switch (ta) {
                    case `string`: {
                        if (list.at(i + j).str != path.at(j).str) continue top;
                    } break;

                    case `integer`: case `float`: {
                        const va = numb.parse(list.at(i + j).str), vb = numb.parse(path.at(j).str);
                        if (!numb.equals(va, vb)) continue top;
                    } break;

                    case `vector`: {
                        const va = new llvec(list.at(i + j).front), vb = new llvec(path.at(j).front);
                        if (!va.equals(vb)) continue top;
                    } break;

                    case `quaternion`: {
                        const va = new llquat(list.at(i + j).front), vb = new llquat(path.at(j).front);
                        if (!va.equals(vb)) continue top;
                    } break;

                    case `key`: {
                        const va = new llkey(list.at(i + j).front), vb = new llkey(path.at(j).front);
                        if (va.value !== vb.value) continue top;
                    } break;

                    default: throw new type_error(`Unknow type: ${ta}`);
                }
            }
            return `${i}`;
        }
        return `${-1}`

    },
    llListInsertList: arg => {
        const dest = new lllist(arg[0].front),
            list = new lllist(arg[1].front),
            start = numb.parse(arg[2].str);

        dest.entries.splice(start, 0, ...list.entries);
        return dest.expr;
    },
    llListReplaceList: arg => {
        let dest = new lllist(arg[0].front),
            list = new lllist(arg[1].front);

        let start = numb.parse(arg[2].str),
            end = numb.parse(arg[3].str);

        if (start < -dest.length) list.entries = [];
        if ((start < 0 ? start + dest.length : start) > (end < 0 ? end + dest.length : end)) {
            if (end === -1) end += dest.length;
            dest.entries = [...dest.entries.slice(end + 1, start), ...list.entries];
        }
        else {
            if (end < 0) end += dest.length;
            dest.entries = [...dest.entries.slice(0, start), ...list.entries, ...dest.entries.slice(end + 1, dest.length)];
        }
        return dest.expr;

    },
    llListSort: arg => { },
    llListStatistics: arg => {
        const op = numb.parse(arg[0].str),
            list = new lllist(arg[1].front);
        list.entries = list.entries.map(m => m.str).filter(string.is_numb).map(numb.parse);

        let val = `0.`;
        if (list.empty()) return val;

        switch (op) {
            case 0: case 1: case 2: {
                let min = Infinity, max = -Infinity;
                list.entries.map(v => {
                    if (v < min) min = v;
                    else if (v > max) max = v;
                });
                if (op === 0) val = `${Math.abs(max - min)}`;
                else if (op === 1) val = `${min}`;
                else if (op === 2) val = `${max}`;
            } break;

            case 3: val = `${list.entries.reduce((ps, a) => ps + a, 0) / list.length}`; break;

            case 4: {
                const sorted = list.entries.slice().sort((a, b) => a - b);
                //console.log(sorted);
                const mid = Math.floor(sorted.length / 2);

                if (list.entries.includes(NaN)) val = undefined;
                else if (list.length % 2) val = `${sorted[mid]}`;
                else val = `${(sorted[mid] + sorted[mid - 1]) / 2}`;
            } break;

            case 5: {
                const mean = list.entries.reduce((a, b) => a + b) / list.length;
                const dev = Math.sqrt(list.entries.map(x => (x - mean) ** 2).reduce((a, b) => a + b) / (list.length - 1));
                val = `${dev}`;
            } break;

            case 6: val = `${list.entries.reduce((s, a) => s + a, 0)}`; break;
            case 7: val = `${list.entries.reduce((s, a) => s + a * a, 0)}`; break;
            case 8: val = `${list.length}`; break;

            case 9: {
                let sum = 0, good = true;
                for (let i = 0; i < list.length; ++i) {
                    good &= !(list.at(i) <= 0);
                    sum += Math.log(list.at(i)) / list.length;
                }
                if (good) val = `${Math.exp(sum)}`;
            } break;

            default: break;
        }
        return llfloat.format(val);
    },
    llLog: arg => {
        let num = numb.parse(arg[0].str);
        if ((string.is_inf(num) && num < 0) || numb.fast_nan(num) || num <= 0) num = 0;
        else num = Math.log(num);
        return llfloat.format(num);
    },
    llLog10: arg => {
        let num = new llfloat(arg[0].str);
        if ((string.is_inf(num.value) && num.value < 0) || numb.fast_nan(num.value) || num.value <= 0) num.value = 0;
        else num.value = Math.log10(num.value);
        return num.formatted();
    },
    llModPow: arg => {
        let base = numb.parse(arg[0].str),
            exp = numb.parse(arg[1].str),
            mod = numb.parse(arg[2].str);

        if (mod === 0 || mod === 1) return `0`;
        else if (exp === 0) return `1`;
        else {
            base = base >>> 0;
            exp = exp >>> 0;
            mod = mod >>> 0;
            let ret = 1;
            while (exp > 0) {
                if (exp & 1) ret = ((ret * base) >>> 0) % mod;
                exp = exp >> 1;
                base = ((base ** 2) >>> 0) % mod;
            }
            return ftsf([`${ret}`]);
        }

    },
    llOrd: arg => {
        let str = new u32(string.clip(arg[0].str)),
            idx = index(arg[1].str, str.length);

        if (numb.between(idx, 0, str.length - 1))
            return `${str[idx]}`;
        return `0`;

    },
    llParseString2List: arg => {
        const text = string.clip(arg[0].str);
        if (string.empty(text)) return ftsf([`[`, `]`]);

        let sep = new lllist(arg[1].front).to_string_array().slice(0, 8).filter(m => m.length > 0),
            spc = new lllist(arg[2].front).to_string_array().slice(0, 8).filter(m => m.length > 0),
            out = [text];

        for (let i = 0; i < sep.length; ++i)
            for (let j = out.length - 1; j >= 0; --j)
                out.splice(j, 1, ...out[j].split(sep[i]));

        for (let i = 0; i < spc.length; ++i) {
            for (let j = out.length - 1; j >= 0; --j) {
                if (out[j].includes(spc[i])) {
                    let cut = out[j].split(spc[i]);
                    out.splice(j, 1, ...[cut[0], spc[i], cut[1]]);
                }
            }
        }

        return `[${out.filter(m => m.length > 0).map(m => `"${m}"`).join(`, `)}]`;
    },
    llParseStringKeepNulls: arg => {
        const text = string.clip(arg[0].str);
        if (string.empty(text)) return ftsf([`[`, `""`, `]`]);

        let sep = new lllist(arg[1].front).to_string_array(),
            spc = new lllist(arg[2].front).to_string_array(),
            out = [text];

        sep = sep.slice(0, 8).filter(m => m.length > 0).map(regex.escape);
        spc = spc.slice(0, 8).filter(m => m.length > 0).map(regex.escape);

        //console.log(`src:`, src, `sep:`, sep, `spc:`, spc);
        for (let i = 0; i < sep.length; ++i)
            for (let j = out.length - 1; j >= 0; --j)
                out.splice(j, 1, ...out[j].split(sep[i]));

        for (let i = 0; i < spc.length; ++i) {
            for (let j = out.length - 1; j >= 0; --j) {
                if (out[j].includes(spc[i])) {
                    let cut = out[j].split(spc[i]);
                    out.splice(j, 1, ...[cut[0], spc[i], cut[1]]);
                }
            }
        }

        return `[${out.map(m => `"${m}"`).join(`, `)}]`;
    },
    llPow: arg => {

        let base = new llfloat(arg[0].str).value, 
        exp = new llfloat(arg[1].str).value;

        if (numb.fast_nan(base) || numb.fast_nan(exp)) return `nan`;
        return ftsf([llfloat.format(base ** exp, 8)]);
    },
    llReplaceSubString: arg => {
        let txt = string.clip(arg[0].str),
            pattern = string.clip(arg[1].str),
            replace = string.clip(arg[2].str),
            count = numb.parse(arg[3].str);

        if (!string.empty(pattern)) {
            if (count === 0) txt = txt.replaceAll(pattern, replace);
            else if (count > 0) {
                let out_str = ``;
                for (let i = 0; i < txt.length; ++i) {
                    out_str += txt[i];
                    if (out_str.endsWith(pattern) && count > 0) {
                        out_str = out_str.substring(0, out_str.length - pattern.length) + replace;
                        --count;
                    }
                }
                txt = out_str;
            }
            else if (count < 0) {
                for (let i = txt.length; i >= 0 && count != 0; --i) {
                    const index = txt.substring(0, i).lastIndexOf(pattern);
                    if (index >= 0) {
                        txt = `${txt.substring(0, index)}${replace}${txt.substring(index + pattern.length)}`;
                        i = index;
                        ++count;
                    }
                }
            }
        }
        return ftsf([`"${txt}"`]);
    },
    llRot2Axis: arg => {
        let r = new llquat(arg[0].front).to_quat();
        if (r[QW] < 0) quat_neg(r);
        const n = vec3_normalize(new vec3d(r[QX], r[QY], r[QZ]));
        return new llvec(n).expr;
    },
    llRot2Euler: arg => {
        let r = new llquat(arg[0].front).to_quat();

        quat_normalize(r);
        let y = 2 * (r[0] * r[2] + r[1] * r[3]);
        const eul = new eulerd();
        if (Math.abs(y) > 0.99999) {
            euler_set(eul,
                0,
                Math.asin(y > 1 ? 1 : y),
                Math.atan2(r[2] * r[3] + r[0] * r[1], .5 - (r[0] * r[0] + r[2] * r[2]))
            );
        }
        else {
            let qy2 = r[1] * r[1];
            euler_set(eul,
                Math.atan2(r[0] * r[3] - r[1] * r[2], .5 - (r[0] * r[0] + qy2)),
                Math.asin(y),
                Math.atan2(r[2] * r[3] - r[0] * r[1], .5 - (r[2] * r[2] + qy2))
            );
        }
        return new llvec(eul).expr;
    },
    llRot2Fwd: arg => {
        const quat = new llquat(arg[0].front).to_quat();
        let fwd = new vec3d(1, 0, 0);
        if (!quat_is_fuzzy_null(quat))
            fwd = vec3_normalize(vec3_mult(fwd, quat, new vec3d()));
        return new llvec(fwd).expr;
    },
    llRot2Left: arg => {
        const quat = new llquat(arg[0].front).to_quat();
        let fwd = new vec3d(0, 1, 0);
        if (!quat_is_fuzzy_null(quat))
            fwd = vec3_normalize(vec3_mult(fwd, quat, new vec3d()));
        return new llvec(fwd).expr;
    },
    llRot2Up: arg => {
        const quat = new llquat(arg[0].front).to_quat();
        let fwd = new vec3d(0, 0, 1);
        if (!quat_is_fuzzy_null(quat))
            fwd = vec3_normalize(vec3_mult(fwd, quat, new vec3d()));
        return new llvec(fwd).expr;
    },
    llRotBetween: arg => {
        let v0 = vec3_normalize(new llvec(arg[0].front).to_vec3());
        let v1 = vec3_normalize(new llvec(arg[1].front).to_vec3());

        let res = new quatd();
        let dot = vec3_dot(v0, v1);
        let cross = vec3_cross(v0, v1, new vec3d());
        const threshold = 0.9999998807907104;
        let m = 0;
        if (numb.between(dot, -threshold, threshold)) {
            m = Math.sqrt(vec3_dot(cross, cross) + (dot + 1.) * (dot + 1.));
            quat_set(res, cross[0] / m, cross[1] / m, cross[2] / m, (dot + 1.) / m);
        }
        else if (dot <= 0) {
            let ortho = vec3_cross(vec3_cross(v0, new vec3d(1., 0., 0.), new vec3d()), v0, new vec3d());
            m = vec3_dot(ortho, ortho);
            if (m < 1.000000013351432e-10) quat_set(res, 0., 0., 1., 0.);
            else {
                m = Math.sqrt(m);
                quat_set(res, ortho[0] / m, ortho[1] / m, ortho[2] / m, 0.);
            }
        }
        return new llquat(res).expr;
    },
    llRound: arg => {
        let tmp = numb.parse(arg[0].str);

        let val;
        if (!numb.is_finite(tmp) || tmp >= 2147483647.5 || tmp < -2147483648.0)
            val = `-2147483648`;
        else {
            tmp = llfloat.f32(tmp);
            tmp = Math.fround(tmp + 0.5);
            tmp = Math.floor(tmp);
            val = `${llint.i32(tmp)}`;
        }
        return ftsf([val]);
    },
    llSin: arg => {
        const num = numb.parse(arg[0].str);
        if (string.is_inf(arg[0].str))
            return ftsf([`${num}`]);

        let val = num;
        if (numb.between(num, -9223372036854775808.0, 9223372036854775808.0, false))
            val = Math.sin(num);

        return ftsf([llfloat.format(val)]);
    },
    llSqrt: arg => {
        const tmp = Math.sqrt(numb.parse(arg[0].str));
        return ftsf([llfloat.format(tmp)]);
    },
    llStringLength: arg => {
        let txt = new u32(string.clip(arg[0].str));
        return ftsf([`${txt.length}`]);
    },
    llStringToBase64: arg => {
        const str = string.clip(arg[0].str);
        const bytes = new TextEncoder().encode(str);
        return ftsf([`"${btoa(String.fromCodePoint(...bytes))}"`]);
    },
    llStringTrim: arg => {
        const str = string.clip(arg[0].str),
            mode = numb.parse(arg[1].str);
        let start = 0, end = str.length - 1;

        if (mode & 1) {
            while (char.is_one_of(str[start], `\x09\x0a\x0b\x0c\x0d\x20`) && start < str.length)
                start++;
        }
        if (mode & 2) {
            while (char.is_one_of(str[end], `\x09\x0a\x0b\x0c\x0d\x20`) && end >= start)
                end--;
        }
        return ftsf([`"${str.substring(start, end + 1)}"`]);
    },
    llSubStringIndex: arg => {
        let str = string.clip(arg[0].str),
            patern = string.clip(arg[1].str);
        return ftsf([`${str.indexOf(patern)}`]);
    },
    llTan: arg => {
        const num = numb.parse(arg[0].str);
        if (string.is_inf(arg[0].str))
            return ftsf([`${num}`]);

        let val = num;
        if (numb.between(num, -9223372036854775808.0, 9223372036854775808.0, false))
            val = Math.tan(num);

        return ftsf([llfloat.format(val)]);
    },
    llToLower: arg => {
        let str = string.clip(arg[0].str);
        const regexp = new RegExp(Object.keys(mono_lower_map).join(`|`), `g`);
        const val = `"${str.replace(regexp, m => mono_lower_map[m])}"`;
        return ftsf([val]);
    },
    llToUpper: arg => {
        let str = string.clip(arg[0].str);
        const regexp = new RegExp(Object.keys(mono_upper_map).join(`|`), `g`);
        const val = `"${str.replace(regexp, m => mono_upper_map[m])}"`;
        return ftsf([val]);
    },
    llUnescapeURL: arg => {
        const str = string.clip(arg[0].str),
            encoder = new TextEncoder();
        let ret = [], i = 0;
        while (i < str.length) {
            let c = str[i++];
            if (c != `%`) {
                ret.push(...encoder.encode(c));
                continue;
            }

            if (i >= str.length) break;
            c = str[i++];
            if (i >= str.length) break;
            let v = 0;
            if (/[a-f0-9]/i.test(c)) {
                v |= parseInt(c, 16) << 4;
            }

            c = str[i++];
            if (c === `%`) {
                ret.push(v);
                continue;
            }
            if (/[a-f0-9]/i.test(c)) {
                v |= parseInt(c, 16);
            }

            if (v === 0) break;
            ret.push(v);
        }

        const val = trim_mono_string(Uint8Array.from(ret));
        return ftsf([`"${string.c_escape(val)}"`]);
    },
    llVecDist: arg => {
        const val1 = new llvec(arg[0].front).to_vec3(),
            val2 = new llvec(arg[1].front).to_vec3();
        const res = vec3_dist(val1, val2);
        return ftsf([llfloat.format(res)]);
    },
    llVecMag: arg => {
        const tmp = vec3_length(new llvec(arg[0].front).to_vec3());
        return ftsf([llfloat.format(tmp)]);
    },
    llXorBase64: arg => {

    },
    llsRGB2Linear: arg => {
        const vec = new llvec(arg[0].front).to_vec3();
        for (let i = 0; i < 3; ++i) {
            vec[i] = (vec[i] <= 0.0404482362771082) ? vec[i] / 12.92 : ((vec[i] + 0.055) / 1.055) ** 2.4;
        }
        return new llvec(vec).expr;
    },
}

