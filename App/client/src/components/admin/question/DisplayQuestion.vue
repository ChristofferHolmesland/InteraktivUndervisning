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
										<h4>{{getLocale.showQuestionType}} {{getQuestionType}}</h4>
									</b-col>
								</b-row>
								<b-row>
									<b-col>
										<p 	v-for="(line, index) in getDescription"
											:key="index"
											>
											{{ line }}
										</p>
									</b-col>
								</b-row>
								<b-row>
									<b-col>
										<div class="displayInline" v-for="(info,index) in getExtraDesc" :key="index">
											<pre v-if="info.code">{{info.value}}</pre>
											<p class="displayInline" v-else>{{info.value}}</p>
											<br v-if="info.linebreak"/>
										</div>
									</b-col>
								</b-row>
								<b-row v-if="getImagesLength > 0">
									<b-col cols="12">
										<b-row>
											<b-col class="text-center">
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
								<TextSolution v-if="resultInfo.question.type === 1 && !reload"
											  :solution="resultInfo.solution"
								/>
								<MultipleChoiceSolution v-if="resultInfo.question.type === 2 && !reload"
														:solutions="resultInfo.solution"
														:choices="resultInfo.question.object.multipleChoices"
								/>
								<ShellsortSolution  v-if="resultInfo.question.type === 3 && !reload"
													:solution="resultInfo.solution"
								/>
								<MergesortSolution  v-if="resultInfo.question.type === 4 && !reload"
													:solution="resultInfo.solution"
													ref="graphdrawerContainer"
								/>
								<QuicksortSolution  v-if="resultInfo.question.type === 5 && !reload"
													:solution="resultInfo.solution"
													ref="graphdrawerContainer"
								/>
								<div v-if="resultInfo.question.type === 6 && !reload">
									{{getLocale.binaryTreeSolutionText}}
									{{resultInfo.solution.nodes}}
								</div>
								<TreeSolution       v-if="(resultInfo.question.type === 7 || resultInfo.question.type === 8) && !reload"
													:solution="resultInfo.solution"
													ref="graphdrawerContainer"
								/>
								<DijkstraSolution v-if="resultInfo.question.type === 9 && !reload"
												  :solution="resultInfo.solution"
												  ref="graphdrawerContainer"
								/>
								<PythonSolution v-if="resultInfo.question.type === 10 && !reload"
												:solution="resultInfo.solution"
												ref="graphdrawerContainer"
								/>
							</div>
						</b-tab>
						<b-tab :title="getLocale.answer" v-if="resultInfo.answerList.length > 0">
							<div v-if="tabIndex === 2">
								<div v-if="getResult > -1">
									<TextAnswer v-if="resultInfo.question.type === 1 && !reload"
												:answer="resultInfo.answerList[selectedAnswer].answerObject"
									/>
									<MultipleChoiceAnswer   v-if="resultInfo.question.type === 2 && !reload"
															:answers="resultInfo.answerList[selectedAnswer].answerObject"
															:choices="resultInfo.question.object.multipleChoices"
									/>
									<ShellsortAnswer    v-if="resultInfo.question.type === 3 && !reload"
														:answer="resultInfo.answerList[selectedAnswer].answerObject"
									/>
									<MergesortAnswer    v-if="resultInfo.question.type === 4 && !reload"
														:answer="resultInfo.solution"
														ref="graphdrawerContainer"
									/>
									<QuicksortAnswer    v-if="resultInfo.question.type === 5 && !reload"
														:answer="resultInfo.answerList[selectedAnswer].answerObject"
														ref="graphdrawerContainer"
									/>
									<TreeAnswer         v-if="(resultInfo.question.type >= 6 && resultInfo.question.type <= 8) && !reload"
														:answer="resultInfo.answerList[selectedAnswer].answerObject"
														ref="graphdrawerContainer"
									/>
									<DijkstraAnswer     v-if="resultInfo.question.type === 9 && !reload"
														:answer="resultInfo.answerList[selectedAnswer].answerObject"
														ref="graphdrawerContainer"
									/>
									<PythonAnswer       v-if="resultInfo.question.type === 10 && !reload"
														:answer="resultInfo.answerList[selectedAnswer].answerObject"
														ref="graphdrawerContainer"
									/>
								</div>
								<div v-else>
									<text-answer    :answer="didntAnswerString"/>
								</div>
							</div>
						</b-tab>
					</b-tabs>
					<b-button variant="success" @click="markAsCorrect" v-if="tabIndex === 2">{{ getLocale.markAsCorrectBtn }}</b-button>
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

import PythonAnswer from "./questionResultScreenAnswer/Python.vue";
import PythonSolution from "./questionResultScreenSolution/Python.vue";

export default {
	name: "DisplayQuestion",
	props: {
		resultInfo: Object,
		selectedAnswer: Number,
		admin: {
			default: false,
			type: Boolean
		}
	},
	data() {
		return {
			tabIndex: Number,
			didntAnswerString: "You answered: I don't know!",
			selectedImageIndex: 0,
			reload: false,
			linebreak: false
		};
	},
	computed: {
        getDescription: function() {
            return this.resultInfo.question.description.split("\n");
        },
		getLocale() {
			let locale = this.$store.getters.getLocale("DisplayQuestion");
			if (locale) return locale;
			else return {};
		},
		getResult() {
			let answer = this.resultInfo.answerList[this.selectedAnswer];
			if (answer.result !== undefined) return answer.result;
			return 1;
		},
		getImgSrc() {
			let file = this.resultInfo.question.object.files[
				this.selectedImageIndex
			];
			return "data:" + file.type + ";base64," + file.buffer;
		},
		getImagesLength() {
			return this.resultInfo.question.object.files.length;
		},
		getQuestionType() {
			//indexes are 0-9, but question types are 1-10 :(
			return this.$store.getters.getQuestionTypes[
				this.resultInfo.question.type - 1
			].name;
		},
		getExtraDesc() {
			let order = [];
			let extraDescLocales = this.resultInfo.question.object
				.questionTypeDesc.locale;
			let extraDescText = this.resultInfo.question.object
				.questionTypeDesc.text;
			for (let key in extraDescLocales) {
				if (extraDescLocales.hasOwnProperty(key)) {
					let loc = this.getLocale[extraDescLocales[key]];
					if (loc[loc.length - 1] !== " ")
						order.push({"value": loc, "linebreak": true, "code":false});
					else
						order.push({"value": loc, "linebreak": false, "code":false});
				}
			}
			for (let key in extraDescText) {
				if (extraDescText.hasOwnProperty(key)) {
					let text = extraDescText[key];
					let arr = text.split("\n");
					if (arr.length > 1)
						order.push({"value": text, "linebreak": true, "code":true});
				 	else
						order.push({"value": text, "linebreak": true, "code":false});
				}
			}
			return order;
		},
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
		},
		reloads: function() {
			this.$nextTick(() => {
				this.reload = true;
				this.$nextTick(() => {
					this.reload = false;
				});
			});
		},
		markAsCorrect: function() {
			if (this.admin) {
				this.$socket.emit(
					"markAsCorrectRequest", 
					this.resultInfo.answerList[this.selectedAnswer].id
				);
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
		DijkstraSolution,
		PythonAnswer,
		PythonSolution
	},
	watch: {
		selectedAnswer: function() {
			this.reloads();
		},
		resultInfo: function() {
			this.reloads();
			//this.$socket.emit("requestSolutionTypeName",newtype.question.solutionType);
		}
	}
};
</script>

<style scoped>
img {
	width: 100%;
	max-width: 500px;
	height: 100%;
	max-height: 500px;
}
pre {
	border-style: solid;
	border-width: 1px;
	padding: 3px;
}
.displayInline {
	display: inline;
}
</style>
