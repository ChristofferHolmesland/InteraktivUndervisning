<template>
    <b-container>
        <b-row>
            <b-col sm="12" offset-sm="5" class="mt-5 mb-3" lg="12" offset-lg="1">
                <h1>Waiting Room</h1>
            </b-col>
            <b-col sm="12" offset-sm="5" lg="12" class="ml-2 mr-2" offset-lg="1">
                <p>You have joined {{room}}. <br />Waiting for the admin to start the quiz.</p>
            </b-col>
            <b-col sm="12" offset-sm="5" lg="3" offset-lg="1">
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
				room: "",
			};
		},
		created() {
			this.$socket.emit("clientStarted");
            this.room = this.$store.getters.getCurrentRoom;
		},methods: {
            leaveRoom(){
            	console.log(this.room); //does not work
            	this.$socket.emit("leaveRoom",this.room);
                //this.$socket.leave("room-"+this.roomId);
            	console.log("Leaving Room!");
            	//this.$router.push("/client")
            }
        },sockets: {
			connectedToRoom(message){
				console.log("Hello MoM!!!!!");
                console.log(message);
                this.roomId = parseInt(message.split("-")[1]);
            },
            returnToJoinRoom() {
				console.log("Returning");
				this.$router.push("/client");
            }
        },computed: {

        }
	}
</script>

<style scoped>

</style>