const check = function (solutionInfo) {
	let result = {
        passed: true,
        errors: []
    };

    let treeElements = solutionInfo.treeElements;

    if (treeElements === undefined || treeElements === "") {
        result.passed = false;
        result.errors.push("binaryTreeNoElementsError");
    }
    else {
        let treeArray = treeElements.split(",");
        if (treeArray.length === 0){
            result.passed = false;
            result.reason.push("binaryTreeWrongFormat");
        }
        else {
            for (let i = 0; i < treeArray.length; i++) {
                if (isNaN(treeArray[i])){
                    result.passed = false;
                    result.errors.push("treeElementTypeError");
                    break;
                }else if(treeArray[i] === "") {
                    result.passed = false;
                    result.errors.push("treeElementEmptyError");
                    break;
                }
            }
        }
    }

    return result;
};

module.exports.check = check;