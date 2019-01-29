class Quiz {
    /*
    quizid
    quizname
    status
    participants
    courseSemester
    courseName
    */
    constructor(quizId, quizName, status, userList, courseSemester, courseName, questionList, quizCode) {
        this.quizId = quizId;
        this.quizName = quizName;
        this.status = status;
        this.userList = userList;
        this.courseSemester = courseSemester;
        this.courseName = courseName;
        this.questionList = questionList;
        this.quizCode = quizCode;
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

module.exports.Quiz = Quiz;
module.exports.Question = Question;
module.exports.Answer = Answer;
