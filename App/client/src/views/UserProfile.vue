<template>
	<b-container>
		<b-row align-h="center" class="mt-3">
			<b-col cols="12" lg="5">
				<UserInfo/>
			</b-col>
			<b-col cols="12" lg="5" offset-lg="1">
				<UserStats/>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
import UserInfo from "../components/client/userProfile/UserInfo.vue";
import UserStats from "../components/client/userProfile/UserStats.vue";

export default {
	name: "userProfile",
	created() {
		this.$socket.emit("verifyUserLevel", 2);
	},
	components: {
		UserInfo,
		UserStats
	}
};
</script>
