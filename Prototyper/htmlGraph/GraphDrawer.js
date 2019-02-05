/*
    Adds graph drawing functionality to a canvas object.

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
        // Relative size of square nodes compared to circle nodes.
        this.SQUARE_FACTOR = 1.5;
        // How often the canvas should be updated.
        this.FPS = 60;
        // Milliseconds between each update.
        this.MS_PER_FRAME = 1000 / this.FPS;
        // Size of the font in px. TODO: Make it dynamic
        this.fontHeight = 10;
        /*
            What shape is drawn for the nodes
            Possible values: Circle, Square
        */
        this.nodeShape = "Square";
        /*
            Determines how the user can interact with the canvas.
            Graph0 = Buttons are shown.
            Graph1 = Simple mode 
            Quicksort = Quicksort
        */
        this.controlType = "Quicksort";
        this.controllers = {
            Graph0: new Graph0(this),
            Graph1: new Graph1(this),
            Quicksort: new Quicksort(this)
        };

        // Nodes in the graph {x, y, r, v, culled (can be undefined)}.
        this.nodes = [];
        // Edges between nodes {n1, n2}.
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

        this.canvas.addEventListener("mousedown", (function(e) {
            let consumed = this.controllers[this.controlType].mouseDownHandler(e);
            if (consumed) return;

            // Gesture detection
            this.detectPanGesture(e);
            // TODO: Figure out how to detect two-finger zooming
            // TODO: Let desktop users zoom
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
                Calculates and returns a rectangle representing the front plane
                off the camera frustum. Back plane isn't needed because
                front dimensions == back dimensions, and we're working in 2D space.
            */
            getFrustumFront: function() {
                let RectA = {};
                RectA.Left = this.centerX - this.zoomLevel * (this.viewportWidth / 2);
                RectA.Right = this.centerX + this.zoomLevel * (this.viewportWidth / 2);
                RectA.Top = this.centerY - this.zoomLevel * (this.viewportHeight / 2);
                RectA.Bottom = this.centerY + this.zoomLevel * (this.viewportHeight / 2);
                RectA.Width = RectA.Right - RectA.Left;
                RectA.Height = RectA.Bottom - RectA.Top;
                return RectA;
            },
            /*
                Converts canvas coordinates to world coordinates.
            */
            project: function(x, y) {
                let frustum = this.getFrustumFront();
                let worldX = (x / this.canvas.width) * frustum.Width + frustum.Left;
                let worldY = (y / this.canvas.height) * frustum.Height + frustum.Top;
                return { x: worldX, y: worldY };
            },
            /*
                Converts world coordinates to canvas coordinates
            */
            unproject: function(x, y) {
                let frustum = this.getFrustumFront();
                
                let cameraSpaceX = x - frustum.Left;
                let cameraSpaceY = y - frustum.Top;
                let canvasX = canvas.width * (cameraSpaceX / frustum.Width);
                let canvasY = canvas.height * (cameraSpaceY / frustum.Height);
                
                return {x: canvasX, y: canvasY};
            },
            /*
                Changes which x coordinate the camera looks at.
                Bound in range (0, drawBuffer width).
            */
            translateX: function(x, min, max) {
                this.centerX += x;
                if (this.centerX < min) this.centerX = min;
                else if (this.centerX > max) this.centerX = max;
            },
            /*
                Changes which y coordinate the camera looks at.
                Bound in range (0, drawBuffer height).
            */
           translateY: function(y, min, max) {
                this.centerY += y;
                if (this.centerY < min) this.centerY = min;
                else if (this.centerY > max) this.centerY = max;
           }
        }

        if (this.controlType == "Graph0") this.controllers["Graph0"].drawStatic();
    }

    // TODO: Remove this, and implement a better interface
    set zoomLevel(newZoom) {
        this.camera.zoomLevel = newZoom;
        this.dirty = true;
    }

    /*
        Draws the offscreen buffer to the displayed canvas.

        ref: https://en.wikipedia.org/wiki/Multiple_buffering
    */
    switchBuffers() {
        let camera = this.camera.getFrustumFront();
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.canvasContext.drawImage(
            this.drawBuffer, 
            camera.Left, camera.Top, camera.Width, camera.Height, 
            0, 0, this.canvas.width, this.canvas.height
        );

        this.canvasContext.drawImage(
            this.staticBuffer,
            0, 0, this.staticBuffer.width, this.staticBuffer.height,
            0, 0, this.canvas.width, this.canvas.height
        );
    }

    /*
        Draws the nodes and edges to the buffer.
    */
    draw() {
        this.drawContext.clearRect(0, 0, this.drawBuffer.width, this.drawBuffer.height);

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
            this.drawContext.stroke();
            this.drawContext.closePath();
        }
    
        // Nodes.
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.camera.cull(this.nodes[i], true)) continue;
            
            if (this.nodeShape == "Circle") {
                this.drawContext.beginPath();
                this.drawContext.arc(this.nodes[i].x, this.nodes[i].y, this.R, 0, 2 * Math.PI);
                this.drawContext.fillStyle = "white";
                this.drawContext.fill();
                this.drawContext.stroke();
                this.drawContext.closePath();
            } else if (this.nodeShape == "Square") {
                this.drawContext.strokeRect(this.nodes[i].x, this.nodes[i].y, 
                    this.nodes[i].r, this.nodes[i].r);
            }
    
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
                this.nodes[i].x - (textWidth / 2) + ox,
                this.nodes[i].y + (this.fontHeight / 2) + oy
            );
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
        Can be called to determine if the event e is the start of a panning gesture.
        This let's the user move the camera around the world.
    */
    detectPanGesture(e) {
        let currentPosition = this.camera.project(e.offsetX, e.offsetY);
        
        // How much the camera moves relative to how far the mouse is dragged.
        const velocityFactor = 0.85;
        // How much the mouse must be moved before panning starts.
        const threshold = 5;

        let panMoveHandler = function(newE) {
            let newPosition = this.camera.project(newE.offsetX, newE.offsetY);
            let frustum = this.camera.getFrustumFront();

            // Calculates the difference in position between last frame and this frame.
            let dX = velocityFactor * (newPosition.x - currentPosition.x);
            let dY = velocityFactor * (newPosition.y - currentPosition.y);
            if (dX > threshold || dX < threshold) 
                // The camera won't put it's center close enough to the world edge,
                // to render anything outside the world.
                this.camera.translateX(-dX, frustum.Width / 2, this.drawBuffer.width - frustum.Width / 2);
            if (dY > threshold || dY < threshold) 
                this.camera.translateY(-dY, frustum.Height / 2, this.drawBuffer.height - frustum.Height / 2);
            
                this.dirty = true;
            currentPosition = newPosition;
        }.bind(this);

        let panUpHandler = function(newE) {
            this.canvas.removeEventListener("mousemove", panMoveHandler);
            this.canvas.removeEventListener("mouseup", panUpHandler);
            this.canvas.removeEventListener("mouseleave", panUpHandler);
        }.bind(this);

        this.canvas.addEventListener("mousemove", panMoveHandler);
        this.canvas.addEventListener("mouseup", panUpHandler);
        this.canvas.addEventListener("mouseleave", panUpHandler);
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
        Checks whether a point (x, y) is inside a node (nx, ny).
    */
    isPointInNode(x, y, nx, ny) {
        /*
            Checks whether a point (x, y) is inside a circle
            with center (nx, ny) and radius R.
        */
        if (this.nodeShape == "Circle") {
            return (x - nx) * (x - nx) + (y - ny) * (y - ny) <= this.R * this.R;
        }
        /*
            Checks whether a poin (x, y) is inside a square (nx, ny)
            with radius R * SQUARE_FACTOR.
        */
        if (this.nodeShape == "Square") {
            if (x < nx || x > nx + this.R * this.SQUARE_FACTOR) return false;
            if (y < ny || y > ny + this.R * this.SQUARE_FACTOR) return false;
            return true;
        }
    }
}

class Quicksort {
    constructor(graphDrawer) {
        this.gd = graphDrawer;
        this.arrays = [];
    }

    mouseDownHandler(e) {
        if (this.arrays.length == 0) {
            this.gd.controllers["Graph0"].addNode(e);
            this.arrays.push([this.gd.nodes[0]]);
            return true;
        }

        return false;
    }
}

class Graph1 {
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
        this.gd.staticContext.clearRect(0, 0, 
            this.gd.staticBuffer.width, this.gd.staticBuffer.height);
        
        let nodeOnCanvas = this.gd.camera.unproject(node.x, node.y);
        let borderX = nodeOnCanvas.x + node.r;
        let borderY = nodeOnCanvas.y - (1.5 * node.r);
        // Divide the panel into a 2x3 grid.
        let borderWidth = node.r * 4;
        let borderHeight = node.r * 4;
        let rowHeight = borderHeight / 3;
        let columnWidth = borderWidth / 2;

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

class Graph0 {
    constructor(graphDrawer) {
        this.gd = graphDrawer;

        // Current interaction state.
        this.currentState = "Add";

        // The buttons which the user may click on to select interaction state
        this.buttons = ["Add", "Remove", "Move", "Join", "Edit"];

        // Every interaction state and event handler.
        this.stateHandlers = {
            "Add": this.addNode,
            "Remove": this.removeNode,
            "Join": this.joinNode,
            "Move": this.moveNode,
            "Edit": this.editNode
        }

        // Binds the "this" context to the GraphDrawer object.
        for (let key in this.stateHandlers) {
            // Doesn't bind inherited properties.
            if (!this.stateHandlers.hasOwnProperty(key)) continue;
            this.stateHandlers[key] = this.stateHandlers[key].bind(this);
        }
    }

    mouseDownHandler(e) {
        // UI 
        let consumed = this.detectUIInput(e);
        if (consumed) return;

        // Event handler for the current state
        consumed = this.stateHandlers[this.currentState](e);
        return consumed;
    }

    /*
        Creates a node and adds it to the nodes list.
    */
    addNode(e) {
        let p = this.gd.camera.project(e.offsetX, e.offsetY);

        let node = {
            x: p.x,
            y: p.y,
            r: this.gd.nodeShape == "Circle" ? this.gd.R : this.gd.R * this.gd.SQUARE_FACTOR,
            v: 0
        }

        //this._editNode(node);

        this.gd.nodes.push(node)
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
            if (this.gd.isPointInNode(p.x, p.y, this.gd.nodes[i].x, this.gd.nodes[i].y)) {
                // Checks if the node is connected to anything with edges.
                for (let j = 0; j < this.gd.edges.length; j++) {
                    // Removes the edges.
                    if (this.gd.edges[j].n1 == this.gd.nodes[i] 
                        || this.gd.edges[j].n2 == this.gd.nodes[i]) {
                            this.gd.edges.splice(j, 1);
                        j--;
                    }
                }

                this.gd.nodes.splice(i, 1);
                this.gd.dirty = true;
                return true;
            }
        }

        return false;
    }

    /*
        Creates an edge between two nodes.
    */
    joinNode(e) {
        let node = this.gd.getNodeAtCursor(e).node;
        if (node == undefined) return false;

        let handler = function(newE) {
            let node2 = this.gd.getNodeAtCursor(newE).node;

            if (node2 != undefined) {
                if (node != node2) {
                    this.gd.edges.push({
                        n1: node,
                        n2: node2
                    });

                    this.gd.dirty = true;
                }
            }

            this.gd.canvas.removeEventListener("mouseup", handler);
        }.bind(this);
        this.gd.canvas.addEventListener("mouseup", handler);
        return true;
    }

    /*
        Lets the user drag a node around.
    */
    moveNode(e) {
        let node = this.gd.getNodeAtCursor(e).node;
        if (node == undefined) return false;

        let moveHandler = function(newE) {
            let p = this.gd.camera.project(newE.offsetX, newE.offsetY);
            node.x = p.x;
            node.y = p.y;
            this.gd.dirty = true;
        }.bind(this);

        let upHandler = function(newE) {
            this.gd.canvas.removeEventListener("mousemove", moveHandler);
            this.gd.canvas.removeEventListener("mouseup", upHandler);
        }.bind(this);

        this.gd.canvas.addEventListener("mousemove", moveHandler);
        this.gd.canvas.addEventListener("mouseup", upHandler);
        return true;
    }

    /*
        Lets the user edit the value on a clicked node.
    */  
    editNode(e) {
        let node = this.gd.getNodeAtCursor(e).node;
        if (node == undefined) return false;
        this.gd._editNode(node);
        return false;
    }


    /*
        Checks if the event (click) happened on one of the buttons.
    */
    detectUIInput(e) {
        if (e.offsetY < this.gd.canvas.height * 0.9) return false;

        let buttonIndex = Math.floor(e.offsetX / (this.gd.canvas.width / this.buttons.length));
        this.currentState = this.buttons[buttonIndex];
        return true;
    }

      /*
        Draws the UI to the staticBuffer.
    */
    drawStatic() {
        this.gd.staticContext.clearRect(0, 0, 
            this.gd.staticBuffer.width, this.gd.staticBuffer.height);

        let buttonWidth = this.gd.staticBuffer.width / this.buttons.length;
        let buttonHeight = this.gd.staticBuffer.height / 10;

        this.gd.staticContext.beginPath();
        for (let i = 0; i < this.buttons.length; i++) {
            this.gd.staticContext.fillStyle = "white";
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
            let textWidth = this.gd.staticContext.measureText(this.buttons[i]).width;
            this.gd.staticContext.fillText(
                this.buttons[i],
                i * buttonWidth - (textWidth / 2) + buttonWidth / 2,
                this.gd.canvas.height - buttonHeight / 2 + (this.gd.fontHeight / 2));
        }
        this.gd.staticContext.stroke();
        this.gd.staticContext.closePath();
    }
}