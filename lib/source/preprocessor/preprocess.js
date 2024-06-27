import { array } from "../../array.js";
import { error } from "../../error.js";
import { flag, kind_of } from "../../global.js";
import { file } from "../../system/file.js";
import { uris } from "../../system/uris.js";
import { reset_index, string } from "../../text/string.js";
import { expr } from "../expressions.js";
import { message } from "../message.js";
import { options, opts } from "../options.js";
import { tokens } from "../tokens.js";
import { expand_hash, expand_hash_hash, macro, macros } from "./macro.js";

export const ERROR = `error`;
export const WARNING = `warning`;

export const DEFINE = `define`;
export const UNDEF = `undef`;

export const ELIF = `elif`;
export const ELSE = `else`;
export const ENDIF = `endif`;
export const IF = `if`;
export const IFDEF = `ifdef`;
export const IFNDEF = `ifndef`;
export const DEFINED = `defined`;

export const HAS_INCLUDE = `__has_include`;
export const INCLUDE = `include`;

export const PRAGMA = `pragma`;
export const ONCE = `once`;
export const RESET_INDEX = `reset_index`;

const TRUE = 1;
const ELSE_IS_TRUE = 2;
const ALWAYS_FALSE = 3;

export let includes = [];
const pragma_once = new Set();



export const preprocessing = async (sources, verb = false, max_safe = 10000) => {
    //console.log(`->preprocessing(${sources[0].stringify()})`);
    if (kind_of(sources) !== `array`)
        throw new error(`process function expect an array of tokens.`);

    if (!macros.has(`__FILE__`)) {
        macros.set(`__FILE__`, new macro(`__FILE__`, `__FILE__`));
        macros.set(`__FILE_NAME__`, new macro(`__FILE_NAME__`, `__FILE_NAME__`));
        macros.set(`__LINE__`, new macro(`__LINE__`, `__LINE__`));
        macros.set(`__COUNTER__`, new macro(`__COUNTER__`, `__COUNTER__`));
        macros.set(`__DATE__`, new macro(`__DATE__`, `__DATE__`));
        macros.set(`__TIME__`, new macro(`__TIME__`, `__TIME__`));
        macros.set(`__VERSION__`, new macro(`__VERSION__`, `__VERSION__`));
        macros.set(`__INCLUDE_LEVEL__`, new macro(`__INCLUDE_LEVEL__`, `__INCLUDE_LEVEL__`));
        macros.set(`__BASE_FILE__`, new macro(`__BASE_FILE__`, `__BASE_FILE__`));
        macros.set(`__UID__`, new macro(`__UID__`, `__UID__`));
        macros.set(`__UUID__`, new macro(`__UUID__`, `__UUID__`));
    }

    const out = new tokens();
    for (let i = 0; i < sources.length; ++i) {
        sources[i].remove_comments();
        out.take(sources[i]);
    }
    out.file = array.last(sources).file;
    //console.log(out.str);

    let cond_state = [TRUE];

    let tok = out.front;
    let safe = 0;
    while (tok) {

        //console.log(includes);

        if (++safe >= max_safe) {
            console.error(`max safe hit!!!`);
            return out;
        }

        if (verb)
            console.log(`str: "${tok.str}", prev: "${(tok.prev) ? tok.prev.str : ""}", next: "${(tok.next) ? tok.next.str : ""}", cond_state: [${cond_state.join(`, `)}].`);

        if (tok.op == `#` && !tok.same_line(tok.prev) && tok.next && tok.next.flag & flag.NAME_FLAG) {
            if (!tok.same_line(tok.next)) {
                tok = tokens.next_line(tok);
                continue;
            }

            tok = tok.next;

            if (cond_state.length <= 1 && (tok.str == ELIF || tok.str == ELSE || tok.str == ENDIF)) {
                message.add(new message(message.SYNTAX_ERROR, `#${tok.str} without #if`, tok.loc));
                return new tokens();
            }


            if (array.last(cond_state) == TRUE && (tok.str == ERROR || tok.str == WARNING)) {
                message.add(new message((tok.str == ERROR) ? message.ERROR : message.WARNING, tok.next.str, tok.loc));

                if (tok.str == ERROR)
                    return new tokens();
                tok = out.delete_tokens(out.line_expr(tok));
                continue;
            }

            if (array.last(cond_state) == TRUE && tok.str == DEFINE) {
                try {
                    const new_mac = new macro(tok.prev);
                    if (!macros.has(new_mac.name))
                        macros.set(new_mac.name, new_mac);
                    else {
                        const old_mac = macros.get(new_mac.name);
                        throw new error(`Macro already defined at "${old_mac.name_tok.loc.str()}".`);
                    }
                }
                catch (e) {
                    if (verb) console.error(e);
                    message.add(new message(message.SYNTAX_ERROR, e.message, tok.loc));
                    return;
                }

                tok = out.delete_tokens(out.line_expr(tok));
                continue;
            }

            else if (array.last(cond_state) == TRUE && tok.str == INCLUDE) {

                if (!tok.next || !tok.same_line(tok.next)) {
                    message.add(new message(message.SYNTAX_ERROR, `No header in #include`, tok.loc));
                    return new tokens();
                }

                let line = out.line_expr(tok);
                //console.log(`line: ${line.str}`);
                let exp = new tokens();
                exp = await preprocessing([exp.copy(out, tok.next, line.back)], verb);
                //console.log(exp.str);

                if (exp.empty())
                    continue;

                let str = exp.front.str;
                if (str == `<`) {
                    for (let it = exp.front.next; it && it.str != `>`; it = it.next) {
                        str += it.str;
                    }
                    str += `>`;
                }


                if (string.empty(str) || !string.starts_with_one_of(str, `"<`)) {
                    message.add(new message(message.SYNTAX_ERROR, `No header in #include`, tok.loc));
                    return new tokens();
                }

                let is_sytem = (str[0] == `<`);
                let name = str.substring(1, str.length - 1);
                if (is_sytem)
                    name = `include/${name}`;
                else {
                    let files = options.get(opts.GENERAL, `folder`);
                    for (let i = 0; i < files.length; ++i) {
                        if (files[i].name == name) {
                            name = files[i];
                            break;
                        }
                    }
                }

                if (is_sytem && !(await file.exists(name))) {
                    message.add(new message(message.MISSING_HEADER, `Header not found: ${name}`, tok.loc));
                    return new tokens();
                }

                if (includes.length >= 400) {
                    message.add(new message(message.INCLUDE_NESTED_TOO_DEEPLY, `#include nested too deeply`, tok.loc));
                    return new tokens();
                }

                line = out.line_expr(tok);
                //console.log(`name: ${name}`);
                if (!pragma_once.has(name)) {
                    let include_toks;
                    if (is_sytem) {
                        const src = await file.load_text(name);
                        include_toks = new tokens(src, name);
                    }
                    else include_toks = new tokens(await file.load_text(name), name.name);

                    //console.log(include_toks.str);

                    include_toks.remove_comments();
                    tok = out.replace(line, include_toks);
                    //console.log(out.str);
                }
                else {
                    tok = out.delete_tokens(line);
                }

                //console.log(out.str);
                continue;
            }

            else if (tok.str == IF || tok.str == IFDEF || tok.str == IFNDEF || tok.str == ELIF) {
                //console.log(tok.str);
                let line = out.line_expr(tok);

                let is_true = false;
                if (tok.str == IFDEF) {
                    is_true = (macros.has(tok.next.str) || tok.next.str == HAS_INCLUDE);
                }
                else if (tok.str == IFNDEF) {
                    is_true = (!macros.has(tok.next.str) && tok.next.str != HAS_INCLUDE);
                }
                else {
                    let exp = new tokens();
                    exp = await preprocessing([exp.copy(out, tok.next, line.back)]);
                    //console.log(exp.stringify());

                    let ref = new expr();
                    for (let it = exp.front; it; it = it.next) {
                        let value = `0`;
                        if (it.str == DEFINED) {
                            try {
                                ref.front = it;
                                if (!it.next) throw new error();
                                it = it.next;

                                let par = (it.op == `(`);
                                if (par) {
                                    if (!it.next) throw new error();
                                    it = it.next;
                                }


                                if (it) {
                                    //console.log(`str: ${it.str}, exp: ${exp.stringify()}`);
                                    //console.log(macros);
                                    if (string.is_numb(it.str)) value = it.str;
                                    else if (macros.has(it.str)) value = `1`;
                                    else if (it.str == HAS_INCLUDE) value = `1`;
                                }

                                if (par)
                                    it = it ? it.next : undefined;

                                if (!it || !exp.front.same_line(it) || (par && it.op != `)`))
                                    throw new error();

                                ref.back = it;
                            }
                            catch (e) {
                                message.add(new message(message.SYNTAX_ERROR, `failed to evaluate ${(tok.str == IF) ? "#if" : "#elif"} condition`, tok.loc));
                                return new tokens();
                            }

                        }
                        else if (it.str == HAS_INCLUDE) {
                            try {
                                ref.front = it;
                                if (!it.next) throw new error(``);
                                it = it.next;

                                let par = (it.op == `(`);
                                if (par) {
                                    if (!it.next) throw new error();
                                    it = it.next;
                                }


                                if (it) {
                                    //console.log(`str: ${it.str}, exp: ${exp.stringify()}`);
                                    let is_sytem = (it.str[0] == `<`);
                                    let name = it.str.substring(1, it.str.length - 1);
                                    if (is_sytem) name = `include/${name}`;
                                    //console.log(`uri: ${uri}`);

                                    if (await file.exists(name)) value = `1`;

                                }

                                if (par)
                                    it = it ? it.next : undefined;

                                if (!it || !exp.front.same_line(it) || (par && it.op != `)`))
                                    throw new error();

                                ref.back = it;

                            }
                            catch (e) {
                                console.log(e);
                                message.add(new message(message.SYNTAX_ERROR, `failed to evaluate ${(tok.str == IF) ? "#if" : "#elif"} condition`, tok.loc));
                                return new tokens();
                            }

                        }
                        else if (/^'\p{L}'$/iu.test(it.str)) {
                            ref.front = ref.back = it;
                            value = it.str.charCodeAt(1);
                        }


                        if (ref.front) {
                            exp.replace(ref, new tokens(`${value}`, ref.front.loc));
                            ref = new expr();
                            it = exp.front;
                        }

                    }

                    //console.log(exp.stringify());
                    try {
                        if (verb) console.log(exp.str);
                        is_true = new Function(`return (${exp.str});`)();
                    }
                    catch (e) {
                        //message.add(new message(SYNTAX_ERROR, `failed to evaluate ${(tok.str == IF) ? "#if" : "#elif"} condition. \n${e.message}`, tok.loc));
                        is_true = false;
                    }

                    //
                }

                //console.log(is_true);
                if (tok.str != ELIF) {
                    if (array.last(cond_state) != TRUE)
                        cond_state.push(ALWAYS_FALSE);
                    else
                        cond_state.push(is_true ? TRUE : ELSE_IS_TRUE);
                }
                else if (array.last(cond_state) == TRUE)
                    cond_state[cond_state.length - 1] = ALWAYS_FALSE;
                else if (array.last(cond_state) == ELSE_IS_TRUE && is_true)
                    cond_state[cond_state.length - 1] = TRUE;

                tok = out.delete_tokens(line);
                continue;
            }

            else if (tok.str == ELSE) {
                //console.log(tok.str);\
                cond_state[cond_state.length - 1] = (array.last(cond_state) == ELSE_IS_TRUE) ? TRUE : ALWAYS_FALSE;
                tok = out.delete_tokens(out.line_expr(tok));
                continue;
            }

            else if (tok.str == ENDIF) {
                cond_state.pop();
                tok = out.delete_tokens(out.line_expr(tok));
                continue;
            }

            else if (array.last(cond_state) == TRUE && tok.str == UNDEF) {
                if (tok.next && tok.next.flag & flag.NAME_FLAG) {
                    macros.delete(tok.next.str);
                }

                tok = out.delete_tokens(out.line_expr(tok));
                continue;
            }

            else if (array.last(cond_state) == TRUE && tok.str == PRAGMA && tok.next && tok.same_line(tok.next)) {
                if (tok.next.str == ONCE) pragma_once.add(uris.uri(tok.loc.file));
                else if (tok.next.str == RESET_INDEX) {
                    reset_index();
                }

                tok = out.delete_tokens(out.line_expr(tok));
                continue;
            }

            if (verb) {
                //console.log(`cond_state: [${cond_state.join(`, `)}]`);
                //console.log(out.stringify());
            }

        }

        if (array.last(cond_state) != TRUE) {
            tok = out.delete_tokens(out.line_expr(tok));
            continue;
        }

        let hash = false, hash_hash = false;
        if (tok.prev && tok.same_line(tok.prev)) {
            if (tok.prev.str == `#` && tok.str != `##` && tok.str != `#`) hash = true;

            if (tok.prev.str == `##`) {
                if (tok.next) {
                    if (tok.next.str != `##`) hash_hash = true;
                } else hash_hash = true;
            }
        }

        try {
            if (tok.flag & flag.NAME_FLAG && macros.has(tok.str)) {
                const mac = macros.get(tok.str);
                tok = mac.expand(out, tok, includes, verb);

                if (verb) console.log(out.stringify());

                if (!hash_hash && !hash) continue;

                if (tok.flag & flag.NAME_FLAG && macros.has(tok.str)) {
                    if (!tok.mac.includes(macros.get(tok.str).name))
                        continue;
                }
            }

            if (hash) {
                // expand_hash = (src, hash_tok, by)
                tok = expand_hash(out, tok.prev, tok.str);
                continue;
            }
            else if (hash_hash) {
                tok = expand_hash_hash(out, tok.prev);
                continue;
            }
        }
        catch (e) {
            if (verb) console.error(e);
            message.add(new message(message.SYNTAX_ERROR, e.message, tok.loc));
            return;
        }

        tok = tok.next;
    }


    return out;
}

export const clear_prepro = async () => {
    macros.clear();
    includes = [];
    pragma_once.clear();
}
