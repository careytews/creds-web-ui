FROM nginx:1.13.12

COPY dist/creds-web-ui /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/
