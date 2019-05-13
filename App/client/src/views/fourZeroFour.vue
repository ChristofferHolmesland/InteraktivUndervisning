<!--
	Component name: fourzeroFour
	Use case:
		- Display an error message to the user when they are trying to access
			non-existing page.
		- Lets the user navigate back to the main client page. 
-->

<template>
	<div>
		<b-container id="FourZeroFour">
			<b-row class="firstRow">
				<b-col cols="12" class="text-center">
					<h1>{{ getLocale.headline }}</h1>
				</b-col>
			</b-row>
			<b-row class="secondRow">
				<b-col cols="12" class="text-center">
					<p>{{ getLocale.text }}</p>
				</b-col>
			</b-row>
			<b-row class="thirdRow">
				<b-col cols="12" class="text-center">
					<b-button @click="homeRedirect" variant="success">{{
						getLocale.homeButton
					}}</b-button>
				</b-col>
			</b-row>
		</b-container>
	</div>
</template>

<script>
export default {
	name: "fourZeroFour",
	methods: {
		homeRedirect() {
			this.$router.push("/");
		}
	},
	computed: {
		getLocale() {
			let locale = this.$store.getters.getLocale("404");
			if (locale) return locale;
			else return {};
		}
	}
};
</script>

<style scoped>
#FourZeroFour {
	min-width: 500px;
	max-width: 500px;
	min-height: 400px;
	min-height: 400px;
	margin: 0 auto;
}
.firstRow {
	margin-top: 75px;
}
.secondRow {
	margin-top: 40px;
}
.thirdRow {
	margin-top: 40px;
}
button {
	width: 100px;
}
</style>
