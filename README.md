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

### blender level

1. If you want to create your own level you need to use the [BlenderExporter](https://github.com/BabylonJS/BlenderExporter).

2. Once you have generated a `.babylon` file you have to place is under  `file-server/output/blender/` to be correctly imported by the engine server.


