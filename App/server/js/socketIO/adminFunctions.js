const dbFunctions = require("../database/databaseFunctions").dbFunctions;

const generalFunctions =  require("../generalFunctions.js").functions;

const session = require("../session.js").Session;
const question = require("../session.js").Question;
const answer = require("../session.js").Answer;

var currentSession = undefined;

module.exports.admin = function(socket, db, user, sessions) {

    socket.on("courseListRequest", function() {
        let userInfo = "2222221" // TODO Change this to user feide id

        dbFunctions.get.userCourses(db, userInfo).then((courses) => {
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
        dbFunctions.get.allSessionWithinCourse(db, course.code, course.semester).then((sessions) => {
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
        dbFunctions.insert.session(db, session.title, c[1], c[0]).then(function (id) {
            for (let i = 0; i < session.questions.length; i++) {
                dbFunctions.insert.addQuestionToSession(db, id, session.questions[i].id);
            }
            socket.emit("addNewSessionDone");
        });
    });

    socket.on("getQuestionsInCourse", function(course) {
        dbFunctions.get.allQuestionsWithinCourse(db, course.code, course.semester).then((questions) => {
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
        dbFunctions.get.sessionById(db, sessionId).then(async function(session) {
            let result = {};
            result.questions = [];
            result.participants = session.participants;

            let totalCorrectAnswers = 0;
            
            let questions = await dbFunctions.get.allQuestionInSession(db, session.id);
            for (let i = 0; i < questions.length; i++) {
                let question = questions[i];
                let answer = await dbFunctions.get.allAnswerToQuestion(db, question.sqId);
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
        dbFunctions.get.sessionById(db, sessionId).then(async (sessionInformation) => {
            let sessionCode = generalFunctions.calculateSessionCode(sessions);
            socket.join(sessionCode);
            
            let questions = await dbFunctions.get.allQuestionInSession(db, sessionInformation.id);
            let questionList = [];
            for(let i = 0; i < questions.length; i++){
                let tempQuestion = questions[i];
                questionList.push(new question(tempQuestion.id, tempQuestion.text, tempQuestion.description, tempQuestion.object, tempQuestion.solution, tempQuestion.type, tempQuestion.time));
            }

            currentSession = {session: new session(sessionInformation.id, sessionInformation.name,
                                            sessionInformation.status, [], sessionInformation.courseSemester,
                                            sessionInformation.courseName, questionList, sessionCode),
                                adminSocket: socket}
            
            sessions.set(sessionCode, currentSession);
            
            socket.emit("initializeSessionResponse", sessionCode);
        }).catch((err) => {
            console.log(err);
            socket.emit("initializeSessionErrorResponse", "error2");
        });
    });

    socket.on("sessionOverviewRequest", function(course) {
        dbFunctions.get.allSessionWithinCourseForSessionOverview(db, course.code, course.semester).then((sessionList) => {
            socket.emit("sessionOverviewResponse", sessionList)
        }).catch((err) => {
            console.log(err);
            socket.emit("sessionOverviewErrorResponse")
        });
    })
    
    socket.on("startSessionWaitingRoom", function() {
        socket.emit("startSessionWaitingRoomResponse");
    });

    socket.on("startSession", function(sessionCode) {
        let firstQuestion = currentSession.session.questionList[0];
        let safeFirstQuestion = {
            "text": firstQuestion.text,
            "description": firstQuestion.description,
            "object": firstQuestion.object,
            "type": firstQuestion.type,
            "time": firstQuestion.time,
            "participants": currentSession.session.currentUsers
        }

        io.to(sessionCode).emit("nextQuestion", safeFirstQuestion);
    });

    socket.on("forceNextQuestion", function() {
        socket.to(currentSession.session.sessionCode).emit("adminForceNext");
        socket.emit("goToQuestionResultScreen");
    });

    socket.on("nextQuestionRequest", function() {
        currentSession.session.currentQuestion++;
        if (currentSession.session.currentQuestion < currentSession.session.questionList.length){
            let question = currentSession.session.questionList[currentSession.session.currentQuestion];
            let safeQuestion = {
                "text": question.text,
                "description": question.description,
                "object": question.object,
                "type": question.type,
                "time": question.time,
                "participants": currentSession.session.currentUsers
            }
            console.log(safeQuestion);

            io.to(currentSession.session.sessionCode).emit("nextQuestion", safeQuestion)
        } else {
            socket.to(currentSession.session.sessionCode).emit("answerResponse", "sessionFinished");
            socket.emit("endSessionScreen");
        }
    });

    socket.on("closeSession", function() {
        socket.emit("closeSessionResponse");
    });

    socket.on("getSessionWithinCourse", function(course) {   
        dbFunctions.get.allSessionWithinCourse(db, course.code, course.semester).then((sessions) => {
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
        dbFunctions.insert.addQuestionToSession(db, data.sessionId, data.questionId);
    });

    socket.on("getAllQuestionsWithinCourse", function(course) {
        dbFunctions.get.allQuestionsWithinCourse(db, course).then(questions => {
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
        dbFunctions.insert.question(db, question.text, question.description, question.solution, 60, // TODO ADD TIME
            question.solutionType, question.courseCode, question.object);
    });

    socket.on("updateQuestion", function(question) {
        console.log(question);
        dbFunctions.update.question(db, question.id, question.text, question.description,
            "TODO ADD ME", question.solution, question.solutionType, 60); // TODO ADD TIME
    });

    socket.on("getQuestionTypes", function() {
        dbFunctions.get.questionTypes(db).then(types => {
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