<template>
    <div id="textquestion">
        <b-container>
            <b-row>
                <b-col>
                    <b-tabs>
                        <b-tab title="Spørsmål" active>
                            Spørsmål
                        </b-tab>
                        <b-tab title="Svar">
                            Svar
                            <b-form-input v-model="inputText" type="text" placeholder="Skriv inn svar">

                            </b-form-input>
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
	export default {
		name: "ClientQuizTextQuestion",
		props: [
			"quizId",
			"quizActive"
		],
        created() {
			this.interval = setInterval(this.setTimer,1000);
        },
		data() {
			return {
				timer: 61,
                interval: "",
                inputText: ""
			};
		},
		methods: {
			setTimer() {
                this.timer--;
            },
            questionAnswered() {
				console.log("Answered clicked");
				this.$socket.emit("questionAnswered",this.inputText);
            },
            questionNotAnswered() {
				console.log("Answered not clicked");
				this.$socket.emit("questionNotAnswered");
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

		},
	}
</script>

<style scoped>

</style>