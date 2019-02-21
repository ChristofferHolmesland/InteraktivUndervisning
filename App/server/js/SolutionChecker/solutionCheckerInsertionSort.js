const InsertionSort = require("../algorithms/sorting/insertionsort.js");
const ShellSort = require("../algorithms/sorting/shellsort.js");
const ArrayChecker = function (answer,solution) {
	//I assume the solution has already been calculated and the specified step has been obtained.
	let result = true;
	if (answer.length !== solution.length) result = false;
	for (let i=0;i<answer.length;i++) {
		if (answer[i] !== solution[i]) result = false;
		if (!result) break;
	}
	return result
};