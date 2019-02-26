<template>
    <div>
        <canvas id="canvas" :width="width" :height="height" style="background-color: #fff;"/>
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
            width: {
                default: 600,
                type: Number
            },
            height: {
                default: 600,
                type: Number
            }
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
                displayEdgeValues: true,
                directedEdges: true,

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