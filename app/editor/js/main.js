
import { clear_element, elem, ev, new_node, new_text } from '../../../lib/html.js';
import { message } from '../../../lib/source/message.js';
import { options, opts } from '../../../lib/source/options.js';
import { macro, macros } from '../../../lib/source/preprocessor/macro.js';
import { clear_prepro, preprocessing } from '../../../lib/source/preprocessor/preprocess.js';
import { tokens } from '../../../lib/source/tokens.js';
import { FILTER_FILE, FILTER_FOLDER, dir } from '../../../lib/system/dir.js';
import { file } from '../../../lib/system/file.js';
import { uri } from '../../../lib/system/uri.js';
import { reset_index, string } from '../../../lib/text/string.js';

/*******************************************************
* global
*******************************************************/

var top_menu_ids = [];
var files_tree = new dir(`Root`);
var active_area;

const DO_PREPRO = (0x1 << 0);
const DO_TRANSLATE = (0x1 << 1);
const DO_PARSING = (0x1 << 2);
const DO_OPTIMIZE = (0x1 << 3);
const DO_FORMATE = (0x1 << 4);
const DO_ALL = (DO_PREPRO | DO_TRANSLATE | DO_PARSING | DO_OPTIMIZE | DO_FORMATE);
const MAX_RELEASES = DO_PREPRO;


const win_close_menus = async e => {
    if (!e.target.matches('.dropbtn')) close_top_menu();
    if (!e.target.matches('.context')) close_contex_menu();
};

const clear_editor = async () => {
    reset_index();
    message.clear();
};

const processor_msg = () => {
    let error = message.has_error();
    do_print_msg();
    return error;
};

const do_prepro = async src_toks => {

    clear_prepro();
    let sources = [], pre_macro = ``;

    if (options.get(opts.PREPRO, `__DEBUG__`)) macros.set(`__DEBUG__`, new macro(`__DEBUG__`, ``));
    if (options.get(opts.PREPRO, `__MONO__`)) macros.set(`__MONO__`, new macro(`__MONO__`, ``));
    if (options.get(opts.PREPRO, `__SPEED__`)) macros.set(`__SPEED__`, new macro(`__SPEED__`, ``));
    if (options.get(opts.PREPRO, `__MEM__`)) macros.set(`__MEM__`, new macro(`__MEM__`, ``));

    let txt = options.get(opts.PREPRO, `__AGENT_ID__`);
    if (!string.empty(txt)) pre_macro += `#define __AGENT_ID__ ${txt}\n`;

    txt = options.get(opts.PREPRO, `__AGENT_NAME__`);
    if (!string.empty(txt)) pre_macro += `#define __AGENT_NAME__ ${txt}\n`;

    txt = options.get(opts.PREPRO, `extra_macro`);
    if (!string.empty(txt)) pre_macro += `${txt}\n`;

    if (!string.empty(pre_macro)) {
        sources.push(new tokens(pre_macro));
        if (processor_msg()) return undefined;
    }

    if (options.get(`translate`, `lang`) == 1) {
        const h = await read_file(`./include/lsl/constants.hls`);
        if (processor_msg()) return undefined;
        sources.push(h);
    }

    sources.push(src_toks);

    let out_toks = await preprocessing(sources);
    if (processor_msg()) return undefined;

    elem("prepro").value = out_toks.str;
    elem("prepro_tab_btn").click();

    return out_toks;
}

const execute = async flag => {
    clear_editor();

    //console.log(`exec`);
    let txt = elem("input").value;
    if (string.empty(txt)) return;

    let src_toks = new tokens(txt, options.get(opts.GENERAL, `file`) || `main.lsl`);
    src_toks.remove_comments();
    //console.log(src_toks.stringify());
    if (processor_msg()) return console.trace(src_toks);

    if (options.get(opts.PREPRO, `active`) && flag & DO_PREPRO) {
        src_toks = await do_prepro(src_toks);
    }

    if (options.get(`translate`, `lang`) == 1) {

        ////////////////////////////////////////////////////////////////
        // convert
        ////////////////////////////////////////////////////////////////

        if (flag & DO_TRANSLATE) {
            await convert_to_lsl(src_toks);
            if (processor_msg()) return console.trace(src_toks);
        }

        elem("translate").value = src_toks.str;
        elem("translate_tab_btn").click();

        ////////////////////////////////////////////////////////////////
        // parsing
        ////////////////////////////////////////////////////////////////
        if (flag & DO_PARSING) {
            await parsing(src_toks);
            if (processor_msg()) return console.trace(src_toks);
        }

        elem("parser").value = src_toks.str;
        elem("parser_tab_btn").click();

        ////////////////////////////////////////////////////////////////
        // optimizing
        ////////////////////////////////////////////////////////////////

        if (options.get(`optimize`, `active`) && flag & DO_OPTIMIZE) {
            await optimizing(src_toks);
            if (processor_msg()) return console.trace(src_toks);
        }

        elem("optimizer").value = src_toks.str;
        elem("optimizer_tab_btn").click();

        ////////////////////////////////////////////////////////////////
        // format
        ////////////////////////////////////////////////////////////////
        if (options.get(opts.FORMATTER, `active`) && flag & DO_FORMATE) {
            src_toks = await formatter(src_toks);
            if (processor_msg()) return console.trace(src_toks);
        }
        
        elem("formatter").value = src_toks;
        elem("formatter_tab_btn").click();
    }

    do_print_msg();
};

const build_files_tree = file_list => {
    files_tree.clear();
    for (const entry of file_list) {
        let path = string.empty(entry.webkitRelativePath) ? entry.name : entry.webkitRelativePath;
        if (/\.(lsl|hls|ncl)$/i.test(path)) {
            path = new uri(path);
            const folder = (path.flags & uri.HAS_DIR) ? files_tree.mkpath(path.dir_path) : files_tree;
            folder.append(new file(entry, folder));
        }
    }
};

const file_by_path = path => {
    let fldr = files_tree;
    if (path.flags & uri.HAS_DIR)
        fldr = fldr.cd(path.dir_path);

    if (fldr.contains(path.file_full_name))
        return fldr.at(fldr.index(path.file_full_name));
};

const show_file = async select => {
    options.set(opts.GENERAL, `file`, select.file_full_name);
    elem(`input`).value = await file.load_text(select.obj);
    elem("input_tab_btn").click();
};

/*******************************************************
* settings
*******************************************************/
const dial_open_settings = async e => {
    // https://en.wikipedia.org/wiki/Indentation_style

    elem(`dial_header`).innerHTML = `<h2>Settings</h2>`;
    elem(`dial_body`).innerHTML = `<fieldset class=pre_field_sett><legend><input id=preprocessor_chbx type=checkbox><label for=preprocessor_chbx>Preprocessor:</label>
    </legend><div class=pre_field_sett_left><div><input id=debug_preopt_chbx type=checkbox><label for=debug_preopt_chbx>#define DEBUG</label></div><div>
    <input id=mono_preopt_chbx type=checkbox><label for=mono_preopt_chbx>#define MONO</label></div><div><input id=speed_preopt_chbx type=checkbox>
    <label for=speed_preopt_chbx>#define SPEED</label></div><div><input id=mem_preopt_chbx type=checkbox><label for=mem_preopt_chbx>#define MEM</label>
    </div><label for=macro_agent_id class=sett_agent_id_lab>#define AGENT_ID</label><input id=macro_agent_id class=sett_agent_id_in>
    <label for=macro_agent_name class=sett_agent_name_lab>#define AGENT_NAME</label><input id=macro_agent_name class=sett_agent_name_in>
    </div><textarea class=pre_field_sett_right id=extra_macro placeholder="extra macro"></textarea></fieldset><fieldset><legend>Language:</legend><label for=lang_sel>Language:
    </label><select id=lang_sel name=lang_sel><option value=gen>Any<option value=lsl selected>lsl</select></fieldset><fieldset><legend>Parser:</legend><input id=default_chbx type=checkbox>
    <label for=default_chbx>Find default</label></fieldset><fieldset><legend><input id=optimizer_chbx type=checkbox><label for=optimizer_chbx>Optimizer:</label></legend>
    <input id=optimizer_cleaningt_chbx type=checkbox><label for=optimizer_cleaningt_chbx>Cleaning</label><br><input id=optimizer_fold_const_chbx type=checkbox>
    <label for=optimizer_fold_const_chbx>Operator</label><br><input id=optimizer_renaming_chbx type=checkbox><label for=optimizer_renaming_chbx>Renaming</label><br>
    <input id=optimizer_number_chbx type=checkbox><label for=optimizer_number_chbx>Literal</label><br><input id=optimizer_op_chbx type=checkbox><label for=optimizer_op_chbx>Operators</label>
    </fieldset><fieldset><legend><input id=formattor_chbx type=checkbox><label for=formattor_chbx>Formatter:</label></legend><label for=code_style_sel>Indentation style:
    </label><select id=code_style_sel name=code_style><option value=Allman>Allman<option value=K&R selected>K&R<option value=GNU>GNU<option value=Whitesmiths>Whitesmiths
    <option value=Horstmann>Horstmann<option value=Haskell>Haskell<option value=Pico>Pico<option value=Ratliff>Ratliff<option value=Lisp>Lisp<option value=Pico>Pico</select><br>
    <label for=spacer_sel>Indent with:</label><select id=spacer_sel name=indent_style><option value=sp>1 space<option value=spsp>2 space<option value=spspspsp selected>4 space
    <option value=tab>tab</select></fieldset>`;
    elem(`dial_footer`).innerHTML = `<button id="dial_close" class="act_btn">Ok</button>`;
    elem('dialog_elem').showModal();

    elem(`preprocessor_chbx`).checked = options.get(opts.PREPRO, `active`);
    elem(`debug_preopt_chbx`).checked = options.get(opts.PREPRO, `__DEBUG__`);
    elem(`mono_preopt_chbx`).checked = options.get(opts.PREPRO, `__MONO__`);
    elem(`speed_preopt_chbx`).checked = options.get(opts.PREPRO, `__SPEED__`);
    elem(`mem_preopt_chbx`).checked = options.get(opts.PREPRO, `__MEM__`);
    elem(`macro_agent_id`).value = options.get(opts.PREPRO, `__AGENT_ID__`);
    elem(`macro_agent_name`).value = options.get(opts.PREPRO, `__AGENT_NAME__`);
    elem(`extra_macro`).value = options.get(opts.PREPRO, `extra_macro`);

    elem(`lang_sel`).selectedIndex = options.get(`translate`, `lang`);

    elem(`default_chbx`).checked = options.get(`parser`, `find_code_entry`);

    elem(`optimizer_chbx`).checked = options.get(`optimize`, `active`);
    elem(`optimizer_cleaningt_chbx`).checked = options.get(`optimize`, `cleaning`);
    elem(`optimizer_fold_const_chbx`).checked = options.get(`optimize`, `foldconst`);
    elem(`optimizer_renaming_chbx`).checked = options.get(`optimize`, `rename`);
    elem(`optimizer_number_chbx`).checked = options.get(`optimize`, `literal`);
    elem(`optimizer_op_chbx`).checked = options.get(`optimize`, `operators`);

    elem(`formattor_chbx`).checked = options.get(opts.FORMATTER, `active`);
    elem(`code_style_sel`).selectedIndex = options.get(opts.FORMATTER, `style`);
    elem(`spacer_sel`).selectedIndex = options.get(opts.FORMATTER, `space`);


    ev(`preprocessor_chbx`, `change`, e => options.set(opts.PREPRO, `active`, e.target.checked));
    ev(`macro_agent_id`, `input`, e => options.set(opts.PREPRO, `__AGENT_ID__`, e.target.value));
    ev(`macro_agent_name`, `input`, e => options.set(opts.PREPRO, `__AGENT_NAME__`, e.target.value));
    ev(`debug_preopt_chbx`, `change`, e => options.set(opts.PREPRO, `__DEBUG__`, e.target.checked));
    ev(`debug_preopt_chbx`, `change`, e => options.set(opts.PREPRO, `__MONO__`, e.target.checked));
    ev(`speed_preopt_chbx`, `change`, e => options.set(opts.PREPRO, `__SPEED__`, e.target.checked));
    ev(`mem_preopt_chbx`, `change`, e => options.set(opts.PREPRO, `__MEM__`, e.target.checked));
    ev(`extra_macro`, `input`, e => options.set(opts.PREPRO, `extra_macro`, e.target.value));

    ev(`lang_sel`, `change`, e => {
        options.set(`translate`, `active`, e.target.selectedIndex !== 0);
        options.set(`translate`, `lang`, e.target.selectedIndex);
    });

    ev(`default_chbx`, `change`, e => options.set(`parser`, `find_code_entry`, e.target.checked));

    ev(`optimizer_chbx`, `change`, e => options.set(`optimize`, `active`, e.target.checked));
    ev(`optimizer_cleaningt_chbx`, `change`, e => options.set(`optimize`, `cleaning`, e.target.checked));
    ev(`optimizer_fold_const_chbx`, `change`, e => options.set(`optimize`, `foldconst`, e.target.checked));
    ev(`optimizer_renaming_chbx`, `change`, e => options.set(`optimize`, `rename`, e.target.checked));
    ev(`optimizer_number_chbx`, `change`, e => options.set(`optimize`, `literal`, e.target.checked));
    ev(`optimizer_op_chbx`, `change`, e => options.set(`optimize`, `operators`, e.target.checked));

    ev(`formattor_chbx`, `change`, e => options.set(opts.FORMATTER, `active`, e.target.checked));
    ev(`code_style_sel`, `change`, e => options.set(opts.FORMATTER, `style`, e.target.selectedIndex));
    ev(`spacer_sel`, `change`, e => options.set(opts.FORMATTER, `space`, e.target.selectedIndex));


    ev(`dial_close`, `click`, e => elem('dialog_elem').close());

};

/*******************************************************
* top nav
*******************************************************/
const close_top_menu = async () => {
    top_menu_ids.map(id => elem(id).classList.remove('show'));
};

/*******************************************************
* context menu
*******************************************************/
const close_contex_menu = async () => {
    elem(`context_elem`).style = `display:none;left:10000px;top:10000px;`;
};

/*******************************************************
* files navigator
*******************************************************/

const fn_build_treeview = async (data, parent) => {
    if (!parent) {
        parent = elem(`files_treeview`);
        clear_element(parent);
    }

    if (data.empty()) return;
    for (const entry of data.filtered(FILTER_FOLDER)) {
        const details = parent.appendChild(new_node(`details`));
        const summary = details.appendChild(new_node(`summary`, { class: `folder_select` }));
        summary.appendChild(new_text(string.html_escape(entry.name)));
        fn_build_treeview(entry, details);
    }

    for (const entry of data.filtered(FILTER_FILE)) {
        const details = parent.appendChild(new_node(`details`));
        const summary = details.appendChild(new_node(`summary`, { class: `file_select` }));
        const link = new uri(entry.path);
        let folder = ``;
        if (link.flags & uri.HAS_DIR) folder = link.dir_path;
        summary.dataset.dir = string.html_escape(folder);
        summary.appendChild(new_text(string.html_escape(entry.name)));
    }
};

const fn_select_file = async e => {
    if (e.target.tagName !== `SUMMARY` || e.target.className !== `file_select`) return;
    const dp = string.html_unescape(e.target.dataset.dir);
    const fn = string.html_unescape(e.target.textContent);
    const select = file_by_path(new uri(`${dp}${fn}`));
    if (!select) return;
    show_file(select);
};

/*******************************************************
* output tabs
*******************************************************/
const set_tab = e => {
    if (e.target.dataset.for === `none`) return;

    for (const el of document.getElementsByClassName(`tabcontent`))
        el.style.display = `none`;

    for (const el of document.getElementsByClassName(`tablinks`))
        el.classList.remove(`active`);

    active_area = elem(e.target.dataset.for);
    active_area.style.display = `block`;
    e.target.classList.add(`active`);
};

/*******************************************************
* textarea
*******************************************************/



/*******************************************************
* debug output
*******************************************************/
const do_clear = () => elem(`debug_output`).value = ``;
const do_append = str => elem(`debug_output`).value += `${str}\n`;

const do_print_msg = () => {
    for (let i = 0, max = message.length(); i < max; ++i)
        do_append(message.at(i).str());
    return message.has_error();
};

/*******************************************************
* statusbar
*******************************************************/

let sb_timer_id = 0;

const sb_clear_msg = () => {
    clearTimeout(sb_timer_id);
    const sb = elem(`status_bar`);
    clear_element(sb);
    sb.appendChild(new_text(` `));
};

const sb_show_msg = (str, time = 30) => {
    const sb = elem(`status_bar`);
    clear_element(sb);
    sb.appendChild(new_text(str));
    sb_timer_id = setTimeout(sb_clear_msg, time * 1000);
};

/*******************************************************
* actions
*******************************************************/

const new_act = async e => {
    files_tree.clear();
    clear_element(elem(`files_treeview`));
    clear_element(elem(`file_worker`));
    for (const el of document.getElementsByClassName(`tabcontent`))
        el.value = ``;
    elem("input_tab_btn").click();
};

const open_file_act = async e => {
    const worker = elem(`file_worker`);
    clear_element(worker);

    const input = worker.appendChild(new_node(`input`, { id: `file_loader`, type: `file`, accept: `.lsl,.hls,.nc` }));

    ev(input, `change`, async e => {
        build_files_tree(e.target.files);
        fn_build_treeview(files_tree);
        show_file(new file(e.target.files[0]));
    });
    ev(input, `cancel`, e => sb_show_msg(`File selection cancelled.`));
    input.click();
};

const open_folder_act = async e => {
    const worker = elem(`file_worker`);
    clear_element(worker);

    const input = worker.appendChild(new_node(`input`, { id: `file_loader`, type: `file`, accept: `.lsl,.hsl,.nc` }));
    input.setAttribute(`multiple`, ``);
    input.setAttribute(`webkitdirectory`, ``);

    ev(input, `change`, async e => {
        build_files_tree(e.target.files);
        fn_build_treeview(files_tree);
        elem(`files_treeview`).firstChild.setAttribute(`open`, true);
    })
    ev(input, `cancel`, e => sb_show_msg(`Folder selection cancelled.`));
    input.click();
};

const save_act = e => {
    const worker = elem(`file_worker`);
    const save_link = worker.appendChild(new_node(`a`, {
        download: options.get(opts.GENERAL, `file`) || `output.txt`,
        href: `data:text/plain;charset=utf-8, ${encodeURIComponent(active_area.value)}`
    }));
    save_link.click();
};

const preprocess_act = e => {
    if (MAX_RELEASES & DO_PREPRO)
        execute(DO_PREPRO);
};

const translate_act = e => {
    if (MAX_RELEASES & DO_TRANSLATE)
        execute(DO_PREPRO | DO_TRANSLATE);
};

const interpret_act = e => {
    if (MAX_RELEASES & DO_PARSING)
        execute(DO_PREPRO | DO_TRANSLATE | DO_PARSING);
};

const optimize_act = e => {
    if (MAX_RELEASES & DO_OPTIMIZE)
        execute(DO_PREPRO | DO_TRANSLATE | DO_PARSING | DO_OPTIMIZE);
};

const format_act = e => {
    if (MAX_RELEASES & DO_ALL)
        execute(DO_ALL);
};

const help_act = e => { };

const about_act = e => { };

/*******************************************************/
ev(window, `DOMContentLoaded`, async () => {


    top_menu_ids.length = 0;
    for (const el of document.getElementsByClassName(`dropdown_content`))
        top_menu_ids.push(el.id);

    options.set(opts.PREPRO, `active`, true);
    options.set(`parser`, `active`, false);
    options.set(`optimize`, `active`, false);
    options.set(opts.FORMATTER, `active`, false);

    options.set(opts.PREPRO, `__AGENT_ID__`, ``);
    options.set(opts.PREPRO, `__AGENT_NAME__`, ``);
    options.set(opts.PREPRO, `__DEBUG__`, true);
    options.set(opts.PREPRO, `__MONO__`, true);
    options.set(opts.PREPRO, `__SPEED__`, false);
    options.set(opts.PREPRO, `__MEM__`, false);
    options.set(opts.PREPRO, `extra_macro`, ``);

    options.set(`translate`, `lang`, 0);

    options.set(`parser`, `find_code_entry`, false);

    options.set(`optimize`, `cleaning`, true);
    options.set(`optimize`, `foldconst`, true);
    options.set(`optimize`, `rename`, false);
    options.set(`optimize`, `literal`, true);
    options.set(`optimize`, `operators`, true);

    options.set(opts.FORMATTER, `style`, 1);
    options.set(opts.FORMATTER, `space`, 2);

    ev(window, `click`, win_close_menus);

    ev(`topm_file`, `click`, async () => { close_top_menu(); elem(`file_menue_div`).classList.toggle("show"); });
    //ev(`topm_edit`, `click`, async () => { close_top_menu(); elem(`edit_menue_div`).classList.toggle("show"); });
    ev(`topm_run`, `click`, async () => { close_top_menu(); elem(`run_menue_div`).classList.toggle("show"); });
    ev(`topm_about`, `click`, async () => { close_top_menu(); elem(`about_menue_div`).classList.toggle("show"); });

    ev(`new_act`, `click`, new_act);
    ev(`open_file_act`, `click`, open_file_act);
    ev(`open_folder_act`, `click`, open_folder_act);
    ev(`save_output_act`, `click`, save_act);
    ev(`close_folder_act`, `click`, new_act);
    ev(`preprocess_act`, `click`, preprocess_act);
    ev(`translate_act`, `click`, translate_act);
    ev(`interpret_act`, `click`, interpret_act);
    ev(`optimize_act`, `click`, optimize_act);
    ev(`format_act`, `click`, format_act);
    ev(`setting_act`, `click`, dial_open_settings);
    ev(`help_act`, `click`, help_act);
    ev(`about_act`, `click`, about_act);

    ev(`input_tab_btn`, `click`, set_tab);
    ev(`prepro_tab_btn`, `click`, set_tab);
    ev(`translate_tab_btn`, `click`, set_tab);
    ev(`parser_tab_btn`, `click`, set_tab);
    ev(`optimizer_tab_btn`, `click`, set_tab);
    ev(`formatter_tab_btn`, `click`, set_tab);

    ev(`setting_btn`, `click`, dial_open_settings);
    ev(`run_btn`, `click`, async e => { execute(MAX_RELEASES); });

    ev(`files_treeview`, `click`, fn_select_file);

    elem(`input_tab_btn`).click();

    sb_show_msg(`Ready ...`);

});


