class Session {
    /*
    sessionid
    sessionname
    status
    participants
    courseSemester
    courseName
    */
    constructor(sessionId, sessionName, status, userList, courseSemester, courseName, questionList, sessionCode) {
        this.sessionId = sessionId;
        this.sessionName = sessionName;
        this.status = status;
        this.userList = userList;
        this.courseSemester = courseSemester;
        this.courseName = courseName;
        this.questionList = questionList;
        this.sessionCode = sessionCode;
    }

    addUser(user) {
        this.userList.push(user);
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
    constructor(questionId, questionText, questionDescription, questionObject, questionSolution, questionType, courseCode, time) {
        this.questionId = questionId;
        this.questionText = questionText;
        this.questionDescription = questionDescription;
        this.questionObject = questionObject;
        this.questionSolution = questionSolution;
        this.questionType = questionType;
        this.courseCode = courseCode;
        this.time = time;
    }
}

class Answer {
    /*
    answerId
    questionId
    userId
    answerObject
    result
    */
    constructor(answerId, questionId, userId, answerObject, result) {
        this.answerId = answerId;
        this.questionId = questionId;
        this.userId = userId;
        this.answerObject = answerObject;
        this.result = result;
    }
}

module.exports.Session = Session;
module.exports.Question = Question;
module.exports.Answer = Answer;
