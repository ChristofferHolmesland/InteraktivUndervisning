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
					<b-row v-if="getFilteredSessionList.length !== 0">
						<b-container>
							<b-form-group	label="Course List:"
											label-for="courseList">
								<b-form-select 	id="courseList"
												:options="getCourses"
												v-model="courseSelected">
								</b-form-select>
							</b-form-group>
							<b-list-group style="overflow-y: scroll; max-height: 300px">
								<b-list-group-item 	v-for="item in getFilteredSessionList" 
													:key="item.sessionName">
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
			sessionList: [],
			filteredSessionList: [],
			courseList: [],
			courseSelected: undefined
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

			for (let i = 0; i < this.sessionList.length; i++) {
				if (this.courseList.indexOf(this.sessionList[i].code) === -1) {
					this.courseList.push(this.sessionList[i].code);
				}
			}

			this.courseSelected = this.courseList[0]
		}
	},
	computed: {
		getLocale() {
			return this.$store.getters.getLocale("UserStats");
		},
		getCourses() {
			return this.courseList;
		},
		getFilteredSessionList() {
			return this.filteredSessionList;
		}
	},
	watch: {
		courseSelected() {
			let list = [];
			for (let i = 0; i < this.sessionList.length; i++) {
				if (this.sessionList[i].code === this.courseSelected) {
					list.push(this.sessionList[i]);
				}
			}
			this.filteredSessionList = list;
		}	
	}
}
</script>