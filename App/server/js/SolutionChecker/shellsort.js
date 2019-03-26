const check = function (answer, solution) {
	if (answer.length !== solution.length) return false;
	for (let i = 0; i < answer.length; i++) {
		if (answer[i].Type === "Step") {
			for (let j = 0; j < answer[i].List.length; j++) {
				if (answer[i].List[j].toString() !== solution[i].List[j].toString()) return false;
			}
			if (answer[i].K.toString() !== solution[i].K.toString()) return false;
		}
	}
	return true
};

module.exports.check = check;