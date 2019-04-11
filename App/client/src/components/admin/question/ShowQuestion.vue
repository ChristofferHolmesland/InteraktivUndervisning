<template>
    <b-modal    :id="elementId"
                :ref="elementRef"
                :title="question.text"
                title-tag="h3"
                style="text-align: left;"
                data-cy="showModal"
                size="lg"
                :ok-only="true"
                :ok-title="getLocale.closeBtn"
                >
        <b-container class="px-0">
            <b-row @click="changeShowBasicInfo">
                <b-col cols="11">
                    <h4>{{ getLocale.basicInfo }}</h4>
                </b-col>
                <b-col cols="1">
                    <p>{{ showBasicInfo ? '^' : 'V' }}</p>
                </b-col>
            </b-row>
            <b-row v-if="showBasicInfo">
                <b-col>
                    <h5>{{ getLocale.description }}</h5>
                    <p>{{ question.description }}</p>
                    <h5>{{ getLocale.time }}</h5>
                    <p>{{ getTime }}</p>
                </b-col>
            </b-row>
        </b-container>
        <b-container v-if="haveMedia" class="px-0">
            <b-row @click="changeShowMedia">
                <b-col cols="11">
                    <h4>Media:</h4>
                </b-col>
                <b-col cols="1">
                    <p>{{ showMedia ? '^' : 'V' }}</p>
                </b-col> 
            </b-row>
            <b-row v-if="question.objects.files.length > 0 && showMedia">
                <b-col>
                    <label>Files:</label>
                    <b-container>
                        <b-row v-for="(image, index) in question.objects.files" :key="index" class="mt-2">
                            <b-col>
                                <b-row>
                                    <b-col>
                                        {{getLocale.filename}}: {{image.name}}
                                    </b-col>
                                </b-row>
                                <b-row>
                                    <b-col>
                                        {{getLocale.filesize}}: {{Math.round(((image.size / 1000000) + 0.00001) * 100) / 100}} MB
                                    </b-col>
                                </b-row>
                                <b-row>
                                    <b-col>
                                        {{getLocale.filetype}}: {{image.type}}
                                    </b-col>
                                </b-row>
                            </b-col>
                            <b-col>
                                <img :src="getImageSrc(index)" width="200" height="200" style="border: 3px solid black;"/>
                            </b-col>
                        </b-row>
                    </b-container>
                </b-col>
            </b-row>
        </b-container>
        <b-container class="px-0">
            <b-row @click="changeShowSolution">
                <b-col cols="11">
                    <h4>{{ getLocale.solutionText }}</h4>
                </b-col>
                <b-col cols="1">
                    <p>{{ showSolution ? '^' : 'V' }}</p>
                </b-col> 
            </b-row>
            <b-row v-if="showSolution">
                <b-col>
                    <h6>{{ getLocale.showQuestionType }} {{ getLocale.questionType[questionTypes[question.solutionType - 1].text] }}</h6>
                    <p v-if="question.solutionType === 1">{{question.solution}}</p>
                    <b-container v-if="question.solutionType === 2">
                        <p v-for="(choice, index) in question.objects.multipleChoices" :key="index">
                            Choice {{ index }}: {{ choice }}
                        </p>
                    </b-container>
                    <ShellsortSolution  v-if="question.solutionType === 3"
                                        :solution="question.solution"
                                        />
                    <GraphDrawer    v-if="question.solutionType === 4"
                                    ref="graphdrawer"
                                    controlType="Sort"
                                    sortType="Mergesort"
                                    :steps="question.solution"
                                    operatingMode="Presentation"
                                    />
                    <GraphDrawer    v-if="question.solutionType === 5"
                                    ref="graphdrawer"
                                    controlType="Sort"
                                    sortType="Quicksort"
                                    :steps="question.solution"
                                    operatingMode="Presentation"
                                    />
                    <GraphDrawer    v-if="question.solutionType === 7 || question.solutionType === 8"
                                    ref="graphdrawer"
                                    controlType="Graph0"
                                    importType="Tree"
                                    operatingMode = "Presentation"
                                    :steps="question.solution"
                                    :displayEdgeValues = "false"
                                    />
                    <GraphDrawer    v-if="question.solutionType === 9"
                                    ref="graphdrawer"
                                    controlType="Dijkstra"
                                    operatingMode="Presentation"
                                    :steps="question.solution"
                                    :displayEdgeValues="true"
                                    />
                    <GraphDrawer    v-if="question.solutionType === 10"
                                    ref="graphdrawer"
                                    controlType="Python"
                                    operatingMode="Presentation"
                                    :steps="question.solution"
                                    />
                </b-col>
            </b-row>
        </b-container>
    </b-modal>
</template>

<script>
import GraphDrawer from "../../graphDrawer/GraphDrawer.vue";
import ShellsortSolution from "./questionResultScreenSolution/Shellsort.vue";

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
            },
            showBasicInfo: true,
            showMedia: false,
            showSolution: false,
            questionTypes: []
        }
    },
    props: {
        elementRef: String,
        elementId: String,
    },
    mounted() {
        this.$root.$on("bv::modal::hide", (bvevent) => {
            if (this.$refs.graphdrawer !== undefined)
                this.$refs.graphdrawer.destroyDrawer();
        });

        this.$root.$on("bv::modal::show", () => {
            if (this.$refs.graphdrawer !== undefined) {
                this.$nextTick(function() {
                    this.$refs.graphdrawer.createDrawer();
                });
            }
			this.$socket.emit("getQuestionTypes");
        });
    },
    sockets: {
		sendQuestionTypes: function(types) {
			this.questionTypes = types;
		}
    },
    computed: {
        getLocale: function() {
            let locale = this.$store.getters.getLocale("AdminQuestions");
            if(locale) return locale;
            else return {};
        },
        getTime: function() {
            let min = Math.floor(this.question.time / 60).toString();
            let sec = Math.floor(this.question.time % 60).toString();

            return `${min.padStart(2, "0")}:${sec.padStart(2, "0")}`;
        },
        haveMedia: function() {
            if (this.question.objects.files.length > 0) return true;
            // TODO add checks for graphs and table
        },
		getImageSrc: function() {
			return (index) => {
				let file = this.question.objects.files[index];
				return "data:" + file.type + ";base64," + file.buffer;
			};
		}
    },
    methods: {
        changeShowBasicInfo: function() {
            this.showBasicInfo = !this.showBasicInfo;
        },
        changeShowMedia: function() {
            this.showMedia = !this.showMedia;
        },
        changeShowSolution: function() {
            this.showSolution = !this.showSolution;
        }
    },
    components: {
        GraphDrawer,
        ShellsortSolution
    },
    watch: {
        "question.solutionType": function() {
            this.$nextTick(function() {
                // After changing the solutionType, the graphdrawer object needs to be
                // recreated.
                if(this.$refs.graphdrawer !== undefined)
                    this.$refs.graphdrawer.createDrawer();
            });
        }
    }
};
</script>

<style scoped>
</style>
