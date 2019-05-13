<template>
	<div id="Tree">
		<b-container>
			<GraphDrawer
				@getValueResponse="gotGraphDrawer"
				:requestAnswer="requestAnswerFromGraphDrawer"
				controlType="Graph0"
				importType="Tree"
				operatingMode="Interactive"
				exportType="Tree"
				:steps="steps"
			/>
		</b-container>
	</div>
</template>

<script>
import GraphDrawer from "../../../../graphDrawer/GraphDrawer.vue";
export default {
	name: "Tree",
	data() {
		return {
			requestAnswerFromGraphDrawer: false
		};
	},
	props: ["requestAnswer", "steps"],
	methods: {
		gotGraphDrawer: function(result) {
			this.$emit("getTextResponse", result);
		}
	},
	watch: {
		requestAnswer: function() {
			this.requestAnswerFromGraphDrawer = !this
				.requestAnswerFromGraphDrawer;
		}
	},
	components: {
		GraphDrawer
	}
};
</script>

<style scoped></style>
