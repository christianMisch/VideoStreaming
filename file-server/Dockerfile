FROM nginx
COPY /data/output /app/
COPY default_location /etc/nginx/vhost.d/default_location
# RUN apt-get update
ENTRYPOINT ["nginx","-g","daemon off;"]
