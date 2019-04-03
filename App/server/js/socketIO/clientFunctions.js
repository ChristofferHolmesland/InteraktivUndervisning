const Answer = require("../session.js").Answer;
const dbFunctions = require("../database/databaseFunctions.js").dbFunctions;
const solutionChecker = require("../SolutionChecker/solutionChecker.js").solutionChecker;

module.exports.client = function(socket, db, user, sessions) {

    socket.on("verifySessionExists", function(sessionCode) {
        let session = sessions.get(sessionCode);
        if (session === undefined) {
            socket.emit("verifySessionExistsError");
        }
        else {
            if (user !== undefined) {
                if (user.feide !== undefined) {
                    session = session.session;
                    let userList = session.userList;
                    for (let i = 0; i < userList.length; i++) {
                        if (user.feide.idNumber === userList[i].feide.idNumber) {
                            socket.join(sessionCode);
                            if (session.currentQuestion > -1) {
                                let answerList = session.questionList[session.currentQuestion].answerList;
                                let answered = false;
                                let answer = {}

                                if (answered) {
                                    
                                }

                                else {
                                    let question = session.questionList[session.currentQuestion];


                                    if (question.resultScreen) {
                                        socket.emit("answerResponse", "waitingForAdmin")
                                    }
                                    else {
                                        let timeLeft = -1
                                        if (question.time > 0) {               
                                            timeLeft = question.time - ((Date.now() - question.timeStarted) / 1000)
                                        }     
                        
                                        let safeQuestion = {
                                            "text": question.text,
                                            "description": question.description,
                                            "object": question.object,
                                            "type": question.type,
                                            "time": timeLeft,
                                            "participants": session.currentUsers
                                        }
                        
                                        socket.emit("nextQuestion", safeQuestion);
    
                                        let adminSocket = sessions.get(sessionCode).adminSocket;
                            
                                        adminSocket.emit("updateParticipantCount", session.currentUsers);
                        
                                        let numAnswers = question.answerList.length;
                                        let participants = question.connectedUsers;
                                
                                        adminSocket.emit("updateNumberOfAnswers", numAnswers, participants);
                                    }
                                }
                            } else {

                            } 
                            break;
                        }
                    }
                }
            }
            else if (socket.rooms[sessionCode] === undefined) {
                socket.emit("verifySessionExistsError");
            }
            else {
                socket.emit("verifySessionExistsError");
            }
        }
    });

    socket.on("quickJoinRoom", async function(sessionCode) {
        if (sessions.get(sessionCode)) {
            let userId = 1;
            if (user.feide) userId = await dbFunctions.get.userId(db, {
                type: "feide",
                id: user.feide.idNumber
            }).catch((err) => {
                console.error(err);
            });

            await dbFunctions.get.sessionHasUserByUserId(db, userId).then((row) => {
                let session = sessions.get(sessionCode).session;
                if (!row) dbFunctions.insert.addUserToSession(db, userId, session.id);
                
                let question = session.questionList[session.currentQuestion];
                let adminSocket = sessions.get(sessionCode).adminSocket;
    
                session.addUser(user);
                socket.join(sessionCode);
    
                socket.emit("joinSession", sessionCode);
                
                if (session.currentQuestion > -1) {
                    let question = session.questionList[session.currentQuestion];
    
                    let timeLeft = question.time - ((Date.now() - question.timeStarted) / 1000)
    
                    let safeQuestion = {
                        "text": question.text,
                        "description": question.description,
                        "object": question.object,
                        "type": question.type,
                        "time": timeLeft,
                        "participants": session.currentUsers
                    }
    
                    socket.emit("nextQuestion", safeQuestion);
                }
    
                adminSocket.emit("updateParticipantCount", session.currentUsers);
    
                if (session.currentQuestion > -1) {
                    let numAnswers = question.answerList.length;
                    let participants = question.connectedUsers;
            
                    adminSocket.emit("updateNumberOfAnswers", numAnswers, participants);
                }
            }).catch((err) => {
                console.error(err);
            });
        } else {
            socket.emit("sessionInActive", sessionCode);
        }
    });

    socket.on("leaveSession",function (sessionCode) {
        if (!sessions.get(sessionCode)) return;
        let session = sessions.get(sessionCode).session;
        let question = session.questionList[session.currentQuestion];
        let adminSocket = sessions.get(sessionCode).adminSocket;

        session.userLeaving(socket.id);
        socket.leave(sessionCode);

        socket.emit("returnToClientDashboard");
        adminSocket.emit("updateParticipantCount", session.currentUsers);

        if (session.currentQuestion > -1) {
            let numAnswers = question.answerList.length;
            let participants = question.connectedUsers;
    
            adminSocket.emit("updateNumberOfAnswers", numAnswers, participants);

            if(numAnswers === participants) {
                let answerList = [];
                if (question.answerList) answerList = question.answerList;
        
                let filteredAnswerList = [];
                let correctAnswer = 0;
                let incorrectAnswer = 0;
                let didntKnow = 0;
                
                for (let i = 0; i < answerList.length; i++) {
                    let answer = answerList[i];
                    let filteredAnswer = {};
                    if (answer.result === 0) {
                        filteredAnswer.answerObject = answer.answerObject;
                        filteredAnswerList.push(filteredAnswer)
                        incorrectAnswer++;
                    };
                    if (answer.result === -1) didntKnow++; 
                    if (answer.result === 0) correctAnswer++;
                }
        
                let response = {
                    question: {
                        text: question.text,
                        description: question.description,
                        object: question.object,
                        type: question.type
                    },
                    solution: question.solution,
                    answerList: filteredAnswerList,
                    correctAnswer: correctAnswer,
                    incorrectAnswer: incorrectAnswer,
                    didntKnow: didntKnow,
                    users: answerList.length
                };
    
                adminSocket.emit("goToQuestionResultScreen", response);
            }
        }
    });

    socket.on("questionAnswered", async function (answerObject, sessionCode) {
        let session = sessions.get(sessionCode).session;
        let question = session.questionList[session.currentQuestion];
        let result = -1; // Default value is -1 for the users that answers that they don't know. Changed later if they did answer

        if(answerObject === null){
            answerObject = "You didn't answer";
            socket.emit("answerResponse", "betweenQuestionsNotAnswered");
        } else {
            checkedResult = solutionChecker.checkAnswer(
                JSON.parse(JSON.stringify(answerObject)),
                JSON.parse(JSON.stringify(question.solution)),
                question.type
            );

            if (checkedResult){
                result = 1;
                socket.emit("answerResponse", "betweenQuestionsCorrect")
            } else {
                result = 0;
                socket.emit("answerResponse", "betweenQuestionsIncorrect")
            }
        }

        let information = {
            answer: answerObject, 
            userId: 1, 
            session: session, 
            result: result
        };

        if(user.feide !== undefined) {
            await dbFunctions.get.userIdByFeideId(db, user.feide.idNumber).then(async (userId) => {
                information.userId = userId.id;
            }).catch((err) => {
                console.error(err);
            });
        }
        
        await insertAnswerToDatabase(information);

        question.socketsAnswered[socket.id] = true;
    });

    /*
        insertAnswerToDatabase:
        
        Example
        information = 
        { 
            answer: [ { Type: 'Initial', K: '5', List: [Array] } ],
            userId: 1,
            session:
            {
                id: 1,
                name: 'Shellsort testing session',
                status: 0,
                userList: [ [User] ],
                courseSemester: 'H19',
                courseName: undefined,
                questionList: [ [Question] ],
                sessionCode: '3421',
                currentQuestion: 0,
                currentUsers: 1 
            },
            result: 0 
        }
    */
    async function insertAnswerToDatabase(information) {
        let answer = new Answer(information.session.currentQuestion, information.userId, information.answer, information.result);
        let question = information.session.questionList[information.session.currentQuestion];
        let adminSocket = sessions.get(information.session.sessionCode).adminSocket;
        
        question.answerList.push(answer);

        dbFunctions.insert.storeAnswer(db, information.answer, information.result, question.sqId, information.userId).then(() => {
            let numAnswers = question.answerList.length;
            let participants = question.connectedUsers;

            adminSocket.emit("updateNumberOfAnswers", numAnswers, participants);
    
            if(numAnswers === participants) {
                let answerList = [];
                if (question.answerList) answerList = question.answerList;

                question.resultScreen = true;
        
                let filteredAnswerList = [];
                let correctAnswer = 0;
                let incorrectAnswer = 0;
                let didntKnow = 0;
                
                for (let i = 0; i < answerList.length; i++) {
                    let answer = answerList[i];
                    let filteredAnswer = {};
                    if (answer.result === 0) {
                        filteredAnswer.answerObject = answer.answerObject;
                        filteredAnswerList.push(filteredAnswer)
                        incorrectAnswer++;
                    };
                    if (answer.result === -1) didntKnow++; 
                    if (answer.result === 1) correctAnswer++;
                }
        
                let response = {
                    question: {
                        text: question.text,
                        description: question.description,
                        object: question.object,
                        type: question.type
                    },
                    solution: question.solution,
                    answerList: filteredAnswerList,
                    correctAnswer: correctAnswer,
                    incorrectAnswer: incorrectAnswer,
                    didntKnow: didntKnow,
                    users: answerList.length
                };

                adminSocket.emit("goToQuestionResultScreen", response);
            }
        }).catch((err) => {
            console.error(err);
        });
    }
}