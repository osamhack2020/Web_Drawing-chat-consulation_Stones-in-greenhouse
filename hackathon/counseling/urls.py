from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login', views.signIn, name='login'),
    path('counsel', views.counsel, name='counsel'),
    path('login_page', views.signUp, name='signUp'),
    path('email_activate/<token>', views.email_activate, name='email_activate'),
]