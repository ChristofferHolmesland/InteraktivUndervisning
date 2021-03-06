<!--
	Component name: ShowQuestion
	Use case:
		- Displays a question
-->

<template>
	<b-modal
		:id="elementId"
		:ref="elementRef"
		:title="question.text"
		title-tag="h3"
		style="text-align: left;"
		data-cy="showModal"
		size="lg"
		:ok-only="true"
		:ok-title="getLocale.closeBtn"
		:hide-header-close="true"
	>
		<b-container class="px-0">
			<b-row @click="changeShowBasicInfo" class="cursor">
				<b-col cols="11">
					<h4>{{ getLocale.basicInfo }}</h4>
				</b-col>
				<b-col cols="1">
					<p>
						<i
							:class="
								showBasicInfo
									? 'fas fa-angle-up'
									: 'fas fa-angle-down'
							"
						></i>
					</p>
				</b-col>
			</b-row>
			<b-row v-if="showBasicInfo">
				<b-col>
					<h5>{{ getLocale.description }}</h5>
					<p v-for="(line, index) in getDescription" :key="index">
						{{ line }}
					</p>
					<h5>{{ getLocale.time }}</h5>
					<p>{{ getTime }}</p>
				</b-col>
			</b-row>
		</b-container>
		<b-container v-if="haveMedia" class="px-0">
			<b-row @click="changeShowMedia" class="cursor">
				<b-col cols="11">
					<h4>{{ getLocale.mediaLabel }}</h4>
				</b-col>
				<b-col cols="1">
					<p>
						<i
							:class="
								showMedia
									? 'fas fa-angle-up'
									: 'fas fa-angle-down'
							"
						></i>
					</p>
				</b-col>
			</b-row>
			<b-row v-if="question.objects.files.length > 0 && showMedia">
				<b-col>
					<label>{{ getLocale.filesLabel }}</label>
					<b-container>
						<b-row
							v-for="(image, index) in question.objects.files"
							:key="index"
							class="mt-2"
						>
							<b-col>
								<b-row>
									<b-col>
										{{ getLocale.filename }}:
										{{ image.name }}
									</b-col>
								</b-row>
								<b-row>
									<b-col>
										{{ getLocale.filesize }}:
										{{
											Math.round(
												(image.size / 1000000 +
													0.00001) *
													100
											) / 100
										}}
										MB
									</b-col>
								</b-row>
								<b-row>
									<b-col>
										{{ getLocale.filetype }}:
										{{ image.type }}
									</b-col>
								</b-row>
							</b-col>
							<b-col>
								<img
									:src="getImageSrc(index)"
									width="200"
									height="200"
									style="border: 3px solid black;"
								/>
							</b-col>
						</b-row>
					</b-container>
				</b-col>
			</b-row>
			<b-row v-if="question.objects.tables.length > 0 && showMedia">
				<b-col>
					<label>{{ getLocale.tableLabel }}</label>
					<b-container
						v-for="(table, index) in question.objects.tables"
						:key="index"
						class="mb-2 border py-2"
					>
						<b-row align-h="around">
							<b-col>
								<b-container>
									<b-row class="mb-2">
										<b-col>
											{{
												`${
													getLocale.tableViewTitle
												} ${index + 1}`
											}}
										</b-col>
									</b-row>
									<b-row>
										<b-col>
											<b-button
												variant="warning"
												v-b-toggle="
													'tableCollapse' + index
												"
												>{{
													getLocale.viewBtn
												}}</b-button
											>
										</b-col>
									</b-row>
								</b-container>
							</b-col>
						</b-row>
						<b-row>
							<b-collapse
								:id="'tableCollapse' + index"
								class="tableCollapse"
							>
								<b-container class="viewTableContainer">
									<b-row
										v-for="(row, rowIndex) in getTableRow(
											index
										)"
										:key="rowIndex"
										class="editTableRow"
									>
										<div
											v-for="(column,
											columnIndex) in getTableColumn(
												index
											)"
											:key="columnIndex"
											class="editTableColumn"
										>
											<b-form-input
												:value="
													getTable(index)[rowIndex][
														columnIndex
													]
												"
												maxlength="6"
												disabled
											></b-form-input>
										</div>
									</b-row>
								</b-container>
							</b-collapse>
						</b-row>
					</b-container>
				</b-col>
			</b-row>
		</b-container>
		<b-container class="px-0">
			<b-row @click="changeShowSolution" class="cursor">
				<b-col cols="11">
					<h4>{{ getLocale.solutionText }}</h4>
				</b-col>
				<b-col cols="1">
					<p>
						<i
							:class="
								showSolution
									? 'fas fa-angle-up'
									: 'fas fa-angle-down'
							"
						></i>
					</p>
				</b-col>
			</b-row>
			<b-row v-if="showSolution">
				<b-col>
					<h6>
						{{ getLocale.showQuestionType }}
						{{ getQuestionTypeName }}
					</h6>
					<p v-if="question.solutionType === 1">
						{{ question.solution }}
					</p>
					<b-container
						v-if="question.solutionType === 2"
						class="px-0"
					>
						<b-row>
							<b-col>
								<h6>{{ getLocale.multipleChoiceHeader }}</h6>
							</b-col>
							<b-col>
								<h6>{{ getLocale.multipleChoiceCorrect }}</h6>
							</b-col>
						</b-row>
						<b-row
							v-for="(choice, index) in question.objects
								.multipleChoices"
							:key="index"
						>
							<b-col>
								<p>{{ choice }}</p>
							</b-col>
							<b-col>
								<p>
									{{
										question.solution.findIndex(
											(sol) => sol == index
										) > -1
											? getLocale.yes
											: getLocale.no
									}}
								</p>
							</b-col>
						</b-row>
					</b-container>
					<ShellsortSolution
						v-if="question.solutionType === 3"
						:solution="question.solution"
					/>
					<GraphDrawer
						v-if="question.solutionType === 4"
						ref="graphdrawer"
						controlType="Sort"
						sortType="Mergesort"
						:steps="question.solution"
						operatingMode="Presentation"
					/>
					<GraphDrawer
						v-if="question.solutionType === 5"
						ref="graphdrawer"
						controlType="Sort"
						sortType="Quicksort"
						:steps="question.solution"
						operatingMode="Presentation"
					/>
					<div v-if="question.solutionType === 6">
						{{ getLocale.binaryTreeSolutionText }}
						{{ question.solution.nodes }}
					</div>
					<GraphDrawer
						v-if="
							question.solutionType === 7 ||
								question.solutionType === 8
						"
						ref="graphdrawer"
						controlType="Graph0"
						importType="Tree"
						operatingMode="Presentation"
						:steps="question.solution"
						:displayEdgeValues="false"
					/>
					<GraphDrawer
						v-if="question.solutionType === 9"
						ref="graphdrawer"
						controlType="Dijkstra"
						operatingMode="Presentation"
						:steps="question.solution"
						:displayEdgeValues="true"
					/>
					<GraphDrawer
						v-if="question.solutionType === 10"
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
				objects: { multipleChoices: [] }
			},
			showBasicInfo: true,
			showMedia: false,
			showSolution: false,
			questionTypes: []
		};
	},
	props: {
		elementRef: String,
		elementId: String
	},
	mounted() {
		this.$root.$on("bv::modal::hide", () => {
			if (this.$refs.graphdrawer !== undefined)
				this.$refs.graphdrawer.destroyDrawer();
		});

		this.$root.$on("bv::modal::show", () => {
			this.$socket.emit("getQuestionTypes");
		});

		this.$root.$on("bv::modal::shown", () => {
			this.$nextTick(function() {
				if (this.$refs.graphdrawer !== undefined) {
					this.$refs.graphdrawer.createDrawer();
				}
			});
		});

		this.$nextTick(function() {
			if (this.$refs.graphdrawer !== undefined) {
				this.$refs.graphdrawer.createDrawer();
			}
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
			if (locale) return locale;
			else return {};
		},
		getQuestionTypeName: function() {
			let questionTypeInfo = this.questionTypes[
				this.question.solutionType - 1
			];
			if (questionTypeInfo == undefined) return "";

			let questionTypeInfoLocale = this.getLocale.questionType[
				questionTypeInfo.text
			];
			return questionTypeInfoLocale;
		},
		getTime: function() {
			let min = Math.floor(this.question.time / 60).toString();
			let sec = Math.floor(this.question.time % 60).toString();

			return `${min.padStart(2, "0")}:${sec.padStart(2, "0")}`;
		},
		haveMedia: function() {
			let show = false;
			if (this.question.objects.files !== undefined)
				if (this.question.objects.files.length > 0) show = true;
			if (this.question.objects.tables !== undefined)
				if (this.question.objects.tables.length > 0) show = true;
			return show;
		},
		getImageSrc: function() {
			return (index) => {
				let file = this.question.objects.files[index];
				return "data:" + file.type + ";base64," + file.buffer;
			};
		},
		getDescription: function() {
			return this.question.description.split("\n");
		},
		getTableRow: function() {
			return (index) => this.question.objects.tables[index].length;
		},
		getTableColumn: function() {
			return (index) => this.question.objects.tables[index][0].length;
		},
		getTable: function() {
			return (index) => this.question.objects.tables[index];
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
				if (this.$refs.graphdrawer !== undefined)
					this.$refs.graphdrawer.createDrawer();
			});
		}
	}
};
</script>

<style scoped>
.cursor {
	cursor: pointer;
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
.tableCollapse {
	padding: 5% 5% 0 5%;
	width: 100%;
	height: 100%;
}
</style>
