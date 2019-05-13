/* NOT DONE
    Let's the user create and modify graphs.
    The user interaction state is decided by clicking on
    one of the nodes and then selecting something from the panel.
*/
export default class Graph1 {
	constructor(graphDrawer) {
		this.gd = graphDrawer;
	}

	mouseDownHandler(e) {
		this.gd.dirty = true;

		if (this.gd.nodes.length == 0) {
			return this.gd.controllers["Graph0"].addNode(e);
		}

		let node = this.gd.getNodeAtCursor(e).node;
		if (node == undefined) {
			this.showUIPanel = false;
			return false;
		}

		this.drawUIPanel(node);
		this.showUIPanel = true;

		return true;
	}

	drawUIPanel(node) {
		this.gd.staticContext.clearRect(
			0,
			0,
			this.gd.staticBuffer.width,
			this.gd.staticBuffer.height
		);

		let nodeOnCanvas = this.gd.camera.unproject(node.x, node.y);
		let borderX = nodeOnCanvas.x + node.r;
		let borderY = nodeOnCanvas.y - 1.5 * node.r;
		// Divide the panel into a 2x3 grid.
		let borderWidth = node.r * 4;
		let borderHeight = node.r * 4;
		let rowHeight = borderHeight / 3;
		//let columnWidth = borderWidth / 2;

		// Border
		this.gd.staticContext.rect(borderX, borderY, borderWidth, borderHeight);
		this.gd.staticContext.stroke();
		// Value input
		this.gd.staticContext.fillStyle = "black";
		let textWidth = this.gd.staticContext.measureText(node.v).width;
		this.gd.staticContext.fillText(
			node.v,
			borderX + borderWidth / 2 - textWidth / 2,
			borderY + rowHeight / 2 + this.gd.fontHeight
		);

		// Add button

		// Remove button

		// Join button

		// Move button

		// Return location of buttons
	}
}
