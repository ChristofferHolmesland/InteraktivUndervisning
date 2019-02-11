const BinaryTreeNode = require("./BinaryTreeNode.js").BinaryTreeNode;

function checkBinarySearchTree(tree) {
	//Should check that there are no duplicate values in the list!
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
}

function checkStudentAnswer(studentTree,solutionTree) {
	let checkresult = true;
	if (studentTree.length === solutionTree.length) {
		checkresult = checkNode(studentTree[0],solutionTree[0],checkresult);
	}else {
		checkresult = false;
	}
	//should probably be done in recursive function

	return checkresult
}

function checkNode(studentNode,solutionNode,checkresult) {
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

let testtree = [];
let root = new BinaryTreeNode(28);
let node1 = new BinaryTreeNode(17);
let node2 = new BinaryTreeNode(6);
let node3 = new BinaryTreeNode(3);
let node4 = new BinaryTreeNode(13);
let node5 = new BinaryTreeNode(25);
let node6 = new BinaryTreeNode(18);
let node7 = new BinaryTreeNode(31);
let node8 = new BinaryTreeNode(33);
let node9 = new BinaryTreeNode(49);
let node10 = new BinaryTreeNode(50);
node1.addParent(root);
node2.addParent(node1);
node3.addParent(node2);
node4.addParent(node2);
node5.addParent(node1);
node6.addParent(node5);
node7.addParent(root);
node8.addParent(node7);
node9.addParent(node8);
testtree.push(root);
testtree.push(node1);
testtree.push(node2);
testtree.push(node3);
testtree.push(node4);
testtree.push(node5);
testtree.push(node6);
testtree.push(node7);
testtree.push(node8);
testtree.push(node9);
//console.log(testtree);
//console.log(checkBinarySearchTree(testtree));

let root2 = new BinaryTreeNode(28);
let node12 = new BinaryTreeNode(31);
let node22 = new BinaryTreeNode(33);
let node32 = new BinaryTreeNode(49);
let node42 = new BinaryTreeNode(17);
let node52 = new BinaryTreeNode(25);
let node62 = new BinaryTreeNode(18);
let node72 = new BinaryTreeNode(6);
let node82 = new BinaryTreeNode(13);
let node92 = new BinaryTreeNode(3);
//let node102 = new BinarySearchTreeNode(50);

let testtree2 = [];
node12.addParent(root2);
node22.addParent(node12);
node32.addParent(node22);
node42.addParent(root2);
node52.addParent(node42);
node62.addParent(node52);
node72.addParent(node42);
node82.addParent(node72);
node92.addParent(node72);
testtree2.push(root2);
testtree2.push(node12);
testtree2.push(node22);
testtree2.push(node32);
testtree2.push(node42);
testtree2.push(node52);
testtree2.push(node62);
testtree2.push(node72);
testtree2.push(node82);
testtree2.push(node92);
//testtree2.push(node10);
//console.log(testtree2);
console.log(checkStudentAnswer(testtree,testtree2));






