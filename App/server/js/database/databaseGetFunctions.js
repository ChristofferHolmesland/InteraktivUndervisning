const customReject = function(err, func){
    return new Error(`\n\nError in function: ${func} \n\n ${err}`)
}

const get = {
    feideById: function(db, feideId) {
        let statement = `SELECT * FROM Feide WHERE id=${feideId};`;
        return new Promise((resolve, reject) => {
            db.get(statement, (err,row) => {
                if (err) reject(customReject(err, "feideById"));
                resolve(row);
            });
        });
    },
    userById:  function (db,userId) {
        let statement = `SELECT * FROM User WHERE id=${userId};`;
        return new Promise((resolve, reject) => {
            db.get(statement, (err,row) => {
                if (err) reject(customReject(err, "userById"));
                resolve(row);
            });
        });
    },
    useridByFeideId: function (db,feideId) {
        let statement = `SELECT id FROM User WHERE feideId = ${feideId} LIMIT 1`;
        return new Promise((resolve, reject) => {
            db.get(statement, (err,row) => {
                if (err) reject(customReject(err, "useridByFeideId"));
                resolve(row);
            });
        });
    },
    quizById: function(db, quizId) {
        let statement = `SELECT * FROM Quiz WHERE id = ${quizId}`;
        return new Promise((resolve, reject) => {
            db.get(statement, (err,row) => {
                if (err) reject(customReject(err, "quizById"));
                resolve(row);
            });
        });
    },
    quizzesToUser: function(db,feideId) {
        let statement = `SELECT Q.name, C.code
                        FROM Quiz AS Q
                        INNER JOIN User_has_Quiz AS UQ ON UQ.quizId = Q.id
                        INNER JOIN Course AS C ON Q.courseCode = C.code AND Q.courseSemester = C.semester 
                        WHERE UQ.userId = (SELECT U.id FROM User AS U WHERE U.feideid= ${feideId} LIMIT 1)`;
        return new Promise((resolve, reject) => {
            db.all(statement, (err,rows) => {
                if (err) reject(customReject(err, "quizzesToUser"));
                resolve(rows);
            });
        });
    },
    amountOfUsersInQuiz: function (db,quizId) {
        let statement = `SELECT userId FROM User_Has_Quiz WHERE quizId = ${quizId}`;
        return new Promise((resolve, reject) => {
            db.all(statement, (err,rows) => {
                if (err) reject(customReject(err, "amountOfUsersInQuiz"));
                resolve(rows.length);
            });
        });
    },
    amountOfquizzesUserParticipateIn: function (db,userId) {
        let statement = `SELECT quizId FROM User_Has_Quiz WHERE userId = ${userId}`;
        return new Promise((resolve, reject) => {
            db.all(statement, (err,rows) => {
                if (err) reject(customReject(err, "amountOfquizzesUserParticipateIn"));
                resolve(rows.length);
            });
        });
    },
    allQuestionInQuiz: function (db,quizId) {
        let statement = `SELECT Q.id, Q.text,Q.description,Q.object,Q.solution,T.type,QQ.id AS qqID
                         FROM Question AS Q
                         INNER JOIN Quiz_has_Question AS QQ ON QQ.questionId = Q.id
                         INNER JOIN Type AS T ON T.type = Q.questionType
                         WHERE QQ.quizId = ${quizId};`;
        return new Promise((resolve, reject) => {
            db.all(statement, (err,rows) => {
                if (err) reject(customReject(err, "allQuestionInQuiz"));
                resolve(rows);
            });
        });
    },
    allAnswerToQuestion: function(db, quizHasQuestionId) {
        let statement = `SELECT * FROM Answer WHERE quizHasQuestionId = ${quizHasQuestionId}`;
        return new Promise((resolve, reject) => {
            db.all(statement, (err,rows) => {
                if (err) reject(customReject(err, "allAnswerToQuestion"));
                resolve(rows);
            });
        });
    },
    allQuizWithinCourse: function(db, courseCode, courseSemester) {
        let statement = `SELECT Q.id, C.name AS courseName, Q.name AS name, C.code, Q.courseSemester
                         FROM Quiz AS Q
                         INNER JOIN Course AS C ON Q.courseCode = C.code 
                         WHERE C.code = '${courseCode}' AND C.semester = '${courseSemester}' 
                         GROUP BY Q.id;`;
        return new Promise((resolve, reject) => {
            db.all(statement, (err,rows) => {
                if (err) reject(customReject(err, "allQuizWithinCourse"));
                resolve(rows);
            });
        });
    },
    amountCorrectAnswersForUser: function (db,userid) {
        let statement = `SELECT id
                         FROM Answer
                         WHERE result = 1 AND userId = ${userid};`;
        return new Promise((resolve, reject) => {
            db.all(statement, (err,rows) => {
                if (err) reject(customReject(err, "amountCorrectAnswersForUser"));
                resolve(rows.length);
            });
        });
    },
    amountWrongAnswersForUser: function (db,userid) {
        let statement = `SELECT id
                     FROM Answer
                     WHERE result = 0 AND userId = ${userid};`;
        return new Promise((resolve, reject) => {
            db.all(statement, (err,rows) => {
                if (err) reject(customReject(err, "amountWrongAnswersForUser"));
                resolve(rows.length);
            });
        });
    },
    amountAnswersForUser: function (db,userid) {
        let statement = `SELECT id
                         FROM Answer
                         WHERE userId = ${userid};`;
        return new Promise((resolve, reject) => {
            db.all(statement, (err,rows) => {
                if (err) reject(customReject(err, "amountAnswerForUser"));
                resolve(rows.length);
            });
        });
    },
    allQuestionsWithinCourse(db, course) {
        let statement = `SELECT Q.id,Q.text,Q.description,Q.object,Q.solution,T.type,Q.courseCode
                         FROM Question AS Q
                         INNER JOIN Type AS T ON Q.questionType = T.type
                         WHERE Q.courseCode = "${course}";`;
        return new Promise((resolve, reject) => {
            db.all(statement, (err,rows) => {
                if (err) reject(customReject(err, "allQuestionsWithinCourse"));
                resolve(rows);
            });
        });
    },
    questionTypes(db) {
        let statement = `SELECT * FROM Type;`;
        return new Promise((resolve, reject) => {
            db.all(statement, (err,rows) => {
                if (err) reject(customReject(err, "questionTypes"));
                resolve(rows);
            });
        });
    },
    allCourses(db) {
        let statement = `SELECT * FROM Course`;
        return new Promise((resolve, reject) => {
            db.all(statement, (err,rows) => {
                if (err) reject(customReject(err, "allCourses"));
                resolve(rows);
            });
        });
    },
    userCourses(db, feideId) {
        let statement = `SELECT courseSemester AS semester, courseCode AS code FROM UserRight WHERE feideId = ${feideId}`;
        return new Promise((resolve, reject) => {
            db.all(statement, (err,rows) => {
                if (err) reject(customReject(err, "userCourses"));
                resolve(rows);
            });
        });
    }
};

module.exports.get = get;