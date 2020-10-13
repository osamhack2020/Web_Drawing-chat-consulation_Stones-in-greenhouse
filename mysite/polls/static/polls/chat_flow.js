const USER_INFO = document.getElementById('userinfo');
const COUNSTATE = document.getElementById('counstate');
const COUNLOG = document.getElementById('counlog');
const SIDE_USER_INFO = document.getElementById('side__userinfo');
const SIDE_COUNSTATE = document.getElementById('side__counstate');
const SIDE_COUNLOG = document.getElementById('side__counlog');

function userInfoClick() {
    USER_INFO.addEventListener('click', userInfoReady);
}

function userInfoReady() {
    USER_INFO.removeAttribute('class');
    COUNSTATE.classList.add('inactive');
    COUNLOG.classList.add('inactive');

    SIDE_USER_INFO.removeAttribute('class')
    SIDE_COUNSTATE.classList.add('vanish');
    SIDE_COUNLOG.classList.add('vanish');
}

function counstateClick() {
    COUNSTATE.addEventListener('click', counstateReady);
}

function counstateReady() {
    USER_INFO.classList.add('inactive');
    COUNSTATE.removeAttribute('class');
    COUNLOG.classList.add('inactive');

    SIDE_USER_INFO.classList.add('vanish');
    SIDE_COUNSTATE.removeAttribute('class')
    SIDE_COUNLOG.classList.add('vanish');
}

function counlogClick() {
    COUNLOG.addEventListener('click', counlogReady);
}

function counlogReady() {
    USER_INFO.classList.add('inactive');
    COUNSTATE.classList.add('inactive');
    COUNLOG.removeAttribute('class');

    SIDE_USER_INFO.classList.add('vanish');
    SIDE_COUNSTATE.classList.add('vanish');
    SIDE_COUNLOG.removeAttribute('class')
}

userInfoClick();
counstateClick();
counlogClick();