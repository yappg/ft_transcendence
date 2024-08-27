from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import User
from django.db import models

# Create your models here.
class UserProfile(AbstractUser):
    user = models.OneToOneField(AbstractUser, on_delete=models.CASCADE)
    bio = models.TextField(blank=True, null=True)
    def __str__(self):
        return self.user.username

class Account(User):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tournament_display_name=models.CharField(max_length=50, blank=True)
    avatar=models.ImageField(upload_to='templates/account/', default='templates/account/defaultAvatar.jpeg')
    is_online=models.BooleanField(default=False)
    friends=models.ManyToManyField()
    wins=models.IntegerField(default=0)
    losses=models.IntegerField(default=0)
    def __str__(self):
        return self.title


# from django.db import models
# from django.contrib.auth.models import User

# # UserProfile model to store additional user information
# class UserProfile(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     bio = models.TextField(blank=True, null=True)
#     birth_date = models.DateField(blank=True, null=True)
#     profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

#     def __str__(self):
#         return self.user.username

# # BlogPost model to represent a blog post created by a user
# class BlogPost(models.Model):
#     author = models.ForeignKey(User, on_delete=models.CASCADE)
#     title = models.CharField(max_length=200)
#     content = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

