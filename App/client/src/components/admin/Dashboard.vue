<template>
	<b-container class="jumbotron mt-4">
		<b-row>
			<!-- Select course and edit student assisstants/admins-->
			<b-col cols="4">
				<b-container>
					<b-row><p>Change course</p></b-row>
					<b-row>
							<b-col cols="10">
								<SelectCourse />
							</b-col>
							<b-col cols="2" class="pl-0">
								<b-button v-b-modal.newCourseModal>New</b-button>
								<b-modal id="newCourseModal" 
										 :no-close-on-backdrop="true" 
										 title="New course" 
										 style="text-align: left;"
										 @ok="addNewCourse">

								    <b-form-group 	id="courseCode"
                            						label="Course code"
                            						label-for="courseCodeInput">
										<b-form-input 	id="courseCodeInput"
														type="text"
														v-model="newCourse.code">
										</b-form-input>
									</b-form-group>
									<b-form-group 	id="courseSemester"
													label="Course semester"
													label-for="courseSemesterInput">
										<b-form-input 	id="courseSemesterInput"
														type="text"
														v-model="newCourse.semester">
										</b-form-input>
									</b-form-group>									
									<b-form-group 	id="courseName"
													label="Course name"
													label-for="courseNameInput">
										<b-form-input 	id="courseNameInput"
														type="text"
														v-model="newCourse.name">
										</b-form-input>
									</b-form-group>
								</b-modal>
							</b-col>
					</b-row>
				</b-container>
			</b-col>
			<!-- New question -->
			<b-col cols="4" style="text-align: center;">
				<b-row><p>Add new question</p></b-row>
				<b-row>
					<div class="btn btn-secondary m-0 p-0" 
						style="display: flex; justify-content: center; align-items: center; position: absolute; height: 50%; width: 90%; left: 5%; bottom: 0px;"
						@click="newQuestionClicked" >
						New question
					</div>
				</b-row>
			</b-col>
			<!-- Last session -->
			<b-col cols="4">

			</b-col>
		</b-row>
	</b-container>
</template>

<script>
	import SelectCourse from "./SelectCourse.vue";
	import EditQuestion from "./questions/EditQuestion.vue";

	export default {
		name: 'Dashboard',
		data() {
			return {
				newCourse: {
					"code": "",
					"semester": "",
					"name": ""
				}
			}
		},
		methods: {
			newQuestionClicked: function() {
				console.log("New question clicked");
			},
			addNewCourse: function() {
				this.$socket.emit("createCourse", this.newCourse);
				this.newCourse.code = "";
				this.newCourse.semester = "";
				this.newCourse.name = "";
			}
		},
		components: {
			SelectCourse,
			EditQuestion
		},
    }

</script>

<style scoped>
</style>