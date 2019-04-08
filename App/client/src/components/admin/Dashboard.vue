<template>
	<b-container class="jumbotron">
		<b-row class="mb-5">
			<!-- Select course-->
			<b-col cols="4">
					<b-row><h5>{{ getLocale.changeCourseTitle }}</h5></b-row>
					<b-row>
						<b-container class="px-0">
							<b-row>
								<b-col cols="8">
									<SelectCourse/>
								</b-col>
								<b-col cols="4">
									<b-button @click="showAddNewCourseModal">{{ getLocale.newCourseBtnText }}</b-button>
									<AddNewCourse ref="AddNewCourseModal" elementRef="InnerAddNewCourseModal"/>
								</b-col>
							</b-row>
						</b-container>
					</b-row>
			</b-col>
			<!-- New question -->
			<b-col cols="4" style="text-align: center;">
				<b-row><h5>{{ getLocale.addNewQuestionBtnText }}</h5></b-row>
				<b-row>
					<b-container class="pl-0" style="text-align: center;">
						<b-row>
							<b-col>
								<b-button 	style="width: 100%;"
											@click="newQuestionClicked"
											disabled>
									{{ getLocale.newQuestion }}
								</b-button>
							</b-col>
						</b-row>
					</b-container>
				</b-row>
			</b-col>
			<!-- Last session -->
			<b-col cols="4">
				<b-row><h5>{{ getLocale.viewLastSession }}</h5></b-row>
				<b-row>
					<b-container class="pl-0" style="text-align: center;">
						<b-row>
							<b-col>
								<b-button 	style="width: 100%;"
											@click="viewLastSession"
											disabled>
									{{ getLocale.openLastSession }}
								</b-button>
							</b-col>
						</b-row>
					</b-container>
				</b-row>
			</b-col>
		</b-row>
		<b-row>
			<!-- Add admin -->
			<b-col cols="4">
				<b-row><h5>{{ getLocale.courseAdministrator }}</h5></b-row>
				<b-row>
					<b-container class="px-0">
						<b-row>
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
							<ul style="list-style-type: none;">
								<li :key="admin.feideId" v-for="admin in courseAdmins">
									{{ admin.feideId }} -  {{ admin.name }}
									<b-button size="sm" variant="danger" :id="admin.feideId" @click="removeAdmin($event);">
										x
									</b-button>
								</li>
							</ul>
						</b-row>
					</b-container>
				</b-row>
			</b-col>
			<!-- Add student assistant -->
			<b-col cols="4">
				<b-row><h5>{{getLocale.courseAssistants}}</h5></b-row>
				<b-row>
					<b-container class="px-0">
						<b-row>
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
							<ul style="list-style-type: none;">
								<li :key="assistant.feideId" v-for="assistant in courseAssistants">
									{{ assistant.feideId }} -  {{ assistant.name }}
									<b-button variant="danger" size="sm" :id="assistant.feideId" @click="removeAdmin($event);">
										x
									</b-button>
								</li>
							</ul>
						</b-row>
					</b-container>
				</b-row>
			</b-col>
			<!-- Start session -->
			<b-col cols="4">
				<b-row>
					<h5>{{ getLocale.startSession }}</h5>
				</b-row>
				<b-row>
					<SessionsOverview/>
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
			if (this.newAdminFeideId == "") return;

			this.$socket.emit("setUserRightsLevel", {
				feideId: this.newAdminFeideId,
				courseId: this.$store.getters.getSelectedCourse,
				level: 4
			});

			this.newAdminFeideId = "";
		},
		addNewAssistant: function() {
			if (this.newAssistantFeideId == "") return;

			this.$socket.emit("setUserRightsLevel", {
				feideId: this.newAssistantFeideId,
				courseId: this.$store.getters.getSelectedCourse,
				level: 3
			});

			this.newAssistantFeideId = "";
		},
		removeAdmin: function(btn) {
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

<style scoped>
</style>
