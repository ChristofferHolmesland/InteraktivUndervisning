const assert = require("assert");
let quicksort = require("../../js/algorithms/sorting/quicksort.js");
let quicksortSC = require("../../js/algorithms/SolutionChecker/quicksort.js");

const solution = quicksort([15, 1, 42, 23, 7, 24, 4], 3);

const answers = [
    [
        {
            type:"Split",
            list: [15, 1, 42, 23, 7, 24, 4],
            pivot: 15,
            left: [1, 7, 4],
            right: [42, 23, 24]
        },
        {
            type:"Split",
            list: [1, 7, 4],
            pivot: 4,
            left: [1],
            right: [7]
        },
        {
            type:"Split",
            list: [42, 23, 24],
            pivot: 24,
            left: [23],
            right: [42]
        }
    ],
    [
        {
            type:"Split",
            list: [15, 1, 42, 23, 7, 24, 4],
            pivot: 15,
            left: [1, 7, 4],
            right: [42, 23, 24]
        },
        {
            type:"Split",
            list: [1, 7, 4],
            pivot: 4,
            left: [1],
            right: [7]
        }
    ],
    [
        {
            type:"Split",
            list: ["15", 1, 42, 23, 7, 24, 4],
            pivot: 15,
            left: [1, 7, 4],
            right: [42, 23, 24]
        },
        {
            type:"Split",
            list: [1, 7, 4],
            pivot: 4,
            left: [1],
            right: [7]
        },
        {
            type:"Split",
            list: [42, 23, 24],
            pivot: 24,
            left: [23],
            right: [42]
        }
    ],
    [
        {
            type:"Split",
            list: [15, 1, 42, 23, 7, 24, 4],
            pivot: 15,
            left: [1, 7, 4],
            right: [42, 23, 24]
        },
        {
            type:"Split",
            list: [1, 7, 4],
            pivot: 4,
            left: [1],
            right: [7]
        },
        {
            type:"Split",
            list: [42, 23, 24],
            pivot: 24,
            left: [23],
            right: [42]
        },
        {
            type:"Split",
            list: [42, 23, 24],
            pivot: 24,
            left: [23],
            right: [42]
        }
    ],
    [
        {
            type:"Split",
            list: [15, 1, 42, 23, 7, 24, 4],
            pivot: 15,
            left: [1, 7, 4],
            right: [42, 23, 24]
        },
        {
            type:"Split",
            list: [42, 23, 24],
            pivot: 24,
            left: [23],
            right: [42]
        },
        {
            type:"Split",
            list: [1, 7, 4],
            pivot: 4,
            left: [1],
            right: [7]
        }
    ],
]
const testSolution = [true, false, false, false, false];

describe("Checking quicksort solution checker", function() {
    for (let i = 0; i < answers.length; i++) {
        let result = quicksortSC(answer[i], solution, 4 /* TODO fix type number */); 

        it(`Checking case ${i + 1}`, function () {
            assert.Equal(result, testSolution[i]);
        });
    }
});