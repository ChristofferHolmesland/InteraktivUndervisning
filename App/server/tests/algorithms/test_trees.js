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

	describe('TestCompareNode',function () {
		it("Test nodes with only value",function () {
			let binaryNode1 = new BinaryTreeNode(5);
			let binaryNode2 = new BinaryTreeNode(5);
			assert(binaryNode1.compareNodes(binaryNode2));
			assert(binaryNode2.compareNodes(binaryNode1));
		});
		it("Failure test for different values", function () {
			let binaryNode1 = new BinaryTreeNode(5);
			let binaryNode2 = new BinaryTreeNode(6);
			assert(!binaryNode1.compareNodes(binaryNode2));
			assert(!binaryNode2.compareNodes(binaryNode1));
		});
		it("Test with parent nodes",function () {
			let binaryNode1 = new BinaryTreeNode(3);
			let binaryNode2 = new BinaryTreeNode(4);
			binaryNode2.addParent(binaryNode1);
			let binaryNode3 = new BinaryTreeNode(3);
			let binaryNode4 = new BinaryTreeNode(4);
			binaryNode4.addParent(binaryNode3);
			assert(binaryNode2.compareNodes(binaryNode4));
			assert(binaryNode4.compareNodes(binaryNode2));
		});
		it("Test with different parent nodes",function () {
			let binaryNode1 = new BinaryTreeNode(3);
			let binaryNode2 = new BinaryTreeNode(4);
			binaryNode2.addParent(binaryNode1);
			let binaryNode3 = new BinaryTreeNode(3);
			let binaryNode4 = new BinaryTreeNode(4);
			binaryNode3.addParent(binaryNode4);
			assert(!binaryNode2.compareNodes(binaryNode3));
			assert(!binaryNode3.compareNodes(binaryNode2));
		});
		it("Test with children nodes",function () {
			let binaryNode1 = new BinaryTreeNode(3);
			let binaryNode2 = new BinaryTreeNode(4);
			let binaryNode3 = new BinaryTreeNode(5);
			binaryNode1.addParent(binaryNode2);
			binaryNode3.addParent(binaryNode2);
			let binaryNode4 = new BinaryTreeNode(3);
			let binaryNode5 = new BinaryTreeNode(4);
			let binaryNode6 = new BinaryTreeNode(5);
			binaryNode4.addParent(binaryNode5);
			binaryNode6.addParent(binaryNode5);
			assert(binaryNode2.compareNodes(binaryNode5));
			assert(binaryNode5.compareNodes(binaryNode2));
		});
		it("Test with only 1 child",function () {
			let binaryNode2 = new BinaryTreeNode(4);
			let binaryNode3 = new BinaryTreeNode(5);
			binaryNode3.addParent(binaryNode2);
			let binaryNode5 = new BinaryTreeNode(4);
			let binaryNode6 = new BinaryTreeNode(5);
			binaryNode6.addParent(binaryNode5);
			assert(binaryNode2.compareNodes(binaryNode5));
			assert(binaryNode5.compareNodes(binaryNode2));
		});
		it("Test with different children",function () {
			let binaryNode2 = new BinaryTreeNode(4);
			let binaryNode3 = new BinaryTreeNode(3);
			binaryNode3.addParent(binaryNode2);
			let binaryNode5 = new BinaryTreeNode(4);
			let binaryNode6 = new BinaryTreeNode(5);
			binaryNode6.addParent(binaryNode5);
			assert(!binaryNode2.compareNodes(binaryNode5));
			assert(!binaryNode5.compareNodes(binaryNode2));
		});
		it("Test with undefined children",function () {
			let binaryNode2 = new BinaryTreeNode(4);
			binaryNode2.children[0] = undefined;
			let binaryNode5 = new BinaryTreeNode(4);
			let binaryNode6 = new BinaryTreeNode(5);
			binaryNode6.addParent(binaryNode5);
			assert(!binaryNode2.compareNodes(binaryNode5));
			assert(!binaryNode5.compareNodes(binaryNode2));
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
				let completelyNewTree = BinarySearchTreeFunctions.createBinarySearchTreeSolution(testArray,true)[0];
				if (testArray.length !== testtree.length) {
					testtree.pop();	//remove extra 50
					testtree[testtree.length-1].children = [];
				}
				let solutionTree = new Tree(root,testtree);
				//completelyNewTree.printTree();
				//solutionTree.printTree();
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
				let newTree = BinarySearchTreeFunctions.createBinarySearchTreeSolution(testArr2.slice(5),true,defaultTree)[0];

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
				let answerTree = BinarySearchTreeFunctions.removeNodeFromBSTTree(startNode9,startTree,startTree.nodes.indexOf(startNode9));
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

				let answerTree = BinarySearchTreeFunctions.removeNodeFromBSTTree(startNode7,startTree,startTree.findNodeInNodesUsingNode(startNode7));
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

				let answerTree = BinarySearchTreeFunctions.removeNodeFromBSTTree(rootNode,startTree,startTree.findNodeInNodesUsingNode(rootNode));
				//answerTree[0].printTree();
				//answerTree[1].printTree();
				assert.ok(answerTree.length === 2);
				assert(GeneralTreeFunctions.checkStudentAnswer(answerTree[1],solutionTree1));
				assert(GeneralTreeFunctions.checkStudentAnswer(answerTree[0],solutionTree2));
			});

			describe("Testing getBestReplacementNodes for tasks requiring only clicking on the best replacement nodes",function () {
				let rootNode = new BinaryTreeNode(23);
				let testTree = new Tree(rootNode);
				let testNode1 = new BinaryTreeNode(2);
				let testNode2 = new BinaryTreeNode(44);
				let testNode3 = new BinaryTreeNode(26);
				let testNode4 = new BinaryTreeNode(37);
				let testNode5 = new BinaryTreeNode(50);
				testNode1.addParent(rootNode);
				testNode2.addParent(rootNode);
				testNode3.addParent(testNode2);
				testNode4.addParent(testNode3);
				testNode5.addParent(testNode2);
				testTree.nodes = [rootNode,testNode1,testNode2,testNode3,testNode4,testNode5];
				it("Get replacement nodes when deleting node 44",function () {
					let nodelist = GeneralTreeFunctions.getBestReplacementNodes(testNode2);
					console.log(nodelist);
					assert.ok(nodelist[0] === testNode4 && nodelist[1] === testNode5);
				});
				it("Get replacement nodes when deleting root ",function () {
					let nodelist = GeneralTreeFunctions.getBestReplacementNodes(rootNode);
					console.log(nodelist);
					assert.ok(nodelist[0] === testNode1 && nodelist[1] === testNode3);
				})
			});

			describe("Testing create Solution by removing multiple elements and return the expected trees",function () {
				let rootNode = new BinaryTreeNode(80);
				let testNode1 = new BinaryTreeNode(48);
				let testNode2 = new BinaryTreeNode(10);
				let testNode3 = new BinaryTreeNode(87);
				testNode1.addParent(rootNode);
				testNode2.addParent(testNode1);
				testNode3.addParent(rootNode);
				let testTree = new Tree(rootNode);
				testTree.nodes = [rootNode,testNode1, testNode2,testNode3];
				it("Only remove 1 entry in the tree and return a list with only 1 tree element",function () {
					let removedEntries = [10];
					let SolutionTree = testTree.createDuplicateTree();
					let nodeIndex = SolutionTree.findNodeInNodesUsingNode(testNode2);
					SolutionTree.nodes.splice(nodeIndex,1);
					let parentNode = SolutionTree.nodes[SolutionTree.findNodeInNodesUsingNode(testNode1)];
					parentNode.children[0] = undefined;
					let treeList = BinarySearchTreeFunctions.createBinarySearchTreeSolution(removedEntries,false,testTree);

					assert.ok(treeList.length === 1);
					assert(GeneralTreeFunctions.checkStudentAnswer(treeList[0],SolutionTree));

					removedEntries.pop();
					removedEntries.push(48);
					SolutionTree = testTree.createDuplicateTree();
					let node80 = SolutionTree.getNodeWithValue(80);
					let node10 = SolutionTree.getNodeWithValue(10);
					node80.children[0] = node10;
					node10.parent = node80;
					SolutionTree.nodes.splice(SolutionTree.findNodeInNodesUsingValue(48),1);
					//SolutionTree.printTree();
					let treeList2 = BinarySearchTreeFunctions.createBinarySearchTreeSolution(removedEntries,false,testTree);

					assert.ok(treeList2.length === 1);
					//treeList2[0].printTree();
					assert(GeneralTreeFunctions.checkStudentAnswer(treeList2[0],SolutionTree));
				});
				it("Only remove 1 entry in the tree and return a list of 2 tree element. This means a node of 2 children will be deleted",function () {
					let test3Tree = testTree.createDuplicateTree();
					let addedElements = [23,52];
					let newStartTree = BinarySearchTreeFunctions.createBinarySearchTreeSolution(addedElements,true,test3Tree)[0];
					let removeElements = [48];
					let solutionRoot = new BinaryTreeNode(80);
					let node11 = new BinaryTreeNode(23);
					let node21 = new BinaryTreeNode(10);
					let node31 = new BinaryTreeNode(87);
					let node41 = new BinaryTreeNode(52);
					node11.addParent(node21);
					node41.addParent(solutionRoot);
					node21.addParent(node41);
					node31.addParent(solutionRoot);
					let solutionTree1 = new Tree(solutionRoot);
					solutionTree1.nodes = [solutionRoot,node11,node21,node31,node41];
					let solutionRoot2 = new BinaryTreeNode(80);
					let node12 = new BinaryTreeNode(23);
					let node22 = new BinaryTreeNode(10);
					let node32 = new BinaryTreeNode(87);
					let node42 = new BinaryTreeNode(52);
					node12.addParent(solutionRoot2);
					node42.addParent(node12);
					node22.addParent(node12);
					node32.addParent(solutionRoot2);
					let solutionTree2 = new Tree(solutionRoot2);
					solutionTree2.nodes = [solutionRoot2,node12,node22,node32,node42];
					let resultTreeList = BinarySearchTreeFunctions.createBinarySearchTreeSolution(removeElements,false,newStartTree);
					assert.ok(resultTreeList.length === 2);
					assert(GeneralTreeFunctions.checkStudentAnswer(resultTreeList[0],solutionTree2));
					assert(GeneralTreeFunctions.checkStudentAnswer(resultTreeList[1],solutionTree1));
				});
				describe("Test with multiple elements",function () {
					let originalTree = [52,26,12,38,40,51,93,64,90,95];
					let firstTestArray = [38,40,95,26,12];
					let secondTestArray = [52,26,64,51];
					let startTree = BinarySearchTreeFunctions.createBinarySearchTreeSolution(originalTree,true)[0];
					it("First test, only 1 2 children remove",function () {
						let solutionRoot = new BinaryTreeNode(52);
						let solutionTree = new Tree(solutionRoot);
						let solutionNode1 = new BinaryTreeNode(51);
						let solutionNode2 = new BinaryTreeNode(93);
						let solutionNode3 = new BinaryTreeNode(64);
						let solutionNode4 = new BinaryTreeNode(90);
						solutionNode1.addParent(solutionRoot);
						solutionNode2.addParent(solutionRoot);
						solutionNode3.addParent(solutionNode2);
						solutionNode4.addParent(solutionNode3);
						solutionTree.nodes = [solutionRoot,solutionNode1,solutionNode2,solutionNode3,solutionNode4];
						let treeList = BinarySearchTreeFunctions.createBinarySearchTreeSolution(firstTestArray,false,startTree);
						assert.ok(treeList.length === 2);
						//treeList[1].printTree();
						assert(GeneralTreeFunctions.checkStudentAnswer(treeList[0],solutionTree));
						assert(GeneralTreeFunctions.checkStudentAnswer(treeList[1],solutionTree));
					});
					it("Second test, multiple 2 children remove",function () {
						let solList1 = [40,12,38,93,90,95];
						let solList2 = [90,12,38,40,93,95];
						let solList3 = [40,38,12,93,90,95];
						let solList4 = [90,38,12,40,93,95];
						let solutionTree1 = BinarySearchTreeFunctions.createBinarySearchTreeSolution(solList1,true)[0];
						let solutionTree2 = BinarySearchTreeFunctions.createBinarySearchTreeSolution(solList2,true)[0];
						let solutionTree3 = BinarySearchTreeFunctions.createBinarySearchTreeSolution(solList3,true)[0];
						let solutionTree4 = BinarySearchTreeFunctions.createBinarySearchTreeSolution(solList4,true)[0];
						let resultTrees = BinarySearchTreeFunctions.createBinarySearchTreeSolution(secondTestArray,false,startTree);
						assert.ok(resultTrees.length === 10);
						for (let l=0;l<resultTrees.length;l++) {
							console.log("Tree " + l);
							//resultTrees[l].printTree();
							if(l === 0 || l === 4)	assert(GeneralTreeFunctions.checkStudentAnswer(resultTrees[l],solutionTree1));
							else if(l === 1 || l === 5 || l === 6) assert(GeneralTreeFunctions.checkStudentAnswer(resultTrees[l],solutionTree2));
							else if(l === 2 || l === 7) assert(GeneralTreeFunctions.checkStudentAnswer(resultTrees[l],solutionTree3));
							else if(l === 3 || l === 8 || l === 9) assert(GeneralTreeFunctions.checkStudentAnswer(resultTrees[l],solutionTree4));
						}
					})
				});
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
			let createdTree = AVLFunctions.createAVLTreeSolution(testarray,true)[0];
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
			//createdTree.printTree();
			//solutionTree.printTree();
			assert(GeneralTreeFunctions.checkStudentAnswer(createdTree,solutionTree));
		});
		it("Create an AVL tree using only an existing tree", function () {
			let defaultBSTTree = BinarySearchTreeFunctions.createBinarySearchTreeSolution(testarray,true)[0];
			let fullyRotatedTree = AVLFunctions.createAVLTreeSolution([],true,defaultBSTTree)[0];
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
			let createdAVLTree = AVLFunctions.createAVLTreeSolution(addedElements,true,startTree)[0];
			assert(GeneralTreeFunctions.checkStudentAnswer(createdAVLTree,solutionTree));
		});

		describe("Check Remove AVL Tree", function () {
			describe("Testing RemoveFunction",function () {
				let listEntries = [80,34,83,4,85,82,88];
				let startTree = AVLFunctions.createAVLTreeSolution(listEntries,true)[0];
				it("Remove a node with no children, the tree should be re-balanced after node deletion",function () {
					let chosenBinaryNode = startTree.getNodeWithValue(4);
					let solutionTree = BinarySearchTreeFunctions.createBinarySearchTreeSolution([83,80,34,82,85,88],true)[0];
					let resultTreeList = AVLFunctions.removeNodeFromAVLTree(chosenBinaryNode,startTree,startTree.findNodeInNodesUsingNode(chosenBinaryNode));
					assert.ok(resultTreeList.length === 1);
					//resultTreeList[0].printTree();
					assert(GeneralTreeFunctions.checkStudentAnswer(resultTreeList[0],solutionTree))
				});
				it("Remove a node with 1 child, the tree should be re-balanced after node deletion",function () {
					let chosenBinaryNode = startTree.getNodeWithValue(34);
					let solutionTree = BinarySearchTreeFunctions.createBinarySearchTreeSolution([83,80,4,82,85,88],true)[0];
					let resultTreeList = AVLFunctions.removeNodeFromAVLTree(chosenBinaryNode,startTree,startTree.findNodeInNodesUsingNode(chosenBinaryNode));
					assert.ok(resultTreeList.length === 1);
					//resultTreeList[0].printTree();
					assert(GeneralTreeFunctions.checkStudentAnswer(resultTreeList[0],solutionTree))
				});
				it("Remove a node with 2 children, the tree should be re-balanced after node deletion",function () {
					let chosenBinaryNode = startTree.getNodeWithValue(83);
					let solutionTree = BinarySearchTreeFunctions.createBinarySearchTreeSolution([80,34,4,85,82,88],true)[0];
					let resultTreeList = AVLFunctions.removeNodeFromAVLTree(chosenBinaryNode,startTree,startTree.findNodeInNodesUsingNode(chosenBinaryNode));
					assert.ok(resultTreeList.length === 2);
					//resultTreeList[0].printTree();
					assert(GeneralTreeFunctions.checkStudentAnswer(resultTreeList[0],solutionTree));
					assert(GeneralTreeFunctions.checkStudentAnswer(resultTreeList[1],solutionTree));
				});
			});

			describe("Remove a single element and re-balance the AVL tree using the createAVLTreeSolution", function () {
				let listEntries = [41,26,15,14,96,79];
				let startTree = AVLFunctions.createAVLTreeSolution(listEntries,true)[0];
				it("Deleting 1 element with no children",function () {
					let solutionTree = BinarySearchTreeFunctions.createBinarySearchTreeSolution([26,15,14,79,96],true)[0];
					let resultTreeList = AVLFunctions.createAVLTreeSolution([41],false,startTree);
					assert.ok(resultTreeList.length === 1);
					assert(GeneralTreeFunctions.checkStudentAnswer(resultTreeList[0],solutionTree))

				});
				it("Deleting 1 element with no children, re-balance tree first", function () {
					let startTree2 = BinarySearchTreeFunctions.createBinarySearchTreeSolution(listEntries,true)[0];
					let solutionTree2 = BinarySearchTreeFunctions.createBinarySearchTreeSolution([41,15,14,26,96],true)[0];
					let resultTreeList = AVLFunctions.createAVLTreeSolution([79],false,startTree2);
					assert.ok(resultTreeList.length === 1);
					assert(GeneralTreeFunctions.checkStudentAnswer(resultTreeList[0],solutionTree2));
				});
				it("Deleting 1 element with 1 child",function () {
					let listEntries2 = [26,15,14,79,41,96,100];
					let startTree3 = BinarySearchTreeFunctions.createBinarySearchTreeSolution(listEntries2,true)[0];
					//startTree3.printTree();
					let solutionTree = BinarySearchTreeFunctions.createBinarySearchTreeSolution([79,26,14,41,96,100],true)[0];
					let resultTreeList = AVLFunctions.createAVLTreeSolution([15],false,startTree3);
					//resultTreeList[0].printTree();
					assert.ok(resultTreeList.length === 1);
					assert(GeneralTreeFunctions.checkStudentAnswer(resultTreeList[0],solutionTree));
				});
				it("Deleting 1 element with 2 children",function () {
					let listElements = [15,10,17,8,12,16,18,19];
					let startTree = BinarySearchTreeFunctions.createBinarySearchTreeSolution(listElements,true)[0];
					let solutionTree = BinarySearchTreeFunctions.createBinarySearchTreeSolution([15,10,8,12,18,16,19],true)[0];
					let resultTreeList = AVLFunctions.createAVLTreeSolution([17],false,startTree);
					assert.ok(resultTreeList.length === 2);
					assert(GeneralTreeFunctions.checkStudentAnswer(resultTreeList[0],solutionTree));
					assert(GeneralTreeFunctions.checkStudentAnswer(resultTreeList[1],solutionTree));
				});
			});

			describe("testing createSolution with multipleElements",function () {
				let totalElements = [21,18,6,10,20,51,46,92,60,63,100];
				let startTree = BinarySearchTreeFunctions.createBinarySearchTreeSolution(totalElements,true)[0];
				it("Test that balanced tree works",function () {
					let fullyBalanced = AVLFunctions.createAVLTreeSolution([],true,startTree)[0];
					let solutionTree = BinarySearchTreeFunctions.createBinarySearchTreeSolution([21,18,6,20,10,60,51,46,92,63,100],true)[0];
					assert(GeneralTreeFunctions.checkStudentAnswer(fullyBalanced,solutionTree));
				});
				it("First Test",function () {
					let removedElements = [100,21,51,6,92];
					let solutionTree1 = BinarySearchTreeFunctions.createBinarySearchTreeSolution([20,18,10,60,46,63],true)[0];
					let solutionTree2 = BinarySearchTreeFunctions.createBinarySearchTreeSolution([46,18,10,20,63,60],true)[0];
					let resultTreeList = AVLFunctions.createAVLTreeSolution(removedElements,false,startTree);
					assert.ok(resultTreeList.length === 2);
					assert(GeneralTreeFunctions.checkStudentAnswer(resultTreeList[0],solutionTree1));
					assert(GeneralTreeFunctions.checkStudentAnswer(resultTreeList[1],solutionTree2));
				});
				it("Second Test",function () {
					let removedElements = [60, 63, 18, 51];
					let solutionTree = BinarySearchTreeFunctions.createBinarySearchTreeSolution([21,10,92,6,20,46,100],true)[0];
					let resultTreeList = AVLFunctions.createAVLTreeSolution(removedElements,false,startTree);
					assert.ok(resultTreeList.length === 10);
					//resultTreeList[0].printTree();
					for (let l=0;l<resultTreeList.length;l++){
						assert(GeneralTreeFunctions.checkStudentAnswer(resultTreeList[l],solutionTree));
					}
					//Removing Duplicates
					let noDuplicates = GeneralTreeFunctions.removeDuplicateTreeResult(resultTreeList);
					//resultTreeList[0].printTree();
					assert.ok(noDuplicates.length === 1);
					assert(GeneralTreeFunctions.checkStudentAnswer(resultTreeList[0],noDuplicates[0]));
				})
			});
		});
	});

	describe("Test createTreeObjectFromCanvasObject",function () {

	})
});