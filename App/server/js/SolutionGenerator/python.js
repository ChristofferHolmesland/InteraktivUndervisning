let python = require("../algorithms/algorithms").python;

module.exports = function(question) {
    let stepper = python(question.solution);
    question.solution = stepper.getSteps();
    
    return question;
};