<template>
  <div class="client">
    <h1>This is the client page</h1>
    <p>Connected to the server via socket.io and sent message back. Recieved this message: {{msg}}</p>
	</div>
</template>

<script>
	import io from 'socket.io-client';
	import { dataBus } from '../main';

	export default {
		name: 'client',
		data() {
			return {
			msg: '',
			socket: dataBus.socket
			}
    	},
		created() {
			this.socket.emit("clientStarted");
		},
		mounted() {
			this.socket.on('clientResponse', () => {
				this.msg = "socket io connection working";
				this.socket.emit("clientRequest", "Client connected")
			});
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>