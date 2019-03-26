const BinaryTreeFunctions = require("../algorithms/trees/BinaryTree.js");
const GeneralTreeFunctions = require("../algorithms/trees/GeneralTreeFunctions.js");

const check = function (answerTree,type,solution) {
	//assuming the solution is created and is given as a parameter.
	//Pretty sure that there is no reason to check the BinarySearchTree and AVL conditions, since the only way to  result = true is when the answer===solution.
	//assume JSON.parse have already been used!

	let result = false;
	let treeList = GeneralTreeFunctions.createTreeObjectFromCanvasObjectver1(answerTree);
	if (treeList.length === 1) {
		if (BinaryTreeFunctions.checkTreeCriteria(treeList[0])) {
			let sol = solution[solution.length];
			for (let s=0;sol.treeInfo.length;s++) sol.treeInfo[s].makeBSTAVLTreeReadyForImport();
			if (type !== 6) {
				for (let t = 0; t < sol.treeInfo.length; t++) {
					result = GeneralTreeFunctions.checkStudentAnswer(treeList[0], sol.treeInfo[t]);
					if (result) break;
				}
			}else {
				if (answerTree.nodes.length === solution.nodes.length) {
					result = answerTree.areValuesInTree(solution.nodes);
				}
			}
		}
	}
	return result
};

module.exports.check = check;