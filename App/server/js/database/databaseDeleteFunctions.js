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
	userHasSession: function(db, feideId) {
		let statement = `DELETE
						FROM UserHasSession
						WHERE userID in (
							SELECT UHS.userId
							FROM UserHasSession AS UHS
							INNER JOIN User AS U ON U.id = UHS.userId
							WHERE U.feideId = ${feideId}
						);`;
		return createPromise(db, statement, "userHasSession");
	},
	userRightsFromFeideId: function(db, feideId) {
		let statement = `DELETE FROM UserRight
						WHERE feideId = ${feideId}`;
		return createPromise(db, statement, "userRightsFromFeideId");
	},
	feide: function(db, feideId) {
		let statement = `DELETE FROM Feide
						WHERE id = ${feideId}`;
		return createPromise(db, statement, "feide");
	},
	userByFeideId: function(db, feideId) {
		let statement = `DELETE FROM User
						WHERE feideId = ${feideId}`;
		return createPromise(db, statement, "userByFeideId");
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
