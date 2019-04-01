let sorters = require("../algorithms/algorithms").sorting;

module.exports = function(question) {
    let sorter = undefined;
    let solutionType = question.solutionType;

    if (solutionType === 3) sorter = sorters.shellsort;
    else if (solutionType === 4) sorter = sorters.mergesort;
    else if (solutionType === 5) sorter = sorters.quicksort;

    // Check if the array contains numbers and remove whitespace
    let isNumbers = true;
    let elements = question.objects.startingArray.split(",");
    for (let i = 0; i < elements.length; i++) {
        elements[i] = elements[i].trim();
        if (isNaN(Number(elements[i]))) isNumbers = false;
    }

    // This is done in a seperate loop, because an array of strings
    // might contain some elements which are numbers.
    if (isNumbers) {
        for (let i = 0; i < elements.length; i++) {
            elements[i] = Number(elements[i]);
        }
    }

    let steppingFunctions = undefined;

    if (solutionType === 3) steppingFunctions = sorter(question.objects.kValue, elements);
    else steppingFunctions = sorter(elements);
    // Store all the steps in the solution
    //question.objects.startingArray = undefined;
    question.solution = steppingFunctions.getSteps();
    // Assign the first step to the objects, so the user can
    // manipulate it.
    question.objects.steps = [steppingFunctions.reset()];

    return question;
};