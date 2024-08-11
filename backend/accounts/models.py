from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class User(AbstractUser):
    pass
    # friends=models.ManyToManyField()
    # is_online=models.BooleanField(default=False)
