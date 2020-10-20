// 웹소켓 데이터
let ws;
let jsonContent;
let jsonParsing;

//수신 데이터

let _message = {
	'type': 'message',
	'message': 'test', //test, 삭제
    'opponent': 'group_name'
}

let application = { //상담 정보
	'name': '',
	'address': '',
	'reason': []
}

let application_is_delivered = {
	'type': 'application_is_delivered',
	'opponent': 'group_name'
}

let apply = { //상담 정보 열람 여부
	'type': 'apply',
	'application': application
}

let accept = { //상담 수락 확인, 종료 확인
    'type': 'accept',
    'class': '' //accept, finish
}

let message_is_delivered = {
	'type': 'message_is_delivered',
	'opponent': 'group_name'
}

let state = {
    'type' : 'state',
    'direction' : 'response',
    'state' : '0' //0:오프라인 1:자리 비움 2:상담 대기 3:상담 준비 중 4:상담 중
}

//웹소켓 URL
const WS_URL = '';

// DOM 컨트롤
let chatBox = document.getElementById('chat__chats');
let input = document.getElementById('chat__input');
let headerCounWait = document.getElementById('header-coun__wait');
let headerCounReceive = document.getElementById('header-coun__receive');
let headerCounEnding = document.getElementById('header-coun__ending');
let headerLog = document.getElementById('header__log');
let chatModal = document.getElementById('chat__modal');
let modalTestText = document.getElementById('modal__test-text');
let modalTestBtn = document.getElementById('modal__test-btn');
let connectFlag = false;

const SEND_BUTTON = document.getElementById('chat__sendbutton');
const COUN_ONLINE = document.getElementById('coun__online');
const COUN_FINISH = document.getElementById('coun__finish');
const MODAL_BACKTOMAIN = document.getElementById('modal__backtomain');
const COUN_READY = document.getElementById('couninfo__counready');
const COUN_REST = document.getElementById('couninfo__counrest');
const COUN_ING = document.getElementById('couninfo__couning');

function init() {
    //chatWS();
    chatFinishClick();
    chatsendready();
    closeModalReady();
    turnRestReady();
    turnReadyReady();
}

function chatWS() { //연결
    ws = new WebSocket(WS_URL);
    ws.onopen = function() {
        state.state = 2; //상담 대기 중
        jsonContent = JSON.stringify(state);
        ws.send(jsonContent);
    };
    ws.onclose = function(para) {
        chatClose(para);
        state.state = 0; //오프라인
        jsonContent = JSON.stringify(state);
        ws.send(jsonContent);
    }
    ws.onmessage = function(para) {
        chatMessage(para);
    }
    ws.onerror = function(para) {
        chatError(para);
    }
}

function chatMessage(para) { //수신 데이터 분별 및 함수 호출
    jsonParsing = para //JSON.parse(para);
    switch(jsonParsing.type) {
        case 'apply':
            receiveApp();
            break;
        case 'accept':
            chatFinish();
        case 'message':
            printReceive(jsonParsing.message);
            break;
        case 'message_is_delivered':
            sendComplete();
            break;
        case 'message_is_not_delivered':
            sendError();
        case 'state':
            sendState();
    }
}

//상담관 상태 최신화

function sendState() {
    jsonContent = JSON.stringify(state);
    console.log(jsonContent);
    //ws.send(state);
}

function turnRestReady() {
    COUN_READY.addEventListener('click', turnRest);
}

function turnRest() {
    COUN_READY.classList.add('vanish');
    COUN_REST.removeAttribute('class');
    COUN_ING.classList.add('vanish');
    state.state = 1; //자리 비움
    jsonContent = JSON.stringify(state);
    ws.send(jsonContent);
}

function turnReadyReady() {
    COUN_REST.addEventListener('click', turnReady);
}

function turnReady() {
    COUN_READY.removeAttribute('class');
    COUN_REST.classList.add('vanish');
    COUN_ING.classList.add('vanish');
    state.state = 2; //상담 대기
    jsonContent = JSON.stringify(state);
    ws.send(jsonContent);
}

function turnIng() {
    COUN_READY.classList.add('vanish');
    COUN_REST.classList.add('vanish');
    COUN_ING.removeAttribute('class');
}

//상담 신청 수신 및 준비

function receiveApp() { //상담 정보 모달
    turnIng();
    chatModal.removeAttribute('class');
    jsonContent = JSON.stringify(application_is_delivered);
    ws.send(jsonContent);
    state.state = 3; //상담 준비 중
    jsonContent = JSON.stringify(state);
    ws.send(jsonContent);
}

function closeModalReady() { //상담 정보 열람 끝, 상담 시작
    MODAL_BACKTOMAIN.addEventListener('click', closeModal);
}

function closeModal() {
    chatModal.classList.add('vanish');
    COUN_ONLINE.classList.add('vanish');
    COUN_FINISH.removeAttribute('class');
    headerCounWait.classList.add('vanish');
    headerCounReceive.removeAttribute('class');
    headerCounEnding.classList.add('vanish');
    headerLog.classList.add('vanish');
    jsonContent = JSON.stringify(accept);
    connectFlag = true;
    ws.send(jsonContent);
    state.state = 4; //상담 중
    jsonContent = JSON.stringify(state);
    ws.send(jsonContent);
}

function chatFinishClick() {
    COUN_FINISH.addEventListener('click', chatFinish);
}

function chatFinish() { //연결 중단
    COUN_ONLINE.removeAttribute('class');
    COUN_FINISH.classList.add('vanish');
    headerCounWait.removeAttribute('class');
    headerCounReceive.classList.add('vanish');
    headerLog.classList.add('vanish');
    connectFlag = false;
    turnReady();
}

function printReceive(message) { //수신 메시지 출력
    let contentBox = document.createElement('div');
    let content = document.createElement('p');
    content.innerHTML = message;
    contentBox.classList.add('chats__block-receive');
    contentBox.appendChild(content);
    chatBox.appendChild(contentBox);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function printSend(message) { //발신 메시지 출력
    let contentBox = document.createElement('div');
    let content = document.createElement('p');
    content.innerHTML = message;
    contentBox.classList.add('chats__block-send');
    contentBox.appendChild(content);
    chatBox.appendChild(contentBox);
    chatBox.scrollTop = chatBox.scrollHeight;
}

//상담 열람 후 연결

function chatOpen() { //상담 연결
    headerWait.classList.add('vanish');
    headerReady.classList.add('vanish');
    headerSend.removeAttribute('class');
    headerReceive.classList.add('vanish');
    headerEnding.classList.add('vanish');
    headerChating.classList.add('vanish');
    headerLog.classList.add('vanish');
}

function chatClose() {
    headerWait.removeAttribute('class');
    headerReady.classList.add('vanish');
    headerSend.classList.add('vanish');
    headerReceive.classList.add('vanish');
    headerEnding.classList.add('vanish');
    headerChating.classList.add('vanish');
    headerLog.classList.add('vanish');
}

function chatsendready() {
    SEND_BUTTON.addEventListener('click', chatsend);
    input.addEventListener('keydown', enterKeyCheck);
}

function enterKeyCheck() {
    if(event.keyCode == 13) {
        chatsend();
    }
}

function chatsend() { //입력 메시지 발신
    if (!connectFlag) {
        printReceive('상담 연결이 되지 않았습니다.<br>상단 우측의 상담 시작 버튼을 눌러 상담을 시작해주세요.');
        input.value = null;
    }
    else {
        if (!input.value == '') {
            _message.data = input.value;
            printSend(_message.message);
            jsonContent = JSON.stringify(_message);
            input.focus();
            input.value = null;
            ws.send(jsonContent);
            ws.send(message_is_delivered);
        }
    } 
}

init();