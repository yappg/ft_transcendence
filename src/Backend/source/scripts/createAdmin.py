from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class adminUser(BaseCommand):
    help = "create an admin user with env variables"

    def handle(self, *args, **kwargs):
        user = 'admin'
        email = 'admin@admin.com'
        password = 'admin'

        if User.objects.filter(username=user).exists():
            self.stdout.write(self.style.WARNING('admin user already exists.'))
        else:
            User.objects.create_superuser(username=user, email=email, password=password)
            self.stdout.write(self.style.SUCCESS('admin user has been succesfully created.'))
