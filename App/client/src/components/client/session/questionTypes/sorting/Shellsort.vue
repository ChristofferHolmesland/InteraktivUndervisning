<template>
	<b-container>
		<b-row>
			<b-col cols="2">
				K Value
			</b-col>
			<b-col v-for="(value, index) in initialList" :key="index">
				{{ index }}
			</b-col>
		</b-row>
		<b-row class="mb-2">
			<b-col cols="2">
				<input type="text" disabled :value="initialKValue">
			</b-col>
			<b-col v-for="(value, index) in initialList" :key="index">
				<input type="text" disabled :value="value">
			</b-col>
		</b-row>
		<b-row v-for="row in rows" :key="row" class="mb-1">
			<b-col cols="2">
				<input type="text" placeholder="Enter k value" v-model="kValues[row - 1]">
			</b-col>
			<b-col v-for="(value, index) in getRowValues(row - 1)" :key="index" @click="elementClicked(row - 1, index)">
				<input type="text" disabled :value="value">
			</b-col>
		</b-row>
		<b-row class="mt-3">
			<b-col>
				<b-row>
					<b-col style="text-align: center;">
						<b-btn @click="addNewLine">Add new row</b-btn>
					</b-col>
					<b-col style="text-align: center;">
						<b-btn @click="removeLastLine">Remove last row</b-btn>
					</b-col>
				</b-row>
			</b-col>
		</b-row>
	</b-container>
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
		getRowValues(row) {
			return row => {
				return this.rowValues[row];
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
	width: 30px;
	text-align: center;
}
.col {
	text-align: center;
}
</style>
