<template>
    <div id="session">
        <b-container>
            <b-row>
                <b-col lg="4">
                    <p>{{getLocale.status}} {{getLocale.inactive}} | {{getLocale.active}} | {{getLocale.finished}}</p>
                </b-col>
                <b-col lg="2" style="text-align: right;">
                    <p>{{getLocale.questionsAsked}} {{getSession.numberOfQuestions}}</p>
                </b-col>
            </b-row>
            <b-row>
                <b-col lg="3">
                    <p>{{getLocale.participants}} {{getSession.participants}}</p>
                </b-col>
                <b-col lg="3" style="text-align: right;">
                    <p>{{getLocale.correctAnswers}} {{getSession.correctAnswers}} %</p>
                </b-col>
            </b-row>
            <b-row>
                <b-col lg="6">
                    <b-list-group>
                        <b-list-group-item  v-for="(question, index) in getSession.questions" 
                                            :key="question.text" 
                                            style="cursor: pointer;" 
                                            :id="index"
                                            @click="changeQuestion($event)">
                            {{question.text}} | {{question.correctAnswers}} %
                        </b-list-group-item>
                    </b-list-group>
                </b-col>
                <b-col lg="6">
                    <!-- Add component to view question information. Need to be able to switch between information and incorrect answers -->
                    <div v-if="showAnswer">
                        <b-container>
                            <b-row>
                                <b-col>
                                    <p>Answer: {{getAnswer}}</p>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col>
                                    <p v-if="incorrectAnswers[selectedAnswer].correct == 1"> Correct</p>
                                    <p v-else-if="incorrectAnswers[selectedAnswer].correct == 0"> Incorrect</p>
                                    <p v-else>User didn't know</p>
                                </b-col>
                            </b-row>
                        </b-container>
                    </div>
                    <div v-else>
                        <b-container>
                            <b-row>
                                <b-col>
                                    <p>Text: {{getQuestionInfo.text}}</p>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col>
                                    <p>Description: {{getQuestionInfo.description}}</p>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col>
                                    <p>Correct answers: {{getQuestionInfo.correctAnswers}} %</p>
                                </b-col>
                            </b-row>
                        </b-container>
                    </div>
                </b-col>
            </b-row>
            <b-row class="mt-3">
                <b-col lg="12">
                    <b-card-group style="overflow-x: scroll; max-width: 400px;">
                        <!-- Add component to view incorrect answers -->
                        <b-card v-for="(answer, index) in getIncorrectAnswers" 
                                :key="index"
                                style="cursor: pointer; min-width: 100px;"
                                v-on:click="changeAnswer($event)"
                                :id="index"
                                no-body>
                            Answer {{index}}
                        </b-card>
                    </b-card-group>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
export default {
    name: "session",
    props: {
        sessionId: ""
    },
    data() {
        return {
            session: undefined,
            selectedQuestion: 0,
            selectedAnswer: 0,
            incorrectAnswers: [],
            showAnswer: false
        }
    },
    sockets: {
        getSessionResponse(data) {
            this.session = data;
            this.selectedQuestion = 0;
            this.selectedAnswer = 0;
            this.incorrectAnswers = [];
            this.showAnswer = false;
        }
    },
    computed: {
        getSession() {
            if(this.session == undefined) return {};
            console.log(this.session);
            return this.session;
        },
        getLocale() {
            let locale = this.$store.getters.getLocale("Session");
			if(locale) return locale;
			else return {};
        },
        getIncorrectAnswers() {
            if(this.session == undefined) return [];

            this.incorrectAnswers = [];

            this.incorrectAnswers = this.session.questions[this.selectedQuestion].answers;

            return this.incorrectAnswers;
        },
        getQuestionInfo() {
            if(this.session == undefined) return {};
            return this.session.questions[this.selectedQuestion];
        },
        getAnswer() {
            return this.incorrectAnswers[this.selectedAnswer].answer;
        }
    }, 
    methods: {
        changeAnswer(event) {
            this.selectedAnswer = event.target.id;
            this.showAnswer = true;
        },
        changeQuestion(event) {
            this.selectedQuestion = event.target.id;
        }
    }
}
</script>