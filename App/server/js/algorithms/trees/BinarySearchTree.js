const Tree = require("./Tree").Tree;
const BinaryTreeNode = require("./Tree").BinaryTreeNode;

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

//Checks to two tree branches whether or not they are the same.
//Will return true if they and false if they are not.
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

//Converts object given by the graphDrawer to a tree object, has not been fully tested.
//the trees should be checked if they are valid after this function is finished
module.exports.createTreeObjectFromCanvasObjectver1 = function(treeCanvas) {
	let listofTrees = [];
	for (let l=0;l<treeCanvas.roots.length;l++) {
		let rootNode = new BinaryTreeNode(treeCanvas.roots[l].value,undefined,treeCanvas.roots[l].children);
		let tree = new Tree(rootNode);
		let parentNode = rootNode;
		for (let c=0;c<treeCanvas.roots[l].children.length;c++) {
			let node = new BinaryTreeNode(treeCanvas.roots[l].children[c].value,
				parentNode,
				treeCanvas.roots[l].children);	//will not work
			parentNode = node;
			tree.push(node);
		}
		listofTrees.push(tree);
	}
	return listofTrees
};

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
