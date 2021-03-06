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

		// If there are some starting steps, they are parsed
		// and put into the world.
		if (config.steps) {
			if (config.importType) this.importType = config.importType;
			else
				console.error(
					"Got configuration steps, but importType is undefined"
				);

			// If a tree is imported, it can either come from an algorithm,
			// which is an array of steps. Or it can come from an student which
			// means that it comes from this.exportAsTree()
			if (this.importType == "Tree") {
				if (
					config.steps.length == 1 &&
					config.steps[0].hasOwnProperty("roots")
				) {
					this.importSource = "Student";
				} else this.importSource = "Algorithm";
			}

			this.steps = config.steps;

			if (this.gd.operatingMode == "Presentation") {
				this.gd.currentStep = config.steps.length - 1;
				this.gd.addSteppingButtons();
				this.gd.drawStatic();
			}
			this.parseSteps();
		}

		if (config == undefined) this.subType == undefined;
		else {
			this.subType = config.subType;
			this.nextLetter = "A";

			this.startNodeColor = config.startNodeColor || "LightGreen";
			this.endNodeColor = config.endNodeColor || "LightCoral";

			if (this.subType == "Dijkstra") {
				this.nextNodeMarking = undefined;
				this.buttons.push(this.locale.buttons.Mark);
				this.stateHandlers[
					this.locale.buttons.Mark
				] = this.markNode.bind(this);
				this.drawStatic();
			}
		}
	}

	configure() {
		this._config(this.config);
	}

	constructor(graphDrawer, config) {
		this.gd = graphDrawer;
		this.locale = this.gd.locale.Graph0;
		// Current interaction state.
		this.currentState = this.locale.buttons.Add;

		// The buttons which the user may click on to select interaction state
		this.buttons = [
			this.locale.buttons.Add,
			this.locale.buttons.Remove,
			this.locale.buttons.Move,
			this.locale.buttons.Join,
			this.locale.buttons.Edit
		];

		// Every interaction state and event handler.
		this.stateHandlers = {};
		this.stateHandlers[this.locale.buttons.Add] = this.addNode;
		this.stateHandlers[this.locale.buttons.Remove] = this.removeNode;
		this.stateHandlers[this.locale.buttons.Move] = this.moveNode;
		this.stateHandlers[this.locale.buttons.Join] = this.joinNode;
		this.stateHandlers[this.locale.buttons.Edit] = this.editNode;

		// Binds the "this" context to the GraphDrawer object.
		for (let key in this.stateHandlers) {
			// Doesn't bind inherited properties.
			if (!this.stateHandlers.hasOwnProperty(key)) continue;
			this.stateHandlers[key] = this.stateHandlers[key].bind(this);
		}

		// Decides which of the trees is being displayed
		this.treeIndex = 0;
		// This contains the buttons to navigate between trees
		this.steppingButtons = [];

		this.config = config;
	}

	mouseDownHandler(e) {
		if (this.gd.operatingMode == "Presentation")
			return this.detectTreeSteppingInput(e);

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

		this.gd.addNode({
			x: p.x,
			y: p.y,
			shape: this.gd.nodeShape,
			w: this.gd.nodeShape == "Circle" ? this.gd.R : this.gd.R * 2,
			h: this.gd.nodeShape == "Circle" ? this.gd.R : this.gd.R * 2,
			v: v
		});

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
			if (this.gd.isPointInNode(p.x, p.y, this.gd.nodes[i])) {
				// Checks if the node is connected to anything with edges.
				for (let j = 0; j < this.gd.edges.length; j++) {
					// Removes the edges.
					if (
						this.gd.edges[j].n1 == this.gd.nodes[i] ||
						this.gd.edges[j].n2 == this.gd.nodes[i]
					) {
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

		if (this.nextNodeMarking !== undefined) {
			node.marked = "End";
			node.fillColor = this.endNodeColor;
			this.nextNodeMarking = undefined;
		} else if (node.marked == undefined) {
			node.marked = "Start";
			node.fillColor = this.startNodeColor;
			this.nextNodeMarking = true;
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
					let alreadyExist = false;
					for (let i = 0; i < this.gd.edges.length; i++) {
						let e = this.gd.edges[i];
						if (e.n1 == node && e.n2 == node2) {
							alreadyExist = true;
							break;
						}
					}

					if (!alreadyExist) {
						this.gd.edges.push({
							n1: node,
							n2: node2,
							v: 0
						});

						this.gd.dirty = true;
					}
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
			node.x = p.x - node.w / 2;
			node.y = p.y - node.h / 2;
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

	onCanvasResize() {
		if (this.gd.operatingMode == "Interactive") {
			this.drawStatic();
		} else {
			if (this.steppingButtons.length > 0) {
				this.addTreeSteppingButtons();
				this.gd.drawStatic();
			}
		}
	}

	/*
		Checks if the event (click) happened on one of the buttons.
	*/
	detectUIInput(e) {
		if (e.offsetY < this.gd.canvas.height * 0.9) return false;

		let buttonIndex = Math.floor(
			e.offsetX / (this.gd.canvas.width / this.buttons.length)
		);
		this.currentState = this.buttons[buttonIndex];
		this.drawStatic();
		this.gd.dirty = true;
		return true;
	}

	/*
		Checks if the event (click) happened inside one of the tree stepping buttons.
	*/
	detectTreeSteppingInput(e) {
		for (let i = 0; i < this.steppingButtons.length; i++) {
			let btn = this.steppingButtons[i];

			let inside = this.gd.isPointInRectangle(
				e.offsetX,
				e.offsetY,
				btn.position.x,
				btn.position.y,
				btn.position.width,
				btn.position.height
			);

			if (inside) {
				btn.handler();
				return true;
			}
		}

		return false;
	}

	/*
		Draws the tree stepping buttons
	*/
	drawTreeSteppingButtons() {
		// Draw tree stepping buttons if they exist
		if (this.steppingButtons.length > 0) {
			for (let i = 0; i < this.steppingButtons.length; i++) {
				this.gd.staticContext.beginPath();
				let btn = this.steppingButtons[i];
				this.gd.staticContext.fillStyle = "white";

				this.gd.staticContext.rect(
					btn.position.x,
					btn.position.y,
					btn.position.width,
					btn.position.height
				);
				this.gd.staticContext.fill();
				this.gd.staticContext.stroke();

				// Text
				this.gd.staticContext.fillStyle = "black";
				let textWidth = this.gd.staticContext.measureText(btn.data.text)
					.width;
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
	}

	/*
		Draws the UI to the staticBuffer.
	*/
	drawStatic() {
		this.gd.staticContext.clearRect(
			0,
			0,
			this.gd.staticBuffer.width,
			this.gd.staticBuffer.height
		);

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
			let textWidth = this.gd.staticContext.measureText(this.buttons[i])
				.width;
			this.gd.staticContext.fillText(
				this.buttons[i],
				i * buttonWidth - textWidth / 2 + buttonWidth / 2,
				this.gd.canvas.height -
					buttonHeight / 2 +
					this.gd.fontHeight / 2
			);
		}
		this.gd.staticContext.stroke();
		this.gd.staticContext.closePath();
	}

	addTreeSteppingButtons(treeCount) {
		// OnCanvasResize doesn't know how many trees there are in the
		// step, so the value has to be stored.
		if (treeCount !== undefined) this.prevTreeCount = treeCount;
		else treeCount = this.prevTreeCount;

		this.steppingButtons = [];
		let numOfSteps = treeCount;

		let stepBack = () => {
			if (this.treeIndex > 0) {
				this.treeIndex -= 1;
				this.parseSteps();
				this.gd.drawStatic();
			}
		};

		let stepForward = () => {
			if (this.treeIndex < numOfSteps - 1) {
				this.treeIndex += 1;
				this.parseSteps();
				this.gd.drawStatic();
			}
		};

		this.steppingButtons.push({
			data: {
				text: "<-- " + this.locale.buttons.Tree,
				relSize: this.gd.relSize
			},
			handler: stepBack
		});
		this.steppingButtons.push({
			data: {
				text: this.treeIndex + 1 + " / " + numOfSteps,
				relSize: this.gd.relSize
			},
			handler: () => {}
		});
		this.steppingButtons.push({
			data: {
				text: this.locale.buttons.Tree + " -->",
				relSize: this.gd.relSize
			},
			handler: stepForward
		});

		let numBtns = this.steppingButtons.length;
		// Every button get an equal amount of screen size
		let maxButtonWidth = this.gd.staticBuffer.width / numBtns;
		let maxButtonHeight = this.gd.staticBuffer.height / 10;
		for (let i = 0; i < numBtns; i++) {
			let btn = this.steppingButtons[i];
			//  Sets the button size to the allocated size * relative button size
			let btnWidth = maxButtonWidth * btn.data.relSize;
			let btnHeight = maxButtonHeight * btn.data.relSize;
			// Centers the button inside the allocated space
			let xPadding = (maxButtonWidth - btnWidth) / 2;
			let yPadding = (maxButtonHeight - btnHeight) / 2;

			btn.position = {
				x: i * maxButtonWidth + xPadding,
				y: this.gd.staticBuffer.height - 2 * maxButtonHeight + yPadding,
				width: btnWidth,
				height: btnHeight
			};
		}

		this.dirty = true;
	}

	parseSteps() {
		if (this.importType == "Graph") this._parseGraphSteps();
		else this._parseTreeSteps();
	}

	afterDrawStatic() {
		this.drawTreeSteppingButtons();
	}

	_parseTreeSteps() {
		// If treeInfo is missing, the exporttype was set to tree, but the
		// graph couldn't be exported as a tree, so it was exported as a graph instead.
		if (
			(this.importSource == "Student" &&
				this.steps[this.gd.currentStep].roots == undefined) ||
			(this.importSource == "Algorithm" &&
				this.steps[this.gd.currentStep].treeInfo == undefined)
		) {
			this._parseGraphSteps();
			return;
		}

		this.gd.nodes = [];
		this.gd.edges = [];
		this.gd.dirty = true;

		let getTree = (step) => {
			if (this.treeIndex >= step.treeInfo.length)
				return step.treeInfo[step.treeInfo.length - 1];
			else return step.treeInfo[this.treeIndex];
		};

		let fixTree = (tree) => {
			let root = {};
			root.value = tree.root.value;
			root.children = [];
			root.parent = undefined;

			let nodeParser = function(node, parent) {
				if (node === undefined || node === null) return undefined;
				node.parent = parent;
				node.visited = false;
				nodeParser(node.children[0], node);
				nodeParser(node.children[1], node);
			};

			nodeParser(tree.root.children[0], root);
			nodeParser(tree.root.children[1], root);
			root.children[0] = tree.root.children[0];
			root.children[1] = tree.root.children[1];
			tree.root = root;

			tree.nodes[0].parent = undefined;

			let fixNull = function(node) {
				if (node.children.length > 0) {
					for (let i = 0; i < node.children.length; i++)
						if (node.children[i] === null)
							node.children[i] = undefined;

					if (node.children[0] !== undefined)
						fixNull(node.children[0]);
					if (node.children[1] !== undefined)
						fixNull(node.children[1]);
				}
			};

			fixNull(tree.root);
		};

		// This assumes that the nodeshape is Circle
		let r = this.gd.R;

		let parseStep = (step) => {
			let tree = getTree(step);
			if (tree === undefined || tree.root === undefined) return;
			fixTree(tree);

			// If there are more than one tree, there should be
			// buttons to navigate between them.
			if (step.treeInfo.length > 1) {
				this.addTreeSteppingButtons(step.treeInfo.length);
				// The tree stepping buttons are drawn after the gd.drawStatic call.
				this.gd.drawStatic();
			} else this.steppingButtons = [];

			let p = this.gd.camera.project(this.gd.canvas.width / 2, 0);
			// Add some padding between canvas top and the top of the tree
			p.y += r * 2.5;

			/*
				Searches a tree with root node for the node with the lowest cost.
				The cost increases or decreases when accessing children based on the direction.
				If dir == 0, then we're looking at a tree where node is the left child.
				If dir == 1, then we're looking at a tree where node is the riht child.
				The node with the lowest cost is the one which is the closest to the x-position
				of the root node.
			*/
			let search = (node, cost, dir, depth) => {
				if (node == undefined) return undefined;

				let leftCost = cost;
				let rightCost = cost;
				if (dir == 0) {
					leftCost += 1;
					rightCost -= 1;
				} else if (dir == 1) {
					leftCost -= 1;
					rightCost += 1;
				}

				let l = search(node.children[0], leftCost, dir, depth + 1);
				let r = search(node.children[1], rightCost, dir, depth + 1);

				if (l == undefined && r == undefined) {
					return { node: node, cost: cost, depth: depth };
				} else if (l && r == undefined) {
					if (cost < l.cost)
						return { node: node, cost: cost, depth: depth };
					else return l;
				} else if (r && l == undefined) {
					if (cost < r.cost)
						return { node: node, cost: cost, depth: depth };
					else return r;
				}

				if (l.cost < r.cost) return l;
				else return r;
			};

			let xPadding = this.gd.R * 2.5;
			let yPadding = this.gd.R * 2.5;

			let addGraphDrawerNode = (node, x, y, dir) => {
				if (node == undefined) return;
				if (node.parent == undefined) return;
				if (node.visited) return;
				node.visited = true;

				let tx = p.x;
				if (dir == 0) tx -= x * xPadding;
				else if (dir == 1) tx += x * xPadding;

				this.gd.addNode({
					x: tx,
					y: p.y + y * yPadding,
					w: r,
					h: r,
					v: node.value,
					shape: this.gd.nodeShape
				});

				let left = dir == 0 ? x + 1 : x - 1;
				let right = dir == 0 ? x - 1 : x + 1;

				// Add child nodes
				addGraphDrawerNode(node.children[0], left, y + 1, dir);
				addGraphDrawerNode(node.children[1], right, y + 1, dir);
				// Add parent node
				let parentDir = 0;
				if (node.parent.children[0] == node) parentDir = right;
				else if (node.parent.children[1] == node) parentDir = left;
				addGraphDrawerNode(node.parent, parentDir, y - 1, dir);
			};

			// Find the node furthest to the right on the left side of the tree
			let left = tree.root.children[0];
			let rightest = search(left, 0, 0, 1);
			if (rightest)
				addGraphDrawerNode(rightest.node, 1, rightest.depth, 0);

			// Find the node furthest to the left on the right side of the tree
			let right = tree.root.children[1];
			let leftest = search(right, 0, 1, 1);
			if (leftest) addGraphDrawerNode(leftest.node, 1, leftest.depth, 1);

			// Add root node
			let root = tree.root;
			this.gd.addNode({
				x: p.x,
				y: p.y,
				w: r,
				h: r,
				shape: this.gd.nodeShape,
				v: root.value
			});

			// Create edges between the nodes
			let createEdges = (node) => {
				if (node == undefined) return;
				for (let i = 0; i < 2; i++) {
					if (node.children[i] !== undefined) {
						this.gd.edges.push({
							n1: this.gd.getNodeByValue(node.value),
							n2: this.gd.getNodeByValue(node.children[i].value)
						});
						createEdges(node.children[i]);
					}
				}
			};
			createEdges(root);
		};

		let parseStudentStep = (step) => {
			// Every node is responsible for adding itself and its children.
			let addStudentNode = (node) => {
				if (node == undefined || node == null) return;

				// Create and get the node
				let id = node.id;
				let n = this.gd.getNode(id);
				if (n == undefined) n = this.gd.addNode(node);
				node.id = n;

				// Create and get all the children.
				// Edges are also created.
				for (let i = 0; i < node.children.length; i++) {
					let c = node.children[i];
					if (c == undefined || c == null) continue;

					let cNode = this.gd.getNode(c.id);
					if (cNode == undefined) cNode = this.gd.addNode(c);
					c.id = cNode.id;

					this.gd.edges.push({
						n1: n,
						n2: cNode
					});

					addStudentNode(c);
				}
			};

			for (let i = 0; i < step.roots.length; i++) {
				let root = step.roots[i];
				addStudentNode(root);
			}

			this.gd.centerCameraOnGraph();
		};

		let step = this.steps[this.gd.currentStep];
		if (this.importSource == "Algorithm") parseStep(step);
		else if (this.importSource == "Student") parseStudentStep(step);
	}

	_parseGraphSteps() {
		this.gd.nodes = [];
		this.gd.edges = [];
		this.gd.dirty = true;

		let parseComplete = (step) => {
			for (let i = 0; i < step.nodes.length; i++) {
				let n = step.nodes[i];
				this.gd.addNode({
					id: n.id,
					x: n.x,
					y: n.y,
					v: n.v,
					w: n.w,
					h: n.h,
					shape: n.shape == undefined ? this.gd.nodeShape : n.shape,
					marked: n.marked,
					fillColor: n.fillColor
				});
			}

			for (let i = 0; i < step.edges.length; i++) {
				let e = step.edges[i];
				let n1 = undefined;
				let n2 = undefined;

				for (let j = 0; j < this.gd.nodes.length; j++) {
					let n = this.gd.nodes[j];
					if (n.id == e.n1.id) n1 = n;
					else if (n.id == e.n2.id) n2 = n;

					if (n1 && n2) break;
				}

				if (n1 && n2) {
					this.gd.edges.push({
						n1: n1,
						n2: n2
					});
				} else {
					console.error("Found edge with non-existing node");
					console.error(e);
				}
			}
		};

		for (let i = 0; i <= this.gd.currentStep; i++) {
			let step = this.steps[i];

			if (step.type == "Complete") {
				parseComplete(step);
			} else {
				console.error(`Found invalid step type: ${step.type} 
					at index ${i}, skipping.`);
				console.error(step);
			}
		}

		this.gd.centerCameraOnGraph();
	}

	export() {
		if (this.exportType == "Graph") return this.exportAsGraph();
		if (this.exportType == "Tree") return this.exportAsTree();
		if (this.exportType == "Both") {
			return {
				graph: this.exportAsGraph(),
				tree: this.exportAsTree()
			};
		}
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

		// Fix left/right children
		let fixer = (node) => {
			if (node.children.length == 0) return;
			if (node.children[0] != undefined) fixer(node.children[0]);
			if (node.children[1] != undefined) fixer(node.children[1]);

			let sorter = function(a, b) {
				if (a.x < b.x) return -1;
				if (a.x > b.x) return 1;
				return 0;
			};

			node.children.sort(sorter);

			// If there is just one children, then it might be a right child
			if (node.children.length == 1) {
				let child = node.children[0];
				if (child.x > node.x) node.children = [undefined, child];
			}
		};

		for (let r = 0; r < tree.roots.length; r++) {
			fixer(tree.roots[r]);
		}

		// If there are no roots, the algorithm wasn't able to parse
		// the current graph as a tree. It is exported as a graph instead.
		if (tree.roots.length == 0) {
			// Before we can export it as a graph, it needs to have its children
			// removed, because they may contain circular references, which
			// leads to a never ending recursion when it's sent by socket.io
			for (let i = 0; i < this.gd.nodes.length; i++) {
				let node = this.gd.nodes[i];
				delete node.children;
			}

			return Object.assign({ type: "Complete" }, this.exportAsGraph());
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
