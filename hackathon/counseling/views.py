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
            user.status = 1
            user.save()
            return redirect('counsel')
        else:
            return render(request, 'counseling/index.html')

@login_required
def counsel(request):
    if request.user.role == 2:
        return render(request, 'counseling/chat_counseler.html')
    else:
        return render(request, 'counseling/chat_counselee.html')