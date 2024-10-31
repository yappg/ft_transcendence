#!/bin/bash

if [ "$DEV" = "true" ]; then
    echo "=======> Using mounted volume for dev mode... <======="
    python /app/dev/manage.py migrate
    python /app/dev/manage.py runserver 0.0.0.0:8080
else
    echo "=======> Copying files for production... <======="
fi
