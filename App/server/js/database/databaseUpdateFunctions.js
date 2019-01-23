const update = module.exports = {
	feideInfo: function (db,oldfeideId,feideId,feideAccess,feideName) {
		let statement = `UPDATE Feide SET feideId=${feideId}, feideAccessToken='${feideAccess}', feideName='${feideName}' WHERE feideId=${oldfeideId};`;
		db.run(statement, function (err) {
			if (err) {
				console.log(err.message);
			}
		})
	},
	userInfo: function (db,olduserId,userId,feideId) {
		let statement = `UPDATE User SET userId=${userId},feideId=${feideId} WHERE userId=${olduserId};`;
		db.run(statement, function (err) {
			if (err) {
				console.log(err.message);
			}
		})
	},
	addQuestionObject: function(db,questionId,questionobject,questiontype) {
		let statement = `UPDATE Question SET questionObject = ${questionobject}, questionType = ${questiontype} WHERE questionId= ${questionId}`;
		db.run(statement, function (err) {
			if (err) {
				console.log(err.message);
			}
		})
	},
};