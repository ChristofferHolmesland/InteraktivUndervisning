<template>
    <GraphDrawer    id="TreeAnswer"
                    controlType="Graph0"
                    exportType="Tree"
                    operationMode="Presentation"
                    :steps="answer"
                    :height="400"
                    :width="500"
    />
</template>
<!--Pretty sure :steps does not work like this. Needs to be changed to accommodate for array of trees in steps. Needs a button to show alternatives-->
<script>
	import GraphDrawer from "../../../graphDrawer/GraphDrawer";
	export default {
		name: "Tree.vue",
        props: {
			answer: Array  //or Object
		},
		components: {GraphDrawer}
	}
</script>

<style scoped>

</style>