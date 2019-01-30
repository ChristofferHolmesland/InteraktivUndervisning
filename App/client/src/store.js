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
		adminSubjects: [
			{ subjectName: "DAT110", userRights: 3 },
			{ subjectName: "DAT200", userRights: 4 }
		],
		loggedIn: false,
		locale: {
			locale: undefined,
			localeList: undefined
		},
		courseList: [],
		selectedCourse: ""
	},
	mutations: {
		setSelectedCourse(state, data) {
			state.selectedCourse = data;
		},
		setCourseList(state, data) {
			state.selectedCourse = data[0].value;
			state.courseList = data;
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
				return;
			}
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
				if (state.user.userRights > 1 && state.adminSubjects.length > 0) {
					response.adminSubjects = state.adminSubjects;
				}
			}
			return response;
		},
		getCourseOptions: (state) => {
			return state.courseList;
		},
		getSelectedCourse: (state) => {
			return state.selectedCourse;
		}
	}
});
