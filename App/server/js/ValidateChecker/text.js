const check = function (solutionInfo) {
	let result = {
		passed: true,
		errors: []
	};

	let stringSolution = String(solutionInfo.solution);
	if (stringSolution === undefined || stringSolution === "") {
		result.passed = false;
		result.errors.push("EmptyTextSolutionError");
	}
	return result;
};

module.exports.check = check;