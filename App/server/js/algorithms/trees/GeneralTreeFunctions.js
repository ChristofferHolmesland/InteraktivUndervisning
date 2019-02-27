const BinaryTreeNode = require("./Tree.js").BinaryTreeNode;
const Tree = require("./Tree.js").Tree;

//Converts object given by the graphDrawer to a tree object, has not been fully tested.
//the trees should be checked if they are valid after this function is finished
//This function is going to transform a student's and teacher's drawn tree to a tree object.
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


//Checks to two tree branches whether or not they are the same.
//Will return true if two trees are the same and false if they are not.
// Is going to be used to check a students answer with the solution!
function checkStudentAnswer(studentTree,solutionTree) {
	let checkresult = true;
	if (studentTree.nodes.length === solutionTree.nodes.length) {
		checkresult = checkNode(studentTree.root,solutionTree.root,checkresult);
	}else {
		checkresult = false;
	}
	//should probably be done in recursive function

	return checkresult
}
module.exports.checkStudentAnswer = checkStudentAnswer;

//Traverses the tree looking for the best existing node to add the new given node.
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
module.exports.findBestParent = findBestParent;

//this function returns the maximum height of the given node
function getHeight (node) {
	let childrenHeights = [];
	let maxHeight = 0;
	if (node !== undefined) {	//changing this to childrenAmount leads to errors in the test, must be investigated once working on AVL trees.
		for (let i = 0; i < node.children.length; i++) {
			childrenHeights.push(getHeight(node.children[i]));
		}
		for (let i = 0; i < childrenHeights.length; i++) {
			//console.log(childrenHeights);
			if (childrenHeights[i] > maxHeight) {
				maxHeight = childrenHeights[i];
			}
		}
		maxHeight++;
	}
	return maxHeight;
}
module.exports.getHeight = getHeight;

//checks two nodes from different trees and returns false if they don't have the same value
//Eventually the function will have traversed the entire tree in a inOrder algorithm
function checkNode(studentNode,solutionNode,checkresult) {
	//debug consoles
	/*console.log("Student");
	console.log(studentNode);
	console.log(studentNode.children);
	console.log("Solution");
	console.log(solutionNode.children);*/
	if (studentNode.value !== solutionNode.value) {
		checkresult = false;
	}
	let studentParent = studentNode.parent;
	let solutionParent = solutionNode.parent;
	if (studentParent !== undefined && solutionParent !== undefined) {
		if (studentParent.value !== solutionParent.value) {
			checkresult = false
		}
	}else if (studentParent === undefined && solutionParent === undefined){

	}else {
		checkresult = false;
	}

	if ((solutionNode.children[0] !== undefined || studentNode.children[0] !== undefined) && checkresult) {
		checkresult = checkNode(studentNode.children[0],solutionNode.children[0],checkresult)
	}
	if ((solutionNode.children[1] !== undefined || studentNode.children[1] !== undefined) && checkresult) {
		checkresult =  checkNode(studentNode.children[1],solutionNode.children[1],checkresult)
	}

	return checkresult
}



/*function getBestReplacementNodes(node,tree) {
	let replacementNodes = [];
	if (node.value > tree.root.value) {
		//node is in the rightSubTree
		let rightChild = node.children[1];
		while(rightChild.children[0] !== undefined) rightChild = rightChild.children[0];
		replacementNodes.push(rightChild);
	}else if(node.value < tree.root.value) {
		//node is in the leftSubTree
		let leftChild = node.children[0];
		while (leftChild.children[1] !== undefined) leftChild = leftChild.children[1];
		replacementNodes.push(leftChild)
	}else {
		//node is the root!
		console.log("The node is the root node");
		let leftChild = node.children[0];
		let rightChild = node.children[1];
		while(leftChild.children[1] !== undefined) leftChild = leftChild.children[1];
		while(rightChild.children[0] !== undefined) rightChild = rightChild.children[0];
		replacementNodes.push(leftChild);
		replacementNodes.push(rightChild);
	}
	return replacementNodes
}*/
//the node should have 2 children when used
function getBestReplacementNodes(node) {
	let replacementNodes = [];
	if (node.childrenAmount > 1) {
		let leftChild = node.children[0];
		let rightChild = node.children[1];
		if (leftChild !== undefined) {
			while (leftChild.children[1] !== undefined) leftChild = leftChild.children[1];
			replacementNodes.push(leftChild);
		}
		if (rightChild !== undefined) {
			while (rightChild.children[0] !== undefined) rightChild = rightChild.children[0];
			replacementNodes.push(rightChild);
		}
	}
	return replacementNodes
}

//function created to remove duplicate solution trees.
function removeDuplicateTreeResult(treelist) {
	let newTreelist = [];
	newTreelist.push(treelist[0]);
	for (let l=1;l<treelist.length;l++){
		for (let o=0;o<newTreelist.length;o++){
			if (!checkStudentAnswer(newTreelist[l],newTreelist[0]))	{
				newTreelist.push(newTreelist[l]);
			}
		}
	}
	return newTreelist
}

module.exports.getBestReplacementNodes = getBestReplacementNodes;
