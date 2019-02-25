const assert = require("assert");
const Tree = require("../../js/algorithms/trees/Tree").Tree;
const BinaryTreeNode = require("../../js/algorithms/trees/Tree.js").BinaryTreeNode;
const BinaryTreeFunctions = require("../../js/algorithms/trees/BinaryTree.js");
const BinarySearchTreeFunctions = require("../../js/algorithms/trees/BinarySearchTree.js");
const AVLFunctions = require("../../js/algorithms/trees/AVLTree.js");
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
		describe("Check create solution by adding elements",function () {
			it("Check with no existing tree", function () {
				let completelyNewTree = BinarySearchTreeFunctions.createBinarySearchTreeSolution(testArray,true);
				if (testArray.length !== testtree.length) {
					testtree.pop();	//remove extra 50
					testtree[testtree.length-1].children = [];
				}
				let solutionTree = new Tree(root,testtree);
				completelyNewTree.printTree();
				solutionTree.printTree();
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
				let newTree = BinarySearchTreeFunctions.createBinarySearchTreeSolution(testArr2.slice(5),true,defaultTree);

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

		describe("Check create solution by removing elements", function () {
			let startTree = new Tree();
			let rootNode = new BinaryTreeNode(50);
			let startNode1 = new BinaryTreeNode(16);
			let startNode2 = new BinaryTreeNode(11);
			let startNode3 = new BinaryTreeNode(31);
			let startNode4 = new BinaryTreeNode(32);
			let startNode5 = new BinaryTreeNode(63);
			let startNode6 = new BinaryTreeNode(52);
			let startNode7 = new BinaryTreeNode(92);
			let startNode8 = new BinaryTreeNode(64);
			let startNode9 = new BinaryTreeNode(5);
			startNode1.addParent(rootNode);
			startNode2.addParent(startNode1);
			startNode3.addParent(startNode1);
			startNode4.addParent(startNode3);
			startNode5.addParent(rootNode);
			startNode6.addParent(startNode5);
			startNode7.addParent(startNode5);
			startNode8.addParent(startNode7);
			startNode9.addParent(startNode2);
			startTree.nodes = [rootNode,startNode1,startNode2,startNode3,startNode4,startNode5,startNode6,startNode7,startNode8,startNode9];
			startTree.root = rootNode;
			it("Delete node 5 in order to test deleting node with 0 children",function () {
				let solutionTree = new Tree();
				let solutionRootNode = new BinaryTreeNode(50);
				let solutionNode1 = new BinaryTreeNode(16);
				let solutionNode2 = new BinaryTreeNode(11);
				let solutionNode3 = new BinaryTreeNode(31);
				let solutionNode4 = new BinaryTreeNode(32);
				let solutionNode5 = new BinaryTreeNode(63);
				let solutionNode6 = new BinaryTreeNode(52);
				let solutionNode7 = new BinaryTreeNode(92);
				let solutionNode8 = new BinaryTreeNode(64);
				solutionNode1.addParent(solutionRootNode);
				solutionNode2.addParent(solutionNode1);
				solutionNode3.addParent(solutionNode1);
				solutionNode4.addParent(solutionNode3);
				solutionNode5.addParent(solutionRootNode);
				solutionNode6.addParent(solutionNode5);
				solutionNode7.addParent(solutionNode5);
				solutionNode8.addParent(solutionNode7);
				solutionTree.nodes = [solutionRootNode,solutionNode1,solutionNode2,solutionNode3,solutionNode4,solutionNode5,solutionNode6,solutionNode7,solutionNode8];
				solutionTree.root = solutionRootNode;
				//solutionTree.printTree();
				let answerTree = GeneralTreeFunctions.removeNodeFromTree(startNode9,startTree,startTree.nodes.indexOf(startNode9));
				//answerTree[0].printTree();
				assert(GeneralTreeFunctions.checkStudentAnswer(answerTree[0],solutionTree));
				startTree = answerTree[0];
				//startTree.printTree();
			});
			it("Delete node 92 in order to test deleting node with 1 children",function () {
				let solutionTree = new Tree();
				let solutionRootNode = new BinaryTreeNode(50);
				let solutionNode1 = new BinaryTreeNode(16);
				let solutionNode2 = new BinaryTreeNode(11);
				let solutionNode3 = new BinaryTreeNode(31);
				let solutionNode4 = new BinaryTreeNode(32);
				let solutionNode5 = new BinaryTreeNode(63);
				let solutionNode6 = new BinaryTreeNode(52);
				let solutionNode8 = new BinaryTreeNode(64);
				solutionNode1.addParent(solutionRootNode);
				solutionNode2.addParent(solutionNode1);
				solutionNode3.addParent(solutionNode1);
				solutionNode4.addParent(solutionNode3);
				solutionNode5.addParent(solutionRootNode);
				solutionNode6.addParent(solutionNode5);
				solutionNode8.addParent(solutionNode5);
				solutionTree.nodes = [solutionRootNode,solutionNode1,solutionNode2,solutionNode3,solutionNode4,solutionNode5,solutionNode6,solutionNode8];
				solutionTree.root = solutionRootNode;
				//solutionTree.printTree();

				let answerTree = GeneralTreeFunctions.removeNodeFromTree(startNode7,startTree,startTree.findNodeInNodes(startNode7));
				//answerTree[0].printTree();
				//solutionTree.printTree();
				assert(GeneralTreeFunctions.checkStudentAnswer(answerTree[0],solutionTree));
				startTree = answerTree[0];
			});
			it("Delete node 50 aka root in order to test deleting node with 2 children",function () {
				let solutionTree1 = new Tree();
				let solutionRootNode1 = new BinaryTreeNode(52);
				let solutionNode11 = new BinaryTreeNode(16);
				let solutionNode12 = new BinaryTreeNode(11);
				let solutionNode13 = new BinaryTreeNode(31);
				let solutionNode14 = new BinaryTreeNode(32);
				let solutionNode15 = new BinaryTreeNode(63);
				let solutionNode18 = new BinaryTreeNode(64);
				solutionNode11.addParent(solutionRootNode1);
				solutionNode12.addParent(solutionNode11);
				solutionNode13.addParent(solutionNode11);
				solutionNode14.addParent(solutionNode13);
				solutionNode15.addParent(solutionRootNode1);
				solutionNode18.addParent(solutionNode15);
				solutionTree1.nodes = [solutionRootNode1,solutionNode11,solutionNode12,solutionNode13,solutionNode14,solutionNode15,solutionNode18];
				solutionTree1.root = solutionRootNode1;

				let solutionTree2 = new Tree();
				let solutionRootNode2 = new BinaryTreeNode(32);
				let solutionNode21 = new BinaryTreeNode(16);
				let solutionNode22 = new BinaryTreeNode(11);
				let solutionNode23 = new BinaryTreeNode(52);
				let solutionNode24 = new BinaryTreeNode(31);
				let solutionNode25 = new BinaryTreeNode(63);
				let solutionNode28 = new BinaryTreeNode(64);
				solutionNode21.addParent(solutionRootNode2);
				solutionNode22.addParent(solutionNode21);
				solutionNode23.addParent(solutionNode25);
				solutionNode24.addParent(solutionNode21);
				solutionNode25.addParent(solutionRootNode2);
				solutionNode28.addParent(solutionNode25);
				solutionTree2.nodes = [solutionRootNode2,solutionNode21,solutionNode22,solutionNode23,solutionNode24,solutionNode25,solutionNode28];
				solutionTree2.root = solutionRootNode2;

				let answerTree = GeneralTreeFunctions.removeNodeFromTree(rootNode,startTree,startTree.findNodeInNodes(rootNode));
				answerTree[0].printTree();
				answerTree[1].printTree();
				assert(answerTree.length === 2);
				assert(GeneralTreeFunctions.checkStudentAnswer(answerTree[1],solutionTree1));
				assert(GeneralTreeFunctions.checkStudentAnswer(answerTree[0],solutionTree2));
			})
		});
	});

	describe("TestCreateAVLTree",function () {
		let testarray = [20,5,6,9,4,3,2,30,31];
		let solutionAVLTree = new Tree();
		let solutionRootNode = new BinaryTreeNode(20);
		solutionAVLTree.root = solutionRootNode;
		let solutionNode1 = new BinaryTreeNode(5);
		let solutionNode2 = new BinaryTreeNode(3);
		let solutionNode3 = new BinaryTreeNode(2);
		let solutionNode4 = new BinaryTreeNode(4);
		let solutionNode5 = new BinaryTreeNode(6);
		let solutionNode6 = new BinaryTreeNode(9);
		let solutionNode7 = new BinaryTreeNode(30);
		let solutionNode8 = new BinaryTreeNode(31);
		solutionNode1.addParent(solutionRootNode);
		solutionNode2.addParent(solutionNode1);
		solutionNode3.addParent(solutionNode2);
		solutionNode4.addParent(solutionNode2);
		solutionNode5.addParent(solutionNode1);
		solutionNode6.addParent(solutionNode5);
		solutionNode7.addParent(solutionRootNode);
		solutionNode8.addParent(solutionNode7);
		solutionAVLTree.nodes = [solutionRootNode,solutionNode1,solutionNode2,solutionNode3,solutionNode4,solutionNode5,solutionNode6,solutionNode7,solutionNode8];

		it("Create an AVL tree using only an array of elements", function () {
			let createdTree = AVLFunctions.createAVLTreeSolution(testarray);
			//createdTree.printTree();
			let solutionRootNode = new BinaryTreeNode(testarray[2]);
			let solutionTree = new Tree(solutionRootNode);
			let solutionNode4 = new BinaryTreeNode(4);
			let solutionNode3 = new BinaryTreeNode(3);
			let solutionNode2 = new BinaryTreeNode(2);
			let solutionNode5 = new BinaryTreeNode(5);
			let solutionNode20 = new BinaryTreeNode(20);
			let solutionNode9 = new BinaryTreeNode(9);
			let solutionNode30 = new BinaryTreeNode(30);
			let solutionNode31 = new BinaryTreeNode(31);
			solutionNode4.addParent(solutionRootNode);
			solutionNode3.addParent(solutionNode4);
			solutionNode2.addParent(solutionNode3);
			solutionNode5.addParent(solutionNode4);
			solutionNode20.addParent(solutionRootNode);
			solutionNode30.addParent(solutionNode20);
			solutionNode31.addParent(solutionNode30);
			solutionNode9.addParent(solutionNode20);
			solutionTree.nodes = [solutionRootNode,solutionNode4,solutionNode3,solutionNode2,solutionNode5,solutionNode20,solutionNode9,solutionNode30,solutionNode31];
			assert(GeneralTreeFunctions.checkStudentAnswer(createdTree,solutionTree));
		});
		it("Create an AVL tree using only an existing tree", function () {
			let defaultBSTTree = BinarySearchTreeFunctions.createBinarySearchTreeSolution(testarray,true);
			let fullyRotatedTree = AVLFunctions.createAVLTreeSolution([],defaultBSTTree);
			assert(GeneralTreeFunctions.checkStudentAnswer(fullyRotatedTree,solutionAVLTree));
		});

		it("Create an AVL tree using both an existing tree and and an array of elements",function () {
			let addedElements = [92,60,58,8,55];
			let startTree = solutionAVLTree;
			let solutionTree = new Tree();
			let rootNode = new BinaryTreeNode(20);
			let solutionNode1 = new BinaryTreeNode(5);
			let solutionNode2 = new BinaryTreeNode(3);
			let solutionNode3 = new BinaryTreeNode(2);
			let solutionNode4 = new BinaryTreeNode(4);
			let solutionNode5 = new BinaryTreeNode(6);
			let solutionNode6 = new BinaryTreeNode(8);
			let solutionNode7 = new BinaryTreeNode(9);
			let solutionNode8 = new BinaryTreeNode(30);
			let solutionNode9 = new BinaryTreeNode(31);
			let solutionNode10 = new BinaryTreeNode(60);
			let solutionNode11 = new BinaryTreeNode(58);
			let solutionNode12 = new BinaryTreeNode(55);
			let solutionNode13 = new BinaryTreeNode(92);
			solutionNode1.addParent(rootNode);
			solutionNode11.addParent(rootNode);
			solutionNode2.addParent(solutionNode1);
			solutionNode6.addParent(solutionNode1);
			solutionNode3.addParent(solutionNode2);
			solutionNode4.addParent(solutionNode2);
			solutionNode5.addParent(solutionNode6);
			solutionNode7.addParent(solutionNode6);
			solutionNode8.addParent(solutionNode9);
			solutionNode12.addParent(solutionNode9);
			solutionNode9.addParent(solutionNode11);
			solutionNode10.addParent(solutionNode11);
			solutionNode13.addParent(solutionNode10);
			solutionTree.root = rootNode;
			solutionTree.nodes = [rootNode,solutionNode1,solutionNode2,solutionNode3,solutionNode4,solutionNode5,solutionNode6,solutionNode7,solutionNode8,solutionNode9,solutionNode10,solutionNode11,solutionNode12,solutionNode13];
			let createdAVLTree = AVLFunctions.createAVLTreeSolution(addedElements,startTree);
			assert(GeneralTreeFunctions.checkStudentAnswer(createdAVLTree,solutionTree));
		});
	});
});
