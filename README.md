# VideoStreaming
Integrate video streaming into a game engine.

## Development

To start the webpack-dev-server run `npm start` in the `engine-server` folder

## How to run the app

### file server (inside the `file-server` folder)

1. `docker build -t web-server-image .`

2. `docker run --rm --name web-server -p 8080:80 web-server-image`

### engine server (inside the `engine-server` folder)

1. `docker build -t engine-image`

2. `docker run -it --rm --name babylon -p 9000:9000 engine-image`

3. Go to http://localhost:9000 in the browser


