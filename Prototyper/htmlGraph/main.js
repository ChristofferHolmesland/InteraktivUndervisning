let c = document.getElementById("canvas");
let graphDrawer = new GraphDrawer(c, {
    nodeShape: "Circle",
    controlType: "Graph0",
    quicksort: {
        bsf: 2.5,
        pivotColor: "#add8e6",
        selectedColor: "red",
        sortType: "vSorter"
    }
});