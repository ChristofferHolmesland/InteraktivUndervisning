<template>
    <div id="session">
        <b-container>
            <b-row>
                <b-col lg="4">
                    <p>{{getLocale.status}}{{getLocale.inactive}} | {{getLocale.active}} | {{getLocale.finished}}</p>
                </b-col>
                <b-col lg="2" style="text-align: right;">
                    <p>{{getLocale.questionsAsked}}{{getSession.numberOfQuestions}}</p>
                </b-col>
            </b-row>
            <b-row>
                <b-col lg="3">
                    <p>{{getLocale.participants}}{{getSession.participants}}</p>
                </b-col>
                <b-col lg="3" style="text-align: right;">
                    <p>{{getLocale.correctAnswers}}{{getSession.correctAnswers}} %</p>
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
                            <p>{{question.text}} | {{question.correctAnswers}} %</p>
                        </b-list-group-item>
                    </b-list-group>
                </b-col>
                <b-col lg="6">
                    <!-- Add component to view question information. Need to be able to switch between information and incorrect answers -->
                    <div v-if="showAnswer">
                        <b-container>
                            <b-row>
                                <b-col>
                                    <p>Answer: {{incorrectAnswers[selectedAnswer].answer}}</p>
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
                                    <p>Text: {{session.questions[selectedQuestion].text}}</p>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col>
                                    <p>Description: {{session.questions[selectedQuestion].description}}</p>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col>
                                    <p>Correct answers: {{session.questions[selectedQuestion].correctAnswers}} %</p>
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
                                :key="answer.answer"
                                style="cursor: pointer; min-width: 100px;"
                                @click="changeAnswer($event)"
                                :id="index">
                            <p>Answer {{index}}</p>
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
            incorrectAnswers: undefined,
            showAnswer: false
        }
    },
    sockets: {
        getSessionResponse(data) {
            this.session = data;
        }
    },
    computed: {
        getSession() {
            return this.session;
        },
        getLocale() {
            let locale = this.$store.getters.getLocale("Session");
			if(locale) return locale;
			else return {};
        },
        getIncorrectAnswers() {
            if(!this.session) return;

            this.incorrectAnswers = [];

            let answers = this.session.questions[this.selectedQuestion].answers;

            for(let x = 0; x < answers.length; x++){
                if(answers.correct != "1"){
                    this.incorrectAnswers.push(answers[x]);
                }
            }

            return this.incorrectAnswers;
        },
        getNumberOfEmptyCards(){
            if(this.incorrectAnswers.length < 10) return 10 - this.incorrectAnswers.length;
            return 0;
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