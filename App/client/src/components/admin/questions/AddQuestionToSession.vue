<template>
    <b-modal @shown="onShown" @ok="okHandler" :id="elementId" :ref="elementRef" :title="question.text" style="text-align: left;">
        <b-form-group 	id="session"
                    :label="getLocale.selectSessionText"
                    label-for="sessionInput">
        <b-form-select 	id="sessionInput"
                        :options="getSessionOptions"
                        v-model="selectedSession">
        </b-form-select>
        </b-form-group>
    </b-modal>
</template>

<script>
	export default {
        data() {
            return {
                question: {
                    id: -1,
                    text: "",
                },
                selectedSession: -1,
                sessionOptions: []
            }
        },
        props: {
            elementRef: String,
            elementId: String,
        },
        computed: {
            getLocale() {
				let locale = this.$store.getters.getLocale("AdminQuestions");
                if(locale) return locale;
			    else return {};
            },
            getSessionOptions() {
                return this.sessionOptions;
            }
        },
        methods: {
            onShown: function() {
                // TODO: Change "DAT200" to depend on the current course
                this.$socket.emit("getQuizWithinCourse", {code: "DAT200", semester:"18H"});
            },
            okHandler: function() {
                this.$socket.emit("addQuestionToQuiz", {
                    questionId: this.question.id,
                    quizId: this.selectedSession
                })
            }
        },
        sockets: {
            sendQuizWithinCourse: function(quizes) {
                this.sessionOptions = quizes; 
            }
        }
    }

</script>

<style scoped>
</style>