#!/bin/bash

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout $PWD/nginx.key \
  -out $PWD/nginx.crt

mv nginx.key nginx.crt ../src/Services/nginx
