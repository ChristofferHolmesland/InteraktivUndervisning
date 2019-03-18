const check = function (answer, solution) {
	let result = true;
	if (answer.length !== solution.length) result = false;
	for (let i=0; i<answer.length; i++) {
		if (answer[i] !== solution[i]) result = false;
		if (!result) break;
	}
	return result
};

module.exports.check = check;