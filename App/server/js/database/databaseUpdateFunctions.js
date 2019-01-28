function createPromise(db, statement) {
	return new Promise((resolve, reject) => {
		db.run(statement, (err) => {
			if (err) reject(err);
			resolve();
		});
	});
}

const update = {
	feideInfo: function (db, oldFeideId, feideId, feideAccess, feideName) {
		let statement = `UPDATE Feide SET id=${feideId}, accessToken='${feideAccess}', name='${feideName}' WHERE id=${oldFeideId};`;
		return createPromise(db, statement);
	},
	userInfo: function (db,olduserId,userId,feideId) {
		let statement = `UPDATE User SET id=${userId},feideId=${feideId} WHERE id=${olduserId};`;
		return createPromise(db, statement);
	},
	addQuestionObject: function(db,questionId,questionobject) {
		let statement = `UPDATE Question SET object = ${questionobject} WHERE id= ${questionId}`;
		return createPromise(db, statement);
	},
	editQuestion: function(db, id, questionText, questionDescription, questionObject, questionSolution, questionType) {
		let statement = `UPDATE question 
						 SET text = '${questionText}', 
    					 description = '${questionDescription}', 
    					 object = ${questionObject}, 
    					 solution = ${questionSolution}, 
    					 questionType = ${questionType} 
						 WHERE id = ${id};`;
		return createPromise(db, statement);
	}
};

module.exports.update = update;