<template>
	<div>
		<b-button @click="nextQuestion">Next</b-button>
	</div>
</template>

<script>
export default {
	name: "QuestionResultScreen",
	methods: {
		nextQuestion() {
			this.$socket.emit("nextQuestionRequest");
		}
	}
};
</script>
