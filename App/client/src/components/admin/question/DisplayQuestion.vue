<template>
    <b-container>
        <b-row>
            <b-col>
                <b-card no-body>
					<b-tabs card @input="setTab($event)">
						<b-tab :title="getLocale.question">
                            <b-container>
                                <b-row>
                                    <b-col>
							            <h1>{{ resultInfo.question.text }}</h1>
                                    </b-col>
                                </b-row>
                                <b-row>
                                    <b-col>
							            <p>{{ resultInfo.question.description }}</p>
                                    </b-col>
                                </b-row>
                                <b-row v-if="getImagesLength > 0">
                                    <b-col cols="12">
                                        <b-row>
                                            <b-col>   
                                                <img    :src="getImgSrc" width="500" height="500"
                                                        style="border: 3px solid black;"
                                                        />
                                            </b-col>
                                        </b-row>
                                        <b-row style="text-align: center;" v-if="getImagesLength > 1">
                                            <b-col cols="4">
                                                <b-button variant="primary" @click="changeSelectedImage(-1)">previous</b-button>
                                            </b-col>
                                            <b-col cols="4">
                                                {{selectedImageIndex + 1}} / {{getImagesLength}}
                                            </b-col>
                                            <b-col cols="4">                                            
                                                <b-button variant="primary" @click="changeSelectedImage(1)">next</b-button>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                </b-row>
                            </b-container>
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
                                <TreeSolution       v-if="resultInfo.question.type === 7 || resultInfo.question.type === 8"
                                                    :solution="resultInfo.solution"
                                                    />
                                <DijkstraSolution v-if="resultInfo.question.type === 9"
                                                    :solution="resultInfo.solution"
                                                    />
                            </div>
						</b-tab>
						<b-tab :title="getLocale.answer" v-if="resultInfo.answerList.length > 0">
                            <div v-if="tabIndex === 2">
                                <div v-if="getResult > -1">
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
                                    <TreeAnswer         v-if="resultInfo.question.type === 7 || resultInfo.question.type === 8"
                                                        :answer="resultInfo.answerList[selectedAnswer].answerObject"
                                                    />
                                    <DijkstraAnswer     v-if="resultInfo.question.type === 9"
                                                        :answer="resultInfo.answerList[selectedAnswer].answerObject"
                                                        />  
                                </div>
                                <div v-else>
                                    <text-answer    :answer="didntAnswerString"/>
                                </div>
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
import MultipleChoiceSolution from "./questionResultScreenSolution/MultipleChoice.vue";

import TextAnswer from "./questionResultScreenAnswer/Text.vue";
import TextSolution from "./questionResultScreenSolution/Text.vue";

import ShellsortAnswer from "./questionResultScreenAnswer/Shellsort.vue";
import ShellsortSolution from "./questionResultScreenSolution/Shellsort.vue";

import MergesortAnswer from "./questionResultScreenAnswer/Mergesort.vue";
import MergesortSolution from "./questionResultScreenSolution/Mergesort.vue";

import QuicksortAnswer from "./questionResultScreenAnswer/Quicksort.vue";
import QuicksortSolution from "./questionResultScreenSolution/Quicksort.vue";

import TreeAnswer from "./questionResultScreenAnswer/Tree.vue";
import TreeSolution from "./questionResultScreenSolution/Tree.vue";

import DijkstraAnswer from "./questionResultScreenAnswer/Dijkstra.vue";
import DijkstraSolution from "./questionResultScreenSolution/Dijkstra.vue";


export default {
    name: "DisplayQuestion",
    props: {
        resultInfo: Object,
        selectedAnswer: Number
    },
    data() {
        return {
            tabIndex: Number,
            didntAnswerString: "You answered: I don't know!",
            selectedImageIndex: 0
        }
    },
    computed: {
		getLocale() {
			let locale = this.$store.getters.getLocale("DisplayQuestion");
			if (locale) return locale;
			else return {};
        },
        getResult() {
            let answer = this.resultInfo.answerList[this.selectedAnswer];
            if(answer.result !== undefined) return answer.result;
            return 1
        },
        getImgSrc() {
            let file = this.resultInfo.question.object.files[this.selectedImageIndex];
            return "data:" + file.type + ";base64," + file.buffer;
        },
        getImagesLength() {
            return this.resultInfo.question.object.files.length;
        }
    },
    methods: {
        setTab(event) {
            this.tabIndex = event;
        },
        changeSelectedImage(step) {
            if (
                this.selectedImageIndex + step >= 0 && 
                this.selectedImageIndex + step < this.getImagesLength
                ) {
                    this.selectedImageIndex += step;
                }
        }
    },
    components: {
		TreeAnswer,
		TreeSolution,
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

<style scoped>
img{
    width: 100%;
    max-width: 500px;
    height: 100%;
    max-height: 500px;
}
</style>
