<template>
    <b-container id="JoinRoom" class="jumbotron">
        <b-row align-h="center">
            <b-col cols="12" class="text-center mb-5" v-if="!response">
                <h1>Quick join room!</h1>
            </b-col>
            <b-col cols="12" class="text-center mb-5" v-else>
                <h1>{{responsetext}}</h1>
            </b-col>
        </b-row>
        <b-row align-h="center">
            <b-col cols="12" class="text-center mb-5">
                <b-form-input v-model="roomId" type="text" placeholder="Enter room id!"/>
            </b-col>
        </b-row>
        <b-row align-h="center">
            <b-col cols="12" class="text-center">
                <b-button size="lg" variant="primary" @click="quickJoin">Join</b-button>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
export default {
    name: "joinRoom",
    data() {
        return{
            responsetext: "",
            response: false,
            roomId: ""
        };
    },
    props:
        ["quizCode"]
    ,
    methods: {
        quickJoin() {
            console.log("tried to quickjoin with this room ID: " + this.roomId);
            //console.log(this.$socket);
            this.$socket.emit("quickJoinRoom",this.roomId);
        },
    },
    sockets: {
        joinRoom(room){
            console.log("Joined: " + room);
            this.response = false;
            console.log("Mutated?");
            this.$router.push(`/client/quiz/${room}`)   //redirect to waiting room for clients
        },
        QuizInActive(quizNr){
            console.log("QuizInActive");
            console.log(quizNr);
            this.responsetext = "Quiz " + quizNr + " is inactive!";
            this.response = true;
        }
    },computed: {
        insertResponseText(){
            return this.response;
        }
    },
}
</script>