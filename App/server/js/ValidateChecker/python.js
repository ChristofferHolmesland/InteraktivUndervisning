const check = function (solutionInfo) {
	let result = {
		passed: true,
		errors: []
	}

	let code = solutionInfo.code;

	if (code.trim().length === 0) {
		result.passed = false;
		result.errors.push("NoCode");
	}

	return result;
};

module.exports.check = check;