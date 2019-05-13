<template>
	<GraphDrawer
		ref="graphdrawer"
		controlType="Python"
		operatingMode="Presentation"
		:steps="solution"
	/>
</template>

<script>
import GraphDrawer from "../../../graphDrawer/GraphDrawer.vue";
export default {
	name: "PythonSolution",
	props: {
		solution: Array
	},
	components: {
		GraphDrawer
	}
};
</script>

<style scoped></style>
