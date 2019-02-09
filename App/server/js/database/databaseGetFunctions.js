const customReject = function(err, func){
    return new Error(`Error in get function: ${func} \n\n ${err}`)
}

const get = {
    feideById: function(db, feideId) {
        return new Promise((resolve, reject) => {         
            let statement = `SELECT * FROM Feide WHERE id=${feideId};`;
            db.get(statement, (err,row) => {
                if (err) reject(customReject(err, "feideById"));
                resolve(row);
            });
        });
    },
    userById:  function (db, userId) {
        return new Promise((resolve, reject) => {
            let statement = `SELECT * FROM User WHERE id=${userId};`;
            db.get(statement, (err,row) => {
                if (err) reject(customReject(err, "userById"));
                resolve(row);
            });
        });
    },
    userIdByFeideId: function (db, feideId) {
        let statement = `SELECT id FROM User WHERE feideId = ${feideId} LIMIT 1`;
        return new Promise((resolve, reject) => {
            db.get(statement, (err,row) => {
                if (err) reject(customReject(err, "useridByFeideId"));
                resolve(row);
            });
        });
    },
    userRightsByFeideId: function(db, feideId, courseCode, courseSemester) {
        return new Promise((resolve, reject) => {
            let statement = `SELECT level FROM UserRight 
                            WHERE feideId = ${feideId}
                            AND courseCode = '${courseCode}'
                            AND courseSemester = '${courseSemester}'`;
            db.get(statement, (err,row) => {
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
    sessionsToUser: function(db, userInfo) {
        return new Promise(async (resolve, reject) => {
            let userId = await this.userId(db, userInfo).catch((err) => {
                reject(customReject(err), "sessionsToUser");
            });
            let statement = `SELECT Q.name, C.code
                            FROM Session AS Q
                            INNER JOIN User_has_Session AS UQ ON UQ.sessionId = Q.id
                            INNER JOIN Course AS C ON Q.courseCode = C.code AND Q.courseSemester = C.semester 
                            WHERE UQ.userId = (
                                SELECT U.id 
                                FROM User AS U 
                                WHERE U.feideid = '${userId}'
                            LIMIT 1)`;
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
                             INNER JOIN Session_has_Question AS SQ ON SQ.questionId = Q.id
                             INNER JOIN Type AS T ON T.type = Q.questionType
                             WHERE SQ.sessionId = ${sessionId};`;
            db.all(statement, (err,rows) => {
                if (err) reject(customReject(err, "allQuestionInSession"));
                resolve(rows);
            });
        });
    },
    allAnswerToQuestion: function(db, sessionHasQuestionId) {
        return new Promise((resolve, reject) => {
            let statement = `SELECT * FROM Answer WHERE sessionHasQuestionId = ${sessionHasQuestionId}`;
            db.all(statement, (err,rows) => {
                if (err) reject(customReject(err, "allAnswerToQuestion"));
                resolve(rows);
            });
        });
    },
    allSessionWithinCourse: function(db, courseCode, courseSemester) {
        return new Promise((resolve, reject) => {
            let statement = `SELECT Q.id, C.name AS courseName, Q.name AS name, C.code, Q.courseSemester
                             FROM Session AS Q
                             INNER JOIN Course AS C ON Q.courseCode = C.code 
                             WHERE C.code = '${courseCode}' AND C.semester = '${courseSemester}' 
                             GROUP BY Q.id;`;
            db.all(statement, (err,rows) => {
                if (err) reject(customReject(err, "allSessionWithinCourse"));
                resolve(rows);
            });
        });
    },
    allSessionWithinCourseForSessionOverview: function(db, courseCode, courseSemester) {
        return new Promise((resolve, reject) => {
            let statement = `SELECT Q.id, Q.name
                             FROM Session AS Q
                             INNER JOIN Course AS C ON Q.courseCode = C.code 
                             WHERE C.code = '${courseCode}' AND C.semester = '${courseSemester}' 
                             GROUP BY Q.id;`;
            db.all(statement, (err,rows) => {
                if (err) reject(customReject(err, "allSessionWithinCourse"));
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
    allQuestionsWithinCourse: function(db, course) {
        return new Promise((resolve, reject) => {
            let statement = `SELECT Q.id,Q.text,Q.description,Q.object,Q.solution,T.type,Q.courseCode
                             FROM Question AS Q
                             INNER JOIN Type AS T ON Q.questionType = T.type
                             WHERE Q.courseCode = "${course}";`;
            db.all(statement, (err,rows) => {
                if (err) reject(customReject(err, "allQuestionsWithinCourse"));
                resolve(rows);
            });
        });
    },
    questionTypes: function(db) {
        return new Promise((resolve, reject) => {
            let statement = `SELECT * FROM Type;`;
            db.all(statement, (err,rows) => {
                if (err) reject(customReject(err, "questionTypes"));
                resolve(rows);
            });
        });
    },
    allCourses: function(db) {
        return new Promise((resolve, reject) => {
            let statement = `SELECT * FROM Course`;
            db.all(statement, (err,rows) => {
                if (err) reject(customReject(err, "allCourses"));
                resolve(rows);
            });
        });
    },
    userCourses: function(db, feideId) {
        return new Promise(async (resolve, reject) => {
            let statement = `SELECT courseSemester AS semester, courseCode AS code
                            FROM UserRight
                            WHERE feideId = ${feideId}`;
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
    feideUsersByUserRightsLevel: function(db, level, courseCode, courseSemester) {
        return new Promise(async (resolve, reject) => {
            let statement = `SELECT UR.feideId, F.name
                            FROM UserRight as UR
                            LEFT JOIN Feide as F ON Ur.feideId = F.id
                            WHERE UR.courseSemester = '${courseSemester}' 
                            AND UR.courseCode = '${courseCode}'
                            AND UR.level = ${level}`;
            db.all(statement, (err,rows) => {
                if (err) reject(customReject(err, "feideUsersByUserRightsLevel"));
                resolve(rows);
            });
        });
    }
};

module.exports.get = get;
