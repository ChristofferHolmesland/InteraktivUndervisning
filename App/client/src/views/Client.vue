<!--
	Component name: Client
	Use case:
		- Lets a client navigate between the other client pages.
-->

<template>
<b-container id="Client">
	<b-row align-h="around">
		<b-col cols="12" lg="6" :xl="getCardSizeLg" class="margin">
			<JoinSession/>
		</b-col>
		<b-col cols="12" lg="6" :xl="getCardSizeLg">
			<ShowSandbox/>
		</b-col>
		<b-col cols="12" lg="6" :xl="getCardSizeLg" v-if="getUser.userRights > 1">
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
	},
	computed: {
		getUser() {
			let user = this.$store.getters.getUser({
				username: true,
				userRights: true,
				loggedIn: true
			});
			return user;
		},
		getCardSizeLg: function() {
			let userRight = this.getUser.userRights;
			return userRight > 1 ? 4 : 6;
		}
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
