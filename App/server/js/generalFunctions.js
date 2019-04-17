const functions = {
	calculateSessionCode: function(sessions) {
		let keys = Array.from(sessions.keys());
		let possibleCodes = [];
		for(let i = 0; i < 10000; i++){
			if (!keys.includes(i)) {
				possibleCodes.push(i);
			}
		}
		
		let code = possibleCodes[Math.floor(Math.random() * possibleCodes.length)].toString();

		return code.padStart(4, "0");
	},
	createSpecialDescription: function(question) {
		let counter = 1;
		question.objects.questionTypeDesc.locale = {};
		question.objects.questionTypeDesc.text = {};
		if (question.solutionType === 6) {
			//needs the node elements that are going to be present in the tree
			question.objects.questionTypeDesc.locale[counter++] = "binaryTreeDesc";
			question.objects.questionTypeDesc.text[counter] = "[" + question.objects.treeElements + "]";
		}
		else if(question.solutionType === 7 || question.solutionType === 8) {
			//needs the action and tree elements that going to be added/removed in the tree
			question.objects.questionTypeDesc.locale[counter++] = "bstavlOperationDesc";
			question.objects.questionTypeDesc.locale[counter++] = question.objects.solutionTreeType ;
			question.objects.questionTypeDesc.locale[counter++] = "bstavlNodesDesc";
			question.objects.questionTypeDesc.text[counter] = "[" + question.objects.treeElements + "]";
		}
		else if(question.solutionType === 10) {
			//needs the code
			question.objects.questionTypeDesc.locale[counter++] = "pythonCodeDesc";
			question.objects.questionTypeDesc.text[counter] = question.objects.code;
		}
	}
};

module.exports.functions = functions;
