<template>
	<b-container>
		<b-row align-h="center" class="mt-3">
			<b-col cols="12" lg="4">
				<UserInfo/>
			</b-col>
			<b-col cols="12" lg="4" offset-lg="2">
				<UserStats/>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
import UserInfo from "../components/user/UserInfo.vue";
import UserStats from "../components/user/UserStats.vue";

export default {
	name: "userProfile",
	created() {
		this.$socket.emit("verifyUserLevel", 2);
	},
	components: {
		UserInfo,
		UserStats
	}
}
</script>