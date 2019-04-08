const trees = require("../algorithms/trees/Tree");
const Tree = trees.Tree;
const BinaryTreeNode = trees.BinaryTreeNode;

module.exports = function(question) {
	let array = question.objects.treeElements.split(",");
	let binaryTree = new Tree(new BinaryTreeNode(array[0]));
	binaryTree.nodes = array;
	question.solution = binaryTree;

	return question;
};