module.exports.client = function(socket, db, sessions) {

    setInterval(function(){
        console.log(socket.id);
        console.log(sessions);
    }, 5000);

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
            console.log("Joined "+ sessionCode);
            console.log(socket.adapter.rooms);
            socket.emit("joinRoom",sessionCode);
        }else {
            console.log("inActive");
            socket.emit("QuizInActive", sessionCode);
        }
    });

    socket.on("leaveRoom",function (roomId) {
        console.log("Leaving " +roomId);
        let quizCode = `${roomId}`;
        socket.leave(quizCode);
        socket.emit("returnToJoinRoom");
    });

    socket.on("questionAnswered", function (answer) {
        let a = {questionId:1,userId:1,answerObject:answer};
        console.log("Answered");
        //socket.emit("sendAnswer");
        socket.emit("AnswerResponse", a)
    });

    socket.on("questionNotAnswered", function () {
        console.log("Not answered");
        let a = {questionId: 1,userid:1,result:-1};
        socket.emit("AnsweredResponse", a)
    });

}