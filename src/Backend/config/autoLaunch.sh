#!/bin/bash

# wait for database to be up and running ...

# python manage.py makemigrations
python manage.py migrate

exec "$@"
