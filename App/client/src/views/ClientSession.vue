<!--
	Component name: ClientSession
	Use case:
		- Controls the user experience while in a session.
-->

<template>
	<div id="clientSession">
		<b-container>
			<WaitingArea
				v-if="getSessionState == 0"
				:sessionCode="sessionCode"
				:localeElement="localeElement"
			/>
			<Question
				v-else
				:sessionCode="sessionCode"
				:questionInfo="questionInfo"
			/>
		</b-container>
	</div>
</template>

<script>
import WaitingArea from "../components/client/session/WaitingArea.vue";
import Question from "../components/client/session/Question.vue";

export default {
	name: "ClientSession",
	props: ["sessionCode"],
	data() {
		return {
			sessionState: 0,
			questionInfo: {},
			localeElement: "beforeSession"
		};
	},
	created() {
		this.$socket.emit("verifyUserLevel", 1);
		this.$socket.emit("verifySessionExists", this.sessionCode);
	},
	sockets: {
		nextQuestion: function(questionInfo) {
			this.questionInfo = questionInfo;
			this.sessionState = 1;
		},
		answerResponse: function(localeElement) {
			this.localeElement = localeElement;
			this.sessionState = 0;
			this.$nextTick();
		},
		finishSessionResponse: function(localeElement) {
			this.localeElement = localeElement;
			this.sessionState = 0;
		},
		verifySessionExistsError: function() {
			this.$router.push("/client");
		}
	},
	components: {
		WaitingArea,
		Question
	},
	computed: {
		getSessionState: function() {
			return this.sessionState;
		}
	},
	beforeDestroy() {
		this.$socket.emit("leaveSession", this.sessionCode);
	}
};
</script>
