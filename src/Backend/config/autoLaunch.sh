#!/bin/bash

# wait for database to be up and running ...

sh /app/config/dev.sh

python manage.py migrate

exec "$@"
