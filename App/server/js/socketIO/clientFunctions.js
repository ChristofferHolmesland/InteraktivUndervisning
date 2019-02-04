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
        let result = -1;

        if(answerObject === null)
            socket.emit("answerResponse", "betweenQuestionsNotAnswered");

        // TODO add logic to test if the solution is correct

        if(answerObject === question.solution){
            socket.emit("answerResponse", "betweenQuestionsCorrect")
        } else {
            result = 1;
            socket.emit("answerResponse", "betweenQuestionsIncorrect")
        }

        // TODO add logic to store the answer. Use the class Answer and add it to the answerList in the Question class that is in the questionList in the Session class
        let userId = 1;
        if(user.feide !== undefined) userId = await dbFunctions.get.userIdByFeideId(user.feide.id).catch((err) => {
            console.log(err);
        });
        let answer = new Answer(session.currentQuestion, userId, answerObject, result);
        
        question.answerList.push(answer);

        let numAnswers = question.answerList.length;
        let participants = session.currentUsers;
        sessions.get(sessionCode).adminSocket.emit("updateNumberOfAnswers", numAnswers, participants);

        if(numAnswers === participants) sessions.get(sessionCode).adminSocket.emit("goToQuestionResultScreen");
    });
}