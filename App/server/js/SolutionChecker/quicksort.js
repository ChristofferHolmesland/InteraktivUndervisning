const check = function(answer, solution) {
    if (answer.length !== solution.length) return false;

    // Starts at 1 to skip initial step
    for(let i = 1; i < solution.length; i++) {
        let answerStep = answer[i];
        let solutionStep = solution[i];

        
    }

    return true;
}

module.exports.check = check;