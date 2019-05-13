<template>
	<GraphDrawer
		id="QuicksortAnswer"
		controlType="Sort"
		sortType="Quicksort"
		operatingMode="Presentation"
		:steps="answer"
		:height="400"
		:width="500"
		ref="graphdrawer"
	/>
</template>

<script>
import GraphDrawer from "../../../graphDrawer/GraphDrawer.vue";

export default {
	name: "QuicksortAnswer",
	props: {
		answer: Array
	},
	components: {
		GraphDrawer
	}
};
</script>
