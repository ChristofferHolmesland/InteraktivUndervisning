<template>
	<div class="Client">
		<h1>This is the client page</h1>
		<b-container>
			<b-row>
				<b-col cols="12" lg="4">
					<JoinSession/>
				</b-col>
				<b-col cols="12" lg="8">
					<GraphDrawer 
								controlType="Sort" 
								sortType="Quicksort" 
								operatingMode="Presentation" 
								:steps="steps" />
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
	components: {
		JoinSession,
		GraphDrawer
	},
	data() {
		return {
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

		}
	},
	created() {
		this.$socket.emit("verifyUserLevel", 1);
	}
};
</script>

<style scoped>
h1 {
	margin-top: 3rem;
	text-align: center;
}
</style>
