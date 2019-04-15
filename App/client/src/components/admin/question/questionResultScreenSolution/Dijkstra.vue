<template>
<GraphDrawer    id="DijkstraSolution"
                controlType="Dijkstra"
                operatingMode="Presentation"
                :displayEdgeValues="true"
                :steps="solution"
                :height="400"
                :width="500"
                ref="graphdrawer"
                />
</template>

<script>
import GraphDrawer from "../../../graphDrawer/GraphDrawer.vue";

export default {
    name: "DijkstraSolution",
    props: {
        solution: Array
    },
    components: {
        GraphDrawer
    }
}
</script>