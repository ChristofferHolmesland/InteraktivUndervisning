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
        props: {
            changeHandler: Function
        },
        created() {
            this.selectedCourse = this.$store.getters.getSelectedCourse;
        },
        watch: {
            _watcherSelectedCourse: function(newCourse, oldCourse) {
                if (newCourse != oldCourse) {
                    this.selectedCourse = newCourse;
                }
            }
        },
        methods: {
            selectedCourseChanged(event) {
                this.$store.commit("setSelectedCourse", event);
              
                if (this.changeHandler != undefined) {
                    this.changeHandler(event);
                }
            }
        },
        computed: {
            getCourseOptions: function() {
                return this.$store.getters.getCourseOptions;
            },
            _watcherSelectedCourse() {
                return this.$store.getters.getSelectedCourse;
            }
        }
    }

</script>

<style scoped>
</style>