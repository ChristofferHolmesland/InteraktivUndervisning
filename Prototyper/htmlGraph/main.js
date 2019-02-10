let c = document.getElementById("canvas");
let graphDrawer = new GraphDrawer(c, {
    nodeShape: "Square",
    controlType: "Quicksort",
    operationMode: "Interactive",
    
    quicksort: {
        bsf: 2.75,
        pivotColor: "#add8e6",
        selectedColor: "red",
        extractType: "xSorter",
        joinType: "vSorter",
        steps: [
            {
                type: "Initial",
                list: [10, 80, 30, 90, 40, 50, 70]
            }
        ]
    }
});