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
						newTreeList = GeneralTreeFunctions.removeNodeFromTree(removedNode,currentTree,treeIndex);
						if (newTreeList[1] !== undefined) newTreeList[1].printTree();
						if (newTreeList.length > 1) {
							treelist.splice(t,1,newTreeList[0],newTreeList[1]);
							t++;
							//console.log(treelist);
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


