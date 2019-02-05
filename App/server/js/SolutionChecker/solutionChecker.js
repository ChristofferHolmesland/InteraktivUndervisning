const solutionChecker = {
    checkAnswer: function(answer, solution, type) {
        if (type === 1) return require("./solutionCheckerText.js").textChecker(answer, solution);
        else if (type === 2) return false;
    }
}

module.exports.solutionChecker = solutionChecker;
