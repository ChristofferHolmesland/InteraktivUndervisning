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
				<b-button v-b-modal.editQuestionModal>+</b-button>
				<EditQuestion id="editQuestionModal" :okHandler="addNewQuestionHandler"></EditQuestion>
			</b-col>
			<b-col cols="3"></b-col>
		</b-row>
		<b-row>
			<b-col cols="3"></b-col>
			<b-col cols="6">
				<b-list-group style="max-height: 300px; overflow-y:scroll;">
                    <b-list-group-item class="border-0" :key="item" v-for="item in currentQuestions">
						{{item.id}}. {{item.text}}
					</b-list-group-item>
					<b-list-group-item class="border-0" v-show="showNoQuestions">
						{{ getLocale.emptyQuestionList }}
					</b-list-group-item>
                </b-list-group>
			</b-col>
			<b-col cols="3"></b-col>
		</b-row>
	</b-container>
</template>

<script>
	import EditQuestion from "./EditQuestion.vue";

	export default {
		name: 'Questions',
		data() {
			return {
				questionSearchText: "",
				questionList: [],
			}
		},
		components: {
			EditQuestion
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
			},
			getSolutionTypes: function() {
				// TODO: Query database for the options
				return [
					{ value: "graph", text: "Graph"},
					{ value: "text", text: "Text"},
					{ value: "multipleChoice", text: "Multiple choice"}
				];
			},
		},
		methods: {
			getQuestionsFromDatabase: function() {
				// TODO: Query database
				return [
					{id: 1, text: "Hva betyr det hvis..."},
					{id: 2, text: "Når vet man at..."},
					{id: 3, text: "Hvis jeg gjør dette så skjer..."},
					{id: 4, text: "Hva betyr det hvis..."},
					{id: 5, text: "Når vet man at..."},
					{id: 6, text: "Hvis jeg gjør dette så skjer..."},
					{id: 7, text: "Hva betyr det hvis..."},
					{id: 8, text: "Når vet man at..."},
					{id: 9, text: "Hvis jeg gjør dette så skjer..."},
					{id: 10, text: "Hva betyr det hvis..."},
					{id: 11, text: "Når vet man at..."},
					{id: 12, text: "Hvis jeg gjør dette så skjer..."}
				];
			},
			addNewQuestionHandler: function(newQuestion) {
				// TODO: Add to database instead of dynamic list
				this.questionList.push({
					id: this.questionList.length + 1,
					text: newQuestion.text
				});
			}
		}
	}
</script>

<style scoped>
</style>