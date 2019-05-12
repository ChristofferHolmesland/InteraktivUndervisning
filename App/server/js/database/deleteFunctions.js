function createPromise(db, statement, funcName) {
	return new Promise((resolve, reject) => {
		db.run(statement, (err) => {
			if (err) reject(new Error(`Error in delete function: ${funcName} \n\n ${err}`));
			resolve();
		});
	});
}

const del = {
	userRights: function(db, data) {
		let statement = `DELETE FROM UserRight
						WHERE feideId = ${data.feideId}
						AND courseId = ${data.courseId}`;
		return createPromise(db, statement, "userRights");
	},
	questionById: function(db, questionId) {
		let statement = `DELETE FROM Question
						WHERE id = ${questionId}`;
		return createPromise(db, statement, "questionById");
	},
	sHQById: function(db, sessionId) {
		let statement = `DELETE FROM SessionHasQuestion
						WHERE sessionId = ${sessionId};`;
		return createPromise(db, statement, "sHQById");
	},
	sessionById: function(db, sessionId) {
		let statement = `DELETE FROM Session
						WHERE id = ${sessionId};`;
		return createPromise(db, statement, "sessionById");
	},
	applicationById: function(db, applicationId) {
		let statement = `DELETE FROM AdminRequest
						WHERE id = ${applicationId};`;
		return createPromise(db, statement, "sessionById");
	}
};

module.exports.del = del;
