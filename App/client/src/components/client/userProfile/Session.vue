<!--
    Component name: Session
    Use case:
        - Display information about a session a user has participated in.
-->

<template>
    <b-container>
        <b-row>
            <b-col lg="4">
                <b-container>
                    <b-row>
                        <b-col lg="12">
                            <b-button @click="showUserStats" variant="primary">{{getLocale.goBackBtn}}</b-button>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col lg="12">
                            <b-list-group style="overflow-y: scroll; max-height: 750px;">
                                <b-list-group-item v-for="(question, index) in getQuestionList" :key="index"
                                                    @click="changeQuestion(index)"
                                                    style="cursor: pointer;"
                                                    :class="selectedQuestion == index ? 'selected' : ''">
                                    {{question.text}}
                                </b-list-group-item>
                                <b-list-group-item class="border-0" v-show="showNoQuestions">
                                    {{getLocale.noQuestions}}
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
                        <b-col cols="8">
                            <h6>{{sessionInformation.name}}</h6>
                        </b-col>
                        <b-col cols="2">
                            <h6>{{sessionInformation.courseCode}}</h6>
                        </b-col>
                        <b-col cols=2>
                            <h6>{{sessionInformation.courseSemester}}</h6>
                        </b-col>
                    </b-row>
                    <hr>
                    <b-row align-h="center" @click="changeShowSessionStat()" style="cursor: pointer;">
                        <b-col cols="2">

                        </b-col>
                        <b-col cols="8">
                            <h4 style="text-align: center;">{{getLocale.sessionStats}}</h4>
                        </b-col>
                        <b-col cols="2" style="text-align: right;">
                            <p><i :class="showSessionStat ? 'fas fa-angle-up' : 'fas fa-angle-down'"></i></p>
                        </b-col>
                    </b-row>
                    <b-row v-show="showSessionStat">
                        <b-col>
                            <h6>{{getLocale.classStats}}</h6> 
                        </b-col>
                        <b-col>
                            <h6 v-if="sessionInformation.otherUserCorrect !== 'notAvailable'">{{getLocale.correct}}{{sessionInformation.otherUserCorrect}}%</h6> 
                            <h6 v-else>{{getLocale.correct}}{{getLocale.notAvailable}}</h6>
                        </b-col>
                        <b-col>
                            <h6 v-if="sessionInformation.otherUserIncorrect !== 'notAvailable'">{{getLocale.incorrect}}<span v-b-tooltip.hover :title="getLocale.incorrectTooltip">{{sessionInformation.otherUserIncorrect}}%</span> / <span v-b-tooltip.hover :title="getLocale.didntKnow">{{sessionInformation.otherUserDidntKnow}}%</span></h6> 
                            <h6 v-else>{{getLocale.incorrect}}{{getLocale.notAvailable}}</h6>
                        </b-col>
                    </b-row>
                    <b-row v-show="showSessionStat">
                        <b-col>
                            <h6>{{getLocale.userStats}}</h6>
                        </b-col>
                        <b-col>
                            <h6>{{getLocale.correct}}{{sessionInformation.userCorrect}}%</h6>
                        </b-col>
                        <b-col>
                            <h6>{{getLocale.incorrect}}<span v-b-tooltip.hover :title="getLocale.incorrectTooltip">{{sessionInformation.userIncorrect}}%</span> / <span v-b-tooltip.hover :title="getLocale.didntKnow">{{sessionInformation.userDidntKnow}}%</span></h6>
                        </b-col>
                    </b-row>
                    <hr>
                    <b-row align-h="center" @click="changeShowQuestionStat" style="cursor: pointer;">
                        <b-col cols="2">

                        </b-col>
                        <b-col cols="8">
                            <h4 style="text-align: center;">{{getLocale.questionStats}}</h4>
                        </b-col>
                        <b-col cols="2" style="text-align: right;">
                            <p><i :class="showQuestionStat ? 'fas fa-angle-up' : 'fas fa-angle-down'"></i></p>
                        </b-col>
                    </b-row>
                    <b-row v-show="showQuestionStat">
                        <b-col>
                            <h6>{{getLocale.classStats}}</h6> 
                        </b-col>
                        <b-col>
                            <h6 v-if="sessionInformation.questionList[selectedQuestion].otherUserCorrect !== 'notAvailable'">{{getLocale.correct}}{{sessionInformation.questionList[selectedQuestion].otherUserCorrect}}%</h6> 
                            <h6 v-else>{{getLocale.correct}}{{getLocale.notAvailable}}</h6>
                        </b-col>
                        <b-col>
                            <h6 v-if="sessionInformation.questionList[selectedQuestion].otherUserIncorrect !== 'notAvailable'">{{getLocale.incorrect}}<span v-b-tooltip.hover :title="getLocale.incorrectTooltip">{{sessionInformation.questionList[selectedQuestion].otherUserIncorrect}}%</span> / <span v-b-tooltip.hover :title="getLocale.didntKnow">{{sessionInformation.questionList[selectedQuestion].otherUserDidntKnow}}%</span></h6> 
                            <h6 v-else>{{getLocale.incorrect}}{{getLocale.notAvailable}}</h6>
                        </b-col>
                    </b-row>
                    <b-row v-show="showQuestionStat">
                        <b-col>
                            <h6>{{getLocale.userStats}}</h6>
                        </b-col>
                        <b-col>
                            <h6>{{getLocale.correct}}{{sessionInformation.questionList[selectedQuestion].userCorrect}}%</h6>
                        </b-col>
                        <b-col> 
                            <h6>{{getLocale.incorrect}}<span v-b-tooltip.hover :title="getLocale.incorrectTooltip">{{sessionInformation.questionList[selectedQuestion].userIncorrect}}%</span> / <span v-b-tooltip.hover :title="getLocale.didntKnow">{{sessionInformation.questionList[selectedQuestion].userDidntKnow}}%</span></h6>
                        </b-col>
                    </b-row>
                    <hr>
                    <b-row class="mb-3">
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
                                        <b-card style="cursor: pointer;
                                                    min-width: 100px;
                                                    min-height: 100px;
                                                    padding: 5px;
                                                    margin: 5px;
                                                    text-align: center;
                                                    display: table;"
                                                @click="changeAnswer($event)"
                                                :id="index"
                                                no-body
                                                :class="selectedAnswer == index ? 'selected' : ''">
                                            <span   :id="index"
                                                    class="align-middle"
                                                    style="display: table-cell"
                                                    >
                                                {{ getCardText(index) }}
                                            </span>
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
            this.selectedQuestion = index;
        },
        changeShowSessionStat() {
            this.showSessionStat = !this.showSessionStat;
        },
        changeShowQuestionStat() {
            this.showQuestionStat = !this.showQuestionStat;
        },
        changeAnswer(event) {
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
        },
        getLocale() {
			let locale = this.$store.getters.getLocale("SessionStat");
			if (locale) return locale;
			else return {};
        },
        getCardText: function() {
            return (index) => {
                return `${this.getLocale.answer} ${index} - ${this.checkResult(index) === 1 ?
                    this.getLocale.correctCard :
                    this.checkResult(index) === 0 ?
                    this.getLocale.incorrectCard :
                    this.getLocale.didntKnow}`;
            }
        }
    },
    components: {
        DisplayQuestion
    }
}
</script>

<style scoped>
.selected {
	background-color: darkgrey;
}
</style>
