const check = function(answer, solution) {
	for (let i = 0; i < solution.length; i++) {
		if (solution[i].type !== "Split"){
			solution.splice(i, 1);
			i--;
		}
	}
	for (let i = 0; i < answer.length; i++) {
		if (answer[i].type !== "Split"){
			answer.splice(i, 1);
			i--;
		}
	}

	if (answer.length !== solution.length) return false;

	let solutionIndex = 0;
	let answerIndex = 0;

	do {
		let solutionStep = solution[solutionIndex];
		let answerStep = answer[answerIndex];
		if (!compareTwoLists(solutionStep.list, answerStep.list)) return false;
		if (!compareTwoLists(solutionStep.left, answerStep.left)) return false;
		if (!compareTwoLists(solutionStep.right, answerStep.right)) return false;

		answerIndex++;
		solutionIndex++;
	}
	while(solutionIndex < solution.length);

	return true;
}

module.exports.check = check;

function compareTwoLists(list1, list2) {
	if (list1.length !== list2.length) return false;

	let returnValue = true;

	for (let i = 0; i < list1.length; i++) {
		if (list1[i] !== list2[i]) {
			returnValue = false;
			break;
		}
	}

	return returnValue;
}