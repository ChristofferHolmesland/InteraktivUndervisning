<template>
    <div id="Text">
        <b-container>
            <b-form-input v-model="inputText" type="text" :placeholder="getLocale.inputPlaceholder">
            </b-form-input>
        </b-container>
    </div>
</template>

<script>
	export default {
		name: "ClientSessionQuestion",
        data() {
            return{
                inputText: ""
            }
        },
        props: [
        	"requestAnswer"
        ],
        watch: {
         	requestAnswer: function () {
                this.$emit("getTextResponse",this.inputText);
			}
        }
	}
</script>