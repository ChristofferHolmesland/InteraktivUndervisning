<template>
<b-container id="Client">
	<b-row>
		<b-col cols="12" lg="4" class="margin">
			<JoinSession/>
		</b-col>
		<b-col cols="12" lg="4">
			<ShowSandbox/>
		</b-col>
		<b-col cols="12" lg="4">
			<ViewLastSession/>
		</b-col>
	</b-row>
</b-container>
</template>

<script>
import JoinSession from "../components/client/JoinSession.vue";
import ShowSandbox from "../components/client/ShowSandbox.vue";
import ViewLastSession from "../components/client/ViewLastSession.vue";

export default {
	name: "client",
	components: {
		JoinSession,
		ShowSandbox,
		ViewLastSession
	},
	created() {
		this.$socket.emit("verifyUserLevel", 1);
	}
};
</script>

<style scoped>
.margin {
	margin-bottom: 2rem;
}

@media (min-width: 992px) {
	.margin {
		margin-bottom: 0;
	}
}
</style>
