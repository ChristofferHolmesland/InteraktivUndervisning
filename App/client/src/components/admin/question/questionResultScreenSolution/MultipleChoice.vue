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
				<div :class="getBackgroundColorSolution(index)">
					<h3>{{ choice }}</h3>
				</div>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
export default {
	name: "MultipleChoiceSolution",
	props: {
		choices: Array,
		solutions: Array
	},
	methods: {
		getBackgroundColorSolution(id) {
			let returnvalue =
				this.solutions.indexOf(id.toString()) > -1
					? "solution"
					: "wrong";
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
.solution {
	background-color: #6fef8a;
	border: 3px solid black;
}
.wrong {
	background-color: #f74c5c;
	border: 3px solid rgba(0, 0, 0, 0);
}
</style>
