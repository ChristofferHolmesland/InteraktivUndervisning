<template>
	<div class="admin">
		<h1>This is the admin page</h1>
	</div>
</template>

<script>
	
	export default {
		name: 'Admin',
		created() {
			this.$socket.emit("adminStarted");
		}
	}
</script>

<style scoped>
</style>