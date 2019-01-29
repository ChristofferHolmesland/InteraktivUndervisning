const socketio = require('socket.io');
const locales = (require("../../localization/localeLoader.js")).locales;
const User = (require("../user.js")).User;
const anonymousNames = (require("../anonymousName.js")).Animals;
const cookie = require('cookie');

const get = require("../database/databaseFunctions").get;
const insert = require("../database/databaseFunctions").insert;
const update = require("../database/databaseFunctions").update;

module.exports.listen = function(server, users, db) {
    io = socketio.listen(server, {
        cookie: false
    });
    io.on("connection", function(socket) {

        // On new connection, checks if user has a cookie with userId and verifies the user
        let user = User.getUser(users, socket);


        if (user.userRights > 0) require("./anonymousFunctions.js").admin(socket, db);
        if (user.userRights > 1) require("./clientFunctions.js").admin(socket, db);
        if (user.userRights > 2) require("./studentAssistantFunctions.js").admin(socket, db);
        if (user.userRights === 4) require("./adminFunctions.js").admin(socket, db);

        // Function "decorator" which checks user rights before calling the original function
        function rights(level, func, ...args) {
            if(user === undefined || user.userRights < level) {
                socket.emit("unauthorizedAccess");
                return;
            }
            func(...args);
        }

        //--------------------------------------------//
        //------------- Common functions -------------//
        //--------------------------------------------//

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
    });
}
