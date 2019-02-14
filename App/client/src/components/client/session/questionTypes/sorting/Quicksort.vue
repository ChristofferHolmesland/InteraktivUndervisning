<template>
    <div id="Quicksort">
        <GraphDrawer controlType="Sort" sortType="Quicksort" 
                    :steps="steps" :requestAnswer="requestAnswerFromDrawer" 
                    @getValueResponse="getValueResponse"/>
    </div>
</template>

<script>
    import GraphDrawer from "../../../graphDrawer/GraphDrawer.vue"

	export default {
		name: "Quicksort",
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