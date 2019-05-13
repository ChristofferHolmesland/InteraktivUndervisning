<template>
	<b-modal
		id="copyQuestions"
		:title="getLocale.title"
		ref="copyQuestionInnerModal"
		style="text-align: left;"
		@ok="okHandler"
		:ok-title="getLocale.okBtn"
		:cancel-title="getLocale.cancelBtn"
		cancel-variant="danger"
		:hide-header-close="true"
	>
		<b-alert
			:show="showError"
			variant="danger"
			dismissible
			@dismissed="showError = false"
		>
			<p>
				{{ getLocale.errors[errorText] }}
			</p>
		</b-alert>
		<b-form-group>
			<b-container>
				<b-row>
					<b-col
						><h6>{{ getLocale.selectedQuestionsTitle }}</h6></b-col
					>
				</b-row>
				<b-row>
					<b-col>
						<b-list-group
							style="min-height: 200px; max-height: 200px; overflow-y:scroll; border: 1px black solid;"
						>
							<b-list-group-item
								class="border-0 px-0"
								v-for="(question,
								index) in selectedQuestionsList"
								:key="question.id"
							>
								<b-container>
									<b-row>
										<b-col cols="8">
											{{ question.text }}
										</b-col>
										<b-col cols="4">
											<b-button
												variant="danger"
												class="removeBtn"
												@click="removeQuestion(index)"
											>
												{{ getLocale.removeBtn }}
											</b-button>
										</b-col>
									</b-row>
								</b-container>
							</b-list-group-item>
						</b-list-group>
					</b-col>
				</b-row>
			</b-container>
		</b-form-group>
		<b-form-group>
			<b-container>
				<b-row>
					<b-col
						><h6>{{ getLocale.selectCoursesTitle }}</h6></b-col
					>
				</b-row>
				<b-row>
					<b-col>
						<b-form-select
							id="questionsSelect"
							:options="getCourseList"
							v-model="selectedCourses"
							multiple
							:select-size="5"
						>
						</b-form-select>
					</b-col>
				</b-row>
			</b-container>
		</b-form-group>
		<b-form-group>
			<b-container>
				<b-row>
					<b-col
						><h6>{{ getLocale.selectedCoursesTitle }}</h6></b-col
					>
				</b-row>
				<b-row>
					<b-col>
						<b-form-group
							style="overflow-y: scroll; max-height: 200px;"
						>
							<b-list-group-item
								class="border-0"
								:key="item.value"
								v-for="item in getSelectedCourses"
							>
								{{ item.text }}
							</b-list-group-item>
						</b-form-group>
					</b-col>
				</b-row>
			</b-container>
		</b-form-group>
	</b-modal>
</template>

<script>
export default {
	name: "CopyQuestion",
	props: ["selectedQuestions"],
	data() {
		return {
			selectedQuestionsList: [],
			selectedCourses: [],
			courseList: [],
			currentCourseId: "",
			showError: false,
			errorText: ""
		};
	},
	mounted() {
		this.$root.$on("bv::modal::show", (bvevent) => {
			this.selectedQuestionsList = JSON.parse(
				JSON.stringify(this.selectedQuestions)
			);
			this.selectedCourses = [];
		});
	},
	computed: {
		getCourseList: function() {
			let courseList = JSON.parse(
				JSON.stringify(this.$store.getters.getCourseOptions)
			);
			let currentCourseId = this.$store.getters.getSelectedCourse;
			courseList.splice(
				courseList.findIndex(
					(course) => course.value === currentCourseId
				),
				1
			);

			this.currentCourseId = currentCourseId;
			this.courseList = courseList;
			return this.courseList;
		},
		getSelectedCourses: function() {
			let list = [];

			for (let i = 0; i < this.selectedCourses.length; i++) {
				let selectedCourse = this.selectedCourses[i];

				list.push(
					this.courseList[
						this.courseList.findIndex(
							(course) => course.value === selectedCourse
						)
					]
				);
			}

			return list;
		},
		getLocale: function() {
			let locale = this.$store.getters.getLocale("CopyQuestions");
			if (locale) return locale;
			else return {};
		}
	},
	methods: {
		removeQuestion: function(index) {
			this.selectedQuestionsList.splice(index, 1);
		},
		okHandler: function(e) {
			e.preventDefault();
			this.$socket.emit("copyQuestionToCourseRequest", {
				selectedCourses: this.selectedCourses,
				selectedQuestionsList: this.selectedQuestionsList
			});
		}
	},
	sockets: {
		copyQuestionToCourseResponse: function() {
			this.$refs.copyQuestionInnerModal.hide();
		},
		copyQuestionToCourseError: function(error) {
			this.errorText = error;
			this.showError = true;
		}
	}
};
</script>

<style scoped>
.removeBtn {
	height: 38px;
	line-height: 24px;
	width: 100%;
	text-align: center;
}
</style>
