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
		let statement = "BEGIN TRANSACTION;\n";
		for (let i = 0; i < answerList.length; i++) {
			let answer = answerList[i];
			answer.answerObject = JSON.stringify(answer.answerObject);
			answer.answerObject = answer.answerObject.replace("'", "\'\'");
			statement += `INSERT INTO Answer(object, result, sessionHasQuestionId, userId)\n`
			statement += `Values('${answer.answerObject}', ${answer.result}, ${sqId}, '${answer.userId}');\n`;
		}
		statement += "COMMIT TRANSACTION;";
		return createPromise(db, statement, "storeAnswers");
	},
	insertQuestionHasSessions: function(db, sessionInformation) {
		let statement = "BEGIN TRANSACTION;\n";
		let sessionId = sessionInformation.sessionId;
		for(let i = 0; i < sessionInformation.questionList.length; i++) {
			let questionId = sessionInformation.questionList[i];
			statement += `INSERT INTO SessionHasQuestion(sessionId, questionId)\n`;
			statement += `VALUES(${sessionId}, ${questionId});\n`;
			statement += `UPDATE Question\n`;
			statement += `SET status = ${1}\n`;
			statement += `WHERE id = ${questionId};\n`;
		}
		statement += "COMMIT TRANSACTION;";
		console.log(statement);
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
	}
};

module.exports.transaction = transaction;