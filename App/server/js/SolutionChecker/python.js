const check = function(answer, solution) {
	solution = solution[solution.length - 1];

	// Check that they have the same global variables.
	if (answer.variables.length !== getProps(solution.objects).length) {
		console.log("Not the same amount of variables");
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
		console.log("Check data (data, answer)");
		console.log(data);
		console.log("ANSWER");
		console.log(answer);

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
				console.log("Field not found");
				console.log(v);
				console.log(answer.fields);
				return false;
			}

			// Convert node id to object
			let id = answer.fields[index].value;
			let answerObject = getAnswerObjectById(id);
			if (answerObject == undefined) {
				console.log("Anser object is undefined, id: " + id);
				return false;
			}

			let solutionObject = data.data[data.objects[v]];
			
			// Check that the objects have the same type
			if (answerObject.type != solutionObject.type) {
				console.log("Type mismatch");
				console.log(answerObject.type + "  " + solutionObject.type);
				return false;
			}

			if (answerObject.baseType) {
				if (answerObject.value != solutionObject.data) {
					console.log("Value mismatch");
					console.log(answerObject.value + "  " + solutionObject.data);
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
		console.log("Checking property: " + v);

		let answerVariableIndex = -1;
		for (let i = 0; i < answer.variables.length; i++) {
			if (answer.variables[i].name == v) {
				answerVariableIndex = i;
				break;
			}
		}

		if (answerVariableIndex == -1) {
			console.log("AnswerVariableIndex is -1");
			console.log(v);
			console.log(answer.variables);
			return false;
		}
		let answerVariable = answer.variables[answerVariableIndex];

		// Check that the variable is pointing to exactly one object.
		if (answerVariable.links.length !== 1) {
			console.log("Linking to more than one object");
			return false;
		}

		// Check that the variables point to objects of the same type and
		// with the same values.
		let data = solution.data[solution.objects[v]];
		let answerData = answerVariable.links[0];
		if (answerData.type !== data.type) {
			console.log("Variable type mismatch");
			console.log(answerData);
			console.log(answerData.type + "   " + data.type);
			return false;
		}
		
		// If the object is of basetype, the values should match.
		if (answerData.baseType) {
			if (answerData.value != data.data) {
				console.log("Variable value mismatch");
				console.log(answerData.value + "   " + data.data);
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

