const socketio = require('socket.io');
const locales = (require("../../localization/localeLoader.js")).locales;
const User = (require("../user.js")).User;
const anonymousNames = (require("../anonymousName.js")).Animals;
const dbFunctions = require("../database/databaseFunctions").dbFunctions;
var sessions = new Map();
var currentClientSession = "";

module.exports.listen = function(server, users, db) {
	io = socketio.listen(server, {
		cookie: false
	});

	
	setTimeout(function() {
		io.emit("serverRestarted");
	}, 5000);

	io.on("connection", async function(socket) {

		// On new connection, checks if user has a cookie with userId and verifies the user
		let user = await User.getUser(db, users, socket);
		
		if(user != undefined){
			if (user.userRights > 0) require("./clientFunctions.js").client(socket, db, user, sessions, currentClientSession);
			if (user.userRights === 1) require("./anonymousFunctions.js").anonymous(socket, db);
			if (user.userRights > 1) require("./feideFunctions.js").feide(socket, db, user);
			if (user.userRights > 2) require("./studentAssistantFunctions.js").studentAssistant(socket, db, user, sessions);
			if (user.userRights === 4) require("./adminFunctions.js").admin(socket, db, user, users);
		}

		//--------------------------------------------//
		//------------- Common functions -------------//
		//--------------------------------------------//

		socket.on('disconnect', function(){
			if (user !== undefined && user.userRights > 2) {
				sessions.forEach(tempSession => {
					let adminId = tempSession.adminId;
					if (user.feide.idNumber === adminId) {
						tempSession.closeTimeout = setTimeout((function(sessionCode, adminSocket) {
							let session = sessions.get(sessionCode);
							if (session === undefined) return;
							if (session.adminSocket.id === adminSocket) {
								io.sockets.in(sessionCode).emit("answerResponse", "sessionFinished");
								sessions.delete(sessionCode);
							}
						}).bind(this, tempSession.session.sessionCode, tempSession.adminSocket.id), 1000*60*5); // 5 min timeout
					}
				});
			}

			if (currentClientSession !== "") {
				if (!sessions.get(currentClientSession)) return;
				let session = sessions.get(currentClientSession).session;
				let question = session.questionList[session.currentQuestion];
				let adminSocket = sessions.get(currentClientSession).adminSocket;

				if (user.feide !== undefined) {
					session.userLeaving(user.feide.idNumber);
				} else {
					session.userLeaving(socket.id);
				}
				
				adminSocket.emit("updateParticipantCount", session.currentUsers);

				if (session.currentQuestion > -1) {
					let numAnswers = question.answerList.length;
					let participants = question.connectedUsers;
			
					adminSocket.emit("updateNumberOfAnswers", numAnswers, participants);

					if(numAnswers === participants) {
						let answerList = [];
						if (question.answerList) answerList = question.answerList;
				
						let filteredAnswerList = [];
						let correctAnswer = 0;
						let incorrectAnswer = 0;
						let didntKnow = 0;
						
						for (let i = 0; i < answerList.length; i++) {
							let answer = answerList[i];
							let filteredAnswer = {};
							if (answer.result === 0) {
								filteredAnswer.answerObject = answer.answerObject;
								filteredAnswerList.push(filteredAnswer)
								incorrectAnswer++;
							};
							if (answer.result === -1) didntKnow++; 
							if (answer.result === 0) correctAnswer++;
						}
				
						let response = {
							question: {
								text: question.text,
								description: question.description,
								object: question.object,
								type: question.type
							},
							solution: question.solution,
							answerList: filteredAnswerList,
							correctAnswer: correctAnswer,
							incorrectAnswer: incorrectAnswer,
							didntKnow: didntKnow,
							users: answerList.length
						};
			
						adminSocket.emit("goToQuestionResultScreen", response);
					}
				}
			}

			if (user) users.delete(user.sessionId);
		});

		socket.on("signOutRequest", function(){
			// If the user disconnects from the server, but the client
			// doesn't disconnect, then the user will have an invalid 
			// user object.
			if (user !== undefined) {
				if(user.feide != undefined){
					socket.emit("deleteCookie", user.sessionId);
				}

				users.delete(user.sessionId);
			}

			socket.emit("signOutResponse");
		});

		socket.on("getLocaleRequest", function(locale) {
			socket.emit("getLocaleResponse", {"locale": locales[locale], "localeList": locales.localeList});
		});

		socket.on("getQuestionTypeRequest", async function (solutionType) {
			let types = await dbFunctions.get.questionTypes(db,solutionType).catch(() => {
				//socket.emit("copyQuestionToCourseError", "dbError");
			});
			socket.emit("questionTypesResponse",types)
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
			tempUser = new User(1, "Anonymous " + anonymousNames.getRandomAnimal(), tempKey, undefined);
			users.set(tempKey, tempUser);
			socket.emit("loginAnonymouslyResponse");
	
			user = users.get(socket.id);
			socket.emit("clientLoginInfoResponse", {
				"username": user.userName,
				"loggedIn": true,
				"userRights": user.userRights
			});
			
			require("./anonymousFunctions.js").anonymous(socket, db, sessions);
			require("./clientFunctions.js").client(socket, db, user, sessions);
		});
	});
}
