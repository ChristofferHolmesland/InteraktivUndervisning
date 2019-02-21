<template>
    <div>
        <canvas id="canvas" width="600" height="600" style="background-color: #fff;">

        </canvas>
    </div>
</template>

<script>
    import GraphDrawer from "./GraphDrawer.js";

	export default {
        name: 'GraphDrawer',
        data() {
            return {
                graphDrawer: undefined
            };
        },
        props: {
            // When this changes, the parent wants to get the value from
            // the GraphDrawer.
            requestAnswer: Boolean,
            // Graph0 or Sort
            controlType: String,
            steps: Array,
            // Quicksort or Mergesort
            sortType: String,
            // Interactive or Presentation
            operatingMode: String
        },
        watch: {
            requestAnswer: function() {
                this.$emit("getValueResponse", this.graphDrawer.export());
            }
        },
        mounted() {
            let c = document.getElementById("canvas");

            let nodeShape = "Circle";
            if (this.controlType == "Sort") {
                nodeShape = "Square"
            }

            this.graphDrawer = new GraphDrawer(c, {
                nodeShape: nodeShape,
                controlType: this.controlType,
                operatingMode: this.operatingMode,
                displayEdgeValues: false,
                directedEdges: true,
                
                djikstra: {
                    startColor: "LightGreen",
                    endColor: "LightCoral",
                    edgeColor: "LightGray",
                    to: {"x":884.1500000000001,"y":699,"r":25,"v":"6"},
                    from: {"x":742,"y":946,"r":25,"v":"1"},
                    graph: {"nodes":[{"x":742,"y":946,"r":25,"v":"1"},{"x":917,"y":957,"r":25,"v":"2"},{"x":857.1500000000001,"y":829.9916249999999,"r":25,"v":"3"},{"x":735,"y":769,"r":25,"v":"5"},{"x":884.1500000000001,"y":699,"r":25,"v":"6"},{"x":998.1500000000001,"y":796,"r":25,"v":"4"}],"edges":[{"n1":{"x":742,"y":946,"r":25,"v":"1"},"n2":{"x":917,"y":957,"r":25,"v":"2"},"v":"7"},{"n1":{"x":742,"y":946,"r":25,"v":"1"},"n2":{"x":857.1500000000001,"y":829.9916249999999,"r":25,"v":"3"},"v":"9"},{"n1":{"x":917,"y":957,"r":25,"v":"2"},"n2":{"x":857.1500000000001,"y":829.9916249999999,"r":25,"v":"3"},"v":"10"},{"n1":{"x":742,"y":946,"r":25,"v":"1"},"n2":{"x":735,"y":769,"r":25,"v":"5"},"v":"14"},{"n1":{"x":857.1500000000001,"y":829.9916249999999,"r":25,"v":"3"},"n2":{"x":735,"y":769,"r":25,"v":"5"},"v":"2"},{"n1":{"x":857.1500000000001,"y":829.9916249999999,"r":25,"v":"3"},"n2":{"x":998.1500000000001,"y":796,"r":25,"v":"4"},"v":"11"},{"n1":{"x":735,"y":769,"r":25,"v":"5"},"n2":{"x":884.1500000000001,"y":699,"r":25,"v":"6"},"v":"9"},{"n1":{"x":917,"y":957,"r":25,"v":"2"},"n2":{"x":998.1500000000001,"y":796,"r":25,"v":"4"},"v":"15"},{"n1":{"x":998.1500000000001,"y":796,"r":25,"v":"4"},"n2":{"x":884.1500000000001,"y":699,"r":25,"v":"6"},"v":"6"}],"directed":false}
                },

                graph: {
                    exportType: "Graph"
                },

                sort: {
                    sortType: this.sortType,
                    bsf: 2.75,
                    pivotColor: "#add8e6",
                    selectedColor: "red",
                    extractType: "xSorter",
                    joinType: "vSorter",
                    steps: this.steps
                }
            });
        }
    }

</script>

<style scoped>
</style>