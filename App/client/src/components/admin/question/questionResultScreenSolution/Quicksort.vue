<template>
<GraphDrawer    id="QuicksortSolution"
                controlType="Sort"
                sortType="Quicksort"
                operatingMode="Presentation"
                :steps="solution"
                :height="400"
                :width="500"
                />
</template>

<script>
import GraphDrawer from "../../../graphDrawer/GraphDrawer.vue";

export default {
    name: "QuicksortSolution",
    props: {
        solution: Array
    },
    components: {
        GraphDrawer
    }
}
</script>
