<template>
	<b-container class="session">
		<b-row>
			<b-col cols="10">
                <b-form-select 	id="courseSelect"
                                :options="getSessions"
                                v-model="selectedSession">
                </b-form-select>
			</b-col>
            <b-col cols="2" class="pl-0">
                <b-button @click="initializeSession(selectedSession)">
                    Start
                </b-button>
            </b-col>
		</b-row>
	</b-container>
</template>

<script>
import SelectCourse from "../SelectCourse.vue";

export default {
	name: "session",
	data() {
		return {
            sessionList: undefined,
            selectedSession: undefined,
            selectedCourse: undefined
		};
	},
	created() {
		let c = this.$store.getters.getSelectedCourse.split(" ");
		this.$socket.emit("sessionOverviewRequest", {
			code: c[0],
			semester: c[1]
		});
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
			let c = newCourse.split(" ");
			this.$socket.emit("sessionOverviewRequest", {
				code: c[0],
				semester: c[1]
			});
		}
	},
	computed: {
		getSessions() {
            if (this.sessionList === undefined) return [];
			return this.sessionList;
        },
        SelectedCourse() {
			return this.$store.getters.getSelectedCourse;
		}
    },
	watch: {
		selectedCourse(newCourse, oldCourse) {
			this.courseChanged(newCourse);
		}
	},
};
</script>
