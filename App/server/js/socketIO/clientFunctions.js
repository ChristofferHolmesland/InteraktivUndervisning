module.exports.client = function(socket, db, user, sessions) {

    socket.on("clientAnswered", function() {
    });

    socket.on("startQuiz", function (quizCode) {
        let question = {text:"I like Cake!",description:"This is a message from lord Nergal! I await you at the dread islands",type:1,time:20};
        let question2 = {text:"I like Cake2!",description:"This is a message from lord Nergal!2 I await you at the dread islands2",type:1,time:31};
        let quiz = [question,question2];
        socket.emit("startQuizResponse",question);  //TODO change emit to socket.in(quizCode), send to all clients that the game has started
    });

    socket.on("quickJoinRoom", function (sessionCode) {
        let rooms= [1,2,3,4,5,6,7,8,9,10,3334];
        if(sessions.get(sessionCode) || rooms.indexOf(parseInt(sessionCode)) != -1){
            console.log(sessions.get(sessionCode));
            socket.join(sessionCode);
            //sessions.get(sessionCode).session.addUser(user);
            //sessions.get(sessionCode).adminSocket.emit("updateParticipantCount", sessions.get(sessionCode).session.userList.length);
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

    socket.on("questionAnswered", function (answer,sessionCode) {
        let a;
        if (answer === "") {
            console.log("did not answer");
            a = {questionId: 1,userid:1,result:-1};
        }else {
            console.log("answered");
            a = {questionId:1,userId:1,answerObject:answer};
        }
        let response = "";
        if (a.result === -1) {
            response = "Vet ikke";
        }else {
            response = "Riktig?";
        }
        socket.emit("AnswerResponse", response);
    });

    socket.on("nextQuestion", function (sessionCode) { /*This function is most likely not going to be in client*/
        console.log(sessionCode);
        let question = {text:"Why is parallelism not the same as concurrency?",description:"",type:1,time:-1};
        //socket.broadcast.to(sessionCode).emit("nextQuestionResponse",question);
        io.in(sessionCode).clients((err , clients) => {	//used to see all socket ids in the room, taken from https://stackoverflow.com/questions/18093638/socket-io-rooms-get-list-of-clients-in-specific-room/25028953
            console.log(clients);
        });
        io.to(sessionCode).emit("nextQuestionResponse",question);
    });

    socket.on("finishSession", function (sessionCode) {
        console.log(sessionCode);
        io.to(sessionCode).emit("finishSessionResponse"); //TODO Change all io.to to socket.to when the message is sent from the admin.
    });
}