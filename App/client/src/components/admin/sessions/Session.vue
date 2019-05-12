<template>
	<b-container fluid>
		<b-row class="border-bottom mb-3">
			<b-col cols="4">
				<p>{{getLocale.status}} <span :class="getSession.status === 0 ? 'underline' : null">{{getLocale.inactive}}</span> | <span :class="getSession.status === 1 ? 'underline' : null">{{getLocale.active}}</span> | <span :class="getSession.status === 2 ? 'underline' : null">{{getLocale.finished}}</span></p>
			</b-col>
			<b-col cols="8">
				<b-container class="px-0">
					<b-row>
						<b-col>
							<p>{{getLocale.questionsAsked}} {{getSession.numberOfQuestions}}</p>
						</b-col>
						<b-col>
							<p>{{getLocale.participants}} {{getSession.participants}}</p>
						</b-col>
						<b-col>
							<p>{{getLocale.correctAnswers}} {{getSession.correctAnswers}} %</p>
						</b-col>
					</b-row>
				</b-container>
			</b-col>
		</b-row>
		<b-row v-if="getQuestionListSize">
			<b-col lg="4">
				<b-list-group style="overflow-y: scroll; min-height: 400px; max-height: 500px;">
					<b-list-group-item  v-for="(question, index) in getSession.questions" 
										:key="question.qqId" 
										style="cursor: pointer;" 
										:id="index"
										@click="changeQuestion($event)"
										:class="selectedQuestion == index ? 'selected' : ''">
						{{question.question.text}} | {{question.correctAnswer}} %
					</b-list-group-item>
					<div v-if="getQuestionslength < 10">
						<b-list-group-item v-for="index in (10 - getQuestionslength)" :key="index + getQuestionslength">
							<p> </p>
						</b-list-group-item>
					</div>
				</b-list-group>
			</b-col>
			<b-col lg="8">
				<DisplayQuestion
								:selectedAnswer="selectedAnswer"
								:resultInfo="getSession.questions[selectedQuestion]"
								:admin="true"
								ref="displayQuestion"
								/>
			</b-col>
		</b-row>
		<b-row class="mt-3" v-if="getAnswerListSize">
			<b-col lg="12">
				<div style="overflow-x: scroll; max-width: 100%; white-space: nowrap;">
					<ul class="list-inline">                        
						<li v-for="(answer, index) in getIncorrectAnswers" 
							:key="index"
							class="list-inline-item"
							>
							<b-card 
									style="cursor: pointer; min-width: 100px; min-height: 100px;"
									@click="changeAnswer($event)"
									:id="index"
									no-body
									:class="selectedAnswer == index ? 'selected' : ''">
								Answer {{index}}
							</b-card>
						</li>
					</ul>
				</div>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
import DisplayQuestion from "../question/DisplayQuestion.vue";

export default {
	name: "Session",
	props: {
		session: Object
	},
	data() {
		return {
			selectedQuestion: 0,
			selectedAnswer: 0,
			incorrectAnswers: [],
		};
	},
	computed: {
		getSession: function() {
			if (this.session === undefined)
				return {
					questions: []
				};
			return this.session;
		},
		getLocale: function() {
			let locale = this.$store.getters.getLocale("Session");
			if (locale) return locale;
			else return {};
		},
		getIncorrectAnswers: function() {
			if (this.session == undefined) return [];

			this.incorrectAnswers = [];

			this.incorrectAnswers = this.session.questions[
				this.selectedQuestion
			].answerList;

			return this.incorrectAnswers;
		},
		getAnswer: function() {
			if (this.incorrectAnswers.length === 0) return "";
			return this.incorrectAnswers[this.selectedAnswer].answer;
		},
		getAnswerListSize: function() {
			if (!this.getSession) 
				return false;
			if (!this.getSession.questions) 
				return false;
			if (!this.getSession.questions[this.selectedQuestion]) 
				return false;
			if (!this.getSession.questions[this.selectedQuestion].answerList) 
				return false;
			if (this.getSession.questions[this.selectedQuestion].answerList.length > 0) 
				return true;
			return false;
		},
		getQuestionListSize: function(){
			let questionList = this.getSession.questions;
			if (questionList === undefined || questionList.length < 1) return false;
			return true;
		},
		getQuestionslength: function() {
			if (!this.session.questions) return 0;
			return this.session.questions.length;
		}
	},
	methods: {
		changeAnswer: function(event) {
			this.selectedAnswer = Number(event.target.id);
			if (this.$refs.displayQuestion._data.tabIndex !== 2) return;

			// This is used to change the content of the graphdrawer.
			let displayQuestion = this.$refs.displayQuestion;
			if (displayQuestion.$refs.graphdrawerContainer !== undefined) {
				this.$nextTick(function() {
					this.$refs.displayQuestion.$refs.graphdrawerContainer.$refs.graphdrawer.createDrawer();
				});
			}
		},
		changeQuestion: function(event) {
			this.selectedQuestion = Number(event.target.id);
		}
	},
	watch: {
		session: function(newSession, oldSession){
			this.selectedQuestion = 0;
			this.selectedAnswer = 0;
			this.incorrectAnswers = [];
		},
		selectedQuestion: function() {
			let display = this.$refs.displayQuestion;
			if (display !== undefined) {
				this.$nextTick(function() {
					let container = display.$refs.graphdrawerContainer;
					if (container !== undefined) {
						this.$nextTick(function() {
							container.$refs.graphdrawer.createDrawer();
						});
					}
				});
			}
		},
	},
	sockets: {
		markAnswerAsCorrectResponse: function(answerId) {
			this.$emit("MarkAnswerAsCorrectResponse", {
				answerId: answerId,
				selectedQuestion: this.selectedQuestion
			})
		}
	},
	components: {
		DisplayQuestion
	}
};
</script>

<style scoped>
.selected {
	background-color: darkgray;
}
.underline {
	text-decoration: underline;
}
</style>
