<template>
    <b-container style="overflow-x: scroll;">
		<b-row>
			<b-col cols="2">
				K Value
			</b-col>
			<b-col v-for="(value, index) in answer[0].List" :key="index">
				{{ index }}
			</b-col>
		</b-row>
		<b-row v-for="(row, index) in answer" :key="index" class="mb-1" style="text-align:center;">
            <b-col cols="2" class="px-0 mx-1">
                <input type="text" disabled :value="row.K">
            </b-col>
            <b-col v-for="(value, index) in row.List" :key="index" class="px-0 mx-1">
                <input type="text" disabled :value="value">
            </b-col>
		</b-row>
	</b-container>
</template>

<script>
export default {
    name: "ShellsortAnswer",
    props: {
        answer: Array
	}
}
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
