<template>
  <div class="host">
    <h1>This is the host page</h1>
    <p>Connected to the server via socket.io and sent message back. Recieved this message: {{msg}}</p>
  </div>
</template>

<script>
	import io from 'socket.io-client';
	export default {
		name: 'Host',
		data() {
			return {
			msg: '',
			socket: io('localhost:3000')
			}
		},
		created() {
			this.socket.emit("hostStarted");
		},
		mounted() {
			this.socket.on('hostResponse', () => {
				this.msg = "socket io connection working";
				this.socket.emit("hostRequest", "Client connected")
			});
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>