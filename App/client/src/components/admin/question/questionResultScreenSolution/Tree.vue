<template>
    <GraphDrawer    id="TreeSolution"
                    controlType="Graph0"
                    exportType="Tree"
                    operationMode="Presentation"
                    :steps="solution"
                    :height="400"
                    :width="500"
    />
</template>

<script>
	import GraphDrawer from "../../../graphDrawer/GraphDrawer";
	export default {
		name: "TreeSolution.vue",
		props: {
			solution: Array //or Object
        },
        components: {
			GraphDrawer
		}
	}
</script>

<style scoped>

</style>