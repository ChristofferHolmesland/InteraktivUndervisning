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
                                            v-model="timeInput">
                            </b-form-input>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                            <b-form-input   id="questionTimeInputSlider"
                                            type="range"
                                            v-model="newQuestion.time"
                                            min="0"
                                            max="600">
                            </b-form-input>
                        </b-col>
                    </b-row>
                </b-col>
            </b-form-group>
            <!-- TODO Make it possible to add graph objects to question
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
        </b-form>
    </b-modal>
</template>

<script>
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
                    objects: {multipleChoices: []}
                },
                solutionTypes: []
            }
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
            callOkHandler: function() {
                this.okHandler(this.newQuestion);
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
                    this.newQuestion.time = Number(time[0]) * 60 + Number(time[1]);
                }
            }
        },
        sockets: {
            sendQuestionTypes: function(types) {
                this.solutionTypes = types;
            }
        },
        watch: {
            newQuestion: {
                solution: function() {
                    if (this.newQuestion.solutionType === 1) this.newQuestion.solution = "";
                    else if (this.newQuestion.solutionType === 2) this.newQuestion.solution = [];
                }
            }
        },
    }

</script>

<style scoped>
</style>