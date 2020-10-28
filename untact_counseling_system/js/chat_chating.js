// 웹소켓 데이터
let ws;
let jsonContent;
let jsonParsing;

//JSON 데이터

let application = { //상담 정보
	'name': '',
	'address': '',
	'reason': []
}

let apply = {
	'type': 'apply',
	'application': application
}

let accept = { //상담 수락 확인, 종료 확인
    'type': 'accept',
    'class': 'finish'
}

let _message = {
	'type': 'message',
	'message': '',
    'opponent': 'group_name'
}

let message_is_delivered = {
	'type': 'message_is_delivered',
    'opponent': 'group_name'
}

let state = {
    'type' : 'state',
    'direction' : 'request',
    'state' : '', //0:오프라인 1:자리 비움 2:상담 대기 3:상담 준비 중 4:상담 중
    'comment' : ''
}

const LOGDATADEMO = {
    "coun20201018" : [
        {
            'type': 'message',
            'message': '안녕하세요~', //test 삭제요망
            'opponent': 'counselor'
        },
        {
            'type': 'message',
            'message': '반갑습니다^^', //test 삭제요망
            'opponent': 'counselor'
        },
        {
            'type': 'message',
            'message': '안녕하세요.', //test 삭제요망
            'opponent': 'counselee'
        },
        {
            'type': 'message',
            'message': '어떤 고민으로 상담을 신청하셨나요?',
            'opponent': 'counselor'
        },
        {
            'type': 'message',
            'message': '그 전에 물어볼 것이 있습니다.',
            'opponent': 'counselee'
        },
        {
            'type': 'message',
            'message': '상담이 끝나고 난 이후에 나눈 대화 내용은 상담관 님이 확인할 수 있나요?',
            'opponent': 'counselee'
        },
        {
            'type': 'message',
            'message': '비밀 보장에 대해 민감해서 확인하고 싶습니다.', 
            'opponent': 'counselee'
        },
        {
            'type': 'message',
            'message': '맞습니다. 상담관은 상담 종료 후 상담 내용을 확인할 수 있지만 참고용으로만 사용하고 본 내용은 저와 상담자님 단 둘만 조회할 수 있으니 안심하세요~',
            'opponent': 'counselor'
        }
    ]
}

const logViewTest = document.getElementById('logviewtest');

//웹소켓 URL
const WS_URL = '';

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
let modalTestText = document.getElementById('modal__text');
let modalTestBtn = document.getElementById('modal__submit');


function init() {
    //chatWS();
    chatReadyClick();
    chatFinishClick();
    chatsendready();
    closeModalReady();
    sendCounInfoReady();
    logDemoReady();
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
    jsonParsing = JSON.parse(para);
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
    application.reason = modalTestText.value;
    chatModal.classList.add('vanish');
    chatWait();
    console.log(apply);
    ws.send(JSON.stringify(apply));
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

function printSendPaint(message) { //그림 발신 메시지 출력
    let contentBox = document.createElement('div');
    let content = document.createElement('img');
    content.src = message;
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
            ws.send(JSON.stringify(message_is_delivered));
        }
    } 
}

//그림 전송

const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const mode = document.getElementById("jsMode");
const send = document.getElementById("jsSend");
const cancel = document.getElementById("jsCancel");
const show = document.getElementById("show__paint");

const INITIAL_COLOR = "#2c2c2c";
const CANVAS_SIZE = "500";

let paintPage = document.getElementById("chat__paint");

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
ctx.strokeStyle = INITIAL_COLOR
ctx.fillStyle = INITIAL_COLOR
ctx.lineWidth = 2.5;

let painting = false;
let filling = false;

function stopPainting(){
    painting = false;
}

function startPainting(){
    painting = true;
}

function onMouseMove(event){
    const x = event.offsetX;
    const y = event.offsetY;
    if(!painting){
        ctx.beginPath();
        ctx.moveTo(x, y);
    } else{
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

function handleColorClick(event){
    const color = event.target.style.backgroundColor;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
}

function handleRangeChange(event){
    const size = event.target.value;
    ctx.lineWidth = size;
}

function handleModeClick(){
    if(filling === true){
        filling = false;
        mode.innerText = "그리기";
    } else {
        filling = true;
        mode.innerText = "채우기";
    }
}

function handleCanvasClick(){
    if (filling){
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    } else {

    }
}

function handleSendClick(){
    paintPage.removeAttribute('class');
    let printData = canvas.toDataURL();
    printSendPaint(printData);
}

function handleCancelClick(){
    paintPage.removeAttribute('class');
}

function handleShowClick(){
    paintPage.classList.add('paint__show')
}

if (canvas) {
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting);
    canvas.addEventListener("click", handleCanvasClick);
}

Array.from(colors).forEach(color => color.addEventListener("click", handleColorClick));

if(range){
    range.addEventListener("input", handleRangeChange);
}

if(mode){
    mode.addEventListener("click", handleModeClick);
}

if(send){
    send.addEventListener("click", handleSendClick);
}

if(cancel){
    cancel.addEventListener("click", handleCancelClick);
}

if(show){
    show.addEventListener("click", handleShowClick);
}



//로그 조회 데모

function logDemoReady() {
    logViewTest.addEventListener('click', logDemo);
}

function logDemo() {
    while (chatBox.hasChildNodes()) {
        chatBox.removeChild(chatBox.firstChild);
    } 
    for (let i = 0; i < LOGDATADEMO.coun20201018.length; i++) {
        switch (LOGDATADEMO.coun20201018[i].opponent) {
            case 'counselor' :
                printReceive(LOGDATADEMO.coun20201018[i].message);
                break;
            case 'counselee' :
                printSend(LOGDATADEMO.coun20201018[i].message);
        }
    }
    headerWait.classList.add('vanish');
    headerReady.classList.add('vanish');
    headerSend.classList.add('vanish');
    headerReceive.classList.add('vanish');
    headerChating.classList.add('vanish');
    headerLog.removeAttribute('class');
    connectFlag = false;
}

init();