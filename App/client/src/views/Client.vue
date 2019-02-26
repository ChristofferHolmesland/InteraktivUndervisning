<template>
	<div class="Client">
		<h1>This is the client page</h1>
		<b-container>
			<b-row>
				<b-col cols="12" lg="4">
					<JoinSession/>
				</b-col>
				<b-col cols="12" lg="8">

<!-- TODO: Remove GraphDrawer from this file. Currently used for testing -->
    			<GraphDrawer 
					@getValueResponse="printGraphDrawer" 
					:requestAnswer="requestAnswer" 
					controlType="Sort"
					sortType="Quicksort"
					:steps="steps"
					operatingMode="Presentation" />
				<b-button @click="requestAnswer = !requestAnswer" >Export</b-button>
				</b-col>
			</b-row>
		</b-container>
	</div>
</template>

<script>
import JoinSession from "../components/client/JoinSession.vue";
import GraphDrawer from "../components/graphDrawer/GraphDrawer.vue";

export default {
	name: "client",
	data() {
		return {
			requestAnswer: false,
			steps: [{
    "type": "Initial",
    "list": [2344, 624, 62, 2347347, 3473, 47234, 0]
}, {
    "type": "Split",
    "list": [2344, 624, 62, 2347347, 3473, 47234, 0],
    "pivot": 2344,
    "left": [624, 62, 0],
    "right": [2347347, 3473, 47234]
}, {
    "type": "Split",
    "list": [624, 62, 0],
    "pivot": 62,
    "left": [0],
    "right": [624]
}, {
    "type": "Merge",
    "leftSorted": [0],
    "rightSorted": [624],
    "pivot": 62,
    "sorted": [0, 62, 624]
}, {
    "type": "Split",
    "list": [2347347, 3473, 47234],
    "pivot": 47234,
    "left": [3473],
    "right": [2347347]
}, {
    "type": "Merge",
    "leftSorted": [3473],
    "rightSorted": [2347347],
    "pivot": 47234,
    "sorted": [3473, 47234, 2347347]
}, {
    "type": "Merge",
    "leftSorted": [0, 62, 624],
    "rightSorted": [3473, 47234, 2347347],
    "pivot": 2344,
    "sorted": [0, 62, 624, 2344, 3473, 47234, 2347347]
}]
		};
	},
	components: {
		JoinSession,
		GraphDrawer
	},
	created() {
		this.$socket.emit("verifyUserLevel", 1);
	},
	methods: {
		printGraphDrawer: function(data) {
			console.log(data);
			console.log(JSON.stringify(data));
		}
	}
};
</script>

<style scoped>
h1 {
	margin-top: 3rem;
	text-align: center;
}
</style>
