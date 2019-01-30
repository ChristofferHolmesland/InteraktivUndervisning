<template>
    <b-modal :id="elementId" :ref="elementRef" :no-close-on-backdrop="true" :title="getLocale.newQuestion" @ok="callOkHandler" style="text-align: left;">
        <b-form>
            <b-form-group 	id="questionTitle"
                            :label="getLocale.newQuestionTitle"
                            label-for="questionTitleInput">
                <b-form-input 	id="questionTitleInput"
                                type="text"
                                v-model="newQuestion.text">
                </b-form-input>
            </b-form-group>
            <b-form-group 	id="questionText"
                            :label="getLocale.newQuestionText"
                            label-for="questionTextInput">
                <b-form-input 	id="questionTextInput"
                                type="text"
                                v-model="newQuestion.description">
                </b-form-input>
            </b-form-group>
            <b-form-group 	id="solutionType"
                            :label="getLocale.newQuestionSolutionType"
                            label-for="solutionTypeInput">
                <b-form-select 	id="solutionTypeInput"
                                :options="getSolutionTypes"
                                v-model="newQuestion.solutionType">
                </b-form-select>
            </b-form-group>
            <b-form-group 	id="solution"
                            :label="getLocale.newQuestionSolution"
                            label-for="solutionInput">
                <b-form-input 	id="solutionInput"
                                type="text"
                                v-model="newQuestion.solution">
                </b-form-input>
            </b-form-group>
        </b-form>
    </b-modal>
</template>

<script>
	export default {
        data() {
            return {
                newQuestion: {
                    id: -1,
                    text: "",
                    description: "", 
              		solutionType: "",
					solution: "",
                },
                solutionTypes: []
            }
        },
        props: {
            elementRef: String,
            elementId: String,
            okHandler: Function
        },
        mounted() {
            this.$socket.emit("getQuestionTypes");
        },
        methods: {
            callOkHandler: function() {
                this.okHandler(this.newQuestion);
            }
        },
        computed: {
            getLocale() {
				let locale = this.$store.getters.getLocale("AdminQuestions");
                if(locale) return locale;
			    else return {};
            },
            getSolutionTypes: function() {
                return this.solutionTypes;
			}
        },
        sockets: {
            sendQuestionTypes: function(types) {
                this.solutionTypes = types;
            }
        }
    }

</script>

<style scoped>
</style>