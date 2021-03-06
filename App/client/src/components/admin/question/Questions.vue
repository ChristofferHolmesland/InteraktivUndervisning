<!--
	Component name: Questions
	Use case:
		- Displays a list of the current questions.
		- Let the user create new questions.
-->

<template>
	<b-container class="jumbotron vertical-center mt-2 px-5">
		<!-- 
		The "elementId" property should match the "ref" attribute.
		This is used by the GraphDrawer to detect when a modal is closed, so the
		GraphDrawer object can be destroyed.
		-->
		<EditQuestion
			v-if="renderEditQuestion"
			elementId="editQuestionModal"
			elementRef="innerModalEditAdd"
			ref="editQuestionModal"
			:okHandler="okHandler"
			:question="question"
		/>
		<ShowQuestion
			v-if="renderShowQuestion"
			elementId="showQuestionModal"
			elementRef="innerModalShow"
			ref="showQuestionModal"
		/>
		<AddQuestionToSession
			v-if="renderAddQuestionToSession"
			elementId="addQuestionToSessionModal"
			elementRef="innerModalAddToSession"
			ref="addQuestionToSessionModal"
		/>
		<TestQuestion
			v-if="showTestQuestion"
			:question="testQuestion"
			ref="testQuestionModal"
		/>
		<b-row class="mb-2" align-h="around">
			<b-col cols="3" class="text-center">
				<SelectCourse :changeHandler="courseChanged" />
			</b-col>
			<b-col cols="4" class="text-center">
				<b-form-input
					v-model="questionSearchText"
					type="text"
					:placeholder="getLocale.searchQuestion"
				>
				</b-form-input>
			</b-col>
			<b-col cols="1" class="text-center">
				<b-button
					block
					@click="showAddQuestionModal"
					variant="primary"
					data-cy="addQuestionButton"
				>
					<i class="fas fa-plus-square"></i>
				</b-button>
			</b-col>
			<b-col cols="2" class="text-center">
				<b-button
					block
					@click="selectChange"
					variant="primary"
					id="selectBtn"
				>
					<h6 v-if="selectPressed">{{ getLocale.closeBtn }}</h6>
					<h6 v-else>{{ getLocale.selectBtn }}</h6>
				</b-button>
			</b-col>
		</b-row>
		<b-row v-if="selectPressed" class="mb-3" align-h="around">
			<b-col cols="4" style="text-align: center;">
				<b-button block @click="openCopyQuestion" variant="success">
					{{ getLocale.copySelectedBtn }}
				</b-button>
				<CopyQuestions
					ref="copyQuestionModal"
					:selectedQuestions="getSelectedQuestions"
					v-if="showCopyQuestions"
				/>
			</b-col>
			<b-col cols="4" style="text-align: center;">
				<b-button block @click="openDeleteQuestion" variant="danger">
					{{ getLocale.deleteSelectedBtn }}
				</b-button>
				<DeleteQuestions
					ref="deleteQuestionModal"
					:selectedQuestions="getSelectedQuestions"
					v-if="showDeleteQuestions"
				/>
			</b-col>
		</b-row>
		<b-row v-if="showError" style="text-align: center;" align-h="around">
			<b-col cols="10">
				<b-alert
					:show="showError"
					@dismissed="showError = false"
					variant="danger"
					dismissible
				>
					<p>{{ getLocale[errorText] }}</p>
				</b-alert>
			</b-col>
		</b-row>
		<b-row align-h="around">
			<b-col cols="12">
				<b-list-group
					style="min-height: 300px; max-height: 300px; overflow-y:scroll;"
				>
					<b-form-checkbox-group v-model="selectedQuestions">
						<b-list-group-item
							class="border-0"
							:key="question.id"
							v-for="question in currentQuestions"
						>
							<b-container>
								<b-row>
									<b-col cols="1" v-if="selectPressed">
										<b-form-checkbox :value="question.id" />
									</b-col>
									<b-col
										:cols="selectPressed ? 5 : 6"
										style="overflow-x: scroll; white-space: nowrap;"
									>
										{{ question.text }}
									</b-col>
									<b-col cols="2">
										<b-button
											block
											variant="primary"
											@click="
												showTestQuestionRequest(
													question.id
												)
											"
										>
											{{ getLocale.testBtnLabel }}
										</b-button>
									</b-col>
									<b-col cols="1">
										<b-button
											block
											@click="
												showShowQuestionModal(question)
											"
											variant="warning"
										>
											<i class="fas fa-eye"></i>
										</b-button>
									</b-col>
									<b-col
										cols="1"
										:disabled="
											question.status === 1 ? false : true
										"
										v-b-tooltip.hover
										:title="getLocale.questionStatusTooltip"
									>
										<b-button
											block
											@click="
												showEditQuestionModal(question)
											"
											:variant="
												question.status === 1
													? ''
													: 'primary'
											"
											:disabled="
												question.status === 1
													? true
													: false
											"
										>
											<i class="fas fa-edit"></i>
										</b-button>
									</b-col>
									<b-col cols="2">
										<b-button
											block
											@click="
												showAddQuestionToSessionModal(
													question
												)
											"
											variant="success"
											>{{
												getLocale.addToSession
											}}</b-button
										>
									</b-col>
								</b-row>
							</b-container>
						</b-list-group-item>
					</b-form-checkbox-group>
					<b-list-group-item
						class="border-0"
						v-show="showNoQuestions"
					>
						{{ getLocale.emptyQuestionList }}
					</b-list-group-item>
				</b-list-group>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
import EditQuestion from "./EditQuestion.vue";
import ShowQuestion from "./ShowQuestion.vue";
import AddQuestionToSession from "./AddQuestionToSession.vue";
import SelectCourse from "../SelectCourse.vue";
import CopyQuestions from "./CopyQuestions.vue";
import DeleteQuestions from "./DeleteQuestions.vue";
import TestQuestion from "./TestQuestion.vue";

export default {
	name: "Questions",
	data() {
		return {
			questionSearchText: "",
			questionList: [],
			okHandler: "add",
			question: undefined,
			showError: false,
			errorText: "",
			selectPressed: false,
			action: "edit",
			selectedQuestions: [],
			renderEditQuestion: false,
			renderShowQuestion: false,
			renderAddQuestionToSession: false,
			selectAction: 0,
			showCopyQuestions: false,
			showDeleteQuestions: false,

			showTestQuestion: false,
			testQuestion: {}
		};
	},
	components: {
		EditQuestion,
		ShowQuestion,
		AddQuestionToSession,
		SelectCourse,
		CopyQuestions,
		DeleteQuestions,
		TestQuestion
	},
	mounted() {
		this.$socket.emit(
			"getAllQuestionsWithinCourse",
			this.$store.getters.getSelectedCourse
		);

		this.$root.$on("bv::modal::hidden", (bvEvent, modalId) => {
			// Sometimes this function is called with "this" set to
			// undefined. If this happens there seems to always be
			// another function call right before or after with the correct
			// this value. Vue bug?
			if (this == undefined) {
				return;
			}

			let id = bvEvent.target.id;
			try {
				let drawer = this.$refs[id].$refs.graphdrawer;
				if (drawer !== undefined) drawer.destroyDrawer();
			} catch (e) {
				// Between the first if statement and here, "this" can be set
				// to undefined. If it is a TypeError is catched here.
				if (this == undefined) return;
			}

			if (id.includes("edit")) this.renderEditQuestion = false;
			else if (id.includes("show")) this.renderShowQuestion = false;
			else if (id.includes("session"))
				this.renderAddQuestionToSession = false;
			else if (id.includes("copy")) this.showCopyQuestions = false;
			else if (id.includes("delete")) this.showDeleteQuestions = false;
			else if (id.includes("Test")) this.showTestQuestion = false;

			this.selectPressed = false;
		});
	},
	computed: {
		currentQuestions: function() {
			let questions = [];
			for (let i = 0; i < this.questionList.length; i++) {
				let q = this.questionList[i];
				if (q.id == this.questionSearchText) {
					questions.push(q);
				} else if (
					q.text
						.toLowerCase()
						.includes(this.questionSearchText.toLowerCase())
				) {
					questions.push(q);
				}
			}
			return questions;
		},
		showNoQuestions: function() {
			return this.currentQuestions.length == 0;
		},
		getLocale: function() {
			let locale = this.$store.getters.getLocale("AdminQuestions");
			if (locale) return locale;
			else return {};
		},
		getSelectedQuestions: function() {
			let list = [];

			for (let i = 0; i < this.selectedQuestions.length; i++) {
				let selectedId = this.selectedQuestions[i];
				let index = this.questionList.findIndex(
					(question) => question.id === selectedId
				);
				if (index === -1) continue;
				let question = this.questionList[index];
				if (question.status === 1 && this.selectAction === 1) {
					this.selectedQuestions.splice(i, 1);
					i--;
					continue;
				}
				list.push({
					id: question.id,
					text: question.text
				});
			}
			return list;
		}
	},
	sockets: {
		sendAllQuestionsWithinCourse: function(questions) {
			this.questionList = questions;
		},
		questionChangeComplete: function() {
			this.requestNewQuestions();
		},
		questionInfoByIdResponse: function(question) {
			switch (this.action) {
				case "edit":
					this.okHandler = "edit";
					if (question.time === -1) question.time = 0;
					this.question = question;

					this.question.objects = this.question.object;
					this.question.solutionType = this.question.type;

					this.renderEditQuestion = true;
					this.$nextTick(function() {
						this.$refs.editQuestionModal.$refs.innerModalEditAdd.show();
					});
					break;
				case "show":
					if (question.time === -1) question.time = 0;
					this.renderShowQuestion = true;

					question.solutionType = question.type;
					question.objects = question.object;

					this.$nextTick(function() {
						this.$refs.showQuestionModal._data.question = JSON.parse(
						JSON.stringify(question)
					);
						// Set the solution type to 0 to destroy all the GraphDrawer components.
						this.$refs.showQuestionModal._data.question.solutionType = 0;
						// Wait for the page to render.
						this.$nextTick(function() {
							// Set the correct solution type.
							this.$refs.showQuestionModal._data.question.solutionType =
								question.solutionType;
							// Wait for the page to render.
							this.$nextTick(function() {
								// Finally show modal.
								this.$refs.showQuestionModal.$refs.innerModalShow.show();
							});
						});
					});
					break;
			}
		},
		questionInfoByIdError: function(error) {
			this.errorText = error;
			this.showError = true;
		},
		testQuestionResponse: function(question) {
			this.testQuestion = question;
			this.$nextTick(function() {
				this.showTestQuestion = true;
				this.$nextTick(function() {
					this.$refs.testQuestionModal.$refs.testQuestionInnerModal.show();
				});
			});
		}
	},
	methods: {
		requestNewQuestions: function() {
			this.$socket.emit(
				"getAllQuestionsWithinCourse",
				this.$store.getters.getSelectedCourse
			);
		},
		courseChanged: function(newCourse) {
			this.$socket.emit("getAllQuestionsWithinCourse", newCourse);
			this.selectedQuestions = [];
			this.selectPressed = false;
		},
		showEditQuestionModal: function(question) {
			this.action = "edit";
			this.$socket.emit("questionInfoByIdRequest", question.id);
		},
		showAddQuestionModal: function() {
			let courseId = this.$store.getters.getSelectedCourse;
			if (courseId === undefined || courseId === "") {
				this.errorText = "courseMissing";
				this.showError = true;
				return;
			}
			this.okHandler = "add";
			this.question = undefined;
			this.renderEditQuestion = true;
			this.$nextTick(function() {
				this.$refs.editQuestionModal.$refs.innerModalEditAdd.show();
			});
		},
		showShowQuestionModal: function(question) {
			this.action = "show";
			this.$socket.emit("questionInfoByIdRequest", question.id);
		},
		showAddQuestionToSessionModal: function(question) {
			this.renderAddQuestionToSession = true;
			this.$nextTick(function() {
				this.$refs.addQuestionToSessionModal.$refs.innerModalAddToSession.show();
				this.$refs.addQuestionToSessionModal._data.question.id =
					question.id;
				this.$refs.addQuestionToSessionModal._data.question.text =
					question.text;
			});
		},
		selectChange: function() {
			this.selectedQuestions = [];
			this.selectPressed = !this.selectPressed;
		},
		openCopyQuestion: function() {
			if (this.selectedQuestions.length > 0) {
				this.selectAction = 0;
				this.$nextTick(function() {
					this.showCopyQuestions = true;
					this.$nextTick(function() {
						this.$refs.copyQuestionModal.$refs.copyQuestionInnerModal.show();
					});
				});
			} else {
				this.errorText = "noQuestionsSelectedError";
				this.showError = true;
			}
		},
		openDeleteQuestion: function() {
			if (this.selectedQuestions.length > 0) {
				this.selectAction = 1;
				this.$nextTick(function() {
					this.showDeleteQuestions = true;
					this.$nextTick(function() {
						this.$refs.deleteQuestionModal.$refs.deleteQuestionInnerModal.show();
					});
				});
			} else {
				this.errorText = "noQuestionsSelectedError";
				this.showError = true;
			}
		},
		showTestQuestionRequest: function(questionId) {
			this.$socket.emit("testQuestionRequest", questionId);
		}
	}
};
</script>
