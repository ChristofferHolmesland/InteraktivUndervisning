<template>
	<b-container class="jumbotron vertical-center" style="margin-top: 2rem;">
		<EditQuestion 	elementId="editQuestionModal"
						elementRef="innerModalEditAdd"
						ref="editQuestionModal"
						:okHandler="okHandler"
						:question="question"
						/>
		<ShowQuestion 	elementRef="innerModalShow"
						ref="showQuestionModal"
						/>
		<AddQuestionToSession 	elementRef="innerModalAddToSession"
								ref="addQuestionToSessionModal"
								/>
		<b-row class="mb-2">
			<b-col cols="1"></b-col>
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
				<b-button @click="showAddQuestionModal" variant="primary" id="addQuestionBtn">
					<h6>+</h6>
				</b-button>
			</b-col>
			<b-col cols="2" class="text-center">
				<b-button @click="selectChange" variant="primary" id="selectBtn">
					<h6 v-if="selectPressed">{{ getLocale.closeBtn }}</h6>
					<h6 v-else>{{ getLocale.selectBtn }}</h6>
				</b-button>
			</b-col>
			<b-col cols="1"></b-col>
		</b-row>
		<b-row v-if="selectPressed" class="mb-3">
			<b-col></b-col>
			<b-col style="text-align: center;">
				<b-button @click="openCopyQuestion" variant="success">
					{{ getLocale.copySelectedBtn }}
				</b-button>
				<CopyQuestions ref="copyQuestionModal" :selectedQuestions="getSelectedQuestions"/>
			</b-col>
			<b-col></b-col>
			<b-col style="text-align: center;">
				<b-button variant="danger">
					{{ getLocale.deleteSelectedBtn }}
				</b-button>
			</b-col>
			<b-col></b-col>
		</b-row>
		<b-row v-if="showError" style="text-align: center;">
			<b-col></b-col>
			<b-col cols="10">
				<b-alert	:show="showError"
							@dismissed="showError = false"
							variant="danger"
							dismissible>
					<p>{{ getLocale[errorText] }}</p>
				</b-alert>
			</b-col>
			<b-col></b-col>
		</b-row>
		<b-row>
			<b-col cols="0" lg="1"></b-col>
			<b-col cols="12" lg="10">
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
										<b-button @click="showShowQuestionModal(item)" >V</b-button>
									</b-col>
									<b-col cols="1">
										<b-button @click="showEditQuestionModal(item)" >E</b-button>
									</b-col>	
									<b-col cols="2">
										<b-button @click="showAddQuestionToSessionModal(item)">{{getLocale.addToSession}}</b-button>
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
			<b-col cols="0" lg="1"></b-col>
		</b-row>
	</b-container>
</template>

<script>
	import EditQuestion from "./EditQuestion.vue";
	import ShowQuestion from "./ShowQuestion.vue";
	import AddQuestionToSession from "./AddQuestionToSession.vue";
	import SelectCourse from "../SelectCourse.vue";
	import CopyQuestions from "./CopyQuestions.vue";

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
				selectedQuestions: []
			}
		},
		components: {
			EditQuestion,
			ShowQuestion,
			AddQuestionToSession,
			SelectCourse,
			CopyQuestions
		},
		mounted() {
			this.$socket.emit(
				"getAllQuestionsWithinCourse", 
				this.$store.getters.getSelectedCourse
			);
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
				this.okHandler = "edit";
				if (item.time === -1) item.time = 0;
				this.question = item;
				this.$nextTick(function() {
					this.$refs.editQuestionModal.$refs.innerModalEditAdd.show();
				});
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
				this.$nextTick(function() {
					this.$refs.editQuestionModal.$refs.innerModalEditAdd.show();
				});
			},
			showShowQuestionModal: function(item) {
				if (item.time === -1) item.time = 0;
				this.$refs.showQuestionModal._data.question = item;
				this.$nextTick(function() {
					this.$refs.showQuestionModal.$refs.innerModalShow.show();
				});
			},
			showAddQuestionToSessionModal: function(item) {
				this.okHandler = "add";
				this.$refs.addQuestionToSessionModal.$refs.innerModalAddToSession.show();
				this.$refs.addQuestionToSessionModal._data.question.id = item.id;
				this.$refs.addQuestionToSessionModal._data.question.text = item.text;
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
			}
		}
	}
</script>

<style scoped>
#addQuestionBtn, #selectBtn {
	width: 70%;
	text-align: center;
	height: 100%;
	line-height: 100%;
}
</style>