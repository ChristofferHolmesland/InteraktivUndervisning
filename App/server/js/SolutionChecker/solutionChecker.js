let checkers = {
    1: require("./text.js"),
    2: require("./multipleChoice.js"),
    3: require("./text.js"),
    4: require("./text.js"),
    5: require("./quicksort.js"),
    6: require("./text.js"),
    7: require("./text.js"),
    8: require("./text.js"),
    9: require("./text.js"),
    10: require("./djikstra.js"),
}

const solutionChecker = {
    checkAnswer: function(answer, solution, type) {
        if (checkers[type] !== undefined) {
            checkers[type].check(answer, solution);
        }
        else return false;
    }
}

module.exports.solutionChecker = solutionChecker;
