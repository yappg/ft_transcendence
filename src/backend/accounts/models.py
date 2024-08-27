from django.contrib.auth.models import AbstractBaseUser
from django.conf import settings
# from django.contrib.auth.models import User
from django.db import models

# Create your models here.
# class AccountUser(User):
#     # user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
#     bio = models.TextField(blank=True, null=True)
#     def __str__(self):
#         return self.user.username

# class AccountUser(User):
#     # user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='account_users')
#     op = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
#     tournament_display_name=models.CharField(max_length=50, blank=True)
#     avatar=models.ImageField(upload_to='templates/account/', default='templates/account/defaultAvatar.jpeg')
#     is_online=models.BooleanField(default=False)
#     # friends=models.ManyToManyField()
#     wins=models.IntegerField(default=0)
#     losses=models.IntegerField(default=0)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

    # def __str__(self):
    #     return self.name

# from django.db import models
# from django.contrib.auth.models import User

# # AccountUser model to store additional user information
class AccountUser(AbstractBaseUser):
    user = models.OneToOneField(AbstractBaseUser, on_delete=models.CASCADE)
    bio = models.TextField(blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    def __str__(self):
        return self.user.username

# BlogPost model to represent a blog post created by a user
class BlogPost(AbstractBaseUser):
    author = models.ForeignKey(AbstractBaseUser, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
