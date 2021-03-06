import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		user: {
			username: "",
			feideId: "",
			userRights: ""
		},
		adminSubjects: [],
		loggedIn: false,
		locale: {
			locale: undefined,
			localeList: undefined
		},
		courseList: [],
		selectedCourse: "",
		questionTypes: []
	},
	mutations: {
		setSelectedCourse(state, data) {
			state.selectedCourse = data;
		},
		setCourseList(state, data) {
			if (data.length === 0) return;
			state.selectedCourse = data[0].value;
			state.courseList = data;
		},
		setQuestionTypes(state, data) {
			state.questionTypes = data;
		},
		localeChange(state, data) {
			state.locale = data;
		},
		userChange(state, data) {
			if (data.loggedIn) state.loggedIn = data.loggedIn;
			else {
				state.user.username = "";
				state.user.feideId = "";
				state.user.userRights = 0;
				state.loggedIn = false;
				state.adminSubjects = [];
				return;
			}
			if (data.adminSubjects) state.adminSubjects = data.adminSubjects;
			if (data.username) state.user.username = data.username;
			if (data.feideId) state.user.feideId = data.feideId;
			if (data.userRights) state.user.userRights = data.userRights;
		}
	},
	actions: {},
	getters: {
		getLocale: (state) => (page) => {
			return state.locale.locale[page];
		},
		getLocaleList: (state) => {
			return state.locale.localeList;
		},
		getUser: (state) => (data) => {
			let response = {};
			if (data.username) response.username = state.user.username;
			if (data.feideId) response.feideId = state.user.feideId;
			if (data.userRights) response.userRights = state.user.userRights;
			if (data.loggedIn) response.loggedIn = state.loggedIn;
			if (data.adminSubjects) {
				if (
					state.user.userRights > 1 &&
					state.adminSubjects.length > 0
				) {
					response.adminSubjects = state.adminSubjects;
				}
			}
			return response;
		},
		getCourseOptions: (state, getters) => {
			let list = [];
			for (let i = 0; i < state.courseList.length; i++) {
				let course = state.courseList[i];
				list.push({
					value: course.courseId,
					text:
						course.code +
						" " +
						getters.getLocale("AddNewCourse")[course.season] +
						" " +
						course.year
				});
			}
			return list;
		},
		getSelectedCourse: (state) => {
			return state.selectedCourse;
		},
		getQuestionTypes: (state) => {
			return state.questionTypes;
		}
	}
});
