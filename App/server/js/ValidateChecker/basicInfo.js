const check = function (solutionInfo) {
	let result = {
		passed: true,
		errors: []
	};

	let title = String(solutionInfo.title);
	let desc = String(solutionInfo.description);

	if(title === undefined || title === "") {
		result.passed = false;
		result.errors.push("TitleIsEmptyError");
	}
	if(desc === undefined || desc === "") {
		result.passed = false;
		result.errors.push("DescriptionIsEmptyError");
	}

	return result;
};

module.exports.check = check;