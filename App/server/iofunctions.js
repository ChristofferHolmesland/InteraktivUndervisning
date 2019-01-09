var socketio = require('socket.io');

module.exports.listen = function(server) {
    io = socketio.listen(server);

    io.on("connection", function(socket) {

        socket.on("clientStarted", function() {
            console.log("Client connected");
            socket.emit("clientResponse");
        });
    
        socket.on("hostStarted", function() {
            console.log("Host connected");
            socket.emit("hostResponse");
        });
    
        socket.on("clientRequest", function(msg) {
            console.log("got this message from client: " + msg);
            console.log(socket.id);
        });
    
        socket.on("hostRequest", function(msg) {
            console.log("got this message from host: " + msg);
        });
        
        socket.on("getTextRequest", function(lang) {
            socket.emit("getTextResponse", {
                Buttons: {
                    anonymousText: "Anonym",
                    acceptText: "Godkjenn",
                    loginText: "Logg inn",
                    feideList: ["Vi bruker cookies", "Vi lagrer bruker data", "Godkjenn!"],
                    anonymousList: ["Vi bruker ikke cookies", "Vi lagrer ikke data", "linje 3"]
                }
            });
        });
        
        socket.on('disconnect', function(){
            console.log(`Socket disconnected with socket id: ${socket.id}`);
        });
            
    });

    return io;
}
