<template>
	<b-container id="sessions" class="mx-0 mt-3">
		<b-row>
			<b-col lg="4">
				<b-container>
					<b-row>
						<b-col lg="10" class="pr-0">
							<b-form-input placeholder="Search">
							</b-form-input>
						</b-col>
						<b-col lg="2" class="pl-0">
							<b-button>+</b-button>
						</b-col>
					</b-row>
					<b-row>
						<b-col>
							<b-list-group style="max-height:400px">
								<b-list-group-item v-for="(session, key) in getSessionsList" :key="session"
								@click="changeSelected($event)"
								:id="key"
								style="cursor: pointer;">
									{{session}}
								</b-list-group-item>
							</b-list-group>
						</b-col>
					</b-row>
				</b-container>
			</b-col>
			<b-col lg="8">
				<Session :sessionId="getSelectedSessionId"/>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
	import Session from "./Session.vue";
	export default {
		name: 'Sessions',
		data() {
			return {
				sessionsList: {},
				selectedSession: "0"
			}
		},
		created() {
			this.$socket.emit("getSessions");
		},
		sockets: {
			getSessionsResponse(data) {
				if(data.sessions.length != 0){
					this.sessionsList = data.sessions;
					this.selectedSession = Object.keys(data.sessions)[0];
        			this.$socket.emit("getSession", this.selectedSession)
				}
			}
		},
		components: {
			Session
		},
		methods: {
			changeSelected(event) {
				this.selectedSession = event.target.id;
        		this.$socket.emit("getSession", this.selectedSession)
			}
		},
		computed: {
			getSessionsList() {
				return this.sessionsList;
			},
			getSelectedSessionId() {
				return this.selectedSession;
			}
		}
    }

</script>