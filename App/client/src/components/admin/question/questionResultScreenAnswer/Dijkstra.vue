<template>
<GraphDrawer    id="DijkstraAnswer"
                controlType="Dijkstra"
                operatingMode="Presentation"
                :steps="answer"
                :height="400"
                :width="500"
                />
</template>

<script>
import GraphDrawer from "../../../graphDrawer/GraphDrawer.vue";

export default {
    name: "DijkstraAnswer",
    props: {
        answer: Array
    },
    components: {
        GraphDrawer
    }
}
</script>
