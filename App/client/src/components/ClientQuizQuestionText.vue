<template>
    <div id="TextInputField">
        <b-container>
            <b-form-input v-model="inputText" type="text" placeholder="Skriv inn svar">
            </b-form-input>
        </b-container>
    </div>
</template>

<script>
	export default {
         data() {
            return{
                inputText: ""
            }
        },
        props: [
        	"requestAnswer"
        ],
		name: "ClientQuizQuestion",
        watch: {
         	requestAnswer: function () {
         		console.log("I am watching you!");
                this.$emit("getTextResponse",this.inputText);
			}
        }
	}
</script>

<style scoped>

</style>