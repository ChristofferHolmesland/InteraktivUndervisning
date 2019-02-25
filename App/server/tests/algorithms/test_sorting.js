const assert = require("assert");

let insertionsort = require("../../js/algorithms/sorting/insertionsort");
let shellsort = require("../../js/algorithms/sorting/shellsort");
let mergesort = require("../../js/algorithms/sorting/mergesort");

describe("Insertionsort", function () {
   let testArray = [2,3,545,2,3,4,6,1,3,7,5,10,8];
   let sorter = insertionsort(testArray);

   let steps = [
        {
            list: [2, 3, 545, 2, 3, 4, 6, 1, 3, 7, 5, 10, 8]
        },
        {
            list: [2, 3, 545, 2, 3, 4, 6, 1, 3, 7, 5, 10, 8]
        },
        {
            list: [2, 2, 3, 545, 3, 4, 6, 1, 3, 7, 5, 10, 8]
        },
        {
            list: [2, 2, 3, 3, 545, 4, 6, 1, 3, 7, 5, 10, 8]
        },
        {
            list: [2, 2, 3, 3, 4, 545, 6, 1, 3, 7, 5, 10, 8]
        },
        {
            list: [2, 2, 3, 3, 4, 6, 545, 1, 3, 7, 5, 10, 8]
        },
        {
            list: [1, 2, 2, 3, 3, 4, 6, 545, 3, 7, 5, 10, 8]
        },
        {
            list: [1, 2, 2, 3, 3, 3, 4, 6, 545, 7, 5, 10, 8]
        },
        {
            list: [1, 2, 2, 3, 3, 3, 4, 6, 7, 545, 5, 10, 8]
        },
        {
            list: [1, 2, 2, 3, 3, 3, 4, 5, 6, 7, 545, 10, 8]
        },
        {
            list: [1, 2, 2, 3, 3, 3, 4, 5, 6, 7, 10, 545, 8]
        },
        {
            list: [1, 2, 2, 3, 3, 3, 4, 5, 6, 7, 8, 10, 545]
        }
    ];

    let j = 0;
    while (!sorter.isSorted()) {
        let sortedStep = sorter.step();
        let expectedStep = steps[j];
        it("checking step " + j, function () {
            assert.deepEqual(sortedStep,expectedStep)
        });
        j++;
    }
    it("Array fully sorted",function () {
        let fullySortedArray = [1,2,2,3,3,3,4,5,6,7,8,10,545];
        assert.deepEqual(fullySortedArray,sorter.finish().list);
    });
    it("Array is has been reset",function()  {
        let orgArray = [2,3,545,2,3,4,6,1,3,7,5,10,8];
        assert.deepEqual(orgArray,sorter.reset().list);
    });
});

describe("ShellSort", function () {
    let testArray2 = [29,60,50,71,16,4,56,75,54,15,83,79,5,59,73];
    let testArray3 = [28,60,50,71,45,4,50,53,45,15,86,79,5,51,73];
    let steps = [
        {
            k: 5, list:[ 4, 56, 5, 54, 15, 29, 60, 50, 59, 16, 83, 79, 75, 71, 73 ]
        },
        {
            k: 2, list: [ 4, 16, 5, 29, 15, 50, 59, 54, 60, 56, 73, 71, 75, 79, 83 ]
        },
        {
            k: 1, list: [ 4, 5, 15, 16, 29, 50, 54, 56, 59, 60, 71, 73, 75, 79, 83 ]
        }
    ];
    let sorter = shellsort(5,testArray2);

    let s = 0;
    while(!sorter.isSorted()){
        let sorterStep = sorter.step();
        let expectedStep = steps[s];
        it("checking step " + s, function () {
            assert.deepEqual(sorterStep,expectedStep);
        });
        s++;
    }

    it("Array should be fully sorted", function () {
        let fullySortedArray ={k:1, list:[4, 5, 15, 16, 29, 50, 54, 56, 59, 60, 71, 73, 75, 79, 83]};
            assert.deepEqual(sorter.finish(),fullySortedArray)
    });

    it("Array should be reset", function () {
        let originalArray = {k:5, list: [29, 60, 50, 71, 16, 4, 56, 75, 54, 15, 83, 79, 5, 59, 73]};
        assert.deepEqual(sorter.reset(),originalArray);
    });

    it("K sort where K= 10",  function () {
        let sorter2 = shellsort(10, testArray3);
        let expectedResult = {k:10, list: [28, 60, 5, 51, 45, 4, 50, 53, 45, 15, 86, 79, 50, 71, 73 ]};
        assert.deepEqual(sorter2.step(),expectedResult);
    });
});

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