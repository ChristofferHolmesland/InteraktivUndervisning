const BinaryTreeNode = require("./BinaryTreeNode.js").BinaryTreeNode;

module.exports.checkBinarySearchTreeCriteria = function (tree) {
	//Should check that there are no duplicate values in the list!

	//Normal Tree rules
	let checkresult = true;
	if (tree.length === 0) {
		checkresult = false;
		return checkresult;
	}
	for(let i=0;i<tree.length;i++) {
		let currentNode = tree[i];
		//Every tree node needs a parent node, exception being root node.
		if (i > 0 && currentNode.parent === undefined) {
			checkresult = false;
			break;
		}
		//A tree node in a binary tree structures can only have up to 2 children. A left child or/and a right child.
		if (currentNode.children.length > 2) {
			checkresult = false;
			break;
		}

		//Binary search tree rules
		let leftChild = currentNode.children[0];
		let rightChild = currentNode.children[1];
		if (leftChild !== undefined) {
			if (leftChild.value >= currentNode.value) {
				checkresult = false;
				break
			}
		}
		if (rightChild !== undefined) {
			if (rightChild.value <= currentNode.value) {
				checkresult = false;
				break;
			}
		}

	}
	return checkresult
};

module.exports.checkStudentAnswer = function (studentTree,solutionTree) {
	let checkresult = true;
	if (studentTree.length === solutionTree.length) {
		checkresult = checkNode(studentTree[0],solutionTree[0],checkresult);
	}else {
		checkresult = false;
	}
	//should probably be done in recursive function

	return checkresult
};

function checkNode(studentNode,solutionNode,checkresult) {
	//debug consoles
	/*console.log("Student");
	console.log(studentNode);
	console.log("Solution");
	console.log(solutionNode);*/
	if (studentNode.value !== solutionNode.value) {
		checkresult = false;
	}
	if (studentNode.children[0] !== undefined && checkresult) {
		checkresult = checkNode(studentNode.children[0],solutionNode.children[0],checkresult)
	}
	if (studentNode.children[1] !== undefined && checkresult) {
		checkresult =  checkNode(studentNode.children[1],solutionNode.children[1],checkresult)
	}
	return checkresult

}
