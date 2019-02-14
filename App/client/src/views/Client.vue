<template>
	<div class="Client">
		<h1>This is the client page</h1>
		<b-container>
			<b-row>
				<b-col cols="12" lg="4">
					<JoinSession/>
				</b-col>
			</b-row>
		</b-container>
	</div>
</template>

<script>
import JoinSession from "../components/client/JoinSession.vue";

export default {
	name: "client",
	components: {
		JoinSession
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
