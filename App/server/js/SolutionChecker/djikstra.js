const check = function(answer, solution) {
	let steps = solution;

	// Remove Initial step from the answer
	// (can't use splice because the answer object is stored in the db)
	let copyOfAnswer = [];
	for (let i = 1; i < answer.length; i++) {
		copyOfAnswer.push(answer[i]);
	}

	let distanceSteps = [];
	for (let i = 0; i < steps.length; i++) {
		if (steps[i].type == "Distance") {
			distanceSteps.push(steps[i]);
		}
	}

	for (let i = 0; i < copyOfAnswer.length; i++) {
		let a = copyOfAnswer[i];
		let current = a.current.v;
		let node = a.node.v;

		let outerFound = false;
		for (let j = 0; j < distanceSteps.length; j++) {
			let step = distanceSteps[j];
			if (step.current == current && step.node == node) {
				outerFound = true;
				distanceSteps.splice(j, 1);
				break;
			}

			if (step.current !== current) {
				break;
			}
		}

		if (!outerFound) {
			return false;
		}
	}

	return true;
}

module.exports.check = check;