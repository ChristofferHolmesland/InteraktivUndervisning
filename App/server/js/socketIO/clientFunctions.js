const Answer = require("../session.js").Answer;
const dbFunctions = require("../database/databaseFunctions.js").dbFunctions;

module.exports.client = function(socket, db, user, sessions) {

    socket.on("quickJoinRoom", function (sessionCode) {
        if (sessions.get(sessionCode)) {
            let session = sessions.get(sessionCode).session;
            let adminSocket = sessions.get(sessionCode).adminSocket;

            session.addUser(user);
            socket.join(sessionCode);

            socket.emit("joinSession", sessionCode);
            adminSocket.emit("updateParticipantCount", session.currentUsers);
        } else {
            socket.emit("sessionInActive", sessionCode);
        }
    });

    socket.on("leaveSession",function (sessionCode) {
        let session = sessions.get(sessionCode).session;
        let adminSocket = sessions.get(sessionCode).adminSocket;

        session.userLeaving();
        socket.leave(sessionCode);

        socket.emit("returnToClientDashboard");
        adminSocket.emit("updateParticipantCount", session.currentUsers);
    });

    socket.on("questionAnswered", async function (answerObject, sessionCode) {
        let session = sessions.get(sessionCode).session;
        let question = session.questionList[session.currentQuestion];

        if(answerObject === null){
            answerObject = "You didn't answer";
            socket.emit("answerResponse", "betweenQuestionsNotAnswered");
        }

        let result = require("../SolutionChecker/solutionChecker.js").solutionChecker.checkAnswer(answerObject, question.solution, question.type);

        if (result){
            result = 1;
            socket.emit("answerResponse", "betweenQuestionsCorrect")
        } else {
            result = -1;
            socket.emit("answerResponse", "betweenQuestionsIncorrect")
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
                await insertAnswerToDatabase(information);
            }).catch((err) => {
                console.log(err);
            });
        } else {
            await insertAnswerToDatabase(information)
        }
    });

    async function insertAnswerToDatabase(information) {
        let answer = new Answer(information.session.currentQuestion, information.userId, information.answer, information.result);
        let question = information.session.questionList[information.session.currentQuestion];
        let adminSocket = sessions.get(information.session.sessionCode).adminSocket;
        
        question.answerList.push(answer);

        dbFunctions.insert.storeAnswer(db, information.answer, information.result, question.sqId, information.userId).then(() => {
            let numAnswers = question.answerList.length;
            let participants = information.session.currentUsers;
            adminSocket.emit("updateNumberOfAnswers", numAnswers, participants);
    
            if(numAnswers === participants) adminSocket.emit("goToQuestionResultScreen");
        }).catch((err) => {
            console.log(err);
        });
    }
}