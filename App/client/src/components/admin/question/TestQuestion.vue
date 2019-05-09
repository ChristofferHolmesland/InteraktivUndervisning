<template>
<div>
    <b-modal    id="TestQuestion"
                ref="testQuestionInnerModal"
                :title="question.text"
                title-tag="h3"
                style="text-align: left;"
                size="xl"
                :ok-title="getLocale.modalOkBtnText"
                ok-variant="success"
                :cancel-title="getLocale.modalCancelBtnText"
                cancel-variant="primary"
			    :hide-header-close="true"
				:no-close-on-backdrop="true"
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
            <b-row class="mt-3">
                <b-col>
                    <b-card no-body>
                        <b-tabs card v-model="mainTabIndex">
                            <b-tab title="Test question">
                                <b-container class="px-0">
                                    <b-row>
                                        <b-col>
                                            <b-card no-body>
                                                <b-tabs card>
                                                    <b-tab title="Question">
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
                                                    <b-tab title="Answer">
                                                        <b-container>
                                                            <b-row>
                                                                <b-col>

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
                            <b-tab title="View solution">
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

export default {
    name: "TestQuestion",
    props: ["question"],
    data() {
        return {
            mainTabIndex: 0,
            mediaTab: 0,

            showSettings: true,
            showMedia: false,

            timeLeft: 0,
            timer: undefined,
            timerPaused: false,
            timerStarted: false,

        }
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
                answerList: [{answerObject: "filteredAnswerList"}]
            };
            return response;
        },
        getTimeLeft: function() {
            if (!this.timerStarted) return "";
			let min = Math.floor(this.timeLeft / 60).toString();
			let sec = Math.floor(this.timeLeft % 60).toString();

			return `${this.getLocale.timeLeftLabelText}: ${min.padStart(2, "0")}:${sec.padStart(2, "0")}`;
        },
        getQuestionInfo: function() {
            return {};
        },
        getExtraDesc: function() {

        }
    },
    watch: {
        
    },
    components: {
        DisplayQuestion
    }
}
</script>
