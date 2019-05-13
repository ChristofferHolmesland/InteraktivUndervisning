<template>
<div id="app" class="mb-5">
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

// https://stackoverflow.com/a/24103596/3407591
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

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
		let locale = "no"

		let localeCookie = getCookie("localization")
		if (localeCookie !== null) locale = localeCookie;

		this.$socket.emit("getLocaleRequest", locale);
		this.$socket.emit("getQuestionTypeRequest");
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
			document.cookie = "localization=; Max-Age=0;";
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
		},
		questionTypesResponse(questionTypes) {
			this.$store.commit("setQuestionTypes",questionTypes)
		}
	}
};
</script>

<style>
/* Custom Scrollbars */
/* width */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  opacity: 0; 
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 5px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555; 
}

/* Corner */
::-webkit-scrollbar-corner {
	opacity: 0;
}
</style>
