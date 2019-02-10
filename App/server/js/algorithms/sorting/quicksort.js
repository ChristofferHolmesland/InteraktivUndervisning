function quicksort(unsortedList, typePivot) {
    currentStep = 0;
    let steps = [
    ]

    steps.push({
        type: "Initial",
        list: unsortedList
    }) 

    let split = (unsortedList, typePivot) => {
        if (unsortedList.length <= 1) return unsortedList;

        let pivot = 0;
        let pivotIndex = 0;

        switch (typePivot) {
            case 1:
                pivot = unsortedList[0];
                pivotIndex = 0;
            case 2:
                pivot = unsortedList[unsortedList.length - 1];
                pivotIndex = unsortedList.length - 1;
            case 3:
                first = unsortedList[0];
                last = unsortedList[unsortedList.length - 1];
                middle = unsortedList[Math.floor(unsortedList.length / 2)];
                pivot = Math.max(Math.min(first, middle), Math.min(Math.max(first, middle), last));
                if (pivot === first) pivotIndex = 0;
                else if (pivot === middle) pivotIndex = Math.floor(unsortedList.length / 2);
                else pivotIndex = unsortedList.length - 1;
        }
   
        let left = []; 
        let right = [];

        for (var i = 0; i < unsortedList.length; i++) {
            if (i !== pivotIndex)
                unsortedList[i] < pivot ? left.push(unsortedList[i]) : right.push(unsortedList[i]);
        }
        steps.push({
            type: "Split",
            list: unsortedList,
            pivot: pivot,
            left: left,
            right: right
        })

        let leftSorted = split(left, typePivot);
        let rightSorted = split(right, typePivot);

        let sorted = leftSorted.concat(pivot, rightSorted);

        steps.push({
            type: "Merge",
            leftSorted: leftSorted,
            rightSorted: rightSorted,
            pivot: pivot,
            sorted: sorted
        })

        return sorted
    }

    split(unsortedList, typePivot)

    return {
        isSorted: function() {
            return currentStep === steps.length - 1;
        },
        step: function() {
            if (currentStep < steps.length - 1)
                currentStep++;
            return steps[currentStep];
        },
        back: function() {
            if (currentStep > 0)
                currentStep--;
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
}