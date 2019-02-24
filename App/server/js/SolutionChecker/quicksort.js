const check = function(answer, solution) {
    for (let i = 0; i < solution.length; i++) {
        if (solution[i].type !== "split") solution.splice(i, 1);
    }

    if (answer.length !== solution.length) return false;

    let solutionIndex = 1;
    let answerIndex = 1;

    do {
        let solutionStep = solution[solutionIndex];
        let answerStep = answer[answerIndex];

        if(solutionStep.type === "split") {
            /*
                type: "Split",
                list: unsortedList,
                pivot: pivot,
                left: left,
                right: right
            */

            if (!compareTwoLists(solutionStep.list, answerStep.list)) return false;
            if (!compareTwoLists(solutionStep.left, answerStep.left)) return false;
            if (!compareTwoLists(solutionStep.right, answerStep.right)) return false;
            if (solutionStep.pivot !== answerStep.pivot) return false;

            answerIndex++;
        } else {
            solutionStep++;
        }
    }
    while(solutionStep < solution.length);

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