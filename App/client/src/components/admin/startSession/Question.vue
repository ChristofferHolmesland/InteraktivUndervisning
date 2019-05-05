<template>
	<b-container>
		<b-row>
			<b-col>
				<h1>{{ questionInfo.text }}</h1>
			</b-col>
		</b-row>
		<b-row class="text-center">
			<b-col></b-col>
			<b-col cols="2" v-if="timeLeft > 0">
				<p v-if="timeLeft !== undefined" style="line-height: 100%">{{ getLocale.timeLeft }} {{ getTimeUpdate }}</p>
			</b-col>
			<b-col cols="2">
				<p>{{ getNumberOfAnswers }}</p>
			</b-col>
			<b-col cols="2">
				<p>{{ getLocale.sessionCode }} {{ sessionId }}</p>
			</b-col>
			<b-col cols="1">
				<b-button @click="btnNextClick" variant="primary">Next</b-button>
			</b-col>
			<b-col></b-col>
		</b-row>
		<b-row>
			<b-col>
				<h4>{{getLocale.showQuestionType}} {{getQuestionType}}</h4>
			</b-col>
		</b-row>
		<b-row>
			<b-col>
				<p v-for="(line, index) in getDescription" :key="index">{{ line }}</p>
			</b-col>
		</b-row>
		<b-row>
			<b-col>
				<div class="displayInline" v-for="(info,index) in getExtraDesc" :key="index">
					<pre v-if="info.code">{{info.value}}</pre>
					<p class="displayInline" v-else>{{info.value}}</p>
					<br v-if="info.linebreak"/>
				</div>
			</b-col>
		</b-row>
		<b-container class="px-0" v-if="showMedia">
			<b-row>
				<b-col>
					<b-card no-body>
						<b-tabs card @input="setMediaTab($event)">
							<b-tab :title="getLocale.tabImage" v-if="getImagesLength > 0">
								<b-container v-if="mediaTab === 0">
									<b-row>
										<b-col cols="12">
											<b-row>
												<b-col class="text-center">
													<img    :src="getImgSrc" width="500" height="500"
															style="border: 3px solid black;"
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
							<b-tab :title="getLocale.tabTable" v-if="getTablesLength > 0">
								<b-container v-if="mediaTab === 1">
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
	</b-container>
</template>
<script>
export default {
	name: "Question",
	props: ["questionInfo", "sessionId"],
	data() {
		return {
			interval: undefined,
			timeLeft: undefined,
			answered: 0,
			participants: 0,
			selectedImageIndex: 0,
			selectedTableIndex: 0,
			mediaTab: 0
		};
	},
	created() {
		this.participants = this.questionInfo.participants;
		let timeLeft = this.questionInfo.time;
		if (timeLeft > 0) {
			this.timeLeft = timeLeft;
			this.interval = setInterval(() => {
				if (this.timeLeft === 0) {
					this.$socket.emit("forceNextQuestion");
					clearInterval(this.interval);
				} else this.timeLeft--;
			}, 1000);
		}
	},
	beforeDestroy() {
		if (this.interval !== undefined) clearInterval(this.interval);
	},
	computed: {
		getDescription: function() {
			return this.questionInfo.description.split("\n");
		},
		getLocale() {
			let locale = this.$store.getters.getLocale("startSession");
			if (locale) return locale;
			else return {};
		},
		getTimeUpdate() {
			let min = Math.floor(this.timeLeft / 60).toString();
			let sec = Math.floor(this.timeLeft % 60).toString();

			return `${min.padStart(2, "0")}:${sec.padStart(2, "0")}`;
		},
		getNumberOfAnswers() {
			return `Answers: ${this.answered}/${this.participants}`;
		},
		getImagesLength() {
			return this.questionInfo.object.files.length;
		},
		getImgSrc() {
			let file = this.questionInfo.object.files[this.selectedImageIndex];
            return "data:" + file.type + ";base64," + file.buffer;
		},
		getQuestionType() {
			//indexes are 0-9, but question types are 1-10 :(
			return this.$store.getters.getQuestionTypes[
			this.questionInfo.type - 1
				].name;
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
		getTableRow: function() {
			return this.questionInfo.object.tables[this.selectedTableIndex].length;
		},
		getTableColumn: function() {
			return this.questionInfo.object.tables[this.selectedTableIndex][0].length;
		},
		getTable: function() {
			return this.questionInfo.object.tables[this.selectedTableIndex];
		},
		getTablesLength: function() {
			return this.questionInfo.object.tables.length;
		},
		showMedia: function() {
			if (
				this.getImagesLength > 0 ||
				this.getTablesLength > 0
			){
				return true;
			}
			return false;
		}
	},
	sockets: {
		updateNumberOfAnswers(data) {
			this.answered = data[0];
			this.participants = data[1];
		}
	},
	methods: {
		btnNextClick() {
			this.$socket.emit("forceNextQuestion");
		},
		changeSelectedImage(step) {
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
		setMediaTab: function(event) {
			this.mediaTab = event;
		}
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