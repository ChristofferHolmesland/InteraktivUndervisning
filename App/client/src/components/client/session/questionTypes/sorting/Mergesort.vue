<template>
    <div id="Mergesort">
        <GraphDrawer controlType="Sort" sortType="Mergesort" 
                    :steps="steps" :requestAnswer="requestAnswerFromDrawer" 
                    @getValueResponse="getValueResponse"/>
    </div>
</template>

<script>
    import GraphDrawer from "../../../graphDrawer/GraphDrawer.vue"

	export default {
		name: "Mergesort",
        data() {
            return{
                requestAnswerFromDrawer: false
            }
        },
        components: {
            GraphDrawer
        },
        props: [
            "requestAnswer",
            "steps"
        ],
        methods: {
            getValueResponse: function(value) {
                this.$emit("getTextResponse", value);
            }
        },
        watch: {
         	requestAnswer: function () {
                this.requestAnswerFromDrawer = !this.requestAnswerFromDrawer;
			}
        }
	}
</script>