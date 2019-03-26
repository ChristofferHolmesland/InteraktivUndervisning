<template>
    <b-container>
        <b-row>
            <b-col lg="4">
                <b-container>
                    <b-row>
                        <b-col lg="12">
                            <b-button @click="showUserStats" variant="primary">Go back</b-button>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col lg="12">
                            <b-list-group style="overflow-y: scroll; max-height: 750px;">
                                <b-list-group-item v-for="(question, index) in getQuestionList" :key="index"
                                @click="changeQuestion(index)"
                                style="cursor: pointer;">
                                    {{question.text}}
                                </b-list-group-item>
                                <b-list-group-item class="border-0" v-show="showNoQuestions">
                                    No questions
                                </b-list-group-item>
                                <div v-if="questionListLength < 10">
                                    <b-list-group-item v-for="index in (10 - questionListLength)" :key="index + questionListLength">
                                        <p> </p>
                                    </b-list-group-item>
                                </div>
                            </b-list-group>
                        </b-col>
                    </b-row>
                </b-container>
            </b-col>
            <b-col lg="8">
                <b-container>
                    <b-row>
                        <b-col cols="5">
                            <h6>{{sessionInformation.name}}</h6>
                        </b-col>
                        <b-col cols="2">
                            <h6>{{sessionInformation.courseCode}}</h6>
                        </b-col>
                        <b-col cols=2>
                            <h6>{{sessionInformation.courseSemester}}</h6>
                        </b-col>
                        <b-col cols=3>
                            <h6>Participants: {{sessionInformation.participants}}</h6>
                        </b-col>
                    </b-row>
                    <b-row align-h="center" @click="changeShowSessionStat()" style="cursor: pointer;">
                        <b-col cols="4">

                        </b-col>
                        <b-col cols="4">
                            <h4 style="text-align: center;">Session Stats</h4>
                        </b-col>
                        <b-col cols="4" style="text-align: right;">
                            <p v-if="showSessionStat">^</p>
                            <p v-else>V</p>
                        </b-col>
                    </b-row>
                    <b-row v-show="showSessionStat">
                        <b-col>
                            <h6>Other user correct: {{sessionInformation.otherUserCorrect}}%</h6> 
                        </b-col>
                        <b-col>
                            <h6>Other user incorrect: {{sessionInformation.otherUserIncorrect}}%</h6> 
                        </b-col>
                        <b-col>
                            <h6>Other user didn't know: {{sessionInformation.otherUserDidntKnow}}%</h6> 
                        </b-col>
                    </b-row>
                    <b-row v-show="showSessionStat">
                        <b-col>
                            <h6>User correct: {{sessionInformation.userCorrect}}%</h6>
                        </b-col>
                        <b-col>
                            <h6>User incorrect: {{sessionInformation.userIncorrect}}%</h6>
                        </b-col>
                        <b-col>
                            <h6>User didn't know: {{sessionInformation.userDidntKnow}}%</h6>                        
                        </b-col>
                    </b-row>
                    <b-row align-h="center" @click="changeShowQuestionStat" style="cursor: pointer;">
                        <b-col cols="4">

                        </b-col>
                        <b-col cols="4">
                            <h4 style="text-align: center;">Question Stats</h4>
                        </b-col>
                        <b-col cols="4" style="text-align: right;">
                            <p v-if="showQuestionStat">^</p>
                            <p v-else>V</p>
                        </b-col>
                    </b-row>
                    <b-row v-show="showQuestionStat">
                        <b-col>
                            <h6>Other user correct: {{sessionInformation.questionList[selectedQuestion].otherUserCorrect}}%</h6> 
                        </b-col>
                        <b-col>
                            <h6>Other user incorrect: {{sessionInformation.questionList[selectedQuestion].otherUserIncorrect}}%</h6> 
                        </b-col>
                        <b-col>
                            <h6>Other user didn't know: {{sessionInformation.questionList[selectedQuestion].otherUserDidntKnow}}%</h6> 
                        </b-col>
                    </b-row>
                    <b-row v-show="showQuestionStat">
                        <b-col>
                            <h6>User correct: {{sessionInformation.questionList[selectedQuestion].userCorrect}}%</h6>
                        </b-col>
                        <b-col>
                            <h6>User incorrect: {{sessionInformation.questionList[selectedQuestion].userIncorrect}}%</h6>
                        </b-col>
                        <b-col>
                            <h6>User didn't know: {{sessionInformation.questionList[selectedQuestion].userDidntKnow}}%</h6>                        
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col lg="12">
                            <DisplayQuestion :resultInfo="getResultInformation" :selectedAnswer="selectedAnswer"/>
                        </b-col>
                    </b-row>
                    <b-row v-show="getAnswerListLength > 1">
                        <b-col lg="12">
                            <div style="overflow-x: scroll; max-width: 100%; white-space: nowrap;">
                                <ul class="list-inline">                        
                                    <li v-for="(answer, index) in getAnswers" 
                                        :key="index"
                                        class="list-inline-item"
                                        >
                                        <b-card v-if="checkResult(index) === 1"
                                                style="cursor: pointer; min-width: 100px; min-height: 100px;"
                                                @click="changeAnswer($event)"
                                                :id="index"
                                                no-body
                                                class="correctAnswer answer">
                                            <p :id="index">Answer {{index}}</p>
                                            <p :id="index">Correct</p>
                                        </b-card>
                                        <b-card v-else-if="checkResult(index) === 0"
                                                style="cursor: pointer; min-width: 100px; min-height: 100px;"
                                                @click="changeAnswer($event)"
                                                :id="index"
                                                no-body
                                                class="incorrectAnswer answer">
                                            <p :id="index">Answer {{index}}</p>
                                            <p :id="index">Incorrect</p>
                                        </b-card>
                                        <b-card v-else-if="checkResult(index) === -1"
                                                style="cursor: pointer; min-width: 100px; min-height: 100px;"
                                                no-body
                                                class="didntKnowAnswer answer">
                                            <p>Answer {{index}}</p>
                                            <p>Didn't know</p>
                                        </b-card>
                                    </li>
                                </ul>
                            </div>
                        </b-col>
                    </b-row>
                </b-container>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import DisplayQuestion from "../../admin/question/DisplayQuestion.vue";

export default {
    name: "Session",
    props: ["sessionInformation"],
    data() {
        return {
            selectedQuestion: 0,
            selectedAnswer: 0,
            showSessionStat: false,
            showQuestionStat: false
        };
    },
    methods: {
        showUserStats() {
            this.$emit("showUserStats");
        },
        changeQuestion(index) {
            selectedQuestion = index;
        },
        changeShowSessionStat() {
            this.showSessionStat = !this.showSessionStat;
            if (this.showSessionStat) this.showQuestionStat = false;
        },
        changeShowQuestionStat() {
            this.showQuestionStat = !this.showQuestionStat;
            if (this.showQuestionStat) this.showSessionStat = false;
        },
        changeAnswer(event) {
            console.log(event);
            console.log(event.target.id);
            this.selectedAnswer = Number(event.target.id);
        },
        checkResult(index) {
            return this.sessionInformation.questionList[this.selectedQuestion].answerList[index].result;
        }
    },
    computed: {
        getQuestionList() {
            if (this.sessionInformation.questionList === undefined) return [];
            return this.sessionInformation.questionList;
        },
        showNoQuestions() {
			return this.sessionsListLength === 0;
        },
        questionListLength() {
            if(this.sessionInformation.questionList === undefined) return 0;
            return this.sessionInformation.questionList.length;
        },
        getAnswerList() {
            if (this.sessionInformation.questionList[this.selectedQuestion].answerList === undefined) return [];
            return this.sessionInformation.questionList[this.selectedQuestion].answerList;
        },
        getAnswerListLength() {
            if (this.sessionInformation.questionList[this.selectedQuestion].answerList === undefined) return 0;
            return this.sessionInformation.questionList[this.selectedQuestion].answerList.length;
        },
        getResultInformation() {
            let response = {};
            let question = this.sessionInformation.questionList[this.selectedQuestion];
            response.question = question;
            response.solution = question.solution;
            response.answerList = question.answerList;
            return response;
        },
        getAnswers() {
            return this.sessionInformation.questionList[this.selectedQuestion].answerList;
        }
    },
    components: {
        DisplayQuestion
    }
}
</script>