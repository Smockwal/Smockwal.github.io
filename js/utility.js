const elem = (id) => {
    return document.getElementById(id) || void 0;
}

const to3D = (idx = 0, max = 52) => {
    return [idx % max, Math.floor(idx / max) % max, Math.floor(idx / (max * max))];
}

var idnumb = 1;
const alph = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`;
const uid = () => {
    let idxs = to3D(idnumb++, alph.length);
    return alph[idxs[0]] + alph[idxs[1]] + alph[idxs[2]];
}

Object.assign(String.prototype, {
    is_empty: function () { return (this.length === 0 || !this.trim()); },
    is_lower: function () { return (this.toUpperCase() != this && this.toLowerCase() == this); },
    is_upper: function () { return (this.toLowerCase() != this && this.toUpperCase() == this); },
    is_number: function () {
        let char = this.charCodeAt(0);
        return (0x0030 <= char && char <= 0x0039)
            || (0x0660 <= char && char <= 0x0669)
            || (0x06F0 <= char && char <= 0x06F9)
            || (0x0966 <= char && char <= 0x096F)
            || (0x09E6 <= char && char <= 0x09EF)
            || (0x0A66 <= char && char <= 0x0A6F)
            || (0x0AE6 <= char && char <= 0x0AEF)
            || (0x0B66 <= char && char <= 0x0B6F)
            || (0x0BE6 <= char && char <= 0x0BEF)
            || (0x0C66 <= char && char <= 0x0C6F)
            || (0x0CE6 <= char && char <= 0x0CEF)
            || (0x0D66 <= char && char <= 0x0D6F)
            || (0x0E50 <= char && char <= 0x0E59)
            || (0x0ED0 <= char && char <= 0x0ED9)
            || (0x0F20 <= char && char <= 0x0F29)
            || (0x1040 <= char && char <= 0x1049)
            || (0x17E0 <= char && char <= 0x17E9)
            || (0x1810 <= char && char <= 0x1819)
            || (0x1946 <= char && char <= 0x194F)
            || (0x19D0 <= char && char <= 0x19D9)
            || (0xFF10 <= char && char <= 0xFF19)
            || (0x104A0 <= char && char <= 0x104A9)
            || (0x1D7CE <= char && char <= 0x1D7FF)
    },
    is_symbol: function () { return (!this.is_lower() && !this.is_upper() && !this.is_number()); },
    bytes_numb: function (encoding = "utf-8") { return new Blob([this]).size; },
});

const hex_2_rgba = (hex, a) => {
    let numb = hex.replace("#", "");
    let r = parseInt(numb.substring(0, 2), 16);
    let g = parseInt(numb.substring(2, 4), 16);
    let b = parseInt(numb.substring(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
}
