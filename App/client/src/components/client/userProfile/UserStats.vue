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
						<b-col cols="8"><h6>{{getLocale.didntKnowAnswers}}</h6></b-col>
						<b-col cols="4"><p>{{totalDidntKnowAnswers}}</p></b-col>
					</b-row>
					<b-row>
						<b-container>
							<b-form-group	label="Course List:"
											label-for="courseList"
											v-if="courseList.length > 0">
								<b-form-select 	id="courseList"
												:options="getCourses"
												v-model="courseSelected">
								</b-form-select>
							</b-form-group>
							<b-list-group 	style="overflow-y: scroll; max-height: 300px"
											v-if="getFilteredSessionList.length !== 0">
								<b-list-group-item 	v-for="item in getFilteredSessionList" 
													:key="item.id"
													@click="showSession(item.id)"
													style="cursor: pointer;">
									{{item.name}}
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
			totalDidntKnowAnswers: 0,
			sessionList: [],
			filteredSessionList: [],
			courseList: [],
			courseSelected: undefined
		};
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
			this.totalDidntKnowAnswers = data.totalDidntKnowAnswers;
			this.sessionList = data.sessionList;

			for (let i = 0; i < this.sessionList.length; i++) {
				if (this.courseList.indexOf(this.sessionList[i].id) === -1) {
					this.courseList.push({
						value: this.sessionList[i].courseId,
						text: this.sessionList[i].course
					});
				}
			}

			this.courseSelected = this.courseList[0].value;
		}
	},
	methods: {
		showSession(sessionId) {
			this.$socket.emit("getSessionInformationRequest", sessionId);
		}
	},
	computed: {
		getLocale() {
			return this.$store.getters.getLocale("UserStats");
		},
		getCourses() {
			console.log(this.courseList)
			return this.courseList;
		},
		getFilteredSessionList() {
			return this.filteredSessionList;
		}
	},
	watch: {
		courseSelected() {
			let list = [];

			console.log(this.sessionList)

			for (let i = 0; i < this.sessionList.length; i++) {
				console.log(this.sessionList[i].courseId)
				console.log(this.courseSelected)
				if (this.sessionList[i].courseId == this.courseSelected) {
					list.push(this.sessionList[i]);
				}
			}
			this.filteredSessionList = list;
		}
	}
};
</script>
