let checkers = {
    1: require("./text.js"),
    2: require("./multipleChoice.js"),
    3: require("./shellsort.js"),
    4: require("./mergesort.js"),
    5: require("./quicksort.js"),
    6: require("./solutionCheckerBinaryTree.js"),
    7: require("./solutionCheckerBinaryTree.js"),
    8: require("./solutionCheckerBinaryTree.js"),
    9: require("./text.js"), // Not implemented yet
    10: require("./djikstra.js"),
    11: require("./text.js"), // Not implemented yet
    12:require("./text.js"), // Not implemented yet
    13: require("./python.js")
};

const solutionChecker = {
    checkAnswer: function(answer, solution, type) {
        if (checkers[type] !== undefined) {
            return checkers[type].check(answer, solution);
        }
        else return false;
    }
};

module.exports.solutionChecker = solutionChecker;
