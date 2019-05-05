export default class Camera {
	constructor(graphDrawer) {
		this.gd = graphDrawer;
		this.canvas = graphDrawer.canvas;
		this.zoomLevel = 1;
		this.minZoomLevel = 0.3;
		this.maxZoomLevel = 2.5;
		// The camera starts centered on the world.
		this.centerX = this.gd.drawBuffer.width / 2;
		this.centerY = this.gd.drawBuffer.height / 2;
		// This determines the dimensions of the camera view.
		// For simplicity it should be the same as the canvas
		// where the world is rendered.
		this.viewportWidth = this.canvas.width;
		this.viewportHeight = this.canvas.height;
	}

	updateToNewCanvasSize() {
		this.viewportWidth = this.canvas.width;
		this.viewportHeight = this.canvas.height;
	}

	changeZoom(dZ, canvasX, canvasY) {
		let oldWorld = this.project(canvasX, canvasY);

		this.zoomLevel += dZ;
		if (this.zoomLevel < this.minZoomLevel)
			this.zoomLevel = this.minZoomLevel;
		if (this.zoomLevel > this.maxZoomLevel)
			this.zoomLevel = this.maxZoomLevel;

		// Translate camera center so the point (canvasX, canvasY) has the
		// same relative position as before.
		let newWorld = this.project(canvasX, canvasY);
		this.centerX += oldWorld.x - newWorld.x;
		this.centerY += oldWorld.y - newWorld.y;
	}

	/* 
		Determines if an object is inside the camera frustum.
		Returns true if the object was culled (removed).

		Culling rule:
			Cull edge if n1 and n2 is culled.
			Cull node if a square with side length R centered at (node.x, node.y)
			doesn't overlap the viewport.
	*/
	cull(object, isNode) {
		if (isNode) {
			return this._cullNode(object);
		}

		this._cullNode(object.n1);
		this._cullNode(object.n2);
		return object.n1.culled && object.n2.culled;
	}

	/*
		Determines if a given node is culled.
	*/
	_cullNode(node) {
		if (node.culled != undefined) return node.culled;
		
		// cameraRect and nodeRect objects can be removed if they're too slow.
		let cameraRect = this.getFrustumFront();
		let nodeRect = this.getNodeRect(node);

		// ref: (modified for our coordinate system)
		// https://stackoverflow.com/questions/306316/determine-if-two-rectangles-overlap-each-other
		node.culled = !(cameraRect.left < nodeRect.right && cameraRect.right > nodeRect.left &&
			cameraRect.top < nodeRect.bottom && cameraRect.bottom > nodeRect.top);
		return node.culled;
	}

	getNodeRect(node) {
		let nodeRect = {};
		
		if (node.shape == "Circle") {
			nodeRect.left = node.x - (node.w / 2);
			nodeRect.right = node.x + (node.w / 2);
			nodeRect.top = node.y - (node.h / 2);
			nodeRect.bottom = node.y + (node.h / 2);
		} else if (node.shape == "Rectangle") {
			nodeRect.left = node.x;
			nodeRect.right = node.x + node.w;
			nodeRect.top = node.y;
			nodeRect.bottom = node.y + node.h;
		}

		return nodeRect;
	}

	/*
		Calculates and returns a rectangle representing the front plane
		off the camera frustum. Back plane isn't needed because
		front dimensions == back dimensions, and we're working in 2D space.
	*/
	getFrustumFront() {
		let cameraRect = {};
		cameraRect.left = this.centerX - this.zoomLevel * (this.viewportWidth / 2);
		cameraRect.right = this.centerX + this.zoomLevel * (this.viewportWidth / 2);
		cameraRect.top = this.centerY - this.zoomLevel * (this.viewportHeight / 2);
		cameraRect.bottom = this.centerY + this.zoomLevel * (this.viewportHeight / 2);
		cameraRect.width = cameraRect.right - cameraRect.left;
		cameraRect.height = cameraRect.bottom - cameraRect.top;
		return cameraRect;
	}

	/*
		Converts canvas coordinates to world coordinates.
	*/
	project(x, y) {
		let frustum = this.getFrustumFront();
		let worldX = (x / this.canvas.width) * frustum.width + frustum.left;
		let worldY = (y / this.canvas.height) * frustum.height + frustum.top;
		return { x: worldX, y: worldY };
	}

	/*
		Converts world coordinates to canvas coordinates
	*/
	unproject(x, y) {
		let frustum = this.getFrustumFront();

		let cameraSpaceX = x - frustum.left;
		let cameraSpaceY = y - frustum.top;

		let canvasX = this.canvas.width * (cameraSpaceX / frustum.width);
		let canvasY = this.canvas.height * (cameraSpaceY / frustum.height);

		return { x: canvasX, y: canvasY };
	}

	/*
		Changes which x coordinate the camera looks at.
		Bound in range (0, drawBuffer width).
	*/
	translateX(x, min, max) {
		this.centerX += x;
		if (this.centerX < min) this.centerX = min;
		else if (this.centerX > max) this.centerX = max;
	}

	/*
		Changes which y coordinate the camera looks at.
		Bound in range (0, drawBuffer height).
	*/
   translateY(y, min, max) {
		this.centerY += y;
		if (this.centerY < min) this.centerY = min;
		else if (this.centerY > max) this.centerY = max;
   }
}