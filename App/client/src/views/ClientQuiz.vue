<template>
    <div id="clientQuiz">
    <b-container>
        <ClientQuizQuestion v-if="getQuizActive" :quizCode="quizCode"></ClientQuizQuestion>
        <ClientWaitingRoom v-else :quizCode="quizCode"></ClientWaitingRoom>
    </b-container>
    </div>
</template>

<script>
    import ClientWaitingRoom from "../components/ClientWaitingRoom.vue";
    import ClientQuizQuestion from "../components/ClientQuizQuestion.vue";

	export default {
		name: "ClientQuiz",
		data() {
			return{
                quizActive: false
			};
		},
		created() {
			this.$socket.emit("clientStarted");
			//this.$socket.emit("startQuiz");
		},
        props: [
        	"quizCode",
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
            AnswerResponse(ans) {
				console.log("The question was answered! Answer given:\n ");
				console.log(ans);
			},
			questionNotAnsweredResponse() {
				console.log("The question was not answered");
			}
		},
		components: {
			ClientWaitingRoom,
			ClientQuizQuestion
		},
	}
</script>

<style scoped>

</style>