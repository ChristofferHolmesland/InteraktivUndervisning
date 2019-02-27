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
					operatingMode="Interactive"
					:steps="steps" />
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
			steps: [
    {
        type: "Initial",
        list: [10, 9, 2, 3, 11, 7, 5],
    },
    {
        type: "Split",
        pivot: 5,
        list: [10, 9, 2, 3, 11, 7, 5],
        left: [2, 3],
        right: [10, 9, 11, 7],
    },
    {
        type: "Split",
        pivot: 2,
        list: [2, 3],
        left: [3],
        right: [],
    },
    {
        type: "Split",
        pivot: 10,
        list: [10, 9, 11, 7],
        left: [7, 9],
        right: [11],
    },
    {
        type: "Split",
        pivot: 7,
        list: [7, 9],
        left: [9],
        right: []
    }
]

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
