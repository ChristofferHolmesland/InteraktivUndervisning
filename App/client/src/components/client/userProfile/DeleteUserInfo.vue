<template>
<b-modal    id="deleteUserInfo" 
			centered 
			:title="getLocale.title" 
			@ok="handleOk"
			ok-variant="danger"
			:ok-title="getLocale.okTitle"
			:cancel-title="getLocale.cancelTitle">
	<b-list-group>
		<b-list-group-item v-for="text in getLocale.deleteInfoList" :key="text">
			<li>{{text}}</li>
		</b-list-group-item>
	</b-list-group>
</b-modal>
</template>

<script>
export default {
	name: "deleteUserInfo",
	methods: {
		handleOk() {
			this.$socket.emit("deleteUserData");
		}
	},
	computed: {
		getLocale() {
			return this.$store.getters.getLocale("DeleteUserInfo");
		}
	}
};
</script>
