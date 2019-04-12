<template>
    <div>
        <canvas id="canvas"
                :width="width"
                :height="height"
                style="background-color: #fff; margin-left: auto; margin-right: auto; display: block; border: 2px solid black;"
                />
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
            operatingMode: String,
            // Graph, Tree or Both
            exportType: String,
            // Graph or Tree
            importType: String,
            // Dijkstra or undefined
            subType: String,
            // The graph to perform dijkstra on
            graph: Object,
            width: {
                default: 600,
                type: Number
            },
            height: {
                default: 600,
                type: Number
            },
			displayEdgeValues: {
            	default: false,
                type: Boolean
            },
            directedEdges: {
                default: true,
                type: Boolean
            }
        },
        watch: {
            requestAnswer: function() {
                this.$emit("getValueResponse", this.graphDrawer.export());
            }
        },
        mounted() {
            this.createDrawer();
        },
        methods: {
            destroyDrawer: function() {
                // Recreate the canvas to remove the event listeners
                let el = document.getElementById("canvas");
                let elClone = el.cloneNode(true);
                el.parentNode.replaceChild(elClone, el);

                // Remove top level references from the GraphDrawer object
                for (let prop in this.graphDrawer) {
                    delete this.graphDrawer[prop];
                }

                delete this.graphDrawer;
                this.graphDrawer = undefined;
            },
            createDrawer: function() {
                this.canvas = document.getElementById("canvas");

                let nodeShape = "Circle";
                if (this.controlType == "Sort" || this.controlType == "Python") {
                    nodeShape = "Rectangle"
                }

                /*
                    There seems to be a bug in the garbage collection of browsers.
                    The GraphDrawer object isn't collected even though nothing has
                    a reference to it (after calling this.destroyDrawer()), which means
                    that there will be two GraphDrawer objects attached to the same canvas.
                */
                if (this.graphDrawer !== undefined) {
                    this.destroyDrawer();
                }

                this.graphDrawer = new GraphDrawer(this.canvas, {
                    nodeShape: nodeShape,
                    controlType: this.controlType,
                    operatingMode: this.operatingMode,
                    displayEdgeValues: this.displayEdgeValues,
                    directedEdges: this.directedEdges,

                    dijkstra: {
                        startColor: "LightGreen",
                        endColor: "LightCoral",
                        edgeColor: "LightGray",
                        graph: this.graph,
                        steps: this.steps
                    },

                    graph: {
                        exportType: this.exportType,
                        subType: this.subType,
                        startNodeColor: "LightGreen",
                        endNodeColor: "LightCoral",
                        steps: this.steps,
                        importType: this.importType
                    },
                    
                    sort: {
                        sortType: this.sortType,
                        bsf: 2.75,
                        pivotColor: "#add8e6",
                        selectedColor: "red",
                        extractType: "xSorter",
                        joinType: "vSorter",
                        steps: this.steps
                    },

                    python: {
                        steps: this.steps
                    }
                });
            }
        }
    }

</script>

<style scoped>
</style>