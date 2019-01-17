/*
    Adds graph drawing functionality to a canvas object.

    TODO: 
        Figure out the best way to let both desktop and mobile 
        users interact with the camera.

        Buttons next to the nodes to add connected nodes

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
        // Size of the font in px. TODO: Make it dynamic
        this.fontHeight = 10;

        // Nodes in the graph {x, y, r, v, culled (can be undefined)}.
        this.nodes = [];
        // Edges between nodes {n1, n2}.
        this.edges = [];
        
        // Current interaction state.
        this.currentState = "add";
        
        // Flag which determines if the graph state should
        // be redrawn. Default value is true, so the UI
        // is rendered.
        this.dirty = true;

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
            let consumed;
            // UI 
            consumed = this.detectUIInput(e);
            if (consumed) return;

            // Event handler for the current state
            consumed = this.stateHandlers[this.currentState](e);
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

        // The buttons which the user may click on to select interaction state
        this.buttons = ["Add", "Remove", "Move", "Join", "Edit"];

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
                Converts screen coordinates to world coordinates.
            */
            project: function(x, y) {
                let frustum = this.getFrustumFront();
                let worldX = (x / this.canvas.width) * frustum.Width + frustum.Left;
                let worldY = (y / this.canvas.height) * frustum.Height + frustum.Top;
                return { x: worldX, y: worldY };
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

        this.drawStatic();
    }

    // TODO: Remove this, and implement a better interface
    set zoomLevel(newZoom) {
        this.camera.zoomLevel = newZoom;
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
            this.drawContext.fillText(this.nodes[i].v,
                this.nodes[i].x - (textWidth / 2),
                this.nodes[i].y + (this.fontHeight / 2));
        }

        for (let i = 0; i < this.nodes.length; i++) this.nodes[i].culled = undefined;
    }

    /*
        Draws the UI to the staticBuffer.
    */
    drawStatic() {
        this.staticContext.clearRect(0, 0, this.staticBuffer.width, this.staticBuffer.height);

        let buttonWidth = this.staticBuffer.width / this.buttons.length;
        let buttonHeight = this.staticBuffer.height / 10;

        this.staticContext.beginPath();
        for (let i = 0; i < this.buttons.length; i++) {
            this.staticContext.fillStyle = "white";
            this.staticContext.fillRect(
                i * buttonWidth,
                this.staticBuffer.height - buttonHeight,
                buttonWidth,
                buttonHeight
            );
            this.staticContext.rect(
                i * buttonWidth,
                this.staticBuffer.height - buttonHeight,
                buttonWidth,
                buttonHeight
            );
            this.staticContext.fillStyle = "black";
            let textWidth = this.staticContext.measureText(this.buttons[i]).width;
            this.staticContext.fillText(
                this.buttons[i],
                i * buttonWidth - (textWidth / 2) + buttonWidth / 2,
                this.canvas.height - buttonHeight / 2 + (this.fontHeight / 2));
        }
        this.staticContext.stroke();
        this.staticContext.closePath();
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
        return false;
    }

    /*
        Removes the clicked node.
    */
    removeNode(e) {
        let p = this.camera.project(e.offsetX, e.offsetY);

        // Searches for the clicked node.
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.isPointInNode(p.x, p.y, this.nodes[i].x, this.nodes[i].y)) {
                // Checks if the node is connected to anything with edges.
                for (let j = 0; j < this.edges.length; j++) {
                    // Removes the edges.
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

        return false;
    }

    /*
        Creates an edge between two nodes.
    */
    joinNode(e) {
        let node = this.getNodeAtCursor(e).node;
        if (node == undefined) return false;
    
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
        return true;
    }
    
    /*
        Lets the user drag a node around.
    */
    moveNode(e) {
        let node = this.getNodeAtCursor(e).node;
        if (node == undefined) return false;
    
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
        return true;
    }
    
    /*
        Lets the user edit the value on a clicked node.
    */
    editNode(e) {
        let node = this.getNodeAtCursor(e).node;
        if (node == undefined) return false;
        this._editNode(node);
        return false;
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
        Checks if the event (click) happened on one of the buttons.
    */
   detectUIInput(e) {
        if (e.offsetY < this.canvas.height * 0.9) return false;

        let buttonIndex = Math.floor(e.offsetX / (this.canvas.width / this.buttons.length));
        this.state = this.buttons[buttonIndex];

        return true;
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
        Checks whether a point (x, y) is inside a circle
        with center (nx, ny) and radius R.
    */
    isPointInNode(x, y, nx, ny) {
        return (x - nx) * (x - nx) + (y - ny) * (y - ny) <= this.R * this.R;
    }
}