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
                type: "Inital",
                list: [3,56,3,85,63,54,99,25,5]
            }
        ]
    }
});