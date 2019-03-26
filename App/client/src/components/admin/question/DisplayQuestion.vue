<template>
    <b-container>
        <b-row>
            <b-col>
                <b-card no-body>
					<b-tabs card @input="setTab($event)">
						<b-tab :title="getLocale.question">
							<h1>{{ resultInfo.question.text }}</h1>
							<p>{{ resultInfo.question.description }}</p>
						</b-tab>
						<b-tab :title="getLocale.solution">
                            <div v-if="tabIndex === 1">
                                <TextSolution v-if="resultInfo.question.type === 1"
                                                :solution="resultInfo.solution"
                                                />
                                <MultipleChoiceSolution v-if="resultInfo.question.type === 2"
                                                        :solutions="resultInfo.solution"
                                                        :choices="resultInfo.question.object.multipleChoices"
                                                        />
                                <ShellsortSolution  v-if="resultInfo.question.type === 3"
                                                    :solution="resultInfo.solution"
                                                    />
                                <MergesortSolution  v-if="resultInfo.question.type === 4"
                                                    :solution="resultInfo.solution"
                                                    />
                                <QuicksortSolution  v-if="resultInfo.question.type === 5"
                                                    :solution="resultInfo.solution"
                                                    />
                                <TreeSolution       v-if="resultInfo.question.type === 6 || resultInfo.question.type === 7 || resultInfo.question.type === 8"
                                                    :solution="resultInfo.solution"
                                                    />
                                <DijkstraSolution v-if="resultInfo.question.type === 10"
                                                    :solution="resultInfo.solution"
                                                    />
                            </div>
						</b-tab>
						<b-tab :title="getLocale.answer" v-if="resultInfo.answerList.length > 0">
                            <div v-if="tabIndex === 2">
                                <TextAnswer v-if="resultInfo.question.type === 1"
                                            :answer="resultInfo.answerList[selectedAnswer].answerObject"
                                            />
                                <MultipleChoiceAnswer   v-if="resultInfo.question.type === 2" 
                                                        :answers="resultInfo.answerList[selectedAnswer].answerObject"
                                                        :choices="resultInfo.question.object.multipleChoices"
                                                        />
                                <ShellsortAnswer    v-if="resultInfo.question.type === 3"
                                                    :answer="resultInfo.answerList[selectedAnswer].answerObject"
                                                    />
                                <MergesortAnswer    v-if="resultInfo.question.type === 4"
                                                    :answer="resultInfo.solution"
                                                    />
                                <QuicksortAnswer    v-if="resultInfo.question.type === 5"
                                                    :answer="resultInfo.answerList[selectedAnswer].answerObject"
                                                    />
                                <DijkstraAnswer     v-if="resultInfo.question.type === 10"
                                                    :answer="resultInfo.answerList[selectedAnswer].answerObject"
                                                    />
                            </div>
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
import ShellsortAnswer from "./questionResultScreenAnswer/Shellsort.vue"
import ShellsortSolution from "./questionResultScreenSolution/Shellsort.vue";
import MergesortAnswer from "./questionResultScreenAnswer/Mergesort.vue";
import MergesortSolution from "./questionResultScreenSolution/Mergesort.vue"
import QuicksortAnswer from "./questionResultScreenAnswer/Quicksort.vue";
import QuicksortSolution from "./questionResultScreenSolution/Quicksort.vue"

import DijkstraAnswer from "./questionResultScreenAnswer/Dijkstra.vue";
import DijkstraSolution from "./questionResultScreenSolution/Dijkstra.vue";
import TreeSolution from "./questionResultScreenSolution/Tree.vue";

export default {
    name: "DisplayQuestion",
    props: {
        resultInfo: Object,
        selectedAnswer: Number
    },
    data() {
        return {
            selectedResult: Number,
            tabIndex: Number
        }
    },
    computed: {
		getLocale() {
			let locale = this.$store.getters.getLocale("DisplayQuestion");
			if (locale) return locale;
			else return {};
		},
    },
    methods: {
        setTab(event) {
            this.tabIndex = event;
        }
    },
    components: {
		TreeSolution,
        TextSolution,
        TextAnswer,
        TextSolution,
        MultipleChoiceAnswer,
        MultipleChoiceSolution,
        ShellsortAnswer,
        ShellsortSolution,
        MergesortAnswer,
        MergesortSolution,
        QuicksortAnswer,
        QuicksortSolution,
        DijkstraAnswer,
        DijkstraSolution
    }
}
</script>