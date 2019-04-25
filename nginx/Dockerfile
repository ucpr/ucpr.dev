FROM nginx:1.15.10-alpine

RUN apk update && \
    apk add git && \
    git clone https://github.com/ucpr/ucpr.github.io /app

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./default.conf /etc/nginx/conf.d/default.conf
