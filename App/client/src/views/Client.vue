<template>
	<div class="Client">
		<h1>This is the client page</h1>
		<b-container>
			<b-row>
				<b-col cols="12" lg="4">
					<JoinRoom></JoinRoom>
				</b-col>
			</b-row>
		</b-container>
	</div>
</template>

<script>
	import { dataBus } from '../main';
	import JoinRoom from "../components/JoinRoom.vue";

	export default {
		name: 'client',
		data() {
			return {
				socket: dataBus.socket
			}
		},
		components: {
			JoinRoom
		},
		created() {
			this.socket.emit("clientStarted");
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