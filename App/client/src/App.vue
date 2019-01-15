<template>
	<div id="app">
		<div v-if="localeLoaded">
			<NavBar>
		</div>
    	<div v-else>

    	</div>
		<router-view/>
	</div>
</template>

<script>
	import { dataBus } from './main';
	import NavBar from "./components/NavBar.vue";

	export default {
		name: "App",
		data() {
			return {
				localeLoaded: false
			}
		},
		components: {
			NavBar
		},
		mounted() {
			let that = this;
			dataBus.$on("localeLoaded", function(){
				console.log(that.localeLoaded);
				that.localeLoaded = true;
				console.log(that.localeLoaded);
			});
		}
	};
</script>

<style scoped>
	#app {
		min-width: 750px;
	}
</style>

<style>
	body {
		background-color: #ccc/*#b7b7b7/*#1c11ee*/;
	}
</style>
