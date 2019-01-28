<template>
    <div id="clientQuiz">
    <b-container>
        <ClientQuizTextQuestion v-if="getQuizActive" :quizId ="quizId" :quizActive="quizActive"></ClientQuizTextQuestion>
        <ClientWaitingRoom v-else :quizId ="quizId" :quizActive="quizActive"></ClientWaitingRoom>
    </b-container>
    </div>
</template>

<script>
    import ClientWaitingRoom from "../components/ClientWaitingRoom.vue";
    import ClientQuizTextQuestion from "../components/ClientQuizTextQuestion.vue";

	export default {
		name: "ClientQuiz",
		data() {
			return{
			};
		},
		created() {
			this.$socket.emit("clientStarted");
			//this.$socket.emit("startQuiz");
		},
        props: [
        	"quizId",
            "quizActive"
        ],
		methods: {

        },computed: {
            getQuizActive() {
            	return this.quizActive;
            }
        },
        sockets: {
			startQuizResponse() {
				console.log("getQuizActive is in ClientQuiz and is true!");
				this.quizActive = true;
			},
            questionAnsweredResponse(ans) {
				console.log("The question was answered! Answer given: " + ans);
			},
			questionNotAnsweredResponse() {
				console.log("The question was not answered");
			}
		},
		components: {
			ClientWaitingRoom,
			ClientQuizTextQuestion
		},
	}
</script>

<style scoped>

</style>