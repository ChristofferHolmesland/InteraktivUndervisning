<template>
<GraphDrawer    id="MergesortAnswer"
                controlType="Sort"
                sortType="Mergesort"
                operatingMode="Presentation"
                :steps="answer"
                :height="400"
                :width="500"
                />
</template>

<script>
import GraphDrawer from "../../../graphDrawer/GraphDrawer.vue";

export default {
    name: "MergesortAnswer",
    props: {
        answer: Array
    },
    components: {
        GraphDrawer
    }
}
</script>
