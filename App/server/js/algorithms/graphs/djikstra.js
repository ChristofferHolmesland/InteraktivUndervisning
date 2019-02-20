/*
    Stepping implementation of the djikstra algorithm.
*/
function d(graph, from, to) {
    let currentStep = 0;
    let steps = [
        {
            type: "Initial",
            graph: graph,
            from: from,
            to: to
        }
    ];

    let djikstra = () => {

    }

    return {
        isSorted: function() {
            return currentStep == steps.length - 1;
        },
        get: function() {
            return steps[currentStep];
        },
        step: function() {
            if (currentStep < steps.length - 1)
                currentStep++;
            return steps[currentStep];
        },
        back: function() {
            if (currentStep > 0)
                currentStep++;
            return steps[currentStep];
        },
        finish: function() {
            currentStep = steps.length - 1;
            return steps[currentStep];
        },
        reset: function() {
            currentStep = 0;
            return steps[currentStep];
        }
    }
};

console.log(d(graph).reset());