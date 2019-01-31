<template>
    <div id="clientQuiz">
    <b-container>
        <ClientQuizQuestion v-if="getSessionState == 1" :quizCode="quizCode" :questioninfo="questioninfo"></ClientQuizQuestion>
        <!--<ClientWaitTime v-else-if="getSessionState == 2" :quizCode="quizCode"></ClientWaitTime>-->
        <!--<ClientResult v-else-if="getSessionState == 3" :quizCode="quizCode" :result="result"></ClientResult>-->
        <!--TODO Change order of the components and their session state depending on the order they should normally run-->
        <ClientWaitingRoom v-else :quizCode="quizCode" :waitingRoomString="waitingRoomString"></ClientWaitingRoom>

    </b-container>
    </div>
</template>

<script>
	//TODO change order based on the components order in line 4-8
    import ClientWaitingRoom from "../components/ClientWaitingRoom.vue";
    import ClientQuizQuestion from "../components/ClientQuizQuestion.vue";
    //import ClientWaitTime from "../components/ClientQuestionWaitTime.vue";
	//import ClientResult from "./ClientResult";
    //import SessionFinished from "../components/SessionFinished.vue";



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
					object: "",
					result: -1,
                    waitingRoomString: "",
				},
                waitingRoomString: "waitingRoom",
			};
		},
		created() {
			this.$socket.emit("verifyUserLevel", 1);
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
				this.waitingRoomString = ans;
				this.sessionState = 3
			},
            finishQuestionResponse() {
				console.log("Teacher finished the question.");
				this.sessionState = 2;
            },
			returnToJoinRoom() {
				console.log("Returning");
				this.$router.push("/client");
			},
            finishSessionResponse() {
				console.log("Session is finished");
				this.waitingRoomString = "This session has concluded!Press the button to leave the room and join another session."
				this.sessionState = 4;
            }
		},
		components: {   //TODO change order based on the components order in line 4-8
			ClientWaitingRoom,
			ClientQuizQuestion,
            //ClientWaitTime,
			//ClientResult,
			//SessionFinished,
		},
	}
</script>

<style scoped>

</style>