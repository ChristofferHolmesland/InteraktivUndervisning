const socketio = require('socket.io');
const locales = (require("../localization/localeLoader.js")).locales;
const User = (require("./user.js")).User;
const anonymousNames = (require("./anonymousName.js")).Animals;
const cookie = require('cookie');

module.exports.listen = function(server, users) {
    io = socketio.listen(server, {
        cookie: false
    });
    io.on("connection", function(socket) {

        // On new connection, checks if user has a cookie with userId and verifies the user
        let user = User.getUser(users, socket);

        function rights(level, func, ...args) {
            if(user && user.userRights < level) return;
            func(...args);
        }

        //--------------------------------------------//
        //------------- Common functions -------------//
        //--------------------------------------------//

        socket.on('disconnect', function(){
        });

        socket.on("signOutRequest", function(){
            if(user.feide != undefined){
                socket.emit("deleteCookie", user.sessionId);
            }

            users.delete(user.sessionId);
            socket.emit("signOutResponse");
        });

        socket.on("getLocaleRequest", function(locale) {
            socket.emit("getLocaleResponse", {"locale": locales[locale], "localeList": locales.localeList});
        });

        //--------------------------------------------//
        //------------- Guest functions --------------//
        //--------------------------------------------//

        socket.on("loginAnonymouslyRequest", function(){
            tempKey = socket.id;
            tempUser = new User(1, "Anonymous " + anonymousNames.getRandomAnimal(), tempKey, undefined);
            users.set(tempKey, tempUser);
            socket.emit("loginAnonymouslyResponse");

            user = users.get(socket.id);
            socket.emit("clientLoginInfoResponse", {
                "username": user.userName,
                "loggedIn": true,
                "userRights": user.userRights
            });
        });
        
        //--------------------------------------------//
        //------------- Client functions -------------//
        //--------------------------------------------//

        socket.on("clientStarted", function() {
            if(user && user.userRights > 0) return;

            socket.emit("unauthorizedAccess");
        });

        socket.on("clientLoginInfoRequest", function() {
            if(user){
                socket.emit("clientLoginInfoResponse", {
                    "username": user.userName, 
                    "loggedIn": true,
                    "userRights": user.userRights,
                    "feideId": user.feide.idNumber
                });
            }
        });

        //--------------------------------------------//
        //------------- Student Assistant -------------//
        //--------------------------------------------//

        socket.on("studAssStarted", function() {
            if(user && user.userRights == 3) return;

            socket.emit("unauthorizedAccess");
        });

        //--------------------------------------------//
        //------------- Admin functions -------------//
        //--------------------------------------------//

        socket.on("adminStarted", function() {
            if(user && user.userRights == 4) return;

            console.log(user);
            socket.emit("unauthorizedAccess");
        });

        socket.on("getQuizWithinCourse", (data) => rights(4, function(course) {
            /*
            let result = [];
            let quizes = get.allQuizWithinCourse(db, course);
            for (let i = 0; i < quizes.length; i++) {
                result.push({
                    value: quizes[i].quizId,
                    text: quizes[i].quizName
                });
            }
            socket.emit("sendQuizWithinCourse", result);
            */
            socket.emit("sendQuizWithinCourse", [{value: 1, text: "Grap222hs"}, {value: 2, text: "Sor23523ting"}]);
        }, data));

        socket.on("addQuestionToQuiz", (data) => rights(4, function(data) {
            /*
            insert.addQuestionToQuiz(db, data.quizId, data.questionId);
            */
        }, data));

        socket.on("getAllQuestionsWithinCourse", (data) => rights(4, function(course) {
            /*
            let result = [];
            let questions = get.allQuestionsWithinCourse(db, course);
            for (let i = 0; i < questions.length; i++) {
                let q = questions[i];
                results.push({
                    id: q.questionId,
                    text: q.questionText,
                    description: q.QuestionDescription,
                    solutionType: q.typeName,
                    solution: q.questionSolution
                })
            }
            socket.emit("sendAllQuestionsWithinCourse", result);
            */

            socket.emit("sendAllQuestionsWithinCourse",
            [
                {
                    id: 1, 
                    text: "Hva er 2 + 2?", 
                    description: "For å løse denne oppgaven må du bruke addisjon.",
                    solutionType: "text",
                    solution: "4"
                },
                {
                    id: 2, 
                    text: "Hvordan er 'bøttene' i denne hashtabellene laget?", 
                    description: "<bilde>",
                    solutionType: "text",
                    solution: "linkedlist"
                }
			]);
        }, data));

        socket.on("addNewQuestion", (data) => rights(4, function(question) {
            /*
            if (question.object == undefined) {
                insert.questionWithNoObject(db, question.text, question.description, question.solution, question.solutionType, question.courseCode);
            } else {
                insert.questionWithObject(db, question.text, question.description, question.object, question.solution, question.solutionType, question.courseCode);
            }
            */
        }, data));

        socket.on("updateQuestion", (data) => rights(4, function(question) {
            /*
            update.question(db, question.id, question.text, question.description, question.object, question.solution, question.solutionType);
            */
        }, data));

        socket.on("getQuestionTypes", () => rights(4, function() {
            /*
            let result = [];
            let types = get.questionTypes(db);
            for (let i = 0; i < types.length; i++) {
                result.push({
                    value: types[i].questionType,
                    text: types[i].typeName
                })
            }
            socket.emit("sendQuestionTypes", result);
            */

            socket.emit("sendQuestionTypes", 
            [
                { value: "graph", text: "Graph"},
                { value: "text", text: "Text"},
                { value: "multipleChoice", text: "Multiple choice"}
            ]);
        }));
    });

    return io;
}
