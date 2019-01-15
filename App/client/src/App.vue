<template>
	<div id="app">
		<div v-if="localeLoaded">
			<Navbar/>
			<router-view/>
		</div>
		<div v-else>
		</div>
	</div>
</template>

<script>
	import { dataBus } from "./main";
	import Navbar from "./components/Navbar.vue";

	export default {
		name: "App",
		data() {
			return {
				localeLoaded: false
			}
		},
		components: {
			Navbar
		},
		created() {
		},
		mounted() {
			let that = this;
			dataBus.$on("localeLoaded", function(){
				that.localeLoaded = true;
			});
		}
	};
</script>