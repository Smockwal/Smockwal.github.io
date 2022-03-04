const LINE_TOP = 1;
const LINE_BOTTOM = 2;
const LINE_LEFT = 3;
const LINE_RIGHT = 4;

const GRAB_DIST = 5;

var st_line_top = 0,
    st_line_bottom = 0,
    st_line_right = 0,
    st_line_left = 0,
    st_timer_id,
    st_edit_canv_height,
    st_edit_canv_width,
    st_line_grab = 0;

const float = (x) => {
    if (parseInt(x, 10) == x) return x;
    let val = `${parseFloat(x).toPrecision(12)}`;
    return val.replace(/0+$/, ``).replace(/0\./, `.`);
}

// nearest power of 2
const np2 = (n) => {
    let v = new Int32Array([n])[0]; 

    v--;
    v |= v >> 1;
    v |= v >> 2;
    v |= v >> 4;
    v |= v >> 8;
    v |= v >> 16;
    v++; // next power of 2

    let x = v >> 1; // previous power of 2

    return (v - n) > (n - x) ? x : v;
}

const st_update_output = async () => {
    let top = parseFloat(elem(`st_line_t`).value),
        bottom = parseFloat(elem(`st_line_b`).value),
        left = parseFloat(elem(`st_line_l`).value),
        right = parseFloat(elem(`st_line_r`).value),

        /*
        width = np2(elem(`st_img_width`).value),
        height = np2(elem(`st_img_height`).value);
        */
        width = parseFloat(elem(`st_img_width`).value),
        height = parseFloat(elem(`st_img_height`).value);

    let W = right - left;
    let H = bottom - top;

    let Y = top + (H * 0.5);
    let X = left + (W * 0.5);

    let HF = 1.0 / height;
    let WF = 1.0 / width;

    let scale = [float(W * WF), float(H * HF)];
    let offset = [float(-0.5 + (X * WF)), float(0.5 - (Y * HF))];

    let out = `params: <${scale[0]}, ${scale[1]}, 0>, <${offset[0]}, ${offset[1]}, 0>`;
    out += `\nvector: <${scale[0]}, ${scale[1]}, ${offset[0]}, ${offset[1]}>`;

    let tuv_min = [float(WF * left), float(1.0 - (HF * bottom))];
    let tuv_max = [float(WF * right), float(1.0 - (HF * top))];
    out += `\nTouch:\tmin <${tuv_min[0]}, ${tuv_min[1]}, 0>\n\tmax <${tuv_max[0]}, ${tuv_max[1]}, 0>`;

    elem(`st_out_data`).value = out;
}

const st_image_data = async (img) => {
    let st_img_width = elem(`st_img_width`);
    st_img_width.value = img.naturalWidth;
    if (img.naturalWidth != np2(img.naturalWidth))
        st_img_width.style.backgroundColor = `#e06666`;
    else
        st_img_width.style.backgroundColor = `#FFF`;

    let st_img_height = elem(`st_img_height`);
    st_img_height.value = img.naturalHeight;
    if (img.naturalHeight != np2(img.naturalHeight))
        st_img_height.style.backgroundColor = `#e06666`;
    else
        st_img_height.style.backgroundColor = `#FFF`;

    let canvas = elem(`st_canvas_edit`);
    //canvas.width = 1024;
    //canvas.height = 1024;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    elem(`st_line_t`).max = img.naturalHeight;
    elem(`st_line_b`).max = img.naturalHeight;

    elem(`st_line_l`).max = img.naturalWidth;
    elem(`st_line_r`).max = img.naturalWidth;

    elem(`st_line_t`).value = Math.round(img.naturalHeight / 4);
    elem(`st_line_b`).value = Math.round((img.naturalHeight / 4) * 3);
    elem(`st_line_l`).value = Math.round(img.naturalWidth / 4);
    elem(`st_line_r`).value = Math.round((img.naturalWidth / 4) * 3);

    st_update_output();
}

const st_show_image = async (fileReader) => {
    let img = elem(`st_image`);
    img.onload = () => st_image_data(img);
    img.src = fileReader.result;
}

const st_load_image = async (evt) => {
    //console.log(`st_load_image`);
    let tgt = evt.target || window.event.srcElement,
        files = tgt.files;

    // FileReader support
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = () => st_show_image(fr);
        fr.readAsDataURL(files[0]);
    }
}

const st_line_select = async (ev) => {
    let edit_canv = elem(`st_canvas_edit`);

    const canv_box = edit_canv.getBoundingClientRect();
    const canv_width = canv_box.right - canv_box.left;
    const canv_height = canv_box.bottom - canv_box.top;

    const x_fact = (elem(`st_img_width`).value / canv_width);
    const y_fact = (elem(`st_img_height`).value / canv_height);

    console.log(`numb: ${Math.abs((ev.offsetY * y_fact) - st_line_top)}`);
    if (Math.abs((ev.offsetY * y_fact)- st_line_top) < GRAB_DIST) {
        st_line_grab = LINE_TOP;
    }
    else if (Math.abs((ev.offsetY * y_fact) - st_line_bottom) < GRAB_DIST) {
        //console.log(`numb: ${Math.abs(x - st_line_bottom)}`);
        st_line_grab = LINE_BOTTOM;
    }
    else if (Math.abs((ev.offsetX * x_fact) - st_line_left) < GRAB_DIST) {
        st_line_grab = LINE_LEFT;
    }
    else if (Math.abs((ev.offsetX * x_fact) - st_line_right) < GRAB_DIST) {
        st_line_grab = LINE_RIGHT;
    }
    else {
        st_line_grab = 0;
    }
}

const st_mouse_up = async () => {
    st_line_grab = 0;
}

const st_zoom = async (ev) => {
    console.log(`==========================================`);
    //console.log(`(${ev.offsetX}, ${ev.offsetY})`);
    let edit_canv = elem(`st_canvas_edit`);

    const canv_box = edit_canv.getBoundingClientRect();
    const canv_width = canv_box.right - canv_box.left;
    const canv_height = canv_box.bottom - canv_box.top;
    //console.log(`canv_width: ${canv_width}, canv_height: ${canv_height}`);
    //console.log(`mouseX: ${ev.offsetX}, mouseY: ${ev.offsetY}`);

    const x_fact = (elem(`st_img_width`).value / canv_width);
    const y_fact = (elem(`st_img_height`).value / canv_height);
    //console.log(`width_fact: ${x_fact}, height_fact: ${y_fact}`);
    //console.log(`x_fact: ${ev.offsetX * x_fact}, y_fact: ${ev.offsetY * y_fact}`);
    if (st_line_grab != 0) 
    {
        if (st_line_grab == LINE_TOP) {
            elem(`st_line_t`).value = Math.round(ev.offsetY * y_fact);
        }
        else if (st_line_grab == LINE_BOTTOM) {
            elem(`st_line_b`).value = Math.round(ev.offsetY * y_fact);
        }
        else if (st_line_grab == LINE_LEFT) {
            elem(`st_line_l`).value = Math.round(ev.offsetX * x_fact);
        }
        else if (st_line_grab == LINE_RIGHT) {
            elem(`st_line_r`).value = Math.round(ev.offsetX * x_fact);
        }
        st_update_output();
    }

    let view_canv = elem(`st_canvas_view`);
    const view_ctx = view_canv.getContext('2d');
    view_ctx.clearRect(0, 0, view_canv.width, view_canv.height);

    view_ctx.drawImage(edit_canv,
        Math.min(Math.max(0, (ev.offsetX * x_fact) - 25), canv_width - 50),
        Math.min(Math.max(0, (ev.offsetY * y_fact) - 25), canv_height - 50),
        50, 50,
        0, 0,
        view_canv.width, view_canv.height);
}

const st_draw = async () => {
    let canvas = elem(`st_canvas_edit`);
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let img = elem(`st_image`);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    st_line_top = elem(`st_line_t`).value;
    st_line_bottom = elem(`st_line_b`).value;
    st_line_left = elem(`st_line_l`).value;
    st_line_right = elem(`st_line_r`).value;

    ctx.strokeStyle = `#00ccff`;
    ctx.lineWidth = 1;

    const x_fact = (canvas.width / elem(`st_img_width`).value);
    const y_fact = (canvas.height / elem(`st_img_height`).value);

    ctx.beginPath();
    ctx.moveTo(0, st_line_top * y_fact);
    ctx.lineTo(canvas.width, st_line_top * y_fact);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, st_line_bottom * y_fact);
    ctx.lineTo(canvas.width, st_line_bottom * y_fact);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(st_line_left * x_fact, 0);
    ctx.lineTo(st_line_left * x_fact, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(st_line_right * x_fact, 0);
    ctx.lineTo(st_line_right * x_fact, canvas.height);
    ctx.stroke();

    st_timer_id = requestAnimationFrame(st_draw);
}

st_timer_id = requestAnimationFrame(st_draw);

let view_canv = elem(`st_canvas_view`).getContext(`2d`);
view_canv.imageSmoothingEnabled = false;
view_canv.mozImageSmoothingEnabled = false;
view_canv.webkitImageSmoothingEnabled = false;
view_canv.msImageSmoothingEnabled = false;

elem(`st_file_select`).addEventListener(`change`, st_load_image, false);
elem(`st_canvas_edit`).addEventListener('mousemove', st_zoom, false);
elem(`st_canvas_edit`).addEventListener('mousedown', st_line_select, false);
elem(`st_canvas_edit`).addEventListener('mouseup', st_mouse_up, false);

elem(`st_line_t`).addEventListener(`change`, st_update_output, false);
elem(`st_line_b`).addEventListener(`change`, st_update_output, false);
elem(`st_line_l`).addEventListener(`change`, st_update_output, false);
elem(`st_line_r`).addEventListener(`change`, st_update_output, false);


