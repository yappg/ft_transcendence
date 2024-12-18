######################################
# Stage 1: Development stage
######################################

FROM python:alpine AS development

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV DJANGO_SETTINGS_MODULE=_1Config.settings.development

WORKDIR /app/source

COPY ./source/requirements.txt ./

RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt \
    && chmod -R +x /app

EXPOSE 8080

ENTRYPOINT [ "sh", "../config/autoDeploy.sh" ]
CMD [ "sh", "-c", "while true; do python manage.py runserver 0.0.0.0:8080 && sleep 5 ;done" ]
# CMD [ "tail", "-f", "/dev/null" ]

######################################
# Stage 2: Production build stage
######################################

FROM python:alpine AS production

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV DJANGO_SETTINGS_MODULE=_1Config.settings.production

COPY . .

WORKDIR /app/source

RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt \
    && chmod -R +x /app

EXPOSE 8080

ENTRYPOINT [ "sh", "../config/autoDeploy.sh" ]
CMD ["daphne", "-b", "0.0.0.0", "-p", "8080", "_1Config.asgi:application"]
