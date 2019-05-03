import Graph0 from "./controllers/Graph0.js";
import Graph1 from "./controllers/Graph1.js";
import Sort from "./controllers/Sort.js";
import Djikstra from "./controllers/Djikstra.js";
import Python from "./controllers/Python.js";
import Camera from "./Camera.js";

/*
	Adds graph drawing functionality to a canvas object.

	// TODO: Node z index

	The GraphDrawer works in three different coordinate spaces:
		World is where the nodes and edges are defined. This should generally
			be larger than the other two.
		Camera space is the interface between the world and the canvas.
			GraphDrawer assumes that the camera space size is the same
			as the canvas space size, because this makes zooming functionality
			a lot simpler.
		Canvas space is where the user interacts with the world.


	The GraphDrawer uses three canvases to render a graph:
		Offscreen: A drawing canvas (drawBuffer, drawContext), 
			where nodes and edges are drawn in world coordinates.
			Controllers shouldn't draw directly to this canvas.
		Offscreen: A UI canvas (staticBuffer, staticContext), 
			where the user interface is drawn in canvas coordinates.
			This can be used by controllers to draw, e.g. buttons.
		Onscreen: This canvas is the combination of drawBuffer and 
			staticBuffer drawn on top of eachother. It is displayed
			to the user.
		
*/
export default class GraphDrawer {
	_config(config) {
		/*
			What shape is drawn for the nodes
			Possible values: Circle, Rectangle
		*/
		this.nodeShape = config.nodeShape || "Rectangle";
		/*
			Determines how the user can interact with the canvas.
			Graph0 = Buttons are shown.
			Graph1 = Simple mode 
			Sort = Quicksort or Mergesort
			Python = Python
		*/
		this.controlType = config.controlType || "Sort";
		/*
			This can be used in a controller to decide how
			the user can interact with the world.

			Interactive: Let's the user use a given controller to
				manipulate the world.
			Visualize: Let's the user navigate between steps and
				see the progress of a algorithm.
		*/
		this.operatingMode = config.operatingMode || "Interactive";

		/*
			This can be used to determine if the value/cost of an edge
			is displayed next to the edge.
		*/
		if (config.displayEdgeValues !== undefined)
			this.displayEdgeValues = config.displayEdgeValues;
		else this.displayEdgeValues = true;

		/*
			Directed edges can only be traveres in the given direction.
			They are drawn as a arrow, instad of a line.
		*/
		if (config.directedEdges !== undefined)
			this.directedEdges = config.directedEdges;
		else this.directedEdges = false;
	}

	export() {
		return this.controllers[this.controlType].export();
	}

	constructor(canvas, locale, config, window) {
		// Reference to window so the size can be changed.
		this.window = window;
		// Radius of nodes.
		this.R = 25;
		// How often the canvas should be updated.
		this.FPS = 60;
		// Milliseconds between each update.
		this.MS_PER_FRAME = 1000 / this.FPS;
		// Device type, "Desktop" or "Mobile"
		this.DEVICE = "Mobile";
		// Relative size of the buffers compared to canvas size.
		this.STATIC_BUFFER_FACTOR = 1;
		this.DRAW_BUFFER_FACTOR = 5;
		// Size of the font in px.
		this.fontHeight = 10;
		// Contains all the text
		this.locale = locale;

		// Which step of the presentation the user is currently on
		// Should be used by the controller to decide on what to display
		this.currentStep = 0;
		// Buttons used to change step in presentation mode.
		this.steppingButtons = [];
		// Decides how much of the assigned button space should be used
		// by a button.
		this.relSize = 0.7;

		this._config(config);

		/*
			Nodes in the graph 
			{
				x, y, w, h, v, shape
				selected (can be undefined), 
				culled (can be undefined),
				fillColor (undefined => white),
				strokeColor (undefined => black),
			}.
		*/
		this.nodes = [];
		/*
			Edges between nodes 
			{
				n1, n2, v,
				strokeColor (undefined => black)
				directed (undefined => false)
			}.
		*/
		this.edges = [];

		// This value can be used by any object needing an id.
		// It should always be incremented after using the id.
		this.nextId = 0;

		// Flag which determines if the graph state should
		// be redrawn. Default value is true, so the UI
		// is rendered.
		this.dirty = true;

		// Flag which determines if the dirty flag should remain
		// true after a draw operation. This can not stay true 
		// after being used.
		this.stillDirty = false;

		// Canvas used to display graph.
		this.canvas = canvas;
		this.canvasContext = canvas.getContext("2d");

		// Offscreen canvas used for drawing (mostly) static
		// content like the UI. This draws in canvas space.
		this.createStaticBuffer();
		this.createDrawBuffer();

		// Offscreen canvas used for drawing. This draws
		// in world space and the camera converts it to canvas space.

		let down = function(e) {
			e.preventDefault();
			this.setEventOffset(e);

			// Check if the user is stepping.
			let consumed = this.checkSteppingButtons(e);
			if (consumed) return;

			// Let the controller handle the click.
			consumed = this.controllers[this.controlType].mouseDownHandler(e);
			if (consumed) return;

			// Gesture detection.
			this.detectPanGesture(e);
			this.detectZoomGesture(e);
		}.bind(this);

		this.canvas.addEventListener("mousedown", down);
		this.canvas.addEventListener("touchstart", down);
		this.canvas.addEventListener("wheel", this.detectZoomWheel.bind(this));

		// Updates the GraphDrawer every <MS_PER_FRAME> milliseconds.
		this.intervalId = setInterval((function() {
			this.update.call(this);
		}).bind(this), this.MS_PER_FRAME);

		this.camera = new Camera(this);

		this.controllers = {
			Graph0: new Graph0(this, config.graph),
			Graph1: new Graph1(this),
			Sort: new Sort(this, config.sort),
			Dijkstra: new Djikstra(this, config.dijkstra),
			Python: new Python(this, config.python)
		};

		this.setController(this.controlType);
	}

	setController(controllerName) {
		this.controlType = controllerName;
		this.nodes = [];
		this.edges = [];

		if (this.controlType == "Graph0")
			this.controllers["Graph0"].drawStatic();

		if (this.controllers[this.controlType].configure)
			this.controllers[this.controlType].configure();
	}

	/*
		Draws the offscreen buffer to the displayed canvas.

		ref: https://en.wikipedia.org/wiki/Multiple_buffering
	*/
	switchBuffers() {
		let camera = this.camera.getFrustumFront();
		this.canvasContext.clearRect(
			0,
			0,
			this.canvas.width,
			this.canvas.height
		);

		this.canvasContext.drawImage(
			this.drawBuffer,
			camera.left,
			camera.top,
			camera.width,
			camera.height,
			0,
			0,
			this.canvas.width,
			this.canvas.height
		);

		this.canvasContext.drawImage(
			this.staticBuffer,
			0,
			0,
			this.staticBuffer.width,
			this.staticBuffer.height,
			0,
			0,
			this.canvas.width,
			this.canvas.height
		);
	}

	/*
		Removes everything from the staticBuffer, and 
		resets the colors.
	*/
	resetStatic() {
		this.staticContext.clearRect(
			0,
			0,
			this.staticBuffer.width,
			this.staticBuffer.height
		);

		this.staticContext.fillStyle = "white";
		this.staticContext.strokeStyle = "black";
	}

	createStaticBuffer() {
		this.staticBuffer = document.createElement("CANVAS")
		this.setBufferDimension(this.staticBuffer, this.STATIC_BUFFER_FACTOR);
		this.staticContext = this.staticBuffer.getContext("2d");
	}

	createDrawBuffer() {
		this.drawBuffer = document.createElement("CANVAS");
		this.setBufferDimension(this.drawBuffer, this.DRAW_BUFFER_FACTOR);
		this.drawContext = this.drawBuffer.getContext("2d");
	}

	setBufferDimension(buffer, factor) {
		buffer.width = this.canvas.width * factor;
		buffer.height = this.canvas.height * factor;
	}

	/*
		Draws the stepping buttons to the buffer.
		Must be called by a controller.
	*/
	drawStatic() {
		this.resetStatic();

		for (let i = 0; i < this.steppingButtons.length; i++) {
			let btn = this.steppingButtons[i];
			this.staticContext.beginPath();

			// Button
			this.staticContext.rect(
				btn.position.x,
				btn.position.y,
				btn.position.width,
				btn.position.height
			);
			this.staticContext.fill();
			this.staticContext.stroke();

			// Text
			this.staticContext.fillStyle = "black";
			let textWidth = this.staticContext.measureText(btn.data.text).width;
			let xPadding = (btn.position.width - textWidth) / 2;
			let yPadding = (btn.position.height + this.fontHeight) / 2;
			this.staticContext.fillText(
				btn.data.text,
				btn.position.x + xPadding,
				btn.position.y + yPadding
			);
			this.staticContext.fillStyle = "white";
			this.staticContext.closePath();
		}

		if (this.controllers[this.controlType].afterDrawStatic)
			this.controllers[this.controlType].afterDrawStatic();
	}

	/*
		Draws the nodes and edges to the buffer.
	*/
	draw() {
		this.drawContext.clearRect(
			0,
			0,
			this.drawBuffer.width,
			this.drawBuffer.height
		);

		// World border
		this.drawContext.beginPath();
		this.drawContext.moveTo(0, 0);
		this.drawContext.lineTo(this.drawBuffer.width, 0);
		this.drawContext.lineTo(this.drawBuffer.width, this.drawBuffer.height);
		this.drawContext.lineTo(0, this.drawBuffer.height);
		this.drawContext.lineTo(0, 0);
		this.drawContext.stroke();
		this.drawContext.closePath();

		// Edges.
		for (let i = 0; i < this.edges.length; i++) {
			if (this.camera.cull(this.edges[i], false)) continue;

			let center1 = this.getCenter(this.edges[i].n1);
			let center2 = this.getCenter(this.edges[i].n2);

			this.drawContext.beginPath();
			this.drawContext.moveTo(center1.x, center1.y);
			this.drawContext.lineTo(center2.x, center2.y);

			if (this.edges[i].strokeColor) {
				this.drawContext.strokeStyle = this.edges[i].strokeColor;
			}
			this.drawContext.stroke();
			this.drawContext.strokeStyle = "black";
			this.drawContext.closePath();

			// Draw an arrow, ref: https://stackoverflow.com/a/6333775, 20.02.2019
			if (
				this.directedEdges &&
				(this.edges[i].directed == undefined ||
					this.edges[i].directed == true)
			) {
				let b = {
					x: center1.x,
					y: center1.y
				};

				// a is the intersection point
				let a = {};
				let node = this.edges[i].n2;
				let line = {
					x1: center1.x,
					y1: center1.y,
					x2: center2.x,
					y2: center2.y
				};

				let intersection = this.lineIntersectsNode(line, node);
				if (intersection !== undefined) {
					a = intersection.p;
				}

				if (a !== undefined) {
					let headlen = 15;
					let angle = Math.atan2(a.y - b.y, a.x - b.x);
					this.drawContext.beginPath();
					this.drawContext.moveTo(a.x, a.y);
					this.drawContext.lineTo(
						a.x - headlen * Math.cos(angle - Math.PI / 6),
						a.y - headlen * Math.sin(angle - Math.PI / 6)
					);
					this.drawContext.moveTo(a.x, a.y);
					this.drawContext.lineTo(
						a.x - headlen * Math.cos(angle + Math.PI / 6),
						a.y - headlen * Math.sin(angle + Math.PI / 6)
					);
					if (this.edges[i].strokeColor) {
						this.drawContext.strokeStyle = this.edges[i].strokeColor;
					}
					this.drawContext.stroke();
					this.drawContext.strokeStyle = "black";
				} else {
					console.error("No intersection");
				}
			}

			if (this.displayEdgeValues && this.edges[i].v !== undefined) {
				let tx = (center1.x + center2.x) / 2 + 5;
				let ty = (center1.y + center2.y) / 2 + 5;
				this.drawContext.fillText(this.edges[i].v, tx, ty);
			}
		}
		// Nodes.
		for (let i = 0; i < this.nodes.length; i++) {
			if (this.camera.cull(this.nodes[i], true)) continue;
			this.drawContext.beginPath();

			if (this.nodes[i].fillColor == undefined)
				this.drawContext.fillStyle = "white";
			else this.drawContext.fillStyle = this.nodes[i].fillColor;

			if (this.nodes[i].strokeColor == undefined)
				this.drawContext.strokeStyle = "black";
			else this.drawContext.strokeStyle = this.nodes[i].strokeColor;

			this.drawNode(this.nodes[i], this.drawContext);

			this.drawContext.fill();
			this.drawContext.stroke();
			this.drawContext.closePath();
			this.drawContext.strokeStyle = "black";

			// Text
			let center = this.getCenter(this.nodes[i]);
			this.drawContext.fillStyle = "black";
			let lines = [];
			if (typeof this.nodes[i].v == "string")
				lines = this.nodes[i].v.split("\n");
			else lines.push("" + this.nodes[i].v);

			let firstY = -(lines.length - 1) * 0.5;

			// Fix nodes where the text overflows the height of the node
			if (this.nodes[i].h < lines.length * this.fontHeight) {
				this.nodes[i].h = lines.length * this.fontHeight + 5;
				this.stillDirty = true;
			}

			let maxTextWidth = 0;
			for (let l = 0; l < lines.length; l++) {
				let textWidth = this.drawContext.measureText(lines[l]).width;

				// Fix nodes where the text overflows the width of the node
				if (this.nodes[i].w < textWidth) {
					this.nodes[i].w = textWidth + 5;
					this.stillDirty = true;
				}

				if (textWidth > maxTextWidth) maxTextWidth = textWidth;

				this.drawContext.fillText(
					lines[l],
					center.x - textWidth / 2,
					center.y + this.fontHeight / 2 + this.fontHeight * firstY + this.fontHeight * l
				);
			}

			// If a node is wider than needed, it will be assigned a smaller
			// width, bounded by this.R.
			let minSize = this.nodes[i].shape == "Circle" ? this.R : this.R * 2;

			if (maxTextWidth < this.nodes[i].w) {
				if (this.nodes[i].w !== minSize) {
					this.nodes[i].w = maxTextWidth;	
					if (this.nodes[i].w < minSize) this.nodes[i].w = minSize;
					this.stillDirty = true;
				}
			}
		}

		for (let i = 0; i < this.nodes.length; i++)
			this.nodes[i].culled = undefined;
	}

	/*
		Adds a node and returns a reference to it.
		props should be an object with mapping from attribute->value.
		Possible attributes: (all optional)
			x, y, w, h, v, shape,
			selected, culled,
			fillColor, strokeColor

		If ref is true, then the object in props is added to the nodes list.
	*/
	addNode(props, ref) {
		let nextId = this.nextId;
		this.nextId++;

		// If a node comes with a defined id, it needs to be checked
		// to see if a node with that id already exists. If a node exists
		// this nodes id should be set to nextId, instead of the defined id.
		if (props.id !== undefined) {
			let n = this.getNode(props.id);
			if (n !== undefined) props.id = nextId;
		}

		let node = {
			id: nextId,
			x: 0,
			y: 0,
			w: this.R,
			h: this.R,
			shape: this.nodeShape,
			selected: undefined,
			culled: undefined,
			fillColor: undefined,
			strokeColor: undefined
		};

		if (ref == undefined || ref == false) {
			for (var prop in props) {
				if (props.hasOwnProperty(prop)) {
					node[prop] = props[prop];
				}
			}
		} else {
			for (var nodeprop in node) {
				if (!props.hasOwnProperty(nodeprop)) {
					props[nodeprop] = node[nodeprop];
				}
			}
			node = props;
		}

		// Check if the new node was given an id which is larger than the
		// next id. If it was, nextId needs to be changed to prevent duplicate ids.
		if (node.id >= this.nextId) nextId = node.id + 1;

		this.nodes.push(node);
		return node;
	}

	getNode(id) {
		for (let i = 0; i < this.nodes.length; i++) {
			if (this.nodes[i].id == id) return this.nodes[i];
		}

		return undefined;
	}

	getNodeByValue(v) {
		for (let i = 0; i < this.nodes.length; i++) {
			if (this.nodes[i].v == v) return this.nodes[i];
		}

		return undefined;
	}

	/*
		Updates the GraphDrawer state.
	*/
	update() {
		if (this.canvas.width !== this.canvas.clientWidth) {
			this.canvas.width = this.canvas.clientWidth;
			let ratio = this.window.innerHeight / this.window.innerWidth;
			this.canvas.height = this.canvas.width * ratio;
			
			this.setBufferDimension(this.staticBuffer, this.STATIC_BUFFER_FACTOR);
			this.setBufferDimension(this.drawBuffer, this.DRAW_BUFFER_FACTOR);
			this.camera.updateToNewCanvasSize();
			
			if (this.operatingMode == "Presentation") {
				this.addSteppingButtons();
			}

			if (this.controllers[this.controlType].onCanvasResize !== undefined)
				this.controllers[this.controlType].onCanvasResize();

			this.dirty = true;
		}

		if (this.dirty) {
			// Controllers can implement the dirtyUpdate function to be notified
			// before a draw happens.
			if (this.controllers[this.controlType].dirtyUpdate != undefined) {
				this.controllers[this.controlType].dirtyUpdate();
			}

			//this.moveGraphInsideWorld();
			this.draw();
			this.switchBuffers();

			if (this.stillDirty) this.stillDirty = false;
			else this.dirty = false;
		}
	}

	/*
		Lets the user edit the value on a node.
		Can also be used on edges, because they share the v property.
	*/
	_editNode(node) {
		// This is the only way to open a keyboard in mobile browsers.
		let new_value = prompt(this.locale.editNodePrompt, node.v);
		if (new_value == undefined) return;
		node.v = new_value;
		this.dirty = true;
	}

	/*
		Let's the user scroll using a mouse wheel.
	*/
	detectZoomWheel(e) {
		// Prevent scrolling the page.
		e.preventDefault();

		let dir = -Math.sign(e.deltaY);
		let rect = this.canvas.getBoundingClientRect();
		let x = e.clientX - rect.left;
		let y = e.clientY - rect.top;
		this.camera.changeZoom(0.075 * dir, x, y);
		this.dirty = true;
	}

	/*
		Can be called to let the user zoom using two fingers.
	*/
	detectZoomGesture(e) {
		// Non touchscreen zooming
		if (e.targetTouches == undefined) return;
		if (e.targetTouches.length < 2) return;

		// Touchscreen zooming
		let getFingers = function(evt) {
			let rect = this.canvas.getBoundingClientRect();

			let f1 = {
				x: evt.targetTouches[0].clientX - rect.left,
				y: evt.targetTouches[0].clientY - rect.top
			};

			let f2 = {
				x: evt.targetTouches[1].clientX - rect.left,
				y: evt.targetTouches[1].clientY - rect.top
			};

			return [f1, f2];
		}.bind(this);

		let previousFingers = getFingers(e);

		let zoomHandler = function(newE) {
			let newFingers = getFingers(newE);

			let dF0x = newFingers[0].x - previousFingers[0].x;
			let dF0y = newFingers[0].y - previousFingers[0].y;
			let dF1x = newFingers[1].x - previousFingers[1].x;
			let dF1y = newFingers[1].y - previousFingers[1].y;

			if (
				Math.sign(dF0x) !== Math.sign(dF1x) &&
				Math.sign(dF0y) !== Math.sign(dF1y)
			) {
				let pdist = Math.hypot(
					previousFingers[1].x - previousFingers[0].x,
					previousFingers[1].y - previousFingers[0].y
				);
				let ndist = Math.hypot(
					newFingers[1].x - newFingers[0].x,
					newFingers[1].y - newFingers[0].y
				);

				let ax = (newFingers[0].x + newFingers[1].x) / 2;
				let ay = (newFingers[0].y + newFingers[1].y) / 2;

				// Zoom out
				if (pdist > ndist) this.camera.changeZoom(0.05, ax, ay);
				// Zoom in
				else if (pdist < ndist) this.camera.changeZoom(-0.05, ax, ay);
			}

			this.dirty = true;
			previousFingers = newFingers;
		}.bind(this);

		let zoomStopHandler = function() {
			setTimeout((function() {
				this.isZooming = false;
			}).bind(this), this.FPS / 4 * this.MS_PER_FRAME);
			this.canvas.removeEventListener("touchmove", zoomHandler);
			this.canvas.removeEventListener("touchend", zoomStopHandler);
			this.canvas.removeEventListener("touchcancel", zoomStopHandler);
			this.canvas.removeEventListener("touchleave", zoomStopHandler);
		}.bind(this);

		this.isZooming = true;
		this.canvas.addEventListener("touchmove", zoomHandler);
		this.canvas.addEventListener("touchend", zoomStopHandler);
		this.canvas.addEventListener("touchcancel", zoomStopHandler);
		this.canvas.addEventListener("touchleave", zoomStopHandler);
	}

	drawNode(node, context) {
		if (node.shape == "Circle") {
			context.ellipse(node.x, node.y, node.w, node.h, 0, 0, 2 * Math.PI);
		} else if (node.shape == "Rectangle") {
			context.rect(node.x, node.y, node.w, node.h);
		}
	}

	/*
		Can be called to determine if the event e is the start of a panning gesture.
		This let's the user move the camera around the world.
	*/
	detectPanGesture(e) {
		// Detect if the user is trying to zoom
		if (e.touches !== undefined) {
			if (e.touches.length > 1) return;
			if (e.targetTouches.length > 1) return;
			if (e.changedTouches.length > 1) return;
		}

		if (this.isZooming == true) return;

		let currentPosition = { x: e.offsetX, y: e.offsetY };
		// How much the camera moves relative to how far the mouse is dragged.
		let velocityFactor = 0.95;
		velocityFactor *= this.camera.zoomLevel;
		// How much the mouse must be moved before panning starts.
		let threshold = 5;
		let hasMoved = false;

		let panMoveHandler = function(newE) {
			newE.preventDefault();
			this.setEventOffset(newE);
			let newPosition = { x: newE.offsetX, y: newE.offsetY };
			let frustum = this.camera.getFrustumFront();

			// Calculates the difference in position between last frame and this frame.
			let dX = velocityFactor * (newPosition.x - currentPosition.x);
			let dY = velocityFactor * (newPosition.y - currentPosition.y);

			if (dX > threshold || dX < -threshold) {
				dX -= Math.sign(dX) * threshold;
				// The camera won't put it's center close enough to the world edge,
				// to render anything outside the world.
				this.camera.translateX(
					-dX,
					frustum.width / 2,
					this.drawBuffer.width - frustum.width / 2
				);
				hasMoved = true;
			}
			if (dY > threshold || dY < -threshold) {
				dY -= Math.sign(dY) * threshold;
				this.camera.translateY(
					-dY,
					frustum.height / 2,
					this.drawBuffer.height - frustum.height / 2
				);
				hasMoved = true;
			}

			this.dirty = true;
			currentPosition.x = newPosition.x;
			currentPosition.y = newPosition.y;
			if (hasMoved) threshold = 0;
		}.bind(this);

		let panUpHandler = function(newE) {
			newE.preventDefault();
			this.canvas.removeEventListener("mousemove", panMoveHandler);
			this.canvas.removeEventListener("mouseup", panUpHandler);
			this.canvas.removeEventListener("mouseleave", panUpHandler);
			this.canvas.removeEventListener("touchmove", panMoveHandler);
			this.canvas.removeEventListener("touchend", panUpHandler);
			this.canvas.removeEventListener("touchcancel", panUpHandler);
			this.canvas.removeEventListener("touchleave", panUpHandler);
		}.bind(this);

		this.canvas.addEventListener("mousemove", panMoveHandler);
		this.canvas.addEventListener("mouseup", panUpHandler);
		this.canvas.addEventListener("mouseleave", panUpHandler);
		this.canvas.addEventListener("touchmove", panMoveHandler);
		this.canvas.addEventListener("touchend", panUpHandler);
		this.canvas.addEventListener("touchcancel", panUpHandler);
		this.canvas.addEventListener("touchleave", panUpHandler);
	}

	/*
		Returns {index, node} of the clicked node,
		index and node are undefined if no node was clicked.
	*/
	getNodeAtCursor(e) {
		let p = this.camera.project(e.offsetX, e.offsetY);
		return this.getNodeAtPoint(p.x, p.y);
	}

	/*
		Returns {index, node} of the node at (x, y),
		index and node are undefined if no node was found.
	*/
	getNodeAtPoint(x, y) {
		for (let i = 0; i < this.nodes.length; i++) {
			if (this.isPointInNode(x, y, this.nodes[i])) {
				return {
					index: i,
					node: this.nodes[i]
				};
			}
		}

		return {
			index: undefined,
			node: undefined
		};
	}

	/*
		Checks whether a point (x, y) is inside a node.
	*/
	isPointInNode(x, y, node) {
		if (node.shape == "Circle") {
			return this.isPointInEllipse(x, y, node.x, node.y, node.w, node.h);
		}
		if (node.shape == "Rectangle") {
			return this.isPointInRectangle(
				x,
				y,
				node.x,
				node.y,
				node.w,
				node.h
			);
		}
	}

	/*
		Check wheter a point (x, y) is inside an ellipse
		with center (nx, ny) and radius (rx, ry).


		TODO: Check if this can be used for nodes where rx == ry
	*/
	isPointInEllipse(x, y, nx, ny, rx, ry) {
		let xx = ((x - nx) * (x - nx)) / (rx * rx);
		let yy = ((y - ny) * (y - ny)) / (ry * ry);
		return xx + yy <= 1;
	}

	/*
		Checks whether a point (x, y) is inside a circle
		with center (nx, ny) and radius r.
	*/
	isPointInCircle(x, y, nx, ny, r) {
		return (x - nx) * (x - nx) + (y - ny) * (y - ny) <= r * r;
	}

	/*
		Checks whether a point (x, y) is inside a rectangle with width w and height h.
		Top left corner of square (nx, ny).
	*/
	isPointInRectangle(x, y, nx, ny, w, h) {
		if (x < nx || x > nx + w) return false;
		if (y < ny || y > ny + h) return false;
		return true;
	}

	/*
		Calculates how far a point (x, y) is from a given edge.
	*/
	distanceFromEdgeToPoint(edge, x, y) {
		let p = {
			x: x,
			y: y
		};

		let p1 = this.getCenter(edge.n1);
		let p2 = this.getCenter(edge.n2);

		return Math.sqrt(this._distToSegmentSquared(p, p1, p2));
	}

	// ref: https://stackoverflow.com/a/1501725, 20.02.2019
	_distToSegmentSquared(p, v, w) {
		function sqr(x) {
			return x * x;
		}

		function dist2(v, w) {
			return sqr(v.x - w.x) + sqr(v.y - w.y);
		}

		var l2 = dist2(v, w);
		if (l2 == 0) return dist2(p, v);
		var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
		t = Math.max(0, Math.min(1, t));
		return dist2(p, {
			x: v.x + t * (w.x - v.x),
			y: v.y + t * (w.y - v.y)
		});
	}

	getCenter(node) {
		if (node.shape == "Circle") return { x: node.x, y: node.y };
		if (node.shape == "Rectangle")
			return { x: node.x + node.w / 2, y: node.y + node.h / 2 };
	}

	// Sort the selected nodes based on x coordinate to get them in the right order
	xSorter(n1, n2) {
		if (n1.x < n2.x) return -1;
		if (n1.x > n2.x) return 1;
		return 0;
	}

	// Sort the selected nodes based on node value to get them in the right order
	vSorter(n1, n2) {
		if (n1.v < n2.v) return -1;
		if (n1.v > n2.v) return 1;
		return 0;
	}

	// Sets x,y touch position to the same variable
	// used by mouse events.
	setEventOffset(e) {
		if (e.offsetX !== undefined && e.offsetY !== undefined) return;

		let rect = this.canvas.getBoundingClientRect();

		if (e.targetTouches !== undefined && e.targetTouches.length > 0) {
			e.offsetX = e.targetTouches[0].clientX - rect.left;
			e.offsetY = e.targetTouches[0].clientY - rect.top;
		} else if (e.changedTouches !== undefined && e.changedTouches.length > 0) {
			e.offsetX = e.changedTouches[0].clientX - rect.left;
			e.offsetY = e.changedTouches[0].clientY - rect.top;
		} else {
			e.offsetX = -1;
			e.offsetY = -1;
		}
	}

	checkSteppingButtons(e) {
		if (this.steppingButtons == undefined) return false;

		for (let i = 0; i < this.steppingButtons.length; i++) {
			let btn = this.steppingButtons[i];
			let inside = this.isPointInRectangle(
				e.offsetX,
				e.offsetY,
				btn.position.x,
				btn.position.y,
				btn.position.width,
				btn.position.height
			);

			if (inside) {
				btn.handler(e);
				return true;
			}
		}
		return false;
	}

	moveGraphInsideWorld() {
		let dx = 0;
		let dy = 0;
		let maxX = this.drawBuffer.width;
		let maxY = this.drawBuffer.height;

		// Find the nodes which are the furthest away
		// from the world border.
		for (let i = 0; i < this.nodes.length; i++) {
			let n = this.nodes[i];

			if (n.x > maxX) {
				// Cant move the graph if there are nodes outside both edges
				if (Math.sign(dx) == 1) return;

				let ndx = maxX - n.x;
				if (ndx > dx) dx = ndx;
			}

			if (n.y > maxY) {
				if (Math.sign(dy) == 1) return;
				let ndy = maxY - n.y;
				if (ndy > dy) dy = ndy;
			}

			if (n.x < 0) {
				if (Math.sign(dx) == -1) return;
				let ndx = maxX - n.x;
				if (ndx > dx) dx = ndx;
			}

			if (n.y < 0) {
				if (Math.sign(dy) == -1) return;
				let ndy = maxY - n.y;
				if (ndy > dy) dy = ndy;
			}
		}

		if (dx !== 0 || dy !== 0) {
			this.camera.centerX += dx;
			this.camera.centerY += dy;

			for (let i = 0; i < this.nodes.length; i++) {
				let n = this.nodes[i];
				n.x += dx;
				n.y += dy;
			}
		}
	}

	centerCameraOnGraph() {
		let tx = 0;
		let ty = 0;

		for (let i = 0; i < this.nodes.length; i++) {
			let center = this.getCenter(this.nodes[i]);
			tx += center.x;
			ty += center.y;
		}

		this.camera.centerX = tx / this.nodes.length;
		this.camera.centerY = ty / this.nodes.length;
	}

	addSteppingButtons() {
		this.steppingButtons = [];
		let numOfSteps = this.controllers[this.controlType].steps.length;

		let stepBack = () => {
			if (this.currentStep > 0) {
				this.currentStep -= 1;
				this.controllers[this.controlType].parseSteps();
				this.addSteppingButtons();
			}
		};

		let stepForward = () => {
			if (this.currentStep < numOfSteps - 1) {
				this.currentStep += 1;
				this.controllers[this.controlType].parseSteps();
				this.addSteppingButtons();
			}
		};

		this.steppingButtons.push({
			data: {
				text: "<--",
				relSize: this.relSize
			},
			handler: stepBack
		});
		this.steppingButtons.push({
			data: {
				text: (this.currentStep + 1) + " / " + numOfSteps,
				relSize: this.relSize
			},
			handler: () => {}
		});
		this.steppingButtons.push({
			data: {
				text: "-->",
				relSize: this.relSize
			},
			handler: stepForward
		});

		this.calculateSteppingButtonsPosition();
		this.dirty = true;
		this.drawStatic();
	}

	calculateSteppingButtonsPosition() {
		let numBtns = this.steppingButtons.length;
		// Every button get an equal amount of screen size
		let maxButtonWidth = this.staticBuffer.width / numBtns;
		let maxButtonHeight = this.staticBuffer.height / 10;
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
				y: this.staticBuffer.height - maxButtonHeight + yPadding,
				width: btnWidth,
				height: btnHeight
			};
		}
	}

	/*
		Returns the intersection point and side, or undefined if there is
			no intersection.
	*/
	lineIntersectsNode(line, node) {
		if (node.shape == "Rectangle") {
			// Top
			let t = this.lineSegmentIntersection(line, {
				x1: node.x,
				y1: node.y,
				x2: node.x + node.w,
				y2: node.y
			});
			if (t) return { p: t, side: "Top" };

			// Bottom
			let b = this.lineSegmentIntersection(line, {
				x1: node.x,
				y1: node.y + node.h,
				x2: node.x + node.w,
				y2: node.y + node.h
			});
			if (b) return { p: b, side: "Bottom" };

			// Right
			let r = this.lineSegmentIntersection(line, {
				x1: node.x + node.w,
				y1: node.y,
				x2: node.x + node.w,
				y2: node.y + node.h
			});
			if (r) return { p: r, side: "Right" };

			// Left
			let l = this.lineSegmentIntersection(line, {
				x1: node.x,
				y1: node.y,
				x2: node.x,
				y2: node.y + node.h
			});
			if (l) return { p: l, side: "Left" };

			return undefined;
		} else if (node.shape == "Circle") {
			let intersections = this.lineSegmentEllipseIntersection(line, node);
			if (intersections.length > 1)
				console.error("More than one intersection!");
			if (intersections.length == 0) {
				console.error("No intersection :(");
				return undefined;
			}

			return { p: intersections[0] };
		}

		console.error("No handler for this node");
		return undefined;
	}

	/*
		Returns the intersection point of a line segment and an ellipse.
		Modified version of: (02.04.2019)
		http://csharphelper.com/blog/2017/08/calculate-where-a-line-segment-and-an-ellipse-intersect-in-c/
	*/
	lineSegmentEllipseIntersection(line, ellipse) {
		// Because the function changes the x,y properties of the ellipse,
		// a copy should be used.
		ellipse = JSON.parse(JSON.stringify(ellipse));

		let pt1 = { x: line.x1, y: line.y1 };
		let pt2 = { x: line.x2, y: line.y2 };

		// Translate so the ellipse is centered at the origin.
		let cx = ellipse.x;
		let cy = ellipse.y;
		ellipse.x -= cx;
		ellipse.y -= cy;
		pt1.x -= cx;
		pt1.y -= cy;
		pt2.x -= cx;
		pt2.y -= cy;

		// Get the semimajor and semiminor axes.
		let a = ellipse.w;
		let b = ellipse.h;

		// Calculate the quadratic parameters.
		let A = (pt2.x - pt1.x) * (pt2.x - pt1.x) / a / a + (pt2.y - pt1.y) * (pt2.y - pt1.y) / b / b;
		let B = 2 * pt1.x * (pt2.x - pt1.x) / a / a + 2 * pt1.y * (pt2.y - pt1.y) / b / b;
		let C = pt1.x * pt1.x / a / a + pt1.y * pt1.y / b / b - 1;

		// Make a list of t values.
		let t_values = [];

		// Calculate the discriminant.
		let discriminant = B * B - 4 * A * C;

		if (discriminant == 0) {
			// One real solution.
			t_values.push(-B / 2 / A);
		} else if (discriminant > 0) {
			// Two real solutions.
			t_values.push((-B + Math.sqrt(discriminant)) / 2 / A);
			t_values.push((-B - Math.sqrt(discriminant)) / 2 / A);
		}

		// Convert the t values into points.
		let points = [];
		for (let i = 0; i < t_values.length; i++) {
			let t = t_values[i];
			// If the points are on the segment (or we
			// don't care if they are), add them to the list.
			if (t >= 0 && t <= 1) {
				let x = pt1.x + (pt2.x - pt1.x) * t + cx;
				let y = pt1.y + (pt2.y - pt1.y) * t + cy;
				points.push({ x: x, y: y });
			}
		}

		// Return the points.
		return points;
	}

	/*
		Returns the intersection point of two line segments.
		Modified version of https://stackoverflow.com/a/1968345/ (01.04.2019)

		Line 1 is defined by (l1.x1, l1.y1) and (l1.x2, l1.y2)
		Line 2 is defined by (l2.x1, l2.y1) and (l2.x2, l2.y2)

		Returns { x, y } if there was an intersection, or
			undefined if there is no intersection.
	*/
	lineSegmentIntersection(l1, l2) {
		let s1_x, s1_y, s2_x, s2_y;
		s1_x = l1.x2 - l1.x1;
		s1_y = l1.y2 - l1.y1;
		s2_x = l2.x2 - l2.x1;
		s2_y = l2.y2 - l2.y1;

		let s, t;
		s = (-s1_y * (l1.x1 - l2.x1) + s1_x * (l1.y1 - l2.y1)) / (-s2_x * s1_y + s1_x * s2_y);
		t = ( s2_x * (l1.y1 - l2.y1) - s2_y * (l1.x1 - l2.x1)) / (-s2_x * s1_y + s1_x * s2_y);

		if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
			// Collision detected
			return {
				x: l1.x1 + (t * s1_x),
				y: l1.y1 + (t * s1_y)
			};
		}

		return undefined; // No collision
	}
}
