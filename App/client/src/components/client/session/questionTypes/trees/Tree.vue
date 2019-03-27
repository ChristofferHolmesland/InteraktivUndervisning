<template>
    <div id="Tree">
        <b-container>
            <GraphDrawer
                    @getValueResponse="gotGraphDrawer"
                    :requestAnswer = requestAnswerFromGraphDrawer
                    controlType="Graph0"
                    operationMode="Interactive"
                    exportType="Tree"
            />
        </b-container>
    </div>
</template>

<script>
	import GraphDrawer from "../../../../graphDrawer/GraphDrawer";
	export default {
		name: "Tree",
		data() {
			return {
				requestAnswerFromGraphDrawer: false
			}
		},
        props: ["requestAnswer"],
        methods: {
			gotGraphDrawer: function (result) {
                this.$emit("getTextResponse",result);
			}
        },
		watch: {
			requestAnswer: function() {
				this.requestAnswerFromGraphDrawer = !this.requestAnswerFromGraphDrawer;
			}
		},
		components: {
			GraphDrawer
		}
	}
</script>

<style scoped>

</style>