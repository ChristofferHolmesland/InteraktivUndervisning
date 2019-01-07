const express = require('express');
const path = require('path');
const history = require("connect-history-api-fallback");

const app = express();
const port = process.env.PORT || 3000;

// Midleware
app.use(history()); // IMPORTANT: This line has to come before app.use(express.static())
app.use(express.static(path.join(__dirname, '/public/')));

// Starts the server and the socket.io websocket
const server = app.listen(port, () => console.log(`Server listening on localhost:${ port }! Use ctrl + c to stop the server!`));
const io = require('socket.io').listen(server);

// Listens for websocket events
io.on('connection', function(socket){
    
    console.log(`Socket connected with socket id: ${socket.id}`);

    socket.on("clientStarted", () => {
        console.log("Client connected");
        socket.emit("clientResponse");
    });

    socket.on("hostStarted", () => {
        console.log("Host connected");
        socket.emit("hostResponse");
    });

    socket.on("clientRequest", (msg) => {
        console.log("got this message from client: " + msg);
        console.log(socket.id);
    });

    socket.on("hostRequest", (msg) => {
        console.log("got this message from host: " + msg);
    });
    
    socket.on('disconnect', function(){
        console.log(`Socket disconnected with socket id: ${socket.id}`);
    });

});