<template>
<GraphDrawer    id="QuicksortSolution"
                controlType="Sort"
                sortType="Quicksort"
                operatingMode="Presentation"
                :steps="solution"
                />
</template>

<script>
import GraphDrawer from "../../../graphDrawer/GraphDrawer.vue";

export default {
    name: "QuicksortSolution",
    created() {
        
    },
    props: {
        solution: Array
    },
    components: {
        GraphDrawer
    }
}
</script>
