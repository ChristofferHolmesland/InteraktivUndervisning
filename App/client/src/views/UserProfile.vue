<template>
    <b-container>
        <b-row align-h="center">
            <b-col cols="12" lg="4" class="jumbotron">
                <UserInfo/>
            </b-col>
            <b-col cols="12" lg="4" class="jumbotron">
                <UserStats/>
            </b-col>
        </b-row>
        <b-row align-h="center">
            <b-col cols="12" lg="4" class="jumbotron">
                <UserDeleteInfo/>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import UserInfo from "../components/UserInfo.vue";
import UserStats from "../components/UserStats.vue";
import UserDeleteInfo from "../components/UserDeleteInfo.vue";
import { dataBus } from "../main.js";

export default {
    name: "",
    data() {
        return {
            socket: dataBus.socket
        };
    },
    created() {
        this.socket.emit("checkSignedInFeide");
    },
    components: {
        UserInfo,
        UserStats,
        UserDeleteInfo
    }
}
</script>