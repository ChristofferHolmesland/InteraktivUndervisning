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
                let courseId = this.$store.getters.getSelectedCourse;
                this.$socket.emit("getSessionWithinCourse", courseId);
            },
            okHandler: function() {
                this.$socket.emit("addQuestionToSession", {
                    questionId: this.question.id,
                    sessionId: this.selectedSession
                })
            }
        },
        sockets: {
            sendSessionWithinCourse: function(sessions) {
                this.sessionOptions = sessions; 
            }
        }
    }

</script>

<style scoped>
</style>