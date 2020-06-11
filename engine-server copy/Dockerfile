FROM python:latest
ENV PORT=9000
COPY src/app/ /app/
RUN apt-get update
# jumps straight into app folder to serve index.html
WORKDIR /app/
CMD [ "sh", "-c", "python -m http.server ${PORT}" ]