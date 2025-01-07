#!/bin/bash

mkdir -p /etc/ssl/certs
mkdir -p /etc/ssl/private

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/nginx.key \
    -out /etc/ssl/certs/nginx.crt \
    -subj "/C=MA/ST=beni_mellal/L=khouribga/O=1337/OU=1337/CN=transcendence.42.fr"

exec "$@"
