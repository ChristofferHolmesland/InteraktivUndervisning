<template>
<div id="LoginForm">
  <button id="anonymousButton" @click="displayAnonymousText">{{locale.anonymousButton}}</button>
  <button id="feideButton" @click="displayFeideText">Feide</button>
  <div class="textinformation">
    <ul :key="item" v-for="item in getLoginTerms">
      <li>{{item}}</li>
    </ul>
  </div>
  <label v-if="feideLogin"><input type=checkbox @click="termsStateChanged"/>{{locale.acceptCheckbox}}</label>
  <form action="/login/anonymous" ref="submitForm" method="POST">
    <button id="loginButton" :disabled="!termsApproved" type="submit">{{locale.loginButton}}</button>
  </form>
</div>
</template>

<script>
import { dataBus } from "../main";
import superagent from "superagent"
export default {
  name: "LoginForm",
  data() {
    return {
      feideLogin: false,
      socket: dataBus.socket,
      locale: dataBus.locale["LoginForm"],
      termsApproved: true,
      Login: false,
    };
  },
  methods: {
    displayAnonymousText() {
      this.termsApproved = true;
      this.feideLogin = false;
      this.socket.emit("loginRequest", {loginType: this.feideLogin});
    },
    displayFeideText() {
      this.termsApproved = false;
      this.feideLogin = true;
      this.socket.emit("loginRequest", {loginType: this.feideLogin});
    },
    termsStateChanged() {
      this.termsApproved = !this.termsApproved;
    }
  },
  mounted() {
    let that = this;
		dataBus.$on("localeLoaded", function(){
			that.locale = dataBus.locale["LoginForm"];
		});
    this.socket.on("loginResponse", function(data){
      that.$refs.submitForm.action = data.actionLink;
    });
  },
  computed: {
    getLoginTerms: function() {
      return this.feideLogin ? this.locale.feideList : this.locale.anonymousList;
    }
  },
  created() {
    let that = this;
		setInterval(function(){
			console.log(that.locale);
		}, 1000); 
  }
};
</script>
