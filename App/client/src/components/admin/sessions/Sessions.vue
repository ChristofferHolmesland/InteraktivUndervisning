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
							<b-button block @click="AddNewSession" variant="primary">
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
								@click="changeSelected(session.id)"
								style="cursor: pointer;"
								:class="selectedSession == session.id ? 'selected' : ''">
									<b-container>
										<b-row>
											<b-col class="my-auto">
												{{ session.name }}
											</b-col>
											<b-col 	cols="2"
													:disabled="session.status === 0 ? true : false"
													v-b-tooltip.hover
													title="Only inactive sessions can be edited"
													>
												<b-button	:variant="session.status === 0 ? 'primary' : ''"
															@click="editSession(session.id)"
															:disabled="session.status === 0 ? false : true"
															>
													<i class="fas fa-edit"></i>
												</b-button>
											</b-col>
											<b-col 	cols="2"
													:disabled="session.status === 0 ? true : false"
													v-b-tooltip.hover
													title="Only inactive sessions can be deleted"
													>
												<b-button	:variant="session.status === 0 ? 'danger' : ''"
															@click="removeSession(session.id)"
															:disabled="session.status === 0 ? false : true"
															>
													<i class="far fa-trash-alt"></i>
												</b-button>
											</b-col>
										</b-row>
									</b-container>
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
				<Session :session="session" v-if="showSession" @MarkAnswerAsCorrectResponse="removeAnswer"/>
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
			showNewSession: false,
			newEditSession: ""
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
		getSessionsResponse: function(data) {
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
		addNewSessionDone: function() {
			let courseId = this.$store.getters.getSelectedCourse;
			this.$socket.emit("getSessions", courseId);
		},
		getSessionResponse: function(data) {
			this.session = data;
		},
		deleteSessionResponse: function() {
			let courseId = this.$store.getters.getSelectedCourse;
			
			this.$socket.emit("getSessions", courseId);
		},
		editSessionResponse: function(data) {
			this.showNewSession = true;
			this.newEditSession = "edit";
			this.$nextTick(function() {
				this.$refs.newSessionModal._data.newSession.id = data.id;
				this.$refs.newSessionModal._data.newSession.title = data.name;
				this.$refs.newSessionModal._data.newSession.course = data.courseId;
				this.$refs.newSessionModal._data.newSession.questions = data.selectedQuestions;
				this.$refs.newSessionModal._data.possibleQuestions = data.questionOptions;
				this.$refs.newSessionModal._data.selectedQuestion = [];
							
				this.$nextTick(function() {
					this.$refs.newSessionModal.$refs.innerModal.show();
				});
			});
		}
	},
	components: {
		Session,
		EditSession,
		SelectCourse
	},
	methods: {
		changeSelected(sessionId) {
			this.selectedSession = sessionId;
			this.$socket.emit("getSession", this.selectedSession)
		},
		addNewSessionHandler: function(newSession) {
			if (this.newEditSession === "new"){
				this.$socket.emit("addNewSession", newSession);
			} else if (this.newEditSession === "edit") {
				this.$socket.emit("editSession", newSession);
			}
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
				this.newEditSession = "new";
				this.$nextTick(() => {
					this.$refs.newSessionModal.$refs.innerModal.show();
				});
			});
		},
		removeAnswer: function(data) {
			let answerList = this.session.questions[data.selectedQuestion].answerList;
      
			let index = answerList.findIndex(answer => {
				return answer.id == data.answerId
			});
      
			if (index > -1) answerList.splice(index, 1);
		},
		editSession: function(sessionId) {
			this.$socket.emit("editSessionRequest", sessionId);
		},
		removeSession: function(sessionId) {
			this.$socket.emit("deleteSessionRequest", sessionId);
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
