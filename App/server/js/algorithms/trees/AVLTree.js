const Tree = require("./Tree.js").Tree;
const BinaryTreeNode = require("./Tree.js").BinaryTreeNode;
const GeneralTreeFunctions = require("./GeneralTreeFunctions.js");

//creates an AVL tree based on given list of elements and existing tree object.
//Is going to be used to create an AVL tree object for the teacher's solution.
module.exports.createAVLTree = function (elements,add,existingTreeObject) {
	let tree;
	let a = 0;
	let treelist = [];
	if(add) {
		//Balance any Tree given that is not an AVL Tree
		if (existingTreeObject !== undefined) {	//if an existing tree is given
			tree = existingTreeObject.createDuplicateTree();
			while (checkBalance(tree.root) === false) {
				if (tree.root.children[0] !== undefined) {
					let getLowestLeftNode = getLowestNode(tree.root.children[0]);
					fixAVLCondition(getLowestLeftNode, tree,true);
				}
				if (tree.root.children[1] !== undefined) {
					let getLowestRightNode = getLowestNode(tree.root.children[1]);
					fixAVLCondition(getLowestRightNode, tree,true);
				}
			}
		} else { //existing tree object not given
			let rootNode = new BinaryTreeNode(elements[0]);
			tree = new Tree(rootNode);
			a++;
		}
		for (a; a < elements.length; a++) {
			let node = new BinaryTreeNode(elements[a]);
			let bestParent = GeneralTreeFunctions.findBestParent(node, tree.root);
			node.addParent(bestParent);
			tree.nodes.push(node);
			fixAVLCondition(node, tree,true);
		}
		treelist.push(tree);
	}else {
		if (existingTreeObject !== undefined) {
			tree = existingTreeObject.createDuplicateTree();
			//Balance any Tree given that is not an AVL Tree
			console.log(checkBalance(tree.root));
			while (checkBalance(tree.root) === false) {
				if (tree.root.children[0] !== undefined) {
					let getLowestLeftNode = getLowestNode(tree.root.children[0]);
					fixAVLCondition(getLowestLeftNode, tree,true);
				}
				if (tree.root.children[1] !== undefined) {
					let getLowestRightNode = getLowestNode(tree.root.children[1]);
					fixAVLCondition(getLowestRightNode, tree,true);
				}
			}
			treelist.push(tree);
			for (let b=0; b < elements.length; b++) {
				for (let t = 0; t < treelist.length; t++) {
					let currentTree = treelist[t];
					let newTreeList = [];
					let treeIndex = currentTree.findNodeInNodesUsingValue(elements[b]);
					if (treeIndex !== -1) {
						let removedNode = currentTree.nodes[treeIndex];
						newTreeList = removeNodeFromAVLTree(removedNode,currentTree,treeIndex);
					}
					if (newTreeList.length > 1) {
						treelist.splice(t,1,newTreeList[0],newTreeList[1]);
						t++;
					}
					else if (newTreeList.length === 0) {

					}
					else {
						treelist.splice(t,1,newTreeList[0]);
					}
				}
			}
			if (treelist.length > 1)	treelist = GeneralTreeFunctions.removeDuplicateTreeResult(treelist);
		}else {
			console.log("Non-existent tree cannot have removed entries.")
		}
	}
	return treelist
};

module.exports.createAVLTreeSolution = function (elements, add, existingTreeObject) {
	let tree;
	let a = 0;
	let steps = [];
	let treelist = [];
	if(add) {
		//Balance any Tree given that is not an AVL Tree
		if (existingTreeObject !== undefined) {	//if an existing tree is given
			tree = existingTreeObject.createDuplicateTree();
			let stepInitial = GeneralTreeFunctions.createStepArray("Initial","AVL",[tree]);
			steps.push(stepInitial);
			while (checkBalance(tree.root) === false) {
				if (tree.root.children[0] !== undefined) {
					let getLowestLeftNode = getLowestNode(tree.root.children[0]);
					let rotated = fixAVLCondition(getLowestLeftNode, tree,true);
					if (rotated)	steps.push("Rotated", "AVL", tree);
				}
				if (tree.root.children[1] !== undefined) {
					let getLowestRightNode = getLowestNode(tree.root.children[1]);
					let rotated = fixAVLCondition(getLowestRightNode, tree,true);
					if (rotated)	steps.push("Rotated", "AVL", tree);
				}
			}
		} else { //existing tree object not given
			let rootNode = new BinaryTreeNode(elements[0]);
			tree = new Tree(rootNode);
			let stepInitial = GeneralTreeFunctions.createStepArray("Initial","AVL",[tree]);
			steps.push(stepInitial);
			a++;
		}
		for (a; a < elements.length; a++) {
			let node = new BinaryTreeNode(elements[a]);
			let bestParent = GeneralTreeFunctions.findBestParent(node, tree.root);
			node.addParent(bestParent);
			tree.nodes.push(node);
			let step = GeneralTreeFunctions.createStepArray("Add","AVL",[tree]);
			steps.push(step);
			let rotationStep = fixAVLCondition(node, tree,true);
			if (rotationStep) {
				let step = GeneralTreeFunctions.createStepArray("Rotated","AVL",[tree]);
				steps.push(step)
			}
		}
		treelist.push(tree);
		let step = GeneralTreeFunctions.createStepArray("Done","AVL",treelist);
		steps.push(step);
	}else {
		if (existingTreeObject !== undefined) {
			tree = existingTreeObject.createDuplicateTree();
			let stepInitial = GeneralTreeFunctions.createStepArray("Initial","AVL",[tree]);
			steps.push(stepInitial);
			//Balance any Tree given that is not an AVL Tree
			console.log(checkBalance(tree.root));
			while (checkBalance(tree.root) === false) {
				if (tree.root.children[0] !== undefined) {
					let getLowestLeftNode = getLowestNode(tree.root.children[0]);
					let rotation = fixAVLCondition(getLowestLeftNode, tree,true);
					if (rotation){
						let step = GeneralTreeFunctions.createStepArray("Rotated","AVL",[tree]);
						steps.push(step);
					}
				}
				if (tree.root.children[1] !== undefined) {
					let getLowestRightNode = getLowestNode(tree.root.children[1]);
					let rotation = fixAVLCondition(getLowestRightNode, tree,true);
					if (rotation)	{
						let step = GeneralTreeFunctions.createStepArray("Rotated","AVL",[tree]);
						steps.push(step);
					}
				}
			}
			treelist.push(tree);
			for (let b=0; b < elements.length; b++) {
				let removedSteps = [];
				let rotationSteps = [];
				for (let t = 0; t < treelist.length; t++) {
					let currentTree = treelist[t];
					let newTreeList = [];
					let treeIndex = currentTree.findNodeInNodesUsingValue(elements[b]);
					if (treeIndex !== -1) {
						let removedNode = currentTree.nodes[treeIndex];
						newTreeList = removeNodeFromAVLTree(removedNode,currentTree,treeIndex,removedSteps,rotationSteps);
					}
					if (newTreeList.length > 1) {
						treelist.splice(t,1,newTreeList[0],newTreeList[1]);
						t++;
					}
					else if (newTreeList.length === 0) {

					}
					else {
						treelist.splice(t,1,newTreeList[0]);
					}
				}
				//storing
				let removedStep = GeneralTreeFunctions.createStepArray("Remove","AVL",removedSteps);
				steps.push(removedStep);
				let rotationNeeded = false;
				for (let l=0;l<removedSteps.length;l++) {
					console.log(removedSteps);
					console.log(rotationSteps);
					if (!GeneralTreeFunctions.checkStudentAnswer(removedSteps[l],rotationSteps[l])) {
						rotationNeeded = true;
						break;
					}
				}
				if(rotationNeeded){
					let rotationStep = GeneralTreeFunctions.createStepArray("Rotated","AVL",rotationSteps);
					steps.push(rotationStep);
				}
			}
			if (treelist.length > 1)	treelist = GeneralTreeFunctions.removeDuplicateTreeResult(treelist);
		}else {
			console.log("Non-existent tree cannot have removed entries.")
		}
		let step = GeneralTreeFunctions.createStepArray("Done","AVL",treelist);
		steps.push(step);
	}
	return steps
};
//checks whether or not the tree is AVL balanced. It depends on the node given.
// If root is given the entire tree will be checked.
//Can be used to check whether or not a tree is a valid AVL by the root of the tree as inparameter.
function checkBalance(node) {
	let balanced = true;
	let leftHeight = 0;
	let rightHeight = 0;
	if (node.children[0] !== undefined) {
		leftHeight = GeneralTreeFunctions.getHeight(node.children[0]);
		balanced = checkBalance(node.children[0]);
	}
	if (!balanced) return balanced;
	if (node.children[1] !== undefined) {
		rightHeight = GeneralTreeFunctions.getHeight(node.children[1]);
		balanced = checkBalance(node.children[1]);
	}
	if (!balanced) return balanced;
	if (balanced) {
		if (Math.abs(leftHeight - rightHeight) > 1) {
			balanced = false;
			return balanced
		}
	}
	return balanced
}

//function that obtains the closest leafNode to the given node
function getLowestNode(node) {
	let currentNode;
	if (node === undefined) {
		currentNode = this.root;
	}else {
		currentNode = node;
	}
	while (currentNode.children[0] !== undefined || currentNode.children[1] !== undefined) {
		let leftHeight = 0;
		let rightHeight = 0;
		if (currentNode.children[0] !== undefined) {
			leftHeight = GeneralTreeFunctions.getHeight(currentNode.children[0])
		}
		if (currentNode.children[1] !== undefined) {
			rightHeight = GeneralTreeFunctions.getHeight(currentNode.children[1])
		}
		if (leftHeight > rightHeight) {
			currentNode = currentNode.children[0]
		}
		else if (rightHeight > leftHeight) {
			currentNode = currentNode.children[1]
		}
		else {
			//not sure what to do here
			currentNode = currentNode.children[0]
		}
	}
	return currentNode
}

//gets the node that is breaking the AVL condition
function getResponsibleNode(node) {
	let chosenNode = node;
	while (Math.abs(GeneralTreeFunctions.getHeight(chosenNode.children[0]) - GeneralTreeFunctions.getHeight(chosenNode.children[1])) <= 1) {
		if (chosenNode.parent === undefined) {
			break;
		}
		chosenNode = chosenNode.parent;
	}
	return chosenNode
}

//checks the height of the given node
function getNodeHeight(node) {
	let leftHeight = 0;
	let rightHeight = 0;
	if (node.children[0] !== undefined) {
		leftHeight = GeneralTreeFunctions.getHeight(node.children[0]);
	}
	if (node.children[1] !== undefined) {
		rightHeight = GeneralTreeFunctions.getHeight(node.children[1]);
	}
	return leftHeight-rightHeight	//the high will determine what kind of rotation needed for the AVL tree.
}

//rotates the tree towards the right, used when there are to many children on the left side of the subtree
function rotationLeft(node,tree) {
	let leftChild = node.children[0];
	let parent = node.parent;
	if (parent !== undefined) {
		if (parent.children[0] === node) {
			parent.children[0] = leftChild;
		}else {
			parent.children[1] = leftChild;
		}
	}else {
		tree.changeRoot(leftChild);
		if (leftChild.children[1] !== undefined) {
			leftChild.children[1].parent = node;
		}
	}
	if(leftChild.children[1] !== undefined) {
		leftChild.children[1].parent = node;
	}
	let subNode = leftChild.children[1];
	leftChild.children[1] = node;
	node.children[0] = subNode;
	node.parent = leftChild;
	leftChild.parent = parent;
}

//rotates the tree towards the left, used when there are to many children on the right side of the subtree
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
		tree.changeRoot(rightChild);
		if (rightChild.children[0] !== undefined) {
			rightChild.children[0].parent = node;
		}
	}
	if(rightChild.children[0] !== undefined) {
		rightChild.children[0].parent = node;
	}
	let subNode = rightChild.children[0];
	rightChild.children[0] = node;
	node.children[1] = subNode;
	node.parent = rightChild;
	rightChild.parent = parent;
}

//finds the node that breaks the AVL condition and ,if necessary, rotates the tree to fix the AVL condition
//Rotation prioritises are different between when adding a new node to the tree or when deleting an existing node in the tree
function fixAVLCondition(node,tree,add) {
	let respNode = getResponsibleNode(node);
	//let step;
	let rotation = false;
	if (add) {
		if (getNodeHeight(respNode) < -1) {
			if (node.value > respNode.children[1].value) {
				//right rotation
				console.log("Right");
				rotationRight(respNode, tree);
				rotation = true
				//step = GeneralTreeFunctions.createStepArray("Right","AVL",[tree])
			} else if (node.value < respNode.children[1].value) {
				//dobbel left rotation
				console.log("Dobbel left");
				rotationLeft(respNode.children[1], tree);
				rotationRight(respNode, tree);
				rotation = true
				//step = GeneralTreeFunctions.createStepArray("DobbelLeft","AVL",[tree])
			} else {
				console.log("How could this happen!");
			}

		} else if (getNodeHeight(respNode) > 1) {
			//left rotation
			if (node.value < respNode.children[0].value) {
				console.log("Left");
				rotationLeft(respNode, tree);
				rotation = true
				//step = GeneralTreeFunctions.createStepArray("Left","AVL",[tree])
			} else if (node.value > respNode.children[0].value) {
				//dobbel right rotation
				console.log("Dobbel right");
				rotationRight(respNode.children[0], tree);
				rotationLeft(respNode, tree);
				rotation = true
				//step = GeneralTreeFunctions.createStepArray("DobbelRight","AVL",[tree])
			} else {
				console.log("How could this happen!");
			}
		} else {
			console.log("No Rotation needed");
		}
	}else {
		let respBalance = getNodeHeight(respNode);
		let rootLeftBalance = 0;
		let rootRightBalance = 0;
		if (respNode.children[0] !== undefined) rootLeftBalance = getNodeHeight(respNode.children[0]);
		if (respNode.children[1] !== undefined) rootRightBalance = getNodeHeight(respNode.children[1]);
		if(respBalance < -1){
			if (rootRightBalance <= 0){
				console.log("Right");
				rotationRight(respNode, tree);
				rotation = true
				//step = GeneralTreeFunctions.createStepArray("Right","AVL",[tree])
			}else if(rootRightBalance > 0) {
				console.log("dobbel left");
				rotationLeft(respNode.children[1], tree);
				rotationRight(respNode, tree);
				rotation = true
				//step = GeneralTreeFunctions.createStepArray("DobbelLeft","AVL",[tree])
			}else {
				console.log("How could this happen!");
			}
		}else if(respBalance > 1){
			if (rootLeftBalance >= 0) {
				console.log("Left");
				rotationLeft(respNode, tree);
				rotation = true
				//step = GeneralTreeFunctions.createStepArray("Left","AVL",[tree])
			}else if (rootLeftBalance < 0) {
				console.log("dobbel right");
				rotationRight(respNode.children[0], tree);
				rotationLeft(respNode, tree);
				rotation = true
				//step = GeneralTreeFunctions.createStepArray("DobbelRight","AVL",[tree])
			}else {
				console.log("How could this happen!");
			}
		}else {
			console.log("No Rotation needed");
		}
	}
	return rotation
}
//Removes an existing node from the AVL tree
// it will call the fixAVLCondition function at the end in order to check tree balance, and re-balance the tree if necessary
function removeNodeFromAVLTree(node,tree,index,removeSteps,rotationSteps) {
	let newTreeList = [];
	let saveRecords = true;
	if (removeSteps === undefined || rotationSteps === undefined) saveRecords = false;
	/*console.log(node);
	console.log(tree);
	console.log(index);*/
	if (node !== undefined && tree !== undefined && index !== -1) {
		let newTree = tree.createDuplicateTree();
		//newTree.printTree();
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
			if (saveRecords) removeSteps.push(newTree.createDuplicateTree());
			fixAVLCondition(parent,newTree,false);
			if (saveRecords) rotationSteps.push(newTree.createDuplicateTree());
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
				if(saveRecords) removeSteps.push(newSubTree.createDuplicateTree());
				fixAVLCondition(tempNode,newSubTree,false);
				if(saveRecords) rotationSteps.push(newSubTree.createDuplicateTree());
				newTreeList.push(newSubTree);
			}
		} else {	//no children
			console.log("No children");
			//if (parent.children[0] === newNode) parent.children[0] = undefined;
			if (parent.children[0] === newNode) parent.children[0] = undefined;
			else parent.children[1] = undefined;
			newTree.nodes.splice(index, 1);
			if(saveRecords) removeSteps.push(newTree.createDuplicateTree());
			fixAVLCondition(parent,newTree,false);
			if(saveRecords) rotationSteps.push(newTree.createDuplicateTree());
			newTreeList.push(newTree);
		}
	}
	return newTreeList
}
module.exports.removeNodeFromAVLTree = removeNodeFromAVLTree;