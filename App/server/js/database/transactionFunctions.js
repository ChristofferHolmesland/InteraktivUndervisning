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
		
	}
};

module.exports.transaction = transaction;
