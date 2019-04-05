<template>
<b-container>
	<b-row>
		<b-col cols="12" lg="8">
			<b-row>
				<b-col>
					<b-button @click="returnToClientDashboard">Go back</b-button>
				</b-col>
				<b-col>
                    <b-form-select 	id="solutionTypeInput"
                                    :options="questionTypes"
                                    v-model="questionType">
                    </b-form-select>
				</b-col>
			</b-row>
			<b-row>
				<b-col>
					<b-container class="px-0" v-if="questionType === 'Text'">
						<b-row>
							Input for text question
						</b-row>
					</b-container>
				</b-col>
			</b-row>
		</b-col>
		<b-col cols="12" lg="4">
			<b-row>
				<b-col>
					<b-row @click="changeShowSettings" class="cursor">
						<b-col>
							<h3>Settings</h3>
						</b-col>
						<b-col>
							<p v-if="showSettings">V</p>
							<p v-else>^</p>
						</b-col>
					</b-row>
					<div v-show="showSettings">
						<b-container class="px-0" v-if="questionType === 'Text'">
							<b-row>
								Settings for text question
							</b-row>
						</b-container>
					</div>
				</b-col>
			</b-row>
			<b-row>
				<b-col>
					<b-row @click="changeShowGuide" class="cursor">
						<b-col>
							<h3>Guide</h3>
						</b-col>
						<b-col>
							<p v-if="showGuide">V</p>
							<p v-else>^</p>
						</b-col>
					</b-row>
					<div v-show="showGuide">
						<b-container class="px-0" v-if="questionType === 'Text'">
							<b-row>
								Guide for text question
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
export default {
	name: "Sandbox",
	data() {
		return {
			showSettings: true,
			showGuide: false,
			questionType: "Text",
			questionTypes: [
				"Text",
				"Multiple choice",
				"Shellsort",
				"Mergesort",
				"Quicksort",
				"Binarytree",
				"Binary search tree",
				"AVL tree",
				"Dijkstra",
				"Python"
			]
		};
	},
	methods: {
		returnToClientDashboard() {
			this.$router.push("/client");
		},
		changeShowSettings() {
			this.showSettings = !this.showSettings;
		},
		changeShowGuide() {
			this.showGuide = !this.showGuide;
		}
	}
};
</script>

<style scoped>
.cursor {
	cursor: pointer;
}
</style>
