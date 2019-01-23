const insert = module.exports = {
	feide: function (db,feideId,feideAccess,feideName) {
		let statement = `INSERT INTO Feide(feideId,feideAccessToken,feideName) VALUES(${feideId},'${feideAccess}','${feideName}');`;
		db.run(statement, function (err) {
			if (err) {
				console.error(err.message);
			}
		})
	},
	feideUser: function (db,userId,feideId) {
		let statement = `INSERT INTO User(userId,feideId) VALUES (${userId},${feideId})`;
		db.run(statement, function (err) {
			if (err) {
				console.log(err.message);
			}
		})
	},
	anonymousUser: function (db,userId) {
		let statement = `INSERT INTO User(userId) VALUES (${userId})`;
		db.run(statement, function (err) {
			if (err) {
				console.log(err.message);
			}
		})
	},
	quiz: function (db,quizName,courseSemester,courseCode) {
		let statement = `INSERT INTO Quiz(quizName,courseSemester,courseCode) VALUES ('${quizName}','${courseSemester}','${courseCode}');`;
		db.run(statement, function (err) {
			if (err) {
				console.log(err.message);
			}
		});
	},
	course: function (db,courseSemester,courseCode,coursename) {
		let statement = `INSERT INTO Course(courseSemester,courseCode,courseName) VALUES ('${courseSemester}','${courseCode}','${coursename}'`;
		db.run(statement, function (err) {
			if (err) {
				console.log(err.message);
			}
		})
	},
	questionNoObject: function (db,questionText,questionDescription,questionSolution,Type,courseCode) {
	let statement = `INSERT INTO Question(questionText,questionDescription,questionSolution,questiontype,courseCode) VALUES('${questionText}','${questionDescription}',${questionSolution},${Type},${courseCode})`;
	db.run(statement, function (err) {
		if (err) {
			console.log(err.message);
		}
	})
	},
	questionWithObject: function (db, questionText,questionDescription,questionObject,questionSolution,Type,courseCode) {
	let statement = `INSERT INTO Question(questionText,questionDescription,questionObject,questionSolution,questiontype,courseCode) VALUES('${questionText}',${questionDescription},${questionObject},${questionSolution},${Type},${courseCode})`;
	db.run(statement, function (err) {
		if (err) {
			console.log(err.message);
		}
	})
	},
	storeAnswerWithoutUser: function (db,answerObject,questionId) {
		let statement = `INSERT INTO Answer(answerObject,questionId) VALUES(${answerObject},${questionId})`;
		db.run(statement, function (err) {
			if (err) {
				console.log(err.message);
			}
		})
	},
	storeAnswerWithUser: function (db, answerObject, questionId,userId) {
	let statement = `INSERT INTO Answer(answerObject,questionId,userId) VALUES(${answerObject},${questionId},${userId})`;
	db.run(statement, function (err) {
		if (err) {
			console.log(err.message);
		}
	})
	},
	addUserToQuiz: function (db,userId,quizId) {
	let statement = `INSERT INTO User_has_Quiz(userId,quizId) VALUES(${userId},${quizId})`;
	db.run(statement, function (err) {
		if (err) {
			console.log(err.message);
		}
	})
	},
	addQuestionToQuiz: function (db,quizId,questionId) {
		let statement = `INSERT INTO Quiz_has_Question(quizId,questionId) VALUES(${quizId},${questionId})`;
		db.run(statement, function (err) {
			if (err) {
				console.log(err.message);
			}
		})
	},
};