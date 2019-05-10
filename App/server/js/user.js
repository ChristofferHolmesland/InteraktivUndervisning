const crypto = require("crypto");
const cookie = require("cookie");
const dbFunctions = require("./database/databaseFunctions.js").dbFunctions;

class User {
	constructor(userRights, userName, sessionId, feide) {
		this.userName = userName;
		this.userRights = userRights; // 0: Not logged in, 1: Anonymous, 2: logged in with feide, 3: Student Assistant, 4: Admin
		this.sessionId = sessionId;
		if(feide) this.feide = new FeideUser(feide.accessToken, feide.idNumber, feide.userId);
	}

	getUserTypeAndId() {
		if (this.feide) {
			return {
				type: "feide",
				id: this.feide.idNumber
			}
		}

		return undefined;
	}

	static generateSessionId() { // returns string
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
	static async getUser(db, users, socket){
		// If the user have never connected to the website, it will not have any cookies
		if(!socket.handshake.headers.cookie) return undefined;
		let sessionId = cookie.parse(socket.handshake.headers.cookie).sessionId;
		let user = users.get(socket.id);

		// Checks if userId cookie exists
		if(sessionId){
			user = users.get(sessionId);
			// Checks if user is set to be an active logged in user
			if(user){
				return user;
			}else{
				await dbFunctions.get.userInformationBySessionToken(db, sessionId).then(async (row) => {
					if (row === undefined) {
						user = undefined;
						return;
					}
					user = new User(row.admin, row.name, row.sessionId, {
						accessToken: row.accessToken, 
						idNumber: row.id,
						userId: row.userId
					});
					await dbFunctions.get.userRightByFeideId(db, user.feide.idNumber).then((rows) => {
						if (rows.length > 0){
							for (let i = 0; i < rows.length; i++) {
								if (rows[i].level > user.userRights) user.userRights = rows[i].level;
								if (user.userRights === 4) break;
							}
						}
						users.set(sessionId, user);
					}).catch((err) => {
						user = undefined;
						console.error(err);
						return;
					});
				}).catch((err) => {
					console.error(err);
					user = undefined;
				})
				return user;
			}
		}else if(user){ // Checks if socket is logged in as an active user
			return user;
		}
		else return undefined;
	}
}

class FeideUser {
	constructor(accessToken, idNumber, userId){
		this.accessToken = accessToken;
		this.idNumber = idNumber;
		this.userId = userId;
	}
}

module.exports.User = User;