<template>
	<b-modal
		id="deleteQuestions"
		:title="getLocale.title"
		ref="deleteQuestionInnerModal"
		style="text-align: left;"
		@ok="okHandler"
		:ok-title="getLocale.okBtn"
		:cancel-title="getLocale.cancelBtn"
		cancel-variant="danger"
		:hide-header-close="true"
	>
		<b-alert
			:show="showError"
			variant="danger"
			dismissible
			@dismissed="showError = false"
		>
			<p>
				{{ getLocale.errors[errorText] }}
			</p>
		</b-alert>
		<div>
			<ul v-for="(line, index) in getLocale.info" :key="index">
				<li>
					<p>{{ line }}</p>
				</li>
			</ul>
		</div>
		<b-form-group>
			<b-container>
				<b-row>
					<b-col
						><h6>{{ getLocale.selectedQuestionsTitle }}</h6></b-col
					>
				</b-row>
				<b-row>
					<b-col>
						<b-list-group
							style="max-height: 200px; overflow-y:scroll; border: 1px black solid;"
						>
							<b-list-group-item
								class="border-0 px-0"
								v-for="(question,
								index) in selectedQuestionsList"
								:key="question.id"
							>
								<b-container>
									<b-row>
										<b-col cols="8">
											{{ question.text }}
										</b-col>
										<b-col cols="4">
											<b-button
												variant="danger"
												class="removeBtn"
												@click="removeQuestion(index)"
											>
												{{ getLocale.removeBtn }}
											</b-button>
										</b-col>
									</b-row>
								</b-container>
							</b-list-group-item>
						</b-list-group>
					</b-col>
				</b-row>
			</b-container>
		</b-form-group>
	</b-modal>
</template>

<script>
export default {
	name: "CopyQuestion",
	props: ["selectedQuestions"],
	data() {
		return {
			selectedQuestionsList: [],
			showError: false,
			errorText: "",
			currentCourseId: 0
		};
	},
	mounted() {
		this.$root.$on("bv::modal::show", (bvevent) => {
			this.selectedQuestionsList = JSON.parse(
				JSON.stringify(this.selectedQuestions)
			);
			this.currentCourseId = this.$store.getters.getSelectedCourse;
		});
	},
	computed: {
		getLocale: function() {
			let locale = this.$store.getters.getLocale("DeleteQuestions");
			if (locale) return locale;
			else return {};
		}
	},
	methods: {
		removeQuestion: function(index) {
			this.selectedQuestionsList.splice(index, 1);
		},
		okHandler: function(e) {
			e.preventDefault();
			this.$socket.emit(
				"deleteQuestionsRequest",
				this.selectedQuestionsList
			);
		}
	},
	sockets: {
		deleteQuestionToCourseResponse: function() {
			this.$socket.emit(
				"getAllQuestionsWithinCourse",
				this.currentCourseId
			);
			this.$refs.deleteQuestionInnerModal.hide();
		},
		deleteQuestionToCourseError: function(error) {
			this.errorText = error;
			this.showError = true;
		}
	}
};
</script>

<style scoped>
.removeBtn {
	height: 38px;
	line-height: 24px;
	width: 100%;
	text-align: center;
}
</style>
