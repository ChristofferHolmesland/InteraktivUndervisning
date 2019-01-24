<template>
    <div id="adminWaitingRoom">
        <b-container vertical-center>
            <b-row align-h="center">
                <b-col lg="8">
                    <h1>Code: {{getQuizId}}</h1>
                </b-col>
            </b-row>
            <b-row align-h="center">
                <b-col lg="8">
                    <h1>Number of users connected: {{getNumberOfUsersConnected}}</h1>
                </b-col>
            </b-row>
            <b-row align-h="center">
                <b-col lg="8">
                    <h1>Waiting for players{{waitingForPlayersAnimation}}</h1>
                </b-col>
            </b-row>
            <b-row align-h="center">
                <b-col lg="8">
                    <b-button size="lg" @click="startQuiz">Start</b-button>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
export default {
    name: "adminWaitingRoom",
    props: [
        "quizId"
    ],
    data() {
        return {
            numberOfUsersConnected: 0,
            interval: undefined,
            intervalStep: 500,
            waitingForPlayersAnimation: "."
        }
    },
    created() {

    },
    mounted() {
        this.interval = setInterval( () => {
            if(this.waitingForPlayersAnimation === "..."){
                this.waitingForPlayersAnimation = "";
                return;
            }
            this.waitingForPlayersAnimation += ".";
        }, this.intervalStep);
    },
    sockets: {
        updateCurrentlyJoineUsers(data) {
            this.numberOfUsersConnected = data.numberOfUsersConnected;
        }
    },
    methods: {
        startQuiz() {
            this.$socket.emit("startQuiz", this.quizId);
        }
    },
    computed: {
        getNumberOfUsersConnected() {
            return this.numberOfUsersConnected;
        },
        getQuizId() {
            return this.quizId;
        }
    }
}
</script>