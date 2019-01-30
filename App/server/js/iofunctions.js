const socketio = require('socket.io');
const locales = (require("../localization/localeLoader.js")).locales;
const User = (require("./user.js")).User;
const anonymousNames = (require("./anonymousName.js")).Animals;
const cookie = require('cookie');

module.exports.listen = function(server, users) {
	io = socketio.listen(server, {
		cookie: false
	});
	io.on("connection", function(socket) {

		// On new connection, checks if user has a cookie with userId and verifies the user
		let user = User.getUser(users, socket);

		//--------------------------------------------//
		//------------- Common functions -------------//
		//--------------------------------------------//

		socket.on('disconnect', function(){
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

		//--------------------------------------------//
		//------------- Guest functions --------------//
		//--------------------------------------------//

		socket.on("loginAnonymouslyRequest", function(){
			tempKey = socket.id;
			tempUser = new User(1, "Anonymous " + anonymousNames.getRandomAnimal(), tempKey, undefined);
			users.set(tempKey, tempUser);
			socket.emit("loginAnonymouslyResponse");

			user = users.get(socket.id);
			socket.emit("clientLoginInfoResponse", {
				"username": user.userName,
				"loggedIn": true,
				"userRights": user.userRights
			});
		});
		
		//--------------------------------------------//
		//------------- Client functions -------------//
		//--------------------------------------------//

		socket.on("clientStarted", function() {
			if(user && user.userRights > 0) return;

			socket.emit("unauthorizedAccess");
		});

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

		socket.on("checkSignedInFeide", function() {
			if(user && user.userRights > 1) return;

			socket.emit("unauthorizedAccess");
		});

		socket.on("startQuiz", function () {
			let question = {"Text":"I like Cake!","Description":"This is a message from lord Nergal! I await you at the dread islands",type:1,time:61};
			socket.emit("startQuizResponse",question);
		});

		socket.on("quickJoinRoom", function (roomnr) {
			console.log("quickJoinRoom is called!");
			let rooms= [1,2,3,4,5,6,7,8,9,10,3334];
			if (rooms.indexOf(parseInt(roomnr)) !== -1 && roomnr !== "") {
				let quizCode = `${roomnr}`;
				socket.join(quizCode);
				io.in(quizCode).clients((err , clients) => {	//used to see all socket ids in the room, taken from https://stackoverflow.com/questions/18093638/socket-io-rooms-get-list-of-clients-in-specific-room/25028953
					console.log(clients);
				});
				console.log("Joined "+ quizCode);
				console.log(socket.adapter.rooms);
				//console.log(socket.rooms);
				socket.emit("joinRoom",quizCode);	//use io to emit messages to rooms!!!
			}else {
				console.log("inActive");
				socket.emit("QuizInActive",roomnr);
			}
		});

		socket.on("leaveRoom",function (roomId) {
			console.log("Leaving " +roomId);
			let quizCode = `${roomId}`;
			socket.leave(quizCode);
			socket.emit("returnToJoinRoom");
		});

		socket.on("questionAnswered", function (answer) {
			let a = {questionId:1,userId:1,answerObject:answer};
			console.log("Answered");
			//socket.emit("sendAnswer");
			socket.emit("AnswerResponse", a)
		});

		socket.on("questionNotAnswered", function () {
			console.log("Not answered");
			let a = {questionId: 1,userid:1,result:-1};
			socket.emit("AnsweredResponse", a)
		});

		socket.on("getUserStats", function() {
			if(!user || user.userRights < 2) return;
			/* response should follow this format:
			**	response 
			**	{
			**		totalCorrectAnswers: float,
			**		totalQuizzes: Integer,
			**		totalIncorrectAnswers: float,
			**		quizList: [
			**			{
			**				quizName = String,
			**				courseCode = String
			**			}, ...
			**		] 	// Should be a list of all quizzes that the user has participated in.
			**			// Should be sorted where the last quiz is first
			**	}
			*/
			let response = {};
			
			// Todo: write code to check database for stats

			// Todo: remove dummy data
			response = {
				totalQuizzes: 3,
				totalCorrectAnswers: 20,
				totalIncorrectAnswers: 10,
				quizList: [
					{
						quizName: "Grafer",
						courseCode: "DAT200"
					},
					{
						quizName: "stakk",
						courseCode: "DAT200"
					}
				]
			}
			
			socket.emit("getUserStatsResponse", response);
		});

		socket.on("deleteUserData", function() {
			socket.emit("deleteCookie", user.sessionId);
			users.delete(user.sessionId);
			socket.emit("signOutResponse");
		});

		//--------------------------------------------//
		//------------- Student Assistant -------------//
		//--------------------------------------------//

		socket.on("studAssStarted", function() {
			if(user && user.userRights == 3) return;
			
			socket.emit("unauthorizedAccess");
		});

		//--------------------------------------------//
		//------------- Admin functions -------------//
		//--------------------------------------------//

		socket.on("adminStarted", function() {
			if(user && user.userRights == 4) return;

			socket.emit("unauthorizedAccess");
		});

	});

	return io;
}
