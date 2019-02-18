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
				<b-card no-body>
					<b-tabs card>
						<b-tab title="Question">
							<h1>{{ resultInfo.question.text }}</h1>
							<p>{{ resultInfo.question.description }}</p>
							<!-- TODO Add code to handle objects -->
						</b-tab>
						<b-tab title="Solution">
							<h1>Solution</h1>
							<p>{{ resultInfo.solution }}</p>
							<!-- TODO Add code to handle different solution types -->
						</b-tab>
						<b-tab title="Answer">
							<!-- TODO Add code to show a selected wrong answer-->
						</b-tab>
					</b-tabs>
				</b-card>
			</b-col>
		</b-row>
		<b-row>
			<b-col>
				<!-- TODO liste over feil svar-->
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
export default {
	name: "QuestionResultScreen",
	props: ["resultInfo"],
	data() {
		return {
			selectedResult: 0
		}
	},
	methods: {
		nextQuestion() {
			this.$socket.emit("nextQuestionRequest");
		},
		endSession() {

		}
	}
};
</script>
