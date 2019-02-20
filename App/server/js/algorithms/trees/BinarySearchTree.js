const Tree = require("./Tree").Tree;
const BinaryTreeNode = require("./Tree").BinaryTreeNode;
const GeneralTreeFunctions = require("./GeneralTreeFunctions.js");

//Checks whether or not the given tree is a valid Binary Search Tree.
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

//Creates a tree object based on added elements to the tree.
//The function will either create a new tree instance or add the elements to a given tree.
//Is going to be used to create a Binary Search tree object for the teacher's solution.
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
		let bestParent = GeneralTreeFunctions.findBestParent(node,rootNode);
		node.addParent(bestParent);
		tree.nodes.push(node);
	}
	return tree
};


