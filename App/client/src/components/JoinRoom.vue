<template>
    <b-container>
        <b-row>
            <b-col id="JoinRoom" cols="4">
                <h1>Quick join room!</h1>
                <b-form-input v-model="roomId" type="text" placeholder="Enter room id!"/>
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