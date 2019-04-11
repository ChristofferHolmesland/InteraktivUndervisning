let python = require("../algorithms/algorithms").python;

module.exports = function(question) {
	let stepper = python(question.solution);
	question.solution = stepper.getSteps();

	if (question.objects == undefined) 
		question.objects = {};

	if (question.solution.length > 0) {
		question.objects.steps = [{
			classes: question.solution[question.solution.length - 1].classes
		}];
	} else {
		question.objects.steps = [];
	}
	
	return question;
};