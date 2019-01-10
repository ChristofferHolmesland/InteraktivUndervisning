<template>
	<div id="app">
		<div v-if="localeLoaded">
			<b-navbar toggleable="md" type="dark" variant="info">
				<b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
				<b-navbar-brand href="#">Interaktiv Undervisning</b-navbar-brand>
				<b-collapse is-nav id="nav_collapse">
					<!-- Right aligned nav items -->
					<b-navbar-nav class="ml-auto">
						<b-nav-item-dropdown :text="locale.lang" right>
							<b-dropdown-item-button @click="localeChange" v-model="selectLocale" :id="localeItem" :key="localeItem" v-for="localeItem in localeList"  value="{{localeItem}}">{{localeItem}}</b-dropdown-item>
						</b-nav-item-dropdown>

						<b-nav-item-dropdown right v-if="loggedIn">
							<template slot="button-content">
								<em>{{locale.user}}</em>
							</template>
							<b-dropdown-item href="#">{{locale.profile}}</b-dropdown-item>
							<b-dropdown-item href="#">{{locale.signOut}}</b-dropdown-item>
						</b-nav-item-dropdown>
						<b-nav-item v-if="!loggedIn" @click="signInRedirect">{{locale.signIn}}</b-nav-item>
					</b-navbar-nav>

				</b-collapse>
			</b-navbar>
			<router-view/>
		</div>
		<div v-else>
		</div>
	</div>
</template>

<script>
//import io from 'socket.io-client';
import { dataBus } from './main';

export default {
	name: "App",
	data() {
		return {
			localeLoaded: false,
			locale: dataBus.locale["App"],
			localeList: dataBus.localeList,
			socket: dataBus.socket,
			selectLocale: "",
			user: {
				username: String, 
				loggedIn: Boolean
			},
			test: false
		}
	},
	created() {
		/*let that = this;
		setInterval(function(){
			console.log(that.locale);
			console.log(that.localeList);
			console.log(that.localeLoaded);
		}, 1000);*/
	},
	mounted() {
		let that = this;
		dataBus.$on("localeLoaded", function(){
			that.locale = dataBus.locale["App"];
			that.localeList = dataBus.localeList;
			that.localeLoaded = true;
		});
	},
	methods: {
		localeChange(event){
			this.socket.emit("getTextRequest", event.path[0].id);
		},
		signInRedirect(){
			this.$router.push("/login");
		}
	}
};
</script>