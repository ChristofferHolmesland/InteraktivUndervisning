<!--
	Component name: UserProfile
	Use case:
		- Display information about the user.
		- Display statistics about sessions.
		- Let the user delete their information.
-->

<template>
	<b-container class="pt-3">
		<b-row align-h="center" v-if="!showSession">
			<b-col cols="12" lg="5">
				<UserInfo />
			</b-col>
			<b-col cols="12" lg="5" offset-lg="1">
				<UserStats />
			</b-col>
		</b-row>
		<b-row align-h="center" v-if="showSession">
			<b-col cols="12">
				<Session
					:sessionInformation="sessionInformation"
					@showUserStats="showUserStats"
				/>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
import UserInfo from "../components/client/userProfile/UserInfo.vue";
import UserStats from "../components/client/userProfile/UserStats.vue";
import Session from "../components/client/userProfile/Session.vue";

export default {
	name: "userProfile",
	data() {
		return {
			showSession: false,
			sessionInformation: {}
		};
	},
	created() {
		this.$socket.emit("verifyUserLevel", 2);
	},
	sockets: {
		getSessionInformationResponse: function(data) {
			this.sessionInformation = data;
			this.showSession = true;
		}
	},
	methods: {
		showUserStats: function() {
			this.sessionInformation = {};
			this.showSession = false;
		}
	},
	components: {
		UserInfo,
		UserStats,
		Session
	}
};
</script>
