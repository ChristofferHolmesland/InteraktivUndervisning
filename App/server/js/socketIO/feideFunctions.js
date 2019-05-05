const dbFunctions = require("../database/databaseFunctions").dbFunctions;

module.exports.feide = function(socket, db, user){
	sendUserInfo(db, socket, user)
	
	socket.on("getUserStats", function() {
		/* 
		response should follow this format: 
		{
			totalCorrectAnswers: Integer,
			totalDidntKnowAnswers: Integer,
			totalIncorrectAnswers: Integer,
			totalSessions: Integer
			sessionList: [
				{
					course: String, // Course name
					id: Integer,
					name: String
				}, ...
			] 	// Should be a list of all sessions that the user has participated in.
				// Should be sorted where the last session is first
		}
		*/

		dbFunctions.get.sessionsToUser(
			db, {id: user.feide.idNumber, type: "feide"}
		).then(async function(sessions) {
			result = {};
			if (sessions !== undefined){

				for (let i = 0; i < sessions.length; i++) {
					let courseInfo = await dbFunctions.get.courseInfoById(db, sessions[i].courseId).catch(err => {
						console.error(err)
					});
					sessions[i].course = courseInfo.code + " " + courseInfo.season + " " + courseInfo.year;
				}

				result.sessionList = sessions;
				result.totalSessions = sessions.length;
			} else {
				result.sessionList = [];
				result.totalSessions = 0;
			} 
			
			await dbFunctions.get.amountAnswersForUserByResult(db, {id: user.feide.idNumber, type: "feide"}, 1).then((correct) => {
				if (correct === undefined) result.totalCorrectAnswers = 0;
				else result.totalCorrectAnswers = correct;
			}).catch((err) => {
				console.error(err);
				result.totalCorrectAnswers = "Not available at this time."
			});


			await dbFunctions.get.amountAnswersForUserByResult(db, {id: user.feide.idNumber, type: "feide"}, 0).then((incorrect) => {
				if (incorrect === undefined) result.totalIncorrectAnswers = 0;
				else result.totalIncorrectAnswers = incorrect;
			}).catch((err) => {
				console.error(err);
				result.totalIncorrectAnswers = "Not available at this time."
			});

			await dbFunctions.get.amountAnswersForUserByResult(db, {id: user.feide.idNumber, type: "feide"}, -1).then((didntKnow) => {
				if (didntKnow === undefined) result.totalDidntKnowAnswers = 0;
				else result.totalDidntKnowAnswers = didntKnow;
			}).catch((err) => {
				console.error(err);
				result.totalDidntKnowAnswers = "Not available at this time."
			});

			socket.emit("getUserStatsResponse", result);
		}).catch((err) => {
			console.error(err);
		});
	});

	socket.on("getSessionInformationRequest", async function(sessionId) {
		/* 
			sessionInformation = 
				{
				name: String,
				courseCode: String,
				courseSemester: String,
				userCorrect: Number,
				userIncorrect: Number,
				userDidntKnow: Number,
				sessionAverageCorrect: Number,
				sessionAverageIncorrect: Number,
				sessionAverageDidntKnow: Number,
				questionList: [
					question: {
						text: String,
						description: String,
						type: Number,
						Object: {
							...
						}
						Solution: Object,
						AnswerList: [
							answer: {} // Will only include answers made by the user
						]
					}
				]
			}
		*/
		let sessionInformation = {};

		await dbFunctions.get.sessionById(db, sessionId).then((session) => {
			sessionInformation.name = session.name;
			sessionInformation.courseId = session.courseId;
		});

		await dbFunctions.get.allQuestionInSession(db, sessionId).then(async (questions) => {
			let sessionUserCorrect = 0;
			let sessionUserIncorrect = 0;
			let sessionUserDidntKnow = 0;
			let sessionAverageCorrect = 0;
			let sessionAverageIncorrect = 0;
			let sessionAverageDidntKnow = 0;
			let sessionUserAnswers = 0;
			let sessionOtherUserAnswers = 0;

			let questionList = [];

			for (let i = 0; i < questions.length; i++) {
				let question = questions[i];
				
				let answerList = [];

				await dbFunctions.get.allAnswerToQuestion(db, question.sqId).then(async (answers) => {
					let userId = await dbFunctions.get.userIdByFeideId(db, user.feide.idNumber);

					let otherUserAnswers = 0;
					let userAnswers = 0;
					let questionUserCorrect = 0;
					let questionUserIncorrect = 0;
					let questionUserDidntKnow = 0;
					let questionAverageCorrect = 0;
					let questionAverageIncorrect = 0;
					let questionAverageDidntKnow = 0;

					for (let j = 0; j < answers.length; j++) {
						let answer = answers[j];
						delete answer.id;
						delete answer.sessionHasQuestionId;

						if (answer.userId === userId.id) {
							userAnswers++;
							sessionUserAnswers++;
							
							if (answer.result === 1) {
								questionUserCorrect++;
								sessionUserCorrect++;
							}
							else if (answer.result === 0) {
								questionUserIncorrect++;
								sessionUserIncorrect++;
							}
							else {
								questionUserDidntKnow++;
								sessionUserDidntKnow++;
							}

							delete answer.userId;

							answer.answerObject = answer.object;
							delete answer.object;

							answerList.push(answer);
						}
						else {
							otherUserAnswers++;
							sessionOtherUserAnswers++;
							
							if (answer.result === 1) {
								questionAverageCorrect++;
								sessionAverageCorrect++;
							}
							else if (answer.result === 0) {
								questionAverageIncorrect++;
								sessionAverageIncorrect++;
							}
							else {
								questionAverageDidntKnow++;
								sessionAverageDidntKnow++;
							}
						}
					}

					question.answerList = answerList;

					question.userCorrect = 
						(Number(questionUserCorrect) / Number(userAnswers) * 100).toFixed(2);
					question.userIncorrect = 
						(Number(questionUserIncorrect) / Number(userAnswers) * 100).toFixed(2);
					question.userDidntKnow = 
						(Number(questionUserDidntKnow) / Number(userAnswers) * 100).toFixed(2);
					question.otherUserCorrect = 
						(Number(questionAverageCorrect) / Number(otherUserAnswers) * 100).toFixed(2);
					question.otherUserIncorrect = 
						(Number(questionAverageIncorrect) / Number(otherUserAnswers) * 100).toFixed(2);
					question.otherUserDidntKnow = 
						(Number(questionAverageDidntKnow) / Number(otherUserAnswers) * 100).toFixed(2);
				
					for (let prop in question) {
						if (!question.hasOwnProperty(prop)) continue;
		
						if (question[prop] === "NaN")
							question[prop] = "notAvailable";
					}
				});
				
				delete question.id;
				delete question.sqId;
				delete question.time;

				question.solution = question.solution;

				questionList.push(question);
			}

			sessionInformation.questionList = questionList;

			sessionInformation.userCorrect = 
				(Number(sessionUserCorrect) / Number(sessionUserAnswers) * 100).toFixed(2);
			sessionInformation.userIncorrect = 
				(Number(sessionUserIncorrect) / Number(sessionUserAnswers) * 100).toFixed(2);
			sessionInformation.userDidntKnow = 
				(Number(sessionUserDidntKnow) / Number(sessionUserAnswers) * 100).toFixed(2);
			sessionInformation.otherUserCorrect = 
				(Number(sessionAverageCorrect) / Number(sessionOtherUserAnswers) * 100).toFixed(2);
			sessionInformation.otherUserIncorrect = 
				(Number(sessionAverageIncorrect) / Number(sessionOtherUserAnswers) * 100).toFixed(2);
			sessionInformation.otherUserDidntKnow = 
				(Number(sessionAverageDidntKnow) / Number(sessionOtherUserAnswers) * 100).toFixed(2);
		
			for (let prop in sessionInformation) {
				if (!sessionInformation.hasOwnProperty(prop)) continue;

				if (sessionInformation[prop] === "NaN")
					sessionInformation[prop] = "notAvailable";
			}
		});

		socket.emit("getSessionInformationResponse", sessionInformation);
	});

	socket.on("deleteUserData", async function() {
		let err = await dbFunctions.update.answerUserToAnonymous(db, user.feide.idNumber).catch(err => {
			console.error(err);
			socket.emit("deleteUserDataError", "dbError");
			return;
		});
		if (err){
			console.error(err)
			return;
		}

		err = await dbFunctions.del.userHasSession(db, user.feide.idNumber).catch(err => {
			console.error(err);
			socket.emit("deleteUserDataError", "dbError");
			return;
		});
		if (err){
			console.error(err)
			return;
		}

		err = await dbFunctions.del.userRightsFromFeideId(db, user.feide.idNumber).catch(err => {
			console.error(err);
			socket.emit("deleteUserDataError", "dbError");
			return;
		});
		if (err){
			console.error(err)
			return;
		}

		err = await dbFunctions.del.feide(db, user.feide.idNumber).catch(err => {
			console.error(err);
			socket.emit("deleteUserDataError", "dbError");
			return;
		});
		if (err){
			console.error(err)
			return;
		}

		err = await dbFunctions.del.userByFeideId(db, user.feide.idNumber).catch(err => {
			console.error(err);
			socket.emit("deleteUserDataError", "dbError");
			return;
		});
		if (err){
			console.error(err)
			return;
		}

		socket.emit("deleteUserDataResponse");
	});
	
	socket.on("userLastSessionRequest", async function() {
		let feideId = user.feide.idNumber;
		await dbFunctions.get.userLastSession(db, feideId).then(row => {
			socket.emit("userLastSessionResponse", row)
		}).catch(err => {
			console.error(err);
			socket.emit("userLastSessionError", "dbError")	
		});
	});
}

async function sendUserInfo(db, socket, user) {
	let response = {
		"username": user.userName, 
		"loggedIn": true,
		"userRights": user.userRights,
		"feideId": user.feide.idNumber,
		"adminSubjects" : []
	}

	await dbFunctions.get.adminSubjects(db, user.feide.idNumber).then((adminSubjects) => {
		for (let i = 0; i < adminSubjects.length; i++) {
			let subject = adminSubjects[i];

			response.adminSubjects.push({
				userRights: subject.level,
				code: subject.code,
				season: subject.season,
				year: subject.year
			});
		}
	}).catch((err) => {
		console.error(err);
	});

	socket.emit("clientLoginInfoResponse", response);
}