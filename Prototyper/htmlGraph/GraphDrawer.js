/*
    Adds graph drawing functionality to a canvas object.

    // TODO: Support dynamic canvas size
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
class GraphDrawer {
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
            Quicksort = Quicksort
        */
        this.controlType = config.controlType || "Quicksort";
        /*
            This can be used in a controller to decide how
            the user can interact with the world.

            Interactive: Let's the user use a given controller to
                manipulate the world.
            Visualize: Let's the user navigate between steps and
                see the progress of a algorithm.
        */
       this.operatingMode = config.operatingMode || "Interactive";
    }

    // TODO: Remove/move this
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

        this.camera = new Camera(this);

        this.controllers = {
            Graph0: new Graph0(this),
            Graph1: new Graph1(this),
            Quicksort: new Quicksort(this, config.quicksort)
        };
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
            
            this.drawContext.beginPath();
            if (this.nodeShape == "Circle") {
                this.drawContext.arc(this.nodes[i].x, this.nodes[i].y, this.R, 0, 2 * Math.PI);
            } else if (this.nodeShape == "Square") {
                this.drawContext.rect(this.nodes[i].x, this.nodes[i].y, 
                    this.nodes[i].r, this.nodes[i].r);
            }
            if (this.nodes[i].fillColor == undefined)
                this.drawContext.fillStyle = "white";
            else
                this.drawContext.fillStyle = this.nodes[i].fillColor;

            if (this.nodes[i].strokeColor == undefined)
                this.drawContext.strokeStyle = "black";
            else
                this.drawContext.strokeStyle = this.nodes[i].strokeColor;

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
        if (this.nodeShape == "Circle") {
            return this.isPointInCircle(x, y, nx, ny, this.R);
        }
        if (this.nodeShape == "Square") {
            return this.isPointInSquare(x, y, nx, ny, this.R * this.SQUARE_FACTOR);
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
        Checks whether a poin (x, y) is inside a square with radius r.
        Top left corner of square (nx, ny).
    */
    isPointInSquare(x, y, nx, ny, r) {
        if (x < nx || x > nx + r) return false;
        if (y < ny || y > ny + r) return false;
        return true;
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
}