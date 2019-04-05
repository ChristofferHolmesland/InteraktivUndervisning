const check = function (solutionInfo) {
	let result = {
		passed: true,
		errors: []
	};

	if (solutionInfo.solution === undefined || solutionInfo.solution.length === 0) {
		result.passed = false;
		result.errors.push("NoMultiChoiceSolutionError");
	}
	if (solutionInfo.multipleChoices === undefined || solutionInfo.multipleChoices.length === 0) {
		result.passed = false;
		result.errors.push("NoMultipleChoiceOptionsError");
	}
	if (result.passed) {
		for (let h = 0; h<solutionInfo.multipleChoices.length; h++) {
			if(solutionInfo.multipleChoices[h] === undefined || String(solutionInfo.multipleChoices[h]) === "") {
				result.passed = false;
				result.errors.push("MissingOptionInformationError");
				break;
			}
		}
		for (let i = 0; i<solutionInfo.solution.length; i++) {
			let solutionIndex = parseInt(solutionInfo.solution);
			if (isNaN(solutionIndex) || solutionInfo.multipleChoices[solutionIndex] === undefined) {
				result.passed = false;
				result.errors.push("MarkedSolutionIsNotAnOptionError");
				break;
			}
		}
	}
	return result;
};

module.exports.check = check;