<template>
<b-container id="ViewLastSession" class="jumbotron">
	<b-row class="center firstRow row">
		<b-col cols="12" class="px-0">
			<h1>{{ getLocale.title }}</h1>
		</b-col>
	</b-row>
	<b-row class="margin middleRow row">
		<b-col v-if="lastSessionBasicInfo === undefined">
            <p>{{ getLocale.noSessionFound }}</p>
		</b-col>
		<b-col v-else>
			<p>{{ lastSessionBasicInfo.text }}</p>
		</b-col>
	</b-row>
	<b-row class="center lastRow row">
		<b-col cols="12">
			<b-button	@click="goToLastSession"
						variant="primary"
						size="lg"
						class="btn"
						:disabled="lastSessionBasicInfo === undefined ? true : false"
						>
				{{ getLocale.goBtn }}
			</b-button>
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
	},
	computed: {
		getLocale() {
			let locale = this.$store.getters.getLocale("ViewLastSession");
			if (locale) return locale;
			return {};
		}
	}
};
</script>

<style scoped>
#ViewLastSession {
	position: relative;
	width: 350px;
	height: 500px;
	padding: 50px 35px;
}
.center {
	text-align: center;
}
.btn {
	display: inline-block;
	width: 50%;
}
.firstRow {
	position: absolute;
	left: 45px;
	top: 50px;
	height: 105px;
}
.middleRow {
	position: absolute;
	left: 45px;
	top: 160px;
	height: 150px;
	line-height: 150px;
}
.lastRow {
	position: absolute;
	left: 45px;
	top: 310px;
	height: 90px;
	line-height: 90px;
}
.row {
	width: 280px;
}
</style>
