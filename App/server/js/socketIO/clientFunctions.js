module.exports.client = function(socket, db, sessions) {

    socket.on("clientAnswered", function() {
    });

    socket.on("startQuiz", function (quizCode) {
        let question = {text:"I like Cake!",description:"This is a message from lord Nergal! I await you at the dread islands",type:1,time:61};
        socket.emit("startQuizResponse",question);  //TODO change emit to socket.in(quizCode)
    });

    socket.on("quickJoinRoom", function (roomnr) {
        console.log("quickJoinRoom is called!");
        let rooms= [1,2,3,4,5,6,7,8,9,10,3334];
        if (rooms.indexOf(parseInt(roomnr)) !== -1 && roomnr !== "") {
            let quizCode = `${roomnr}`;
            socket.join(quizCode);
            console.log("Joined "+ quizCode);
            console.log(socket.adapter.rooms);
            socket.emit("joinRoom",quizCode);	//use io to emit messages to rooms!!!
        }else {
            console.log("inActive");
            socket.emit("QuizInActive",roomnr);
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