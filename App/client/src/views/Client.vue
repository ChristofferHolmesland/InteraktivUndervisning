<template>
<div class="client">
	<h1>This is the client page</h1>
</div>
</template>

<script>
	import { dataBus } from '../main';

	export default {
		name: 'client',
		data() {
			return {
			socket: dataBus.socket
			}
    	},
		created() {
			this.socket.emit("clientStarted");
		},
		mounted() {
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	h1 {
		margin-top: 3rem;
		text-align: center;
	}
</style>