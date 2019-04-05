const check = function(answer, solution) {
	solution = solution[solution.length - 1];

	// Check that they have the same global variables.
	if (answer.variables.length !== solution.objects.length)
		return false;

	let getAnswerObjectById = (id) => {
		for (let i = 0; i < answer.objects.length; i++) {
			let obj = answer.objects[i];
			if (obj.id == id) return obj;
		}

		return undefined;
	};

	let checkData = (data, answer) => {
		// Check that fields match datatype fields.
		let objectKeys = getProps(data.objects);
		for (let k = 0; k < objectKeys.length; k++) {
			let v = objectKeys[k];
			let index = -1;
			// Checks that fields with the same name exists
			for (let i = 0; i < answer.fields.length; i++) {
				if (answer.fields[i].name == v) {
					index = i;
					break;
				}
			}
			if (index == -1) return false;

			// Convert node id to object
			let id = answer.fields[index].value;
			let answerObject = getAnswerObjectById(id);
			if (answerObject == undefined) return false;

			let solutionObject = data.data[data.objects[v]];
			
			// Check that the objects have the same type
			if (answerObject.type !== solutionObject.type) return false;

			if (answerObject.baseType) {
				if (answerObject.value !== solutionObject.data) return false;
				continue;
			}

			if (!checkData(data, answerObject)) return false;
		}

		return true;
	};

	let objectKeys = getProps(solution.objects);
	for (let k = 0; k < objectKeys.length; k++) {
		let v = objectKeys[k];

		let answerVariableIndex = answer.variables.indexOf(v);
		if (answerVariableIndex == -1) return false;
		let answerVariable = answer.variables[answerVariableIndex];

		// Check that the variables point to objects of the same type and
		// with the same values.
		let data = solution.data[solution.objects[v]];
		if (answerVariable.type !== data.type) return false;
		
		// If the object is of basetype, the values should match.
		if (answerVariable.baseType) {
			if (answerVariable.value !== data.data) return false;
			continue;
		}

		// Follow reference data types to check if all of the references
		// matches.
		if (!checkData(data, answerVariable)) return false;
	}

	return true;
}

function getProps(object) {
	let props = [];
	for (let prop in object) {
		if (object.hasOwnProperty(prop)) props.push(prop);
	}
	return props;
}

module.exports.check = check;

