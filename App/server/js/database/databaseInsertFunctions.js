function createPromise(db, statement, funcName) {
	return new Promise((resolve, reject) => {
		db.run(statement, function(err){
			if (err) reject(new Error(`Error in insert function: ${funcName} \n\n ${err}`));
			resolve(this.lastID);
		});
	});
}

const insert = {
	feide: function (db, feideId, feideAccess, feideName, sessionToken, admin) {
		let statement = `INSERT INTO Feide(id, accessToken, name, sessionId, admin)
						VALUES(${feideId},'${feideAccess}','${feideName}', '${sessionToken}', ${admin});`;
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
						VALUES ('${courseSemester}','${courseCode}','${courseName}');`;
		return createPromise(db, statement, "course");
	},
	courseAdmin: function(db, courseSemester, courseCode, feideId) {
		let statement = `INSERT INTO UserRight(feideId, courseSemester, courseCode, level)
						VALUES ('${feideId}', '${courseSemester}', '${courseCode}', 4);`;
		return createPromise(db, statement, "courseAdmin");
	},
	question: function(db, questionText, questionDescription, questionSolution, time, Type, courseCode, questionObject) {
		console.log("test");
		console.log(questionSolution);
		console.log("test");
		console.log(JSON.stringify(questionSolution));
		console.log("test");

		if (questionObject === undefined) {
			return this._questionNoObject(db, questionText, questionDescription, questionSolution, time, Type, courseCode);
		}
		
		questionObject = JSON.stringify(questionObject);
		questionObject = questionObject.replace("'", "\'\'");

		return this._questionWithObject(db, questionText,questionDescription,questionObject,questionSolution, time, Type, courseCode);
	},
	_questionNoObject: function (db, questionText, questionDescription, questionSolution, time, Type, courseCode) {
		let statement = `INSERT INTO Question(text,description,solution,time,questionType,courseCode)
						VALUES('${questionText}','${questionDescription}','${JSON.stringify(questionSolution)}',${time},${Type},'${courseCode}')`;
		return createPromise(db, statement, "questionNoObject");
	},
	_questionWithObject: function (db, questionText, questionDescription, questionObject, questionSolution, time, Type, courseCode) {
		let statement = `INSERT INTO Question(text,description,object,solution,time,questionType,courseCode)
						VALUES('${questionText}','${questionDescription}','${questionObject}','${JSON.stringify(questionSolution)}',${time},${Type},'${courseCode}')`;
		return createPromise(db, statement, "questionWithObject");
	},
	storeAnswer: function (db, answer, result, sqId, userId) {
		answer = JSON.stringify(answer);
		answer = answer.replace("'", "\'\'");
		let statement = `INSERT INTO Answer(object, result, sessionHasQuestionId, userId)
						VALUES('${answer}', ${result}, ${sqId}, '${userId}')`;
		return createPromise(db, statement, "storeAnswer");
	},
	addUserToSession: function (db, userId, sessionId) {
		let statement = `INSERT INTO User_has_Session(userId,sessionId)
						VALUES('${userId}', ${sessionId})`;
		return createPromise(db, statement, "addUserToSession");
	},
	addQuestionToSession: function (db, sessionId, questionId) {
		let statement = `INSERT INTO Session_has_Question(sessionId,questionId)
						VALUES(${sessionId},${questionId})`;
		return createPromise(db, statement, "addQuestionToSession");
	},
	userRightsLevelByFeideId: function (db, feideId, courseCode, courseSemester, level) {
		let statement = `INSERT INTO UserRight(feideId, courseSemester, courseCode, level) 
						 VALUES (${feideId}, '${courseSemester}', '${courseCode}', ${level})`;
		return createPromise(db, statement, "userRightsLevelByFeideId");
	},
	questionType: function (db, typeText) {
		let statement = `INSERT INTO Type(name)
						VALUES ('${typeText}')`;
		return createPromise(db, statement, "questionType");	
	}
};

module.exports.insert = insert;