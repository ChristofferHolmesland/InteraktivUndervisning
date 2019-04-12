<template>
<b-container id="ViewLastSession" class="jumbotron">
	<b-row class="center firstRow row">
		<b-col cols="12" class="px-0">
			<h1>{{ getLocale.title }}</h1>
		</b-col>
	</b-row>
	<b-row class="center middleRow row">
		<div v-if="showError">
			<b-alert	:show="showError"
						dismissible
						@dismissed="closeAlert"
						class="center"
						>
				<p>{{ getLocale.error[errorText] }}</p>
				<b-button>{{ getLocale.refreshBtn }}</b-button>
			</b-alert>
		</div>
		<div v-else>
			<b-col v-if="lastSessionBasicInfo === undefined">
				<p>{{ getLocale.noSessionFound }}</p>
			</b-col>
			<b-col v-else>
				<p>{{ lastSessionBasicInfo.text }}</p>
			</b-col>
		</div>
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
			errorText: "",
			showError: false
        }
    },
    mounted() {
        this.$socket.emit("userLastSessionRequest");
    },
	methods: {
		goToLastSession() {
            if (this.lastSessionBasicInfo === undefined) return;
			if (Number(this.lastSessionBasicInfo.id) === NaN) return;
			this.$socket.emit("getSessionInformationRequest", this.lastSessionBasicInfo.id);
			this.$router.push("/client/user-profile");
		}
    },
    sockets: {
        userLastSessionResponse: function(data) {
			this.lastSessionBasicInfo = data;
			this.showError = false;
		},
		userLastSessionError: function(data) {
			this.errorText = data;
			this.showError = true;
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
div {
	width: 100%;
	height: 100%;
}
</style>
