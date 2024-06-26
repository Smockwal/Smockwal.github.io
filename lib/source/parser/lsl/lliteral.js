import { error } from "../../../error.js";
import { flag } from "../../../global.js";
import { numb } from "../../../math/number.js";
import { char } from "../../../text/char.js";
import { string } from "../../../text/string.js";
import { expr } from "../../expressions.js";
import { literal } from "../../literal.js";
import { token } from "../../token.js";
import { tokens } from "../../tokens.js";

const integer_type = `integer`;
const float_type = `float`;
const string_type = `string`;
const key_type = `key`;
const list_type = `list`;
const vector_type = `vector`;
const rotation_type = `rotation`;
const quaternion_type = `quaternion`;

export class llliteral extends literal {
    /**
     * Checks if two types can be used interchangeably.
     * @param {string} data - The first type to check.
     * @param {string} type - The second type to check.
     * @returns {boolean} - True if the types can be used interchangeably, false otherwise.
     */
    static can_be_use_as(data, type) {
        //console.log(data, type)
        if (data == rotation_type) data = quaternion_type;
        if (type == rotation_type) type = quaternion_type;

        if ((data == integer_type && type == float_type)) return true;
        if ((data == key_type && type == string_type) || (data == string_type && type == key_type)) return true;
        return (data == type);
    }

    /**
     * Checks if a given data type can be casted to another data type.
     * It handles specific cases for integer, float, vector, quaternion, and key types.
     * @param {string} from - The data type to cast from.
     * @param {string} to - The data type to cast to.
     * @returns {boolean} - Returns true if the cast is possible, false otherwise.
     */
    static can_be_cast_to(from, to) {
        if (from == rotation_type) from = quaternion_type;
        if (to == rotation_type) to = quaternion_type;

        switch (from) {
            case integer_type: case float_type:
                if (to == key_type || to == vector_type || to == quaternion_type) return false;
                break;

            case vector_type:
                if (to == integer_type || to == float_type || to == key_type || to == quaternion_type) return false;
                break;

            case quaternion_type:
                if (to == integer_type || to == float_type || to == key_type || to == vector_type) return false;
                break;

            case key_type:
                if (to == vector_type || to == quaternion_type) return false;
                break;

            case list_type:
                if (to == integer_type || to == float_type || to == key_type || to == vector_type || to == quaternion_type) return false;
                break;
        }

        return true;
    }

    /**
     * Checks if a given data type can be assigned to another type.
     * @param {string} data - The data type to be checked.
     * @param {string} type - The target type to assign to.
     * @returns {boolean} - Returns true if the given data type can be assigned to the target type, false otherwise.
     */
    static can_be_assign_to(data, type) {
        if (data == rotation_type) data = quaternion_type;
        if (type == rotation_type) type = quaternion_type;

        if (data == integer_type && type == float_type) return true;
        if (data == string_type && type == key_type) return true;
        if (data == key_type && type == string_type) return true;
        return (data == type);
    }

    /**
     * This function returns the default value for a given type.
     * @param {string} str - The type for which the default value is required.
     * @returns {string} - The default value for the given type.
     */
    static default_for(str) {
        switch (str) {
            case integer_type: return `0`;
            case float_type: return `0.0`;
            case string_type: case key_type: return `""`;
            case vector_type: return `<0,0,0>`;
            case quaternion_type: case rotation_type: return `<0,0,0,1>`;
            case list_type: return `[]`;
        }
    }

    /**
     * Checks if a given value is the default value for a specific type.
     * @param {string} type - The type of the value to check.
     * @param {Token} valueTok - The token representing the value to check.
     * @returns {boolean} - True if the value is the default value for the given type, false otherwise.
     */
    static is_default_for(type, value_tok) {
        switch (type) {
            case integer_type: return parseInt(value_tok.str) == 0;
            case float_type: return Math.fround(parseFloat(value_tok.str)) == 0;
            case string_type: case key_type: return value_tok.str == `""`;
            case vector_type: {
                let good = true, tok = value_tok;
                if (tok.op == `<`) {
                    good &= (tok.op == `<`);
                    tok = tok.next;
                    good &= llliteral.is_default_for(float_type, tok);
                    tok = tok.next;
                    good &= (tok.op == `,`);
                    tok = tok.next;
                    good &= llliteral.is_default_for(float_type, tok);
                    tok = tok.next;
                    good &= (tok.op == `,`);
                    tok = tok.next;
                    good &= llliteral.is_default_for(float_type, tok);
                    tok = tok.next;
                    good &= (tok.op == `>`);
                }
                else if (tok.op == `(`) {
                    good &= (tok.op == `(`);
                    tok = tok.next;
                    good &= (tok.str == `(vector)`);
                    tok = tok.next;
                    good &= (tok.str == `""`);
                    tok = tok.next;
                    good &= (tok.op == `)`);
                }
                else return false;

                return good != false;
            }
            case quaternion_type: case rotation_type: {
                let good = true, tok = value_tok;
                if (tok.op == `<`) {
                    good &= (tok.op == `<`);
                    tok = tok.next;
                    good &= llliteral.is_default_for(float_type, tok);
                    tok = tok.next;
                    good &= (tok.op == `,`);
                    tok = tok.next;
                    good &= llliteral.is_default_for(float_type, tok);
                    tok = tok.next;
                    good &= (tok.op == `,`);
                    tok = tok.next;
                    good &= llliteral.is_default_for(float_type, tok);
                    tok = tok.next;
                    good &= (tok.op == `,`);
                    tok = tok.next;
                    good &= (Math.fround(parseFloat(tok.str)) == 1);
                    tok = tok.next;
                    good &= (tok.op == `>`);
                }
                else if (tok.op == `(`) {
                    good &= (tok.op == `(`);
                    tok = tok.next;
                    good &= (tok.str == `(quaternion)`);
                    tok = tok.next;
                    good &= (tok.str == `""`);
                    tok = tok.next;
                    good &= (tok.op == `)`);
                }
                else return false;
                return good != false;
            }
            case `list`: return value_tok.str == `[` && value_tok.next && value_tok.next.str == `]`;
        }
    }

    /**
     * Extracts vector entries from a given token.
     * It is assumed that the token represents an opening angle bracket '<'.
     * The function returns an array of expressions representing the vector entries.
     *
     * @param {token} tok - The token representing the opening angle bracket '<'.
     * @returns {Array<expr>} - An array of expressions representing the vector entries.
     */
    static vec_entries(tok) {
        if (tok.op != `<`) return [];
        const entries = [];
        let first = tok.next;

        const exp = expr.match(tok);
        for (let it = exp.front.next; exp.end(it); it = exp.next(it)) {
            if (!(it.flag & flag.SYMBOL_FLAG)) continue;

            if (char.is_one_of(it.op, `([<`)) it = expr.match(it).back;
            else if (char.is_one_of(it.op, `>,`) || entries.length > 4) {
                entries.push(new expr(first, it.prev));
                first = it.next;
            }
        }

        return entries;
    }

    /**
     * List entries from a given token.
     * It is assumed that the token represents an list or a similar data structure.
     * @param {token} tok - The token from which to extract the entries.
     * @returns {Array} - An array of expressions representing the entries in the token.
     */
    static list_entries(tok) {
        if (!char.is_one_of(tok.op, `[]`)) return [];
        if (char.is_one_of(tok.next.op, `[]`)) return [];

        const entries = [];

        const exp = expr.match(tok);
        let first = exp.front.next;

        for (let it = exp.front.next; it && it != exp.back.next; it = it.next) {
            if (!(it.flag & flag.SYMBOL_FLAG)) continue;

            if (char.is_one_of(it.op, `([<`)) it = expr.match(it).back;
            else if (char.is_one_of(it.op, `],`)) {
                entries.push(new expr(first, it.prev));
                first = it.next;
            }
        }

        return entries;
    }

    /**
     * Parses a expression and returns a list of string entries.
     * @param {token} tok - The token to parse.
     * @returns {Array<String>} - A list of string entries.
     * @throws {error} - Throws an error if the token cannot be parsed.
     */
    static list_string_entries(tok) {
        const entries = llliteral.list_entries(tok);
        for (let i = 0; i < entries.length; ++i) {
            if (entries[i].front.flag & flag.NUMBER_FLAG) {
                const num = numb.parse(entries[i].front.str);
                if (string.is_float(entries[i].front.str)) entries[i] = numb.f32s(num, 5);
                else entries[i] = `${num}`;
            }
            else if (entries[i].front.flag & flag.STRING_FLAG) {
                entries[i] = string.clip(entries[i].front.str);
            }
            else if (entries[i].front.flag & (flag.VECTOR_OP_FLAG | flag.QUAT_OP_FLAG)) {
                entries[i] = llliteral.format_vec_string(entries[i].front, true);
            }
            else
                throw new error(`Fix me.`);
        }
        return entries;
    }

    /**
     * Creates a new tokens object with a list of entries.
     * @param {Array<string>} arr - The array of entries to be converted into tokens.
     * @returns {tokens} - A new tokens object containing the list of entries.
     */
    static list_from_entries(arr) {
        const entries = arr.filter(m => m.length > 0);
        if (entries.length == 0) return new tokens(`[]`);

        const ret = new tokens(`[`);
        for (const entry of entries) {
            ret.copy(entry);
            ret.push_back(new token(`,`));
        }
        ret.back.str = `]`;
        return ret;
    };

    /**
     * Formats a vector string by parsing the tokens, converting the numbers to a specific format,
     * and then joining them back into a formatted string.
     *
     * @param {token} tok - The token containing the vector string to be formatted.
     * @param {boolean} [in_list=false] - A flag indicating whether the numbers should be formatted for a list (default is false).
     *
     * @returns {string} - The formatted vector string.
     */
    static format_vec_string(tok, in_list = false) {
        const entries = llliteral.vec_entries(tok);
        for (let i = 0; i < entries.length; ++i) {
            const num = numb.f32s(numb.parse(entries[i].front.str), in_list ? 6 : 5)
            entries[i] = numb.format_float(numb.parse(num));
        }

        return `<${entries.join(`, `)}>`;
    };

}

export const mono_lower_map = {
    'A': 'a', 'B': 'b', 'C': 'c', 'D': 'd', 'E': 'e', 'F': 'f', 'G': 'g', 'H': 'h', 'I': 'i', 'J': 'j', 'K': 'k', 'L': 'l', 'M': 'm', 'N': 'n', 'O': 'o', 'P': 'p', 'Q': 'q', 'R': 'r',
    'S': 's', 'T': 't', 'U': 'u', 'V': 'v', 'W': 'w', 'X': 'x', 'Y': 'y', 'Z': 'z', 'À': 'à', 'Á': 'á', 'Â': 'â', 'Ã': 'ã', 'Ä': 'ä', 'Å': 'å', 'Æ': 'æ', 'Ç': 'ç', 'È': 'è', 'É': 'é',
    'Ê': 'ê', 'Ë': 'ë', 'Ì': 'ì', 'Í': 'í', 'Î': 'î', 'Ï': 'ï', 'Ð': 'ð', 'Ñ': 'ñ', 'Ò': 'ò', 'Ó': 'ó', 'Ô': 'ô', 'Õ': 'õ', 'Ö': 'ö', 'Ø': 'ø', 'Ù': 'ù', 'Ú': 'ú', 'Û': 'û', 'Ü': 'ü',
    'Ý': 'ý', 'Þ': 'þ', 'Ā': 'ā', 'Ă': 'ă', 'Ą': 'ą', 'Ć': 'ć', 'Ĉ': 'ĉ', 'Ċ': 'ċ', 'Č': 'č', 'Ď': 'ď', 'Đ': 'đ', 'Ē': 'ē', 'Ĕ': 'ĕ', 'Ė': 'ė', 'Ę': 'ę', 'Ě': 'ě', 'Ĝ': 'ĝ', 'Ğ': 'ğ',
    'Ġ': 'ġ', 'Ģ': 'ģ', 'Ĥ': 'ĥ', 'Ħ': 'ħ', 'Ĩ': 'ĩ', 'Ī': 'ī', 'Ĭ': 'ĭ', 'Į': 'į', 'Ĳ': 'ĳ', 'Ĵ': 'ĵ', 'Ķ': 'ķ', 'Ĺ': 'ĺ', 'Ļ': 'ļ', 'Ľ': 'ľ', 'Ŀ': 'ŀ', 'Ł': 'ł', 'Ń': 'ń', 'Ņ': 'ņ',
    'Ň': 'ň', 'Ŋ': 'ŋ', 'Ō': 'ō', 'Ŏ': 'ŏ', 'Ő': 'ő', 'Œ': 'œ', 'Ŕ': 'ŕ', 'Ŗ': 'ŗ', 'Ř': 'ř', 'Ś': 'ś', 'Ŝ': 'ŝ', 'Ş': 'ş', 'Š': 'š', 'Ţ': 'ţ', 'Ť': 'ť', 'Ŧ': 'ŧ', 'Ũ': 'ũ', 'Ū': 'ū',
    'Ŭ': 'ŭ', 'Ů': 'ů', 'Ű': 'ű', 'Ų': 'ų', 'Ŵ': 'ŵ', 'Ŷ': 'ŷ', 'Ÿ': 'ÿ', 'Ź': 'ź', 'Ż': 'ż', 'Ž': 'ž', 'Ɓ': 'ɓ', 'Ƃ': 'ƃ', 'Ƅ': 'ƅ', 'Ɔ': 'ɔ', 'Ƈ': 'ƈ', 'Ɖ': 'ɖ', 'Ɗ': 'ɗ', 'Ƌ': 'ƌ',
    'Ǝ': 'ǝ', 'Ə': 'ə', 'Ɛ': 'ɛ', 'Ƒ': 'ƒ', 'Ɠ': 'ɠ', 'Ɣ': 'ɣ', 'Ɩ': 'ɩ', 'Ɨ': 'ɨ', 'Ƙ': 'ƙ', 'Ɯ': 'ɯ', 'Ɲ': 'ɲ', 'Ɵ': 'ɵ', 'Ơ': 'ơ', 'Ƣ': 'ƣ', 'Ƥ': 'ƥ', 'Ƨ': 'ƨ', 'Ʃ': 'ʃ', 'Ƭ': 'ƭ',
    'Ʈ': 'ʈ', 'Ư': 'ư', 'Ʊ': 'ʊ', 'Ʋ': 'ʋ', 'Ƴ': 'ƴ', 'Ƶ': 'ƶ', 'Ʒ': 'ʒ', 'Ƹ': 'ƹ', 'Ƽ': 'ƽ', 'Ǆ': 'ǆ', 'Ǉ': 'ǉ', 'Ǌ': 'ǌ', 'Ǎ': 'ǎ', 'Ǐ': 'ǐ', 'Ǒ': 'ǒ', 'Ǔ': 'ǔ', 'Ǖ': 'ǖ', 'Ǘ': 'ǘ',
    'Ǚ': 'ǚ', 'Ǜ': 'ǜ', 'Ǟ': 'ǟ', 'Ǡ': 'ǡ', 'Ǣ': 'ǣ', 'Ǥ': 'ǥ', 'Ǧ': 'ǧ', 'Ǩ': 'ǩ', 'Ǫ': 'ǫ', 'Ǭ': 'ǭ', 'Ǯ': 'ǯ', 'Ǳ': 'ǳ', 'Ǵ': 'ǵ', 'Ǻ': 'ǻ', 'Ǽ': 'ǽ', 'Ǿ': 'ǿ', 'Ȁ': 'ȁ', 'Ȃ': 'ȃ',
    'Ȅ': 'ȅ', 'Ȇ': 'ȇ', 'Ȉ': 'ȉ', 'Ȋ': 'ȋ', 'Ȍ': 'ȍ', 'Ȏ': 'ȏ', 'Ȑ': 'ȑ', 'Ȓ': 'ȓ', 'Ȕ': 'ȕ', 'Ȗ': 'ȗ', 'Ά': 'ά', 'Έ': 'έ', 'Ή': 'ή', 'Ί': 'ί', 'Ό': 'ό', 'Ύ': 'ύ', 'Ώ': 'ώ', 'Α': 'α',
    'Β': 'β', 'Γ': 'γ', 'Δ': 'δ', 'Ε': 'ε', 'Ζ': 'ζ', 'Η': 'η', 'Θ': 'θ', 'Ι': 'ι', 'Κ': 'κ', 'Λ': 'λ', 'Μ': 'μ', 'Ν': 'ν', 'Ξ': 'ξ', 'Ο': 'ο', 'Π': 'π', 'Ρ': 'ρ', 'Σ': 'σ', 'Τ': 'τ',
    'Υ': 'υ', 'Φ': 'φ', 'Χ': 'χ', 'Ψ': 'ψ', 'Ω': 'ω', 'Ϊ': 'ϊ', 'Ϋ': 'ϋ', 'Ϣ': 'ϣ', 'Ϥ': 'ϥ', 'Ϧ': 'ϧ', 'Ϩ': 'ϩ', 'Ϫ': 'ϫ', 'Ϭ': 'ϭ', 'Ϯ': 'ϯ', 'Ё': 'ё', 'Ђ': 'ђ', 'Ѓ': 'ѓ', 'Є': 'є',
    'Ѕ': 'ѕ', 'І': 'і', 'Ї': 'ї', 'Ј': 'ј', 'Љ': 'љ', 'Њ': 'њ', 'Ћ': 'ћ', 'Ќ': 'ќ', 'Ў': 'ў', 'Џ': 'џ', 'А': 'а', 'Б': 'б', 'В': 'в', 'Г': 'г', 'Д': 'д', 'Е': 'е', 'Ж': 'ж', 'З': 'з',
    'И': 'и', 'Й': 'й', 'К': 'к', 'Л': 'л', 'М': 'м', 'Н': 'н', 'О': 'о', 'П': 'п', 'Р': 'р', 'С': 'с', 'Т': 'т', 'У': 'у', 'Ф': 'ф', 'Х': 'х', 'Ц': 'ц', 'Ч': 'ч', 'Ш': 'ш', 'Щ': 'щ',
    'Ъ': 'ъ', 'Ы': 'ы', 'Ь': 'ь', 'Э': 'э', 'Ю': 'ю', 'Я': 'я', 'Ѡ': 'ѡ', 'Ѣ': 'ѣ', 'Ѥ': 'ѥ', 'Ѧ': 'ѧ', 'Ѩ': 'ѩ', 'Ѫ': 'ѫ', 'Ѭ': 'ѭ', 'Ѯ': 'ѯ', 'Ѱ': 'ѱ', 'Ѳ': 'ѳ', 'Ѵ': 'ѵ', 'Ѷ': 'ѷ',
    'Ѹ': 'ѹ', 'Ѻ': 'ѻ', 'Ѽ': 'ѽ', 'Ѿ': 'ѿ', 'Ҁ': 'ҁ', 'Ґ': 'ґ', 'Ғ': 'ғ', 'Ҕ': 'ҕ', 'Җ': 'җ', 'Ҙ': 'ҙ', 'Қ': 'қ', 'Ҝ': 'ҝ', 'Ҟ': 'ҟ', 'Ҡ': 'ҡ', 'Ң': 'ң', 'Ҥ': 'ҥ', 'Ҧ': 'ҧ', 'Ҩ': 'ҩ',
    'Ҫ': 'ҫ', 'Ҭ': 'ҭ', 'Ү': 'ү', 'Ұ': 'ұ', 'Ҳ': 'ҳ', 'Ҵ': 'ҵ', 'Ҷ': 'ҷ', 'Ҹ': 'ҹ', 'Һ': 'һ', 'Ҽ': 'ҽ', 'Ҿ': 'ҿ', 'Ӂ': 'ӂ', 'Ӄ': 'ӄ', 'Ӈ': 'ӈ', 'Ӌ': 'ӌ', 'Ӑ': 'ӑ', 'Ӓ': 'ӓ', 'Ӕ': 'ӕ',
    'Ӗ': 'ӗ', 'Ә': 'ә', 'Ӛ': 'ӛ', 'Ӝ': 'ӝ', 'Ӟ': 'ӟ', 'Ӡ': 'ӡ', 'Ӣ': 'ӣ', 'Ӥ': 'ӥ', 'Ӧ': 'ӧ', 'Ө': 'ө', 'Ӫ': 'ӫ', 'Ӯ': 'ӯ', 'Ӱ': 'ӱ', 'Ӳ': 'ӳ', 'Ӵ': 'ӵ', 'Ӹ': 'ӹ', 'Ա': 'ա', 'Բ': 'բ',
    'Գ': 'գ', 'Դ': 'դ', 'Ե': 'ե', 'Զ': 'զ', 'Է': 'է', 'Ը': 'ը', 'Թ': 'թ', 'Ժ': 'ժ', 'Ի': 'ի', 'Լ': 'լ', 'Խ': 'խ', 'Ծ': 'ծ', 'Կ': 'կ', 'Հ': 'հ', 'Ձ': 'ձ', 'Ղ': 'ղ', 'Ճ': 'ճ', 'Մ': 'մ',
    'Յ': 'յ', 'Ն': 'ն', 'Շ': 'շ', 'Ո': 'ո', 'Չ': 'չ', 'Պ': 'պ', 'Ջ': 'ջ', 'Ռ': 'ռ', 'Ս': 'ս', 'Վ': 'վ', 'Տ': 'տ', 'Ր': 'ր', 'Ց': 'ց', 'Ւ': 'ւ', 'Փ': 'փ', 'Ք': 'ք', 'Օ': 'օ', 'Ֆ': 'ֆ',
    'Ⴀ': 'ა', 'Ⴁ': 'ბ', 'Ⴂ': 'გ', 'Ⴃ': 'დ', 'Ⴄ': 'ე', 'Ⴅ': 'ვ', 'Ⴆ': 'ზ', 'Ⴇ': 'თ', 'Ⴈ': 'ი', 'Ⴉ': 'კ', 'Ⴊ': 'ლ', 'Ⴋ': 'მ', 'Ⴌ': 'ნ', 'Ⴍ': 'ო', 'Ⴎ': 'პ', 'Ⴏ': 'ჟ', 'Ⴐ': 'რ',
    'Ⴑ': 'ს', 'Ⴒ': 'ტ', 'Ⴓ': 'უ', 'Ⴔ': 'ფ', 'Ⴕ': 'ქ', 'Ⴖ': 'ღ', 'Ⴗ': 'ყ', 'Ⴘ': 'შ', 'Ⴙ': 'ჩ', 'Ⴚ': 'ც', 'Ⴛ': 'ძ', 'Ⴜ': 'წ', 'Ⴝ': 'ჭ', 'Ⴞ': 'ხ', 'Ⴟ': 'ჯ', 'Ⴠ': 'ჰ', 'Ⴡ': 'ჱ',
    'Ⴢ': 'ჲ', 'Ⴣ': 'ჳ', 'Ⴤ': 'ჴ', 'Ⴥ': 'ჵ', 'Ḁ': 'ḁ', 'Ḃ': 'ḃ', 'Ḅ': 'ḅ', 'Ḇ': 'ḇ', 'Ḉ': 'ḉ', 'Ḋ': 'ḋ', 'Ḍ': 'ḍ', 'Ḏ': 'ḏ', 'Ḑ': 'ḑ', 'Ḓ': 'ḓ', 'Ḕ': 'ḕ', 'Ḗ': 'ḗ', 'Ḙ': 'ḙ', 'Ḛ': 'ḛ',
    'Ḝ': 'ḝ', 'Ḟ': 'ḟ', 'Ḡ': 'ḡ', 'Ḣ': 'ḣ', 'Ḥ': 'ḥ', 'Ḧ': 'ḧ', 'Ḩ': 'ḩ', 'Ḫ': 'ḫ', 'Ḭ': 'ḭ', 'Ḯ': 'ḯ', 'Ḱ': 'ḱ', 'Ḳ': 'ḳ', 'Ḵ': 'ḵ', 'Ḷ': 'ḷ', 'Ḹ': 'ḹ', 'Ḻ': 'ḻ', 'Ḽ': 'ḽ', 'Ḿ': 'ḿ',
    'Ṁ': 'ṁ', 'Ṃ': 'ṃ', 'Ṅ': 'ṅ', 'Ṇ': 'ṇ', 'Ṉ': 'ṉ', 'Ṋ': 'ṋ', 'Ṍ': 'ṍ', 'Ṏ': 'ṏ', 'Ṑ': 'ṑ', 'Ṓ': 'ṓ', 'Ṕ': 'ṕ', 'Ṗ': 'ṗ', 'Ṙ': 'ṙ', 'Ṛ': 'ṛ', 'Ṝ': 'ṝ', 'Ṟ': 'ṟ', 'Ṡ': 'ṡ', 'Ṣ': 'ṣ',
    'Ṥ': 'ṥ', 'Ṧ': 'ṧ', 'Ṩ': 'ṩ', 'Ṫ': 'ṫ', 'Ṭ': 'ṭ', 'Ṯ': 'ṯ', 'Ṱ': 'ṱ', 'Ṳ': 'ṳ', 'Ṵ': 'ṵ', 'Ṷ': 'ṷ', 'Ṹ': 'ṹ', 'Ṻ': 'ṻ', 'Ṽ': 'ṽ', 'Ṿ': 'ṿ', 'Ẁ': 'ẁ', 'Ẃ': 'ẃ', 'Ẅ': 'ẅ', 'Ẇ': 'ẇ',
    'Ẉ': 'ẉ', 'Ẋ': 'ẋ', 'Ẍ': 'ẍ', 'Ẏ': 'ẏ', 'Ẑ': 'ẑ', 'Ẓ': 'ẓ', 'Ẕ': 'ẕ', 'Ạ': 'ạ', 'Ả': 'ả', 'Ấ': 'ấ', 'Ầ': 'ầ', 'Ẩ': 'ẩ', 'Ẫ': 'ẫ', 'Ậ': 'ậ', 'Ắ': 'ắ', 'Ằ': 'ằ', 'Ẳ': 'ẳ', 'Ẵ': 'ẵ',
    'Ặ': 'ặ', 'Ẹ': 'ẹ', 'Ẻ': 'ẻ', 'Ẽ': 'ẽ', 'Ế': 'ế', 'Ề': 'ề', 'Ể': 'ể', 'Ễ': 'ễ', 'Ệ': 'ệ', 'Ỉ': 'ỉ', 'Ị': 'ị', 'Ọ': 'ọ', 'Ỏ': 'ỏ', 'Ố': 'ố', 'Ồ': 'ồ', 'Ổ': 'ổ', 'Ỗ': 'ỗ', 'Ộ': 'ộ',
    'Ớ': 'ớ', 'Ờ': 'ờ', 'Ở': 'ở', 'Ỡ': 'ỡ', 'Ợ': 'ợ', 'Ụ': 'ụ', 'Ủ': 'ủ', 'Ứ': 'ứ', 'Ừ': 'ừ', 'Ử': 'ử', 'Ữ': 'ữ', 'Ự': 'ự', 'Ỳ': 'ỳ', 'Ỵ': 'ỵ', 'Ỷ': 'ỷ', 'Ỹ': 'ỹ', 'Ἀ': 'ἀ', 'Ἁ': 'ἁ',
    'Ἂ': 'ἂ', 'Ἃ': 'ἃ', 'Ἄ': 'ἄ', 'Ἅ': 'ἅ', 'Ἆ': 'ἆ', 'Ἇ': 'ἇ', 'Ἐ': 'ἐ', 'Ἑ': 'ἑ', 'Ἒ': 'ἒ', 'Ἓ': 'ἓ', 'Ἔ': 'ἔ', 'Ἕ': 'ἕ', 'Ἠ': 'ἠ', 'Ἡ': 'ἡ', 'Ἢ': 'ἢ', 'Ἣ': 'ἣ', 'Ἤ': 'ἤ', 'Ἥ': 'ἥ',
    'Ἦ': 'ἦ', 'Ἧ': 'ἧ', 'Ἰ': 'ἰ', 'Ἱ': 'ἱ', 'Ἲ': 'ἲ', 'Ἳ': 'ἳ', 'Ἴ': 'ἴ', 'Ἵ': 'ἵ', 'Ἶ': 'ἶ', 'Ἷ': 'ἷ', 'Ὀ': 'ὀ', 'Ὁ': 'ὁ', 'Ὂ': 'ὂ', 'Ὃ': 'ὃ', 'Ὄ': 'ὄ', 'Ὅ': 'ὅ', 'Ὑ': 'ὑ', 'Ὓ': 'ὓ',
    'Ὕ': 'ὕ', 'Ὗ': 'ὗ', 'Ὠ': 'ὠ', 'Ὡ': 'ὡ', 'Ὢ': 'ὢ', 'Ὣ': 'ὣ', 'Ὤ': 'ὤ', 'Ὥ': 'ὥ', 'Ὦ': 'ὦ', 'Ὧ': 'ὧ', 'Ᾰ': 'ᾰ', 'Ᾱ': 'ᾱ', 'Ὰ': 'ὰ', 'Ά': 'ά', 'Ὲ': 'ὲ', 'Έ': 'έ', 'Ὴ': 'ὴ', 'Ή': 'ή',
    'Ῐ': 'ῐ', 'Ῑ': 'ῑ', 'Ὶ': 'ὶ', 'Ί': 'ί', 'Ῠ': 'ῠ', 'Ῡ': 'ῡ', 'Ὺ': 'ὺ', 'Ύ': 'ύ', 'Ῥ': 'ῥ', 'Ὸ': 'ὸ', 'Ό': 'ό', 'Ὼ': 'ὼ', 'Ώ': 'ώ', 'Ⅰ': 'ⅰ', 'Ⅱ': 'ⅱ', 'Ⅲ': 'ⅲ', 'Ⅳ': 'ⅳ', 'Ⅴ': 'ⅴ',
    'Ⅵ': 'ⅵ', 'Ⅶ': 'ⅶ', 'Ⅷ': 'ⅷ', 'Ⅸ': 'ⅸ', 'Ⅹ': 'ⅹ', 'Ⅺ': 'ⅺ', 'Ⅻ': 'ⅻ', 'Ⅼ': 'ⅼ', 'Ⅽ': 'ⅽ', 'Ⅾ': 'ⅾ', 'Ⅿ': 'ⅿ', 'Ⓐ': 'ⓐ', 'Ⓑ': 'ⓑ', 'Ⓒ': 'ⓒ', 'Ⓓ': 'ⓓ', 'Ⓔ': 'ⓔ',
    'Ⓕ': 'ⓕ', 'Ⓖ': 'ⓖ', 'Ⓗ': 'ⓗ', 'Ⓘ': 'ⓘ', 'Ⓙ': 'ⓙ', 'Ⓚ': 'ⓚ', 'Ⓛ': 'ⓛ', 'Ⓜ': 'ⓜ', 'Ⓝ': 'ⓝ', 'Ⓞ': 'ⓞ', 'Ⓟ': 'ⓟ', 'Ⓠ': 'ⓠ', 'Ⓡ': 'ⓡ', 'Ⓢ': 'ⓢ', 'Ⓣ': 'ⓣ',
    'Ⓤ': 'ⓤ', 'Ⓥ': 'ⓥ', 'Ⓦ': 'ⓦ', 'Ⓧ': 'ⓧ', 'Ⓨ': 'ⓨ', 'Ⓩ': 'ⓩ', 'Ａ': 'ａ', 'Ｂ': 'ｂ', 'Ｃ': 'ｃ', 'Ｄ': 'ｄ', 'Ｅ': 'ｅ', 'Ｆ': 'ｆ', 'Ｇ': 'ｇ', 'Ｈ': 'ｈ', 'Ｉ': 'ｉ',
    'Ｊ': 'ｊ', 'Ｋ': 'ｋ', 'Ｌ': 'ｌ', 'Ｍ': 'ｍ', 'Ｎ': 'ｎ', 'Ｏ': 'ｏ', 'Ｐ': 'ｐ', 'Ｑ': 'ｑ', 'Ｒ': 'ｒ', 'Ｓ': 'ｓ', 'Ｔ': 'ｔ', 'Ｕ': 'ｕ', 'Ｖ': 'ｖ', 'Ｗ': 'ｗ', 'Ｘ': 'ｘ',
    'Ｙ': 'ｙ', 'Ｚ': 'ｚ'
};


export const mono_upper_map = {
    'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D', 'e': 'E', 'f': 'F', 'g': 'G', 'h': 'H', 'i': 'I', 'j': 'J', 'k': 'K', 'l': 'L', 'm': 'M', 'n': 'N', 'o': 'O', 'p': 'P', 'q': 'Q', 'r': 'R',
    's': 'S', 't': 'T', 'u': 'U', 'v': 'V', 'w': 'W', 'x': 'X', 'y': 'Y', 'z': 'Z', 'à': 'À', 'á': 'Á', 'â': 'Â', 'ã': 'Ã', 'ä': 'Ä', 'å': 'Å', 'æ': 'Æ', 'ç': 'Ç', 'è': 'È', 'é': 'É',
    'ê': 'Ê', 'ë': 'Ë', 'ì': 'Ì', 'í': 'Í', 'î': 'Î', 'ï': 'Ï', 'ð': 'Ð', 'ñ': 'Ñ', 'ò': 'Ò', 'ó': 'Ó', 'ô': 'Ô', 'õ': 'Õ', 'ö': 'Ö', 'ø': 'Ø', 'ù': 'Ù', 'ú': 'Ú', 'û': 'Û', 'ü': 'Ü',
    'ý': 'Ý', 'þ': 'Þ', 'ā': 'Ā', 'ă': 'Ă', 'ą': 'Ą', 'ć': 'Ć', 'ĉ': 'Ĉ', 'ċ': 'Ċ', 'č': 'Č', 'ď': 'Ď', 'đ': 'Đ', 'ē': 'Ē', 'ĕ': 'Ĕ', 'ė': 'Ė', 'ę': 'Ę', 'ě': 'Ě', 'ĝ': 'Ĝ', 'ğ': 'Ğ',
    'ġ': 'Ġ', 'ģ': 'Ģ', 'ĥ': 'Ĥ', 'ħ': 'Ħ', 'ĩ': 'Ĩ', 'ī': 'Ī', 'ĭ': 'Ĭ', 'į': 'Į', 'ĳ': 'Ĳ', 'ĵ': 'Ĵ', 'ķ': 'Ķ', 'ĺ': 'Ĺ', 'ļ': 'Ļ', 'ľ': 'Ľ', 'ŀ': 'Ŀ', 'ł': 'Ł', 'ń': 'Ń', 'ņ': 'Ņ',
    'ň': 'Ň', 'ŋ': 'Ŋ', 'ō': 'Ō', 'ŏ': 'Ŏ', 'ő': 'Ő', 'œ': 'Œ', 'ŕ': 'Ŕ', 'ŗ': 'Ŗ', 'ř': 'Ř', 'ś': 'Ś', 'ŝ': 'Ŝ', 'ş': 'Ş', 'š': 'Š', 'ţ': 'Ţ', 'ť': 'Ť', 'ŧ': 'Ŧ', 'ũ': 'Ũ', 'ū': 'Ū',
    'ŭ': 'Ŭ', 'ů': 'Ů', 'ű': 'Ű', 'ų': 'Ų', 'ŵ': 'Ŵ', 'ŷ': 'Ŷ', 'ÿ': 'Ÿ', 'ź': 'Ź', 'ż': 'Ż', 'ž': 'Ž', 'ɓ': 'Ɓ', 'ƃ': 'Ƃ', 'ƅ': 'Ƅ', 'ɔ': 'Ɔ', 'ƈ': 'Ƈ', 'ɖ': 'Ɖ', 'ɗ': 'Ɗ', 'ƌ': 'Ƌ',
    'ǝ': 'Ǝ', 'ə': 'Ə', 'ɛ': 'Ɛ', 'ƒ': 'Ƒ', 'ɠ': 'Ɠ', 'ɣ': 'Ɣ', 'ɩ': 'Ɩ', 'ɨ': 'Ɨ', 'ƙ': 'Ƙ', 'ɯ': 'Ɯ', 'ɲ': 'Ɲ', 'ɵ': 'Ɵ', 'ơ': 'Ơ', 'ƣ': 'Ƣ', 'ƥ': 'Ƥ', 'ƨ': 'Ƨ', 'ʃ': 'Ʃ', 'ƭ': 'Ƭ',
    'ʈ': 'Ʈ', 'ư': 'Ư', 'ʊ': 'Ʊ', 'ʋ': 'Ʋ', 'ƴ': 'Ƴ', 'ƶ': 'Ƶ', 'ʒ': 'Ʒ', 'ƹ': 'Ƹ', 'ƽ': 'Ƽ', 'ǆ': 'Ǆ', 'ǉ': 'Ǉ', 'ǌ': 'Ǌ', 'ǎ': 'Ǎ', 'ǐ': 'Ǐ', 'ǒ': 'Ǒ', 'ǔ': 'Ǔ', 'ǖ': 'Ǖ', 'ǘ': 'Ǘ',
    'ǚ': 'Ǚ', 'ǜ': 'Ǜ', 'ǟ': 'Ǟ', 'ǡ': 'Ǡ', 'ǣ': 'Ǣ', 'ǥ': 'Ǥ', 'ǧ': 'Ǧ', 'ǩ': 'Ǩ', 'ǫ': 'Ǫ', 'ǭ': 'Ǭ', 'ǯ': 'Ǯ', 'ǳ': 'Ǳ', 'ǵ': 'Ǵ', 'ǻ': 'Ǻ', 'ǽ': 'Ǽ', 'ǿ': 'Ǿ', 'ȁ': 'Ȁ', 'ȃ': 'Ȃ',
    'ȅ': 'Ȅ', 'ȇ': 'Ȇ', 'ȉ': 'Ȉ', 'ȋ': 'Ȋ', 'ȍ': 'Ȍ', 'ȏ': 'Ȏ', 'ȑ': 'Ȑ', 'ȓ': 'Ȓ', 'ȕ': 'Ȕ', 'ȗ': 'Ȗ', 'ά': 'Ά', 'έ': 'Έ', 'ή': 'Ή', 'ί': 'Ί', 'ό': 'Ό', 'ύ': 'Ύ', 'ώ': 'Ώ', 'α': 'Α',
    'β': 'Β', 'γ': 'Γ', 'δ': 'Δ', 'ε': 'Ε', 'ζ': 'Ζ', 'η': 'Η', 'θ': 'Θ', 'ι': 'Ι', 'κ': 'Κ', 'λ': 'Λ', 'μ': 'Μ', 'ν': 'Ν', 'ξ': 'Ξ', 'ο': 'Ο', 'π': 'Π', 'ρ': 'Ρ', 'σ': 'Σ', 'τ': 'Τ',
    'υ': 'Υ', 'φ': 'Φ', 'χ': 'Χ', 'ψ': 'Ψ', 'ω': 'Ω', 'ϊ': 'Ϊ', 'ϋ': 'Ϋ', 'ς': 'Σ', 'ϣ': 'Ϣ', 'ϥ': 'Ϥ', 'ϧ': 'Ϧ', 'ϩ': 'Ϩ', 'ϫ': 'Ϫ', 'ϭ': 'Ϭ', 'ϯ': 'Ϯ', 'ё': 'Ё', 'ђ': 'Ђ', 'ѓ': 'Ѓ',
    'є': 'Є', 'ѕ': 'Ѕ', 'і': 'І', 'ї': 'Ї', 'ј': 'Ј', 'љ': 'Љ', 'њ': 'Њ', 'ћ': 'Ћ', 'ќ': 'Ќ', 'ў': 'Ў', 'џ': 'Џ', 'а': 'А', 'б': 'Б', 'в': 'В', 'г': 'Г', 'д': 'Д', 'е': 'Е', 'ж': 'Ж',
    'з': 'З', 'и': 'И', 'й': 'Й', 'к': 'К', 'л': 'Л', 'м': 'М', 'н': 'Н', 'о': 'О', 'п': 'П', 'р': 'Р', 'с': 'С', 'т': 'Т', 'у': 'У', 'ф': 'Ф', 'х': 'Х', 'ц': 'Ц', 'ч': 'Ч', 'ш': 'Ш',
    'щ': 'Щ', 'ъ': 'Ъ', 'ы': 'Ы', 'ь': 'Ь', 'э': 'Э', 'ю': 'Ю', 'я': 'Я', 'ѡ': 'Ѡ', 'ѣ': 'Ѣ', 'ѥ': 'Ѥ', 'ѧ': 'Ѧ', 'ѩ': 'Ѩ', 'ѫ': 'Ѫ', 'ѭ': 'Ѭ', 'ѯ': 'Ѯ', 'ѱ': 'Ѱ', 'ѳ': 'Ѳ', 'ѵ': 'Ѵ',
    'ѷ': 'Ѷ', 'ѹ': 'Ѹ', 'ѻ': 'Ѻ', 'ѽ': 'Ѽ', 'ѿ': 'Ѿ', 'ҁ': 'Ҁ', 'ґ': 'Ґ', 'ғ': 'Ғ', 'ҕ': 'Ҕ', 'җ': 'Җ', 'ҙ': 'Ҙ', 'қ': 'Қ', 'ҝ': 'Ҝ', 'ҟ': 'Ҟ', 'ҡ': 'Ҡ', 'ң': 'Ң', 'ҥ': 'Ҥ', 'ҧ': 'Ҧ',
    'ҩ': 'Ҩ', 'ҫ': 'Ҫ', 'ҭ': 'Ҭ', 'ү': 'Ү', 'ұ': 'Ұ', 'ҳ': 'Ҳ', 'ҵ': 'Ҵ', 'ҷ': 'Ҷ', 'ҹ': 'Ҹ', 'һ': 'Һ', 'ҽ': 'Ҽ', 'ҿ': 'Ҿ', 'ӂ': 'Ӂ', 'ӄ': 'Ӄ', 'ӈ': 'Ӈ', 'ӌ': 'Ӌ', 'ӑ': 'Ӑ', 'ӓ': 'Ӓ',
    'ӕ': 'Ӕ', 'ӗ': 'Ӗ', 'ә': 'Ә', 'ӛ': 'Ӛ', 'ӝ': 'Ӝ', 'ӟ': 'Ӟ', 'ӡ': 'Ӡ', 'ӣ': 'Ӣ', 'ӥ': 'Ӥ', 'ӧ': 'Ӧ', 'ө': 'Ө', 'ӫ': 'Ӫ', 'ӯ': 'Ӯ', 'ӱ': 'Ӱ', 'ӳ': 'Ӳ', 'ӵ': 'Ӵ', 'ӹ': 'Ӹ', 'ա': 'Ա',
    'բ': 'Բ', 'գ': 'Գ', 'դ': 'Դ', 'ե': 'Ե', 'զ': 'Զ', 'է': 'Է', 'ը': 'Ը', 'թ': 'Թ', 'ժ': 'Ժ', 'ի': 'Ի', 'լ': 'Լ', 'խ': 'Խ', 'ծ': 'Ծ', 'կ': 'Կ', 'հ': 'Հ', 'ձ': 'Ձ', 'ղ': 'Ղ', 'ճ': 'Ճ',
    'մ': 'Մ', 'յ': 'Յ', 'ն': 'Ն', 'շ': 'Շ', 'ո': 'Ո', 'չ': 'Չ', 'պ': 'Պ', 'ջ': 'Ջ', 'ռ': 'Ռ', 'ս': 'Ս', 'վ': 'Վ', 'տ': 'Տ', 'ր': 'Ր', 'ց': 'Ց', 'ւ': 'Ւ', 'փ': 'Փ', 'ք': 'Ք', 'օ': 'Օ',
    'ֆ': 'Ֆ', 'ḁ': 'Ḁ', 'ḃ': 'Ḃ', 'ḅ': 'Ḅ', 'ḇ': 'Ḇ', 'ḉ': 'Ḉ', 'ḋ': 'Ḋ', 'ḍ': 'Ḍ', 'ḏ': 'Ḏ', 'ḑ': 'Ḑ', 'ḓ': 'Ḓ', 'ḕ': 'Ḕ', 'ḗ': 'Ḗ', 'ḙ': 'Ḙ', 'ḛ': 'Ḛ', 'ḝ': 'Ḝ', 'ḟ': 'Ḟ', 'ḡ': 'Ḡ',
    'ḣ': 'Ḣ', 'ḥ': 'Ḥ', 'ḧ': 'Ḧ', 'ḩ': 'Ḩ', 'ḫ': 'Ḫ', 'ḭ': 'Ḭ', 'ḯ': 'Ḯ', 'ḱ': 'Ḱ', 'ḳ': 'Ḳ', 'ḵ': 'Ḵ', 'ḷ': 'Ḷ', 'ḹ': 'Ḹ', 'ḻ': 'Ḻ', 'ḽ': 'Ḽ', 'ḿ': 'Ḿ', 'ṁ': 'Ṁ', 'ṃ': 'Ṃ', 'ṅ': 'Ṅ',
    'ṇ': 'Ṇ', 'ṉ': 'Ṉ', 'ṋ': 'Ṋ', 'ṍ': 'Ṍ', 'ṏ': 'Ṏ', 'ṑ': 'Ṑ', 'ṓ': 'Ṓ', 'ṕ': 'Ṕ', 'ṗ': 'Ṗ', 'ṙ': 'Ṙ', 'ṛ': 'Ṛ', 'ṝ': 'Ṝ', 'ṟ': 'Ṟ', 'ṡ': 'Ṡ', 'ṣ': 'Ṣ', 'ṥ': 'Ṥ', 'ṧ': 'Ṧ', 'ṩ': 'Ṩ',
    'ṫ': 'Ṫ', 'ṭ': 'Ṭ', 'ṯ': 'Ṯ', 'ṱ': 'Ṱ', 'ṳ': 'Ṳ', 'ṵ': 'Ṵ', 'ṷ': 'Ṷ', 'ṹ': 'Ṹ', 'ṻ': 'Ṻ', 'ṽ': 'Ṽ', 'ṿ': 'Ṿ', 'ẁ': 'Ẁ', 'ẃ': 'Ẃ', 'ẅ': 'Ẅ', 'ẇ': 'Ẇ', 'ẉ': 'Ẉ', 'ẋ': 'Ẋ', 'ẍ': 'Ẍ',
    'ẏ': 'Ẏ', 'ẑ': 'Ẑ', 'ẓ': 'Ẓ', 'ẕ': 'Ẕ', 'ạ': 'Ạ', 'ả': 'Ả', 'ấ': 'Ấ', 'ầ': 'Ầ', 'ẩ': 'Ẩ', 'ẫ': 'Ẫ', 'ậ': 'Ậ', 'ắ': 'Ắ', 'ằ': 'Ằ', 'ẳ': 'Ẳ', 'ẵ': 'Ẵ', 'ặ': 'Ặ', 'ẹ': 'Ẹ', 'ẻ': 'Ẻ',
    'ẽ': 'Ẽ', 'ế': 'Ế', 'ề': 'Ề', 'ể': 'Ể', 'ễ': 'Ễ', 'ệ': 'Ệ', 'ỉ': 'Ỉ', 'ị': 'Ị', 'ọ': 'Ọ', 'ỏ': 'Ỏ', 'ố': 'Ố', 'ồ': 'Ồ', 'ổ': 'Ổ', 'ỗ': 'Ỗ', 'ộ': 'Ộ', 'ớ': 'Ớ', 'ờ': 'Ờ', 'ở': 'Ở',
    'ỡ': 'Ỡ', 'ợ': 'Ợ', 'ụ': 'Ụ', 'ủ': 'Ủ', 'ứ': 'Ứ', 'ừ': 'Ừ', 'ử': 'Ử', 'ữ': 'Ữ', 'ự': 'Ự', 'ỳ': 'Ỳ', 'ỵ': 'Ỵ', 'ỷ': 'Ỷ', 'ỹ': 'Ỹ', 'ἀ': 'Ἀ', 'ἁ': 'Ἁ', 'ἂ': 'Ἂ', 'ἃ': 'Ἃ', 'ἄ': 'Ἄ',
    'ἅ': 'Ἅ', 'ἆ': 'Ἆ', 'ἇ': 'Ἇ', 'ἐ': 'Ἐ', 'ἑ': 'Ἑ', 'ἒ': 'Ἒ', 'ἓ': 'Ἓ', 'ἔ': 'Ἔ', 'ἕ': 'Ἕ', 'ἠ': 'Ἠ', 'ἡ': 'Ἡ', 'ἢ': 'Ἢ', 'ἣ': 'Ἣ', 'ἤ': 'Ἤ', 'ἥ': 'Ἥ', 'ἦ': 'Ἦ', 'ἧ': 'Ἧ', 'ἰ': 'Ἰ',
    'ἱ': 'Ἱ', 'ἲ': 'Ἲ', 'ἳ': 'Ἳ', 'ἴ': 'Ἴ', 'ἵ': 'Ἵ', 'ἶ': 'Ἶ', 'ἷ': 'Ἷ', 'ὀ': 'Ὀ', 'ὁ': 'Ὁ', 'ὂ': 'Ὂ', 'ὃ': 'Ὃ', 'ὄ': 'Ὄ', 'ὅ': 'Ὅ', 'ὑ': 'Ὑ', 'ὓ': 'Ὓ', 'ὕ': 'Ὕ', 'ὗ': 'Ὗ', 'ὠ': 'Ὠ',
    'ὡ': 'Ὡ', 'ὢ': 'Ὢ', 'ὣ': 'Ὣ', 'ὤ': 'Ὤ', 'ὥ': 'Ὥ', 'ὦ': 'Ὦ', 'ὧ': 'Ὧ', 'ᾰ': 'Ᾰ', 'ᾱ': 'Ᾱ', 'ὰ': 'Ὰ', 'ά': 'Ά', 'ὲ': 'Ὲ', 'έ': 'Έ', 'ὴ': 'Ὴ', 'ή': 'Ή', 'ῐ': 'Ῐ', 'ῑ': 'Ῑ', 'ὶ': 'Ὶ',
    'ί': 'Ί', 'ῠ': 'Ῠ', 'ῡ': 'Ῡ', 'ὺ': 'Ὺ', 'ύ': 'Ύ', 'ῥ': 'Ῥ', 'ὸ': 'Ὸ', 'ό': 'Ό', 'ὼ': 'Ὼ', 'ώ': 'Ώ', 'ⅰ': 'Ⅰ', 'ⅱ': 'Ⅱ', 'ⅲ': 'Ⅲ', 'ⅳ': 'Ⅳ', 'ⅴ': 'Ⅴ', 'ⅵ': 'Ⅵ', 'ⅶ': 'Ⅶ',
    'ⅷ': 'Ⅷ', 'ⅸ': 'Ⅸ', 'ⅹ': 'Ⅹ', 'ⅺ': 'Ⅺ', 'ⅻ': 'Ⅻ', 'ⅼ': 'Ⅼ', 'ⅽ': 'Ⅽ', 'ⅾ': 'Ⅾ', 'ⅿ': 'Ⅿ', 'ⓐ': 'Ⓐ', 'ⓑ': 'Ⓑ', 'ⓒ': 'Ⓒ', 'ⓓ': 'Ⓓ', 'ⓔ': 'Ⓔ', 'ⓕ': 'Ⓕ', 'ⓖ': 'Ⓖ',
    'ⓗ': 'Ⓗ', 'ⓘ': 'Ⓘ', 'ⓙ': 'Ⓙ', 'ⓚ': 'Ⓚ', 'ⓛ': 'Ⓛ', 'ⓜ': 'Ⓜ', 'ⓝ': 'Ⓝ', 'ⓞ': 'Ⓞ', 'ⓟ': 'Ⓟ', 'ⓠ': 'Ⓠ', 'ⓡ': 'Ⓡ', 'ⓢ': 'Ⓢ', 'ⓣ': 'Ⓣ', 'ⓤ': 'Ⓤ', 'ⓥ': 'Ⓥ',
    'ⓦ': 'Ⓦ', 'ⓧ': 'Ⓧ', 'ⓨ': 'Ⓨ', 'ⓩ': 'Ⓩ', 'ａ': 'Ａ', 'ｂ': 'Ｂ', 'ｃ': 'Ｃ', 'ｄ': 'Ｄ', 'ｅ': 'Ｅ', 'ｆ': 'Ｆ', 'ｇ': 'Ｇ', 'ｈ': 'Ｈ', 'ｉ': 'Ｉ', 'ｊ': 'Ｊ', 'ｋ': 'Ｋ',
    'ｌ': 'Ｌ', 'ｍ': 'Ｍ', 'ｎ': 'Ｎ', 'ｏ': 'Ｏ', 'ｐ': 'Ｐ', 'ｑ': 'Ｑ', 'ｒ': 'Ｒ', 'ｓ': 'Ｓ', 'ｔ': 'Ｔ', 'ｕ': 'Ｕ', 'ｖ': 'Ｖ', 'ｗ': 'Ｗ', 'ｘ': 'Ｘ', 'ｙ': 'Ｙ', 'ｚ': 'Ｚ'
};
