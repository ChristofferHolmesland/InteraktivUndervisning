<template>
	<div class="admin" fluid>
		<component :is="shownComponent"></component>
	</div>
</template>

<script>
	import Session from "../components/admin/Session.vue";
	import Dashboard from "../components/admin/Dashboard.vue";
	import Questions from "../components/admin/Questions.vue";
	import Sessions from "../components/admin/sessions/Sessions.vue";

	export default {
		data() {
			return {
				shownComponent: undefined
			};
		},
		components: {
			"session": Session,
			"admin": Dashboard,
			"questions": Questions,
			"sessions": Sessions
		},
		created() {
			this.$socket.emit("verifyUserLevel", 4);
			let componentName = this.getLastPathEntry(this.$route.path);
			this.shownComponent = componentName;
		},
		watch: {
			"$route" (to, from) {
				to = this.getLastPathEntry(to.path);
				from = this.getLastPathEntry(from.path);
				//console.log(from + " -> " + to);
				this.shownComponent = to;
			}
		},
		methods: {
			getLastPathEntry: function(path) {
				return path.split("/").slice(-1)[0];
			}
		}
	}
</script>

<style scoped>
</style>