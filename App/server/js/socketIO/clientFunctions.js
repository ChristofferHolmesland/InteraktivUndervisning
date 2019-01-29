module.exports.admin = function(socket, db) {
    socket.on("clientStarted", () => rights(1, function() {}))

    socket.on("clientLoginInfoRequest", function() {
        if(user){
            socket.emit("clientLoginInfoResponse", {
                "username": user.userName, 
                "loggedIn": true,
                "userRights": user.userRights,
                "feideId": user.feide.idNumber
            });
        }
    });
}