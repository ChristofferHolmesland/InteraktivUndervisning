const check = function (solutionInfo) {
	let result = {
		passed: true,
		errors: []
	};

	let title = String(solutionInfo.title);

	if(title === undefined || title === "") {
		result.passed = false;
		result.errors.push("TitleIsEmptyError");
	}

	return result;
};

module.exports.check = check;