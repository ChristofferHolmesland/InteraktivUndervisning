const BinaryTreeFunctions = require("../algorithms/trees/BinaryTree.js");
const GeneralTreeFunctions = require("../algorithms/trees/GeneralTreeFunctions.js");
const BinaryTreeChecker = function (answerTree,solution) {
	//assuming the solution is created and is given as a parameter.
	//Pretty sure that there is no reason to check the BinarySearchTree and AVL conditions, since the only way to  result = true is when the answer===solution.
	let result = false;
	let treeList = GeneralTreeFunctions.createTreeObjectFromCanvasObjectver1(answerTree);
	if (treeList.length > 2) {
		result = false;
	}
	if (BinaryTreeFunctions.checkTreeCriteria(treeList)) {
		result = GeneralTreeFunctions.checkStudentAnswer(treeList[0], solution);
	}else {
		result = false;
	}
	return result
};

module.exports.BinaryTreeChecker = BinaryTreeChecker;