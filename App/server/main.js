const express = require('express');
const path = require('path');
const history = require("connect-history-api-fallback");

const app = express();
const port = process.env.PORT || 3000;

// Midleware
app.use(history()); // IMPORTANT: This line has to come before app.use(express.static())
app.use(express.static(path.join(__dirname, '/public/')));

// Starts the server and the socket.io websocket
const server = app.listen(port, function() {
    console.log(`Server listening on localhost:${ port }! Use ctrl + c to stop the server!`)
});
const io = require('./iofunctions').listen(server);
