<template>
    <div id="questionClientResult">
        <b-container>
            <b-row>
                <b-col>Result</b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
	export default {
		name: "ClientResult",
        props: [
        	"quizCode",
        	"answerinfo"
        ]
	}
</script>

<style scoped>

</style>