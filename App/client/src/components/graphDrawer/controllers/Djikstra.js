export default class Djikstra {
	_config(config) {
		// Save steps if they exists.
		if (config.steps) {
			this.currentStep = config.steps.length - 1;
			this.steps = config.steps;
			this._parseSteps();
			this.gd.dirty = true;
			if (this.gd.operatingMode == "Presentation") {
				this.addSteppingButtons();
			}
		}

		// Parse graph to build the world.
		if (config.graph !== undefined) {
			this.to = undefined;
			this.from = undefined;

			let graph = config.graph.graph;

			for (let i = 0; i < graph.nodes.length; i++) {
				let node = graph.nodes[i];
				if (node.marked == "Start") {
					this.from = node;
					node.fillColor = config.startColor;
				} else if (node.marked == "End") {
					this.to = node;
					node.fillColor = config.endColor;
				}
				this.gd.nodes.push(node);
			}

			for (let i = 0; i < graph.edges.length; i++) {
				let edge = graph.edges[i];
				edge.directed = false;
				if (config.edgeColor) {
					edge.strokeColor = config.edgeColor;
				}

				this.gd.edges.push(edge);
			}
		}
	}

	constructor(graphDrawer, config) {
		this.gd = graphDrawer;
		this.gd.dirty = true;
		this.config = config;
	}

	configure() {
		this._config(this.config);
	}

	export() {
		let steps = [];
		for (let i = 0; i < this.gd.edges.length; i++) {
			let edge = this.gd.edges[i];
			if (edge.directed) {
				steps.push({
					current: edge.n1,
					node: edge.n2
				});
			}
		}

		return steps;
	}

	mouseDownHandler(e) {
		e.preventDefault();
		let consumed = this.joinNode(e);

		return consumed;
	}

	joinNode(e) {
		e.preventDefault();
		let node = this.gd.getNodeAtCursor(e).node;
		if (node == undefined) return false;

		let handler = function(newE) {
			newE.preventDefault();
			this.gd.setEventOffset(newE);
			let node2 = this.gd.getNodeAtCursor(newE).node;

			if (node2 != undefined) {
				if (node != node2) {
					this.gd.edges.push({
						n1: node,
						n2: node2,
						v: undefined,
						directed: true
					});

					this.gd.dirty = true;
				}
			}

			this.gd.canvas.removeEventListener("mouseup", handler);
			this.gd.canvas.removeEventListener("touchend", handler);
			this.gd.canvas.removeEventListener("touchcancel", handler);
		}.bind(this);
		this.gd.canvas.addEventListener("mouseup", handler);
		this.gd.canvas.addEventListener("touchend", handler);
		this.gd.canvas.addEventListener("touchcancel", handler);
		return true;
	}

	_parseSteps() {

	}

	addSteppingButtons() {
		
	}
}