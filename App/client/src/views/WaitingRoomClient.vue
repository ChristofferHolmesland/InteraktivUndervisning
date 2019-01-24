<template>
    <b-container>
        <b-row>
            <b-col cols="12" offset="3">
                <h1>Waiting Room</h1>
            </b-col>
            <b-col cols="12" offset="3">
                <p>You have joined room {{roomId}}. Waiting for the admin to start the quiz.</p>
            </b-col>
            <b-col cols="12" offset="5">
                <b-button variant="danger" @click="leaveRoom">Leave Room</b-button>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
	export default {
		name: "WaitingRoomClient",
		data() {
			return{
				roomId: "",
			};
		},
		created() {
			this.$socket.emit("clientStarted");

		},methods: {
            leaveRoom(){
            	console.log("Leaving Room!");
            	this.$router.push("/client")
            }
        }
	}
</script>

<style scoped>

</style>