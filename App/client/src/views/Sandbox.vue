<template>
<b-container>
	<b-row>
		<b-col cols="12" lg="8" class="mb-3">
			<b-row class="mb-3">
				<b-col>
					<b-button @click="returnToClientDashboard" variant="primary">{{ getLocale.backBtn }}</b-button>
				</b-col>
				<b-col>
                    <b-form-select 	id="solutionTypeInput"
                                    :options="questionTypes"
                                    v-model="questionType"
								  	@change="changeSelect"
					>
                    </b-form-select>
				</b-col>
			</b-row>
			<b-row style="border: 3px solid black; padding: 10px;">
				<b-col>
					<b-container class="px-0" v-if="questionType === 'Text'">
						<b-row>
							<b-col>
								<b-form-input type="text" :placeholder="getLocale.textInputPlaceholder"/>
							</b-col>
						</b-row>
					</b-container>
					<b-container v-if="questionType === 'Multiple choice'">
						<b-row>
							<b-col v-for="(choice, index) in getChoices" 
									:key="index" 
									class="choice"
									@click="selectChoice(index)"
									cols="12" lg="5">
								<div class="selected">
                					<i :class="'far' + (choice.selected ? ' fa-check-square' : ' fa-square')"></i>
								</div>
								{{ choice.text }}
							</b-col>
						</b-row>
					</b-container>
					<div v-if="questionType === 'Shellsort'">
						<b-container style="overflow-x:scroll;" class="mb-3">
							<b-row class="shellsortTableRow">
								<div class="shellsortColKValue">
									K Value
								</div>
								<div v-for="(value, index) in shellsortStartList" :key="index" class="shellsortColArrayElement">
									{{ index }}
								</div>
							</b-row>
							<b-row class="mb-2 shellsortTableRow">
								<div class="shellsortColKValue">
									<input type="text" disabled :value="shellsortStartKValue" class="shellsortInput">
								</div>
								<div v-for="(value, index) in shellsortStartList" :key="index" class="shellsortColArrayElement">
									<input type="text" disabled :value="value" class="shellsortInput">
								</div>
							</b-row>
							<b-row v-for="row in shellsortRows" :key="row" class="mb-1 shellsortTableRow">
								<div class="shellsortColKValue">
									<input type="text" placeholder="Enter k value" v-model="shellsortKValues[row - 1]" class="shellsortInput">
								</div>
								<div v-for="(value, index) in getShellsortRowValues(row - 1)" :key="index" @click="shellsortElementClicked(row - 1, index)" class="shellsortColArrayElement">
									<input v-if="shellsortCheckIfSelected((row - 1), (index))" type="text" disabled :value="value" class="shellsortInput" style="background-color: black; color: white;">
									<input v-else type="text" disabled :value="value" class="shellsortInput">
								</div>
							</b-row>
						</b-container>
						<b-container>
							<b-row>
								<b-col cols="6" style="text-align: center;">
									<b-btn variant="primary" @click="shellsortAddNewLine">{{ getLocale.newRowBtn }}</b-btn>
								</b-col>
								<b-col cols="6" style="text-align: center;">
									<b-btn variant="danger" @click="shellsortRemoveLastLine">{{ getLocale.removeRowBtn }}</b-btn>
								</b-col>
							</b-row>
						</b-container>
					</div>
					<div v-if="questionType === 'Mergesort'">
						<GraphDrawer	controlType="Sort"
										sortType="Mergesort"
										:steps="mergesortSteps"
										:requestAnswer="requestGraphDrawerObject"
										v-if="!reload"
										ref="graphdrawer"
						/>
					</div>
					<div v-if="questionType === 'Quicksort'">
						<GraphDrawer	controlType="Sort"
										sortType="Quicksort"
                    					:steps="quicksortSteps"
										:requestAnswer="requestGraphDrawerObject"
										v-if="!reload"
										ref="graphdrawer"
						/>
					</div>
					<div v-if="questionType === 'Tree'">
						<GraphDrawer
								controlType="Graph0"
								operatingMode="Interactive"
								:requestAnswer="requestGraphDrawerObject"
								ref="graphdrawer"
								v-if="!reload"
						/>
					</div>
					<div v-if="questionType === 'Dijkstra'">
						<GraphDrawer
							controlType="Dijkstra"
							operatingMode="Interactive"
							:requestAnswer="requestGraphDrawerObject"
							ref="graphdrawer"
							v-if="!reload"
							:graph="dijkstraQuestion"
							:displayEdgeValues="true"
							:directedEdges="true"
						/>
					</div>
					<div v-if="questionType === 'Python'">
						<GraphDrawer
							controlType="Python"
							operatingMode="Interactive"
							:requestAnswer="requestGraphDrawerObject"
							ref="graphdrawer"
							v-if="!reload"
							:displayEdgeValues="false"
							:directedEdges="true"
							:steps="pythonSteps"
						/>
					</div>
				</b-col>
			</b-row>
		</b-col>
		<b-col cols="12" lg="4">
			<b-row v-if="getShowSettings" id="SandBoxSettings">
				<b-col>
					<b-row @click="changeShowSettings" class="cursor">
						<b-col cols="8">
							<h3>{{ getLocale.settingsTitle }}</h3>
						</b-col>
						<b-col cols="4" style="text-align: right;">
                            <p><i :class="showSettings ? 'fas fa-angle-up' : 'fas fa-angle-down'"></i></p>
						</b-col>
					</b-row>
					<div v-show="showSettings">
						<b-container class="jumbotron" v-if="questionType === 'Shellsort'">
							<b-row>
								<b-col>
									<b-form-group>
										<label for="shellsortStartKValue">{{ getSettingObject.kValueLabel }}</label>
										<b-form-input id="shellsortStartKValue" v-model="shellsortStartKValue" @change="shellsortInitialValuesChange">
										</b-form-input>
										<label for="shellsortStartList">{{ getSettingObject.listLabel }}</label>
										<b-form-input id="shellsortStartList" v-model="shellsortStartString" @change="shellsortInitialValuesChange">
										</b-form-input>
									</b-form-group>
								</b-col>
							</b-row>
						</b-container>
						<b-container class="jumbotron" v-if="questionType === 'Quicksort'">
							<b-row>
								<b-col>
									<b-form-group>
										<label for="quicksortStartList">{{ getSettingObject.listLabel }}</label>
										<b-form-input id="quicksortStartList" v-model="quicksortString" @change="quicksortInitialValuesChange">
										</b-form-input>
									</b-form-group>
								</b-col>
							</b-row>
						</b-container>
						<b-container class="jumbotron" v-if="questionType === 'Mergesort'">
							<b-row>
								<b-col>
									<b-form-group>
										<label for="mergesortStartList">{{ getSettingObject.listLabel }}</label>
										<b-form-input id="mergesortStartList" v-model="mergesortString" @change="mergesortInitialValuesChange">
										</b-form-input>
									</b-form-group>
								</b-col>
							</b-row>
						</b-container>
						<b-container class="jumbotron" v-if="questionType === 'Python'">
							<b-row>
								<b-col>
										<b-button variant="primary" @click="parsePythonCode">{{ getSettingObject.buttonLabel }}</b-button>
										<b-form-textarea
											id="pythonCodeInput"
											:placeholder="getSettingObject.textareaPlaceholder"
											ref="codeInput"
											v-model="pythonCode"
											@keydown.native.tab="keyDownInTextarea">
                    					</b-form-textarea>
								</b-col>
							</b-row>
						</b-container>
					</div>
				</b-col>
			</b-row>
			<b-row>
				<b-col>
					<b-row @click="changeShowGuide" class="cursor" id="SandBoxGuide">
						<b-col cols="8">
							<h3>{{ getLocale.guideTitle }}</h3>
						</b-col>
						<b-col cols="4" style="text-align: right;">
                            <p><i :class="showGuide ? 'fas fa-angle-up' : 'fas fa-angle-down'"></i></p>
						</b-col>
					</b-row>
					<div v-show="showGuide" id="GuideInfo">
						<b-container class="jumbotron">
							<b-row>
								<b-col>
									<p v-for="(line, index) in getGuideList" :key="index">{{ line }}</p>
								</b-col>
							</b-row>
						</b-container>
					</div>
				</b-col>
			</b-row>
		</b-col>
	</b-row>
</b-container>
</template>

<script>
import GraphDrawer from "../components/graphDrawer/GraphDrawer.vue";
import DijkstraQuestionObject from "../assets/sandbox/dijkstraQuestion.js";
import PythonQuestionObject from "../assets/sandbox/pythonQuestion.js";

export default {
	name: "Sandbox",
	data() {
		return {
			reload: false,
			showSettings: true,
			showGuide: false,
			requestGraphDrawerObject: false,
			questionType: "Text",
			questionTypes: [
				"Text",
				"Multiple choice",
				"Shellsort",
				"Mergesort",
				"Quicksort",
				"Tree",
				"Dijkstra",
				"Python"
			],
			multipleChoiceChoices: [
				{
					text: "Choice 1",
					selected: false
				},
				{
					text: "Choice 2",
					selected: false
				},
				{
					text: "Choice 3",
					selected: false
				},
				{
					text: "Choice 4",
					selected: false
				}
			],
			shellsortStartKValue: 4,
			shellsortStartList: [4, 80, 54, 23, 1, 5, 7, 3, 245, 43],
			shellsortStartString: "4,80,54,23,1,5,7,3,245,43",
			shellsortRows: 0,
			shellsortKValues: [],
			shellsortRowValues: [],
			shellsortElementSelected: undefined,
			mergesortSteps: [{
            	list: [4, 80, 54, 23, 1, 5, 7, 3, 245, 43],
            	type: "Initial"
        	}],
			mergesortString: "4,80,54,23,1,5,7,3,245,43",
			quicksortSteps: [{
            	list: [4, 80, 54, 23, 1, 5, 7, 3, 245, 43],
            	type: "Initial"
        	}],
			quicksortString: "4,80,54,23,1,5,7,3,245,43",
			dijkstraQuestion: DijkstraQuestionObject,
			pythonCode: PythonQuestionObject,
			pythonSteps: []
		};
	},
	created() {
		this.$socket.emit("verifyUserLevel", 1);
	},
	sockets: {
		"parsePythonCodeResponse": function(parsed) {
			this.pythonSteps = parsed.objects.steps;
			this.$nextTick(() => {
				this.reload = true;
				this.$nextTick(() => {
					this.reload = false;
					
				});
			});
		}
	},
	methods: {
		parsePythonCode() {
			let code = this.$refs.codeInput.$refs.input.value;
			this.$socket.emit("parsePythonCodeRequest", { code: code });
		},
		keyDownInTextarea(e) {
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
		returnToClientDashboard: function() {
			this.$router.push("/client");
		},
		changeShowSettings: function() {
			this.showSettings = !this.showSettings;
		},
		changeShowGuide: function() {
			this.showGuide = !this.showGuide;
		},
		changeSelect: function() {
			//not sure if necessary with the watch...
			if (this.questionType === "Mergesort" || this.questionType === "Quicksort" || this.questionType === "Tree") {
				this.requestGraphDrawerObject = !this.requestGraphDrawerObject;
				if (this.$refs.graphdrawer !== undefined) {
					this.$nextTick(function () {
						if (this.$refs.graphdrawer !== undefined) {
							this.$refs.graphdrawer.createDrawer();
						}
					});
				}
			}
		},
		selectChoice: function(index) {
			this.multipleChoiceChoices[index].selected = !this.multipleChoiceChoices[index].selected;

		},
		shellsortAddNewLine() {
			let tempList = [];
			if (this.shellsortRows > 0) tempList = this.shellsortRowValues[this.shellsortRows - 1];
			else tempList = this.shellsortStartList;
			this.shellsortRows++;
			tempList = JSON.parse(JSON.stringify(tempList));
			this.shellsortRowValues.push(tempList);
			this.shellsortKValues.push(0);
		},
		shellsortRemoveLastLine() {
			if (this.shellsortRows > 0) {
				this.shellsortRows--;
				this.shellsortRowValues.pop();
				this.shellsortKValues.pop();
			}
		},
		shellsortElementClicked(row, index) {
			if (!this.shellsortElementSelected) {
				this.shellsortElementSelected = {
					row: row,
					element: index
				}
			} else if (this.shellsortElementSelected.row === row) {
				if (this.shellsortElementSelected.element != index) {
					row = this.shellsortRowValues[row];
					let temp = row[index];

					row[index] = row[this.shellsortElementSelected.element];
					row[this.shellsortElementSelected.element] = temp;
					
					this.shellsortElementSelected = undefined;

					this.$forceUpdate();
				}
			} else {
				this.shellsortElementSelected = {
					row: row,
					element: index
				}
			}
		},
		shellsortInitialValuesChange: function() {
			this.shellsortStartList = this.shellsortStartString.split(",");
			this.shellsortRows = 0;
			this.shellsortKValues = [];
			this.shellsortRowValues = [];
		},
		quicksortInitialValuesChange: function() {
			this.quicksortSteps[0].list = this.quicksortString.split(",")
			this.$nextTick(() => {
				this.reload = true;
				this.$nextTick(() => {
					this.reload = false;
					
				});
			});
		},
		mergesortInitialValuesChange: function() {
			this.mergesortSteps[0].list = this.mergesortString.split(",")
			this.$nextTick(() => {
				this.reload = true;
				this.$nextTick(() => {
					this.reload = false;
					
				});
			});
		}
	},
	computed: {
		getShowSettings: function() {
			switch (this.questionType) {
				case "Text":
				case "Multiple choice":
				case "Tree":
				case "Dijkstra":
					this.showGuide = true;
					return false;
					break;
				default:
					this.showGuide = false;
					return true;
			}
		},
		getLocale: function() {
			let locale = this.$store.getters.getLocale("Sandbox");
			if (locale) return locale;
			return {};
		},
		getChoices: function() {
			return this.multipleChoiceChoices;
		},
		getShellsortRowValues: function() {
			return row => {
				return this.shellsortRowValues[row];
			}
		},
		shellsortCheckIfSelected: function() {
			return (row, element) => {
				if (this.shellsortElementSelected === undefined) return false;
				if (
					this.shellsortElementSelected.row === row &&
					this.shellsortElementSelected.element === element
				) return true;
			}
		},
		getGuideList: function() {
			try {
				return this.getLocale.guide[this.questionType];
			} catch (err) {
				return []; 
			}
		},
		getSettingObject: function() {
			try {
				return this.getLocale.settings[this.questionType];
			} catch (err) {
				return {};
			}
		}
	},
	watch: {
		"questionType": function () {
			this.$nextTick(function () {
				if (this.$refs.graphdrawer !== undefined) {
					this.$refs.graphdrawer.createDrawer();
				}
				this.reload = true;
				this.$nextTick(function () {
					this.reload = false;
				});
			});
		}
	},
	components: {
		GraphDrawer
	}
};

</script>

<style scoped>
.cursor {
	cursor: pointer;
}
.choice {
	position: relative;
	margin: 1em auto 1em auto;
	min-height: 10em;
	background-color: #337ab7;
	box-shadow: 0 0 5px -1px rgba(0, 0, 0, 0.2);
	cursor: pointer;
	padding: 1em;
	text-align: center;
}
.selected {
	position: absolute;
	top: 10%;
	left: 10%;
}
.shellsortInput {
	width: 80px;
	text-align: center;
}
.shellsortColKValue {
	min-width: 100px;
	max-width: 100px;
	text-align: center;
}
.shellsortColArrayElement {
	min-width: 90px;
	max-width: 90px;
	text-align: center;
}
.shellsortTableRow {
	flex-wrap: nowrap;
}
</style>
