<!--
	Component name: QuestionResultScreen
	Use case:
		- Display information about the answers to a question while running a session.
-->

<template>
	<b-container id="mainWrapper">
		<b-row class="mb-3">
			<b-col cols="4">
				<b-row>
					<b-col>
						<h1>{{ getLocale.userStatHeadline }}</h1>
						<p>{{ getLocale.users }} {{ resultInfo.users }}</p>
						<p>{{ getLocale.correctAnswers }} {{ resultInfo.correctAnswer }}</p>
						<p>{{ getLocale.didntKnow }} {{ resultInfo.didntKnow }}</p>
						<p>{{ getLocale.wrong }} {{ resultInfo.incorrectAnswer }}</p>
					</b-col>
				</b-row>
				<b-row align-h="around">
					<b-col cols="6">
						<b-button @click="endSession" block variant="danger">{{ getLocale.endSessionBtn }}</b-button>
					</b-col>
					<b-col cols="6">
						<b-button @click="nextQuestion" block variant="primary">{{ getLocale.nextBtn }}</b-button>
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
									style="cursor: pointer;
										min-width: 100px;
										min-height: 100px;
										padding: 5px;
										margin: 5px;
										text-align: center;
										display: table;"
									v-on:click="changeAnswer($event)"
									:id="index"
									no-body
									:class="selectedAnswer == index ? 'selected' : ''">
								<span class="align-middle" style="display: table-cell">{{ getLocale.answer }} {{index}}</span>
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
			if (
				confirm(
					this.getLocale.leaveSessionBodyAdmin
				)
			) this.$socket.emit("adminEndSession");
		},
		changeAnswer(event) {
			this.selectedAnswer = Number(event.target.id);
		},

	},
	computed: {
		getIncorrectAnswers() {
			return this.resultInfo.answerList;
		},
		getLocale: function() {
			let locale = this.$store.getters.getLocale("AdminQuestionResultScreen");
			if (locale) return locale;
			else return {};
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
