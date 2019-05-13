<template>
	<b-container id="ShellsortMainContainer">
		<b-row class="shellsortRow">
			<div class="shellsortColKvalue">
				{{ getLocale.shellsortKValue }}
			</div>
			<div
				v-for="(value, index) in answer[0].List"
				:key="index"
				class="shellsortColElement"
			>
				{{ index }}
			</div>
		</b-row>
		<b-row
			v-for="(row, index) in answer"
			:key="index"
			class="mb-1 shellsortRow"
		>
			<div class="shellsortColKvalue">
				<input type="text" disabled :value="row.K" />
			</div>
			<div
				v-for="(value, index) in row.List"
				:key="index"
				class="shellsortColElement"
			>
				<input type="text" disabled :value="value" />
			</div>
		</b-row>
	</b-container>
</template>

<script>
export default {
	name: "ShellsortAnswer",
	props: {
		answer: Array
	},
	computed: {
		getLocale: function() {
			let locale = this.$store.getters.getLocale("DisplayQuestion");
			if (locale) return locale;
			else return {};
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
</style>
