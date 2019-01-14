let c = document.getElementById("canvas");
let graphDrawer = new GraphDrawer(c);

function setMode(newMode) {
    graphDrawer.state = newMode;
}