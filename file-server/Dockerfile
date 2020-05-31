FROM python:latest
ENV PORT=9000
COPY /src/app/output /app/
RUN apt-get update && cd /app
CMD [ "sh", "-c", "python -m http.server ${PORT}" ]