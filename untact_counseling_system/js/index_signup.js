let signupId = document.getElementById("signup__id");
let signupPw = document.getElementById("signup__pw");
let signupPw_check = document.getElementById("signup__pw-check");
let signupBirth = document.getElementById("signup__birth-year");

//아이디 이메일 여부 확인

function signupIdCheck() {   
    signupId.addEventListener('change', checkEmail);
}

function checkEmail() {
    let flag = false;

    for (let i = 0; i < signupId.value.length; i++) {
        if (signupId.value[i] == "@") {
            flag = true;
            signupId.classList.remove('input__error');
            break;
        }
    }

    if (!flag) {
        signupId.value = null;
        signupId.classList.add('input__error');
    }
}

//비밀번호 재확인

function signupPwCheck() {   
    signupPw_check.addEventListener('change', checkPw);
}

function checkPw() {
    if (signupPw.value !== signupPw_check.value) {
        signupPw_check.value = null;
        signupPw_check.classList.add('input__error');
    }
    else {
        signupPw_check.classList.remove('input__error');
    }
}

//생년월일 숫자 확인

function signupBirthChange() {   
    signupBirth.addEventListener('change', checkNumberChange);
}

function checkNumberChange() {
    for (let i = 0; i < signupBirth.value.length; i++) {
        let check = Number(signupBirth.value[i]);

        if (isNaN(check)) {
            signupBirth.value = null;
            signupBirth.classList.add('input__error');
            break;
        }
        else {
            signupBirth.classList.remove('input__error');
        }
    }
}

//생년월일 숫자 외 입력 제한

function signupBirthKeyup() {   
    signupBirth.addEventListener('keyup', checkNumberKeyup);
}

function checkNumberKeyup() {
    let check = Number(signupBirth.value[signupBirth.value.length - 1]);
    if (isNaN(check)) {
        signupBirth.value = signupBirth.value.slice(0, -1);
    }
}

signupIdCheck();
signupPwCheck();
signupBirthChange();
signupBirthKeyup();

