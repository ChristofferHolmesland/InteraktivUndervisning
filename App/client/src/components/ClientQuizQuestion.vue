<template>
    <div id="textquestion">
        <b-container>
            <b-row>
                <b-col>
                    <b-tabs>
                        <b-tab title="Spørsmål" active>
                            <b-card :title="getText" >
                                <p v-if="useDescription">
                                    {{getDescription}}
                                </p>
                            </b-card>
                        </b-tab>
                        <b-tab title="Svar">
                            <ClientQuizQuestionText :requestAnswer="requestAnswer" @getTextResponse="getTextValue" v-if="getType===1"></ClientQuizQuestionText>
                            <ClientQuizQuestionMultiChoice v-if="getType===2"></ClientQuizQuestionMultiChoice>
                        </b-tab>
                        <b-tab :title="updateTimer" disabled></b-tab>
                    </b-tabs>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-btn>Avslutt</b-btn>
                    <b-btn @click="questionNotAnswered">Vet ikke</b-btn>
                    <b-btn @click="questionAnswered">Svar</b-btn>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
	import ClientQuizQuestionText from "./ClientQuizQuestionText";
	import ClientQuizQuestionMultiChoice from "./ClientQuizQuestionMultiChoice";
	export default {
		name: "ClientQuizQuestion",
		components: {
			ClientQuizQuestionText,
			ClientQuizQuestionMultiChoice
        },
        created() {
			this.interval = setInterval(this.setTimer,1000);
        },
		data() {
			return {
                interval: "",
                type: 1,
                questionText: "What does pot of greed do?",
                useDescription: true,
                useObject: false,
                questionDescription: "This is a message from lord Nergal! I await you at the Dread Islands!",
                questionObject: "",
				timer: 61,
                requestAnswer: false
			};
        },
		methods: {
			setTimer() {
                this.timer--;
            },
            questionAnswered() {
                console.log("Answered clicked");
                this.requestAnswer = !this.requestAnswer;
            },
            questionNotAnswered() {
				console.log("Answered not clicked");
				this.$socket.emit("questionNotAnswered");
            },
            getTextValue(inputText) {
				console.log("Got text from child component");
				this.$socket.emit("questionAnswered",inputText);
            }
	    },sockets: {
			/*questionAnsweredResponse(ans) {
				console.log("The question was answered! Answer given: " + ans);
			},
			questionNotAnsweredResponse() {
				console.log("The question was not answered");
			}*/
        },
		computed: {
			updateTimer() {
				let minutes = Math.floor(this.timer / 60);
				let seconds = this.timer % 60;
				let counter = "";
				if (seconds < 10){
                    counter = `${minutes}:0${seconds}`;
                }
				else if(minutes === 0 && seconds === 0){
                    clearInterval(this.interval); //todo emit not answered if time runs out.
				}else{
					counter = `${minutes}:${seconds}`;
                }
				return counter;
			},
            getType() {
				return this.type;
            },
            getText() {
				return this.questionText
            },
            getDescription() {
				return this.questionDescription
            }

		},
	}
</script>

<style scoped>

</style>