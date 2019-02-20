const Tree = require("./Tree").Tree;
const BinaryTreeNode = require("./Tree").BinaryTreeNode;

module.exports.checkBinarySearchTreeCriteria = function (tree) {
	//Should check that there are no duplicate values in the list!
	let treeNodes = tree.nodes;
	//Normal Tree rules
	let checkresult = true;
	if (treeNodes.length === 0) {
		checkresult = false;
		return checkresult;
	}
	for(let i=0;i<treeNodes.length;i++) {
		let currentNode = treeNodes[i];
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

//Checks to two tree branches whether or not they are the same.
//Will return true if two trees are the same and false if they are not.
module.exports.checkStudentAnswer = function (studentTree,solutionTree) {
	let checkresult = true;
	if (studentTree.nodes.length === solutionTree.nodes.length) {
		checkresult = checkNode(studentTree.root,solutionTree.root,checkresult);
	}else {
		checkresult = false;
	}
	//should probably be done in recursive function

	return checkresult
};
//checks two nodes from different trees and returns false if they don't have the same value
//Eventually the function will have traversed the entire tree in a inOrder algorithm
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

//Creates a tree object based on added elements to the tree.
//The function will either create a new tree instance or add the elements to a given tree.
module.exports.createBinarySearchTreeSolution = function(addedElements,existingTreeObject) {
	let tree;
	let a = 0;
	let rootNode;
	if (existingTreeObject !== undefined) {	//there is an existing tree
		tree = existingTreeObject;
		rootNode = tree.root;
	}else {	//existing tree is not given
		rootNode = new BinaryTreeNode(addedElements[0]);
		tree = new Tree(rootNode);
		a++;
	}
	for (a;a<addedElements.length;a++) {
		let node = new BinaryTreeNode(addedElements[a]);
		let bestParent = findBestParent(node,rootNode);
		node.addParent(bestParent);
		tree.nodes.push(node);
	}
	return tree
};
//Traverses the tree looking for the best existing node to add a new given node.
//parentNode should initially be the root node.
function findBestParent(node,parentNode) {
	let bestParent = parentNode;
	if (node.value < parentNode.value) {
		if(parentNode.children[0] !== undefined) {
			bestParent = findBestParent(node,parentNode.children[0])
		}else {
			return parentNode
		}
	}else if (node.value > parentNode.value) {
		if(parentNode.children[1] !== undefined) {
			bestParent = findBestParent(node,parentNode.children[1])
		}else {
			return parentNode;
		}
	}
	return bestParent;
}
