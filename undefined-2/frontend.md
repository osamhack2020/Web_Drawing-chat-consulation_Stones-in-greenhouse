---
description: 실제 개발을 진행하였는지 보여주는 페이지이다.
---

# FRONTEND

## FRONTEND 작업

![&#xC18C;&#xC2A4;&#xCF54;&#xB4DC; &#xC791;&#xC131; &#xD654;&#xBA74;](../.gitbook/assets/1-%20%281%29.png)



## 상담자 : chat\_chating.js

```javascript
//페이지 최초 접속 시 상담관 상태 체
function onloadCheckState() {
    jsonContent = JSON.stringify(state);
    ws.send(jsonContent);
}
let state = {
    'type' : 'state',
    'direction' : 'request',
    'state' : '2', //0:오프라인 1:자리 비움 2:상담 대기 3:상담 준비 중 4:상담 중
    'comment' : '상담 대기 중'
}
```

```javascript
//상담 신청, 사전 정보 작성하고 ‘reason’에 텍스트 추가해서 전송
function sendCounInfo() { //상담 정보 제출
    application.reason = modalTestText.value;
    chatModal.classList.add('vanish');
    chatWait();
    console.log(apply);
    ws.send(JSON.stringify(apply));
}
let application = { //상담 정보
    'name': '',
    'address': '',
    'reason': []
}
 
let apply = {
    'type': 'apply',
    'application': application
}
```

```javascript
//메시지 전
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
let _message = {
    'type': 'message',
    'message': 'test', //test 삭제요망
    'opponent': 'group_name'
}
let message_is_delivered = {
    'type': 'message_is_delivered',
    'opponent': 'group_name'
}
```

```javascript
function chatMessage(para) { //수신 데이터 분별 및 함수 호출
    jsonParsing = JSON.parse(para);
    switch(jsonParsing.type) {
        case 'accept':
            if (jsonParsing.class == 'accept') {
ㄴaccept 데이터 확인 class 값에 따라 채팅 열고 닫는 것 확인
                chatOpen();
                break;
            }
ㄴ채팅이 열고 닫히는 것은 따로 선언된 플래그 변수를 기준으로 수발신을 막아 놓음
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
ㄴ상담 신청, 상담관 상태 확인  
        case 'message':
            printReceive(jsonParsing.message);
            break;
ㄴ메시지 수신 출력
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

```

## **상담관 : chat\_counseler\_chating.js**

```javascript
//상담자에서 보낸 상담관 상태 최신화 요청에 대한 응답, state 변수의 state 값은 브라우저에서 자체적으로 계속 수정됨
function chatWS() { //연결
    ws = new WebSocket(WS_URL);
    ws.onopen = function() {
        state.state = 2; //상담 대기 중
        jsonContent = JSON.stringify(state);
        ws.send(jsonContent);
ㄴ상담관 상태 상담자 측 최신화
    };
    ws.onclose = function(para) {
        chatClose(para);
        state.state = 0; //오프라인
        jsonContent = JSON.stringify(state);
        ws.send(jsonContent);
ㄴ상담관 상태 상담자 측 최신화
    }
    ws.onmessage = function(para) {
        chatMessage(para);
    }
    ws.onerror = function(para) {
        chatError(para);
    }
}

function sendState() {
    jsonContent = JSON.stringify(state);
    console.log(jsonContent);
    ws.send(state);
}

```

```javascript
//상담관 자리 비움-상담 대기로 상태 수정 ( 상담자 측 상담관 상태 최신화)
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

```

```javascript
//모달 페이지 닫기, 동시에 상담 검토 끝, 플래그 변수 = true (상담 열림), 상담 중으로 상담자 측 상담관 상태 최신화
function receiveApp(info) { //상담 정보 모달
    turnIng();
    let modalInfoBox = document.createElement('p');
    let modalReceiveBox = document.createElement('p');
    chatModal.removeAttribute('class'); //모달 페이지 출력
    modalInfoBox.innerHTML = info.application.name;
    modalReceiveBox.innerHTML = info.application.reason;
    modalInfo.appendChild(modalInfoBox);
    modalReceive.appendChild(modalReceiveBox);
    jsonContent = JSON.stringify(application_is_delivered);
    ws.send(jsonContent);
ㄴ상담 신청 상담관 측 도착 알림
    state.state = 3; //상담 준비 중
    jsonContent = JSON.stringify(state);
    ws.send(jsonContent);
ㄴ상담 준비 중으로 상담자 측 상담관 상태 최신화
}

```

```javascript
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

```

```javascript
//메시지 전송 (상담자와 같음)

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
            ws.send(JSON.stringify(message_is_delivered));
        }
    } 
}

```

```javascript
function chatMessage(para) { //수신 데이터 분별 및 함수 호출
    jsonParsing = JSON.parse(para);
    switch(jsonParsing.type) {
        case 'apply':
            receiveApp(jsonParsing);
            break;
        case 'accept':
            chatFinish();
ㄴ상담자는 채팅 열 권한이 없으므로 상담관은 채팅 닫는 것만 받음
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

```

