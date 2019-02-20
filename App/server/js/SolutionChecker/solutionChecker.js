const solutionChecker = {
    checkAnswer: function(answer, solution, type) {
        if (type === 1) return require("./text.js").check(answer, solution);
        else if (type === 2) return require("./multipleChoice.js").check(answer, solution);
        else return false;
    }
}

module.exports.solutionChecker = solutionChecker;
