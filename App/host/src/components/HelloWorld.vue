<template>
<div>
	<h1>Host site</h1>
	<p>{{msg}}</p>
</div>
</template>

<script>
	import io from 'socket.io-client';

	export default {
		name: 'HelloWorld',
		data() {
			return {
			msg: '',
			socket: io('localhost:3000')
			}
		},
		mounted() {
			this.socket.on('msg', () => {
				this.msg = "socket io connection working";
				this.socket.emit("test", "hello from the other side")
			});
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
