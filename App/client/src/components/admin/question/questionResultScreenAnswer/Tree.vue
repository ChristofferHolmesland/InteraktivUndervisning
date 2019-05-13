<template>
	<GraphDrawer
		id="TreeAnswer"
		controlType="Graph0"
		importType="Tree"
		operatingMode="Interactive"
		:steps="getAnswer"
		:height="400"
		:width="500"
		ref="graphdrawer"
	/>
</template>
<!-- 
	Pretty sure :steps does not work like this.
	Needs to be changed to accommodate for array of trees in steps. 
	Needs a button to show alternatives.
-->
<script>
import GraphDrawer from "../../../graphDrawer/GraphDrawer.vue";

export default {
	name: "TreeAnswer",
	props: {
		answer: Object
	},
	components: {
		GraphDrawer
	},
	computed: {
		getAnswer: function() {
			return [this.answer];
		}
	}
};
</script>
