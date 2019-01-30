<template>
    <b-modal :id="elementId" :ref="elementRef" :title="question.text" style="text-align: left;">
    <p>{{question.description}}</p>
    <p>{{getLocale.solutionText}}</p>
    <p>{{question.solution}}</p>
    </b-modal>
</template>

<script>
	export default {
        data() {
            return {
                question: {
                    id: -1,
                    text: "",
                    description: "", 
                	solutionType: "",
					solution: "",
                }
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
            }
        }
    }

</script>

<style scoped>
</style>