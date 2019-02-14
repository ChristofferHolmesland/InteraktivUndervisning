<template>
    <div>
        <canvas id="canvas" width="400" height="400">

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
            sortType: String
        },
        watch: {
            requestAnswer: function() {
                this.$emit("getValueResponse", graphDrawer.export());
            }
        },
        mounted() {
            let c = document.getElementById("canvas");

            let nodeShape = "Circle";
            if (this.controlType == "Sort") {
                nodeShape = "Square"
            }

            graphDrawer = new GraphDrawer(c, {
                nodeShape: nodeShape,
                controlType: this.controlType,
                operationMode: "Interactive",
                
                sort: {
                    sortType: this.sortType,
                    bsf: 2.75,
                    pivotColor: "#add8e6",
                    selectedColor: "red",
                    extractType: "xSorter",
                    steps: this.steps
                }
            });
        }
    }

</script>

<style scoped>
</style>