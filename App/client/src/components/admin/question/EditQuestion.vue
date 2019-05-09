<template>
    <!-- Check watchers when fixing bugs -->
	
	<b-modal 	:id="elementId"
				:ref="elementRef"
				:no-close-on-backdrop="true"
				:title="getTitle"
				@ok="callOkHandler"
				style="text-align: left;"
				size="lg"
				cancel-variant="danger"
				:hide-header-close="true"
				:cancel-title="getLocale.cancelBtn"
				:ok-title="getLocale.okBtn"
				>
        <b-form>
            <b-alert    :show="validationFailure"
                        variant="danger"
						dimissible
						@dismissed="validationFailure = false">
                <p v-for="(error, index) in validationErrors" :key="index">
                    {{getLocale[error]}}
                </p>
            </b-alert>
            <b-container   class="px-0"
                            @click="changeShowBasicInfo"
                            style="cursor: pointer;">
                <b-row>
                    <b-col cols="10" style="text-align: left;" data-cy="basicInformation">
                        <label  for="mediaSelector"
                                style="cursor: pointer;">
                            {{getLocale.basicInfo}}
                        </label>
                    </b-col>
                    <b-col cols="2" style="text-align: right;">
                        <p v-if="showBasicInfo"><i class="fas fa-angle-up"></i></p>
                        <p v-else><i class="fas fa-angle-down"></i></p>
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
					<b-form-textarea	id="questionTextInput"
										v-model="newQuestion.description"
										max-rows="10"
										>
					</b-form-textarea>
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
							<p v-if="showMedia"><i class="fas fa-angle-up"></i></p>
							<p v-else><i class="fas fa-angle-down"></i></p>
						</b-col>
					</b-row>
				</b-container>
				<b-container v-show="showMedia" class="px-0">
					<b-row>
						<b-col>
							<b-form-select  v-model="selectedMediaType"
											:options="mediaTypes"
											>
							</b-form-select>
						</b-col>
					</b-row>
					<b-row style="text-align: center;" class="mt-4">
						<b-col>
							<b-alert	:show="showMediaWarning"
										variant="warning"
										dismissible
										@dismissed="showMediaWarning = false"
										>
								{{mediaWarningText}}
							</b-alert>
							<b-alert	:show="showMediaError"
										variant="danger"
										dismissible
										@dismissed="showMediaError = false"
										>
								{{mediaErrorText}}
							</b-alert>
							<div v-if="selectedMediaType === 0">
								<input  type="file" @change="newFile" accept="image/*" 
										multiple name="imageInput" class="imageInput"
										id="imageInput"
										/>
								<label for="imageInput">{{getLocale.imageInputLabel}}</label>
							</div>
							<div v-if="selectedMediaType === 1">
								<!-- TODO add graph objects -->
							</div>
							<div v-if="selectedMediaType === 2">
								<b-container class="editTableContainer">
									<b-row v-for="(row, rowIndex) in editTableRows" :key="rowIndex" class="editTableRow">
										<div v-for="(column, columnIndex) in editTableColumns" :key="columnIndex" class="editTableColumn">
											<b-form-input v-model="editTableValues[row - 1][column - 1]" maxlength="6"></b-form-input>
										</div>
									</b-row>
								</b-container>
								<b-container>
									<b-row class="text-align-center mt-2" align-h="around">
										<b-col cols="5">
											<b-button block variant="success" @click="addTableRow">{{ getLocale.addEditTableRowBtn }}</b-button>
										</b-col>
										<b-col cols="5">
											<b-button block variant="success" @click="addTableColumn">{{ getLocale.addEditTableColumnBtn }}</b-button>
										</b-col>
									</b-row>
									<b-row class="text-align-center mt-2" align-h="around">
										<b-col cols="5">
											<b-button block variant="danger" @click="removeTableRow">{{ getLocale.removeEditTableRowBtn }}</b-button>
										</b-col>
										<b-col cols="5">
											<b-button block variant="danger" @click="removeTableColumn">{{ getLocale.removeEditTableColumnBtn }}</b-button>
										</b-col>
									</b-row>
									<b-row class="text-align-center mt-3" align-h="around">
										<b-col cols="9">
											<b-button block variant="primary" @click="addTable">{{ editExistingTable ? getLocale.addTableSaveBtn : getLocale.addTableBtn }}</b-button>
										</b-col>
									</b-row>
								</b-container>
							</div>
						</b-col>
					</b-row>
					<b-row v-if="newQuestion.objects.files.length > 0">
						<b-col>
							<label>{{ getLocale.filesLabel }}</label>
							<b-container>
								<b-row v-for="(image, index) in newQuestion.objects.files" :key="index" class="mt-2">
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
										<b-button @click="deleteImage(index)" variant="danger"
													style="width: 100px; height: 50px; text-align:center;">
											{{getLocale.deleteBtn}}
										</b-button>
									</b-col>
									<b-col>
										<img :src="getImageSrc(index)" width="200" height="200" style="border: 3px solid black;"/>
									</b-col>
								</b-row>
							</b-container>
						</b-col>
					</b-row>
					<b-row v-if="getQuestionObjects.tables.length > 0">
						<b-col>
							<label>{{ getLocale.tableLabel }}</label>
							<b-container	v-for="(table, index) in getQuestionObjects.tables"
											:key="index"
											class="mb-2 border py-2"
											>
								<b-row align-h="around">
									<b-col cols="8">
										<b-container>
											<b-row class="mb-2">
												<b-col>
													{{ `${ getLocale.tableViewTitle } ${ index + 1 }` }}
												</b-col>
											</b-row>
											<b-row>
												<b-col>
													<b-button variant="warning" v-b-toggle="'tableCollapse' + index">{{ getLocale.viewBtn }}</b-button>
												</b-col>
											</b-row>
										</b-container>
									</b-col>
									<b-col cols="4">
										<b-container>
											<b-row class="mb-2 text-center">
												<b-col align-self="center">
													<b-button variant="danger" @click="deleteTable(index)">{{ getLocale.deleteBtn }}</b-button>
												</b-col>
											</b-row>
											<b-row class="text-center">
												<b-col align-self="center">
													<b-button variant="primary" @click="editTable(index)">{{ getLocale.editBtn }}</b-button>
												</b-col>
											</b-row>
										</b-container>
									</b-col>
								</b-row>
								<b-row>
									<b-collapse :id="'tableCollapse' + index" class="tableCollapse">
										<b-container class="viewTableContainer">
											<b-row v-for="(row, rowIndex) in getTableRow(index)" :key="rowIndex" class="editTableRow">
												<div v-for="(column, columnIndex) in getTableColumn(index)" :key="columnIndex" class="editTableColumn">
													<b-form-input :value="getTable(index)[rowIndex][columnIndex]" maxlength="6" disabled></b-form-input>
												</div>
											</b-row>
										</b-container>
									</b-collapse>
								</b-row>
							</b-container>
						</b-col>
					</b-row>
				</b-container>
			</b-form-group>

            <hr>
            
            <b-form-group 	id="solutionType">
                <b-container   class="px-0"
                                @click="changeShowSolution"
                                style="cursor: pointer;">
                    <b-row>
                        <b-col cols="10" style="text-align: left;" data-cy="solutionType">
                            <label  for="solutionTypeInput"
                                    style="cursor: pointer;">
                                {{getLocale.newQuestionSolutionType}}
                            </label>
                        </b-col>
                        <b-col cols="2" style="text-align: right;">
                            <p v-if="showSolution"><i class="fas fa-angle-up"></i></p>
                            <p v-else><i class="fas fa-angle-down"></i></p>
                        </b-col>
                    </b-row>
                </b-container>
                <div v-show="showSolution">
                    <b-form-select 	id="solutionTypeInput"
                                    :options="getSolutionTypes"
                                    v-model="newQuestion.solutionType"
									@change="solutionTypeChanged"
									>
                    </b-form-select>
                </div>
            </b-form-group>
            <div v-show="showSolution">
                <b-form-group 	id="textSolution"
                                :label="getLocale.newQuestionSolution"
                                label-for="solutionInputText"
                                v-if="newQuestion.solutionType === 1">
                    <b-form-input 	id="solutionInputText"
                                    type="text"
                                    v-model="newQuestion.solution">
                    </b-form-input>
                </b-form-group>
                <b-form-group   id="multipleChoiceChoices"
                                v-if="newQuestion.solutionType === 2">
                    <b-col cols="12">
                        <b-row>
                            <b-col cols="8" class="px-0">
                                <label>{{getLocale.multipleChoiceHeader}}</label>
                            </b-col>
                            <b-col cols="4" class="px-0">
                                <b-button @click="addNewMultipleChoice" id="addNewMultipleChoice" class="float-right" variant="success" block>
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
                                            <b-button @click="deleteMultiChoice(index)" variant="danger" block>{{getLocale.multipleChoiceDeleteBtn}}</b-button>
                                        </b-col>
                                    </b-row>
                                </b-form-checkbox-group>
                            </b-col>
                        </b-row>
                    </b-col>
                </b-form-group>
                <b-form-group 	id="sortingSolution"
                                :label="getLocale.shellsortStartArray"
                                label-for="solutionInput"
                                v-if="newQuestion.solutionType < 6 && newQuestion.solutionType > 2">
                    <b-form-input 	id="solutionInput"
                                    type="text"
                                    v-model="newQuestion.objects.startingArray">
                    </b-form-input>
                    <b-form-group   id="kValue"
                                    :label="getLocale.shellsortStartKValue"
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
                    :label="getLocale.binaryTreeArray"
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
						:label="getLocale.bstInfo"
						v-if="newQuestion.solutionType === 7 || newQuestion.solutionType === 8"
						> 	
					<label for="Add">{{getLocale.okBtn}}</label><input type="radio" id="Add" v-model="newQuestion.objects.solutionTreeType" value="Add" /><br/>
					<label for="Remove">{{getLocale.removeText}}</label><input type="radio" id="Remove" v-model="newQuestion.objects.solutionTreeType" value="Remove"/>
					<label v-if="newQuestion.objects.solutionTreeType === 'Add'" for="solutionListElements">{{ getLocale.addLabel }}</label>
					<label v-else-if="newQuestion.objects.solutionTreeType === 'Remove'" for="solutionListElements">{{ getLocale.removeLabel }}</label>
					<b-form-input 	id="solutionListElements"
									type="text"
									v-model="newQuestion.objects.treeElements">
					</b-form-input>
					<GraphDrawer
						ref="graphdrawer"
						@getValueResponse="gotTreeDrawerObject"
						:requestAnswer="requestGraphDrawerObject"
						controlType="Graph0"
						exportType="Both"
						operatingMode="Interactive"
						importType="Graph"
						:steps="this.newQuestion.objects._graphdrawerGraph"
					/>
				</b-form-group>
				<b-form-group 	
						id="dijkstraSolution"
						:label="getLocale.dijkstraLabel"
						v-if="newQuestion.solutionType === 9">
					<GraphDrawer
						ref="graphdrawer"
						@getValueResponse="gotGraphDrawerObject" 
						:requestAnswer="requestGraphDrawerObject" 
						controlType="Graph0"
						importType="Graph"
						subType="Dijkstra"
						exportType="Graph"
						:displayEdgeValues="true"
						operatingMode="Interactive"
						:steps="this.newQuestion.objects._graphdrawerGraph"
						/>
				</b-form-group>
				<b-form-group 	id="pythonSolution"
								:label="getLocale.newQuestionSolution"
								label-for="solutionInput"
								v-if="newQuestion.solutionType === 10">
					<div v-show="checkRef">{{ getLocale.ready }}</div>
						<b-form-textarea 	id="pythonCodeInput"
											:placeholder="getLocale.pythonPlaceholder"
											v-model="newQuestion.objects.code"
											ref="codeInput"
											@keydown.native.tab="keyDownInTextarea">
						</b-form-textarea>
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
				code: "",
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
				_graphdrawerGraph: undefined,
                questionTypeDesc: {
					locale: Object,
                    text: Object
                }
			}
		},
		solutionTypes: [],
		requestGraphDrawerObject: false,
		mediaTypes: [],
		selectedMediaType: undefined,

		time: 0,

		showBasicInfo: true,
		showMedia: false,
		showSolution: false,

		editTableRows: 0,
		editTableColumns: 0,
		editTableValues: [],
		editExistingTable: false,
		editExistingTableIndex: 0,

		mediaWarningText: "",
		showMediaWarning: false,
		mediaErrorText: "",
		showMediaError: false,
		validationFailure: false,
		validationErrors: [],
	};
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
		question: Object,
		doneHandler: Function
	},
	mounted() {
		this.$root.$on("bv::modal::show", (bvevent) => {
			let target = bvevent.target;
			this.assignState();
			this.$socket.emit("getQuestionTypes");
			this.mediaTypes = this.getLocale.mediaTypes;
			this.selectedMediaType = this.mediaTypes[0].value;
			if (this.question !== undefined) this.newQuestion = this.question;

			if (this.$refs.graphdrawer !== undefined) {
				this.$nextTick(function() {
					this.$refs.graphdrawer.createDrawer();
				});
			}
		});
	},
	methods: {
		solutionTypeChanged: function() {
			// If the old type used a graphdrawer, it should be destroyed.
			if (this.$refs.graphdrawer !== undefined) {
				this.$refs.graphdrawer.destroyDrawer();
			}

			// Because Vue doesn't detect that the value has changed.
			// We first wait for the next tick, to be sure that the solutionType
			// value has changed.
			this.$nextTick(function() {
				let newSolutionType = this.newQuestion.solutionType;
				this.newQuestion.solutionType = -1;

				this.newQuestion.objects._graphdrawerGraph = undefined;
				if (newSolutionType === 1 || newSolutionType === 10)
					this.newQuestion.solution = "";
				else
					this.newQuestion.solution = [];

				// Render the modal with solutionType = -1 to clear any
				// components which are still on the page.
				this.$forceUpdate();

				// Wait for Vue to detect the changes
				this.$nextTick(function() {
					this.newQuestion.solutionType = newSolutionType;
					
					// Wait for the new page to render with the new values, and
					// create the GraphDrawer if it is needed.
					this.$nextTick(function() {
						this.$forceUpdate();
						if (this.$refs.graphdrawer !== undefined) {
							this.$refs.graphdrawer.destroyDrawer();
							this.$refs.graphdrawer.createDrawer();
						}
					});
				});
			});
		},
		keyDownInTextarea: function(e) {
			// Only accept the Tab key
			if (e.key !== "Tab" && e.which !== "9") return;

			// Prevent shifting focus from the element
			e.preventDefault();
			
			let codeInput = this.$refs.codeInput.$refs.input;

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
		deleteImage: function(index) {
			let files = this.newQuestion.objects.files;
			files.splice(index, 1);

			let filesSize = 0;
			for (let i = 0; i < files.length; i++) {
				let file = files[i];
				filesSize += file.size;
			}
			if (filesSize < 500000) this.showMediaWarning = false;
		},
		assignState: function() {
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

			// Transfer question time to time slider
			if (this.okHandler === "edit") {
				this.time = this.question.time;
			}
		},
		newFile: function(event) {
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
						fileObject.buffer = btoa(e.target.result);
						storedFiles.push(fileObject);
					}
					let reader = new FileReader();
					reader.onload = callbackFunction;
					reader.readAsBinaryString(file);
				}
			}
			event.target.value = "";
		},
		changeShowMedia: function() {
			this.showMedia = !this.showMedia;
		},
		changeShowSolution: function() {
			this.showSolution = !this.showSolution;
		},
		changeShowBasicInfo: function() {
			this.showBasicInfo = !this.showBasicInfo;
		},
		assignTime: function() {
			if (this.time === 0) this.newQuestion.time = -1;
			else this.newQuestion.time = this.time;
		},
		addNewQuestionHandler: function() {
			this.$socket.emit(
				"addNewQuestion",
				Object.assign({}, this.newQuestion, {
					courseCode: this.$store.getters.getSelectedCourse
				})
			);
		},
		editQuestionHandler: function() {
			this.$socket.emit("updateQuestion", this.newQuestion);
		},
		returnToOkHandler: function() {
			this.assignTime();
			if (this.newQuestion.solutionType === 10) {
				this.newQuestion.solution = this.newQuestion.objects.code;
			}

			if (this.okHandler == "add") this.addNewQuestionHandler();
			else if (this.okHandler == "edit") this.editQuestionHandler();
		},
		gotTreeDrawerObject: function(result) {
			this.newQuestion.objects.startTree = result.tree;
			this.newQuestion.objects._graphdrawerGraph = [
				Object.assign(
					{
						type: "Complete"
					},
					result.graph
				)
			];
			this.returnToOkHandler();
		},
		gotGraphDrawerObject: function(result) {
			this.newQuestion.objects.graph = result;
			this.newQuestion.objects._graphdrawerGraph = [
				Object.assign(
					{
						type: "Complete"
					},
					result
				)
			];
			this.returnToOkHandler();
		},
		callOkHandler: function(e) {
			e.preventDefault();
			if (
				this.newQuestion.solutionType > 6 &&
				this.newQuestion.solutionType < 10
			) {
				this.requestGraphDrawerObject = !this.requestGraphDrawerObject;
			} else {
				this.returnToOkHandler();
			}
		},
		addNewMultipleChoice: function() {
			this.newQuestion.objects.multipleChoices.push("");
		},
		deleteMultiChoice: function(index) {
			let solutionIndex = this.newQuestion.solution.indexOf(
				index.toString()
			);
			if (solutionIndex > -1)
				this.newQuestion.solution.splice(solutionIndex, 1);
			for (
				let i = index + 1;
				i < this.newQuestion.objects.multipleChoices.length;
				i++
			) {
				let j = this.newQuestion.solution.indexOf(i.toString());
				if (j > -1) {
					this.newQuestion.solution[j] = (
						Number(this.newQuestion.solution[j]) - 1
					).toString();
				}
			}

			this.newQuestion.objects.multipleChoices.splice(index, 1);
		},
		addTableRow: function() {
			this.editTableRows++;
			this.editTableValues.push(new Array(this.editTableColumns));
			for (let i = 0; i < this.editTableColumns; i++) {
				this.editTableValues[this.editTableRows - 1][i] = "0";
			}
			if (this.editTableColumns === 0) this.addTableColumn();
		},
		addTableColumn: function() {
			this.editTableColumns++;
			for (let i = 0; i < this.editTableRows; i++) {
				this.editTableValues[i].push("0");
			}
			if (this.editTableRows === 0) this.addTableRow();
		},
		removeTableRow: function() {
			if (this.editTableRows === 0) return;
			this.editTableRows--;
			this.editTableValues.pop();
			if (this.editTableRows === 0) {
				this.editTableRows = 0;
				this.editTableColumns = 0;
				this.editTableValues = [];
			}
		},
		removeTableColumn: function() {
			if (this.editTableColumns === 0) return;
			this.editTableColumns--;
			for (let i = 0; i < this.editTableRows; i++) {
				this.editTableValues[i].pop();
			}
			if (this.editTableColumns === 0) {
				this.editTableRows = 0;
				this.editTableColumns = 0;
				this.editTableValues = [];
			}
		},
		addTable: function() {
			if (this.editTableRows === 0) {
				this.mediaErrorText = this.getLocale.addTableRowError;
				this.showMediaError = true;
				return;
			}
			if (this.editTableColumns === 0) {
				this.mediaErrorText = this.getLocale.addTableColumnError;
				this.showMediaError = true;
				return;
			}
			let wrongValue = [];
			for (let row = 0; row < this.editTableRows; row++) {
				for (let column = 0; column < this.editTableColumns; column++) {
					if (this.editTableValues[row][column].length === 0) {
						wrongValue.push(`[${row}, ${column}] ${this.getLocale.addTableValueSizeZeroError}`);
					}
					if (this.editTableValues[row][column].length > 6) {
						wrongValue.push(`[${row}, ${column}] ${this.getLocale.addTableValueSizeToLargeError}`);
					}
				}
			}
			if (wrongValue.length > 0) {
				this.mediaErrorText = `${this.getLocale.addTableValueCellError}`;
				for (let i = 0; i < wrongValue.length; i++) {
					this.mediaErrorText += wrongValue[i];
					if (i < wrongValue.length - 1) this.mediaErrorText += ", ";
				}
				this.showMediaError = true;
				return;
			}

			if (this.editExistingTable){
				this.getQuestionObjects.tables[
					this.editExistingTableIndex
				] = this.editTableValues;
			}else {
				this.newQuestion.objects.tables.push(this.editTableValues);
			}
			
			this.editTableRows = 0;
			this.editTableColumns = 0;
			this.editTableValues = [];
			this.editExistingTable = false;
			this.editExistingTableIndex = 0;
		},
		deleteTable: function(index) {
			this.getQuestionObjects.tables.splice(index, 1);
			
			if (index === this.editExistingTableIndex) {
				this.editExistingTable = false;
				this.editExistingTableIndex = 0;
			}
		},
		editTable: function(index) {
			let table = JSON.parse(JSON.stringify(this.getQuestionObjects.tables[index]));
			this.editTableRows = table.length;
			this.editTableColumns = table[0].length;
			this.editTableValues = table;
			this.editExistingTable = true;
			this.editExistingTableIndex = index;
		}
	},
	computed: {
		getTitle: function() {
			return this.getLocale[this.okHandler + "Title"];
		},
		getSolutionType: function() {
			return this.newQuestion.solutionType;
		},
		checkRef: function() {
			if (this.$refs["codeInput"] !== undefined) {
				this.$refs["codeInput"].onkeydown = this.keyDownInTextarea;
				return true;
			}

			return false;
		},
		getImageSrc: function() {
			return (index) => {
				let file = this.newQuestion.objects.files[index];
				return "data:" + file.type + ";base64," + file.buffer;
			};
		},
		getLocale: function() {
			let locale = this.$store.getters.getLocale("AdminQuestions");
			if (locale) return locale;
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
			];
		},
		timeInput: {
			get: function() {
				let min = Math.floor(Number(this.time) / 60).toString();
				let sec = Math.floor(Number(this.time) % 60).toString();

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
		},
		getTableRow: function() {
			return (index) => this.getQuestionObjects.tables[index].length;
		},
		getTableColumn: function() {
			return (index) => this.getQuestionObjects.tables[index][0].length;
		},
		getTable: function() {
			return (index) => this.getQuestionObjects.tables[index];
		}
	},
	sockets: {
		sendQuestionTypes: function(types) {
			this.solutionTypes = types;
			if (this.newQuestion.solutionType === "")
				this.newQuestion.solutionType = this.solutionTypes[0].value;
		},
		confirmQuestionRequirements: function(result) {
			if (result.passed) {
				this.$refs[this.elementRef].hide();
				if (this.doneHandler !== undefined) this.doneHandler();
			} else {
				this.validationFailure = true;
				this.validationErrors = result.errors;
			}
		}
	},
	watch: {
		"newQuestion.solutionType": function(newType, oldType) {
			if (oldType === "") return;

			if (newType === 1 || newType === 10)
				this.newQuestion.solution = "";
			else
				this.newQuestion.solution = [];
		}
	}
};
</script>

<style scoped>
.imageInput {
	width: 0.1px;
	height: 0.1px;
	opacity: 0;
	overflow: hidden;
	position: absolute;
	z-index: -1;
}
.imageInput + label {
	cursor: pointer;
	font-size: 1.25em;
	font-weight: 700;
	color: white;
	background-color: #007bff;
	display: inline-block;
	height: 50px;
	width: 400px;
	border: 3px solid #007bff;
	border-radius: 10px;
	text-align: center;
	line-height: 50px;
}
.imageInput:focus + label,
.imageInput:hover + label {
	width: 450px;
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
.editTableContainer {
	overflow-x: scroll;
	overflow-y: scroll;
	min-height: 200px;
	max-height: 200px;
	border: 1px solid black;
	text-align: center;
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
.tableCollapse {
	padding: 5% 5% 0 5%;
	width: 100%;
	height: 100%;
}
</style>
