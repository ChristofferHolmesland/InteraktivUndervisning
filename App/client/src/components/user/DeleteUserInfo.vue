<template>
<b-modal    id="deleteUserInfo" 
            centered title="Delete all user data!" 
            @ok="handleOk"
            ok-variant="danger"
            ok-title="Delete!">
    <b-list-group>
        <b-list-item v-for="text in getLocale.deleteInfoList" :key="text">
            <li>{{text}}</li>
        </b-list-item>
    </b-list-group>
</b-modal>
</template>

<script>
export default {
    name: "deleteUserInfo",
    methods: {
        handleOk() {
            this.$socket.emit("deleteUserData");
        }   
    },
    computed: {
        getLocale() {
            return this.$store.getters.getLocale("DeleteUserInfo");
        }   
    }
}
</script>