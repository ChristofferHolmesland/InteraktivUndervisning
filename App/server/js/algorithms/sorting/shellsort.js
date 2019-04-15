module.exports = function (k,list) {
	let currentStep = 0;
	let originallist = [];
	for (let index = 0;index<list.length;index++){
		originallist.push(list[index]);
	}

	let steps = [
		{
			Type: "Initial",
			K: k,
			List: originallist
		}
	];

	function shellSortFull(shell,array) {
		for (let step = parseInt(shell); step > 0; step = Math.floor(step / 2)) {
			for (let i = 0; i + step < array.length; i++) {
				let nextvalue = i + step;
				if (array[i] > array[nextvalue]) {
					let temp = array[i];
					array[i] = array[nextvalue];
					array[nextvalue] = temp;
					if (i > step) {
						let currentindex = i;
						let k = i - step;
						while (array[currentindex] < array[k] && k >= 0) {
							let temp2 = array[currentindex];
							array[currentindex] = array[k];
							array[k] = temp2;
							currentindex = k;
							k -= step;
						}
					}
				}
			}
			let stepArray = [];
			for (let p=0;p<array.length;p++)
			{
				stepArray.push(array[p]);
			}
			steps.push({
				Type: "Step",
				K: step,
				List: stepArray
			});
		}
	}

	shellSortFull(k,list);

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
		},
		getSteps: function() {
			return steps;
		}
	}
};