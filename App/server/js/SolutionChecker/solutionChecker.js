let checkers = {
	1: require("./text.js"),
	2: require("./multipleChoice.js"),
	3: require("./shellsort.js"),
	4: require("./mergesort.js"),
	5: require("./quicksort.js"),
	6: require("./binaryTree.js"),
	7: require("./binaryTree.js"),
	8: require("./binaryTree.js"),
	9: require("./djikstra.js"),
	10: require("./python.js"),
	11: require("./text.js"), // Not implemented yet
	12:require("./text.js"), // Not implemented yet
	13: require("./python.js")
};

const solutionChecker = {
	checkAnswer: function(answer, solution, type) {
		if (checkers[type] !== undefined) {
			return checkers[type].check(answer, solution, type);
		}
		else return false;
	}
};

module.exports.solutionChecker = solutionChecker;
