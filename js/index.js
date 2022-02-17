
const set_tab = (evt, tab) => {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    elem(tab).style.display = "block";
    evt.currentTarget.className += " active";
}

const urlParams = new URLSearchParams(window.location.href);

let url_tab = `home_tab_btn`;
if (urlParams.has(`tab`))
    url_tab = urlParams.get(`tab`);
elem(url_tab).click();
