const socketio = require('socket.io');
const locales = (require("../../localization/localeLoader.js")).locales;
const User = (require("../user.js")).User;
const anonymousNames = (require("../anonymousName.js")).Animals;
const cookie = require('cookie');

const get = require("../database/databaseFunctions").get;
const insert = require("../database/databaseFunctions").insert;
const update = require("../database/databaseFunctions").update;

const generalFunctions =  require("../generalFunctions.js").functions;

const quiz = require("../quiz.js").Quiz;
const question = require("../quiz.js").Question;
const answer = require("../quiz.js").Answer;

let quizzes = new Map();

module.exports.listen = function(server, users, db) {
    io = socketio.listen(server, {
        cookie: false
    });
    io.on("connection", function(socket) {

        // On new connection, checks if user has a cookie with userId and verifies the user
        let user = User.getUser(users, socket);

        // Function "decorator" which checks user rights before calling the original function
        function rights(level, func, ...args) {
            if(user === undefined || user.userRights < level) {
                socket.emit("unauthorizedAccess");
                return;
            }
            func(...args);
        }

        //--------------------------------------------//
        //------------- Common functions -------------//
        //--------------------------------------------//

        socket.on('disconnect', function(){
			// TODO handle socket disconnect
        });

        socket.on("signOutRequest", function(){
            if(user.feide != undefined){
                socket.emit("deleteCookie", user.sessionId);
            }

            users.delete(user.sessionId);
            socket.emit("signOutResponse");
        });

        socket.on("getLocaleRequest", function(locale) {
            socket.emit("getLocaleResponse", {"locale": locales[locale], "localeList": locales.localeList});
        });

        //--------------------------------------------//
        //------------- Guest functions --------------//
        //--------------------------------------------//

        socket.on("loginAnonymouslyRequest", function(){
            tempKey = socket.id;
            // TODO change userrights to 1 on the line under
            tempUser = new User(4, "Anonymous " + anonymousNames.getRandomAnimal(), tempKey, undefined);
            users.set(tempKey, tempUser);
            socket.emit("loginAnonymouslyResponse");

            user = users.get(socket.id);
            socket.emit("clientLoginInfoResponse", {
                "username": user.userName,
                "loggedIn": true,
                "userRights": user.userRights
            });
        });
        
        //--------------------------------------------//
        //------------- Client functions -------------//
        //--------------------------------------------//

        socket.on("clientStarted", () => rights(1, function() {}))

        socket.on("clientLoginInfoRequest", function() {
            if(user){
                socket.emit("clientLoginInfoResponse", {
                    "username": user.userName, 
                    "loggedIn": true,
                    "userRights": user.userRights,
                    "feideId": user.feide.idNumber
                });
            }
        });

        //--------------------------------------------//
        //------------- Student Assistant -------------//
        //--------------------------------------------//

        socket.on("studAssStarted", () => rights(3, function() {}));

        //--------------------------------------------//
        //------------- Admin functions -------------//
        //--------------------------------------------//

        socket.on("adminStarted", () => rights(4, function() {
            
        }));

        socket.on("courseListRequest", (data) => rights(4, function(feideId) {
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
        }, data));

        socket.on("getSessions", (data) => rights(4, function(course) {
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
        }, data));

        /* response should follow this format: 
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
        socket.on("getUserStats", () => rights(2, function() {	
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
		}));

        socket.on("addNewSession", (data) => rights(4, function(session) {
            let c = session.course.split(" ");
            insert.quiz(db, session.title, c[1], c[0]).then(function (id) {
                for (let i = 0; i < session.questions.length; i++) {
                    insert.addQuestionToQuiz(db, id, session.questions[i].id);
                }
                socket.emit("addNewSessionDone");
            });
        }, data));

        socket.on("getQuestionsInCourse", (data) => rights(4, function(course) {
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
        }, data));

        socket.on("getCourses", () => rights(4, function() {
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
        }));

        socket.on("getSession", (data) => rights(4, function(sessionId) {
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
        }, data));

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

      	socket.on("getQuizWithinCourse", (data) => rights(4, function(course) {   
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
            
        }, data));

        socket.on("addQuestionToQuiz", (data) => rights(4, function(data) {
            insert.addQuestionToQuiz(db, data.quizId, data.questionId);
        }, data));

        socket.on("getAllQuestionsWithinCourse", (data) => rights(4, function(course) {
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
        }, data));

        socket.on("addNewQuestion", (data) => rights(4, function(question) {
            insert.question(db, question.text, question.description, question.solution, 
                question.solutionType, question.courseCode, question.object);
        }, data));

        socket.on("updateQuestion", (data) => rights(4, function(question) {
            update.editQuestion(db, question.id, question.text, question.description, 
                question.object, question.solution, question.solutionType);
        }, data));

        socket.on("getQuestionTypes", () => rights(4, function() {
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
        }));
    });

    return io;
}
