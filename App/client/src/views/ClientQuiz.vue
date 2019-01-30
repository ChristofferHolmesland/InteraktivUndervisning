<template>
    <div id="clientQuiz">
    <b-container>
        <ClientQuizQuestion v-if="getSessionState == 1" :quizCode="quizCode" :questioninfo="questioninfo"></ClientQuizQuestion>
        <ClientWaitTime v-else-if="getSessionState == 2" :quizCode="quizCode"></ClientWaitTime>
        <SessionFinished v-else-if="getSessionState == 3" :quizCode="quizCode"></SessionFinished>
        <ClientWaitingRoom v-else :quizCode="quizCode"></ClientWaitingRoom>
        <!--Client Result? -->
    </b-container>
    </div>
</template>

<script>
    import ClientWaitingRoom from "../components/ClientWaitingRoom.vue";
    import ClientQuizQuestion from "../components/ClientQuizQuestion.vue";
    import ClientWaitTime from "../components/ClientQuestionWaitTime.vue";
    import SessionFinished from "../components/SessionFinished.vue";


	export default {
		name: "ClientQuiz",
		data() {
			return{
				sessionState: 0,
				questioninfo: {
					text: "",
					hasDescription: false,
					description: "",
					time: -1,
					useObject: false,
					object: ""
				}
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
            setQuestionInformation(questioninfo) {
				if (questioninfo.description !== "") {
					this.questioninfo.hasDescription = true;
				} else{
					this.questioninfo.hasDescription = false;
				}
				this.questioninfo.text = questioninfo.text;
				this.questioninfo.description = questioninfo.description;
				this.questioninfo.time = questioninfo.time;
				this.questioninfo.type = questioninfo.type;
            }
        },computed: {
            getSessionState() {

            	return this.sessionState;
            }
        },
        sockets: {
			startQuizResponse(questioninfo) { //TODO replace this with only nextQuestionResponse
				console.log(questioninfo);
				this.setQuestionInformation(questioninfo);
				this.sessionState = 1;
			},
			nextQuestionResponse(questioninfo) {
				console.log("Got next question");
				this.setQuestionInformation(questioninfo);
				this.sessionState = 1;
			},
            AnswerResponse(ans) {
				console.log("The question was answered! Answer given:\n ");
				console.log(ans);
				this.sessionState = 2;
			},
			returnToJoinRoom() {
				console.log("Returning");
				this.$router.push("/client");
			},
            finishSessionResponse() {
				console.log("Session is finished");
				this.sessionState = 3;
            }
		},
		components: {
			ClientWaitingRoom,
			ClientQuizQuestion,
            ClientWaitTime,
			SessionFinished,
		},
	}
</script>

<style scoped>

</style>