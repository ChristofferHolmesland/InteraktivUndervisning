<template>
	<b-container class="jumbotron">
		<b-row>
			<b-col>
				<h1>User Info</h1>
				<b-form-group label="Name:">
					<b-form-input 	:disabled="true" 
									:value="getUser.username"></b-form-input>
				</b-form-group>
				<b-form-group label="Feide ID:">
					<b-form-input 	:disabled="true" 
									:value="getUser.feideId"></b-form-input>
				</b-form-group>
				<b-form-group>
					<b-button variant="danger" size="lg" v-b-modal.deleteUserInfo>
						Delete my data!
					</b-button>
					<DeleteUserInfo></DeleteUserInfo>
				</b-form-group>
				<div v-if="getUser.userRights > 1">
					<b-row>
						<b-col>
							<h3>User rights:</h3>
						</b-col>
					</b-row>
					<b-row 	v-for="subject in getUser.adminSubjects" 
							:key="subject.subjectName">
						<b-col cols="6">{{subject.subjectName}}</b-col>
						<b-col cols="6">{{subject.userRights}}</b-col>
					</b-row>
				</div>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
import DeleteUserInfo from "./DeleteUserInfo.vue";

export default {
	name: "userInfo",
	computed: {
		getUser() {
			let user = this.$store.getters.getUser({
				username: true,
				feideId: true,
				userRights: true,
				adminSubjects: true,
			});
			console.log(user);
			return user;
		}	
	},
	components: {
		DeleteUserInfo
	}
}
</script>