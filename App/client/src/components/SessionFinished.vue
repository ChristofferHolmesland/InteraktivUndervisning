<template>
    <div id="sessionFinished">
        <b-container>
            <b-row>
                <b-col cols="12">
                    <p>This session has concluded!<br />Press the button to leave the room and join another session.</p>
                </b-col>
                <b-col>
                    <b-button variant="secondary" @click="leaveRoom">LeaveRoom</b-button>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
	export default {
		name: "SessionFinished",
        props: [
        	"quizCode"
        ],
        methods: {
			leaveRoom() {
				console.log("leaving Room");
				//this.$parent.leaveRoom() could be possible?
				this.$socket.emit("leaveRoom",this.quizCode);
            }
        }
	}
</script>

<style scoped>

</style>