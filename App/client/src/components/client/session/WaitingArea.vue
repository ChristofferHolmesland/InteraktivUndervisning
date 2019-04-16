<template>
	<div id="Waitingarea">
		<b-container>
			<b-row>
				<b-col cols="12">
					<h1>{{ getLocale.title }}</h1>
					<p>{{ getLocale.sessionId }}: {{ sessionCode }}</p>
				</b-col>
				<b-col cols="12">
					<p>{{ getWaitingAreaBody }}</p>
				</b-col>
				<b-col cols="12">
					<b-button variant="danger" @click="leaveSession">{{ getLocale.leaveSession }}</b-button>
				</b-col>
			</b-row>
		</b-container>
	</div>
</template>

<script>
export default {
	name: "Waitingarea",
	data() {
		return {
			interval: undefined,
			emptyLocaleElement: "",
			text: ""
		};
	},
	props: ["sessionCode", "localeElement"],
	created() {
		if (this.localeElement !== "sessionFinished") {
			this.interval = setInterval(() => {
				if (this.emptyLocaleElement === "...")
					this.emptyLocaleElement = "";
				else this.emptyLocaleElement += ".";
			}, 500);
		}

		this.text = this.getLocale[this.localeElement];
	},
	beforeDestroy() {
		if (this.interval !== undefined) clearInterval(this.interval);
	},
	methods: {
		leaveSession() {
			if (confirm(this.getLeaveConfirmBody())) {
				this.$router.push("/client");
			}	
		},
		getLeaveConfirmBody() {
			let locale = this.$store.getters.getLocale("ClientSessionQuestion")
					.leaveSessionBody;
			if (locale) return locale;
			else return {};
		}
	},
	computed: {
		getLocale() {
			let locale = this.$store.getters.getLocale(
				"ClientSessionWaitingArea"
			);
			if (locale) return locale;
			return {};
		},
		getWaitingAreaBody() {
			if (this.localeElement !== "sessionFinished")
				return this.text + this.emptyLocaleElement;
			else return this.text;
		}
	},
	watch: {
		localeElement: function(newElement, oldElement) {	
			if (this.newElement !== "sessionFinished") {
				if (this.interval !== undefined) clearInterval(this.interval);
				this.interval = setInterval(() => {
					if (this.emptyLocaleElement === "...")
						this.emptyLocaleElement = "";
					else this.emptyLocaleElement += ".";
				}, 500);
			}

			this.text = this.getLocale[this.localeElement];
		}
	}
};
</script>
