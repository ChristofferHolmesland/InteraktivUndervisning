method.exports.InsertData = function (db) {

    //dummy info
    var ids = [];   //contains id from 1 to 1000
    for (let i = 1; i <= 1000; i++) {
        ids.push(i);
    }

    var coursesInfo = [
        {courseSemester: "17V", courseCode: "DAT100", courseName: "Objektorientert programmering"},
        {courseSemester: "17H", courseCode: "DAT200", courseName: "Algoritmer og Datastrukturer"},
        {courseSemester: "16H", courseCode: "MAT100", courseName: "Matematiske metoder 1"},
        {courseSemester: "17V", courseCode: "MAT200", courseName: "Matematiske metoder 2"},
        {courseSemester: "17V", courseCode: "DAT320", courseName: "Operativsystemer og Systemprogrammering"},
        {courseSemester: "17V", courseCode: "DAT310", courseName: "Webprogrammering"},
        {courseSemester: "16V", courseCode: "DAT100", courseName: "Objektorientert programmering"},
        {courseSemester: "18V", courseCode: "STA100", courseName: "Sannsynlighetsregning og statestikk 1"},
        {courseSemester: "18V", courseCode: "DAT100", courseName: "Objektorientert programmering"},
        {courseSemester: "17H", courseCode: "ELE210", courseName: "Datamaskinarkitektur"},
        {courseSemester: "15V", courseCode: "MAT200", courseName: "Matematiske metoder 2"},
        {courseSemester: "13H", courseCode: "DAT200", courseName: "Algoritmer og Datastrukturer"},
        {courseSemester: "18H", courseCode: "DAT200", courseName: "Algoritmer og Datastrukturer"},
        {courseSemester: "15H", courseCode: "DAT200", courseName: "Algoritmer og Datastrukturer"},
        {courseSemester: "14H", courseCode: "DAT200", courseName: "Algoritmer og Datastrukturer"},
        {courseSemester: "19H", courseCode: "DAT200", courseName: "Algoritmer og Datastrukturer"},
        {courseSemester: "17V", courseCode: "DAT230", courseName: "Kommunikasjonsteknologi 1"},
        {courseSemester: "15H", courseCode: "MAT200", courseName: "Matematiske metoder 2"},
        {courseSemester: "18V", courseCode: "DAT310", courseName: "Webprogrammering"},
        {courseSemester: "12H", courseCode: "DAT200", courseName: "Algoritmer og Datastrukturer"},

    ];

    var quizInfo = [
        {quizName: "quizName", courseSemester: "17H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "17H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "17H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "15H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "17H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "17H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "16H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "15H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "16H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "17H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "17H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "17H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "18H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "19H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "18H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "15H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "17H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "12H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "12H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "17H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "17H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "12H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "13H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "17H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "13H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "13H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "13H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "17H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "17H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "17H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "18H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "17H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "17H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "18H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "18H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "18H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "17H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "17H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "18H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "18H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "18H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "17H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "17H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "17V", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "17H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "13H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "12H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "17H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "19H", courseCode: "DAT200"},
        {quizName: "quizName", courseSemester: "19H", courseCode: "DAT200"},
    ];


     //#Creating Insert Statements

    //Creating Feide Insert
    var sqlInsertFeide = "INSERT INTO Feide(feideId,feideAccessToken,feideName) VALUES";
    for (let k = 0; k < ids.length; k++) {
        let addstring = "";
        if (k === 0) {
            addstring = "(" + ids[k] + ",\'" + "FeideAccess" + ids[k] + "\',\'" + "feideName" + ids[k] + "\')";
        } else {
            addstring = ",(" + ids[k] + ",\'" + "FeideAccess" + ids[k] + "\',\'" + "feideName" + ids[k] + "\')";
        }
        sqlInsertFeide += addstring;
    }
    sqlInsertFeide += ";";

    //Creating Type Insert
    var sqlInsertType = "INSERT INTO Type(questionType,typeName) VALUES";
    for (let l = 0; l < 20; l++) {
        let addstring = "";
        if (l === 0) {
            addstring = "(" + ids[l] + ",\'" + "TypeName" + ids[l] + "\')";
        } else {
            addstring = ",(" + ids[l] + ",\'" + "TypeName" + ids[l] + "\')";
        }
        sqlInsertType += addstring;
    }
    sqlInsertType += ";";

    //Creating Course Insert
    var sqlInsertCourse = "INSERT INTO Course(courseSemester,courseCode,courseName) VALUES";
    for (let m = 0; m < coursesInfo.length; m++) {
        let addstring = "";
        if (m === 0) {
            addstring = `('${coursesInfo[m].courseSemester}','${coursesInfo[m].courseCode}','${coursesInfo[m].courseName}')`;
        } else {
            addstring = `,('${coursesInfo[m].courseSemester}','${coursesInfo[m].courseCode}','${coursesInfo[m].courseName}')`;
        }
        sqlInsertCourse += addstring;
    }
    sqlInsertCourse += ";";

    //Creating User Insert
    var sqlInsertUser = "INSERT INTO USER(userId,feideId) VALUES";
    for (let n = 0; n < ids.length; n++) {
        let addstring = "";
        if (n === 0) {
            addstring = "(" + ids[n] + "," + ids[n] + ")";
        } else {
            addstring = ",(" + ids[n] + "," + ids[n] + ")";
        }
        sqlInsertUser += addstring;
    }
    sqlInsertUser += ";";

    //Creating Question Insert
    var sqlInsertQuestion = "INSERT INTO Question(questionText,questionObject,questionSolution,questionType) VALUES";
    for (let o = 1; o <= ids.length; o++) {
        let addstring = "";
        let questiontype = 1;
        if (o > 20) {
            if (o > 20 && o % 20 === 0) {
                questiontype = 20
            } else {
                questiontype = o % 20;
            }
        } else {
            questiontype = o;
        }
        if (o === 1) {
            addstring = "('" + "QuestionText" + o + "','" + "QuestionObject" + o + "','" + "QuestionSolution" + o + "','" + questiontype + "')";
        } else {
            addstring = ",('" + "QuestionText" + o + "','" + "QuestionObject" + o + "','" + "QuestionSolution" + o + "','" + questiontype + "')";
        }
        sqlInsertQuestion += addstring;
    }
    sqlInsertQuestion += ";";

    //Create Insert Quiz
    var sqlInsertQuiz = "Insert INTO Quiz(quizName,courseSemester,courseCode) VALUES";
    for (let p = 0; p < quizInfo.length; p++) {
        let addstring = "";
        if (p === 0) {
            addstring = `('${quizInfo[p].quizName}${ids[p]}','${quizInfo[p].courseSemester}','${quizInfo[p].courseCode}')`;
        } else {
            addstring = `,('${quizInfo[p].quizName}${ids[p]}','${quizInfo[p].courseSemester}','${quizInfo[p].courseCode}')`
        }
        sqlInsertQuiz += addstring;
    }
    sqlInsertQuiz += ";";

    //Create Insert UserRight
    var sqlInsertUserRight = "INSERT INTO UserRight(feideId,courseSemester,courseCode,level) VALUES";
    for (let t = 0; t < quizInfo.length; t++) {
        let addstring = "";
        if (t === 0) {
            addstring = `('${ids[t]}','${quizInfo[t].courseSemester}','${quizInfo[t].courseCode}',5)`;
        } else if (t < 10 && t > 0) {
            addstring = `,('${ids[t]}','${quizInfo[t].courseSemester}','${quizInfo[t].courseCode}',1)`
        } else if (t >= 10 && t < 20) {
            addstring = `,('${ids[t]}','${quizInfo[t].courseSemester}','${quizInfo[t].courseCode}',2)`;
        } else if (t >= 20 && t < 30) {
            addstring = `,('${ids[t]}','${quizInfo[t].courseSemester}','${quizInfo[t].courseCode}',3)`;
        } else if (t >= 30 && t < 40) {
            addstring = `,('${ids[t]}','${quizInfo[t].courseSemester}','${quizInfo[t].courseCode}',4)`;
        } else {
            addstring = `,('${ids[t]}','${quizInfo[t].courseSemester}','${quizInfo[t].courseCode}',0)`;
        }
        sqlInsertUserRight += addstring;
    }
    sqlInsertUserRight += ";";

    //Create Insert UserHasQuiz
    var sqlInsertUserHasQuiz = "INSERT INTO User_has_Quiz(userid,quizid) VALUES";
    for (let q = 0; q < quizInfo.length; q++) {
        let addstring = "";
        let quizId = q + 1;
        if (q === 0) {
            addstring = "(\'" + ids[q] + "\'," + quizId + ")";
        } else {
            addstring = ",(\'" + ids[q] + "\'," + quizId + ")";
        }
        sqlInsertUserHasQuiz += addstring
    }
    sqlInsertUserHasQuiz += ";";

    //Create Insert QuizHasQuestion
    var quizId = 0;
    var sqlInsertQuizHasQuestion = "INSERT INTO Quiz_has_Question(quizId,questionId) VALUES";
    for (let r = 0; r < 501; r++) {
        let addstring = "";

        if (r % 10 === 0 && r !== 500 && r !== 0) {
            quizId++;
        }

        if (r === 0) {
            addstring = `(${ids[quizId]},${ids[r]})`
        } else {
            addstring = `,(${ids[quizId]},${ids[r]})`
        }
        sqlInsertQuizHasQuestion += addstring;
    }
    sqlInsertQuizHasQuestion += ";";

    //Create Insert Answer
    var sqlInsertAnswer = "INSERT INTO Answer(answerObject,questionId,userId) VALUES";
    for (let s = 0; s < ids.length; s++) {
        let addstring = "";
        if (s === 0) {
            addstring = `('answerObject${ids[s]}.${ids[s]}',${ids[s]},${ids[s]})`;
        } else {
            addstring = `,('answerObject${ids[s]}.${ids[s]}',${ids[s]},${ids[s]})`;
        }
        sqlInsertAnswer += addstring;
    }
    sqlInsertAnswer += ";";

    //Running the insert statements
    db.serialize(function () {
        db.run(sqlInsertFeide, function (err) {
            if (err) {
                console.error("An error occurred in Feide " + err.message);
            } else {
                console.log("elements added to Feide");
            }
        });

        db.run(sqlInsertType, function (err) {
            if (err) {
                console.error("An error occurred in Type " + err.message);
            } else {
                console.log("elements added to Type");
            }
        });

        db.run(sqlInsertCourse, function (err) {
            if (err) {
                console.error("An error occurred in Course " + err.message);
            } else {
                console.log("elements added to Course");
            }
        });

        db.run(sqlInsertUser, function (err) {
            if (err) {
                console.error("An error occurred in User " + err.message);
            } else {
                console.log("elements added to User");
            }
        });

        db.run(sqlInsertQuestion, function (err) {
            if (err) {
                console.error("An error occurred in Question " + err.message);
            } else {
                console.log("elements added to Question");
            }
        });

        db.run(sqlInsertQuiz, function (err) {
            if (err) {
                console.error("An error occurred in Quiz " + err.message);
            } else {
                console.log("elements added to Quiz");
            }
        });

        db.run(sqlInsertUserRight, function (err) {
            if (err) {
                console.error("An error occurred in UserRight " + err.message);
            } else {
                console.log("elements added to UserRight");
            }
        });

        db.run(sqlInsertUserHasQuiz, function (err) {
            if (err) {
                console.error("An error occurred in UserHasQuiz " + err.message);
            } else {
                console.log("elements added to UserHasQuiz");
            }
        });

        db.run(sqlInsertQuizHasQuestion, function (err) {
            if (err) {
                console.error("An error occurred in QuizHasQuestion " + err.message);
            } else {
                console.log("elements added to QuizHasQuestion");
            }
        });

        db.run(sqlInsertAnswer, function (err) {
            if (err) {
                console.error("An error occurred in Answer " + err.message);
            } else {
                console.log("elements added to Answer");
            }
        });
    });
};
