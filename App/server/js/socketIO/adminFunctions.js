const get = require("../database/databaseFunctions").get;
const insert = require("../database/databaseFunctions").insert;
const update = require("../database/databaseFunctions").update;

const generalFunctions =  require("../generalFunctions.js").functions;

const session = require("../session.js").Session;
const question = require("../session.js").Question;
const answer = require("../session.js").Answer;

var currentSession = undefined;

module.exports.admin = function(socket, db, user, sessions) {

    socket.on("courseListRequest", function() {
        let userInfo = "2222221" // TODO Change this to user feide id

        get.userCourses(db, userInfo).then((courses) => {
            let result = [];
            for (let i = 0; i < courses.length; i++) {
                let courseString = courses[i].code + " " + courses[i].semester;
                result.push({
                    "value": courseString,
                    "text": courseString
                });
            }
            socket.emit("courseListResponse", result);
        })
    });

    socket.on("getSessions", function(course) {
        get.allSessionWithinCourse(db, course.code, course.semester).then((sessions) => {
            /*let result = [];
            sessions.forEach(session => {
                result.push({
                    "id": session.id,
                    "name": session.name
                });
            }); */
            socket.emit("getSessionsResponse", sessions);
        });
    });

    socket.on("addNewSession", function(session) {
        let c = session.course.split(" ");
        insert.session(db, session.title, c[1], c[0]).then(function (id) {
            for (let i = 0; i < session.questions.length; i++) {
                insert.addQuestionToSession(db, id, session.questions[i].id);
            }
            socket.emit("addNewSessionDone");
        });
    });

    socket.on("getQuestionsInCourse", function(course) {
        get.allQuestionsWithinCourse(db, course.code, course.semester).then((questions) => {
            let result = [];
            for (let i = 0; i < questions.length; i++) {
                result.push({
                    value: questions[i].id,
                    text: questions[i].text 
                });
            }
            socket.emit("sendQuestionsInCourse", result);
        });
    });

    socket.on("getSession", function(sessionId) {
        get.sessionById(db, sessionId).then(async function(session) {
            let result = {};
            result.questions = [];
            result.participants = session.participants;

            let totalCorrectAnswers = 0;
            
            let questions = await get.allQuestionInSession(db, session.id);
            for (let i = 0; i < questions.length; i++) {
                let question = questions[i];
                let answer = await get.allAnswerToQuestion(db, question.sqId);
                let answers = [];
                let correctAnswers = 0;

                answer.forEach(a => {
                    if (a.result == 1) {
                        correctAnswers++;
                        totalCorrectAnswers++;
                    }

                    if(a.result != "1"){
                        answers.push({
                            "answer": a.object,
                            "result": a.result
                        });
                    }
                });

                result.questions.push({
                    "sqId": question.sqId, 
                    "text": question.text,
                    "description": question.description,
                    "correctAnswers": Math.round(correctAnswers / session.participants * 100),
                    "answers": answers 
                });
            }
            result.correctAnswers = Math.round(totalCorrectAnswers / (result.questions.length * result.participants) * 100);
            result.numberOfQuestions = result.questions.length;
            socket.emit("getSessionResponse", result);
        });
    });

    socket.on("initializeSession", function(sessionId){
        if(currentSession != undefined) socket.emit("initializeSessionErrorResponse", "error1")
        get.sessionById(db, sessionId).then(async (sessionInformation) => {
            let sessionCode = generalFunctions.calculateSessionCode(sessions);
            socket.join(sessionCode);
            
            let questions = await get.allQuestionInSession(db, sessionInformation.id);
            let questionList = [];

            currentSession = new session(sessionInformation.id, sessionInformation.name,
                                            sessionInformation.status, [], sessionInformation.courseSemester,
                                            sessionInformation.courseName, questionList, sessionCode);

            sessions.set(sessionCode, currentSession);
            
            socket.emit("initializeSessionResponse", sessionCode);
        }).catch((err) => {
            console.log(err);
            socket.emit("initializeSessionErrorResponse", "error2");
        });
    });

    socket.on("sessionOverviewRequest", function(course) {
        get.allSessionWithinCourseForSessionOverview(db, course.code, course.semester).then((sessionList) => {
            socket.emit("sessionOverviewResponse", sessionList)
        }).catch((err) => {
            console.log(err);
            socket.emit("sessionOverviewErrorResponse")
        });
    })
    
    socket.on("startSessionWaitingRoom", function(sessionId) {
        socket.emit("startSessionWaitingRoomResponse");
    });

    socket.on("startSession", function(sessionId) {
        // TODO remove testdata and querry database for correct information
        let response = {
            questionText: "Question 1",
            questionDescription: "Description for question 1. <solution=test>",
            questionType: "text"
        }
    });

    socket.on("getSessionWithinCourse", function(course) {   
        get.allSessionWithinCourse(db, course.code, course.semester).then((sessions) => {
            let result = [];
            for (let i = 0; i < sessions.length; i++) {
                result.push({
                    value: sessions[i].id,
                    text: sessions[i].name
                });
            }
            socket.emit("sendSessionWithinCourse", result);
        });
        
    });

    socket.on("addQuestionToSession", function(data) {
        insert.addQuestionToSession(db, data.sessionId, data.questionId);
    });

    socket.on("getAllQuestionsWithinCourse", function(course) {
        get.allQuestionsWithinCourse(db, course).then(questions => {
            let result = [];
            for (let i = 0; i < questions.length; i++) {
                let q = questions[i];
                result.push({
                    id: q.id,
                    text: q.text,
                    description: q.description,
                    solutionType: q.type,
                    solution: q.solution
                })
            }
            socket.emit("sendAllQuestionsWithinCourse", result);
        });
    });

    socket.on("addNewQuestion", function(question) {
        insert.question(db, question.text, question.description, question.solution, 60, // TODO ADD TIME
            question.solutionType, question.courseCode, question.object);
    });

    socket.on("updateQuestion", function(question) {
        console.log(question);
        update.question(db, question.id, question.text, question.description,
            "TODO ADD ME", question.solution, question.solutionType, 60); // TODO ADD TIME
    });

    socket.on("getQuestionTypes", function() {
        get.questionTypes(db).then(types => {
            let result = [];
            for (let i = 0; i < types.length; i++) {
                result.push({
                    value: types[i].type,
                    text: types[i].name
                })
            }
            socket.emit("sendQuestionTypes", result);    
        });
    });
}