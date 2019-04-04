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
		<b-row>
			<b-col cols="2"></b-col>
			<b-col cols="2" class="text-center">
				<SelectCourse :changeHandler="courseChanged"/>
			</b-col>
			<b-col cols="5" class="text-center mb-5 px-0">
				<b-form-input	v-model="questionSearchText" 
								type="text" 
								:placeholder="getLocale.searchQuestion">
				</b-form-input>
			</b-col>
			<b-col cols="1" class="text-center mb-5 pl-0">
				<b-button @click="showAddQuestionModal" variant="primary">
					<span style="visibility: hidden;">+</span>
					+
					<span style="visibility: hidden;">+</span>
				</b-button>
			</b-col>
			<b-col cols="2"></b-col>
		</b-row>
		<b-row>
			<b-col cols="0" lg="2"></b-col>
			<b-col cols="12" lg="8">
				<b-list-group style="min-height: 300px; max-height: 300px; overflow-y:scroll;">
                    <b-list-group-item class="border-0" :key="item.id" v-for="item in currentQuestions">
						<b-container>
							<b-row>
								<b-col cols="8">
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
					<b-list-group-item class="border-0" v-show="showNoQuestions">
						{{ getLocale.emptyQuestionList }}
					</b-list-group-item>
                </b-list-group>
			</b-col>
			<b-col cols="0" lg="2"></b-col>
		</b-row>
	</b-container>
</template>

<script>
	import EditQuestion from "./EditQuestion.vue";
	import ShowQuestion from "./ShowQuestion.vue";
	import AddQuestionToSession from "./AddQuestionToSession.vue";
	import SelectCourse from "../SelectCourse.vue";

	export default {
		name: 'Questions',
		data() {
			return {
				questionSearchText: "",
				questionList: [],
				okHandler: "add",
				question: undefined
			}
		},
		components: {
			EditQuestion,
			ShowQuestion,
			AddQuestionToSession,
			SelectCourse
		},
		mounted() {
			this.$socket.emit(
				"getAllQuestionsWithinCourse", 
				this.$store.getters.getSelectedCourse.split(" ")[0]
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
			getLocale() {
				let locale = this.$store.getters.getLocale("AdminQuestions");
                if(locale) return locale;
			    else return {};
			}
		},
		sockets: {
			sendAllQuestionsWithinCourse(questions) {
				this.questionList = questions;
			},
			questionChangeComplete() {
				this.requestNewQuestions();
			}
		},
		methods: {
			requestNewQuestions() {
				this.$socket.emit("getAllQuestionsWithinCourse",
					this.$store.getters.getSelectedCourse.split(" ")[0]);
			},
			courseChanged(newCourse) {
				let c = newCourse.split(" ");
				this.$socket.emit("getAllQuestionsWithinCourse", c[0]);
			},
			showEditQuestionModal(item) {
				this.okHandler = "edit";
				if (item.time === -1) item.time = 0;
				this.question = item;
				this.$nextTick(function() {
					this.$refs.editQuestionModal.$refs.innerModalEditAdd.show();
				});
			},
			showAddQuestionModal() {
				this.okHandler = "add";
				this.question = undefined;
				this.$nextTick(function() {
					this.$refs.editQuestionModal.$refs.innerModalEditAdd.show();
				});
			},
			showShowQuestionModal(item) {
				if (item.time === -1) item.time = 0;
				this.$refs.showQuestionModal._data.question = item;
				this.$nextTick(function() {
					this.$refs.showQuestionModal.$refs.innerModalShow.show();
				});
			},
			showAddQuestionToSessionModal(item) {
				this.okHandler = "add";
				this.$refs.addQuestionToSessionModal.$refs.innerModalAddToSession.show();
				this.$refs.addQuestionToSessionModal._data.question.id = item.id;
				this.$refs.addQuestionToSessionModal._data.question.text = item.text;
			}
		}
	}
</script>

<style scoped>
</style>