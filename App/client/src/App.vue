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
		this.$socket.emit("getLocaleRequest", "no");
		this.$socket.emit("clientLoginInfoRequest");
	},
	sockets: {
		getLocaleResponse(data) {
			this.$store.commit("localeChange", data);
			this.localeLoaded = true;
		},
		unauthorizedAccess() {
			this.$router.push("/401");
		},
		deleteCookie(cookieId){
			document.cookie = cookieId + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;"	
		},
		clientLoginInfoResponse(userData){
			this.$store.commit("userChange", userData);
		}
	}
}
</script>

<style>
	body {
		background-color: #ccc/*#b7b7b7/*#1c11ee*/;
	}
</style>
