const socketio = require('socket.io');
const locales = (require("../../localization/localeLoader.js")).locales;
const User = (require("../user.js")).User;
const anonymousNames = (require("../anonymousName.js")).Animals;

var sessions = new Map();

module.exports.listen = function(server, users, db) {
    io = socketio.listen(server, {
        cookie: false
    });

    io.on("connection", function(socket) {

        // On new connection, checks if user has a cookie with userId and verifies the user
        let user = User.getUser(users, socket);
        
        if(user != undefined){
            if (user.userRights > 0) require("./clientFunctions.js").client(socket, db, user, sessions);
            if (user.userRights === 1) require("./anonymousFunctions.js").anonymous(socket, db);
            if (user.userRights > 1) require("./feideFunctions.js").feide(socket, db, user);
            if (user.userRights > 2) require("./studentAssistantFunctions.js").studentAssistant(socket, db, user, sessions);
            if (user.userRights === 4) require("./adminFunctions.js").admin(socket, db, user, sessions);
        }

        //--------------------------------------------//
        //------------- Common functions -------------//
        //--------------------------------------------//

        socket.on("test", function() {
            console.log("no");
        });

        socket.on('disconnect', function(){
			// TODO handle socket disconnect
        });

        socket.on("signOutRequest", function(){
            if(user.feide != undefined){
                socket.emit("deleteCookie", user.sessionId);
            }

            users.delete(user.sessionId);
            socket.emit("signOutResponse");
        });

        socket.on("getLocaleRequest", function(locale) {
            socket.emit("getLocaleResponse", {"locale": locales[locale], "localeList": locales.localeList});
        });

        socket.on("verifyUserLevel", function(userLevel) {
            if (user === undefined || user.userRights < userLevel) socket.emit("unauthorizedAccess");
        })

        //-------------------------------------------//
        //------------- Login functions -------------//
        //-------------------------------------------//

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
            
            require("./anonymousFunctions.js").anonymous(socket, db, sessions);
            require("./clientFunctions.js").client(socket, db, user, sessions)
            require("./feideFunctions.js").feide(socket, db);//TODO remove
            require("./studentAssistantFunctions.js").studentAssistant(socket, db);//TODO remove
            require("./adminFunctions.js").admin(socket, db, user, sessions);//TODO remove
        });
    });
}
