/*
	Let's the user create and modify graphs.
	The user interaction state is decided by clicking on
	one of five buttons.
*/
export default class Graph0 {
	_config(config) {
		// Decides what kind of data should be returned when exporting.
		// Values: Graph or Tree.
		this.exportType = config.exportType;
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
			Edit: this.editNode
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

		let node = {
			x: p.x,
			y: p.y,
			r: this.gd.nodeShape == "Circle" ? this.gd.R : this.gd.R * this.gd.SQUARE_FACTOR,
			v: 0
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
		Creates an edge between two nodes.
	*/
	joinNode(e) {
		let node = this.gd.getNodeAtCursor(e).node;
		if (node == undefined) return false;

		let handler = function(newE) {
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
		}.bind(this);
		this.gd.canvas.addEventListener("mouseup", handler);
		this.gd.canvas.addEventListener("touchend", handler);
		return true;
	}

	/*
		Lets the user drag a node around.
	*/
	moveNode(e) {
		let node = this.gd.getNodeAtCursor(e).node;
		if (node == undefined) return false;

		let moveHandler = function(newE) {
			let p = this.gd.camera.project(newE.offsetX, newE.offsetY);
			node.x = p.x;
			node.y = p.y;
			this.gd.dirty = true;
		}.bind(this);

		let upHandler = function() {
			this.gd.canvas.removeEventListener("mousemove", moveHandler);
			this.gd.canvas.removeEventListener("mouseup", upHandler);
			this.gd.canvas.removeEventListener("touchmove", moveHandler);
			this.gd.canvas.removeEventListener("touchend", upHandler);
		}.bind(this);

		this.gd.canvas.addEventListener("mousemove", moveHandler);
		this.gd.canvas.addEventListener("mouseup", upHandler);
		this.gd.canvas.addEventListener("touchmove", moveHandler);
		this.gd.canvas.addEventListener("touchend", upHandler);
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
}