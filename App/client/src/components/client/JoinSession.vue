<template>
	<b-container id="JoinRoom" class="jumbotron">
		<b-row align-h="center">
			<b-col cols="12" class="text-center mb-5">
				<h1>{{ getTitle }}</h1>
			</b-col>
		</b-row>
		<b-row align-h="center">
			<b-col cols="12" class="text-center mb-5">
				<b-form-input v-model="sessionCode" type="text" :placeholder="getLocale.inputPlaceholder" data-cy="joinSession"/>
			</b-col>
		</b-row>
		<b-row align-h="center">
			<b-col cols="12" class="text-center">
				<b-button size="lg" variant="primary" @click="quickJoin">{{ getLocale.joinBtn }}</b-button>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
export default {
	name: "JoinSession",
	data() {
		return {
			responsetext: "",
			error: false,
			sessionCode: ""
		};
	},
	props: ["quizCode"],
	methods: {
		quickJoin() {
			this.$socket.emit("quickJoinRoom", this.sessionCode);
		}
	},
	sockets: {
		joinSession(sessionCode) {
			this.$router.push(`/client/session/${sessionCode}`); //redirect to waiting room for clients
		},
		sessionInActive() {
			this.error = true;
			setTimeout(() => {
				this.error = false;
			}, 2000);
		}
	},
	computed: {
		getTitle() {
			if (this.error) return this.getLocale.errorTitle;
			else return this.getLocale.title;
		},
		getLocale() {
			let locale = this.$store.getters.getLocale("JoinSession");
			if (locale) return locale;
			return {};
		}
	}
};
</script>
