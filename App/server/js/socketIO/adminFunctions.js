const dbFunctions = require("../database/databaseFunctions").dbFunctions;

const generalFunctions =  require("../generalFunctions.js").functions;
const algorithms = require("../algorithms/algorithms");

const session = require("../session.js").Session;
const question = require("../session.js").Question;
const answer = require("../session.js").Answer;

let courseListRequestHandler = function(socket, db, user, sessions) {
	if (user.feide) feideId = user.feide.idNumber;
	dbFunctions.get.userCourses(db, feideId).then((courses) => {
		let result = [];
		for (let i = 0; i < courses.length; i++) {
			let courseString = courses[i].code + " " + courses[i].semester;
			result.push({
				"value": courseString,
				"text": courseString
			});
		}
		socket.emit("courseListResponse", result);
	}).catch((err) => {
		console.log(err);
	});
}

var currentSession = undefined;

function generateSolution(question) {
	let solutionType = question.solutionType;
	
	if (solutionType === 1 || solutionType === 2) {
		return question;
	}
	else if (solutionType >= 3 && solutionType <= 5) {
		// Determine sorting function
		let sorter = undefined;
		if (solutionType === 4) sorter = algorithms.sorting.mergesort;
		else if (solutionType === 5) sorter = algorithms.sorting.quicksort;
	
		// Check if the array contains numbers and remove whitespace
		let isNumbers = true;
		let elements = question.objects.startingArray.split(",");
		for (let i = 0; i < elements.length; i++) {
			elements[i] = elements[i].trim();
			if (isNaN(Number(elements[i]))) isNumbers = false;
		}
		// This is done in a seperate loop, because an array of strings
		// might contain some elements which are numbers.
		if (isNumbers) {
			for (let i = 0; i < elements.length; i++) {
				elements[i] = Number(elements[i]);
			}
		}
	
		let steppingFunctions = sorter(elements);
		// Store all the steps in the solution
		//question.objects.startingArray = undefined;
		question.solution = steppingFunctions.getSteps();
		// Assign the first step to the objects, so the user can
		// manipulate it.
		question.objects.steps = [steppingFunctions.reset()];
	}
	return question;
}

module.exports.admin = function(socket, db, user, sessions) {

	socket.on("courseListRequest", function() {
		courseListRequestHandler(socket, db, user, sessions);
	});

	socket.on("getSessions", function(course) {
		dbFunctions.get.allSessionWithinCourse(db, course.code, course.semester).then((sessions) => {
			socket.emit("getSessionsResponse", sessions);
		}).catch((err) => {
			console.log(err);
		});
	});

	socket.on("addNewSession", function(session) {
		let c = session.course.split(" ");
		dbFunctions.insert.session(db, session.title, c[1], c[0]).then(function (id) {
			for (let i = 0; i < session.questions.length; i++) {
				dbFunctions.insert.addQuestionToSession(db, id, session.questions[i].id);
			}
			socket.emit("addNewSessionDone");
		});
	});

	socket.on("getQuestionsInCourse", function(course) {
		dbFunctions.get.allQuestionsWithinCourse(db, course.code, course.semester).then((questions) => {
			let result = [];
			for (let i = 0; i < questions.length; i++) {
				result.push({
					value: questions[i].id,
					text: questions[i].text 
				});
			}
			socket.emit("sendQuestionsInCourse", result);
		});
	});

	socket.on("getSession", function(sessionId) {
		dbFunctions.get.sessionById(db, sessionId).then(async function(session) {
			let result = {};
			result.questions = [];

			let numberOfFeideUsers = await dbFunctions.get.feideUsersInSession(db, sessionId);
			numberOfFeideUsers = numberOfFeideUsers.length;
			let maxNumberOfAnonymouslyUsers = 0;
			let totalCorrectAnswers = 0;
			
			let questions = await dbFunctions.get.allQuestionInSession(db, session.id);
			for (let i = 0; i < questions.length; i++) {
				let question = questions[i];
				let answer = await dbFunctions.get.allAnswerToQuestion(db, question.sqId);
				let answers = [];
				let correctAnswers = 0;
				let anonymousUser = 0;

				answer.forEach(a => {
					if (a.userId === "1") anonymousUser++;

					if (a.result == 1) {
						correctAnswers++;
						totalCorrectAnswers++;
					}

					if(a.result === 0){
						answers.push({
							answerObject: JSON.parse(a.object)
						});
					}
				});

				result.questions.push({
					question: {
						text: question.text,
						description: question.description,
						object: JSON.parse(question.object),
						type: question.type
					},
					solution: JSON.parse(question.solution),
					answerList: answers,
					correctAnswer: Math.round(correctAnswers / answer.length * 100)
				});

				if (anonymousUser > maxNumberOfAnonymouslyUsers) maxNumberOfAnonymouslyUsers = anonymousUser;
			}

			result.participants = numberOfFeideUsers + maxNumberOfAnonymouslyUsers;

			result.correctAnswers = Math.round(totalCorrectAnswers / (result.questions.length * result.participants) * 100);
			result.numberOfQuestions = result.questions.length;

			socket.emit("getSessionResponse", result);
		});
	});

	socket.on("initializeSession", function(sessionId){
		if(currentSession != undefined) socket.emit("initializeSessionErrorResponse", "error1")
		dbFunctions.get.sessionById(db, sessionId).then(async (sessionInformation) => {
			let sessionCode = generalFunctions.calculateSessionCode(sessions);
			socket.join(sessionCode);
			
			let questions = await dbFunctions.get.allQuestionInSession(db, sessionInformation.id);
			let questionList = [];
			for(let i = 0; i < questions.length; i++){
				let tempQuestion = questions[i];
				questionList.push(new question(tempQuestion.id, tempQuestion.text, tempQuestion.description, JSON.parse(tempQuestion.object), JSON.parse(tempQuestion.solution), tempQuestion.type, tempQuestion.time, tempQuestion.sqId));
			}

			currentSession = {session: new session(sessionInformation.id, sessionInformation.name,
											sessionInformation.status, [], sessionInformation.courseSemester,
											sessionInformation.courseName, questionList, sessionCode),
								adminSocket: socket}
			
			sessions.set(sessionCode, currentSession);
			
			socket.emit("initializeSessionResponse", sessionCode);
		}).catch((err) => {
			console.log(err);
			socket.emit("initializeSessionErrorResponse", "error2");
		});
	});

	// Course is an object with course code and course semester
	// e.g: {code: "DAT200", semester: "18H"}
	socket.on("sessionOverviewRequest", function(course) {
		dbFunctions.get.allSessionWithinCourseForSessionOverview(db, course.code, course.semester).then((sessionList) => {
			let response = [];
			
			for (let i = 0; i < sessionList.length; i++) {
				response.push({
					value: sessionList[i].id,
					text: sessionList[i].name
				});
			}

			console.log(response);

			socket.emit("sessionOverviewResponse", response);
		}).catch((err) => {
			console.log(err);
			socket.emit("sessionOverviewErrorResponse");
		});
	});
	
	socket.on("startSessionWaitingRoom", function() {
		socket.emit("startSessionWaitingRoomResponse");
	});

	socket.on("startSession", function(sessionCode) {
		let session = currentSession.session;

		session.currentQuestion++;

		let currentUsers = session.currentUsers;

		session.questionList[session.currentQuestion].connectedUsers = currentUsers;

		let firstQuestion = session.questionList[session.currentQuestion];

		firstQuestion.timeStarted = Date.now();
		
		let safeFirstQuestion = {
			"text": firstQuestion.text,
			"description": firstQuestion.description,
			"object": firstQuestion.object,
			"type": firstQuestion.type,
			"time": firstQuestion.time,
			"participants": currentSession.session.currentUsers
		}

		io.to(sessionCode).emit("nextQuestion", safeFirstQuestion);
	});

	socket.on("forceNextQuestion", function() {
		let question = currentSession.session.questionList[currentSession.session.currentQuestion];
		let answerList = [];
		if (question.answerList) answerList = question.answerList;

		let filteredAnswerList = [];
		let correctAnswer = 0;
		let incorrectAnswer = 0;
		let didntKnow = 0;
		
		for (let i = 0; i < answerList.length; i++) {
			let answer = answerList[i];
			if (answer.result === 0) {
				filteredAnswerList.push(answer)
				incorrectAnswer++;
			};
			if (answer.result === -1) didntKnow++; 
			if (answer.result === 1) correctAnswer++;
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

		socket.to(currentSession.session.sessionCode).emit("adminForceNext");
		socket.emit("goToQuestionResultScreen", response);
	});

	socket.on("nextQuestionRequest", function() {
		let session = currentSession.session;
		let currentUsers = session.currentUsers;

		session.currentQuestion++;
		
		if (session.currentQuestion < session.questionList.length){

			let question = session.questionList[session.currentQuestion];
			question.connectedUsers = currentUsers;

			question.timeStarted = Date.now();

			let safeQuestion = {
				"text": question.text,
				"description": question.description,
				"object": question.object,
				"type": question.type,
				"time": question.time,
				"participants": session.currentUsers
			}

			io.to(session.sessionCode).emit("nextQuestion", safeQuestion)
		} else {
			socket.to(session.sessionCode).emit("answerResponse", "sessionFinished");
			socket.emit("endSessionScreen");

			sessions.delete(session.sessionCode);
		}
	});

	socket.on("closeSession", function() {
		socket.emit("closeSessionResponse");
	});

	socket.on("getSessionWithinCourse", function(course) {   
		dbFunctions.get.allSessionWithinCourse(db, course.code, course.semester).then((sessions) => {
			let result = [];
			for (let i = 0; i < sessions.length; i++) {
				result.push({
					value: sessions[i].id,
					text: sessions[i].name
				});
			}
			socket.emit("sendSessionWithinCourse", result);
		});
		
	});

	socket.on("addQuestionToSession", function(data) {
		dbFunctions.insert.addQuestionToSession(db, data.sessionId, data.questionId);
	});

	socket.on("getAllQuestionsWithinCourse", function(course) {
		dbFunctions.get.allQuestionsWithinCourse(db, course).then(questions => {
			let result = [];
			for (let i = 0; i < questions.length; i++) {
				let q = questions[i];
				result.push({
					id: q.id,
					text: q.text,
					description: q.description,
					solutionType: q.type,
					solution: JSON.parse(q.solution),
					time: q.time,
					objects: JSON.parse(q.object)
				});
				if (i === questions.length - 1) console.log(result[result.length - 1]);
			}
			socket.emit("sendAllQuestionsWithinCourse", result);
		});
	});

	socket.on("addNewQuestion", function(question) {
		question = generateSolution(question);

		dbFunctions.insert.question(db, question.text, question.description, question.solution, question.time,
			question.solutionType, question.courseCode, question.objects);
	});

	socket.on("updateQuestion", function(question) {
		question = generateSolution(question);

		dbFunctions.update.question(db, question.id, question.text, question.description, question.objects, question.solution, question.solutionType, question.time);
	});

	socket.on("getQuestionTypes", function() {
		dbFunctions.get.questionTypes(db).then(types => {
			let result = [];
			for (let i = 0; i < types.length; i++) {
				result.push({
					value: types[i].type,
					text: types[i].name
				})
			}
			socket.emit("sendQuestionTypes", result);
		});
	});

	socket.on("createCourse", function(course) {
		dbFunctions.insert.course(db, course.semester, course.code, course.name).then(() => {
			dbFunctions.insert.courseAdmin(db, course.semester, course.code, user.feide.idNumber).then(() => {
				courseListRequestHandler(socket, db, user, sessions);
			});
		});
	});

	socket.on("getUsersByUserRightsLevelsRequest", function(data) {
		let course = data.course.split(" ");
		for (let i = 0; i < data.levels.length; i++) {
			let level = data.levels[i];

			dbFunctions.get.feideUsersByUserRightsLevel(db, level, course[0], course[1]).then((users) => {
				socket.emit("getUsersByUserRightsLevelResponse", {
					level: level,
					users: users
				});
			});
		}
	});

	/*
		data {
			feideId String
			course = "Code + Semester"
			level Int
		}
	*/
	socket.on("setUserRightsLevel", function(data) {
		let course = data.course.split(" ");
		dbFunctions.get.userRightsByFeideId(db, data.feideId, course[0], course[1]).then((user) => {
			if (user == undefined) {
				dbFunctions.insert.userRightsLevelByFeideId(db, data.feideId, course[0], course[1], data.level).then(() => {
					socket.emit("setUserRightsLevelDone");
				});
			} else if (data.level !== -1) {
				dbFunctions.update.userRightsLevelByFeideId(db, data.feideId, course[0], course[1], data.level).then(() => {
					socket.emit("setUserRightsLevelDone");
				});
			} else if (data.level == -1) {
				dbFunctions.del.userRights(db, data.feideId, course[0], course[1]).then(() => {
					socket.emit("setUserRightsLevelDone");
				});
			}
		});
	});
}