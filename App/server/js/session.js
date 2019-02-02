class Session {
    /*
    sessionid
    sessionname
    status
    participants
    courseSemester
    courseName
    */
    constructor(id, name, status, userList, courseSemester, courseName, questionList, sessionCode) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.userList = userList;
        this.courseSemester = courseSemester;
        this.courseName = courseName;
        this.questionList = questionList;
        this.sessionCode = sessionCode;
        this.currentQuestion = 0;
        this.currentUsers = 0
    }

    addUser(user) {
        this.userList.push(user);
        this.currentUsers++;
    }

    userLeaving() {
        this.currentUsers--;
    }

}

class Question {
    /*
    questionId
    questionText
    questionDescription
    questionObject
    questionSolution
    questionType
    courseCode
    */
    constructor(id, text, description, object, solution, type, time) {
        this.id = id;
        this.text = text;
        this.description = description;
        this.object = object;
        this.solution = solution;
        this.type = type;
        this.time = time;
        this.answerList = [];
    }
}

class Answer {
    /*
    questionId
    userId
    answerObject
    result
    */
    constructor(questionId, userId, answerObject, result) {
        this.questionId = questionId;
        this.userId = userId;
        this.answerObject = answerObject;
        this.result = result;
    }
}

module.exports.Session = Session;
module.exports.Question = Question;
module.exports.Answer = Answer;
