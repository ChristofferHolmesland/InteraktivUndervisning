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
			{subjectName: "DAT110", userRights: "Admin"},
			{subjectName: "DAT200", userRights: "Student Assistant"}
		],
		loggedIn: false,
		locale: {
			locale: undefined,
			localeList: undefined
		}
	},
	mutations: {
		localeChange(state, data){
			state.locale = data;
		},
		userChange(state, data){
			if(data.loggedIn) state.loggedIn = data.loggedIn;
			else {
				state.user.username = "";
				state.user.feideId = "";
				state.user.userRights = 0;
				state.loggedIn = false;
				return;
			};
			if(data.username) state.user.username = data.username;
			if(data.feideId) state.user.feideId = data.feideId;
			if(data.userRights) state.user.userRights = data.userRights;
			if(data.adminSubjects) state.user.adminSubjects = data.adminSubjects
		}
	},
	actions: {

	},
	getters: {
		getLocale: (state) => (page) => {
			return state.locale.locale[page];
		},
		getLocaleList: (state) => {
			return state.locale.localeList;
		},
		getUser: (state) => (data) => {
			let response = {};
			if(data.username) response.username = state.user.username;
			if(data.feideId) response.feideId = state.user.feideId;
			if(data.userRights) response.userRights = state.user.userRights;
			if(data.loggedIn) response.loggedIn = state.loggedIn;
			if(data.adminSubjects) {
				if(state.user.userRights > 1 && state.adminSubjects.length > 0){
					response.adminSubjects = state.adminSubjects;
				}
			}
			return response;
		}
	}
});
