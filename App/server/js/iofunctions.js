const socketio = require('socket.io');
const locales = (require("../localization/localeLoader.js")).locales;
const User = (require("./user.js")).User;
const anonymousNames = (require("./anonymousName.js")).Animals;
const cookie = require('cookie');

module.exports.listen = function(server, users) {
    io = socketio.listen(server);
    io.on("connection", function(socket) {

        // On new connection, checks if user has a cookie with userId and verifies the user
        let user = User.getUser(users, socket);
        if(user){
            let response = {
                "username": user.userName, 
                "loggedIn": true,
                "admin": false
            }
            if(user.userRights == 3) response.admin = true;
            socket.emit("loginResponse", response)
        }

        //--------------------------------------------//
        //------------- Common functions -------------//
        //--------------------------------------------//

        socket.on('disconnect', function(){

        });

        socket.on("signOutRequest", function(){
            if(cookie.parse(socket.handshake.headers.cookie).userId){
                let userCookie = cookie.parse(socket.handshake.headers.cookie).userId;
                users.delete(userCookie);
                socket.emit("deleteCookie", userCookie);
            }else{
                users.delete(socket.id);
            }
            socket.emit("signOutResponse");
        });

        socket.on("getLocaleRequest", function(locale) {
            socket.emit("getLocaleResponse", {"locale": locales[locale], "localeList": locales.localeList});
        });

        //--------------------------------------------//
        //------------- Guest functions --------------//
        //--------------------------------------------//

        socket.on("loginAnonymouslyRequest", function(){
            tempUser = new User("", 1, "Anonymous " + anonymousNames.getRandomAnimal(), "");
            tempKey = socket.id;
            users.set(tempKey, tempUser);
            socket.emit("loginAnonymouslyResponse");

            user = users.get(socket.id);
            socket.emit("loginResponse", {
                "username": user.userName,
                "loggedIn": true,
                "admin": false
            });
        });
        
        //--------------------------------------------//
        //------------- Client functions -------------//
        //--------------------------------------------//

        socket.on("clientStarted", function() {
            if(user && user.userRights > 0) return;

            socket.emit("unauthorizedAccess");
        });

        //--------------------------------------------//
        //------------- Admin functions -------------//
        //--------------------------------------------//

        socket.on("adminStarted", function() {
            if(user && user.userRights == 3) return;

            socket.emit("unauthorizedAccess");
        });
            
    });

    return io;
}
