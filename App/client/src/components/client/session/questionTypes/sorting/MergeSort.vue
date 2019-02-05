<template>
    <div id="MergeSort">
        <b-table :fields="fields" :items="items">

        </b-table>
    </div>
</template>

<script>
	export default {
        name: "MergeSort",
        data() {
            return {
                fields: [],
                items: []
            }
        },
        computed: {
            fields: function() {
                
            }
        }
	}
</script>

<style scoped>

</style>