<template>
    <div id="SessionOverScreen">
        <b-button @click="closeSession">Go back to admin dashboard</b-button>
    </div>
</template>

<script>
export default {
    name: "SessionOverScreen",
    beforeDestroy() {
        this.$socket.emit("closeSession");
    },
    sockets: {
        closeSessionResponse() {
            this.$router.push("/admin");
        }
    },
    methods: {
        closeSession() {
            this.$socket.emit("closeSession");
        }
    }
}
</script>