/*
    Adds graph drawing functionality to a canvas object.

    TODO:
        Zooming
        Camera
        Panning
        Scaling
*/
class GraphDrawer {
    /*
        Private and public class fields are experimental and
        shouldn't be used.
    */
    constructor(canvas) {
        // WIP Camera.
        this.camera = {
            zoomLevel: 1,
            centerX: canvas.width / 2,
            centerY: canvas.height / 2,
            viewportWidth: canvas.width,
            viewportHeight: canvas.height,
            cull: function(object, isNode) {
                /* Culling rule:
                    Cull edge if n1 and n2 is culled.
                    Cull node if a square with side length R centered at (node.x, node.y)
                        doesn't overlap the viewport.
                */

                if (isNode) {
                    return this._cullNode(object);
                }

                this._cullNode(object.n1);
                this._cullNode(object.n2);
                return object.n1.culled && object.n2.culled;
            },
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
            getFrustumFront: function() {
                let RectA = {};
                RectA.Left = this.centerX - this.zoomLevel * (this.viewportWidth / 2);
                RectA.Right = this.centerX + this.zoomLevel * (this.viewportWidth / 2);
                RectA.Top = this.centerY - this.zoomLevel * (this.viewportHeight / 2);
                RectA.Bottom = this.centerY + this.zoomLevel * (this.viewportHeight / 2);
                return RectA;
            },
            project: function(x, y) {

            }
        }

        // Radius of nodes.
        this.R = 25;
        // How often the canvas should be updated.
        this.FPS = 60;
        // Milliseconds between each update.
        this.MS_PER_FRAME = 1000 / this.FPS;
    
        // Nodes in the graph {x, y, r, v}.
        this.nodes = [];
        // Edges between nodes {n1, n2}.
        this.edges = [];
        
        // Current interaction state.
        this.currentState = undefined;
        
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
        this.drawBuffer.width = canvas.width;
        this.drawBuffer.height = canvas.height;
        this.drawContext = this.drawBuffer.getContext("2d");

        // When the mouse is clicked the event handler for the
        // current state is called.
        this.canvas.onmousedown = (function(e) {
            this.stateHandlers[this.currentState](e);
        }).bind(this)

        // Updates the GraphDrawer every <MS_PER_FRAME> milliseconds.
        this.intervalId = setInterval((function() {
            this.update.call(this);
        }).bind(this), this.MS_PER_FRAME);
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
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let camera = this.camera.getFrustumFront();
        this.canvasContext.drawImage(this.drawBuffer, camera.Left, camera.Top, camera.Right - camera.Top, camera.Bottom - camera.Top, 0, 0, this.canvas.width, this.canvas.height);
        this.drawContext.clearRect(0, 0, this.drawBuffer.width, this.drawBuffer.height);
    }

    /*
        Draws the nodes and edges to the buffer.
    */
    draw() {
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
        let node = {
            x: e.offsetX,
            y: e.offsetY,
            r: this.R,
            v: 0
        }

        this._editNode(node);

        this.nodes.push(node)
        this.dirty = true;
    }

    /*
        Removes the clicked node.
    */
    removeNode(e) {
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.isPointInNode(e.offsetX, e.offsetY, this.nodes[i].x, this.nodes[i].y)) {
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
    
        // JS Arrow functions won't override the "this" context.
        this.canvas.onmouseup = (new_e) => {
            let node2 = this.getNodeAtCursor(new_e).node;
    
            if (node2 != undefined) {
                if (node != node2) {
                    this.edges.push({
                        n1: node,
                        n2: node2
                    });
    
                    this.dirty = true;
                }
            }
    
            this.canvas.onmouseup = undefined;
        }
    }
    
    /*
        Lets the user drag a node around.
    */
    moveNode(e) {
        let node = this.getNodeAtCursor(e).node;
        if (node == undefined) return;
    
        this.canvas.onmousemove = (new_e) => {
            node.x = new_e.offsetX;
            node.y = new_e.offsetY;
            this.dirty = true;
        }
    
        this.canvas.onmouseup = (new_e) => {
            this.canvas.onmousemove = undefined;
            this.canvas.onmouseup = undefined;
        }
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
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.isPointInNode(e.offsetX, e.offsetY, this.nodes[i].x, this.nodes[i].y)) {
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