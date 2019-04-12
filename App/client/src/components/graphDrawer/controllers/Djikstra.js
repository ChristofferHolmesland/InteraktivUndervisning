export default class Djikstra {
	_config(config) {
		// Save steps if they exists.
		if (config.steps) {
			this.gd.currentStep = config.steps.length - 1;
			this.steps = config.steps;
			if (this.gd.operatingMode == "Presentation") {
				this.gd.addSteppingButtons();
				this.gd.drawStatic();
				this.parseSteps();
			}
		}

		// Parse graph to build the world.
		// This is used when a student is answering a dijkstra question.
		if (config.graph !== undefined) {
			this.to = undefined;
			this.from = undefined;

			this.graph = config.graph.graph;

			for (let i = 0; i < this.graph.nodes.length; i++) {
				let node = this.graph.nodes[i];
				if (node.marked == "Start") {
					this.from = node;
					node.fillColor = config.startColor;
				} else if (node.marked == "End") {
					this.to = node;
					node.fillColor = config.endColor;
				}
				this.gd.addNode(node);
			}

			for (let i = 0; i < this.graph.edges.length; i++) {
				let edge = this.graph.edges[i];
				edge.directed = false;
				if (config.edgeColor) {
					edge.strokeColor = config.edgeColor;
				}

				this.gd.edges.push(edge);
			}
		}

		if (this.operatingMode == "Interactive") {
			this.buttons.push({
				text: "<- Undo",
				position: {},
				handler: this.undoButtonClicked,
				disabled: true
			});
			this.buttons.push({
				text: "Redo ->",
				position: {},
				handler: this.redoButtonClicked,
				disabled: true
			});
			this.positionButtons();
			this.drawStatic();
		}
	}

	constructor(graphDrawer, config) {
		this.gd = graphDrawer;
		this.gd.dirty = true;
		this.config = config;

		/*
			{
				text: String
				position: { x, y, width, height },
				handler: Function
				disabled: Boolean
			}
		*/
		this.buttons = [];
		this.disabledColor = "lavender";
		this.relSize = 0.7;
	}

	configure() {
		this._config(this.config);
	}

	export() {
		let steps = [];
		steps.push({
			type: "Initial",
			graph: this.graph,
			to: this.to,
			from: this.from
		});

		for (let i = 0; i < this.gd.edges.length; i++) {
			let edge = this.gd.edges[i];
			if (edge.directed) {
				steps.push({
					type: "Distance",
					current: edge.n1,
					node: edge.n2
				});
			}
		}

		return steps;
	}

	drawStatic() {
		this.gd.resetStatic();

		for (let i = 0; i < this.buttons.length; i++) {
			let btn = this.buttons[i];
			this.gd.staticContext.beginPath();

			// Button
			this.gd.staticContext.rect(
				btn.position.x,
				btn.position.y,
				btn.position.width,
				btn.position.height
			);

			if (btn.disabled)
				this.gd.staticContext.fillStyle = this.disabledColor;
			else this.gd.staticContext.fillStyle = "white";

			this.gd.staticContext.fill();
			this.gd.staticContext.stroke();

			// Text
			this.gd.staticContext.fillStyle = "black";
			let textWidth = this.gd.staticContext.measureText(btn.data.text).width;
			let xPadding = (btn.position.width - textWidth) / 2;
			let yPadding = (btn.position.height + this.gd.fontHeight) / 2;
			this.gd.staticContext.fillText(
				btn.data.text,
				btn.position.x + xPadding,
				btn.position.y + yPadding
			);
			this.gd.staticContext.fillStyle = "white";
			this.gd.staticContext.closePath();
		}
	}

	positionButtons() {
		let buttonMaxHeight = this.gd.canvas.height / 10;
		let buttonMaxWidth = this.gd.canvas.width / this.buttons.length;
		let buttonHeight = buttonMaxHeight * this.relSize;
		let buttonWidth = buttonMaxWidth * this.relSize;
		let buttonY = this.gd.canvas.height - buttonMaxHeight;

		for (let i = 0; i < this.buttons.length; i++) {
			let btn = this.buttons[i];
			btn.width = buttonWidth;
			btn.height = buttonHeight;

			btn.x = buttonMaxWidth * i + (buttonMaxWidth - buttonWidth / 2);
			btn.y = buttonY + (buttonMaxHeight - buttonHeight / 2);
		}
	}

	undoButtonClicked() {

	}

	redoButtonClicked() {

	}

	mouseDownHandler(e) {
		e.preventDefault();

		let consumed = this.checkUI(e);
		if (consumed) return consumed;

		consumed = this.joinNode(e);
		return consumed;
	}

	checkUI() {
		return false;
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

	parseSteps() {
		this.gd.nodes = [];
		this.gd.edges = [];
		this.to = undefined;
		this.from = undefined;
		this.graph = undefined;

		let parseInitial = function(step) {
			this.graph = step.graph;

			for (let i = 0; i < this.graph.nodes.length; i++) {
				let node = this.graph.nodes[i];
				if (node.marked == "Start") {
					this.from = node;
					node.fillColor = this.config.startColor;
				} else if (node.marked == "End") {
					this.to = node;
					node.fillColor = this.config.endColor;
				}

				if (node == undefined) {
					console.error("Node in step is undefined, index: " + i);
					console.error(step);
				}

				this.gd.addNode(node);
			}

			for (let i = 0; i < this.graph.edges.length; i++) {
				let edge = this.graph.edges[i];
				edge.directed = false;
				if (this.config.edgeColor) {
					edge.strokeColor = this.config.edgeColor;
				}

				if (edge == undefined) {
					console.error("Edge in step is undefined, index: " + i);
					console.error(step);
				}

				this.gd.edges.push(edge);
			}
		}.bind(this);

		let parseDistance = function(step) {
			let currentNode = undefined;
			let node = undefined;
			for (let i = 0; i < this.gd.nodes.length; i++) {
				let n = this.gd.nodes[i];
				// step.current and step.node can either be the value (if they're
				// generated by the algorithm), or they can be the node object (if they're
				// generated by a human performing dijkstra)
				if (n.v == step.current.v
					|| n.v == step.current) currentNode = n;
				else if (n.v == step.node.v
					|| n.v == step.node) node = n;

				if (currentNode !== undefined && node !== undefined) break;
			}

			if (currentNode == undefined || node == undefined) {
				console.error("ParseDistance: node or currentNode is undefined!");
				if (currentNode == undefined) console.error("	currentNode is undefined");
				if (node == undefined) console.error("	node is undefined");
				console.error(step);
			}

			this.gd.edges.push({
				n1: currentNode,
				n2: node,
				v: undefined,
				directed: true
			});
		}.bind(this);

		let parsePath = function(step) {
			for (let i = 0; i < step.path.length - 1; i++) {
				let n1 = step.path[i].v;
				let n2 = step.path[i + 1].v;

				for (let j = 0; j < this.gd.edges.length; j++) {
					let edge = this.gd.edges[j];
					if (!edge.directed) continue;

					if (edge.n1.v == n1 && edge.n2.v == n2) {
						edge.strokeColor = this.config.startColor;
						break;
					}
				}
			}
		}.bind(this);

		for (let i = 0; i <= this.gd.currentStep; i++) {
			let step = this.steps[i];

			if (step.type == "Initial") {
				parseInitial(step);
			} else if (step.type == "Distance") {
				parseDistance(step);
			} else if (step.type == "Path") {
				parsePath(step);
			}
		}

		this.gd.dirty = true;
		this.gd.centerCameraOnGraph();
	}
}