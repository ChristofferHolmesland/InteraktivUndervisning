<template>
    <div id="textquestion">
        <b-container>
            <b-row>
                <b-col>
                    <b-tabs>
                        <b-tab :title="getLocale.question">
                            <b-card :title="getQuestionInfo.text" >
                                <p v-if="getQuestionInfo.description !== undefined">
                                    {{ getQuestionInfo.description }}
                                </p>
                                <!-- TODO add code to include question object if it is there -->
                            </b-card>
                        </b-tab>
                        <b-tab :title="getLocale.answer" active>
                            <TextInput :requestAnswer="requestAnswer"
                                    @getTextResponse="getTextValue"
                                    v-if="getQuestionType === 1"
                                    />
                            <MultipleChoice :requestAnswer="requestAnswer"
                                            @getTextResponse="getTextValue"
                                            :choices="questionInfo.object.multipleChoices"
                                            v-if="getQuestionType === 2"
                                            />
                                            <!--getQuestionInfo.object.choices-->
                            <Shellsort v-if="getQuestionType === 3" 
                                        :requestAnswer="requestAnswer"
                                        @getTextResponse="getTextValue"
                                        :initialList="getStartArray(questionInfo.object.startingArray)"
                                        :initialKValue="questionInfo.object.kValue"
                                        />
                            <Mergesort  v-if="getQuestionType === 4"
                                        :requestAnswer="requestAnswer"
                                        @getTextResponse="getTextValue"
                                        :steps="questionInfo.object.steps"
                                        />
                            <Quicksort v-if="getQuestionType === 5"
                                :requestAnswer="requestAnswer"
                                @getTextResponse="getTextValue"
                                :steps="questionInfo.object.steps"
                                />
                            <Dijkstra v-if="getQuestionType === 10"
                                :requestAnswer="requestAnswer"
                                @getTextResponse="getTextValue"
                                :steps="questionInfo.object.steps"
                                />
                        </b-tab>
                        <b-tab :title="updateTimer" v-if="interval !== undefined" disabled></b-tab>
                    </b-tabs>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-btn @click="exitSession">{{ getLocale.exitSessionBtnText }}</b-btn>
                    <b-btn @click="questionNotAnswered">{{ getLocale.answerDontKnowBtnText }}</b-btn>
                    <b-btn @click="questionAnswered">{{ getLocale.answerBtnText }}</b-btn>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
	import TextInput from "./questionTypes/TextInput.vue";
    import MultipleChoice from "./questionTypes/MultipleChoice.vue";
    import Shellsort from "./questionTypes/sorting/Shellsort.vue";
    import Mergesort from "./questionTypes/sorting/Mergesort.vue";
    import Quicksort from "./questionTypes/sorting/Quicksort.vue";
    import Dijkstra from "./questionTypes/Dijkstra.vue";
    
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
                        this.questionNotAnswered();
                        clearInterval(this.interval);
                    } else this.timeLeft--;
                }, 1000);
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
            //This is the function that sends the answerobject to the server
            getTextValue(inputText) {
				this.$socket.emit("questionAnswered", inputText, this.sessionCode);
            },
            exitSession() {
                if (confirm(this.getLocale.leaveSessionBody)) {
                    this.$socket.emit("leaveSession",this.sessionCode);
                }
            },
            getStartArray(array) {
                let elements = array.split(",");
                let result = [];
                for (let i = 0; i < elements.length; i++) {
                    result.push(elements[i]);
                }
                return result;
            }
	    },
		computed: {
			updateTimer() {                
                let min = Math.floor(this.timeLeft / 60).toString();
                let sec = Math.floor(this.timeLeft % 60).toString();

                return `${min.padStart(2, "0")}:${sec.padStart(2, "0")}`;
            },
            getQuestionInfo() {
                return this.questionInfo;
            },
            getLocale() {
                let locale = this.$store.getters.getLocale("ClientSessionQuestion");
                if(locale) return locale;
                return {};
            },
            getQuestionType() {
                return this.questionInfo.type;
            }
        },
        sockets: {
            adminForceNext() {
                this.questionNotAnswered();
            }
        },
		components: {
			TextInput,
            MultipleChoice,
            Shellsort,
            Mergesort,
            Quicksort,
            Dijkstra
        }
	};
</script>
