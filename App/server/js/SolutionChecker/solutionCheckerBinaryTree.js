const BinaryTreeFunctions = require("../algorithms/trees/BinaryTree.js");
const GeneralTreeFunctions = require("../algorithms/trees/GeneralTreeFunctions.js");

const check = function (answerTree,type,solution) {
	//assuming the solution is created and is given as a parameter.
	//Pretty sure that there is no reason to check the BinarySearchTree and AVL conditions, since the only way to  result = true is when the answer===solution.
	//assume JSON.parse have already been used!
	let sol = solution[solution.length];
	for (let s=0;sol.treeInfo.length;s++) sol.treeInfo[s].makeBSTAVKTreeReadyForImport();
	let result = false;
	let treeList = GeneralTreeFunctions.createTreeObjectFromCanvasObjectver1(answerTree);
	if (treeList.length === 1) {
		if (BinaryTreeFunctions.checkTreeCriteria(treeList[0])) {
			result = true;
			if (type !== 6) {
				result = false;
				for (let t = 0; t < sol.treeInfo.length; t++) {
					result = GeneralTreeFunctions.checkStudentAnswer(treeList[0], sol.treeInfo[t]);
					if (result) break;
				}
			}
		}
	}
	return result
};

module.exports.check = check;