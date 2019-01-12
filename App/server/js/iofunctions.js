var socketio = require('socket.io');
const locales = (require("../localization/localeLoader.js")).locales;
var User = (require("./user.js")).User;
var cookie = require('cookie')

module.exports.listen = function(server, users) {
    io = socketio.listen(server);
    io.on("connection", function(socket) {

        if(cookie.parse(socket.handshake.headers.cookie).userId && users.get(cookie.parse(socket.handshake.headers.cookie).userId)){
            let user = users.get(cookie.parse(socket.handshake.headers.cookie).userId);

            socket.emit("loginResponse", {
                "username": user.userName, 
                "loggedIn": true,
                "admin": false
            })
        }

        // Common functions

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

        socket.on("getTextRequest", function(locale) {
            socket.emit("getTextResponse", {"locale": locales[locale], "localeList": locales.localeList});
        });

        socket.on("loginRequest", function(data){
            if(data.loginType){
                socket.emit("loginResponse", {actionLink: "/login/feide"});
            }else{
                socket.emit("loginResponse", {actionLink: "/login/anonymous"})
            }
        });

        // guest functions

        socket.on("loginAnonymouslyRequest", function(){
            tempUser = new User("", 1, "Anonym hund", "");
            tempKey = socket.id;
            users.set(tempKey, tempUser);
            socket.emit("loginAnonymouslyResponse");

            let user = users.get(socket.id);
            socket.emit("loginResponse", {
                "username": user.userName,
                "loggedIn": true,
                "admin": false
            });
        });
        
        // client functions

        socket.on("clientStarted", function() {
            console.log(users);

            if(
                (cookie.parse(socket.handshake.headers.cookie).userId && 
                users.get(cookie.parse(socket.handshake.headers.cookie).userId) &&
                users.get(cookie.parse(socket.handshake.headers.cookie).userId).userRights > 0) ||
                users.get(socket.id)
            ){
                return;
            }

            socket.emit("unauthorizedAccess");
        });

        // Admin functions

        socket.on("adminStarted", function() {
            if(cookie.parse(socket.handshake.headers.cookie).userId && users.get(cookie.parse(socket.handshake.headers.cookie).userId)){
                if(users.get(cookie.parse(socket.handshake.headers.cookie).userId).userRights > 2){
                    return;
                }
            }

            socket.emit("unauthorizedAccess");
        });
            
    });

    return io;
}
