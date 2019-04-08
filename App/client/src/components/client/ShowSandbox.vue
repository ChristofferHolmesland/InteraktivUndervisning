<template>
<b-container class="jumbotron card">
	<b-row class="center margin">
		<b-col cols="12">
			<h1>Go to sandbox</h1>
		</b-col>
	</b-row>
	<b-row class="margin rowMiddle">
		<b-col>
			<p>Practice with different question types.</p>
			<p>Play with the graphdrawer to get familiar with the controls.</p>
		</b-col>
	</b-row>
	<b-row class="center">
		<b-col cols="12">
			<b-button @click="goToSandbox" variant="primary" size="lg" class="btn">Go</b-button>
		</b-col>
	</b-row>
</b-container>
</template>

<script>
export default {
	name: "ShowSandbox",
	methods: {
		goToSandbox() {
			this.$router.push("/client/sandbox");
		}
	}
};
</script>

<style scoped>
.center {
	text-align: center;
}
.margin {
	margin-bottom: 2rem;
}
.card {
	height: 100%;
}
.btn {
	display: inline-block;
	width: 50%;
}
.rowMiddle {
	height: 30%;
}
</style>
