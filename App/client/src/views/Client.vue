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
					controlType="Graph0" />
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
			requestAnswer: false
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
