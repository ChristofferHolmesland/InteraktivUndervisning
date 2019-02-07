class Quicksort {
    constructor(graphDrawer) {
        this.gd = graphDrawer;
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
        */
        this.buttons = [];
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

        return false;
    }

    checkUI(e) {
        for (let i = 0; i < this.buttons.length; i++) {
            let btn = this.buttons[i];
            if (this.gd.isPointInSquare(e.offsetX, e.offsetY, btn.position.x, btn.position.y, 
                btn.position.width)) {
                btn.handler(btn);
                return true;
            }
        }

        return false;
    }

    dirtyUpdate() {
        this.drawUI();
    }

    addNewNodeToArray(event) {
        // fix calculate nodes bases on array startposition and node index
        //      every time a node is added/removed from an array

        let clickedNode = this.arrays[event.data.ai].nodes[event.data.ni];
        let node = {
            x: clickedNode.x + (event.data.side == "left" ? -clickedNode.r : clickedNode.r),
            y: clickedNode.y,
            r: clickedNode.r,
            v: clickedNode.v + 1
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
                // Every node should draw a + between them and the next node.
                // The first node should draw a + at the start of the array.
                if (ni == 0) this._renderAddNodeButton(this.arrays[ai].nodes[ni], "left", ai, ni);
                this._renderAddNodeButton(this.arrays[ai].nodes[ni], "right", ai, ni);
               
            }
            this.gd.staticContext.closePath();
        }
        // If node is selected display - button to remove and join
        // button to create arrow
    }

    _renderAddNodeButton(node, side, ai, ni) {
        let bsf = 3;
        let bSize = node.r / bsf;
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