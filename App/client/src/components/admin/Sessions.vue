<template>
	<div class="admin">
		<b-container>
			<b-row>
				<b-col>
					<b-container>
						<b-row>
							<b-col>
								<b-form-input placeholder="Search">

								</b-form-input>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<b-list-group>
									<b-list-group-item v-for="quiz in quizList" :key="quiz">
										{{quiz}}
									</b-list-group-item>
								</b-list-group>
							</b-col>
						</b-row>
					</b-container>
				</b-col>
				<b-col>
					<Session/>
				</b-col>
			</b-row>
		</b-container>
	</div>
</template>

<script>
	import Session from "./Session.vue";
	export default {
		name: 'Sessions',
		data() {
			return {
				quizList: undefined
			}
		},
		created() {
			this.$socket.emit("getSessions");
		},
		sockets: {
			getSessionsResponse(data) {
				console.log(data);
				this.quizList = data.quizList;
			}
		},
		components: {
			Session
		}
    }

</script>

<style scoped>
</style>