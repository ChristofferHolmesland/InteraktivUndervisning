<template>
	<div class="quiz">
		<b-list-group>
			<b-list-group-item 	v-for="session in sessionList"
								:key="session.id">
				{{session.title}} 	<b-button :id="session.id" 
											@click="initializeQuiz($event)">
										Start
									</b-button>
			</b-list-group-item>
		</b-list-group>
	</div>
</template>

<script>
	export default {
		name: 'quiz',
		data() {
			return {
				sessionList: [{id: "3434", title: "quiz 1"}]
			}
		},
		sockets: {
			initializeQuizResponse(quizId) {
				console.log(quizId)
				this.$router.push(`/admin/quiz/${quizId}`);
			}
		},
		methods: {
			initializeQuiz(event){
				console.log(event.target.id)
				this.$socket.emit("initializeQuiz", event.target.id);
			}
		},
    }

</script>

<style scoped>
</style>