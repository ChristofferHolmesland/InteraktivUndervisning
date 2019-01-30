const get = require("../database/databaseFunctions").get;
const insert = require("../database/databaseFunctions").insert;
const update = require("../database/databaseFunctions").update;

const generalFunctions =  require("../generalFunctions.js").functions;

const session = require("../session.js").Session;
const question = require("../session.js").Question;
const answer = require("../session.js").Answer;

module.exports.admin = function(socket, db, sessions) {
    socket.on("adminStarted", function() {
            
    });

    socket.on("courseListRequest", function(feideId) {
        get.userCourses(db, feideId).then((courses) => {
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

    socket.on("getCourses", function() {
        get.allCourses(db).then((courses) => {
            let result = [];
            for (let i = 0; i < courses.length; i++) {
                result.push({
                    code: courses[i].code,
                    semester: courses[i].semester
                });
            }
            socket.emit("sendCourses", result);
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
                let answer = await get.allAnswerToQuestion(db, question.qqId);
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
                    "qqId": question.qqId, 
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
        let sessionCode = generalFunctions.calculateSessionCode(sessions);
        socket.join(sessionCode);
        let tempSession = new session();
        socket.emit("initializeSessionResponse", sessionId);
    });
    
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
        insert.question(db, question.text, question.description, question.solution, 
            question.solutionType, question.courseCode, question.object);
    });

    socket.on("updateQuestion", function(question) {
        update.editQuestion(db, question.id, question.text, question.description, 
            question.object, question.solution, question.solutionType);
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