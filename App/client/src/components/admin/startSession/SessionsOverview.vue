<template>
	<div class="session">
		<SelectCourse :changeHandler="courseChanged"/>
		<b-list-group>
			<b-list-group-item 	v-for="session in sessionList"
								:key="session.id">
				{{session.name}} 	<b-button :id="session.id" 
											@click="initializeSession($event)">
										Start
									</b-button>
			</b-list-group-item>
		</b-list-group>
	</div>
</template>

<script>
	import SelectCourse from "../SelectCourse.vue";
	export default {
		name: 'session',
		data() {
			return {
				sessionList: []
			}
		},
		created() {
			let c = this.$store.getters.getSelectedCourse.split(" ");
			this.$socket.emit("sessionOverviewRequest", {code: c[0], semester: c[1]});
		},
		sockets: {
			initializeSessionResponse(sessionId) {
				this.$router.push(`/admin/session/${sessionId}`);
			},
			initializeSessionErrorResponse() {
				// TODO add logic to error handling
			},
			sessionOverviewResponse(sessions){
				this.sessionList = sessions;
			},
			sessionOverviewErrorResponse(){
				// TODO add logic to error handling
			}
		},
		methods: {
			initializeSession(event){
				this.$socket.emit("initializeSession", event.target.id);
			},
			courseChanged(newCourse){
				let c = newCourse.split(" ");
				this.$socket.emit("sessionOverviewRequest", {code: c[0], semester: c[1]});
			}
		},
		computed: {
			getSessionList(){
				return this.sessionList;
			}
		},
		components: {
			SelectCourse
		}
    }

</script>

<style scoped>
</style>