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
				if (config.edgeColor) {
					edge.strokeColor = config.edgeColor;
				}

				this.gd.edges.push(edge);
			}
		}
	}

	constructor(graphDrawer, config) {
		this.gd = graphDrawer;
		this._config(config);
		this.gd.dirty = true;
	}

	mouseDownHandler(e) {
		console.log(this.gd.nodes);
		this.gd.dirty = true;
	}
}