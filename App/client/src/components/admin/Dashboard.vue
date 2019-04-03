<template>
	<b-container class="jumbotron mt-4">
		<b-row class="mb-5">
			<!-- Select course-->
			<b-col cols="4">
					<b-row>
						<p>{{ getLocale.changeCourseTitle }}</p>
					</b-row>
					<b-row>
							<b-col cols="9">
								<SelectCourse/>
							</b-col>
							<b-col cols="3" class="pl-0">
								<b-button v-b-modal.newCourseModal>{{ getLocale.newCourseBtnText }}</b-button>
								<b-modal id="newCourseModal" 
										 :no-close-on-backdrop="true" 
										 :title="getLocale.addCourseTitle" 
										 style="text-align: left;"
										 @ok="addNewCourse">

										<b-form-group 	id="courseCode"
														:label="getLocale.addCourseCourseCode"
														label-for="courseCodeInput">
										<b-form-input 	id="courseCodeInput"
														type="text"
														v-model="newCourse.code">
										</b-form-input>
									</b-form-group>
									<b-form-group 	id="courseSemester"
													:label="getLocale.addCourseCourseSemester"
													label-for="courseSemesterInput">
										<b-form-input 	id="courseSemesterInput"
														type="text"
														v-model="newCourse.semester">
										</b-form-input>
									</b-form-group>									
									<b-form-group 	id="courseName"
													:label="getLocale.addCourseCourseName"
													label-for="courseNameInput">
										<b-form-input 	id="courseNameInput"
														type="text"
														v-model="newCourse.name">
										</b-form-input>
									</b-form-group>
								</b-modal>
							</b-col>
					</b-row>
			</b-col>
			<!-- New question -->
			<b-col cols="4" style="text-align: center;">
				<b-row><p>{{ getLocale.addNewQuestionBtnText }}</p></b-row>
				<b-row>
					<div class="btn disabled btn-secondary m-0 p-0" 
						style="display: flex; justify-content: center; align-items: center; position: absolute; height: 50%; width: 90%; left: 5%; bottom: 0px;"
						@click="newQuestionClicked" >
						{{ getLocale.newQuestion }}
					</div>
				</b-row>
			</b-col>
			<!-- Last session -->
			<b-col cols="4">
				<b-row><p>{{ getLocale.viewLastSession }}</p></b-row>
				<b-row>
					<div class="btn disabled btn-secondary m-0 p-0" 
						style="display: flex; justify-content: center; align-items: center; position: absolute; height: 50%; width: 90%; left: 5%; bottom: 0px;"
						@click="viewLastSession" >
						{{ getLocale.openLastSession }}
					</div>
				</b-row>
			</b-col>
		</b-row>
		<b-row>
			<!-- Add admin -->
			<b-col cols="4">
				<b-row><p>{{ getLocale.courseAdministrator }}</p></b-row>
				<b-row>
					<b-container>
						<b-row>
							<b-col cols="9">
								<b-form-input	v-model="newAdminFeideId" 
												type="text"
												placeholder="Feide id">
								</b-form-input>
							</b-col>
							<b-col cols="3" class="pl-0">
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
				<b-row><p>{{getLocale.courseAssistants}}</p></b-row>
				<b-row>
					<b-container>
						<b-row>
							<b-col cols="9">
								<b-form-input	v-model="newAssistantFeideId" 
												type="text"
												placeholder="Feide id">
								</b-form-input>
							</b-col>
							<b-col cols="3" class="pl-0">
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
					<p>{{ getLocale.startSession }}</p>
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

export default {
	name: "Dashboard",
	data() {
		return {
			newCourse: {
				code: "",
				semester: "",
				name: ""
			},
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
		addNewCourse: function() {
			this.$socket.emit("createCourse", this.newCourse);
			this.newCourse.code = "";
			this.newCourse.semester = "";
			this.newCourse.name = "";
		},
		viewLastSession: function() {
			// TODO: Write the function
		},
		addNewAdmin: function() {
			if (this.newAdminFeideId == "") return;

			this.$socket.emit("setUserRightsLevel", {
				feideId: this.newAdminFeideId,
				course: this.$store.getters.getSelectedCourse,
				level: 4
			});

			this.newAdminFeideId = "";
		},
		addNewAssistant: function() {
			if (this.newAssistantFeideId == "") return;

			this.$socket.emit("setUserRightsLevel", {
				feideId: this.newAssistantFeideId,
				course: this.$store.getters.getSelectedCourse,
				level: 3
			});

			this.newAssistantFeideId = "";
		},
		removeAdmin: function(btn) {
			this.$socket.emit("setUserRightsLevel", {
				feideId: btn.target.id,
				course: this.$store.getters.getSelectedCourse,
				level: -1
			});
		},
		getUserRightsFromDatabase() {
			this.$socket.emit("getUsersByUserRightsLevelsRequest", {
				levels: [3, 4],
				course: this.$store.getters.getSelectedCourse
			});
		}
	},
	components: {
		SelectCourse,
		SessionsOverview
	}
};
</script>
