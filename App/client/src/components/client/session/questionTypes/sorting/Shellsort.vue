<template>
<div>
	<b-container id="ShellsortMainContainer">
		<b-row class="shellsortRow">
			<div class="shellsortColKvalue">
				K Value
			</div>
			<div v-for="(value, index) in initialList" :key="index" class="shellsortColElement">
				{{ index }}
			</div>
		</b-row>
		<b-row class="mb-2 shellsortRow">
			<div class="shellsortColKvalue">
				<input type="text" disabled :value="initialKValue">
			</div>
			<div v-for="(value, index) in initialList" :key="index" class="shellsortColElement">
				<input type="text" disabled :value="value">
			</div>
		</b-row>
		<b-row v-for="row in rows" :key="row" class="mb-1 shellsortRow">
			<div class="shellsortColKvalue">
				<input type="text" placeholder="Enter k value" v-model="kValues[row - 1]">
			</div>
			<div v-for="(value, index) in getRowValues(row - 1)" :key="index" @click="elementClicked(row - 1, index)" class="shellsortColElement">
				<input type="text" disabled :value="value" :class="checkIfSelected((row - 1), (index)) ? 'selected' : ''">
			</div>
		</b-row>
	</b-container>
	<b-container>
		<b-row class="text-center">
			<b-col>
				<b-btn variant="primary" @click="addNewLine">Add new row</b-btn>
			</b-col>
			<b-col>
				<b-btn variant="danger" @click="removeLastLine">Remove last row</b-btn>
			</b-col>
		</b-row>
	</b-container>
</div>
</template>

<script>
export default {
	props: [
		"requestAnswer",
		"initialList",
		"initialKValue"
	],
	data() {
		return {
			rows: 0,
			rowValues: [],
			kValues: [],
			elementSelected: undefined
		}
	},
	methods: {
		addNewLine() {
			let tempList = [];
			if (this.rows > 0) tempList = this.rowValues[this.rows - 1];
			else tempList = this.initialList;
			this.rows++;
			tempList = JSON.parse(JSON.stringify(tempList));
			this.rowValues.push(tempList);
			this.kValues.push(0);
		},
		removeLastLine() {
			if (this.rows > 0) {
				this.rows--;
				this.rowValues.pop();
				this.kValues.pop();
			}
		},
		elementClicked(row, index) {
			if (!this.elementSelected) {
				this.elementSelected = {
					row: row,
					element: index
				}
			} else if (this.elementSelected.row === row) {
				if (this.elementSelected.element != index) {
					row = this.rowValues[row];
					let temp = row[index];

					row[index] = row[this.elementSelected.element];
					row[this.elementSelected.element] = temp;
					
					this.elementSelected = undefined;

					this.$forceUpdate();
				}
			} else {
				this.elementSelected = {
					row: row,
					element: index
				}
			}
		}
	},
	computed: {
		getRowValues: function(row) {
			return row => {
				return this.rowValues[row];
			}
		},
		checkIfSelected: function() {
			return (row, element) => {
				if (this.elementSelected === undefined) return false;
				if (
					this.elementSelected.row === row &&
					this.elementSelected.element === element
				) return true;
			}
		}
	},
	watch: {
		requestAnswer: function() {
			let response = [];

			response.push({
				Type: "Initial",
				K: this.initialKValue,
				List: this.initialList
			})

			for (let i = 0; i < this.rowValues.length; i++) {
				response.push({
					Type: "Step",
					K: this.kValues[i],
					List: this.rowValues[i]
				});
			}

			this.$emit("getTextResponse", response);
		}
	}
};
</script>

<style scoped>
input {
	width: 80px;
	text-align: center;
	margin: 0;
}
#ShellsortMainContainer {
	overflow-x: scroll;
	overflow-y: scroll;
	max-height: 400px;
	border: 1px solid black;
	text-align: center;
}
.shellsortColKvalue {
	min-width: 100px;
	max-width: 100px;
	text-align: center;
	float: left;
	margin: 0;
}
.shellsortColElement {
	min-width: 90px;
	max-width: 90px;
	text-align: center;
	float: left;
	margin: 0;
}
.shellsortRow {
	flex-wrap: nowrap;
}
.selected {
	background-color: black;
	color: white;
}
</style>
