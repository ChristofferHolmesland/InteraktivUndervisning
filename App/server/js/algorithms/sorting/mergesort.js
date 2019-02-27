/*
    Stepping implementation of the top-down mergesort algorithm.

    Step definition:
        - Splitting list
        - Merging two lists

    Arguments:
        list: List to be sorted
        limit: List size before insertion sort is performed
*/
module.exports = function(list, limit) {
    if (limit == undefined) {
        limit = 1;
    }

    let currentStep = 0;
    let steps = [
        {
            type: "Initial",
            list: list,
            limit: limit
        }
    ];

    /*
        Merges two sorted lists into one sorted list.
    */
    let merge = (list1, list2) => {
        let i1 = 0;
        let i2 = 0;
        let merged = [];

        while (i1 != list1.length && i2 != list2.length) {
            if (list1[i1] <= list2[i2]) {
                merged.push(list1[i1]);
                i1++;
            } else {
                merged.push(list2[i2]);
                i2++;
            }
        }

        for (i1; i1 < list1.length; i1++) merged.push(list1[i1]);
        for (i2; i2 < list2.length; i2++) merged.push(list2[i2]);

        steps.push({
            type: "Merge",
            list1: list1,
            list2: list2,
            merged: merged
        });

        return merged;
    };

    /*
        Recursivly sorts a list using mergesort, until the limit is hit.
    */
    let merge_sort = (list, limit) => { 
        let length = list.length;
        
        // Insertion sort
        if (length <= limit) {
            let i = 0;
            while (i < length) {
                let j = i;
                while (j > 0 && list[j-1] > list[j]) {
                    let temp = list[j-1];
                    list[j-1] = list[j];
                    list[j] = temp;
                }
                i++;
            }
            return list;
        };

        // Splits the list into a left and right part
        let left = [];
        let right = [];
        for (let i = 0; i < length; i++) {
            if (i < length / 2) {
                left.push(list[i]);
            } else {
                right.push(list[i]);
            }
        }

        steps.push({
            type: "Split",
            list: list,
            left: left,
            right: right
        });

        left = merge_sort(left, limit);
        right = merge_sort(right, limit);

        return merge(left, right);
    }

    merge_sort(list, limit);

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
        },
        getSteps: function() {
            return steps;
        }
    }
};