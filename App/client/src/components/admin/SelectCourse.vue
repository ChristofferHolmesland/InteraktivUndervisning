<template>
    <b-form-select 	id="courseSelect"
            :options="getCourseOptions"
            v-model="selectedCourse"
            @change="selectedCourseChanged($event)">
    </b-form-select>
</template>

<script>
	export default {
        name: 'SelectCourse',
        data() {
            return {
                selectedCourse: ""
            }
        },
        created() {
            this.selectedCourse = this.$store.getters.getSelectedCourse;
        },
        methods: {
            selectedCourseChanged(event) {
                this.$store.commit("setSelectedCourse", event);
            }
        },
        computed: {
            getCourseOptions: function() {
                return this.$store.getters.getCourseOptions;
            }
        }
    }

</script>

<style scoped>
</style>