<template>
<div id="navbar">
	<b-navbar toggleable="md" type="dark" variant="info">
		<b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
		<b-navbar-brand @click="homeRedirect">Interaktiv Undervisning</b-navbar-brand>
		<b-collapse is-nav id="nav_collapse">

			<!-- Center aligned nav items -->
			<b-navbar-nav class="ml-auto" v-if="user.loggedIn">
				<b-nav-item center @click="clientRedirect">{{locale.dashboard}}</b-nav-item>

				<b-nav-item center v-if="user.admin == 3 && user.admin.loggedIn">Admin</b-nav-item>
			</b-navbar-nav>

			<!-- Right aligned nav items -->
			<b-navbar-nav class="ml-auto">

				<b-nav-item-dropdown :text="locale.lang" right class="mr-3">
					<b-dropdown-item-button @click="localeChange($event)" v-model="selectLocale" :id="localeItem" :key="localeItem" v-for="localeItem in localeList"  value="{{localeItem}}">{{localeItem}}</b-dropdown-item-button>
				</b-nav-item-dropdown>
				
				<b-nav-text right v-if="user.loggedIn" class="mr-3">{{user.username}}</b-nav-text>

				<b-nav-item-dropdown right v-if="user.loggedIn" :text="locale.user">
					<b-dropdown-item>{{locale.profile}}</b-dropdown-item>
					<b-dropdown-item @click="signOut">{{locale.signOut}}</b-dropdown-item>
				</b-nav-item-dropdown>

				<b-nav-item v-if="!user.loggedIn" @click="signInRedirect">{{locale.signIn}}</b-nav-item>

			</b-navbar-nav>

		</b-collapse>
	</b-navbar>
</div>
</template>

<script>
import { dataBus } from '../main.js';

export default {
	name: "navbar",
	data() {
		return {
			locale: dataBus.locale["Navbar"],
			localeList: dataBus.localeList,
			socket: dataBus.socket,
			user: {
				username: "", 
				loggedIn: false,
				admin: 0
			}
		}
	},
	created() {
		this.socket.emit("test", "test");
	},
	mounted() {
		let that = this;
		dataBus.$on("localeLoaded", function(){
			that.locale = dataBus.locale["Navbar"];
			that.localeList = dataBus.localeList;
		});

		this.socket.on("testResponse", function(data){
			console.log(test);
		});
		
		this.socket.on("loginResponse", function(data){
			if(data.loggedIn){
				that.user.username = data.username;
				that.user.loggedIn = data.loggedIn;
				that.user.admin = data.admin;
			}
		});

		this.socket.on("signOutResponse", function(){
			that.user.username = "";
			that.user.loggedIn = false;
			that.user.admin = 0;
			that.$router.push("/");
		});
	},
	methods: {
		localeChange(event){
			this.socket.emit("getLocaleRequest", event.target.id);
		},
		signInRedirect(){
			this.$router.push("/login");
		},
		homeRedirect(){
			this.$router.push("/");
		},
		signOut(){
			this.socket.emit("signOutRequest");
		},
		clientRedirect(){
			this.$router.push("/client");
		},
		adminRedirect(){
			this.$router.push("/admin");
		}
	}
};
</script>