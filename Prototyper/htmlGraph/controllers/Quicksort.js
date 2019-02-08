/*
    Let's the user perform a quicksort on an array.
    // TODO: Add merge sort
*/
class Quicksort {
    _config(config) {
        // Button size factor, button size relative to node size.
        this.bsf = config.bsf || 3;
        // Pivot nodes will have their fill color set to this
        this.pivotColor = config.pivotColor || "#add8e6";
        // Selected nodes will have their stroke color set to this
        this.selectedColor = config.selectedColor || "red";
        // Determines if extracted arrays should be sorted or not
        // when they are placed. Sorted: "vSorter", not sorted: "xSorter".
        this.sortType = config.sortType || "xSorter";
    }

    constructor(graphDrawer, config) {
        this.gd = graphDrawer;
        this._config(config);
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
    }

    /*
        Called by the GraphDrawer when the user presses one of their mouse
        buttons.
    */
    mouseDownHandler(e) {
        // If there are no arrays, the first click creates the first node.
        if (this.arrays.length == 0) {
            this.gd.controllers["Graph0"].addNode(e);
            let node = this.gd.nodes[this.gd.nodes.length - 1];
            this.arrays.push(
                {
                    position: { x: node.x, y: node.y },
                    nodes: [node],
                    links: []
                }
            );
            return true;
        }

        if (this.checkUI(e)) return true;
        if (this.checkNodes(e)) return true;

        return false;
    }

    checkNodes(e) {
        // These need to be defined inside this function, so .bind(this) can be used
        let checkNodesMouseUp = function(newE) {
            this.gd.canvas.removeEventListener("mouseup", checkNodesMouseUp);
            this.gd.canvas.removeEventListener("mousemove", checkNodesMouseMove);

            // If all of the selected nodes are in the same array
            // they can be extracted as a new array
            let ai = this._findArrayPosition(this.selectedNodes[0]).ai;
            for (let i = 1; i < this.selectedNodes.length; i++) {
                if (ai != this._findArrayPosition(this.selectedNodes[i]).ai) {
                    // TODO: Implement array joining
                    return;
                }
            }

            this.clickedButtons.push({
                data: {
                    text: "Extract array",
                    relSize: 0.9,
                },
                handler: e =>  this.mobileSelectedButtons().extract(e, ai)
            });
            this._calculatePositionForClickedButtons();
            this.gd.dirty = true;
        }.bind(this);

        let checkNodesMouseMove = function(newE) {
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
        // Lets the user select multiple nodes
        if (node != undefined) {
            this.selectedNodes.push(node);
            this.gd.canvas.addEventListener("mousemove", checkNodesMouseMove);
            this.gd.canvas.addEventListener("mouseup", checkNodesMouseUp);
        }

        // Desktop users can click on a node to enter the value
        if (this.gd.DEVICE == "Desktop") {
            if (node == undefined) return false;
            this.gd._editNode(node);
            return true;
        }
        // Display buttons to mobile users when they click on a node
        if (this.gd.DEVICE == "Mobile") {
            // Displays buttons for the clicked node
            this.clickedButtons = [];
            if (node == this.clickedNode) {
                if (node != undefined)
                    node.strokeColor = undefined;
                this.clickedNode = undefined;
                return false;
            }

            if (this.clickedNode != undefined)
                this.clickedNode.strokeColor = undefined;
            if (node != undefined)
                node.strokeColor = this.selectedColor;

            this.clickedNode = node;
            if (this.clickedNode == undefined) return false;
            let relSize = 0.9;
            // Edit value
            this.clickedButtons.push({
                data: {
                    text: "Edit value",
                    relSize: relSize
                },
                handler: e =>  this.mobileSelectedButtons().edit(e)
            });
            // Set pivot
            this.clickedButtons.push({
                data: {
                    text: "Set pivot",
                    relSize: relSize
                },
                handler: e => this.mobileSelectedButtons().pivot(e)
            });
            // Delete
            this.clickedButtons.push({
                data: {
                    text: "Delete",
                    relSize: relSize
                },
                handler: e => this.mobileSelectedButtons().del(e)
            });
            this._calculatePositionForClickedButtons();
            return true;
        }
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

    mobileSelectedButtons(e) {
        return {
            extract: function(e, ai) {
                // Sort the selected nodes based on x coordinate to get them in the right order
                let xSorter = function(n1, n2) {
                    if (n1.x < n2.x) return -1;
                    if (n1.x > n2.x) return 1;
                    return 0;
                };
                // Sort the selected nodes based on node value to get them in the right order
                let vSorter = function(n1, n2) {
                    if (n1.v < n2.v) return -1;
                    if (n1.v > n2.v) return 1;
                    return 0;
                }

                let sorter = this.sortType == "xSorter" ? xSorter : vSorter;
                this.selectedNodes.sort(sorter);
                
                let newArr = {};
                newArr.nodes = [];
                newArr.links = [];
                newArr.position = {
                    x: this.selectedNodes[0].x,
                    y: this.selectedNodes[0].y + 100
                }

                // Clones the selected nodes and puts them in the new array
                for (let i = 0; i < this.selectedNodes.length; i++) {
                    let clone = JSON.parse(JSON.stringify(this.selectedNodes[i]));
                    clone.fillColor = undefined;
                    clone.strokeColor = undefined;
                    
                    newArr.nodes.push(clone);
                    this.gd.nodes.push(clone);
                }

                this.arrays.push(newArr);
                this.arrays[ai].links.push(newArr);
                this._repositionNodes(this.arrays.length - 1);

                // Reset selected nodes
                for (let i = 0; i < this.selectedNodes.length; i++)
                    this.selectedNodes[i].strokeColor = undefined;
                this.selectedNodes = [];
                this.clickedNode = undefined;
                this.clickedButtons = [];
                this.gd.dirty = true;
            }.bind(this),
            edit: function(e) {
                this.gd._editNode(this.clickedNode);
            }.bind(this),
            pivot: function(e) {
                if (this.clickedNode.pivot) {
                    this.clickedNode.pivot = undefined;
                    this.clickedNode.fillColor = undefined;
                } else {
                    this.clickedNode.pivot = true;
                    this.clickedNode.fillColor = this.pivotColor;
                }
                this.gd.dirty = true;
            }.bind(this),
            del: function(e) {
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
            if (this.gd.isPointInSquare(e.offsetX, e.offsetY, btn.position.x, btn.position.y, 
                btn.position.width)) {
                btn.handler(btn);
                return true;
            }
        }

        // Checks the selectedButtons
        if (this.gd.DEVICE == "Mobile") {
            for (let i = 0; i < this.clickedButtons.length; i++) {
                let btn = this.clickedButtons[i];
                if (this.gd.isPointInSquare(e.offsetX, e.offsetY, btn.position.x,
                    btn.position.y, btn.position.width)) {
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

    /*
        Calculate node positions based on their position in a given array
    */
    _repositionNodes(ai) {
        let start = this.arrays[ai].position
        for (let ni = 0; ni < this.arrays[ai].nodes.length; ni++) {
            let node = this.arrays[ai].nodes[ni];
            // Assumes all the nodes have the same width
            node.x = start.x + ni * node.r;
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
}