<template>
    <div id="textquestion">
        <b-container>
            <b-row>
                <b-col>
                    <b-tabs>
                        <b-tab title="Spørsmål" active>
                            <b-card :title="getText" >
                                <p v-if="questioninfo.hasDescription">
                                    {{getDescription}}
                                </p>
                            </b-card>
                        </b-tab>
                        <b-tab title="Svar">
                            <ClientQuizQuestionText :requestAnswer="requestAnswer" @getTextResponse="getTextValue" v-if="getType===1"></ClientQuizQuestionText>
                            <ClientQuizQuestionMultiChoice v-if="getType===2"></ClientQuizQuestionMultiChoice>
                        </b-tab>
                        <b-tab :title="updateTimer" v-if="useTimer" disabled></b-tab>
                    </b-tabs>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-btn @click="exitSession">Avslutt</b-btn>
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
                interval: undefined,
                requestAnswer: false
			};
        },
        props: [
        	"questioninfo",
            "quizCode"
        ],
		methods: {
			setTimer() {
                this.questioninfo.time--;
            },
            questionAnswered() {
                console.log("Answered clicked");
                this.requestAnswer = !this.requestAnswer;
            },
            questionNotAnswered() {
				console.log("Answered not clicked");
				this.$socket.emit("questionAnswered","",this.quizCode);
            },
            getTextValue(inputText) {
				this.$socket.emit("questionAnswered",inputText,this.quizCode);
            },
            exitSession() {
				console.log("Leaving Session");
                //TODO remove finsihSession and insert socket.emit("leaveRoom",this.$socket.emit("leaveRoom",this.quizCode);
                this.$socket.emit("finishSession",this.quizCode);
            }
	    },
		computed: {
			updateTimer() {
				let counter = "";
				if (this.questioninfo.time < 0)
                {
                	counter = "0:00";
                }else {
					let minutes = Math.floor(this.questioninfo.time / 60);
					let seconds = this.questioninfo.time % 60;
					if (seconds < 10 && seconds > 0) {
						counter = `${minutes}:0${seconds}`;
					} else if (minutes === 0 && seconds === 0) {
						console.log("timesup");
						clearInterval(this.interval); //TODO find a way to actually stop the interval
						this.$socket.emit("questionAnswered","");
					} else {
						counter = `${minutes}:${seconds}`;
					}
				}
					return counter;
			},
            getType() {
				return this.questioninfo.type;
            },
            getText() {
				return this.questioninfo.text;
            },
            getDescription() {
				return this.questioninfo.description;
            },
            useTimer() {
				if (this.questioninfo.time < 0) {
					return false
                }
				return true
            }
		},
	}
</script>

<style scoped>

</style>