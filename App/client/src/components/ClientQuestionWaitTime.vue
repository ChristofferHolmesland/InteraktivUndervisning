<template>
    <div id="waitTime">
        <p>Waiting for the next question!</p>
        <b-button @click="nextQuestion">Next Question</b-button>
    </div>
</template>

<script>
	export default {
		name: "ClientQuestionWaitTime",
        props: [
        	"quizCode"
        ],
        methods: {
			nextQuestion(){
				console.log("Want the next question!");
				this.$socket.emit("nextQuestion",this.quizCode);
            }
        }
	}
</script>

<style scoped>

</style>