from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login', views.signIn, name='login'),
    path('counsel', views.counsel, name='counsel'),
]