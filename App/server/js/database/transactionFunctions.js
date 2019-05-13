function createPromise(db, statement, funcName) {
	return new Promise((resolve, reject) => {
		db.exec(statement, (err) => {
			if (err) reject(new Error(`Error in transaction function: ${funcName} \n\n ${err}`));
			resolve();
		});
	});
}

const transaction = {
	storeAnswers: function(db, answerList, sqId) {
		let statement = `BEGIN TRANSACTION;\n`;
		for (let i = 0; i < answerList.length; i++) {
			let answer = answerList[i];
			answer.answerObject = JSON.stringify(answer.answerObject);
			answer.answerObject = answer.answerObject.replace("'", "\'\'");
			statement += `INSERT INTO Answer(object, result, sessionHasQuestionId, userId)\n` +
				`Values('${answer.answerObject}', ${answer.result}, ${sqId}, '${answer.userId}');\n`;
		}
		statement += `COMMIT TRANSACTION;`;
		return createPromise(db, statement, "storeAnswers");
	},
	insertQuestionHasSessions: function(db, sessionInformation) {
		let statement = `BEGIN TRANSACTION;\n`;
		let sessionId = sessionInformation.sessionId;
		for(let i = 0; i < sessionInformation.questionList.length; i++) {
			let questionId = sessionInformation.questionList[i];
			statement += `INSERT INTO SessionHasQuestion(sessionId, questionId)\n`;
			statement += `VALUES(${sessionId}, ${questionId});\n`;
			statement += `UPDATE Question\n`;
			statement += `SET status = ${1}\n`;
			statement += `WHERE id = ${questionId};\n`;
		}
		statement += `COMMIT TRANSACTION;`;
		return createPromise(db, statement, "inserQuestionHasSession");
	},
	editQuestionHasSession: function(db, sessionInformation) {
		let sessionId = sessionInformation.sessionId;
		let sessionName = sessionInformation.sessionName;
		let questionList = sessionInformation.questionList;

		let statement = `BEGIN TRANSACTION;\n`;
		statement += `UPDATE Session\n` +
			`SET name = '${sessionName}'\n` +
			`WHERE id = ${sessionId};\n` +
			`DELETE FROM SessionHasQuestion\n` +
			`WHERE sessionId = ${sessionId};\n`;
		for(let i = 0; i < questionList.length; i++) {
			let questionId = questionList[i];
			statement += `INSERT INTO SessionHasQuestion(sessionId, questionId)\n` +
				`VALUES(${sessionId}, ${questionId});\n` +
				`UPDATE Question\n` +
				`SET status = ${1}\n` +
				`WHERE id = ${questionId};\n`;
		}
		statement += `COMMIT TRANSACTION;`;
		return createPromise(db, statement, "inserQuestionHasSession");
	},
	deleteUserData: function(db, feideId) {
		let statement = `BEGIN TRANSACTION;\n` +
			`DELETE FROM AdminRequest\n` +
			`WHERE feideId = ${feideId};\n` +
			`UPDATE Answer\n` +
			`SET userId = 1\n` +
			`WHERE userId IN (\n` +
			`	SELECT A.userId\n` +
			`	FROM Answer AS A\n` +
			`	INNER JOIN User AS U ON U.id = A.userId\n` +
			`	WHERE U.feideId = ${feideId}\n` +
			`);\n` +
			`DELETE FROM UserHasSession\n` +
			`WHERE userId in (\n` +
			`	SELECT UHS.userId\n` +
			`	FROM UserHasSession AS UHS\n` +
			`	INNER JOIN User AS U ON U.id = UHS.userId\n` +
			`	WHERE U.feideId = ${feideId}\n` +
			`);\n` +
			`DELETE FROM UserRight\n` +
			`WHERE feideId = ${feideId};\n` +
			`DELETE FROM Feide\n` +
			`WHERE id = ${feideId};\n` +
			`DELETE FROM User\n` +
			`WHERE feideId = ${feideId};\n` +
			`COMMIT TRANSACTION;`;

		return createPromise(db, statement, "deleteUserData");
	},
	newFeideUser: function(db, feideInformation) {
		let statement = `BEGIN TRANSACTION;\n` +
			`INSERT INTO Feide(id, accessToken, name, sessionId, admin)\n` +
			`VALUES('${feideInformation.id}','${feideInformation.access}','${feideInformation.name}', '${feideInformation.sessionToken}', ${feideInformation.admin});\n` +
			`INSERT INTO User(id,feideId)\n` +
			`VALUES ('${feideInformation.userId}','${feideInformation.id}');\n` +
			`COMMIT TRANSACTION;`;
		return createPromise(db, statement, "newFeideUser");
	},
	deleteSession: function(db, sessionId) {
		let statement = `BEGIN TRANSACTION;\n` + 
			`DELETE FROM SessionHasQuestion\n` +
			`WHERE sessionId = ${sessionId};\n` +
			`DELETE FROM Session\n` +
			`WHERE id = ${sessionId};\n` +
			`COMMIT TRANSACTION;`;
		return createPromise(db, statement, "deleteSession");
	},
	approveApplicants: function(db, applicationData) {
		let statement = `BEGIN TRANSACTION;\n` +
			`INSERT INTO UserRight(feideId, courseId, level)\n` +
			`VALUES ('${applicationData.feideId}', ${applicationData.courseId}, ${applicationData.level});\n` +
			`DELETE FROM AdminRequest\n` +
			`WHERE id = ${applicationData.applicationId};\n` +
			`COMMIT TRANSACTION;`
		return createPromise(db, statement, "approveApplicants");
	}
};

module.exports.transaction = transaction;
