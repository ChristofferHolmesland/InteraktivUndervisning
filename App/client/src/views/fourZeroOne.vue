<template>
	<div>
		<b-container id="FourZeroOne">
			<b-row class="firstRow">
				<b-col cols="12" class="text-center">
					<h1>{{ getLocale.unauthorized }}</h1>
				</b-col>
			</b-row>
			<b-row class="secondRow">
				<b-col cols="12" class="text-center">
					<p v-for="item in getLocale.textList" :key="item">
						{{ item }}
					</p>
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
	name: "fourZeroOne",
	methods: {
		homeRedirect() {
			this.$router.push("/");
		}
	},
	computed: {
		getLocale() {
			let locale = this.$store.getters.getLocale("401");
			if (locale) return locale;
			else return {};
		}
	}
};
</script>

<style scoped>
#FourZeroOne {
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
