const get = module.exports =  {
    feideById: function(db, feideId) {
        let statement = `SELECT * FROM Feide WHERE feideId=${feideId};`;
        return new Promise((resolve, reject) => {
            db.get(statement, (err,row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
    },
    userById:  function (db,userId) {
        let statement = `SELECT * FROM User WHERE userId=${userId};`;
        return new Promise((resolve, reject) => {
            db.get(statement, (err,row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
    },
    useridByFeideId: function (db,feideId) {
        let statement = `SELECT userid FROM User WHERE feideId = ${feideId} LIMIT 1`;
        return new Promise((resolve, reject) => {
            db.get(statement, (err,row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
    },
    quizesToUser: function(db,feideId) {
        let statment = `SELECT Q.quizName, C.courseCode
                        FROM Quiz AS Q
                        INNER JOIN User_has_Quiz AS UQ ON UQ.quizId = Q.quizId
                        INNER JOIN Course AS C ON Q.courseCode = C.courseCode AND Q.courseSemester = C.courseSemester 
                        WHERE UQ.userId = (SELECT U.userid FROM User AS U WHERE U.feideid= ${feideId} LIMIT 1)`;
        return new Promise((resolve, reject) => {
            db.all(statement, (err,rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    },
    amountOfUsersInQuiz: function (db,quizId) {
        let statement = `SELECT userid FROM User_Has_Quiz WHERE quizid = ${quizId}`;
        return new Promise((resolve, reject) => {
            db.all(statement, (err,rows) => {
                if (err) reject(err);
                resolve(rows.length);
            });
        });
    },
    amountOfQuizesUserParticipateIn: function (db,userId) {
        let statement = `SELECT quizId FROM User_Has_Quiz WHERE userid = ${userId}`;
        return new Promise((resolve, reject) => {
            db.all(statement, (err,rows) => {
                if (err) reject(err);
                resolve(rows.length);
            });
        });
    },
    allQuestionInQuiz: function (db,quizId) {
        let statement = `SELECT Q.questionText,Q.questionObject,Q.questionSolution,T.questionType,QQ.quizId
                         FROM Question AS Q
                         INNER JOIN Quiz_has_Question AS QQ ON QQ.questionId = Q.questionId
                         INNER JOIN Type AS T ON T.questionType = Q.questionType
                         WHERE QQ.quizId = ${quizId};`;
        return new Promise((resolve, reject) => {
            db.all(statement, (err,rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    },
    allQuizWithinCourse: function(db,courseCode) {
        let statement = `SELECT Q.quizId,Q.quizName,C.courseName,C.courseCode,Q.courseSemester
                         FROM Quiz AS Q
                         INNER JOIN Course AS C ON Q.courseCode = C.courseCode 
                         WHERE C.courseCode = '${courseCode}' 
                         GROUP BY Q.quizId;`;
        return new Promise((resolve, reject) => {
            db.all(statement, (err,rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    },
    amountCorrectAnswersForUser: function (db,userid) {
        let statement = `SELECT answerid
                         FROM Answer
                         WHERE result = 1 AND userid = ${userid};`;
        return new Promise((resolve, reject) => {
            db.all(statement, (err,rows) => {
                if (err) reject(err);
                resolve(rows.length);
            });
        });
    },
    amountWrongAnswersForUser: function (db,userid) {
        let statement = `SELECT answerid
                     FROM Answer
                     WHERE result = 0 AND userid = ${userid};`;
        return new Promise((resolve, reject) => {
            db.all(statement, (err,rows) => {
                if (err) reject(err);
                resolve(rows.length);
            });
        });
    },
    amountAnswersForUser: function (db,userid) {
        let statement = `SELECT answerid
                         FROM Answer
                         WHERE userid = ${userid};`;
        return new Promise((resolve, reject) => {
            db.all(statement, (err,rows) => {
                if (err) reject(err);
                resolve(rows.length);
            });
        });
    },
    allQuestionsWithinCourse(db, course) {
        let statement = `SELECT Q.questionId,Q.questionText,Q.questionDescription,questionObject,questionSolution,T.typeName,Q.courseCode
                         FROM Question AS Q
                         INNER JOIN Type AS T ON Q.questionType = T.questionType
                         WHERE Q.courseCode = "${course}";`;
        return new Promise((resolve, reject) => {
            db.all(statement, (err,rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    },
    questionTypes(db) {
        let statement = `SELECT * FROM Type;`;
        return new Promise((resolve, reject) => {
            db.all(statement, (err,rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }
};