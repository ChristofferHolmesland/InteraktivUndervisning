const Answer = require("../session.js").Answer;
const dbFunctions = require("../database/databaseFunctions.js").dbFunctions;

module.exports.client = function(socket, db, user, sessions) {

    socket.on("quickJoinRoom", async function (sessionCode) {
        if (sessions.get(sessionCode)) {
            let userId = 1;
            if (user.feide) userId = user.feide.token;

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
                console.log(err);
            });
        } else {
            socket.emit("sessionInActive", sessionCode);
        }
    });

    socket.on("leaveSession",function (sessionCode) {
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
            checkedResult = require("../SolutionChecker/solutionChecker.js").solutionChecker.checkAnswer(answerObject, question.solution, question.type);

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
            dbFunctions.get.userIdByFeideId(db, user.feide.idNumber).then(async (userId) => {
                information.userId = userId.id;
            }).catch((err) => {
                console.log(err);
            });
        }
        
        await insertAnswerToDatabase(information);

        question.socketsAnswered[socket.id] = true;
    });

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
            console.log(err);
        });
    }
}