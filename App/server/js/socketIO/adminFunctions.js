const dbFunctions = require("../database/databaseFunctions").dbFunctions;

const generalFunctions =  require("../generalFunctions.js").functions;
const algorithms = require("../algorithms/algorithms");
const Tree = require("../algorithms/trees/Tree.js").Tree;
const BinaryTreeNode = require("../algorithms/trees/Tree").BinaryTreeNode;
const BinaryTreeFunctions = require("../algorithms/trees/BinaryTree.js");
const BinarySearchTreeFunctions = require("../algorithms/trees/BinarySearchTree.js");
const AVLTreeFunctions = require("../algorithms/trees/AVLTree.js");
const GeneralTreeFunctions = require("../algorithms/trees/GeneralTreeFunctions.js");
const session = require("../session.js").Session;
const question = require("../session.js").Question;
const answer = require("../session.js").Answer;


let validateQuestion = function (questionInfo) {
		//TODO put different cases together if they have the same question validations, example the tree cases
		let treeAction = questionInfo.objects.solutionTreeType;
		let questionType = questionInfo.solutionType;
		console.log(questionType);
		let treeElements = questionInfo.objects.treeElements;
		let givenStartTree = questionInfo.objects.startTree;
		console.log("Given Tree");
		console.log(givenStartTree);
		let result = {validation: true, reason:""};
		switch(questionType) {
			case 1:	//Text input
				break;
			case 2:	//Multiple choice
				break;
			case 3:	//MergeSort
				break;
			case 4: //QuickSort
				break;
			case 5:	//ShellSort
				break;
			case 6: //Binary Tree
				if (treeElements === undefined || treeElements === "") {
					result.validation = false;
					result.reason = "You need to input the elements that are going to be in the tree";
				}
				else {
					let treeArray = treeElements.split(",");
					if (treeArray.length === 0){
						result.validation = false;
						result.reason = "Wrong format for the element list!\n Only number values and the elements should be separated by a ,"
					}
					else {
						for (let i=0;i<treeArray.length;i++) {
							if(isNaN(treeArray[i])){
								result.validation = false;
								result.reason = "The element list should only contain numbered-valued elements!";
								break;
							}
						}
					}
				}
				break;
			case 7: case 8:	//Binary Search Tree, AVL Tree
				let startTree = [];
				let treeArray = [];
				if(treeAction === "Add") {
					//add nodes
					console.log("treeAction == add");
					if((givenStartTree === undefined || givenStartTree.roots.length === 0) && (treeElements === undefined || treeElements === "")) {
						result.validation = false;
						result.reason = "Missing required fields for an add tree question!";
					}
					else {
						if(givenStartTree !== undefined && givenStartTree.roots.length !== 0) {
							startTree = GeneralTreeFunctions.createTreeObjectFromCanvasObjectver1(givenStartTree);
							if(startTree.length > 1) {
								result.validation = false;
								result.reason = "The given tree has more than 1 root node!";
							}
							if(!BinaryTreeFunctions.checkTreeCriteria(startTree[0])) {
								result.validation = false;
								result.reason = "The given tree is not a valid Binary Tree!";
							}
							if(!BinarySearchTreeFunctions.checkBinarySearchTreeCriteria(startTree[0])) {
								result.validation = false;
								result.reason = "The given tree is not a valid Binary Search Tree!";
							}
						}
						if(treeElements !== undefined && !(treeElements === "")) {
							treeArray = treeElements.split(",");
							for (let i=0;i<treeArray.length;i++) {
								if(isNaN(treeArray[i])){
									result.validation = false;
									result.reason = "The element list should only contain numbered-valued elements!";
									break;
								}
							}
						}
						if(result.validation){
							let treeObject;
							console.log("StartTree");
							console.log(startTree[0]);
							if (startTree.length === 1 && treeArray.length > 1) {
								for (let a=0;a<treeArray.length;a++) {
									let index = startTree[0].findNodeInNodesUsingValue(treeArray[a]);
									if (index > -1) {
										result.validation = false;
										result.reason = "Cannot add a node to the existing tree that has the same value as an existing node!";
										break;
									}
								}
							}
							if(questionType === 7 && result.validation) {
								if (startTree.length > 0) treeObject = BinarySearchTreeFunctions.createBinarySearchTree(treeArray, true, startTree[0]);
								else treeObject = BinarySearchTreeFunctions.createBinarySearchTree(treeArray, true);
								treeObject[0].printTree();
								if(!BinarySearchTreeFunctions.checkBinarySearchTreeCriteria(treeObject[0])){
									result.validation = false;
									result.reason = "The resulting tree is not a valid Binary Search Tree";
								}
							}
							if(questionType === 8 && result.validation) {
								//startTree[0].printTree();
								console.log("TreeArray:");
								console.log(treeArray);
								console.log("StartTree:");
								startTree[0].printTree();
								if (startTree.length > 0) treeObject = AVLTreeFunctions.createAVLTree(treeArray, true, startTree[0]);
								else treeObject = AVLTreeFunctions.createAVLTree(treeArray, true);
								if(!BinarySearchTreeFunctions.checkBinarySearchTreeCriteria(treeObject[0]) || !AVLTreeFunctions.checkBalance(treeObject[0].root)) {
									result.validation = false;
									result.reason = "The resulting tree is not a valid AVL Tree";
								}
							}
						}
					}
				}else if(treeAction === "Remove") {
					//remove nodes
					console.log("treeAction == remove");
					if ((givenStartTree === undefined || givenStartTree.roots.length === 0) || treeElements === undefined || treeElements === "") {
						result.validation = false;
						result.reason = "Missing required fields for a remove tree question!"
					}
					else {
						treeArray = treeElements.split(",");
						if(treeArray.length === 0) {
							result.validation = false;
							result.reason = "Wrong format for the element list!\n Only number values and the elements should be separated by a ,"
						}
						for (let i=0;i<treeArray.length;i++) {
							if(isNaN(treeArray[i])){
								result.validation = false;
								result.reason = "The element list should only contain numbered-valued elements!";
								break;
							}
						}
						startTree = GeneralTreeFunctions.createTreeObjectFromCanvasObjectver1(givenStartTree);
						if(startTree.length > 1) {
							result.validation = false;
							result.reason = "The given tree has more than 1 root node!"
						}
						if(!BinaryTreeFunctions.checkTreeCriteria(startTree[0])) {
							result.validation = false;
							result.reason = "The given tree is not a valid Binary Tree!";
						}
						if(!BinarySearchTreeFunctions.checkBinarySearchTreeCriteria(startTree[0])) {
							result.validation = false;
							result.reason = "The given tree is not a valid Binary Search Tree!";
						}
						if(!startTree[0].areValuesInTree(treeArray)){
							result.validation = false;
							result.reason = "An element that is to be removed from the given tree does not exist in the given tree!";
						}
						console.log("StartTree");
						startTree[0].printTree();
						if(questionType === 7 && result.validation) {
							let treeObject = BinarySearchTreeFunctions.createBinarySearchTree(treeArray,false,startTree[0]);
							for(let i=0;i<treeObject.length;i++) {
								console.log("treeObject i:" + i);
								treeObject[i].printTree();
								if(!BinarySearchTreeFunctions.checkBinarySearchTreeCriteria(treeObject[i])) {
									result.validation = false;
									result.reason = "One of the resulting trees are not a valid Binary Search Tree";
								}
								if (!result.validation) break;
							}
						}
						if(questionType === 8 && result.validation) {
							let treeObject = AVLTreeFunctions.createAVLTree(treeArray,false,startTree[0]);
							for(let i=0;i<treeObject.length;i++) {
								console.log("treeObject i:" + i);
								treeObject[i].printTree();
								if(!BinarySearchTreeFunctions.checkBinarySearchTreeCriteria(treeObject[i]) || !AVLTreeFunctions.checkBalance(treeObject[i].root)) {
									result.validation = false;
									result.reason = "One of the resulting trees are not a valid AVL Tree";
								}
								if (!result.validation) break;
							}
						}
					}
				}else {
					result.validation = false;
					result.reason = "Neither add tree question or remove tree question was chosen!";
				}
				break;
			case 10: //Graph
				break;
			case 11: //Djikstra
				break;
			case 12: //BellmanFord
			case 13: //BFS
			case 14: //Python
			default:	//undefined or a case that should not exist
				result.validation = false;
				result.reason = "The chosen question type is not a valid question type!"
		}
		console.log(result);
	return result;
};

let courseListRequestHandler = function(socket, db, user, sessions) {
	if (user.feide) feideId = user.feide.idNumber;
	dbFunctions.get.userCourses(db, feideId).then((courses) => {
		let result = [];
		for (let i = 0; i < courses.length; i++) {
			let courseString = courses[i].code + " " + courses[i].semester;
			result.push({
				"value": courseString,
				"text": courseString
			});
		}
		socket.emit("courseListResponse", result);
	}).catch((err) => {
		console.error(err);
	});
}

var currentSession = undefined;

function generateSolution(question) {
	let solutionType = question.solutionType;
	console.log(solutionType);
	if (solutionType === 1 || solutionType === 2) {
		return question;
	}
	else if (solutionType >= 3 && solutionType <= 5) {
		// Determine sorting function
		let sorter = undefined;
		if (solutionType === 3) sorter = algorithms.sorting.shellsort;
		else if (solutionType === 4) sorter = algorithms.sorting.mergesort;
		else if (solutionType === 5) sorter = algorithms.sorting.quicksort;
	
		// Check if the array contains numbers and remove whitespace
		let isNumbers = true;
		let elements = question.objects.startingArray.split(",");
		for (let i = 0; i < elements.length; i++) {
			elements[i] = elements[i].trim();
			if (isNaN(Number(elements[i]))) isNumbers = false;
		}
		// This is done in a seperate loop, because an array of strings
		// might contain some elements which are numbers.
		if (isNumbers) {
			for (let i = 0; i < elements.length; i++) {
				elements[i] = Number(elements[i]);
			}
		}

		let steppingFunctions = undefined;

		if (solutionType === 3) steppingFunctions = sorter(question.objects.kValue, elements);
		else steppingFunctions = sorter(elements);
		// Store all the steps in the solution
		//question.objects.startingArray = undefined;
		question.solution = steppingFunctions.getSteps();
		// Assign the first step to the objects, so the user can
		// manipulate it.
		question.objects.steps = [steppingFunctions.reset()];
	}
	else if(solutionType === 6) { //TODO create solution object for binary Tree & Update solutionChecker for normal Binary Trees
		//store the tree elements
		let binaryTree = new Tree(new BinaryTreeNode(question.objects.treeElements[0]));
		binaryTree.nodes = question.objects.treeElements;
		question.solution = binaryTree
	}else if(solutionType === 7 || solutionType === 8) {
		console.log("QUESTION!");
		console.log(question.objects.solutionTreeType);
		let elements = question.objects.treeElements;
		let startCanvasTree = question.objects.startTree;
		let startTree = [];
		let arrayOfElements = [];
		let solutionArray = [];

		if (elements !== "" && elements !== undefined) {
			arrayOfElements = elements.split(",");
		}
		console.log(question);
		if (startCanvasTree !== undefined && startCanvasTree.roots.length !== 0) startTree = GeneralTreeFunctions.createTreeObjectFromCanvasObjectver1(startCanvasTree);
		console.log("Array of Elements:");
		console.log(arrayOfElements);
		startTree[0].printTree();
		if (solutionType === 7) {
			if (question.objects.solutionTreeType === "Add") solutionArray = BinarySearchTreeFunctions.createBinarySearchTreeSolution(arrayOfElements, true, startTree[0]);
			else solutionArray = BinarySearchTreeFunctions.createBinarySearchTreeSolution(arrayOfElements, false, startTree[0]);
		} else {
			if (question.objects.solutionTreeType === "Add") solutionArray = AVLTreeFunctions.createAVLTreeSolution(arrayOfElements, true, startTree[0]);
			else solutionArray = AVLTreeFunctions.createAVLTreeSolution(arrayOfElements, false, startTree[0]);
		}
		console.log("SOLUTION");
		console.log(solutionArray);
		for(let s=0;s<solutionArray.length;s++){
			for(let t=0;t<solutionArray[s].treeInfo.length;t++){
				solutionArray[s].treeInfo[t].makeTreeReadyForExport();
			}
		}
		question.solution = solutionArray;
}
	else if (solutionType == 10) {
		let algo = algorithms.graphs.dijkstra;
		let from = undefined;
		let to = undefined;
		for (let i = 0; i < question.objects.graph.nodes.length; i++) {
			let node = question.objects.graph.nodes[i];
			if (node.marked == "Start") from = node;
			else if (node.marked == "End") to = node;
		}

		let stepper = algo(question.objects.graph, from, to);
		question.solution = stepper.getSteps();
		question.objects.steps = [stepper.reset()];
	}

	return question;
}

module.exports.admin = function(socket, db, user, sessions) {

	socket.on("courseListRequest", function() {
		courseListRequestHandler(socket, db, user, sessions);
	});

	socket.on("getSessions", function(course) {
		dbFunctions.get.allSessionWithinCourse(db, course.code, course.semester).then((sessions) => {
			socket.emit("getSessionsResponse", sessions);
		}).catch((err) => {
			console.error(err);
		});
	});

	socket.on("addNewSession", function(session) {
		let c = session.course.split(" ");
		dbFunctions.insert.session(db, session.title, c[1], c[0]).then(function (id) {
			for (let i = 0; i < session.questions.length; i++) {
				dbFunctions.insert.addQuestionToSession(db, id, session.questions[i].id);
			}
			socket.emit("addNewSessionDone");
		});
	});

	socket.on("getQuestionsInCourse", function(course) {
		dbFunctions.get.allQuestionsWithinCourse(db, course.code, course.semester).then((questions) => {
			let result = [];
			for (let i = 0; i < questions.length; i++) {
				result.push({
					value: questions[i].id,
					text: questions[i].text 
				});
			}
			socket.emit("sendQuestionsInCourse", result);
		});
	});

	socket.on("getSession", function(sessionId) {
		dbFunctions.get.sessionById(db, sessionId).then(async function(session) {
			let result = {};
			result.questions = [];

			let numberOfFeideUsers = await dbFunctions.get.feideUsersInSession(db, sessionId);
			numberOfFeideUsers = numberOfFeideUsers.length;
			let maxNumberOfAnonymouslyUsers = 0;
			let totalCorrectAnswers = 0;
			
			let questions = await dbFunctions.get.allQuestionInSession(db, session.id);
			for (let i = 0; i < questions.length; i++) {
				let question = questions[i];
				let answer = await dbFunctions.get.allAnswerToQuestion(db, question.sqId);
				let answers = [];
				let correctAnswers = 0;
				let anonymousUser = 0;

				answer.forEach(a => {
					if (a.userId === "1") anonymousUser++;

					if (a.result == 1) {
						correctAnswers++;
						totalCorrectAnswers++;
					}

					if(a.result === 0){
						answers.push({
							answerObject: a.object
						});
					}
				});

				result.questions.push({
					question: {
						text: question.text,
						description: question.description,
						object: question.object,
						type: question.type
					},
					solution: question.solution,
					answerList: answers,
					correctAnswer: Math.round(correctAnswers / answer.length * 100)
				});

				if (anonymousUser > maxNumberOfAnonymouslyUsers) maxNumberOfAnonymouslyUsers = anonymousUser;
			}

			result.participants = numberOfFeideUsers + maxNumberOfAnonymouslyUsers;

			result.correctAnswers = Math.round(totalCorrectAnswers / (result.questions.length * result.participants) * 100);
			result.numberOfQuestions = result.questions.length;

			socket.emit("getSessionResponse", result);
		});
	});

	socket.on("initializeSession", function(sessionId){
		if(currentSession != undefined) socket.emit("initializeSessionErrorResponse", "You are already running a session with the code: " + currentSession.session.id);
		dbFunctions.get.sessionById(db, sessionId).then(async (sessionInformation) => {
			let sessionCode = generalFunctions.calculateSessionCode(sessions);
			socket.join(sessionCode);
			
			let questions = await dbFunctions.get.allQuestionInSession(db, sessionInformation.id);
			let questionList = [];
			for(let i = 0; i < questions.length; i++){
				let tempQuestion = questions[i];
				tempQuestion.resultScreen = false;
				questionList.push(new question(tempQuestion.id, tempQuestion.text, tempQuestion.description, tempQuestion.object, tempQuestion.solution, tempQuestion.type, tempQuestion.time, tempQuestion.sqId));
			}

			currentSession = {session: new session(sessionInformation.id, sessionInformation.name,
											sessionInformation.status, [], sessionInformation.courseSemester,
											sessionInformation.courseName, questionList, sessionCode),
								adminSocket: socket,
								adminId: user.feide.idNumber}
			
			sessions.set(sessionCode, currentSession);
			
			socket.emit("initializeSessionResponse", sessionCode);
		}).catch((err) => {
			console.error(err);
			socket.emit("initializeSessionErrorResponse", "Something went wrong, please try again later!");
		});
	});

	// Course is an object with course code and course semester
	// e.g: {code: "DAT200", semester: "18H"}
	socket.on("sessionOverviewRequest", function(course) {
		dbFunctions.get.allSessionWithinCourseForSessionOverview(db, course.code, course.semester).then((sessionList) => {
			let response = [];
			
			for (let i = 0; i < sessionList.length; i++) {
				response.push({
					value: sessionList[i].id,
					text: sessionList[i].name
				});
			}

			socket.emit("sessionOverviewResponse", response);
		}).catch((err) => {
			console.error(err);
			socket.emit("sessionOverviewErrorResponse");
		});
	});
	
	socket.on("startSessionWaitingRoom", function(sessionCode) {
		if (sessions.get(sessionCode) === undefined) {
			socket.emit("startSessionError");
		}
		else {
			if (currentSession === undefined || currentSession.adminId === user.feide.idNumber){
				currentSession = sessions.get(sessionCode);
				currentSession.adminSocket = socket;
				socket.join(sessionCode);
			}
			if (currentSession.session.currentQuestion > -1) {
				let session = currentSession.session;
				let currentUsers = session.currentUsers;
		
				if (session.currentQuestion < session.questionList.length){
					let question = session.questionList[session.currentQuestion];
					question.connectedUsers = currentUsers;
					
					let timeLeft = question.time;
					if (question.time > 0)
						timeLeft = question.time - ((Date.now() - question.timeStarted) / 1000);

					let safeQuestion = {
						"text": question.text,
						"description": question.description,
						"object": question.object,
						"type": question.type,
						"time": timeLeft,
						"participants": session.currentUsers
					}

					socket.emit("nextQuestion", safeQuestion)

					if (session.currentQuestion > -1) {
						let numAnswers = question.answerList.length;
						let participants = question.connectedUsers;
						if(numAnswers === participants) {
							let answerList = [];
							if (question.answerList) answerList = question.answerList;
					
							let filteredAnswerList = [];
							let correctAnswer = 0;
							let incorrectAnswer = 0;
							let didntKnow = 0;
							
							for (let i = 0; i < answerList.length; i++) {
								let answer = answerList[i];
								let filteredAnswer = {};
								if (answer.result === 0) {
									filteredAnswer.answerObject = answer.answerObject;
									filteredAnswerList.push(filteredAnswer)
									incorrectAnswer++;
								};
								if (answer.result === -1) didntKnow++; 
								if (answer.result === 1) correctAnswer++;
							}
					
							let response = {
								question: {
									text: question.text,
									description: question.description,
									object: question.object,
									type: question.type
								},
								solution: question.solution,
								answerList: filteredAnswerList,
								correctAnswer: correctAnswer,
								incorrectAnswer: incorrectAnswer,
								didntKnow: didntKnow,
								users: answerList.length
							};

							socket.emit("goToQuestionResultScreen", response);
						}
						else {
							socket.emit("updateNumberOfAnswers", numAnswers, participants);
						}
					}
				} else {
					socket.to(session.sessionCode).emit("answerResponse", "sessionFinished");
					socket.emit("endSessionScreen");

					sessions.delete(session.sessionCode);
				}
			}
			else {
				socket.emit("startSessionWaitingRoomResponse");
				socket.emit("updateParticipantCount", currentSession.session.currentUsers);
			}
		}
	});

	socket.on("startSession", function(sessionCode) {
		let session = currentSession.session;

		session.currentQuestion++;

		let currentUsers = session.currentUsers;

		session.questionList[session.currentQuestion].connectedUsers = currentUsers;

		let firstQuestion = session.questionList[session.currentQuestion];

		firstQuestion.timeStarted = Date.now();
		
		let safeFirstQuestion = {
			"text": firstQuestion.text,
			"description": firstQuestion.description,
			"object": firstQuestion.object,
			"type": firstQuestion.type,
			"time": firstQuestion.time,
			"participants": currentSession.session.currentUsers
		};

		io.to(sessionCode).emit("nextQuestion", safeFirstQuestion);
	});

	socket.on("forceNextQuestion", function() {
		let session = currentSession.session;
		let question = session.questionList[session.currentQuestion];
		question.resultScreen = true;
		let answerList = [];
		if (question.answerList) answerList = question.answerList;
		console.log("test");
		console.log(question);

		let filteredAnswerList = [];
		let correctAnswer = 0;
		let incorrectAnswer = 0;
		let didntKnow = 0;
		
		for (let i = 0; i < answerList.length; i++) {
			let answer = answerList[i];
			if (answer.result === 0) {
				filteredAnswerList.push(answer)
				incorrectAnswer++;
			};
			if (answer.result === -1) didntKnow++; 
			if (answer.result === 1) correctAnswer++;
		}

		let response = {
			question: {
				text: question.text,
				description: question.description,
				object: question.object,
				type: question.type
			},
			solution: question.solution,
			answerList: filteredAnswerList,
			correctAnswer: correctAnswer,
			incorrectAnswer: incorrectAnswer,
			didntKnow: didntKnow,
			users: answerList.length
		};

		socket.to(currentSession.session.sessionCode).emit("adminForceNext");
		socket.emit("goToQuestionResultScreen", response);
	});

	socket.on("nextQuestionRequest", function() {
		let session = currentSession.session;
		let currentUsers = session.currentUsers;

		session.currentQuestion++;
		
		if (session.currentQuestion < session.questionList.length){

			let question = session.questionList[session.currentQuestion];
			question.connectedUsers = currentUsers;

			question.timeStarted = Date.now();

			let safeQuestion = {
				"text": question.text,
				"description": question.description,
				"object": question.object,
				"type": question.type,
				"time": question.time,
				"participants": session.currentUsers
			}

			io.to(session.sessionCode).emit("nextQuestion", safeQuestion)
		} else {
			socket.to(session.sessionCode).emit("answerResponse", "sessionFinished");
			socket.emit("endSessionScreen");

			sessions.delete(session.sessionCode);
		}
	});

	socket.on("closeSession", function() {
		socket.emit("closeSessionResponse");
	});

	socket.on("getSessionWithinCourse", function(course) {   
		dbFunctions.get.allSessionWithinCourse(db, course.code, course.semester).then((sessions) => {
			let result = [];
			for (let i = 0; i < sessions.length; i++) {
				result.push({
					value: sessions[i].id,
					text: sessions[i].name
				});
			}
			socket.emit("sendSessionWithinCourse", result);
		});
		
	});

	socket.on("addQuestionToSession", function(data) {
		dbFunctions.insert.addQuestionToSession(db, data.sessionId, data.questionId);
	});

	socket.on("getAllQuestionsWithinCourse", function(course) {
		dbFunctions.get.allQuestionsWithinCourse(db, course).then(questions => {
			let result = [];
			for (let i = 0; i < questions.length; i++) {
				let q = questions[i];
				result.push({
					id: q.id,
					text: q.text,
					description: q.description,
					solutionType: q.type,
					solution: q.solution,
					time: q.time,
					objects: q.object
				});
			}
			socket.emit("sendAllQuestionsWithinCourse", result);
		});
	});

	socket.on("addNewQuestion", function(question) {
		let valid = validateQuestion(question);
		socket.emit("confirmQuestionRequirements", valid);
		if (!valid.validation) return;

		question = generateSolution(question);
		
		dbFunctions.insert.question(db, question.text, question.description, question.solution, question.time,
			question.solutionType, question.courseCode, question.objects);
	});

	socket.on("updateQuestion", function(question) {
		let valid = validateQuestion(question);
		socket.emit("confirmQuestionRequirements", valid);
		if (!valid.validation) return;

		question = generateSolution(question);

		dbFunctions.update.question(db, question.id, question.text, question.description, question.objects, question.solution, question.solutionType, question.time);
	});

	socket.on("getQuestionTypes", function() {
		dbFunctions.get.questionTypes(db).then(types => {
			let result = [];
			for (let i = 0; i < types.length; i++) {
				result.push({
					value: types[i].type,
					text: types[i].name
				})
			}
			socket.emit("sendQuestionTypes", result);
		});
	});

	socket.on("createCourse", function(course) {
		dbFunctions.insert.course(db, course.semester, course.code, course.name).then(() => {
			dbFunctions.insert.courseAdmin(db, course.semester, course.code, user.feide.idNumber).then(() => {
				courseListRequestHandler(socket, db, user, sessions);
			});
		});
	});

	socket.on("getUsersByUserRightsLevelsRequest", function(data) {
		let course = data.course.split(" ");
		for (let i = 0; i < data.levels.length; i++) {
			let level = data.levels[i];

			dbFunctions.get.feideUsersByUserRightsLevel(db, level, course[0], course[1]).then((users) => {
				socket.emit("getUsersByUserRightsLevelResponse", {
					level: level,
					users: users
				});
			});
		}
	});

	/*
		data {
			feideId String
			course = "Code + Semester"
			level Int
		}
	*/
	socket.on("setUserRightsLevel", function(data) {
		let course = data.course.split(" ");
		dbFunctions.get.userRightsByFeideId(db, data.feideId, course[0], course[1]).then((user) => {
			if (user == undefined) {
				dbFunctions.insert.userRightsLevelByFeideId(db, data.feideId, course[0], course[1], data.level).then(() => {
					socket.emit("setUserRightsLevelDone");
				});
			} else if (data.level !== -1) {
				dbFunctions.update.userRightsLevelByFeideId(db, data.feideId, course[0], course[1], data.level).then(() => {
					socket.emit("setUserRightsLevelDone");
				});
			} else if (data.level == -1) {
				dbFunctions.del.userRights(db, data.feideId, course[0], course[1]).then(() => {
					socket.emit("setUserRightsLevelDone");
				});
			}
		});
	});
}