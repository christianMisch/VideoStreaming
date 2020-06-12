FROM node
ENV PORT=9000

WORKDIR /app/
COPY . /app/

RUN npm install
RUN npm run build

CMD [ "node", "server.js" ]