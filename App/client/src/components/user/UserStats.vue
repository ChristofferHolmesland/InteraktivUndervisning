<template>
	<b-container class="jumbotron">
		<b-row>
			<b-col>
				<h1>{{getLocale.title}}</h1>
				<div>
					<b-row>
						<b-col cols="8"><h6>{{getLocale.totalSessions}}</h6></b-col>
						<b-col cols="4"><p>{{totalSessions}}</p></b-col>
					</b-row>
					<b-row>
						<b-col cols="8"><h6>{{getLocale.correctAnswers}}</h6></b-col>
						<b-col cols="4"><p>{{totalCorrectAnswers}}</p></b-col>
					</b-row>
					<b-row>
						<b-col cols="8"><h6>{{getLocale.incorrectAnswers}}</h6></b-col>
						<b-col cols="4"><p>{{totalIncorrectAnswers}}</p></b-col>
					</b-row>
					<b-row>
						<b-container>
							<b-list-group style="overflow-y: scroll; heght: 300px">
								<b-list-group-item 	v-for="item in sessionList" 
													:key="item.sessionName">
									{{item.courseCode}} : {{item.sessionName}}
								</b-list-group-item>
							</b-list-group>
						</b-container>
					</b-row>
				</div>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
export default {
	name: "userStats",
	data() {
		return {
			totalSessions: 0,
			totalCorrectAnswers: 0,
			totalIncorrectAnswers: 0,
			sessionList: [] 
		}
	},
	created() {
		this.$socket.emit("checkSignedInFeide");
		this.$socket.emit("getUserStats");
	},
	sockets: {
		getUserStatsResponse(data) {
			this.totalSessions = data.totalSessions;
			this.totalCorrectAnswers = data.totalCorrectAnswers;
			this.totalIncorrectAnswers = data.totalIncorrectAnswers;
			this.sessionList = data.sessionList;
		}
	},
	computed: {
		getLocale() {
			return this.$store.getters.getLocale("UserStats");
		}
	}
}
</script>