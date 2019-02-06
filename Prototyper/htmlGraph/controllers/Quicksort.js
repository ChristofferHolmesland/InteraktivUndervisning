class Quicksort {
    constructor(graphDrawer) {
        this.gd = graphDrawer;
        // All the arrays stored as a list inside a list.
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
            this.arrays.push([this.gd.nodes[this.gd.nodes.length - 1]]);
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

    }

    drawUI() {
        this.gd.staticContext.clearRect(0, 0,
            this.gd.staticBuffer.width, this.gd.staticBuffer.height);

        // Draw + buttons between every element of the arrays
        this.gd.staticContext.fillStyle = "white";
        for (let ai = 0; ai < this.arrays.length; ai++) {
            this.gd.staticContext.beginPath();
            for (let ni = 0; ni < this.arrays[ai].length; ni++) {
                // Every node should draw a + between them and the next node.
                // The first node should draw a + at the start of the array.
                let bsf = 3;
                let node = this.arrays[ai][ni];
                let right = this.gd.camera.unproject(
                    node.x + node.r - (node.r / bsf) / 2, node.y + (node.r / bsf) / 2
                );
                if (ni == 0) {
                    let left = this.gd.camera.unproject(
                        node.x - (node.r / bsf) / 2, node.y + (node.r / bsf) / 2
                    );
                    this.gd.staticContext.rect(
                        left.x, left.y,
                        node.r / bsf, node.r / bsf
                    );
                    this.buttons.push({
                        position: {
                            x: left.x,
                            y: left.y,
                            width: node.r / bsf,
                            height: node.r / bsf
                        },
                        handler: this.addNewNodeToArray,
                        data: {
                            ai: ai,
                            ni: ni,
                            side: "left"
                        }
                    });
                }
                this.gd.staticContext.rect(
                    right.x, right.y,
                    node.r / bsf, node.r / bsf
                );
                this.buttons.push({
                    position: {
                        x: right.x,
                        y: right.y,
                        width: node.r / bsf,
                        height: node.r / bsf
                    },
                    handler: this.addNewNodeToArray,
                    data: {
                        ai: ai,
                        ni: ni,
                        side: "right"
                    }
                });
            }
            this.gd.staticContext.fill();
            this.gd.staticContext.stroke();
            this.gd.staticContext.closePath();
        }
        // If node is selected display - button to remove and join
        // button to create arrow
    }
}