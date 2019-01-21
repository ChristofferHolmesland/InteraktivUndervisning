<template>
    <b-modal id="editQuestionModal" no-close-on-backdrop="true" :title="getLocale.newQuestion" @ok="callOkHandler" style="text-align: left;">
        <b-form>
            <b-form-group 	id="questionTitle"
                            :label="getLocale.newQuestionTitle"
                            label-for="questionTitleInput">
                <b-form-input 	id="questionTitleInput"
                                type="text"
                                v-model="newQuestion.title">
                </b-form-input>
            </b-form-group>
            <b-form-group 	id="questionText"
                            :label="getLocale.newQuestionText"
                            label-for="questionTextInput">
                <b-form-input 	id="questionTextInput"
                                type="text"
                                v-model="newQuestion.text">
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
                    title: "",
					text: "", // TODO: Make it possible to include graphs and images in the text
					solutionType: "",
					solution: "",
                }
            }
        },
        props: {
            okHandler: Function
        },
        methods: {
            callOkHandler: function() {
                console.log(this.newQuestion);
                console.log(this.okHandler);
                this.okHandler(this.newQuestion);
            }
        },
        computed: {
            getLocale() {
				let locale = this.$store.getters.getLocale("AdminQuestions");
                if(locale) return locale;
			    else return {};
			}
        }
    }

</script>

<style scoped>
</style>