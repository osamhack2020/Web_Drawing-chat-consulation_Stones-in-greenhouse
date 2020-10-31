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
    
    name = models.CharField(max_length=20, null=True, blank=True)
    counseler = models.ForeignKey(
        'self',
        on_delete=models.PROTECT,
        related_name='counselee',
        related_query_name='counselees',
        null=True,
        blank=True
    )
    birthday = models.DateField(null=True, blank=True)
    company = models.CharField(max_length=150, null=True, blank=True)
    code = models.IntegerField(choices=Code.choices, default=1)
    status = models.IntegerField(choices=Status.choices, default=2)
    role = models.IntegerField(choices=Role.choices, default=1)