<template>
	<div class="session">
		<b-list-group>
			<b-list-group-item 	v-for="session in sessionList"
								:key="session.id">
				{{session.title}} 	<b-button :id="session.id" 
											@click="initializeSession($event)">
										Start
									</b-button>
			</b-list-group-item>
		</b-list-group>
	</div>
</template>

<script>
	export default {
		name: 'session',
		data() {
			return {
				sessionList: [{id: "3434", title: "session 1"}]
			}
		},
		sockets: {
			initializeSessionResponse(sessionId) {
				console.log(sessionId)
				this.$router.push(`/admin/session/${sessionId}`);
			}
		},
		methods: {
			initializeSession(event){
				console.log(event.target.id)
				this.$socket.emit("initializeSession", event.target.id);
			}
		},
    }

</script>

<style scoped>
</style>