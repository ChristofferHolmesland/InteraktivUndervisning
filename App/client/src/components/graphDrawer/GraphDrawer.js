import Graph0 from "./controllers/Graph0.js";
import Graph1 from "./controllers/Graph1.js";
import Sort from "./controllers/Sort.js";
import Djikstra from "./controllers/Djikstra.js";
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
			Possible values: Circle, Square
		*/
		this.nodeShape = config.nodeShape || "Square";
		/*
			Determines how the user can interact with the canvas.
			Graph0 = Buttons are shown.
			Graph1 = Simple mode 
			Sort = Quicksort or Mergesort
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

	constructor(canvas, config) {
		// Radius of nodes.
		this.R = 25;
		// Relative size of square nodes compared to circle nodes.
		this.SQUARE_FACTOR = 1.5;
		// How often the canvas should be updated.
		this.FPS = 60;
		// Milliseconds between each update.
		this.MS_PER_FRAME = 1000 / this.FPS;
		// Device type, "Desktop" or "Mobile"
		this.DEVICE = "Mobile";
		// Size of the font in px.
		this.fontHeight = 10;

		this._config(config);

		/*
			Nodes in the graph 
			{
				x, y, r, v, 
				selected (can be undefined), 
				culled (can be undefined),
				fillColor (undefined => white),
				strokeColor (undefined => black)
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

		// Flag which determines if the graph state should
		// be redrawn. Default value is true, so the UI
		// is rendered.
		this.dirty = true;

		// Canvas used to display graph.
		this.canvas = canvas;
		this.canvasContext = canvas.getContext("2d");

		// Offscreen canvas used for drawing (mostly) static
		// content like the UI. This draws in canvas space.
		this.staticBuffer = document.createElement("CANVAS");
		this.staticBuffer.width = canvas.width;
		this.staticBuffer.height = canvas.height;
		this.staticContext = this.staticBuffer.getContext("2d");

		// Offscreen canvas used for drawing. This draws
		// in world space and the camera converts it to canvas space.
		this.drawBuffer = document.createElement("CANVAS");
		this.drawBuffer.width = canvas.width * 3;
		this.drawBuffer.height = canvas.height * 3;
		this.drawContext = this.drawBuffer.getContext("2d");

		let down = function(e) {
			e.preventDefault();
			this.setEventOffset(e);

			let consumed = this.controllers[this.controlType].mouseDownHandler(e);
			if (consumed) return;

			// Gesture detection
			this.detectPanGesture(e);
			this.detectZoomGesture(e);
		}.bind(this);

		this.canvas.addEventListener("mousedown", down);
		this.canvas.addEventListener("touchstart", down);

		// Updates the GraphDrawer every <MS_PER_FRAME> milliseconds.
		this.intervalId = setInterval((function() {
			this.update.call(this);
		}).bind(this), this.MS_PER_FRAME);

		this.camera = new Camera(this);

		this.controllers = {
			Graph0: new Graph0(this, config.graph),
			Graph1: new Graph1(this),
			Sort: new Sort(this, config.sort),
			Djikstra: new Djikstra(this, config.djikstra)
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
			camera.Left,
			camera.Top,
			camera.Width,
			camera.Height,
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

			let cx1 = this.edges[i].n1.x;
			let cy1 = this.edges[i].n1.y;
			let cx2 = this.edges[i].n2.x;
			let cy2 = this.edges[i].n2.y;

			if (this.nodeShape == "Square") {
				let n1 = this.edges[i].n1;
				let n2 = this.edges[i].n2;
				cx1 += n1.r / 2;
				cy1 += n1.r / 2;
				cx2 += n2.r / 2;
				cy2 += n2.r / 2;
			}

			this.drawContext.beginPath();
			this.drawContext.moveTo(cx1, cy1);
			this.drawContext.lineTo(cx2, cy2);

			if (this.edges[i].strokeColor)
				this.drawContext.strokeStyle = this.edges[i].strokeColor;
			this.drawContext.stroke();
			this.drawContext.strokeStyle = "black";
			this.drawContext.closePath();

			// Draw an arrow, ref: https://stackoverflow.com/a/6333775, 20.02.2019
			if (
				this.directedEdges &&
				(this.edges[i].directed == undefined ||
					this.edges[i].directed == true)
			) {
				let dx = cx1 - cx2;
				let dy = cy1 - cy2;
				let magnitude = Math.sqrt(dx * dx + dy * dy);
				let nx = dx / magnitude;
				let ny = dy / magnitude;
				let a = { x: this.edges[i].n2.x, y: this.edges[i].n2.y };
				a.x += nx * this.edges[i].n2.r;
				a.y += ny * this.edges[i].n2.r;
				let b = { x: a.x, y: a.y };
				b.x += nx * this.edges[i].n2.r;
				b.y += ny * this.edges[i].n2.r;

				let headlen = 20;
				let angle = Math.atan2(a.y - b.y, a.x - b.x);
				this.drawContext.beginPath();
				this.drawContext.moveTo(b.x, b.y);
				this.drawContext.lineTo(a.x, a.y);
				this.drawContext.lineTo(
					a.x - headlen * Math.cos(angle - Math.PI / 6),
					a.y - headlen * Math.sin(angle - Math.PI / 6)
				);
				this.drawContext.moveTo(a.x, a.y);
				this.drawContext.lineTo(
					a.x - headlen * Math.cos(angle + Math.PI / 6),
					a.y - headlen * Math.sin(angle + Math.PI / 6)
				);
				this.drawContext.stroke();
			}

			if (this.displayEdgeValues && this.edges[i].v !== undefined) {
				let tx = (cx1 + cx2) / 2 + 5;
				let ty = (cy1 + cy2) / 2 + 5;
				this.drawContext.fillText(this.edges[i].v, tx, ty);
			}
		}
		// Nodes.
		for (let i = 0; i < this.nodes.length; i++) {
			if (this.camera.cull(this.nodes[i], true)) continue;
			this.drawContext.beginPath();
			if (this.nodeShape == "Circle") {
				this.drawContext.arc(
					this.nodes[i].x,
					this.nodes[i].y,
					this.R,
					0,
					2 * Math.PI
				);
			} else if (this.nodeShape == "Square") {
				this.drawContext.rect(
					this.nodes[i].x,
					this.nodes[i].y,
					this.nodes[i].r,
					this.nodes[i].r
				);
			}
			if (this.nodes[i].fillColor == undefined)
				this.drawContext.fillStyle = "white";
			else this.drawContext.fillStyle = this.nodes[i].fillColor;

			if (this.nodes[i].strokeColor == undefined)
				this.drawContext.strokeStyle = "black";
			else this.drawContext.strokeStyle = this.nodes[i].strokeColor;

			this.drawContext.fill();
			this.drawContext.stroke();
			this.drawContext.closePath();
			this.drawContext.strokeStyle = "black";
			// Text
			this.drawContext.fillStyle = "black";
			/*
				Width is the only property
				https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics
			*/
			let textWidth = this.drawContext.measureText(this.nodes[i].v).width;
			let ox = this.nodeShape == "Circle" ? 0 : this.nodes[i].r / 2;
			let oy = this.nodeShape == "Circle" ? 0 : this.nodes[i].r / 2;
			this.drawContext.fillText(
				this.nodes[i].v,
				this.nodes[i].x - textWidth / 2 + ox,
				this.nodes[i].y + this.fontHeight / 2 + oy
			);
		}

		for (let i = 0; i < this.nodes.length; i++)
			this.nodes[i].culled = undefined;
	}

	/*
		Updates the GraphDrawer state.
	*/
	update() {
		if (this.dirty) {
			// Controllers can implement the dirtyUpdate function to be notified
			// before a draw happens.
			if (this.controllers[this.controlType].dirtyUpdate != undefined) {
				this.controllers[this.controlType].dirtyUpdate();
			}

			this.draw();
			this.switchBuffers();
			this.dirty = false;
		}
	}

	/*
		Lets the user edit the value on a node.
		Can also be used on edges, because they share the v property.
	*/
	_editNode(node) {
		// This is the only way to open a keyboard in mobile browsers.
		let new_value = prompt("Enter new value:", node.v);
		if (new_value == undefined) return;
		node.v = new_value;
		this.dirty = true;
	}

	/*
		Can be called to let the user zoom using two fingers.
	*/
	detectZoomGesture(e) {
		if (e.targetTouches == undefined) return;
		if (e.targetTouches.length < 2) return;

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

				// Zoom out
				if (pdist > ndist) this.camera.changeZoom(-0.1);
				// Zoom in
				else if (pdist < ndist) this.camera.changeZoom(0.1);
			}

			this.dirty = true;
			previousFingers = newFingers;
		}.bind(this);

		let zoomStopHandler = function() {
			this.canvas.removeEventListener("touchmove", zoomHandler);
			this.canvas.removeEventListener("touchend", zoomStopHandler);
			this.canvas.removeEventListener("touchcancel", zoomStopHandler);
			this.canvas.removeEventListener("touchleave", zoomStopHandler);
		}.bind(this);

		this.canvas.addEventListener("touchmove", zoomHandler);
		this.canvas.addEventListener("touchend", zoomStopHandler);
		this.canvas.addEventListener("touchcancel", zoomStopHandler);
		this.canvas.addEventListener("touchleave", zoomStopHandler);
	}

	/*
		Can be called to determine if the event e is the start of a panning gesture.
		This let's the user move the camera around the world.
	*/
	detectPanGesture(e) {
		if (e.touches !== undefined) {
			if (e.touches.length > 1) return;
		}

		let currentPosition = { x: e.offsetX, y: e.offsetY };
		// How much the camera moves relative to how far the mouse is dragged.
		const velocityFactor = 0.95;
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
					frustum.Width / 2,
					this.drawBuffer.width - frustum.Width / 2
				);
				hasMoved = true;
			}
			if (dY > threshold || dY < -threshold) {
				dY -= Math.sign(dY) * threshold;
				this.camera.translateY(
					-dY,
					frustum.Height / 2,
					this.drawBuffer.height - frustum.Height / 2
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
			if (this.isPointInNode(x, y, this.nodes[i].x, this.nodes[i].y)) {
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
		Checks whether a point (x, y) is inside a node (nx, ny).
	*/
	isPointInNode(x, y, nx, ny) {
		if (this.nodeShape == "Circle") {
			return this.isPointInCircle(x, y, nx, ny, this.R);
		}
		if (this.nodeShape == "Square") {
			return this.isPointInSquare(
				x,
				y,
				nx,
				ny,
				this.R * this.SQUARE_FACTOR
			);
		}
	}

	/*
		Checks whether a point (x, y) is inside a circle
		with center (nx, ny) and radius r.
	*/
	isPointInCircle(x, y, nx, ny, r) {
		return (x - nx) * (x - nx) + (y - ny) * (y - ny) <= r * r;
	}

	/*
		Checks whether a point (x, y) is inside a square with radius r.
		Top left corner of square (nx, ny).
	*/
	isPointInSquare(x, y, nx, ny, r) {
		if (x < nx || x > nx + r) return false;
		if (y < ny || y > ny + r) return false;
		return true;
	}

	/*
		Calculates how far a point (x, y) is from a given edge.
	*/
	distanceFromEdgeToPoint(edge, x, y) {
		let p = {
			x: x,
			y: y
		}

		let p1 = {
			x: edge.n1.x,
			y: edge.n1.y
		};

		let p2 = {
			x: edge.n2.x,
			y: edge.n2.y
		};

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
}
