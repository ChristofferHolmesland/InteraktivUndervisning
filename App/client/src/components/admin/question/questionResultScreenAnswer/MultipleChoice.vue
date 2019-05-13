<template>
	<b-container>
		<b-row>
			<b-col
				v-for="(choice, index) in choices"
				:key="index"
				:id="index"
				cols="12"
				lg="6"
				class="choice"
			>
				<div
					:class="
						getBackgroundColorAnswer(index)
							? 'selectedContainer'
							: ''
					"
				>
					<h3>{{ choice }}</h3>
				</div>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
export default {
	name: "MultipleChoiceAnswer",
	props: {
		choices: Array,
		answers: Array
	},
	methods: {
		getBackgroundColorAnswer(id) {
			let returnvalue = this.answers.indexOf(id) > -1 ? true : false;
			return returnvalue;
		}
	}
};
</script>

<style scoped>
.choice {
	float: left;
	width: 40%;
	min-height: 5em;
	margin: 2em auto 0 auto;
	border: 3px solid rgba(0, 0, 0, 0);
	box-shadow: 0 0 5px -1px rgba(0, 0, 0, 0.2);
	padding: 1em;
	text-align: center;
}
.selectedContainer {
	position: relative;
	background-color: #1f85de;
	border: 3px solid black;
}
.selected {
	position: absolute;
	top: 10px;
	left: 10px;
}
</style>
