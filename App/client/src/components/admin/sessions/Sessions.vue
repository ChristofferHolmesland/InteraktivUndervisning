<template>
	<b-container id="sessions" class="mx-0 mt-3" fluid>
		<b-row>
			<b-col lg="3">
				<b-container>
					<b-row class="mb-3">
						<b-col lg="6" class="pr-0">
							<b-form-input v-model="searchText" type="text" placeholder="Search"/>
						</b-col>
						<b-col lg="4" class="px-0">
							<SelectCourse :changeHandler="courseChanged"/>
						</b-col>
						<b-col lg="2" class="pl-0">
							<b-button v-b-modal.newSessionModal>+</b-button>
							<EditSession :okHandler="addNewSessionHandler" elementId="newSessionModal" elementRef="innerModal"/>
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
								<div v-if="sessionsListLength < 10">
									<b-list-group-item v-for="index in (10 - sessionsListLength)" :key="index + sessionsListLength">
										<p> </p>
									</b-list-group-item>
								</div>
							</b-list-group>
						</b-col>
					</b-row>
				</b-container>
			</b-col>
			<b-col lg="8">
				<Session :session="session" v-if="showSession"/>
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
			sessionsList: [],
			sessionsListLength: 0,
			selectedSession: 0,
			searchText: "",
			session: {}
		}
	},
	created() {
		let c = this.$store.getters.getSelectedCourse.split(" ");
		
		this.$socket.emit("getSessions", {code: c[0], semester: c[1]});
	},
	sockets: {
		getSessionsResponse(data) {
			if(data.length != 0){
				this.sessionsList = data;
				this.selectedSession = data[0].id;
				this.$socket.emit("getSession", this.selectedSession)
			}
			else {
				this.sessionsList = [];
				this.selectedSession = 0;
				this.session = {};
			}
		},
		addNewSessionDone() {
			let c = this.$store.getters.getSelectedCourse.split(" ");
			this.$socket.emit("getSessions", {code: c[0], semester: c[1]});
		},
		getSessionResponse(data) {
			this.session = data;
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
			return this.sessionsListLength === 0;
		},
		showSession() {
			return Object.keys(this.session).length !== 0 ? true : false;
		},
		getSelectedSessionId() {
			return this.selectedSession.id;
		}
	}
};
</script>
