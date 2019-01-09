<template>
<div id="buttons">
  <button id="anonymousButton" @click="displayAnonymousText">{{text.anonymousText}}</button>
  <button id="feideButton" @click="displayFeideText">Feide</button>
  <div class="textinformation">
    <ul :key="item" v-for="item in getLoginTerms">
      <li>{{item}}</li>
    </ul>
  </div>
  <label v-if="feideLogin"><input type=checkbox @click="termsStateChanged"/>{{text.acceptText}}</label>
  <button id="loginButton" :disabled="!termsApproved" @click="login">{{text.loginText}}</button>
</div>
</template>

<script>
import { dataBus } from "../main";
export default {
  name: "Buttons",
  data() {
    return {
      feideLogin: false,
      socket: dataBus.socket,
      text: dataBus.text.Buttons,
      termsApproved: true,
      Login: false
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
    login() {
      this.Login = !this.Login; // Delete me
      this.socket.emit("loginRequest", {loginType: this.feideLogin})
    },
    termsStateChanged() {
      this.termsApproved = !this.termsApproved;
    }
  },
  mounted() {
    this.socket.on("loginResponse", function(data){

    });
  },
  computed: {
    getLoginTerms: function() {
      return this.feideLogin ? this.text.feideList : this.text.anonymousList;
    }
  }
};
</script>
