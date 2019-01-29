module.exports.admin = function(socket, db) {
    socket.on("loginAnonymouslyRequest", function(){
        tempKey = socket.id;
        // TODO change userrights to 1 on the line under
        tempUser = new User(4, "Anonymous " + anonymousNames.getRandomAnimal(), tempKey, undefined);
        users.set(tempKey, tempUser);
        socket.emit("loginAnonymouslyResponse");

        user = users.get(socket.id);
        socket.emit("clientLoginInfoResponse", {
            "username": user.userName,
            "loggedIn": true,
            "userRights": user.userRights
        });
    });
}