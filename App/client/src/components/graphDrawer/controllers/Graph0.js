/*
	Let's the user create and modify graphs.
	The user interaction state is decided by clicking on
	one of five buttons.
*/
export default class Graph0 {
	_config(config) {
		// Decides what kind of data should be returned when exporting.
		// Values: Graph or Tree.
		if (config == undefined) this.exportType = "Graph";
		else this.exportType = config.exportType;

		if (config == undefined) this.subType == undefined;
		else {
			this.subType = config.subType;
			this.nextLetter = "A";

			this.startNodeColor = config.startNodeColor || "LightGreen";
			this.endNodeColor = config.endNodeColor || "LightCoral";

			if (this.subType == "Dijkstra") {
				this.buttons.push("Mark");
				this.stateHandlers.Mark = this.markNode.bind(this);
				this.drawStatic();
			}
		}

		if (config.steps) {
			this.steps = config.steps;
			if (this.gd.operatingMode == "Presentation") {
				this.gd.addSteppingButtons();
				this.gd.drawStatic();
				this.gd.currentStep = config.steps.length - 1;
			}
			this.parseSteps();
		}
	}

	configure() {
		this._config(this.config);
	}

	constructor(graphDrawer, config) {
		this.gd = graphDrawer;

		// Current interaction state.
		this.currentState = "Add";

		// The buttons which the user may click on to select interaction state
		this.buttons = ["Add", "Remove", "Move", "Join", "Edit"];

		// Every interaction state and event handler.
		this.stateHandlers = {
			Add: this.addNode,
			Remove: this.removeNode,
			Join: this.joinNode,
			Move: this.moveNode,
			Edit: this.editNode,
		}

		// Binds the "this" context to the GraphDrawer object.
		for (let key in this.stateHandlers) {
			// Doesn't bind inherited properties.
			if (!this.stateHandlers.hasOwnProperty(key)) continue;
			this.stateHandlers[key] = this.stateHandlers[key].bind(this);
		}

		this.config = config;
	}

	mouseDownHandler(e) {
		// UI
		let consumed = this.detectUIInput(e);
		if (consumed) return consumed;

		// Event handler for the current state
		consumed = this.stateHandlers[this.currentState](e);
		return consumed;
	}

	/*
		Creates a node and adds it to the nodes list.
	*/
	addNode(e) {
		let p = this.gd.camera.project(e.offsetX, e.offsetY);

		let v = 0;
		if (this.subType == "Dijkstra") {
			v = this.nextLetter;
			this._incrementNextLetter();
		}

		let node = {
			x: p.x,
			y: p.y,
			r: this.gd.nodeShape == "Circle" ? this.gd.R : this.gd.R * this.gd.SQUARE_FACTOR,
			v: v
		}

		//this._editNode(node);

		this.gd.nodes.push(node)
		this.gd.dirty = true;
		return true;
	}

	/*
		Removes the clicked node.
	*/
	removeNode(e) {
		let p = this.gd.camera.project(e.offsetX, e.offsetY);

		// Searches for the clicked node.
		for (let i = 0; i < this.gd.nodes.length; i++) {
			if (this.gd.isPointInNode(p.x, p.y, this.gd.nodes[i].x, this.gd.nodes[i].y)) {
				// Checks if the node is connected to anything with edges.
				for (let j = 0; j < this.gd.edges.length; j++) {
					// Removes the edges.
					if (this.gd.edges[j].n1 == this.gd.nodes[i] 
						|| this.gd.edges[j].n2 == this.gd.nodes[i]) {
							this.gd.edges.splice(j, 1);
						j--;
					}
				}

				this.gd.nodes.splice(i, 1);
				this.gd.dirty = true;
				return true;
			}
		}

		// If no node was clicked, check if the cursor is close
		// to an edge
		let pickThreshold = 8;
		for (let e = 0; e < this.gd.edges.length; e++) {
			let d = this.gd.distanceFromEdgeToPoint(this.gd.edges[e], p.x, p.y);
			if (d < pickThreshold) {
				this.gd.edges.splice(e, 1);
				this.gd.dirty = true;
				return true;
			}
		}

		return false;
	}

	/*
		Marks a node as start or end, used by the dijkstra subtype.
	*/
	markNode(e) {
		e.preventDefault();
		let node = this.gd.getNodeAtCursor(e).node;
		if (node == undefined) return false;

		if (node.marked == undefined) {
			node.marked = "Start";
			node.fillColor = this.startNodeColor;
		} else if (node.marked == "Start") {
			node.marked = "End";
			node.fillColor = this.endNodeColor;
		} else if (node.marked == "End") {
			node.marked = undefined;
			node.fillColor = undefined;
		}

		this.gd.dirty = true;
		return true;
	}

	/*
		Creates an edge between two nodes.
	*/
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
						v: 0
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

	/*
		Lets the user drag a node around.
	*/
	moveNode(e) {
		e.preventDefault();
		let node = this.gd.getNodeAtCursor(e).node;
		if (node == undefined) return false;

		let moveHandler = function(newE) {
			if (node == undefined) return;

			newE.preventDefault();
			this.gd.setEventOffset(newE);
			let p = this.gd.camera.project(newE.offsetX, newE.offsetY);
			node.x = p.x;
			node.y = p.y;
			this.gd.dirty = true;
		}.bind(this);

		let upHandler = function(newE) {
			newE.preventDefault();
			this.gd.setEventOffset(newE);
			node = undefined;
			this.gd.canvas.removeEventListener("mousemove", moveHandler);
			this.gd.canvas.removeEventListener("mouseup", upHandler);
			this.gd.canvas.removeEventListener("touchmove", moveHandler);
			this.gd.canvas.removeEventListener("touchend", upHandler);
			this.gd.canvas.removeEventListener("touchcancel", upHandler);
		}.bind(this);

		this.gd.canvas.addEventListener("mousemove", moveHandler);
		this.gd.canvas.addEventListener("mouseup", upHandler);
		this.gd.canvas.addEventListener("touchmove", moveHandler);
		this.gd.canvas.addEventListener("touchend", upHandler);
		this.gd.canvas.addEventListener("touchcancel", upHandler);
		return true;
	}

	/*
		Lets the user edit the value on a clicked node.
	*/  
	editNode(e) {
		let node = this.gd.getNodeAtCursor(e).node;
		if (node !== undefined) {
			this.gd._editNode(node);
			return true;
		}

		// Check if the user is clicking on an edge
		let pickThreshold = 8;
		let p = this.gd.camera.project(e.offsetX, e.offsetY);
		for (let e = 0; e < this.gd.edges.length; e++) {
			let d = this.gd.distanceFromEdgeToPoint(this.gd.edges[e], p.x, p.y);
			if (d < pickThreshold) {
				this.gd._editNode(this.gd.edges[e]);
				return true;
			}
		}

		return false;
	}


	/*
		Checks if the event (click) happened on one of the buttons.
	*/
	detectUIInput(e) {
		if (e.offsetY < this.gd.canvas.height * 0.9) return false;

		let buttonIndex = Math.floor(e.offsetX / (this.gd.canvas.width / this.buttons.length));
		this.currentState = this.buttons[buttonIndex];
		this.drawStatic();
		this.gd.dirty = true;
		return true;
	}

	  /*
		Draws the UI to the staticBuffer.
	*/
	drawStatic() {
		this.gd.staticContext.clearRect(0, 0, 
			this.gd.staticBuffer.width, this.gd.staticBuffer.height);

		let buttonWidth = this.gd.staticBuffer.width / this.buttons.length;
		let buttonHeight = this.gd.staticBuffer.height / 10;

		this.gd.staticContext.beginPath();
		for (let i = 0; i < this.buttons.length; i++) {
			this.gd.staticContext.fillStyle = "white";
			if (this.currentState == this.buttons[i]) {
				this.gd.staticContext.fillStyle = "lavender";
			}

			this.gd.staticContext.fillRect(
				i * buttonWidth,
				this.gd.staticBuffer.height - buttonHeight,
				buttonWidth,
				buttonHeight
			);
			this.gd.staticContext.rect(
				i * buttonWidth,
				this.gd.staticBuffer.height - buttonHeight,
				buttonWidth,
				buttonHeight
			);
			this.gd.staticContext.fillStyle = "black";
			let textWidth = this.gd.staticContext.measureText(this.buttons[i]).width;
			this.gd.staticContext.fillText(
				this.buttons[i],
				i * buttonWidth - (textWidth / 2) + buttonWidth / 2,
				this.gd.canvas.height - buttonHeight / 2 + (this.gd.fontHeight / 2));
		}
		this.gd.staticContext.stroke();
		this.gd.staticContext.closePath();
	}

	parseSteps() {
		this.gd.nodes = [];
		this.gd.edges = [];
		this.gd.dirty = true;

		let parseComplete = (step) => {
			for (let i = 0; i < step.nodes.length; i++) {
				let n = step.nodes[i];
				this.gd.nodes.push({
					x: n.x,
					y: n.y,
					v: n.v,
					r: n.r
				});
			}

			for (let i = 0; i < step.edges.length; i++) {
				let e = step.edges[i];
				let n1 = undefined;
				let n2 = undefined;

				for (let j = 0; j < this.gd.nodes.length; j++) {
					let n = this.gd.nodes[j];
					if (n.v == e.n1) n1 = n;
					else if (n.v == e.n2) n2 = n;

					if (n1 && n2) break;
				}

				if (n1 && n2) {
					this.gd.edges.push({
						n1: n1,
						n2: n2
					});
				} else {
					console.error(`Found edge with non-existing node: ${e}`);
				}
			}
		}

		for (let i = 0; i <= this.gd.currentStep; i++) {
			let step = this.steps[i];

			if (step.type == "Complete") {
				parseComplete(step);
			} else {
				console.error(`Found invalid step type: ${step.type} 
					at index ${i}, skipping.`);
			}
		}

		this.gd.centerCameraOnGrpah();
	}

	export() {
		if (this.exportType == "Graph") return this.exportAsGraph();
		if (this.exportType == "Tree") return this.exportAsTree();
	}

	exportAsGraph() {
		let graph = {};
		graph.nodes = this.gd.nodes;
		graph.edges = this.gd.edges;
		graph.directed = this.gd.directedEdges;
		return graph;
	}

	exportAsTree() {
		// Normally a tree would only have one root.
		// Since the user might create a graph with two or more
		// roots, the datastructure needs to be able to store them.
		let tree = {
			roots: []
		};

		// Parse nodes to generate tree.
		for (let i = 0; i < this.gd.nodes.length; i++) {
			let node = this.gd.nodes[i];
			node.children = [];

			let isRoot = true;
			for (let j = 0; j < this.gd.edges.length; j++) {
				let edge = this.gd.edges[j];

				// A node which is being linked to, is a child node.
				if (node == edge.n2) isRoot = false;
				// A node linking to another node, has a child node.
				if (node == edge.n1) {
					node.children.push(edge.n2);
				}
			}

			if (isRoot) tree.roots.push(node);
		}

		return tree;
	}

	_incrementNextLetter() {
		let nextChar = (c) => {
			if (c.charCodeAt(0) >= 90) return "A";
			else return String.fromCharCode(c.charCodeAt(0) + 1);
		};

		for (let i = this.nextLetter.length - 1; i > -1; i--) {
			let n = nextChar(this.nextLetter[i]);
			this.nextLetter =
				this.nextLetter.slice(0, i) + n + this.nextLetter.slice(i + 1);

			if (n !== "A") return;

			if (i == 0) {
				this.nextLetter = "A" + this.nextLetter;
				return;
			}
		}
	}
}
