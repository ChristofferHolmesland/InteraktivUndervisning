/*
	Let's the user perform a quicksort or mergesort on an array.
*/
export default class Sort {
	_config(config) {
		// Quicksort or mergesort
		this.sortType = config.sortType || "Quicksort";
		// Button size factor, button size relative to node size.
		this.bsf = config.bsf || 3;
		// Pivot nodes will have their fill color set to this
		this.pivotColor = config.pivotColor || "#add8e6";
		// Selected nodes will have their stroke color set to this
		this.selectedColor = config.selectedColor || "red";
		// Determines if extracted arrays should be sorted or not
		// when they are placed. Sorted: "vSorter", not sorted: "xSorter".
		this.extractType = config.extractType || "xSorter";
		this.joinType = config.joinType || "vSorter";

		// If there are some starting steps, they are parsed
		// and put into the world.
		if (config.steps) {
			this.steps = config.steps;
			if (this.gd.operatingMode == "Presentation") {
				this.gd.currentStep = config.steps.length - 1;
				this.gd.addSteppingButtons();
				this.gd.drawStatic();
			}
			this.parseSteps();
		}
	}

	configure() {
		this._config(this.config);
	}

	constructor(graphDrawer, config) {
		this.gd = graphDrawer;
		
		this.locale = this.gd.locale.Sort;

		/*
			All the arrays stored as a object
			{
				position: { x, y },
				nodes: [],
				links: []
			}
		*/
		this.arrays = [];
		/*
			Buttons stored as a object
			{
				position: { x, y, width, height },
				handler: Function
				data: {} contains extra information
			}

			data: {
				side: "", left or right
				ai: array index
				ni: node index
			}

			NOTE: Not safe to store references to the list
		*/
		this.buttons = [];

		// Used by desktop users to render buttons on the hovered node
		this.lastHoveredNode = undefined;
		// Same format as this.buttons
		this.hoverButtons = [];

		// The nodes currently selected by the user, used to create new arrays
		this.selectedNodes = [];

		// Used by mobile users to display buttons to interact with the selected node
		this.clickedNode = undefined;
		/*
			The buttons which are displayed to a mobile user when a 
			node is selected. The position is calculated automatically.
			data.relSize is how much of the allocated space the button should use.
			{
				handler: Function,
				data: {
					text: "",
					relSize: 0-1
				},
			}
		*/
		this.clickedButtons = [];

		// Index of the array being moved (-1 means no array)
		this.movingArray = -1;
		// Used to calculate how far the mouse moved between clicks
		// so the array position can be translated the same amount
		this.startPositionOfMove = { x: -1, y: 1 };

		this.config = config;
	}

	/*
		Called by the GraphDrawer when the user presses one of their mouse
		buttons.
	*/
	mouseDownHandler(e) {
		if (this.gd.operatingMode == "Interactive") {
			// If there are no arrays, the first click creates the first node.
			if (this.arrays.length == 0) {
				this.gd.controllers["Graph0"].addNode(e);
				let node = this.gd.nodes[this.gd.nodes.length - 1];
				this.arrays.push({
					position: { x: node.x, y: node.y },
					nodes: [node],
					links: []
				});
				return true;
			}

			if (this.checkUI(e)) return true;

			// If an array is being moved, it has higher priority than
			// selecting a new node/array
			if (this.movingArray > -1) {
				let p = this.gd.camera.project(e.offsetX, e.offsetY);
				let dx = p.x - this.startPositionOfMove.x;
				let dy = p.y - this.startPositionOfMove.y;

				this.arrays[this.movingArray].position.x += dx;
				this.arrays[this.movingArray].position.y += dy;
				this._repositionNodes(this.movingArray);
				this.movingArray = -1;
				this.gd.dirty = true;

				return true;
			}

			if (this.checkNodes(e)) return true;

			return false;
		} else if (this.gd.operatingMode == "Presentation") {
			return this.checkUI(e);
		}

		return false;
	}

	checkNodes(e) {
		// These need to be defined inside this function, so .bind(this) can be used
		let checkNodesMouseUp = function(newE) {
			newE.preventDefault();
			this.gd.setEventOffset(newE);
			this.gd.canvas.removeEventListener("mouseup", checkNodesMouseUp);
			this.gd.canvas.removeEventListener("mousemove", checkNodesMouseMove);
			this.gd.canvas.removeEventListener("touchend", checkNodesMouseUp);
			this.gd.canvas.removeEventListener("touchcancel", checkNodesMouseUp);
			this.gd.canvas.removeEventListener("touchmove", checkNodesMouseMove);

			// If there is just one selected node,
			// it's value can be edited, it can be removed
			// Display buttons to mobile users when they click on a node
			let relSize = 0.9;
			let node = this.gd.getNodeAtCursor(newE).node;
			if (this.gd.DEVICE == "Mobile") {
				// Displays buttons for the clicked node
				this.clickedNode = node;
				if (this.clickedNode == undefined) return;
				// Edit value
				this.clickedButtons.push({
					data: {
						text:  this.locale.buttons.editValue,
						relSize: relSize
					},
					handler: e =>  this.mobileSelectedButtons().edit(e)
				});
				// Set pivot
				if (this.sortType == "Quicksort") {
					this.clickedButtons.push({
						data: {
							text: this.locale.buttons.setPivot,
							relSize: relSize
						},
						handler: e => this.mobileSelectedButtons().pivot(e)
					});
				}
				// Delete
				this.clickedButtons.push({
					data: {
						text: this.locale.buttons.delete,
						relSize: relSize
					},
					handler: e => this.mobileSelectedButtons().del(e)
				});
			}

			// If all of the selected nodes are in the same array
			// they can be extracted as a new array, or moved.
			// If they're not in the same array, they can be joined.
			let extract = true;
			let ai = this._findArrayPosition(this.selectedNodes[0]).ai;
			for (let i = 1; i < this.selectedNodes.length; i++) {
				if (ai != this._findArrayPosition(this.selectedNodes[i]).ai) {
					extract = false;
					break;
				}
			}

			if (extract) {
				this.clickedButtons.push({
					data: {
						text: this.locale.buttons.moveArray,
						relSize: relSize,
					},
					handler: e =>  this.mobileSelectedButtons().move(e, ai)
				});

				this.clickedButtons.push({
					data: {
						text: this.locale.buttons.extractArray,
						relSize: relSize,
					},
					handler: e =>  this.mobileSelectedButtons().extract(e, ai)
				});
			} else {
				if (this.sortType == "Mergesort") {
					this.clickedButtons.push({
						data: {
							text: this.locale.buttons.joinToArray,
							relSize: relSize,
						},
						handler: e => this.mobileSelectedButtons().join(e)
					});
				}
			}
			this._calculatePositionForClickedButtons();
			this.gd.dirty = true;
		}.bind(this);

		let checkNodesMouseMove = function(newE) {
			newE.preventDefault();
			this.gd.setEventOffset(newE);
			let nodeAtCursor = this.gd.getNodeAtCursor(newE).node;
			// Checks if no node is under the cursor, or it's already in the list
			if (nodeAtCursor == undefined || this.selectedNodes.indexOf(nodeAtCursor) != -1)
				return;

			this.gd.dirty = true;
			nodeAtCursor.strokeColor = this.selectedColor;
			this.selectedNodes.push(nodeAtCursor);
		}.bind(this);

		// Removes the selected stroke color from the previous selected nodes
		for (let i = 0; i < this.selectedNodes.length; i++)
			this.selectedNodes[i].strokeColor = undefined;
		this.selectedNodes = [];

		let node = this.gd.getNodeAtCursor(e).node;
		this.gd.dirty = true;

		// Clear selected and clicked
		this.clickedButtons = [];
		// Checks if the same node was clicked again
		if (node == this.clickedNode) {
			if (node != undefined)
				node.strokeColor = undefined;
			this.clickedNode = undefined;
			return;
		}

		// Resets the old clicked node
		if (this.clickedNode != undefined)
			this.clickedNode.strokeColor = undefined;
		if (node != undefined)
			node.strokeColor = this.selectedColor;

		// Sets the clicked node to a new value
		// All checks should happen before this if they depend
		// on the old clickedNode
		this.clickedNode = node;

		// Lets the user select multiple nodes
		if (node != undefined) {
			this.selectedNodes.push(node);
			this.gd.canvas.addEventListener("mousemove", checkNodesMouseMove);
			this.gd.canvas.addEventListener("mouseup", checkNodesMouseUp);
			this.gd.canvas.addEventListener("touchmove", checkNodesMouseMove);
			this.gd.canvas.addEventListener("touchend", checkNodesMouseUp);
			this.gd.canvas.addEventListener("touchcancel", checkNodesMouseUp);
		} else {
			// Click event is not consumed if no node was clicked on
			return false;
		}

		// Desktop users can click on a node to enter the value
		if (this.gd.DEVICE == "Desktop") {
			this.gd._editNode(node);
			return true;
		}

		return true;
	}

	_calculatePositionForClickedButtons() {
		let numBtns = this.clickedButtons.length;
		// Every button get an equal amount of screen size
		let maxButtonWidth = this.gd.staticBuffer.width / numBtns;
		let maxButtonHeight = this.gd.staticBuffer.height / 10;
		for (let i = 0; i < numBtns; i++) {
			let btn = this.clickedButtons[i];
			//  Sets the button size to the allocated size * relative button size
			let btnWidth = maxButtonWidth * btn.data.relSize;
			let btnHeight = maxButtonHeight * btn.data.relSize;
			// Centers the button inside the allocated space
			let xPadding = (maxButtonWidth - btnWidth) / 2;
			let yPadding = (maxButtonHeight - btnHeight) / 2;
			
			btn.position = {
				x: i * maxButtonWidth + xPadding,
				y: this.gd.staticBuffer.height - maxButtonHeight + yPadding,
				width: btnWidth,
				height: btnHeight
			};
		}
	}

	// Creates a new array object at the (x, y) position.
	getNewArray(x, y) {
		let newArr = {};
		newArr.nodes = [];
		newArr.links = [];
		newArr.position = {
			x: x,
			y: y
		}
		return newArr;
	}

	mobileSelectedButtons() {
		let initializeNewArray = function(sortType) {
			let sorter =
				sortType == "xSorter" ? this.gd.xSorter : this.gd.vSorter;
			this.selectedNodes.sort(sorter);

			let newArr = this.getNewArray(
				this.selectedNodes[0].x,
				this.selectedNodes[0].y + 100
			);

			// Clones the selected nodes and puts them in the new array
			for (let i = 0; i < this.selectedNodes.length; i++) {
				let clone = JSON.parse(JSON.stringify(this.selectedNodes[i]));
				clone.fillColor = undefined;
				clone.strokeColor = undefined;

				newArr.nodes.push(clone);
				this.gd.addNode(clone, true);
			}

			this.arrays.push(newArr);
			return newArr;
		}.bind(this);

		let cleanupNewArray = function() {
			this._repositionNodes(this.arrays.length - 1);

			// Reset selected nodes
			for (let i = 0; i < this.selectedNodes.length; i++)
				this.selectedNodes[i].strokeColor = undefined;

			this.selectedNodes = [];
			this.clickedNode = undefined;
			this.clickedButtons = [];
			this.gd.dirty = true;
		}.bind(this);

		return {
			move: function() {
				let info = this._findArrayPosition(this.selectedNodes[0]);
				this.movingArray = info.ai;
				this.startPositionOfMove.x = this.selectedNodes[0].x;
				this.startPositionOfMove.y = this.selectedNodes[0].y;
			}.bind(this),
			join: function() {
				let newArr = initializeNewArray(this.joinType);

				let ais = [];
				// Link all the arrays containing a selected node to 
				// the new array
				for (let i = 0; i < this.selectedNodes.length; i++) {
					let ai = this._findArrayPosition(this.selectedNodes[i]).ai;
					ais.push(ai);
					this.arrays[ai].links.push(newArr);
				}

				// Center the x-coordinate of the new array to the center
				// of the original arrays
				let xSum = 0;
				for (let i = 0; i < ais.length; i++) {
					xSum += this.arrays[ais[i]].position.x;
				}
				newArr.position.x = xSum / ais.length;

				cleanupNewArray();
			}.bind(this),
			extract: function(e, ai) {
				let newArr = initializeNewArray(this.extractType);
				this.arrays[ai].links.push(newArr);
				cleanupNewArray();
			}.bind(this),
			edit: function() {
				this.gd._editNode(this.clickedNode);
			}.bind(this),
			pivot: function() {
				if (this.clickedNode.pivot) {
					this.clickedNode.pivot = undefined;
					this.clickedNode.fillColor = undefined;
				} else {
					this.clickedNode.pivot = true;
					this.clickedNode.fillColor = this.pivotColor;
				}
				this.gd.dirty = true;
			}.bind(this),
			del: function() {
				let ai = -1;
				let arrayRemoved = false;
				// Remove node from array
				for (let i = 0; i < this.arrays.length; i++) {
					let index = this.arrays[i].nodes.indexOf(this.clickedNode);
					if (index > -1) {
						ai = i;
						this.arrays[i].nodes.splice(index, 1);
						// If there are no more nodes in a array, it's removed
						if (this.arrays[i].nodes.length == 0) {
							this.arrays.splice(i, 1);
							i--;
							arrayRemoved = true;
						}
						break
					}
				}

				// Remove node from GraphDrawer
				this.gd.nodes.splice(this.gd.nodes.indexOf(this.clickedNode), 1);
				
				// If the array wasn't removed, the nodes need to be moved to
				// fill the open space left after the node was removed
				if (!arrayRemoved) {
					this._repositionNodes(ai);
				} else {
					// If the array was removed, edges need to be recalculated
					// because the removed array might have a link to/from it.
					this._recalculateEdges();
				}
				
				this.gd.dirty = true;
				this.clickedNode = undefined;
				this.clickedButtons = [];
			}.bind(this)
		}
	}

	checkUI(e) {
		// Checks the + buttons between nodes
		for (let i = 0; i < this.buttons.length; i++) {
			let btn = this.buttons[i];
			if (this.gd.isPointInRectangle(e.offsetX, e.offsetY, btn.position.x, btn.position.y, 
				btn.position.width, btn.position.height)) {
				btn.handler(btn);
				return true;
			}
		}

		// Checks the selectedButtons
		if (this.gd.DEVICE == "Mobile") {
			for (let i = 0; i < this.clickedButtons.length; i++) {
				let btn = this.clickedButtons[i];
				if (this.gd.isPointInRectangle(e.offsetX, e.offsetY, btn.position.x,
					btn.position.y, btn.position.width, btn.position.height)) {
					btn.handler(e);
					return true;
				}
			}
		}

		return false;
	}

	/*
		The dirtyUpdate function is called from the GraphDrawer's update function
		if the GraphDrawer is in the dirty state. This is called before the 
		drawing happens.
	*/
	dirtyUpdate() {
		this.buttons = [];
		this.drawUI();
	}

	addNewNodeToArray(event) {
		let clickedNode = this.arrays[event.data.ai].nodes[event.data.ni];
		let node = {
			x: clickedNode.x + (event.data.side == "left" ? -clickedNode.w : clickedNode.w),
			y: clickedNode.y,
			w: clickedNode.w,
			h: clickedNode.h,
			v: 0,
			shape: clickedNode.shape
		};

		this.arrays[event.data.ai].nodes.splice(
			event.data.ni + (event.data.side == "left" ? 0 : 1),
			0,
			node
		);

		// Recalculate node position inside the array
		if (event.data.side == "left") 
			this.arrays[event.data.ai].position.x -= clickedNode.w;
		this._repositionNodes(event.data.ai);

		this.gd.addNode(node, true);
		this.gd.dirty = true;
	}

	/*
		Calculate node positions based on their position in a given array
	*/
	_repositionNodes(ai) {
		let start = this.arrays[ai].position;
		for (let ni = 0; ni < this.arrays[ai].nodes.length; ni++) {
			let node = this.arrays[ai].nodes[ni];
			// Assumes all the nodes have the same width TODO: This assumption is no longer true
			node.x = start.x + ni * node.w;
			node.y = start.y;
		}

		this._recalculateEdges();
	}

	/*
		Creates GraphDrawer edges based on links between arrays.
	*/
	_recalculateEdges() {
		this.gd.edges = [];
		this.gd.dirty = true;

		for (let ai = 0; ai < this.arrays.length; ai++) {
			for (let li = 0; li < this.arrays[ai].links.length; li++) {
				let link = this.arrays[ai].links[li];
				// Checks if the array the being linked to has been removed
				if (link == undefined || link.nodes.length == 0) {
					this.arrays[ai].links.splice(li, 1);
					li--;
					continue;
				}

				// Sets the edge to be between the center nodes.
				this.gd.edges.push({
					n1: this.arrays[ai].nodes[Math.floor(this.arrays[ai].nodes.length / 2)],
					n2: link.nodes[Math.floor(link.nodes.length / 2)]
				});
			}
		}
	}

	drawUI() {
		this.gd.staticContext.clearRect(0, 0,
			this.gd.staticBuffer.width, this.gd.staticBuffer.height);

		// Draw + buttons between every element of the arrays
		this.gd.staticContext.fillStyle = "white";
		this.gd.staticContext.strokeStyle = "black";
		for (let ai = 0; ai < this.arrays.length; ai++) {
			this.gd.staticContext.beginPath();
			for (let ni = 0; ni < this.arrays[ai].nodes.length; ni++) {
				let node = this.arrays[ai].nodes[ni];
				if (this.gd.DEVICE == "Desktop") {
					// Every node should draw a + between them and the next node.
					// The first node should draw a + at the start of the array.
					if (ni == 0) this._renderAddNodeButton(node, "left", ai, ni);
					this._renderAddNodeButton(node, "right", ai, ni);
				} else if (this.gd.DEVICE == "Mobile") {
					// Only render + buttons on the clicked node
					if (node != this.clickedNode) continue;
					this._renderAddNodeButton(node, "left", ai, ni);
					this._renderAddNodeButton(node, "right", ai, ni);
				}
			}
			this.gd.staticContext.closePath();
		}

		// Render hover buttons (Desktop)
		for (let i = 0; i < this.hoverButtons.length; i++) {
			let btn = this.hoverButtons[i];
			this.gd.staticContext.beginPath();

			this.gd.staticContext.rect(
				btn.position.x,
				btn.position.y,
				btn.position.width,
				btn.position.height
			);
			this.gd.staticContext.fill();
			this.gd.staticContext.stroke();

			this.gd.staticContext.closePath();
		}

		// If the operatingMode is Presentation, the stepping buttons
		// should be drawn.
		if (this.gd.operatingMode == "Presentation") {
			this.gd.drawStatic();
		}

		// Render selected buttons (Mobile)
		for (let i = 0; i < this.clickedButtons.length; i++) {
			
			let btn = this.clickedButtons[i];
			this.gd.staticContext.beginPath();

			// Button
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

	/*
		Creates a + button next to a node on a given side.
	*/
	_renderAddNodeButton(node, side, ai, ni) {
		let bSize = node.w / this.bsf;
		let bX = node.x + node.w - bSize / 2;
		if (side == "left") {
			bX -= node.w;
		}

		let point = this.gd.camera.unproject(
			bX,
			node.y + bSize / 2
		);
		
		let plussSize = bSize / 2;
		let plussPadding = (bSize - plussSize) / 2;
		// Button
		this.gd.staticContext.rect(point.x, point.y, bSize, bSize);
		// Vertical
		this.gd.staticContext.moveTo(point.x + bSize / 2, point.y + plussPadding);
		this.gd.staticContext.lineTo(point.x + bSize / 2, point.y + bSize - plussPadding);
		// Horizontal
		this.gd.staticContext.moveTo(point.x + plussPadding, point.y + bSize / 2);
		this.gd.staticContext.lineTo(point.x + bSize - plussPadding, point.y + bSize / 2);
		
		this.gd.staticContext.fill();
		this.gd.staticContext.stroke();

		this.buttons.push({
			position: {
				x: point.x,
				y: point.y,
				width: bSize,   
				height: bSize
			},
			handler: this.addNewNodeToArray.bind(this),
			data: {
				ai: ai,
				ni: ni,
				side: side
			}
		});
	}

	/*
		Find which array contains nodes with the given values
		Returns the index of the array, or -1 if values were not found.
		If reverseOrder is true, the loop will start of the arrays, and will
		return the most recent array, if multiple arrays share the same values.
	*/
	_findArrayFromNodeValues(values, reverseOrder) {
		let loopLogic = (ai) => {
			let nodes = this.arrays[ai].nodes;
			if (nodes.length !== values.length) return undefined;

			let bad = false;
			for (let i = 0; i < values.length; i++) {
				if (values[i] !== nodes[i].v) {
					bad = true;
					break;
				}
			}

			if (!bad) return ai;
			return undefined;
		};

		if (reverseOrder) {
			for (let ai = this.arrays.length - 1; ai >= 0; ai--) {
				let r = loopLogic(ai);
				if (r !== undefined) return r;
			}
		} else {
			for (let ai = 0; ai < this.arrays.length; ai++) {
				let r = loopLogic(ai);
				if (r !== undefined) return r;
			}
		}

		return -1;
	}

	/*
		Finds which array (ai) the node belongs in, and what
		position (ni) the node has in the array.
		Returns {ai, ni}.
	*/
	_findArrayPosition(node) {
		for (let ai = 0; ai < this.arrays.length; ai++) {
			let ni = this.arrays[ai].nodes.indexOf(node);
			if (ni != -1) {
				return {
					ai: ai,
					ni: ni
				};
			}
		}
	}

	export() {
		let arrToList = function(arr) {
			let list = [];
			for (let i = 0; i < arr.nodes.length; i++) {
				list.push(arr.nodes[i].v);
			}
			return list;
		};

		let linkCounter = function() {
			let counter = new Map();

			for (let i = 0; i < this.arrays.length; i++) {
				let arr = this.arrays[i];
				for (let l = 0; l < arr.links.length; l++) {
					if (!counter.has(arr.links[l])) {
						counter.set(arr.links[l], {
							count: 1,
							parents: [arr]
						});
					} else {
						counter.get(arr.links[l]).count += 1;
						counter.get(arr.links[l]).parents.push(arr);
					}
				}
			}

			return counter;
		}.bind(this);

		let steps = [];

		// Create the initial step if it exists
		if (this.arrays.length > 0) {
			steps.push({
				type: "Initial",
				list: arrToList(this.arrays[0]),
				position: this.arrays[0].position
			});
		}

		let counter = linkCounter();
		for (let i = 0; i < this.arrays.length; i++) {
			let arr = this.arrays[i];
			let c = counter.get(arr);

			if (c == undefined) {
				continue;
			}

			// Every array which has only one link to it
			// is a split.
			if (c.count == 1) {
				// Check if the other splitlist has already
				// added a split step.
				let found = false;
				let parentList = arrToList(c.parents[0]);
				for (let s = 0; s < steps.length; s++) {
					if (steps[s].type == "Split") {
						// .toString() works as .isEqual() - deepequal
						if (steps[s].list.toString() == parentList.toString()) {
							steps[s].right = arrToList(arr);
							steps[s].position.right = arr.position;
							found = true;
							break;
						}
					}
				}

				if (!found) {
					let pivot = [];
					if (this.sortType == "Quicksort") {
						for (let n = 0; n < c.parents[0].nodes.length; n++) {
							if (c.parents[0].nodes[n].pivot) {
								pivot.push(c.parents[0].nodes[n].v);
							}
						}
					}

					steps.push({
						type: "Split",
						list: parentList,
						left: arrToList(arr),
						pivot: pivot,
						right: undefined,
						position: {
							left: arr.position,
							right: undefined
						}
					});
				}
			} else if (c.count == 2) {
				// Arrays with two links to it, is a join.
				steps.push({
					type: "Merge",
					list1: arrToList(c.parents[0]),
					list2: arrToList(c.parents[1]),
					merged: arrToList(arr),
					position: {
						x: arr.position.x,
						y: arr.position.y
					}
				});
			}
		}

		// Add everything as a final step
		let edges = [];
		for (let i = 0; i < this.gd.edges.length; i++) {
			edges.push({
				n1: this.gd.edges[i].n1.v,
				n2: this.gd.edges[i].n2.v
			});
		}

		let nodes = [];
		for (let i = 0; i < this.gd.nodes.length; i++) {
			let node = this.gd.nodes[i];
			nodes.push({
				v: node.v,
				x: node.x,
				y: node.y
			});
		}

		let arrs = [];
		for (let i = 0; i < this.arrays.length; i++) {
			let arr = this.arrays[i];

			let links = [];
			for (let j = 0; j < arr.links.length; j++) {
				links.push(this.arrays.indexOf(arr.links[j]));
			}

			let pivots = [];
			for (let j = 0; j < arr.nodes.length; j++) {
				if (arr.nodes[j].pivot) {
					pivots.push(j);
				}
			}

			arrs.push({
				nodes: arrToList(arr),
				position: arr.position,
				links: links,
				pivots: pivots
			});
		}

		steps.push({
			type: "Complete",
			arrays: arrs
		});

		// 1. The lower/higher order of array splitting shouldn't matter.
		// 2. If the pivot is smaller than all the other nodes, then the 
		// left array will contain the nodes, when they should be in the
		// right array. This fixes both problems.
		for (let i = 0; i < steps.length; i++) {
			let step = steps[i];
			if (step.type !== "Split") continue;
			if (step.pivot === undefined) continue;
			if (step.pivot.length != 1) continue;

			let pivot = step.pivot[0];

			// Move left to right if all the values are above the pivot.
			if (step.left !== undefined && step.right == undefined) {
				let minValue = step.left[0];
				for (let j = 0; j < step.left.length; j++) {
					if (step.left[j] < minValue) minValue = step.left[j];
				}

				if (minValue > pivot) {
					step.right = step.left;
					delete step.left;
					step.left = [];
				}
			// Move right to left if all the values are below the pivot.
			} else if (step.left == undefined && step.right !== undefined) {
				let maxValue = step.right[0];
				for (let j = 0; j < step.right.length; j++) {
					if (step.right[j] > maxValue) maxValue = step.right[j];
				}

				if (maxValue < pivot) {
					step.left = step.right;
					delete step.right;
					step.right = [];
				}
			// Switch left/right if left is above pivot and right is below pivot.
			} else if (step.left !== undefined && step.right !== undefined) {
				let allLeftAbove = true;
				let allRightBelow = true;
				
				for (let j = 0; j < step.left.length; j++) {
					if (step.left[j] < pivot) {
						allLeftAbove = false;
						break;
					}
				}

				for (let j = 0; j < step.right.length; j++) {
					if (step.right[j] > pivot) {
						allRightBelow = false;
						break;
					}
				}

				if (allLeftAbove && allRightBelow) {
					let newLeft = [];
					let newRight = [];
					step.left.forEach((v) => newRight.push(v));
					step.right.forEach((v) => newLeft.push(v));
					step.left = newLeft;
					step.right = newRight;
				}
			}
		}

		return steps;
	}

	/*
		Parses the steps from a step list into arrays
	*/
	parseSteps() {
		// Reset the world
		this.arrays = [];
		this.gd.nodes = [];
		this.gd.edges = [];

		this.gd.dirty = true;

		// If the steps were generated by a user, the position of the arrays
		// should match what the user made. If not the arrays should be placed in 
		// a nice way.
		let user = this.steps[0].position != undefined;
		let yPadding = 75;
		let xPadding = 25;
		let r = this.gd.nodeShape == "Circle" ? this.gd.R : this.gd.R * 2;

		let nodesFromValueList = (list, array) => {
			for (let i = 0; i < list.length; i++) {
				let node = {
					x: array.position.x + r * i,
					y: array.position.y,
					w: r,
					h: r,
					v: list[i],
					shape: this.gd.nodeShape
				};

				this.gd.addNode(node, true);
				array.nodes.push(node);
			}
		};

		// The inital array is placed centered
		// at the top of the canvas relative 
		// to the current camera position.
		// If this is not the first time parseInitial is ran,
		// it will be placed at the position of the first run instead.
		let parseInitial = (step) => {
			let p = this.gd.camera.project(this.gd.canvas.width / 2, 0);

			// Add some padding between canvas top and array
			p.y += r / 2;

			// Assumes same size nodes
			let arrayWidth = step.list.length * r;
			p.x -= arrayWidth / 2;

			if (this._initialArrayPosition == undefined) {
				this._initialArrayPosition = { x: p.x, y: p.y };
			} else {
				p.x -= (p.x - this._initialArrayPosition.x);
				p.y -= (p.y - this._initialArrayPosition.y);
			}

			let newArr = this.getNewArray(p.x, p.y);
			nodesFromValueList(step.list, newArr);
			this.arrays.push(newArr);

			if (!user) {
				return {
					dx: 0,
					dy: 0
				};
			}

			return {
				dx: p.x - step.position.x,
				dy: p.y - step.position.y
			};
		};

		// Splits are placed under the previous split
		let parseSplit = (step, pos) => {
			let parent = this._findArrayFromNodeValues(step.list);

			if (step.left !== undefined && step.left.length > 0) {
				let left = this.getNewArray(pos.left.x, pos.left.y);
				nodesFromValueList(step.left, left);
				this.arrays.push(left);
				this.arrays[parent].links.push(left);
			}

			if (step.right !== undefined && step.right.length > 0) {
				let right = this.getNewArray(pos.right.x, pos.right.y);
				nodesFromValueList(step.right, right);
				this.arrays.push(right);
				this.arrays[parent].links.push(right);
			}

			for (let i = 0; i < this.arrays[parent].nodes.length; i++) {
				let node = this.arrays[parent].nodes[i];
				if (node.v == step.pivot) {
					node.pivot = true;
					node.fillColor = this.pivotColor;
				}
			}
		};

		let parseMerge = (step, pos) => {
			let merged = this.getNewArray(pos.x, pos.y);
			nodesFromValueList(step.merged, merged);
			this.arrays.push(merged);

			let p1 = this._findArrayFromNodeValues(step.list1, true);
			let p2 = this._findArrayFromNodeValues(step.list2, true);

			// Quicksort solutions will merge to lists and a pivot node
			if (step.pivot) {
				// Find array which contains the pivot node
				for (let i = 0; i < this.arrays.length; i++) {
					let nodes = this.arrays[i].nodes;
					let found = false;
					for (let j = 0; j < nodes.length; j++) {
						if (nodes[j].pivot && nodes[j].v == step.pivot) {
							this.arrays[i].links.push(merged);
							found = true;
							break;
						}
					}

					if (found) break;
				}
			}

			if (p1 > -1) this.arrays[p1].links.push(merged);
			if (p2 > -1) this.arrays[p2].links.push(merged);
		};

		let parseComplete = (step, pos) => {
			this.gd.nodes = [];
			this.gd.edges = [];

			for (let i = 0; i < step.arrays.length; i++) {
				let arr = step.arrays[i];
				let newArr = {
					position: {
						x: arr.position.x + pos.x,
						y: arr.position.y + pos.y
					},
					nodes: [],
					links: []
				};
				nodesFromValueList(arr.nodes, newArr);
				this.arrays.push(newArr);
				this.gd.centerCameraOnGraph();
			}

			for (let i = 0; i < this.arrays.length; i++) {
				let arr = this.arrays[i];

				let stepArray = step.arrays[i];
				for (let j = 0; j < stepArray.links.length; j++) {
					let index = stepArray.links[j];
					arr.links.push(this.arrays[index]);
				}

				for (let j = 0; j < stepArray.pivots.length; j++) {
					let index = stepArray.pivots[j];
					arr.nodes[index].pivot = true;
					arr.nodes[index].fillColor = this.pivotColor;
				}
			}
		};

		let offset = undefined;
		for (let i = 0; i <= this.gd.currentStep; i++) {
			let step = this.steps[i];
			let pos = {
				x: 0,
				y: 0,
				left: {},
				right: {}
			};

			if (step.type == "Initial") {
				offset = parseInitial(step);
			} else if (step.type == "Split") {
				if (offset == undefined) continue;

				if (user) {
					if (step.position.left) {
						pos.left.x = step.position.left.x + offset.dx;
						pos.left.y = step.position.left.y + offset.dy;
					}
					if (step.position.right) {;
						pos.right.x = step.position.right.x + offset.dx;
						pos.right.y = step.position.right.y + offset.dy;
					}
				} else {
					let parent = this._findArrayFromNodeValues(step.list);
					let ppos = this.arrays[parent].position;
					pos.left.y = ppos.y + yPadding;
					pos.left.x = ppos.x - xPadding / 2;
					pos.right.y = ppos.y + yPadding;
					let leftWidth = step.left.length * r;
					pos.right.x = pos.left.x + xPadding + leftWidth;
				}

				parseSplit(step, pos);
			} else if (step.type == "Merge") {
				if (offset == undefined) continue;

				// Quicksort shouldn't show the merge step
				//if (this.sortType == "Quicksort") continue;
				if (step.list1 == undefined || step.list2 == undefined) {
					continue;
				}

				if (user) {
					pos.x = step.position.x + offset.dx;
					pos.y = step.position.y + offset.dy;
				} else {
					// The array should be centered between the two
					// parent arrays in the x position.
					let p1 = this._findArrayFromNodeValues(step.list1, true);
					let p2 = this._findArrayFromNodeValues(step.list2, true);

					let ps = [];
					if (p1 > -1) ps.push(this.arrays[p1]);
					if (p2 > -1) ps.push(this.arrays[p2]);
					// Quicksort solutions will merge to lists and a pivot node
					if (step.pivot) {
						for (let i = 0; i < this.arrays.length; i++) {
							let nodes = this.arrays[i].nodes;
							let found = false;
							for (let j = 0; j < nodes.length; j++) {
								if (nodes[j].pivot && nodes[j].v == step.pivot) {
									ps.push(this.arrays[i]);
									found = true;
									break;
								}
							}

							if (found) break;
						}
					}

					let cx = 0;
					let maxY = 0;
					for (let i = 0; i < ps.length; i++) {
						let width = ps[i].nodes.length * r;
						cx += ps[i].position.x + width / 2;

						if (ps[i].position.y > maxY) maxY = ps[i].position.y;
					}
					cx /= ps.length;
					let stepWidth = step.merged.length * r;
					pos.x = cx - stepWidth / 2;
					pos.y = maxY + yPadding;
				}

				parseMerge(step, pos);
			} else if (step.type == "Complete") {
				if (offset !== undefined) {
					pos.x = offset.dx;
					pos.y = offset.dy;
				}
				parseComplete(step, pos);
			} else {
				console.error(`Found invalid step type: ${step.type} 
					at index ${i}, skipping.`);
			}
		}

		this._recalculateEdges();
		if (!user) this.fixArrayPositions(0, xPadding, yPadding);
	}

	/*
		Moves the arrays so that there is no overlapping.
		The array at parentIndex is treated as the root of the tree.
		It is assumed that all of the nodes have the same width.
	*/
	fixArrayPositions(parentIndex, xPadding, yPadding) {
		let start = this.arrays[parentIndex];
		if (start.links.length == 0) return;

		this._fixYPadding(start, yPadding);
		let linkCount = this._countLinks();

		let arraysWithNoLinks = 0;
		for (let i = 0; i < this.arrays.length; i++) {
			let arr = this.arrays[i];
			if (arr.links == undefined || arr.links.length == 0) {
				arraysWithNoLinks++;
			}
		}
		
		let assignSide = function(arr, side) {
			if (arr.links.length == 0 &&
				linkCount.get(arr) !== 1) {
				arr.side = -1;
				return;
			}

			arr.side = side;
			for (let i = 0; i < arr.links.length; i++) {
				assignSide(arr.links[i], side);
			}
		};

		let indexes = this._getLinkIndexesOnSameY(start);
		let firstLink = start.links[indexes[0]];
		let secondLink = start.links[indexes[1]];
		if (firstLink.position.x < secondLink.position.x) {
			assignSide(firstLink, 0);
			assignSide(secondLink, 1);
		} else {
			assignSide(firstLink, 1);
			assignSide(secondLink, 0);
		}

		let leftest = undefined;
		let rightest = undefined;
		
		// Find the node on the left side of the root which is the furthest to the right,
		// and the node on the right side of the root which is the furthest to the left.
		for (let i = 0; i < this.arrays.length; i++) {
			let arr = this.arrays[i];
			if (arr.side == 0) {
				if (rightest == undefined) {
					rightest = arr;
				} else {
					let pos = this._getSideXCoordinate(arr, 1);
					let currentPos = this._getSideXCoordinate(rightest, 1);
					if (pos > currentPos) rightest = arr;
				}
			} else if (arr.side == 1) {
				if (leftest == undefined) {
					leftest = arr;
				} else {
					let pos = this._getSideXCoordinate(arr, 0);
					let currentPos = this._getSideXCoordinate(leftest, 0);
					if (pos < currentPos) leftest = arr;
				}
			}
		}

		console.log("Leftest: " + this.getNodeValuesAsString(leftest.nodes));
		console.log("Rightest: " + this.getNodeValuesAsString(rightest.nodes));
		

		// It is no longer interesting to check which side of the root a node is on.
		// Instead, the side property should represent whether the array is to
		// the left or right of the parent array.
		for (let i = 0; i < this.arrays.length; i++) {
			let arr = this.arrays[i];
			
			// directChildren are the children which are 
			// closest to the array
			let directChildren = [];
			let closestY = 1000000;
			for (let j = 0; j < arr.links.length; j++) {
				let l = arr.links[j];
				let dy = l.position.y - arr.position.y;
				if (dy < closestY) {
					closestY = dy;
					directChildren = [l];
				} else if (dy == closestY) {
					directChildren.push(l);
				}
			}

			console.log("Arr: " + this.getNodeValuesAsString(arr.nodes));
			console.log("Has direct children: ");
			for (let j = 0; j < directChildren.length; j++)
				console.log(this.getNodeValuesAsString(directChildren[j].nodes));

			if (directChildren.length > 2) {
				console.error("Array with more than 2 direct children!");
				console.error(arr);
				continue;
			}

			if (directChildren.length == 1) {
				let child = directChildren[0];
				child.side = child.position.x < arr.position.x ? 0 : 1;
			} else if (directChildren.length == 2) {
				let child1 = directChildren[0];
				let child2 = directChildren[1];

				if (child1.position.x < child2.position.x) {
					child1.side = 0;
					child2.side = 1;
				} else {
					child1.side = 1;
					child2.side = 0;
				}
			}
		}

		let visisted = [];
		let moveArray = function(arr, relativeArray, overrideSide) {
			if (arr == undefined) return;

			// First array
			if (linkCount.get(arr) == undefined) return;
			// Last array
			if (arraysWithNoLinks == 1 && 
				(arr.links == undefined || arr.links.length == 0)
				) {
				return;
			}

			if (visisted.includes(arr)) return;
			visisted.push(arr);

			// If an array is only linked from one other array
			// then its position should be based on which side
			// of the parent array it is on. If it has more,
			// the center should be at the average center of the parents.
			let newX;
			let nodeWidth = relativeArray.nodes[0].w;

			if (linkCount.get(arr) == 1) {
				let centerX = 
					relativeArray.position.x + 
					relativeArray.nodes.length * nodeWidth / 2;

				// Move array
				let side = overrideSide == undefined ? arr.side : overrideSide;
				let sign = side == 0 ? -1 : 1;
				newX = centerX + sign * xPadding;

				// If the array is on the left, the width of the array means
				// that it needs to be even further to the left
				if (side == 0)
					newX -= arr.nodes.length * nodeWidth;
			} else {
				let parentCount = 0;
				let totalParentCenterX = 0;
				for (let i = 0; i < this.arrays.length; i++) {
					let parent = this.arrays[i];
					if (parent.links.indexOf(arr) > -1) {
						parentCount++;

						let parentCenterX = 
							parent.position.x +
							parent.nodes.length * nodeWidth / 2;
						
						totalParentCenterX += parentCenterX;
					}
				}

				let desiredCenterX = totalParentCenterX / parentCount;
				let arrWidth = arr.nodes.length * nodeWidth;
				newX = desiredCenterX - arrWidth / 2;
			}

			arr.position.x = newX;

			// Call function to move children and parents
			// Find left/right children
			let indexes = this._getLinkIndexesOnSameY(arr);
			let link1 = arr.links[indexes[0]];
			let link2 = arr.links[indexes[1]];
			if (link1 !== undefined) moveArray(link1, arr);
			if (link2 !== undefined) moveArray(link2, arr);

			if (linkCount.get(arr) == 1) {
				for (let i = 0; i < this.arrays.length; i++) {
					if (this.arrays[i].links.includes(arr)) {
						moveArray(this.arrays[i], arr);
					}
				}
			}
		}.bind(this);

		moveArray(rightest, start, 0);
		moveArray(leftest, start, 1);

		for (let i = 0; i < this.arrays.length; i++)
			this._repositionNodes(i);
	}

	_getLinkIndexesOnSameY(array) {
		let notValidIndex = 2;
		if (array.links.length == 3) {
			let f = array.links[0];
			let m = array.links[1];
			let l = array.links[2];
			if (f.position.y > m.position.y && f.position.y > l.position.y)
				notValidIndex = 0;
			else if (m.position.y > f.position.y && m.position.y > l.position.y)
				notValidIndex = 1;
			else notValidIndex = 2;
		}

		let indexes = [0, 1, 2];
		indexes.splice(notValidIndex, 1);
		return indexes;
	}

	_countLinks() {
		let linkCount = new Map();
		for (let i = 0; i < this.arrays.length; i++) {
			let arr = this.arrays[i];
			for (let j = 0; j < arr.links.length; j++) {
				let link = arr.links[j];

				if (linkCount.has(link)) {
					linkCount.set(link, linkCount.get(link) + 1);
				} else {
					linkCount.set(link, 1);
				}
			}
		}

		return linkCount;
	}

	_getSideXCoordinate(array, side) {
		if (side == 0) return array.position.x;
		return array.position.x + array.nodes[0].w * array.nodes.length;
	}

	_fixYPadding(startingArray, padding) {
		for (let i = 0; i < startingArray.links.length; i++) {
			let array = startingArray.links[i];
			
			if (array.position.y < startingArray + padding) {
				array.position.y = startingArray + padding;
			}

			this._fixYPadding(array, padding);
		}
	}

	/*
		Used by desktop clients to show buttons over the hovered node
	*/
	mouseMoveHandler(e) {
		// Check if the user is hovering a node
		let hoveredNode = undefined;
		let p = this.gd.camera.project(e.offsetX, e.offsetY);
		for (let ai = 0; ai < this.arrays.length; ai++) {
			for (let ni = 0; ni < this.arrays[ai].nodes.length; ni++) {
				let node = this.arrays[ai].nodes[ni];
				if (this.gd.isPointInNode(p.x, p.y, node.x, node.y)) {
					hoveredNode = node;
					break;
				}
			}

			if (hoveredNode != undefined) {
				break;
			}
		}
		// Check if it's the same as last time
		if (hoveredNode == this.lastHoveredNode) return;
		// If not clear buttons and add new
		this.lastHoveredNode = hoveredNode;
		this.hoverButtons = [];
		this.gd.dirty = true;
		if (hoveredNode == undefined) return;

		// Delete node
		let bSize = hoveredNode.w / this.bsf;
		let bX = hoveredNode.x + hoveredNode.w / 2 - bSize / 2;
		let dP = this.gd.camera.unproject(bX, hoveredNode.y);

		this.hoverButtons.push({
			position: {
				x: dP.x,
				y: dP.y,
				width: bSize,
				height: bSize
			},
			handler: (() => console.log("Delete clicked")),
			data: {
				type: "Delete"
			}
		});
	}

	getNodeValuesAsString(nodes) {
		let vals = [];
		for (let i = 0; i < nodes.length; i++)
			vals.push(nodes[i].v);
		return vals.join(", ");
	}
}
