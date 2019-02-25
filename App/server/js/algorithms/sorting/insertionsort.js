module.exports = function (list) {
	let currentStep = 0;
	let originalArray = [];
	for (let index= 0;index<list.length;index++)
	{
		originalArray.push(list[index]);
	}
	let steps = [{list: originalArray}];

	//Sort the array with Insertion Sort, store all changes to the array in the steps list.
	function insertionSortFull(array) {
		for (let i = 1; i < array.length; i++) {
			let k = i;
			while (array[k] < array[k - 1] && k !== 0) {
				let temp = array[k - 1];
				array[k - 1] = array[k];
				array[k] = temp;
				k--;
			}
			let arrayObject = [];
			for (let v=0;v<array.length;v++)
			{
				arrayObject.push(array[v])
			}
			steps.push({list:arrayObject})
		}
	}
	insertionSortFull(list);

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

};
