<!--
	Component name: DeleteUserInfo
	Use case:
		- Let the user delete the stored information.
-->

<template>
<b-modal    id="deleteUserInfo" 
			centered 
			:title="getLocale.title" 
			@ok="handleOk"
			ok-variant="danger"
			:ok-title="getLocale.okTitle"
			:cancel-title="getLocale.cancelTitle"
			:no-close-on-backdrop="true">
	<b-alert 	:show="showError"
                variant="danger"
                dismissible
				@dismissed="showError = false">
		<p>{{ getLocale.error[errorText] }}</p>
	</b-alert>
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
	data() {
		return {
			showError: false,
			errorText: ""
		}
	},
	methods: {
		handleOk(e) {
			e.preventDefault();
			this.$socket.emit("deleteUserData");
		}
	},
	computed: {
		getLocale() {
			return this.$store.getters.getLocale("DeleteUserInfo");
		}
	},
	sockets: {
		deleteUserDataResponse: function() {
			this.$socket.emit("signOutRequest");
		},
		deleteUserDataError: function(error) {
			this.errorText = error;
			this.showError = true;
		}
	}
};
</script>
