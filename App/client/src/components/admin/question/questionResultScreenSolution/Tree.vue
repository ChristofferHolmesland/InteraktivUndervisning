<template>
    <GraphDrawer    id="TreeSolution"
                    controlType="Graph0"
                    importType="Tree"
                    operationMode="Presentation"
                    :steps="solution"
                    :height="400"
                    :width="500"
    />
</template>

<script>
	import GraphDrawer from "../../../graphDrawer/GraphDrawer.vue";
	export default {
		name: "TreeSolution",
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