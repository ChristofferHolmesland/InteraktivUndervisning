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
module.exports.findBestParent = findBestParent;

function getHeight (node) {
	let childrenHeights = [];
	let maxHeight = 0;
	if (node !== undefined) {
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

function removeNodeFromTree(node,tree,index) {
	let newTreeList = [];
	if (node !== undefined && tree !== undefined && index !== -1) {
		let parent = node.parent;
		if (node.children.length === 1) {
			let childrenNode;
			if (node.children[0] !== undefined) childrenNode = node.children[0];
			else childrenNode = node.children[1];
			if (parent === undefined) {
				tree.root = childrenNode; //current node is the root node
				childrenNode.parent = undefined;
			} else {
				if (parent.children[0] === node) parent.children[0] = childrenNode;
				else parent.children[1] = childrenNode;
				childrenNode.parent = parent;
			}
			tree.nodes.splice(index, 1);
		} else if (node.children.length === 2) {
			let tempNodeArray = getBestReplacementNodes(node, tree);
			for (let t = 0; t < tempNodeArray.length; t++) {
				let tempNode = tempNodeArray[0];
				let tempIndex = tree.nodes.indexOf(tempNode);
				if (tempNode.children.length > 1) {
					let tempParent = tempNode.parent;
					let childNode;
					if (tempNode.children[0] !== undefined) childNode = tempNode.children[0];
					else childNode = tempNode.children[1];
					childNode.parent = tempParent;
					if (tempParent.children[0] === tempNode) tempParent.children[0] = childNode;
					else tempParent.children[1] = childNode;
				}
				if (node === tree.root) {
					tree.root = tempNode;
				}
				let newTree = new Tree();
				tree.nodes[index] = tempNode;
				tree.nodes.splice(tempIndex, 1);
				newTree.root = tree.root;
				newTree.nodes = tree.nodes;
				newTreeList.push(newTree);
			}
		}
	} else {	//no children
		if (parent.children[0] === node) parent.children[0] = undefined;
		else parent.children[1] = undefined;
		let newTree = new Tree();
		newTree.root = tree.root;
		tree.nodes.splice(index, 1);
		newTree.nodes = tree.nodes;
		newTreeList.push(newTree);
	}

	return newTreeList
}
module.exports.removeNodeFromTree = removeNodeFromTree;

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
	if (node.children.length > 1) {
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
module.exports.getBestReplacementNodes = getBestReplacementNodes;