const dbFunctions = require("../database/databaseFunctions").dbFunctions;

module.exports.feide = function(socket, db, user){
    sendUserInfo(db, socket, user)
    
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

        dbFunctions.get.sessionsToUser(db, {id: user.feide.idNumber, type: "feide"}).then(async function(sessions) {
            result = {};
            if (sessions !== undefined){
                result.sessionList = sessions;
                result.totalSessions = sessions.length;
            } else {
                result.sessionList = [];
                result.totalSessions = 0;
            } 
            
            await dbFunctions.get.amountAnswersForUserByResult(db, {id: user.feide.idNumber, type: "feide"}, 1).then((correct) => {
                if (correct === undefined) result.totalCorrectAnswers = 0;
                else result.totalCorrectAnswers = correct;
            }).catch((err) => {
                console.error(err);
                result.totalCorrectAnswers = "Not available at this time."
            });


            await dbFunctions.get.amountAnswersForUserByResult(db, {id: user.feide.idNumber, type: "feide"}, 0).then((incorrect) => {
                if (incorrect === undefined) result.totalIncorrectAnswers = 0;
                else result.totalIncorrectAnswers = incorrect;
            }).catch((err) => {
                console.error(err);
                result.totalIncorrectAnswers = "Not available at this time."
            });

            await dbFunctions.get.amountAnswersForUserByResult(db, {id: user.feide.idNumber, type: "feide"}, -1).then((incorrect) => {
                if (incorrect !== undefined) result.totalIncorrectAnswers += incorrect;
            }).catch((err) => {
                console.error(err);
                result.totalIncorrectAnswers = "Not available at this time."
            });

            socket.emit("getUserStatsResponse", result);
        }).catch((err) => {
            console.error(err);
        });
    });
}

async function sendUserInfo(db, socket, user) {
    let response = {
        "username": user.userName, 
        "loggedIn": true,
        "userRights": user.userRights,
        "feideId": user.feide.idNumber
    }

    await dbFunctions.get.adminSubjects(db, user.feide.idNumber).then((adminSubjects) => {
        response.adminSubjects = adminSubjects
    }).catch((err) => {
        console.error(err);
    });

    socket.emit("clientLoginInfoResponse", response);
}