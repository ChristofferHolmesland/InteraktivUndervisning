//Database functions

/*Notes
    db.get() will only return 1 row, therefore the ids should be used as the identifier.
    db.all() will output all of the rows in an array.
    Each row output will be an object having the same properties as the database table chosen.
*/

module.exports.InsertFeide = function (db,feideId,feideAccess,feideName) {
    let statement = `INSERT INTO Feide(feideId,feideAccessToken,feideName) VALUES(${feideId},'${feideAccess}','${feideName}');`;
    db.run(statement, function (err) {
        if (err) {
            console.error(err.message);
        }
    })
};

module.exports.UpdateFeide = function (db,oldfeideId,feideId,feideAccess,feideName) {
    let statement = `UPDATE Feide SET feideId=${feideId}, feideAccessToken='${feideAccess}', feideName='${feideName}' WHERE feideId=${oldfeideId};`;
    db.run(statement, function (err) {
        if (err) {
            console.log(err.message);
        }
    })
};

module.exports.GetFeidebyId = function(db,feideId) {
    let statement = `SELECT * FROM Feide WHERE feideId=${feideId};`;
    db.get(statement, function (err,row) {
        if (err) {
            console.log(err.message);
        }else {
            console.log(row)
        }
        return row
    })
};

module.exports.InsertFeideUser = function (db,userId,feideId) {
    let statement = `INSERT INTO User(userId,feideId) VALUES (${userId},${feideId})`;
    db.run(statement, function (err) {
        if (err) {
            console.log(err.message);
        }
    })
};

module.exports.InsertAnonymousUser = function (db,userId) {
  let statement = `INSERT INTO User(userId) VALUES (${userId})`;
  db.run(statement, function (err) {
      if (err) {
          console.log(err.message);
      }
  })
};

module.exports.UpdateUser = function (db,olduserId,userId,feideId) {
    let statement = `UPDATE User SET userId=${userId},feideId=${feideId} WHERE userId=${olduserId};`;
    db.run(statement, function (err) {
        if (err) {
            console.log(err.message);
        }
    })
};

module.exports.GetUserById = function (db,userId) {
    let statement = `SELECT * FROM User WHERE userId=${userId};`;
    db.get(statement, function (err,row) {
        if (err) {
            console.log(err);
        }else {
            console.log(row);
        }
        return row;
    })
};

module.exports.InsertQuiz = function (db,quizName,courseSemester,courseCode) {
    let statement = `INSERT INTO Quiz(quizName,courseSemester,courseCode) VALUES ('${quizName}','${courseSemester}','${courseCode}');`;
    db.run(statement, function (err) {
        if (err) {
            console.log(err.message);
        }
    });
};

module.exports.InsertCourse = function (db,courseSemester,courseCode,coursename) {
    let statement = `INSERT INTO Course(courseSemester,courseCode,courseName) VALUES ('${courseSemester}','${courseCode}','${coursename}'`;
    db.run(statement, function (err) {
        if (err) {
            console.log(err.message);
        }
    })
};

module.exports.InsertQuestionNoObject = function (db,questionText,questionSolution,Type) {
    let statement = `INSERT INTO Question(questionText,questionSolution,questiontype) VALUES('${questionText}',${questionSolution},${Type})`;
    db.run(statement, function (err) {
        if (err) {
            console.log(err.message);
        }
    })
};

module.exports.InsertQuestionWithObject = function (db, questionText,questionObject,questionSolution,Type) {
    let statement = `INSERT INTO Question(questionText,questionObject,questionSolution,questiontype) VALUES('${questionText}',${questionObject},${questionSolution},${Type})`;
    db.run(statement, function (err) {
        if (err) {
            console.log(err.message);
        }
    })
};

module.exports.AddQuestionObject = function(db,questionId,questionobject,questiontype) {
    let statement = `UPDATE Question SET questionObject = ${questionobject}, questionType = ${questiontype} WHERE questionId= ${questionId}`;
    db.run(statement, function (err) {
        if (err) {
            console.log(err.message);
        }
    })
};

module.exports.StoreAnswerWithoutUser = function (db,answerObject,questionId) {
    let statement = `INSERT INTO Answer(answerObject,questionId) VALUES(${answerObject},${questionId})`;
    db.run(statement, function (err) {
        if (err) {
            console.log(err.message);
        }
    })
};

module.exports.StoreAnswerWithUser = function (db, answerObject, questionId,userId) {
    let statement = `INSERT INTO Answer(answerObject,questionId,userId) VALUES(${answerObject},${questionId},${userId})`;
    db.run(statement, function (err) {
        if (err) {
            console.log(err.message);
        }
    })
};

module.exports.AddUserToQuiz = function (db,userId,quizId) {
    let statement = `INSERT INTO User_has_Quiz(userId,quizId) VALUES(${userId},${quizId})`;
    db.run(statement, function (err) {
        if (err) {
            console.log(err.message);
        }
    })
};

module.exports.GetQuizestoUser = function(db,feideId) {
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
}

module.exports.AddQuestionToQuiz = function (db,quizId,questionId) {
    let statement = `INSERT INTO Quiz_has_Question(quizId,questionId) VALUES(${quizId},${questionId})`;
    db.run(statement, function (err) {
        if (err) {
            console.log(err.message);
        }
    })
};

module.exports.GetAmountOfUsersInQuiz = function (db,quizId) {
    let userAmount = 0;
    let statement = `SELECT userid FROM User_Has_Quiz WHERE quizid = ${quizId}`;
    db.all(statement, function (err,rows) {
        if (err) {
            console.log(err.message)
        }else {
            console.log(rows);
            userAmount = rows.length;
        }
    })
    return userAmount;
};

module.exports.GetAmountOfQuizesUserParticipateIn = function (db,userId) {
    let quizAmount = 0;
    let statement = `SELECT quizId FROM User_Has_Quiz WHERE userid = ${userId}`;

    db.all(statement, function (err,rows) {
        if (err) {
            console.log(err.message);
        }else {
            console.log(rows);
            quizAmount = rows.length
        }
    })
    return quizAmount;
}

module.exports.GetAllQuestionInQuiz = function (db,quizId) {
    let statement = `SELECT Q.questionText,Q.questionObject,Q.questionSolution,T.questionType,QQ.quizId
                     FROM Question AS Q
                     INNER JOIN Quiz_has_Question AS QQ ON QQ.questionId = Q.questionId
                     INNER JOIN Type AS T ON T.questionType = Q.questionType
                     WHERE QQ.quizId = ${quizId};`;
    db.all(statement,function (err,rows) {
        if (err) {
            console.log(err.message)
        } else {
            console.log(rows)
        }
        return rows
    });
};

module.exports.GetAllQuizWithinCourse = function(db,courseCode) {
    let statement = `SELECT Q.quizId,Q.quizName,C.courseName,C.courseCode,Q.courseSemester
                     FROM Quiz AS Q
                     INNER JOIN Course AS C ON Q.courseCode = C.courseCode 
                     WHERE C.courseCode = '${courseCode}' 
                     GROUP BY Q.quizId;`;
    db.all(statement,function (err,rows) {
        if (err) {
            console.log(err.message)
        }else{
            console.log(rows)
        }
        return rows
    })
};

