# VideoStreaming
Integrate video streaming into a game engine.

## How to run the app
1. Build the image (inside the engine-server folder)
docker build -t engine-image

2. Run the container
docker run -it --rm --name babylon -p 9000:9000 engine-image

3. Go to localhost:9000 in the browser


