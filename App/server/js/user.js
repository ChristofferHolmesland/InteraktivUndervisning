const crypto = require("crypto");
const cookie = require("cookie");

class User {
    constructor(accessToken, userRights, userName, userId) {
        this.accessToken = accessToken;
        this.userRights = userRights; // 0: not logged in, 1: guest, 2: logged in with feide, 3: admin
        this.userName = userName;
        this.userId = userId;
    }

    static generateUserId() { // returns string
        return crypto.randomBytes(64).toString("hex");
    }

    // safe is the id that would be stored on the server
    // user is the id that is given to the server from the user
    static compareUserId(safe, user){ // returns true or false
        safe = crypto.createHmac('sha512', safe).digest("hex");
        user = crypto.createHmac('sha512', user).digest("hex");

        return crypto.timingSafeEqual(Buffer.from(safe), Buffer.from(user));
    }

    // Checks in an map over active users if this user is logged in
    static getUser(users, socket){
        // If the user have never connected to the website, it will not have any cookies
        if(!socket.handshake.headers.cookie) return undefined;
        
        let userId = cookie.parse(socket.handshake.headers.cookie).userId;
        let user = users.get(socket.id);

        // Checks if userId cookie exists
        if(userId){
            user = users.get(userId);
            // Checks if user is set to be an active logged in user
            if(user){
                return user;
            }else{
                // TODO: Try and reverify the user and either accept and add to active users or redirect to 401
                return undefined;
            }
        }else if(user){ // Checks if socket is logged in as an active user
            return user;
        }
        return undefined;
    }
}

module.exports.User = User;