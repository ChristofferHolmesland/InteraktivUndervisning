<!--
	Component name: Navbar
	Use case:
		- Lets a user navigate between the other views.
-->

<template>
	<div id="navbar">
		<b-navbar toggleable="md" type="dark" variant="info">
			<b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
			<b-navbar-brand @click="homeRedirect" style="cursor:pointer;"
				>Interaktiv Undervisning</b-navbar-brand
			>
			<b-collapse is-nav id="nav_collapse">
				<!-- Center aligned nav items -->
				<b-navbar-nav
					class="ml-auto"
					v-if="getUser.loggedIn"
					data-cy="adminOptions"
				>
					<b-nav-item center @click="clientRedirect">{{
						getLocale.dashboard
					}}</b-nav-item>

					<b-nav-item
						center
						@click="adminRedirect"
						v-if="getUser.userRights >= 3 && getUser.loggedIn"
						>{{ getLocale.admin }}</b-nav-item
					>

					<b-nav-item
						center
						@click="questionsRedirect"
						v-if="getUser.userRights >= 3 && getUser.loggedIn"
						>{{ getLocale.questions }}</b-nav-item
					>

					<b-nav-item
						center
						@click="sessionsRedirect"
						v-if="getUser.userRights >= 3 && getUser.loggedIn"
						>{{ getLocale.sessions }}</b-nav-item
					>
				</b-navbar-nav>

				<!-- Right aligned nav items -->
				<b-navbar-nav class="ml-auto">
					<b-nav-item-dropdown
						:text="getLocale.lang"
						right
						class="mr-3"
						data-cy="Language"
					>
						<b-dropdown-item-button
							@click="localeChange($event)"
							:id="localeItem"
							:key="localeItem"
							v-for="localeItem in getLocaleList"
							:value="localeItem"
							>{{ localeItem }}</b-dropdown-item-button
						>
					</b-nav-item-dropdown>

					<b-nav-item-dropdown
						right
						v-if="getUser.loggedIn"
						:text="
							getUser.userRights === 1
								? getAnonymousName
								: getUser.username
						"
						data-cy="loginButton"
					>
						<b-dropdown-item
							v-if="getUser.userRights > 1"
							@click="userProfileRedirect"
						>
							{{ getLocale.profile }}
						</b-dropdown-item>
						<b-dropdown-item @click="signOut">
							{{ getLocale.signOut }}
						</b-dropdown-item>
					</b-nav-item-dropdown>

					<b-nav-item
						v-if="!getUser.loggedIn"
						@click="signInRedirect"
						>{{ getLocale.signIn }}</b-nav-item
					>
				</b-navbar-nav>
			</b-collapse>
		</b-navbar>
	</div>
</template>

<script>
export default {
	name: "navbar",
	sockets: {
		clientLoginInfoResponse(data) {
			if (data.loggedIn) {
				this.$store.commit("userChange", data);
			}
		},
		signOutResponse() {
			this.$store.commit({
				type: "userChange",
				data: {
					username: "",
					loggedIn: false,
					userRights: 0,
					feideId: ""
				}
			});
			this.$router.push("/");
		}
	},
	methods: {
		localeChange(event) {
			let newLocale = event.target.id;
			if (newLocale == undefined || newLocale == null || newLocale == "")
				newLocale = event.target.innerHTML;

			this.$socket.emit("getLocaleRequest", newLocale);
			if (
				this.$store.getters.getUser({ userRights: true }).userRights > 1
			) {
				document.cookie = `localization=${newLocale}; Max-Age=1576800000;`;
			}
		},
		signInRedirect() {
			this.$router.push("/login");
		},
		homeRedirect() {
			this.$router.push("/");
		},
		signOut() {
			this.$socket.emit("signOutRequest");
		},
		clientRedirect() {
			this.$router.push("/client");
		},
		adminRedirect() {
			this.$router.push("/admin");
		},
		questionsRedirect() {
			this.$router.push("/admin/questions");
		},
		sessionsRedirect() {
			this.$router.push("/admin/sessions");
		},
		userProfileRedirect() {
			this.$router.push("/client/user-profile");
		}
	},
	computed: {
		getLocale() {
			let locale = this.$store.getters.getLocale("Navbar");
			if (locale) return locale;
			else return {};
		},
		getLocaleList() {
			let list = this.$store.getters.getLocaleList;
			if (list) return list;
			else return {};
		},
		getUser() {
			let user = this.$store.getters.getUser({
				username: true,
				userRights: true,
				loggedIn: true
			});
			return user;
		},
		getAnonymousName: function() {
			return `${this.getLocale.anonymous} ${
				this.getLocale.anonymousNames[this.getUser.username]
			}`;
		}
	}
};
</script>

<style scoped>
#navbar {
	margin-bottom: 3rem;
}
</style>
