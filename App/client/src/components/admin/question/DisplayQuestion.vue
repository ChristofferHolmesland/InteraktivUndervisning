<template>
    <b-container>
        <b-row>
            <b-col>
                <b-card no-body>
					<b-tabs card>
						<b-tab :title="getLocale.question">
							<h1>{{ resultInfo.question.text }}</h1>
							<p>{{ resultInfo.question.description }}</p>
						</b-tab>
						<b-tab :title="getLocale.solution">
							<TextSolution v-if="resultInfo.question.type === 1"
											:solution="resultInfo.solution"/>
							<MultipleChoiceSolution v-if="resultInfo.question.type === 2"
													:solutions="resultInfo.solution"
													:choices="resultInfo.question.object.multipleChoices"
                                                    />
                            <QuicksortSolution  v-if="resultInfo.question.type === 5"
                                                :solution="resultInfo.solution"
                                                />
						</b-tab>
						<b-tab :title="getLocale.answer" v-if="resultInfo.answerList.length > 0">
							<TextAnswer v-if="resultInfo.question.type === 1"
											:answer="resultInfo.answerList[selectedAnswer].answerObject"/>
							<MultipleChoiceAnswer v-if="resultInfo.question.type === 2" 
											:answers="resultInfo.answerList[selectedAnswer].answerObject"
											:choices="resultInfo.question.object.multipleChoices"/>
                            <QuicksortAnswer    v-if="resultInfo.question.type === 5"
                                                :answer="resultInfo.answerList[selectedAnswer].answerObject"
                                                />
						</b-tab>
					</b-tabs>
				</b-card>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import MultipleChoiceAnswer from "./questionResultScreenAnswer/MultipleChoice.vue";
import MultipleChoiceSolution from "./questionResultScreenSolution/MultipleChoice.vue"
import TextAnswer from "./questionResultScreenAnswer/Text.vue";
import TextSolution from "./questionResultScreenSolution/Text.vue"
// Shellsort
// Shellsort
// Mergesort
// Mergesort
import QuicksortAnswer from "./questionResultScreenAnswer/Quicksort.vue";
import QuicksortSolution from "./questionResultScreenSolution/Quicksort.vue"

export default {
    name: "DisplayQuestion",
    props: {
        resultInfo: Object,
        selectedAnswer: Number
    },
    created() {
        console.log(this.resultInfo);
    },
    data() {
        return {
            selectedResult: Number
        }
    },
    computed: {
		getLocale() {
			let locale = this.$store.getters.getLocale("DisplayQuestion");
			if (locale) return locale;
			else return {};
		},
    },
    components: {
        TextSolution,
        TextAnswer,
        MultipleChoiceSolution,
        MultipleChoiceAnswer,
        QuicksortAnswer,
        QuicksortSolution
    }
}
</script>