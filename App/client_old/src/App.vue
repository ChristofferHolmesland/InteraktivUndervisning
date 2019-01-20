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
			localeLoaded: false,
			socket: dataBus.socket
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

		this.socket.on("unauthorizedAccess", function(){
			that.$router.push("/401");
		});

		this.socket.on("deleteCookie", function(cookieId){
			document.cookie = cookieId + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
		});
	}
};
</script>