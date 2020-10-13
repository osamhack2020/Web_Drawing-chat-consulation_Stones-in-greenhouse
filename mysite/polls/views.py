from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.contrib import messages
from django.core.mail import EmailMessage
from django.template.loader import render_to_string

#토큰 메서드
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode,urlsafe_base64_decode
from django.core.mail import EmailMessage
from django.utils.encoding import force_bytes, force_text
import jwt
from django.conf import settings
SECRET_KEY = getattr(settings, 'SECRET_KEY', None)
ALGORITHM = getattr(settings, 'ALGORITHM', None)


#메인 페이지
def Main_page(request):
    # MAIN_PAGE 처음 들어올 때
    if request.method == 'GET':
        return render(request, 'polls/Main_page.html')


    # MAIN_PAGE(회원가입, 로그인 (POST))
    if request.method == 'POST':
        data = request.POST
        
        #회원가입 => 로컬URL 유지하면서 반환
        #값이 있다면 통과
        if 'signUpName' in data and (data['signUpName'] and data['signUpId'] and data['signUpPw'] and data['signUpPw_check'] and data['signUpBirthYear'] and data['signUpBirthMonth'] and data['signUpBirthDay']):
            signUpName = data["signUpName"]
            signUpId = data["signUpId"] #이메일
            signUpPw = data["signUpPw"]
            signUpPw_check = data["signUpPw_check"]
            signUpBirthYear = data["signUpBirthYear"]
            signUpBirthMonth = data["signUpBirthMonth"]
            signUpBirthDay = data["signUpBirthDay"]

            #이메일 인증 할 사용자 생성
            a = 1
            if a == 2:
                pass
            else:
                data = {
                'id': signUpId,
                'name' : signUpName,
                'pw': signUpPw
                }
                token_ = jwt.encode(data, SECRET_KEY, ALGORITHM)
                token = token_.decode('utf-8')
                #이메일 인증
                context = {
                #'title' : "제목",
                'email' : signUpId,
                    #'message' : "안녕하세요"
                    'token' : token
                    }
                emailContent = render_to_string('polls/email.html', context)
                email = EmailMessage("온실 속 돌멩이 인증메일입니다.", emailContent, to = [signUpId])
                email.content_subtype = "html"
                result = email.send()      

            #이메일이 성공적으로 발송되면 
            #의문, 이메일이 뭐든 간에 항상 1값이 전해진다.
                if result == 1:
                #messages.info(request, "성공적으로 보냈습니다.")
                    return render(request, 'polls/Main_page.html', {"result" : result, "signUpId" : signUpId })
        
                else:
                    return render(request, 'polls/Main_page.html', {"result" : result, "signUpId" : signUpId})


                return render(request, 'polls/Main_page.html')
        
        #로그인 => 로컬URL 유지하면서 Chat_page.html(api) 반환
        #값이 있다면 통과
        elif 'login_id' in data and ( data['login_id'] and data['login_pw']):

            #로그인 값 받아오기  
            login_id = data["login_id"]
            login_pw = data["login_pw"]

            #다른 api 연동해야하니 rendirect 써야함   
            return render(request, 'polls/Chat_page.html')
        
        #회원가입, 로그인 둘다 한 칸이라도 비었을 겅우
        else:
            return render(request, 'polls/Main_page.html', {"error" : "유효하지 않은 값입니다."})


#이메일 활성화page
def email_activate(request, token):
    payload = jwt.decode(token, SECRET_KEY, ALGORITHM)
    name = payload['name']
    result = True
    return render(request, 'polls/mail_success.html', {"mail_success": result, "signName" : name} )

#로그인 정보를 잊으셨습니까?
def forget(request):
    return render(request, 'polls/forget.html')