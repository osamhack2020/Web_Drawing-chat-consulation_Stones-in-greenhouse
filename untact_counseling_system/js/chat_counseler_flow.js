const COUNINFO = document.getElementById('couninfo');
const COUNLOG_COUN = document.getElementById('counlog-coun');

let sideCouninfo = document.getElementById('side__couninfo');
let sideCounlogCoun = document.getElementById('side__counlog-coun');

function couninfoClick() {
    COUNINFO.addEventListener('click', couninfoReady);
}

function couninfoReady() {
    COUNINFO.removeAttribute('class');
    COUNLOG_COUN.classList.add('inactive');

    sideCouninfo.removeAttribute('class');
    sideCounlogCoun.classList.add('vanish');
}

function counlogCounClick() {
    COUNLOG_COUN.addEventListener('click', counlogCounReady);
}

function counlogCounReady() {
    COUNINFO.classList.add('inactive');
    COUNLOG_COUN.removeAttribute('class');

    sideCouninfo.classList.add('vanish');
    sideCounlogCoun.removeAttribute('class');
}

couninfoClick();
counlogCounClick();