const get = require("../database/databaseFunctions").get;
const insert = require("../database/databaseFunctions").insert;
const update = require("../database/databaseFunctions").update;

const generalFunctions =  require("../generalFunctions.js").functions;

const quiz = require("../quiz.js").Quiz;
const question = require("../quiz.js").Question;
const answer = require("../quiz.js").Answer;

let quizzes = new Map();

module.exports.admin = function(socket, db) {
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
        get.allQuizWithinCourse(db, course.code, course.semester).then((quizzes) => {
            /*let result = [];
            quizzes.forEach(quiz => {
                result.push({
                    "id": quiz.id,
                    "name": quiz.name
                });
            }); */
            socket.emit("getSessionsResponse", quizzes);
        });
    });

    socket.on("getUserStats", function() {
        /* 
        response should follow this format: 
        {
            totalCorrectAnswers: float,
            totalQuizzes: Integer,
            totalIncorrectAnswers: float,
            quizList: [
                {
                    quizName = String,
                    courseCode = String
                }, ...
            ] 	// Should be a list of all quizzes that the user has participated in.
                // Should be sorted where the last quiz is first
        }
        */
        get.quizzesToUser(db, user.feide.id).then(async function(quizzes) {
            result = {};
            result.quizList = quizzes;
            result.totalQuizzes = quizzes.length;
            
            let correct = await get.amountCorrectAnswersForUser(db, user.id);
            let wrong = await get.amountWrongAnswersForUser(db, user.id);
            result.totalCorrectAnswers = correct;
            result.totalIncorrectAnswers = wrong;
            socket.emit("getUserStatsResponse", result);
        });
    });

    socket.on("addNewSession", function(session) {
        let c = session.course.split(" ");
        insert.quiz(db, session.title, c[1], c[0]).then(function (id) {
            for (let i = 0; i < session.questions.length; i++) {
                insert.addQuestionToQuiz(db, id, session.questions[i].id);
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
        get.quizById(db, sessionId).then(async function(quiz) {
            let result = {};
            result.questions = [];
            result.participants = quiz.participants;

            let totalCorrectAnswers = 0;
            
            let questions = await get.allQuestionInQuiz(db, quiz.id);
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
                    "correctAnswers": Math.round(correctAnswers / quiz.participants * 100),
                    "answers": answers 
                });
            }
            result.correctAnswers = Math.round(totalCorrectAnswers / (result.questions.length * result.participants) * 100);
            result.numberOfQuestions = result.questions.length;
            socket.emit("getSessionResponse", result);
        });
    });

    socket.on("initializeQuiz", function(quizId){
        socket.join("quizId");
        let quizId = generalFunctions.calculateQuizCode(quizzes);
        let tempQuiz = new quiz();
        socket.emit("initializeQuizResponse", quizId);
    });
    
    socket.on("startQuizWaitingRoom", function(quizId) {
        socket.emit("startQuizWaitingRoomResponse");
    });

    socket.on("startQuiz", function(quizId) {
        // TODO remove testdata and querry database for correct information
        let response = {
            questionText: "Question 1",
            questionDescription: "Description for question 1. <solution=test>",
            questionType: "text"
        }
        socket.emit("startQuizResponse", response)
    });

    socket.on("getQuizWithinCourse", function(course) {   
        get.allQuizWithinCourse(db, course.code, course.semester).then((quizzes) => {
            let result = [];
            for (let i = 0; i < quizzes.length; i++) {
                result.push({
                    value: quizzes[i].id,
                    text: quizzes[i].name
                });
            }
            socket.emit("sendQuizWithinCourse", result);
        });
        
    });

    socket.on("addQuestionToQuiz", function(data) {
        insert.addQuestionToQuiz(db, data.quizId, data.questionId);
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