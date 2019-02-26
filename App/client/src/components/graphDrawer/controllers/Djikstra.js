export default class Djikstra {
	_config(config) {
		// Parse graph to build the world.
		if (config.graph) {
			this.to = config.to;
			this.from = config.from;

			for (let i = 0; i < config.graph.nodes.length; i++) {
				let node = config.graph.nodes[i];
				if (node.v == this.from.v) node.fillColor = config.startColor;
				else if (node.v == this.to.v) node.fillColor = config.endColor;
				this.gd.nodes.push(node);
			}

			for (let i = 0; i < config.graph.edges.length; i++) {
				let edge = config.graph.edges[i];
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
}