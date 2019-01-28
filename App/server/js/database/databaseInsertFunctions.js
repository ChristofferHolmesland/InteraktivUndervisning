function createPromise(db, statement) {
	return new Promise((resolve, reject) => {
		db.run(statement, (err) => {
			if (err) reject(err);
			resolve();
		});
	});
}

const insert = {
	feide: function (db,feideId,feideAccess,feideName) {
		let statement = `INSERT INTO Feide(feideId,feideAccessToken,feideName) VALUES(${feideId},'${feideAccess}','${feideName}');`;
		return createPromise(db, statement);
	},
	feideUser: function (db,userId,feideId) {
		let statement = `INSERT INTO User(userId,feideId) VALUES (${userId},${feideId})`;
		return createPromise(db, statement);
	},
	anonymousUser: function (db, userId) {
		let statement = `INSERT INTO User(userId) VALUES (${userId})`;
		return createPromise(db, statement);
	},
	quiz: function (db,quizName,courseSemester,courseCode) {
		let statement = `INSERT INTO Quiz(quizName,courseSemester,courseCode) VALUES ('${quizName}','${courseSemester}','${courseCode}');`;
		return createPromise(db, statement);
	},
	course: function (db,courseSemester,courseCode,coursename) {
		let statement = `INSERT INTO Course(courseSemester,courseCode,courseName) VALUES ('${courseSemester}','${courseCode}','${coursename}'`;
		return createPromise(db, statement);
	},
	questionNoObject: function (db,questionText,questionDescription,questionSolution,Type,	courseCode) {
		let statement = `INSERT INTO Question(questionText,questionDescription,questionSolution,questiontype,courseCode) VALUES('${questionText}','${questionDescription}',${questionSolution},${Type},${courseCode})`;
		return createPromise(db, statement);
	},
	questionWithObject: function (db, questionText,questionDescription,questionObject,questionSolution,Type,courseCode) {
		let statement = `INSERT INTO Question(questionText,questionDescription,questionObject,questionSolution,questiontype,courseCode) VALUES('${questionText}',${questionDescription},${questionObject},${questionSolution},${Type},${courseCode})`;
		return createPromise(db, statement);
	},
	storeAnswerWithoutUser: function (db,answerObject,questionId) {
		let statement = `INSERT INTO Answer(answerObject,questionId) VALUES(${answerObject},${questionId})`;
		return createPromise(db, statement);
	},
	storeAnswerWithUser: function (db, answerObject, questionId,userId) {
		let statement = `INSERT INTO Answer(answerObject,questionId,userId) VALUES(${answerObject},${questionId},${userId})`;
		return createPromise(db, statement);
	},
	addUserToQuiz: function (db,userId,quizId) {
		let statement = `INSERT INTO User_has_Quiz(userId,quizId) VALUES(${userId},${quizId})`;
		return createPromise(db, statement);
	},
	addQuestionToQuiz: function (db,quizId,questionId) {
		let statement = `INSERT INTO Quiz_has_Question(quizId,questionId) VALUES(${quizId},${questionId})`;
		return createPromise(db, statement);
	},
};

module.exports.insert = insert;