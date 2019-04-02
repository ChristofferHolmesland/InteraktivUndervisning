const check = function (solutionInfo) {
	let result = {
		passed: true,
		errors: []
	};

	console.log(solutionInfo.startingArray);
	console.log(solutionInfo.kValue);
	let startArray = solutionInfo.startingArray;
	let kValue = solutionInfo.kValue;
	if (kValue === undefined || kValue === "") {
		result.passed = false;
		result.errors.push("NoKValueError");
	}
	if (startArray === undefined || startArray === "") {
		result.passed = false;
		result.errors.push("ShellSortNoElementsError");
	}
	if (result.passed) {
		let realArray = startArray.split(",");
		if (realArray.length === 0){
			result.passed = false;
			result.reason.push("ShellSortArrayWrongFormatError");
		}
		else {
			if(isNaN(kValue) || parseInt(kValue) >= startArray.length) {
				result.passed = false;
				result.errors.push("InvalidKValueError");
			}
			for (let i = 0; i < realArray.length; i++) {
				if (isNaN(realArray[i])){
					result.passed = false;
					result.errors.push("ShellSortArrayDataTypeError");
					break;
				}else if(realArray[i] === "") {
					result.passed = false;
					result.errors.push("ShellSortEmptyArrayElementError");
					break;
				}
			}
		}
	}
	return result;
};

module.exports.check = check;