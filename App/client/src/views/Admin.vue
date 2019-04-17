<template>
	<div class="admin" fluid>
		<component :is="shownComponent"></component>
	</div>
</template>

<script>
import Session from "../components/admin/startSession/SessionsOverview.vue";
import Dashboard from "../components/admin/Dashboard.vue";
import Questions from "../components/admin/question/Questions.vue";
import Sessions from "../components/admin/sessions/Sessions.vue";

export default {
	data() {
		return {
			shownComponent: undefined
		};
	},
	components: {
		session: Session,
		admin: Dashboard,
		questions: Questions,
		sessions: Sessions
	},
	created() {
		this.$socket.emit("verifyUserLevel", 3);
		let componentName = this.getLastPathEntry(this.$route.path);
		this.shownComponent = componentName;
	},
	watch: {
		$route(to) {
			to = this.getLastPathEntry(to.path);
			this.shownComponent = to;
		}
	},
	methods: {
		getLastPathEntry: function(path) {
			return path.split("/").slice(-1)[0];
		}
	}
};
</script>
