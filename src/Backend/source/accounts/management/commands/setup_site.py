from django.core.management.base import BaseCommand
from django.contrib.sites.models import Site
from django.db import transaction

class Command(BaseCommand):
    help = 'Creates the default site'

    def handle(self, *args, **kwargs):
        with transaction.atomic():
            # Check if a site already exists
            if not Site.objects.exists():
                Site.objects.create(
                    id=1,
                    domain='localhost',
                    name='localhost'
                )
                self.stdout.write(self.style.SUCCESS('Successfully created default site'))
            else:
                self.stdout.write(self.style.SUCCESS('Site already exists'))
