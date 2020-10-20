from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login', views.signIn, name='login'),
    path('logout', views.signOut, name='logout'),
    path('counsel', views.counsel, name='counsel'),
    path('test', views.test, name='test'),
]