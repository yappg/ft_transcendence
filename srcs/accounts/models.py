from django.db import models

# Create your models here.
class User(models.Model):
    user_nmae=models.CharField(max_length=50)
    email=models.EmailField(max_length=254)