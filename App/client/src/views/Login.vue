<template>
	<b-container>
		<b-container id="LoginForm" class="vertical-center jumbotron">
			<b-row align-h="center">
				<b-col cols="5" lg="3" class="text-center mb-5">
					<b-button block size="lg" variant="primary" id="anonymousButton" @click="displayAnonymousText">{{getLocale.anonymousButton}}</b-button>
				</b-col>
				<b-col cols="1" lg="1">

				</b-col>
				<b-col cols="5" lg="3" class="text-center mb-5">
					<b-button block size="lg" variant="primary" id="feideButton" @click="displayFeideText">Feide</b-button>
				</b-col>
			</b-row>
			<b-row align-h="center" class="mb-2">
				<b-col cols="12" lg="9">
					<b-list-group style="border: 3px solid #ccc; border-radius:10px;">
						<ul>
							<b-list-group-item style="background-color:#e9ecef;" class="border-0" :key="item" v-for="item in getLoginTerms">
								<li>{{item}}</li>
							</b-list-group-item>
						</ul>
					</b-list-group>
				</b-col>
			</b-row>
			<b-row align-h="center">
				<b-col cols="12" lg="4" class="text-center">
					<b-form-checkbox v-if="feideLogin" v-model="termsApproved">{{getLocale.acceptCheckbox}}</b-form-checkbox>
					<b-form action="/login/feide" ref="submitForm" method="POST" class="align-items-center mt-4" v-if="feideLogin">
						<b-button block size="lg" :variant="getBtnType" id="loginButton" :disabled="!termsApproved" type="submit">{{getLocale.loginButton}}</b-button>
					</b-form>
					<b-button block size="lg" variant="primary" id="loginButton" type="submit" v-if="!feideLogin" @click="loginAnonymously">{{getLocale.loginButton}}</b-button>
				</b-col>
			</b-row> 
		</b-container>
	</b-container>
</template>

<script>
export default {
	name: "Login",
	data() {
		return {
			feideLogin: false,
			termsApproved: true
		};
	},
	methods: {
		displayAnonymousText() {
			this.termsApproved = true;
			this.feideLogin = false;
		},
		displayFeideText() {
			this.termsApproved = false;
			this.feideLogin = true;
		},
		loginAnonymously() {
			this.$socket.emit("loginAnonymouslyRequest");
		}
	},
	sockets: {
		loginAnonymouslyResponse() {
			this.$router.push("/client");
		}
	},
	computed: {
		getLoginTerms() {
			let locale = this.$store.getters.getLocale("LoginForm");
			if (locale)
				return this.feideLogin
					? locale.feideList
					: locale.anonymousList;
			else return {};
		},
		getLocale() {
			let locale = this.$store.getters.getLocale("LoginForm");
			if (locale) return locale;
			else return {};
		},
		getBtnType() {
			return this.termsApproved ? "primary" : "secondary";
		}
	}
};
</script>

<style scoped>
#LoginForm {
	margin-top: 2rem;
}
</style>
