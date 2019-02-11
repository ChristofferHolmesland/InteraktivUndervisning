<!--Component used for Insertion and Shell sorting -->
<template>
    <div id="array">
        <h1>Array</h1>
        <table class="table table-striped table-responsive">
            <thead>
            <tr>
                <th>Index</th>
                <th :key="n" v-for="n in items.length">{{n}}</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <th>Orignal Array</th>
                <td :key="item" v-for="item in items">{{item}}</td>
            </tr>
            <tr>
                <th>Shell sort, k = 5</th>
                <td :key="n" v-for="n in items.length"><b-input class="inputFields" type="text" v-model="answerArray[n-1]"></b-input></td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

	export default {
		data () {
			return {
				fields: [
					"Index","1","2","3","4","5","6","7","8"
				],
				items: [
					100,400,350,520,200
				],
				answerArray: []
			}
		},
        props: [
			"requestAnswer"
        ],
		watch: {
			requestAnswer: function () {
				this.$emit("getTextResponse",this.answerArray);
			}
		},
        computed: {
            //TODO Add getLocale
        }
	}


</script>

<style scoped>
    .inputFields {
        min-width: 60px;
        max-width: 100px;
    }
</style>