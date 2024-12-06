# from django.contrib.auth.signals import user_logged_in, user_logged_out
# # from .views import SignInView
# from django.dispatch import receiver
# from .models import PlayerProfile

# @receiver(user_logged_in)
# def user_logged_in_handler(sender, user, request, **kwargs):
#     try:
#         profile = user.profile  # Access related PlayerProfile
#         profile.is_online = True
#         profile.save()
#     except PlayerProfile.DoesNotExist:
#         pass  # Handle the case where the profile doesn't exist

# @receiver(user_logged_out)
# def user_logged_out_handler(sender, user, request, **kwargs):
#     try:
#         profile = user.profile
#         profile.is_online = False
#         profile.save()
#     except PlayerProfile.DoesNotExist:
#         pass
