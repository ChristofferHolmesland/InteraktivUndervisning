<template>
<GraphDrawer    id="QuicksortAnswer"
                controlType="Sort"
                sortType="Quicksort"
                operatingMode="Presentation"
                :steps="answer"
                :width="550"
                :height="700"
                />
</template>

<script>
import GraphDrawer from "../../../graphDrawer/GraphDrawer.vue";

export default {
    name: "QuicksortAnswer",
    props: {
        answer: Array
    },
    components: {
        GraphDrawer
    }
}
</script>
