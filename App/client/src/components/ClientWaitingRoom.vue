<template>
    <div id="clientWaitingRoom">
        <b-container>
            <b-row>
                <b-col sm="12" offset-sm="5" class="mt-5 mb-3" lg="12" offset-lg="1">
                    <h1>Waiting Room</h1>
                    <p>Room:{{quizCode}}</p>
                </b-col>
                <b-col sm="12" offset-sm="5" lg="12" class="ml-2 mr-2" offset-lg="5">
                    <p>{{waitingRoomString}}</p>
                    <!--TODO add fancy ... animation-->
                </b-col>
                <b-col sm="12" offset-sm="5" lg="3" offset-lg="1">
                    <b-button variant="danger" @click="leaveRoom">Leave Room</b-button>
                    <b-button variant="secondary" @click="startQuiz">ClientQuiz</b-button>
                </b-col>
            </b-row>
            <!--

            <b-row v-if="sessionStatus == 2">
                <b-col>Waiting for the rest to finish the question</b-col>
            </b-row>

            <b-row v-else-if="sessionStatus == 3">
                <b-col v-if="result == -1">Vet ikke</b-col>
                <b-col v-else-if="result == 0">Galt</b-col>
                <b-col v-else>Riktig</b-col>
            </b-row>
            <b-row v-else>
                <b-col sm="12" offset-sm="5" class="mt-5 mb-3" lg="12" offset-lg="1">
                    <h1>Waiting Room</h1>
                </b-col>
                <b-col sm="12" offset-sm="5" lg="12" class="ml-2 mr-2" offset-lg="5">
                    <p>You have joined {{quizCode}}. <br />The quiz will start as soon...</p> --TODO add fancy ... animation
                </b-col>
                <b-col sm="12" offset-sm="5" lg="3" offset-lg="1">
                    <b-button variant="danger" @click="leaveRoom">Leave Room</b-button>
                    <b-button variant="secondary" @click="startQuiz">ClientQuiz</b-button>
                </b-col>
            </b-row> -->
    </b-container>
    </div>
</template>

<script>
	export default {
		name: "ClientWaitingRoom",
        props: [
        	"quizCode",
            "waitingRoomString",
            "result"
        ],
        methods: {
			leaveRoom(){
			    this.$socket.emit("leaveRoom",this.quizCode);
			    console.log("Leaving Room!");
		    },
		    startQuiz() {
			    console.log("Starting quiz");
			    this.$socket.emit("startQuiz",this.quizCode);
		    }
		},
	}
</script>

<style scoped>

</style>