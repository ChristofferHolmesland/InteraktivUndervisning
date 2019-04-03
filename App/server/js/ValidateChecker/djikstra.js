const check = function (solutionInfo) {
	let result = {
		passed: true,
		errors: []
	};

	let graphObject = solutionInfo.graph;
	if (graphObject === undefined){
		result.passed = false;
		result.errors.push("UndefinedGraphError");
	}else {
		if(graphObject.nodes.length > 1 && graphObject.edges.length > 0) {
			let nodeStart = undefined;
			let nodeEnd = undefined;
			let colorCounter = 0;
			for (let g = 0; g < graphObject.nodes.length; g++) {
				if (graphObject.nodes[g].marked === "Start") {
					nodeStart = graphObject.nodes[g];
					colorCounter++;
				}else if (graphObject.nodes[g].marked === "End") {
					nodeEnd = graphObject.nodes[g];
					colorCounter++;
				}
				if (colorCounter > 2) {
					break;
				}
			}
			if(nodeStart !== undefined && nodeEnd !== undefined && colorCounter === 2) {
				for (let e = 0; e < graphObject.edges.length; e++) {
					if (isNaN(graphObject.edges[e].v) || graphObject.edges[e].v < 0) {
						result.passed = false;
						result.errors = "InvalidDjikstraEdgeValue";
						break;
					}
				}
				//probably set a if result.passed here?
				let visitedNodes = [];
				let newNodeList = [];
				for (let f = 0; f < graphObject.edges.length; f++) {
					let currentEdge = graphObject.edges[f];
					if (visitedNodes.length > 0 && visitedNodes.indexOf(currentEdge.n1.id) !== -1) {
						let index = visitedNodes.indexOf(currentEdge.n1.id);
						let nodeObject = newNodeList[index];
						nodeObject.toEdges.push(currentEdge.n2.id);
					}
					else {
						if (currentEdge.n1.marked === undefined) {
							let node = {
								id: currentEdge.n1.id,
								value: currentEdge.n1.v,
								toEdges: [currentEdge.n2.id],
								fromEdges: [],
								status: "Normal"
							};
							newNodeList.push(node);
							visitedNodes.push(node.id);
						} else {	//start node or end node
							let node = {
								id: currentEdge.n1.id,
								value: currentEdge.n1.v,
								toEdges: [currentEdge.n2.id],
								fromEdges: [],
								status: currentEdge.n1.marked
							};
							newNodeList.push(node);
							visitedNodes.push(node.id);
						}
					}
					if (visitedNodes.length > 0 && visitedNodes.indexOf(currentEdge.n2.id) !== -1) {
						let index = visitedNodes.indexOf(currentEdge.n2.id);
						let nodeObject = newNodeList[index];
						nodeObject.fromEdges.push(currentEdge.n1.id);
					}
					else {
						if (currentEdge.n2.marked === undefined) {
							let node = {
								id: currentEdge.n2.id,
								value: currentEdge.n2.v,
								toEdges: [],
								fromEdges: [currentEdge.n1.id],
								status: "Normal"
							};
							newNodeList.push(node);
							visitedNodes.push(node.id);
						} else {	//start node or end node
							let node = {
								id: currentEdge.n2.id,
								value: currentEdge.n2.v,
								toEdges: [],
								fromEdges: [currentEdge.n1.id],
								status: currentEdge.n2.marked
							};
							newNodeList.push(node);
							visitedNodes.push(node.id);
						}
					}
				}
				let startNode = newNodeList[visitedNodes.indexOf(nodeStart.id)];
				let endNode = newNodeList[visitedNodes.indexOf(nodeEnd.id)];
				let importantCounter = 0;
				for (let m = 0; m<newNodeList.length; m++) {
					if (newNodeList[m].status === "Start") {
						importantCounter++;
					}
					if (newNodeList[m].status === "End") {
						importantCounter++;
					}

				}
				if (importantCounter === 2) {
					let pathwayResult = checkGraphNode(startNode,endNode,newNodeList,visitedNodes,[]);
					if (!pathwayResult) {
						result.passed = false;
						result.errors.push("NoPathBetweenStartNodeAndEndNodeError");
					}
				}else {
					result.passed = false;
					result.errors.push("NoPathBetweenStartNodeAndEndNodeError");
				}
			}
			else if(colorCounter > 2) {
				result.passed = false;
				result.errors.push("ToManyStartOrEndNodesError");
			}
			else {
				result.passed = false;
				result.errors.push("MissingStartOrEndNodeError");
			}
		}
		else {
			result.passed = false;
			result.errors.push("InvalidDijkstraGraphError");
		}
	}

	return result;
};

module.exports.check = check;

function checkGraphNode(node,endNode,nodelist,indexes,previousNodes) {
	let pathwayPossible = false;
	if (node.id === endNode.id) {
		return true
	}
	if (node === undefined || node.toEdges.length > 0) {
		for (let i = 0; i < node.toEdges.length; i++) {
			let nextNode = nodelist[indexes.indexOf(node.toEdges[i])];
			if (previousNodes.length === 0 || previousNodes.indexOf(nextNode.id) === -1) {
				previousNodes.push(node.id);
				pathwayPossible = checkGraphNode(nextNode,endNode,nodelist,indexes,previousNodes);
			}
			if (pathwayPossible) {
				break;
			}
		}
	}else {
		return false
	}
	return pathwayPossible
}
