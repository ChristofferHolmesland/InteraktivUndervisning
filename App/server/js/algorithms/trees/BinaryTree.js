//Requirement for a binary tree. A tree node can only have 2 children a left and a right.
//Every child needs a parent.
//Tree is a DAG(directed acyclic graph), only 1 direction
const BinaryTreeNode = require("./BinaryTreeNode.js").BinaryTreeNode;
module.exports.checkTreeCriteria = function(tree) {
	let checkresult = true;
	if (tree.length === 0) {
		checkresult = false;
		return checkresult;
	}
	for(let i=0;i<tree.length;i++) {
		//Every tree node needs a parent node, exception being root node.
		if (i > 0 && tree[i].parent === undefined){
			checkresult = false;
			break;
		}
		//A tree node in a binary tree structures can only have up to 2 children. A left child or/and a right child.
		if (tree[i].children.length > 2) {
			checkresult = false;
			break;
		}
	}
	return checkresult
};
