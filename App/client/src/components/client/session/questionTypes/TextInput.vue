<template>
    <div id="TextInput">
        <b-container>
            <b-form-input v-model="inputText" type="text" :placeholder="getLocale.inputPlaceholder">
            </b-form-input>
        </b-container>
    </div>
</template>

<script>
	export default {
		name: "TextInput",
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
        },
        computed: {
            getLocale() {
                let locale = this.$store.getters.getLocale("ClientSessionTextInput");
                if(locale) return locale;
                return {};
            }
        }
	}
</script>