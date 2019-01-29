// This module should ONLY be called once!Otherwise you end up with duplicates in every table that uses autoincremented primary keys.

module.exports.InsertData = function (db) {
    return new Promise(function(resolve, reject) {
        //constant dummy data
        let courses = [
            {courseSemester: "18H", courseCode: "DAT200", courseName: "Algoritmer og Datastrukturer"},
            {courseSemester: "18V", courseCode: "DAT100", courseName: "Objektorientert programmering"}
        ];
        let feideids = [
            "222221","222222","222223","222224","222225","222226","222227","222228","222229","222220","2222221","2222222"
        ];
        let type = {typeid:1,typename:"Text"};


        //SQL STATEMENTS

        //Creating Feide Insert
        var sqlInsertFeide = "INSERT INTO Feide(id,accessToken,name) VALUES";

        for (let k= 0; k<feideids.length; k++) {
            let addstring = "";
            if (k===0) {
                addstring = "("+feideids[k]+",\'"+"FeideAccess"+k+"\',\'"+"feideName"+k+"\')";
            }else {
                addstring = ",("+feideids[k]+",\'"+"FeideAccess"+k+"\',\'"+"feideName"+k+"\')";
            }
            sqlInsertFeide += addstring;
        }
        sqlInsertFeide += ";";
        //console.log(sqlInsertFeide);

        //Creating User Insert
        var sqlInsertUser = "INSERT INTO USER(id,feideId) VALUES";

        for (let n=0; n<feideids.length;n++) {
            let userid = n+2;
            let addstring = "";
            if (n===0) {
                addstring = "("+userid+","+feideids[n]+")";
            }else {
                addstring = ",("+userid+","+feideids[n]+")";
            }
            sqlInsertUser += addstring;
        }

        sqlInsertUser += ";";

        //Creating Course Insert
        var sqlInsertCourse = "INSERT INTO Course(semester,code,name) VALUES";

        for (let m= 0; m<courses.length;m++) {
            let addstring = "";
            if (m === 0) {
                addstring = `('${courses[m].courseSemester}','${courses[m].courseCode}','${courses[m].courseName}')`;
            }else {
                addstring = `,('${courses[m].courseSemester}','${courses[m].courseCode}','${courses[m].courseName}')`;
            }
            sqlInsertCourse += addstring;
        }
        sqlInsertCourse += ";";
        //console.log(sqlInsertCourse);

        //Create Insert UserRight   3 & 4 3 is student assistant & 4 is admin
        var sqlInsertUserRight = "INSERT INTO UserRight(feideId,courseSemester,courseCode,level) VALUES";
        var adminid = 10;

        for (let t=0;t<courses.length;t++) {
            let addstring = "";
            if (t===0) {
                addstring = `('${feideids[adminid]}','${courses[t].courseSemester}','${courses[t].courseCode}',4)`;
            }
            else {
                addstring = `,('${feideids[adminid]}','${courses[t].courseSemester}','${courses[t].courseCode}',4)`;
            }
            sqlInsertUserRight += addstring;
        }
        sqlInsertUserRight += ";";
        //console.log(sqlInsertUserRight);

        //Create Insert Quiz
        var sqlInsertQuiz = "Insert INTO Quiz(name,status,participants,courseSemester,courseCode) VALUES";
        for (let p=0;p<courses.length;p++) {
            let status = 0;

            for (let q=1;q<=10;q++) {
                let addstring = "";
                if (p===0 && q===1) {
                    addstring = `('QuizName${q}${courses[p].courseCode}',${status},${10},'${courses[p].courseSemester}','${courses[p].courseCode}')`;
                }else {
                    addstring = `,('QuizName${q}${courses[p].courseCode}',${status},${10},'${courses[p].courseSemester}','${courses[p].courseCode}')`;
                }
                if(status >= 2) {
                    status = 0;
                }else {
                    status++
                }
                sqlInsertQuiz += addstring;
            }
        }
        sqlInsertQuiz += ";";
        //console.log(sqlInsertQuiz);

        //Creating Question Insert
        var sqlInsertQuestion = "INSERT INTO Question(text, description,object,solution,time,questionType,courseCode) VALUES";

        for (let o=1;o<=200;o++) {
            let chosenCode = 0;
            if(o> 100){
                chosenCode = 1;
            }
            let addstring = "";
            if (o===1) {
                addstring = "('"+"QuestionText"+ o + "','" + "QuestionDescription" + o + "','" + "QuestionObject"+ o + "','" + "QuestionSolution"+ o + "',"+ 60 + "," + 1 + ",'"+ courses[chosenCode].courseCode + "')";
            }else {
                addstring = ",('"+"QuestionText"+ o + "','" + "QuestionDescription" + o + "','" + "QuestionObject"+ o + "','" + "QuestionSolution"+ o + "'," + 60 + "," + 1 + ",'" + courses[chosenCode].courseCode + "')";
            }
            sqlInsertQuestion += addstring;
        }
        sqlInsertQuestion += ";";
        //console.log(sqlInsertQuestion);

        //Create Insert QuizHasQuestion
        var sqlInsertQuizHasQuestion = "INSERT INTO Quiz_has_Question(quizId,questionId) VALUES";
        var quizid = 1;
        var counter = 0;

        for(let w = 1; w<=200;w++) {
            let addstring = "";
            if(counter >= 10) {
                quizid++;
                counter = 0;
            }
            if (w === 1) {
                addstring = `(${quizid},${w})`
            } else {
                addstring = `,(${quizid},${w})`
            }
            sqlInsertQuizHasQuestion += addstring;
            counter++;
        }
        sqlInsertQuizHasQuestion += ";";
        //console.log(sqlInsertQuizHasQuestion);

        //Create Insert UserHasQuiz
        var sqlInsertUserHasQuiz = "INSERT INTO User_has_Quiz(userid,quizid) VALUES";
        var users = {};
        for (let s=1;s<=20;s++) {   //per quiz
            let quizUsers = [];
            let atest = false;
            let userLength = 11;

            for (let u = 1; u <= 10; u++) {  //per user
                let chance = Math.floor(Math.random() * 20 + 1);
                if (chance < 11) {    //Bruker
                    let userIndex =  Math.floor(Math.random() * userLength + 1);
                    if (quizUsers.indexOf(userIndex) === -1 && userIndex !== 1) {
                        quizUsers.push(userIndex);
                    } else {
                        while (quizUsers.indexOf(userIndex) !== -1 || userIndex === 1) {
                            userIndex = Math.floor(Math.random() * userLength + 1);
                        }
                        quizUsers.push(userIndex);
                    }
                } else { //annonym
                    if (atest === false) {
                        atest = true;
                        quizUsers.push(1);
                    }
                }
            }
            users[s] = quizUsers.sort(function (a,b){return b-a})
        }

        var count = 0;
        for (quizid in users) {
            let participatingusers = users[quizid];

            for (let i=0;i<participatingusers.length;i++) {
                let addstring = "";
                if (i === 0 && count === 0) {
                    addstring = "(\'"+participatingusers[i] + "\'," +quizid +")";
                    count++
                }else {
                    addstring = ",(\'"+participatingusers[i] + "\'," + quizid + ")";
                }
                sqlInsertUserHasQuiz += addstring;
            }
        }
        sqlInsertUserHasQuiz += ";";
        //console.log(sqlInsertUserHasQuiz);

        //Creating Answer Insert
        var sqlInsertAnswer = "INSERT INTO Answer(object,result,quizHasQuestionId,userId) VALUES";
        var questionid = 0;		//questionHasQuestionId will alltid = questionid med dummy dataen som er lagt tidligere.
        var firsttime = true;

        for (quizid in users) { //for every quiz
            let participatingusers = users[quizid];
            let countedusers = 1;

            for (let p= 0;p<participatingusers.length;p++) {    //for all users in the quiz
                questionid = ((quizid-1)*10)+1;
                if (countedusers === participatingusers.length) {
                    while (countedusers >= participatingusers.length && countedusers<=10) {
                        questionid = (quizid-1)*10+1;

                        for (let r=1; r<=10;r++) {  //adding for annomous users
                            let addstring = "";
                            let result = Math.floor(Math.random()*2);
                            addstring = `,('answerObject${1}.${quizid}.${questionid}',${result},${questionid},'${1}')`;
                            sqlInsertAnswer += addstring;
                            questionid++;
                        }
                        countedusers++;
                    }
                }else {
                    for (let q = 1; q <= 10; q++) {
                        let addstring = "";
                        let result = Math.floor(Math.random() * 2);
                        if (firsttime) {
                            addstring =`('answerObject${participatingusers[p]}.${quizid}.${questionid}',${result},${questionid},'${participatingusers[p]}')`;
                            firsttime = false;
                        }else{
                            addstring = `,('answerObject${participatingusers[p]}.${quizid}.${questionid}',${result},${questionid},'${participatingusers[p]}')`;
                        }
                        sqlInsertAnswer += addstring;
                        questionid++;
                    }
                    countedusers++;
                }
            }
        }

        sqlInsertAnswer += ";";

        //Creating Type Insert
        let sqlInsertType = `INSERT INTO Type(type,name) VALUES (${type.typeid},'${type.typename}')`;

        const rejectErr = (err) => { if (err) { reject(err); return true; } else { return false; }};
        //Running SQL Statements
        db.serialize(function () {   
            const strings = [sqlInsertFeide, sqlInsertUser, sqlInsertCourse, sqlInsertUserRight, sqlInsertQuiz, sqlInsertQuestion, sqlInsertQuizHasQuestion, sqlInsertUserHasQuiz, sqlInsertAnswer, sqlInsertType];
            
            strings.forEach((s, i) => i != strings.length - 1 ? db.run(s, (err) => rejectErr(err)) : db.run(s, (err) => rejectErr(err) ? "" : resolve()));
        });

    });
};