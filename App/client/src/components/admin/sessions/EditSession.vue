<template>
    <b-modal @show="show" :id="elementId" :ref="elementRef" 
            :no-close-on-backdrop="true" :title="getLocale.newSession" 
            @ok="callOkHandler" style="text-align: left;">
        <b-form>
            <b-form-group 	id="sessionTitle"
                            :label="getLocale.newSessionTitle"
                            label-for="sessionTitleInput">
                <b-form-input 	id="sessionTitleInput"
                                type="text"
                                v-model="newSession.title">
                </b-form-input>
            </b-form-group>
            <b-form-group 	id="questions"
                            :label="getLocale.selectQuestions"
                            label-for="questionsSelect">
                <b-form-select 	id="questionsSelect"
                                :options="getPossibleQuestions"
                                v-model="selectedQuestion"
                                @change="selectedQuestionChanged($event)"
                                multiple 
                                :select-size="100" >
                </b-form-select>
            </b-form-group>
            <b-form-group>
                {{ getLocale.selectedQuestions }}
                <b-list-group-item class="border-0" :key="item.value" v-for="item in getCurrentQuestions">
                    {{ item.text }}
                </b-list-group-item>
            </b-form-group>
        </b-form>
    </b-modal>
</template>

<script>
	export default {
        data() {
            return {
                newSession: {
                    id: -1,
                    title: "",
                    course: "",
                    questions: []
                },
                courseOptions: [],
                possibleQuestions: [],
                selectedQuestion: []
            }
        },
        props: {
            elementRef: String,
            elementId: String,
            okHandler: Function
        },
        methods: {
            show() {
                this.newSession.course = this.$store.getters.getSelectedCourse;
                let c = this.$store.getters.getSelectedCourse.split(" ");
                this.$socket.emit("getQuestionsInCourse", {code: c[0], semester: c[1]});
            },
            callOkHandler: function() {
                this.okHandler(this.newSession);
            },
            selectedQuestionChanged: function(event) {
                for (let i = 0; i < event.length; i++){
                    let selectedQuestionText = "";
                    let index = this.possibleQuestions.findIndex(pq => pq.value === event[i]);
                    selectedQuestionText = this.possibleQuestions[index].text;

                    this.newSession.questions.push({
                        id: event[i],
                        text: selectedQuestionText
                    });
                }
            }
        },
        computed: {
            getLocale() {
				let locale = this.$store.getters.getLocale("AdminSessions");
                if(locale) return locale;
			    else return {};
            },
            getCourseOptions: function() {
                return this.$store.getters.getCourseOptions;
            },
            getPossibleQuestions: function() {
                return this.possibleQuestions;
            },
            getCurrentQuestions: function() {
                return this.newSession.questions;
            }
        },
        sockets: {
            sendQuestionsInCourse: function(questions) {
                this.possibleQuestions = questions;
            }
        }
    }
</script>

<style scoped>
</style>