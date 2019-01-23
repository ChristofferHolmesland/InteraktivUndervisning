<template>
	<b-container class="jumbotron vertical-center" style="margin-top: 2rem;">
		<b-row>
			<b-col cols="3"></b-col>
			<b-col cols="5" class="text-center mb-5">
				<b-form-input	v-model="questionSearchText" 
								type="text" 
								:placeholder="getLocale.searchQuestion">
				</b-form-input>
			</b-col>
			<b-col cols="1" class="text-center mb-5">
				<b-button v-b-modal.newQuestionModal>+</b-button>
				<EditQuestion elementId="newQuestionModal" :okHandler="addNewQuestionHandler"></EditQuestion>
			</b-col>
			<b-col cols="3"></b-col>
		</b-row>
		<b-row>
			<b-col cols="0" lg="2"></b-col>
			<b-col cols="12" lg="8">
				<b-list-group style="min-height: 300px; max-height: 300px; overflow-y:scroll;">
					<EditQuestion elementRef="innerModal" ref="editQuestionModal" :okHandler="editQuestionHandler"></EditQuestion>
					<ShowQuestion elementRef="innerModal" ref="showQuestionModal"></ShowQuestion>
					<AddQuestionToSession elementRef="innerModal" ref="addQuestionToSessionModal"></AddQuestionToSession>

                    <b-list-group-item class="border-0" :key="item.id" v-for="item in currentQuestions">
						<b-container>
							<b-row>
								<b-col cols="8">
									{{item.id}}. {{item.text}}
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

	export default {
		name: 'Questions',
		data() {
			return {
				questionSearchText: "",
				questionList: []
			}
		},
		components: {
			EditQuestion,
			ShowQuestion,
			AddQuestionToSession
		},
		mounted() {
			this.questionList = this.getQuestionsFromDatabase();
		},
		computed: {
			currentQuestions: function() {
				let questions = [];
				for (let i = 0; i < this.questionList.length; i++) {
					let q = this.questionList[i];
					if (q.id == this.questionSearchText) {
						questions.push(q);
					} else if (q.text.includes(this.questionSearchText)) {
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
		methods: {
			showEditQuestionModal: function(item) {
				this.$refs.editQuestionModal._data.newQuestion = item;
				this.$refs.editQuestionModal.$refs.innerModal.show();
			},
			showShowQuestionModal: function(item) {
				this.$refs.showQuestionModal._data.question = item;
				this.$refs.showQuestionModal.$refs.innerModal.show();
			},
			showAddQuestionToSessionModal: function(item) {
				this.$refs.addQuestionToSessionModal._data.question.id = item.id;
				this.$refs.addQuestionToSessionModal._data.question.text = item.text;
				this.$refs.addQuestionToSessionModal.$refs.innerModal.show();
			},
			getQuestionsFromDatabase: function() {
				// TODO: Query database
				return [
					{
						id: 1, 
						text: "Hva er 2 + 2?", 
						description: "For å løse denne oppgaven må du bruke addisjon.",
						solutionType: "text",
						solution: "4"
					},
					{
						id: 2, 
						text: "Hvordan er 'bøttene' i denne hashtabellene laget?", 
						description: "<bilde>",
						solutionType: "text",
						solution: "linkedlist"
					}
				];
			},
			addNewQuestionHandler: function(newQuestion) {
				// TODO: Add to database instead of dynamic list
				this.questionList.push({
					id: this.questionList.length + 1,
					text: newQuestion.text,
					description: newQuestion.description,
					solutionType: newQuestion.solutionType,
					solution: newQuestion.solution
				});
			},
			editQuestionHandler: function(newItem) {
				for (let i = 0; i < this.questionList.length; i++) {
					let q = this.questionList[i];
					if (q.id == newItem.id) {
						q.text = newItem.text;
						return;
					}
				}
			}
		}
	}
</script>

<style scoped>
</style>