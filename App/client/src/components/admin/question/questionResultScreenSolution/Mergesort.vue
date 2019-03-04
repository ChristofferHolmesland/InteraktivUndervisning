<template>
<GraphDrawer    id="MergesortSolution"
                controlType="Sort"
                sortType="Mergesort"
                operatingMode="Presentation"
                :steps="solution"
                :height="400"
                :width="500"
                />
</template>

<script>
import GraphDrawer from "../../../graphDrawer/GraphDrawer.vue";

export default {
    name: "MergesortSolution",
    props: {
        solution: Array
    },
    components: {
        GraphDrawer
    }
}
</script>