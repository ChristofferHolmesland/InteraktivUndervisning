<template>
	<b-container>
		<b-row class="mb-5">
			<!-- Select course-->
			<b-col cols="5" class="jumbotron">
					<b-row><h5>{{ getLocale.changeCourseTitle }}</h5></b-row>
					<b-row>
						<b-container class="px-0">
							<b-row>
								<b-col cols="8">
									<SelectCourse/>
								</b-col>
								<b-col cols="4">
									<b-button @click="showAddNewCourseModal" data-cy="addCourseButton" v-if="getUser.userRights === 4 && getUser.loggedIn">{{ getLocale.newCourseBtnText }} </b-button>
									<AddNewCourse ref="AddNewCourseModal" elementRef="InnerAddNewCourseModal" v-if="getUser.userRights === 4 && getUser.loggedIn"/>
								</b-col>
							</b-row>
						</b-container>
					</b-row>
			</b-col>
			<b-col cols="2"></b-col>
			<!-- Start session -->
			<b-col cols="5" class="jumbotron">
				<b-row>
					<h5>{{ getLocale.startSession }}</h5>
				</b-row>
				<b-row>
					<SessionsOverview/>
				</b-row>
			</b-col>
		</b-row>
		<b-row>
			<!-- Add admin -->
			<b-col cols="5" class="jumbotron">
				<b-row><h5>{{ getLocale.courseAdministrator }}</h5></b-row>
				<b-row>
					<b-container class="px-0">
						<b-row v-if="getUser.userRights === 4 && getUser.loggedIn">
							<b-col cols="8">
								<b-form-input	v-model="newAdminFeideId" 
												type="text"
												placeholder="Feide id">
								</b-form-input>
							</b-col>
							<b-col cols="4">
								<b-button @click="addNewAdmin">{{ getLocale.addBtnText }}</b-button>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<ul style="list-style-type: none;">
									<li :key="admin.feideId" v-for="admin in courseAdmins"
										class="mt-1">
										{{ admin.feideId }} -  {{ admin.name }}
										<b-button size="sm" variant="danger" :id="admin.feideId" @click="removeAdmin($event);" v-if="getUser.userRights === 4 && getUser.loggedIn">
											x
										</b-button>
									</li>
								</ul>
							</b-col>
						</b-row>
					</b-container>
				</b-row>
			</b-col>
			<b-col cols="2"></b-col>
			<!-- Add student assistant -->
			<b-col cols="5" class="jumbotron">
				<b-row><h5>{{getLocale.courseAssistants}}</h5></b-row>
				<b-row>
					<b-container class="px-0">
						<b-row v-if="getUser.userRights === 4 && getUser.loggedIn">
							<b-col cols="8">
								<b-form-input	v-model="newAssistantFeideId" 
												type="text"
												placeholder="Feide id">
								</b-form-input>
							</b-col>
							<b-col cols="4">
								<b-button @click="addNewAssistant">{{ getLocale.addBtnText }}</b-button>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<ul style="list-style-type: none;">
									<li :key="assistant.feideId" v-for="assistant in courseAssistants"
										class="mt-1">
										{{ assistant.feideId }} -  {{ assistant.name }}
										<b-button variant="danger" size="sm" :id="assistant.feideId" @click="removeAdmin($event);" v-if="getUser.userRights === 4 && getUser.loggedIn">
											x
										</b-button>
									</li>
								</ul>
							</b-col>
						</b-row>
					</b-container>
				</b-row>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
import SelectCourse from "./SelectCourse.vue";
import SessionsOverview from "./startSession/SessionsOverview.vue";
import AddNewCourse from "./AddNewCourse.vue";

export default {
	name: "Dashboard",
	data() {
		return {
			newAdminFeideId: "",
			newAssistantFeideId: "",
			courseAdmins: [],
			courseAssistants: []
		};
	},
	computed: {
		selectedCourse() {
			return this.$store.getters.getSelectedCourse;
		},
		getLocale() {
			let locale = this.$store.getters.getLocale("AdminDashboard");
			if (locale) return locale;
			else return {};
		},
		getUser() {
			let user = this.$store.getters.getUser({
				userRights: true,
				loggedIn: true
			});
			return user;
		}
	},
	watch: {
		selectedCourse: function() {
			this.getUserRightsFromDatabase();
		}
	},
	created() {
		this.getUserRightsFromDatabase();
	},
	sockets: {
		getUsersByUserRightsLevelResponse: function(data) {
			if (data.level == 3) {
				this.courseAssistants = data.users;
			} else if (data.level == 4) {
				this.courseAdmins = data.users;
			}
		},
		setUserRightsLevelDone: function() {
			this.getUserRightsFromDatabase();
		}
	},
	methods: {
		newQuestionClicked: function() {
			// TODO: Write the function
		},
		viewLastSession: function() {
			// TODO: Write the function
		},
		addNewAdmin: function() {
			let length = this.newAdminFeideId.length;
			if 
			(
				(length !== 6 && length !== 7 ) ||
				!Number.isInteger(Number(this.newAdminFeideId))
			) return;

			this.$socket.emit("setUserRightsLevel", {
				feideId: this.newAdminFeideId,
				courseId: this.$store.getters.getSelectedCourse,
				level: 4
			});

			this.newAdminFeideId = "";
		},
		addNewAssistant: function() {
			let length = this.newAssistantFeideId.length;
			if 
			(
				(length !== 6 && length !== 7 ) ||
				!Number.isInteger(Number(this.newAssistantFeideId))
			) return;
			if (this.newAssistantFeideId == "") return;

			this.$socket.emit("setUserRightsLevel", {
				feideId: this.newAssistantFeideId,
				courseId: this.$store.getters.getSelectedCourse,
				level: 3
			});

			this.newAssistantFeideId = "";
		},
		removeAdmin: function(btn) {
			let user = this.$store.getters.getUser({feideId: true});
			if (btn.target.id == user.feideId) return;
			this.$socket.emit("setUserRightsLevel", {
				feideId: btn.target.id,
				courseId: this.$store.getters.getSelectedCourse,
				level: -1
			});
		},
		getUserRightsFromDatabase() {
			this.$socket.emit("getUsersByUserRightsLevelsRequest", {
				levels: [3, 4],
				courseId: this.$store.getters.getSelectedCourse
			});
		},
		showAddNewCourseModal() {
			this.$refs.AddNewCourseModal.$refs.InnerAddNewCourseModal.show();
		}
	},
	components: {
		SelectCourse,
		SessionsOverview,
		AddNewCourse
	}
};
</script>
