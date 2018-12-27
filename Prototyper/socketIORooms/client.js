socket = io("http://localhost:3000");

var currentRoom = "";

socket.on("addRoomSuccess", function(roomId){
    $("#right_container").html("<h1>Connected to room</h1>");
    addRoomToList(roomId);
});

socket.on("addRoomFailure", function(){
    $("#right_container").html("<h1>Room id is not valid, try another room id</h1>");
    setTimeout(function(){
        addRoomSheet();
    }, 2500);
});

socket.on("personLeaving", function(message){
    if(message.roomId == currentRoom){
        messages = $("#messages").html();
        messages += `<p>${message.username}: left the chat</p>`
        $("#messages").html(messages);
    }else{

    }
});

socket.on("deletingRoom", function(roomId){
    if(roomId == currentRoom){
        $("#right_container").html("");
    }
    $(`#room${roomId}`).remove();
});

socket.on("roomInfoResponse", function(room){
    console.log("button pressed");
    container = "";
    headline = `<div id="headline"><h1>${room.roomName}</h1></div>`;
    container += headline;
    container += `<div id="messages">`
    for(i = 0; i < room.messages.length; i++){
        container += `<p>${room.messages[i].user}: ${room.messages[i].message}</p>`;
    }
    container += "</div>";
    container += `<div id="buttons"><input type="text" id="userMessage" placeholder="Type new message"><button onclick="sendMessage()">Send</button></div>`
    $("#right_container").html(container);
});

socket.on("newMessage", function(messageInfo){
    console.log("Got new message:");
    console.log(messageInfo);
    console.log(messageInfo.roomId);
    if(messageInfo.roomId == currentRoom){
        messages = $("#messages").html();
        messages += `<p>${messageInfo.user}: ${messageInfo.message}</p>`;
        $("#messages").html(messages);
    }
});

function addRoomToList(roomId){
    list = $("#roomlist").html();
    list += `<li id="room${roomId}">${roomId}<button id="view${roomId}">View room</button><button id="leave${roomId}">Leave</button></li>`;
    $("#roomlist").html(list);
    $(`#view${roomId}`).click(function(){
        viewRoom(roomId)
    });
    $(`#leave${roomId}`).click(function(){
        leaveRoom(roomId)
    });
}

function addRoomSheet(){
    $("#right_container").html("<input type=\"text\" id=\"roomid\" placeholder=\"Room id\"><button onclick=\"addRoom()\">Connect to room</button>");
}

function addRoom(){
    roomId = $("#roomid").val();
    socket.emit("addRoom", roomId);
}

function viewRoom(roomId){
    currentRoom = roomId;
    socket.emit("roomInfoRequest", roomId);
}

function leaveRoom(roomId){
    socket.emit("personLeaving", {"username": $("#username").val(), "roomId": roomId});
}

function sendMessage(){
    message = $("#userMessage").val();
    messageInfo = {
        "message": message,
        "user": $("#username").val(),
        "roomId": currentRoom
    };
    socket.emit("sendMessage", messageInfo);
}