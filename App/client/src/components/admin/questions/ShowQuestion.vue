<template>
    <b-modal :id="elementId" :ref="elementRef" :title="question.text" style="text-align: left;">
    <p>{{question.description}}</p>
    <p>{{getLocale.time}} {{getTime}}</p>
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
                    time: 0,
                    objects: {multipleChoices: []}
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
            },
            getTime() {
                let min = Math.floor(this.question.time / 60).toString();
                let sec = Math.floor(this.question.time % 60).toString();

                return `${min.padStart(2, "0")}:${sec.padStart(2, "0")}`;
            }
        }
    }

</script>

<style scoped>
</style>