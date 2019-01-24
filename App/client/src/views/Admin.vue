<template>
	<div class="admin">
		<component :is="shownComponent"></component>
	</div>
</template>

<script>
	import Quiz from "../components/admin/Quiz.vue";
	import Dashboard from "../components/admin/Dashboard.vue";
	import Questions from "../components/admin/Questions.vue";
	import Sessions from "../components/admin/Sessions.vue";

	export default {
		data() {
			return {
				shownComponent: undefined
			};
		},
		components: {
			"quiz": Quiz,
			"admin": Dashboard,
			"questions": Questions,
			"sessions": Sessions
		},
		created() {
			this.$socket.emit("adminStarted");
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