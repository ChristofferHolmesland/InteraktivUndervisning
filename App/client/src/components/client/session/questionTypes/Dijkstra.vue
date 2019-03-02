<template>
	<div id="Dijkstra">
		<b-container>
			<GraphDrawer 
					@getValueResponse="gotGraphDrawer" 
					:requestAnswer="requestAnswerFromGraphDrawer" 
					controlType="Dijkstra"
					operatingMode="Interactive"
					:graph="getGraphFromSteps" />
		</b-container>
	</div>
</template>

<script>
import GraphDrawer from "../../../graphDrawer/GraphDrawer.vue";

export default {
	name: "Dijkstra",
	data() {
		return {
			requestAnswerFromGraphDrawer: false
		}
	},
	methods: {
		gotGraphDrawer: function(result) {
			this.$emit("getTextResponse", result);
		}
	},
	components: {
		GraphDrawer
	},
	props: ["requestAnswer", "steps"],
	computed: {
		getGraphFromSteps: function() {
			return this.steps[0];
		}
	},
	watch: {
		requestAnswer: function() {
			this.requestAnswerFromGraphDrawer = !this.requestAnswerFromGraphDrawer;
		}
	}
};
</script>
