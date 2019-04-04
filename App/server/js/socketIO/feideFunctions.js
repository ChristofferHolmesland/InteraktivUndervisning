const dbFunctions = require("../database/databaseFunctions").dbFunctions;

module.exports.feide = function(socket, db, user){
    sendUserInfo(db, socket, user)
    
    socket.on("getUserStats", function() {
        /* 
        response should follow this format: 
        {
            totalCorrectAnswers: float,
            totalsessions: Integer,
            totalIncorrectAnswers: float,
            sessionList: [
                {
                    sessionName = String,
                    courseCode = String
                }, ...
            ] 	// Should be a list of all sessions that the user has participated in.
                // Should be sorted where the last session is first
        }
        */

        dbFunctions.get.sessionsToUser(
            db, {id: user.feide.idNumber, type: "feide"}
        ).then(async function(sessions) {
            result = {};
            if (sessions !== undefined){
                result.sessionList = sessions;
                result.totalSessions = sessions.length;
            } else {
                result.sessionList = [];
                result.totalSessions = 0;
            } 
            
            await dbFunctions.get.amountAnswersForUserByResult(db, {id: user.feide.idNumber, type: "feide"}, 1).then((correct) => {
                if (correct === undefined) result.totalCorrectAnswers = 0;
                else result.totalCorrectAnswers = correct;
            }).catch((err) => {
                console.error(err);
                result.totalCorrectAnswers = "Not available at this time."
            });


            await dbFunctions.get.amountAnswersForUserByResult(db, {id: user.feide.idNumber, type: "feide"}, 0).then((incorrect) => {
                if (incorrect === undefined) result.totalIncorrectAnswers = 0;
                else result.totalIncorrectAnswers = incorrect;
            }).catch((err) => {
                console.error(err);
                result.totalIncorrectAnswers = "Not available at this time."
            });

            await dbFunctions.get.amountAnswersForUserByResult(db, {id: user.feide.idNumber, type: "feide"}, -1).then((didntKnow) => {
                if (didntKnow === undefined) result.totalDidntKnowAnswers = 0;
                else result.totalDidntKnowAnswers = didntKnow;
            }).catch((err) => {
                console.error(err);
                result.totalDidntKnowAnswers = "Not available at this time."
            });

            console.log(result);

            socket.emit("getUserStatsResponse", result);
        }).catch((err) => {
            console.error(err);
        });
    });

    socket.on("getSessionInformationRequest", async function(sessionId) {
        /* 
            sessionInformation = 
                {
                name: String,
                courseCode: String,
                courseSemester: String,
                userCorrect: Number,
                userIncorrect: Number,
                userDidntKnow: Number,
                sessionAverageCorrect: Number,
                sessionAverageIncorrect: Number,
                sessionAverageDidntKnow: Number,
                questionList: [
                    question: {
                        text: String,
                        description: String,
                        type: Number,
                        Object: {
                            ...
                        }
                        Solution: Object,
                        AnswerList: [
                            answer: {} // Will only include answers made by the user
                        ]
                    }
                ]
            }
        */
        let sessionInformation = {};

        await dbFunctions.get.sessionById(db, sessionId).then((session) => {
            sessionInformation.name = session.name;
            sessionInformation.courseCode = session.courseCode;
            sessionInformation.courseSemester = session.courseSemester;
        });

        await dbFunctions.get.allQuestionInSession(db, sessionId).then(async (questions) => {
            let sessionUserCorrect = 0;
            let sessionUserIncorrect = 0;
            let sessionUserDidntKnow = 0;
            let sessionAverageCorrect = 0;
            let sessionAverageIncorrect = 0;
            let sessionAverageDidntKnow = 0;
            let sessionUserAnswers = 0;
            let sessionOtherUserAnswers = 0;

            let questionList = [];

            for (let i = 0; i < questions.length; i++) {
                let question = questions[i];
                
                let answerList = [];

                await dbFunctions.get.allAnswerToQuestion(db, question.sqId).then(async (answers) => {
                    let userId = await dbFunctions.get.userIdByFeideId(db, user.feide.idNumber);

                    let otherUserAnswers = 0;
                    let userAnswers = 0;
                    let questionUserCorrect = 0;
                    let questionUserIncorrect = 0;
                    let questionUserDidntKnow = 0;
                    let questionAverageCorrect = 0;
                    let questionAverageIncorrect = 0;
                    let questionAverageDidntKnow = 0;

                    for (let j = 0; j < answers.length; j++) {
                        let answer = answers[j];
                        delete answer.id;
                        delete answer.sessionHasQuestionId;

                        if (answer.userId === userId.id) {
                            userAnswers++;
                            sessionUserAnswers++;
                            
                            if (answer.result === 1) {
                                questionUserCorrect++;
                                sessionUserCorrect++;
                            }
                            else if (answer.result === 0) {
                                questionUserIncorrect++;
                                sessionUserIncorrect++;
                            }
                            else {
                                questionUserDidntKnow++;
                                sessionUserDidntKnow++;
                            }

                            delete answer.userId;

                            answer.answerObject = JSON.parse(answer.object);
                            delete answer.object;

                            answerList.push(answer);
                        }
                        else {
                            otherUserAnswers++;
                            sessionOtherUserAnswers++;
                            
                            if (answer.result === 1) {
                                questionAverageCorrect++;
                                sessionAverageCorrect++;
                            }
                            else if (answer.result === 0) {
                                questionAverageIncorrect++;
                                sessionAverageIncorrect++;
                            }
                            else {
                                questionAverageDidntKnow++;
                                sessionAverageDidntKnow++;
                            }
                        }
                    }

                    question.answerList = answerList;

                    question.userCorrect = (questionUserCorrect / userAnswers * 100).toFixed(2);
                    question.userIncorrect = (questionUserIncorrect / userAnswers * 100).toFixed(2);
                    question.userDidntKnow = (questionUserDidntKnow / userAnswers * 100).toFixed(2);
                    question.otherUserCorrect = (questionAverageCorrect / otherUserAnswers * 100).toFixed(2);
                    question.otherUserIncorrect = (questionAverageIncorrect / otherUserAnswers * 100).toFixed(2);
                    question.otherUserDidntKnow = (questionAverageDidntKnow / otherUserAnswers * 100).toFixed(2);
                });
                
                delete question.id;
                delete question.sqId;
                delete question.time;

                question.solution = JSON.parse(question.solution);

                questionList.push(question);
            }

            sessionInformation.questionList = questionList;

            sessionInformation.userCorrect = (sessionUserCorrect / sessionUserAnswers * 100).toFixed(2);
            sessionInformation.userIncorrect = (sessionUserIncorrect / sessionUserAnswers * 100).toFixed(2);
            sessionInformation.userDidntKnow = (sessionUserDidntKnow / sessionUserAnswers * 100).toFixed(2);
            sessionInformation.otherUserCorrect = (sessionAverageCorrect / sessionOtherUserAnswers * 100).toFixed(2);
            sessionInformation.otherUserIncorrect = (sessionAverageIncorrect / sessionOtherUserAnswers * 100).toFixed(2);
            sessionInformation.otherUserDidntKnow = (sessionAverageDidntKnow / sessionOtherUserAnswers * 100).toFixed(2);
        });

        socket.emit("getSessionInformationResponse", sessionInformation);
    });
}

async function sendUserInfo(db, socket, user) {
    let response = {
        "username": user.userName, 
        "loggedIn": true,
        "userRights": user.userRights,
        "feideId": user.feide.idNumber
    }

    await dbFunctions.get.adminSubjects(db, user.feide.idNumber).then((adminSubjects) => {
        response.adminSubjects = adminSubjects
    }).catch((err) => {
        console.error(err);
    });

    socket.emit("clientLoginInfoResponse", response);
}