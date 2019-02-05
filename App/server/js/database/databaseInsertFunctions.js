function createPromise(db, statement, funcName) {
	return new Promise((resolve, reject) => {
		db.run(statement, function(err){
			if (err) reject(new Error(`Error in insert function: ${funcName} \n\n ${err}`));
			resolve(this.lastID);
		});
	});
}

const insert = {
	feide: function (db, feideId, feideAccess, feideName) {
		let statement = `INSERT INTO Feide(id,accessToken,name)
						VALUES(${feideId},'${feideAccess}','${feideName}');`;
		return createPromise(db, statement, "feide");
	},
	feideUser: function (db, userId, feideId) {
		let statement = `INSERT INTO User(id,feideId)
						VALUES ('${userId}',${feideId})`;
		return createPromise(db, statement, "feideUser");
	},
	anonymousUser: function (db, userId) {
		let statement = `INSERT INTO User(id)
						VALUES ('${userId}')`;
		return createPromise(db, statement, "anonymousUser");
	},
	session: function (db, sessionName, courseSemester, courseCode) {
		let statement = `INSERT INTO Session(name, courseSemester, courseCode, status, participants)
						VALUES ('${sessionName}','${courseSemester}','${courseCode}', 0, 0);`;
		return createPromise(db, statement, "session");
	},
	course: function (db, courseSemester, courseCode, courseName) {
		let statement = `INSERT INTO Course(semester,code,name)
						VALUES ('${courseSemester}','${courseCode}','${courseName}'`;
		return createPromise(db, statement, "course");
	},
	question: function(db, questionText, questionDescription, questionSolution, time, Type, courseCode, questionObject) {
		if (questionObject === undefined) {
			return this._questionNoObject(db, questionText, questionDescription, questionSolution, time, Type, courseCode);
		}

		return this._questionWithObject(db, questionText,questionDescription,questionObject,questionSolution, time, Type, courseCode);
	},
	_questionNoObject: function (db, questionText, questionDescription, questionSolution, time, Type, courseCode) {
		let statement = `INSERT INTO Question(text,description,solution,time,questionType,courseCode)
						VALUES('${questionText}','${questionDescription}','${questionSolution}',${time},${Type},'${courseCode}')`;
		return createPromise(db, statement, "questionNoObject");
	},
	_questionWithObject: function (db, questionText, questionDescription, questionObject, questionSolution, time, Type, courseCode) {
		let statement = `INSERT INTO Question(text,description,object,solution,time,questionType,courseCode)
						VALUES('${questionText}','${questionDescription}','${questionObject}','${questionSolution}',${time},${Type},'${courseCode}')`;
		return createPromise(db, statement, "questionWithObject");
	},
	_storeAnswerWithoutUser: function (db, result, answerObject, sessionHasQuestionId) {
		let statement = `INSERT INTO Answer(object, result, sessionHasQuestionId, userId)
						VALUES('${answerObject}', ${result}, ${sessionHasQuestionId}, 1)`;
		return createPromise(db, statement, "storeAnswerWithoutUser");
	},
	storeAnswer: function (db, answerObject, result, sessionHasQuestionId, userId) {
		if (userId === undefined) {
			return this._storeAnswerWithoutUser(db, result, answerObject, sessionHasQuestionId);
		}
		let statement = `INSERT INTO Answer(object, result, sessionHasQuestionId, userId)
						VALUES('${JSON.stringify(answerObject)}', ${result}, ${sessionHasQuestionId}, '${userId}')`;
		return createPromise(db, statement, "storeAnswer");
	},
	addUserToSession: function (db, userId, sessionId) {
		let statement = `INSERT INTO User_has_Session(userId,sessionId)
						VALUES(${userId},${sessionId})`;
		return createPromise(db, statement, "addUserToSession");
	},
	addQuestionToSession: function (db, sessionId, questionId) {
		let statement = `INSERT INTO Session_has_Question(sessionId,questionId)
						VALUES(${sessionId},${questionId})`;
		return createPromise(db, statement, "addQuestionToSession");
	},
};

module.exports.insert = insert;