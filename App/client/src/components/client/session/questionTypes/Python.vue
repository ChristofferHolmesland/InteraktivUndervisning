<template>
	<div id="Python">
		<b-container>
			<GraphDrawer 
					@getValueResponse="gotGraphDrawer" 
					:requestAnswer="requestAnswerFromGraphDrawer" 
					controlType="Python"
					operatingMode="Interactive"
					:steps="steps"
					:displayEdgeValues="false"
					:directedEdges="true"
					/>
		</b-container>
	</div>
</template>

<script>
import GraphDrawer from "../../../graphDrawer/GraphDrawer.vue";

export default {
	name: "Python",
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
	watch: {
		requestAnswer: function() {
			this.requestAnswerFromGraphDrawer = !this.requestAnswerFromGraphDrawer;
		}
	}
};
</script>
