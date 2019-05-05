<template>
	<b-container class="session px-0">
		<b-row>
			<b-col cols="8">
				<b-form-select 	id="courseSelect"
								:options="getSessions"
								v-model="selectedSession">
					<template slot="first" v-if="getSessions.length === 0">
        				<option value="" disabled>{{ getLocale.noSessionText }}</option>
					</template>
				</b-form-select>
			</b-col>
			<b-col cols="3">
				<b-button block @click="initializeSession(selectedSession)" variant="primary">
					{{ getLocale.startBtn }}
				</b-button>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
export default {
	name: "session",
	data() {
		return {
			sessionList: [],
			selectedSession: "",
			selectedCourse: ""
		};
	},
	created() {
		let courseId = this.$store.getters.getSelectedCourse;
		this.$socket.emit("sessionOverviewRequest", courseId);
	},
	sockets: {
		initializeSessionResponse(sessionId) {
			this.$router.push(`/admin/session/${sessionId}`);
		},
		initializeSessionErrorResponse() {
			// TODO add logic to error handling
		},
		sessionOverviewResponse(sessions) {
			if (sessions.length !== 0) {
				this.sessionList = sessions;
				this.selectedSession = sessions[0].value;
			}
		},
		sessionOverviewErrorResponse() {
			// TODO add logic to error handling
		}
	},
	methods: {
		initializeSession(sessionId) {
			this.$socket.emit("initializeSession", sessionId);
		},
		courseChanged(newCourse) {
			this.$socket.emit("sessionOverviewRequest", newCourse);
		}
	},
	computed: {
		getSessions() {
			if (this.sessionList === undefined) return [];
			return this.sessionList;
		},
		getSelectedCourse() {
			return this.$store.getters.getSelectedCourse;
		},
		getLocale: function() {
			let locale = this.$store.getters.getLocale("AdminSessionOverview");
			if (locale) return locale;
			else return {};
		}
	},
	watch: {
		getSelectedCourse: function(newCourse) {
			this.courseChanged(newCourse);
		}
	}
};
</script>
