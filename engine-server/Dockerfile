FROM node
ENV PORT=9000
WORKDIR /app/
COPY . /app/
# RUN apt-get update -yq
# RUN apt-get -y install curl gnupg -yq
# RUN curl -sL https://deb.nodesource.com/setup_12.x  | bash
# RUN apt-get -y install nodejs -yq
RUN npm run build
# jumps straight into dist folder to serve the bundled code
# WORKDIR /app/dist/
# CMD [ "sh", "-c", "python -m http.server ${PORT}" ]
CMD [ "node", "server.js" ]