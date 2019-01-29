function createPromise(db, statement) {
	return new Promise((resolve, reject) => {
		db.run(statement, (err) => {
			if (err) reject(new Error(`${err} \n\n ${statement}`));
			resolve(this.lastID);
		});
	});
}

const insert = {
	feide: function (db,feideId,feideAccess,feideName) {
		let statement = `INSERT INTO Feide(id,accessToken,name) VALUES(${feideId},'${feideAccess}','${feideName}');`;
		return createPromise(db, statement);
	},
	feideUser: function (db,userId,feideId) {
		let statement = `INSERT INTO User(id,feideId) VALUES (${userId},${feideId})`;
		return createPromise(db, statement);
	},
	anonymousUser: function (db, userId) {
		let statement = `INSERT INTO User(id) VALUES (${userId})`;
		return createPromise(db, statement);
	},
	quiz: function (db,quizName,courseSemester,courseCode) {
		let statement = `INSERT INTO Quiz(name, courseSemester, courseCode, status, participants) VALUES ('${quizName}','${courseSemester}','${courseCode}', 0, 0);`;
		return createPromise(db, statement);
	},
	course: function (db,courseSemester,courseCode,courseName) {
		let statement = `INSERT INTO Course(semester,code,name) VALUES ('${courseSemester}','${courseCode}','${courseName}'`;
		return createPromise(db, statement);
	},
	question: function(db, questionText,questionDescription,questionSolution,Type,courseCode, questionObject) {
		if (questionObject === undefined) {
			return this._questionNoObject(db, questionText, questionDescription, questionSolution, Type, courseCode);
		}

		return this._questionWithObject(db, questionText,questionDescription,questionObject,questionSolution,Type,courseCode);
	},
	_questionNoObject: function (db,questionText,questionDescription,questionSolution,Type,	courseCode) {
		let statement = `INSERT INTO Question(text,description,solution,questionType,courseCode) VALUES('${questionText}','${questionDescription}','${questionSolution}',${Type},'${courseCode}')`;
		return createPromise(db, statement);
	},
	_questionWithObject: function (db, questionText,questionDescription,questionObject,questionSolution,Type,courseCode) {
		let statement = `INSERT INTO Question(text,description,object,solution,questionType,courseCode) VALUES('${questionText}','${questionDescription}','${questionObject}','${questionSolution}',${Type},'${courseCode}')`;
		return createPromise(db, statement);
	},
	_storeAnswerWithoutUser: function (db,answerObject,quizHasQuestionId) {
		let statement = `INSERT INTO Answer(object,quizHasQuestionId) VALUES(${answerObject},${quizHasQuestionId})`;
		return createPromise(db, statement);
	},
	storeAnswer: function (db, answerObject, quizHasQuestionId, userId) {
		if (userId === undefined) {
			return this._storeAnswerWithoutUser(db, answerObject, questionId);
		}
		let statement = `INSERT INTO Answer(object,quizHasQuestionId,userId) VALUES(${answerObject},${quizHasQuestionId},${userId})`;
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