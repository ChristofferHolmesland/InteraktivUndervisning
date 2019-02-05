<template>
    <div id="MergeSort">
        <b-table :fields="fields" :items="items">
            <template slot="blank" slot-scope="data">
                Step {{ data.index }}
            </template>
            <template slot="index{{ data.index }}" slot-scope="data">
                {{ data.index }} hei
            </template>
        </b-table>
    </div>
</template>

<script>
	export default {
        name: "MergeSort",
        data() {
            return {
                items: []
            }
        },
        computed: {
            fields: function() {
                let fields = [{key: "blank", label=""}];
                for(let i = 0; i < this.items.length; i++) {
                    fields.push({
                        name: "index" + i,
                        label: i
                    });
                }
                return fields;
            }
        }
	}
</script>

<style scoped>

</style>