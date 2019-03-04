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
		};
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
		deleteCookie(cookieId) {
			document.cookie = "sessionId=; Max-Age=0;";
		},
		clientLoginInfoResponse(userData) {
			this.$store.commit("userChange", userData);

			if (userData.userRights > 2) {
				this.$socket.emit("courseListRequest");
			}
		},
		courseListResponse(courseList) {
			this.$store.commit("setCourseList", courseList);
		},
		serverRestarted() {
			location.reload(true);
		}
	}
};
</script>
