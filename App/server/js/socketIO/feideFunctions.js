const dbFunctions = require("../database/databaseFunctions").dbFunctions;

module.exports.feide = function(socket, db, user){
    socket.on("clientLoginInfoRequest", function() {
        socket.emit("clientLoginInfoResponse", {
            "username": user.userName, 
            "loggedIn": true,
            "userRights": user.userRights,
            "feideId": user.feide.id
        });
    });
    
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

        dbFunctions.get.sessionsToUser(db, user.feide.id).then(async function(sessions) {
            result = {};
            result.sessionList = sessions;
            result.totalsessions = sessions.length;
            
            await dbFunctions.get.amountCorrectAnswersForUser(db, user.feide.id).then((correct) => {
                result.totalCorrectAnswers = correct;
            }).catch((err) => {
                console.log(err);
                result.totalCorrectAnswers = "Not available at this time."
            });


            let wrong = await dbFunctions.get.amountWrongAnswersForUser(db, user.id).catch((err) => {
                
            });
            result.totalIncorrectAnswers = wrong;
            socket.emit("getUserStatsResponse", result);
        }).catch((err) => {
            console.log(err);
        });
    });
}