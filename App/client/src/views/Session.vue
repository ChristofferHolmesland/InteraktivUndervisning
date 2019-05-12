<template>
	<div id="session">
		<WaitingRoom v-if="state === 1" :sessionId="sessionId"/>
		<Question v-if="state === 2" :sessionId="sessionId" :questionInfo="questionInfo"/>
		<QuestionResultScreen v-if="state === 3" :sessionId="sessionId" :resultInfo="resultInfo"/>
		<SessionOverScreen v-if="state === 4" :sessionId="sessionId" :noUsers="noUsers"/>
	</div>
</template>

<script>
import WaitingRoom from "../components/admin/startSession/WaitingRoom.vue";
import Question from "../components/admin/startSession/Question.vue";
import QuestionResultScreen from "../components/admin/startSession/QuestionResultScreen.vue";
import SessionOverScreen from "../components/admin/startSession/SessionOverScreen.vue";

export default {
	name: "session",
	props: ["sessionId"],
	data() {
		return {
			state: 0,
			questionInfo: undefined,
			resultInfo: undefined,
			noUsers: false
		};
	},
	created() {
		this.$socket.emit("verifyUserLevel", 3);
		this.$socket.emit("startSessionWaitingRoom", this.sessionId);
	},
	sockets: {
		startSessionWaitingRoomResponse: function() {
			this.state = 1;
		},
		nextQuestion: function(questionInfo) {
			this.questionInfo = questionInfo;
			this.state = 2;
		},
		goToQuestionResultScreen: function(resultInfo) {
			this.resultInfo = resultInfo;
			this.state = 3;
		},
		endSessionScreen: function() {
			this.state = 4;
		},
		startSessionError: function() {
			this.$router.push("/admin");
		},
		adminEndSessionResponse: function() {
			this.state = 4;
		},
		endSessionNoUsers: function() {
			this.noUsers = true;
			this.state = 4;
		}
	},
	methods: {
	},
	components: {
		WaitingRoom,
		Question,
		QuestionResultScreen,
		SessionOverScreen
	},
	computed: {
		getLocale: function() {
			return (localePage) => {
				let locale = this.$store.getters.getLocale(localePage);
				if (locale) return locale;
				else return {};
			}
		}
	},
	beforeDestroy() {
		if (this.state !== 4) {
			if (
				confirm(
					this.getLocale("ClientSessionQuestion")
						.leaveSessionBodyAdmin
				)
			) {
				this.$socket.emit("adminLeaveSession", this.sessionId);
			} else {
				this.$router.push("/admin/session/" + this.sessionId);
			}
		}
	}
};
</script>
