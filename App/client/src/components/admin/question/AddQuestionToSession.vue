<!--
	Component name: AddQuestionToSession
	Use case:
		- Let the user add a question to a session
-->

<template>
	<b-modal
		@shown="onShown"
		@ok="okHandler"
		:id="elementId"
		:ref="elementRef"
		:title="question.text"
		style="text-align: left;"
		:hide-header-close="true"
		:cancel-title="getLocale.cancelBtn"
		:ok-title="getLocale.okBtn"
		cancel-variant="danger"
	>
		<b-form-group
			id="session"
			:label="getLocale.selectSessionText"
			label-for="sessionInput"
		>
			<b-form-select
				id="sessionInput"
				:options="getSessionOptions"
				v-model="selectedSession"
			>
				<template slot="first" v-if="getSessionOptions.length === 0">
					<option value="" disabled>
						{{ getLocale.noSessionText }}
					</option>
				</template>
			</b-form-select>
		</b-form-group>
	</b-modal>
</template>

<script>
export default {
	data() {
		return {
			question: {
				id: -1,
				text: ""
			},
			selectedSession: "",
			sessionOptions: []
		};
	},
	props: {
		elementRef: String,
		elementId: String
	},
	computed: {
		getLocale: function() {
			let locale = this.$store.getters.getLocale("AdminQuestions");
			if (locale) return locale;
			else return {};
		},
		getSessionOptions: function() {
			return this.sessionOptions;
		}
	},
	methods: {
		onShown: function() {
			let courseId = this.$store.getters.getSelectedCourse;
			this.$socket.emit(
				"getSessionWithinCourseForAddingQuestion",
				courseId
			);
		},
		okHandler: function() {
			this.$socket.emit("addQuestionToSession", {
				questionId: this.question.id,
				sessionId: this.selectedSession
			});
		}
	},
	sockets: {
		sendSessionWithinCourse: function(sessions) {
			this.sessionOptions = sessions;
			if (sessions.length > 0) this.selectedSession = sessions[0].value;
		}
	}
};
</script>
