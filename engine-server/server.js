const express = require('express');
const process = require('process');
const path = require('path');
const app = express();

const port = 9000;

app.use('/', express.static(__dirname + '/dist'));
app.use('/blender', express.static(path.resolve(__dirname, 'src', 'assets', 'blender')));

app.listen(port, (_) => {
    console.log(`Node server is running on port ${port}`);
});

// docker container can be closed with CTRL + C
process.on('SIGINT', () => {
  console.info("Interrupted");
  process.exit(0);
});