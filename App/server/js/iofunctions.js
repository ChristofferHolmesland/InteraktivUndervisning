const socketio = require('socket.io');
const locales = (require("../localization/localeLoader.js")).locales;
const User = (require("./user.js")).User;
const anonymousNames = (require("./anonymousName.js")).Animals;
const cookie = require('cookie');

const get = require("./database/databaseFunctions").get;
const insert = require("./database/databaseFunctions").insert;
const update = require("./database/databaseFunctions").update;

module.exports.listen = function(server, users, db) {
    io = socketio.listen(server, {
        cookie: false
    });
    io.on("connection", function(socket) {

        // On new connection, checks if user has a cookie with userId and verifies the user
        let user = User.getUser(users, socket);

        // Function "decorator" which checks user rights before calling the original function
        function rights(level, func, ...args) {
            if(user && user.userRights < level) {
                socket.emit("unauthorizesAccess");
                return;
            }
            func(...args);
        }

        //--------------------------------------------//
        //------------- Common functions -------------//
        //--------------------------------------------//

        socket.on('disconnect', function(){
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

        socket.on("adminStarted", () => rights(4, function() {}));

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
                
                let questions = await get.allQuestionInQuiz(db, quiz.id);
                questions.forEach(question => {
                    get.allAnswerToQuestion(db, question.id).then(answer => {
                        let answers = [];
                        let correctAnswers = 0;
    
                        answer.forEach(a => {
                            if (a.result == 1) {
                                correctAnswers++;
                            }
    
                            answers.push({
                                "answer": a.object,
                                "result": a.result
                            });
                        });
    
                        result.push({
                            "text": question.text,
                            "description": question.description,
                            "correctAnswers": correctAnswers,
                            "answers": answers 
                        });
                    })
                });

                socket.emit("getSessionResponse", result);
            });
            
            // TODO remove testdata
            let testdata = {
                "1": {
                    questions: [
                        {
                            text: "Question text 1 session 1",
                            description: "Question description 1 session 1",
                            correctAnswers: 50,
                            answers: [
                                {
                                    answer: "Answer 1 Question 1 Session 1",
                                    correct: "1"
                                }, 
                                {
                                    answer: "Answer 2 Question 1 Session 1",
                                    correct: "1"
                                }, 
                                {
                                    answer: "Answer 3 Question 1 Session 1",
                                    correct: "0"
                                }, 
                                {
                                    answer: "Answer 4 Question 1 Session 1",
                                    correct: "-1"
                                }
                            ]
                        },
                        {
                            text: "Question text 2 session 1",
                            description: "Question description 2 session 1",
                            correctAnswers: 50,
                            answers: [
                                {
                                    answer: "Answer 1 Question 2 Session 1",
                                    correct: "1"
                                }, 
                                {
                                    answer: "Answer 2 Question 2 Session 1",
                                    correct: "1"
                                }, 
                                {
                                    answer: "Answer 3 Question 2 Session 1",
                                    correct: "0"
                                }, 
                                {
                                    answer: "Answer 4 Question 2 Session 1",
                                    correct: "-1"
                                }
                            ]
                        },
                        {
                            text: "Question text 3 session 1",
                            description: "Question description 3 session 1",
                            correctAnswers: 50,
                            answers: [
                                {
                                    answer: "Answer 1 Question 3 Session 1",
                                    correct: "1"
                                }, 
                                {
                                    answer: "Answer 2 Question 3 Session 1",
                                    correct: "1"
                                }, 
                                {
                                    answer: "Answer 3 Question 3 Session 1",
                                    correct: "0"
                                }, 
                                {
                                    answer: "Answer 4 Question 3 Session 1",
                                    correct: "-1"
                                }
                            ]
                        },
                        {
                            text: "Question text 4 session 1",
                            description: "Question description 4 session 1",
                            correctAnswers: 50,
                            answers: [
                                {
                                    answer: "Answer 1 Question 4 Session 1",
                                    correct: "1"
                                }, 
                                {
                                    answer: "Answer 2 Question 4 Session 1",
                                    correct: "1"
                                }, 
                                {
                                    answer: "Answer 3 Question 4 Session 1",
                                    correct: "0"
                                }, 
                                {
                                    answer: "Answer 4 Question 4 Session 1",
                                    correct: "-1"
                                }
                            ]
                        }
                    ],
                    participants: 4,
                    correctAnswers: 50,
                    didntKnow: 25,
                    numberOfQuestions: 4
                },
                "2": {
                    questions: [
                        {
                            text: "Question text 1 session 2",
                            description: "Question description 1 session 2",
                            correctAnswers: 50,
                            answers: [
                                {
                                    answer: "Answer 1 Question 1 Session 2",
                                    correct: "1"
                                }, 
                                {
                                    answer: "Answer 2 Question 1 Session 2",
                                    correct: "1"
                                }, 
                                {
                                    answer: "Answer 3 Question 1 Session 2",
                                    correct: "0"
                                }, 
                                {
                                    answer: "Answer 4 Question 1 Session 2",
                                    correct: "-1"
                                }
                            ]
                        },
                        {
                            text: "Question text 2 session 2",
                            description: "Question description 2 session 2",
                            correctAnswers: 50,
                            answers: [
                                {
                                    answer: "Answer 1 Question 2 Session 2",
                                    correct: "1"
                                }, 
                                {
                                    answer: "Answer 2 Question 2 Session 2",
                                    correct: "1"
                                }, 
                                {
                                    answer: "Answer 3 Question 2 Session 2",
                                    correct: "0"
                                }, 
                                {
                                    answer: "Answer 4 Question 2 Session 2",
                                    correct: "-1"
                                }
                            ]
                        },
                        {
                            text: "Question text 3 session 2",
                            description: "Question description 3 session 2",
                            correctAnswers: 50,
                            answers: [
                                {
                                    answer: "Answer 1 Question 3 Session 2",
                                    correct: "1"
                                }, 
                                {
                                    answer: "Answer 2 Question 3 Session 2",
                                    correct: "1"
                                }, 
                                {
                                    answer: "Answer 3 Question 3 Session 2",
                                    correct: "0"
                                }, 
                                {
                                    answer: "Answer 4 Question 3 Session 2",
                                    correct: "-1"
                                }
                            ]
                        },
                        {
                            text: "Question text 4 session 2",
                            description: "Question description 4 session 2",
                            correctAnswers: 50,
                            answers: [
                                {
                                    answer: "Answer 1 Question 4 Session 2",
                                    correct: "1"
                                }, 
                                {
                                    answer: "Answer 2 Question 4 Session 2",
                                    correct: "1"
                                }, 
                                {
                                    answer: "Answer 3 Question 4 Session 2",
                                    correct: "0"
                                }, 
                                {
                                    answer: "Answer 4 Question 4 Session 2",
                                    correct: "-1"
                                }
                            ]
                        }
                    ],
                    participants: 4,
                    correctAnswers: 50,
                    didntKnow: 25,
                    numberOfQuestions: 4
                },
                "3": {
                    questions: [
                        {
                            text: "Question text 1 session 3",
                            description: "Question description 1 session 3",
                            correctAnswers: 50,
                            answers: [
                                {
                                    answer: "Answer 1 Question 1 Session 3",
                                    correct: "1"
                                }, 
                                {
                                    answer: "Answer 2 Question 1 Session 3",
                                    correct: "1"
                                }, 
                                {
                                    answer: "Answer 3 Question 1 Session 3",
                                    correct: "0"
                                }, 
                                {
                                    answer: "Answer 4 Question 1 Session 3",
                                    correct: "-1"
                                }
                            ]
                        },
                        {
                            text: "Question text 2 session 3",
                            description: "Question description 2 session 3",
                            correctAnswers: 50,
                            answers: [
                                {
                                    answer: "Answer 1 Question 2 Session 3",
                                    correct: "1"
                                }, 
                                {
                                    answer: "Answer 2 Question 2 Session 3",
                                    correct: "1"
                                }, 
                                {
                                    answer: "Answer 3 Question 2 Session 3",
                                    correct: "0"
                                }, 
                                {
                                    answer: "Answer 4 Question 2 Session 3",
                                    correct: "-1"
                                }
                            ]
                        },
                        {
                            text: "Question text 3 session 3",
                            description: "Question description 3 session 3",
                            correctAnswers: 50,
                            answers: [
                                {
                                    answer: "Answer 1 Question 3 Session 3",
                                    correct: "1"
                                }, 
                                {
                                    answer: "Answer 2 Question 3 Session 3",
                                    correct: "1"
                                }, 
                                {
                                    answer: "Answer 3 Question 3 Session 3",
                                    correct: "0"
                                }, 
                                {
                                    answer: "Answer 4 Question 3 Session 3",
                                    correct: "-1"
                                }
                            ]
                        },
                        {
                            text: "Question text 4 session 3",
                            description: "Question description 4 session 3",
                            correctAnswers: 50,
                            answers: [
                                {
                                    answer: "Answer 1 Question 4 Session 3",
                                    correct: "1"
                                }, 
                                {
                                    answer: "Answer 2 Question 4 Session 3",
                                    correct: "1"
                                }, 
                                {
                                    answer: "Answer 3 Question 4 Session 3",
                                    correct: "0"
                                }, 
                                {
                                    answer: "Answer 4 Question 4 Session 3",
                                    correct: "-1"
                                }
                            ]
                        }
                    ],
                    participants: 4,
                    correctAnswers: 50,
                    didntKnow: 25,
                    numberOfQuestions: 4
                },
                "4": {
                    questions: [
                        {
                            text: "Question text 1 session 4",
                            description: "Question description 1 session 4",
                            correctAnswers: 50,
                            answers: [
                                {
                                    answer: "Answer 1 Question 1 Session 4",
                                    correct: "1"
                                }, 
                                {
                                    answer: "Answer 2 Question 1 Session 4",
                                    correct: "1"
                                }, 
                                {
                                    answer: "Answer 3 Question 1 Session 4",
                                    correct: "0"
                                }, 
                                {
                                    answer: "Answer 4 Question 1 Session 4",
                                    correct: "-1"
                                }
                            ]
                        },
                        {
                            text: "Question text 2 session 4",
                            description: "Question description 2 session 4",
                            correctAnswers: 50,
                            answers: [
                                {
                                    answer: "Answer 1 Question 2 Session 4",
                                    correct: "1"
                                }, 
                                {
                                    answer: "Answer 2 Question 2 Session 4",
                                    correct: "1"
                                }, 
                                {
                                    answer: "Answer 3 Question 2 Session 4",
                                    correct: "0"
                                }, 
                                {
                                    answer: "Answer 4 Question 2 Session 4",
                                    correct: "-1"
                                }
                            ]
                        },
                        {
                            text: "Question text 3 session 4",
                            description: "Question description 3 session 4",
                            correctAnswers: 50,
                            answers: [
                                {
                                    answer: "Answer 1 Question 3 Session 4",
                                    correct: "1"
                                }, 
                                {
                                    answer: "Answer 2 Question 3 Session 4",
                                    correct: "1"
                                }, 
                                {
                                    answer: "Answer 3 Question 3 Session 4",
                                    correct: "0"
                                }, 
                                {
                                    answer: "Answer 4 Question 3 Session 4",
                                    correct: "-1"
                                }
                            ]
                        },
                        {
                            text: "Question text 4 session 4",
                            description: "Question description 4 session 4",
                            correctAnswers: 50,
                            answers: [
                                {
                                    answer: "Answer 1 Question 4 Session 4",
                                    correct: "1"
                                }, 
                                {
                                    answer: "Answer 2 Question 4 Session 4",
                                    correct: "1"
                                }, 
                                {
                                    answer: "Answer 3 Question 4 Session 4",
                                    correct: "0"
                                }, 
                                {
                                    answer: "Answer 4 Question 4 Session 4",
                                    correct: "-1"
                                }
                            ]
                        }
                    ],
                    participants: 4,
                    correctAnswers: 50,
                    didntKnow: 25,
                    numberOfQuestions: 4
                }
            }
        }, data));

        socket.on("initializeQuiz", function(quizId){
            socket.join("quizId");
            socket.emit("initializeQuizResponse", quizId);
        });
        
        socket.on("startQuizWaitingRoom", function(quizId) {
            console.log(quizId);
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
            get.allQuizWithinCourse(db, course).then((quizzes) => {
                let result = [];
                for (let i = 0; i < quizzes.length; i++) {
                    result.push({
                        value: quizzes[i].id,
                        text: quizzes[i].name
                    });
                }
                socket.emit("sendQuizWithinCourse", result);
            });
            
            //socket.emit("sendQuizWithinCourse", [{value: 1, text: "Grap222hs"}, {value: 2, text: "Sor23523ting"}]);
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
                        solutionType: q.typeName,
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
            update.question(db, question.id, question.text, question.description, 
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
