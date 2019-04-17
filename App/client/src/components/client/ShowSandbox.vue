<template>
<b-container id="SandBox" class="jumbotron">
	<b-row class="center firstRow row">
		<b-col cols="12">
			<h1>{{ getLocale.title }}</h1>
		</b-col>
	</b-row>
	<b-row class="middleRow row align-items-center">
		<b-col cols="12">
			<p v-for="(line, index) in getLocale.text" :key="index">
				{{ line }}
			</p>
		</b-col>
	</b-row>
	<b-row class="center lastRow row">
		<b-col cols="12">
			<b-button 	@click="goToSandbox"
						variant="primary"
						size="lg"
						class="btn"
						>
				{{ getLocale.goBtn }}
			</b-button>
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
	},
	computed: {
		getLocale() {
			let locale = this.$store.getters.getLocale("ShowSandbox");
			if (locale) return locale;
			return {};
		}	
	}
};
</script>

<style scoped>
#SandBox {
	position: relative;
	width: 350px;
	height: 500px;
	padding: 50px 35px;
}
.center {
	text-align: center;
}
.btn {
	display: inline-block;
	width: 50%;
}
.firstRow {
	position: absolute;
	left: 45px;
	top: 50px;
	height: 105px;
	line-height: 90px;
}
.middleRow {
	position: absolute;
	left: 45px;
	top: 160px;
	height: 150px;
}
.lastRow {
	position: absolute;
	left: 45px;
	top: 310px;
	height: 90px;
	line-height: 90px;
}
.row {
	width: 280px;
}
p {
	display: inline-block;
}
</style>
