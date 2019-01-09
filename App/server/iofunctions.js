var socketio = require('socket.io');

roommap = "";

module.exports.listen = function(server) {
    io = socketio.listen(server);

    io.on("connection", (socket) => {
        console.log(`Socket connected with socket id: ${socket.id}`);
        console.log(socket);

        socket.on("sendAnswer", (data) => {
            if (socket.rooms.indexOf(data.roomkey) < 0) {
                return;
            }

            roommap.get(data.roomkey).addAnswer(data);
        });

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
        
        socket.on("getTextRequest", (lang) => {
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
