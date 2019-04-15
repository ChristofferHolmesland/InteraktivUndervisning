const check = function (solutionInfo) {
	let result = {
		passed: true,
		errors: []
	};

	let startArray = solutionInfo.startingArray;
	if (startArray === undefined || startArray === "") {
		result.passed = false;
		result.errors.push("MergeQuickSortNoElementsError");
	}
	if (result.passed) {
		let realArray = startArray.split(",");
		if (realArray.length === 0){
			result.passed = false;
			result.reason.push("MergeQuickSortArrayWrongFormatError");
		}
		else {
			for (let i = 0; i < realArray.length; i++) {
				if (isNaN(realArray[i])){
					result.passed = false;
					result.errors.push("MergeQuickSortArrayDataTypeError");
					break;
				}else if(realArray[i] === "") {
					result.passed = false;
					result.errors.push("MergeQuickSortEmptyArrayElementError");
					break;
				}
			}
		}
	}
	return result;
};

module.exports.check = check;