<template>
<b-container id="ViewLastSession" class="jumbotron card">
	<b-row class="center margin">
		<b-col cols="12" class="px-0">
			<h1>Previous session</h1>
		</b-col>
	</b-row>
	<b-row class="margin rowMiddle">
		<b-col v-if="lastSessionBasicInfo === undefined">
            <p>Can't find any sessions</p>
		</b-col>
	</b-row>
	<b-row class="center">
		<b-col cols="12">
			<b-button @click="goToLastSession" variant="primary" size="lg" class="btn" :disabled="lastSessionBasicInfo === undefined ? true : false">Go</b-button>
		</b-col>
	</b-row>
</b-container>
</template>

<script>
export default {
    name: "ViewLastSession",
    data() {
        return {
            lastSessionBasicInfo: undefined,
            lastSessionInfo: undefined
        }
    },
    mounted() {
        this.$socket.emit("getUserLastSession");
    },
	methods: {
		goToLastSession() {
            if (lastSessionBasicInfo === undefined) return;
            if (Number(lastSessionBasicInfo.id) === NaN) return;
            this.$socket.emit("getUserSessionInformationRequest", lastSessionBasicInfo.id);
		}
    },
    sockets: {
        getUserSessionInformationResponse: function() {

        }
    }
};
</script>

<style scoped>
.center {
	text-align: center;
}
.margin {
	margin-bottom: 2rem;
}
.card {
	height: 100%;
}
.btn {
	display: inline-block;
	width: 50%;
}
.rowMiddle {
	height: 30%;
}
</style>
