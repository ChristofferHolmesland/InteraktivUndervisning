const crypto = require("crypto");

class User {
    constructor(accessToken, userRights, userName, userId) {
        this.accessToken = accessToken;
        this.userRights = userRights;
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
}

module.exports.User = User;