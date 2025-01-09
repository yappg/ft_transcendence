######################################
# Stage 1: Development stage (for local development)
######################################

FROM python:alpine AS development

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV DJANGO_SETTINGS_MODULE=_1Config.settings.development

WORKDIR /app/source

RUN apk add --no-cache curl

COPY ./source/requirements.txt ./

RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

EXPOSE 8080

ENTRYPOINT [ "sh", "../config/autoDeploy.sh" ]
CMD ["sh", "-c", \
     "echo 'starting development enviremnt' && \
     while true; do python manage.py runserver 0.0.0.0:8080 && echo 'Server crashed, restarting...' && sleep 2; done" \
    ]

######################################
# Stage 2: Production build stage (for nginx)
######################################

FROM python:alpine AS production

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV DJANGO_SETTINGS_MODULE=_1Config.settings.production

WORKDIR /app/source

RUN apk add --no-cache curl

COPY ./source/requirements.txt ./

RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

COPY . /app

RUN chmod +x /app/config/autoDeploy.sh

EXPOSE 8080

ENTRYPOINT [ "sh", "../config/autoDeploy.sh" ]
CMD ["daphne", "-b", "0.0.0.0", "-p", "8080", "_1Config.asgi:application"]
