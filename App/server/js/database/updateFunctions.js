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
	markAnswerAsCorrect: function(db, answerId) {
		let statement = `UPDATE Answer
						SET result = 1
						WHERE id = ${answerId}`;
		return createPromise(db, statement, "MarkAnswerAsCorrect");
	},
	sessionStatus: function(db, sessionId, status) {
		let statement = `UPDATE SESSION
						SET status = ${status}
						WHERE id = ${sessionId};
						`;
		return createPromise(db, statement, "sessionStatus");
	}
};

module.exports.update = update;
