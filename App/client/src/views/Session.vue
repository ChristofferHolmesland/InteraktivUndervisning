<template>
	<div id="session">
		<WaitingRoom v-if="state === 1" :sessionId="sessionId"/>
		<Question v-if="state === 2" :sessionId="sessionId" :questionInfo="questionInfo"/>
		<QuestionResultScreen v-if="state === 3" :sessionId="sessionId" :resultInfo="resultInfo"/>
		<SessionOverScreen v-if="state === 4" :sessionId="sessionId"/>
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
			resultInfo: undefined
		};
	},
	created() {
		this.$socket.emit("verifyUserLevel", 3);
		this.$socket.emit("startSessionWaitingRoom", this.sessionId);
	},
	sockets: {
		startSessionWaitingRoomResponse() {
			this.state = 1;
		},
		nextQuestion(questionInfo) {
			this.questionInfo = questionInfo;
			this.state = 2;
		},
		goToQuestionResultScreen(resultInfo) {
			this.resultInfo = resultInfo;
			this.state = 3;
		},
		endSessionScreen() {
			this.state = 4;
		},
		startSessionError() {
			this.$router.push("/admin");
		}
	},
	components: {
		WaitingRoom,
		Question,
		QuestionResultScreen,
		SessionOverScreen
	},
	beforeDestroy() {
		// TODO add logic if the admin goes to another path before the sessions ends
	}
};
</script>
