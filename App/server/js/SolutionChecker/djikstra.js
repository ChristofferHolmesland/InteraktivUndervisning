const check = function(answer, solution) {
    let steps = solution.getSteps();
    
    let distanceSteps = [];
    for (let i = 0; i < steps.length; i++) {
        if (steps[i].type == "Distance") {
            distanceSteps.push(steps[i]);
        }
    }

    for (let i = 0; answer.length; i++) {
        let a = answer[i];
        let current = a.current;
        let node = a.node;

        for (let j = 0; j < distanceSteps.length; i++) {
            let step = distanceSteps[j];
            if (step.current.v == current.v) {
                let found = false;
                for (let k = 0; k < distanceSteps.length; k++) {
                    let step2 = distanceSteps[k];
                    if (step2.current.v == current && step2.node.v == node.v) {
                        found = true;
                        distanceSteps.splice(k, 1);
                        break;
                    }
                }

                if (!found) return false;
                break;
            }
        }

        return true;
    }
}

module.exports.check = check;