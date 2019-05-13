<!--
	Component name: SessionsOverview
	Use case:
		- Let the user stop/rejoin a session
		- Let the user start a new session
-->

<template>
	<b-container class="session px-0">
		<b-row>
			<b-col cols="8">
				<b-form-select
					id="courseSelect"
					:options="getSessions"
					v-model="selectedSession"
				>
					<template slot="first" v-if="getSessions.length === 0">
						<option value="" disabled>{{
							getLocale.noSessionText
						}}</option>
					</template>
				</b-form-select>
			</b-col>
			<b-col cols="3">
				<b-button
					block
					@click="initializeSession(selectedSession)"
					variant="primary"
				>
					{{ getLocale.startBtn }}
				</b-button>
			</b-col>
		</b-row>
		<b-row v-if="showError" class="mt-3">
			<b-col cols="6">
				<b-alert show variant="danger">
					{{ getLocale[showErrorText] }}
				</b-alert>
			</b-col>
			<b-col cols="3">
				<b-button block variant="success" @click="rejoin">
					{{ getLocale.rejoinBtn }}
				</b-button>
			</b-col>
			<b-col cols="3">
				<b-button block variant="danger" @click="clearActiveSession">
					{{ getLocale.clearBtn }}
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
			selectedCourse: "",

			showError: false,
			showErrorText: "",

			activeSessionCode: undefined
		};
	},
	created() {
		let courseId = this.$store.getters.getSelectedCourse;
		this.$socket.emit("sessionOverviewRequest", courseId);
	},
	sockets: {
		initializeSessionResponse: function(sessionId) {
			this.$router.push(`/admin/session/${sessionId}`);
		},
		initializeSessionErrorResponse: function(data) {
			if (data.error === 1) {
				// This error is given if you have a session running
				this.activeSessionCode = data.sessionCode;
				this.showErrorText = "errorActiveSessionRunning";
				this.showError = true;
			}
		},
		sessionOverviewResponse: function(sessions) {
			if (sessions.length !== 0) {
				this.sessionList = sessions;
				this.selectedSession = sessions[0].value;
			} else {
				this.sessionList = [];
				this.selectedSession = "";
			}
		}
	},
	methods: {
		initializeSession: function(sessionId) {
			this.$socket.emit("initializeSession", sessionId);
		},
		courseChanged: function(newCourse) {
			this.$socket.emit("sessionOverviewRequest", newCourse);
		},
		rejoin: function() {
			if (this.activeSessionCode === undefined) return;
			this.$router.push(`/admin/session/${this.activeSessionCode}`);
		},
		clearActiveSession: function() {
			this.$socket.emit("adminEndSession");
			this.showError = false;
			this.showErrorText = "";
			this.activeSessionCode = undefined;
		}
	},
	computed: {
		getSessions: function() {
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
