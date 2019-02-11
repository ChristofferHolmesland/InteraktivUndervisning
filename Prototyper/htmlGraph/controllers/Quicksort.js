/*
    Let's the user perform a quicksort on an array.
    // TODO: Add merge sort
    // TODO: Parse step list to arrays
    // TODO: Generate step list from arrays
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
        this.extractType = config.extractType || "xSorter";
        this.joinType = config.joinType || "vSorter";

        // If there are some starting steps, they are parsed
        // and put into the world.
        if (config.steps) {
            this.steps = config.steps;
            this._parseSteps();
        }
    }

    constructor(graphDrawer, config) {
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

        this._config(config);
    }

    /*
        Called by the GraphDrawer when the user presses one of their mouse
        buttons.
    */
    mouseDownHandler(e) {
        console.log("Click");

        if (this.gd.operatingMode == "Interactive") {
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
        }

        return false;
    }

    checkNodes(e) {
        // These need to be defined inside this function, so .bind(this) can be used
        let checkNodesMouseUp = function(newE) {
            console.log("up");
            this.gd.canvas.removeEventListener("mouseup", checkNodesMouseUp);
            this.gd.canvas.removeEventListener("mousemove", checkNodesMouseMove);

            // If there is just one selected node,
            // it's value can be edited, it can be removed
            // Display buttons to mobile users when they click on a node
            let relSize = 0.9;
            let node = this.gd.getNodeAtCursor(e).node;
            if (this.gd.DEVICE == "Mobile") {
                // Displays buttons for the clicked node
                console.log("adding buttons");
                this.clickedNode = node;
                if (this.clickedNode == undefined) return;
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
                        text: "Move array",
                        relSize: relSize,
                    },
                    handler: e =>  this.mobileSelectedButtons().move(e, ai)
                });

                this.clickedButtons.push({
                    data: {
                        text: "Extract array",
                        relSize: relSize,
                    },
                    handler: e =>  this.mobileSelectedButtons().extract(e, ai)
                });
            } else {
                this.clickedButtons.push({
                    data: {
                        text: "Join to array",
                        relSize: relSize,
                    },
                    handler: e => this.mobileSelectedButtons().join(e)
                });
            }

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

    mobileSelectedButtons(e) {
        let initializeNewArray = function(sortType) {
            let sorter = sortType == "xSorter" ? this.gd.xSorter : this.gd.vSorter;
            this.selectedNodes.sort(sorter);
            
            let newArr = this.getNewArray(this.selectedNodes[0].x,
                                          this.selectedNodes[0].y + 100);

            // Clones the selected nodes and puts them in the new array
            for (let i = 0; i < this.selectedNodes.length; i++) {
                let clone = JSON.parse(JSON.stringify(this.selectedNodes[i]));
                clone.fillColor = undefined;
                clone.strokeColor = undefined;

                newArr.nodes.push(clone);
                this.gd.nodes.push(clone);
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
            move: function(e, ai) {
                let info = this._findArrayPosition(this.selectedNodes[0]);
                this.movingArray = info.ai;
                this.startPositionOfMove.x = this.selectedNodes[0].x;
                this.startPositionOfMove.y = this.selectedNodes[0].y;
            }.bind(this),
            join: function(e) {
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
        console.log("drawing ui");
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

        console.log("selected buttons");
        console.log(this.clickedButtons.length);
        // Render selected buttons (Mobile)
        for (let i = 0; i < this.clickedButtons.length; i++) {
            console.log(i);
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
                list: arrToList(this.arrays[0])
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
                            found = true;
                            break;
                        }
                    }
                }

                if (!found) {
                    let pivot = undefined;
                    for (let n = 0; n < c.parents[0].nodes.length; n++) {
                        if (c.parents[0].nodes[n].pivot) {
                            pivot = c.parents[0].nodes[n].v;
                            break;
                        }
                    }

                    steps.push({
                        type: "Split",
                        list: parentList,
                        left: arrToList(arr),
                        pivot: pivot,
                        right: undefined
                    });
                }
            } else if (c.count == 2) {
                // Arrays with two links to it, is a join.

            }
        }

        return steps;
    }

    /*
        Parses the steps from a step list into arrays
    */
    _parseSteps() {
        this.gd.dirty = true;

        // The inital array is placed centered
        // at the top of the canvas relative 
        // to the current camera position.
        let parseInitial = (step) => {
            let p = this.gd.camera.project(
                this.gd.canvas.width / 2,
                0
            );

            // Add some padding between canvas top and array
            let r = this.gd.nodeShape == "Circle" ? this.gd.R : this.gd.R * this.gd.SQUARE_FACTOR;
            p.y += r / 2;

            // Assumes same size nodes
            let arrayWidth = step.list.length * r;
            p.x -= arrayWidth / 2;

            let newArr = this.getNewArray(p.x, p.y);

            for (let i = 0; i < step.list.length; i++) {
                let node = {
                    x: p.x + r * i,
                    y: p.y,
                    r: r,
                    v: step.list[i]
                };

                this.gd.nodes.push(node);
                newArr.nodes.push(node);
            }

            this.arrays.push(newArr);
        };
        
        let parseSplit = (step) => {

        };

        let parseMerge = (step) => {

        };

        for (let i = 0; i < this.steps.length; i++) {
            let step = this.steps[i];
            if (step.type == "Initial") { 
                parseInitial(step);
            } else if (step.type == "Split") {
                parseSplit(step);
            } else if (step.type == "Merge") {
                parseMerge(step);
            } else {
                console.log(`Found invalid step type: ${step.type} 
                    at index ${i}, skipping.`);
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