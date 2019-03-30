<template>
    <b-modal :id="elementId" :ref="elementRef" :no-close-on-backdrop="true" :title="getLocale.newQuestion" @ok="callOkHandler" @cancel="cancelHandler" style="text-align: left;" size="lg">
        <b-form>
            <b-alert    :show="validationFailure"
                        variant="danger">
                <p v-for="(error, index) in validationErrors" :key="index">
                    {{getLocale[error]}}
                </p>
            </b-alert>
            <b-container   class="px-0"
                            @click="changeShowBasicInfo"
                            style="cursor: pointer;">
                <b-row>
                    <b-col cols="10" style="text-align: left;">
                        <label  for="mediaSelector"
                                style="cursor: pointer;">
                            {{getLocale.basicInfo}}
                        </label>
                    </b-col>
                    <b-col cols="2" style="text-align: right;">
                        <p v-if="showBasicInfo">^</p>
                        <p v-else>V</p>
                    </b-col>
                </b-row>
            </b-container>
            <div v-show="showBasicInfo">
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
                                                v-model="time"
                                                min="0"
                                                max="600"
                                                step="15">
                                </b-form-input>
                            </b-col>
                        </b-row>
                    </b-col>
                </b-form-group>
            </div>
            <hr>



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

            <b-form-group   id="Media">
                <b-container   class="px-0"
                                @click="changeShowMedia"
                                style="cursor: pointer;">
                    <b-row>
                        <b-col cols="10" style="text-align: left;">
                            <label  for="mediaSelector"
                                    style="cursor: pointer;">
                                Media
                            </label>
                        </b-col>
                        <b-col cols="2" style="text-align: right;">
                            <p v-if="showMedia">^</p>
                            <p v-else>V</p>
                        </b-col>
                    </b-row>
                </b-container>
                <div v-show="showMedia">
                    <b-form-select  :options="mediaTypes"
                                    v-model="selectedMediaType">
                    </b-form-select>
                    <div v-if="selectedMediaType === 0">
                        <b-alert :show="showMediaWarning" variant="warning">{{mediaWarningText}}</b-alert>
                        <b-alert :show="showMediaError" variant="danger">{{mediaErrorText}}</b-alert>
                        <input type="file" @change="newFile" accept="image/*" multiple>
                    </div>
                    <div v-if="selectedMediaType === 1">
                        <!-- TODO add graph objects -->
                    </div>
                    <div v-if="selectedMediaType === 2">
                        <!-- TODO add table objects -->
                    </div>
                    <div v-if="newQuestion.objects.files.length > 0">
                        <!--<img v-attr="src: newQuestion.objects.files[0]">-->
                    </div>
                    <div></div>
                    <div></div>
                </div>
            </b-form-group>

            <hr>
            
            <b-form-group 	id="solutionType">
                <b-container   class="px-0"
                                @click="changeShowSolution"
                                style="cursor: pointer;">
                    <b-row>
                        <b-col cols="10" style="text-align: left;">
                            <label  for="solutionTypeInput"
                                    style="cursor: pointer;">
                                {{getLocale.newQuestionSolutionType}}
                            </label>
                        </b-col>
                        <b-col cols="2" style="text-align: right;">
                            <p v-if="showSolution">^</p>
                            <p v-else>V</p>
                        </b-col>
                    </b-row>
                </b-container>
                <div v-show="showSolution">
                    <b-form-select 	id="solutionTypeInput"
                                    :options="getSolutionTypes"
                                    v-model="newQuestion.solutionType">
                    </b-form-select>
                </div>
            </b-form-group>
            <div v-show="showSolution">
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
                                <label>{{getLocale.multipleChoiceHeader}}</label>
                            </b-col>
                            <b-col cols="6" class="px-0">
                                <b-button @click="addNewMultipleChoice" id="addNewMultipleChoice" class="float-right">
                                    {{getLocale.addNewMultipleChoice}}
                                </b-button>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="12" class="px-0 mt-2">
                                <b-form-checkbox-group v-model="newQuestion.solution">
                                    <b-row  v-for="(choice, index) in newQuestion.objects.multipleChoices"
                                            :key="index"
                                            class="mb-2">
                                        <b-col cols="9">
                                            <b-form-input   :id="index.toString()"
                                                            v-model="newQuestion.objects.multipleChoices[index]"
                                                            >          
                                            </b-form-input>
                                        </b-col>
                                        <b-col cols="1">
                                            <b-form-checkbox :value="index.toString()"/>
                                        </b-col>
                                        <b-col cols="2">
                                            <b-button @click="deleteMultiChoice(index)">{{getLocale.multipleChoiceDeleteBtn}}</b-button>
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
                    id="BinaryTree"
                    label="List the nodes that are going to be used in the binary tree. Elements are divided by , and [] are not required)"
                    v-if="newQuestion.solutionType === 6"
                    >
                <b-form-input   id="nodeElements"
                                type="text"
                                v-model="newQuestion.objects.treeElements"
                                >
                </b-form-input>
            </b-form-group>
            <b-form-group
                    id="BinarySearchTrees"
                    label="Draw the tree, or give an array to build the solution tree"
                    v-if="newQuestion.solutionType === 7 || newQuestion.solutionType === 8"
                    >
                <label for="Add">Add</label><input type="radio" id="Add" v-model="newQuestion.objects.solutionTreeType" value="Add" /><br/>
                <label for="Remove">Remove</label><input type="radio" id="Remove" v-model="newQuestion.objects.solutionTreeType" value="Remove"/>
                <label v-if="newQuestion.objects.solutionTreeType === 'Add'" for="solutionListElements">Input elements to be added to the tree. The elements are seperated by ,</label>
                <label v-else-if="newQuestion.objects.solutionTreeType === 'Remove'" for="solutionListElements">Input elements to be removed from the tree. The elements are seperated by ,</label>
                <b-form-input 	id="solutionListElements"
                                 type="text"
                                 v-model="newQuestion.objects.treeElements">
                </b-form-input>
                <GraphDrawer
                    @getValueResponse="gotTreeDrawerObject"
                    :requestAnswer="requestGraphDrawerObject"
                    control-type="Graph0"
                    export-type="Both"
                    operationMode="Interactive"
                    import-type="Graph"
                    :steps="this.newQuestion.objects._graphdrawerGraph"
                />
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
            </div>
        </b-form>
    </b-modal>
</template>

<script>
    import GraphDrawer from "../../graphDrawer/GraphDrawer.vue";

    function initializeState() {
        return {
            newQuestion: {
                id: -1,
                text: "",
                description: "", 
                solutionType: "",
                solution: "",
                time: 0,
                objects: {
                    multipleChoices: [],
                    startingArray: "",
                    startTree: undefined,
                    treeElements: "",
                    solutionTreeType: "Add",
                    kValue: "",
                    graph: undefined,
                    files: [],
                    graphs: [],
                    tables: [],
                    _graphdrawerGraph: undefined
                }
            },
            solutionTypes: [],
            requestGraphDrawerObject: false,
            mediaTypes: [],
            selectedMediaType: undefined,

            showMedia: true, // TODO set to false
            showSolution: false,
            showBasicInfo: false, // TODO set to true

            mediaWarningText: "",
            showMediaWarning: false,
            mediaErrorText: "",
            showMediaError: false,
            validationFailure: false,
            validationErrors: [],
            time: 0
        }
    }

	export default {
        data() {
            return initializeState();
        },
        components: {
            GraphDrawer
        },
        props: {
            elementRef: String,
            elementId: String,
            okHandler: String,
            doneHandler: Function
        },
        mounted() {
            this.$root.$on("bv::modal::show", (bvevent, modalid) => {
                this.assignState();
                this.$socket.emit("getQuestionTypes");
                this.mediaTypes = this.getLocale.mediaTypes;
                this.selectedMediaType = this.mediaTypes[0].value;
            });
        },
        methods: {
            assignState() {
                let n = initializeState();
                for (let p in n) {
                    if (n.hasOwnProperty(p)) {
                        if (p === "newQuestion") {
                            if (this.okHandler === "add") this.$data[p] = n[p];
                        }
                        else this.$data[p] = n[p];
                    }
                }
            },
            newFile(event) {
                let files = [];
                Array.prototype.push.apply(files, event.target.files);
                let storedFiles = this.newQuestion.objects.files;

                let totalFilesSize = 0;
                let errorFileSize = 1500000;
                let warningFileSize = 500000;
                for(let i = 0; i < storedFiles.length; i++) totalFilesSize += storedFiles[i].size;
                let fileTypeErr = 0;

                for (let i = 0; i < files.length; i++) {
                    let file = files[i];
                    let fileObject = {
                        name: file.name,
                        size: file.size,
                        type: file.type
                    }
                    
                    let fileType = file.type.split("/");
                    if (fileType[0] !== "image") {
                        files.splice(i, 1);
                        i--;
                        fileTypeErr++;
                        this.showMediaError = true;
                        this.mediaErrorText = fileTypeErr.toString() + this.getLocale.mediaErrorFileType;
                        continue;
                    }

                    totalFilesSize += file.size;
                    if (totalFilesSize > errorFileSize) {
                        event.target.value = "";
                        this.showMediaError = true;
                        if (fileTypeErr > 0) this.mediaErrorText += "\n\n" + this.getLocale.mediaErrorFileSize;
                        else this.mediaErrorText = this.getLocale.mediaErrorFileSize;
                    }
                    else if (totalFilesSize > warningFileSize) {
                        this.showMediaWarning = true;
                        this.mediaWarningText = this.getLocale.mediaWarningFileSize;
                    }
                    else {
                        if (fileTypeErr === 0) {      
                            this.showMediaError = false;
                        }
                        this.showMediaWarning = false;
                    }

                    if (fileTypeErr === 0 && totalFilesSize < errorFileSize) {
                        let callbackFunction = function(e) {
                            fileObject.buffer = e.target.result;
                            storedFiles.push(fileObject);
                        }

                        let reader = new FileReader();
                        reader.onload = callbackFunction;
                        reader.readAsBinaryString(file);
                    }
                }

                event.target.value = "";
            },
            changeShowMedia() {
                this.showMedia = !this.showMedia;
            },
            changeShowSolution() {
                this.showSolution = !this.showSolution;
            },
            changeShowBasicInfo() {
                this.showBasicInfo = !this.showBasicInfo;
            },
            assignTime: function() {
                this.newQuestion.time = JSON.parse(JSON.stringify(this.time));
                if (this.newQuestion.time  === 0) this.newQuestion.time = -1;
            },
            addNewQuestionHandler: function() {
                this.$socket.emit(
                    "addNewQuestion", 
                    Object.assign(
                        {},
                        this.newQuestion,
                        {
                            courseCode: this.$store.getters.getSelectedCourse.split(" ")[0]
                        }
                    ),
                );
			},
			editQuestionHandler: function() {
                this.$socket.emit(
                    "updateQuestion",
                    this.newQuestion
                );
			},
            returnToOkHandler: function() {
                this.assignTime();
                if (this.okHandler == "add") this.addNewQuestionHandler();
                else if (this.okHandler == "edit") this.editQuestionHandler();
            },
            gotTreeDrawerObject(result) {
                this.newQuestion.objects.startTree = result.tree;
                this.newQuestion.objects._graphdrawerGraph = [Object.assign(
                    { type: "Complete" },
                    result.graph
                )];
                this.returnToOkHandler();
            },
            gotGraphDrawerObject(result) {
                this.newQuestion.objects.graph = result;
                this.newQuestion.objects._graphdrawerGraph = [Object.assign(
                    { type: "Complete" },
                    result
                )];
                this.returnToOkHandler();
            },
            callOkHandler: function(e) {
            	//if the component is using the Graph Drawer, Graph drawer is used on Binary Tree 7 up to BFS 13
                //Need a admin socket function for validating the question information given.
                e.preventDefault();
                if (this.newQuestion.solutionType > 6 && this.newQuestion.solutionType <= 13) {
                        this.requestGraphDrawerObject = !this.requestGraphDrawerObject;
                } else {
                    this.returnToOkHandler();
                }
            },
            cancelHandler: function() {
                this.useAlert = false;
                this.alertReason = "";
            },
            objectsInputChanged(newObject) {
                if (newObject == undefined) return;
                let i = this.newQuestion.objects.length;
                // TODO Make it possible to add graph object to question
                return
            },
            addNewMultipleChoice() {
                this.newQuestion.objects.multipleChoices.push("");
            },
            deleteMultiChoice(index) {
                let solutionIndex = this.newQuestion.solution.indexOf(index.toString());
                if (solutionIndex > -1) this.newQuestion.solution.splice(solutionIndex, 1);
                for (let i = index + 1; i < this.newQuestion.objects.multipleChoices.length; i++) {
                    let j = this.newQuestion.solution.indexOf(i.toString())
                    if (j > -1) {
                        this.newQuestion.solution[j] = (Number(this.newQuestion.solution[j]) - 1).toString();
                    }
                }

                this.newQuestion.objects.multipleChoices.splice(index, 1);
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
                    {
                        value: "table",
                        text: "Table"
                    },
                    {
                        value: "image",
                        text: "Image"
                    },
                    {
                    	value: "tree",
                        text: "Tree"
                    }
                ]
            },
            timeInput: {
                get: function() {
                    let min = Math.floor(this.time / 60).toString();
                    let sec = Math.floor(this.time % 60).toString();

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

                    this.time = h * 60 + s;
                }
            }
        },
        sockets: {
            sendQuestionTypes: function(types) {
                this.solutionTypes = types;
                this.newQuestion.solutionType = this.solutionTypes[0].value;
            },
            confirmQuestionRequirements: function (result) {
            	if (result.passed) {
                    this.$refs[this.elementRef].hide();
                    this.doneHandler();
                }else {
            	    this.validationFailure = true;
            	    this.validationErrors = result.errors;
                }

            }
	    },
        watch: {
            "newQuestion.solutionType": function() {
                if (this.solutionType === 1) this.newQuestion.solution = "";
                else if (this.solutionType === 2) this.newQuestion.solution = [];
            }
        },
    }

</script>

<style scoped>
</style>