<template>
	<b-container id="multipleChoiceMainContainer">
		<b-row>
			<b-col v-for="choice in getChoices" 
					:key="choice.id" 
					class="choice" :id="choice.id"
					@click="selectChoice($event)"
					cols="12" lg="6"
			>
				<div class="selected">
					<div v-if="choice.selected">
						<p>X</p>
					</div>
				</div>
				{{ choice.text }}
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
	export default {
		name: "MultipleChoice",
		props: ["choices", "requestAnswer"],
		data() {
			return {
				edibleChoices: []
			}
		},
		created() {
			for (let i = 0; i < this.choices.length; i++){
				this.edibleChoices.push({text: this.choices[i], selected: false, id: i});
			}
		},
		watch: {
         	requestAnswer: function () {
				let response = [];
				for (let i = 0; i < this.edibleChoices.length; i++){
					if (this.edibleChoices[i].selected) response.push(this.edibleChoices[i].id);
				}
				this.$emit("getTextResponse", response);
			}	
		},
		methods: {
			selectChoice(event) {
				let id = event.target.id;
				this.edibleChoices[id].selected = !this.edibleChoices[id].selected;
			}
		},
		computed: {
			getChoices() {
				return this.edibleChoices;
			}
		}
	}
</script>

<style scoped>
	.choice {
		float: left;
		width: 40%;
		min-height: 10em;
		margin: 3em auto 0 auto;
		background-color: #337ab7;
		box-shadow: 0 0 5px -1px rgba(0,0,0,0.2);
    	cursor:pointer;
		padding: 1em;
		text-align: center;
	}
	.selected {
		border: 2px solid;
		height: 1em;
		width: 1em;
	}
</style>