function createPromise(db, statement, funcName) {
	return new Promise((resolve, reject) => {
		db.run(statement, (err) => {
			if (err) reject(new Error(`Error in update function: ${funcName} \n\n ${err}`));
			resolve();
		});
	});
}

const update = {
	question: function(db, id, questionText, questionDescription, questionObject, questionSolution, questionType, time) {
		let statement = `UPDATE Question 
						 SET text = '${questionText}', 
    					 description = '${questionDescription}', 
    					 object = '${JSON.stringify(questionObject)}', 
    					 solution = '${JSON.stringify(questionSolution)}',
    					 time = ${time}, 
    					 questionType = ${questionType} 
						 WHERE id = ${id};`;
		return createPromise(db, statement, "question");
	},
	session: function(db, sessionId, sessionInfo) {
		let statement = "UPDATE Session SET\n";
		if(sessionInfo.name != undefined) statement += `name = '${sessionInfo.name}',`;
		if(sessionInfo.status != undefined) statement += `status = ${sessionInfo.status},`;
		if(sessionInfo.participants != undefined) statement += `participants = ${sessionInfo.participants}\n`
		statement += `WHERE id = ${sessionId}`;

		return createPromise(db, statement, "session");
	},
	userRightsLevelByFeideId: function(db, data) {
		let statement = `UPDATE UserRight
						 SET level = ${data.level}
						 WHERE feideId = '${data.feideId}'
						 AND courseId = ${data.courseId}`;
		return createPromise(db, statement, "userRightsLevelByFeideId");
	},
	feideSessionId: function(db, id, sessionId) {
		let statement = `UPDATE Feide
						SET sessionId = '${sessionId}'
						WHERE id = '${id}'`;
		return createPromise(db, statement, "feideSessionId");
	},
	questionStatusToActive: function(db, questionId) {
		let statement = `UPDATE Question
						SET status = 1
						WHERE id = ${questionId}`;
		return createPromise(db, statement, "questionStatusToActive")
	},
	answerUserToAnonymous: function(db, feideId) {
		let statement = `UPDATE Answer
						SET userId = 1
						WHERE userId IN (
							SELECT A.userId
							From Answer AS A
							INNER JOIN User AS U ON U.id = A.userId
							WHERE U.feideId = ${feideId}
						);`;
		return createPromise(db, statement, "answerUserToAnonymous")
	},
	markAnswerAsCorrect: function(db, answerId) {
		let statement = `UPDATE Answer
						SET result = 1
						WHERE id = ${answerId}`;
		return createPromise(db, statement, "MarkAnswerAsCorrect");
	}
};

module.exports.update = update;
