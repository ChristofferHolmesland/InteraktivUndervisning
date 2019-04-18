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
							<b-button @click="AddNewSession" variant="primary">
								<i class="fas fa-plus-square"></i>
							</b-button>
							<EditSession ref="newSessionModal" :okHandler="addNewSessionHandler" elementId="newSessionModal" elementRef="innerModal" v-if="showNewSession"/>
						</b-col>
					</b-row>
					<b-row v-if="showError" style="text-align: center;">
						<b-col cols="12">
							<b-alert	:show="showError"
										@dismissed="showError = false"
										variant="danger"
										dismissible>
								<p>{{ getLocale[errorText] }}</p>
							</b-alert>
						</b-col>
					</b-row>
					<b-row>
						<b-col>
							<b-list-group style="overflow-y: scroll; max-height: 750px;">
								<b-list-group-item v-for="session in getSessionsList" :key="session.id"
								@click="changeSelected($event)"
								:id="session.id"
								style="cursor: pointer;"
								:class="selectedSession == session.id ? 'selected' : ''">
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
			session: {},
			showError: false,
			errorText: "",
			showNewSession: false
		}
	},
	created() {
		let courseId = this.$store.getters.getSelectedCourse;
		
		this.$socket.emit("getSessions", courseId);
	},
	mounted() {
		this.$root.$on('bv::modal::hidden', (bvEvent, modalId) => {
			let id = bvEvent.target.id;

			if (id.includes("newSessionModal")) {
				this.showNewSession = false;

			}
		});
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
			let courseId = this.$store.getters.getSelectedCourse;
			this.$socket.emit("getSessions", courseId);
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
			this.$socket.emit("getSessions", newCourse);
		},
		AddNewSession: function() {
			let courseId = this.$store.getters.getSelectedCourse;
			if (courseId === undefined || courseId === "") {
				this.errorText = "courseMissing";
				this.showError = true;
				return;
			}
			this.$nextTick(() => {
				this.showNewSession = true;
				this.$nextTick(() => {
					this.$refs.newSessionModal.$refs.innerModal.show();
				});
			});
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
		},
		getLocale() {
			let locale = this.$store.getters.getLocale("AdminQuestions");
			if(locale) return locale;
			else return {};
		}
	}
};
</script>

<style scoped>
.selected {
	background-color: darkgray;
}
</style>
