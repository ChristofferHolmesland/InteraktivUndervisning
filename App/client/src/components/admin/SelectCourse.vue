<!--
	Component name: SelectCourse
	Use case:
		- Let the user change the displayed course.
-->

<template>
	<b-form-select
		id="courseSelect"
		:options="getCourseOptions"
		v-model="selectedCourse"
		@change="selectedCourseChanged($event)"
	>
		<template slot="first" v-if="getCourseOptions.length === 0">
			<option value="" disabled>{{ getLocale.noCourseText }}</option>
		</template>
	</b-form-select>
</template>

<script>
export default {
	name: "SelectCourse",
	data() {
		return {
			selectedCourse: ""
		};
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
		},
		getCourseOptions: function(newList, oldList) {
			let changed = false;
			if (newList.length !== oldList.length) changed = true;
			else {
				for (let i = 0; i < newList.length; i++) {
					if (newList[i] !== oldList[i]) {
						changed = true;
						break;
					}
				}
			}
			if (changed) {
				if (oldList.length > 0 && newList.length > oldList.length)
					this.selectedCourseChanged(
						newList[newList.length - 1].value
					);
				else this.selectedCourseChanged(newList[0].value);
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
		},
		getLocale() {
			let locale = this.$store.getters.getLocale("SelectCourse");
			if (locale) return locale;
			else return {};
		}
	}
};
</script>
