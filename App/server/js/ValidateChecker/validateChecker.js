let checkers = {
	"basicInfo": require("./basicInfo.js"),
	"mediaInfo": require("./mediaInfo.js"),

	1: require("./text.js"),
	2: require("./multipleChoice.js"),
	3: require("./shellsort.js"),
	4: require("./mergeQuickSort.js"),
	5: require("./mergeQuickSort.js"),
	6: require("./binaryTree.js"),
	7: require("./binarySearchTreeAVLTree.js"),
	8: require("./binarySearchTreeAVLTree.js"),
	9: require("./djikstra.js"),
	10: require("./python.js"),

};


/*  validateChecker
	Gets an object from the editQuestion module from an admin,
	and validates the input that the user has entered.

	The function will return an object containing the following information:
	result: {
		passed: Boolean // Informing if the validation has passed or not.
		errors: Array // Contains a list of errors that should inform the user what went wrong in the validation process
	}
*/
const validateChecker = {
	checkQuestion: function(questionInformation) {
		let result = {
			passed: true,
			errors: []
		};

		// Checks and validates the basic information
		let basicInfo = {
			title: questionInformation.text,
			description: questionInformation.description,
			time: questionInformation.time
		};
		let basicInfoResult = checkers["basicInfo"].check(basicInfo);
		if(!basicInfoResult.passed) {
			result.passed = false;
			for (let i = 0; i < basicInfoResult.errors.length; i++) {
				result.errors.push(basicInfoResult.errors[i]);
			}
		}

		// Checks and validates the media content sent
		let mediaInfo = {
			files: questionInformation.objects.files,
			graphs: questionInformation.objects.graphs,
			tables: questionInformation.objects.tables
		};
		let mediaInfoResult = checkers["mediaInfo"].check(mediaInfo);
		if(!mediaInfoResult.passed) {
			result.passed = false;
			for (let i = 0; i < mediaInfoResult.errors.length; i++) {
				result.errors.push(mediaInfoResult.errors[i]);
			}
		}

		// Checks and validates solution type and inputs for the solution type
		let questionType = questionInformation.solutionType;

		if (checkers[questionType] !== undefined) {
			let solutionInfo = {};
			switch(questionType) {
			case 1:	//Text input
				solutionInfo.solution = questionInformation.solution;
				break;
			case 2:	//Multiple choice
				solutionInfo.multipleChoices = questionInformation.objects.multipleChoices;
				solutionInfo.solution = questionInformation.solution;
				break;
			case 3:	//Shellsort
				solutionInfo.startingArray = questionInformation.objects.startingArray;
				solutionInfo.kValue = questionInformation.objects.kValue;
				break;
			case 4: //Mergesort
			case 5:	//Quicksort
				solutionInfo.startingArray = questionInformation.objects.startingArray;
				break;
			case 6: //Binary Tree
				solutionInfo.treeElements = questionInformation.objects.treeElements;
				break;
			case 7:
			case 8: //Binary Search Tree and AVL tree
				solutionInfo.treeAction = questionInformation.objects.solutionTreeType;
				solutionInfo.questionType = questionType;
				solutionInfo.treeElements =  questionInformation.objects.treeElements;
				solutionInfo.givenStartTree = questionInformation.objects.startTree;
				break;
			case 9: //Djikstra
				solutionInfo.graph = questionInformation.objects.graph;
				break;
			case 10: //Python
				solutionInfo.code = questionInformation.solution;
				break;
			}
			let solutionTypeResult = checkers[questionType].check(solutionInfo);
			if(!solutionTypeResult.passed) {
				result.passed = false;
				for (let i = 0; i < solutionTypeResult.errors.length; i++) {
					result.errors.push(solutionTypeResult.errors[i]);
				}
			}
		}
		else {
			result.passed = false;
			result.errors.push("questionTypeError")
		}

		return result;
	}
};

module.exports.validateChecker = validateChecker;
