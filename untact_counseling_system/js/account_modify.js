let accountPw = document.getElementById('account__pw');
let accountPw_check = document.getElementById('account__pw-check');
let accountBirth = document.getElementById('account__birth-year');

const BIRTH_MODIFY = document.getElementById('birth__modify');
const AFFI_MODIFY = document.getElementById('affi__modify');
const BIRTH_INFO = document.getElementById('birth__info');
const AFFI_INFO = document.getElementById('affi__info');
const BIRTH_FORM = document.getElementById('birth__form');
const AFFI_FORM = document.getElementById('affi__form');

//비밀번호 재확인

function accountPwCheck() {   
    accountPw_check.addEventListener('change', checkPw);
}

function checkPw() {
    if (accountPw.value !== accountPw_check.value) {
        accountPw_check.value = null;
        accountPw_check.classList.add('input__error');
    }
    else {
        accountPw_check.classList.remove('input__error');
    }
}

//생년월일 숫자 확인

function accountBirthChange() {   
    accountBirth.addEventListener('change', checkNumberChange);
}

function checkNumberChange() {
    for (let i = 0; i < accountBirth.value.length; i++) {
        let check = Number(accountBirth.value[i]);

        if (isNaN(check)) {
            accountBirth.value = null;
            accountBirth.classList.add('input__error');
            break;
        }
        else {
            accountBirth.classList.remove('input__error');
        }
    }
}

//생년월일 숫자 외 입력 제한

function accountBirthKeyup() {   
    accountBirth.addEventListener('keyup', checkNumberKeyup);
}

function checkNumberKeyup() {
    let check = Number(accountBirth.value[accountBirth.value.length - 1]);
    if (isNaN(check)) {
        accountBirth.value = accountBirth.value.slice(0, -1);
    }
}

//생년월일 수정

function birthModifyReady() {
    BIRTH_MODIFY.addEventListener('click', birthModify);
}

function birthModify() {
    BIRTH_INFO.classList.add('vanish');
    BIRTH_FORM.classList.remove('vanish');
}

//소속 수정

function affiModifyReady() {
    AFFI_MODIFY.addEventListener('click', affiModify);
}

function affiModify() {
    AFFI_INFO.classList.add('vanish');
    AFFI_FORM.classList.remove('vanish');
}

accountPwCheck();
accountBirthChange();
accountBirthKeyup();
birthModifyReady();
affiModifyReady();