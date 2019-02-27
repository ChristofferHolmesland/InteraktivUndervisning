const Tree = require("./Tree").Tree;
const BinaryTreeNode = require("./Tree").BinaryTreeNode;
const GeneralTreeFunctions = require("./GeneralTreeFunctions.js");

//Checks whether or not the given tree is a valid Binary Search Tree.
module.exports.checkBinarySearchTreeCriteria = function (tree) {
	//Should check that there are no duplicate values in the list!
	let treeNodes = tree.nodes;
	//Normal Tree rules
	let checkresult = true;
	if (treeNodes.childrenAmount === 0) {
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
		if (currentNode.childrenAmount > 2) {
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
module.exports.createBinarySearchTreeSolution = function(elements,add,existingTreeObject) {
	let tree;
	let rootNode;
	let treelist = [];
	if (add) {
		console.log("Adding\n");
		let a = 0;
		if (existingTreeObject !== undefined) {	//there is an existing tree
			tree = existingTreeObject;
			rootNode = tree.root;
		} else {	//existing tree is not given
			rootNode = new BinaryTreeNode(elements[0]);
			tree = new Tree(rootNode);
			a++;
		}
		for (a; a < elements.length; a++) {
			let node = new BinaryTreeNode(elements[a]);
			let bestParent = GeneralTreeFunctions.findBestParent(node, rootNode);
			node.addParent(bestParent);
			tree.nodes.push(node);
		}
		treelist.push(tree);
	}else if(!add){
		console.log("Removing\n");
		if (existingTreeObject !== undefined) {
			tree = existingTreeObject;
			treelist.push(tree);
			for (let b=0;b<elements.length;b++) {
				for (let t = 0; t < treelist.length; t++) {
					let currentTree = treelist[t];
					let newTreeList = [];
					let treeIndex = currentTree.findNodeInNodesUsingValue(elements[b]);
					if (treeIndex !== -1) {
						let removedNode = currentTree.nodes[treeIndex];
						newTreeList = removeNodeFromBSTTree(removedNode,currentTree,treeIndex);
						if (newTreeList.length > 1) {
							treelist.splice(t,1,newTreeList[0],newTreeList[1]);
							t++;
						}else {
							treelist.splice(t,1,newTreeList[0]);
						}
					}
				}
			}
		}else {
			console.log("Non-existent tree cannot have removed entries.")
		}
	}
	return treelist
};

//removes an existing node in a given tree.
//The operations done on the tree is dependent on how many children the deleted node has.
function removeNodeFromBSTTree(node,tree,index) {
	let newTreeList = [];
	//console.log(node);
	//console.log(tree);
	//console.log(index);
	if (node !== undefined && tree !== undefined && index !== -1) {
		let newTree = tree.createDuplicateTree();
		let newNode = newTree.nodes[index];
		let parent = newNode.parent;
		if (newNode.childrenAmount === 1) {
			console.log("1 children");
			let childrenNode;
			if (newNode.children[0] !== undefined) childrenNode = newNode.children[0];
			else childrenNode = newNode.children[1];
			if (parent === undefined) {
				newTree.root = childrenNode;
				childrenNode.parent = undefined;
			} else {
				if (parent.children[0] === newNode) parent.children[0] = childrenNode;
				else parent.children[1] = childrenNode;
				childrenNode.parent = parent;
			}
			newTree.nodes.splice(index, 1);
			newTreeList.push(newTree);
		} else if (newNode.childrenAmount === 2) {
			console.log("2 children");
			let tempNodeArray = GeneralTreeFunctions.getBestReplacementNodes(newNode, newTree);
			for (let t = 0; t < tempNodeArray.length; t++) {
				let newSubTree = newTree.createDuplicateTree();
				let tempIndex = newSubTree.findNodeInNodesUsingNode(tempNodeArray[t]);
				let tempNode = newSubTree.nodes[tempIndex];
				let tempParent = tempNode.parent;


				if (tempNode.childrenAmount > 0) {
					let childNode;
					if (tempNode.children[0] !== undefined) childNode = tempNode.children[0];
					else childNode = tempNode.children[1];
					childNode.parent = tempParent;
					if (tempParent.children[0] === tempNode) tempParent.children[0] = childNode;
					else tempParent.children[1] = childNode;
				}else {
					if (tempParent.children[0] === tempNode) tempParent.children[0] = undefined;	//may cause problems with children amount
					if (tempParent.children[1] === tempNode) tempParent.children[1] = undefined;
				}
				let newSubNode = newSubTree.nodes[newSubTree.findNodeInNodesUsingNode(newNode)];
				tempNode.children = newSubNode.children;
				if (newNode.value === newSubTree.root.value) {
					tempNode.parent = undefined;
					newSubTree.root = tempNode;
				}else {
					tempNode.parent = newSubNode.parent;
					if (newSubNode.parent.children[0] === newSubNode) newSubNode.parent.children[0] = tempNode;
					else newSubNode.parent.children[1] = tempNode;
				}
				if (newSubNode.children[0] !== undefined) newSubNode.children[0].parent = tempNode;
				if (newSubNode.children[1] !== undefined) newSubNode.children[1].parent = tempNode;

				newSubTree.nodes[index] = tempNode;
				newSubTree.nodes.splice(tempIndex, 1);
				newTreeList.push(newSubTree);
			}
		} else {	//no children
			console.log("No children");
			if (parent.children[0] === newNode) parent.children[0] = undefined;
			else parent.children[1] = undefined;
			newTree.nodes.splice(index, 1);
			newTreeList.push(newTree);
		}
	}
	return newTreeList
}
module.exports.removeNodeFromBSTTree = removeNodeFromBSTTree;


