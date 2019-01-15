<template>
	<div id="app">
		<div v-if="localeLoaded">
			<NavBar>
        	<router-view/>
		</div>
    	<div v-else>

    	</div>
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
				that.localeLoaded = true;
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
