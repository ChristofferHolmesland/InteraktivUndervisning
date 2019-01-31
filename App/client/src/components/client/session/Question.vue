<template>
    <div id="textquestion">
        <b-container>
            <b-row>
                <b-col>
                    <b-tabs>
                        <b-tab :title="getLocale.question" active>
                            <b-card :title="getQuestionInfo.text" >
                                <p v-if="getQuestionInfo.description !== undefined">
                                    {{ getQuestionInfo.description }}
                                </p>
                                <!-- TODO add code to include question object if it is there -->
                            </b-card>
                        </b-tab>
                        <b-tab :title="getLocale.answer">
                            <Text :requestAnswer="requestAnswer"
                                    @getTextResponse="getTextValue"
                                    v-if="getType===1"
                                    />
                            <MultipleChoice v-if="getType===2"/>
                        </b-tab>
                        <b-tab :title="getTimeLeft" v-if="interval !== undefined" disabled></b-tab>
                    </b-tabs>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-btn @click="exitSession">{{getLocale.exitSessionBtnText}}</b-btn>
                    <b-btn @click="questionNotAnswered">{{getLocale.answerDontKnowBtnText}}</b-btn>
                    <b-btn @click="questionAnswered">{{getLocale.answerBtnText}}</b-btn>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
	import Text from "./questionTypes/Text.vue";
	import MultipleChoice from "./questionTypes/MultipleChoice.vue";
	export default {
		name: "Question",
		data() {
			return {
                interval: undefined,
                requestAnswer: false,
                timeLeft: undefined
			};
        },
        props: [
        	"questionInfo",
            "sessionCode"
        ],
        created() {
            let timeLeft = this.questionInfo.time;
            if (timeLeft === -1) {
                
            } else {
                this.timeLeft = timeLeft;
                this.interval = setInterval(() => {
                    if(this.timeLeft === 0) {
                        sendNotAnswered();
                        clearInterval(this.interval);
                    } else this.timeLeft--;
                });
            }
        },
        beforeDestroy() {
            if (this.interval !== undefined) {
                clearInterval(this.interval);
            }
        },
		methods: {
            questionAnswered() {
                this.requestAnswer = !this.requestAnswer;
            },
            questionNotAnswered() {
				this.$socket.emit("questionAnswered", undefined, this.sessionCode);
            },
            getTextValue(inputText) {
				this.$socket.emit("questionAnswered", inputText, this.sessionCode);
            },
            exitSession() {
                if (confirm(getLocale.leaveSessionBody)) {
                    this.$socket.emit("leaveSession",this.sessionCode);
                }
            }
	    },
		computed: {
			updateTimer() {                
                let min = Math.floor(this.timeLeft / 60);
                let sec = Math.floor(this.timeLeft % 60);

                min.padStart(2, "0");
                sec.padStart(2, "0");

                return `${min}:${sec}`;
            },
            getQuestionInfo() {
                return this.questionInfo;
            },
            getLocale() {
                let locale = this.$store.getters.getLocale("ClientSessionQuestion");
                if(locale) return locale;
                return {};
            }
		},
		components: {
			Text,
			MultipleChoice
        }
	}
</script>