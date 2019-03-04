<template>
    <div id="Tree">
        <b-container>
            <!--Not sure what control type to use here -->
            <GraphDrawer
                    @getValueResponse="gotGraphDrawer"
                    :requestAnswer = requestAnswerFromGraphDrawer
                    controlType="Graph0"
                    operationMode="Interactive"
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
		components: {
			GraphDrawer
		},
		watch: {
			requestAnswer: function() {
				this.requestAnswerFromGraphDrawer = !this.requestAnswerFromGraphDrawer;
			}
		}
	}
</script>

<style scoped>

</style>