FROM python:latest
ENV PORT=9100
COPY . /app/
WORKDIR /app/
RUN apt-get update
CMD [ "sh", "-c", "python -m http.server ${PORT}" ]