let noAction = (q) => { return q };
let sorting = require("./sorting");
let binaryTree = require("./binaryTree");
let BSTAVLTree = require("./BSTAVLTree");
let dijkstra = require("./dijkstra");
let python = require("./python");

/*
    Links solution generator functions to the solution type id.
*/
let solutionGenerators = {
    1: noAction,
    2: noAction,
    3: sorting,
    4: sorting,
    5: sorting,
    6: binaryTree,
    7: BSTAVLTree,
    8: BSTAVLTree,
    9: dijkstra,
    10: python
};

module.exports = function (question) {
    return solutionGenerators[question.solutionType](question);
};