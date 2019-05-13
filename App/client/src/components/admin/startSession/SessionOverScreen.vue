<!--
	Component name: SessionOverScreen
	Use case:
		- Display text stating that the session is done.
		- Let the user navigate back to the dashboard.
-->


<template>
	<div>
		<b-container id="SessionOverScreen">
			<b-row>
				<b-col class="text-center">
					<h1>{{ noUsers ? getLocale.headerNoUser : getLocale.header}}</h1>
				</b-col>
			</b-row>
			<b-row class="mt-3">
				<b-col class="text-center">
					<b-button @click="closeSession" variant="primary">{{ getLocale.goBackBtn }}</b-button>
				</b-col>
			</b-row>
		</b-container>
	</div>
</template>

<script>
export default {
	name: "SessionOverScreen",
	props: ["noUsers"],
	beforeDestroy() {
		this.$socket.emit("closeSession");
	},
	sockets: {
		closeSessionResponse() {
			this.$router.push("/admin");
		}
	},
	methods: {
		closeSession() {
			this.$socket.emit("closeSession");
		}
	},
	computed: {	
		getLocale: function() {
			let locale = this.$store.getters.getLocale("AdminSessionOver");
			if (locale) return locale;
			else return {};
		}
	}
};
</script>

<style scoped>
#SessionOverScreen {
	min-width: 500px;
	max-width: 500px;;
	min-height: 400px;
	min-height: 400px;
	margin: 0 auto;
}
</style>
