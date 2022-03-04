
const NUMBER_FLAG = 1 << 0;
const LOWER_CASE_FLAG = 1 << 1;
const UPPER_CASE_FLAG = 1 << 2;
const SYMBOL_FLAG = 1 << 3;

/*******************************************************
* fontTest Object
*******************************************************/
class FontTest {
    constructor(arg) {
        this.baseFonts = ['monospace', 'sans-serif', 'serif'];
        this.testString = `mmmmmmmmmmlli`;
        this.testSize = '72px';

        this.h = document.getElementsByTagName(`body`)[0];

        this.s = document.createElement(`span`);
        this.s.style.fontSize = this.testSize;
        this.s.innerHTML = this.testString;

        this.defaultWidth = {};
        this.defaultHeight = {};

        for (let index in this.baseFonts) {
            this.s.style.fontFamily = this.baseFonts[index];
            this.h.appendChild(this.s);
            this.defaultWidth[this.baseFonts[index]] = this.s.offsetWidth;
            this.defaultHeight[this.baseFonts[index]] = this.s.offsetHeight;
            this.h.removeChild(this.s)
        }
    }

    detect(font) {
        let detected = false;
        for (var index in this.baseFonts) {
            this.s.style.fontFamily = font + ',' + this.baseFonts[index];
            this.h.appendChild(this.s);
            let matched = (this.s.offsetWidth != this.defaultWidth[this.baseFonts[index]] || this.s.offsetHeight != this.defaultHeight[this.baseFonts[index]]);
            this.h.removeChild(this.s);
            detected = detected || matched
        }
        return detected;
    }
}

//alert(elem(`Font Texture`).tagName);

var fonts = [`Abadi MT Condensed Light`, `Albertus Extra Bold`, `Albertus Medium`, `Antique Olive`, `Arial`, `Arial Black`, `Arial MT`, `Arial Narrow`,
    `Bazooka`, `Book Antiqua`, `Bookman Old Style`, `Boulder`, `Calisto MT`, `Calligrapher`, `Century Gothic`, `Century Schoolbook`, `Cezanne`, `CG Omega`,
    `CG Times`, `Charlesworth`, `Chaucer`, `Clarendon Condensed`, `Comic Sans MS`, `Copperplate Gothic Bold`, `Copperplate Gothic Light`, `Cornerstone`,
    `Coronet`, `Courier`, `Courier New`, `Cuckoo`, `Dauphin`, `Denmark`, `Fransiscan`, `Garamond`, `Geneva`, `Haettenschweiler`, `Heather`, `Helvetica`, `Herald`,
    `Impact`, `Jester`, `Letter Gothic`, `Lithograph`, `Lithograph Light`, `Long Island`, `Lucida Console`, `Lucida Handwriting`, `Lucida Sans`,
    `Lucida Sans Unicode`, `Marigold`, `Market`, `Matisse ITC`, `MS LineDraw`, `News GothicMT`, `OCR A Extended`, `Old Century`, `Pegasus`, `Pickwick`,
    `Poster`, `Pythagoras`, `Sceptre`, `Sherwood`, `Signboard`, `Socket`, `Steamer`, `Storybook`, `Subway`, `Tahoma`, `Technical`, `Teletype`,
    `Tempus Sans ITC`, `Times`, `Times New Roman`, `Times New Roman PS`, `Trebuchet MS`, `Tristan`, `Tubular`, `Unicorn`, `Univers`, `Univers Condensed`,
    `Vagabond`, `Verdana`, `Westminster	Allegro`, `Amazone BT`, `AmerType Md BT`, `Arrus BT`, `Aurora Cn BT`, `AvantGarde Bk BT`, `AvantGarde Md BT`,
    `BankGothic Md BT`, `Benguiat Bk BT`, `BernhardFashion BT`, `BernhardMod BT`, `BinnerD`, `Bremen Bd BT`, `CaslonOpnface BT`, `Charter Bd BT`,
    `Charter BT`, `ChelthmITC Bk BT`, `CloisterBlack BT`, `CopperplGoth Bd BT`, `English 111 Vivace BT`, `EngraversGothic BT`, `Exotc350 Bd BT`,
    `Freefrm721 Blk BT`, `FrnkGothITC Bk BT`, `Futura Bk BT`, `Futura Lt BT`, `Futura Md BT`, `Futura ZBlk BT`, `FuturaBlack BT`, `Galliard BT`,
    `Geometr231 BT`, `Geometr231 Hv BT`, `Geometr231 Lt BT`, `GeoSlab 703 Lt BT`, `GeoSlab 703 XBd BT`, `GoudyHandtooled BT`, `GoudyOLSt BT`, `Humanst521 BT`,
    `Humanst 521 Cn BT`, `Humanst521 Lt BT`, `Incised901 Bd BT`, `Incised901 BT`, `Incised901 Lt BT`, `Informal011 BT`, `Kabel Bk BT`, `Kabel Ult BT`,
    `Kaufmann Bd BT`, `Kaufmann BT`, `Korinna BT`, `Lydian BT`, `Monotype Corsiva`, `NewsGoth BT`, `Onyx BT`, `OzHandicraft BT`, `PosterBodoni BT`, `PTBarnum BT`,
    `Ribbon131 Bd BT`, `Serifa BT`, `Serifa Th BT`, `ShelleyVolante BT`, `Souvenir Lt BT`, `Staccato222 BT`, `Swis721 BlkEx BT`, `Swiss911 XCm BT`,
    `TypoUpright BT`, `ZapfEllipt BT`, `ZapfHumnst BT`, `ZapfHumnst Dm BT`, `Zurich BlkEx BT`, `Zurich Ex BT`];

let d = new FontTest(), out = ``;
for (let i = 0, len = fonts.length; i < len; ++i) {
    if (d.detect(fonts[i])) out += `<option value="${fonts[i]}">${fonts[i]}</option>`;
}
elem(`familly_list`).innerHTML = out;
elem(`ft_familly`).value = elem(`familly_list`).firstElementChild.value;

var ft_flag = 0,
    ft_texture_name = ``,
    ft_char_str = ``,
    ft_zoom = 1,
    ft_mouse_over = false;

elem(`ft_zoom_btn`).innerHTML = ft_zoom;
//elem(`ft_canvas`).height = elem(`ft_texture_size`).value;
//elem(`ft_canvas`).width = elem(`ft_texture_size`).value;


const ft_draw = async () => {
    const char_str = `${ft_char_str.replace(/\s+/g, ``)} `;
    const size = Number(elem(`ft_texture_size`).value) * ft_zoom;

    let canvas = elem(`ft_canvas`);
    canvas.width = size, canvas.height = size;

    const ctx = canvas.getContext('2d');

    let familly = ``;
    if (elem(`is_italic`).checked) familly += `italic `;
    if (elem(`is_bold`).checked) familly += `bold `;

    ctx.font = familly + (Number(elem(`ft_fontsize`).value) * ft_zoom) + `px ` + elem(`ft_familly`).value;

    // Background
    ctx.fillStyle = hex_2_rgba(elem(`ft_background_color`).value, elem(`ft_background_alpha`).value);
    ctx.fillRect(0, 0, size, size);

    // Font style
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = hex_2_rgba(elem(`ft_font_color`).value, elem(`ft_font_akpha`).value);

    const line_len = Math.ceil(Math.sqrt(char_str.length));
    const sub_sqr = size / Math.max(1.0, line_len);
    const half_sqr = sub_sqr * 0.5;

    const is_grid = elem(`ft_grid_btn`).checked;

    const is_stoked = elem(`ft_is_stoked`).checked;
    const is_stoke_color = elem(`ft_stoke_color`).value;
    const is_stoke_size = elem(`ft_stoke_size`).value;

    const is_shadowed = elem(`ft_is_shadowed`).checked;
    const shadow_color = elem(`ft_shadow_color`).value;
    const shadow_x = elem(`ft_shadow_x`).value;
    const shadow_y = elem(`ft_shadow_y`).value;

    const is_glowing = elem(`ft_is_glowing`).checked;
    const is_glow_size = elem(`ft_glow_size`).value;
    const is_glow_color = elem(`ft_glow_color`).value;

    const is_blured = elem(`ft_is_blured`).checked;
    const is_blur_fuzz = elem(`ft_blur_fuzz`).value;

    const is_reflected = elem(`ft_is_reflected`).checked;
    const is_reflect_scale = elem(`ft_reflect_scale`).value;
    const is_reflect_alpha = elem(`ft_reflect_alpha`).value;

    ctx.strokeStyle = 'gray';
    ctx.imageSmoothingEnabled = false;

    if (is_grid) ctx.strokeRect(0, 0, size, size);

    for (let i = 0; i < line_len; ++i) {
        for (let j = 0; j < line_len; ++j) {
            let key = ((i * line_len) + j);

            if (is_grid) ctx.strokeRect(j * sub_sqr, i * sub_sqr, sub_sqr, sub_sqr);

            if (key < char_str.length) {
                ctx.save();

                if (is_shadowed) {
                    ctx.save();
                    ctx.shadowBlur = 3;
                    ctx.shadowColor = shadow_color;
                    ctx.shadowOffsetX = shadow_x;
                    ctx.shadowOffsetY = shadow_y;
                    ctx.fillText(char_str[key], half_sqr + (j * sub_sqr), half_sqr + (i * sub_sqr), sub_sqr);
                    ctx.restore();

                }

                if (is_glowing) {
                    ctx.save();
                    ctx.shadowBlur = is_glow_size;
                    ctx.shadowColor = is_glow_color;
                    ctx.strokeText(char_str[key], half_sqr + (j * sub_sqr), half_sqr + (i * sub_sqr), sub_sqr);

                    for (let p = 0; p < 3; ++p)
                        ctx.fillText(char_str[key], half_sqr + (j * sub_sqr), half_sqr + (i * sub_sqr), sub_sqr);

                    ctx.restore();
                }

                if (is_reflected) {
                    ctx.save();
                    let px = half_sqr + (j * sub_sqr);
                    let py = half_sqr + (i * sub_sqr);

                    ctx.fillText(char_str[key], px, py), sub_sqr;
                    ctx.scale(1, -is_reflect_scale);
                    ctx.globalAlpha = is_reflect_alpha;
                    ctx.shadowColor = ctx.fillStyle;
                    ctx.shadowBlur = 15;
                    ctx.fillText(char_str[key], px, -(py * (1 / is_reflect_scale)), sub_sqr);
                    ctx.restore();
                }

                if (is_stoked) {
                    ctx.save();
                    ctx.strokeStyle = is_stoke_color;
                    ctx.lineWidth = is_stoke_size;
                    ctx.lineJoin = `round`;
                    ctx.miterLimit = 2;
                    ctx.strokeText(char_str[key], half_sqr + (j * sub_sqr), half_sqr + (i * sub_sqr), sub_sqr);
                    //ctx.fillText(char_str[key], half_sqr + (j * sub_sqr), half_sqr + (i * sub_sqr), sub_sqr);
                    ctx.restore();

                }

                if (is_blured) {
                    ctx.save();

                    let px = half_sqr + (j * sub_sqr);
                    let py = half_sqr + (i * sub_sqr);
                    let blur = is_blur_fuzz;
                    let width = ctx.measureText(char_str[key]).width + blur * 2;

                    ctx.shadowColor = ctx.fillStyle;
                    ctx.shadowOffsetX = width + px + ctx.canvas.width;
                    ctx.shadowOffsetY = 0;
                    ctx.shadowBlur = blur;
                    ctx.fillText(char_str[key], -width + -ctx.canvas.width, py, sub_sqr);

                    ctx.restore();

                } else ctx.fillText(char_str[key], half_sqr + (j * sub_sqr), half_sqr + (i * sub_sqr), sub_sqr);

                ctx.restore();
            }
        }
    }
}

const ft_update = async () => {
    //console.log(`ft_update`);
    let char_textarea = elem(`ft_char_textarea`);
    char_textarea.value = ``;
    let familly = elem(`ft_familly`).value;
    if (!familly.is_empty()) char_textarea.style[`font-family`] = familly;
    //console.log(char_textarea.style[`font-family`]);

    ft_flag = 0;
    if (elem(`is_lower`).checked) ft_flag |= LOWER_CASE_FLAG;
    if (elem(`is_upper`).checked) ft_flag |= UPPER_CASE_FLAG;
    if (elem(`is_number`).checked) ft_flag |= NUMBER_FLAG;
    if (elem(`is_symbol`).checked) ft_flag |= SYMBOL_FLAG;
    //console.log(`ft_flag: ${ft_flag}`);

    ft_texture_name = ``;
    let colection = elem(`scr_collection`).children,
        char_list = [],
        char_data = [];

    for (let it = 0, len = colection.length; it < len; ++it) {

        char_data = colection[it].dataset.rg.split(`—`);
        char_data = [Number(`0x${char_data[0]}`), Number(`0x${char_data[1]}`)];
        if (char_data.length != 2) return console.error(`invalide data: ${char_data}`);

        ft_texture_name += `${char_data[0].toString(16)}-${char_data[1].toString(16)}-`;

        for (let idx = char_data[0], end = char_data[1]; idx <= end; ++idx) {
            let char = String.fromCharCode(idx);
            if ((ft_flag & LOWER_CASE_FLAG) && char.is_lower()) char_list = [...char_list, char];
            else if ((ft_flag & UPPER_CASE_FLAG) && char.is_upper()) char_list = [...char_list, char];
            else if ((ft_flag & NUMBER_FLAG) && char.is_number()) char_list = [...char_list, char];
            else if ((ft_flag & SYMBOL_FLAG) && char.is_symbol()) char_list = [...char_list, char];
        }
    }

    ft_texture_name += `${ft_flag.toString(16)} ${familly}`;
    ft_char_str = char_list.join(``).trim();


    let out = ``,
        char_bytes = 0,
        line_bytes = 0,
        buffer = ft_char_str.replace(/\s+/g, ``) + ` `;

    for (let i = 0, size = buffer.length; i < size; ++i) {
        let char = encodeURIComponent(buffer[i]);
        char_bytes = char.bytes_numb();
        if ((char_bytes + line_bytes) >= 1024) {
            out += `\n`;
            line_bytes = 0;
        }
        out += char;
        line_bytes += char_bytes;
    }
    char_textarea.value = out;

    ft_draw();
}

const ft_rem_scr = async (ev) => {
    let target = ev.target;
    if (target.tagName.toLowerCase() == `b`) target = target.parentNode;
    let element = elem(target.dataset.parent);
    element.parentNode.removeChild(element);
    ft_update();
}

const ft_add_scr = async () => {
    let text = elem(`ft_script_name`).value;
    if (text.is_empty()) return;

    let id = text.replace(` `, `_`);
    if (elem(id)) return;

    let opt = document.querySelector(`option[value='${text}']`);

    let a = document.createElement(`div`), b = uid();
    a.id = id;
    a.className = `ft_scr_cl`;
    a.dataset.sn = text;
    a.dataset.rg = opt.dataset.range;
    a.innerHTML = ` ${text} <div class="ft_scr_rem_cl" data-parent="${id}" id=${b}><b>&#128939;</b></div>`;
    elem(`scr_collection`).appendChild(a);
    elem(b).addEventListener(`click`, ft_rem_scr, false);

    ft_update();
}

const ft_copy_chars = async () => {
    let textarea = elem(`ft_char_textarea`);
    textarea.select();
    textarea.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(textarea.value);
}

const ft_clear = async (ev) => {
    ev.target.value = "";
}

const ft_reset = async () => {
    elem(`ft_familly`).value = ``;
    elem(`ft_fontsize`).value = 12;
    elem(`ft_script_name`).value = ``;
    elem(`is_number`).checked = elem(`is_lower`).checked = elem(`is_upper`).checked = elem(`is_symbol`).checked = true;
    elem(`is_italic`).checked = elem(`is_bold`).checked = false;
    elem(`scr_collection`).innerHTML = elem(`ft_char_textarea`).value = ``;
    ft_update();
}

const ft_save = async () => {
    elem(`ft_grid_btn`).checked = false;
    ft_zoom = 1;
    await ft_draw();
    elem(`ft_save_btn`).download = `${elem('ft_familly').value} ${ft_flag}.png`;
    elem(`ft_save_btn`).href = elem(`ft_canvas`).toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
}

const ft_mouse_in = async () => {
    ft_mouse_over = true;
}

const ft_mouse_out = async () => {
    ft_mouse_over = false;
}

const ft_zooming = async (ev) => {
    if (!ft_mouse_over) return;
    ev.preventDefault();
    if (ev.deltaY < 0) ft_zoom += 0.05;
    else ft_zoom -= 0.05;
    ft_zoom = Math.min(Math.max(.001, ft_zoom), 10);
    elem(`ft_zoom_btn`).innerHTML = ft_zoom.toFixed(2);
    ft_draw();
}
/*******************************************************
* font
*******************************************************/
elem(`ft_familly`).addEventListener(`change`, ft_update, false);
elem(`ft_familly`).addEventListener(`blur`, ft_update, false);
elem(`ft_familly`).addEventListener(`focus`, ft_clear, false);

elem(`ft_fontsize`).addEventListener(`change`, ft_update, false);

elem(`ft_script_name`).addEventListener(`change`, ft_update, false);
elem(`ft_script_name`).addEventListener(`blur`, ft_update, false);
elem(`ft_script_name`).addEventListener(`focus`, ft_clear, false);

elem(`add_scr_btn`).addEventListener(`click`, ft_add_scr, false);

elem(`is_number`).addEventListener(`change`, ft_update, false);

elem(`is_lower`).addEventListener(`change`, ft_update, false);

elem(`is_upper`).addEventListener(`change`, ft_update, false);

elem(`is_symbol`).addEventListener(`change`, ft_update, false);

elem(`is_italic`).addEventListener(`change`, ft_update, false);

elem(`is_bold`).addEventListener(`change`, ft_update, false);

/*******************************************************
* decoration
*******************************************************/
elem(`ft_font_color`).addEventListener(`change`, ft_draw, false);
elem(`ft_font_akpha`).addEventListener(`change`, ft_draw, false);

elem(`ft_background_color`).addEventListener(`change`, ft_draw, false);
elem(`ft_background_alpha`).addEventListener(`change`, ft_draw, false);

elem(`ft_is_stoked`).addEventListener(`change`, ft_draw, false);
elem(`ft_stoke_color`).addEventListener(`change`, ft_draw, false);
elem(`ft_stoke_size`).addEventListener(`change`, ft_draw, false);

elem(`ft_is_shadowed`).addEventListener(`change`, ft_draw, false);
elem(`ft_shadow_color`).addEventListener(`change`, ft_draw, false);
elem(`ft_shadow_x`).addEventListener(`change`, ft_draw, false);
elem(`ft_shadow_y`).addEventListener(`change`, ft_draw, false);

elem(`ft_is_glowing`).addEventListener(`change`, ft_draw, false);
elem(`ft_glow_color`).addEventListener(`change`, ft_draw, false);
elem(`ft_glow_size`).addEventListener(`change`, ft_draw, false);

elem(`ft_is_blured`).addEventListener(`change`, ft_draw, false);
elem(`ft_blur_fuzz`).addEventListener(`change`, ft_draw, false);

elem(`ft_is_reflected`).addEventListener(`change`, ft_draw, false);
elem(`ft_reflect_scale`).addEventListener(`change`, ft_draw, false);
elem(`ft_reflect_alpha`).addEventListener(`change`, ft_draw, false);
/*******************************************************
* chars
*******************************************************/
elem(`ft_char_copy_btn`).addEventListener(`click`, ft_copy_chars, false);
elem(`ft_char_reset_btn`).addEventListener(`click`, ft_reset, false);

/*******************************************************
* texture
*******************************************************/
elem(`ft_texture_size`).addEventListener(`change`, ft_draw, false);
elem(`ft_update_btn`).addEventListener(`change`, ft_draw, false);
elem(`ft_grid_btn`).addEventListener(`change`, ft_draw, false);
elem(`ft_save_btn`).addEventListener(`click`, ft_save, false);
elem(`ft_canvas`).addEventListener('wheel', ft_zooming, false);
elem(`ft_canvas`).addEventListener("mouseout", ft_mouse_out, false);
elem(`ft_canvas`).addEventListener("mouseover", ft_mouse_in, false);
