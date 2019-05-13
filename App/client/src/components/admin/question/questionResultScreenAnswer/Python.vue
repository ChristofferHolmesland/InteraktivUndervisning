<template>
	<GraphDrawer
		id="PythonAnswer"
		controlType="Graph0"
		importType="Graph"
		operatingMode="Interactive"
		:steps="getAnswer"
		:height="400"
		:width="500"
		ref="graphdrawer"
	/>
</template>

<script>
import GraphDrawer from "../../../graphDrawer/GraphDrawer.vue";

export default {
	name: "PythonAnswer",
	props: {
		answer: Object
	},
	components: {
		GraphDrawer
	},
	computed: {
		getAnswer: function() {
			return [
				{
					type: "Complete",
					nodes: this.answer._graphdrawer.nodes,
					edges: this.answer._graphdrawer.edges
				}
			];
		}
	}
};
</script>
