const Tree = require("./Tree.js").Tree;
const BinaryTreeNode = require("./Tree.js").BinaryTreeNode;

module.exports.checkAVLTree = function (tree) { //DOES NOT WORK DELETE LATER
	let leftheight = 0;
	let rightheight = 0;
	if (tree[0].children[0] !== undefined) {
		leftheight = getHeight(tree[0].children[0]);
	}
	if (tree[0].children[1] !== undefined) {
		rightheight = getHeight(tree[0].children[1]);
	}
	let result = true;
	console.log(leftheight);
	console.log(rightheight);
	if (Math.abs(leftheight - rightheight) > 1) {
		result = false;
	}
	return result
};

function getHeight(node) {
	let childrenHeights = [];
	let maxHeight = 0;
	if (node !== undefined) {
		for (let i = 0; i < node.children.length; i++) {
			childrenHeights.push(getHeight(node.children[i]));
		}
		for (let i = 0; i < childrenHeights.length; i++) {
			console.log(childrenHeights);
			if (childrenHeights[i] > maxHeight) {
				maxHeight = childrenHeights[i];
			}
		}
		maxHeight++;
	}
	return maxHeight;
}

function checkBalance(node) {
	let balanced = true;
	let leftHeight = 0;
	let rightHeight = 0;
	if (node.children[0] !== undefined) {
		leftHeight = getHeight(node.children[0]);
		balanced = checkBalance(node.children[0]);
	}
	if (node.children[1] !== undefined) {
		rightHeight = getHeight(node.children[1]);
		balanced = checkBalance(node.children[1]);
	}
	//console.log("LeftHeight: " + leftHeight);
	//console.log("RightHeight: " + rightHeight);
	if (balanced) {
		if (Math.abs(leftHeight - rightHeight) > 1) {
			balanced = false;
			return balanced
		}
	}
	return balanced
}

//checks the height of the given node
function getNodeHeight(node) {
	let leftHeight = 0;
	let rightHeight = 0;
	if (node.children[0] !== undefined) {
		leftHeight = getHeight(node.children[0]);
	}
	if (node.children[1] !== undefined) {
		rightHeight = getHeight(node.children[1]);
	}
	//console.log("LeftHeight: " + leftHeight);
	//console.log("RightHeight: " + rightHeight);
	return leftHeight-rightHeight	//the high will determine what kind of rotation needed for the AVL tree.
}

module.exports.createAVLTreeSolution = function (addedElements,existingTreeObject) {
	let tree;
	let a = 0;
	if (existingTreeObject !== undefined) {	//still buggy not fixed
		tree = existingTreeObject;
		while(checkBalance(tree.root) === false) {
			if (tree.root.children[0] !== undefined) {
				let getLowestLeftNode = tree.getLowestNode(tree.root.children[0]);
				checkAVLCondition(getLowestLeftNode,tree);
			}
			if (tree.root.children[1] !== undefined) {
				console.log("Hello PAPPA");
				let getLowestRightNode = tree.getLowestNode(tree.root.children[1]);
				console.log(getLowestRightNode);
				checkAVLCondition(getLowestRightNode,tree);
			}
		}
		console.log("Finished default tree balancing");
		tree.printTree();
	}else { //existing tree object not given	completely functional
		let rootNode = new BinaryTreeNode(addedElements[0]);
		tree = new Tree(rootNode);
		a++;
	}
	for (a;a<addedElements.length;a++) {
		let node = new BinaryTreeNode(addedElements[a]);
		let bestParent = findBestParent(node,tree.root);
		//console.log(bestParent);
		node.addParent(bestParent);
		tree.nodes.push(node);
		checkAVLCondition(node,tree);
	}
	return tree
};

function checkAVLCondition(node,tree) {
	let respNode = getResponsibleNode(node);
	if(getNodeHeight(respNode) < -1) {
		if(node.value > respNode.children[1].value) {
			//right rotation
			rotationRight(respNode,tree);
		}
		else if(node.value < respNode.children[1].value) {
			//dobbel left rotation
			rotationLeft(respNode.children[1],tree);
			rotationRight(respNode,tree);
		}else {
			console.log("How could this happen!");
		}
	}else if(getNodeHeight(respNode) > 1) {
		//left rotation
		if(node.value < respNode.children[0].value) {
			rotationLeft(respNode,tree);
		}else if(node.value > respNode.children[0].value) {
			//dobbel right rotation
			rotationRight(respNode.children[0],tree);
			rotationLeft(respNode,tree);
		}else {
			console.log("How could this happen!");
		}
	}else {
		console.log("No Rotation needed");
	}
}

function getResponsibleNode(node) {
	let chosenNode = node;
	while (Math.abs(getHeight(chosenNode.children[0]) - getHeight(chosenNode.children[1])) <= 1) {
		if (chosenNode.parent === undefined) {
			break;
		}
		chosenNode = chosenNode.parent;
	}
	return chosenNode
}

function rotationLeft(node,tree) {
	let leftChild = node.children[0];
	let parent = node.parent;
	//console.log(leftChild);
	//console.log(parent);
	if (parent !== undefined) {
		if (parent.children[0] === node) {
			parent.children[0] = leftChild;
		}else {
			parent.children[1] = leftChild;
		}
	}else {
		tree.changeRoot(leftChild);
	}
	let subNode = leftChild.children[1];
	leftChild.children[1] = node;
	node.children[0] = subNode;
	node.parent = leftChild;
	leftChild.parent = parent;
}

function rotationRight(node,tree) {
	let rightChild = node.children[1];
	let parent = node.parent;

	if(parent !== undefined) {
		if (parent.children[0] === node) {
			parent.children[0] = rightChild;
		}else {
			parent.children[1] = rightChild;
		}
	}else {
		tree.changeRoot(rightChild)
	}
	let subNode = rightChild.children[0];
	rightChild.children[0] = node;
	node.children[1] = subNode;
	node.parent = rightChild;
	rightChild.parent = parent;
}
//copy function that is originally from BinarySearchTree.js. Delete copy once the original has been exported correctly
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