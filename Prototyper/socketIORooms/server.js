var express = require("express");
var nunjucks = require("nunjucks");
var path = require("path");
var app = express();
var server = app.listen("3000", function(){
	console.log("Game server listening on localhost:3000/admin and localhost:3000/client!\nUse ctrl + c to stop the server!");
});
var io = require("socket.io").listen(server);

nunjucks.configure(__dirname, {
	autoescape: true,
	express: app
});

app.use(express.static(path.join(__dirname)));

app.get("/admin", function(req, res){
	res.render("admin.html");
});

app.get("/client", function(req, res){
    res.render("client.html");
});

var rooms = new Map();

io.on("connection", function(socket){

    // ADMIN FUNCTIONS

    socket.on("createRoom", function(roomId){
        if(roomId != "" && /\s/g.test(roomId) == false){
            rooms.set(roomId, new room(roomId));
            socket.emit("createRoomSuccess", roomId);
        }else{
            socket.emit("createRoomFailure");
        }
    });

    socket.on("deleteRoom", function(roomId){
        rooms.delete(roomId);
        socket.broadcast.to(roomId).emit("deletingRoom", roomId);
    });

    // CLIENT FUNCTIONS

    socket.on("addRoom", function(roomId){
        if(rooms.has(roomId)){
            socket.emit("addRoomSuccess", roomId);
            socket.join(roomId);
        }else{
            socket.emit("addRoomFailure");
        }
    });

    socket.on("sendMessage", function(messageInfo){
        rooms.get(messageInfo.roomId).messages.push(new message(messageInfo));
        socket.broadcast.to(messageInfo.roomId).emit("newMessage", messageInfo);
    });

    socket.on("personLeaving", function(info){
        infos = info;
    });

    // Used by both

    socket.on("roomInfoRequest", function(roomId){
        socket.emit("roomInfoResponse", rooms.get(roomId));
        socket.join(roomId);
    });

    socket.on("disconnect", function(){

    });
});

// Data structure to keep information about a chat room
class room {
    constructor(roomName){
        this.roomName = roomName;
        this.messages = [];
        this.connectedUsers = new Map();
    }
    getNumberOfUsers(){
        return this.connectedUsers.keys.length;
    }
}

class message {
    constructor(messageInfo){
        this.message = messageInfo.message;
        this.user = messageInfo.user;
    }
}