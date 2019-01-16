/*
    Adds graph drawing functionality to a canvas object.

    // TODO: 
            Figure out the best way to let both desktop and mobile 
            users interact with the camera.

    The GraphDrawer works in three different coordinate spaces:
        World is where the nodes and edges are defined. This should generally
            be larger than the other two.
        Camera space is the interface between the world and the canvas.
            GraphDrawer assumes that the camera space size is the same
            as the canvas space size, because this makes zooming functionality
            a lot simpler.
        Canvas space is where the user interacts with the world.
*/
class GraphDrawer {
    /*
        Private and public class fields are experimental and
        shouldn't be used.
    */
    constructor(canvas) {
        // Radius of nodes.
        this.R = 25;
        // How often the canvas should be updated.
        this.FPS = 60;
        // Milliseconds between each update.
        this.MS_PER_FRAME = 1000 / this.FPS;
    
        // Nodes in the graph {x, y, r, v, culled (can be undefined)}.
        this.nodes = [];
        // Edges between nodes {n1, n2}.
        this.edges = [];
        
        // Current interaction state.
        this.currentState = "add";
        
        // Flag which determines if the graph state should
        // be redrawn.
        this.dirty = false;

        // Every interaction state and event handler.
        this.stateHandlers = {
            "add": this.addNode,
            "remove": this.removeNode,
            "join": this.joinNode,
            "move": this.moveNode,
            "edit": this.editNode
        }

        // Binds the "this" context to the GraphDrawer object.
        for (let key in this.stateHandlers) {
            // Doesn't bind inherited properties.
            if (!this.stateHandlers.hasOwnProperty(key)) continue;
            this.stateHandlers[key] = this.stateHandlers[key].bind(this);
        }

        // Canvas used to display graph.
        this.canvas = canvas;
        this.canvasContext = canvas.getContext("2d");

        // Offscreen canvas used for drawing.
        this.drawBuffer = document.createElement("CANVAS");
        this.drawBuffer.width = canvas.width * 3;
        this.drawBuffer.height = canvas.height * 3;
        this.drawContext = this.drawBuffer.getContext("2d");

        // When the mouse is clicked the event handler for the
        // current state is called.
        this.canvas.addEventListener("mousedown", (function(e) {
            this.stateHandlers[this.currentState](e);

            // Panning gesture detection
            let currentPosition = this.camera.project(e.offsetX, e.offsetY);
            
            let panMoveHandler = function(newE) {
                let newPosition = this.camera.project(newE.offsetX, newE.offsetY);
                
                let dX = newPosition.x - currentPosition.x;
                let dY = newPosition.y - currentPosition.y;
                this.camera.centerX += dX;
                this.camera.centerY += dY;
                this.dirty = true;

                currentPosition = newPosition;
            }.bind(this);

            let panUpHandler = function(newE) {
                this.canvas.removeEventListener("mousemove", panMoveHandler);
                this.canvas.removeEventListener("mouseup", panUpHandler);
            }.bind(this);

            this.canvas.addEventListener("mousemove", panMoveHandler);
            this.canvas.addEventListener("mouseup", panUpHandler);
        }).bind(this));

        // Updates the GraphDrawer every <MS_PER_FRAME> milliseconds.
        this.intervalId = setInterval((function() {
            this.update.call(this);
        }).bind(this), this.MS_PER_FRAME);

        this.camera = {
            canvas: canvas,
            zoomLevel: 1,
            // The camera starts centered on the world.
            centerX: this.drawBuffer.width / 2,
            centerY: this.drawBuffer.height / 2,
            // This determines the dimensions of the camera view.
            // For simplicity it should be the same as the canvas
            // where the world is rendered.
            viewportWidth: canvas.width,
            viewportHeight: canvas.height,
            /* 
                Determines if an object is inside the camera frustum.
                Returns true if the object was culled (removed).

                Culling rule:
                    Cull edge if n1 and n2 is culled.
                    Cull node if a square with side length R centered at (node.x, node.y)
                    doesn't overlap the viewport.
            */
            cull: function(object, isNode) {
                if (isNode) {
                    return this._cullNode(object);
                }

                this._cullNode(object.n1);
                this._cullNode(object.n2);
                return object.n1.culled && object.n2.culled;
            },
            /*
                Determines if a given node is culled.
            */
            _cullNode : function(node) {
                if (node.culled != undefined) return node.culled;
                
                // RectA and RectB objects can be removed if they're too slow.
                let RectA = this.getFrustumFront();
                let RectB = {};
                RectB.Left = node.x - (node.r / 2);
                RectB.Right = node.x + (node.r / 2);
                RectB.Top = node.y - (node.r / 2);
                RectB.Bottom = node.y + (node.r / 2);

                // ref: (modified for our coordinate system)
                // https://stackoverflow.com/questions/306316/determine-if-two-rectangles-overlap-each-other
                node.culled = !(RectA.Left < RectB.Right && RectA.Right > RectB.Left &&
                    RectA.Top < RectB.Bottom && RectA.Bottom > RectB.Top);
                return node.culled;
            },
            /*
                Calculates and returns a rectangle representing the front plane of the camera frustum.
                Back plane isn't needed because front dimensions == back dimensions, and we're working
                in 2D space.
            */
            getFrustumFront: function() {
                let RectA = {};
                RectA.Left = this.centerX - this.zoomLevel * (this.viewportWidth / 2);
                RectA.Right = this.centerX + this.zoomLevel * (this.viewportWidth / 2);
                RectA.Top = this.centerY - this.zoomLevel * (this.viewportHeight / 2);
                RectA.Bottom = this.centerY + this.zoomLevel * (this.viewportHeight / 2);
                return RectA;
            },
            /*
                Converts screen coordinates to world coordinates.
            */
            project: function(x, y) {
                let frustum = this.getFrustumFront();
                let worldX = (x / this.canvas.width) * (frustum.Right - frustum.Left) + frustum.Left;
                let worldY = (y / this.canvas.height) * (frustum.Bottom - frustum.Top) + frustum.Top;
                return { x: worldX, y: worldY };
            }
        }
    }

    // TODO: Remove this, and implement a better interface
    set zoomLevel(newZoom) {
        this.camera.zoomLevel = newZoom;
        this.dirty = true;
    }

    // TODO: Remove this, and implement a better interface
    set centerX(newX) {
        this.camera.centerX = newX;
        this.dirty = true;
    }

    // TODO: Remove this, and implement a better interface
    set centerY(newY) {
        this.camera.centerY = newY;
        this.dirty = true;
    }

    /*
        Used to change which interaction state the GraphDrawer is using.
    */
    set state(newState) {
        if (newState == this.currentState) return;
        this.currentState = newState;
    }

    /*
        Draws the offscreen buffer to the displayed canvas.

        ref: https://en.wikipedia.org/wiki/Multiple_buffering
    */
    switchBuffers() {
        let camera = this.camera.getFrustumFront();
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvasContext.drawImage(this.drawBuffer, 
            camera.Left, camera.Top, camera.Right - camera.Left, camera.Bottom - camera.Top, 
            0, 0, this.canvas.width, this.canvas.height);
        this.drawContext.clearRect(0, 0, this.drawBuffer.width, this.drawBuffer.height);
    }

    /*
        Draws the nodes and edges to the buffer.
    */
    draw() {
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

            this.drawContext.beginPath();
            this.drawContext.moveTo(this.edges[i].n1.x, this.edges[i].n1.y);
            this.drawContext.lineTo(this.edges[i].n2.x, this.edges[i].n2.y);
            this.drawContext.stroke();
            this.drawContext.closePath();
        }
    
        // Nodes.
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.camera.cull(this.nodes[i], true)) continue;
            // Circle
            this.drawContext.beginPath();
            this.drawContext.arc(this.nodes[i].x, this.nodes[i].y, this.R, 0, 2 * Math.PI);
            this.drawContext.fillStyle = "white";
            this.drawContext.fill();
            this.drawContext.stroke();
            this.drawContext.closePath();
    
            // Text
            this.drawContext.fillStyle = "black";
            /*
                Width is the only property
                https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics
            */
            let textWidth = this.drawContext.measureText(this.nodes[i].v).width;
            let fontHeight = 10; // TODO: This should depend on font size
            this.drawContext.fillText(this.nodes[i].v,
                this.nodes[i].x - (textWidth / 2),
                this.nodes[i].y + (fontHeight / 2));
        }

        for (let i = 0; i < this.nodes.length; i++) this.nodes[i].culled = undefined;
    }

    /*
        Updates the GraphDrawer state.
    */
    update() {
        if (this.dirty) {
            this.draw();
            this.switchBuffers();
            this.dirty = false;
        }
    }

    /*
        Creates a node and adds it to the nodes list.
    */
    addNode(e) {
        let p = this.camera.project(e.offsetX, e.offsetY);

        let node = {
            x: p.x,
            y: p.y,
            r: this.R,
            v: 0
        }

        //this._editNode(node);

        this.nodes.push(node)
        this.dirty = true;
    }

    /*
        Removes the clicked node.
    */
    removeNode(e) {
        let p = this.camera.project(e.offsetX, e.offsetY);

        for (let i = 0; i < this.nodes.length; i++) {
            if (this.isPointInNode(p.x, p.y, this.nodes[i].x, this.nodes[i].y)) {
                for (let j = 0; j < this.edges.length; j++) {
                    if (this.edges[j].n1 == this.nodes[i] || this.edges[j].n2 == this.nodes[i]) {
                        this.edges.splice(j, 1);
                        j--;
                    }
                }
    
                this.nodes.splice(i, 1);
                this.dirty = true;
                break;
            }
        }
    }

    /*
        Creates an edge between two nodes.
    */
    joinNode(e) {
        let node = this.getNodeAtCursor(e).node;
        if (node == undefined) return;
    
        let handler = function(newE) {
            let node2 = this.getNodeAtCursor(newE).node;
    
            if (node2 != undefined) {
                if (node != node2) {
                    this.edges.push({
                        n1: node,
                        n2: node2
                    });
    
                    this.dirty = true;
                }
            }
    
            this.canvas.removeEventListener("mouseup", handler);
        }.bind(this);
        this.canvas.addEventListener("mouseup", handler);
    }
    
    /*
        Lets the user drag a node around.
    */
    moveNode(e) {
        let node = this.getNodeAtCursor(e).node;
        if (node == undefined) return;
    
        let moveHandler = function(newE) {
            let p = this.camera.project(newE.offsetX, newE.offsetY);
            node.x = p.x;
            node.y = p.y;
            this.dirty = true;
        }.bind(this);

        let upHandler = function(newE) {
            this.canvas.removeEventListener("mousemove", moveHandler);
            this.canvas.removeEventListener("mouseup", upHandler);
        }.bind(this);

        this.canvas.addEventListener("mousemove", moveHandler);
        this.canvas.addEventListener("mouseup", upHandler);
    }
    
    /*
        Lets the user edit the value on a clicked node.
    */
    editNode(e) {
        let node = this.getNodeAtCursor(e).node;
        if (node == undefined) return;
        this._editNode(node);
    }

    /*
        Lets the user edit the value on a node.
    */
    _editNode(node) {
        // This is the only way to open a keyboard in mobile browsers.
        let new_value = prompt("Enter new value:", node.v);
        if (new_value == undefined) return;
    
        node.v = new_value;
        this.dirty = true;
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
        }
    }

    /*
        Checks whether a point (x, y) is inside a circle
        with center (nx, ny) and radius R.
    */
    isPointInNode(x, y, nx, ny) {
        return (x - nx) * (x - nx) + (y - ny) * (y - ny) <= this.R * this.R;
    }
}