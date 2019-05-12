const BinaryTreeFunctions = require("../algorithms/trees/BinaryTree.js");
const GeneralTreeFunctions = require("../algorithms/trees/GeneralTreeFunctions.js");

const check = function (answerTree, solution, type) {
	let result = false;
	let treeList = GeneralTreeFunctions.createTreeObjectFromCanvasObjectver1(answerTree);

	// The student didn't draw a tree, if the solution is also empty, then they get correct, if not then their answer is wrong.
	if (type !== 6 && treeList === undefined && solution[solution.length-1].treeInfo[0].root !== undefined) {
		return false;
	}else if (type === 6 && treeList === undefined) {
		return false;
	}else if (type !== 6 && treeList === undefined && solution[solution.length-1].treeInfo[0].root === undefined) {
		return true
	}

	if (treeList.length === 1) {
		if (BinaryTreeFunctions.checkTreeCriteria(treeList[0])) {
			//BST and AVL tree questions
			if (type !== 6) {
				let sol = solution[solution.length - 1];
				for (let s = 0; s < sol.treeInfo.length; s++) GeneralTreeFunctions.makeBSTAVLTreeReadyForImport(sol.treeInfo[s]);
				for (let t = 0; t < sol.treeInfo.length; t++) {
					result = GeneralTreeFunctions.checkStudentAnswer(treeList[0], sol.treeInfo[t]);
					if (result) break;
				}
			//Binary Tree questions
			}else {
				if (treeList[0].nodes.length === solution.nodes.length) {
					result = GeneralTreeFunctions.areValuesInTree(solution.nodes,treeList[0]);
				}
			}
		}
	}
	return result
};

module.exports.check = check;