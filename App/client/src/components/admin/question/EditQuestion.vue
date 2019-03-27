<template>
    <b-modal :id="elementId" :ref="elementRef" :no-close-on-backdrop="true" :title="getLocale.newQuestion" @ok="callOkHandler" style="text-align: left;">
        <b-form>
            <b-form-group 	id="questionTitle"
                            :label="getLocale.newQuestionTitle"
                            label-for="questionTitleInput">
                <b-form-input 	id="questionTitleInput"
                                type="text"
                                v-model="newQuestion.text">
                </b-form-input>
            </b-form-group>
            <b-form-group 	id="questionText"
                            :label="getLocale.newQuestionText"
                            label-for="questionTextInput">
                <b-form-input 	id="questionTextInput"
                                type="text"
                                v-model="newQuestion.description">
                </b-form-input>
            </b-form-group>
            <b-form-group id="questionTime">
                <b-col>
                    <b-row>
                        <b-col>
                            <label>{{ getLocale.newQuestionTime }}</label>
                        </b-col>
                        <b-col>
                            <b-form-input   id="questionTimeInput"
                                            type="time"
                                            v-model="timeInput"
                                            min="00:00"
                                            max="10:00">
                            </b-form-input>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                            <b-form-input   id="questionTimeInputSlider"
                                            type="range"
                                            v-model="newQuestion.time"
                                            min="0"
                                            max="600"
                                            step="15">
                            </b-form-input>
                        </b-col>
                    </b-row>
                </b-col>
            </b-form-group>
            <!-- TODO Make it possible to add objects to question
                            - Graphs
                            - Images
                            - Tables
            <b-form-group id="objects"
                label="Objects"
                label-for="objectsInput">
                <b-form-select id="objectsInput"
                    :options="getObjectTypes"
                    @change="objectsInputChanged($event)">
                </b-form-select>
                <ul>
                    <li :key="object.i" v-for="object in getQuestionObjects">
                        <component v-on:updateState="newQuestion[object.i].state = $event" :is="object.componentName" :index="i" :state="object.state" />
                    </li>
                </ul>
            </b-form-group> -->
            <b-form-group 	id="solutionType"
                            :label="getLocale.newQuestionSolutionType"
                            label-for="solutionTypeInput">
                <b-form-select 	id="solutionTypeInput"
                                :options="getSolutionTypes"
                                v-model="newQuestion.solutionType">
                </b-form-select>
            </b-form-group>
            <b-form-group 	id="textSolution"
                            :label="getLocale.newQuestionSolution"
                            label-for="solutionInput"
                            v-if="newQuestion.solutionType === 1">
                <b-form-input 	id="solutionInput"
                                type="text"
                                v-model="newQuestion.solution">
                </b-form-input>
            </b-form-group>
            <b-form-group   id="multipleChoiceChoices"
                            v-if="newQuestion.solutionType === 2">
                <b-col cols="12">
                    <b-row>
                        <b-col cols="6" class="px-0">
                            <label>Choices: {{getLocale.multipleChoiceHeader}}</label>
                        </b-col>
                        <b-col cols="6" class="px-0">
                            <b-button @click="addNewMultipleChoice" id="addNewMultipleChoice" class="float-right">
                                Add new choice{{ getLocale.addNewMultipleChoice }}
                            </b-button>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col cols="12" class="px-0 mt-2">
                            <b-form-checkbox-group v-model="newQuestion.solution">
                                <b-row  v-for="(choice, index) in newQuestion.objects.multipleChoices"
                                        :key="index"
                                        class="mb-2">
                                    <b-col cols="10">
                                        <b-form-input   :id="index.toString()"
                                                        v-model="newQuestion.objects.multipleChoices[index]"
                                                        >          
                                        </b-form-input>
                                    </b-col>
                                    <b-col cols="2">
                                        <b-form-checkbox :value="index.toString()"/>
                                    </b-col>
                                </b-row>
                            </b-form-checkbox-group>
                        </b-col>
                    </b-row>
                </b-col>
            </b-form-group>
            <b-form-group 	id="sortingSolution"
                            label="Starting array (elements seperated by ,)"
                            label-for="solutionInput"
                            v-if="newQuestion.solutionType < 6 && newQuestion.solutionType > 2">
                <b-form-input 	id="solutionInput"
                                type="text"
                                v-model="newQuestion.objects.startingArray">
                </b-form-input>
                <b-form-group   id="kValue"
                                label="K start value"
                                label-for="kValueInput"
                                v-if="newQuestion.solutionType === 3">
                    <b-form-input   id="kValueInput"
                                    type="text"
                                    v-model="newQuestion.objects.kValue">
                    </b-form-input>
                </b-form-group>
            </b-form-group>
            <b-form-group 	
                    id="dijkstraSolution"
                    label="Draw the graph, and mark start (green) and end (red) nodes"
                    v-if="newQuestion.solutionType === 10">
                <GraphDrawer 
                    @getValueResponse="gotGraphDrawerObject" 
                    :requestAnswer="requestGraphDrawerObject" 
                    controlType="Graph0"
                    subType="Dijkstra"
                    exportType="Graph"
                    operatingMode="Interactive"
                    />
            </b-form-group>
            <b-form-group 	id="pythonSolution"
                            :label="getLocale.newQuestionSolution"
                            label-for="solutionInput"
                            v-if="newQuestion.solutionType === 13">
                <div v-show="checkRef">klar</div>
                    <b-form-textarea 	id="pythonCodeInput"
                                        placeholder="Write Python code here..."
                                        v-model="newQuestion.objects.code"
                                        ref="codeInput"
                                        @keydown.native.tab="keyDownInTextarea">
                    </b-form-textarea>
            </b-form-group>
        </b-form>
    </b-modal>
</template>

<script>
    import GraphDrawer from "../../graphDrawer/GraphDrawer.vue";

	export default {
        data() {
            return {
                newQuestion: {
                    id: -1,
                    text: "",
                    description: "", 
              		solutionType: "",
                    solution: "",
                    time: 0,
                    objects: {
                        code: "",
                        multipleChoices: [],
                        startingArray: "",
                        kValue: "",
                        graph: undefined
                    }
                },
                solutionTypes: [],
                requestGraphDrawerObject: false
            }
        },
        components: {
            GraphDrawer
        },
        props: {
            elementRef: String,
            elementId: String,
            okHandler: Function
        },
        mounted() {
            this.$socket.emit("getQuestionTypes");
        },
        methods: {
            keyDownInTextarea(e) {
                // Only accept the Tab key
                if (e.key !== "Tab" && e.which !== "9") return;

                // Prevent shifting focus from the element
                e.preventDefault();

                let codeInput = this.$refs.codeInput;

                // Add 4 spaces
                let tabSize = 4;
                let tabPosition = codeInput.selectionStart;
                let textWithSpaces = codeInput.value.substring(0, tabPosition);
                for (let i = 0; i < tabSize; i++) textWithSpaces += " ";
                textWithSpaces += codeInput.value.substring(tabPosition);

                codeInput.value = textWithSpaces;
                // Move cursor to the right position
                codeInput.selectionStart = tabPosition + tabSize;
                codeInput.selectionEnd = tabPosition + tabSize;
            },
            returnToOkHandler: function() {
                if (this.newQuestion.solutionType == 13) {
                    this.newQuestion.solution = this.newQuestion.objects.code;
                }

                this.okHandler(this.newQuestion);
                
                this.newQuestion = {
                    id: -1,
                    text: "",
                    description: "", 
              		solutionType: "",
                    solution: "",
                    time: 0,
                    objects: {
                        multipleChoices: [],
                        startingArray: "",
                        graphs: undefined,
                        code: undefined
                    }
                };
            },
            gotGraphDrawerObject(result) {
                this.newQuestion.objects.graph = result;
                this.returnToOkHandler();
            },
            callOkHandler: function() {
                if (this.newQuestion.solutionType == 10) {
                    this.requestGraphDrawerObject = !this.requestGraphDrawerObject;
                } else {
                    this.returnToOkHandler();
                }
            },
            objectsInputChanged(newObject) {
                if (newObject == undefined) return;
                let i = this.newQuestion.objects.length;
                // TODO Make it possible to add graph object to question
                return
            },
            addNewMultipleChoice() {
                this.newQuestion.objects.multipleChoices.push("");
            }
        },
        computed: {
            checkRef() {
                if (this.$refs["codeInput"] !== undefined) {
                    this.$refs["codeInput"].onkeydown = this.keyDownInTextarea;
                    return true;
                }

                return false;
            },
            getLocale() {
				let locale = this.$store.getters.getLocale("AdminQuestions");
                if(locale) return locale;
			    else return {};
            },
            getSolutionTypes: function() {
                return this.solutionTypes;
            },
            getQuestionObjects: function() {
                return this.newQuestion.objects;
            },
            getObjectTypes: function() {
                return [
                    {
                        value: undefined,
                        text: "Add object"
                    },
                    {
                        value: "graph",
                        text: "Graph"
                    },
                    {
                        value: "table",
                        text: "Table"
                    },
                    {
                        value: "image",
                        text: "Image"
                    }
                ]
            },
            timeInput: {
                get: function() {
                    let min = Math.floor(this.newQuestion.time / 60).toString();
                    let sec = Math.floor(this.newQuestion.time % 60).toString();

                    return `${min.padStart(2, "0")}:${sec.padStart(2, "0")}`;
                },
                set: function(newTime) {
                    let time = newTime.split(":");

                    let h = Number(time[0]);
                    let s = Number(time[1]);

                    if (h > 10) {
                        h = 10;
                        s = 0;
                    } else if (h < 0) {
                        h = 0;
                        s = 0;
                    }

                    this.newQuestion.time = h * 60 + s;
                }
            }
        },
        sockets: {
            sendQuestionTypes: function(types) {
                this.solutionTypes = types;
            }
        },
        watch: {
            "newQuestion.solutionType": function(newType, oldType) {
                if (newType === 1) this.newQuestion.solution = "";
                else if (newType === 2) this.newQuestion.solution = [];
                else if (newType === 13) {

                }
            }
        },
    }
</script>

<style scoped>
</style>