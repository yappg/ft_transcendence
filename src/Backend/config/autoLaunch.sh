#!/bin/bash

pip install --no-cache-dir -r requirements.txt

python manage.py makemigrations
python manage.py migrate

exec "$@"
