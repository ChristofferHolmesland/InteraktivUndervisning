module.exports.feide = function(socket, db, user){
    socket.on("clientLoginInfoRequest", function() {
        socket.emit("clientLoginInfoResponse", {
            "username": user.userName, 
            "loggedIn": true,
            "userRights": user.userRights,
            "feideId": user.feide.idNumber
        });
    });
    
    socket.on("getUserStats", function() {
        /* 
        response should follow this format: 
        {
            totalCorrectAnswers: float,
            totalQuizzes: Integer,
            totalIncorrectAnswers: float,
            quizList: [
                {
                    quizName = String,
                    courseCode = String
                }, ...
            ] 	// Should be a list of all quizzes that the user has participated in.
                // Should be sorted where the last quiz is first
        }
        */
        get.quizzesToUser(db, user.feide.id).then(async function(quizzes) {
            result = {};
            result.quizList = quizzes;
            result.totalQuizzes = quizzes.length;
            
            let correct = await get.amountCorrectAnswersForUser(db, user.id);
            let wrong = await get.amountWrongAnswersForUser(db, user.id);
            result.totalCorrectAnswers = correct;
            result.totalIncorrectAnswers = wrong;
            socket.emit("getUserStatsResponse", result);
        });
    });
}