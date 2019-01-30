<template>
    <div id="session">
        <AdminWaitingRoom v-if="state == 1" :sessionId="sessionId"/>
    </div>
</template>

<script>
import AdminWaitingRoom from "../components/admin/AdminWaitingRoom.vue";
export default {
    name: "session",
    props: [
        "sessionId" 
    ],
    data() {
        return {
            state: 0
        }
    },
    created() {
        this.$socket.emit("verifyUserLevel", 3);
        this.$socket.emit("startSessionWaitingRoom", this.sessionId);
    },
    sockets: {
        startSessionWaitingRoomResponse() {
            this.state = 1;
        }
    },
    computed: {
        
    },
    methods: {
        
    },
    components: {
        AdminWaitingRoom
    }
}
</script>