FROM python:alpine

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR /app/source

COPY ./source/requirements.txt ./

RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt \
    && chmod -R +x /app

EXPOSE 8080

ENTRYPOINT [ "sh", "../config/autoDeploy.sh" ]
CMD [ "python", "manage.py", "runserver", "0.0.0.0:8080" ]
# CMD ["daphne", "-b", "0.0.0.0", "-p", "8080", "_1Config.asgi:application"]
# CMD [ "tail", "-f", "/dev/null" ]
