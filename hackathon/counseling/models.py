from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    class Code(models.IntegerChoices):
        Masan = 1

    class Status(models.IntegerChoices):
        Online = 1
        Offline = 2
        Counseling = 3
        Ready = 4

    class Role(models.IntegerChoices):
        Counselee = 1
        Counseler = 2
    
    name = models.CharField(max_length=20)
    counseler = models.ForeignKey(
        'self',
        on_delete=models.PROTECT,
        related_name='counselee',
        related_query_name='counselees'
    )
    birthday = models.DateField(auto_now_add=True)
    company = models.CharField(max_length=150)
    code = models.IntegerField(choices=Code.choices, null=True, blank=True)
    status = models.IntegerField(choices=Status.choices, default=2)
    role = models.IntegerField(choices=Role.choices)