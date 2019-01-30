<template>
	<b-container id="sessions" class="mx-0 mt-3" fluid>
		<b-row>
			<b-col lg="3">
				<b-container>
					<b-row class="mb-3">
						<b-col lg="6" class="pr-0">
							<b-form-input v-model="searchText" type="text" placeholder="Search">
							</b-form-input>
						</b-col>
						<b-col lg="4" class="px-0">
							<SelectCourse :changeHandler="courseChanged"/>
						</b-col>
						<b-col lg="2" class="pl-0">
							<b-button v-b-modal.newSessionModal>+</b-button>
							<EditSession :okHandler="addNewSessionHandler" elementId="newSessionModal" elementRef="innerModal"></EditSession>
						</b-col>
					</b-row>
					<b-row>
						<b-col>
							<b-list-group style="overflow-y: scroll; max-height: 750px;">
								<b-list-group-item v-for="session in getSessionsList" :key="session.id"
								@click="changeSelected($event)"
								:id="session.id"
								style="cursor: pointer;">
									{{session.name}}
								</b-list-group-item>
								<b-list-group-item class="border-0" v-show="showNoSessions">
									No sessions
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
	import EditSession from "./EditSession.vue";
	import SelectCourse from "../SelectCourse.vue";
	export default {
		name: 'Sessions',
		data() {
			return {
				sessionsList: {},
				selectedSession: "0",
				searchText: "",
				sessionsListLength: 0
			}
		},
		created() {
			this.$socket.emit("getSessions", {code:"DAT200", semester:"18H"});
		},
		sockets: {
			getSessionsResponse(data) {
				if(data.length != 0){
					this.sessionsList = data;
					this.selectedSession = data[0];
        			this.$socket.emit("getSession", this.getSelectedSessionId)
				}
			},
			addNewSessionDone() {
				this.$socket.emit("getSessions", {code:"DAT200", semester:"18H"});
			}
		},
		components: {
			Session,
			EditSession,
			SelectCourse
		},
		methods: {
			changeSelected(event) {
				this.selectedSession = event.target.id;
        		this.$socket.emit("getSession", this.selectedSession)
			},
			addNewSessionHandler: function(newSession) {
				this.$socket.emit("addNewSession", newSession);
			},
			courseChanged: function(newCourse) {
				let c = newCourse.split(" ");
				this.$socket.emit("getSessions", {code: c[0], semester: c[1]});
			}
		},
		computed: {
			getSessionsList() {
				if (this.searchText == "") {
					this.sessionsListLength = this.sessionsList.length;
					return this.sessionsList;
				}

				let result = [];
				for (let i = 0; i < this.sessionsList.length; i++) {
					if (this.sessionsList[i].name.toLowerCase().includes(this.searchText.toLowerCase())) {
						result.push(this.sessionsList[i]);
					}
				}

				this.sessionsListLength = result.length;
				return result;
			},
			showNoSessions() {
				return this.sessionsListLength == 0;
			},
			getSelectedSessionId() {
				return this.selectedSession.id;
			}
		}
    }

</script>