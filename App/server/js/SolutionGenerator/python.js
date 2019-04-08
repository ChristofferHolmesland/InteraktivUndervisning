let python = require("../algorithms/algorithms").python;

module.exports = function(question) {
	let stepper = python(question.solution);
	question.solution = stepper.getSteps();
	question.objects.steps = [{
			classes: question.solution[question.solution.length - 1].classes
	}];
	
	return question;
};