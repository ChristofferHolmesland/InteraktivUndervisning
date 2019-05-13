<template>
	<b-container>
		<b-row class="mb-5" align-h="around">
			<!-- Select course-->
			<b-col cols="5" class="jumbotron">
				<b-row
					><h5>{{ getLocale.changeCourseTitle }}</h5></b-row
				>
				<b-row>
					<b-container class="px-0">
						<b-row>
							<b-col cols="8">
								<SelectCourse />
							</b-col>
							<b-col cols="3">
								<b-button
									block
									@click="showAddNewCourseModal"
									data-cy="addCourseButton"
									v-if="
										getUser.userRights === 4 &&
											getUser.loggedIn
									"
									variant="primary"
									>{{ getLocale.newCourseBtnText }}
								</b-button>
								<AddNewCourse
									ref="AddNewCourseModal"
									elementRef="InnerAddNewCourseModal"
									v-if="
										getUser.userRights === 4 &&
											getUser.loggedIn
									"
								/>
							</b-col>
						</b-row>
					</b-container>
				</b-row>
			</b-col>
			<!-- Start session -->
			<b-col cols="5" class="jumbotron">
				<b-row>
					<h5>{{ getLocale.startSession }}</h5>
				</b-row>
				<b-row>
					<SessionsOverview />
				</b-row>
			</b-col>
		</b-row>
		<b-row align-h="around">
			<!-- Add admin and student assistant -->
			<b-col cols="5" class="jumbotron">
				<b-card no-body>
					<b-tabs v-model="tabIndex" card>
						<b-tab :title="getLocale.courseAdministrator">
							<b-container class="px-0">
								<b-row
									v-if="
										getUser.userRights === 4 &&
											getUser.loggedIn
									"
								>
									<b-col cols="8">
										<b-form-input
											v-model="newAdminFeideId"
											type="text"
											placeholder="Feide id"
										>
										</b-form-input>
									</b-col>
									<b-col cols="3">
										<b-button
											block
											@click="addNewAdmin"
											variant="success"
											><i class="fas fa-user-plus"></i
										></b-button>
									</b-col>
								</b-row>
								<b-row>
									<b-col>
										<ul style="list-style-type: none;">
											<li
												:key="admin.feideId"
												v-for="admin in courseAdmins"
												class="mt-1"
											>
												{{ admin.feideId }} -
												{{ admin.name }}
												<b-button
													size="sm"
													variant="danger"
													:id="admin.feideId"
													@click="removeAdmin($event)"
													v-if="
														getUser.userRights ===
															4 &&
															getUser.loggedIn
													"
												>
													<i
														class="fas fa-times-circle"
													></i>
												</b-button>
											</li>
											<li
												v-if="
													getAdminApplicants.length >
														0
												"
											>
												<h6>
													{{
														getLocale.applicantsLabel
													}}
												</h6>
											</li>
											<li
												v-for="applicant in getAdminApplicants"
												:key="applicant.id"
											>
												{{ applicant.feideId }} -
												{{ applicant.name }}
												<b-button
													size="sm"
													variant="danger"
													@click="
														removeApplicant(
															applicant.applicationId
														)
													"
												>
													<i
														class="fas fa-times-circle"
													></i>
												</b-button>
												<b-button
													size="sm"
													variant="success"
													@click="
														approveApplicant(
															applicant.applicationId
														)
													"
												>
													<i
														class="fas fa-check-circle"
													></i>
												</b-button>
											</li>
										</ul>
									</b-col>
								</b-row>
							</b-container>
						</b-tab>
						<b-tab :title="getLocale.courseAssistants">
							<b-container class="px-0">
								<b-row
									v-if="
										getUser.userRights === 4 &&
											getUser.loggedIn
									"
								>
									<b-col cols="8">
										<b-form-input
											v-model="newAssistantFeideId"
											type="text"
											placeholder="Feide id"
										>
										</b-form-input>
									</b-col>
									<b-col cols="3">
										<b-button
											block
											@click="addNewAssistant"
											variant="success"
											><i class="fas fa-user-plus"></i
										></b-button>
									</b-col>
								</b-row>
								<b-row>
									<b-col>
										<ul style="list-style-type: none;">
											<li
												:key="assistant.feideId"
												v-for="assistant in courseAssistants"
												class="mt-1"
											>
												{{ assistant.feideId }} -
												{{ assistant.name }}
												<b-button
													variant="danger"
													size="sm"
													:id="assistant.feideId"
													@click="removeAdmin($event)"
													v-if="
														getUser.userRights ===
															4 &&
															getUser.loggedIn
													"
												>
													<i
														class="fas fa-times-circle"
													></i>
												</b-button>
											</li>
											<li
												v-if="
													getStudAssApplicants.length >
														0
												"
											>
												<h6>
													{{
														getLocale.applicantsLabel
													}}
												</h6>
											</li>
											<li
												v-for="applicant in getStudAssApplicants"
												:key="applicant.id"
											>
												{{ applicant.feideId }} -
												{{ applicant.name }}
												<b-button
													size="sm"
													variant="danger"
													@click="
														removeApplicant(
															applicant.applicationId
														)
													"
												>
													<i
														class="fas fa-times-circle"
													></i>
												</b-button>
												<b-button
													size="sm"
													variant="success"
													@click="
														approveApplicant(
															applicant.applicationId
														)
													"
												>
													<i
														class="fas fa-check-circle"
													></i>
												</b-button>
											</li>
										</ul>
									</b-col>
								</b-row>
							</b-container>
						</b-tab>
					</b-tabs>
				</b-card>
			</b-col>

			<b-col cols="5" class="jumbotron">
				<RequestAdmin />
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
import SelectCourse from "./SelectCourse.vue";
import SessionsOverview from "./startSession/SessionsOverview.vue";
import AddNewCourse from "./AddNewCourse.vue";
import RequestAdmin from "./RequestAdmin.vue";

export default {
	name: "Dashboard",
	data() {
		return {
			newAdminFeideId: "",
			newAssistantFeideId: "",
			courseAdmins: [],
			courseAssistants: [],
			tabIndex: 0,
			applicants: []
		};
	},
	computed: {
		selectedCourse: function() {
			return this.$store.getters.getSelectedCourse;
		},
		getLocale: function() {
			let locale = this.$store.getters.getLocale("AdminDashboard");
			if (locale) return locale;
			else return {};
		},
		getUser: function() {
			let user = this.$store.getters.getUser({
				userRights: true,
				loggedIn: true
			});
			return user;
		},
		getAdminApplicants: function() {
			let response = [];

			for (let i = 0; i < this.applicants.length; i++) {
				if (this.applicants[i].userRight === 4) {
					response.push(this.applicants[i]);
				}
			}

			return response;
		},
		getStudAssApplicants: function() {
			let response = [];

			for (let i = 0; i < this.applicants.length; i++) {
				if (this.applicants[i].userRight === 3) {
					response.push(this.applicants[i]);
				}
			}

			return response;
		}
	},
	watch: {
		selectedCourse: function() {
			this.getUserRightsFromDatabase();
			this.getApplicants();
			let courseId = this.$store.getters.getSelectedCourse;
			this.$socket.emit("sessionOverviewRequest", courseId);
			this.$socket.emit("requestAdminInfoRequest");
		},
		tabIndex: function() {
			this.getUserRightsFromDatabase();
			if (
				this.$store.getters.getUser({ userRights: true }).userRights ===
				4
			) {
				this.getApplicants();
			}
		}
	},
	created() {
		this.getUserRightsFromDatabase();
		let user = this.$store.getters.getUser({ userRights: true });
		if (
			this.$store.getters.getUser({ userRights: true }).userRights === 4
		) {
			this.getApplicants();
		}
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
		},
		applicantChangeResponse: function() {
			this.getUserRightsFromDatabase();
			if (
				this.$store.getters.getUser({ userRights: true }).userRights ===
				4
			) {
				this.getApplicants();
			}
		},
		applicationsByCourseIdResponse: function(applicants) {
			this.applicants = applicants;
		}
	},
	methods: {
		getApplicants: function() {
			let courseId = this.$store.getters.getSelectedCourse;
			this.$socket.emit("applicationsByCourseIdRequest", courseId);
		},
		addNewAdmin: function() {
			let length = this.newAdminFeideId.length;
			if (
				(length !== 6 && length !== 7) ||
				!Number.isInteger(Number(this.newAdminFeideId))
			)
				return;

			this.$socket.emit("setUserRightsLevel", {
				feideId: this.newAdminFeideId,
				courseId: this.$store.getters.getSelectedCourse,
				level: 4
			});

			this.newAdminFeideId = "";
		},
		addNewAssistant: function() {
			let length = this.newAssistantFeideId.length;
			if (
				(length !== 6 && length !== 7) ||
				!Number.isInteger(Number(this.newAssistantFeideId))
			)
				return;
			if (this.newAssistantFeideId == "") return;

			this.$socket.emit("setUserRightsLevel", {
				feideId: this.newAssistantFeideId,
				courseId: this.$store.getters.getSelectedCourse,
				level: 3
			});

			this.newAssistantFeideId = "";
		},
		removeAdmin: function(btn) {
			let user = this.$store.getters.getUser({ feideId: true });
			if (btn.target.id == user.feideId) return;
			this.$socket.emit("setUserRightsLevel", {
				feideId: btn.target.id,
				courseId: this.$store.getters.getSelectedCourse,
				level: -1
			});
		},
		getUserRightsFromDatabase: function() {
			this.$socket.emit("getUsersByUserRightsLevelsRequest", {
				levels: [3, 4],
				courseId: this.$store.getters.getSelectedCourse
			});
		},
		showAddNewCourseModal: function() {
			this.$refs.AddNewCourseModal.$refs.InnerAddNewCourseModal.show();
		},
		removeApplicant: function(applicationId) {
			let courseId = this.$store.getters.getSelectedCourse;
			this.$socket.emit("removeApplicant", applicationId, courseId);
		},
		approveApplicant: function(applicationId) {
			let courseId = this.$store.getters.getSelectedCourse;
			this.$socket.emit("approveApplicant", applicationId, courseId);
		}
	},
	components: {
		SelectCourse,
		SessionsOverview,
		AddNewCourse,
		RequestAdmin
	}
};
</script>
