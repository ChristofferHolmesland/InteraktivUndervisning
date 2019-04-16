const check = function(answer, solution) {
	if(answer.toLowerCase() === solution.toLowerCase()) return true;
	return false;
}

module.exports.check = check;