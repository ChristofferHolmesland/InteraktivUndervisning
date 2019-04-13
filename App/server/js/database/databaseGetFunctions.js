const fs = require("fs");
const path = require("path");

const customReject = function(err, func){
	return new Error(`Error in get function: ${func} \n\n ${err}`)
}

const jsonParser = function (rows) {
	if (rows === undefined) return;
	for (let i = 0; i < rows.length; i++) {
		let row = rows[i];
		if (row.solution) row.solution = JSON.parse(row.solution);
		if (row.object) row.object = JSON.parse(row.object);
	}
};

const imageGetter = async function (rows) {
	if (rows === undefined) return;
	for (let i = 0; i < rows.length; i++) {
		let row = rows[i];
		let files = row.object.files;
		for (let j = 0; j < files.length; j++) {
			let file = files[j];
			if(file.filePath !== undefined) {
				if (fs.existsSync(path.join(__dirname, file.filePath))) {
					let data = fs.readFileSync(path.join(__dirname, file.filePath));
					let base64Image = data.toString("base64");
					file.buffer = base64Image;
				}
				delete file.filePath;
			}
		}
	}
}

const get = {
	feideById: function(db, feideId) {
		return new Promise((resolve, reject) => {         
			let statement = `SELECT * FROM Feide WHERE id='${feideId}';`;
			db.get(statement, (err,row) => {
				if (err) reject(customReject(err, "feideById"));
				resolve(row);
			});
		});
	},
	userById:  function (db, userId) {
		return new Promise((resolve, reject) => {
			let statement = `SELECT * FROM User WHERE id='${userId}';`;
			db.get(statement, (err,row) => {
				if (err) reject(customReject(err, "userById"));
				resolve(row);
			});
		});
	},
	userIdByFeideId: function (db, feideId) {
		let statement = `SELECT id FROM User WHERE feideId = '${feideId}' LIMIT 1`;
		return new Promise((resolve, reject) => {
			db.get(statement, (err,row) => {
				if (err) reject(customReject(err, "useridByFeideId"));
				resolve(row);
			});
		});
	},
	userInformationBySessionToken: function (db, sessionToken) {
		let statement = `SELECT id, accessToken, name, sessionId, admin
						FROM Feide
						WHERE sessionId = '${sessionToken}'
						`;
		return new Promise((resolve, reject) => {
			db.get(statement, (err, row) => {
				if (err) reject(customReject(err, "userInformationBySessionToken"));
				resolve(row);
			});
		})
	},
	userRightsByFeideId: function(db, data) {
		return new Promise((resolve, reject) => {
			let statement = `SELECT level FROM UserRight 
							WHERE feideId = ${data.feideId}
							AND courseId = ${data.courseId}`;
			db.get(statement, (err, row) => {
				if (err) {
					reject(customReject(err, "userRightsByFeideId"));
				}
				resolve(row);
			});
		});
	},
	sessionById: function(db, sessionId) {
		return new Promise((resolve, reject) => {
			let statement = `SELECT * FROM Session WHERE id = ${sessionId}`;
			db.get(statement, (err,row) => {
				if (err) reject(customReject(err, "sessionById"));
				resolve(row);
			});
		});
	},
	sessionHasUserByUserId: function(db, userId) {
		return new Promise((resolve, reject) => {
			let statement = `SELECT * FROM UserHasSession WHERE userId = '${userId}'`;
			db.get(statement, (err, row) => {
				if (err) reject(customReject(err, "sessionHasUserByUserId"));
				resolve(row);
			})
		});
	},
	sessionsToUser: function(db, userInfo) {
		return new Promise(async (resolve, reject) => {
			let userId = await this.userId(db, userInfo).catch((err) => {
				reject(customReject(err), "sessionsToUser");
			});
			let statement = `SELECT S.name, S.id, C.id
							FROM Session AS S
							INNER JOIN UserHasSession AS US ON US.sessionId = S.id
							INNER JOIN Course AS C ON S.courseId = C.id 
							WHERE US.userId = (
								SELECT id 
								FROM User
								WHERE id = '${userId.id}'
							LIMIT 1);`;
			db.all(statement, (err,rows) => {
				if (err) reject(customReject(err, "sessionsToUser"));
				resolve(rows);
			});
		});
	},
	allQuestionInSession: function (db, sessionId) {
		return new Promise((resolve, reject) => {
			let statement = `SELECT Q.id, Q.text, Q.description, Q.object, Q.solution, T.type, Q.time, SQ.id AS sqId
							 FROM Question AS Q
							 INNER JOIN SessionHasQuestion AS SQ ON SQ.questionId = Q.id
							 INNER JOIN Type AS T ON T.type = Q.questionType
							 WHERE SQ.sessionId = ${sessionId};`;
			db.all(statement, (err,rows) => {
				if (err) reject(customReject(err, "allQuestionInSession"));
				jsonParser(rows);
				imageGetter(rows);
				resolve(rows);
			});
		});
	},
	allAnswerToQuestion: function(db, sessionHasQuestionId) {
		return new Promise((resolve, reject) => {
			let statement = `SELECT * FROM Answer WHERE sessionHasQuestionId = ${sessionHasQuestionId}`;
			db.all(statement, (err,rows) => {
				if (err) reject(customReject(err, "allAnswerToQuestion"));
				jsonParser(rows);
				resolve(rows);
			});
		});
	},
	allSessionWithinCourse: function(db, courseId) {
		return new Promise((resolve, reject) => {
			let statement = `SELECT S.id, S.name
							FROM Session AS S
							INNER JOIN Course AS C ON S.courseId = C.id 
							WHERE C.id = ${courseId}
							GROUP BY S.id;`;
			db.all(statement, (err,rows) => {
				if (err) reject(customReject(err, "allSessionWithinCourse"));
				resolve(rows);
			});
		});
	},
	allSessionWithinCourseForSessionOverview: function(db, courseId) {
		return new Promise((resolve, reject) => {
			let statement = `SELECT S.id, S.name
							 FROM Session AS S
							 INNER JOIN Course AS C ON S.courseId = C.id 
							 WHERE C.id = ${courseId} 
							 GROUP BY S.id;`;
			db.all(statement, (err,rows) => {
				if (err) reject(customReject(err, "allSessionWithinCourseForSessionOverview"));
				resolve(rows);
			});
		});
	},
	amountAnswersForUserByResult: function (db, userInfo, resultValue) {
		return new Promise(async (resolve, reject) => {
			let userId = await this.userId(db, userInfo).catch((err) => {
				reject(customReject(err), "amountAnswersForUserByResult");
			});
			let statement = `SELECT id
							FROM Answer
							WHERE result = ${resultValue}
							AND userId = '${userId.id}'`;
			db.all(statement, (err,rows) => {
				if (err) reject(customReject(err, "amountAnswersForUserByResult"));
				resolve(rows === undefined ? 0 : rows.length);
			});
		});
	},
	amountAnswersForUser: function (db, userInfo) {
		return new Promise(async (resolve, reject) => {
			let userId = await this.userId(db, userInfo).catch((err) => {
				reject(customReject(err), "amountAnswersForUser");
			});
			let statement = `SELECT id
							 FROM Answer
							 WHERE userId = ${userId}`;
			db.all(statement, (err,rows) => {
				if (err) reject(customReject(err, "amountAnswerForUser"));
				resolve(rows.length);
			});
		});
	},
	allQuestionsWithinCourse: function(db, courseId) {
		return new Promise((resolve, reject) => {
			let statement = `SELECT Q.id, Q.text, Q.description, Q.object, Q.solution, T.type, Q.courseId, Q.time
							 FROM Question AS Q
							 INNER JOIN Type AS T ON Q.questionType = T.type
							 WHERE Q.courseId = "${courseId}";`;
			db.all(statement, (err,rows) => {
				if (err) reject(customReject(err, "allQuestionsWithinCourse"));
				jsonParser(rows);
				imageGetter(rows);
				resolve(rows);
			});
		});
	},
	questionTypes: function(db) {
		return new Promise((resolve, reject) => {
			let statement = `SELECT * FROM Type;`;
			db.all(statement, (err, rows) => {
				if (err) reject(customReject(err, "questionTypes"));
				resolve(rows);
			});
		});
	},
	allCourses: function(db) {
		return new Promise((resolve, reject) => {
			let statement = `SELECT C.id, C.name, CC.code, S.season, Y.year
							FROM Course AS C
							INNER JOIN CourseSemester as CS on CS.id = C.semesterId
							INNER JOIN CourseCode as CC on CC.id = C.codeId
							INNER JOIN Season as S on S.id = CS.seasonId
							INNER JOIN Year as Y on Y.id = CS.yearId`;
			db.all(statement, (err,rows) => {
				if (err) reject(customReject(err, "allCourses"));
				resolve(rows);
			});
		});
	},
	allCoursesWithIds: function(db) {
		return new Promise((resolve, reject) => {
			let statement = `SELECT C.id AS courseId, C.name, CC.id AS courseCodeId, CS.id AS courseSemesterId
							FROM Course AS C
							INNER JOIN CourseSemester as CS on CS.id = C.semesterId
							INNER JOIN CourseCode as CC on CC.id = C.codeId`;
			db.all(statement, (err,rows) => {
				if (err) reject(customReject(err, "allCourses"));
				resolve(rows);
			});
		});
	},
	userCourses: function(db, feideId) {
		return new Promise(async (resolve, reject) => {
			let statement = `SELECT C.id AS courseId, C.name, CC.code, CC.id AS courseCodeId, CS.id AS semesterId, S.season, Y.year
							FROM Course AS C
							INNER JOIN CourseSemester AS CS ON CS.id = C.semesterId
							INNER JOIN CourseCode AS CC ON CC.id = C.codeId
							INNER JOIN Season AS S ON S.id = CS.seasonId
							INNER JOIN Year AS Y ON Y.id = CS.yearId
							INNER JOIN UserRight AS UR ON UR.courseId = C.id
							WHERE UR.feideId = '${feideId}'`;
			db.all(statement, (err,rows) => {
				if (err) reject(customReject(err, "userCourses"));
				resolve(rows);
			});
		});
	},
	userId: function(db, userInfo) {
		switch (userInfo.type) {
		case "feide":
			return this.userIdByFeideId(db, userInfo.id);
		default:
			return new Promise((resolve, rejcet) => {
				if(userInfo === undefined)
					reject(new customReject(new Error(`userInfo is undefined`), "userId"))
				if(userInfo.type === undefined) 
					reject(new customReject(new Error(`userInfo.Type is undefined`), "userId"))
				reject(new customReject(new Error(`userInfo.Type does not exist: ${userInfo.type}`), "userId"))
			})
		}
	},
	adminSubjects: function(db, feideNumber) {
		return new Promise(async (resolve, reject) => {
			let statement = `SELECT UR.level, CC.code, S.season, Y.year
							FROM Course AS C
							INNER JOIN UserRight AS UR ON UR.courseId = C.id
							INNER JOIN CourseCode AS CC ON CC.id = C.codeId
							INNER JOIN CourseSemester AS CS ON C.semesterId = CS.id
							INNER JOIN Season AS S ON S.id = CS.seasonId
							INNER JOIN Year AS Y ON Y.id = CS.yearId
							WHERE UR.feideId = '${feideNumber}'`;
			db.all(statement, (err, rows) => {
				if(err) reject(customReject(err, "adminSubjects"));
				resolve(rows);
			});
		})
	},
	feideUsersByUserRightsLevel: function(db, data) {
		return new Promise(async (resolve, reject) => {
			let statement = `SELECT UR.feideId, F.name
							FROM UserRight as UR
							LEFT JOIN Feide as F ON Ur.feideId = F.id
							WHERE UR.courseId = ${data.courseId} AND UR.level = ${data.level}`;
			db.all(statement, (err,rows) => {
				if (err) reject(customReject(err, "feideUsersByUserRightsLevel"));
				resolve(rows);
			});
		});
	},
	userRightByFeideId: function(db, feideNumber) {
		return new Promise(async (resolve, reject) => {
			let statement = `SELECT UR.level
							FROM UserRight as UR
							INNER JOIN Feide as F ON UR.feideId = F.id
							WHERE F.id = '${feideNumber}'`
			db.all(statement, (err,rows) => {
				if (err) reject(customReject(err, "feideUsersByUserRightsLevel"));
				resolve(rows);
			});
		});
	},
	feideUsersInSession(db, sessionId) {
		return new Promise(async (resolve, reject) => {
			let statement = `SELECT *
							FROM UserHasSession
							WHERE userId != 1 AND sessionID = ${sessionId}`;
			db.all(statement, (err, rows) => {
				if (err) reject(customReject(err, "feideUsersInSession"));
				resolve(rows);
			});
		});
	},
	seasons(db) {
		return new Promise(async (resolve, reject) => {
			let statement = `SELECT *
							FROM Season`;
			db.all(statement, (err, rows) => {
				if (err) reject(customReject(err, "seasons"));
				resolve(rows);
			});
		});
	},
	years(db) {
		return new Promise(async (resolve, reject) => {
			let statement = `SELECT *
							FROM Year`;
			db.all(statement, (err, rows) => {
				if (err) reject(customReject(err, "years"));
				resolve(rows);
			});
		});
	},
	semesters(db) {
		return new Promise(async (resolve, reject) => {
			let statement = `SELECT CS.id, S.season, Y.year
							FROM CourseSemester AS CS
							INNER JOIN Season AS S ON CS.seasonId = S.id
							INNER JOIN Year AS Y ON CS.yearId = Y.id`;
			db.all(statement, (err, rows) => {
				if (err) reject(customReject(err, "semesters"));
				resolve(rows);
			});
		});
	},
	courseCodes(db) {
		return new Promise(async (resolve, reject) => {
			let statement = `SELECT *
							FROM CourseCode`;
			db.all(statement, (err, rows) => {
				if (err) reject(customReject(err, "courseCodes"));
				resolve(rows);
			});
		});
	},
	coursesByCourseId(db, courseList) {
		return new Promise(async (resolve, reject) => {
			let statement = `SELECT id FROM Course WHERE `
			for (let i = 0; i < courseList.length; i++) {
				if (i > 0) statement += `\nOR `
				let courseId = courseList[i];
				statement += `id = ${courseId}`;
			}
			statement += `;`
			db.all(statement, (err, rows) => {
				if (err) reject(customReject(err, "courseCodes"));
				resolve(rows);
			})
		});
	},
	questionsByQuestionId(db, questionList) {
		return new Promise(async (resolve, reject) => {
			let statement = `SELECT id, text, description, solution, time, questionType AS type, object, status FROM Question WHERE `
			for (let i = 0; i < questionList.length; i++) {
				if (i > 0) statement += `\nOR `
				let questionId = questionList[i].id;
				statement += `id = ${questionId}`;
			}
			statement += `;`
			db.all(statement, (err, rows) => {
				if (err) reject(customReject(err, "questionByQuestionId"));
				jsonParser(rows);
				imageGetter(rows);
				resolve(rows);
			});
		});
	},
	userLastSession(db, feideId) {
		return new Promise(async (resolve, reject) => {
			let statement = `SELECT S.id AS id, S.name AS text
							FROM Session AS S
							INNER JOIN SessionHasQuestion AS SHQ ON SHQ.sessionId = S.id
							INNER JOIN ANSWER AS A ON A.sessionHasQuestionId = SHQ.id
							INNER JOIN User AS U ON U.id = A.userId
							WHERE U.feideId = ${feideId}
							ORDER BY A.id DESC
							LIMIT 1;`;
			db.get(statement, (err, row) => {
				if (err) reject(customReject(err, "userLastSession"));
				resolve(row);
      });
		});
  },
	courseInfoById(db, courseId) {
		return new Promise(async (resolve, reject) => {
			let statement = `SELECT CC.code, S.season, Y.year
							FROM Course AS C
							INNER JOIN CourseCode AS CC ON C.codeId = CC.id
							INNER JOIN CourseSemester AS CS ON CS.id = C.semesterId
							INNER JOIN Season AS S ON S.id = CS.seasonId
							INNER JOIN Year AS Y ON Y.id = CS.yearId
							WHERE C.id = ${courseId}`;
			db.all(statement, (err, rows) => {
				if (err) reject(customReject(err, "courseInfoById"));
				resolve(rows[0]);
			});
    });
	}
};

module.exports.get = get;
