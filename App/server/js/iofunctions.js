const socketio = require('socket.io');
const locales = (require("../localization/localeLoader.js")).locales;
const User = (require("./user.js")).User;
const anonymousNames = (require("./anonymousName.js")).Animals;
const cookie = require('cookie');

module.exports.listen = function(server, users) {
    io = socketio.listen(server, {
        cookie: false
    });
    io.on("connection", function(socket) {

        // On new connection, checks if user has a cookie with userId and verifies the user
        let user = User.getUser(users, socket);

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

        socket.on("clientStarted", function() {
            if(user && user.userRights > 0) return;

            socket.emit("unauthorizedAccess");
        });

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

        socket.on("studAssStarted", function() {
            if(user && user.userRights == 3) return;

            socket.emit("unauthorizedAccess");
        });

        //--------------------------------------------//
        //------------- Admin functions -------------//
        //--------------------------------------------//

        socket.on("adminStarted", function() {
            if(user && user.userRights == 4) return;

            console.log(user);
            socket.emit("unauthorizedAccess");
        });

        socket.on("getSessions", function() {
            if(user && user.userRights != 4) socket.emit("unauthorizesAccess");

            // TODO remove testdata
            let testData = {
                sessions: {
                    "1": "session 1",
                    "2": "session 2",
                    "3": "session 3",
                    "4": "session 4",
                }
            }

            // TODO write code to querry data from the databse

            socket.emit("getSessionsResponse", testData);
        });

        socket.on("getSession", function(sessionId) {
            if(user && user.userRights != 4) socket.emit("unauthorizesAccess");

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

            let response = testdata[sessionId];

            // TODO write code to querry data from the database

            socket.emit("getSessionResponse", response);
        });

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
            
    });

    return io;
}
