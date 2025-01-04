#!/bin/sh

# Wait for database
python manage.py wait_for_db

# Collect static files
python manage.py collectstatic --noinput

# Run migrations
python manage.py makemigrations

# Migrate
python manage.py migrate

# Create default site
# python manage.py setup_site

exec "$@"
