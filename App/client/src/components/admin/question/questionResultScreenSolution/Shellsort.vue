<template>
    <b-container id="ShellsortMainContainer">
		<b-row class="shellsortRow">
			<div 	class="shellsortColKvalue"
					>
				K Value
			</div>
			<div 	v-for="(value, index) in solution[1].List"
					:key="index"
					class="shellsortColElement"
					>
				{{ index }}
			</div>
		</b-row>
		<b-row 	v-for="(row, index) in solution"
				:key="index"
				class="mb-1 shellsortRow"
				>
            <div	class="shellsortColKvalue"
					>
                <input type="text" disabled :value="row.K">
            </div>
            <div 	v-for="(value, index) in row.List"
					:key="index"
					class="shellsortColElement"
					>
                <input type="text" disabled :value="value">
            </div>
		</b-row>
	</b-container>
</template>

<script>
export default {
    name: "ShellsortSolution",
    props: {
        solution: Array
	}
}
</script>

<style scoped>
input {
	width: 60px;
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
	width: 140px;
	width: 140px;
	text-align: center;
	float: left;
	margin: 0;
}
.shellsortColElement {
	width: 130px;
	width: 130px;
	text-align: center;
	float: left;
	margin: 0;
}
.shellsortRow {
	flex-wrap: nowrap;
}
</style>
