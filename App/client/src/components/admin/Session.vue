<template>
    <b-container fluid>
        <b-row class="border-bottom mb-3">
            <b-col cols="4">
                <p>{{getLocale.status}} {{getLocale.inactive}} | {{getLocale.active}} | {{getLocale.finished}}</p>
            </b-col>
            <b-col cols="8">
                <b-container class="px-0">
                    <b-row>
                        <b-col>
                            <p>{{getLocale.questionsAsked}} {{getSession.numberOfQuestions}}</p>
                        </b-col>
                        <b-col>
                            <p>{{getLocale.participants}} {{getSession.participants}}</p>
                        </b-col>
                        <b-col>
                            <p>{{getLocale.correctAnswers}} {{getSession.correctAnswers}} %</p>
                        </b-col>
                    </b-row>
                </b-container>
            </b-col>
        </b-row>
        <b-row>
            <b-col lg="4">
                <b-list-group style="overflow-y: scroll; min-height: 600px; height: 650px; max-height: 650px;">
                    <b-list-group-item  v-for="(question, index) in getSession.questions" 
                                        :key="question.qqId" 
                                        style="cursor: pointer;" 
                                        :id="index"
                                        @click="changeQuestion($event)">
                        {{question.text}} | {{question.correctAnswers}} %
                    </b-list-group-item>
                    <div v-if="getSession.questions.length < 15">
                        <b-list-group-item v-for="index in 20" :key="index + getSession.questions.length">
                            <p> </p>
                        </b-list-group-item>
                    </div>
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
                <div style="overflow-x: scroll; max-width: 100%; white-space: nowrap;">
                    <!-- Add component to view incorrect answers -->
                    <ul class="list-inline">                        
                        <li v-for="(answer, index) in getIncorrectAnswers" 
                            :key="index"
                            class="list-inline-item"
                            >
                            <b-card 
                                    style="cursor: pointer; min-width: 100px; min-height: 100px;"
                                    v-on:click="changeAnswer($event)"
                                    :id="index"
                                    no-body>
                                Answer {{index}}
                            </b-card>
                        </li>
                    </ul>
                </div>
            </b-col>
        </b-row>
    </b-container>
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