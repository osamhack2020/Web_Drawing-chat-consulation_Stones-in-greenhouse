const INDEX_FIRTITLE = document.getElementsByClassName('index__firtitle');
const FIRONE_BOX = document.getElementsByClassName('fir-1__box');
const FIRTWO_BOX = document.getElementsByClassName('fir-2__box');
const FIRTHR_BOX = document.getElementsByClassName('fir-3__box');
const SECOND = document.getElementsByClassName('second');
const THIONE_BOX = document.getElementsByClassName('thi-1__box');
const THITWO_BOX = document.getElementsByClassName('thi-2__box');
const THITHR_BOX = document.getElementsByClassName('thi-3__box');
const THITWO_COL = document.getElementsByClassName('thi-2__col');
const BACKTOPRIME = document.getElementById('backtoprime');
const ENTER_BOTTOM = {
    distance: '100%',
    origin: 'bottom',
    opacity: '0%',
    duration: '1000'
};
const ENTER_LEFT = {
    distance: '100%',
    origin: 'left',
    opacity: '0%',
    delay: '100',
    duration: '1000'
};
const ENTER_RIGHT = {
    distance: '100%',
    origin: 'right',
    opacity: '0%',
    delay: '100',
    duration: '1000'
};
const ENTER_FADEIN = {
    opacity: '0%',
    delay: '100',
    duration: '2000'
};

ScrollReveal().reveal(INDEX_FIRTITLE, ENTER_BOTTOM);
ScrollReveal().reveal(FIRONE_BOX, ENTER_BOTTOM);
ScrollReveal().reveal(FIRTWO_BOX, ENTER_BOTTOM);
ScrollReveal().reveal(FIRTHR_BOX, ENTER_BOTTOM);
ScrollReveal().reveal(SECOND, ENTER_FADEIN);
ScrollReveal().reveal(THIONE_BOX, ENTER_LEFT);
ScrollReveal().reveal(THITWO_BOX, ENTER_LEFT);
ScrollReveal().reveal(THITHR_BOX, ENTER_LEFT);
ScrollReveal().reveal(THITWO_COL, ENTER_RIGHT);

function scrollReady() {
    BACKTOPRIME.addEventListener('click', backToPrime);
}

function backToPrime() {
    $( 'html, body' ).stop().animate( { scrollTop : '0' } );
}

scrollReady();