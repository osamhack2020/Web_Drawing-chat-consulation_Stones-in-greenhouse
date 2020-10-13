from django.urls import path
from . import views

urlpatterns = [
    # main url ( url 통일을 위해 Chat_page, signup_page 통합)
    path('', views.Main_page, name='Main_page'),     
    path('email_activate/<token>', views.email_activate , name='email_activate'),
    path('forget', views.forget, name='forget')
]