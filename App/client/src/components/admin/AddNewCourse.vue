<template>
<b-modal    id="newCourseModal"
			:ref="elementRef"
			:no-close-on-backdrop="true"
			:title="getLocale.title"
			@ok="addCourse"
			style="text-align: left;">
	
	<b-alert :show="showError" variant="danger" dismissible>
		<p>{{getLocale.errorMessage[errorText]}}</p>
	</b-alert>
	<b-form-group 	id="courseName">
		<h4>{{ getLocale.name }}</h4>
		<b-form-input 	id="courseNameInput"
						type="text"
						v-model="newCourse.name">
		</b-form-input>
	</b-form-group>
	<b-form-group 	id="courseCode">
		<h4>{{ getLocale.code }}</h4>
		<b-form-select  :options="getCourseCodes"
						v-model="newCourse.code"
						id="courseCodeSelect">

		</b-form-select>
		&nbsp;
		<b-container class="px-0">
			<b-row @click="changeShowAddNewCourseCode" style="cursor: pointer;">
				<b-col cols="8" data-cy="addCourseCodeField">
					<h6>{{ getLocale.addNewCourseCode }}</h6>
				</b-col>
				<b-col cols="4" style="text-align: right;">
					<p v-if="showAddNewCourseCode">^</p>
					<p v-else>V</p>
				</b-col>
			</b-row>
			<b-row v-if="showAddNewCourseCode">
				<b-col cols="9">                   
					<b-form-input 	id="addCourseCodeInput"
									type="text"
									v-model="newCourseCode">
					</b-form-input>
				</b-col>
				<b-col cols="3" style="text-align: right;">
					<b-button @click="addNewCourseCode">{{getLocale.add}}</b-button>
				</b-col>
			</b-row>
		</b-container>
	</b-form-group>									
	<b-form-group 	id="courseSemester">
		<h4>{{ getLocale.semester }}</h4>
		<b-form-select  :options="getSemesters"
						v-model="newCourse.semester"
						id="courseSemesterSelect">

		</b-form-select>
		&nbsp;
		<b-container class="px-0">
			<b-row @click="changeShowAddNewSemester" style="cursor: pointer;">
				<b-col cols="8" data-cy="addSemesterField">
					<h6>{{ getLocale.addNewSemester }}</h6>
				</b-col>
				<b-col cols="4" style="text-align: right;">
					<p v-if="showAddNewCourseCode">^</p>
					<p v-else>V</p>
				</b-col>
			</b-row>
			<b-row v-if="showAddNewSemester">
				<b-container>
					<b-row>
						<b-col>
							<h6>{{ getLocale.AddNewSemesterSeason }}</h6>
						</b-col>
					</b-row>
				</b-container>
				<b-col cols="12">                   
					<b-form-select  :options="getSeasons"
									v-model="selectedSeason"
									id="courseSeasonSelect">
					</b-form-select>
				</b-col>
			</b-row>
			<b-row v-if="showAddNewSemester">
				<b-container>
					<b-row>
						<b-col>
							<h6>{{ getLocale.AddNewSemesterYear }}</h6>
						</b-col>
					</b-row>
				</b-container>
				<b-col cols="12">                   
					<b-form-select  :options="getYears"
									v-model="selectedYear"
									id="courseYearSelect">
					</b-form-select>
				</b-col>
			</b-row>
			&nbsp;
			<b-row v-if="showAddNewSemester">
				<b-col cols="12" style="text-align: center;">
					<b-button @click="addNewSemester" class="addSemesterBtn">{{getLocale.add}}</b-button>
				</b-col>
			</b-row>
		</b-container>
	</b-form-group>
</b-modal>
</template>

<script>
let initializeState = function() {
	return {
		newCourse: {
			code: "",
			semester:"" ,
			name: ""
		},
		seasons: [],
		years: [],
		semesters: [],
		courseCodes: [],
		showAddNewCourseCode: false,
		showAddNewSemester: false,
		newCourseCode: "",
		errorText: "",
		showError: false,
		courseCodeAdded: false,
		selectedSeason: "",
		selectedYear: ""
	}
};

export default {
	name: "AddNewCourse",
	props: ["elementRef", "callOkHandler"],
	data() {
		return initializeState();
	},
	mounted() {
		this.$root.$on("bv::modal::show", () => {
			this.assignState();
			this.getNewData();
		});
	},
	created() {
		this.getNewData();
	},
	computed: {
		getLocale() {
			let locale = this.$store.getters.getLocale("AddNewCourse");
			if (locale) return locale;
			else return {};
		},
		getCourseCodes() {
			let list = [];
			for(let i = 0; i < this.courseCodes.length; i++) {
				let courseCode = this.courseCodes[i];
				list.push({
					value: courseCode.id,
					text: courseCode.code
				});
			}

			if (
				this.newCourse.code === "" &&
				this.courseCodes.length > 0
			) this.newCourse.code = list[0].value;

			return list;
		},
		getSemesters() {
			let list = [];
			for(let i = 0; i < this.semesters.length; i++) {
				let semester = this.semesters[i];
				list.push({
					value: semester.id,
					text: semester.year + " " + this.getLocale[semester.season]
				});
			}

			if (
				this.newCourse.semester === "" &&
				this.semesters.length > 0
			) this.newCourse.semester = list[0].value;

			return list;
		},
		getSeasons() {
			let list = [];
			for(let i = 0; i < this.seasons.length; i++) {
				let season = this.seasons[i];
				list.push({
					value: season.id,
					text: this.getLocale[season.season]
				});
			}

			if (this.seasons.length > 0) this.selectedSeason = list[0].value;

			return list;
		},
		getYears() {
			let list = [];
			for(let i = 0; i < this.years.length; i++) {
				let year = this.years[i];
				list.push({
					value: year.id,
					text: year.year
				});
			}

			if (this.years.length > 0) this.selectedYear = list[0].value;

			return list;
		}
	},
	methods: {
		addCourse: function(e) {
			e.preventDefault();
			
			if (this.newCourse.name === "" || this.newCourse.name === undefined) {
				this.errorText = "nameMissing";
				this.showError = true;
				return;
			}

			if (this.semesters.findIndex(semester => semester.id === this.newCourse.semester) === -1) {
				this.errorText = "semesterDoesnTExist";
				this.showError = true;
				return;
			}

			if (this.courseCodes.findIndex(courseCode => courseCode.id === this.newCourse.code) === -1) {
				this.errorText = "courseCodeDoesnTExist";
				this.showError = true;
				return;
			}

			this.$socket.emit("createCourseRequest", this.newCourse);
		},
		getNewData: function() {
			this.$socket.emit("semestersRequest");
			this.$socket.emit("seasonsRequest");
			this.$socket.emit("yearsRequest");
			this.$socket.emit("courseCodesRequest");
		},
		changeShowAddNewCourseCode: function() {
			this.showAddNewCourseCode = !this.showAddNewCourseCode;
		},
		changeShowAddNewSemester: function() {
			this.showAddNewSemester = !this.showAddNewSemester;
		},
		addNewCourseCode: function() {
			if (this.newCourseCode === "" || this.newCourseCode === undefined) {
				this.errorText = "courseCodeMissing";
				this.showError = true;
				return;
			}

			let pattern = new RegExp("^[A-Z]{3}[0-9]{3}$");
			if (!pattern.test(this.newCourseCode)) {
				this.errorText = "courseCodeWrongPattern";
				this.showError = true;
				return;
			}

			if (this.courseCodes.findIndex(code => code.code === this.newCourseCode) > -1) {
				this.errorText = "courseCodeExists";
				this.showError = true;
				return;
			}

			this.$socket.emit("addNewCourseCodeRequest", this.newCourseCode);
		},
		addNewSemester: function() {
			if (this.semesters.findIndex(semester => 
				(
					semester.season === this.selectedSeason &&
					semester.year === this.selectedYear
				)
			) > -1) {
				this.errorText = "semesterExists";
				this.showError = true;
				return;
			}

			if (this.seasons.findIndex(season => season.season === this.selectedSeason) > -1) {
				this.errorText = "seasonDoesTExist";
				this.showError = true;
				return;
			}
					
			if (this.years.findIndex(year => year.year === this.selectedYear) > -1) {
				this.errorText = "yearDoesTExist";
				this.showError = true;
				return;
			}

			this.$socket.emit("addNewSemesterRequest", {
				season: this.selectedSeason,
				year: this.selectedYear
			});
		},
		assignState() {
			let n = initializeState();
			for (let p in n) {
				if (n.hasOwnProperty(p)) {
						this.$data[p] = n[p];
				}
			}
			this.$nextTick();
		},
	},
	sockets: {
		semestersResponse: function(data) {
			this.semesters = data;
			if (this.semesterAdded) {
				this.newCourse.semester = this.semesters[this.semesters.length - 1].id;
				this.semesterAdded = false;
				this.showAddNewSemester = false;
			}
		},
		semestersError: function() {

		},
		seasonsResponse: function(data) {
			this.seasons = data;
		},
		seasonsError: function() {

		},
		yearsResponse: function(data) {
			this.years = data;
		},
		yearsError: function() {

		},
		courseCodesResponse: function(data) {
			this.courseCodes = data;
			if (this.courseCodeAdded) {
				this.newCourse.code = this.courseCodes[this.courseCodes.length - 1].id;
				this.courseCodeAdded = false;
				this.newCourseCode = "";
				this.showAddNewCourseCode = false;
			}
		},
		courseCodesError: function() {

		},
		addNewCourseCodeResponse: function() {
			this.$socket.emit("courseCodesRequest");
			this.courseCodeAdded = true;
		},
		addNewCourseCodeError: function(error) {
			this.errorText = error;
			this.showError = true;
		},
		addNewSemesterResponse: function() {
			this.$socket.emit("semestersRequest");
			this.semesterAdded = true;
		},
		addNewSemesterError: function(error) {
			this.errorText = error;
			this.showError = true;
		},
		createCourseResponse: function() {
			this.$socket.emit("courseListRequest");
			this.$refs[this.elementRef].hide();
		},
		createCourseError: function(error) {
			this.errorText = error;
			this.showError = true;
		},
	}
}
</script>

<style scoped>
.addSemesterBtn {
	width: 300px;
}
</style>
