<template>
	<div id="textquestion">
		<b-container>
			<b-row>
				<b-col>
					<b-tabs>
						<b-tab :title="getLocale.question">
							<b-card :title="getQuestionInfo.text" >
								<b-row>
									<b-col>
										<h4>{{getLocale.showQuestionType}} {{getQuestionTypeName}}</h4>
									</b-col>
								</b-row>
								<p v-if="getQuestionInfo.description !== undefined">
									{{ getQuestionInfo.description }}
								</p>
								<div class="displayInline" v-for="(info,index) in getExtraDesc" :key="index">
									<pre v-if="info.code">{{info.value}}</pre>
									<p class="displayInline" v-else>{{info.value}}</p>
									<br v-if="info.linebreak"/>
								</div>
								<b-container class="px-0">
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
							</b-card>
						</b-tab>
						<b-tab :title="getLocale.answer" active>
							<TextInput :requestAnswer="requestAnswer"
									@getTextResponse="getTextValue"
									v-if="getQuestionType === 1"
									/>
							<MultipleChoice :requestAnswer="requestAnswer"
											@getTextResponse="getTextValue"
											:choices="questionInfo.object.multipleChoices"
											v-if="getQuestionType === 2"
											/>
											<!--getQuestionInfo.object.choices-->
							<Shellsort v-if="getQuestionType === 3" 
										:requestAnswer="requestAnswer"
										@getTextResponse="getTextValue"
										:initialList="getStartArray(questionInfo.object.startingArray)"
										:initialKValue="questionInfo.object.kValue"
										/>
							<Mergesort  v-if="getQuestionType === 4"
										:requestAnswer="requestAnswer"
										@getTextResponse="getTextValue"
										:steps="questionInfo.object.steps"
										/>
							<Quicksort v-if="getQuestionType === 5"
								:requestAnswer="requestAnswer"
								@getTextResponse="getTextValue"
								:steps="questionInfo.object.steps"
								/>
							<Tree v-if="getQuestionType === 6 || getQuestionType === 7 || getQuestionType === 8"
								:requestAnswer="requestAnswer"
								@getTextResponse="getTextValue"
								:steps="questionInfo.object.steps"
								/>
							<!--:type = "questionInfo.object.type"-->
							<Dijkstra v-if="getQuestionType === 9"
								:requestAnswer="requestAnswer"
								@getTextResponse="getTextValue"
								:steps="questionInfo.object.steps"
								/>
							<Python v-if="getQuestionType === 10"
								:requestAnswer="requestAnswer"
								@getTextResponse="getTextValue"
								:steps="questionInfo.object.steps"
								/>
						</b-tab>
						<b-tab :title="updateTimer" v-if="interval !== undefined" disabled></b-tab>
					</b-tabs>
				</b-col>
			</b-row>
			<b-row class="text-center">
				<b-col cols="12" lg="4" class="mt-3">
					<b-btn variant="danger" @click="exitSession">{{ getLocale.exitSessionBtnText }}</b-btn> <!-- TODO add click event to leave seasion mid question -->
				</b-col>
				<b-col cols="12" lg="4" class="mt-3">
					<b-btn variant="warning" @click="questionNotAnswered">{{ getLocale.answerDontKnowBtnText }}</b-btn>
				</b-col>
				<b-col cols="12" lg="4" class="mt-3">
					<b-btn variant="success" @click="questionAnswered">{{ getLocale.answerBtnText }}</b-btn>
				</b-col>
			</b-row>
		</b-container>
	</div>
</template>

<script>
import TextInput from "./questionTypes/TextInput.vue";
import MultipleChoice from "./questionTypes/MultipleChoice.vue";
import Shellsort from "./questionTypes/sorting/Shellsort.vue";
import Mergesort from "./questionTypes/sorting/Mergesort.vue";
import Quicksort from "./questionTypes/sorting/Quicksort.vue";
import Tree from "./questionTypes/trees/Tree.vue";
import Dijkstra from "./questionTypes/Dijkstra.vue";
import Python from "./questionTypes/Python.vue";

export default {
	name: "Question",
	data() {
		return {
			interval: undefined,
			requestAnswer: false,
			timeLeft: undefined,
			selectedImageIndex: 0
		};
	},
	props: ["questionInfo", "sessionCode"],
	created() {
		let timeLeft = this.questionInfo.time;
		if (timeLeft !== -1) {
			this.timeLeft = timeLeft;
			this.interval = setInterval(() => {
				if (this.timeLeft === 0) {
					this.questionNotAnswered();
					clearInterval(this.interval);
				} else this.timeLeft--;
			}, 1000);
		}
	},
	beforeDestroy() {
		if (this.interval !== undefined) {
			clearInterval(this.interval);
		}
	},
	methods: {
		questionAnswered() {
			this.requestAnswer = !this.requestAnswer;
		},
		questionNotAnswered() {
			this.$socket.emit("questionAnswered", undefined, this.sessionCode);
		},
		//This is the function that sends the answerobject to the server
		getTextValue(inputText) {
			this.$socket.emit("questionAnswered", inputText, this.sessionCode);
		},
		exitSession() {
			if (confirm(this.getLeaveConfirmBody())) {
				this.$router.push("/client");
			}	
		},
		getStartArray(array) {
			let elements = array.split(",");
			let result = [];
			for (let i = 0; i < elements.length; i++) {
				result.push(elements[i]);
			}
			return result;
		},
		changeSelectedImage(step) {
			if (
				this.selectedImageIndex + step >= 0 && 
				this.selectedImageIndex + step < this.getImagesLength
			) {
				this.selectedImageIndex += step;
			}
		},
		getLeaveConfirmBody() {
			let locale = this.$store.getters.getLocale("ClientSessionQuestion")
					.leaveSessionBody;
			if (locale) return locale;
			else return {};
		}
	},
	computed: {
		updateTimer() {
			let min = Math.floor(this.timeLeft / 60).toString();
			let sec = Math.floor(this.timeLeft % 60).toString();

			return `${min.padStart(2, "0")}:${sec.padStart(2, "0")}`;
		},
		getQuestionInfo() {
			return this.questionInfo;
		},
		getLocale() {
			let locale = this.$store.getters.getLocale("ClientSessionQuestion");
			if (locale) return locale;
			return {};
		},
		getQuestionType() {
			return this.questionInfo.type;
		},
		getQuestionTypeName() {
			//indexes are 0-9, but question types are 1-10 :(
			return this.$store.getters.getQuestionTypes[
			this.questionInfo.type - 1
				].name;
		},
		getImagesLength() {
			return this.getQuestionInfo.object.files.length;
		},
		getImgSrc() {
			let file = this.getQuestionInfo.object.files[
				this.selectedImageIndex
			];
			return "data:" + file.type + ";base64," + file.buffer;
		},
		getExtraDesc() {
			let order = [];
			let extraDescLocales = this.questionInfo.object
				.questionTypeDesc.locale;
			let extraDescText = this.questionInfo.object
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
	sockets: {
		adminForceNext() {
			this.questionNotAnswered();
		}
	},
	components: {
		TextInput,
		MultipleChoice,
		Shellsort,
		Mergesort,
		Quicksort,
		Tree,
		Dijkstra,
		Python
	}
};
</script>
<style scoped>
	pre {
		border-style: solid;
		border-width: 1px;
		padding: 3px;
	}
	.displayInline {
		display: inline;
	}
</style>
