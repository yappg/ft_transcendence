FROM nginx:alpine

RUN apk update && \
    apk add curl openssl && \
    rm -rf /var/cache/apk/* \
    rm -rf /etc/nginx/conf.d/default.conf

COPY ./config/nginx.conf /etc/nginx/conf.d/endpoint.conf

COPY ./config/SSLGen.sh /init.sh

EXPOSE 443

ENTRYPOINT [ "sh", "/init.sh" ]
CMD [ "nginx", "-g", "daemon off;" ]
