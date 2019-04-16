socket = io("http://localhost:3000");

socket.on("createRoomSuccess", function(roomId){
    $("#right_container").html("<h1>Room added</h1>");
    addRoomToList(roomId);
});

socket.on("createRoomFailure", function(){
    $("#right_container").html("<h1>Room id is not valid, try another room id</h1>");
    setTimeout(function(){
        addCreateSheet();
    }, 2500);
});

socket.on("roomInfoResponse", function(info){
});

function addRoomToList(roomId){
    list = $("#roomlist").html();
    list += `<li id="room-${roomId}">${roomId}<button id="view-${roomId}" class="viewbtn">View room</button><button id="delete-${roomId}" class="deletebtn">Delete</button></li>`;
    $("#roomlist").html(list);
    $(".viewbtn").click(function(){
        id = this.id.split("-");
        viewRoom(id[1]);
    });
    $(".deletebtn").click(function(){
        id = this.id.split("-");
        deleteRoom(id[1]);
    });
}

function addCreateSheet(){
    $("#right_container").html("<input type=\"text\" id=\"roomid\" placeholder=\"Room id\"><button onclick=\"createRoom()\">Create new room</button>");
}

function createRoom(){
    roomId = $("#roomid").val();
    socket.emit("createRoom", roomId);
}

function deleteRoom(roomId){
    $(`#room-${roomId}`).remove();
    socket.emit("deleteRoom", roomId);
}

function viewRoom(roomId){
    socket.emit("roomInfoRequest", roomId);
}