<template>
    <b-container id="JoinRoom" class="jumbotron">
        <b-row align-h="center">
            <b-col cols="12" class="text-center mb-5">
                <h1>Quick join room!</h1>
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
            roomId: ""
        };
    },
    methods: {
        quickJoin() {
            console.log("tried to quickjoin with this room ID: " + this.roomId);
        }
    },
}
</script>