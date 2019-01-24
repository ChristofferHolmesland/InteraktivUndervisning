function createPromise(db, statement) {
	return new Promise((resolve, reject) => {
		db.run(statement, (err) => {
			if (err) reject(err);
			resolve();
		});
	});
}

const update = module.exports = {
	feideInfo: function (db,oldfeideId,feideId,feideAccess,feideName) {
		let statement = `UPDATE Feide SET feideId=${feideId}, feideAccessToken='${feideAccess}', feideName='${feideName}' WHERE feideId=${oldfeideId};`;
		return createPromise(db, statement);
	},
	userInfo: function (db,olduserId,userId,feideId) {
		let statement = `UPDATE User SET userId=${userId},feideId=${feideId} WHERE userId=${olduserId};`;
		return createPromise(db, statement);
	},
	addQuestionObject: function(db,questionId,questionobject) {
		let statement = `UPDATE Question SET questionObject = ${questionobject} WHERE questionId= ${questionId}`;
		return createPromise(db, statement);
	},
	editquestion: function(db, id, questionText, questionDescription, questionObject, questionSolution, questionType) {
		let statement = `UPDATE question 
						 SET questionText = '${questionText}', 
    					 questionDescription = '${questionDescription}', 
    					 questionObject = ${questionObject}, 
    					 questionSolution = ${questionSolution}, 
    					 questionType = ${questionType} 
						 WHERE questionid = ${id};`;
		return createPromise(db, statement);
	}
};