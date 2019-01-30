<template>
    <div id="clientQuiz">
    <b-container>
        <ClientQuizQuestion v-if="getQuizActive" :quizCode="quizCode" :questioninfo="questioninfo"></ClientQuizQuestion>
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
				quizActive: false,
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

        },computed: {
            getQuizActive() {
            	return this.quizActive;
            }
        },
        sockets: {
			startQuizResponse(questioninfo) {
				console.log(questioninfo);
				if (questioninfo.description !== "") {
					this.questioninfo.hasDescription = true;
                } else{
					this.questioninfo.hasDescription = false;
                }
				this.questioninfo.text = questioninfo.text;
				this.questioninfo.description = questioninfo.description;
				this.questioninfo.time = questioninfo.time;
				this.questioninfo.type = questioninfo.type;
				console.log("HasDescription" + this.questioninfo.hasDescription);
                console.log("ClientDesc: " + this.questioninfo.description);
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