function createPromise(db, statement, funcName) {
	return new Promise((resolve, reject) => {
		db.run(statement, (err) => {
			if (err) reject(new Error(`Error in delete function: ${funcName} \n\n ${err}`));
			resolve();
		});
	});
}

const del = {
	userRights: function(db, feideId, courseCode, courseSemester) {
        let statement = `DELETE FROM UserRight
                         WHERE feideId = ${feideId}
                         AND courseCode = '${courseCode}'
                         AND courseSemester = '${courseSemester}'`;
		return createPromise(db, statement, "userRights");
    }
};

module.exports.del = del;
