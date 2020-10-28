let chats = document.getElementById('chat__chats');
let scrollbar = document.querySelector('#chat__chats::-webkit-scrollbar-thumb');

chats.scrollTop = chats.scrollHeight;

function chatsScroll() {
    chats.addEventListener('scroll', scrollbarSwitch);
}

function scrollbarSwitch() {
    //스크롤바 자동 숨김
}

chatsScroll();