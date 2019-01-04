const express = require('express');
const path = require('path');

const app = express();

const port = process.env.PORT || 3000;

const server = app.listen(port, () => console.log(`Server listening on localhost:${ port }! Use ctrl + c to stop the server!`));
const io = require('socket.io').listen(server);

// Tells express to look in the static folder for static resources

app.get('/', (req, res) => {
    app.use(express.static(path.join(__dirname, '/public/client/')));
    res.sendFile(__dirname + '/public/client/index.html');
});

app.get('/admin/', (req, res) => {
    app.use(express.static(path.join(__dirname, '/public/host/')));
    res.sendFile(__dirname + '/public/host/index.html');
})

io.on('connection', function(socket){

    socket.emit("msg");

    console.log(`Socket connected with socket id: ${socket.id}`);

    socket.on("test", (msg) => {
        console.log(msg);
    });
    
    socket.on('disconnect', function(){

    });

});