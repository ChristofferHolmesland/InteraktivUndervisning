const assert = require("assert");

const BinaryTreeNode = require("../../js/algorithms/trees/BinaryTreeNode.js").BinaryTreeNode;
const BinaryTreeFunctions = require("../../js/algorithms/trees/BinaryTree.js");
const BinarySearchTreeFunctions = require("../../js/algorithms/trees/BinarySearchTree.js");

describe('TestBinaryTrees', function () {
	//Creating 2 Tree Objects
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

	describe('TestBinaryTreeConditions', function () {
		it("checkBinaryTreeTrueConditions", function () {
			assert(BinaryTreeFunctions.checkTreeCriteria(testtree));
			assert(BinaryTreeFunctions.checkTreeCriteria(testtree2));
		});

		it("checkBinaryTreeFalseConditions", function () {
			let nodeex = new BinaryTreeNode(100);
			node2.children.push(nodeex);
			node72.children.push(nodeex);
			assert(!BinaryTreeFunctions.checkTreeCriteria(testtree));
			assert(!BinaryTreeFunctions.checkTreeCriteria(testtree));
			node2.children.pop();
			node72.children.pop();
		})
	});

	describe('TestBinarySearchConditions', function () {
		it("checkBinarySearchTreeTrueConditions", function () {
			assert(BinarySearchTreeFunctions.checkBinarySearchTreeCriteria(testtree));
			assert(BinarySearchTreeFunctions.checkBinarySearchTreeCriteria(testtree2));
		});

		it("checkBinarySearchTreeFalseConditions", function () {
			let wrongNode = new BinaryTreeNode(50);
			node32.children[0] = wrongNode;
			node9.children[0] = wrongNode;
			assert(!BinarySearchTreeFunctions.checkBinarySearchTreeCriteria(testtree));
			assert(!BinarySearchTreeFunctions.checkBinarySearchTreeCriteria(testtree2));
			node9.children.pop();
			node32.children.pop();
		})
	});

	describe('TestBinarySearchTreeComparisons', function () {
		it("Compare the Tree Objects", function () {
			assert(BinarySearchTreeFunctions.checkStudentAnswer(testtree,testtree2))
		});

		it("testAddParent", function () {
			let node10 = new BinaryTreeNode(50);
			node10.addParent(node9);
			assert(Object.is(node10.parent,node9));
			assert(Object.is(node9.children[1],node10));
			testtree.push(node10)
		});

		it("Check failure condition", function () {
			if (testtree.length === testtree2.length) {
				let node10 = new BinaryTreeNode(50);
				node10.addParent(node9);
				testtree.push(node10);
			}
			assert(!BinarySearchTreeFunctions.checkStudentAnswer(testtree,testtree2));
			let node102 = new BinaryTreeNode(51);
			node102.addParent(node32);
			assert(!BinarySearchTreeFunctions.checkStudentAnswer(testtree,testtree2));
		})
	});
});