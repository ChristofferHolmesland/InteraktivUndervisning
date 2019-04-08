function createPromise(db, statement, funcName) {
	return new Promise((resolve, reject) => {
		db.run(statement, function(err){
			if (err) reject(new Error(`Error in insert function: ${funcName} \n\n ${err}`));
			resolve(this.lastID);
		});
	});
}

const insert = {
	feide: function(db, feideId, feideAccess, feideName, sessionToken, admin) {
		let statement = `INSERT INTO Feide(id, accessToken, name, sessionId, admin)
						VALUES('${feideId}','${feideAccess}','${feideName}', '${sessionToken}', ${admin});`;
		return createPromise(db, statement, "feide");
	},
	feideUser: function(db, userId, feideId) {
		let statement = `INSERT INTO User(id,feideId)
						VALUES ('${userId}','${feideId}')`;
		return createPromise(db, statement, "feideUser");
	},
	anonymousUser: function(db, userId) {
		let statement = `INSERT INTO User(id)
						VALUES ('${userId}')`;
		return createPromise(db, statement, "anonymousUser");
	},
	session: function(db, sessionName, courseId) {
		let statement = `INSERT INTO Session(name, courseId , status, participants)
						VALUES ('${sessionName}', ${courseId}, 0, 0);`;
		return createPromise(db, statement, "session");
	},
	course: function(db, course) {
		let statement = `INSERT INTO Course(name, codeId, semesterId)
						VALUES ('${course.name}', ${course.code}, ${course.semester});`;
		return createPromise(db, statement, "course");
	},
	courseAdmin: function(db, data) {
		let statement = `INSERT INTO UserRight(feideId, courseId, level)
						VALUES ('${data.feideId}', ${data.courseId}, 4);`;
		return createPromise(db, statement, "courseAdmin");
	},
	question: function(db, questionText, questionDescription, questionSolution, time, type, courseId, questionObject) {
		if (questionObject === undefined) {
			return this._questionNoObject(db, questionText, questionDescription, questionSolution, time, type, courseId);
		}
		
		questionObject = JSON.stringify(questionObject);
		questionObject = questionObject.replace("'", "\'\'");

		return this._questionWithObject(db, questionText,questionDescription,questionObject,questionSolution, time, type, courseId);
	},
	_questionNoObject: function(db, questionText, questionDescription, questionSolution, time, type, courseId) {
		let statement = `INSERT INTO Question(text,description,solution,time,questionType,courseId)
						VALUES('${questionText}','${questionDescription}','${JSON.stringify(questionSolution)}',${time},${type},'${courseId}')`;
		return createPromise(db, statement, "questionNoObject");
	},
	_questionWithObject: function(db, questionText, questionDescription, questionObject, questionSolution, time, type, courseId) {
		if(typeof(questionObject) === "object")	questionObject = JSON.stringify(questionObject);
		let statement = `INSERT INTO Question(text, description, object, solution, time, questionType, courseId)
						VALUES('${questionText}', '${questionDescription}', '${questionObject}', '${JSON.stringify(questionSolution)}', ${time}, ${type}, ${courseId})`;
		return createPromise(db, statement, "questionWithObject");
	},
	storeAnswer: function(db, answer, result, sqId, userId) {
		answer = JSON.stringify(answer);
		answer = answer.replace("'", "\'\'");
		let statement = `INSERT INTO Answer(object, result, sessionHasQuestionId, userId)
						VALUES('${answer}', ${result}, ${sqId}, '${userId}')`;
		return createPromise(db, statement, "storeAnswer");
	},
	addUserToSession: function(db, userId, sessionId) {
		let statement = `INSERT INTO UserHasSession(userId,sessionId)
						VALUES('${userId}', ${sessionId})`;
		return createPromise(db, statement, "addUserToSession");
	},
	addQuestionToSession: function(db, sessionId, questionId) {
		let statement = `INSERT INTO SessionHasQuestion(sessionId, questionId)
						VALUES(${sessionId}, ${questionId})`;
		return createPromise(db, statement, "addQuestionToSession");
	},
	userRightsLevelByFeideId: function(db, data) {
		let statement = `INSERT INTO UserRight(feideId, courseId, level) 
						 VALUES ('${data.feideId}', ${courseId}, ${level})`;
		return createPromise(db, statement, "userRightsLevelByFeideId");
	},
	questionType: function(db, typeText) {
		let statement = `INSERT INTO Type(name)
						VALUES ('${typeText}')`;
		return createPromise(db, statement, "questionType");	
	},
	season: function(db, season) {
		let statement = `INSERT INTO Season(season)
						VALUES('${season}')`;
		return createPromise(db, statement, "season");
	},
	year: function(db, year) {
		let statement = `INSERT INTO Year(year)
						VALUES(${year})`;
		return createPromise(db, statement, "year");
	},
	courseCode: function(db, courseCode) {
		let statement = `INSERT INTO CourseCode(code)
						VALUES('${courseCode}')`;
		return createPromise(db, statement, "courseCode");
	},
	courseSemester: function(db, semester) {
		let statement = `INSERT INTO CourseSemester(seasonId, yearId)
						VALUES(${semester.season}, ${semester.year})`;
		return createPromise(db, statement, "semester");
	}
};

module.exports.insert = insert;