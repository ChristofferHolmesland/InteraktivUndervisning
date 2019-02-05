const Answer = require("../session.js").Answer;
const dbFunctions = require("../database/databaseFunctions.js").dbFunctions;

module.exports.client = function(socket, db, user, sessions) {

    socket.on("quickJoinRoom", function (sessionCode) {
        if (sessions.get(sessionCode)) {
            sessions.get(sessionCode).session.addUser(user);
            socket.join(sessionCode);
            socket.emit("joinSession", sessionCode);
            sessions.get(sessionCode).adminSocket.emit("updateParticipantCount", sessions.get(sessionCode).session.currentUsers);
        } else {
            socket.emit("sessionInActive", sessionCode);
        }
    });

    socket.on("leaveSession",function (sessionCode) {
        sessions.get(sessionCode).session.userLeaving();
        socket.leave(sessionCode);
        socket.emit("returnToClientDashboard");
        sessions.get(sessionCode).adminSocket.emit("updateParticipantCount", sessions.get(sessionCode).session.currentUsers);
    });

    socket.on("questionAnswered", async function (answerObject, sessionCode) {
        let session = sessions.get(sessionCode).session;
        let question = session.questionList[session.currentQuestion];

        if(answerObject === null){
            answerObject = "You didn't answer";
            socket.emit("answerResponse", "betweenQuestionsNotAnswered");
        }

        let result = require("../SolutionChecker/solutionChecker.js").solutionChecker.checkAnswer(answerObject, question.solution);

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
        }

        // TODO add logic to store the answer. Use the class Answer and add it to the answerList in the Question class that is in the questionList in the Session class
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
        
        question.answerList.push(answer);

        dbFunctions.insert.storeAnswer(db, information.answer, information.result, question.sqId, information.userId).then(() => {
            let numAnswers = question.answerList.length;
            let participants = information.session.currentUsers;
            sessions.get(information.session.sessionCode).adminSocket.emit("updateNumberOfAnswers", numAnswers, participants);
    
            if(numAnswers === participants) sessions.get(information.session.sessionCode).adminSocket.emit("goToQuestionResultScreen");
        }).catch((err) => {
            console.log(err);
        });
    }
}