<template>
    <div id="quiz">
        <AdminWaitingRoom v-if="state == 1" :quizId="quizId"/>
    </div>
</template>

<script>
import AdminWaitingRoom from "../components/admin/AdminWaitingRoom.vue";
export default {
    name: "quiz",
    props: [
        "quizId" 
    ],
    data() {
        return {
            state: 0
        }
    },
    created() {
        this.$socket.emit("verifyUserLevel", 3);
        this.$socket.emit("startQuizWaitingRoom", this.quizId);
    },
    sockets: {
        startQuizWaitingRoomResponse() {
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