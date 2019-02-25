const check = function(answer, solution) {
    console.log(answer);
    console.log(solution);
    if (answer.length !== solution.length) return false;
    for(let i = 0; i < solution.length; i++) {
        if (answer.indexOf(Number(solution[i])) === -1) return false; 
    }
    return true;
}

module.exports.check = check;