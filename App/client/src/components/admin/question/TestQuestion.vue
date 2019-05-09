<template>
<div>
    <b-modal    id="TestQuestion"
                ref="testQuestionInnerModal"
                :title="getLocale.modalTitle"
                title-tag="h3"
                style="text-align: left;"
                size="xl"
                :ok-title="getLocale.modalOkBtnText"
                ok-variant="success"
                :cancel-title="getLocale.modalCancelBtnText"
                cancel-variant="primary"
			    :hide-header-close="true"
				:no-close-on-backdrop="true"
                @ok="checkAnswer"
                >
        <b-container>
            <b-row  @click="changeShowSettings"
                    style="cursor: pointer;"
                    >
                <b-col cols="10">
                    <h5>{{ getLocale.settingsLabelText }}</h5>
                </b-col>
                <b-col cols="2" style="text-align: right;">
                    <p v-if="showSettings"><i class="fas fa-angle-up"></i></p>
                    <p v-else><i class="fas fa-angle-down"></i></p>
                </b-col>
            </b-row>
            <b-row v-if="showSettings">
                <b-col cols="12">
                    <b-container>
                        <b-row v-if="question.time > 0">
                            <b-col cols="3">
                                <label>
                                    {{ getLocale.settingsStartTimerLabelText }}
                                </label>
                            </b-col>
                            <b-col cols="3">
                                <b-container class="px-0">
                                    <b-row v-if="!timerStarted">
                                        <b-col cols="12">
                                            <b-button   variant="success"
                                                        @click="startTimer"
                                                        block
                                                        >
                                                {{ getLocale.settingsStartTimerBtnText }}
                                            </b-button>
                                        </b-col>
                                    </b-row>
                                    <b-row v-else align-h="around">
                                        <b-col cols="6">
                                            <b-button   :variant="timerPaused ? 'success' : 'warning'"
                                                        @click="timerPaused ? resumeTimer() : pauseTimer()"
                                                        block
                                                        >
                                                {{ 
                                                    timerPaused ?
                                                    getLocale.settingsResumeTimerBtnText :
                                                    getLocale.settingsPauseTimerBtnText
                                                }}
                                            </b-button>
                                        </b-col>
                                        <b-col cols=6>
                                            <b-button   variant="danger"
                                                        @click="resetTimer()"
                                                        block
                                                        >
                                                {{ getLocale.settingsResetTimerBtnText }}
                                            </b-button>
                                        </b-col>
                                    </b-row>
                                </b-container>                                
                            </b-col>
                        </b-row>
                    </b-container>
                </b-col>
            </b-row>
            <b-row  v-if="showResult"
                    class="mt-3"
                    >
                <b-col cols="12">
                    <b-alert    show
                                dismissible
                                :variant="result === 1 ? 'success' : 'danger'"
                                @dismissed="showResult = false"
                                >
                        {{ result === 1 ? getLocale.resultCorrect : getLocale.resultIncorrect }}
                    </b-alert>
                </b-col>
            </b-row>
            <b-row class="mt-3">
                <b-col>
                    <b-card no-body>
                        <b-tabs card v-model="mainTabIndex">
                            <b-tab  :title="getLocale.mainTabQuestion"
                                    title-item-class="w-50"
                                    >
                                <b-container class="px-0">
                                    <b-row>
                                        <b-col>
                                            <b-card no-body>
                                                <b-tabs card>
                                                    <b-tab  :title="getLocale.subTabQuestion">
                                                        <b-container class="px-0">
                                                            <b-row>
                                                                <b-col>
                                                                    <b-card :title="getQuestionInfo.text">
                                                                        <b-row>
                                                                            <b-col>
                                                                                <h4>{{getLocale.showQuestionType}} {{getQuestionTypeName}}</h4>
                                                                            </b-col>
                                                                        </b-row>
                                                                        <p v-for="(line, index) in getDescription" :key="index">
                                                                            {{ line }}
                                                                        </p>
                                                                        <b-container class="px-0" v-if="showMedia">
                                                                            <b-row>
                                                                                <b-col>
                                                                                    <b-card no-body>
                                                                                        <b-tabs card v-model="mediaTab">
                                                                                            <b-tab :title="getLocale.tabExtraInfo" :disabled="getExtraDesc.length > 0 ? false : true">
                                                                                                <div class="displayInline" v-for="(info,index) in getExtraDesc" :key="index">
                                                                                                    <pre v-if="info.code">{{info.value}}</pre>
                                                                                                    <p class="displayInline" v-else>{{info.value}}</p>
                                                                                                    <br v-if="info.linebreak"/>
                                                                                                </div>
                                                                                            </b-tab>
                                                                                            <b-tab :title="getLocale.tabImage" :disabled="getImagesLength > 0 ? false : true">
                                                                                                <b-container v-if="mediaTab === 1">
                                                                                                    <b-row>
                                                                                                        <b-col cols="12">
                                                                                                            <b-row>
                                                                                                                <b-col class="text-center">
                                                                                                                    <img    :src="getImgSrc"
                                                                                                                            style="border: 3px solid black; max-width:100%;"
                                                                                                                    />
                                                                                                                </b-col>
                                                                                                            </b-row>
                                                                                                            <b-row style="text-align: center;" v-if="getImagesLength > 1">
                                                                                                                <b-col cols="4">
                                                                                                                    <b-button variant="primary" @click="changeSelectedImage(-1)">{{ getLocale.previousBtn }}</b-button>
                                                                                                                </b-col>
                                                                                                                <b-col cols="4">
                                                                                                                    {{selectedImageIndex + 1}} / {{getImagesLength}}
                                                                                                                </b-col>
                                                                                                                <b-col cols="4">
                                                                                                                    <b-button variant="primary" @click="changeSelectedImage(1)">{{ getLocale.nextBtn }}</b-button>
                                                                                                                </b-col>
                                                                                                            </b-row>
                                                                                                        </b-col>
                                                                                                    </b-row>
                                                                                                </b-container>
                                                                                            </b-tab>
                                                                                            <b-tab :title="getLocale.tabTable" :disabled="getTablesLength > 0 ? false : true">
                                                                                                <b-container v-if="mediaTab === 2">
                                                                                                    <b-row>
                                                                                                        <b-col>
                                                                                                            <b-container class="viewTableContainer">
                                                                                                                <b-row v-for="(row, rowIndex) in getTableRow" :key="rowIndex" class="editTableRow">
                                                                                                                    <div v-for="(column, columnIndex) in getTableColumn" :key="columnIndex" class="editTableColumn">
                                                                                                                        <b-form-input :value="getTable[rowIndex][columnIndex]" maxlength="6" disabled></b-form-input>
                                                                                                                    </div>
                                                                                                                </b-row>
                                                                                                            </b-container>
                                                                                                        </b-col>
                                                                                                    </b-row>
                                                                                                    <b-row style="text-align: center;" v-if="getTablesLength > 1">
                                                                                                        <b-col cols="4">
                                                                                                            <b-button variant="primary" @click="changeSelectedTable(-1)">{{ getLocale.previousBtn }}</b-button>
                                                                                                        </b-col>
                                                                                                        <b-col cols="4">
                                                                                                            {{selectedTableIndex + 1}} / {{getTablesLength}}
                                                                                                        </b-col>
                                                                                                        <b-col cols="4">
                                                                                                            <b-button variant="primary" @click="changeSelectedTable(1)">{{ getLocale.nextBtn }}</b-button>
                                                                                                        </b-col>
                                                                                                    </b-row>
                                                                                                </b-container>
                                                                                            </b-tab>
                                                                                        </b-tabs>
                                                                                    </b-card>
                                                                                </b-col>
                                                                            </b-row>
                                                                        </b-container>
                                                                    </b-card>
                                                                </b-col>
                                                            </b-row>
                                                        </b-container>
                                                    </b-tab>
                                                    <b-tab  :title="getLocale.subTabAnswer">
                                                        <b-container>
                                                            <b-row>
                                                                <b-col>
                                                                    <TextInput :requestAnswer="requestAnswer"
                                                                            @getTextResponse="getTextValue"
                                                                            v-if="getQuestionType === 1"
                                                                            />
                                                                    <MultipleChoice :requestAnswer="requestAnswer"
                                                                                    @getTextResponse="getTextValue"
                                                                                    :choices="question.object.multipleChoices"
                                                                                    v-if="getQuestionType === 2"
                                                                                    />
                                                                                    <!--getQuestionInfo.object.choices-->
                                                                    <Shellsort v-if="getQuestionType === 3" 
                                                                                :requestAnswer="requestAnswer"
                                                                                @getTextResponse="getTextValue"
                                                                                :initialList="getStartArray(question.object.startingArray)"
                                                                                :initialKValue="question.object.kValue"
                                                                                />
                                                                    <Mergesort  v-if="getQuestionType === 4"
                                                                                :requestAnswer="requestAnswer"
                                                                                @getTextResponse="getTextValue"
                                                                                :steps="question.object.steps"
                                                                                />
                                                                    <Quicksort v-if="getQuestionType === 5"
                                                                        :requestAnswer="requestAnswer"
                                                                        @getTextResponse="getTextValue"
                                                                        :steps="question.object.steps"
                                                                        />
                                                                    <Tree v-if="getQuestionType === 6 || getQuestionType === 7 || getQuestionType === 8"
                                                                        :requestAnswer="requestAnswer"
                                                                        @getTextResponse="getTextValue"
                                                                        :steps="question.object.steps"
                                                                        />
                                                                    <!--:type = "questionInfo.object.type"-->
                                                                    <Dijkstra v-if="getQuestionType === 9"
                                                                        :requestAnswer="requestAnswer"
                                                                        @getTextResponse="getTextValue"
                                                                        :steps="question.object.steps"
                                                                        />
                                                                    <Python v-if="getQuestionType === 10"
                                                                        :requestAnswer="requestAnswer"
                                                                        @getTextResponse="getTextValue"
                                                                        :steps="question.object.steps"
                                                                        />
                                                                </b-col>
                                                            </b-row>
                                                        </b-container>
                                                    </b-tab>
                                                    <b-tab  :title="getTimeLeft"
                                                            disabled
                                                            >
                                                    </b-tab>
                                                </b-tabs>
                                            </b-card>
                                        </b-col>
                                    </b-row>
                                </b-container>
                            </b-tab>
                            <b-tab  :title="getLocale.mainTabSolution"
                                    title-item-class="w-50"
                                    >
                                <b-container class="px-0">
                                    <b-row>
                                        <b-col>
                                            <DisplayQuestion    :resultInfo="getResultInfo"
                                                                :selectedAnswer="0"
                                                                />
                                        </b-col>
                                    </b-row>
                                </b-container>
                            </b-tab>
                        </b-tabs>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
    </b-modal>
</div>   
</template>

<script>
import DisplayQuestion from "./DisplayQuestion.vue";

import TextInput from "../../client/session/questionTypes/TextInput.vue";
import MultipleChoice from "../../client/session/questionTypes/MultipleChoice.vue";
import Shellsort from "../../client/session/questionTypes/sorting/Shellsort.vue";
import Mergesort from "../../client/session/questionTypes/sorting/Mergesort.vue";
import Quicksort from "../../client/session/questionTypes/sorting/Quicksort.vue";
import Tree from "../../client/session/questionTypes/trees/Tree.vue";
import Dijkstra from "../../client/session/questionTypes/Dijkstra.vue";
import Python from "../../client/session/questionTypes/Python.vue";

function initializeState() {
	return {
        mainTabIndex: 0,
        mediaTab: 0,

        showSettings: true,

        timeLeft: 5,
        timer: undefined,
        timerPaused: false,
        timerStarted: false,

        selectedImageIndex: 0,
        selectedTableIndex: 0,

        requestAnswer: false,
        answerObject: undefined,

        result: 0,
        showResult: false
	};
}

export default {
    name: "TestQuestion",
    props: ["question"],
    data() {
        return initializeState();
    },
    mounted() {
        this.$root.$on("bv::modal::show", () => {
			this.assignState();
		});
    },
    methods: {
        changeShowSettings: function() {
            this.showSettings = !this.showSettings;
        },
        startTimer: function() {
            this.timerStarted = true;
            this.timeLeft = this.question.time;
            this.timer = setInterval(() => {
                this.timerStep();
            }, 1000);
        },
        timerOver: function() {
            this.timerStarted = false;
            this.checkAnswer();
        },
        pauseTimer: function() {
            clearInterval(this.timer);
            this.timerPaused = true;
        },
        resumeTimer: function() {
            this.timerPaused = false;
            this.timer = setInterval(() => {
                this.timerStep();
            }, 1000);
        },
        resetTimer: function() {
            this.timerStarted = false;
            this.timerPaused = false;
            clearInterval(this.timer);
            this.timeLeft = 0;
        },
        timerStep: function() {
            this.timeLeft--;
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.timerOver();
            }
        },
		changeSelectedImage: function(step) {
			if (
				this.selectedImageIndex + step >= 0 && 
				this.selectedImageIndex + step < this.getImagesLength
			) {
				this.selectedImageIndex += step;
			}
		},
		changeSelectedTable: function(step) {
			if (
				this.selectedTableIndex + step >= 0 &&
				this.selectedTableIndex + step < this.getTablesLength
			) {
				this.selectedTableIndex += step;
			}
        },		
        getTextValue: function(inputText) {
            this.answerObject = inputText;
			this.$socket.emit("checkTestQuestionAnswerRequest", {
                answerObject: inputText,
                solutionObject: this.question.solution,
                questionType: this.question.type
            });
        },
        checkAnswer: function(e) {
            if (e) e.preventDefault();
            this.requestAnswer = !this.requestAnswer;
        },
		assignState() {
			let n = initializeState();
			for (let p in n) {
				if (n.hasOwnProperty(p)) {
					if (p === "newQuestion") {
						if (this.okHandler === "add") {
							this.$data[p] = n[p];
						}
					} else {
						this.$data[p] = n[p];
					}
				}
            }
        }
    },
    computed: {
		getLocale: function() {
			let locale = this.$store.getters.getLocale("TestQuestion");
			if(locale) return locale;
			else return {};
        },
        getResultInfo: function() {
            let response = {   
                question: {
                    text: this.question.text,
                    description: this.question.description,
                    object: this.question.object,
                    type: this.question.type
                },
                solution: this.question.solution,
                answerList: []
            };
            if (this.answerObject !== undefined) response.answerList.push({answerObject: this.answerObject});
            return response;
        },
        getTimeLeft: function() {
            if (!this.timerStarted) return "";
			let min = Math.floor(this.timeLeft / 60).toString();
			let sec = Math.floor(this.timeLeft % 60).toString();

			return `${this.getLocale.timeLeftLabelText}: ${min.padStart(2, "0")}:${sec.padStart(2, "0")}`;
        },
        getQuestionInfo: function() {
            return this.question;
        },
        getExtraDesc: function() {
			let order = [];
			let extraDescLocales = this.question.object
				.questionTypeDesc.locale;
			let extraDescText = this.question.object
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
        getDescription: function() {
			return this.question.description.split("\n");
		},
		getQuestionType: function() {
			return this.question.type;
		},
		getQuestionTypeName: function() {
			//indexes are 0-9, but question types are 1-10 :(
			return this.$store.getters.getQuestionTypes[
			this.question.type - 1
				].name;
		},
        getImagesLength: function() {
            return this.question.object.files.length;
        },
        getTablesLength: function() {
            return this.question.object.tables.length;
        },
		showMedia: function() {
			if (
				this.getImagesLength > 0 ||
				this.getTablesLength > 0 ||
				this.getExtraDesc.length > 0
			){
				return true;
			}
			return false;
        },
		getImgSrc() {
			let file = this.question.object.files[
				this.selectedImageIndex
            ];
			return "data:" + file.type + ";base64," + file.buffer;
		},
		getTableRow: function() {
			return this.question.object.tables[this.selectedTableIndex].length;
		},
		getTableColumn: function() {
			return this.question.object.tables[this.selectedTableIndex][0].length;
		},
		getTable: function() {
			return this.question.object.tables[this.selectedTableIndex];
        },
		getStartArray() {
            return (array) => {
                let elements = array.split(",");
                let result = [];
                for (let i = 0; i < elements.length; i++) {
                    result.push(elements[i]);
                }
                return result;
            };
		}
    },
    sockets: {
        checkTestQuestionAnswerResponse: function(result) {
            this.result = result;
            this.showResult = true;
            this.mainTabIndex = 1;
        }
    },
    components: {
        DisplayQuestion,
		TextInput,
		MultipleChoice,
		Shellsort,
		Mergesort,
		Quicksort,
		Tree,
		Dijkstra,
		Python
    }
}
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
.editTableRow {
    flex-wrap: nowrap;
}
.editTableColumn {
	min-width: 90px;
	max-width: 90px;
	text-align: center;
	float: left;
	margin: 0;
}
.editTableColumn input {
	width: 80px;
	text-align: center;
	margin: 0;
	
}
.viewTableContainer {
	overflow-x: scroll;
	overflow-y: scroll;
	min-height: 200px;
	max-height: 200px;
	text-align: center;
	border: 1px solid black;
	border-right-width: 2px;
}
</style>
