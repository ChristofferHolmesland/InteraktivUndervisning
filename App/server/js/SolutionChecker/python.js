const check = function(answer, solution) {
	solution = solution[solution.length - 1];

	// Check that they have the same global variables.
	if (answer.variables.length !== getProps(solution.objects).length) {
		return false;
	}

	// Check that the answer and solution contains the same amount of objects.
	let solutionIds = [];
	let search = (obj) => {
		if (obj._uniqueId == undefined) return;

		// Add self
		if (!solutionIds.includes(obj._uniqueId)) {
			solutionIds.push(obj._uniqueId);
		}

		// Add children
		if (!Array.isArray(obj.data)) return;

		for (let i = 0; i < obj.data.length; i++) {
			let data = obj.data[i];
			if (!solutionIds.includes(data._uniqueId)) {
				search(data);
			}
		}
	};

	search(solution);
	if (solutionIds.length - 1 !== answer.objects.length) {
		return false;
	}

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
			if (index == -1) {
				return false;
			}

			// Convert node id to object
			let id = answer.fields[index].value;
			let answerObject = getAnswerObjectById(id);
			if (answerObject == undefined) {
				return false;
			}

			let solutionObject = data.data[data.objects[v]];
			
			// Check that the objects have the same type
			if (answerObject.type != solutionObject.type) {
				return false;
			}

			if (answerObject.baseType) {
				if (answerObject.value != solutionObject.data) {
					return false;
				}
				continue;
			}

			if (!checkData(solutionObject, answerObject)) return false;
		}

		return true;
	};

	let objectKeys = getProps(solution.objects);
	for (let k = 0; k < objectKeys.length; k++) {
		let v = objectKeys[k];

		let answerVariableIndex = -1;
		for (let i = 0; i < answer.variables.length; i++) {
			if (answer.variables[i].name == v) {
				answerVariableIndex = i;
				break;
			}
		}

		if (answerVariableIndex == -1) {
			return false;
		}
		let answerVariable = answer.variables[answerVariableIndex];

		// Check that the variable is pointing to exactly one object.
		if (answerVariable.links.length !== 1) {
			return false;
		}

		// Check that the variables point to objects of the same type and
		// with the same values.
		let data = solution.data[solution.objects[v]];
		let answerData = answerVariable.links[0];
		if (answerData.type !== data.type) {
			return false;
		}
		
		// If the object is of basetype, the values should match.
		if (answerData.baseType) {
			if (answerData.value != data.data) {
				return false;
			}
			continue;
		}

		// Follow reference data types to check if all of the references
		// matches.
		if (!checkData(data, answerData)) return false;
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

