<template>
  <div class="admin">
    <h1>This is the admin page</h1>
  </div>
</template>

<script>
	import { dataBus } from '../main';
	
	export default {
		name: 'Admin',
		data() {
			return {
			socket: dataBus.socket
			}
		},
		created() {
			this.socket.emit("adminStarted");
		}
	}
</script>

<style scoped>
</style>