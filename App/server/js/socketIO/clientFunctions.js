module.exports.client = function(socket, db, user, sessions) {

    socket.on("clientAnswered", function() {
    });

    socket.on("startQuiz", function (quizCode) {
        let question = {text:"I like Cake!",description:"This is a message from lord Nergal! I await you at the dread islands",type:1,time:61};
        socket.emit("startQuizResponse",question);  //TODO change emit to socket.in(quizCode)
    });

    socket.on("quickJoinRoom", function (sessionCode) {
        let rooms= [1,2,3,4,5,6,7,8,9,10,3334];
        if(sessions.get(sessionCode) || rooms.indexOf(parseInt(sessionCode)) != -1){
            socket.join(sessionCode);
            sessions.get(sessionCode).session.addUser(user);
            sessions.get(sessionCode).adminSocket.emit("updateParticipantCount", sessions.get(sessionCode).session.userList.length);
            socket.emit("joinRoom",sessionCode);
        }else {
            socket.emit("QuizInActive", sessionCode);
        }
    });

    socket.on("leaveRoom",function (roomId) {
        let quizCode = `${roomId}`;
        socket.leave(quizCode);
        socket.emit("returnToJoinRoom");
    });

    socket.on("questionAnswered", function (answer) {
        let a = {questionId:1,userId:1,answerObject:answer};
        socket.emit("AnswerResponse", a)
    });

    socket.on("questionNotAnswered", function () {
        let a = {questionId: 1,userid:1,result:-1};
        socket.emit("AnsweredResponse", a)
    });

}