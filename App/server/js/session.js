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
		this.currentQuestion = -1;
		this.currentUsers = 0
	}

	addUser(user) {
		if (
			user.feide === undefined ||
			this.userList.findIndex(
				connectedUser => {
					if (connectedUser.feide !== undefined) {
						if (connectedUser.feide.idNumber === user.feide.idNumber) {
							return true;
						}
					}
					return false;
				}
			) === -1
		) {
			this.userList.push(user);
			this.currentUsers++;
			if (this.currentQuestion > -1) this.questionList[this.currentQuestion].connectedUsers++;
		}
	}

	userLeaving(id) {
		let question = this.questionList[this.currentQuestion];

		if (!question.socketsAnswered[id]) {
			this.currentUsers--;
			question.connectedUsers--;
		} else {
			this.currentUsers--;
		}
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
	constructor(id, text, description, object, solution, type, time, sqId) {
		this.id = id;
		this.text = text;
		this.description = description;
		this.object = object;
		this.solution = solution;
		this.type = type;
		this.time = time;
		this.answerList = [];
		this.sqId = sqId;
		this.socketsAnswered = {};
		this.connectedUsers = 0;
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
