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
        props: {
            controlType: String,
            steps: Array
        },
        mounted() {
            let c = document.getElementById("canvas");

            let nodeShape = this.controlType == "Quicksort" ? "Square" : "Circle";

            let graphDrawer = new GraphDrawer(c, {
                nodeShape: nodeShape,
                controlType: this.controlType,
                operationMode: "Interactive",
                
                quicksort: {
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