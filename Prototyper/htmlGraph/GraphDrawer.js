class GraphDrawer {
    constructor(canvas) {
        this.R = 25;
        this.FPS = 60;
        this.MS_PER_FRAME = 1000 / this.FPS;
    
        this.nodes = [];
        this.edges = [];
        
        this.currentState = undefined;
        this.dirty = false;

        this.stateHandlers = {
            "add": this.addNode,
            "remove": this.removeNode,
            "join": this.joinNode,
            "move": this.moveNode,
            "edit": this.editNode
        }

        this.canvas = canvas;
        this.canvasContext = canvas.getContext("2d");

        this.drawBuffer = document.createElement("CANVAS");
        this.drawBuffer.width = canvas.width;
        this.drawBuffer.height = canvas.height;
        this.drawContext = this.drawBuffer.getContext("2d");

        const that = this;
        this.canvas.onmousedown = function(e) {
            that.stateHandlers[that.currentState](e);
        }

        this.intervalId = setInterval(this.update, this.MS_PER_FRAME);
    }

    set state(newState) {
        if (newState == this.currentState) return;
        this.currentState = newState;
    }

    switchBuffers() {
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvasContext.drawImage(this.drawBuffer, 0, 0);
        this.drawBuffer.clearRect(0, 0, this.drawBuffer.width, this.drawBuffer.height);
    }

    draw() {
        for (let i = 0; i < this.edges.length; i++) {
            this.drawContext.beginPath();
            this.drawContext.moveTnodeso(this.edges[i].n1.x, this.edges[i].n1.y);
            this.drawContext.lineTo(this.edges[i].n2.x, this.edges[i].n2.y);
            this.drawContext.stroke();
            this.drawContext.closePath();
        }
    
        for (let i = 0; i < this.nodes.length; i++) {
            this.drawContext.beginPath();
            this.drawContext.arc(this.nodes[i].x, this.nodes[i].y, this.R, 0, 2 * Math.PI);
            this.drawContext.fillStyle = "white";
            this.drawContext.fill();
            this.drawContext.stroke();
            this.drawContext.closePath();
    
            this.drawContext.fillStyle = "black";
            /*
                Width is the only property
                https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics
            */
            let textWidth = this.drawContext.measureText(this.nodes[i].v).width;
            let fontHeight = 10;
            this.drawContext.fillText(this.nodes[i].v,
                this.nodes[i].x - (textWidth / 2),
                this.nodes[i].y + (fontHeight / 2));
        }
    }

    update() {
        if (this.dirty) {
            this.draw();
            this.switchBuffers();
            this.dirty = false;
        }
    }

    addNode(e) {
        this.nodes.push({
            x: e.offsetX,
            y: e.offsetY,
            r: this.R,
            v: Math.round(Math.random(99))
        })
    
        this.dirty = true;
    }

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

    joinNode(e) {
        let node = this.getNodeAtCursor(e).node;
        if (node == undefined) return;
    
        this.canvas.onmouseup = function(new_e) {
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
    
    moveNode(e) {
        let node = this.getNodeAtCursor(e).node;
        if (node == undefined) return;
    
        this.canvas.onmousemove = function(new_e) {
            node.x = new_e.offsetX;
            node.y = new_e.offsetY;
            this.dirty = true;
        }
    
        this.canvas.onmouseup = function(new_e) {
            this.canvas.onmousemove = undefined;
            this.canvas.onmouseup = undefined;
        }
    }
    
    editNode(e) {
        let node = this.getNodeAtCursor(e);
    
    }

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

    isPointInNode(x, y, nx, ny) {
        return (x - nx) * (x - nx) + (y - ny) * (y - ny) <= this.R * this.R;
    }
}