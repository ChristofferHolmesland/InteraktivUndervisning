<template>
<b-container class="jumbotron vertical-center mt-2 px-5">
	<!-- 
		The "elementId" property should match the "ref" attribute.
		This is used by the GraphDrawer to detect when a modal is closed, so the
		GraphDrawer object can be destroyed.
		-->
	<EditQuestion 	v-if="renderEditQuestion"
					elementId="editQuestionModal"
					elementRef="innerModalEditAdd"
					ref="editQuestionModal"
					:okHandler="okHandler"
					:question="question"
					/>
	<ShowQuestion 	v-if="renderShowQuestion"
					elementId="showQuestionModal"
					elementRef="innerModalShow"
					ref="showQuestionModal"
					/>
	<AddQuestionToSession 	v-if="renderAddQuestionToSession"
							elementId="addQuestionToSessionModal"
							elementRef="innerModalAddToSession"
							ref="addQuestionToSessionModal"
							/>
	<b-row class="mb-2" align-h="around">
		<b-col cols="3" class="text-center">
			<SelectCourse :changeHandler="courseChanged"/>
		</b-col>
		<b-col cols="4" class="text-center">
			<b-form-input	v-model="questionSearchText" 
							type="text" 
							:placeholder="getLocale.searchQuestion">
			</b-form-input>
		</b-col>
		<b-col cols="1" class="text-center">
			<b-button block @click="showAddQuestionModal" variant="primary" data-cy="addQuestionButton">
				<i class="fas fa-plus-square"></i>
			</b-button>
		</b-col>
		<b-col cols="2" class="text-center">
			<b-button block @click="selectChange" variant="primary" id="selectBtn">
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
			<CopyQuestions ref="copyQuestionModal" :selectedQuestions="getSelectedQuestions"/>
		</b-col>
		<b-col cols="4" style="text-align: center;">
			<b-button block @click="openDeleteQuestion" variant="danger">
				{{ getLocale.deleteSelectedBtn }}
			</b-button>
			<DeleteQuestions ref="deleteQuestionModal" :selectedQuestions="getSelectedQuestions"/>
		</b-col>
	</b-row>
	<b-row v-if="showError" style="text-align: center;" align-h="around">
		<b-col cols="10">
			<b-alert	:show="showError"
						@dismissed="showError = false"
						variant="danger"
						dismissible>
				<p>{{ getLocale[errorText] }}</p>
			</b-alert>
		</b-col>
	</b-row>
	<b-row align-h="around">
		<b-col cols="12">
			<b-list-group style="min-height: 300px; max-height: 300px; overflow-y:scroll;">
				<b-form-checkbox-group v-model="selectedQuestions">
					<b-list-group-item class="border-0" :key="item.id" v-for="item in currentQuestions">
						<b-container>
							<b-row>
								<b-col cols="1" v-if="selectPressed">
									<b-form-checkbox :value="item.id"/>
								</b-col>
								<b-col :cols="selectPressed ? 7 : 8">
									{{item.text}}
								</b-col>
								<b-col cols="1">
									<b-button block @click="showShowQuestionModal(item)" variant="warning">
										<i class="fas fa-eye"></i>
									</b-button>
								</b-col>
								<b-col cols="1">
									<b-button block @click="showEditQuestionModal(item)" variant="primary">
										<i class="fas fa-edit"></i>
									</b-button>
								</b-col>	
								<b-col cols="2">
									<b-button block @click="showAddQuestionToSessionModal(item)" variant="success">{{getLocale.addToSession}}</b-button>
								</b-col>
							</b-row>
						</b-container>
					</b-list-group-item>
				</b-form-checkbox-group>
				<b-list-group-item class="border-0" v-show="showNoQuestions">
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

export default {
	name: 'Questions',
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
			renderAddQuestionToSession: false
		};
	},
	components: {
		EditQuestion,
		ShowQuestion,
		AddQuestionToSession,
		SelectCourse,
		CopyQuestions,
		DeleteQuestions
	},
	mounted() {
		this.$socket.emit(
			"getAllQuestionsWithinCourse", 
			this.$store.getters.getSelectedCourse
		);

		this.$root.$on('bv::modal::hidden', (bvEvent, modalId) => {
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
				return;
			}

			if (id.includes("edit")){ 
				this.renderEditQuestion = false;
				this.requestNewQuestions();
			}
			else if (id.includes("show")) this.renderShowQuestion = false;
			else if (id.includes("session")) this.renderAddQuestionToSession = false;
		});
	},
	computed: {
		currentQuestions: function() {
			let questions = [];
			for (let i = 0; i < this.questionList.length; i++) {
				let q = this.questionList[i];
				if (q.id == this.questionSearchText) {
					questions.push(q);
				} else if (q.text.toLowerCase().includes(this.questionSearchText.toLowerCase())) {
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
							if(locale) return locale;
				else return {};
		},
		getSelectedQuestions: function() {
			let list = [];
			for (let i = 0; i < this.selectedQuestions.length; i++) {
				let selectedId = this.selectedQuestions[i];
				let index = this.questionList.findIndex(question => question.id === selectedId);
				if (index === -1) continue;
				let question = this.questionList[index];
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

					// Database, server and client object properties
					// doesn't have the same name because we are stupid.
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
						this.$refs.showQuestionModal._data.question = JSON.parse(JSON.stringify(question));
						// Set the solution type to 0 to destroy all the GraphDrawer components.
						this.$refs.showQuestionModal._data.question.solutionType = 0;
						// Wait for the page to render.
						this.$nextTick(function() {
							// Set the correct solution type.
							this.$refs.showQuestionModal._data.question.solutionType = question.solutionType;
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
		}
	},
	methods: {
		requestNewQuestions: function() {
			this.$socket.emit("getAllQuestionsWithinCourse",
				this.$store.getters.getSelectedCourse);
		},
		courseChanged: function(newCourse) {
			this.$socket.emit("getAllQuestionsWithinCourse", newCourse);
			this.selectedQuestions = [];
			this.selectPressed = false;
		},
		showEditQuestionModal: function(item) {
			this.action = "edit";
			this.$socket.emit("questionInfoByIdRequest", item.id);
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
		showShowQuestionModal: function(item) {
			this.action = "show";
			this.$socket.emit("questionInfoByIdRequest", item.id);
		},
		showAddQuestionToSessionModal: function(item) {
			this.renderAddQuestionToSession = true;
			this.$nextTick(function() {
				this.$refs.addQuestionToSessionModal.$refs.innerModalAddToSession.show();
				this.$refs.addQuestionToSessionModal._data.question.id = item.id;
				this.$refs.addQuestionToSessionModal._data.question.text = item.text;
			});
		},
		selectChange: function() {
			this.selectedQuestions = [];
			this.selectPressed = !this.selectPressed;
		},
		openCopyQuestion: function() {
			if (this.selectedQuestions.length > 0) {
				this.$refs.copyQuestionModal.$refs.copyQuestionInnerModal.show();
			} else {
				this.errorText = "noQuestionsSelectedError";
				this.showError = true;
			}
		},
		openDeleteQuestion: function() {
			if (this.selectedQuestions.length > 0) {
				this.$refs.deleteQuestionModal.$refs.deleteQuestionInnerModal.show();
			} else {
				this.errorText = "noQuestionsSelectedError";
				this.showError = true;
			}
		}
	}
};
</script>
