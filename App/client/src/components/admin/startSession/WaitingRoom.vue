<template>
	<div id="adminWaitingRoom">
		<b-container vertical-center>
			<b-row align-h="center">
				<b-col lg="8">
					<h1>{{ getLocale.code }} {{getSessionId}}</h1>
				</b-col>
			</b-row>
			<b-row align-h="center">
				<b-col lg="8">
					<h1>{{ getLocale.usersConnected}} {{getNumberOfUsersConnected}}</h1>
				</b-col>
			</b-row>
			<b-row align-h="center">
				<b-col lg="8">
					<h1>{{ getLocale.waitingtext }}{{waitingForPlayersAnimation}}</h1>
				</b-col>
			</b-row>
			<b-row align-h="center">
				<b-col lg="8">
					<b-button size="lg" @click="startSession">{{ getLocale.start }}</b-button>
				</b-col>
			</b-row>
		</b-container>
	</div>
</template>

<script>
export default {
	name: "adminWaitingRoom",
	props: ["sessionId"],
	data() {
		return {
			numberOfUsersConnected: 0,
			interval: undefined,
			intervalStep: 500,
			waitingForPlayersAnimation: "."
		};
	},
	mounted() {
		this.interval = setInterval(() => {
			if (this.waitingForPlayersAnimation === "...") {
				this.waitingForPlayersAnimation = "";
				return;
			}
			this.waitingForPlayersAnimation += ".";
		}, this.intervalStep);
	},
	sockets: {
		updateParticipantCount: function(participantsCount) {
			this.numberOfUsersConnected = participantsCount;
		}
	},
	methods: {
		startSession: function() {
			this.$socket.emit("startSession", this.sessionId);
		}
	},
	computed: {
		getNumberOfUsersConnected: function() {
			return this.numberOfUsersConnected;
		},
		getSessionId: function() {
			return this.sessionId;
		},
		getLocale: function() {
			let locale = this.$store.getters.getLocale("AdminWaitingRoom");
			if (locale) return locale;
			else return {};
		}
	}
};
</script>
