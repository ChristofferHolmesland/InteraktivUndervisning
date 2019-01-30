const get = require("../database/databaseFunctions").get;
const insert = require("../database/databaseFunctions").insert;
const update = require("../database/databaseFunctions").update;

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

        get.sessionsToUser(db, user.feide.id).then(async function(sessions) {
            result = {};
            result.sessionList = sessions;
            result.totalsessions = sessions.length;
            
            await get.amountCorrectAnswersForUser(db, user.feide.id).then((correct) => {
                result.totalCorrectAnswers = correct;
            }).catch((err) => {
                console.log(err);
                result.totalCorrectAnswers = "Not available at this time."
            });


            let wrong = await get.amountWrongAnswersForUser(db, user.id).catch((err) => {
                
            });
            result.totalIncorrectAnswers = wrong;
            socket.emit("getUserStatsResponse", result);
        }).catch((err) => {
            console.log(err);
        });
    });
}