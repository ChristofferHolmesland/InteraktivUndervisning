/*
    
*/
class GraphDrawer {
    /*
        Private and public class fields are experimental and
        shouldn't be used.
    */
    constructor(canvas) {
        // Radius of nodes.
        // TODO: This can probably be used for zooming.
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
        this.canvasContext.drawImage(this.drawBuffer, 0, 0);
        this.drawContext.clearRect(0, 0, this.drawBuffer.width, this.drawBuffer.height);
    }

    /*
        Draws the nodes and edges to the buffer.
    */
    draw() {
        // Edges.
        for (let i = 0; i < this.edges.length; i++) {
            this.drawContext.beginPath();
            this.drawContext.moveTo(this.edges[i].n1.x, this.edges[i].n1.y);
            this.drawContext.lineTo(this.edges[i].n2.x, this.edges[i].n2.y);
            this.drawContext.stroke();
            this.drawContext.closePath();
        }
    
        // Nodes.
        for (let i = 0; i < this.nodes.length; i++) {
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
        this.nodes.push({
            x: e.offsetX,
            y: e.offsetY,
            r: this.R,
            // TODO: Redirect user to temporary input state and
            // let them enter the value.
            v: Math.round(Math.random(99))
        })
    
        this.dirty = true;
    }

    /*
        Removes the clicked node.
    */
    removeNode(e) {
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.pointInNode(e.offsetX, e.offsetY, this.nodes[i].x, this.nodes[i].y)) {
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
        Let's the user drag a node around.
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
        TODO: Let the user edit the value on a node.
    */
    editNode(e) {
        let node = this.getNodeAtCursor(e);
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