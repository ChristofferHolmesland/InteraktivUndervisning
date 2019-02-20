const assert = require("assert");
const Tree = require("../../js/algorithms/trees/Tree").Tree;
const BinaryTreeNode = require("../../js/algorithms/trees/Tree.js").BinaryTreeNode;
const BinaryTreeFunctions = require("../../js/algorithms/trees/BinaryTree.js");
const BinarySearchTreeFunctions = require("../../js/algorithms/trees/BinarySearchTree.js");
const GeneralTreeFunctions = require("../../js/algorithms/trees/GeneralTreeFunctions.js");

describe('TestBinaryTrees', function () {
	//Creating 2 Tree Objects
	let testArray = [28,17,6,3,13,25,18,31,33,49];
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
	let testTree1 = new Tree(root,testtree);

	let testtree2 = [];
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
	let testTree2 = new Tree(root2,testtree2);

	describe('TestBinaryTreeConditions', function () {
		it("checkBinaryTreeTrueConditions", function () {
			assert(BinaryTreeFunctions.checkTreeCriteria(testTree1));
			assert(BinaryTreeFunctions.checkTreeCriteria(testTree2));
		});

		it("checkBinaryTreeFalseConditions", function () {
			let nodeex = new BinaryTreeNode(100);
			node2.children.push(nodeex);
			node72.children.push(nodeex);
			assert(!BinaryTreeFunctions.checkTreeCriteria(testTree1));
			assert(!BinaryTreeFunctions.checkTreeCriteria(testTree1));
			node2.children.pop();
			node72.children.pop();
		})
	});

	describe('TestBinarySearchConditions', function () {
		it("checkBinarySearchTreeTrueConditions", function () {
			assert(BinarySearchTreeFunctions.checkBinarySearchTreeCriteria(testTree1));
			assert(BinarySearchTreeFunctions.checkBinarySearchTreeCriteria(testTree2));
		});

		it("checkBinarySearchTreeFalseConditions", function () {
			let wrongNode = new BinaryTreeNode(50);
			node32.children[0] = wrongNode;
			node9.children[0] = wrongNode;
			assert(!BinarySearchTreeFunctions.checkBinarySearchTreeCriteria(testTree1));
			assert(!BinarySearchTreeFunctions.checkBinarySearchTreeCriteria(testTree2));
			node9.children.pop();
			node32.children.pop();
		})
	});

	describe('TestBinarySearchTreeComparisons', function () {
		it("Compare the Tree Objects", function () {
			assert(GeneralTreeFunctions.checkStudentAnswer(testTree1,testTree2))
		});

		it("testAddParent", function () {
			let node10 = new BinaryTreeNode(50);
			node10.addParent(node9);
			assert(Object.is(node10.parent,node9));
			assert(Object.is(node9.children[1],node10));
			testtree.push(node10)
		});

		it("Check failure condition", function () {
			if (testTree1.nodes.length === testTree2.nodes.length) {
				let node10 = new BinaryTreeNode(50);
				node10.addParent(node9);
				testtree.push(node10);
			}
			assert(!GeneralTreeFunctions.checkStudentAnswer(testTree1,testTree2));
			let node102 = new BinaryTreeNode(51);
			node102.addParent(node32);
			assert(!GeneralTreeFunctions.checkStudentAnswer(testTree1,testTree2));
		})
	});

	describe("TestCreateBinarySearchSolution", function () {
		it("Check with no existing tree", function () {
			let completelyNewTree = BinarySearchTreeFunctions.createBinarySearchTreeSolution(testArray);
			if (testArray.length !== testtree.length) {
				testtree.pop();	//remove extra 50
			}

			let solutionTree = new Tree(root,testtree);
			assert(GeneralTreeFunctions.checkStudentAnswer(completelyNewTree,solutionTree));
			//assert(Object.is(completelyNewTree,solutionTree)); //didn't work, not sure if this means the objects does not have the same value.
		});

		it("Check with existing tree", function () {
			let testArr2 = [66,8,88,92,4,57,68,26,74,9];
			let root = new BinaryTreeNode(66);
			let defNode1 = new BinaryTreeNode(8);
			let defNode2 = new BinaryTreeNode(88);
			let defNode3 = new BinaryTreeNode(92);
			let defNode4 = new BinaryTreeNode(4);
			defNode1.addParent(root);
			defNode2.addParent(root);
			defNode3.addParent(defNode2);
			defNode4.addParent(defNode1);
			let defaultTree = new Tree(root);
			defaultTree.nodes = [root,defNode1,defNode2,defNode3,defNode4];
			let newTree = BinarySearchTreeFunctions.createBinarySearchTreeSolution(testArr2.slice(5),defaultTree);

			let rootSol = new BinaryTreeNode(66);
			let defNode1Sol = new BinaryTreeNode(8);
			let defNode2Sol = new BinaryTreeNode(88);
			let defNode3Sol = new BinaryTreeNode(92);
			let defNode4Sol = new BinaryTreeNode(4);
			let defNode5Sol = new BinaryTreeNode(57);
			let defNode6Sol = new BinaryTreeNode(68);
			let defNode7Sol = new BinaryTreeNode(26);
			let defNode8Sol = new BinaryTreeNode(74);
			let defNode9Sol = new BinaryTreeNode(9);
			defNode1Sol.addParent(rootSol);
			defNode2Sol.addParent(rootSol);
			defNode3Sol.addParent(defNode2Sol);
			defNode4Sol.addParent(defNode1Sol);
			defNode5Sol.addParent(defNode1Sol);
			defNode6Sol.addParent(defNode2Sol);
			defNode7Sol.addParent(defNode5Sol);
			defNode8Sol.addParent(defNode6Sol);
			defNode9Sol.addParent(defNode7Sol);
			let solutionTree = new Tree(rootSol);
			solutionTree.nodes = [rootSol,defNode1Sol,defNode2Sol,defNode3Sol,defNode4Sol,defNode5Sol,defNode6Sol,defNode7Sol,defNode8Sol,defNode9Sol];
			assert(GeneralTreeFunctions.checkStudentAnswer(newTree,solutionTree))
		})
	});
});
