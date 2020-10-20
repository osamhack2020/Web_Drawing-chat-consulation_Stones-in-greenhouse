// 웹소켓 데이터
let ws;
let jsonContent;
let jsonParsing;

//JSON 데이터

let application = {
    'type': 'apply', //상담 정보
	'name': '',
	'address': '',
	'reason': []
}

let apply = {
	'type': 'apply',
	'application': application
}

let _message = {
	'type': 'message',
	'message': 'test', //test 삭제요망
    'opponent': 'group_name'
}

let accept = { //테스트용, 삭제요망
    'type': 'accept',
    'class' : 'accept'
}

let message_is_delivered = {
	'type': 'message_is_delivered',
    'opponent': 'group_name'
}

let state = {
    'type' : 'state',
    'direction' : 'request',
    'state' : '2', //0:오프라인 1:자리 비움 2:상담 대기 3:상담 준비 중 4:상담 중
    'comment' : '상담 대기 중'
}

//웹소켓 URL
const WS_URL = 'ws://' + location.host + '/ws/counseling/';

// DOM 컨트롤
let chatBox = document.getElementById('chat__chats');
let input = document.getElementById('chat__input');
let headerWait = document.getElementById('header__wait');
let headerReady = document.getElementById('header__ready');
let headerSend = document.getElementById('header__send');
let headerReceive = document.getElementById('header__receive');
let headerChating = document.getElementById('header__chating');
let headerLog = document.getElementById('header__log');
let counstateComment = document.getElementById('counstate__comment');
let alarmG = document.getElementById('counstate__alarm-g');
let alarmY = document.getElementById('counstate__alarm-y');
let alarmR = document.getElementById('counstate__alarm-r');
let chatModal = document.getElementById('chat__modal');
let connectFlag = false;

const SEND_BUTTON = document.getElementById('chat__sendbutton');
const COUN_READY = document.getElementById('coun__ready');
const COUN_FINISH = document.getElementById('coun__finish');
const MODAL_BACKTOMAIN = document.getElementById('modal__backtomain');

//모달 페이지 (test)
let modalTestText = document.getElementById('modal__test-text');
let modalTestBtn = document.getElementById('modal__test-btn');


function init() {
    chatWS();
    chatReadyClick();
    chatFinishClick();
    chatsendready();
    closeModalReady();
    sendCounInfoReady();
}

function chatWS() { //연결
    ws = new WebSocket(WS_URL);
    ws.onopen = function() {
        onloadCheckState();
    };
    ws.onclose = function(para) {
        chatClose(para);
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
        case 'accept':
            if (jsonParsing.class == 'accept') {
                chatOpen();
                break;
            }
            else {
                chatFinish();
                break;
            }
        case 'application_is_delivered' :
            chatReceive();
            break;
        case 'application_is_not_delivered' :
            chatReceiveError(jsonParsing);
            break;         
        case 'message':
            printReceive(jsonParsing.message);
            break;
        case 'message_is_delivered':
            sendComplete();
            break;
        case 'message_is_not_delivered':
            sendError();
            break;
        case 'state':
            checkState(jsonParsing);
    }
}

//상담관 상태 최신화

function onloadCheckState() {
    jsonContent = JSON.stringify(state);
    ws.send(jsonContent);
}

function checkState(para) {
    switch (para.state) {
        case '0':
            counstateComment.innerHTML = para.comment;
            alarmG.classList.add('vanish');
            alarmY.classList.add('vanish');
            alarmR.removeAttribute('class');
            break;
        case '1': 
            counstateComment.innerHTML = para.comment;
            alarmG.classList.add('vanish');
            alarmY.removeAttribute('class');
            alarmR.classList.add('vanish');
            break;
        case '2': 
            counstateComment.innerHTML = para.comment;
            alarmG.removeAttribute('class');
            alarmY.classList.add('vanish');
            alarmR.classList.add('vanish');
            break;
        case '3': 
            counstateComment.innerHTML = para.comment;
            alarmG.classList.add('vanish');
            alarmY.classList.add('vanish');
            alarmR.removeAttribute('class');
            break;
        case '4': 
            counstateComment.innerHTML = para.comment;
            alarmG.classList.add('vanish');
            alarmY.classList.add('vanish');
            alarmR.removeAttribute('class');
    }
}

// 상담 시작

function chatReadyClick() {
    COUN_READY.addEventListener('click', chatReady);
}

function chatReady() { //상담 시작 모달 페이지 호출
    loadModal();
    COUN_READY.classList.add('vanish');
    COUN_FINISH.removeAttribute('class');
    headerWait.classList.add('vanish');
    headerReady.removeAttribute('class');
    headerSend.classList.add('vanish');
    headerReceive.classList.add('vanish');
    headerChating.classList.add('vanish');
    headerLog.classList.add('vanish');
}

function loadModal() {
    chatModal.removeAttribute('class');
}

function closeModalReady() {
    MODAL_BACKTOMAIN.addEventListener('click', closeModal);
}

function closeModal() {
    chatFinish();
    chatModal.classList.add('vanish');
}

function chatFinishClick() {
    COUN_FINISH.addEventListener('click', chatFinish);
}

function chatFinish() { //연결 중단
    COUN_READY.removeAttribute('class');
    COUN_FINISH.classList.add('vanish');
    headerWait.removeAttribute('class'); 
    headerReady.classList.add('vanish');
    headerSend.classList.add('vanish');
    headerReceive.classList.add('vanish');
    headerChating.classList.add('vanish');
    headerLog.classList.add('vanish');
    connectFlag = false;
}

function sendCounInfoReady() {
    modalTestBtn.addEventListener('click', sendCounInfo);
}

function sendCounInfo() { //상담 정보 제출
    application.name = modalTestText.value;
    chatModal.classList.add('vanish');
    chatWait();
    ws.send(JSON.stringify(application));
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

function chatWait() { //상담 정보 제출 후 대기
    COUN_READY.classList.add('vanish');
    COUN_FINISH.removeAttribute('class');
    headerWait.classList.add('vanish');
    headerReady.classList.add('vanish');
    headerSend.removeAttribute('class');
    headerReceive.classList.add('vanish');
    headerChating.classList.add('vanish');
    headerLog.classList.add('vanish');
}

function chatReceive() {
    headerWait.classList.add('vanish');
    headerReady.classList.add('vanish');
    headerSend.classList.add('vanish');
    headerReceive.removeAttribute('class');
    headerChating.classList.add('vanish');
    headerLog.classList.add('vanish');
}

function chatReceiveError(para) {
    console.log(para.reason);
    chatFinish();
    printReceive(`현재 상담이 불가능 합니다.<br>사유 : ${para.reason}`)
}

//상담 열람 후 연결

function chatOpen() { //상담 연결
    headerWait.classList.add('vanish');
    headerReady.classList.add('vanish');
    headerSend.classList.add('vanish');
    headerReceive.classList.add('vanish');
    headerChating.removeAttribute('class');
    headerLog.classList.add('vanish');
    connectFlag = true;
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
            _message.message = input.value;
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