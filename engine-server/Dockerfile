FROM python:latest
ENV PORT=9000
COPY /src/app /app/
RUN apt-get update
# WORKDIR /app/
CMD [ "sh", "-c", "python -m http.server ${PORT}" ]