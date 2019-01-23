const get = module.exports =  {
    feideById: function(db, feideId) {
        let statement = `SELECT * FROM Feide WHERE feideId=${feideId};`;
        return db.get(statement, function (err, row) {
            if (err) {
                console.log(err.message);
            } else {
                console.log(row)
            }
            return row
        })
    },
    userById:  function (db,userId) {
        let statement = `SELECT * FROM User WHERE userId=${userId};`;
        return db.get(statement, function (err,row) {
            if (err) {
                console.log(err);
            }else {
                console.log(row);
            }
            return row;
        })
    },
    useridByFeideId: function (db,feideId) {
        let statement = `SELECT userid FROM User WHERE feideId = ${feideId} LIMIT 1`;
        return db.get(statement, function (err,row) {
            if (err) {
                console.log(err)
            }else {
                console.log(row)
            }
            return row;
        })
    },
    quizesToUser: function(db,feideId) {
        let statment = `SELECT Q.quizName, C.courseCode
                        FROM Quiz AS Q
                        INNER JOIN User_has_Quiz AS UQ ON UQ.quizId = Q.quizId
                        INNER JOIN Course AS C ON Q.courseCode = C.courseCode AND Q.courseSemester = C.courseSemester 
                        WHERE UQ.userId = (SELECT U.userid FROM User AS U WHERE U.feideid= ${feideId} LIMIT 1)`;
        db.run(statement, function (err) {
            if (err) {
                console.log(err.message);
            }
        })
    },
    amountOfUsersInQuiz: function (db,quizId) {
        let userAmount = 0;
        let statement = `SELECT userid FROM User_Has_Quiz WHERE quizid = ${quizId}`;
        db.all(statement, function (err,rows) {
            if (err) {
                console.log(err.message)
            }else {
                console.log(rows);
                userAmount = rows.length;
            }
        });
        return userAmount;
    },
    amountOfQuizesUserParticipateIn: function (db,userId) {
        let quizAmount = 0;
        let statement = `SELECT quizId FROM User_Has_Quiz WHERE userid = ${userId}`;
        db.all(statement, function (err,rows) {
            if (err) {
                console.log(err.message);
            }else {
                console.log(rows);
                quizAmount = rows.length
            }
        });
        return quizAmount;
    },
    allQuestionInQuiz: function (db,quizId) {
        let statement = `SELECT Q.questionText,Q.questionObject,Q.questionSolution,T.questionType,QQ.quizId
                         FROM Question AS Q
                         INNER JOIN Quiz_has_Question AS QQ ON QQ.questionId = Q.questionId
                         INNER JOIN Type AS T ON T.questionType = Q.questionType
                         WHERE QQ.quizId = ${quizId};`;
        return db.all(statement,function (err,rows) {
            if (err) {
                console.log(err.message)
            } else {
                console.log(rows)
            }
            return rows
        });
    },
    allQuizWithinCourse: function(db,courseCode) {
        let statement = `SELECT Q.quizId,Q.quizName,C.courseName,C.courseCode,Q.courseSemester
                         FROM Quiz AS Q
                         INNER JOIN Course AS C ON Q.courseCode = C.courseCode 
                         WHERE C.courseCode = '${courseCode}' 
                         GROUP BY Q.quizId;`;
        return db.all(statement,function (err,rows) {
            if (err) {
                console.log(err.message);
            }else{
                console.log(rows);
            }
            return rows
        })
    },
    amountCorrectAnswersForUser: function (db,userid) {
        let quizAmount = 0;
        let statement = `SELECT answerid
                         FROM Answer
                         WHERE result = 1 AND userid = ${userid};`;
        return db.all(statement,function (err,rows) {
            if (err) {
                console.log(err.message);
            }else {
                console.log(rows);
                quizAmount = rows.length;
            }
            return rows
        })
    },
    amountWrongAnswersForUser: function (db,userid) {
    let quizAmount = 0;
    let statement = `SELECT answerid
                     FROM Answer
                     WHERE result = 0 AND userid = ${userid};`;
    db.all(statement, function (err,rows) {
        if (err) {
            console.log(err.message);
        }else {
            console.log(rows);
            quizAmount = rows.length;
        }
    });
    return quizAmount;
    },
    amountAnswersForUser: function (db,userid) {
        let quizAmount = 0;
        let statement = `SELECT answerid
                         FROM Answer
                         WHERE userid = ${userid};`;
        return db.all(statement, function (err,rows) {
            if (err) {
                console.log(err.message);
            }else {
                console.log(rows);
                quizAmount = rows.length
            }
            return rows
        })
    },
    allQuestionsWithinCourse(db, course) {
        let statement = `SELECT Q.questionId,Q.questionText,Q.questionDescription,questionObject,questionSolution,T.typeName,Q.courseCode
                         FROM Question AS Q
                         INNER JOIN Type AS T ON Q.questionType = T.questionType
                         WHERE Q.courseCode = "${course}";`;
        return db.all(statement, function (err,rows) {
           if (err) {
               console.log(err.message);
           } else {
               console.log(rows);
           }
           return rows;
        });
    },
    questionTypes(db) {
        let statement = `SELECT * FROM Type;`;
        return db.all(statement, function (err,rows) {
            if (err) {
                console.log(err.message);
            }else {
                console.log(rows);
            }
            return rows
        });
    }

};