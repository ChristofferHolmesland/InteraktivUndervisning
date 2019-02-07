/*
    Let's the user perform a quicksort on an array.
    // TODO: Add merge sort
*/
class Quicksort {
    constructor(graphDrawer) {
        this.gd = graphDrawer;

        // This doesn't work on mobile, because there is no
        // mouse
        if (this.gd.DEVICE == "Desktop") {
            this.gd.canvas.addEventListener("mousemove", (function (e) {
                this.mouseMoveHandler(e);
            }).bind(this));
        }
    
        /*
            All the arrays stored as a object
            {
                position: { x, y },
                nodes: []
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
        // Button size factor, button size relative to node size.
        this.bsf = 3;

        // Pivot nodes will have their fill color set to this
        this.pivotColor = "#add8e6";

        // Used by desktop users to render buttons on the hovered node
        this.lastHoveredNode = undefined;
        // Same format as this.buttons
        this.hoverButtons = [];

        // Used by mobile users to display buttons to interact with the selected node
        this.selectedNode = undefined;
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
        this.selectedButtons = [];
    }

    mouseDownHandler(e) {
        if (this.arrays.length == 0) {
            this.gd.controllers["Graph0"].addNode(e);
            let node = this.gd.nodes[this.gd.nodes.length - 1];
            this.arrays.push(
                {
                    position: { x: node.x, y: node.y },
                    nodes: [node]
                }
            );
            return true;
        }

        if (this.checkUI(e)) return true;
        if (this.checkNodes(e)) return true;

        return false;
    }

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
        let bSize = hoveredNode.r / this.bsf;
        let bX = hoveredNode.x + hoveredNode.r / 2 - bSize / 2;
        let dP = this.gd.camera.unproject(
            bX,
            hoveredNode.y
        );
        
        this.hoverButtons.push({
            position: {
                x: dP.x,
                y: dP.y,
                width: bSize,
                height: bSize
            },
            handler: ((e) => console.log("Delete clicked")),
            data: {
                type: "Delete"
            }
        });
    }

    checkNodes(e) {
        let node = this.gd.getNodeAtCursor(e).node;

        // Desktop users can click on a node to enter the value
        if (this.gd.DEVICE == "Desktop") {
            if (node == undefined) return false;
            this.gd._editNode(node);
            return true;
        }
        // Display buttons to mobile users when they click on a node
        if (this.gd.DEVICE == "Mobile") {
            this.gd.dirty = true;
            this.selectedButtons = [];
            if (node == this.selectedNode) {
                this.selectedNode = undefined;
                return false;
            }

            this.selectedNode = node;
            if (this.selectedNode == undefined) return false;
            let relSize = 0.9;
            // Edit value
            this.selectedButtons.push({
                data: {
                    text: "Edit value",
                    relSize: relSize
                },
                handler: e =>  this.mobileSelectedButtons().edit(e)
            });
            // Set pivot
            this.selectedButtons.push({
                data: {
                    text: "Set pivot",
                    relSize: relSize
                },
                handler: e => this.mobileSelectedButtons().pivot(e)
            });
            // Delete
            this.selectedButtons.push({
                data: {
                    text: "Delete",
                    relSize: relSize
                },
                handler: e => this.mobileSelectedButtons().del(e)
            });

            let numBtns = this.selectedButtons.length;
            // Every button get an equal amount of screen size
            let maxButtonWidth = this.gd.staticBuffer.width / numBtns;
            let maxButtonHeight = this.gd.staticBuffer.height / 10;
            for (let i = 0; i < numBtns; i++) {
                let btn = this.selectedButtons[i];
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
    }

    mobileSelectedButtons(e) {
        return {
            edit: function(e) {
                this.gd._editNode(this.selectedNode);
            }.bind(this),
            pivot: function(e) {
                if (this.selectedNode.pivot) {
                    this.selectedNode.pivot = undefined;
                    this.selectedNode.fillColor = undefined;
                } else {
                    this.selectedNode.pivot = true;
                    this.selectedNode.fillColor = this.pivotColor;
                }
                this.gd.dirty = true;
            }.bind(this),
            del: function(e) {
                let ai = -1;
                let arrayRemoved = false;
                // Remove node from array
                for (let i = 0; i < this.arrays.length; i++) {
                    let index = this.arrays[i].nodes.indexOf(this.selectedNode);
                    if (index > -1) {
                        ai = i;
                        this.arrays[i].nodes.splice(index, 1);
                        // If there are no more nodes in a array, it's removed
                        if (this.arrays[i].nodes.length == 0) {
                            this.arrays.splice(i, 1);
                            arrayRemoved = true;
                        }
                        break
                    }
                }
                // Remove node from GraphDrawer
                this.gd.nodes.splice(this.gd.nodes.indexOf(this.selectedNode), 1);
                // Fix visuals
                if (!arrayRemoved)
                    this._repositionNodes(ai);
                this.gd.dirty = true;
                this.selectedNode = undefined;
                this.selectedButtons = [];
            }.bind(this)
        }
    }

    checkUI(e) {
        // Checks the + buttons between nodes
        for (let i = 0; i < this.buttons.length; i++) {
            let btn = this.buttons[i];
            if (this.gd.isPointInSquare(e.offsetX, e.offsetY, btn.position.x, btn.position.y, 
                btn.position.width)) {
                btn.handler(btn);
                return true;
            }
        }

        // Checks the selectedButtons
        if (this.gd.DEVICE == "Mobile") {
            for (let i = 0; i < this.selectedButtons.length; i++) {
                let btn = this.selectedButtons[i];
                if (this.gd.isPointInSquare(e.offsetX, e.offsetY, btn.position.x,
                    btn.position.y, btn.position.width)) {
                    btn.handler(e);
                    return true;
                }
            }
        }

        return false;
    }

    dirtyUpdate() {
        this.buttons = [];
        this.drawUI();
    }

    addNewNodeToArray(event) {
        let clickedNode = this.arrays[event.data.ai].nodes[event.data.ni];
        let node = {
            x: clickedNode.x + (event.data.side == "left" ? -clickedNode.r : clickedNode.r),
            y: clickedNode.y,
            r: clickedNode.r,
            v: 0
        }

        this.arrays[event.data.ai].nodes.splice(
            event.data.ni + (event.data.side == "left" ? 0 : 1),
            0,
            node
        )

        // Recalculate node position inside the array
        if (event.data.side == "left") 
            this.arrays[event.data.ai].position.x -= clickedNode.r;
        this._repositionNodes(event.data.ai);

        this.gd.nodes.push(node);
        this.gd.dirty = true;
    }

    _repositionNodes(ai) {
        let start = this.arrays[ai].position
        for (let ni = 0; ni < this.arrays[ai].nodes.length; ni++) {
            let node = this.arrays[ai].nodes[ni];
            // Assumes all the nodes have the same width
            node.x = start.x + ni * node.r;
            node.y = start.y;
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
                    // Only render + buttons on the selected node
                    if (node != this.selectedNode) continue;
                    this._renderAddNodeButton(node, "left", ai, ni);
                    this._renderAddNodeButton(node, "right", ai, ni);
                }
            }
            this.gd.staticContext.closePath();
        }

        // Render hover buttons
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

        // Render selected buttons
        for (let i = 0; i < this.selectedButtons.length; i++) {
            let btn = this.selectedButtons[i];
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

    _renderAddNodeButton(node, side, ai, ni) {
        let bSize = node.r / this.bsf;
        let bX = node.x + node.r - bSize / 2;
        if (side == "left") {
            bX -= node.r;
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
}