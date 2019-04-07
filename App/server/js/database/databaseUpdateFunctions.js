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
	}
};

module.exports.update = update;
