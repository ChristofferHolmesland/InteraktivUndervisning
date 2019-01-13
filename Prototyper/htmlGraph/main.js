let c = document.getElementById("canvas");
let ctx = c.getContext("2d");

let R = 25;
let nodes = []; // { x, y, r, v }
let edges = []; // { n1, n2 }

let mode = "add";
let modes = {
    "add": addNode,
    "remove": removeNode,
    "join": joinNode,
    "move": moveNode,
    "edit": editNode
}

let joinState = [];
let moveState = [];

function setMode(newMode) {
    if (newMode == mode) {
        return;
    }

    mode = newMode;

    if (newMode == "join") {
        joinState.length = 0;
    } else if (newMode == "move") {
        moveState.length = 0;
    }
}

let drawBuffer = document.createElement("CANVAS")
drawBuffer.width = c.width;
drawBuffer.height = c.height;
let drawCtx = drawBuffer.getContext("2d");

let dirty = false;

function switchBuffers() {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(drawBuffer, 0, 0);
    drawCtx.clearRect(0, 0, drawBuffer.width, drawBuffer.height);
}

function draw() {
    for (let i = 0; i < edges.length; i++) {
        drawCtx.beginPath();
        drawCtx.moveTo(edges[i].n1.x, edges[i].n1.y);
        drawCtx.lineTo(edges[i].n2.x, edges[i].n2.y);
        drawCtx.stroke();
        drawCtx.closePath();
    }

    for (let i = 0; i < nodes.length; i++) {
        drawCtx.beginPath();

        drawCtx.arc(nodes[i].x, nodes[i].y, R, 0, 2 * Math.PI);
        drawCtx.fillText(nodes[i].v, nodes[i].x, nodes[i].y);
        
        drawCtx.fillStyle = "white";
        drawCtx.fill();
        drawCtx.stroke();
        drawCtx.closePath();
    }
    
    switchBuffers();
}

setInterval(() => {
    if (dirty) {
        draw();
        dirty = false;
    }
}, 50);

function addNode(e) {
    nodes.push({
        x: e.offsetX,
        y: e.offsetY,
        r: R,
        v: "Hei"//Math.round(Math.random() * 99) 
    });

    dirty = true;
}

function removeNode(e) {
    for (let i = 0; i < nodes.length; i++) {
        if (pointInNode(e.offsetX, e.offsetY, nodes[i].x, nodes[i].y)) {
            for (let j = 0; j < edges.length; j++) {
                if (edges[j].n1 == nodes[i] || edges[j].n2 == nodes[i]) {
                    edges.splice(j, 1);
                    j--;
                }
            }

            nodes.splice(i, 1);
            dirty = true;
            return;
        }
    }
}

function joinNode(e) {
    if (joinState.length == 0) {
        joinState.push(getNodeAtCursor(e));
    } else if (joinState.length == 1) {
        for (let i = 0; i < nodes.length; i++) {
            if (pointInNode(e.offsetX, e.offsetY, nodes[i].x, nodes[i].y)) {
                if (nodes[i] == joinState[0]) {
                    continue;
                }

                edges.push({
                    n1: joinState[0],
                    n2: nodes[i]
                });

                dirty = true;
                joinState.length = 0;
                return;
            }
        }
    }
}

function moveNode(e) {
    if (moveState.length == 0) {
        moveState.push(getNodeAtCursor(e));
    } else if (moveState.length == 1) {
        nodes[moveState[0]].x = e.offsetX;
        nodes[moveState[0]].y = e.offsetY;
        moveState.length = 0;
        dirty = true;
    }
}

function editNode(e) {
    let node = getNodeAtCursor(e);

}

c.onmousedown = function(e) {
    modes[mode](e);
};

function pointInNode(x, y, nx, ny) {
    return (x - nx) * (x - nx) + (y - ny) * (y - ny) <= R * R;
}

function getNodeAtCursor(e) {
    for (let i = 0; i < nodes.length; i++) {
        if (pointInNode(e.offsetX, e.offsetY, nodes[i].x, nodes[i].y)) {
            return nodes[i];
        }
    }
}