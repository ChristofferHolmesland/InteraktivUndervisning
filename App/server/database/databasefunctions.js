//Database functions

/*Notes
    db.get() will only return 1 row, therefore the ids should be used as the identifier.
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
  let statement = `Insert INTO User(userId) VALUES (${userId})`;
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
    let statement = `INSERT INTO Course(courseSemester,courseCode,courseName) VALUES ('${courseSemester}','${courseCode}','${courseName}'`;
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

module.exports.AddQuestionToQuiz = function (db,quizId,questionId) {
    let statement = `INSERT INTO Quiz_has_Question(quizId,questionId) VALUES(${quizId},${questionId})`;
    db.run(statement, function (err) {
        if (err) {
            console.log(err.message);
        }
    })
};