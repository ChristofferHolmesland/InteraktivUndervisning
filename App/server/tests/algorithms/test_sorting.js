const assert = require("assert");

let mergesort = require("../../js/algorithms/sorting/mergesort");

describe("Mergesort", function() {
    let list = [5, 3, 2, -1, 99, 2];
    let limit = 2;
    let sorter = mergesort(list, limit);
    let steps = [
        { 
            type: 'Split', 
            list: [ 5, 3, 2, -1, 99, 2 ], left: [ 5, 3, 2 ], right: [ -1, 99, 2 ] 
        },
        { 
            type: 'Split', 
            list: [ 5, 3, 2 ], left: [ 3, 5 ], right: [ 2 ]
        },
        { 
            type: 'Merge',
            list1: [ 3, 5 ], list2: [ 2 ], merged: [ 2, 3, 5 ] 
        },
        { 
            type: 'Split',
            list: [ -1, 99, 2 ], left: [ -1, 99 ], right: [ 2 ]
        },
        { 
            type: 'Merge',
            list1: [ -1, 99 ], list2: [ 2 ], merged: [ -1, 2, 99 ] 
        },
        { 
            type: 'Merge',
            list1: [ 2, 3, 5 ], list2: [ -1, 2, 99 ], merged: [ -1, 2, 2, 3, 5, 99 ] 
        },
        { 
            type: 'Merge',
            list1: [ 2, 3, 5 ], list2: [ -1, 2, 99 ], merged: [ -1, 2, 2, 3, 5, 99 ]
        },
    ];

    // Checks every step of the algorithm
    let i = 0;
    while (!sorter.isSorted()) {
        let sorterStep = sorter.step();
        let step = steps[i];

        it("Checking step: " + i, () => {
            assert.deepEqual(sorterStep, step);
        });
        i++;
    }

    // Checks if the array is sorted
    it("Array is sorted", () => {
        let shouldBeSorted = sorter.finish().merged;
        let ok = true;
        for (let i = 0; i < shouldBeSorted.length - 1; i++) {
            if (shouldBeSorted[i] > shouldBeSorted[i+1]) {
                ok = false;
                break;
            }
        }

        assert.ok(ok);
    });
});