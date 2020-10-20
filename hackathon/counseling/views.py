from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.sessions.models import Session
from django.utils import timezone

# Create your views here.

def index(request):
    return render(request, 'counseling/index.html')

def signIn(request):
    if request.method == 'POST':
        username = request.POST['signin__id']
        password = request.POST['signin__pw']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('counsel')
        else:
            return render(request, 'counseling/index.html')

def signOut(request):
    logout(request)
    return redirect('index')

@login_required
def counsel(request):
    if request.user.type == 'counseler':
        return render(request, 'counseling/chat_counseler.html')
    else:
        return render(request, 'counseling/chat_counselee.html')

def test(request):
    sessions = Session.objects.filter(expire_date__gte=timezone.now())
    session_ = request.user
    return render(request, 'counseling/test.html', {'session_':session_, 'sessions':sessions})