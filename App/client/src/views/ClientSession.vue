<template>
	<div id="clientSession">
		<b-container>
			<WaitingArea v-if="getSessionState == 0" :sessionCode="sessionCode"
								:localeElement="localeElement"/>
			<Question v-else :sessionCode="sessionCode"
									:questionInfo="questionInfo"/>
		</b-container>
	</div>
</template>

<script>
import WaitingArea from "../components/client/session/WaitingArea.vue";
import Question from "../components/client/session/Question.vue";

export default {
	name: "ClientSession",
	data() {
		return {
			sessionState: 0,
			questionInfo: {},
			localeElement: "beforeSession"
		};
	},
	created() {
		this.$socket.emit("verifyUserLevel", 1);
	},
	props: ["sessionCode"],
	computed: {
		getSessionState() {
			return this.sessionState;
		}
	},
	sockets: {
		nextQuestion(questionInfo) {
			this.questionInfo = questionInfo;
			this.sessionState = 1;
		},
		answerResponse(localeElement) {
			this.localeElement = localeElement;
			this.sessionState = 0;
		},
		returnToClientDashboard() {
			this.$router.push("/client");
		},
		finishSessionResponse(localeElement) {
			this.localeElement = localeElement;
			this.sessionState = 0;
		}
	},
	components: {
		WaitingArea,
		Question
	}
};
</script>
