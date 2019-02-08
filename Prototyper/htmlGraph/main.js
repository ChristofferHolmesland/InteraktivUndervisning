let c = document.getElementById("canvas");
let graphDrawer = new GraphDrawer(c, {
    nodeShape: "Square",
    controlType: "Quicksort",
    quicksort: {
        bsf: 2.75,
        pivotColor: "#add8e6",
        selectedColor: "red",
        extractType: "xSorter",
        joinType: "vSorter"
    }
});