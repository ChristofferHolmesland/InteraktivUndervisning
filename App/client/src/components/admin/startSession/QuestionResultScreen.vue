<template>
	<b-container id="mainWrapper">
		<b-row>
			<b-col cols="4">
				<b-row>
					<b-col>
						<h1>User Stat</h1>
						<p>Users: {{ resultInfo.users }}</p>
						<p>Correct answers: {{ resultInfo.correctAnswer }}</p>
						<p>Didn't know: {{ resultInfo.didntKnow }}</p>
						<p>Wrong answers: {{ resultInfo.incorrectAnswer }}</p>
					</b-col>
				</b-row>
				<b-row>
					<b-col>
						<b-button @click="endSession" block variant="danger">End session</b-button>
					</b-col>
					<b-col >
						<b-button @click="nextQuestion" block variant="primary">Next</b-button>
					</b-col>
				</b-row>
			</b-col>
			<b-col cols="8">
				<!--Vindu over valgt feil svar, oppgave eller løsning-->
				<DisplayQuestion :selectedAnswer="selectedAnswer"
									:resultInfo="resultInfo"/>
			</b-col>
		</b-row>
		<b-row>
			<b-col>
				<div style="overflow-x: scroll; max-width: 100%; white-space: nowrap;">
					<!-- Add component to view incorrect answers -->
					<ul class="list-inline">                        
						<li v-for="(answer, index) in getIncorrectAnswers" 
							:key="index"
							class="list-inline-item"
							>
							<b-card 
									style="cursor: pointer; min-width: 100px; min-height: 100px;"
									v-on:click="changeAnswer($event)"
									:id="index"
									no-body
									:class="selectedAnswer == index ? 'selected' : ''">
								Incorrect answer {{index}}
							</b-card>
						</li>
					</ul>
				</div>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
import DisplayQuestion from "../question/DisplayQuestion.vue"

export default {
	name: "QuestionResultScreen",
	props: ["resultInfo"],
	data() {
		return {
			selectedAnswer: 0
		}
	},
	methods: {
		nextQuestion() {
			this.$socket.emit("nextQuestionRequest");
		},
		endSession() {

		},
		changeAnswer(event) {
			this.selectedAnswer = Number(event.target.id);
		},

	},
	computed: {
		getIncorrectAnswers() {
			return this.resultInfo.answerList;
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
</style>
