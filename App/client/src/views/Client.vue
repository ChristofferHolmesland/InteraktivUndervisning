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
					controlType="Python"
					operatingMode="Interactive"
				/>
				<b-button @click="requestAnswer = !requestAnswer" >Export</b-button>
<!--				<shellsort :initialList="[	]" :initialKValue="3"/> -->
				</b-col>
			</b-row>
		</b-container>
	</div>
</template>

<script>
import JoinSession from "../components/client/JoinSession.vue";
import GraphDrawer from "../components/graphDrawer/GraphDrawer.vue";
import Shellsort from "../components/client/session/questionTypes/sorting/Shellsort.vue"

export default {
	name: "client",
	components: {
		JoinSession,
	},
	created() {
		this.$socket.emit("verifyUserLevel", 1);
	},
	methods: {
		printFiles(event) {
			console.log(event);
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
