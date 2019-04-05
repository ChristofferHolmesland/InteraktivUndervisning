<template>
	<b-container id="JoinRoom" class="jumbotron card">
		<b-row class="center margin">
			<b-col cols="12">
				<h1>{{ getTitle }}</h1>
			</b-col>
		</b-row>
		<b-row class="center margin rowMiddle">
			<b-col cols="12">
				<b-form-input v-model="sessionCode" type="text" :placeholder="getLocale.inputPlaceholder" maxlength="4"/>&nbsp;
			</b-col>
		</b-row>
		<b-row class="center">
			<b-col cols="12">
				<b-button size="lg" variant="primary" @click="quickJoin" class="btn">{{ getLocale.joinBtn }}</b-button>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
export default {
	name: "JoinSession",
	data() {
		return {
			responsetext: "",
			error: false,
			sessionCode: ""
		};
	},
	methods: {
		quickJoin() {
			let error = false;
			if (this.sessionCode.length !== 4) error = true;
			for (let n in this.sessionCode) {
				if (isNaN(Number(n)) || n === " ") {
					error = true;
				}
			}

			if (error) {
				this.$nextTick(() => {
					this.sessionCode = "";
				});

				return;
			}

			this.$socket.emit("quickJoinRoom", this.sessionCode);
		}
	},
	sockets: {
		joinSession(sessionCode) {
			this.$router.push(`/client/session/${sessionCode}`); //redirect to waiting room for clients
		},
		sessionInActive() {
			this.error = true;
			setTimeout(() => {
				this.error = false;
				this.sessionCode = "";
			}, 2000);
		}
	},
	computed: {
		getTitle() {
			if (this.error) return this.getLocale.errorTitle;
			else return this.getLocale.title;
		},
		getLocale() {
			let locale = this.$store.getters.getLocale("JoinSession");
			if (locale) return locale;
			return {};
		}
	},
	watch: {
		sessionCode: function(val, preVal) {
			if (val.length === 0) return;
			if (isNaN(Number(val)) || val[val.length - 1] === " ") {
				this.$nextTick(() => {
					this.sessionCode = preVal;
				});
			}
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
	display: flex;
	justify-content: center;
	align-items: center;
}
input {
	text-align: center;
	padding: 50px 30px;
	font-size: 20px;
	font-weight: 700;
}
</style>
