const trees = require("../algorithms/trees/Tree");
const Tree = trees.Tree;
const BinaryTreeNode = trees.BinaryTreeNode;

module.exports = function(question) {
    let binaryTree = new Tree(new BinaryTreeNode(question.objects.treeElements[0]));
    binaryTree.nodes = question.objects.treeElements;
    question.solution = binaryTree;
    
    return question;
};