const dbFunctions = require("../database/databaseFunctions").dbFunctions;
const fs = require("fs");
const mkdirp = require('mkdirp');
const path = require("path");
const del = require("del");

const generalFunctions =  require("../generalFunctions.js").functions;
const session = require("../session.js").Session;
const question = require("../session.js").Question;
const validateChecker = require("../ValidateChecker/validateChecker.js").validateChecker;
const generateSolution = require("../SolutionGenerator/SolutionGenerator.js");

let courseListRequestHandler = function(socket, db, user) {
	if (!user.feide) return;
	let feideId = user.feide.idNumber;

	dbFunctions.get.userCourses(db, feideId).then((courses) => {
		let result = [];

		for (let i = 0; i < courses.length; i++) {
			result.push({
				value: courses[i].courseId,
				text: courses[i].code + " " + courses[i].season + " " + courses[i].year,
				courseId: courses[i].courseId,
				code: courses[i].code,
				year: courses[i].year,
				season: courses[i].season,
				semesterId: courses[i].semesterId,
				courseCodeId: courses[i].courseCodeId
			});
		}
		
		socket.emit("courseListResponse", result);
	}).catch((err) => {
		console.error(err);
	});
}

var currentSession = undefined;

module.exports.admin = function(socket, db, user, sessions) {

	socket.on("courseListRequest", function() {
		courseListRequestHandler(socket, db, user);
	});

	socket.on("getSessions", function(courseId) {
		if (courseId === undefined || courseId === "") {
			socket.emit("courseMissing");
			return;
		}
		dbFunctions.get.allSessionWithinCourse(db, courseId).then((sessions) => {
			socket.emit("getSessionsResponse", sessions);
		}).catch((err) => {
			console.error(err);
		});
	});

	socket.on("addNewSession", function(session) {
		let courseId = session.course;
		dbFunctions.insert.session(db, session.title, courseId).then(async function (id) {
			for (let i = 0; i < session.questions.length; i++) {
				await dbFunctions.insert.addQuestionToSession(db, id, session.questions[i].id).catch(err => console.error(err));
				await dbFunctions.update.questionStatusToActive(db, session.questions[i].id).catch(err => console.error(err));
			}
			socket.emit("addNewSessionDone");
		}).catch(err => console.error(err));
	});

	socket.on("getQuestionsInCourse", function(courseId) {
		if (courseId === undefined || courseId === "") {
			socket.emit("courseMissing");
			return;
		}

		dbFunctions.get.allQuestionsWithinCourse(db, courseId).then((questions) => {
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
							answerObject: a.object
						});
					}
				});

				result.questions.push({
					question: {
						text: question.text,
						description: question.description,
						object: question.object,
						type: question.type
					},
					solution: question.solution,
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
		if (currentSession != undefined) socket.emit("initializeSessionErrorResponse", "You are already running a session with the code: " + currentSession.session.id);
		dbFunctions.get.sessionById(db, sessionId).then(async (sessionInformation) => {
			let sessionCode = generalFunctions.calculateSessionCode(sessions);
			socket.join(sessionCode);
			
			let questions = await dbFunctions.get.allQuestionInSession(db, sessionInformation.id);
			let questionList = [];
			for(let i = 0; i < questions.length; i++){
				let tempQuestion = questions[i];
				tempQuestion.resultScreen = false;
				questionList.push(new question(tempQuestion.id, tempQuestion.text, tempQuestion.description, tempQuestion.object, tempQuestion.solution, tempQuestion.type, tempQuestion.time, tempQuestion.sqId));
			}

			currentSession = {
				session: new session(sessionInformation.id, sessionInformation.name,
					sessionInformation.status, [], sessionInformation.courseSemester,
					sessionInformation.courseName, questionList, sessionCode),
				adminSocket: socket,
				adminId: user.feide.idNumber
			}
			
			sessions.set(sessionCode, currentSession);
			
			socket.emit("initializeSessionResponse", sessionCode);
		}).catch((err) => {
			console.error(err);
			socket.emit("initializeSessionErrorResponse", "Something went wrong, please try again later!");
		});
	});

	// Course is an object with course code and course semester
	// e.g: {code: "DAT200", semester: "18H"}
	socket.on("sessionOverviewRequest", function(courseId) {
		if (courseId === undefined || courseId === "") return;
		dbFunctions.get.allSessionWithinCourseForSessionOverview(db, courseId).then((sessionList) => {
			let response = [];
			
			for (let i = 0; i < sessionList.length; i++) {
				response.push({
					value: sessionList[i].id,
					text: sessionList[i].name
				});
			}

			socket.emit("sessionOverviewResponse", response);
		}).catch((err) => {
			console.error(err);
			socket.emit("sessionOverviewErrorResponse");
		});
	});
	
	socket.on("startSessionWaitingRoom", function(sessionCode) {
		if (sessions.get(sessionCode) === undefined) {
			socket.emit("startSessionError");
		}
		else {
			if (currentSession === undefined || currentSession.adminId === user.feide.idNumber){
				currentSession = sessions.get(sessionCode);
				currentSession.adminSocket = socket;
				socket.join(sessionCode);
			}
			if (currentSession.session.currentQuestion > -1) {
				let session = currentSession.session;
				let currentUsers = session.currentUsers;
		
				if (session.currentQuestion < session.questionList.length){
					let question = session.questionList[session.currentQuestion];
					question.connectedUsers = currentUsers;
					
					let timeLeft = question.time;
					if (question.time > 0)
						timeLeft = question.time - ((Date.now() - question.timeStarted) / 1000);

					let safeQuestion = {
						"text": question.text,
						"description": question.description,
						"object": question.object,
						"type": question.type,
						"time": timeLeft,
						"participants": session.currentUsers
					}

					socket.emit("nextQuestion", safeQuestion)

					if (session.currentQuestion > -1) {
						let numAnswers = question.answerList.length;
						let participants = question.connectedUsers;
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

							socket.emit("goToQuestionResultScreen", response);
						}
						else {
							socket.emit("updateNumberOfAnswers", numAnswers, participants);
						}
					}
				} else {
					socket.to(session.sessionCode).emit("answerResponse", "sessionFinished");
					socket.emit("endSessionScreen");

					sessions.delete(session.sessionCode);
				}
			}
			else {
				socket.emit("startSessionWaitingRoomResponse");
				socket.emit("updateParticipantCount", currentSession.session.currentUsers);
			}
		}
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
		};

		io.to(sessionCode).emit("nextQuestion", safeFirstQuestion);
	});

	socket.on("forceNextQuestion", function() {
		let session = currentSession.session;
		let question = session.questionList[session.currentQuestion];
		question.resultScreen = true;
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

	socket.on("getSessionWithinCourse", function(courseId) {
		if (courseId === undefined || courseId === "") {
			socket.emit("courseMissing");
			return;
		}
		dbFunctions.get.allSessionWithinCourse(db, courseId).then((sessions) => {
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
		dbFunctions.update.questionStatusToActive(db, data.questionId);
	});

	socket.on("getAllQuestionsWithinCourse", function(courseId) {
		if (courseId === undefined || courseId === "" || courseId === null) {
			socket.emit("courseMissing");
			return;
		}
		
		dbFunctions.get.allQuestionsWithinCourse(db, courseId).then(questions => {
			let result = [];
			for (let i = 0; i < questions.length; i++) {
				let q = questions[i];
				result.push({
					id: q.id,
					text: q.text
				});
			}
			socket.emit("sendAllQuestionsWithinCourse", result);
		});
	});

	socket.on("questionInfoByIdRequest", async function(questionId) {
		await dbFunctions.get.questionsByQuestionId(db, [{id: questionId}]).then((rows) => {
			socket.emit("questionInfoByIdResponse", rows[0]);
		}).catch((err) => {
			console.error(err);
			socket.emit("questionInfoByIdError", "dbError");
		})
	});

	socket.on("addNewQuestion", async function(question) {
		let valid = validateChecker.checkQuestion(question);
		socket.emit("confirmQuestionRequirements", valid);
		if (!valid.passed) return;

		question = generateSolution(question);

		let objects = JSON.parse(JSON.stringify(question.objects));
		for (let i = 0; i < objects.files.length; i++) {
			delete objects.files[i].buffer;
		}
		
		let questionIndex = await dbFunctions.insert.question(db, question.text, question.description, question.solution, question.time, question.solutionType, question.courseCode, objects);
		if (question.objects.files.length > 0) {
			let files = [];
			for (let i = 0; i < question.objects.files.length; i++) {
				files.push(JSON.parse(JSON.stringify(question.objects.files[i])));
			}
			let filePath = path.join("../../images/questionImages/", questionIndex.toString(), "/");
			let filePaths = [];
	
			try {
				mkdirp.sync(path.join(__dirname, filePath));
				for (let i = 0; i < files.length; i++) {
					let type = files[i].type.split("/")[1];
					filePaths.push(filePath + (i + 1).toString() + "." + type);
					question.objects.files[i].filePath = filePaths[i];
					delete question.objects.files[i].buffer;
					
					await fs.open(path.join(__dirname, filePaths[i]), "a", function(error, fd) {
						if (error) {
							console.error("Error writing image: \n\n" + err);
							return;
						}
						fs.writeSync(fd, files[i].buffer, null, "base64");
						fs.closeSync(fd);
					});
				}
				
				await dbFunctions.update.question(db, questionIndex, question.text, question.description, question.objects, question.solution, question.solutionType, question.time);		
			} 
			catch (error) {
				console.error("Error making dirs!\n\n" + error);
			}
		}

		socket.emit("questionChangeComplete");
	});

	socket.on("updateQuestion", async function(question) {
		let valid = validateChecker.checkQuestion(question);
		socket.emit("confirmQuestionRequirements", valid);
		if (!valid.passed) return;

		question = generateSolution(question);

		let filePath = path.join("../../images/questionImages/", question.id.toString(), "/");
		let completeFilePath = path.join(__dirname, filePath, "**");
		try {
			del.sync(completeFilePath);
		} catch (error) {
			console.error(error);
		}

		if (question.objects.files.length > 0) {
			let files = [];
			for (let i = 0; i < question.objects.files.length; i++) {
				files.push(JSON.parse(JSON.stringify(question.objects.files[i])));
			}
			let filePaths = [];
	
			try {
				mkdirp.sync(path.join(__dirname, filePath));
				for (let i = 0; i < files.length; i++) {
					let type = files[i].type.split("/")[1];
					filePaths.push(filePath + (i + 1).toString() + "." + type);
					question.objects.files[i].filePath = filePaths[i];
					delete question.objects.files[i].buffer;
					
					await fs.open(path.join(__dirname, filePaths[i]), "a", function(error, fd) {
						if (error) {
							console.error("error writing image: \n\n" + error);
							return;
						}
						fs.writeSync(fd, files[i].buffer, null, "base64");
						fs.closeSync(fd);
					});
				}
			} 
			catch (error) {
				console.error("Error making dirs!\n\n" + error);
				return;
			}
		}

		await dbFunctions.update.question(db, question.id, question.text, question.description, question.objects, question.solution, question.solutionType, question.time);
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

	socket.on("createCourseRequest", async function(newCourse) {
		// Checks name
		if (newCourse.name === "" || newCourse.name === undefined) {
			socket.emit("createCourseError", "nameMissing");
			return;
		}

		// Checks course code
		let courseCodes = await dbFunctions.get.courseCodes(db).catch((err) => {
			console.error(err);
			socket.emit("createCourseError", "dbError");
			return;
		});
		let courseCodeIndex = courseCodes.findIndex(courseCode => courseCode.id === newCourse.code);
		if (courseCodeIndex === -1) {
			socket.emit("createCourseError", "courseCodeDoesnTExist");
			return;
		}

		// Checks semester
		let semesters = await dbFunctions.get.semesters(db).catch((err) => {
			console.error(err);
			socket.emit("createCourseError", "dbError");
			return;
		});
		let semesterIndex = semesters.findIndex(semester => semester.id === newCourse.semester);
		if (semesterIndex === -1) {
			socket.emit("createCourseError", "semesterDoesnTExist");
			return;
		}

		// Checks if course already exists
		let courses = await dbFunctions.get.allCoursesWithIds(db).catch((err) => {
			console.error(err);
			socket.emit("createCourseError", "dbError");
			return;
		});
		let courseIndex = courses.findIndex(course => (
			(course.courseCodeId === newCourse.code) &&
			(course.courseSemesterId === newCourse.semester)
		));
		if (courseIndex > -1) {
			socket.emit("createCourseError", "courseExists");
			return;
		}

		// Inserts course and makes user admin
		await dbFunctions.insert.course(db, newCourse).then(async (courseId) => {
			await dbFunctions.insert.courseAdmin(db, {
				feideId: user.feide.idNumber,
				courseId: courseId
			}).then(() => {
				socket.emit("createCourseResponse");
			}).catch((err) => {
				console.error(err);
				socket.emit("createCourseError", "dbError");
				return;
			})
		}).catch((err) => {
			console.error(err);
			socket.emit("createCourseError", "dbError");
			return;
		})
	});

	socket.on("getUsersByUserRightsLevelsRequest", function(data) {
		if (
			data.levels === undefined ||
			data.courseId === undefined ||
			data.courseId === ""	
		) return;

		for (let i = 0; i < data.levels.length; i++) {
			let level = data.levels[i];

			dbFunctions.get.feideUsersByUserRightsLevel(db, {level: level, courseId: data.courseId}).then((users) => {
				socket.emit("getUsersByUserRightsLevelResponse", {
					level: level,
					users: users
				});
			}).catch((err) => {
				console.error(err);
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
		dbFunctions.get.userRightsByFeideId(db, {
			feideId: data.feideId,
			courseId: data.courseId
		}).then((user) => {
			if (user == undefined) {
				dbFunctions.insert.userRightsLevelByFeideId(db, {
					feideId: data.feideId,
					courseId: data.courseId,
					level: data.level
				}).then(() => {
					socket.emit("setUserRightsLevelDone");
				});
			} else if (data.level !== -1) {
				dbFunctions.update.userRightsLevelByFeideId(db, {
					feideId: data.feideId,
					courseId: data.courseId,
					level: data.level
				}).then(() => {
					socket.emit("setUserRightsLevelDone");
				});
			} else if (data.level == -1) {
				if (data.feideId == user.feide.idNumber) return;
				dbFunctions.del.userRights(db, {
					feideId: data.feideId,
					courseId: data.courseId
				}).then(() => {
					socket.emit("setUserRightsLevelDone");
				});
			}
		});
	});

	socket.on("adminLeaveSession", function(sessionCode) {
		
		// TODO add logic for session to be ended when admin leaves session before it is finished
	});

	socket.on("semestersRequest", async function() {
		await dbFunctions.get.semesters(db).then(rows => {
			socket.emit("semestersResponse", rows);
		}).catch(err => {
			if (err) socket.emit("semestersError");
		});
	});

	socket.on("seasonsRequest", async function() {
		await dbFunctions.get.seasons(db).then(rows => {
			socket.emit("seasonsResponse", rows);
		}).catch(err => {
			if (err) socket.emit("seasonsError");
		});
	});

	socket.on("yearsRequest", async function() {
		await dbFunctions.get.years(db).then(rows => {
			socket.emit("yearsResponse", rows);
		}).catch(err => {
			if (err) socket.emit("yearsError");
		});
	});

	socket.on("courseCodesRequest", async function() {
		await dbFunctions.get.courseCodes(db).then(rows => {
			socket.emit("courseCodesResponse", rows);
		}).catch(err => {
			if (err) socket.emit("courseCodesError");
		})
	});

	socket.on("addNewCourseCodeRequest", async function(newCourseCode) {
		let pattern = new RegExp("^[A-Z]{3}[0-9]{3}$");
		if (newCourseCode === "" || newCourseCode === undefined) {
			socket.emit("addNewCourseCodeError", "courseCodeMissing");
			return;
		}
		if (!pattern.test(newCourseCode)) {
			socket.emit("addNewCourseCodeError", "courseCodeWrongPattern");
			return
		}
		
		await dbFunctions.get.courseCodes(db).then(async rows => {
			if (rows.findIndex(row => row.code === newCourseCode) === -1) {
				await dbFunctions.insert.courseCode(db, newCourseCode).then(() => {
					socket.emit("addNewCourseCodeResponse");
				}).catch(() => {
					socket.emit("addNewCourseCodeError", "insertCourseCodeError");
				});
			} else {
				socket.emit("addNewCourseCodeError", "courseCodeExists");
			}
		}).catch(err => {
			if (err) socket.emit("addNewCourseCodeError", "dbError");
		})
	});

	socket.on("addNewSemesterRequest", async function(newSemester) {
		if (
			!Number(newSemester.season) ||
			!Number(newSemester.year)
		) {
			socket.emit("addNewSemesterError");
			return;
		}

		await dbFunctions.get.semesters(db).then(async (semesters) => {
			let seasons = await dbFunctions.get.seasons(db).catch((err) => {
				console.error(err);
				socket.emit("addNewSemesterError", "dbError");
				return;
			});
			if (seasons.findIndex(season => season.id === newSemester.season) === -1) {
				socket.emit("addNewSemesterError", "seasonDoesTExist");
				return;
			}

			let years = await dbFunctions.get.years(db).catch((err) => {
				console.error(err);
				socket.emit("addNewSemesterError", "dbError");
				return;
			});
			if (years.findIndex(year => year.id === newSemester.year) === -1) {
				socket.emit("addNewSemesterError", "yearDoesTExist");
				return;
			}
			
			if (semesters.findIndex(semester => 
				(
					newSemester.season === semester.season &&
					newSemester.year === semester.year
				)
			) > -1) {
				socket.emit("addNewSemesterError", "semesterExists");
				return;
			}

			await dbFunctions.insert.courseSemester(db, newSemester).then(() => {
				socket.emit("addNewSemesterResponse");
			}).catch((err) => {
				console.error(err);
				socket.emit("addNewSemesterError", "addNewSemesterInsert");
			});
		}).catch((err) => {
			console.error(err);
			socket.emit("addNewSemesterError", "dbError");
			return;
		});
	});

	socket.on("copyQuestionToCourseRequest", async function(data) {
		if (data === undefined || Object.keys(data).length === 0) {
			socket.emit("copyQuestionToCourseError", "missingData");
			return;
		}

		let selectedCourses = data.selectedCourses;
		if (selectedCourses === undefined || selectedCourses.length === 0){
			socket.emit("copyQuestionToCourseError", "noCoursesSelected");
			return;
		}

		let selectedQuestionsList = data.selectedQuestionsList;
		if (selectedQuestionsList === undefined || selectedQuestionsList.length === 0){
			socket.emit("copyQuestionToCourseError", "noQuestionsSelected");
			return;
		}

		let courses = await dbFunctions.get.coursesByCourseId(db, selectedCourses).catch(() => {
			socket.emit("copyQuestionToCourseError", "dbError");
		});

		let questions = await dbFunctions.get.questionsByQuestionId(db, selectedQuestionsList).catch(() => {
			socket.emit("copyQuestionToCourseError", "dbError");
		});

		for (let i = 0; i < courses.length; i++) {
			let courseId = courses[i].id;

			for (let j = 0; j < questions.length; j++) {
				let question = JSON.parse(JSON.stringify(questions[j]));

				let objects = JSON.parse(JSON.stringify(question.object));
				for (let i = 0; i < objects.files.length; i++) {
					delete objects.files[i].buffer;
				}
				
				await dbFunctions.insert.question(db, question.text, question.description, question.solution, question.time, question.type, courseId, objects).then(async (questionIndex) => {
					if (question.object.files.length > 0) {
						let files = [];
						for (let i = 0; i < question.object.files.length; i++) {
							files.push(JSON.parse(JSON.stringify(question.object.files[i])));
						}
						let filePath = path.join("../../images/questionImages/", questionIndex.toString(), "/");
						let filePaths = [];
				
						try {
							mkdirp.sync(path.join(__dirname, filePath));
							for (let i = 0; i < files.length; i++) {
								let type = files[i].type.split("/")[1];
								filePaths.push(filePath + (i + 1).toString() + "." + type);
								question.object.files[i].filePath = filePaths[i];
								delete question.object.files[i].buffer;
								
								await fs.open(path.join(__dirname, filePaths[i]), "w", function(err, fd) {
									if (err) {
										console.error("Error writing image: \n\n" + err);
										return;
									}
									fs.writeSync(fd, files[i].buffer, null, "base64");
								});
							}
							
							await dbFunctions.update.question(db, questionIndex, question.text, question.description, question.object, question.solution, question.type, question.time);		
						} 
						catch (err) {
							console.error(err)
							console.error("Error making dirs!\n\n" + err);
							socket.emit("copyQuestionToCourseError", "dbError");
						}
					}
				}).catch((err) => {
					console.error(err);
					socket.emit("copyQuestionToCourseError", "dbError");
				});
			}
		}

		socket.emit("copyQuestionToCourseResponse");
	});

	socket.on("deleteQuestionsRequest", async function(questionList) {
		if (
			questionList === undefined ||
			!Array.isArray(questionList) ||
			questionList.length === 0
		) {
			socket.emit("deleteQuestionToCourseError", "dataError")
			return; 
		}

		let questions = await dbFunctions.get.questionsByQuestionId(db, questionList);
		for(let i = 0; i < questions.length; i++) {
			let question = questions[i];
			if (question.status === 0) {
				await dbFunctions.del.questionById(db, question.id).catch(err => console.error(err));
				
				let filePath = path.join("../../images/questionImages/", question.id.toString(), "/");
				let completeFilePath = path.join(__dirname, filePath, "**");
				try {
					del.sync(completeFilePath);
				} catch (error) {
					console.error(error);
				}
			}
		}
		socket.emit("deleteQuestionToCourseResponse");
	});
}